import { renderTemplates } from './utilities/renderTemplates.js';
import { templates } from './utilities/templates.js';
import { abfalterSettingsKeys } from "./utilities/abfalterSettings.js";

export default class abfalterCombat extends Combat {
 
    async nextRound() {
        await this.resetAll();
        return super.nextRound();
    }

    /*
                await super.rollInitiative(id, {
                formula: `1d100 + ${combatant?.actor?.system.initiative.final} + ${mod}`,
                updateTurn,
                messageOptions
            });
    */
    async rollInitiative(ids, { updateTurn = false, messageOptions } = {}) {
		let openRollIniSetting = game.settings.get('abfalter', abfalterSettingsKeys.Corrected_InitiativeRoll);
		let openRollSetting = game.settings.get('abfalter', abfalterSettingsKeys.Corrected_OpenRoll);

		const mod = await openInitiativeDialog() || 0;
        if (typeof ids === 'string') ids = [ids];

        for (const id of ids) {
			const combatant = this.combatants.get(id);
			const actor = combatant?.actor;
			const baseInit = actor?.system.initiative.final ?? 0;

			// Base roll
			const roll = await new Roll("1d100").evaluate();
			const baseRoll = roll.total;

			// Open/Fumble ranges
			const fumbleRange = actor?.system.fumleRange.final ?? 3;
			let openRange = actor?.system.rollRange.final ?? 90;

			let total = baseRoll;
			let notes = `(${baseRoll})`;

			let isFumble = baseRoll <= fumbleRange;
			let hasExploded = false;
			switch (isFumble) {
				case true:
					// Handle Fumble
					let fumblePenalty = baseRoll === 1 ? -125 : baseRoll === 2 ? -100 : -75;
					total += fumblePenalty;
					notes += ` ${fumblePenalty}(Fumble Penalty)`;
					break;
				case false:
					if (!openRollIniSetting) break;
					
					if (openRollSetting) {
						const isDouble = baseRoll % 11 === 0 && baseRoll <= 99;
						let previousRoll = baseRoll;
    					let rollCount = 0;
						
						let shouldExplode = (
							baseRoll === 100 ||
							(isDouble && baseRoll >= openRange) ||
							(baseRoll >= openRange)
						);
						
						if (baseRoll >= openRange) openRange = Math.min(openRange + 1, 100);

						while (shouldExplode) {
							const extraRoll = await new Roll('1d100').evaluate();
							const rollValue = extraRoll.total;
							rollCount++;
							total += rollValue;
							notes += ` + ${rollValue}(Open Roll #${rollCount})`;
							hasExploded = true;

							const isDoubleAgain = rollValue % 11 === 0 && rollValue <= 99;

							if (rollValue >= openRange) openRange = Math.min(openRange + 1, 100);

							shouldExplode = (
								rollValue === 100 ||
								(rollValue >= openRange) ||
								(isDoubleAgain && rollValue > previousRoll)
							);

							previousRoll = rollValue;
						}
					} else {
						const isDouble = baseRoll % 11 === 0 && baseRoll <= 99;
						let previousRoll = baseRoll;
						let rollCount = 0;

						let shouldExplode = (
							baseRoll === 100 ||
							(baseRoll >= openRange) ||
							(isDouble && baseRoll > previousRoll)
						);
						if (baseRoll > openRange) openRange = Math.min(baseRoll, 100);

						while (shouldExplode) {
							const extraRoll = await new Roll('1d100').evaluate();
							const rollValue = extraRoll.total;
							rollCount++;
							total += rollValue;
							notes += ` + ${rollValue}(Open Roll #${rollCount})`;
							hasExploded = true;

							const isDoubleAgain = rollValue % 11 === 0 && rollValue <= 99;

							if (rollValue > openRange) openRange = Math.min(rollValue, 100);

							shouldExplode = (
								rollValue === 100 ||
								(rollValue > openRange) ||
								(isDoubleAgain && rollValue > previousRoll)
							);

							previousRoll = rollValue;
						}
					}
				break;
			}
			
			const finalTotal = total + baseInit + Number(mod);
			notes += ` + ${baseInit}(Base Ini) + ${mod}(Mod)`;
			
			const rollResult = {
			  label: game.i18n.localize("abfalter.initiative"),
			  result: notes,
			  total: finalTotal,
			  color: baseRoll <= fumbleRange ? "fumble" : (total > 0 ? "open-roll" : ""),
			  fumble: isFumble,
			  explode: hasExploded,
			};

			// Send message
			const rollData = [rollResult];
			const label = game.i18n.localize("abfalter.initiative");
			const template = "systems/abfalter/templates/dialogues/diceRolls/initiativeRoll.hbs";
			const content = await foundry.applications.handlebars.renderTemplate(template, { rollData, label, actor });

			const chatData = {
			  user: game.user.id,
			  speaker: ChatMessage.getSpeaker({ actor }),
			  sound: CONFIG.sounds.dice,
			  content,
			  flags: { rollData, actor },
			};

			ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
			ChatMessage.create(chatData);

			// Update initiative
			await this.setInitiative(id, finalTotal);
		}
        return this.update({ turn: 0 });
    }
}

export const openInitiativeDialog = async () => {
    return initiativeDialog({
        content: "Modifier",
        placeholder: '0'
    });
}

export const initiativeDialog = async ({ content, placeholder = '' }) => {
    const html = await renderTemplates({
        name: templates.dialog.initiative,
        context: {
            content,
            placeholder
        }
    });
    return new Promise(resolve => {
        new Dialog({
            title: 'Initiative Roller',
            content: html,
            buttons: {
                submit: {
                    label: 'Continue',
                    callback: html => {
                        const results = new FormDataExtended(html.find('form')[0], {}).object;
                        resolve(results['dialog-input']);
                    }
                }
            },
            default: 'submit',
            render: () => $('#dialog-input').focus()
        }).render(true);
    });
}
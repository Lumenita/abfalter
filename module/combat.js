import { renderTemplates } from './utilities/renderTemplates.js';
import { templates } from './utilities/templates.js';
import { abfalterSettingsKeys } from "./utilities/abfalterSettings.js";

const SYSTEM_ID = "abfalter";
const PSYCHIC_POTENTIAL_FLAG = "remainingPsychicPotential";


export default class abfalterCombat extends Combat {
 
	/**
	* Advances combat to the next round after resetting
	* all round-based actor resources.
	*/
    async nextRound() {
        const result = await super.nextRound();
        await this.resetRoundResources();
        await super.resetAll();

        return result;
    }

	/**
	* Resets all round-based resources.
	* @returns {Promise<void>}
	*/
	async resetRoundResources() {
		const updates = this.combatants
			.filter(combatant => combatant.actor)
			.map(combatant => ({
				_id: combatant.id,
				[`flags.${SYSTEM_ID}.${PSYCHIC_POTENTIAL_FLAG}`]:
					this.getMaximumPsychicPotential(combatant.actor)
			}));

		if (!updates.length) return;

		await this.updateEmbeddedDocuments("Combatant", updates);
	}

	/**
	* Returns an actor's maximum Psychic Potential.
	* @param {Actor} actor
	* @returns {number}
	*/
	getMaximumPsychicPotential(actor) {
		return Number(actor?.system.ppotential.final) || 0;
	}

	/**
	 * Finds this combat's combatant for an actor.
	 * @param {Actor} actor
	 * @returns {Combatant|null}
	 */
	getCombatantForActor(actor) {
		if (!actor) return null;
		return this.combatants.find(combatant => {
			if (actor.isToken) {
				return combatant.tokenId === actor.token?.id;
			}

			return combatant.actorId === actor.id;
		}) ?? null;
	}

	/**
	 * Returns the actor's remaining Psychic Potential.
	 *
	 * Outside combat, this returns the actor's full Potential.
	 * Inside combat, the value is stored on the Combatant.
	 * @param {Actor} actor
	 * @returns {Promise<number>}
	 */
	async getRemainingPsychicPotential(actor) {
		const maximum = this.getMaximumPsychicPotential(actor);
		const combatant = this.getCombatantForActor(actor);
		if (!combatant) return maximum

		const storedValue = combatant.getFlag(SYSTEM_ID, PSYCHIC_POTENTIAL_FLAG);
		if (storedValue !== undefined) { 
			return Number(storedValue) || 0;
		}

		await combatant.setFlag(
			SYSTEM_ID,
			PSYCHIC_POTENTIAL_FLAG,
			maximum
		);

		return maximum;
	}

	/**
	 * Spends Psychic Potential from a combatant.
	 *
	 * @param {Actor} actor
	 * @param {number} amount
	 * @returns {Promise<number>} New remaining Potential
	 */
	async spendPsychicPotential(actor, amount) {
		const combatant = this.getCombatantForActor(actor);

		/*
		 * Outside combat, Potential is not tracked.
		 */
		if (!combatant) { return this.getMaximumPsychicPotential(actor); }

		const spent = Math.max( 0, Number(amount) || 0 );
		const remaining = await this.getRemainingPsychicPotential(actor);
		if (spent > remaining) {
			throw new Error(`${actor.name} does not have enough remaining Psychic Potential.`);
		}
		const newRemaining = Math.max( 0, remaining - spent);

		await combatant.setFlag(
			SYSTEM_ID,
			PSYCHIC_POTENTIAL_FLAG,
			newRemaining
		);

		return newRemaining;
	}

	/**
	 * Restores one combatant's Psychic Potential.
	 *
	 * @param {Combatant} combatant
	 * @returns {Promise<void>}
	 */
	async resetPsychicPotential(combatant) {
		const actor = combatant?.actor;
		if (!actor) {
			throw new Error("The selected combatant does not have an actor.");
		}

		const maximumPotential = this.getMaximumPsychicPotential(actor);
		await combatant.setFlag(SYSTEM_ID, PSYCHIC_POTENTIAL_FLAG, maximumPotential);

		return maximumPotential;
	}

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

			ChatMessage.applyMode(chatData, game.settings.get("core", "messageMode"));
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
        name: templates.initiative,
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
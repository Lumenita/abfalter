import { renderTemplates } from './utilities/renderTemplates.js';
import { templates } from './utilities/templates.js';
import { abfalterSettingsKeys } from "./utilities/abfalterSettings.js";
import { kiAccumulate, kiRemoveMaint  } from "./helpers/actorFunctions.js";

import { genericDialogs } from './dialogs.js';


const SYSTEM_ID = "abfalter";
const PSYCHIC_POTENTIAL_FLAG = "remainingPsychicPotential";
const KI_ACCUMULATION_ROUND_FLAG = "kiAccumulationRound";
const KI_CAST_ROUND_FLAG = "kiCastRound";


export default class abfalterCombat extends Combat {
 
	/**
	* Advances combat to the next round after resetting
	* all round-based actor resources.
	*/
    async nextRound() {
        const result = await super.nextRound();
    	await this.resetRoundKi();
		await this.removeKiMaintenance();
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

	/**
	 * Automatic Ki Accu Handler
	 * 
	 * @param {Actor} actor 
	 * @param {combatant} combatant 
	 * @param {String} param2 Ki amount & if NPC
	 * @returns 
	 */
	async processAutomaticKi(actor, combatant, { kiAmount = null, removeHalf = false, bulk = false } = {}) {
		if (!actor?.system.toggles?.automaticKi || actor?.system.toggles?.accumulatingKi !== true) return;

		const round = Math.max(Number(this.round) || 0, 1);
		const processedRound = Number(combatant.getFlag(SYSTEM_ID, KI_ACCUMULATION_ROUND_FLAG));
		if (processedRound === round) return;

		const setting = actor.system.settings?.alwaysFullKiAccu ?? "query";
		let amount;

		if (bulk) {
			amount = setting === "alwaysFull" ? "full" : "half";
		} else {
			if (setting === "alwaysFull") amount = "full";
			else if (setting === "alwaysHalf") amount = "half";
			else amount = kiAmount;
		}

		if (!amount) return;

		if (!bulk && setting === "query" && removeHalf)
			await kiAccumulate(actor, "removeHalf");

		await kiAccumulate(actor, amount);
		await combatant.setFlag(SYSTEM_ID, KI_ACCUMULATION_ROUND_FLAG, round);
	}

	async resetRoundKi() {
		const previousRound = (Number(this.round) || 0) - 1;
		const attributes = ["agi", "con", "dex", "str", "pow", "wp"];

		for (const combatant of this.combatants) {
			const actor = combatant.actor;
			if (!actor) continue;

			// If a technique was cast last round, clear accumulated Ki.
			const castRound = Number(combatant.getFlag(SYSTEM_ID, KI_CAST_ROUND_FLAG));
			if (castRound === previousRound) {
				const updateData = {};
				for (const attr of attributes)
					updateData[`system.kiPool.${attr}.current`] = 0;

				await actor.update(updateData);
			}

			// Turn off active techniques which are not maintained.
			const techniqueUpdates = actor.items
				.filter(item =>
					item.type === "kiTechnique" &&
					item.system.active &&
					!item.system.maintBool
				)
				.map(item => ({
					_id: item.id,
					"system.active": false
				}));

			if (techniqueUpdates.length)
				await actor.updateEmbeddedDocuments("Item", techniqueUpdates);
		}
	}

	async removeKiMaintenance() {
		for (const combatant of this.combatants) {
			if (combatant.actor) await kiRemoveMaint(combatant.actor);
		}
	}

	/**
	 * Initiative Roll and Rules
	 */
	async rollAll(options = {}) {
		return super.rollAll({ ...options, abfalterBulkRoll: true });
	}

	async rollNPC(options = {}) {
		return super.rollNPC({ ...options, abfalterBulkRoll: true });
	}

	async rollInitiative(ids, { updateTurn = false, messageOptions, abfalterBulkRoll  = false } = {}) {
		const correctedInitiative = game.settings.get("abfalter", abfalterSettingsKeys.Corrected_InitiativeRoll); 
		const correctedOpenRoll = game.settings.get("abfalter", abfalterSettingsKeys.Corrected_OpenRoll);

		if (typeof ids === "string") ids = [ids];

		for (const id of ids) {
			const combatant = this.combatants.get(id);
			const actor = combatant?.actor;
			if (!actor) continue;

			let dialogResult = {
				mod: 0,
				kiAmount: null,
				removeHalf: false
			};

			if (!abfalterBulkRoll) {
				const round = Math.max(Number(this.round) || 0, 1);
				const processedRound = Number(
					combatant.getFlag(SYSTEM_ID, KI_ACCUMULATION_ROUND_FLAG)
				);

				const kiAlreadyProcessed = processedRound === round;

				dialogResult = await openInitiativeDialog(actor, kiAlreadyProcessed);
				if (!dialogResult) continue;
			}

			await this.processAutomaticKi(actor, combatant, {
				kiAmount: dialogResult.kiAmount,
				removeHalf: dialogResult.removeHalf,
				bulk: abfalterBulkRoll
			});

			const mod = Number(dialogResult.mod) || 0;
			const baseInit = actor.system.initiative.final ?? 0;

			const roll = await new Roll("1d100").evaluate();
			const baseRoll = roll.total;
			const fumbleRange = actor.system.fumleRange.final ?? 3;
			let openRange = actor.system.rollRange.final ?? 90;

			let total = baseRoll;
			let notes = `(${baseRoll})`;
			const isFumble = baseRoll <= fumbleRange;
			let hasExploded = false;

			if (isFumble) {
				const penalty = baseRoll === 1 ? -125 : baseRoll === 2 ? -100 : -75;
				total += penalty;
				notes += ` ${penalty}(Fumble Penalty)`;
			} else if (correctedInitiative) {
				const isDouble = baseRoll % 11 === 0 && baseRoll <= 99;
				let previousRoll = baseRoll;
				let rollCount = 0;
				const rollLimit = actor.system.rollRange.limits;
				rollLimit == "unlucky";

				let shouldExplode = rollLimit !== "unlucky" && (
					correctedOpenRoll
						? baseRoll === 100 || baseRoll >= openRange || (isDouble && baseRoll >= openRange)
						: baseRoll === 100 || baseRoll >= openRange || (isDouble && baseRoll > previousRoll)
				);

				if (correctedOpenRoll) {
					if (baseRoll >= openRange) openRange = Math.min(openRange + 1, 100);
				} else {
					if (baseRoll > openRange) openRange = Math.min(baseRoll, 100);
				}

				while (shouldExplode) {
					const extraRoll = await new Roll("1d100").evaluate();
					const rollValue = extraRoll.total;
					const isDoubleAgain = rollValue % 11 === 0 && rollValue <= 99;

					rollCount++;
					total += rollValue;
					notes += ` + ${rollValue}(Open Roll #${rollCount})`;
					hasExploded = true;

					if (correctedOpenRoll) {
						if (rollValue >= openRange) openRange = Math.min(openRange + 1, 100);

						shouldExplode =
							rollValue === 100 ||
							rollValue >= openRange ||
							(isDoubleAgain && rollValue > previousRoll);
					} else {
						if (rollValue > openRange) openRange = Math.min(rollValue, 100);
						shouldExplode =
							rollValue === 100 ||
							rollValue > openRange ||
							(isDoubleAgain && rollValue > previousRoll);
					}

					previousRoll = rollValue;
				}
			}

			const finalTotal = total + baseInit + mod;
			notes += ` + ${baseInit}(Base Ini) + ${mod}(Mod)`;

			const rollResult = {
				label: game.i18n.localize("abfalter.initiative"),
				result: notes,
				total: finalTotal,
				color: isFumble ? "fumble" : (hasExploded ? "open-roll" : ""),
				fumble: isFumble,
				explode: hasExploded
			};

			const rollData = [rollResult];
			const label = game.i18n.localize("abfalter.initiative");
			const content = await foundry.applications.handlebars.renderTemplate(
				"systems/abfalter/templates/dialogues/diceRolls/initiativeRoll.hbs",
				{ rollData, label, actor }
			);

			const chatData = {
				user: game.user.id,
				speaker: ChatMessage.getSpeaker({ actor }),
				sound: CONFIG.sounds.dice,
				content,
				flags: { rollData, actor }
			};

			ChatMessage.applyMode(chatData, game.settings.get("core", "messageMode"));
			await ChatMessage.create(chatData);
			await this.setInitiative(id, finalTotal);
		}

		return this.update({ turn: 0 });
	}
}

export const openInitiativeDialog = (actor, kiAlreadyProcessed = false) => {
    const automaticKi = actor?.system.toggles?.automaticKi ?? false;
	const accumulatingKi = actor?.system.toggles?.accumulatingKi === true;
    const setting = actor?.system.settings?.alwaysFullKiAccu ?? "query";

    return initiativeDialog({
        content: "Modifier",
        placeholder: "0",
		showKiOptions: automaticKi && accumulatingKi && setting === "query" && !kiAlreadyProcessed
    });
};

export const initiativeDialog = async ({ content, placeholder = "", showKiOptions = false }) => {
    const html = await renderTemplates({
        name: templates.initiative,
        context: { content, placeholder, showKiOptions }
    });

    return new Promise(resolve => {
        let done = false;
        const finish = value => {
            if (done) return;
            done = true;
            resolve(value);
        };

        class InitiativeDialogV2 extends foundry.applications.api.DialogV2 {
            async _onRender(context, options) {
                await super._onRender(context, options);
                this.element?.querySelector("#dialog-input")?.focus();
            }
        }

        const dlg = new InitiativeDialogV2({
            window: { title: "Initiative Roller" },
            position: { width: 400 },
            classes: ["baseAbfalterV2", "initiativeDialog"],
            content: html,
            buttons: [
                {
                    action: "submit",
                    label: "Continue",
                    default: true,
                    callback: (event, button) => {
                        const form = button.form;
                        finish({
                            mod: Number(form.elements["dialog-input"]?.value) || 0,
                            kiAmount: showKiOptions
                                ? form.elements.kiAmount?.value ?? "full"
                                : null,
                            removeHalf: showKiOptions
                                ? form.elements.removeHalf?.checked ?? false
                                : false
                        });
                    }
                },
                {
                    action: "cancel",
                    label: game.i18n.localize("abfalter.dialogs.cancel"),
                    callback: () => finish(null)
                }
            ]
        });

        const originalClose = dlg.close.bind(dlg);
        dlg.close = async (...args) => {
            finish(null);
            return originalClose(...args);
        };

        dlg.render(true);
    });
};
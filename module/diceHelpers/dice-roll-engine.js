import { abfalterSettingsKeys } from "../utilities/abfalterSettings.js";

/** Resolve the correct synthetic actor for an unlinked token when available. */
export function getRollActor(msg) {
    return ChatMessage.getSpeakerActor?.(msg.speaker)
        ?? canvas?.tokens?.get(msg.speaker?.token)?.actor
        ?? game.actors.get(msg.speaker?.actor);
}

/** Creates the initial roll.
 * @param {Actor} actor - The actor using the weapon.
 * @param {Number} bonus - All additional bonuses for the roll in one value.
 * @param {Number} openRange - The open-roll range.
 * @param {Number} fumbleRange - The fumble range.
 */
export async function createRoll(actor, bonus, openRange, fumbleRange, isPredetermined) {
    let rollResult;
    if (isPredetermined) {
        rollResult = await Roll.create("@bonus", { bonus: bonus }).evaluate();
        rollResult.rolledDice = 0;
        rollResult.color = "normalRoll";
        rollResult.fumble = false;
        rollResult.explode = false;
        return rollResult;
    }

    rollResult = await Roll.create("1d100 + @bonus", { bonus: bonus }).evaluate();
    rollResult.rolledDice = rollResult.dice[0].results[0].result;

    const doubleValues = [11, 22, 33, 44, 55, 66, 77, 88];
    const isDouble = actor.system.rollRange.doubles === true && doubleValues.includes(rollResult.rolledDice);
    rollResult.doubles = isDouble;
    rollResult.color = "";
    rollResult.fumbleLevel = 0;
    rollResult.fumble = false;
    rollResult.explode = false;

    if (rollResult.rolledDice <= fumbleRange) {
        rollResult.color = "fumbleRoll";
        rollResult.fumble = true;
        while (fumbleRange > rollResult.rolledDice) {
            rollResult.fumbleLevel += 15;
            fumbleRange--;
        }
    } else if (rollResult.rolledDice >= openRange || isDouble) {
        rollResult.color = "openRoll";
        rollResult.explode = true;
        if (!isDouble || rollResult.rolledDice > openRange) {
            openRange = rollResult.rolledDice;
        }
    } else {
        rollResult.color = "normalRoll";
    }
    const rollLimit = actor.system.rollRange.limits;
    if (rollLimit == "unlucky") {
        rollResult.color = "normalRoll";
        rollResult.explode = false;
    }
    let openRollSetting = game.settings.get('abfalter', abfalterSettingsKeys.Corrected_OpenRoll);
    rollResult.openRange = openRollSetting ? actor.system.rollRange.final : openRange;

    return rollResult;
}

/** Core Rules for Open Rolls, Open Roll Range + 1.
 * @param {Actor} actor - The actor using the weapon.
 * @param {Number} bonus - All additional bonuses for the roll in one value.
 * @param {Number} previousRange - The previous open roll range
 * @param {Number} rollNum - The number of open rolls.
 */
export async function coreOpenRoll(actor, bonus, previousRange, rollNum) {
    let rollResult;
    rollResult = await Roll.create("1d100 + @bonus", { bonus: bonus }).evaluate();
    rollResult.rolledDice = rollResult.dice[0].results[0].result;

    const doubleValues = [11, 22, 33, 44, 55, 66, 77, 88];
    const isDouble = actor.system.rollRange.doubles === true && doubleValues.includes(rollResult.rolledDice);
    rollResult.color = "";
    rollResult.explode = false;

    //Core Open Roll Logic
    rollResult.openRange = previousRange + 1;
    const meetsOpenThreshold = rollResult.rolledDice >= rollResult.openRange;
    if (meetsOpenThreshold || isDouble) {
        rollResult.color = "openRoll";
        rollResult.explode = true;
    } else {
        rollResult.color = "normalRoll";
        rollResult.explode = false;
    }

    const rollLimit = actor.system.rollRange.limits; //none, single, double, triple
    const limitMap = {
        none: 0,
        single: 1,
        double: 2,
        triple: 3
    };
    const limitNum = limitMap[rollLimit] ?? 0;
    if (limitNum == rollNum) {
        rollResult.color = "normalRoll";
        rollResult.explode = false;
    }

    return rollResult;
}

/** Luminita's Open Roll Rules (higher than prior).
 * @param {Actor} actor - The actor using the weapon.
 * @param {Number} bonus - All additional bonuses for the roll in one value.
 * @param {Number} previousRange - The previous open roll range
 * @param {Number} previousRoll - The previous roll total.
 * @param {Number} rollNum - The number of open rolls.
 */
export async function lumiOpenRoll(actor, bonus, previousRange, previousRoll, rollNum) {
    let rollResult;
    rollResult = await Roll.create("1d100 + @bonus", { bonus: bonus }).evaluate();
    rollResult.rolledDice = rollResult.dice[0].results[0].result;

    const doubleValues = [11, 22, 33, 44, 55, 66, 77, 88];
    const isDouble = actor.system.rollRange.doubles === true && doubleValues.includes(rollResult.rolledDice);
    rollResult.color = "";
    rollResult.explode = false;

    const isGreaterThanPrevious = rollResult.rolledDice > previousRoll;
    const isGreaterThanOpen = rollResult.rolledDice > previousRange;

    if(rollResult.rolledDice === 100) {
        rollResult.color = "openRoll";
        rollResult.explode = true;
        rollResult.openRange = 100;
    } else if (isDouble && isGreaterThanPrevious) {
        rollResult.color = "openRoll";
        rollResult.explode = true;
        rollResult.openRange = previousRange;
        if (isGreaterThanOpen) rollResult.openRange = rollResult.rolledDice;
    } else if (isGreaterThanOpen) {
        rollResult.color = "openRoll";
        rollResult.explode = true;
        rollResult.openRange = rollResult.rolledDice;
    } else {
        rollResult.color = "normalRoll";
        rollResult.explode = false;
    }

    const rollLimit = actor.system.rollRange.limits; //none, single, double, triple
    const limitMap = {
        none: 0,
        single: 1,
        double: 2,
        triple: 3
    };
    const limitNum = limitMap[rollLimit] ?? 0;
    if (limitNum == rollNum) {
        rollResult.color = "normalRoll";
        rollResult.explode = false;
    }

    return rollResult;
}

/** Performs the shared open-roll logic and creates the next rollData entry.
 * @param {ChatMessage} msg
 * @returns {Promise<{
 *   actor: Actor,
 *   num: number,
 *   oldData: object,
 *   rollData: object[],
 *   rollResult: object
 * }>}
 */
export async function performOpenRoll(msg) {
    const actor = getRollActor(msg);

    if (!actor) {
        throw new Error(`Could not find actor for open roll: ${msg.speaker.actor}`);
    }

    const flags = msg.flags?.abfalter;
    const currentNum = flags?.num;
    const currentRollData = flags?.rollData;

    if (!Array.isArray(currentRollData)) { throw new Error("Open roll message does not contain valid rollData.");}
    const oldData = currentRollData[currentNum];

    if (!oldData) {
        throw new Error(`Could not find rollData entry at index ${currentNum}.`);
    }

    const correctedOpenRoll = game.settings.get("abfalter",abfalterSettingsKeys.Corrected_OpenRoll);
    const nextNum = currentNum + 1;
    const rollResult = correctedOpenRoll
        ? await coreOpenRoll(
            actor,
            oldData.total,
            oldData.openRange,
            nextNum
        )
        : await lumiOpenRoll(
            actor,
            oldData.total,
            oldData.openRange,
            oldData.roll,
            nextNum
        );

    const rollData = foundry.utils.deepClone(currentRollData);

    rollData[currentNum] = {
        ...rollData[currentNum],
        doubles: null,
        openRange: null,
        explode: false
    };

    rollData[nextNum] = {
        roll: rollResult.rolledDice,
        total: rollResult._total,
        doubles: oldData.doubles,
        openRange: rollResult.openRange,
        label: `${game.i18n.localize("abfalter.openRoll")} #${nextNum}`,
        explode: rollResult.explode,
        formula:
            `(${rollResult.rolledDice}) + ` +
            `${oldData.total} (${game.i18n.localize("abfalter.prevRoll")})`,
        color: rollResult.color
    };

    return {
        actor,
        num: nextNum,
        oldData,
        rollData,
        rollResult
    };
}

/**Performs the shared fumble-roll logic and creates the next rollData entry.
 * @param {ChatMessage} msg
 * @returns {Promise<{
 *   actor: Actor,
 *   num: number,
 *   oldData: object,
 *   rollData: object[],
 *   rollResult: Roll,
 *   fumbleSeverity: number
 * }>}
 */
export async function performFumbleRoll(msg) {
    const actor = getRollActor(msg);

    if (!actor) {
        throw new Error(`Could not find actor for fumble roll: ${msg.speaker.actor}`);
    }
    const flags = msg.flags?.abfalter;
    const currentNum = flags?.num;
    const currentRollData = flags?.rollData;

    if (!Array.isArray(currentRollData)) {
        throw new Error("Fumble roll message does not contain valid rollData.");
    }
    const oldData = currentRollData[currentNum];
    if (!oldData) {
        throw new Error(`Could not find rollData entry at index ${currentNum}.`);
    }

    const correctedFumble = game.settings.get("abfalter", abfalterSettingsKeys.Corrected_Fumble);
    const baseDice = "1d100";
    const rollFormula = correctedFumble
        ? `${oldData.total} - ${baseDice}`
        : `${oldData.total} - ${baseDice} - ${oldData.fumbleLevel}`;
    const rollResult = await new Roll(rollFormula).roll();

    const rolledDice = rollResult.total - oldData.total + (correctedFumble ? 0 : oldData.fumbleLevel);
    const fumbleSeverity = oldData.fumbleLevel - rolledDice;
    const previousRollLabel = game.i18n.localize("abfalter.prevRoll");
    const rollLabel = game.i18n.localize("abfalter.roll");

    const fumbleLevelLabel = game.i18n.localize("abfalter.fumbleLevel");
    const formula = correctedFumble
        ? `${oldData.total} (${previousRollLabel}) ` +
          `+ ${rolledDice} (${rollLabel})`
        : `${oldData.total} (${previousRollLabel}) ` +
          `+ ${rolledDice} (${rollLabel}) ` +
          `- ${oldData.fumbleLevel} (${fumbleLevelLabel})`;
    const rollData = foundry.utils.deepClone(currentRollData);

    rollData[currentNum] = {
        ...rollData[currentNum],
        doubles: null,
        openRange: null,
        explode: false,
        fumble: false
    };

    const nextNum = currentNum + 1;

    rollData[nextNum] = {
        roll: rolledDice,
        total: rollResult.total,
        doubles: null,
        openRange: null,
        label: game.i18n.localize(
            "abfalter.fumbleResult"
        ),
        explode: false,
        formula,
        color: "fumbleRoll",
        showSeverity: true,
        fumble: false,
        fumbleS: fumbleSeverity
    };

    return {
        actor,
        num: nextNum,
        oldData,
        rollData,
        rollResult,
        fumbleSeverity
    };
}


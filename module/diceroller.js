import { abfalterSettingsKeys } from "./utilities/abfalterSettings.js";

const diceDialog = class extends Dialog {
    activateListeners(html) {
        super.activateListeners(html);
        html.find('.collapsable').click(ev => {
            const li = $(ev.currentTarget).next();
            li.toggle("fast");
        });
    }
}

export async function openModifierDialogue(actorData, finalValue, label, type, complex) {
    const gameCopy = game;
    
    const template = "systems/abfalter/templates/dialogues/basicModifiers.html";
    let confirmed = false;
    let fatMod = false;
    if (type == "resRoll" || type == "potentialRoll" || type == "summoningRoll" || type == "breakageRoll") {
        fatMod = true;
    }

    const html = await renderTemplate(template, { fatMod: fatMod });
    new diceDialog({
        title: gameCopy.i18n.localize('abfalter.dialogs.diceRoller'),
        content: html,
        buttons: {
            roll: { label: gameCopy.i18n.localize('abfalter.dialogs.roll'), callback: () => confirmed = true },
            cancel: { label: gameCopy.i18n.localize('abfalter.dialogs.cancel'), callback: () => confirmed = false }
        },
        close: html => {
            if (confirmed) {
                switch (type) {
                    case "characteristicRoll":
                        rollCharacteristic(html, actorData, finalValue, label);
                        break;
                    case "secondaryRoll":
                    case "potentialRoll":
                    case "summoningRoll":
                    case "combatRoll":
                        abilityRoll(html, actorData, finalValue, label);
                        break;
                    case "weaponCombatRoll":
                        rollCombatWeapon(html, actorData, finalValue, label, complex);
                        break;
                    case "resRoll":
                        rollResistance(html, actorData, finalValue, label);
                        break;
                    case 'breakageRoll':
                        rollBreakage(html, actorData, finalValue, label);
                        break;
                    default:
                        console.log("No Roll Function Implemented for this type");
                        break;
                }
            }
        }
    }).render(true);
}

export async function rollCharacteristic(html, actorData, finalValue, label) {
    let fatigueMod = parseInt(html.find('#fatiguemod').val()) || 0;
    let mod = parseInt(html.find('#modifiermod').val()) || 0;

    let baseDice = "1d10";
    let rollFormula = `${baseDice} + ${finalValue} + ${fatigueMod} + ${mod}`;
    let rollResult = await new Roll(rollFormula, actorData).roll();
    rollResult.rolledDice = rollResult.total - finalValue - fatigueMod - mod;
    let roll = parseInt(rollResult.total);

    rollResult.color = "";
    rollResult.fumble = false;
    rollResult.explode = false;
    if (rollResult.rolledDice == 1) {
        rollResult.color = "fumbleRoll";
        rollResult.newTotal = roll - 3;
        rollResult.fumble = true;
    } else if (rollResult.rolledDice == 10) {
        rollResult.color = "openRoll";
        rollResult.newTotal = roll + 2;
        rollResult.explode = true;
    } else {
        rollResult.color = "normalRoll";
        rollResult.newTotal = roll;
    }

    const template = "systems/abfalter/templates/dialogues/chaRoll.html"
    const content = await renderTemplate(template, { rollResult: rollResult, label: label });
    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actorData: actorData }),
        sound: CONFIG.sounds.dice,
        content: content
    };
    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
    ChatMessage.create(chatData);
}

async function abilityRoll(html, actorData, finalValue, label) {
    let fatigueMod = parseInt(html.find('#fatiguemod').val()) || 0;
    let mod = parseInt(html.find('#modifiermod').val()) || 0;
    let fatigueFinal = Math.floor(fatigueMod * 15);
    let baseDice = "1d100";
    let rollFormula = `${baseDice} + ${finalValue} + ${fatigueFinal} + ${mod}`
    const rollResult = await new Roll(rollFormula, actorData).roll();
    rollResult.rolledDice = rollResult.total - finalValue - fatigueFinal - mod;

    let fumbleRange = actorData.system.fumleRange.final;  
    if (finalValue > 199 && fumbleRange > 1) {
        fumbleRange -= 1;
    }
    rollResult.color = "";
    rollResult.fumbleLevel = 0;
    rollResult.fumble = false;
    rollResult.explode = false;
    rollResult.doubles = false;
    rollResult.openRange = actorData.system.rollRange.final;

    if (rollResult.rolledDice <= fumbleRange) {
        rollResult.color = "fumbleRoll";
        rollResult.fumble = true;
        while (fumbleRange > rollResult.rolledDice) {
            rollResult.fumbleLevel += 15;
            fumbleRange--;
        }
    } else if (rollResult.rolledDice >= actorData.system.rollRange.final) {
        rollResult.color = "openRoll";
        rollResult.explode = true;
    } else {
        rollResult.color = "normalRoll";
    }
    if (actorData.system.rollRange.doubles === true) {
        rollResult.doubles = true;
        let doubleValues = [11, 22, 33, 44, 55, 66, 77, 88];
        if (doubleValues.includes(rollResult.rolledDice)) {
            rollResult.color = "openRoll";
            rollResult.explode = true;
        }
    }

    let num = 0;
    const rollData = [];
    rollData[0] = {
        roll: rollResult.rolledDice, total: rollResult._total, doubles: rollResult.doubles, openRange: rollResult.openRange, label: label, fumbleLevel: rollResult.fumbleLevel,
        fumble: rollResult.fumble, explode: rollResult.explode, result: rollResult.result, color: rollResult.color
    };
    const template = "systems/abfalter/templates/dialogues/abilityRoll.hbs"
    const content = await renderTemplate(template, { rollData: rollData, label: label, actor: actorData });
    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actorData: actorData }),
        sound: CONFIG.sounds.dice,
        content: content,
        rolls: [rollResult],
        flags: { rollData, actorData, num }
    };
    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
    ChatMessage.create(chatData);
}

async function rollCombatWeapon(html, actorData, finalValue, label, complex) {
    let fatigueMod = parseInt(html.find('#fatiguemod').val()) || 0;
    let mod = parseInt(html.find('#modifiermod').val()) || 0;
    let fatigueFinal = Math.floor(fatigueMod * 15);
    let baseDice = "1d100";
    let rollFormula = `${baseDice} + ${finalValue} + ${fatigueFinal} + ${mod}`
    const rollResult = await new Roll(rollFormula, actorData).roll();
    rollResult.rolledDice = rollResult.total - finalValue - fatigueFinal - mod;

    let fumbleRange = actorData.system.fumleRange.final;
    if (complex == "true") {
        fumbleRange += 2;
    }
    if (finalValue > 199 && fumbleRange > 1) {
        fumbleRange -= 1;
    }

    rollResult.color = "";
    rollResult.fumbleLevel = 0;
    rollResult.fumble = false;
    rollResult.explode = false;
    rollResult.doubles = false;
    rollResult.openRange = actorData.system.rollRange.final;

    if (rollResult.rolledDice <= fumbleRange) {
        rollResult.color = "fumbleRoll";
        rollResult.fumble = true;
        while (fumbleRange > rollResult.rolledDice) {
            rollResult.fumbleLevel += 15;
            fumbleRange--;
        }
    } else if (rollResult.rolledDice >= actorData.system.rollRange.final) {
        rollResult.color = "openRoll";
        rollResult.explode = true;
    } else {
        rollResult.color = "normalRoll";
    }
    if (actorData.system.rollRange.doubles === true) {
        rollResult.doubles = true;
        let doubleValues = [11, 22, 33, 44, 55, 66, 77, 88];
        if (doubleValues.includes(rollResult.rolledDice)) {
            rollResult.color = "openRoll";
            rollResult.explode = true;
        }
    }

    let num = 0;
    const rollData = [];
    rollData[0] = {
        roll: rollResult.rolledDice, total: rollResult._total, doubles: rollResult.doubles, openRange: rollResult.openRange, label: label, fumbleLevel: rollResult.fumbleLevel,
        fumble: rollResult.fumble, explode: rollResult.explode, result: rollResult.result, color: rollResult.color
    };
    const template = "systems/abfalter/templates/dialogues/abilityRoll.hbs"
    const content = await renderTemplate(template, { rollData: rollData, label: label, actor: actorData });
    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actorData: actorData }),
        sound: CONFIG.sounds.dice,
        content: content,
        rolls: [rollResult],
        flags: { rollData, actorData, num }
    };
    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
    ChatMessage.create(chatData);
}

export async function openRollFunction(msg) {
    let actorData = msg.flags.actorData;
    let num = msg.flags.num;
    let oldData = msg.flags.rollData[num];
    let baseDice = "1d100";
    let rollFormula = `${baseDice} + ${oldData.total}`
    let rollResult = await new Roll(rollFormula).roll();

    rollResult.rolledDice = rollResult.total - oldData.total;
    rollResult.openRange = oldData.openRange;
    rollResult.color = "normalRoll";
    let isDouble = rollResult.rolledDice % 11 === 0 && rollResult.rolledDice <= 88;
    if (rollResult.rolledDice > oldData.roll) {

        if (oldData.doubles === true) {
            if (isDouble === true) {
                rollResult.color = "openRoll";
                rollResult.explode = true;
            } else if (rollResult.rolledDice >= rollResult.openRange) {
                rollResult.color = "openRoll";
                rollResult.explode = true;
            }
        } else {
            if (rollResult.rolledDice >= rollResult.openRange) {
                rollResult.color = "openRoll";
                rollResult.explode = true;
            }
        }
    } else {
        rollResult.color = "normalRoll";
    }

    msg.flags.rollData[num] = {
        roll: oldData.rolledDice, total: oldData.total, doubles: null, openRange: null, label: oldData.label,
        explode: false, result: oldData.result, color: oldData.color
    };
    num = num + 1;
    msg.flags.rollData[num] = {
        roll: rollResult.rolledDice, total: rollResult._total, doubles: oldData.doubles, openRange: oldData.openRange, label: oldData.label,
        explode: rollResult.explode, result: rollResult.result, color: rollResult.color
    };

    const rollData = msg.flags.rollData;
    const template = "systems/abfalter/templates/dialogues/abilityRoll.hbs"
    const content = await renderTemplate(template, { rollData: msg.flags.rollData, actor: actorData });
    game.messages.get(msg._id).update({
        content: content,
        flags: { rollData, num}
    });
}

export async function fumbleRollFunction(msg) {
    let fumbleSettings = game.settings.get('abfalter', abfalterSettingsKeys.Corrected_Fumble);
    let actorData = msg.flags.actorData;
    let num = msg.flags.num;
    let oldData = msg.flags.rollData[num];

    let baseDice = "1d100";
    let rollFormula = ``;

    if (fumbleSettings == true) {
        rollFormula = `${oldData.total} - ${baseDice}`;
    } else {
        rollFormula = `${oldData.total} - ${baseDice} - ${oldData.fumbleLevel}`;
    };
    let rollResult = await new Roll(rollFormula).roll();
    rollResult.rolledDice = rollResult.total - oldData.total;

    msg.flags.rollData[num] = {
        roll: oldData.rolledDice, total: oldData.total, label: oldData.label,
        explode: false, result: oldData.result, color: oldData.color, fumble: false
    };
    num = num + 1;
    msg.flags.rollData[num] = {
        roll: rollResult.rolledDice, total: rollResult._total, label: oldData.label,
         result: rollResult.result, color: oldData.color, showSeverity: true
    };

    const rollData = msg.flags.rollData;
    const template = "systems/abfalter/templates/dialogues/abilityRoll.hbs"
    const content = await renderTemplate(template, { rollData: msg.flags.rollData, actor: actorData });
    game.messages.get(msg._id).update({
        content: content,
        flags: { rollData, num }
    });
}


export async function rollResistance(html, actorData, finalValue, label) {
    let mod = parseInt(html.find('#modifiermod').val()) || 0;

    let baseDice = "1d100";
    let rollFormula = `${baseDice} + ${finalValue} + ${mod}`;
    let rollResult = await new Roll(rollFormula, actorData).roll();
    rollResult.rolledDice = rollResult.total - finalValue - mod;

    rollResult.color = "";
    rollResult.fumble = false;
    rollResult.explode = false;
    if (rollResult.rolledDice == 1) {
        rollResult.color = "fumbleRoll";
        rollResult.fumble = true;
    } else if (rollResult.rolledDice == 100) {
        rollResult.color = "openRoll";
        rollResult.explode = true;
    } else {
        rollResult.color = "normalRoll";
    }

    const template = "systems/abfalter/templates/dialogues/resRoll.html"
    const content = await renderTemplate(template, { rollResult: rollResult, label: label });
    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actorData: actorData }),
        sound: CONFIG.sounds.dice,
        content,
    };
    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
    ChatMessage.create(chatData);
}

export async function rollBreakage(html, actorData, finalValue, label) {
    let mod = parseInt(html.find('#modifiermod').val()) || 0;

    let baseDice = "1d10";
    let rollFormula = `${baseDice} + ${finalValue} + ${mod}`;
    let rollResult = await new Roll(rollFormula, actorData).roll();
    rollResult.rolledDice = rollResult.total - finalValue - mod;

    const template = "systems/abfalter/templates/dialogues/breakRoll.html"
    const content = await renderTemplate(template, { rollResult: rollResult, label: label });
    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actorData: actorData }),
        sound: CONFIG.sounds.dice,
        content: content
    };
    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
    ChatMessage.create(chatData);
}
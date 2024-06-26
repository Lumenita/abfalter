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
                        rollSecondary(html, actorData, finalValue, label);
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



async function rollSecondary(html, actorData, finalValue, label) {
    let fatigueMod = parseInt(html.find('#fatiguemod').val()) || 0;
    let mod = parseInt(html.find('#modifiermod').val()) || 0;
    let fatigueFinal = Math.floor(fatigueMod * 15);
    let baseDice = "1d100";
    let rollFormula = `${baseDice} + ${finalValue} + ${fatigueFinal} + ${mod}`
    const rollResult = await new Roll(rollFormula, actorData).roll();
    rollResult.rolledDice = rollResult.total - finalValue - fatigueFinal - mod;

    let fumbleRange = actorData.system.fumbleRangeFinal;

   
    if (finalValue > 199 && fumbleRange > 1) {
        fumbleRange -= 1;
    }

    rollResult.color = "";
    rollResult.fumbleLevel = 0;
    rollResult.fumble = false;
    rollResult.explode = false;
    rollResult.doubles = false;
    rollResult.openRange = actorData.system.openRangeFinal;

    if (rollResult.rolledDice <= fumbleRange) {
        rollResult.color = "fumbleRoll";
        rollResult.fumble = true;
        while (fumbleRange > rollResult.rolledDice) {
            rollResult.fumbleLevel += 15;
            fumbleRange--;
        }
    } else if (rollResult.rolledDice >= actorData.system.openRangeFinal) {
        rollResult.color = "openRoll";
        rollResult.explode = true;
    } else {
        rollResult.color = "normalRoll";
    }
    if (actorData.system.rollRange.doubles == "true") {
        rollResult.doubles = true;
        switch (rollResult.rolledDice) {
            case 11:
            case 22:
            case 22:
            case 33:
            case 44:
            case 55:
            case 66:
            case 77:
            case 88:
                rollResult.color = "openRoll";
                rollResult.explode = true;
                break;
            default:
                break;
        }
    }

    const rollData = [rollResult.rolledDice, rollResult._total, rollResult.doubles, rollResult.openRange, label, rollResult.fumbleLevel];

    const template = "systems/abfalter/templates/dialogues/secRoll.html"
    const content = await renderTemplate(template, { rollResult: rollResult, label: label, actor: actorData });
    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actorData: actorData }),
        sound: CONFIG.sounds.dice,
        content: content,
        rolls: [rollResult],
        flags: { rollData, actorData }
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

    let fumbleRange = actorData.system.fumbleRangeFinal;

    let mastery = 0;
    switch (label) {
        case "Attack":
            mastery = actorData.system.atkfinal;
            break;
        case "Block":
            mastery = actorData.system.blkfinal;
            break;
        case "Dodge":
            mastery = actorData.system.dodfinal;
            break;
        default:
            break;
    }
    if (complex == "true") {
        fumbleRange += 2;
    }
    if (mastery > 199 && fumbleRange > 1) {
        fumbleRange -= 1;
    }

    rollResult.color = "";
    rollResult.fumbleLevel = 0;
    rollResult.fumble = false;
    rollResult.explode = false;
    rollResult.doubles = false;
    rollResult.openRange = actorData.system.openRangeFinal;

    if (rollResult.rolledDice <= fumbleRange) {
        rollResult.color = "fumbleRoll";
        rollResult.fumble = true;
        while (fumbleRange > rollResult.rolledDice) {
            rollResult.fumbleLevel += 15;
            fumbleRange--;
        }
    } else if (rollResult.rolledDice >= actorData.system.openRangeFinal) {
        rollResult.color = "openRoll";
        rollResult.explode = true;
    } else {
        rollResult.color = "normalRoll";
    }
    if (actorData.system.rollRange.doubles == "true") {
        rollResult.doubles = true;
        switch (rollResult.rolledDice) {
            case 11:
            case 22:
            case 22:
            case 33:
            case 44:
            case 55:
            case 66:
            case 77:
            case 88:
                rollResult.color = "openRoll"
                rollResult.explode = true;
                break;
            default:
                break;
        }
    }



    const rollData = [rollResult.rolledDice, rollResult._total, rollResult.doubles, rollResult.openRange, label, rollResult.fumbleLevel];

    const template = "systems/abfalter/templates/dialogues/secRoll.html"
    const content = await renderTemplate(template, { rollResult: rollResult, label: label, actor: actorData });
    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actorData: actorData }),
        sound: CONFIG.sounds.dice,
        content: content,
        rolls: [rollResult],
        flags: { rollData, actorData }
    };
    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
    ChatMessage.create(chatData);
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


export async function openRollFunction(msg) {
    //flags.rollData: roll, total, doubles, openRange, label
    let actorData = msg.flags.actorData;

    let baseDice = "1d100";
    let rollFormula = `${baseDice} + ${msg.flags.rollData[1]}`
    let rollResult = await new Roll(rollFormula).roll();
    rollResult.rolledDice = rollResult.total - msg.flags.rollData[1];
    rollResult.openRange = msg.flags.rollData[3];
    rollResult.data.name = msg.speaker.alias;

    rollResult.color = "normalRoll";
    if (rollResult.rolledDice > msg.flags.rollData[0]) {
        if (msg.flags.rollData[2] == "true") {
            if (rollResult.rolledDice >= rollResult.openRange || rollResult.rolledDice == 11 || rollResult.rolledDice == 22 ||
                    rollResult.rolledDice == 33 || rollResult.rolledDice == 44 || rollResult.rolledDice == 55 || rollResult.rolledDice == 66 ||
                    rollResult.rolledDice == 77 || rollResult.rolledDice == 88) {
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

    const rollData = [rollResult.rolledDice, rollResult._total, rollResult.doubles, rollResult.openRange, msg.flags.rollData[4]];

    const template = "systems/abfalter/templates/dialogues/secRoll.html"
    const content = await renderTemplate(template, { rollResult: rollResult, label: msg.flags.rollData[4], actor: actorData });
    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actorData: actorData }),
        sound: CONFIG.sounds.dice,
        content: content,
        rolls: [rollResult],
        flags: { rollData, actorData }
    };
    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
    ChatMessage.create(chatData);
}

export async function fumbleRollFunction(msg) {
    //flags.rollData: roll, total, doubles, openRange, label, fumble
    //total, fumble, label, name
    let actorData = msg.flags.actorData;
    let fumbleSettings = game.settings.get('abfalter', abfalterSettingsKeys.Corrected_Fumble);

    let baseDice = "1d100";
    let rollFormula = ``

    if (fumbleSettings == true) {
        rollFormula = `${msg.flags.rollData[1]} - ${baseDice}`

    } else {
        rollFormula = `${msg.flags.rollData[1]} - ${baseDice} - ${msg.flags.rollData[5]}`
    };
    let rollResult = await new Roll(rollFormula).roll();
    rollResult.rolledDice = rollResult.total - msg.flags.rollData[1];
    rollResult.data.name = msg.speaker.alias;

    const template = "systems/abfalter/templates/dialogues/fumbleRoll.html"
    const content = await renderTemplate(template, { rollResult: rollResult, label: msg.flags.rollData[4] });
    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actorData: actorData }),
        sound: CONFIG.sounds.dice,
        content: content,
        rolls: [rollResult]
    };
    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
    ChatMessage.create(chatData);
}


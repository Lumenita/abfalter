const diceDialog = class extends Dialog {
    activateListeners(html) {
        super.activateListeners(html);
        html.find('.collapsable').click(ev => {
            const li = $(ev.currentTarget).next();
            li.toggle("fast");
        });
    }
}

export async function openModifierDialogue(actorData, finalValue, label, type, mastery) {
    const template = "systems/abfalter/templates/dialogues/basicModifiers.html";
    let confirmed = false;
    let fatMod = false;
    if (type == "resRoll") {
        fatMod = true;
    }

    const html = await renderTemplate(template, { fatMod: fatMod });
    new diceDialog({
        title: `Dice Roller`,
        content: html,
        buttons: {
            roll: { label: "Roll", callback: () => confirmed = true },
            cancel: { label: "Cancel", callback: () => confirmed = false }
        },
        close: html => {
            if (confirmed) {
                switch (type) {
                    case "characteristicRoll":
                        rollCharacteristic(html, actorData, finalValue, label);
                        break;
                    case "secondaryRoll":
                        rollSecondary(html, actorData, finalValue, label, mastery);
                        break;
                    case "resRoll":
                        rollResistance(html, actorData, finalValue, label);
                        break;
                    default:
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
    let rollResult = await new Roll(rollFormula, actorData).roll({ async: true });
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
        content,
    };
    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
    ChatMessage.create(chatData);
}

async function rollSecondary(html, actorData, finalValue, label, mastery) {
    let fatigueMod = parseInt(html.find('#fatiguemod').val()) || 0;
    let mod = parseInt(html.find('#modifiermod').val()) || 0;
    let fatigueFinal = Math.floor(fatigueMod * 15);

    let baseDice = "1d100";
    let rollFormula = `${baseDice} + ${finalValue} + ${fatigueFinal} + ${mod}`
    let rollResult = await new Roll(rollFormula, actorData).roll({ async: true });
    rollResult.rolledDice = rollResult.total - finalValue - fatigueFinal - mod;

    let fumbleRange = actorData.data.data.fumbleRangeFinal;
    if (mastery == "true" && fumbleRange > 1) {
        fumbleRange -= 1;
    }

    rollResult.color = "";
    rollResult.fumble = false;
    rollResult.explode = false;
    if (rollResult.rolledDice <= fumbleRange) {
        rollResult.color = "fumbleRoll";
        rollResult.fumble = true;
    } else if (rollResult.rolledDice >= actorData.data.data.openRangeFinal) {
        rollResult.color = "openRoll";
        rollResult.explode = true;
    } else {
        rollResult.color = "normalRoll";
    }
    if (actorData.data.data.rollRange.doubles == "true") {
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
                rollResult.color = "openroll"
                break;
            default:
                break;
        }
    }

    const template = "systems/abfalter/templates/dialogues/secRoll.html"
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

export async function rollResistance(html, actorData, finalValue, label) {
    let mod = parseInt(html.find('#modifiermod').val()) || 0;

    let baseDice = "1d100";
    let rollFormula = `${baseDice} + ${finalValue} + ${mod}`;
    let rollResult = await new Roll(rollFormula, actorData).roll({ async: true });
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








async function openroll(oldroll, oldvalue, oldcolor, data) {


    let openroll = false;
    if (oldcolor != "openroll") {
        return { openroll, openroll };
    } else {
        openroll = true;
    }
    let roll = Math.ceil(Math.random() * 100);
    let color = "";
    if (data.rollRange.doubles == "true") {
        if (roll > oldroll && roll >= 90 || roll == 11 || roll == 22 || roll == 33 || roll == 44 || roll == 55 || roll == 66 || roll == 77 || roll == 88) { // Counts doubles
            color = "openroll";
        } else {
            color = "normalroll";
        }
    } else {
        if (roll > oldroll && roll >= 90) { // Doesn't count doubles
            color = "openroll";
        } else {
            color = "normalroll";
        }
    }

    let newvalue = Math.floor(oldvalue + roll);

    return { newvalue: newvalue, color: color, roll: roll, openroll: openroll };
}
const diceDialog = class extends Dialog {
    activateListeners(html) {
        super.activateListeners(html);
        html.find('.collapsable').click(ev => {
            const li = $(ev.currentTarget).next();
            li.toggle("fast");
        });
    }
}

function _baseSecondaryDiceRoll(html, actor, finalvalue) { //actor needed to get if doubles is true
    let fatiguemod = parseInt(html.find('#fatiguemod').val()) || 0;
    let modifiermod = parseInt(html.find('#modifiermod').val()) || 0;
    let num = parseInt(finalvalue);
    let fatiguemodfin = Math.floor(fatiguemod * 15);
    let totalnum = Math.floor(num + fatiguemodfin + modifiermod);

    let roll = Math.ceil(Math.random() * 100);
    let finalRoll = Math.floor(totalnum + roll);

    let doubleroll = true;
    let color = "";
    if (roll <= 30) {
        color = "fumbleroll";
    } else if (roll >= 70) {
        color = "openroll";
    } else {
        color = "normalroll";
    }

    if (doubleroll = true) {
        switch (roll) {
            case 11:
            case 22:
            case 33:
            case 44:
            case 55:
            case 66:
            case 77:
            case 88:
                color = "openroll"
                break;
            default:
                break;
        }
    }

    return { finalRoll: finalRoll, totalnum: totalnum, roll: roll, fatiguemodfin: fatiguemodfin, modifiermod: modifiermod, color: color };
}

function _openroll(oldroll, oldvalue, oldcolor) {


    let openroll = false;
    if (oldcolor != "openroll") {
        return { openroll, openroll };
    } else {
        openroll = true;
    }
    let roll = Math.ceil(Math.random() * 100);
    let color = "";
    if (roll > oldroll && roll >= 90) { // doesnt count doubles yet
        color = "openroll";
    } else {
        color = "normalroll";
    }
    let newvalue = Math.floor(oldvalue + roll);

    return { newvalue: newvalue, color: color, roll: roll, openroll: openroll };
}


export async function openSecondaryDiceDialogue(actor, finalvalue, label) {
    const data = actor.data;
    const template = "systems/animabf/templates/dialogues/secondaryroll.html";
    let confirmed = false;

    const html = await renderTemplate(template, { finalvalue: finalvalue, label: label});
    new diceDialog({
        title: `Dice Roller`,
        content: html,
        buttons: {
            roll: { label: "Roll", callback: () => confirmed = true },
            cancel: { label: "Cancel", callback: () => confirmed = false }
        },
        close: html => {
            if (confirmed) {
                let rollResult = _baseSecondaryDiceRoll(html, actor, finalvalue);

                let newroll = _openroll(rollResult.roll, rollResult.finalRoll, rollResult.color); //unused

                let openrollbutton = `<button type="button" class="openRollMod"> <span> Open Roll! </span> </button>` //implement Button for open roll recursive stuff
                let fumblerollbutton = `<button type="button" class="fumblerollmod"> <span> Fumble Severity! </span> </button>` //implement button for severity claculation
                let the_content = `
            <div class="secondarychatmsg">
                <div>
                    <span> ${actor.name} </span>
                </div>
                <div title="Roll + Final + Fatigue + Modifier
(${rollResult.roll}) + ${rollResult.totalnum} + ${rollResult.fatiguemodfin} + ${rollResult.modifiermod}">
                    <span > ${label} </span>
                    <span class="${rollResult.color}" > ${rollResult.finalRoll} </span>
                </div> 
            </div>`
                switch (rollResult.color) {
                    case "openroll":
                        ChatMessage.create({ user: game.user.id, speaker: ChatMessage.getSpeaker({ actor: actor }), content: the_content + openrollbutton });
                        break;
                    case "fumbleroll":
                        ChatMessage.create({ user: game.user.id, speaker: ChatMessage.getSpeaker({ actor: actor }), content: the_content + fumblerollbutton });
                        break;
                    default:
                        ChatMessage.create({ user: game.user.id, speaker: ChatMessage.getSpeaker({ actor: actor }), content: the_content });
                        break;
                }
            }
        }
    }).render(true);
}

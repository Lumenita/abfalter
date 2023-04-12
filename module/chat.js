import { openRollFunction } from "./diceroller.js";
import { fumbleRollFunction } from "./diceroller.js";

export function addChatListeners(html, _msg) {
    html.find('button.secOpenRoll').click(ev => {
        openRollFunction(_msg.message);
    });

    html.on('click', 'button.secFumbleRoll', fumbleRoll);

    //Items to Chat
    html.find('button.spellDifficulty').click(ev => {
        let label = $(ev.currentTarget).attr("data-label");
        spellChatUpdate(_msg.message, label);
    });
}


function fumbleRoll(event) {
    let total = $(event.currentTarget).attr("data-label");
    let fumble = $(event.currentTarget).attr("data-label2");
    let label = $(event.currentTarget).attr("data-label3");
    let name = $(event.currentTarget).attr("data-label4");
    fumbleRollFunction(total, fumble, label, name);
}

export const hideChatActionButtons = function (message, html, data) {
    const chatCard = html.find(".abfalter.secondarychatmsg");

    if (chatCard.length > 0) {
        let actor = game.actors.get(chatCard.attr("data-actor-id"));

        if ((actor && !actor.isOwner)) {
            const buttons = chatCard.find(".explodeButtons");
            buttons.each((i, btn) => {
                btn.style.display = "none"
            });
        }
    }
}

async function spellChatUpdate(msg, label) {
    const template = "systems/abfalter/templates/chatItem/spellChat.html";
    let cardData = msg.flags.cardData
    cardData.expand = false; 
    switch (label) {
        case "basic":
            cardData.basic = true;
            break;
        case "int":
            cardData.int = true;
            break;
        case "adv":
            cardData.adv = true;
            break;
        case "arc":
            cardData.arc = true;
            break;
        default:
            break;
    }
    const content = await renderTemplate(template, cardData);
    game.messages.get(msg._id).update({ content: content});
}
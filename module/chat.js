import { openRollFunction } from "./diceroller.js";
import { fumbleRollFunction } from "./diceroller.js";

export function addChatListeners(html, _msg) {
    html.find('button.secOpenRoll').click(ev => {
        openRollFunction(_msg.message);
    });

    html.find('button.secFumbleRoll').click(ev => {
        fumbleRollFunction(_msg.message);
    });

    //Items to Chat
    html.find('button.spellDifficulty').click(ev => {
        let label = $(ev.currentTarget).attr("data-label");
        spellChatUpdate(_msg.message, label);
    });

    html.find('button.psychicDifficulty').click(ev => {
        let label = $(ev.currentTarget).attr("data-label");
        psychicChatUpdate(_msg.message, label);
    });
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

async function psychicChatUpdate(msg, label) {
    const template = "systems/abfalter/templates/chatItem/psyMatrixChat.html";
    let cardData = msg.flags.cardData
    cardData.expand = false; 

    switch (label) {
        case "20":
            cardData.diff = "Routine";
            cardData.effect = cardData.system.effect20;
            break;
        case "40":
            cardData.diff = "Easy";
            cardData.effect = cardData.system.effect40;
            break;
        case "80":
            cardData.diff = "Average";
            cardData.effect = cardData.system.effect80;
            break;
        case "120":
            cardData.diff = "Difficult";
            cardData.effect = cardData.system.effect120;
            break;
        case "140":
            cardData.diff = "Very Difficult";
            cardData.effect = cardData.system.effect140;
            break;
        case "180":
            cardData.diff = "Absurd";
            cardData.effect = cardData.system.effect180;
            break;
        case "240":
            cardData.diff = "Almost Impossible";
            cardData.effect = cardData.system.effect240;
            break;
        case "280":
            cardData.diff = "Impossible";
            cardData.effect = cardData.system.effect280;
            break;
        case "320":
            cardData.diff = "Inhuman";
            cardData.effect = cardData.system.effect320;
            break;
        case "440":
            cardData.diff = "Zen";
            cardData.effect = cardData.system.effect440;
            break;
        default:
            break;
    }
    console.log(cardData.diff + " + " + cardData.effect);
    const content = await renderTemplate(template, cardData);
    game.messages.get(msg._id).update({ content: content });
}
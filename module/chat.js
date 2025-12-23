import * as diceFunctions from "./diceroller.js";

export function addChatListeners(chatMessage, html) {
    const bindButton = (selector, callback) => {
        html.querySelectorAll(selector).forEach(button => {
            button.addEventListener("click", ev => callback(chatMessage, ev));
        });
    };
    bindButton("button.secOpenRoll", diceFunctions.plainOpenRollFunction);
    bindButton("button.secFumbleRoll", diceFunctions.plainFumbleRollFunction);
    bindButton("button.spellDifficulty", spellChatUpdate);
    bindButton("button.psychicDifficulty", psychicChatUpdate);
    bindButton("button.wepOpenRoll", diceFunctions.profileOpenRollFunction);
    bindButton("button.wepFumbleRoll", diceFunctions.profileFumbleRollFunction);

    bindButton("a.descToggle", toggleValue);
}

//export const hideChatActionButtons = function (message, html, data) {
export const hideChatActionButtons = function (chatMessage, html) {
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

async function toggleValue(msg, ev) {
    ev.preventDefault();

    const card = ev.currentTarget.closest(".chat-message");
    if (!card) return;

    const desc = card.querySelector(".Itemdescription");
    if (!desc) return;

    desc.classList.toggle("ItemDescOpen");

    // optional: rotate arrow
    ev.currentTarget.classList.toggle("ItemDescOpen");
}

async function spellChatUpdate(msg, ev) {
    const label = ev.currentTarget.getAttribute("data-label");

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
    const content = await foundry.applications.handlebars.renderTemplate(template, cardData);
    game.messages.get(msg._id).update({ content: content});
}

async function psychicChatUpdate(msg, ev) {
    const label = ev.currentTarget.getAttribute("data-label");

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
    const content = await foundry.applications.handlebars.renderTemplate(template, cardData);
    game.messages.get(msg._id).update({ content: content });
}
import { openRollFunction } from "./diceroller.js";
import { fumbleRollFunction } from "./diceroller.js";

export function addChatListeners(html, _msg) {
    //console.log(_msg.message);
    //html.on('click', 'button.secOpenRoll', openRoll).bind(_msg);
    html.find('button.secOpenRoll').click(ev => {
        //console.log(_msg.message);
        openRollFunction(_msg.message);
    });

    html.on('click', 'button.secFumbleRoll', fumbleRoll);
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
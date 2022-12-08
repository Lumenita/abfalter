import { openRollFunction } from "./diceroller.js";
import { openRollFunction2 } from "./diceroller.js";
import { fumbleRollFunction } from "./diceroller.js";

export function addChatListeners(html, _msg) {
    //console.log(_msg.message);
    //html.on('click', 'button.secOpenRoll', openRoll).bind(_msg);
    html.find('button.secOpenRoll').click(ev => {
        //console.log(_msg.message);
        openRollFunction2(_msg.message);
    });

    html.on('click', 'button.secFumbleRoll', fumbleRoll);
}

function openRoll(event) {
    let roll = $(event.currentTarget).attr("data-label");
    let total = $(event.currentTarget).attr("data-label2");
    let doubles = $(event.currentTarget).attr("data-label3");
    let openRange = $(event.currentTarget).attr("data-label4");
    let label = $(event.currentTarget).attr("data-label5");
    let name = $(event.currentTarget).attr("data-label6");


    let act = $(event.currentTarget).attr("data-label7");
    let div = $(event.currentTarget);


    openRollFunction(roll, total, doubles, openRange, label, name);
}

function fumbleRoll(event) {
    let total = $(event.currentTarget).attr("data-label");
    let fumble = $(event.currentTarget).attr("data-label2");
    let label = $(event.currentTarget).attr("data-label3");
    let name = $(event.currentTarget).attr("data-label4");
    fumbleRollFunction(total, fumble, label, name);
}

export const hideChatActionButtons = function (message, html, data) {
    const chatCard = html.find("secondarychatmsg");
    if (chatCard.length > 0) {
        let actor = game.actors.get(chatCard.attr("data-actor-id"));

        if ((actor && !actor.owner)) {
            const buttons = chatCard.find("button.secOpenRoll");
            buttons.each((i, btn) => {
                btn.style.display = "none"
            });
        }
    }
}
import { openRollFunction } from "./diceroller.js";
import { fumbleRollFunction } from "./diceroller.js";

export function addChatListeners(html) {

    html.on('click', 'button.secOpenRoll', openRoll);
    html.on('click', 'button.secFumbleRoll', fumbleRoll);
}

function openRoll(event) {
    let roll = $(event.currentTarget).attr("data-label");
    let total = $(event.currentTarget).attr("data-label2");
    let doubles = $(event.currentTarget).attr("data-label3");
    let openRange = $(event.currentTarget).attr("data-label4");
    let label = $(event.currentTarget).attr("data-label5");
    let name = $(event.currentTarget).attr("data-label6");
    openRollFunction(roll, total, doubles, openRange, label, name);
}

function fumbleRoll(event) {
    let total = $(event.currentTarget).attr("data-label");
    let fumble = $(event.currentTarget).attr("data-label2");
    let label = $(event.currentTarget).attr("data-label3");
    let name = $(event.currentTarget).attr("data-label4");
    fumbleRollFunction(total, fumble, label, name);
}
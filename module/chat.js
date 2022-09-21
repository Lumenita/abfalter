import { openRollFunction } from "./diceroller.js";

export function addChatListeners(html) {

    html.on('click', 'button.secOpenRoll', openRoll);

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
import * as diceFunctions from "./diceroller.js";

export function addChatListeners(chatMessage, html) {
    const bindButton = (selector, callback) => {
        html.querySelectorAll(selector).forEach(button => {
            button.addEventListener("click", ev => callback(chatMessage, html, ev));
        });
    };
    const bindChange = (selector, callback) => {
        html.querySelectorAll(selector).forEach(element => {
            element.addEventListener("change", ev => callback(chatMessage, html, ev));
        });
    };
    // Offensive
    bindButton("button.offOpenRoll", diceFunctions.offenseOpenRollFunction);
    bindButton("button.offFumbleRoll", diceFunctions.offenseFumbleRollFunction);
    // Defensive
    bindButton("button.defensiveOpenRoll", diceFunctions.defensiveOpenRollFunction);
    bindButton("button.defensiveFumbleRoll", diceFunctions.defensiveFumbleRollFunction);
    // Auto Defensive
    bindButton("button.autoDefOpenRoll", diceFunctions.autoDefOpenRollFunction);
    bindButton("button.autoDefFumbleRoll", diceFunctions.autoDefFumbleRollFunction);
    bindButton("button.abfDefendButton", defendButtonClicked);
    bindButton("button.sendDefenseToResolve", sendDefenseClicked);
    updateDefenseButtonOwnership(chatMessage, html);
    // Resolve Combat
    bindChange('.resolveDmgOption input[type="radio"]', diceFunctions.updateResolveDamagePreview);
    bindButton("button.applyDamageToActors", diceFunctions.resolveApplyDamageToActors);
    // Other
    bindButton("button.secOpenRoll", diceFunctions.plainOpenRollFunction);
    bindButton("button.secFumbleRoll", diceFunctions.plainFumbleRollFunction);
    bindButton("button.spellDifficulty", spellChatUpdate);
    bindButton("button.psychicDifficulty", psychicChatUpdate);
    // Toggle Value (expanding descriptions)
    bindButton("a.descToggle", toggleValue);
}

async function toggleValue(msg, html, ev) {
    ev.preventDefault();
    const card = ev.currentTarget.closest(".chat-message");
    if (!card) return;
    const desc = card.querySelector(".itemDescription");
    if (!desc) return;

    desc.classList.toggle("ItemDescOpen");
    ev.currentTarget.classList.toggle("ItemDescOpen");
}

async function spellChatUpdate(msg, html, ev) {
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

async function psychicChatUpdate(msg, html, ev) {
    const label = ev.currentTarget.getAttribute("data-label");

    const template = "systems/abfalter/templates/chatItem/psyMatrixChat.hbs";
    let cardData = msg.flags.cardData
    cardData.expand = false; 
    switch (label) {
        case "20":
            cardData.diff = game.i18n.localize(`abfalter.routine`);
            cardData.effect = cardData.effect20;
            break;
        case "40":
            cardData.diff = game.i18n.localize(`abfalter.easy`);
            cardData.effect = cardData.effect40;
            break;
        case "80":
            cardData.diff = game.i18n.localize(`abfalter.average`);
            cardData.effect = cardData.effect80;
            break;
        case "120":
            cardData.diff = game.i18n.localize(`abfalter.difficult`);
            cardData.effect = cardData.effect120;
            break;
        case "140":
            cardData.diff = game.i18n.localize(`abfalter.vDifficult`);
            cardData.effect = cardData.effect140;
            break;
        case "180":
            cardData.diff = game.i18n.localize(`abfalter.absurd`);
            cardData.effect = cardData.effect180;
            break;
        case "240":
            cardData.diff = game.i18n.localize(`abfalter.almostImp`);
            cardData.effect = cardData.effect240;
            break;
        case "280":
            cardData.diff = game.i18n.localize(`abfalter.impossible`);
            cardData.effect = cardData.effect280;
            break;
        case "320":
            cardData.diff = game.i18n.localize(`abfalter.inhuman`);
            cardData.effect = cardData.effect320;
            break;
        case "440":
            cardData.diff = game.i18n.localize(`abfalter.zen`);
            cardData.effect = cardData.effect440;
            break;
        default:
            break;
    }
    const content = await foundry.applications.handlebars.renderTemplate(template, cardData);
    game.messages.get(msg._id).update({ content: content });
}

//Function for when defense button is clicked from an attack
async function defendButtonClicked(msg, html, ev) {
    ev.preventDefault();

    const button = ev.currentTarget;
    if (button.disabled) return;

    const tokenId = button.dataset.tokenId;
    const actorId = button.dataset.actorId;

    const workflow = msg.flags?.abfalter?.workflow;
    if (!workflow) return;

    const rollData = msg.flags?.abfalter?.rollData ?? [];
    const lastRoll = rollData[rollData.length - 1];

    if (lastRoll?.explode || lastRoll?.fumble) {
        ui.notifications.warn("This attack is still resolving.");
        return;
    }

    const defenderToken = canvas.tokens?.get(tokenId);
    const defenderActor = game.actors?.get(actorId) ?? defenderToken?.actor;

    if (!defenderActor) {
        ui.notifications.warn("Could not find defending actor.");
        return;
    }

    if (!game.user.isGM && !defenderActor.isOwner) {
        ui.notifications.warn("You do not control this defender.");
        return;
    }

    const targetState = workflow.targetStates?.[tokenId];
    if (targetState?.status === "completed") {
        ui.notifications.info("Defense already completed.");
        return;
    }

    await diceFunctions.defendAgainstAttacks({
        atkDmgType: msg.flags.abfalter.attackDetails.dmgType,
        atkMsgId: msg._id,
        tokenId,
    });
}

async function sendDefenseClicked(msg, html, ev) {
    const template = "systems/abfalter/templates/dialogues/diceRolls/defensiveAutoRoll.hbs"
    const defenseDetails = foundry.utils.deepClone(msg.flags?.abfalter?.defenseDetails ?? {});
    const rollData = foundry.utils.deepClone(msg.flags?.abfalter?.rollData ?? {});
    const basicInfo = foundry.utils.deepClone(msg.flags?.abfalter?.basicInfo ?? {});
    const defSettings = foundry.utils.deepClone(msg.flags?.abfalter?.defSettings ?? {});

    let status = 'accepted';

    const speaker = msg.speaker;
    const actor = ChatMessage.getSpeakerActor(speaker);

    const content = await foundry.applications.handlebars.renderTemplate(template, {
        basicInfo,
        defenseDetails,
        defSettings,
        rollData,
        actor,
        status
    });
    await msg.update({ content });
    await diceFunctions.finalizeDefenseAgainstAttackMessage({ defenseMessageId: msg.id });
}

//Gray out un-owned button for defense.
function updateDefenseButtonOwnership(msg, html, ev) {
    const buttons = html.querySelectorAll("button.abfDefendButton");
    if (!buttons.length) return;

    for (const button of buttons) {
        const actorId = button.dataset.actorId;
        const tokenId = button.dataset.tokenId;
        const workflow = msg.flags?.abfalter?.workflow;
        const targetState = workflow?.targetStates?.[tokenId];
        const status = targetState?.status ?? "pending";
        console.log(status);

        const actor = actorId ? game.actors.get(actorId) : null;
        const token = tokenId ? canvas.tokens?.get(tokenId) : null;
        const defenderActor = actor ?? token?.actor ?? null;

        const canDefend = game.user.isGM || Boolean(defenderActor?.isOwner);

        // lock if attack roll is already locked or defense has been accepted
        const isLocked =
            button.dataset.lockedByRoll === "true" ||
            status === "completed";

        if (!canDefend || isLocked) {
            button.disabled = true;
            button.classList.add("abf-disabled-defense");
            button.setAttribute("aria-disabled", "true");

            if (!canDefend) {
                button.title =
                    game.i18n.localize("abfalter.notOwner") ||
                    "You do not control this target";
            } else if (status === "completed") {
                button.title =
                    game.i18n.localize("abfalter.defenseAccepted") ||
                    "Defense has already been accepted";
            }
        } else {
            button.disabled = false;
            button.classList.remove("abf-disabled-defense");
            button.removeAttribute("aria-disabled");
            button.title = "";
        }
    }
}

export function hideResolveControls(chatMessage, html) {
    if (!chatMessage.flags?.abfalter?.customChatHeaderCard) return;
    if (game.user.isGM) {
        html.querySelectorAll(".player-only").forEach(el => el.style.display = "none");
    } else {
        html.querySelectorAll(".gm-only").forEach(el => el.style.display = "none");
    }
}






/* Hasn't been used in 5+ patches
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
*/
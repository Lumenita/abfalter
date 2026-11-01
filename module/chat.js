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
    // Auto Defensive
    bindButton("button.autoDefContinuationRoll", diceFunctions.autoDefContinuationRoll);
    bindButton("button.abfDefendButton", defendButtonClicked);
    bindButton("button.sendDefenseToResolve", sendDefenseClicked);
    updateDefenseButtonOwnership(chatMessage, html);

    // Resistance Resolver
    bindButton("button.resolveResistanceCheck", resolveResClicked);
    bindButton("button.acceptEffectResistance", acceptEffectResistanceClicked);
    updateResistanceButtonOwnership(chatMessage, html);
    updateResistanceAcceptButton(chatMessage, html);

    // Resolve Combat
    bindChange('.resolveDmgOption input[type="radio"]', diceFunctions.updateResolveDamagePreview);
    bindButton("button.applyDamageToActors", diceFunctions.resolveApplyDamageToActors);
    // Martial
    bindButton("button.offContinuationRoll", diceFunctions.offenseContinuationRollFunction);
    bindButton("button.effectContinuationRoll", diceFunctions.effectContinuationRollFunction);
    bindButton("button.secondaryContinuationRoll", diceFunctions.secondaryContinuationRollFunction);
    // Defensive
    bindButton("button.defensiveContinuationRoll", diceFunctions.defensiveContinuationRoll);
    // Psychic Stuff
    bindButton("button.potentialContinuationRoll", diceFunctions.potentialContinuationRollFunction);
    bindButton("button.selectMatrixEffect", matrixChatUpdate);
    bindButton("button.attackMatrixTargets", matrixPrepareAttack);
    bindButton("button.effectMatrixTargets", matrixPrepareEffect);
   
    bindButton("button.psychicDifficulty", psychicChatUpdate);
    
    // Other
    bindButton("button.secOpenRoll", diceFunctions.plainOpenRollFunction);
    bindButton("button.secFumbleRoll", diceFunctions.plainFumbleRollFunction);
    bindButton("button.spellDifficulty", spellChatUpdate);
    // Toggle Value (expanding descriptions)
    bindButton("a.descToggle", toggleValue);
    bindButton("a.descToggle2", toggleValue2);
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

async function toggleValue2(msg, html, ev) {
    ev.preventDefault();
    const card = ev.currentTarget.closest(".chat-message");
    if (!card) return;
    const desc = card.querySelector(".itemDescription2");
    if (!desc) return;

    desc.classList.toggle("ItemDescClose");
    ev.currentTarget.classList.toggle("ItemDescClose");
}

async function matrixChatUpdate(msg, html, ev) {
    const label = ev.currentTarget.getAttribute("data-effect-key");
    const template = "systems/abfalter/templates/dialogues/diceRolls/potentialMatrixRoll.hbs";
    let matrixResolution = msg.flags.abfalter.matrixResolution;
    const effect = matrixResolution.availableEffects.find(e => e.key === label);
    let title = game.i18n.localize(`abfalter.` + effect.title)
    matrixResolution.chosenTitle = `${title} (${effect.titleNum}) `;
    matrixResolution.chosenDesc = effect.description;
    matrixResolution.matrixName = msg.flags.abfalter.matrixDetails.name;

    const token = canvas.tokens.get(msg.speaker.token);
    const actor = token?.actor ?? game.actors.get(msg.speaker.actor);
    const item = actor.items.get(msg.flags.abfalter.matrixDetails.matrixId);
    const itemEffect = item.system.matrixDetails[label]; //msg.flags.abfalter.matrixDetails.effectDetails

    if (msg.flags.abfalter.matrixDetails.type == "attack") {
        matrixResolution.chosenDmg = itemEffect.dmgValueFinal;
        matrixResolution.chosenAT = itemEffect.atPenFinal;
        matrixResolution.projBonus = itemEffect.projAdditional;
        matrixResolution.favDmgType = itemEffect.favDmgType;
        const dmgTypeList = Object.entries(itemEffect.dmgType).filter(([, value]) => value).map(([key]) => key);
        matrixResolution.dmgTypeList = dmgTypeList;
        matrixResolution.noDamageType = dmgTypeList.length === 0;
        matrixResolution.singleDamageType = dmgTypeList.length === 1;
        if (matrixResolution.singleDamageType) {
            matrixResolution.chosenDmgType = dmgTypeList[0];
        }
        matrixResolution.attackInfo = itemEffect.infoLine;
    }

    if (msg.flags.abfalter.matrixDetails.type === "effect") {
        matrixResolution.chosenRes = itemEffect.resValueFinal;
        const resTypeList = Object.entries(itemEffect.resType ?? {})
            .filter(([, value]) => value)
            .map(([key]) => key);

        matrixResolution.resTypeList = resTypeList;
        matrixResolution.noResType = resTypeList.length === 0;
        matrixResolution.singleResType = resTypeList.length === 1;

        if (matrixResolution.singleResType) {
            matrixResolution.chosenResType = resTypeList[0];
        }

        matrixResolution.resInfo = itemEffect.infoLine;

        matrixResolution.useAT = item.system.effectUseAT;
        matrixResolution.atLabel = item.system.effectWhichAT;
        matrixResolution.effectProjBonus = item.system.effectAddProj;
        matrixResolution.effectUseProj = item.system.effectUseProj;
        
        matrixResolution.resOnFailedProj = item.system.effectFailedProj;
        matrixResolution.failedProjResBonus = item.system.effectFailedBonus;
        matrixResolution.useImmunity = item.system.effectImmunities;
        matrixResolution.immunityType = item.system.effectImmuType;
    }

    if (msg.flags.abfalter.matrixDetails.type === "shield") {
        matrixResolution.shieldValue = itemEffect.shieldValueFinal;
        matrixResolution.shieldInfo = itemEffect.infoLine;
    }

    matrixResolution.isFired = item.system.isFired;
    matrixResolution.isInvisible = item.system.isInvisible;
    matrixResolution.chosenKey = label;
    matrixResolution.chosen = true;
    const content = await foundry.applications.handlebars.renderTemplate(template, {
        basicInfo: msg.flags.abfalter.basicInfo,
        rollData: msg.flags.abfalter.rollData,
        matrixDetails: msg.flags.abfalter.matrixDetails,
        matrixResolution: matrixResolution
    });
    await game.messages.get(msg._id).update({ 
        content: content,
        "flags.abfalter.matrixResolution": matrixResolution
     });
} 

async function matrixPrepareAttack(msg, html, ev) {
    if (!msg.isAuthor && !game.user.isGM) return;
    const actor = game.actors.get(msg.speaker.actor);
    const info = {
        name: msg.flags.abfalter.matrixDetails.name,
        dmg: msg.flags.abfalter.matrixResolution.chosenDmg,
        atPen: msg.flags.abfalter.matrixResolution.chosenAT,
        projBonus: msg.flags.abfalter.matrixResolution.projBonus,
        dmgTypeList: msg.flags.abfalter.matrixResolution.dmgTypeList,
        favDmgType: msg.flags.abfalter.matrixResolution.favDmgType,
        isFired: msg.flags.abfalter.matrixResolution.isFired,
        isInvisible: msg.flags.abfalter.matrixResolution.isInvisible,
        potentialMsgId: msg._id   
    }

    diceFunctions.matrixAttackDialogue({actor: actor, matrixInfo: info});
}

async function matrixPrepareEffect(msg, html, ev) {
    if (!msg.isAuthor && !game.user.isGM) return;
    const actor = game.actors.get(msg.speaker.actor);
    const info = {
        name: msg.flags.abfalter.matrixDetails.name,
        type: "psychic",
        useProj: msg.flags.abfalter.matrixResolution.effectUseProj,
        projBonus: msg.flags.abfalter.matrixResolution.effectProjBonus,
        useAT: msg.flags.abfalter.matrixResolution.useAT,
        atLabel: msg.flags.abfalter.matrixResolution.atLabel,
        resTypeList: msg.flags.abfalter.matrixResolution.resTypeList,
        resValue: msg.flags.abfalter.matrixResolution.chosenRes,

        resOnFailedProj: msg.flags.abfalter.matrixResolution.resOnFailedProj,
        failedProjResBonus: msg.flags.abfalter.matrixResolution.failedProjResBonus,
        useImmunity: msg.flags.abfalter.matrixResolution.useImmunity,
        immunityType: msg.flags.abfalter.matrixResolution.immunityType,

        isFired: msg.flags.abfalter.matrixResolution.isFired,
        isInvisible: msg.flags.abfalter.matrixResolution.isInvisible,
        potentialMsgId: msg._id   
    }
    diceFunctions.effectProjDialogue({actor: actor, effectInfo: info})
}

async function spellChatUpdate(msg, html, ev) {
    const label = ev.currentTarget.getAttribute("data-label");

    const template = "systems/abfalter/templates/chatItem/spellChat.hbs";
    let cardData = msg.flags.abfalter.cardData
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
    const label = ev.currentTarget.dataset.label;

    const difficulties = {
        20: "routine",
        40: "easy",
        80: "average",
        120: "difficult",
        140: "vDifficult",
        180: "absurd",
        240: "almostImp",
        280: "impossible",
        320: "inhuman",
        440: "zen"
    };

    if (!Object.hasOwn(difficulties, label)) return;

    const cardData = foundry.utils.deepClone(msg.flags.abfalter.cardData);
    const effect = cardData.matrixEffects?.[label];
    console.log(cardData)
    console.log(effect)


    if (!effect) {
        console.warn(`Psychic Matrix effect${label} not found`, cardData);
        return;
    }

    cardData.expand = false;
    cardData.diff = `${game.i18n.localize(`abfalter.${difficulties[label]}`)} (${label})`;

    cardData.effect = effect.description ?? "";
    cardData.infoLine = effect.infoLine ?? "";

    const content = await foundry.applications.handlebars.renderTemplate(
        "systems/abfalter/templates/chatItem/psyMatrixChat.hbs",
        cardData
    );

    await msg.update({
        content,
        "flags.abfalter.cardData": cardData
    });
}

//Function for when Resistance button is clicked from the Effect Resolver
async function resolveResClicked(msg, html, ev) {
    ev.preventDefault();

    const button = ev.currentTarget;
    if (button.disabled) return;

    const tokenId = button.dataset.tokenId;

    const defenderData = msg.flags?.abfalter?.resolveData?.defenderValues?.[tokenId];

    if (!defenderData?.requiresResistance) return;

    const token = canvas.tokens?.get(tokenId);
    const actor = token?.actor;

    if (!actor) return;

    // Check ownership
    if (!game.user.isGM && !actor.isOwner) return;

    // Check if already rolled
    if (resistanceAlreadyRolled(msg.id, tokenId)) return;

    const resData = {
        resValue: defenderData.resValue,
        resTypeList: defenderData.resTypeList,
        resBonus: defenderData.resBonus,
        failedRes: defenderData.failedRes,
        useImmunity: defenderData.useImmunity,
        immunityType: defenderData.immunityType,
        sourceMessageId: msg.id,
        tokenId: tokenId,
    };

    try {
        await diceFunctions.effectResolverResistance({actor: actor, resData: resData});
    } catch (error) {
        console.error("Resistance roll failed:", error);
        ui.notifications.error("Resistance roll failed.");
    } finally {
        // Recheck after rolling, including if roll was cancelled
        updateResistanceButtonOwnership(msg, html);
    }
}

function resistanceAlreadyRolled(sourceMessageId, tokenId) {
    return game.messages.some(message => {
        const result = message.flags?.abfalter?.resistanceResult;

        return (
            result?.sourceMessageId === sourceMessageId &&
            result?.tokenId === tokenId
        );
    });
}

async function acceptEffectResistanceClicked(msg, html, ev) {
    ev.preventDefault();

    if (!game.user.isGM) return;

    const button = ev.currentTarget;
    if (button.disabled) return;

    button.disabled = true;

    try {
        await diceFunctions.acceptEffectResistance({
            resistanceMessageId: msg.id
        });
    } catch (error) {
        console.error("Failed to accept resistance:", error);
        ui.notifications.error("Failed to accept resistance.");
    } finally {
        updateResistanceAcceptButton(msg, html);
    }
}

function updateResistanceAcceptButton(msg, html) {
    const buttons = html.querySelectorAll(
        "button.acceptEffectResistance"
    );
    const accepted = msg.flags?.abfalter?.resistanceResult?.accepted === true;

    for (const button of buttons) {
        if (!game.user.isGM || accepted) {
            button.remove();
        }
    }
}

// Gray out Resistance buttons if unowned or already rolled
function updateResistanceButtonOwnership(msg, html) {
    const buttons = html.querySelectorAll(
        "button.resolveResistanceCheck"
    );
    if (!buttons.length) return;

    for (const button of buttons) {
        const tokenId = button.dataset.tokenId;
        const actorId = button.dataset.actorId;

        const actor = actorId
            ? game.actors.get(actorId)
            : null;

        const token = tokenId
            ? canvas.tokens?.get(tokenId)
            : null;

        const defenderActor = actor ?? token?.actor ?? null;

        const canResist =
            game.user.isGM ||
            Boolean(defenderActor?.isOwner);

        const alreadyRolled =
            msg.flags?.abfalter?.resolveData?.defenderValues?.[tokenId]
                ?.resistanceAccepted === true ||
            resistanceAlreadyRolled(msg.id, tokenId);

        const isLocked = !canResist || alreadyRolled;

        button.disabled = isLocked;
        button.classList.toggle(
            "abf-disabled-defense",
            isLocked
        );

        if (isLocked) {
            button.setAttribute("aria-disabled", "true");

            if (!canResist) {
                button.title = "You do not control this target";
            } else if (alreadyRolled) {
                button.title = "Resistance already rolled";
            }
        } else {
            button.removeAttribute("aria-disabled");
            button.title = "";
        }
    }
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
    const defenderActor = defenderToken?.actor ?? game.actors?.get(actorId);

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

    const effectDetails = msg.flags?.abfalter?.effectDetails;
    const attackDetails = msg.flags?.abfalter?.attackDetails;

    if (effectDetails) {
        await diceFunctions.defendAgainstEffects({
            effectMsgId: msg.id,
            tokenId
        });
        return;
    }

    if (attackDetails) {
        await diceFunctions.defendAgainstAttacks({
            atkDmgType: attackDetails.dmgType,
            atkMsgId: msg.id,
            tokenId
        });
    }
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
    await diceFunctions.finalizeDefenseMessage({ defenseMessageId: msg.id });
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



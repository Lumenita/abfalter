export function createAttackWorkflow(actor, selectedDefenderIds = []) {
    const ids = [...new Set(selectedDefenderIds.filter(Boolean))];
    return {
        attackerUserId: game.user.id,
        attackerActorId: actor.id,
        attackerTokenId: actor.getActiveTokens()?.[0]?.id ?? null,
        selectedDefenderIds: ids,
        targetStates: Object.fromEntries(ids.map(id => [id, {status:"pending"}]))
    };
}

export function allDefensesCompleted(workflow) {
    const ids = workflow?.selectedDefenderIds ?? [];
    return ids.length > 0 && ids.every(id => workflow?.targetStates?.[id]?.status === "completed");
}


/** Pure damage calculation for a successful contested combat hit.
 */
export function calculateResolvedDamage({baseDamage, damagePercent, baseReduction = 0, finalReduction = 0, allMultiplier = 1, typeMultiplier = 1}) {
    const reducedBaseDamage = Math.max(0, Number(baseDamage) - Number(baseReduction));
    const percentageDamage = Number(damagePercent) > 0 ? reducedBaseDamage * Number(damagePercent) : 0;
    const multipliedDamage = Math.max(0, Math.round(percentageDamage * Number(allMultiplier) * Number(typeMultiplier)));
    const actualDamage = Math.max(0, multipliedDamage - Number(finalReduction));
    return { reducedBaseDamage, percentageDamage, multipliedDamage, actualDamage, signedDamage: actualDamage ? -actualDamage : 0 };
}

export async function finalizeDefenseMessage({defenseMessageId}) {
    const defenseMessage = game.messages.get(defenseMessageId);
    if (!defenseMessage) return;

    const defenseWorkflow = defenseMessage.flags.abfalter.defenseWorkflow;
    const defenseDetails = defenseMessage.flags.abfalter.defenseDetails;
    const rollData = defenseMessage.flags.abfalter.rollData ?? [];

    if (!defenseWorkflow || !defenseDetails) return;

    const parentMessage = game.messages.get(defenseWorkflow.parentMessageId);
    if (!parentMessage) return;

    const workflow = foundry.utils.deepClone(
        parentMessage.flags.abfalter.workflow ?? {}
    );

    const tokenId = defenseWorkflow.defTokenId;

    if (!workflow.targetStates) workflow.targetStates = {};
    if (workflow.targetStates[tokenId]?.status === "completed" &&
        workflow.targetStates[tokenId]?.defenseMessageId === defenseMessage.id) return;

    const lastRoll = rollData[rollData.length - 1];
    const finalDefenseTotal = lastRoll?.total ?? defenseDetails.finalValue;

    workflow.targetStates[tokenId] = {
        ...workflow.targetStates[tokenId],
        status: "completed",
        defenseMessageId: defenseMessage.id,
        defenseSubLabel: defenseDetails.defTypeName,
        defenseName: defenseDetails.label,
        defenseType: defenseDetails.defenseType,
        combatDefenseType: defenseDetails.combatDefenseType,
        finalValue: finalDefenseTotal,
        formula: defenseDetails.formula,
        armorFinal: defenseDetails.armorFinal
    };

    await parentMessage.update({"flags.abfalter.workflow": workflow});

    const allDone = allDefensesCompleted(workflow);

    if (!allDone) return;

    if (defenseWorkflow.resolutionType === "effect") {
        await createEffectResolutionMessage({msg: parentMessage});
    } else {
        await createCombatResolutionMessage(parentMessage);
    }
}

export async function createCombatResolutionMessage(msg) {
    const attackDetails = msg.flags.abfalter.attackDetails;
    const workflow = msg.flags.abfalter.workflow;
    const atkSettings = msg.flags.abfalter.atkSettings;
    const defenderIds = workflow.selectedDefenderIds;
    const attackerToken = canvas.tokens?.get(workflow.attackerTokenId);
    const combatSettings = game.settings.get('abfalter', "combatSettings");

    //const attackerDisposition = attackerToken?.document?.disposition ?? CONST.TOKEN_DISPOSITIONS.NEUTRAL;
    //const isFriendly = attackerDisposition === CONST.TOKEN_DISPOSITIONS.FRIENDLY;

    const resolveData = {
        attackerValues: {
            finalValue: 0,
            formula: attackDetails.formula,
            dmg: attackDetails.dmg,
            dmgType: attackDetails.dmgType,
            atPen: attackDetails.atPen,
            attackSubLabel: attackDetails.actionName,
            attackName: attackDetails.label
        },
        atkSettings,
        defenderIds,
        defenderValues: Object.fromEntries(
            defenderIds.map(id => {
                const targetState = workflow.targetStates?.[id] ?? {};
                const token = canvas.tokens?.get(id);
                const defenderDisposition = token?.document?.disposition ?? CONST.TOKEN_DISPOSITIONS.NEUTRAL;
                const isFriendly = defenderDisposition === CONST.TOKEN_DISPOSITIONS.FRIENDLY;
                const defSettings = {
                    defTokName: isFriendly || !!combatSettings.defTokName,
                    defWepName: isFriendly || !!combatSettings.defWepName,
                    defAtkName: isFriendly || !!combatSettings.defAtkName,
                    defFinValue: isFriendly || !!combatSettings.defFinValue,
                    defFormula: isFriendly || !!combatSettings.defFormula,
                    defAT: isFriendly || !!combatSettings.defAT,
                    resDefDmgTaken: isFriendly || combatSettings.resDefDmgTaken,
                    resFinalAT: combatSettings.resFinalAT,
                    resDefDmgPer: combatSettings.resDefDmgPer,
                    resDefInfoMsg: combatSettings.resDefInfoMsg,
                }
                return [id, {
                    portrait: token?.document?.texture?.src ?? token?.actor?.img ?? "",
                    name: token?.name ?? targetState.defenseName ?? "Unknown Defender",
                    defenseTotal: targetState.finalValue,
                    armorFinal: targetState.armorFinal ?? 0,
                    dmgPercentage: 0,
                    totalDmg: 0,
                    ccBonus: 0,
                    dmgInfo: "",
                    defenseSubLabel: targetState.defenseSubLabel,
                    defenseName: targetState.defenseName,
                    defenseType: targetState.defenseType,
                    combatDefenseType: targetState.combatDefenseType,
                    formula: targetState.formula ?? "",
                    defSettings
                }];
            })
        ),
        resolved: false
    };

    const lastIndex = (msg.flags.abfalter.rollData?.length ?? 1) - 1;
    const finalAttackValue = Number(
        msg.flags.abfalter.rollData?.[lastIndex]?.total
        ?? attackDetails?.value
        ?? 0
    );
    resolveData.attackerValues.finalValue = finalAttackValue;

    const attackDamage = Number(attackDetails?.dmg ?? 0);
    const attackAtPen = Math.max(0, Number(attackDetails?.atPen ?? 0));

    for (const id of resolveData.defenderIds) {
        const defenderData = resolveData.defenderValues[id];
        if (!defenderData) continue;

        const defenseTotal = Number(defenderData.defenseTotal ?? 0);
        const diff = finalAttackValue - defenseTotal;
        const effectiveArmor = Math.max(0, Number(defenderData.armorFinal ?? 0) - attackAtPen);

        if (diff < 0) {
            const counter = Math.floor(Math.abs(diff) / 2);

            defenderData.ccBonus = counter;
            defenderData.dmgPercentage = 0;
            defenderData.totalDmg = 0;
            if (!combatSettings.resDefInfoMsg) {
                defenderData.dmgInfoGM = `${game.i18n.localize("abfalter.defCcBonus")}: +${counter}`;
                defenderData.dmgInfoPlayer = game.i18n.localize("abfalter.hiddenToGm");
            } else {
                defenderData.dmgInfoGM = `${game.i18n.localize("abfalter.defCcBonus")}: +${counter}`;
                defenderData.dmgInfoPlayer = combatSettings.resCcNum ? `${game.i18n.localize("abfalter.defCcBonus")}: +${counter}` : `${game.i18n.localize("abfalter.defCcBonus")}: ???`;
            }
        } else {
            const damagePercent = combatSettings.resDmgFormula 
                ? calculateCoreExxetDmgPercentage(diff, effectiveArmor) 
                : calculateDamagePercentage(diff, effectiveArmor) ;
            const percentValue = Math.round((damagePercent * 100) * 100) / 100;


            const defenderToken = canvas.tokens?.get(id);
            const defenderActor = defenderToken?.actor;
            const otherStats = defenderActor?.system?.otherStats ?? {};
            const receivedStats = defenderActor?.system?.combatDmgReceivedStats ?? {};

            const damageTypeMap = {
                CUT: "cutRecDmg",
                IMP: "impRecDmg",
                THR: "thrRecDmg",
                HEAT: "heatRecDmg",
                COLD: "coldRecDmg",
                ELE: "eleRecDmg",
                ENE: "eneRecDmg"
            };
            const receivedDamageKey = damageTypeMap[attackDetails?.dmgType];
            const allDamageMultiplier = Number(receivedStats.allRecDmg?.final ?? 1);
            const typeDamageMultiplier = Number(receivedStats[receivedDamageKey]?.final ?? 1);
            const { actualDamage, signedDamage } = calculateResolvedDamage({
                baseDamage: attackDamage,
                damagePercent,
                baseReduction: otherStats.dmgRdcBaseFinal ?? 0,
                finalReduction: otherStats.dmgRdcFinal ?? 0,
                allMultiplier: allDamageMultiplier,
                typeMultiplier: typeDamageMultiplier
            });
            defenderData.ccBonus = 0;
            defenderData.dmgPercentage = percentValue;

            defenderData.totalDmgFormula = `
                -${actualDamage} = 
                [{[${attackDamage}(${game.i18n.localize("abfalter.base")}) - ${otherStats.dmgRdcBaseFinal}(${game.i18n.localize("abfalter.baseRed")})] 
                * ${damagePercent}(${game.i18n.localize("abfalter.percentDmg")})} 
                * ${allDamageMultiplier}(${game.i18n.localize("abfalter.allDmgMult")}) * ${typeDamageMultiplier}(${game.i18n.localize("abfalter.typeDmgMult")})] 
                - ${otherStats.dmgRdcFinal}(${game.i18n.localize("abfalter.finalRed")})`
            defenderData.totalDmg = signedDamage;
            defenderData.dmgColor = defenderData.totalDmg < 0 ? "fumbleRoll" : "openRoll";
            if (!combatSettings.resDefInfoMsg) {
                defenderData.dmgInfoGM = damagePercent > 0
                    ? (
                        combatSettings.resDefInfoLumi
                            ? game.i18n.localize("abfalter.defResLumiRules") 
                            : game.i18n.localize("abfalter.defResCoreRules")
                    )
                    : ( 
                        combatSettings.resDefInfoLumi
                        ? game.i18n.localize("abfalter.defResLumiRules2") 
                        : game.i18n.localize("abfalter.defResCoreRules2")
                    );
                defenderData.dmgInfoPlayer = game.i18n.localize("abfalter.hiddenToGm");
            } else {
                defenderData.dmgInfoGM = damagePercent > 0
                    ? (
                        combatSettings.resDefInfoLumi
                            ? game.i18n.localize("abfalter.defResLumiRules") 
                            : game.i18n.localize("abfalter.defResCoreRules")
                    )
                    : ( 
                        combatSettings.resDefInfoLumi
                        ? game.i18n.localize("abfalter.defResLumiRules2") 
                        : game.i18n.localize("abfalter.defResCoreRules2")
                    );
                defenderData.dmgInfoPlayer = defenderData.dmgInfoGM;
            }
        }
        defenderData.effectiveArmor = effectiveArmor;
    }

    let basicInfo = {
        portrait: attackerToken?.document?.texture?.src ?? msg.flags?.abfalter?.basicInfo?.portrait ?? "",
        name: attackerToken?.actor?.name ?? msg.flags?.abfalter?.basicInfo?.name ?? "Unknown Attacker",
        userName: "Gamemaster"
    };

    const template = "systems/abfalter/templates/dialogues/diceRolls/resolveCombatCard.hbs"
    const content = await foundry.applications.handlebars.renderTemplate(template, { resolveData, basicInfo, isGM: game.user.isGM });

    const gmUser = game.users.find(u => u.isGM && u.active) || game.users.find(u => u.isGM);
    if (!gmUser) {
        ui.notifications.error("No GM user found.");
        return;
    }

    const chatData = {
        user: gmUser.id,
        speaker: {
            alias: gmUser.name
        },
        content: content,
        flags: {            
            abfalter: {
                resolveData,
                basicInfo,
                customChatHeaderCard: true
            } 
        }
    };

    let rollMode = game.settings.get("core", "messageMode");
    ChatMessage.applyMode(chatData, rollMode);
    await ChatMessage.create(chatData);
}

export async function createEffectResolutionMessage({msg = null, effectDetails = null, workflow = null}) {
    if (msg) {
        effectDetails ??= msg.flags?.abfalter?.effectDetails;
        workflow ??= msg.flags?.abfalter?.workflow;
    }

    if (!effectDetails || !workflow) return;

    const defenderIds = workflow.selectedDefenderIds ?? [];
    const attackerToken = canvas.tokens?.get(workflow.attackerTokenId);

    let finalEffectValue = null;

    if (effectDetails.useProj && msg) {
        const rollData = msg.flags?.abfalter?.rollData ?? [];
        const lastIndex = rollData.length - 1;

        finalEffectValue = Number(
            rollData?.[lastIndex]?.total ??
            effectDetails.value ??
            0
        );
    }

    const resolveData = {
        effectDetails,
        attackerValue: finalEffectValue,
        defenderIds,
        defenderValues: {},
        resolved: false
    };

    for (const id of defenderIds) {
        const targetState = workflow.targetStates?.[id] ?? {};
        const token = canvas.tokens?.get(id);

        if (!token?.actor) continue;

        /*
         * No projection:
         * automatically proceed to resistance.
         */
        if (!effectDetails.useProj) {
            resolveData.defenderValues[id] = {
                portrait: token.document.texture.src,
                name: token.name,

                penetrated: true,
                requiresResistance: true,

                resValue: effectDetails.resValue,
                resTypeList: effectDetails.resTypeList,

                failedRes: false,
                resBonus: 0,

                useImmunity: effectDetails.useImmunity === true,
                immunityType: effectDetails.immunityType ?? ""
            };

            continue;
        }

        /*
         * Projection:
         * compare attack vs defense normally.
         */
        const defenseTotal = Number(targetState.finalValue ?? 0);
        const diff = finalEffectValue - defenseTotal;
        const effectiveArmor = effectDetails.useAT ? Math.max(0, Number(targetState.armorFinal ?? 0)) : 0;
        const damagePercent = diff > 0 ? calculateDamagePercentage(diff, effectiveArmor) : 0;
        const penetrated = damagePercent >= 0.10;
        const failedRes = !penetrated;

        const requiresResistance =
            penetrated ||
            (failedRes && effectDetails.resOnFailedProj === true);

        const resBonus = failedRes && effectDetails.resOnFailedProj
            ? Number(effectDetails.failedProjResBonus) || 0
            : 0;

        resolveData.defenderValues[id] = {
            portrait: token.document.texture.src,
            name: token.name,

            defenseTotal,
            difference: diff,

            armorFinal: Number(targetState.armorFinal ?? 0),
            effectiveArmor,

            hypotheticalDamagePercentage: Math.round(damagePercent * 100),

            penetrated,
            requiresResistance,

            resValue: effectDetails.resValue,
            resTypeList: effectDetails.resTypeList,

            failedRes,
            resBonus,

            useImmunity: effectDetails.useImmunity === true,
            immunityType: effectDetails.immunityType ?? "",

            defenseSubLabel: targetState.defenseSubLabel,
            defenseName: targetState.defenseName,
            formula: targetState.formula ?? ""
        };
    }

    const basicInfo = {
        portrait: attackerToken?.document?.texture?.src ?? "",
        name: attackerToken?.actor?.name ?? "",
        userName: game.user.isGM ? game.i18n.localize("abfalter.gm") : game.user.name
    };

    const template = "systems/abfalter/templates/dialogues/diceRolls/resolveEffectCard.hbs";
    const content =
        await foundry.applications.handlebars.renderTemplate(template, {
            resolveData,
            basicInfo,
            isGM: game.user.isGM
        });

    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({
            actor: attackerToken?.actor
        }),
        content,
        flags: {
            abfalter: {
                resolveData,
                basicInfo,
                customChatHeaderCard: true,
                effectResolution: true
            }
        }
    };

    const rollMode = game.settings.get("core", "messageMode");
    ChatMessage.applyMode(chatData, rollMode);

    await ChatMessage.create(chatData);
}

export function calculateCoreExxetDmgPercentage(diff,armorCount) {
    return Math.floor((diff - 20 - 10 * armorCount) / 10) / 10;
}

export function calculateDamagePercentage(diff, armorCount) {
    if (diff <= 0) return 0;

    if (armorCount === 0) {
        if (diff < 30) return 0;
        if (diff < 40) return 0.10;
        if (diff < 50) return 0.30;
        if (diff < 60) return 0.50;
        return (Math.floor((diff - 60) / 10) + 6) * 0.10;
    }

    if (armorCount === 1) {
        if (diff < 30) return 0;
        if (diff < 40) return 0.10;
        if (diff < 50) return 0.20;
        if (diff < 60) return 0.40;
        return (Math.floor((diff - 60) / 10) + 5) * 0.10;
    }

    if (armorCount >= 2) {
        const start = armorCount * 10;
        if (diff <= start) return 0;
        return Math.floor((diff - start) / 10) * 0.10;
    }

    return 0;
}

export function updateResolveDamagePreview(msg, html, ev) {
    const radio = ev.currentTarget;
    if (!radio.checked) return;

    const multiplier = Number(radio.value);

    const defenderContainer = radio.closest(".resolveDefenderContainer");
    if (!defenderContainer) return;

    const baseDamage = Number(defenderContainer.dataset.baseDamage ?? 0);
    const totalDamageEl = defenderContainer.querySelector(".resolveDefenderTotalDamageValue");
    if (!totalDamageEl) return;

    const newDamage = Math.floor(baseDamage * multiplier);
    totalDamageEl.textContent = newDamage;
}

const applyingDamageMessages = new Set();

export async function resolveApplyDamageToActors(msg, html, ev) {
    if (applyingDamageMessages.has(msg.id) || msg.flags?.abfalter?.resolveData?.resolved) {
        ui.notifications.info("This damage resolution has already been applied.");
        return;
    }
    applyingDamageMessages.add(msg.id);
    try {
    const rows = html.querySelectorAll(".resolveDefenderContainer");
    const template = "systems/abfalter/templates/dialogues/diceRolls/resolveCombatCard.hbs"

    const resolveData = foundry.utils.deepClone(msg.flags?.abfalter?.resolveData ?? {});
    const basicInfo = foundry.utils.deepClone(msg.flags?.abfalter?.basicInfo ?? {});

    for (const row of rows) {
        const defenderId = row.dataset.defenderId;
        if (!defenderId) continue;

        const baseDamage = Number(row.dataset.baseDamage ?? 0);
        const checkedRadio = row.querySelector('.resolveDmgOption input[type="radio"]:checked');
        const multiplier = Number(checkedRadio?.value ?? 1);
        const totalDmg = Math.floor(baseDamage * multiplier);

        if (resolveData.defenderValues?.[defenderId]) {
            resolveData.defenderValues[defenderId].totalDmg = totalDmg;
        }

        const token = canvas.tokens?.get(defenderId);
        if (!token) {
            console.warn(`No token found for defenderId: ${defenderId}`);
            continue;
        }

        const actor = token.actor;
        if (!actor) {
            console.warn(`No actor found for token: ${defenderId}`);
            continue;
        }

        const hpPath = "system.lp.value";
        const currentLife = Number(foundry.utils.getProperty(actor, hpPath) ?? 0);
        const newLife = currentLife + totalDmg;

        await actor.update({
            [hpPath]: newLife
        });
    }

    resolveData.resolved = true;

    const content = await foundry.applications.handlebars.renderTemplate(template, {
        resolveData,
        basicInfo
    });

    await msg.update({
        content,
        "flags.abfalter.resolveData": resolveData,
    });
    } finally {
        applyingDamageMessages.delete(msg.id);
    }
}


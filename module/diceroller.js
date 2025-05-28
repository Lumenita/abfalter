import { abfalter } from "./config.js";
import { abfalterSettingsKeys } from "./utilities/abfalterSettings.js";

const diceDialog = class extends Dialog {
    activateListeners(html) {
        super.activateListeners(html);
        html.find('.collapsable').click(ev => {
            const li = $(ev.currentTarget).next();
            li.toggle("fast");
        });
    }
}

export async function openModifierDialogue(actorData, finalValue, label, type) {
    const gameCopy = game;

    const template = "systems/abfalter/templates/dialogues/basicModifiers.hbs";
    let confirmed = false;
    let removeFatigue = false;
    if (type == "resRoll" || type == "potentialRoll" || type == "summoningRoll") {
        removeFatigue = true;
    }

    // Skip dialog if shift key is held TODO
    if (event.shiftKey) {
        console.log('shift key held, skipping attack dialog.');
        switch (type) {
            case "characteristicRoll":
                rollCharacteristic(null, actorData, finalValue, label);
                break;
            case "secondaryRoll":
            case "potentialRoll":
            case "summoningRoll":
            case "combatRoll":
                let newLabel = game.i18n.localize("abfalter." + label);
                plainRoll(null, actorData, finalValue, newLabel);
                break;
            case "customSecondaryRoll":
                plainRoll(null, actorData, finalValue, label);
                break;
            case "resRoll":
                rollResistance(null, actorData, finalValue, label);
                break;
            default:
                console.log("(Shift Key)Error: No plainRoll type found.");
                ui.notifications.error("(Shift Key)Error: No plainRoll type found.");
                return;
        }
        return;
    }

    const html = await foundry.applications.handlebars.renderTemplate(template, { removeFatigue: removeFatigue });

    new diceDialog({
        title: gameCopy.i18n.localize('abfalter.dialogs.diceRoller'),
        class: "baseAbfalter",
        content: html,
        buttons: {
            roll: { label: gameCopy.i18n.localize('abfalter.dialogs.roll'), callback: () => confirmed = true },
            cancel: { label: gameCopy.i18n.localize('abfalter.dialogs.cancel'), callback: () => confirmed = false }
        },
        render: ($html) => {
            const fatigueValue = parseInt($html.find('#fatigueDropdown').val(), 10) || 0;
            const $fatigueDropdown = $html.find('#fatigueDropdown');

            const fatigueVal = actorData.system.fatigue.value;
            const maxFatigue = actorData.system.kiAbility.kiUseOfEne.status ? 5 : 2;

            // Fatigue dropdown
            const populateFatigueDropdown = () => {
                $fatigueDropdown.empty();
                const availableFatigue = Math.min(maxFatigue, fatigueVal);
                for (let i = 0; i <= availableFatigue; i++) {
                    $fatigueDropdown.append(`<option value="${i}">${i}</option>`);
                }
            };
            populateFatigueDropdown();
        },
        close: html => {
            if (confirmed) {
                const fatigueUsed = parseInt(html.find('#fatigueDropdown').val()) 

                actorData.update({ "system.fatigue.value": Math.floor(actorData.system.fatigue.value - fatigueUsed) });

                switch (type) {
                    case "characteristicRoll":
                        rollCharacteristic(html, actorData, finalValue, label);
                        break;
                    case "secondaryRoll":
                    case "potentialRoll":
                    case "summoningRoll":
                    case "combatRoll":
                        let newLabel = game.i18n.localize("abfalter." + label);
                        plainRoll(html, actorData, finalValue, newLabel);
                        break;
                    case "customSecondaryRoll":
                        plainRoll(html, actorData, finalValue, label);
                        break;
                    case "resRoll":
                        rollResistance(html, actorData, finalValue, label);
                        break;
                    default:
                        console.log("No Roll Function Implemented for this type");
                        break;
                }
            }
        }
    }).render(true);
}

export async function rollCharacteristic(html, actorData, finalValue, label) {
    let fatigueMod = 0;
    let mod = 0;
    if (html != null) {
        fatigueMod = parseInt(html.find('#fatigueDropdown').val()) || 0;
        mod = parseInt(html.find('#modifierMod').val()) || 0;
    }

    let baseDice = "1d10";
    let rollFormula = `${baseDice} + ${finalValue} + ${fatigueMod} + ${mod}`;
    let rollResult = await new Roll(rollFormula, actorData).roll();
    rollResult.rolledDice = rollResult.total - finalValue - fatigueMod - mod;
    let roll = parseInt(rollResult.total);

    rollResult.color = "";
    rollResult.fumble = false;
    rollResult.explode = false;
    if (rollResult.rolledDice == 1) {
        rollResult.color = "fumbleRoll";
        rollResult.newTotal = roll - 3;
        rollResult.fumble = true;
    } else if (rollResult.rolledDice == 10) {
        rollResult.color = "openRoll";
        rollResult.newTotal = roll + 2;
        rollResult.explode = true;
    } else {
        rollResult.color = "normalRoll";
        rollResult.newTotal = roll;
    }

    const template = "systems/abfalter/templates/dialogues/diceRolls/characteristicRoll.hbs"
    const content = await foundry.applications.handlebars.renderTemplate(template, { rollResult: rollResult, label: label });
    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actorData: actorData }),
        sound: CONFIG.sounds.dice,
        content: content
    };

    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
    ChatMessage.create(chatData);
}

/** Generic plain roll function.
 * @param {html} html - Mod/fatigue from the dialog
 * @param {Actor} actor - the actor data
 * @param {Number} finalValue - the actors final value of the roll
 * @param {string} label - the label for the roll
 */
export async function plainRoll(html, actor, finalValue, label) {
    let fatigueMod = 0;
    let mod = 0;
    if (html != null) {
        fatigueMod = parseInt(html.find('#fatigueDropdown').val()) || 0;
        mod = parseInt(html.find('#modifierMod').val()) || 0;
    }

    let fatigueFinal = Math.floor(fatigueMod * 15);
    let baseDice = "1d100";
    let rollFormula = `${baseDice} + ${finalValue} + ${fatigueFinal} + ${mod}`
    const rollResult = await new Roll(rollFormula, actor).roll();
    rollResult.rolledDice = rollResult.total - finalValue - fatigueFinal - mod;
    let formula = `(${rollResult.rolledDice}) + ${finalValue}(${game.i18n.localize("abfalter.value")}) + ${fatigueFinal}(${game.i18n.localize("abfalter.fatigue")}) + ${mod}(${game.i18n.localize("abfalter.mod")})`

    let fumbleRange = actor.system.fumleRange.final;
    if (finalValue > 199 && fumbleRange > 1) {
        fumbleRange -= 1;
    }
    rollResult.color = "";
    rollResult.fumbleLevel = 0;
    rollResult.fumble = false;
    rollResult.explode = false;
    rollResult.doubles = false;
    rollResult.openRange = actor.system.rollRange.final;

    const doubleValues = [11, 22, 33, 44, 55, 66, 77, 88];
    const isDouble = actor.system.rollRange.doubles === true && doubleValues.includes(rollResult.rolledDice);
    rollResult.doubles = isDouble;

    if (rollResult.rolledDice <= fumbleRange) {
        rollResult.color = "fumbleRoll";
        rollResult.fumble = true;
        while (fumbleRange > rollResult.rolledDice) {
            rollResult.fumbleLevel += 15;
            fumbleRange--;
        }
    } else if (rollResult.rolledDice >= rollResult.openRange || isDouble) {
        rollResult.color = "openRoll";
        rollResult.explode = true;
        if (!isDouble || rollResult.rolledDice > rollResult.openRange) {
            rollResult.openRange = rollResult.rolledDice;
        }
    } else {
        rollResult.color = "normalRoll";
    }

    let openRollSetting = game.settings.get('abfalter', abfalterSettingsKeys.Corrected_OpenRoll);
    if (openRollSetting == true) {
        rollResult.openRange = actor.system.rollRange.final;
    }

    let num = 0;
    const rollData = [];
    rollData[0] = {
        roll: rollResult.rolledDice, total: rollResult._total, doubles: rollResult.doubles, openRange: rollResult.openRange, label: label, fumbleLevel: rollResult.fumbleLevel,
        fumble: rollResult.fumble, explode: rollResult.explode, result: rollResult.result, color: rollResult.color, formula: formula
    };
    const template = "systems/abfalter/templates/dialogues/diceRolls/plainRoll.hbs"
    const content = await foundry.applications.handlebars.renderTemplate(template, { rollData: rollData, label: label, actor: actor });
    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        sound: CONFIG.sounds.dice,
        content: content,
        rolls: [rollResult],
        flags: {
            abfalter: {
                rollData: rollData,
                num: num
            }
        }
    };
    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
    ChatMessage.create(chatData);
}

/** Open rolls for plain rolls.
 * @param {html} msg Chat message object containing the roll data.
 */
export async function plainOpenRollFunction(msg) {
    let actor = game.actors.get(msg.speaker.actor);
    let num = msg.flags.abfalter.num;
    let oldData = msg.flags.abfalter.rollData[num];
    let baseDice = "1d100";
    let rollFormula = `${baseDice} + ${oldData.total}`
    let rollResult = await new Roll(rollFormula).roll();

    rollResult.rolledDice = rollResult.total - oldData.total;
    let formula =`(${rollResult.rolledDice}) + ${oldData.total}(${game.i18n.localize("abfalter.prevRoll")})`;
    rollResult.color = "normalRoll";
    rollResult.openRange = oldData.openRange;    
    let isDouble = rollResult.rolledDice % 11 === 0 && rollResult.rolledDice <= 88;

    let openRollSetting = game.settings.get('abfalter', abfalterSettingsKeys.Corrected_OpenRoll);

    if (openRollSetting == true) {
        //Core Open Roll Logic
        rollResult.openRange = oldData.openRange + 1;
        const meetsOpenThreshold = rollResult.rolledDice >= (rollResult.openRange + 1);
        const qualifiesForDoubles = oldData.doubles === true && isDouble === true;

        if (meetsOpenThreshold || qualifiesForDoubles) {
            rollResult.color = "openRoll";
            rollResult.explode = true;
        } else {
            rollResult.color = "normalRoll";
            rollResult.explode = false;
        }
    } else {
        const isGreaterThanPrevious = rollResult.rolledDice > oldData.rolledDice;
        const isGreaterThanOpen = rollResult.rolledDice > oldData.openRange;
        if(rollResult.rolledDice === 100) {
            rollResult.color = "openRoll";
            rollResult.explode = true;
            rollResult.openRange = 100;
        } else if (isDouble && isGreaterThanPrevious) {
            rollResult.color = "openRoll";
            rollResult.explode = true;
            if (isGreaterThanOpen) rollResult.openRange = rollResult.rolledDice;
        } else if (isGreaterThanOpen) {
            rollResult.color = "openRoll";
            rollResult.explode = true;
            rollResult.openRange = rollResult.rolledDice;
        } else {
            rollResult.color = "normalRoll";
            rollResult.explode = false;
        }
    }

    msg.flags.abfalter.rollData[num] = {
        roll: oldData.rolledDice, total: oldData.total, doubles: null, openRange: null, label: oldData.label,
        explode: false, result: oldData.result, color: oldData.color, formula: oldData.formula
    };
    num = num + 1;
    msg.flags.abfalter.rollData[num] = {
        roll: rollResult.rolledDice, total: rollResult._total, doubles: oldData.doubles, openRange: rollResult.openRange, label: oldData.label,
        explode: rollResult.explode, result: rollResult.result, color: rollResult.color, formula: formula
    };

    const rollData = msg.flags.abfalter.rollData;
    let template;
    switch (msg.flags.abfalter.type) {
        case "weapon":
            template = "systems/abfalter/templates/dialogues/diceRolls/weaponRoll.hbs";
            break;
        default:
            template = "systems/abfalter/templates/dialogues/diceRolls/plainRoll.hbs";
            break;
    }
    const content = await foundry.applications.handlebars.renderTemplate(template, { rollData: msg.flags.abfalter.rollData, actor: actor });
    game.messages.get(msg._id).update({
        content: content,
        flags: {            
            abfalter: {
                rollData: rollData,
                num: num
            } 
        }
    });
}

/** Fumble rolls for plain rolls.
 * @param {html} msg Chat message object containing the roll data.
 */
export async function plainFumbleRollFunction(msg) {
    let fumbleSettings = game.settings.get('abfalter', abfalterSettingsKeys.Corrected_Fumble);
    let actor = game.actors.get(msg.speaker.actor);
    let num = msg.flags.abfalter.num;
    let oldData = msg.flags.abfalter.rollData[num];

    let baseDice = "1d100";
    let rollFormula = ``;

    if (fumbleSettings == true) {
        rollFormula = `${oldData.total} - ${baseDice}`;
    } else {
        rollFormula = `${oldData.total} - ${baseDice} - ${oldData.fumbleLevel}`;
    };
    let rollResult = await new Roll(rollFormula).roll();
    rollResult.rolledDice = rollResult.total - oldData.total;
    let fumbleRollDiceValue = rollResult.total - oldData.total + oldData.fumbleLevel;
    let formula = ``;

    if (fumbleSettings == true) {
        formula = `${oldData.total}(Previous Roll) + ${rollResult.rolledDice}(Roll)`;
    } else {
        formula = `${oldData.total}(Previous Roll) + ${fumbleRollDiceValue}(Roll) - ${oldData.fumbleLevel}(Fumble Level)`;
    };
console.log("Fumble Roll Formula", formula);
    msg.flags.abfalter.rollData[num] = {
        roll: oldData.rolledDice, total: oldData.total, label: oldData.label,
        explode: false, result: oldData.result, color: oldData.color, fumble: false, formula: oldData.formula
    };
    num = num + 1;
    msg.flags.abfalter.rollData[num] = {
        roll: rollResult.rolledDice, total: rollResult._total, label: oldData.label,
        result: rollResult.result, color: oldData.color, showSeverity: true, formula: formula
    };

    const rollData = msg.flags.abfalter.rollData;
    let template;
    switch (msg.flags.abfalter.type) {
        case "weapon":
            template = "systems/abfalter/templates/dialogues/diceRolls/weaponRoll.hbs";
            break;
        default:
            template = "systems/abfalter/templates/dialogues/diceRolls/plainRoll.hbs";
            break;
    }
    const content = await foundry.applications.handlebars.renderTemplate(template, { rollData: msg.flags.abfalter.rollData, actor: actor });
    game.messages.get(msg._id).update({
        content: content,
        flags: {
            abfalter: {
                rollData: rollData,
                num: num
            }
        }
    });
}

/** Rolls the 5 resistances for the actor.
 * @param {html} html - Mod from the dialog
 * @param {Actor} actorData - the actor rolling the resistance
 * @param {Number} finalValue - the actors final value of the resistance
 * @param {string} label - the label for the roll
 */
export async function rollResistance(html, actorData, finalValue, label) {
    let mod = 0;
    if (html != null) {
        mod = parseInt(html.find('#modifierMod').val()) || 0;
    }

    let baseDice = "1d100";
    let rollFormula = `${baseDice} + ${finalValue} + ${mod}`;
    let rollResult = await new Roll(rollFormula, actorData).roll();
    rollResult.rolledDice = rollResult.total - finalValue - mod;

    rollResult.color = "";
    rollResult.fumble = false;
    rollResult.explode = false;
    if (rollResult.rolledDice == 1) {
        rollResult.color = "fumbleRoll";
        rollResult.fumble = true;
    } else if (rollResult.rolledDice == 100) {
        rollResult.color = "openRoll";
        rollResult.explode = true;
    } else {
        rollResult.color = "normalRoll";
    }

    const template = "systems/abfalter/templates/dialogues/resRoll.html"
    const content = await foundry.applications.handlebars.renderTemplate(template, { rollResult: rollResult, label: label });
    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actorData: actorData }),
        sound: CONFIG.sounds.dice,
        content,
    };
    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
    ChatMessage.create(chatData);
}

/** Opens the weapon profile dialog for the selected weapon.
 * @param {Actor} actor - The actor using the weapon.
 * @param {string} label - The label for the dialog.
 * @param {string} wepId - The ID of the weapon.
 * @param {string} wepType - The type of the weapon (e.g., "melee", "ranged", "shield").
 * @param {string} actionType - The type of profile (e.g., "attack", "block", "dodge").
 * @param {string} profileType - The action type (e.g., "offensive", "defensive").
 */
export async function openWeaponProfileDialogue(actor, label, wepId, wepType, actionType, profileType, indexOverrideValue) {
    console.log("Profile Handle Test Start", wepType);
    const weapon = actor.items.get(wepId);

    // Skip dialog if shift key is held TODO
    if (event.shiftKey) {
        console.log('shift key held, skipping attack dialog.');
        let basicProfileDetails = {};
        switch (actionType) {
            case 'attack':
                basicProfileDetails = {
                    label: game.i18n.localize("abfalter.attack"),
                    name: "",
                    base: weapon.system.derived.baseAtk,
                    value: weapon.system.derived.baseAtk,
                    formula: `${weapon.system.derived.baseAtk}(${game.i18n.localize("abfalter.value")})`,
                    dmg: weapon.system.melee.baseDmg,
                    dmgType: weapon.system.primDmgT,
                    atPen: weapon.system.melee.finalATPen,
                    target: game.i18n.localize("abfalter.none"),
                    ammo: 0,
                    chosenAt: "",
                    wepType: wepType,
                    actionType: actionType,
                    profileType: profileType
                };
                break;
            case 'block':
                basicProfileDetails = {
                    label: game.i18n.localize("abfalter.block"),
                    name: "",
                    base: weapon.system.derived.baseBlk,
                    value: weapon.system.derived.baseBlk,
                    formula: `${weapon.system.derived.baseBlk}(${game.i18n.localize("abfalter.value")})`,
                    dmg: "",
                    dmgType: "",
                    atPen: "",
                    target: "",
                    ammo: 0,
                    chosenAt: "",
                    wepType: wepType,
                    actionType: actionType,
                    profileType: profileType
                };
                break;
            case 'dodge':
                basicProfileDetails = {
                    label: game.i18n.localize("abfalter.dodge"),
                    name: "",
                    base: weapon.system.derived.baseDod,
                    value: weapon.system.derived.baseDod,
                    formula: `${weapon.system.derived.baseDod}(${game.i18n.localize("abfalter.value")})`,
                    dmg: "",
                    dmgType: "",
                    atPen: "",
                    target: "",
                    ammo: 0,
                    chosenAt: "",
                    wepType: wepType,
                    actionType: actionType,
                    profileType: profileType
                };
                break;
            default:
                console.log("(Shift Key)Error: No profile type found.");
                ui.notifications.error("(Shift Key)Error: No profile type found.");
                return;
        }
        weaponRoll(actor, weapon, basicProfileDetails);
        return;
    }
    if (wepType === "ranged" && weapon.system.ranged.infiniteAmmo === false && weapon.system.ranged.magSize <= 0) {
        ui.notifications.warn(game.i18n.localize("abfalter.noAmmoPrompt"));
    }

    const allAttacks = Object.values(weapon.system.attacks ?? {}); // Turns Attacks into the usual array format for index

    const isMelee = wepType === "melee";
    const baseAttackValue = {
        name: "Base Weapon",
        profileType: "both",
        ignorePrecision: false,
        ignoreVorpal: false,
        ignoreThrown: false,
        quantityConsumed: false,
        consumedValue: 1,
        rangedAmmoConsumed: true,
        rangedAmmoConsumedValue: 1,
        finalAttack: weapon.system.derived.baseAtk ?? 0,
        finalBlock: weapon.system.derived.baseBlk ?? 0,
        finalDodge: weapon.system.derived.baseDod ?? 0,
        finalDamage: isMelee
            ? weapon.system.melee.baseDmg ?? 0
            : weapon.system.ranged.ammoDamageFinal ?? 0,
        finalAtPen: isMelee
            ? weapon.system.melee.finalATPen ?? 0
            : weapon.system.ranged.ammoAtPenFinal ?? 0,
        damage: 0,
        atPen: 0,
        breakage: 0,
        finalBreakage: 0,
    };
    // filtered list with base at index 0
    let attacks = [baseAttackValue].concat(
        allAttacks.filter(atk => {
            const atkType = atk.profileType?.trim().toLowerCase();
            const filterType = profileType?.trim().toLowerCase();
            const match = atkType === "both" || atkType === filterType;
            return match;
        })
    );
    console.log("All Attacks", attacks);

    const templateData = {
        weaponType: wepType,
        profileType: profileType,
        actionType: actionType,
        weapon,
        attacks,
        label,
    }
    const template = "systems/abfalter/templates/dialogues/weaponPrompts/weaponProfile.hbs";
    const htmlContent = await foundry.applications.handlebars.renderTemplate(template, templateData);

    let confirmed = false, usedIndex = 0;

    if (typeof indexOverrideValue === 'number' && indexOverrideValue >= 0) {
        usedIndex = indexOverrideValue;
        console.log('error 0')
    } else {
        switch (profileType) {
            case 'offensive':
                usedIndex = weapon.system.info.lastWepUsed < attacks.length ? weapon.system.info.lastWepUsed : 0;
                break;
            case 'defensive':
                usedIndex = weapon.system.info.lastDefUsed < attacks.length ? weapon.system.info.lastDefUsed : 0;
                break;
            default:
                console.log("(Find Used Index)Error: No action type found.");
                ui.notifications.error("(Find Used Index)Error: No action type found.");
                return;
        }
    }
    let finalValue = 0, finalFormula = "", fatigueUsed = 0, ammoUsed = 0, ammoIdUsed = "", RangedAmmoUsed = 0;
    let wepValue = 0;// Current selected attack's base value

    //armor values for defensive rolls
    const armorType = [
        { tag: 'showAll', name: game.i18n.localize('abfalter.showAll'), atValue: 0 },
        { tag: 'cut', name: game.i18n.localize('abfalter.cut'), atValue: actor.system.armor.body.aCutFinal },
        { tag: 'imp', name: game.i18n.localize('abfalter.imp'), atValue: actor.system.armor.body.aImpFinal },
        { tag: 'thr', name: game.i18n.localize('abfalter.thr'), atValue: actor.system.armor.body.aThrFinal },
        { tag: 'heat', name: game.i18n.localize('abfalter.heat'), atValue: actor.system.armor.body.aHeatFinal },
        { tag: 'cold', name: game.i18n.localize('abfalter.cold'), atValue: actor.system.armor.body.aColdFinal },
        { tag: 'ele', name: game.i18n.localize('abfalter.ele'), atValue: actor.system.armor.body.aEleFinal },
        { tag: 'ene', name: game.i18n.localize('abfalter.ene'), atValue: actor.system.armor.body.aEneFinal }
    ];

    // Helper: Update the final roll value and button label
    const updateFinalValue = ($html) => {
        const selectedModifier = parseInt($html.find('#modifierSelect').val(), 10);
        const fatigueValue = parseInt($html.find('#fatigueDropdown').val(), 10) || 0;
        const modifierValue = parseInt($html.find('#modifierMod').val(), 10) || 0;
        const selectedPenalty = parseInt($html.find('#directedAtkDropdown :selected').data('penalty'), 10);
        const multDefPenalty = parseInt($html.find('#defNumberDropdown :selected').data('penalty'), 10);

        fatigueUsed = fatigueValue;

        switch (actionType) {
            case 'attack':
                finalValue = wepValue + (fatigueValue * 15) + modifierValue + selectedPenalty + selectedModifier;
                finalFormula = `${wepValue}(${game.i18n.localize("abfalter.value")}) + ${fatigueValue * 15}(${game.i18n.localize("abfalter.fatigue")}) + ${modifierValue}(${game.i18n.localize("abfalter.mod")}) + ${selectedPenalty}(${game.i18n.localize("abfalter.aim")}) + ${selectedModifier}(${game.i18n.localize("abfalter.action")})`;
                break;
            case 'block':
            case 'dodge':
                finalValue = wepValue + (fatigueValue * 15) + modifierValue + multDefPenalty;
                finalFormula = `${wepValue}(${game.i18n.localize("abfalter.value")}) + ${fatigueValue * 15}(${game.i18n.localize("abfalter.fatigue")}) + ${modifierValue}(${game.i18n.localize("abfalter.mod")}) + ${multDefPenalty}(${game.i18n.localize("abfalter.multipleDef")})`;
                break;
            default:
                console.log("(Update FInal Value)Error: No action type found.");
                ui.notifications.error("(Update FInal Value)Error: No action type found.");
                return;
        }

        $html.closest('.dialog').find('.dialog-button:first').text(`${game.i18n.localize("abfalter.dialogs.roll")}: ${finalValue}`);
    }

    new diceDialog({
        title: `${weapon.name} ${game.i18n.localize('abfalter.' + actionType)}`,
        content: htmlContent,
        buttons: {
            roll: { label: `${game.i18n.localize("abfalter.dialogs.roll")}: ${finalValue}`, callback: () => confirmed = true },
            cancel: { label: game.i18n.localize('abfalter.dialogs.cancel'), callback: () => confirmed = false }
        },
        render: ($html) => {
            // Cache frequently used selectors
            const $attackSelect = $html.find('#attackSelect');
            const $modifierSelect = $html.find('#modifierSelect');
            const $modifierInput = $html.find('#modifierMod');
            const $fatigueDropdown = $html.find('#fatigueDropdown');
            const $atkDmgTypeDropdown = $html.find('#atkDmgTypeDropdown');
            const $directedAtkDropdown = $html.find('#directedAtkDropdown');
            const $ammoDropdown = $html.find('#ammoDropdown');
            const $defNumberDropdown = $html.find('#defNumberDropdown');
            const $armorDropdown = $html.find('#armorDropdown');

            const fatigueVal = actor.system.fatigue.value;
            const maxFatigue = actor.system.kiAbility.kiUseOfEne.status ? 5 : 2;

            const directedAtk = [
                { tag: 'none', name: game.i18n.localize('abfalter.none'), penalty: 0 },
                { tag: 'head', name: game.i18n.localize('abfalter.head'), penalty: -60 },
                { tag: 'eye', name: game.i18n.localize('abfalter.eye'), penalty: -100 },
                { tag: 'neck', name: game.i18n.localize('abfalter.neck'), penalty: -80 },
                { tag: 'shoulder', name: game.i18n.localize('abfalter.shoulder'), penalty: -30 },
                { tag: 'arm', name: game.i18n.localize('abfalter.arm'), penalty: -20 },
                { tag: 'elbow', name: game.i18n.localize('abfalter.elbow'), penalty: -60 },
                { tag: 'wrist', name: game.i18n.localize('abfalter.wrist'), penalty: -40 },
                { tag: 'hand', name: game.i18n.localize('abfalter.hand'), penalty: -40 },
                { tag: 'heart', name: game.i18n.localize('abfalter.heart'), penalty: -60 },
                { tag: 'torso', name: game.i18n.localize('abfalter.torso'), penalty: -10 },
                { tag: 'abdomen', name: game.i18n.localize('abfalter.abdomen'), penalty: -20 },
                { tag: 'groin', name: game.i18n.localize('abfalter.groin'), penalty: -60 },
                { tag: 'thigh', name: game.i18n.localize('abfalter.thigh'), penalty: -20 },
                { tag: 'knee', name: game.i18n.localize('abfalter.knee'), penalty: -40 },
                { tag: 'calf', name: game.i18n.localize('abfalter.calf'), penalty: -10 },
                { tag: 'foot', name: game.i18n.localize('abfalter.foot'), penalty: -50 }
            ];
            const damageTypes = {
                NONE: game.i18n.localize('abfalter.na'),
                CUT: game.i18n.localize('abfalter.cut'),
                IMP: game.i18n.localize('abfalter.imp'),
                THR: game.i18n.localize('abfalter.thr'),
                HEAT: game.i18n.localize('abfalter.heat'),
                COLD: game.i18n.localize('abfalter.cold'),
                ELE: game.i18n.localize('abfalter.ele'),
                ENE: game.i18n.localize('abfalter.ene')
            };
            const defensePenalty = [
                { tag: 'first', name: game.i18n.localize('abfalter.firstDef'), penalty: 0 },
                { tag: 'second', name: game.i18n.localize('abfalter.secondDef'), penalty: -30 },
                { tag: 'third', name: game.i18n.localize('abfalter.thirdDef'), penalty: -50 },
                { tag: 'fourth', name: game.i18n.localize('abfalter.fourthDef'), penalty: -70 },
                { tag: 'fifth', name: game.i18n.localize('abfalter.fifthDef'), penalty: -90 }
            ];

            const vorpalLocation = weapon.system.info.vorpalLocation;
            const vorpalModifier = weapon.system.info.vorpalMod;
            let isPrecise = weapon.system.info.precision && !attacks[usedIndex].ignorePrecision;
            let isVorpal = weapon.system.info.vorpal && !attacks[usedIndex].ignoreVorpal;

            // --- Populate Dropdowns ---

            // Attack options
            $attackSelect.empty();
            attacks.forEach((attack, index) => {
                $attackSelect.append(`<option value="${index}">${attack.name}</option>`);
            });
            $attackSelect.val(usedIndex);

            // Damage type dropdown
            const populateAtkTypeDropdown = () => {
                $atkDmgTypeDropdown.empty();
                let availableTypes = [];
                if (wepType === "ranged") {
                    const ammoDmgType = weapon.system.ranged.ammoDmgType;
                    if (!ammoDmgType || ammoDmgType.toLowerCase() === "none") {
                        $atkDmgTypeDropdown.append(
                            `<option value="" selected>${game.i18n.localize('abfalter.noDamageType')}</option>`
                        );
                        return;
                    }
                    if (ammoDmgType === "ANY") {
                        availableTypes = Object.keys(damageTypes).filter(type => type !== "NONE");
                    } else {
                        availableTypes = [ammoDmgType];
                    }
                    const primaryType = availableTypes[0];
                    availableTypes.forEach(type => {
                        $atkDmgTypeDropdown.append(
                            `<option value="${type}" ${type === primaryType ? 'selected' : ''}>${type}</option>`
                        );
                    });
                    return;
                }
                const primaryType = weapon.system.primDmgT === "ANY" ? "CUT" : weapon.system.primDmgT;
                if (weapon.system.primDmgT === "ANY" || weapon.system.secDmgT === "ANY") {
                    availableTypes = Object.keys(damageTypes).filter(type => type !== "NONE");
                } else {
                    if (weapon.system.primDmgT !== "NONE") availableTypes.push(weapon.system.primDmgT);
                    if (weapon.system.secDmgT !== "NONE" && weapon.system.secDmgT !== weapon.system.primDmgT)
                        availableTypes.push(weapon.system.secDmgT);
                }
                if (!availableTypes.length) {
                    $atkDmgTypeDropdown.append(`<option value="" selected>${game.i18n.localize('abfalter.noDamageType')}</option>`);
                    return;
                }
                availableTypes.forEach(type => {
                    const optionText =
                        type === weapon.system.primDmgT || weapon.system.primDmgT === "ANY"
                            ? `${game.i18n.localize('abfalter.primaryShort')} ${type}`
                            : type === weapon.system.secDmgT || weapon.system.secDmgT === "ANY"
                                ? `${game.i18n.localize('abfalter.secondaryShort')} ${type}`
                                : type;
                    $atkDmgTypeDropdown.append(`<option value="${type}" ${type === primaryType ? 'selected' : ''}>${optionText}</option>`);
                });
            };
            populateAtkTypeDropdown();

            // Modifier select
            $modifierSelect.empty();
            for (let i = 0; i < 10; i++) {
                const value = -25 * i;
                $modifierSelect.append(`<option value="${value}">${game.i18n.localize(`abfalter.activeAction${i + 1}`)}</option>`);
            }
            $modifierSelect.val(0);

            // Fatigue dropdown
            const populateFatigueDropdown = () => {
                $fatigueDropdown.empty();
                const availableFatigue = Math.min(maxFatigue, fatigueVal);
                for (let i = 0; i <= availableFatigue; i++) {
                    $fatigueDropdown.append(`<option value="${i}">${i}</option>`);
                }
            };
            populateFatigueDropdown();

            // Directed attack dropdown
            const populateDirectedAtkDropdown = () => {
                $directedAtkDropdown.empty();
                directedAtk.forEach(part => {
                    let penalty = part.penalty;
                    if (isPrecise && penalty !== 0) penalty = Math.floor(penalty / 2);
                    if (isVorpal && (vorpalLocation === part.tag || vorpalLocation === "anywhere")) penalty = vorpalModifier;
                    if (part.tag === "none") penalty = 0;
                    $directedAtkDropdown.append(`<option value="${part.tag}" data-penalty="${penalty}">${part.name} (${penalty})</option>`);
                });
            };
            populateDirectedAtkDropdown();

            // Multiple defense dropdown
            const populateDefNumberDropdown = () => {
                $defNumberDropdown.empty();
                defensePenalty.forEach(part => {
                    $defNumberDropdown.append(`<option value="${part.tag}" data-penalty="${part.penalty}">${part.name} (${part.penalty})</option>`);
                });
            };
            populateDefNumberDropdown();

            // Armor dropdown
            const populateArmorDropdownDropdown = () => {
                $armorDropdown.empty();
                armorType.forEach(part => {
                    $armorDropdown.append(`<option value="${part.tag}" data-penalty="${part.atValue}">${part.name} (${part.atValue})</option>`);
                });
            };
            populateArmorDropdownDropdown();



            // --- Event Handlers ---

            // When the attack selection changes
            $attackSelect.on('change', function () {
                usedIndex = $(this).val();
                const selectedAttack = attacks[usedIndex];
                isPrecise = weapon.system.info.precision && !attacks[usedIndex].ignorePrecision;
                isVorpal = weapon.system.info.vorpal && !attacks[usedIndex].ignoreVorpal;
                populateDirectedAtkDropdown();
                ammoUsed = (weapon.system.melee.throwable && !attacks[usedIndex].ignoreThrown && !attacks[usedIndex].quantityConsumed)
                    ? attacks[usedIndex].consumedValue : 0;
                RangedAmmoUsed = weapon.system.ranged.infiniteAmmo ? (attacks[usedIndex].rangedAmmoConsumed ? 0 : attacks[usedIndex].rangedAmmoConsumedValue) : attacks[usedIndex].rangedAmmoConsumedValue;
                $html.find('#attackPower').text(selectedAttack.finalAttack);
                $html.find('#defensePower').text(selectedAttack.finalBlock);
                $html.find('#dodgePower').text(selectedAttack.finalDodge);
                $html.find('#damageNum').text(selectedAttack.finalDamage);
                $html.find('#atPenNum').text(selectedAttack.finalAtPen);
                switch (actionType) {
                    case 'attack':
                        wepValue = selectedAttack.finalAttack;
                        break;
                    case 'block':
                        wepValue = selectedAttack.finalBlock;
                        break;
                    case 'dodge':
                        wepValue = selectedAttack.finalDodge;
                        break;
                    default:
                        console.log("(Setting Weapon Base Value)Error: No profile type found.");
                        ui.notifications.error("(Setting Weapon Base Value)Error: No profile type found.");
                        return;
                }

                updateFinalValue($html);
            });

            // If weapon is ranged, populate and handle ammo dropdown changes
            if (wepType === "ranged") {
                $ammoDropdown.empty();
                weapon.system.ranged.ammoIds.forEach(ammo => {
                    $ammoDropdown.append(`<option value="${ammo.id}">${ammo.name}</option>`);
                });
                ammoIdUsed = weapon.system.ranged.selectedAmmo;
                $ammoDropdown.val(weapon.system.ranged.selectedAmmo);
                $ammoDropdown.on('change', function () {
                    ammoIdUsed = $(this).val();
                    let ammoDamage = 0;
                    let ammoDmgType = "";
                    let ammoBreak = 0;
                    let ammoAtPen = 0;
                    if (ammoIdUsed === "special") {
                        ammoDamage = weapon.system.ranged.specialDmg;
                        ammoDmgType = weapon.system.ranged.specialDmgType;
                        ammoBreak = weapon.system.ranged.specialBreak;
                        ammoAtPen = weapon.system.ranged.specialAtPen;
                    } else {
                        const ammoItem = weapon.parent.items.get(ammoIdUsed);
                        ammoDamage = ammoItem?.system.damage || 0;
                        ammoDmgType = ammoItem?.system.dmgType || "";
                        ammoBreak = ammoItem?.system.break || 0;
                        ammoAtPen = ammoItem?.system.atPen || 0;
                    }

                    weapon.system.ranged.ammoDamage = ammoDamage;
                    weapon.system.ranged.ammoDmgType = ammoDmgType;
                    weapon.system.ranged.ammoBreak = ammoBreak;
                    weapon.system.ranged.ammoAtPen = ammoAtPen;
                    weapon.system.ranged.ammoDamageFinal = ammoDamage + weapon.system.ranged.ammoDmgMod + weapon.system.ranged.bonusDmgKi + (weapon.system.ranged.showStrFields ? weapon.system.ranged.strMod : 0);
                    weapon.system.ranged.ammoBreakFinal = ammoBreak + weapon.system.ranged.ammoBreakMod;
                    weapon.system.ranged.ammoAtPenFinal = ammoAtPen + weapon.system.ranged.ammoAtPenMod;

                    // Update each attack's ammo-dependent values
                    attacks.forEach(attack => {
                        attack.finalAtPen = attack.atPen + weapon.system.ranged.ammoAtPenFinal;
                        attack.finalBreakage = attack.breakage + weapon.system.ranged.ammoBreakFinal;

                        attack.finalDamage = attack.damage + (attack.dmgOverride ? 0 : weapon.system.ranged.ammoDamageFinal);
                    });

                    const selectedAttack = attacks[$attackSelect.val()];
                    $html.find('#attackPower').text(selectedAttack.finalAttack);
                    $html.find('#damageNum').text(selectedAttack.finalDamage);
                    $html.find('#atPenNum').text(selectedAttack.finalAtPen);
                    populateAtkTypeDropdown();
                    updateFinalValue($html);
                });
            }

            // Update final value when related inputs change
            $fatigueDropdown.on('change', () => updateFinalValue($html));
            $modifierSelect.on('change', () => updateFinalValue($html));
            $defNumberDropdown.on('change', () => updateFinalValue($html));
            $directedAtkDropdown.on('change', () => updateFinalValue($html));
            $modifierInput.on('input', () => updateFinalValue($html));

            // Trigger initial change to populate values
            $attackSelect.trigger('change');
        },
        close: ($html) => {
            if (confirmed) {
                actor.update({ "system.fatigue.value": Math.floor(actor.system.fatigue.value - fatigueUsed) });
                const ammoName = wepType === "ranged" ? weapon.parent.items.get(ammoIdUsed)?.name : "No Arrow";

                if (typeof indexOverrideValue === 'number' && indexOverrideValue >= 0) {
                } else {
                    switch (profileType) {
                        case 'offensive':
                            weapon.update({
                                'system.info.lastWepUsed': usedIndex,
                                'system.melee.throwQuantity': Math.floor(weapon.system.melee.throwQuantity - ammoUsed)
                            });
                            break;
                        case 'defensive':
                            weapon.update({
                                'system.info.lastDefUsed': usedIndex,
                                'system.melee.throwQuantity': Math.floor(weapon.system.melee.throwQuantity - ammoUsed)
                            });
                            break;
                        default:
                            console.log("(Set Last Index)Error: No action type found.");
                            ui.notifications.error("(Set Last Index)Error: No action type found.");
                            return;
                    }
                }
                if (wepType === "ranged" && actionType === "attack") {
                    const ammoItem = actor.items.get(ammoIdUsed);
                    if (ammoItem) {
                        ammoItem.update({ 'system.quantity': Math.floor(ammoItem.system.quantity - RangedAmmoUsed) });
                        if (weapon.system.ranged.magSize - RangedAmmoUsed <= 0) {
                            weapon.update({ 'system.ranged.magSize': 0 });
                            weapon.update({ 'system.ranged.readyToFire': false });

                        } else {
                            weapon.update({ 'system.ranged.magSize': weapon.system.ranged.magSize - RangedAmmoUsed });
                        }

                    }
                    weapon.update({ 'system.ranged.selectedAmmo': ammoIdUsed });
                }
                let armorContent = "";

                if (profileType === "defensive") {
                    const selectedTag = $html.find('#armorDropdown').val();
                    let typesToShow = [];
                    if (selectedTag === 'showAll') {
                        typesToShow = F.filter(t => t.tag !== 'showAll');
                    } else {
                        typesToShow = armorType.filter(t => t.tag === selectedTag);
                    }
                    const namesRow = typesToShow.map(type => `<td><strong>${type.name}</strong></td>`).join("");
                    const valuesRow = typesToShow.map(type => `<td>${type.atValue}</td>`).join("");

                    armorContent = `
                    <table class="armorDisplay" style="text-align:center; width:100%">
                        <tr>${namesRow}</tr>
                        <tr>${valuesRow}</tr>
                    </table>
                `;

                }

                const attackDetails = {
                    label: game.i18n.localize('abfalter.' + actionType),
                    name: attacks[usedIndex].name,
                    base: weapon.system.derived.baseAtk,
                    value: finalValue,
                    formula: finalFormula,
                    dmg: parseInt($html.find('#damageNum').text(), 10),
                    dmgType: $html.find('#atkDmgTypeDropdown').val(),
                    atPen: parseInt($html.find('#atPenNum').text(), 10),
                    target: $html.find('#directedAtkDropdown').val(),
                    ammoName: ammoName,
                    chosenAt: armorContent,
                    wepType: wepType,
                    profileType: profileType,
                    actionType: actionType
                };
                weaponRoll(actor, weapon, attackDetails);
                console.log('Attack Handle Finished');
            }
        }
    }).render(true);
}

/** Rolls the weapon attack and sends the result to chat.
 * @param {Actor} actor - The actor using the weapon.
 * @param {Object} weapon - The weapon being used.
 * @param {Object} attackDetails - The details of the roll from OpenWeaponProfileDialogue.
 */
async function weaponRoll(actor, weapon, attackDetails) {
    let baseDice = "1d100";
    let rollFormula = `${baseDice} + ${attackDetails.value}`;
    const rollResult = await new Roll(rollFormula, actor).roll();
    rollResult.rolledDice = rollResult.total - attackDetails.value;
    attackDetails.formula = `(${rollResult.rolledDice}) + ${attackDetails.formula}`;
    attackDetails.wepName = weapon.name;

    let fumbleRange = weapon.system.derived.baseFumbleRange;
    if (attackDetails.base > 199 && fumbleRange > 1) {
        fumbleRange -= 1;
    }
    rollResult.color = "";
    rollResult.fumbleLevel = 0;
    rollResult.fumble = false;
    rollResult.explode = false;
    rollResult.doubles = false;
    rollResult.openRange = weapon.system.derived.baseOpenRollRange;

    const doubleValues = [11, 22, 33, 44, 55, 66, 77, 88];
    const isDouble = actor.system.rollRange.doubles === true && doubleValues.includes(rollResult.rolledDice);
    rollResult.doubles = isDouble;

    if (rollResult.rolledDice <= fumbleRange) {
        rollResult.color = "fumbleRoll";
        rollResult.fumble = true;
        while (fumbleRange > rollResult.rolledDice) {
            rollResult.fumbleLevel += 15;
            fumbleRange--;
        }
    } else if (rollResult.rolledDice >= rollResult.openRange || isDouble) {
        rollResult.color = "openRoll";
        rollResult.explode = true;
        if (!isDouble || rollResult.rolledDice > rollResult.openRange) {
            rollResult.openRange = rollResult.rolledDice;
        }
    } else {
        rollResult.color = "normalRoll";
    }

    let openRollSetting = game.settings.get('abfalter', abfalterSettingsKeys.Corrected_OpenRoll);
    if (openRollSetting == true) {
        rollResult.openRange = actor.system.rollRange.final;
    }

    let num = 0;
    let type = "weapon";
    let armorContent = "";

    console.log(attackDetails.actionType);
    if (attackDetails.actionType === "block" || attackDetails.actionType === "dodge") {
        const armorType = [
            { tag: 'cut', name: game.i18n.localize('abfalter.cut'), atValue: actor.system.armor.body.aCutFinal },
            { tag: 'imp', name: game.i18n.localize('abfalter.imp'), atValue: actor.system.armor.body.aImpFinal },
            { tag: 'thr', name: game.i18n.localize('abfalter.thr'), atValue: actor.system.armor.body.aThrFinal },
            { tag: 'heat', name: game.i18n.localize('abfalter.heat'), atValue: actor.system.armor.body.aHeatFinal },
            { tag: 'cold', name: game.i18n.localize('abfalter.cold'), atValue: actor.system.armor.body.aColdFinal },
            { tag: 'ele', name: game.i18n.localize('abfalter.ele'), atValue: actor.system.armor.body.aEleFinal },
            { tag: 'ene', name: game.i18n.localize('abfalter.ene'), atValue: actor.system.armor.body.aEneFinal }
        ];

        const namesRow = armorType.map(type => `<td><strong>${type.name}</strong></td>`).join("");
        const valuesRow = armorType.map(type => `<td>${type.atValue}</td>`).join("");

        armorContent = `
            <table class="armorDisplay" style="text-align:center; width:100%">
                <tr>${namesRow}</tr>
                <tr>${valuesRow}</tr>
            </table>
        `;
    }
    attackDetails.chosenAt = armorContent;

    const rollData = [];
    rollData[0] = {
        roll: rollResult.rolledDice, total: rollResult._total, doubles: rollResult.doubles, openRange: rollResult.openRange, fumbleLevel: rollResult.fumbleLevel,
        fumble: rollResult.fumble, explode: rollResult.explode, color: rollResult.color, formula: attackDetails.formula, label: `${attackDetails.name} ${attackDetails.label}`
    };

    const template = "systems/abfalter/templates/dialogues/diceRolls/weaponRoll.hbs"
    const content = await foundry.applications.handlebars.renderTemplate(template, { rollData: rollData, actor: actor, attackDetails: attackDetails });
    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        sound: CONFIG.sounds.dice,
        content: content,
        rolls: [rollResult],
        flags: {            
            abfalter: {
                attackDetails: attackDetails,
                rollData: rollData,
                num: num,
                type: type
            } 
        }
    };
    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
    ChatMessage.create(chatData);
}

/** Rolls the profile open roll and updates the result on chat msg.
 */
export async function profileOpenRollFunction(msg) {
    let actor = game.actors.get(msg.speaker.actor);
    let num = msg.flags.abfalter.num;
    let oldData = msg.flags.abfalter.rollData[msg.flags.abfalter.num];

    let baseDice = "1d100";
    let rollFormula = `${baseDice} + ${oldData.total}`;
    let rollResult = await new Roll(rollFormula).roll();

    rollResult.rolledDice = rollResult.total - oldData.total;
    let formula = `(${rollResult.rolledDice}) + ${oldData.total}(${game.i18n.localize("abfalter.prevRoll")})`;
    rollResult.color = "normalRoll";
    rollResult.openRange = oldData.openRange;
    let isDouble = rollResult.rolledDice % 11 === 0 && rollResult.rolledDice <= 88;

    let openRollSetting = game.settings.get('abfalter', abfalterSettingsKeys.Corrected_OpenRoll);

    if (openRollSetting == true) {
        //Core Open Roll Logic
        rollResult.openRange = oldData.openRange + 1;
        const meetsOpenThreshold = rollResult.rolledDice >= (rollResult.openRange + 1);
        const qualifiesForDoubles = oldData.doubles === true && isDouble === true;

        if (meetsOpenThreshold || qualifiesForDoubles) {
            rollResult.color = "openRoll";
            rollResult.explode = true;
        } else {
            rollResult.color = "normalRoll";
            rollResult.explode = false;
        }
    } else {
        const isGreaterThanPrevious = rollResult.rolledDice > oldData.rolledDice;
        const isGreaterThanOpen = rollResult.rolledDice > oldData.openRange;
        if(rollResult.rolledDice === 100) {
            rollResult.color = "openRoll";
            rollResult.explode = true;
            rollResult.openRange = 100;
        } else if (isDouble && isGreaterThanPrevious) {
            rollResult.color = "openRoll";
            rollResult.explode = true;
            if (isGreaterThanOpen) rollResult.openRange = rollResult.rolledDice;
        } else if (isGreaterThanOpen) {
            rollResult.color = "openRoll";
            rollResult.explode = true;
            rollResult.openRange = rollResult.rolledDice;
        } else {
            rollResult.color = "normalRoll";
            rollResult.explode = false;
        }
    }

    msg.flags.abfalter.rollData[num].doubles = null;
    msg.flags.abfalter.rollData[num].openRange = null;
    msg.flags.abfalter.rollData[num].explode = false;
    num = num + 1;
    msg.flags.abfalter.rollData[num] = {
        roll: rollResult.rolledDice,
        total: rollResult._total,
        doubles: oldData.doubles,
        openRange: rollResult.openRange,
        label: `Open Roll #${num}`,
        explode: rollResult.explode,
        formula: formula,
        color: rollResult.color
    };

    const rollData = msg.flags.abfalter.rollData;
    let template;
    template = "systems/abfalter/templates/dialogues/diceRolls/weaponRoll.hbs";

    const content = await foundry.applications.handlebars.renderTemplate(template, { rollData: msg.flags.abfalter.rollData, actor: actor, attackDetails: msg.flags.abfalter.attackDetails });
    game.messages.get(msg._id).update({
        content: content,
        flags: {
            abfalter: {
                rollData: rollData,
                num: num
            }
        }
    });
}

/** Rolls the profile fumble roll and updates the result on chat msg.
 */
export async function profileFumbleRollFunction(msg) {
    let fumbleSettings = game.settings.get('abfalter', abfalterSettingsKeys.Corrected_Fumble);
    let actor = game.actors.get(msg.speaker.actor);
    let num = msg.flags.abfalter.num;
    let oldData = msg.flags.abfalter.rollData[num];

    let baseDice = "1d100";
    let rollFormula = ``;

    if (fumbleSettings == true) {
        rollFormula = `${oldData.total} - ${baseDice}`;
    } else {
        rollFormula = `${oldData.total} - ${baseDice} - ${oldData.fumbleLevel}`;
    };
    let rollResult = await new Roll(rollFormula).roll();

    rollResult.rolledDice = rollResult.total - oldData.total + oldData.fumbleLevel;
    let fumbleS = oldData.fumbleLevel - rollResult.rolledDice;
    let formula = ``;

    if (fumbleSettings == true) {
        formula = `${oldData.total}(${game.i18n.localize("abfalter.prevRoll")}) + ${rollResult.rolledDice}(Roll)`;
    } else {
        formula = `${oldData.total}(${game.i18n.localize("abfalter.prevRoll")}) + ${rollResult.rolledDice}(Roll) - ${oldData.fumbleLevel}(Fumble Level)`;
    };

    rollResult.color = "fumbleRoll";
    msg.flags.abfalter.rollData[num].doubles = null;
    msg.flags.abfalter.rollData[num].openRange = null;
    msg.flags.abfalter.rollData[num].explode = false;
    msg.flags.abfalter.rollData[num].fumble = false;
    num = num + 1;
    msg.flags.abfalter.rollData[num] = {
        roll: rollResult.rolledDice, total: rollResult._total, doubles: null, openRange: null, label: `Fumble Result`,
        explode: false, formula: formula, color: rollResult.color, showSeverity: true, fumble: false, fumbleS: fumbleS
    };
    const rollData = msg.flags.abfalter.rollData;
    let template;
    template = "systems/abfalter/templates/dialogues/diceRolls/weaponRoll.hbs";

    const content = await foundry.applications.handlebars.renderTemplate(template, { rollData: msg.flags.abfalter.rollData, actor: actor, attackDetails: msg.flags.abfalter.attackDetails });
    game.messages.get(msg._id).update({
        content: content,
        flags: {
            abfalter: {
                rollData: rollData,
                num: num
            }
        }
    });
}

/** Opens the trap dialogue for melee weapons.
 * @param {Actor} actor - The actor using the weapon.
 * @param {string} label - The label for the dialogue.
 * @param {string} wepId - The ID of the weapon being used.
 */
export async function openMeleeTrapDialogue(actor, label, wepId) {
    let confirmed = false;
    const weapon = actor.items.get(wepId);
    const attacks = Object.values(weapon.system.attacks ?? {}); // Turns Attacks into the usual array format for index

    if (attacks.length === 0) {
        console.log("No Attacks Found, using default trap");
        ui.notifications.error(game.i18n.localize("abfalter.trapError"));
        //function here
        return;
    }

    //Values to send to roll function or actor update
    let usedIndex = (weapon.system.info.lastWepUsed < attacks.length) ? weapon.system.info.lastWepUsed : 0;
    let trapType = attacks[usedIndex].trappingType;
    let finalValue = 0;
    let finalFormula = "";

    if (event.shiftKey) {
        console.log('shift key held, skipping trap dialog.');
        const basisTrapDetails = {
            label: `${attacks[usedIndex].name} ${game.i18n.localize("abfalter.trap")}`,
            name: attacks[usedIndex].name,
            wepName: weapon.name,
            value: attacks[usedIndex].trappingValue,
            formula: `${attacks[usedIndex].trappingValue}(${game.i18n.localize("abfalter.value")})`,
            type: attacks[usedIndex].trappingType
        };
        trapRoll(actor, basisTrapDetails);
        return;
    }
    usedIndex = -1; //Reset to default, prepare for user selection

    const template = "systems/abfalter/templates/dialogues/weaponPrompts/trapAtk.hbs";
    const html = await foundry.applications.handlebars.renderTemplate(template, { weapon: weapon }, { attacks: attacks }, { label: label });

    new diceDialog({
        title: game.i18n.localize('abfalter.trapAttack'),
        content: html,
        buttons: {
            roll: { label: game.i18n.localize('abfalter.dialogs.roll'), callback: () => confirmed = true },
            cancel: { label: game.i18n.localize('abfalter.dialogs.cancel'), callback: () => confirmed = false }
        },
        render: (html) => {
            const attackSelect = html.find('#attackSelect');
            const modifierInput = html.find('#modifierMod');
            let trapValue = '';
            let usedFormula = "";

            attacks.forEach((attack, index) => {
                if (!attacks[index].ignoreTrapping) {
                    const option = document.createElement('option');
                    option.value = index;
                    option.text = attack.name;
                    attackSelect.append(option);
                    if (usedIndex === -1) {
                        usedIndex = index;
                        trapValue = attacks[usedIndex].trappingValue;
                    }
                }
            });
            attackSelect.val(usedIndex); //Default to last used attack

            attackSelect.change(function () {
                const selectedIndex = $(this).val();
                usedIndex = selectedIndex;
                const selectedAttack = attacks[selectedIndex]

                trapValue = selectedAttack.trappingValue;
                trapType = selectedAttack.trappingType;

                updateFinalValue();
            });

            function updateFinalValue() {
                const modifierValue = parseInt(modifierInput.val(), 10) || 0;
                finalValue = trapValue + modifierValue;
                finalFormula = `${trapValue}(${game.i18n.localize("abfalter.value")}) + ${modifierValue}(${game.i18n.localize("abfalter.mod")})`;
                if (trapType === true) {
                    usedFormula = `${finalValue}`;
                } else {
                    usedFormula = `1d10 + ${finalValue}`;
                }

                const rollButton = html.closest('.dialog').find('.dialog-button:first');
                rollButton.text(`${game.i18n.localize("abfalter.dialogs.roll")}: ${usedFormula}`);
            }

            modifierInput.on('input', updateFinalValue);
            attackSelect.trigger('change');
        },
        close: html => {
            if (confirmed) {
                console.log('Trap Handle Finished');
                const trapDetails = {
                    label: `${attacks[usedIndex].name} ${game.i18n.localize("abfalter.trap")}`,
                    name: attacks[usedIndex].name,
                    wepName: weapon.name,
                    value: finalValue,
                    formula: finalFormula,
                    type: trapType
                }
                trapRoll(actor, trapDetails);
            }
        }
    }).render(true);
    return;
}

/** Rolls the trap and sends the result to chat.
 * @param {Actor} actor - The actor using the weapon.
 * @param {Object} trapDetails - The details of the trap from openMeleeTrapDialogue.
 */
async function trapRoll(actor, trapDetails) {
    let baseDice = "1d10";
    let rollFormula = (trapDetails.type === true) ? `${trapDetails.value}` : `${baseDice} + ${trapDetails.value}`;

    const rollResult = await new Roll(rollFormula, actor).roll();
    rollResult.rolledDice = rollResult.total - trapDetails.value;

    rollResult.color = "";
    rollResult.fumble = false;
    rollResult.explode = false;

    switch (rollResult.rolledDice) {
        case 1:
            rollResult.color = "fumbleRoll";
            rollResult.fumble = true;
            rollResult.newTotal = rollResult.total - 3;
            trapDetails.formula = `(${rollResult.rolledDice} - 3) + ${trapDetails.formula}`;
            break;
        case 10:
            rollResult.color = "openRoll";
            rollResult.explode = true;
            rollResult.newTotal = rollResult.total + 2;
            trapDetails.formula = `(${rollResult.rolledDice} + 2) + ${trapDetails.formula}`;
            break;
        default:
            rollResult.color = "normalRoll";
            rollResult.newTotal = rollResult.total;
            trapDetails.formula = (trapDetails.type === true) ? `${trapDetails.formula}` : `(${rollResult.rolledDice}) + ${trapDetails.formula}`;
            break;
    }

    const template = "systems/abfalter/templates/dialogues/diceRolls/trapRoll.hbs"
    const content = await foundry.applications.handlebars.renderTemplate(template, { actor: actor, rollResult: rollResult, trapDetails: trapDetails });
    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        sound: CONFIG.sounds.dice,
        content: content
    };
    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
    ChatMessage.create(chatData);
}

/** Opens the break dialogue for melee weapons.
 * @param {Actor} actor - The actor using the weapon.
 * @param {string} label - The label for the dialogue.
 * @param {string} wepId - The ID of the weapon being used.
 * @param {string} wepType - The type of the weapon (melee or ranged).
 */
export async function openMeleeBreakDialogue(actor, label, wepId, wepType) {
    const weapon = actor.items.get(wepId);
    const attacks = Object.values(weapon.system.attacks ?? {}); // Turns Attacks into the usual array format for index

    if (!attacks.length) {
        console.log("Error: No Profiles Found, please create a profile for this weapon.");
        ui.notifications.error(game.i18n.localize("abfalter.noProfilesfound"));
        return;
    }

    let usedIndex = weapon.system.info.lastWepUsed < attacks.length ? weapon.system.info.lastWepUsed : 0;
    let finalValue = 0; let ammoIdUsed = ""; let breakValue = 0; let finalFormula = "";
    let confirmed = false;

    if (event.shiftKey) {
        console.log('shift key held, skipping trap dialog. TODO');
        ui.notifications.error("Not implemented yet");
        //TODO
        return;
    }

    const templateData = {
        weaponType: wepType,
        weapon,
        attacks,
        label,
    };
    const template = "systems/abfalter/templates/dialogues/weaponPrompts/weaponBreak.hbs";
    const htmlContent = await foundry.applications.handlebars.renderTemplate(template, templateData);

    const updateFinalValue = ($html) => {
        const modifierValue = parseInt($html.find('#modifierMod').val(), 10) || 0;
        finalValue = breakValue + modifierValue
        finalFormula = `${breakValue}(${game.i18n.localize("abfalter.value")}) + ${modifierValue}(${game.i18n.localize("abfalter.mod")})`;
        $html.closest('.dialog').find('.dialog-button:first').text(`${game.i18n.localize("abfalter.dialogs.roll")}: ${finalValue} + 1d10`);
    };

    new diceDialog({
        title: `${weapon.name} ${game.i18n.localize('abfalter.breakRoll')}`,
        content: htmlContent,
        buttons: {
            roll: { label: `${game.i18n.localize("abfalter.dialogs.roll")}: ${finalValue}`, callback: () => confirmed = true },
            cancel: { label: game.i18n.localize('abfalter.dialogs.cancel'), callback: () => confirmed = false }
        },
        render: ($html) => {
            const $attackSelect = $html.find('#attackSelect');
            const $modifierInput = $html.find('#modifierMod');
            const $ammoDropdown = $html.find('#ammoDropdown');

            // Attack options
            $attackSelect.empty();
            attacks.forEach((attack, index) => {
                $attackSelect.append(`<option value="${index}">${attack.name}</option>`);
            });
            $attackSelect.val(usedIndex);

            $attackSelect.change(function () {
                usedIndex = $(this).val();
                const selectedAttack = attacks[usedIndex];

                breakValue = selectedAttack.finalBreakage;
                updateFinalValue($html);
            });

            if (wepType === "ranged") {
                $ammoDropdown.empty();
                weapon.system.ranged.ammoIds.forEach(ammo => {
                    $ammoDropdown.append(`<option value="${ammo.id}">${ammo.name}</option>`);
                });
                ammoIdUsed = weapon.system.ranged.selectedAmmo;
                $ammoDropdown.val(weapon.system.ranged.selectedAmmo);
                $ammoDropdown.on('change', function () {
                    ammoIdUsed = $(this).val();
                    let ammoDamage = 0;
                    let ammoDmgType = "";
                    let ammoBreak = 0;
                    let ammoAtPen = 0;
                    if (ammoIdUsed === "special") {
                        ammoDamage = weapon.system.ranged.specialDmg;
                        ammoDmgType = weapon.system.ranged.specialDmgType;
                        ammoBreak = weapon.system.ranged.specialBreak;
                        ammoAtPen = weapon.system.ranged.specialAtPen;
                    } else {
                        const ammoItem = weapon.parent.items.get(ammoIdUsed);
                        ammoDamage = ammoItem?.system.damage || 0;
                        ammoDmgType = ammoItem?.system.dmgType || "";
                        ammoBreak = ammoItem?.system.break || 0;
                        ammoAtPen = ammoItem?.system.atPen || 0;
                    }

                    weapon.system.ranged.ammoDamage = ammoDamage;
                    weapon.system.ranged.ammoDmgType = ammoDmgType;
                    weapon.system.ranged.ammoBreak = ammoBreak;
                    weapon.system.ranged.ammoAtPen = ammoAtPen;
                    weapon.system.ranged.ammoDamageFinal = ammoDamage + weapon.system.ranged.ammoDmgMod;
                    weapon.system.ranged.ammoBreakFinal = ammoBreak + weapon.system.ranged.ammoBreakMod;
                    weapon.system.ranged.ammoAtPenFinal = ammoAtPen + weapon.system.ranged.ammoAtPenMod;

                    // Update each attack's ammo-dependent values
                    attacks.forEach(attack => {
                        attack.finalAtPen = attack.atPen + weapon.system.ranged.ammoAtPenFinal;
                        attack.finalBreakage = attack.breakage + weapon.system.ranged.ammoBreakFinal;
                        attack.finalDamage = attack.damage + weapon.system.ranged.ammoDamageFinal;
                    });

                    const selectedAttack = attacks[$attackSelect.val()];
                    breakValue = selectedAttack.finalBreakage;
                    updateFinalValue($html);
                });
            }



            $modifierInput.on('input', () => updateFinalValue($html));
            $attackSelect.trigger('change');
        },
        close: ($html) => {
            if (confirmed) {
                console.log('Breakage Handle Finished');
                const ammoName = wepType === "ranged" ? weapon.parent.items.get(ammoIdUsed)?.name : "No Arrow";

                const breakDetails = {
                    label: `${attacks[usedIndex].name} ${game.i18n.localize("abfalter.breakageShort")}`,
                    name: attacks[usedIndex].name,
                    wepName: weapon.name,
                    wepType: wepType,
                    value: finalValue,
                    formula: finalFormula,
                    ammoName: ammoName,
                }
                breakRoll(actor, breakDetails);
            }
        }
    }).render(true);
}

/** Rolls the break and sends the result to chat.
 * @param {Actor} actor - The actor using the weapon.
 * @param {Object} breakDetails - The details of the break from openMeleeBreakDialogue.
 */
async function breakRoll(actor, breakDetails) {
    let baseDice = "1d10";
    let rollFormula = `${baseDice} + ${breakDetails.value}`;

    const rollResult = await new Roll(rollFormula, actor).roll();
    rollResult.rolledDice = rollResult.total - breakDetails.value;

    rollResult.color = "";
    rollResult.fumble = false;
    rollResult.explode = false;

    switch (rollResult.rolledDice) {
        case 1:
            rollResult.color = "fumbleRoll";
            rollResult.fumble = true;
            rollResult.newTotal = rollResult.total - 3;
            breakDetails.formula = `(${rollResult.rolledDice} - 3) + ${breakDetails.formula}`;
            break;
        case 10:
            rollResult.color = "openRoll";
            rollResult.explode = true;
            rollResult.newTotal = rollResult.total + 2;
            breakDetails.formula = `(${rollResult.rolledDice} + 2) + ${breakDetails.formula}`;
            break;
        default:
            rollResult.color = "normalRoll";
            rollResult.newTotal = rollResult.total;
            breakDetails.formula = `(${rollResult.rolledDice}) + ${breakDetails.formula}`;
            break;
    }

    const template = "systems/abfalter/templates/dialogues/diceRolls/breakRoll.hbs"
    const content = await foundry.applications.handlebars.renderTemplate(template, { actor: actor, rollResult: rollResult, breakDetails: breakDetails });
    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        sound: CONFIG.sounds.dice,
        content: content
    };
    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
    ChatMessage.create(chatData);
}


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

export async function openModifierDialogue(actorData, finalValue, label, type, complex) {
    const gameCopy = game;
    
    const template = "systems/abfalter/templates/dialogues/basicModifiers.html";
    let confirmed = false;
    let fatMod = false;
    if (type == "resRoll" || type == "potentialRoll" || type == "summoningRoll" || type == "breakageRoll") {
        fatMod = true;
    }

    const html = await renderTemplate(template, { fatMod: fatMod });
    new diceDialog({
        title: gameCopy.i18n.localize('abfalter.dialogs.diceRoller'),
        content: html,
        buttons: {
            roll: { label: gameCopy.i18n.localize('abfalter.dialogs.roll'), callback: () => confirmed = true },
            cancel: { label: gameCopy.i18n.localize('abfalter.dialogs.cancel'), callback: () => confirmed = false }
        },
        close: html => {
            if (confirmed) {
                switch (type) {
                    case "characteristicRoll":
                        rollCharacteristic(html, actorData, finalValue, label);
                        break;
                    case "secondaryRoll":
                    case "potentialRoll":
                    case "summoningRoll":
                    case "combatRoll":
                        abilityRoll(html, actorData, finalValue, label);
                        break;
                    case "weaponCombatRoll":
                        rollCombatWeapon(html, actorData, finalValue, label, complex);
                        break;
                    case "resRoll":
                        rollResistance(html, actorData, finalValue, label);
                        break;
                    case 'breakageRoll':
                        rollBreakage(html, actorData, finalValue, label);
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
    let fatigueMod = parseInt(html.find('#fatiguemod').val()) || 0;
    let mod = parseInt(html.find('#modifiermod').val()) || 0;

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

    const template = "systems/abfalter/templates/dialogues/chaRoll.html"
    const content = await renderTemplate(template, { rollResult: rollResult, label: label });
    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actorData: actorData }),
        sound: CONFIG.sounds.dice,
        content: content
    };
    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
    ChatMessage.create(chatData);
}

async function abilityRoll(html, actorData, finalValue, label) {
    let fatigueMod = 0;
    let mod = 0;
    if (html != null) {
        fatigueMod = parseInt(html.find('#fatiguemod').val()) || 0;
        mod = parseInt(html.find('#modifiermod').val()) || 0;
    }

    let fatigueFinal = Math.floor(fatigueMod * 15);
    let baseDice = "1d100";
    let rollFormula = `${baseDice} + ${finalValue} + ${fatigueFinal} + ${mod}`
    const rollResult = await new Roll(rollFormula, actorData).roll();
    rollResult.rolledDice = rollResult.total - finalValue - fatigueFinal - mod;

    let fumbleRange = actorData.system.fumleRange.final;  
    if (finalValue > 199 && fumbleRange > 1) {
        fumbleRange -= 1;
    }
    rollResult.color = "";
    rollResult.fumbleLevel = 0;
    rollResult.fumble = false;
    rollResult.explode = false;
    rollResult.doubles = false;
    rollResult.openRange = actorData.system.rollRange.final;

    if (rollResult.rolledDice <= fumbleRange) {
        rollResult.color = "fumbleRoll";
        rollResult.fumble = true;
        while (fumbleRange > rollResult.rolledDice) {
            rollResult.fumbleLevel += 15;
            fumbleRange--;
        }
    } else if (rollResult.rolledDice >= actorData.system.rollRange.final) {
        rollResult.color = "openRoll";
        rollResult.explode = true;
    } else {
        rollResult.color = "normalRoll";
    }
    if (actorData.system.rollRange.doubles === true) {
        rollResult.doubles = true;
        let doubleValues = [11, 22, 33, 44, 55, 66, 77, 88];
        if (doubleValues.includes(rollResult.rolledDice)) {
            rollResult.color = "openRoll";
            rollResult.explode = true;
        }
    }

    let num = 0;
    const rollData = [];
    rollData[0] = {
        roll: rollResult.rolledDice, total: rollResult._total, doubles: rollResult.doubles, openRange: rollResult.openRange, label: label, fumbleLevel: rollResult.fumbleLevel,
        fumble: rollResult.fumble, explode: rollResult.explode, result: rollResult.result, color: rollResult.color
    };
    const template = "systems/abfalter/templates/dialogues/abilityRoll.hbs"
    const content = await renderTemplate(template, { rollData: rollData, label: label, actor: actorData });
    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actorData: actorData }),
        sound: CONFIG.sounds.dice,
        content: content,
        rolls: [rollResult],
        flags: { rollData, actorData, num }
    };
    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
    ChatMessage.create(chatData);
}

async function rollCombatWeapon(html, actorData, finalValue, label, complex) {
    let fatigueMod = parseInt(html.find('#fatiguemod').val()) || 0;
    let mod = parseInt(html.find('#modifiermod').val()) || 0;
    let fatigueFinal = Math.floor(fatigueMod * 15);
    let baseDice = "1d100";
    let rollFormula = `${baseDice} + ${finalValue} + ${fatigueFinal} + ${mod}`
    const rollResult = await new Roll(rollFormula, actorData).roll();
    rollResult.rolledDice = rollResult.total - finalValue - fatigueFinal - mod;

    let fumbleRange = actorData.system.fumleRange.final;
    if (complex == "true") {
        fumbleRange += 2;
    }
    if (finalValue > 199 && fumbleRange > 1) {
        fumbleRange -= 1;
    }

    rollResult.color = "";
    rollResult.fumbleLevel = 0;
    rollResult.fumble = false;
    rollResult.explode = false;
    rollResult.doubles = false;
    rollResult.openRange = actorData.system.rollRange.final;

    if (rollResult.rolledDice <= fumbleRange) {
        rollResult.color = "fumbleRoll";
        rollResult.fumble = true;
        while (fumbleRange > rollResult.rolledDice) {
            rollResult.fumbleLevel += 15;
            fumbleRange--;
        }
    } else if (rollResult.rolledDice >= actorData.system.rollRange.final) {
        rollResult.color = "openRoll";
        rollResult.explode = true;
    } else {
        rollResult.color = "normalRoll";
    }
    if (actorData.system.rollRange.doubles === true) {
        rollResult.doubles = true;
        let doubleValues = [11, 22, 33, 44, 55, 66, 77, 88];
        if (doubleValues.includes(rollResult.rolledDice)) {
            rollResult.color = "openRoll";
            rollResult.explode = true;
        }
    }

    let num = 0;
    const rollData = [];
    rollData[0] = {
        roll: rollResult.rolledDice, total: rollResult._total, doubles: rollResult.doubles, openRange: rollResult.openRange, label: label, fumbleLevel: rollResult.fumbleLevel,
        fumble: rollResult.fumble, explode: rollResult.explode, result: rollResult.result, color: rollResult.color
    };
    const template = "systems/abfalter/templates/dialogues/abilityRoll.hbs"
    const content = await renderTemplate(template, { rollData: rollData, label: label, actor: actorData });
    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actorData: actorData }),
        sound: CONFIG.sounds.dice,
        content: content,
        rolls: [rollResult],
        flags: { rollData, actorData, num }
    };
    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
    ChatMessage.create(chatData);
}

export async function openRollFunction(msg) {
    let actor = msg.flags.actor;
    let num = msg.flags.num;
    let oldData = msg.flags.rollData[num];
    let baseDice = "1d100";
    let rollFormula = `${baseDice} + ${oldData.total}`
    let rollResult = await new Roll(rollFormula).roll();

    rollResult.rolledDice = rollResult.total - oldData.total;
    rollResult.openRange = oldData.openRange;
    rollResult.color = "normalRoll";
    let isDouble = rollResult.rolledDice % 11 === 0 && rollResult.rolledDice <= 88;
    if (rollResult.rolledDice > oldData.roll) {
        if (oldData.doubles === true) {
            if (isDouble === true) {
                rollResult.color = "openRoll";
                rollResult.explode = true;
            } else if (rollResult.rolledDice >= rollResult.openRange) {
                rollResult.color = "openRoll";
                rollResult.explode = true;
            }
        } else {
            if (rollResult.rolledDice >= rollResult.openRange) {
                rollResult.color = "openRoll";
                rollResult.explode = true;
            }
        }
    } else {
        rollResult.color = "normalRoll";
    }
    msg.flags.rollData[num] = {
        roll: oldData.rolledDice, total: oldData.total, doubles: null, openRange: null, label: oldData.label,
        explode: false, result: oldData.result, color: oldData.color
    };
    num = num + 1;
    msg.flags.rollData[num] = {
        roll: rollResult.rolledDice, total: rollResult._total, doubles: oldData.doubles, openRange: oldData.openRange, label: oldData.label,
        explode: rollResult.explode, result: rollResult.result, color: rollResult.color
    };

    const rollData = msg.flags.rollData;
    let template;
    switch (msg.flags.type) {
        case "weapon":
            template = "systems/abfalter/templates/dialogues/diceRolls/weaponRoll.hbs";
            break;
        default:
            template = "systems/abfalter/templates/dialogues/abilityRoll.hbs";
            break;
    }
    const content = await renderTemplate(template, { rollData: msg.flags.rollData, actor: actor });
    game.messages.get(msg._id).update({
        content: content,
        flags: { rollData, num}
    });
}

export async function fumbleRollFunction(msg) {
    let fumbleSettings = game.settings.get('abfalter', abfalterSettingsKeys.Corrected_Fumble);
    let actorData = msg.flags.actorData;
    let num = msg.flags.num;
    let oldData = msg.flags.rollData[num];

    let baseDice = "1d100";
    let rollFormula = ``;

    if (fumbleSettings == true) {
        rollFormula = `${oldData.total} - ${baseDice}`;
    } else {
        rollFormula = `${oldData.total} - ${baseDice} - ${oldData.fumbleLevel}`;
    };
    let rollResult = await new Roll(rollFormula).roll();
    rollResult.rolledDice = rollResult.total - oldData.total;

    msg.flags.rollData[num] = {
        roll: oldData.rolledDice, total: oldData.total, label: oldData.label,
        explode: false, result: oldData.result, color: oldData.color, fumble: false
    };
    num = num + 1;
    msg.flags.rollData[num] = {
        roll: rollResult.rolledDice, total: rollResult._total, label: oldData.label,
         result: rollResult.result, color: oldData.color, showSeverity: true
    };

    const rollData = msg.flags.rollData;
    const template = "systems/abfalter/templates/dialogues/abilityRoll.hbs"
    const content = await renderTemplate(template, { rollData: msg.flags.rollData, actor: actorData });
    game.messages.get(msg._id).update({
        content: content,
        flags: { rollData, num }
    });
}

export async function rollResistance(html, actorData, finalValue, label) {
    let mod = parseInt(html.find('#modifiermod').val()) || 0;

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
    const content = await renderTemplate(template, { rollResult: rollResult, label: label });
    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actorData: actorData }),
        sound: CONFIG.sounds.dice,
        content,
    };
    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
    ChatMessage.create(chatData);
}

export async function rollBreakage(html, actorData, finalValue, label) {
    let mod = parseInt(html.find('#modifiermod').val()) || 0;

    let baseDice = "1d10";
    let rollFormula = `${baseDice} + ${finalValue} + ${mod}`;
    let rollResult = await new Roll(rollFormula, actorData).roll();
    rollResult.rolledDice = rollResult.total - finalValue - mod;

    const template = "systems/abfalter/templates/dialogues/breakRoll.html"
    const content = await renderTemplate(template, { rollResult: rollResult, label: label });
    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actorData: actorData }),
        sound: CONFIG.sounds.dice,
        content: content
    };
    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
    ChatMessage.create(chatData);
}

//New Functions
export async function openMeleeWeaponAtkDialogue(actor, label, wepId) {
    console.log("Attack Handle Test Start"); 
    
    let confirmed = false;
    const weapon = actor.items.get(wepId);
    if (event.shiftKey) {
        console.log('shift key held, skipping attack dialog.');
        const basicAttackDetails = {
            label: game.i18n.localize("abfalter.attack"),
            name: "",
            base: weapon.system.derived.baseAtk,
            value: weapon.system.derived.baseAtk,
            formula: `${weapon.system.derived.baseAtk}(${game.i18n.localize("abfalter.value")})`,
            dmg: weapon.system.melee.baseDmg,
            dmgType: weapon.system.primDmgT,
            atPen: weapon.system.melee.finalATPen,
            target: game.i18n.localize("abfalter.none"),
        };  
        weaponRoll(actor, weapon, basicAttackDetails);
        return;
    }
    const attacks = weapon.system.attacks;
    if (attacks.length === 0) {
        console.log("No Attacks Found, using default attack");
        openModifierDialogue(actor, weapon.system.derived.baseAtk, "Attack", "combatRoll");
        return;
    }
    const template = "systems/abfalter/templates/dialogues/weaponPrompts/meleeAtk.hbs";

    //Values to send to roll function or actor update
    let usedIndex = (weapon.system.info.lastWepUsed < attacks.length) ? weapon.system.info.lastWepUsed : 0;
    let finalValue = 0;
    let finalFormula = "";
    let fatigueUsed = 0;
    let ammoUsed = 0;

    const html = await renderTemplate(template, {weapon: weapon}, {attacks: attacks}, {label: label});

    new diceDialog({
        title: weapon.name + " " + game.i18n.localize('abfalter.attack'),
        content: html,
        buttons: {
            roll: { label: `${game.i18n.localize("abfalter.dialogs.roll")}: ${finalValue}`, callback: () => confirmed = true },
            cancel: { label: game.i18n.localize('abfalter.dialogs.cancel'), callback: () => confirmed = false }
        },
        render: (html) => {
            const attackSelect = html.find('#attackSelect');
            const modifierSelect = html.find('#modifierSelect');
            const modifierInput = html.find('#modifierMod');
            const fatigueDropdown = html.find('#fatigueDropdown');
            const atkDmgTypeDropdown = html.find('#atkDmgTypeDropdown');
            const directedAtkDropdown = html.find('#directedAtkDropdown');
            const fatigueValue = actor.system.fatigue.value;
            const maxFatigue = actor.system.kiAbility.kiUseOfEne.status ? 5 : 2;
            const directedAtk = [
                {tag: 'none', name: game.i18n.localize('abfalter.none'), penalty: 0},
                {tag: 'head', name: game.i18n.localize('abfalter.head'), penalty: -60},
                {tag: 'eye', name: game.i18n.localize('abfalter.eye'), penalty: -100},
                {tag: 'neck', name: game.i18n.localize('abfalter.neck'), penalty: -80},
                {tag: 'shoulder', name: game.i18n.localize('abfalter.shoulder'), penalty: -30},
                {tag: 'arm', name: game.i18n.localize('abfalter.arm'), penalty: -20},
                {tag: 'elbow', name: game.i18n.localize('abfalter.elbow'), penalty: -60},
                {tag: 'wrist', name: game.i18n.localize('abfalter.wrist'), penalty: -40},
                {tag: 'hand', name: game.i18n.localize('abfalter.hand'), penalty: -40},
                {tag: 'heart', name: game.i18n.localize('abfalter.heart'), penalty: -60},
                {tag: 'torso', name: game.i18n.localize('abfalter.torso'), penalty: -10},
                {tag: 'abdomen', name: game.i18n.localize('abfalter.abdomen'), penalty: -20},
                {tag: 'groin', name: game.i18n.localize('abfalter.groin'), penalty: -60},
                {tag: 'thigh', name: game.i18n.localize('abfalter.thigh'), penalty: -20},
                {tag: 'knee', name: game.i18n.localize('abfalter.knee'), penalty: -40},
                {tag: 'calf', name: game.i18n.localize('abfalter.calf'), penalty: -10},
                {tag: 'foot', name: game.i18n.localize('abfalter.foot'), penalty: -50},
            ]
            const damageTypes = {
                NONE: game.i18n.localize('abfalter.armoryTab.na'),
                CUT: game.i18n.localize('abfalter.armoryTab.cut'),
                IMP: game.i18n.localize('abfalter.armoryTab.imp'),
                THR: game.i18n.localize('abfalter.armoryTab.thr'),
                HEAT: game.i18n.localize('abfalter.armoryTab.heat'),
                COLD: game.i18n.localize('abfalter.armoryTab.cold'),
                ELE: game.i18n.localize('abfalter.armoryTab.ele'),
                ENE: game.i18n.localize('abfalter.armoryTab.ene')
            };
            const vorpalLocation = weapon.system.info.vorpalLocation;
            const vorpalModifier = weapon.system.info.vorpalMod;
            let isPrecise = weapon.system.info.precision && !attacks[usedIndex].ignorePrecision;
            let isVorpal = weapon.system.info.vorpal && !attacks[usedIndex].ignoreVorpal;
            let wepValue = 0;

            attacks.forEach((attack, index) => {
              const option = document.createElement('option');
              option.value = index;
              option.text = attack.name;
              attackSelect.append(option);
            });
            attackSelect.val(usedIndex); //Default to last used attack

            const populateAtkTypeDropdown = () => {
                let availableTypes = [];
                const primaryType = weapon.system.primDmgT === "ANY" ? "CUT" : weapon.system.primDmgT;
                if (weapon.system.primDmgT === "ANY" || weapon.system.secDmgT === "ANY") {
                    availableTypes = Object.keys(damageTypes).filter((type) => type !== "NONE");
                } else {
                    if (weapon.system.primDmgT !== "NONE") { availableTypes.push(weapon.system.primDmgT); }
                    if (weapon.system.secDmgT !== "NONE" && weapon.system.secDmgT !== weapon.system.primDmgT) availableTypes.push(weapon.system.secDmgT);
                }

                //If both types are set to None
                if (availableTypes.length === 0) {
                    const noOption = document.createElement('option');
                    noOption.value = "";
                    noOption.text = game.i18n.localize('abfalter.noDamageType');
                    noOption.selected = true;
                    atkDmgTypeDropdown.append(noOption);
                    return;
                }

                availableTypes.forEach((type) => {
                    const option = document.createElement('option');
                    option.value = type;
                    if (type === weapon.system.primDmgT || weapon.system.primDmgT === "ANY") {
                        option.text = game.i18n.localize('abfalter.primaryShort') + ` ${type}`;
                    } else if (type === weapon.system.secDmgT || weapon.system.secDmgT === "ANY") {
                        option.text = game.i18n.localize('abfalter.secondaryShort') + ` ${type}`;
                    } else {
                        option.text = type;
                    }
                    if (type === primaryType) {
                        option.selected = true;
                    }
                    atkDmgTypeDropdown.append(option);
                });
            }
            populateAtkTypeDropdown(); //Default initialization

            for (let i = 0; i < 10; i++) {
                const value = -25 * i;
                const option = document.createElement('option');
                option.value = value;
                option.text = game.i18n.localize(`abfalter.activeAction${i + 1}`);
                modifierSelect.append(option);
            }
            modifierSelect.val(0); //Default to 1st action

            const populateFatigueDropdown = () => {
                const availableFatigue = Math.min(maxFatigue, fatigueValue);
        
                // Add new options
                for (let i = 0; i <= availableFatigue; i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.text = `${i}`;
                    fatigueDropdown.append(option);
                }
            };
            populateFatigueDropdown(); //Default initialization

            const populateDirectedAtkDropdown = () => {      
                directedAtkDropdown.empty();
                directedAtk.forEach((part) => {
                    const option = document.createElement('option');
                    option.value = part.tag;
                    let penalty = part.penalty;
                    // Apply precise modifier
                    if (isPrecise && penalty !== 0) {
                        penalty = Math.floor(penalty / 2);
                    }
                    // Apply vorpal modifier if present & override precise
                    if (isVorpal && (vorpalLocation === part.tag || vorpalLocation === "anywhere")) {
                        penalty = vorpalModifier;
                    }
                    // Double check none = 0
                    if (part.tag === "none") {
                        penalty = 0;
                }
                    option.dataset.penalty = penalty;
                    option.text = `${part.name} (${penalty})`;
                    directedAtkDropdown.append(option);
                });
            };
            populateDirectedAtkDropdown(); //Default initialization

            attackSelect.change(function() {
                const selectedIndex = $(this).val();
                usedIndex = selectedIndex;
                const selectedAttack = attacks[selectedIndex];
                const attackPowerSpan = html.find('#attackPower');
                const damageNum = html.find('#damageNum');
                const atPenNum = html.find('#atPenNum');
                
                isPrecise = weapon.system.info.precision && !attacks[usedIndex].ignorePrecision;
                isVorpal = weapon.system.info.vorpal && !attacks[usedIndex].ignoreVorpal;
                populateDirectedAtkDropdown(); //Repopulate Dropdown in-case precision/vorpal rule changed.
                if (weapon.system.melee.throwable && !attacks[usedIndex].ignoreThrown && !attacks[usedIndex].quantityConsumed) {
                    ammoUsed = attacks[usedIndex].consumedValue;
                } else {
                    ammoUsed = 0;
                }

                attackPowerSpan.text(selectedAttack.finalAttack);  // Update atk span
                damageNum.text(selectedAttack.finalDamage);  // Update dmg span
                atPenNum.text(selectedAttack.finalAtPen);  // Update At pen span

                wepValue = selectedAttack.finalAttack;
                updateFinalValue();
            });

            function updateFinalValue() {
                const selectedModifier = parseInt(modifierSelect.val(), 10);
                const fatigueValue = parseInt(fatigueDropdown.val(), 10) || 0;
                const modifierValue = parseInt(modifierInput.val(), 10) || 0;
                const selectedOption = directedAtkDropdown.find(':selected');
                const selectedPenalty = parseInt(selectedOption.data('penalty'), 10);   
                fatigueUsed = fatigueValue;
            
                finalValue = wepValue + (fatigueValue * 15) + modifierValue + selectedPenalty + selectedModifier;
                finalFormula = `${wepValue}(Value) + ${fatigueValue * 15}(Fatigue) + ${modifierValue}(Mod) + ${selectedPenalty}(Aim) + ${selectedModifier}(Action)`;
                const rollButton = html.closest('.dialog').find('.dialog-button:first');
                rollButton.text(`${game.i18n.localize("abfalter.dialogs.roll")}: ${finalValue}`);
            }

            fatigueDropdown.change(updateFinalValue);
            modifierSelect.change(updateFinalValue);
            directedAtkDropdown.change(updateFinalValue);
            attackSelect.trigger('change');
            modifierSelect.trigger('change');
            directedAtkDropdown.trigger('change');
            modifierInput.on('input', updateFinalValue);
        },
        close: html => {
            if (confirmed) {
                actor.update({ "system.fatigue.value": Math.floor(actor.system.fatigue.value - fatigueUsed) });
                weapon.update({ 'system.info.lastWepUsed': usedIndex, 'system.melee.throwQuantity': Math.floor(weapon.system.melee.throwQuantity - ammoUsed) });
                const attackDetails = {
                    label: game.i18n.localize("abfalter.attack"),
                    name: attacks[usedIndex].name,
                    base: weapon.system.derived.baseAtk,
                    value: finalValue,
                    formula: finalFormula,
                    dmg: parseInt(html.find('#damageNum').text(), 10),
                    dmgType: html.find('#atkDmgTypeDropdown').val(),
                    atPen: parseInt(html.find('#atPenNum').text(), 10),
                    target: html.find('#directedAtkDropdown').val(),
                };  
                weaponRoll(actor, weapon, attackDetails);
                console.log('Attack Handle Finished');
            }
        }
    }).render(true);
}

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
    rollResult.doubles = actor.system.rollRange.doubles;
    rollResult.color = "";
    rollResult.fumbleLevel = 0;
    rollResult.fumble = false;
    rollResult.explode = false;
    rollResult.openRange = weapon.system.derived.baseOpenRollRange;

    if (rollResult.rolledDice <= fumbleRange) {
        rollResult.color = "fumbleRoll";
        rollResult.fumble = true;
        while (fumbleRange > rollResult.rolledDice) {
            rollResult.fumbleLevel += 15;
            fumbleRange--;
        }
    } else if (rollResult.rolledDice >= rollResult.openRange) {
        rollResult.color = "openRoll";
        rollResult.explode = true;
    } else {
        rollResult.color = "normalRoll";
    }
    if (rollResult.doubles === true) {
        if (rollResult.rolledDice % 11 === 0 && rollResult.rolledDice <= 88) {
            rollResult.color = "openRoll";
            rollResult.explode = true;
        }
    }

    let num = 0;
    let type = "weapon";
    const rollData = [];
    rollData[0] = {
        roll: rollResult.rolledDice, total: rollResult._total, doubles: rollResult.doubles, openRange: rollResult.openRange, fumbleLevel: rollResult.fumbleLevel,
        fumble: rollResult.fumble, explode: rollResult.explode, color: rollResult.color, formula: attackDetails.formula, label: `${attackDetails.name} ${attackDetails.label}`
    };

    const template = "systems/abfalter/templates/dialogues/diceRolls/weaponRoll.hbs"
    const content = await renderTemplate(template, { rollData: rollData, actor: actor, attackDetails: attackDetails });
    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        sound: CONFIG.sounds.dice,
        content: content,
        rolls: [rollResult],
        flags: { attackDetails, rollData, actor, num, type }
    };
    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
    ChatMessage.create(chatData);
}

export async function wepOpenRollFunction(msg) {
    let actor = msg.flags.actor;
    let num = msg.flags.num;
    let oldData = msg.flags.rollData[msg.flags.num];
    
    let baseDice = "1d100";
    let rollFormula = `${baseDice} + ${oldData.total}`;
    let rollResult = await new Roll(rollFormula).roll();
    rollResult.rolledDice = rollResult.total - oldData.total;
    let formula = `(${rollResult.rolledDice}) + ${oldData.total}(Previous Roll)`;
    rollResult.rolledDice = rollResult.total - oldData.total;
    rollResult.openRange = oldData.openRange;
    rollResult.color = "normalRoll";
    let isDouble = rollResult.rolledDice % 11 === 0 && rollResult.rolledDice <= 88;
    if (rollResult.rolledDice > oldData.roll) {
        if (oldData.doubles === true) {
            if (isDouble === true) {
                rollResult.color = "openRoll";
                rollResult.explode = true;
            } else if (rollResult.rolledDice >= rollResult.openRange) {
                rollResult.color = "openRoll";
                rollResult.explode = true;
            }
        } else {
            if (rollResult.rolledDice >= rollResult.openRange) {
                rollResult.color = "openRoll";
                rollResult.explode = true;
            }
        }
    } else {
        rollResult.color = "normalRoll";
    }
    msg.flags.rollData[num].doubles = null;
    msg.flags.rollData[num].openRange = null;
    msg.flags.rollData[num].explode = false;
    num = num + 1;
    msg.flags.rollData[num] = {
        roll: rollResult.rolledDice, total: rollResult._total, doubles: oldData.doubles, openRange: oldData.openRange, label: `Open Roll #${num}`,
        explode: rollResult.explode, formula: formula, color: rollResult.color
    };

    const rollData = msg.flags.rollData;
    let template;
    switch (msg.flags.type) {
        case "weapon":
            template = "systems/abfalter/templates/dialogues/diceRolls/weaponRoll.hbs";
            break;
        default:
            template = "systems/abfalter/templates/dialogues/abilityRoll.hbs";
            break;
    }
    const content = await renderTemplate(template, { rollData: msg.flags.rollData, actor: actor, attackDetails: msg.flags.attackDetails });
    game.messages.get(msg._id).update({
        content: content,
        flags: { rollData, num}
    });
}

export async function openMeleeTrapDialogue(actor, label, wepId) {
    let confirmed = false;
    const weapon = actor.items.get(wepId);
    const attacks = weapon.system.attacks;

    if (attacks.length === 0) {
        console.log("No Attacks Found, using default trap");
        ui.notifications.error("Must have an attack created under the attacks tab to use Trapping.");
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
            formula: `${attacks[usedIndex].trappingValue}(Value)`,
            type: attacks[usedIndex].trappingType
        };
        trapRoll(actor, basisTrapDetails);
        return;
    }



    const template = "systems/abfalter/templates/dialogues/weaponPrompts/trapAtk.hbs";
    const html = await renderTemplate(template, {weapon: weapon}, {attacks: attacks}, {label: label});

    new diceDialog({
        title: "Trap Attack",
        content: html,
        buttons: {
            roll: { label: game.i18n.localize('abfalter.dialogs.roll'), callback: () => confirmed = true },
            cancel: { label: game.i18n.localize('abfalter.dialogs.cancel'), callback: () => confirmed = false }
        },
        render: (html) => {
            const attackSelect = html.find('#attackSelect');
            const modifierInput = html.find('#modifierMod');
            let trapValue = attacks[usedIndex].trappingValue;
            let usedFormula = ""

            attacks.forEach((attack, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.text = attack.name;
                attackSelect.append(option);
              });
              attackSelect.val(usedIndex); //Default to last used attack

            attackSelect.change(function() {
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
                finalFormula = `${trapValue}(Value) + ${modifierValue}(Mod)`;
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
    }).render(true);
    return;
}

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
    const content = await renderTemplate(template, { actor: actor, rollResult: rollResult, trapDetails: trapDetails});
    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        sound: CONFIG.sounds.dice,
        content: content
    };
    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
    ChatMessage.create(chatData);
}
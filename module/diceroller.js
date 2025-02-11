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

async function abilityRoll(html, actor, finalValue, label) {
    let fatigueMod = 0;
    let mod = 0;
    if (html != null) {
        fatigueMod = parseInt(html.find('#fatiguemod').val()) || 0;
        mod = parseInt(html.find('#modifiermod').val()) || 0;
    }
    let newLabel = game.i18n.localize("abfalter." + label);

    let fatigueFinal = Math.floor(fatigueMod * 15);
    let baseDice = "1d100";
    let rollFormula = `${baseDice} + ${finalValue} + ${fatigueFinal} + ${mod}`
    const rollResult = await new Roll(rollFormula, actor).roll();
    rollResult.rolledDice = rollResult.total - finalValue - fatigueFinal - mod;

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

    if (rollResult.rolledDice <= fumbleRange) {
        rollResult.color = "fumbleRoll";
        rollResult.fumble = true;
        while (fumbleRange > rollResult.rolledDice) {
            rollResult.fumbleLevel += 15;
            fumbleRange--;
        }
    } else if (rollResult.rolledDice >= actor.system.rollRange.final) {
        rollResult.color = "openRoll";
        rollResult.explode = true;
    } else {
        rollResult.color = "normalRoll";
    }
    if (actor.system.rollRange.doubles === true) {
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
        roll: rollResult.rolledDice, total: rollResult._total, doubles: rollResult.doubles, openRange: rollResult.openRange, label: newLabel, fumbleLevel: rollResult.fumbleLevel,
        fumble: rollResult.fumble, explode: rollResult.explode, result: rollResult.result, color: rollResult.color
    };
    const template = "systems/abfalter/templates/dialogues/abilityRoll.hbs"
    const content = await renderTemplate(template, { rollData: rollData, label: newLabel, actor: actor });
    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        sound: CONFIG.sounds.dice,
        content: content,
        rolls: [rollResult],
        flags: { rollData, actor, num }
    };
    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
    ChatMessage.create(chatData);
}

async function rollCombatWeapon(html, actor, finalValue, label, complex) {
    let fatigueMod = parseInt(html.find('#fatiguemod').val()) || 0;
    let mod = parseInt(html.find('#modifiermod').val()) || 0;
    let fatigueFinal = Math.floor(fatigueMod * 15);
    let baseDice = "1d100";
    let rollFormula = `${baseDice} + ${finalValue} + ${fatigueFinal} + ${mod}`
    const rollResult = await new Roll(rollFormula, actor).roll();
    rollResult.rolledDice = rollResult.total - finalValue - fatigueFinal - mod;

    let fumbleRange = actor.system.fumleRange.final;
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
    rollResult.openRange = actor.system.rollRange.final;

    if (rollResult.rolledDice <= fumbleRange) {
        rollResult.color = "fumbleRoll";
        rollResult.fumble = true;
        while (fumbleRange > rollResult.rolledDice) {
            rollResult.fumbleLevel += 15;
            fumbleRange--;
        }
    } else if (rollResult.rolledDice >= actor.system.rollRange.final) {
        rollResult.color = "openRoll";
        rollResult.explode = true;
    } else {
        rollResult.color = "normalRoll";
    }
    if (actor.system.rollRange.doubles === true) {
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
    const content = await renderTemplate(template, { rollData: rollData, label: label, actor: actor });
    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        sound: CONFIG.sounds.dice,
        content: content,
        rolls: [rollResult],
        flags: { rollData, actor, num }
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
    let actor = msg.flags.actor;
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
export async function openWeaponAtkDialogue(actor, label, wepId, wepType) {
    console.log("Attack Handle Test Start", wepType);
    const weapon = actor.items.get(wepId);
  
    // Skip dialog if shift key is held
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
    if (!attacks.length) {
      console.log("No Attacks Found, using default attack");
      openModifierDialogue(actor, weapon.system.derived.baseAtk, "attack", "combatRoll");
      return;
    }
  
    const templateData = {
      weaponType: wepType,
      weapon,
      attacks,
      label,
    };
    const template = "systems/abfalter/templates/dialogues/weaponPrompts/weaponAtk.hbs";
    const htmlContent = await renderTemplate(template, templateData);
  
    let confirmed = false;
    let usedIndex = weapon.system.info.lastWepUsed < attacks.length ? weapon.system.info.lastWepUsed : 0;
    let finalValue = 0, finalFormula = "", fatigueUsed = 0, ammoUsed = 0, ammoIdUsed = "", RangedAmmoUsed = 0;
    let wepValue = 0; // Current selected attack's base value
  
    // Helper: Update the final roll value and button label
    const updateFinalValue = ($html) => {
      const selectedModifier = parseInt($html.find('#modifierSelect').val(), 10);
      const fatigueValue = parseInt($html.find('#fatigueDropdown').val(), 10) || 0;
      const modifierValue = parseInt($html.find('#modifierMod').val(), 10) || 0;
      const selectedPenalty = parseInt($html.find('#directedAtkDropdown :selected').data('penalty'), 10);
      fatigueUsed = fatigueValue;
  
      finalValue = wepValue + (fatigueValue * 15) + modifierValue + selectedPenalty + selectedModifier;
      finalFormula = `${wepValue}(${game.i18n.localize("abfalter.value")}) + ${fatigueValue * 15}(${game.i18n.localize("abfalter.fatigue")}) + ${modifierValue}(${game.i18n.localize("abfalter.mod")}) + ${selectedPenalty}(${game.i18n.localize("abfalter.aim")}) + ${selectedModifier}(${game.i18n.localize("abfalter.action")})`;
  
      $html.closest('.dialog').find('.dialog-button:first').text(`${game.i18n.localize("abfalter.dialogs.roll")}: ${finalValue}`);
    };
  
    new diceDialog({
      title: `${weapon.name} ${game.i18n.localize('abfalter.attack')}`,
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
  
        // --- Event Handlers ---
  
        // When the attack selection changes
        $attackSelect.on('change', function() {
            usedIndex = $(this).val();
            const selectedAttack = attacks[usedIndex];
            isPrecise = weapon.system.info.precision && !attacks[usedIndex].ignorePrecision;
            isVorpal = weapon.system.info.vorpal && !attacks[usedIndex].ignoreVorpal;
            populateDirectedAtkDropdown();
            ammoUsed = (weapon.system.melee.throwable && !attacks[usedIndex].ignoreThrown && !attacks[usedIndex].quantityConsumed)
                ? attacks[usedIndex].consumedValue : 0;
            RangedAmmoUsed = weapon.system.ranged.infiniteAmmo ? (attacks[usedIndex].rangedAmmoConsumed ? 0 : attacks[usedIndex].rangedAmmoConsumedValue) : attacks[usedIndex].rangedAmmoConsumedValue;
            $html.find('#attackPower').text(selectedAttack.finalAttack);
            $html.find('#damageNum').text(selectedAttack.finalDamage);
            $html.find('#atPenNum').text(selectedAttack.finalAtPen);
            wepValue = selectedAttack.finalAttack;
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
            $ammoDropdown.on('change', function() {
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
        $directedAtkDropdown.on('change', () => updateFinalValue($html));
        $modifierInput.on('input', () => updateFinalValue($html));
  
        // Trigger initial change to populate values
        $attackSelect.trigger('change');
      },
      close: ($html) => {
        if (confirmed) {
            actor.update({ "system.fatigue.value": Math.floor(actor.system.fatigue.value - fatigueUsed) });
            const ammoName = wepType === "ranged" ? weapon.parent.items.get(ammoIdUsed)?.name : "No Arrow";
            weapon.update({
                'system.info.lastWepUsed': usedIndex,
                'system.melee.throwQuantity': Math.floor(weapon.system.melee.throwQuantity - ammoUsed)
            });
            if (wepType === "ranged") { 
                const ammoItem = actor.items.get(ammoIdUsed);
                if (ammoItem) {
                    ammoItem.update({ 'system.quantity': Math.floor(ammoItem.system.quantity - RangedAmmoUsed) });
                }
                weapon.update({ 'system.ranged.selectedAmmo': ammoIdUsed });
            }
            const attackDetails = {
                label: game.i18n.localize("abfalter.attack"),
                name: attacks[usedIndex].name,
                base: weapon.system.derived.baseAtk,
                value: finalValue,
                formula: finalFormula,
                dmg: parseInt($html.find('#damageNum').text(), 10),
                dmgType: $html.find('#atkDmgTypeDropdown').val(),
                atPen: parseInt($html.find('#atPenNum').text(), 10),
                target: $html.find('#directedAtkDropdown').val(),
                ammoName: ammoName,
                wepType: wepType
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
    if (rollResult.doubles === true && rollResult.fumble === false) {
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
    let formula = `(${rollResult.rolledDice}) + ${oldData.total}(${game.i18n.localize("abfalter.prevRoll")})`;
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
        flags: { rollData, num }
    });
}

export async function wepFumbleRollFunction(msg) {
    let fumbleSettings = game.settings.get('abfalter', abfalterSettingsKeys.Corrected_Fumble);
    let actor = msg.flags.actor;
    let num = msg.flags.num;
    let oldData = msg.flags.rollData[msg.flags.num];

    
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
    msg.flags.rollData[num].doubles = null;
    msg.flags.rollData[num].openRange = null;
    msg.flags.rollData[num].explode = false;
    msg.flags.rollData[num].fumble = false;
    num = num + 1;
    msg.flags.rollData[num] = {
        roll: rollResult.rolledDice, total: rollResult._total, doubles: null, openRange: null, label: `Fumble Result`,
        explode: false, formula: formula, color: rollResult.color, showSeverity: true, fumble: false, fumbleS: fumbleS 
    };
    const rollData = msg.flags.rollData;
    let template;
    console.log(msg.flags.type);
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
        flags: { rollData, num }
    });
}

export async function openMeleeTrapDialogue(actor, label, wepId) {
    let confirmed = false;
    const weapon = actor.items.get(wepId);
    const attacks = weapon.system.attacks;

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
    const html = await renderTemplate(template, {weapon: weapon}, {attacks: attacks}, {label: label});

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
                    if(usedIndex === -1) {
                        usedIndex = index;
                        trapValue = attacks[usedIndex].trappingValue;
                    }
                }
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

export async function openMeleeBreakDialogue(actor, label, wepId, wepType) {
    const weapon = actor.items.get(wepId);
    const attacks = weapon.system.attacks;

    if (!attacks.length) {
        ui.notifications.error(game.i18n.localize("abfalter.noAttacksFound"));
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
    const htmlContent = await renderTemplate(template, templateData);

    const updateFinalValue = ($html) => {
        const modifierValue = parseInt($html.find('#modifierMod').val(), 10) || 0;
        finalValue = breakValue + modifierValue
        finalFormula = `${breakValue}(${game.i18n.localize("abfalter.value")}) + ${modifierValue}(${game.i18n.localize("abfalter.mod")})`;
        $html.closest('.dialog').find('.dialog-button:first').text(`${game.i18n.localize("abfalter.dialogs.roll")}: ${finalValue} + 1d10`);
    };

    new diceDialog({
        title:`${weapon.name} ${game.i18n.localize('abfalter.breakRoll')}`,
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

            $attackSelect.change(function() {
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
                $ammoDropdown.on('change', function() {
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
            if(confirmed) {
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
    const content = await renderTemplate(template, { actor: actor, rollResult: rollResult, breakDetails: breakDetails});
    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        sound: CONFIG.sounds.dice,
        content: content
    };
    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
    ChatMessage.create(chatData);
}

export async function openWeaponDefDialogue(actor, label, wepId) {
  
}
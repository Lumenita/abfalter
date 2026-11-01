import { weaponProfiles, ammoMode, ammoStats, ammoCost, ammoRequirement, profileUsesAmmo, resolvedAttack, spendWeaponAmmo, loadedCount } from "./utilities/weapon-system.js";
import { createRoll, performOpenRoll, performFumbleRoll } from "./diceHelpers/dice-roll-engine.js";
import { createAttackWorkflow, finalizeDefenseMessage, createEffectResolutionMessage } from "./diceHelpers/combat-workflow.js";
export { finalizeDefenseMessage, updateResolveDamagePreview, resolveApplyDamageToActors } from "./diceHelpers/combat-workflow.js";
import { abfalterSettingsKeys } from "./utilities/abfalterSettings.js";

const diceDialogV2 = class extends foundry.applications.api.DialogV2 {
    #onRenderCallback;
    #onCloseCallback;

    constructor(options = {}) {
        const { onRender, onClose, ...dialogOptions } = options;
        super(dialogOptions);
        this.#onRenderCallback = onRender;
        this.#onCloseCallback = onClose;
    }

    async _onRender(context, options) {
        await super._onRender(context, options);

        const html = this.element;
        if (!html) return;

        html.querySelectorAll('.collapsable').forEach(el => {
            el.addEventListener('click', ev => {
                const next = ev.currentTarget.nextElementSibling;
                if (!next) return;

                const isHidden =
                    next.style.display === "none" ||
                    getComputedStyle(next).display === "none";

                next.style.display = isHidden ? "" : "none";
            });
        });

        if (this.#onRenderCallback) {
            await this.#onRenderCallback(html, this);
        }
    }

    async _onClose(options) {
        if (this.#onCloseCallback) {
            await this.#onCloseCallback(this.element, this);
        }
        return super._onClose(options);
    }
};

/** All Characteristic Rolls 1d10
 * @param {Actor} actor - actor document
 * @param {String} chaLabel - Already localized Name of Action
 * @param {Number} value - The passed based value of the defensive
 * @returns 
 */
export async function characteristicDialogue({actor, chaLabel, value}) {
    const template = "systems/abfalter/templates/dialogues/prompt/basicModifiers.hbs";
    let baseValue = Number(value); 
    let confirmed = false;
    let finalValue = 0;
    let finalFormula = "";
    let fatigueUsed = 0;

    const htmlContent = await foundry.applications.handlebars.renderTemplate(template);

    const clearOptions = (el) => {
        if (el) el.innerHTML = "";
    };
    const appendOption = (el, { value, label, selected = false, dataset = {} }) => {
        if (!el) return;
        const option = document.createElement("option");
        option.value = String(value ?? "");
        option.textContent = label ?? "";
        if (selected) option.selected = true;

        for (const [key, val] of Object.entries(dataset)) {
            option.dataset[key] = String(val);
        }

        el.appendChild(option);
    };
    const updateFinalValue = (html, dialog) => {
        const modifierValue = parseInt(html.querySelector('#modifierMod')?.value ?? 0, 10);
        const fatigueValue = parseInt(html.querySelector('#fatigueDropdown')?.value ?? 0, 10);
        fatigueUsed = fatigueValue;

        finalValue = baseValue + fatigueValue + modifierValue;
        finalFormula = `${baseValue}(${game.i18n.localize("abfalter.value")}) + ${fatigueValue}(${game.i18n.localize("abfalter.fatigue")}) + ${modifierValue}(${game.i18n.localize("abfalter.mod")})`;

        updateRollButtonLabel(dialog);
    };
    const updateRollButtonLabel = (dialog) => {
        const root = dialog.element;
        if (!root) return;

        const rollButton =
            root.querySelector('[data-action="roll"]') ||
            root.querySelector('button[data-action="roll"]');

        if (rollButton) {
            rollButton.textContent = `${game.i18n.localize("abfalter.dialogs.roll")}: ${finalValue}`;
        }
    };

    const dialog = new diceDialogV2({
        window: {
            title: `${actor.name} - ${chaLabel}`
        },
        position: {
            width: 400,
        },
        content: htmlContent,
        classes: ["baseAbfalterV2"],
        buttons: [
            {
                action: "roll",
                label: `${game.i18n.localize("abfalter.dialogs.roll")}: ${finalValue}`,
                default: true,
                callback: () => {
                    confirmed = true;
                    return "roll";
                }
            },
            {
                action: "cancel",
                label: game.i18n.localize('abfalter.dialogs.cancel'),
                callback: () => {
                    confirmed = false;
                    return "cancel";
                }
            }
        ],
        onRender: async (html, dialogInstance) => {
            const modifierInput = html.querySelector('#modifierMod');
            const fatigueDropdown = html.querySelector('#fatigueDropdown');
            const maxFatigue = actor.system.kiAbility.kiUseOfEne.status ? 5 : 2;
            const fatigueVal = actor.system.fatigue.value;

            // Fatigue Dropdown
            const populateFatigueDropdown = () => {
                clearOptions(fatigueDropdown);
                const availableFatigue = Math.min(maxFatigue, fatigueVal);
                for (let i = 0; i <= availableFatigue; i++) {
                    appendOption(fatigueDropdown, { 
                        value: i,
                        label: String(i),
                        selected: i === 0
                    });
                }
            };
            populateFatigueDropdown();

            updateFinalValue(html, dialogInstance);

            modifierInput?.addEventListener('input', () => updateFinalValue(html, dialogInstance));
            fatigueDropdown?.addEventListener('change', () => updateFinalValue(html, dialogInstance));
        },
        onClose: async (html) => {
            if (!confirmed) return;
            await actor.update({ 
                "system.fatigue.value": Math.floor(actor.system.fatigue.value - fatigueUsed)
            });

            let rollDetails = {
                chaLabel,
                finalValue,
                formula: finalFormula
            }
            await characteristicRoll({actor, rollDetails});
        }
    });
    dialog.render({ force: true });
}

async function characteristicRoll({actor, rollDetails}) {
    const template = "systems/abfalter/templates/dialogues/diceRolls/characteristicRoll.hbs"
    let rollResult;
    let finalFormula = "";
    let unlucky = actor.system.rollRange.limits == "unlucky";
    let canFumble = game.settings.get('abfalter', abfalterSettingsKeys.Characteristic_Fumble);

    rollResult = await Roll.create("1d10 + @bonus", { bonus: rollDetails.finalValue }).evaluate();
    rollResult.rolledDice = rollResult.dice[0].results[0].result;
    rollResult.color = "";
    rollResult.fumble = false;
    rollResult.explode = false;

    if (rollResult.rolledDice == 1 && canFumble) {
        rollResult.color = "fumbleRoll";
        finalFormula = `(${rollResult.rolledDice}) - 3(${game.i18n.localize("abfalter.fumble")}) + ` + rollDetails.formula;
        rollResult.newTotal = rollResult.total - 3;
        rollResult.fumble = true;
    } else if (rollResult.rolledDice == 10 && !unlucky) {
        rollResult.color = "openRoll";
        finalFormula = `(${rollResult.rolledDice}) + 2(${game.i18n.localize("abfalter.openRoll")}) + ` + rollDetails.formula;
        rollResult.newTotal = rollResult.total + 2;
        rollResult.explode = true;
    } else {
        rollResult.color = "normalRoll";
        finalFormula = `(${rollResult.rolledDice}) + ` + rollDetails.formula;
        rollResult.newTotal = rollResult.total;
    }

    let basicInfo = {
        portrait: actor.prototypeToken.texture.src,
        name: actor.name,
        userName: game.user.isGM ? game.i18n.localize("abfalter.gm") : game.user.name
    };

    const content = await foundry.applications.handlebars.renderTemplate(template, { rollResult: rollResult, label: rollDetails.chaLabel, formula: finalFormula, basicInfo: basicInfo });
    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        sound: CONFIG.sounds.dice,
        content: content,
        flags: {            
            abfalter: {
                customChatHeaderCard: true
            } 
        }
    };

    const speakerMode = actor.system.rollRange.speaker; // "default" | "public" | "private"
    let rollMode;
    switch (speakerMode) {
        case "public":
            rollMode = "public";
            break;
        case "private":
            rollMode = "gm";
            break;
        default:
            rollMode = game.settings.get("core", "messageMode");
    }
    ChatMessage.applyMode(chatData, rollMode);
    await ChatMessage.create(chatData);
}



/** All Resistance Rolls
 * @param {Actor} actor - actor document
 * @param {String} chaLabel - Already localized Name of Action
 * @param {Number} value - The passed based value of the resistance
 * @returns 
 */
export async function resistanceDialogue({actor, resLabel, value}) {
    const template = "systems/abfalter/templates/dialogues/prompt/basicModifiers.hbs";
    let baseValue = Number(value); 
    let confirmed = false;
    let finalValue = 0;
    let finalFormula = "";

    const htmlContent = await foundry.applications.handlebars.renderTemplate(template);

    const hideEl = (el) => {
        if (el) el.style.display = "none";
    };
    const updateFinalValue = (html, dialog) => {
        const modifierValue = parseInt(html.querySelector('#modifierMod')?.value ?? 0, 10);

        finalValue = baseValue + modifierValue;
        finalFormula = `${baseValue}(${game.i18n.localize("abfalter.value")}) + ${modifierValue}(${game.i18n.localize("abfalter.mod")})`;

        updateRollButtonLabel(dialog);
    };
    const updateRollButtonLabel = (dialog) => {
        const root = dialog.element;
        if (!root) return;

        const rollButton =
            root.querySelector('[data-action="roll"]') ||
            root.querySelector('button[data-action="roll"]');

        if (rollButton) {
            rollButton.textContent = `${game.i18n.localize("abfalter.dialogs.roll")}: ${finalValue}`;
        }
    };

    const dialog = new diceDialogV2({
        window: {
            title: `${actor.name} - ${resLabel}`
        },
        position: {
            width: 400,
        },
        content: htmlContent,
        classes: ["baseAbfalterV2"],
        buttons: [
            {
                action: "roll",
                label: `${game.i18n.localize("abfalter.dialogs.roll")}: ${finalValue}`,
                default: true,
                callback: () => {
                    confirmed = true;
                    return "roll";
                }
            },
            {
                action: "cancel",
                label: game.i18n.localize('abfalter.dialogs.cancel'),
                callback: () => {
                    confirmed = false;
                    return "cancel";
                }
            }
        ],
        onRender: async (html, dialogInstance) => {
            const modifierInput = html.querySelector('#modifierMod');
            const fatigueRow = html.querySelector('#fatigueRow');

            updateFinalValue(html, dialogInstance);

            const updateDefenseRowsVisibility = () => {
                hideEl(fatigueRow);
            };
            updateDefenseRowsVisibility();

            modifierInput?.addEventListener('input', () => updateFinalValue(html, dialogInstance));
        },
        onClose: async (html) => {
            if (!confirmed) return;

            let rollDetails = {
                resLabel,
                finalValue,
                formula: finalFormula
            }
            await resistanceRoll({actor, rollDetails});
        }
    });
    dialog.render({ force: true });
}

async function resistanceRoll({actor, rollDetails}) {
    const template = "systems/abfalter/templates/dialogues/diceRolls/resistanceRoll.hbs"
    let rollResult;
    let finalFormula = "";
    let unlucky = actor.system.rollRange.limits == "unlucky";


    rollResult = await Roll.create("1d100 + @bonus", { bonus: rollDetails.finalValue }).evaluate();
    rollResult.rolledDice = rollResult.dice[0].results[0].result;
    rollResult.color = "";
    rollResult.fumble = false;
    rollResult.explode = false;
    finalFormula = `(${rollResult.rolledDice}) + ` + rollDetails.formula;

    const rollLimit = actor.system.rollRange.limits;

    if (rollResult.rolledDice == 1) {
        rollResult.color = "fumbleRoll";
        rollResult.fumble = true;
    } else if (rollResult.rolledDice == 100 && !unlucky) {
        if (rollLimit == "unlucky") {
            rollResult.color = "normalRoll";
            rollResult.explode = false;
        } else {
            rollResult.color = "openRoll";
            rollResult.explode = true;
        }
    } else {
        rollResult.color = "normalRoll";
    }

    let basicInfo = {
        portrait: actor.prototypeToken.texture.src,
        name: actor.name,
        userName: game.user.isGM ? game.i18n.localize("abfalter.gm") : game.user.name
    };

    const content = await foundry.applications.handlebars.renderTemplate(template, { rollResult: rollResult, label: rollDetails.resLabel, formula: finalFormula, basicInfo: basicInfo });
    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actorData: actor }),
        sound: CONFIG.sounds.dice,
        content,
        flags: {            
            abfalter: {
                customChatHeaderCard: true
            } 
        }
    };

    const speakerMode = actor.system.rollRange.speaker; // "default" | "public" | "private"
    let rollMode;
    switch (speakerMode) {
        case "public":
            rollMode = "public";
            break;
        case "private":
            rollMode = "gm";
            break;
        default:
            rollMode = game.settings.get("core", "messageMode");
    }
    ChatMessage.applyMode(chatData, rollMode);
    await ChatMessage.create(chatData);
}



/** Secondary Abilities
 * 
 */
export async function secondaryDialogue({actor, label, value}) {
    const template = "systems/abfalter/templates/dialogues/prompt/secondaryAbility.hbs";
    let confirmed = false;
    let finalValue = 0;
    let finalFormula = "";
    let fatigueUsed = 0;
    let baseValue = Number(value);

    const htmlContent = await foundry.applications.handlebars.renderTemplate(template);

    const clearOptions = (el) => {
        if (el) el.innerHTML = "";
    };
    const appendOption = (el, { value, label, selected = false, dataset = {} }) => {
        if (!el) return;
        const option = document.createElement("option");
        option.value = String(value ?? "");
        option.textContent = label ?? "";
        if (selected) option.selected = true;

        for (const [key, val] of Object.entries(dataset)) {
            option.dataset[key] = String(val);
        }

        el.appendChild(option);
    };
    const updateFinalValue = (html, dialog) => {
        const modifierValue = parseInt(html.querySelector('#modifierMod')?.value ?? 0, 10);
        const fatigueValue = parseInt(html.querySelector('#fatigueDropdown')?.value ?? 0, 10);
        fatigueUsed = fatigueValue;

        finalValue = baseValue + (fatigueValue * actor.system.settings.fatigueValue) + modifierValue ;
        finalFormula = `${baseValue}(${game.i18n.localize("abfalter.value")}) + ${fatigueValue * actor.system.settings.fatigueValue}(${game.i18n.localize("abfalter.fatigue")}) + ${modifierValue}(${game.i18n.localize("abfalter.mod")})`;

        updateRollButtonLabel(dialog);
    };
    const updateRollButtonLabel = (dialog) => {
        const root = dialog.element;
        if (!root) return;

        const rollButton =
            root.querySelector('[data-action="roll"]') ||
            root.querySelector('button[data-action="roll"]');

        if (rollButton) {
            rollButton.textContent = `${game.i18n.localize("abfalter.dialogs.roll")}: ${finalValue}`;
        }
    };

    const dialog = new diceDialogV2({
        window: {
            title: `${actor.name} - ${label}`
        },
        position: {
            width: 400,
        },
        content: htmlContent,
        classes: ["baseAbfalterV2"],
        buttons: [
            {
                action: "roll",
                label: `${game.i18n.localize("abfalter.dialogs.roll")}: ${finalValue}`,
                default: true,
                callback: () => {
                    confirmed = true;
                    return "roll";
                }
            },
            {
                action: "cancel",
                label: game.i18n.localize('abfalter.dialogs.cancel'),
                callback: () => {
                    confirmed = false;
                    return "cancel";
                }
            }
        ],
        onRender: async (html, dialogInstance) => {
            const modifierInput = html.querySelector('#modifierMod');
            const fatigueDropdown = html.querySelector('#fatigueDropdown');
            const fatigueVal = actor.system.fatigue.value;
            const maxFatigue = actor.system.kiAbility.kiUseOfEne.status ? 5 : 2;

            // Fatigue Dropdown
            const populateFatigueDropdown = () => {
                clearOptions(fatigueDropdown);
                const availableFatigue = Math.min(maxFatigue, fatigueVal);
                for (let i = 0; i <= availableFatigue; i++) {
                    appendOption(fatigueDropdown, { 
                        value: i,
                        label: String(i),
                        selected: i === 0
                    });
                }
            };
            populateFatigueDropdown();

            modifierInput?.addEventListener('input', () => updateFinalValue(html, dialogInstance));
            fatigueDropdown?.addEventListener('change', () => updateFinalValue(html, dialogInstance));
            updateFinalValue(html, dialogInstance);
        },
        onClose: async (html) => {
            if (!confirmed) return;
            await actor.update({ 
                "system.fatigue.value": Math.floor(actor.system.fatigue.value - fatigueUsed)
            });

            const secondaryDetails = {
                baseValue: baseValue,
                finalValue: finalValue,
                formula: finalFormula,
                label: label
            };
            secondaryRoll({actor, secondaryDetails});
        }
    });
    dialog.render({ force: true });
}

async function secondaryRoll({actor, secondaryDetails}) {
    const template = "systems/abfalter/templates/dialogues/diceRolls/secondaryAbilityRoll.hbs"
    let fumbleRange = actor.system.fumleRange.final;
    let openRange = actor.system.rollRange.final;
    let isPredetermined = false;
    let secondName = secondaryDetails.label;
    let num = 0;

    if (secondaryDetails.baseValue > 199 && fumbleRange > 1) {
        fumbleRange -= 1;
    }

    const rollResult = await createRoll(actor, secondaryDetails.finalValue, openRange, fumbleRange, isPredetermined);
    secondaryDetails.formula = `(${rollResult.rolledDice}) + ${secondaryDetails.formula}`;
    secondaryDetails.label = secondName; 

    const rollData = [];
    rollData[0] = {
        roll: rollResult.rolledDice, total: rollResult._total, doubles: rollResult.doubles, openRange: rollResult.openRange, fumbleLevel: rollResult.fumbleLevel,
        fumble: rollResult.fumble, explode: rollResult.explode, color: rollResult.color, formula: secondaryDetails.formula, label: secondaryDetails.label,
    };

    let basicInfo = {
        portrait: actor.prototypeToken.texture.src,
        name: actor.name,
        userName: game.user.isGM ? game.i18n.localize("abfalter.gm") : game.user.name
    };

    const content = await foundry.applications.handlebars.renderTemplate(template, { 
        basicInfo,
        rollData,
        actor,
        secondaryDetails
    });

    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        sound: CONFIG.sounds.dice,
        content: content,
        rolls: [rollResult],
        flags: {            
            abfalter: {
                customChatHeaderCard: true,
                basicInfo: basicInfo,
                secondaryDetails: secondaryDetails,
                rollData: rollData,
                num: num
            } 
        }
    };

    const speakerMode = actor.system.rollRange.speaker; // "default" | "public" | "private"
    let rollMode;
    switch (speakerMode) {
        case "public":
            rollMode = "public";
            break;
        case "private":
            rollMode = "gm";
            break;
        default:
            rollMode = game.settings.get("core", "messageMode");
    }
    ChatMessage.applyMode(chatData, rollMode);
    await ChatMessage.create(chatData);
}

export async function secondaryContinuationRollFunction(msg, html, event) {
    const template = "systems/abfalter/templates/dialogues/diceRolls/secondaryAbilityRoll.hbs";
    const continuationType = event.currentTarget.dataset.rollType;
    const rollFunction = {
        open: performOpenRoll,
        fumble: performFumbleRoll
    }[continuationType];
    if (!rollFunction) {
        throw new Error(
            `Unknown offensive continuation type: ${continuationType}`
        );
    }
    const { actor, num, rollData } = await rollFunction(msg);

    const content = await foundry.applications.handlebars.renderTemplate(template, {
        basicInfo: msg.flags.abfalter.basicInfo,
        rollData,
        actor,
        secondaryDetails: msg.flags.abfalter.secondaryDetails
    });

    await msg.update({
        content,
        "flags.abfalter.rollData": rollData,
        "flags.abfalter.num": num
    });
}



/** Temporary summoning prompt. Uses the secondary-style d100 chat flow. TODO */
export function summoningDialogue({ actor, value, label }) {
    return secondaryDialogue({ actor, value, label: label ?? game.i18n.localize("abfalter.summoning") });
}

/** Dedicated temporary Summoning execution path; replace with summoning rules later. TODO */
async function summoningRoll({actor, secondaryDetails}) {
    return secondaryRoll({actor, secondaryDetails: {...secondaryDetails}});
}



/** All Defensive Rolls from the Actor Sheet
 * @param {Actor} actor - actor document
 * @param {String} defLabel - string identifier
 * @param {Number} value - The passed based value of the defensive
 * @param {String} weaponId - It's either null or has the weapon id
 */
export async function defensiveDialogue({actor, defLabel, value, weaponId}) {
    const template = "systems/abfalter/templates/dialogues/prompt/defense.hbs";
    let confirmed = false;
    let finalValue = 0;
    let finalFormula = "";
    let fatigueUsed = 0;
    let defenseType = "";
    let defBaseValue = Number(value); 
    let selectedArmorTag = "showAll";
    let selectedProfiles = [];
    let selectedProfileIndex = 0;

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

    switch(defLabel) {
        case "unarmedBlock":
        case "unarmedDodge":
            defenseType = "unarmed";
            break;
        case "defMagicProj":
            defenseType = "magic";
            break;
        case "defPsyProj":
            defenseType = "psychic";
            break;
        case "weaponBlock":
        case "weaponDodge":
            defenseType = "weapon";
            break;
    }

    const htmlContent = await foundry.applications.handlebars.renderTemplate(template);

    const setText = (html, selector, value) => {
        const el = html.querySelector(selector);
        if (el) el.textContent = String(value ?? "");
    };
    const showEl = (el) => {
        if (el) el.style.display = "";
    };
    const hideEl = (el) => {
        if (el) el.style.display = "none";
    };
    const clearOptions = (el) => {
        if (el) el.innerHTML = "";
    };
    const appendOption = (el, { value, label, selected = false, dataset = {} }) => {
        if (!el) return;
        const option = document.createElement("option");
        option.value = String(value ?? "");
        option.textContent = label ?? "";
        if (selected) option.selected = true;

        for (const [key, val] of Object.entries(dataset)) {
            option.dataset[key] = String(val);
        }

        el.appendChild(option);
    };
    const updateCombatBaseValue = (html, dialog) => {
        switch (defenseType) {
            case "weapon": {
                const profile = getSelectedProfile();
                // Weapon selected
                if (defLabel === "weaponBlock") {
                    if (profile?.finalBlock != null) {
                        defBaseValue = Number(profile.finalBlock) || 0;
                    } else if (selectedWeapon?.system?.derived?.baseBlk != null) {
                        defBaseValue = Number(selectedWeapon.system.derived.baseBlk) || 0;
                    } else {
                        defBaseValue = Number(actor.system.combatValues?.block?.final ?? 0);
                    }
                } else {
                    if (profile?.finalDodge != null) {
                        defBaseValue = Number(profile.finalDodge) || 0;
                    } else if (selectedWeapon?.system?.derived?.baseDod != null) {
                        defBaseValue = Number(selectedWeapon.system.derived.baseDod) || 0;
                    } else {
                        defBaseValue = Number(actor.system.combatValues?.dodge?.final ?? 0);
                    }
                }
                updateFinalValue(html, dialog);
                break;
            }
            default:
                defBaseValue = Number(value); 
                updateFinalValue(html, dialog);
                break;
        }
    };
    const getWeaponProfiles = (weapon) => weaponProfiles(weapon, "defensive");
    const getSelectedProfileEntry = () => selectedProfiles?.[selectedProfileIndex] ?? null;
    const getSelectedProfile = () => getSelectedProfileEntry()?.profile ?? null;
    const getSelectedProfileOriginalIndex = () => getSelectedProfileEntry()?.originalIndex ?? -1;
    const updateFinalValue = (html, dialog) => {
        const modifierValue = parseInt(html.querySelector('#modifierMod')?.value ?? 0, 10);
        const multDefPenalty = parseInt(html.querySelector('#defNumberDropdown option:checked')?.dataset.penalty ?? 0, 10);
        const fatigueValue = parseInt(html.querySelector('#fatigueDropdown')?.value ?? 0, 10);
        fatigueUsed = fatigueValue;

        finalValue = defBaseValue + (fatigueValue * actor.system.settings.fatigueValue) + modifierValue + multDefPenalty;
        finalFormula = `${defBaseValue}(${game.i18n.localize("abfalter.value")}) + ${fatigueValue * actor.system.settings.fatigueValue}(${game.i18n.localize("abfalter.fatigue")}) + ${modifierValue}(${game.i18n.localize("abfalter.mod")}) + ${multDefPenalty}(${game.i18n.localize("abfalter.multipleDef")})`;

        updateRollButtonLabel(dialog);
    };
    const updateRollButtonLabel = (dialog) => {
        const root = dialog.element;
        if (!root) return;

        const rollButton =
            root.querySelector('[data-action="roll"]') ||
            root.querySelector('button[data-action="roll"]');

        if (rollButton) {
            rollButton.textContent = `${game.i18n.localize("abfalter.dialogs.roll")}: ${finalValue}`;
        }
    };

    const dialog = new diceDialogV2({
        window: {
            title: `${actor.name} - ${game.i18n.localize('abfalter.defense')}`
        },
        position: {
            width: 400,
        },
        content: htmlContent,
        classes: ["baseAbfalterV2"],
        buttons: [
            {
                action: "roll",
                label: `${game.i18n.localize("abfalter.dialogs.roll")}: ${finalValue}`,
                default: true,
                callback: () => {
                    confirmed = true;
                    return "roll";
                }
            },
            {
                action: "cancel",
                label: game.i18n.localize('abfalter.dialogs.cancel'),
                callback: () => {
                    confirmed = false;
                    return "cancel";
                }
            }
        ],
        onRender: async (html, dialogInstance) => {
            // Core
            const modifierInput = html.querySelector('#modifierMod');
            const fatigueDropdown = html.querySelector('#fatigueDropdown');
            const defNumberDropdown = html.querySelector('#defNumberDropdown');
            const armorDropdown = html.querySelector('#armorDropdown');
            const profileDropdown = html.querySelector('#profileDropdown');
            const profileRow = html.querySelector('#profileRow');
            const fatigueVal = actor.system.fatigue.value;
            const maxFatigue = actor.system.kiAbility.kiUseOfEne.status ? 5 : 2;
            const defensePenalty = [
                { tag: 'first', name: game.i18n.localize('abfalter.firstDef'), penalty: 0 },
                { tag: 'second', name: game.i18n.localize('abfalter.secondDef'), penalty: -30 },
                { tag: 'third', name: game.i18n.localize('abfalter.thirdDef'), penalty: -50 },
                { tag: 'fourth', name: game.i18n.localize('abfalter.fourthDef'), penalty: -70 },
                { tag: 'fifth', name: game.i18n.localize('abfalter.fifthDef'), penalty: -90 }
            ];

            // Fatigue Dropdown
            const populateFatigueDropdown = () => {
                clearOptions(fatigueDropdown);
                const availableFatigue = Math.min(maxFatigue, fatigueVal);
                for (let i = 0; i <= availableFatigue; i++) {
                    appendOption(fatigueDropdown, { 
                        value: i,
                        label: String(i),
                        selected: i === 0
                    });
                }
            };
            populateFatigueDropdown();

            // Multiple Defense Dropdown
            const populateDefNumberDropdown = () => {
                clearOptions(defNumberDropdown);
                defensePenalty.forEach(part => {
                    appendOption(defNumberDropdown, {
                        value: part.tag,
                        label: `${part.name} (${part.penalty})`,
                        dataset: { penalty: part.penalty }
                    });
                });
            };
            populateDefNumberDropdown();

            // Armor Dropdown
            const populateArmorDropdownDropdown = () => {
                clearOptions(armorDropdown);
                armorType.forEach(part => {
                    appendOption(armorDropdown, {
                        value: part.tag,
                        label: `${part.name} (${part.atValue})`,
                        dataset: { penalty: part.atValue }
                    });
                });
            };
            populateArmorDropdownDropdown();

            // Profiles Dropdown
            const populateProfileDropdown = () => {
                clearOptions(profileDropdown);

                if (weaponId === null) {
                    selectedProfiles = [];
                    selectedProfileIndex = 0;
                    return;
                }

                const weapon = actor.items.get(weaponId);
                selectedProfiles = getWeaponProfiles(weapon);

                if (!selectedProfiles.length) {
                    selectedProfileIndex = 0;
                    return;
                }

                const lastDefUsed = Number(weapon.system.info.lastDefUsed ?? 0);

                selectedProfileIndex = selectedProfiles.findIndex(entry => entry.key === weapon.system.info.lastDefProfileId);
                if (selectedProfileIndex < 0) selectedProfileIndex = selectedProfiles.findIndex(entry => entry.originalIndex === lastDefUsed);
                if (selectedProfileIndex < 0) selectedProfileIndex = 0;

                selectedProfiles.forEach((entry, index) => {
                    appendOption(profileDropdown, {
                        value: index,
                        label: entry.profile.name,
                        selected: index === selectedProfileIndex
                    });
                });

                profileDropdown.value = String(selectedProfileIndex);
            };
            populateProfileDropdown();

            const updateDefenseRowsVisibility = () => {
                switch (defenseType) {
                    case "unarmed":
                        hideEl(profileRow);
                        break;
                    case "magic":
                        hideEl(profileRow);
                        break;
                    case "psychic":
                        hideEl(profileRow);
                        break;
                    case "weapon":
                        showEl(profileRow);
                        break;
                }
            };
            updateDefenseRowsVisibility();
            updateCombatBaseValue(html, dialogInstance);

            profileDropdown?.addEventListener('change', (ev) => {
                selectedProfileIndex = Number(ev.currentTarget.value);
                updateCombatBaseValue(html, dialogInstance);
            });
            armorDropdown?.addEventListener('change', (ev) => { selectedArmorTag = ev.currentTarget.value; });
            modifierInput?.addEventListener('input', () => updateFinalValue(html, dialogInstance));
            fatigueDropdown?.addEventListener('change', () => updateFinalValue(html, dialogInstance));
            defNumberDropdown?.addEventListener('change', () => updateFinalValue(html, dialogInstance));
        },
        onClose: async (html) => {
            if (!confirmed) return;
            await actor.update({ 
                "system.fatigue.value": Math.floor(actor.system.fatigue.value - fatigueUsed)
            });

            let chosenIndex = null;
            if (defenseType == "weapon") {
                chosenIndex = getSelectedProfileOriginalIndex();
                const weapon = actor.items.get(weaponId);
                await weapon.update({
                    "system.info.lastDefUsed": getSelectedProfileOriginalIndex(),
                    "system.info.lastDefProfileId": getSelectedProfileEntry()?.key ?? ""
                });
            }
        
            const defenseDetails = {
                baseValue: defBaseValue,
                finalValue: finalValue,
                formula: finalFormula,
                defenseType: defenseType,
                defLabel: defLabel,
                selectedAT: selectedArmorTag,
                profileIndex: chosenIndex,
                weaponId: weaponId,
            };
            await defenseRoll({actor, defenseDetails});
        }
    });
    dialog.render({ force: true });
}

async function defenseRoll({actor, defenseDetails}) {
    const template = "systems/abfalter/templates/dialogues/diceRolls/defensiveRoll.hbs"
    let weapon; 
    let fumbleRange = 3; 
    let openRange = 90; 
    let isPredetermined;
    let actionName = "";
    let defenseName = "";
    let num = 0;

    if (defenseDetails.defenseType == "weapon") {
        weapon = actor.items.get(defenseDetails.weaponId);
        if (!weapon) console.warn("Weapon not found even though a weapon was used for defense:", defenseDetails.weaponId);
        fumbleRange = weapon.system.derived.baseFumbleRange;
        openRange = weapon.system.derived.baseOpenRollRange;
        const profiles = Object.values(weapon.system.attacks ?? {});
        const profile = defenseDetails.profileIndex === -1
            ? weaponProfiles(weapon,"defensive")[0].profile
            : profiles[defenseDetails.profileIndex];
        isPredetermined = profile?.properties?.predetermined?.bool ?? false;
        actionName = weapon.name;
        defenseName = defenseDetails.defLabel == "weaponBlock" ? `${profile?.name ?? "Standard Defense"} ${game.i18n.localize("abfalter.block")}` : `${profile?.name ?? "Standard Defense"} ${game.i18n.localize("abfalter.dodge")}`;
    } else {
        openRange = actor.system.rollRange.final;
        fumbleRange = actor.system.fumleRange.final;
        isPredetermined = false;
        actionName = `${game.i18n.localize("abfalter." + defenseDetails.defenseType)}`;
        if (defenseDetails.defenseType == "unarmed") {
            defenseName = defenseDetails.defLabel == "unarmedBlock" ? `${game.i18n.localize("abfalter.unarmed")} ${game.i18n.localize("abfalter.block")}` : `${game.i18n.localize("abfalter.unarmed")} ${game.i18n.localize("abfalter.dodge")}`
        } else {
            defenseName = defenseDetails.defenseType == "magic" ? game.i18n.localize("abfalter.defMagicProj") : game.i18n.localize("abfalter.defPsyProj");
        }
    }

    if (defenseDetails.baseValue > 199 && fumbleRange > 1) {
        fumbleRange -= 1;
    }

    const rollResult = await createRoll(actor, defenseDetails.finalValue, openRange, fumbleRange, isPredetermined);
    defenseDetails.formula = `(${rollResult.rolledDice}) + ${defenseDetails.formula}`;
    defenseDetails.defTypeName = actionName; // Name of the weapon / magic / psychic.
    defenseDetails.label = defenseName; // Name of profile / defense type

    const armorType = [
        { tag: 'cut', name: game.i18n.localize('abfalter.cut'), atValue: actor.system.armor.body.aCutFinal },
        { tag: 'imp', name: game.i18n.localize('abfalter.imp'), atValue: actor.system.armor.body.aImpFinal },
        { tag: 'thr', name: game.i18n.localize('abfalter.thr'), atValue: actor.system.armor.body.aThrFinal },
        { tag: 'heat', name: game.i18n.localize('abfalter.heat'), atValue: actor.system.armor.body.aHeatFinal },
        { tag: 'cold', name: game.i18n.localize('abfalter.cold'), atValue: actor.system.armor.body.aColdFinal },
        { tag: 'ele', name: game.i18n.localize('abfalter.ele'), atValue: actor.system.armor.body.aEleFinal },
        { tag: 'ene', name: game.i18n.localize('abfalter.ene'), atValue: actor.system.armor.body.aEneFinal }
    ];
    const selectedTag = defenseDetails.selectedAT;
    let typesToShow = [];
    if (selectedTag === 'showAll') {
        typesToShow = armorType.filter(t => t.tag !== 'showAll');
    } else {
        typesToShow = armorType.filter(t => t.tag === selectedTag);
    }
    defenseDetails.selectedAT = typesToShow;

    const rollData = [];
    rollData[0] = {
        roll: rollResult.rolledDice, total: rollResult._total, doubles: rollResult.doubles, openRange: rollResult.openRange, fumbleLevel: rollResult.fumbleLevel,
        fumble: rollResult.fumble, explode: rollResult.explode, color: rollResult.color, formula: defenseDetails.formula, label: defenseDetails.label,
    };

    let basicInfo = {
        portrait: actor.prototypeToken.texture.src,
        name: actor.name,
        userName: game.user.isGM ? game.i18n.localize("abfalter.gm") : game.user.name
    };

    const content = await foundry.applications.handlebars.renderTemplate(template, { 
        basicInfo,
        rollData,
        actor,
        defenseDetails
    });

    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        sound: CONFIG.sounds.dice,
        content: content,
        rolls: [rollResult],
        flags: {            
            abfalter: {
                customChatHeaderCard: true,
                basicInfo: basicInfo,
                defenseDetails: defenseDetails,
                rollData: rollData,
                num: num
            } 
        }
    };

    const speakerMode = actor.system.rollRange.speaker; // "default" | "public" | "private"
    let rollMode;
    switch (speakerMode) {
        case "public":
            rollMode = "public";
            break;
        case "private":
            rollMode = "gm";
            break;
        default:
            rollMode = game.settings.get("core", "messageMode");
    }
    ChatMessage.applyMode(chatData, rollMode);
    await ChatMessage.create(chatData);
}

export async function defensiveContinuationRoll(msg) {
    const template = "systems/abfalter/templates/dialogues/diceRolls/defensiveRoll.hbs";
    const continuationType = event.currentTarget.dataset.rollType;
    const rollFunction = {
        open: performOpenRoll,
        fumble: performFumbleRoll
    }[continuationType];
    if (!rollFunction) {
        throw new Error(
            `Unknown offensive continuation type: ${continuationType}`
        );
    }
    const { actor, num, rollData } = await rollFunction(msg);

    const content = await foundry.applications.handlebars.renderTemplate(template, {
        basicInfo: msg.flags.abfalter.basicInfo,
        rollData,
        actor,
        defenseDetails: msg.flags.abfalter.defenseDetails
    });

    await msg.update({
        content,
        "flags.abfalter.rollData": rollData,
        "flags.abfalter.num": num
    });
}



/** Handles psychic projections attacks post Potential Picked in chat
 * @param {Actor} actor - The actor using the weapon.
 * @param {string} matrixInfo - Has all values of matrix if complex.
 * @param {string} type - complex has matrix info | simple doesn't
 */
export async function matrixAttackDialogue({actor, matrixInfo}) {
    const template = "systems/abfalter/templates/dialogues/prompt/offensivePsychic.hbs";
    let confirmed = false;
    let baseValue = actor.system.toggles.psychicModuleStatus ? actor.system.pproj.atkModule : actor.system.pproj.finalOff;
    let bonusProj = matrixInfo.projBonus;
    let baseDmg = matrixInfo.dmg;
    let baseAtPen = matrixInfo.atPen;
    let finalValue = 0;
    let finalFormula = "";
    let finalDmg = baseDmg;
    let finalAtPen = baseAtPen;
    let ppSpent = 0;
    let selectedAimTarget = "";
    let isPrecision = actor.system.autoCombat.precisionMatrix === true;
    const damageTypes = Array.isArray(matrixInfo.dmgTypeList) ? matrixInfo.dmgTypeList : [];
    const favoriteDamageType = matrixInfo.favDmgType ?? "";
    let selectedDmgType = damageTypes.includes(favoriteDamageType) ? favoriteDamageType : damageTypes[0] ?? "";
    if (damageTypes.length === 0) {
        ui.notifications.warn(game.i18n.localize("abfalter.noDamageType"));
        return;
    }
    const htmlContent = await foundry.applications.handlebars.renderTemplate(template);
    // Get Target Token & Prepare Combat Workflow
    let selectedTargetIds = Array.from(game.user.targets).filter(t => t?.actor).map(t => t.id);
    let targetHookId = null;

    const getCurrentSelectedTargetIds = () => {
        return Array.from(game.user.targets)
            .filter(t => t?.actor)
            .map(t => t.id);
    };
    const renderSelectedTargets = (htmlRoot) => {
        const targetListEl = htmlRoot.querySelector('#selectedTargetsList');
        if (!targetListEl) return;

        const tokens = selectedTargetIds
            .map(id => canvas.tokens?.get(id))
            .filter(Boolean);

        targetListEl.textContent = tokens.length
            ? tokens.map(t => t.name).join(", ")
            : game.i18n.localize("abfalter.none");
    };
    const syncSelectedTargets = (htmlRoot) => {
        selectedTargetIds = getCurrentSelectedTargetIds();
        renderSelectedTargets(htmlRoot);
    };
    const clearOptions = (el) => {
        if (el) el.innerHTML = "";
    };
    const appendOption = (el, { value, label, selected = false, dataset = {} }) => {
        if (!el) return;
        const option = document.createElement("option");
        option.value = String(value ?? "");
        option.textContent = label ?? "";
        if (selected) option.selected = true;

        for (const [key, val] of Object.entries(dataset)) {
            option.dataset[key] = String(val);
        }

        el.appendChild(option);
    };
    const updateRollButtonLabel = (dialog) => {
        const root = dialog.element;
        if (!root) return;

        const rollButton =
            root.querySelector('[data-action="roll"]') ||
            root.querySelector('button[data-action="roll"]');

        if (rollButton) {
            rollButton.textContent = `${game.i18n.localize("abfalter.dialogs.roll")}: ${finalValue}`;
        }

        //rollButton.disabled = isMatrixRoll && (potentialSpent < 10 || !selectedMatrixId);
    };
    const updateDamageAndAtPen = html => {
        const dmgModifier = Number(html.querySelector("#dmgMod")?.value) || 0;
        const atPenModifier = Number(html.querySelector("#atPenMod")?.value) || 0;
        finalDmg = baseDmg + dmgModifier;
        finalAtPen = baseAtPen + atPenModifier;
        const dmgFinalValue = html.querySelector("#dmgFinalValue");
        const atPenFinalValue = html.querySelector("#atPenFinalValue");
        if (dmgFinalValue) { dmgFinalValue.textContent = String(finalDmg); }
        if (atPenFinalValue) { atPenFinalValue.textContent = String(finalAtPen); }
    };
    const updateFinalValue = (html, dialog) => {
        const modifierValue = Number(html.querySelector('#modifierMod')?.value) || 0;
        const selectedModifier = Number(html.querySelector('#modifierSelect')?.value) || 0;
        const selectedPenalty = parseInt(html.querySelector('#directedAtkDropdown option:checked')?.dataset.penalty ?? 0, 10);

        ppSpent = Number(html.querySelector('#ppDropdown')?.value) || 0;

        finalValue =
            baseValue +
            bonusProj +
            (ppSpent * actor.system.psySettings.projPPValueFinal) +
            modifierValue +
            selectedPenalty +
            selectedModifier;

        finalFormula =
            `${baseValue}(${game.i18n.localize("abfalter.potential")}) + ` +
            `${bonusProj}(${game.i18n.localize("abfalter.matrixBonus")}) + ` +
            `${ppSpent * actor.system.psySettings.projPPValueFinal}(${game.i18n.localize("abfalter.pp")}) + ` +
            `${modifierValue}(${game.i18n.localize("abfalter.mod")}) + ` +
            `${selectedPenalty}(${game.i18n.localize("abfalter.aim")}) + ` +
            `${selectedModifier}(${game.i18n.localize("abfalter.action")})`;

        updateRollButtonLabel(dialog);
    };

    const dialog = new diceDialogV2({
        window: {
            title: `${actor.name} - ${game.i18n.localize('abfalter.psyProj')}`
        },
        position: {
            width: 400,
        },
        content: htmlContent,
        classes: ["baseAbfalterV2"],
        buttons: [
            {
                action: "roll",
                label: `${game.i18n.localize("abfalter.dialogs.roll")}: ${finalValue}`,
                default: true,
                callback: () => {
                    confirmed = true;
                    return "roll";
                }
            },
            {
                action: "cancel",
                label: game.i18n.localize('abfalter.dialogs.cancel'),
                callback: () => {
                    confirmed = false;
                    return "cancel";
                }
            }
        ],
        onRender: async (html, dialogInstance) => {
            const modifierInput = html.querySelector('#modifierMod');
            const modifierSelect = html.querySelector('#modifierSelect');
            const directedAtkDropdown = html.querySelector('#directedAtkDropdown');
            const precisionMatrixToggle = html.querySelector("#precisionMatrixToggle");
            const precisionModeLabel = html.querySelector("#precisionModeLabel");
            const atkInfo = html.querySelector("#atkInfo");
            const dmgModInput = html.querySelector("#dmgMod");
            const atPenModInput = html.querySelector("#atPenMod");
            const ppDropdown = html.querySelector('#ppDropdown');
            const damageTypeDropdown = html.querySelector("#damageTypeDropdown");
            const ppMax = actor.system.psySettings.projMaxPPFinal;
            const availablePP = actor.system.psychicPoint.value;
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

            const populatePPDropdown = () => {
                clearOptions(ppDropdown);
                const usablePP = Math.min(ppMax, availablePP);
                for (let i = 0; i <= usablePP; i++) {
                    appendOption(ppDropdown, {
                        value: i,
                        label: String(i),
                        selected: i === 0
                    });
                }
            };

            const populateModifierDropdown = () => {
                clearOptions(modifierSelect);
                for (let index = 0; index < 10; index++) {
                    const value = -25 * index;

                    appendOption(modifierSelect, {
                        value,
                        label: game.i18n.localize(`abfalter.activeAction${index + 1}`),
                        selected: index === 0
                    });
                }
            };

            const populateDirectedAtkDropdown = () => {
                clearOptions(directedAtkDropdown);

                const previousTarget = directedAtkDropdown?.value ?? selectedAimTarget ?? "none";
                directedAtk.forEach(part => {
                    let penalty = Number(part.penalty) || 0;
                    if (part.tag === "none") {
                        penalty = 0;
                    } else if (isPrecision) {
                        penalty = Math.floor(penalty / 2);
                    }

                    appendOption(directedAtkDropdown, {
                        value: part.tag,
                        label: `${part.name} (${penalty})`,
                        selected: part.tag === previousTarget,
                        dataset: { penalty }
                    });
                });

                if (directedAtkDropdown) {
                    const targetStillExists = Array.from(directedAtkDropdown.options).some(option => option.value === previousTarget);
                    directedAtkDropdown.value = targetStillExists ? previousTarget : "none";
                }
                selectedAimTarget = directedAtkDropdown?.value ?? "none";
            };

            const updatePrecisionToggleDisplay = () => {
                if (!precisionModeLabel) return;
                precisionModeLabel.textContent = game.i18n.localize(isPrecision ? "abfalter.precision" : "abfalter.regular");
                precisionMatrixToggle.classList.toggle("kiBought", isPrecision);
            };

            const populateDamageTypeDropdown = () => {
                clearOptions(damageTypeDropdown);
                if (!damageTypeDropdown) return;

                if (!damageTypes.length) {
                    appendOption(damageTypeDropdown, {
                        value: "",
                        label: game.i18n.localize("abfalter.none"),
                        selected: true
                    });

                    damageTypeDropdown.disabled = true;
                    selectedDmgType = "";
                    return;
                }

                damageTypeDropdown.disabled = false;

                for (const damageType of damageTypes) {
                    appendOption(damageTypeDropdown, {
                        value: damageType,
                        label: game.i18n.localize(`abfalter.${damageType}`),
                        selected: damageType === selectedDmgType
                    });
                }

                damageTypeDropdown.value = selectedDmgType;
            };

            const updateAtkInfo = () => {
                if (!atkInfo) return;

                const infoParts = [`Proj: ${baseValue}`];
                if (bonusProj !== 0) {
                    infoParts.push(`Proj Bonus: ${bonusProj}`);
                }
                infoParts.push(`Dmg: ${baseDmg}`, `AT Pen: ${baseAtPen}`);
                atkInfo.textContent = infoParts.join(" · ");
            };


            modifierInput?.addEventListener("input", () => { updateFinalValue(html, dialogInstance) });
            ppDropdown?.addEventListener("change", () => { updateFinalValue(html, dialogInstance) });
            modifierSelect?.addEventListener("change", () => { updateFinalValue(html, dialogInstance) });
            directedAtkDropdown?.addEventListener('change', (ev) => {
                selectedAimTarget = ev.currentTarget.value;
                updateFinalValue(html, dialogInstance);
            });
            dmgModInput?.addEventListener("input", () => { updateDamageAndAtPen(html) });
            atPenModInput?.addEventListener("input", () => { updateDamageAndAtPen(html) });
            damageTypeDropdown?.addEventListener("change", event => {
                selectedDmgType = event.currentTarget.value ?? "";
            });
            precisionMatrixToggle?.addEventListener("click", () => {
                isPrecision = !isPrecision;

                updatePrecisionToggleDisplay();
                populateDirectedAtkDropdown();
                updateFinalValue(html, dialogInstance);
            });

            populatePPDropdown();
            populateModifierDropdown();
            updatePrecisionToggleDisplay();
            populateDirectedAtkDropdown();
            populateDamageTypeDropdown();
            updateAtkInfo();
            updateDamageAndAtPen(html);
            updateFinalValue(html, dialogInstance);
            syncSelectedTargets(html);
            targetHookId = Hooks.on("targetToken", (user, token, targeted) => {
                if (user.id !== game.user.id) return;
                syncSelectedTargets(html);
            });
        },
        onClose: async (html) => {
            if (targetHookId !== null) {
                Hooks.off("targetToken", targetHookId);
                targetHookId = null;
            }
            if (!confirmed) return;

            await actor.update({ 
                "system.psychicPoint.value": Math.max(0, actor.system.psychicPoint.value - ppSpent),
                "system.autoCombat.precisionMatrix": isPrecision
            });


            const workflow = createAttackWorkflow(actor, selectedTargetIds);

            const attackDetails = {
                actionName: `${game.i18n.localize("abfalter.psychic")}`,
                label: matrixInfo.name,

                attackType: "psychic",
                deliveryType: "projection",

                base: baseValue,
                value: finalValue, 
                formula: finalFormula,
                dmg: finalDmg,
                dmgType: selectedDmgType,
                atPen: finalAtPen,
                target: selectedAimTarget,

                openRange: actor.system.rollRange.final,
                fumbleRange: actor.system.fumleRange.final,
                isPredetermined: false,

                ammoName: "",
                hasNote: false,
                note: ""
            };
            await finishPotentialMatrixMessage(matrixInfo.potentialMsgId);
            await offensiveRoll({actor, attackDetails, workflow});
        }
    });
    dialog.render({ force: true });
}

async function finishPotentialMatrixMessage(potentialMsgId) {
    const potentialMsg = game.messages.get(potentialMsgId);
    if (!potentialMsg) {
        console.warn(`Potential message ${potentialMsgId} could not be found.`);
        return;
    }

    const matrixResolution = foundry.utils.deepClone(potentialMsg.flags.abfalter.matrixResolution);
    matrixResolution.rollFinished = true;
    const template = "systems/abfalter/templates/dialogues/diceRolls/potentialMatrixRoll.hbs";
    const content =
        await foundry.applications.handlebars.renderTemplate(template, {
            basicInfo: potentialMsg.flags.abfalter.basicInfo,
            rollData: potentialMsg.flags.abfalter.rollData,
            matrixDetails: potentialMsg.flags.abfalter.matrixDetails,
            matrixResolution
        });
    await potentialMsg.update({
        content,
        "flags.abfalter.matrixResolution": matrixResolution
    });
}

const MATRIX_EFFECT_KEYS = [
    "effect20",
    "effect40",
    "effect80",
    "effect120",
    "effect140",
    "effect180",
    "effect240",
    "effect280",
    "effect320",
    "effect440"
];

function getMatrixResolutionData({matrixDetails, rollTotal, upcastAmount = 0}) {
    const total = Math.max(0, Number(rollTotal) || 0);
    const upcast = Math.max(0, Number(upcastAmount) || 0);
    const effects = MATRIX_EFFECT_KEYS.map(key => {
        const effect = matrixDetails[key];
        if (!effect) return null;

        return {
            key,
            title: effect.title,
            titleNum: Number(key.replace("effect", "")),
            description: effect.description,
            failure: effect.failure === true,
            fatigue: Number(effect.fatigue) || 0
        };
    }).filter(Boolean);

    const firstSuccessfulEffect = effects.find(effect => !effect.failure);
    let reachedIndex = -1;

    for (let i = 0; i < effects.length; i++) {
        if (total >= effects[i].titleNum) {
            reachedIndex = i;
        }
    }

    if (reachedIndex === -1) {
        const lowestEffect = effects[0];
        const failureLevel = firstSuccessfulEffect
            ? Math.max(0, firstSuccessfulEffect.titleNum - total)
            : 0;
        return {
            hasSuccessfulEffect: false,
            failed: true,
            failureLevel,
            fatigue: lowestEffect?.fatigue ?? 0,
            achievedEffect: lowestEffect,
            availableEffects: []
        };
    }

    const effectiveIndex = Math.min(reachedIndex + upcast, effects.length - 1);
    const availableEffects = effects
        .slice(0, effectiveIndex + 1)
        .filter(effect => !effect.failure)
        .map(effect => ({
            ...effect,
            roll: {
                label: effect.title,
                total: effect.titleNum,
                color: "normalRoll",
                formula: effect.description
            }
        }));

    const achievedEffect = effects[effectiveIndex];
    const failed = availableEffects.length === 0;
    const failureLevel = failed && firstSuccessfulEffect
        ? Math.max(0, firstSuccessfulEffect.titleNum - total)
        : 0;

    return {
        hasSuccessfulEffect: availableEffects.length > 0,
        failed,
        failureLevel,
        fatigue: availableEffects.length === 0 ? achievedEffect.fatigue : 0,
        achievedEffect,
        availableEffects,
        chosen: false
    };
}

/** All Potential Rolls & Their Projection
 * 
 */
export async function potentialDialogue({ actor, mode }) {
    const isMatrixRoll = mode === "matrix";

    const psychicMatrices = actor.items
        .filter(item => item.type === "psychicMatrix")
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(item => ({
            id: item.id,
            name: item.name,
            type: item.system.type ?? "",
            finalPot: Number(item.system.finalPot) || 0
    }));

    if (isMatrixRoll && !psychicMatrices.length) {
        ui.notifications.warn(`${actor.name} has no psychic matrices.`);
        return;
    }

    const categories = [
        {
            value: "all",
            label: game.i18n.localize("abfalter.all")
        },
        {
            value: "basic",
            label: game.i18n.localize("abfalter.basic")
        },
        {
            value: "effect",
            label: game.i18n.localize("abfalter.effect")
        },
        {
            value: "attack",
            label: game.i18n.localize("abfalter.attack")
        },
        {
            value: "shield",
            label: game.i18n.localize("abfalter.shield")
        }
    ];

    const maximumPotential = Number(actor.system.ppotential?.final) || 0;
    const combat = game.combat;
    const remainingPotential = combat?.getRemainingPsychicPotential ? await combat.getRemainingPsychicPotential(actor) : maximumPotential;

    const template = "systems/abfalter/templates/dialogues/prompt/psychicMatrixPot.hbs";
    const htmlContent = await foundry.applications.handlebars.renderTemplate(template, {
        categories,
        matrices: psychicMatrices,
        maximumPotential,
        remainingPotential,
        isMatrixRoll
    });

    let confirmed = false;
    const preferredMatrixId = actor.system.autoCombat.prefMatrix ?? "";
    const preferredMatrixExists = psychicMatrices.some(matrix => matrix.id === preferredMatrixId);
    let selectedMatrixId = isMatrixRoll 
        ? preferredMatrixExists
            ? preferredMatrixId
            : psychicMatrices[0]?.id ?? null
        : null;
    let isInitialMatrixPopulation = true;

    let potentialSpent = isMatrixRoll ? remainingPotential >= 10 ? remainingPotential : 0 : 0;
    let baseValue  = isMatrixRoll ? potentialSpent : maximumPotential;
    let matrixBonus = isMatrixRoll ? psychicMatrices[0]?.finalPot ?? 0 : 0;
    let finalValue = baseValue + matrixBonus;
    let finalFormula = "";
    let ppSpent = 0;

    const clearOptions = (el) => {
        if (el) el.innerHTML = "";
    };
    const appendOption = (el, { value, label, selected = false, dataset = {} }) => {
        if (!el) return;
        const option = document.createElement("option");
        option.value = String(value ?? "");
        option.textContent = label ?? "";
        if (selected) option.selected = true;

        for (const [key, val] of Object.entries(dataset)) {
            option.dataset[key] = String(val);
        }

        el.appendChild(option);
    };
    const updateRollButtonLabel = (dialog) => {
        const root = dialog.element;
        if (!root) return;

        const rollButton =
            root.querySelector('[data-action="roll"]') ||
            root.querySelector('button[data-action="roll"]');

        if (rollButton) {
            rollButton.textContent = `${game.i18n.localize("abfalter.dialogs.roll")}: ${finalValue}`;
        }

        rollButton.disabled = isMatrixRoll && (potentialSpent < 10 || !selectedMatrixId);
    };
    const updateFinalValue = (html, dialog) => {
        const modifierValue = Number(html.querySelector('#modifierMod')?.value) || 0;
        const selectedModifier = Number(html.querySelector('#modifierSelect')?.value) || 0;
        ppSpent = Number(html.querySelector('#ppDropdown')?.value) || 0;
        baseValue = isMatrixRoll ? potentialSpent : maximumPotential;

        finalValue =
            baseValue +
            matrixBonus +
            (ppSpent * actor.system.psySettings.potPPValueFinal) +
            modifierValue +
            selectedModifier;

        const formulaParts = [
            `${baseValue}(${game.i18n.localize("abfalter.potential")})`
        ];
        if (isMatrixRoll) {
            formulaParts.push(`${matrixBonus}(${game.i18n.localize("abfalter.matrixBonus")})`);
        }
        formulaParts.push(
            `${ppSpent * actor.system.psySettings.potPPValueFinal}(${game.i18n.localize("abfalter.pp")})`,
            `${modifierValue}(${game.i18n.localize("abfalter.mod")})`,
            `${selectedModifier}(${game.i18n.localize("abfalter.action")})`
        );

        finalFormula = formulaParts.join(" + ");

        updateRollButtonLabel(dialog);
    };
    const dialog = new diceDialogV2({
        window: { title: `${actor.name} — ${game.i18n.localize( "abfalter.rollPotential" )}` },
        position: { width: 400 },
        content: htmlContent,
        classes: ["baseAbfalterV2"],
        buttons: [
            {
                action: "roll",
                label: `${game.i18n.localize("abfalter.dialogs.rollPotential")}: ${finalValue}`,
                default: true,
                callback: () => {
                    confirmed = true;
                    return "roll";
                }
            },
            {
                action: "cancel",
                label: game.i18n.localize( "abfalter.dialogs.cancel" ),
                callback: () => {
                    confirmed = false;
                    return "cancel";
                }
            }
        ],
        onRender: async (html, dialogInstance) => {
            const categorySelect = html.querySelector("#psychicMatrixCategory");
            const matrixSelect = html.querySelector("#psychicMatrixSelection");
            const emptyMessage = html.querySelector("#psychicMatrixEmptyMessage");
            const modifierInput = html.querySelector('#modifierMod');
            const modifierSelect = html.querySelector('#modifierSelect');
            const ppDropdown = html.querySelector('#ppDropdown');
            const potentialInput = html.querySelector("#potentialUsed");
            const maximumPotentialDisplay = html.querySelector("#maximumPotential");
            const remainingPotentialDisplay = html.querySelector("#remainingPotential");
            const bonusPotentialDisplay = html.querySelector("#bonusPotential");
            const bonusMatrixDisplay = html.querySelector("#bonusPotMatrix");
            const ppMax = actor.system.psySettings.potMaxPPFinal;
            const availablePP = actor.system.psychicPoint.value;

            const populatePPDropdown = () => {
                clearOptions(ppDropdown);
                const usablePP = Math.min(ppMax, availablePP);
                for (let i = 0; i <= usablePP; i++) {
                    appendOption(ppDropdown, {
                        value: i,
                        label: String(i),
                        selected: i === 0
                    });
                }
            };

            const populateModifierDropdown = () => {
                clearOptions(modifierSelect);
                for (let index = 0; index < 10; index++) {
                    const value = -25 * index;

                    appendOption(modifierSelect, {
                        value,
                        label: game.i18n.localize(`abfalter.activeAction${index + 1}`),
                        selected: index === 0
                    });
                }
            };

            const getFilteredMatrices = category => {
                if (category === "all") {
                    return psychicMatrices;
                }
                return psychicMatrices.filter(matrix => matrix.type === category);
            };

            const getSelectedMatrix = () => {
                return psychicMatrices.find(
                    matrix => matrix.id === selectedMatrixId
                ) ?? null;
            };

            const updatePotentialDisplay = () => {
                if (potentialInput) { 
                    potentialInput.value = String(potentialSpent);
                }
                if (maximumPotentialDisplay) {
                    maximumPotentialDisplay.textContent = String(maximumPotential);
                }
                if (remainingPotentialDisplay) {
                    remainingPotentialDisplay.textContent = String(remainingPotential);
                }
                updateFinalValue(
                    html,
                    dialogInstance
                );
            };

            const adjustPotential = change => {
                const minimum = remainingPotential >= 10 ? 10 : 0;
                potentialSpent = Math.clamp(
                    potentialSpent + change,
                    minimum,
                    remainingPotential
                );
                updatePotentialDisplay();
            };

            const updateMatrixBonus = () => {
                const selectedMatrix = getSelectedMatrix();
                matrixBonus = Number(selectedMatrix?.finalPot) || 0;

                if (bonusMatrixDisplay) { 
                    bonusMatrixDisplay.value = matrixBonus;
                }

                updateFinalValue(
                    html,
                    dialogInstance
                );
            };

            const updateMatrixOptions = () => {
                if (!isMatrixRoll || !matrixSelect) return;

                const selectedCategory = categorySelect?.value ?? "all";
                const filteredMatrices = getFilteredMatrices(selectedCategory);

                matrixSelect.replaceChildren();

                for (const matrix of filteredMatrices) {
                    const option = document.createElement("option");
                    option.value = matrix.id;
                    option.textContent = matrix.name;
                    matrixSelect.append(option);
                }

                const hasMatrices = filteredMatrices.length > 0;

                matrixSelect.disabled = !hasMatrices;

                if (emptyMessage) {
                    emptyMessage.hidden = hasMatrices;
                }

                if (!hasMatrices) {
                    selectedMatrixId = null;
                } else if (
                    isInitialMatrixPopulation &&
                    filteredMatrices.some(matrix => matrix.id === preferredMatrixId)
                ) {
                    selectedMatrixId = preferredMatrixId;
                } else {
                    selectedMatrixId = filteredMatrices[0].id;
                }

                if (selectedMatrixId) {
                    matrixSelect.value = selectedMatrixId;
                }

                isInitialMatrixPopulation = false;
                updateMatrixBonus();
            };

            /*
             * Potential adjustment buttons:
             * -100, -10, -5, +5, +10, +100
             */
            html.querySelectorAll("[data-potential-change]").forEach(button => {
                button.addEventListener( "click", () => {
                        const change =
                            Number(
                                button.dataset
                                    .potentialChange
                            ) || 0;

                        adjustPotential(change);
                    }
                );
            });

            /*
            * Potential set buttons:
            * Min / Max
            */
            html.querySelectorAll("[data-potential-set]").forEach(button => {
                button.addEventListener("click", () => {
                        switch (button.dataset.potentialSet) {
                            case "min":
                                potentialSpent = remainingPotential >= 10 ? 10 : 0;
                                break;
                            case "max":
                                potentialSpent = remainingPotential;
                                break;
                        }
                        updatePotentialDisplay();
                    }
                );
            });


            categorySelect?.addEventListener("change", updateMatrixOptions);
            matrixSelect?.addEventListener("change", event => {
                selectedMatrixId = event.currentTarget.value || null;
                updateMatrixBonus();
            });
            modifierInput?.addEventListener("input", () => { updateFinalValue(html, dialogInstance) });
            ppDropdown?.addEventListener("change", () => { updateFinalValue(html, dialogInstance) });
            modifierSelect?.addEventListener("change", () => { updateFinalValue(html, dialogInstance) });

            populatePPDropdown();
            populateModifierDropdown();
            if (isMatrixRoll) {
                updatePotentialDisplay();
                updateMatrixOptions();
            } else {
                updateFinalValue(html, dialogInstance);
            }
        },
        onClose: async () => {
            if (!confirmed) return;
            // Error Checking
            let selectedMatrix = null;
            if (isMatrixRoll) {
                if (!selectedMatrixId) {
                    ui.notifications.warn(game.i18n.localize("abfalter.dialogs.noPsychicMatrixSelected" ));
                    return;
                }
                selectedMatrix = actor.items.get(selectedMatrixId);
                if (!selectedMatrix) {
                    ui.notifications.error("The selected psychic matrix could not be found.");
                    return;
                }
                if (potentialSpent < 10) {
                    ui.notifications.warn( game.i18n.localize("abfalter.minimumPsychicPotential"));
                    return;
                }
                /* Validate the remaining Potential again.
                * This protects against two open dialogs spending the same resource.
                */
                if (
                    combat?.getRemainingPsychicPotential
                ) {
                    const currentRemaining = await combat.getRemainingPsychicPotential(actor);
                    if (potentialSpent > currentRemaining) {
                        ui.notifications.warn(game.i18n.localize("abfalter.insufficientPsychicPotential"));
                        return;
                    }
                    await combat.spendPsychicPotential(actor, potentialSpent);
                }
                await actor.update({"system.autoCombat.prefMatrix": selectedMatrix.id});
            }

            // Remove free PP used
            await actor.update({ 
                "system.psychicPoint.value": Math.max(0, actor.system.psychicPoint.value - ppSpent)
            });

            /** Redirect to rollPotential
             *  Storing type and more for chat card resolution
             */
            let rollDetails = {
                label: `${game.i18n.localize("abfalter.potential")}`,
                finalValue: finalValue,
                formula: finalFormula,
            }
            if (isMatrixRoll) {
                let potString = `${game.i18n.localize("abfalter.potentiaUsed")} ${potentialSpent} / ${remainingPotential}`
                let rollType = "complex"
                let matrixDetails = {
                    matrixId: selectedMatrix.id,
                    name: selectedMatrix.name,
                    tag: selectedMatrix.system.descTag,
                    desc: selectedMatrix.system.description,
                    type: selectedMatrix.system.type,
                    img: selectedMatrix.img,
                    resolved: false,
                    potInfo: potString
                }
                await potentialRoll({actor, rollDetails, matrixDetails, rollType: "complex"})
            } else {
                await potentialRoll({actor, rollDetails, matrixDetails: null, rollType: "simple"})
            }

        }
    });

    dialog.render({ force: true });
}

async function potentialRoll({actor, rollDetails, matrixDetails, rollType}) {
    const isMatrixRoll = rollType === "complex";
    const template = isMatrixRoll
        ? "systems/abfalter/templates/dialogues/diceRolls/potentialMatrixRoll.hbs"
        : "systems/abfalter/templates/dialogues/diceRolls/potentialRoll.hbs";
    let fumbleRange = actor.system.fumleRange.final; 
    let openRange = actor.system.rollRange.final; 
    let basePotential = actor.system.ppotential.final
    let isPredetermined = false;
    let num = 0;

    if (basePotential > 199 && fumbleRange > 1) {
        fumbleRange -= 1;
    }

    const rollResult = await createRoll(actor, rollDetails.finalValue, openRange, fumbleRange, isPredetermined);
    rollDetails.formula = `(${rollResult.rolledDice}) + ${rollDetails.formula}`;

    const rollData = [
        {
            roll: rollResult.rolledDice, 
            total: rollResult._total, 
            doubles: rollResult.doubles, 
            openRange: rollResult.openRange, 
            fumbleLevel: rollResult.fumbleLevel,
            fumble: rollResult.fumble, 
            explode: rollResult.explode, 
            color: rollResult.color, 
            formula: rollDetails.formula, 
            label: rollDetails.label
        }
    ];
    let matrixResolution = null;

    if (isMatrixRoll && matrixDetails) {
        const matrix = actor.items.get(matrixDetails.matrixId);
        matrixDetails.resolved = !rollResult.explode && !rollResult.fumble;
        if (matrixDetails.resolved) {
            matrixResolution = getMatrixResolutionData({
                matrixDetails: matrix.system.matrixDetails,
                rollTotal: rollResult.total,
                upcastAmount: matrix.system.upcastAmountFinal
            });
        }
    }

    let basicInfo = {
        portrait: actor.prototypeToken.texture.src,
        name: actor.name,
        userName: game.user.isGM ? game.i18n.localize("abfalter.gm") : game.user.name
    };

    const content = await foundry.applications.handlebars.renderTemplate(template, {
        matrixResolution, 
        matrixDetails,
        basicInfo,
        rollData,
        actor,
    });

    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        sound: CONFIG.sounds.dice,
        content: content,
        rolls: [rollResult],
        flags: {            
            abfalter: {
                customChatHeaderCard: true,
                basicInfo: basicInfo,
                matrixDetails,
                rollData: rollData,
                num: num,
                potentialType: rollType,
                matrixResolution
            } 
        }
    };

    const speakerMode = actor.system.rollRange.speaker; // "default" | "public" | "private"
    let rollMode;
    switch (speakerMode) {
        case "public":
            rollMode = "public";
            break;
        case "private":
            rollMode = "gm";
            break;
        default:
            rollMode = game.settings.get("core", "messageMode");
    }
    ChatMessage.applyMode(chatData, rollMode);
    await ChatMessage.create(chatData);
}

export async function potentialContinuationRollFunction(msg, html, event) {
    const isMatrixRoll = msg.flags.abfalter.potentialType === "complex";
    const template = isMatrixRoll
        ? "systems/abfalter/templates/dialogues/diceRolls/potentialMatrixRoll.hbs"
        : "systems/abfalter/templates/dialogues/diceRolls/potentialRoll.hbs";

    const continuationType = event.currentTarget.dataset.rollType;
    const rollFunction = {
        open: performOpenRoll,
        fumble: performFumbleRoll
    }[continuationType];
    if (!rollFunction) {
        throw new Error(`Unknown potential continuation type: ${continuationType}`);
    }
    const { actor, num, rollData } = await rollFunction(msg);

    const matrixDetails = msg.flags.abfalter.matrixDetails ?? null;
    let matrixResolution = null;

    if (isMatrixRoll && matrixDetails) {
        const currentRoll = rollData[num];
        const rollActor = ChatMessage.getSpeakerActor(msg.speaker) ?? actor;
        const matrix = rollActor?.items.get(matrixDetails.matrixId);

        matrixDetails.resolved = !rollData[num].explode && !rollData[num].fumble;

        if (matrixDetails.resolved) {
            matrixResolution = getMatrixResolutionData({
                matrixDetails: matrix.system.matrixDetails,
                rollTotal: currentRoll.total,
                upcastAmount: matrix.system.upcastAmountFinal
            });
        }
    }

    const content = await foundry.applications.handlebars.renderTemplate(template, {
        basicInfo: msg.flags.abfalter.basicInfo,
        rollData,
        actor,
        matrixDetails,
        matrixResolution
    });

    await msg.update({
        content,
        "flags.abfalter.matrixDetails": matrixDetails,
        "flags.abfalter.matrixResolution": matrixResolution,
        "flags.abfalter.rollData": rollData,
        "flags.abfalter.num": num,
    });
}

/** General Psychic Projection Dialog
 * 
 */
export async function psychicProjectionDialogue({ actor, value } = {}) {
    if (!actor) return;
    const template = "systems/abfalter/templates/dialogues/prompt/psychicProjection.hbs";
    const content = await foundry.applications.handlebars.renderTemplate(template);
    const baseValue = Number(actor.system.toggles?.psychicModuleStatus
        ? actor.system.pproj?.atkModule
        : actor.system.pproj?.finalOff) || Number(value) || 0;
    const maximumPP = Math.max(0, Math.floor(Number(actor.system.psySettings?.projMaxPPFinal) || 0));
    const ppBonus = Number(actor.system.psySettings?.projPPValueFinal) || 0;
    let projectionMode = "generic";
    let chosenMatrixId = "";
    let chosenLevel = null;
    let chosenDamageType = "";
    let ppSpent = 0;
    let actionModifier = 0;
    let manualModifier = 0;
    let finalValue = baseValue;
    let confirmed = false;
    let targetHookId = null;

    const thresholds = [20, 40, 80, 120, 140, 180, 240, 280, 320, 440];
    const matrices = actor.items
        .filter(item => item.type === "psychicMatrix" &&
            ["attack", "effect"].includes(String(item.system.type).toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name));
    const showEl = (el) => {
        if (el) el.style.display = "";
    };
    const hideEl = (el) => {
        if (el) el.style.display = "none";
    };
        const getLevels = matrix => {
        if (!matrix) return [];

        return thresholds.flatMap(level => {
            const key = `effect${level}`;
            const effect = matrix.system.matrixDetails?.[key];

            if (!effect || effect.failure === true) return [];

            return [{
                level,
                key,
                title: effect.title || String(level),
                effect
            }];
        });
    };
    const getEffect = () => {
        const matrix = getMatrix();
        const selection = getLevels(matrix)
            .find(row => row.level === Number(chosenLevel));

        if (!selection) return null;

        const { effect } = selection;
        const type = String(matrix.system.type).toLowerCase();
        const enabledTypes = (flags, uppercase = true) =>
            Object.entries(flags ?? {})
                .filter(([, enabled]) => enabled === true)
                .map(([key]) => uppercase ? key.toUpperCase() : key.toLowerCase());
        return {
            matrixId: matrix.id,
            matrixName: matrix.name,
            matrixType: type,
            level: selection.level,
            title: selection.title,
            description: effect.description ?? "",
            projBonus: Number(effect.projAdditional ?? 0) +
                (type === "effect" ? Number(matrix.system.effectAddProjFinal ?? 0) : 0),
            damage: Number(effect.dmgValueFinal ?? effect.dmgValue ?? 0),
            atPen: Number(effect.atPenFinal ?? effect.atPen ?? 0),
            damageTypes: enabledTypes(effect.dmgType),
            resValue: Number(effect.resValueFinal ?? effect.resValue ?? 0),
            resistanceTypes: enabledTypes(effect.resType, false),
            useAT: Boolean(matrix.system.effectUseAT ?? matrix.system.useAT ?? false),
            resOnFailedProj: matrix.system.effectFailedProj === true,
            failedProjResBonus: Number(matrix.system.effectFailedBonus) || 0,
            useImmunity: matrix.system.effectImmunities === true,
            immunityType: matrix.system.effectImmuType ?? "",
            infoLine: effect.infoLine ?? ""
        };
    };
    const getMatrix = () => matrices.find(matrix =>
        matrix.id === chosenMatrixId && String(matrix.system.type).toLowerCase() === projectionMode
    ) ?? null;
    const readNumber = (root, id) => Number(root.querySelector(id)?.value) || 0;
    const chooseOption = (select, value, label) => {
        const option = document.createElement("option");
        option.value = String(value);
        option.textContent = String(label);
        select.appendChild(option);
    };
    const refresh = (root, dialog, levelsChanged = false) => {
        const matrix = getMatrix();
        root.querySelector("#projectionMatrixRow").style.display = projectionMode === "generic" ? "none" : "flex";
        const matrixInfo = root.querySelector("#projectionMatrixInfo");
        projectionMode === "generic" ? hideEl(matrixInfo) : showEl(matrixInfo);
        const levelRow = root.querySelector("#projectionLevelRow");
        const levelSelect = root.querySelector("#projectionLevel");
        levelRow.style.display = matrix ? "flex" : "none";
        if (levelsChanged) {
            levelSelect.replaceChildren();
            const levels = getLevels(matrix);
            for (const { level, title } of levels) {
                chooseOption(levelSelect, level, title === String(level) ? title : `${level} — ${game.i18n.localize(`abfalter.${title}`)}`);
            }
            chosenLevel = levels[0]?.level ?? null;
            if (chosenLevel !== null) levelSelect.value = String(chosenLevel);
        }
        const selectedEffect = getEffect();
        const damageSelect = root.querySelector("#projectionDamageType");
        const damageRow = root.querySelector("#projectionDamageTypeRow");
        const activeTypes = selectedEffect?.matrixType === "attack" ? selectedEffect.damageTypes : [];
        damageRow.style.display = activeTypes.length > 1 ? "grid" : "none";
        damageSelect.replaceChildren();
        for (const type of activeTypes) {
            chooseOption(damageSelect, type, game.i18n.localize(`abfalter.${type.toLowerCase()}`));
        }
        if (!activeTypes.includes(chosenDamageType)) chosenDamageType = activeTypes[0] ?? "";
        if (chosenDamageType) damageSelect.value = chosenDamageType;

        ppSpent = readNumber(root, "#projectionPP");
        actionModifier = readNumber(root, "#projectionAction");
        manualModifier = readNumber(root, "#projectionMod");
        finalValue = baseValue + (selectedEffect?.projBonus ?? 0) + ppSpent * ppBonus + actionModifier + manualModifier;
        const parts = [];
        if (selectedEffect) {
            if (selectedEffect.infoLine) parts.push(selectedEffect.infoLine);
        }
        root.querySelector("#projectionMatrixInfo").textContent = parts.join(" · ");
        const selectedTargets = Array.from(game.user.targets).filter(t => t?.actor);
        root.querySelector("#projectionTargetSummary").textContent =
            `${game.i18n.localize("abfalter.target")}: ${selectedTargets.length ? selectedTargets.map(t => t.name).join(", ") : game.i18n.localize("abfalter.none")}`;
        const button = dialog.element?.querySelector('[data-action="roll"]');
        if (button) {
            button.textContent = `${game.i18n.localize("abfalter.dialogs.roll")}: ${finalValue}`;
            button.disabled = projectionMode !== "generic" && !selectedEffect;
        }
    };
    const dialog = new diceDialogV2({
        window: { title: `${actor.name} — ${game.i18n.localize("abfalter.psyProj")}` },
        position: { width: 430 },
        classes: ["baseAbfalterV2"],
        content,
        buttons: [
            { action: "roll", label: game.i18n.localize("abfalter.dialogs.roll"), default: true,
                callback: () => { confirmed = true; return "roll"; } },
            { action: "cancel", label: game.i18n.localize("abfalter.dialogs.cancel"),
                callback: () => { confirmed = false; return "cancel"; } }
        ],
        onRender: (root, dialogInstance) => {
            const modeSelect = root.querySelector("#projectionMode");
            const matrixSelect = root.querySelector("#projectionMatrix");
            const populateMatrices = () => {
                matrixSelect.replaceChildren();
                const eligible = matrices.filter(matrix => String(matrix.system.type).toLowerCase() === projectionMode);
                for (const matrix of eligible) chooseOption(matrixSelect, matrix.id, matrix.name);
                chosenMatrixId = eligible[0]?.id ?? "";
                matrixSelect.value = chosenMatrixId;
            };
            modeSelect.addEventListener("change", () => {
                projectionMode = modeSelect.value;
                chosenDamageType = "";
                populateMatrices();
                refresh(root, dialogInstance, true);
            });
            populateMatrices();
            const ppSelect = root.querySelector("#projectionPP");
            const usablePP = Math.min(maximumPP, Math.max(0, Math.floor(Number(actor.system.psychicPoint?.value) || 0)));
            for (let i = 0; i <= usablePP; i++) chooseOption(ppSelect, i, i);
            const actionSelect = root.querySelector("#projectionAction");
            for (let i = 0; i < 10; i++) chooseOption(actionSelect, -25 * i, game.i18n.localize(`abfalter.activeAction${i + 1}`));
            matrixSelect.addEventListener("change", () => {
                chosenMatrixId = matrixSelect.value;
                chosenDamageType = "";
                refresh(root, dialogInstance, true);
            });
            root.querySelector("#projectionLevel").addEventListener("change", event => {
                chosenLevel = Number(event.currentTarget.value);
                chosenDamageType = "";
                refresh(root, dialogInstance);
            });
            root.querySelector("#projectionDamageType").addEventListener("change", event => {
                chosenDamageType = event.currentTarget.value;
            });
            for (const selector of ["#projectionPP", "#projectionAction", "#projectionMod"]) {
                const field = root.querySelector(selector);
                field.addEventListener(field.tagName === "INPUT" ? "input" : "change", () => refresh(root, dialogInstance));
            }
            refresh(root, dialogInstance, true);
            targetHookId = Hooks.on("targetToken", user => {
                if (user.id === game.user.id) refresh(root, dialogInstance);
            });
        },
        onClose: async (root) => {
            if (targetHookId !== null) {
                Hooks.off("targetToken", targetHookId);
                targetHookId = null;
            }
            if (!confirmed) return;
            // Always recompute from current fields before committing resources.
            if (root) {
                projectionMode = root.querySelector("#projectionMode")?.value ?? "generic";
                chosenMatrixId = projectionMode === "generic" ? "" : root.querySelector("#projectionMatrix")?.value ?? "";
                chosenLevel = Number(root.querySelector("#projectionLevel")?.value) || null;
                ppSpent = readNumber(root, "#projectionPP");
                actionModifier = readNumber(root, "#projectionAction");
                manualModifier = readNumber(root, "#projectionMod");
                chosenDamageType = root.querySelector("#projectionDamageType")?.value || chosenDamageType;
            }
            const matrix = getMatrix();
            const chosen = matrix ? getEffect() : null;
            if (projectionMode !== "generic" && !chosen) {
                ui.notifications.warn("Select a successful matrix level before rolling.");
                return;
            }
            if (ppSpent > Number(actor.system.psychicPoint?.value ?? 0)) {
                ui.notifications.warn(game.i18n.localize("abfalter.insufficientPsychicPotential"));
                return;
            }
            if (chosen?.matrixType === "effect" && !chosen.resistanceTypes.length) {
                ui.notifications.warn("The selected effect has no resistance type configured.");
                return;
            }
            finalValue = baseValue + (chosen?.projBonus ?? 0) + ppSpent * ppBonus + actionModifier + manualModifier;
            const formula = [
                `${baseValue}(${game.i18n.localize("abfalter.pproj")})`,
                `${chosen?.projBonus ?? 0}(${game.i18n.localize("abfalter.projBonus")})`,
                `${ppSpent * ppBonus}(${game.i18n.localize("abfalter.pp")})`,
                `${actionModifier}(${game.i18n.localize("abfalter.action")})`,
                `${manualModifier}(${game.i18n.localize("abfalter.mod")})`
            ].join(" + ");
            const label = chosen ? `${chosen.matrixName} (${chosen.level})` : game.i18n.localize("abfalter.genericProjection");
            await psychicProjectionRoll({
                actor, chosen, chosenDamageType, baseValue, finalValue, formula, label, ppSpent
            });
        }
    });
    return dialog.render({ force: true });
}

/** Execute an already-configured psychic projection.
 * Generic -> seconary roll; 
 * Attack -> offensive roll.
 * Effect -> seconary roll.
 */
async function psychicProjectionRoll({actor, chosen, chosenDamageType, baseValue, finalValue, formula, label, ppSpent}) {
    const common = {
        base: baseValue, value: finalValue, formula, label,
        openRange: actor.system.rollRange.final,
        fumbleRange: actor.system.fumleRange.final,
        isPredetermined: false,
        matrixId: chosen?.matrixId ?? null,
        matrixLevel: chosen?.level ?? null
    };
    if (ppSpent) {
        await actor.update({"system.psychicPoint.value": Number(actor.system.psychicPoint.value) - ppSpent});
    }
    if (!chosen) {
        // A generic projection has no matrix and must not create an attack workflow.
        return secondaryRoll({actor, secondaryDetails: {
            baseValue, finalValue, formula, label, typeName: "psychicProjection",
            matrixId: null, matrixLevel: null
        }});
    }

    const workflow = createAttackWorkflow(actor,
        Array.from(game.user.targets).filter(token => token?.actor).map(token => token.id));
    if (chosen.matrixType === "attack") {
        return offensiveRoll({actor, workflow, attackDetails: {
            ...common,
            actionName: game.i18n.localize("abfalter.psychic"),
            attackType: "psychic", deliveryType: "projection",
            dmg: chosen.damage, atPen: chosen.atPen,
            dmgType: chosenDamageType || chosen.damageTypes[0] || "ENE",
            target: "none", ammoName: "", hasNote: false, note: ""
        }});
    }
    return effectRoll({actor, workflow, effectDetails: {
        ...common,
        actionName: game.i18n.localize("abfalter.psychic"),
        effectType: "psychic", useProj: true,
        resValue: chosen.resValue, resTypeList: chosen.resistanceTypes,
        useAT: chosen.useAT, atLabel: "", isFired: false, isInvisible: false,
        description: chosen.description, resOnFailedProj: chosen.resOnFailedProj,
        failedProjResBonus: chosen.failedProjResBonus, useImmunity: chosen.useImmunity,
        immunityType: chosen.immunityType,
    }});
}



/** Temporary magic-projection prompt. Uses the secondary-style d100 chat flow. TODO */
export function magicProjectionDialogue({ actor, value }) {
    return secondaryDialogue({ actor, value, label: game.i18n.localize("abfalter.offMagicProj") });
}

/** Dedicated temporary Magic Projection execution path; replace with Mystic attack rules later. TODO */
async function magicProjectionRoll({actor, secondaryDetails}) {
    return secondaryRoll({actor, secondaryDetails: {...secondaryDetails}});
}



/** Handles unarmed and weapon attacks Dialog
 * @param {Actor} actor - The actor using the weapon.
 * @param {string} offLabel - The label for the dialog.
 * @param {string} value - The base value of the attack.
 * @param {string} weaponId - The ID of the weapon.
 */
export async function offensiveDialogue({ actor, offLabel, value, weaponId }) {
    const template = "systems/abfalter/templates/dialogues/prompt/offensivePhysical.hbs";
    let confirmed = false;
    let baseValue = Number(value);
    let offenseType = "";
    let finalValue = 0;
    let finalFormula = "";
    let fatigueUsed = 0;
    let finalDmgNum = 0;
    let finalAtNum = 0;
    let isPrecise = false;
    let isVorpal = false;
    let vorpalLocation = "none";
    let vorpalModifier = 0;
    let selectedProfiles = [];
    let selectedProfileIndex = 0;
    let ammoUsed = 0;
    let ammoIdUsed = "";
    let rangedAmmoUsed = 0;
    let selectedDamageType = "";
    let selectedAimTarget = "";
    let currentDmgTypes = [];
    let promptNote = "";
    offenseType = offLabel === "unarmedAttack" ? "unarmed" : "weapon";
    // Standard hidden profiles are always available without custom entries.
    const htmlContent = await foundry.applications.handlebars.renderTemplate(template);

    // Get Target Token & Prepare Combat Workflow
    let selectedTargetIds = Array.from(game.user.targets).filter(t => t?.actor).map(t => t.id);
    let targetHookId = null;

    

    const getCurrentSelectedTargetIds = () => {
        return Array.from(game.user.targets)
            .filter(t => t?.actor)
            .map(t => t.id);
    };
    const renderSelectedTargets = (htmlRoot) => {
        const targetListEl = htmlRoot.querySelector('#selectedTargetsList');
        if (!targetListEl) return;

        const tokens = selectedTargetIds
            .map(id => canvas.tokens?.get(id))
            .filter(Boolean);

        targetListEl.textContent = tokens.length
            ? tokens.map(t => t.name).join(", ")
            : game.i18n.localize("abfalter.none");
    };
    const syncSelectedTargets = (htmlRoot) => {
        selectedTargetIds = getCurrentSelectedTargetIds();
        renderSelectedTargets(htmlRoot);
    };
    const setText = (html, selector, value) => {
        const el = html.querySelector(selector);
        if (el) el.textContent = String(value ?? "");
    };
    const showEl = (el) => {
        if (el) el.style.display = "";
    };
    const hideEl = (el) => {
        if (el) el.style.display = "none";
    };
    const clearOptions = (el) => {
        if (el) el.innerHTML = "";
    };
    const appendOption = (el, { value, label, selected = false, dataset = {} }) => {
        if (!el) return;
        const option = document.createElement("option");
        option.value = String(value ?? "");
        option.textContent = label ?? "";
        if (selected) option.selected = true;

        for (const [key, val] of Object.entries(dataset)) {
            option.dataset[key] = String(val);
        }

        el.appendChild(option);
    };
    const getSelectedWeapon = () => {
        if (!weaponId) return null;
        return actor.items.get(weaponId) ?? null;
    };
    const getWeaponProfiles = (weapon) => weaponProfiles(weapon, "offensive");
    const getSelectedProfileEntry = () => selectedProfiles?.[selectedProfileIndex] ?? null;
    const getSelectedProfile = () => getSelectedProfileEntry()?.profile ?? null;
    const getSelectedProfileOriginalIndex = () => getSelectedProfileEntry()?.originalIndex ?? -1;
    const getSelectedProfileId = () => getSelectedProfileEntry()?.key ?? "";
    const getEffectiveWeaponType = (weapon, profile) => {
        const weaponType = String(weapon?.system?.info?.type ?? "").toLowerCase();

        if (weaponType === "hybrid") {
            return String(profile?.atkType ?? "melee").toLowerCase();
        }

        if (weaponType === "ranged" || weaponType === "melee") {
            return weaponType;
        }

        return String(profile?.atkType ?? "melee").toLowerCase();
    };
    const updateRollButtonLabel = (dialog) => {
        const root = dialog.element;
        if (!root) return;

        const rollButton =
            root.querySelector('[data-action="roll"]') ||
            root.querySelector('button[data-action="roll"]');

        if (rollButton) {
            rollButton.textContent = `${game.i18n.localize("abfalter.dialogs.roll")}: ${finalValue}`;
        }
    };
    const updateFinalValue = (html, dialog) => {
        const selectedModifier = parseInt(html.querySelector('#modifierSelect')?.value ?? 0, 10);
        const fatigueValue = parseInt(html.querySelector('#fatigueDropdown')?.value ?? 0, 10);
        const modifierValue = parseInt(html.querySelector('#modifierMod')?.value ?? 0, 10);
        const selectedPenalty = parseInt(html.querySelector('#directedAtkDropdown option:checked')?.dataset.penalty ?? 0, 10);

        fatigueUsed = fatigueValue;

        finalValue =
            baseValue +
            (fatigueValue * actor.system.settings.fatigueValue) +
            modifierValue +
            selectedPenalty +
            selectedModifier;

        finalFormula =
            `${baseValue}(${game.i18n.localize("abfalter.value")}) + ` +
            `${fatigueValue * actor.system.settings.fatigueValue}(${game.i18n.localize("abfalter.fatigue")}) + ` +
            `${modifierValue}(${game.i18n.localize("abfalter.mod")}) + ` +
            `${selectedPenalty}(${game.i18n.localize("abfalter.aim")}) + ` +
            `${selectedModifier}(${game.i18n.localize("abfalter.action")})`;

        updateRollButtonLabel(dialog);
    };

    const dialog = new diceDialogV2({
        window: {
            title: `${actor.name} - ${game.i18n.localize('abfalter.offense')}`
        },
        position: {
            width: 400,
        },
        content: htmlContent,
        classes: ["baseAbfalterV2"],
        buttons: [
            {
                action: "roll",
                label: `${game.i18n.localize("abfalter.dialogs.roll")}: ${finalValue}`,
                default: true,
                callback: () => {
                    confirmed = true;
                    return "roll";
                }
            },
            {
                action: "cancel",
                label: game.i18n.localize('abfalter.dialogs.cancel'),
                callback: () => {
                    confirmed = false;
                    return "cancel";
                }
            }
        ],
        onRender: async (html, dialogInstance) => {
            const modifierInput = html.querySelector('#modifierMod');
            const modifierSelect = html.querySelector('#modifierSelect');
            const atkDmgTypeDropdown = html.querySelector('#atkDmgTypeDropdown');
            const directedAtkDropdown = html.querySelector('#directedAtkDropdown');
            const fatigueDropdown = html.querySelector('#fatigueDropdown');
            const profileDropdown = html.querySelector('#profileDropdown');

            const profileRow = html.querySelector('#profileRow');
            const ammoDropdown = html.querySelector('#ammoDropdown');
            const ammoRow = html.querySelector('#ammoRow');
            const noteRow = html.querySelector('#noteRow');
            const maxFatigue = actor.system.kiAbility.kiUseOfEne.status ? 5 : 2;
            const fatigueVal = actor.system.fatigue.value;
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

            const populateFatigueDropdown = () => {
                clearOptions(fatigueDropdown);
                const availableFatigue = Math.min(maxFatigue, fatigueVal);

                for (let i = 0; i <= availableFatigue; i++) {
                    appendOption(fatigueDropdown, {
                        value: i,
                        label: String(i),
                        selected: i === 0
                    });
                }
            };
            populateFatigueDropdown();

            const populateDirectedAtkDropdown = () => {
                clearOptions(directedAtkDropdown);

                directedAtk.forEach(part => {
                    let penalty = part.penalty;
                    if (isPrecise && penalty !== 0) penalty = Math.floor(penalty / 2);
                    if (isVorpal && (vorpalLocation === part.tag || vorpalLocation === "anywhere")) penalty = vorpalModifier;
                    if (part.tag === "none") penalty = 0;

                    appendOption(directedAtkDropdown, {
                        value: part.tag,
                        label: `${part.name} (${penalty})`,
                        dataset: { penalty }
                    });
                });

                if (isVorpal && directedAtkDropdown) {
                    directedAtkDropdown.value = vorpalLocation === "anywhere" ? "none" : vorpalLocation;
                }

                selectedAimTarget = directedAtkDropdown?.value ?? "none";
            };
            populateDirectedAtkDropdown();

            const populateAtkTypeDropdown = () => {
                clearOptions(atkDmgTypeDropdown);

                if (offenseType === "unarmed") {
                    const actorDmgType = actor.system.fistDamage?.dmgType ?? "CUT";
                    const selectedType = damageTypes[actorDmgType] ? actorDmgType : "CUT";

                    for (const [value, label] of Object.entries(damageTypes)) {
                        appendOption(atkDmgTypeDropdown, {
                            value,
                            label,
                            selected: value === selectedType
                        });
                    }

                    selectedDamageType = selectedType;
                    return;
                }

                currentDmgTypes.forEach((type, i) => {
                    const labelPrefix = i === 0
                        ? game.i18n.localize('abfalter.primaryShort')
                        : game.i18n.localize('abfalter.secondaryShort');

                    const labelText = type
                        ? `${labelPrefix}${type}`
                        : game.i18n.localize('abfalter.noDamageType');

                    appendOption(atkDmgTypeDropdown, {
                        value: type,
                        label: labelText,
                        selected: i === 0
                    });
                });

                selectedDamageType = atkDmgTypeDropdown?.value ?? "";
            };

            const populateProfileDropdown = () => {
                clearOptions(profileDropdown);

                if (!weaponId) {
                    selectedProfiles = [];
                    selectedProfileIndex = 0;
                    return;
                }

                const weapon = getSelectedWeapon();
                selectedProfiles = getWeaponProfiles(weapon);

                if (!selectedProfiles.length) {
                    selectedProfileIndex = 0;
                    return;
                }

                const lastAtkUsed = Number(weapon?.system?.info?.lastWepUsed ?? -1);
                const lastId = weapon?.system?.info?.lastWepProfileId;
                selectedProfileIndex = selectedProfiles.findIndex(entry => entry.key === lastId);
                if (selectedProfileIndex < 0) selectedProfileIndex = selectedProfiles.findIndex(entry => entry.originalIndex === lastAtkUsed);
                if (selectedProfileIndex < 0) selectedProfileIndex = 0;

                selectedProfiles.forEach((entry, index) => {
                    appendOption(profileDropdown, {
                        value: index,
                        label: entry.profile.name,
                        selected: index === selectedProfileIndex
                    });
                });

                profileDropdown.value = String(selectedProfileIndex);
            };
            populateProfileDropdown();

            const updateMeleeDmgTypes = () => {
                const weapon = getSelectedWeapon();
                const profile = getSelectedProfile();
                currentDmgTypes.length = 0;

                if (!weapon || !profile) {
                    currentDmgTypes.push("");
                    return;
                }

                const profileForcesDamageType = profile.properties?.damageType?.bool === true;

                if (profileForcesDamageType) {
                    currentDmgTypes.push(profile.damageType ?? "");
                    return;
                }

                const prim = weapon?.system?.primDmgT;
                const sec = weapon?.system?.secDmgT;

                if (
                    (!prim || String(prim).toLowerCase() === "none" || prim === "NONE") &&
                    (!sec || String(sec).toLowerCase() === "none" || sec === "NONE")
                ) {
                    currentDmgTypes.push("");
                    return;
                }

                let availableTypes = [];

                if (prim === "ANY" || sec === "ANY") {
                    const allTypes = Object.keys(damageTypes).filter(t => t !== "NONE");

                    if (prim && prim !== "ANY" && prim !== "NONE") {
                        availableTypes.push(prim);
                        allTypes.filter(t => t !== prim).forEach(t => availableTypes.push(t));
                    } else {
                        availableTypes = allTypes;
                    }
                } else {
                    if (prim && prim !== "NONE") availableTypes.push(prim);
                    if (sec && sec !== "NONE" && sec !== prim) availableTypes.push(sec);
                }

                if (!availableTypes.length) {
                    currentDmgTypes.push("");
                    return;
                }

                availableTypes.forEach(type => currentDmgTypes.push(type));
            };

            const updateRangedDmgTypes = (dmgType) => {
                const profile = getSelectedProfile();
                currentDmgTypes.length = 0;

                if (!profile) {
                    currentDmgTypes.push("");
                    return;
                }

                const profileForcesDamageType = profile.properties?.damageType?.bool === true;
                const chosenDmgType = profileForcesDamageType ? profile.damageType : dmgType;

                if (!chosenDmgType || String(chosenDmgType).toLowerCase() === "none") {
                    currentDmgTypes.push("");
                    return;
                }

                let availableTypes;
                if (chosenDmgType === "ANY") {
                    availableTypes = Object.keys(damageTypes).filter(type => type !== "NONE");
                } else {
                    availableTypes = [chosenDmgType];
                }

                availableTypes.forEach(type => currentDmgTypes.push(type));
            };

            const populateAmmoDropdown = () => {
                clearOptions(ammoDropdown);
                const weapon = getSelectedWeapon();
                if (!weapon || !ammoDropdown) return;
                const mode = ammoMode(weapon);
                if (mode === "loaded") {
                    const loaded = weapon.system.ranged.loadedAmmo;
                    ammoIdUsed = loadedCount(weapon) ? loaded.itemId : "none";
                    appendOption(ammoDropdown, {value:ammoIdUsed,label:loadedCount(weapon) ? `${loaded.name} (${loadedCount(weapon)}/${weapon.system.ranged.magSizeMax})` : "Unloaded — load in Armory"});
                    ammoDropdown.disabled = true;
                } else if (mode === "none") {
                    ammoIdUsed = "none";
                    appendOption(ammoDropdown, {value:"none", label:game.i18n.localize("abfalter.none")});
                    ammoDropdown.disabled = true;
                } else if (mode === "direct") {
                    ammoDropdown.disabled = false;
                    const available = (weapon.system.ranged.ammoIds ?? []).filter(entry =>
                        entry.id !== "none" && Number(weapon.parent?.items?.get(entry.id)?.system?.quantity ?? 0) > 0);
                    for (const ammo of available) appendOption(ammoDropdown,{value:ammo.id,label:ammo.name});
                    if (!available.length) appendOption(ammoDropdown, {value:"none",label:game.i18n.localize("abfalter.none")});
                    const current = weapon.system.ranged.selectedAmmo;
                    ammoIdUsed = available.some(a=>String(a.id) === String(current)) ? String(current) : String(available[0]?.id ?? "none");
                    ammoDropdown.value = ammoIdUsed;
                    ammoDropdown.disabled = available.length === 0;
                }
            };

            const updateAmmoValues = () => {
                const weapon = getSelectedWeapon();
                const profile = getSelectedProfile();
                if (!weapon || !profile) return;

                const ammunition = Number(weapon.system.profilesVersion) ?
                    (profileUsesAmmo(profile) ? ammoStats(weapon,ammoIdUsed) : null) :
                    (profile.ignoreAmmo ? null : ammoStats(weapon,ammoIdUsed));
                const resolved = resolvedAttack(weapon,profile,ammunition);
                // Always use the same resolved Attack in the prompt and dice formula.
                // This also supports future ammunition bonuses to Attack.
                baseValue = resolved.attack;
                updateRangedDmgTypes(resolved.dmgType);
                populateAtkTypeDropdown();
                setText(html, '#attackPower', resolved.attack);
                setText(html, '#damageNum', resolved.damage);
                setText(html, '#atPenNum', resolved.atPen);
                setText(html, '#newAtkInfo',
                    `${game.i18n.localize('abfalter.baseAtkShort')}: ${resolved.attack}` +
                    ` · ${game.i18n.localize('abfalter.baseDmgShort')}: ${resolved.damage}` +
                    ` · ${game.i18n.localize('abfalter.basePenShort')}: ${resolved.atPen}`);
                finalDmgNum = resolved.damage;
                finalAtNum = resolved.atPen;
                updateFinalValue(html, dialogInstance);
            };

            const updateWeaponProfileState = () => {
                const weapon = getSelectedWeapon();
                const profile = getSelectedProfile();
                if (!weapon || !profile) return;

                const effectiveWeaponType = getEffectiveWeaponType(weapon,profile);
                const useRanged = effectiveWeaponType === "ranged";
                const legacy = !Number(weapon.system.profilesVersion) && !profile.isFallback;
                isPrecise = Boolean(weapon.system.properties?.precision?.bool && (legacy ? !profile.properties?.precision?.bool : profile.properties?.precision?.bool));
                isVorpal = Boolean(weapon.system.properties?.vorpal?.bool && (legacy ? !profile.ignoreVorpal : profile.properties?.vorpal?.bool));
                const vorpalOverride = legacy ? profile.properties?.vorpal?.bool : profile.customizeVorpal;
                vorpalLocation = vorpalOverride ? profile.vorpalLocation : weapon.system.info.vorpalLocation;
                vorpalModifier = vorpalOverride ? profile.vorpalMod : weapon.system.info.vorpalMod;
                populateDirectedAtkDropdown();
                ammoUsed = 0;
                if (!useRanged && weapon.system.properties?.throwable?.bool &&
                    (legacy ? !profile.ignoreThrown : profile.properties?.throwable?.bool)) {
                    ammoUsed = (legacy ? profile.properties?.throwable?.bool : profile.customizeThrowable) ? (profile.quantityConsumed ? 0 : Number(profile.consumedValue ?? 0)) :
                        (weapon.system.melee?.returning ? 0 : Number(weapon.system.melee?.throwConsumption ?? 1));
                }
                rangedAmmoUsed = useRanged ? ammoCost(weapon,profile) : 0;
                const resolved = resolvedAttack(weapon,profile, null);
                baseValue = resolved.attack;
                setText(html,'#attackPower',baseValue);
                if (useRanged) {
                    populateAmmoDropdown();
                    updateAmmoValues();
                    if (ammoMode(weapon) === "none" || (Number(weapon.system.profilesVersion) ? !profileUsesAmmo(profile) : profile.ignoreAmmo)) hideEl(ammoRow);
                    else showEl(ammoRow);
                } else {
                    updateMeleeDmgTypes();
                    populateAtkTypeDropdown();
                    hideEl(ammoRow);
                    finalDmgNum = resolved.damage;
                    finalAtNum = resolved.atPen;
                    setText(html,'#damageNum', finalDmgNum);
                    setText(html,'#atPenNum',finalAtNum);
                    setText(html,'#newAtkInfo',
                        `${game.i18n.localize('abfalter.baseAtkShort')}: ${baseValue}` +
                        ` · ${game.i18n.localize('abfalter.baseDmgShort')}: ${finalDmgNum}` +
                        ` · ${game.i18n.localize('abfalter.basePenShort')}: ${finalAtNum}`);
                }

                const reachLabel = game.i18n.localize(`abfalter.${weapon.system.distance?.reachUnitType}`);
                const rangeLabel = game.i18n.localize(`abfalter.${weapon.system.distance?.rangeUnitType}`);
                const usesRange = useRanged ||
                    (weapon.system.properties?.throwable?.bool &&
                        (legacy ? !profile.ignoreThrown : profile.properties?.throwable?.bool));

                if (usesRange) {
                    setText(
                        html,
                        '#newRangeInfo',
                        `${game.i18n.localize('abfalter.reach')}: ${weapon.system.distance?.reach} ${reachLabel}
                         · ${game.i18n.localize('abfalter.range')}: ${weapon.system.distance?.range} ${rangeLabel}`
                    );
                } else {
                    setText(
                        html,
                        '#newRangeInfo',
                        `${game.i18n.localize('abfalter.reach')}: ${weapon.system.distance?.reach} ${reachLabel}`
                    );
                }

                if (profile.properties?.note?.bool) {
                    promptNote = profile.attackNote ?? "";
                    showEl(noteRow);
                } else {
                    promptNote = "";
                    hideEl(noteRow);
                }

                setText(html, '#noteInfo', promptNote);

                populateAtkTypeDropdown();
                updateFinalValue(html, dialogInstance);
            };

            const updateDialogueModeVisibility = () => {
                if (offenseType === "weapon") {
                    showEl(profileRow);
                } else {
                    hideEl(profileRow);
                    hideEl(ammoRow);
                    hideEl(noteRow);
                }
            };


            clearOptions(modifierSelect);
            for (let i = 0; i < 10; i++) {
                const modValue = -25 * i;
                appendOption(modifierSelect, {
                    value: modValue,
                    label: game.i18n.localize(`abfalter.activeAction${i + 1}`),
                    selected: i === 0
                });
            }
            if (modifierSelect) modifierSelect.value = "0";

            updateDialogueModeVisibility();

            if (offenseType === "unarmed") {
                baseValue = Number(value ?? 0);
                finalDmgNum = Number(actor.system.fistDamage.final ?? 10);
                finalAtNum = Number(actor.system.fistDamage.atPen ?? 0);
                isPrecise = false;
                isVorpal = false;
                vorpalLocation = "none";
                vorpalModifier = 0;

                setText(html, '#attackPower', baseValue);
                setText(html, '#damageNum', finalDmgNum);
                setText(html, '#atPenNum', finalAtNum);

                populateAtkTypeDropdown();
                updateFinalValue(html, dialogInstance);
            } else {
                updateWeaponProfileState();
            }

            profileDropdown?.addEventListener('change', (ev) => {
                selectedProfileIndex = Number(ev.currentTarget.value);
                updateWeaponProfileState();
            });
            ammoDropdown?.addEventListener('change', (ev) => {
                const activeWeapon = getSelectedWeapon();
                if (!activeWeapon || ammoMode(activeWeapon) !== "direct") return;
                ammoIdUsed = ev.currentTarget.value;
                updateAmmoValues();
                updateFinalValue(html, dialogInstance);
            });
            fatigueDropdown?.addEventListener('change', () => updateFinalValue(html, dialogInstance));
            modifierInput?.addEventListener('input', () => updateFinalValue(html, dialogInstance));
            modifierSelect?.addEventListener('change', () => updateFinalValue(html, dialogInstance));
            directedAtkDropdown?.addEventListener('change', (ev) => {
                selectedAimTarget = ev.currentTarget.value;
                updateFinalValue(html, dialogInstance);
            });
            atkDmgTypeDropdown?.addEventListener('change', (ev) => {
                selectedDamageType = ev.currentTarget.value;
            });
            syncSelectedTargets(html);
            targetHookId = Hooks.on("targetToken", (user, token, targeted) => {
                if (user.id !== game.user.id) return;
                syncSelectedTargets(html);
            });
        },
        onClose: async (html) => {
            if (targetHookId !== null) {
                Hooks.off("targetToken", targetHookId);
                targetHookId = null;
            }
            if (!confirmed) return;
            if (offenseType === "unarmed") {
                await actor.update({"system.fatigue.value":Math.floor(actor.system.fatigue.value-fatigueUsed)});
                await actor.update({"system.fistDamage.dmgType":selectedDamageType});
                const workflow = createAttackWorkflow(actor, selectedTargetIds);
                await offensiveRoll({actor, attackDetails:{
                    actionName:game.i18n.localize("abfalter.unarmed"),
                    label:`${game.i18n.localize("abfalter.unarmed")} ${game.i18n.localize("abfalter.attack")}`,
                    attackType:"unarmed",deliveryType:"melee",base:Number(value ?? 0),value:finalValue,formula:finalFormula,
                    dmg:finalDmgNum,dmgType:selectedDamageType,atPen:finalAtNum,target:selectedAimTarget,
                    openRange:actor.system.rollRange.final,fumbleRange:actor.system.fumleRange.final,
                    isPredetermined:false,ammoName:"",hasNote:false,note:""
                },workflow});
                return;
            }
            const weapon = getSelectedWeapon();
            const profile = getSelectedProfile();
            if (!weapon || !profile) return;
            const effectiveWeaponType = getEffectiveWeaponType(weapon,profile);
            const selectedAmmoName = effectiveWeaponType === "ranged" && ammoRequirement(weapon, profile)
                ? (ammoStats(weapon,ammoIdUsed)?.name ?? "") : "";
            if (effectiveWeaponType === "ranged") {
                try { await spendWeaponAmmo(weapon,profile,ammoIdUsed); }
                catch (error) { ui.notifications.warn(error.message); return; }
            } else if (ammoUsed > 0) {
                if (Number(weapon.system.quantity) < ammoUsed) {
                    ui.notifications.warn("Not enough throwable weapons remaining."); return;
                }
                await weapon.update({"system.quantity": Math.floor(Number(weapon.system.quantity)-ammoUsed)});
            }
            await weapon.update({
                "system.info.lastWepProfileId":getSelectedProfileId(),
                "system.info.lastWepUsed":getSelectedProfileOriginalIndex(),
                ...(effectiveWeaponType === "ranged" && ammoMode(weapon) === "direct" && profileUsesAmmo(profile)
                    ? {"system.ranged.selectedAmmo":ammoIdUsed} : {})
            });
            await actor.update({"system.fatigue.value":Math.floor(actor.system.fatigue.value-fatigueUsed)});
            const ammoName = selectedAmmoName;

            const isPredetermined = profile.properties?.predetermined?.bool === true;
            const hasNote = profile.properties?.note?.bool === true;
            const note = hasNote ? (profile.chatNote ?? "") : "";

            const workflow = createAttackWorkflow(actor, selectedTargetIds);

            const attackDetails = {
                actionName: weapon.name,
                label: `${profile.name} ${game.i18n.localize("abfalter.attack")}`,

                attackType: "weapon",
                deliveryType: effectiveWeaponType,
    
                base: baseValue,
                value: finalValue,
                formula: finalFormula,
                dmg: finalDmgNum,
                dmgType: selectedDamageType,
                atPen: finalAtNum,
                target: selectedAimTarget,

                openRange: Number(weapon.system.derived.baseOpenRollRange),
                fumbleRange: Number(weapon.system.derived.baseFumbleRange),
                isPredetermined,

                ammoName,
                hasNote,
                note
            };

            await offensiveRoll({actor, attackDetails, workflow});
        }
    });

    dialog.render({ force: true });
}

async function offensiveRoll({actor, attackDetails, workflow}) {
    const template = "systems/abfalter/templates/dialogues/diceRolls/offensiveRoll.hbs"
    let num = 0;

    const isPredetermined = attackDetails.isPredetermined ?? false;
    let fumbleRange = attackDetails.fumbleRange;
    let openRange = attackDetails.openRange;

    if (attackDetails.base > 199 && fumbleRange > 1) {
        fumbleRange -= 1;
    }
    const rollResult = await createRoll(actor, attackDetails.value, openRange, fumbleRange, isPredetermined);
    attackDetails.formula = `(${rollResult.rolledDice}) + ${attackDetails.formula}`;

    const rollData = [];
    rollData[0] = {
        roll: rollResult.rolledDice, total: rollResult._total, 
        doubles: rollResult.doubles, openRange: rollResult.openRange, 
        fumbleLevel: rollResult.fumbleLevel, fumble: rollResult.fumble, 
        explode: rollResult.explode, color: rollResult.color, 
        formula: attackDetails.formula, label: attackDetails.label
    };

    // Workflow - Combat Data
    const targetList = workflow.selectedDefenderIds
        .map(tokenId => canvas.tokens?.get(tokenId))
        .filter(Boolean)
        .map(token => {
            const actor = token.actor;
            const isOwner = actor?.testUserPermission(game.user, "OWNER");
            const isGM = game.user.isGM;
            return {
                tokenId: token.id,
                actorId: actor?.id ?? null,
                name: token.name,
                img: token.document?.texture?.src ?? actor?.img ?? "",
                canDefend: isGM || isOwner,
                state: workflow.targetStates[token.id] ?? { status: "pending" }
            };
        });

    const defendLocked = isAttackRollPendingResolution(rollData);

    let basicInfo = {
        portrait: actor.prototypeToken.texture.src,
        name: actor.name,
        userName: game.user.isGM ? game.i18n.localize("abfalter.gm") : game.user.name
    };
    const attackerToken = actor.getActiveTokens()?.[0];
    const attackerDisposition = attackerToken?.document?.disposition ?? CONST.TOKEN_DISPOSITIONS.NEUTRAL;
    const isFriendly = attackerDisposition === CONST.TOKEN_DISPOSITIONS.FRIENDLY;
    const combatSettings = game.settings.get('abfalter', "combatSettings");
    const revealAll = attackerToken === undefined;
    const atkSettings = {
        atkTokName: revealAll || isFriendly || !!combatSettings.atkTokName,
        atkWepName: revealAll || isFriendly || !!combatSettings.atkWepName,
        atkAtkName: revealAll || isFriendly || !!combatSettings.atkAtkName,
        atkFinValue: revealAll || isFriendly || !!combatSettings.atkFinValue,
        atkFormula: revealAll || isFriendly || !!combatSettings.atkFormula,
        atkDmg: revealAll || isFriendly || !!combatSettings.atkDmg,
        atkAtPen: revealAll || isFriendly || !!combatSettings.atkAtPen,
        atkNote: revealAll || isFriendly || !!combatSettings.atkNote
    };

    const content = await foundry.applications.handlebars.renderTemplate(template, { 
        basicInfo,
        rollData,
        actor,
        attackDetails,
        workflow,
        targetList,
        defendLocked,
        atkSettings
    });
    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        sound: CONFIG.sounds.dice,
        content: content,
        rolls: [rollResult],
        flags: {            
            abfalter: {
                customChatHeaderCard: true,
                basicInfo,
                attackDetails: attackDetails,
                rollData: rollData,
                num: num,
                workflow,
                atkSettings
            } 
        }
    };

    const speakerMode = actor.system.rollRange.speaker; // "default" | "public" | "private"
    let rollMode;
    switch (speakerMode) {
        case "public":
            rollMode = "public";
            break;
        case "private":
            rollMode = "gm";
            break;
        default:
            rollMode = game.settings.get("core", "messageMode");
    }
    ChatMessage.applyMode(chatData, rollMode);
    await ChatMessage.create(chatData);
}

/** Helper function to derermine if the attack roll is fully completed.
 * @param {*} rollData 
 * @returns {Boolean}
 */
function isAttackRollPendingResolution(rollData) {
    if (!Array.isArray(rollData) || !rollData.length) return false;
    const lastRoll = rollData[rollData.length - 1];
    return Boolean(lastRoll?.explode || lastRoll?.fumble);
}

export async function offenseContinuationRollFunction(msg, html, event) {
    const template = "systems/abfalter/templates/dialogues/diceRolls/offensiveRoll.hbs";
    const continuationType = event.currentTarget.dataset.rollType;
    const rollFunction = {
        open: performOpenRoll,
        fumble: performFumbleRoll
    }[continuationType];
    if (!rollFunction) {
        throw new Error(
            `Unknown offensive continuation type: ${continuationType}`
        );
    }
    const { actor, num, rollData } = await rollFunction(msg);

    const workflow = msg.flags.abfalter.workflow ?? {
        selectedDefenderIds: [],
        targetStates: {}
    };

    const targetList = workflow.selectedDefenderIds
        .map(tokenId => canvas.tokens?.get(tokenId))
        .filter(Boolean)
        .map(token => {
            const targetActor = token.actor;
            const isOwner = targetActor?.testUserPermission(
                game.user,
                "OWNER"
            );

            return {
                tokenId: token.id,
                actorId: targetActor?.id ?? null,
                name: token.name,
                img: token.document?.texture?.src ?? targetActor?.img ?? "",
                canDefend: game.user.isGM || isOwner,
                state: workflow.targetStates[token.id] ?? { status: "pending" }
            };
        });

    const defendLocked = isAttackRollPendingResolution(rollData);

    const content = await foundry.applications.handlebars.renderTemplate(template, {
        basicInfo: msg.flags.abfalter.basicInfo,
        rollData,
        actor,
        attackDetails: msg.flags.abfalter.attackDetails,
        workflow,
        targetList,
        defendLocked,
        atkSettings: msg.flags.abfalter.atkSettings
    });

    await msg.update({
        content,
        "flags.abfalter.rollData": rollData,
        "flags.abfalter.num": num
    });
}



/** Defensive rolls that are called from attack or effect chat cards.
 * @param {String} atkDmgType - has atk dmg type
 * @param {String} atkMsgId - has atk msg id
 * @param {String} tokenId - has defender token id
 * @returns 
 */
export async function defendAgainstAttacks({atkDmgType, atkMsgId, tokenId}) {
    return defendAgainstEverything({
        tokenId,
        parentMessageId: atkMsgId,
        armorType: atkDmgType,
        resolutionType: "attack"
    });
}

export async function defendAgainstEffects({effectMsgId, tokenId}) {
    const msg = game.messages.get(effectMsgId);
    const effectDetails = msg?.flags?.abfalter?.effectDetails;
    if (!effectDetails) return;

    return defendAgainstEverything({
        tokenId,
        parentMessageId: effectMsgId,
        armorType: effectDetails.useAT ? effectDetails.atLabel : null,
        resolutionType: "effect"
    });
}

export async function defendAgainstEverything({tokenId, parentMessageId, armorType, resolutionType}) {
    const defenderToken = canvas.tokens?.get(tokenId);
    const actor = defenderToken?.actor;

    // Armor values for defensive rolls
    const armorTypes = [
        { tag: 'cut', name: game.i18n.localize('abfalter.cut'), atValue: actor.system.armor.body.aCutFinal },
        { tag: 'imp', name: game.i18n.localize('abfalter.imp'), atValue: actor.system.armor.body.aImpFinal },
        { tag: 'thr', name: game.i18n.localize('abfalter.thr'), atValue: actor.system.armor.body.aThrFinal },
        { tag: 'heat', name: game.i18n.localize('abfalter.heat'), atValue: actor.system.armor.body.aHeatFinal },
        { tag: 'cold', name: game.i18n.localize('abfalter.cold'), atValue: actor.system.armor.body.aColdFinal },
        { tag: 'ele', name: game.i18n.localize('abfalter.ele'), atValue: actor.system.armor.body.aEleFinal },
        { tag: 'ene', name: game.i18n.localize('abfalter.ene'), atValue: actor.system.armor.body.aEneFinal }
    ];
    
    const chosenArmorType = armorType
        ? armorTypes.find(row => row.tag === String(armorType).toLowerCase())
        : null;

    let confirmed = false;
    let finalValue = 0;
    let finalFormula = "";
    let fatigueUsed = 0;
    let defBaseValue = 0; // Current selected defense's base value
    let selectedDefenseType = actor.system.autoCombat.prefDefenseType ?? "combat";
    let selectedCombatDefense = "block";
    const unarmedOption = "__unarmed__";
    let selectedWeaponId = actor.system.autoCombat.prefWeapon;
    let selectedProfileIndex = 0;
    let selectedWeapon = null;
    let selectedProfiles = [];
    let armorFinalValue = 0;

    const templateData = {
        armorTypeName: chosenArmorType?.name ?? game.i18n.localize("abfalter.none")
    };
    const template = "systems/abfalter/templates/dialogues/prompt/defenseAuto.hbs";
    const htmlContent = await foundry.applications.handlebars.renderTemplate(template, templateData);

    // Helpers
    const setText = (html, selector, value) => {
        const el = html.querySelector(selector);
        if (el) el.textContent = String(value ?? "");
    };
    const showEl = (el) => {
        if (el) el.style.display = "";
    };
    const hideEl = (el) => {
        if (el) el.style.display = "none";
    };
    const clearOptions = (el) => {
        if (el) el.innerHTML = "";
    };
    const appendOption = (el, { value, label, selected = false, dataset = {} }) => {
        if (!el) return;
        const option = document.createElement("option");
        option.value = String(value ?? "");
        option.textContent = label ?? "";
        if (selected) option.selected = true;

        for (const [key, val] of Object.entries(dataset)) {
            option.dataset[key] = String(val);
        }

        el.appendChild(option);
    };
    const updateRollButtonLabel = (dialog) => {
        const root = dialog.element;
        if (!root) return;

        const rollButton =
            root.querySelector('[data-action="roll"]') ||
            root.querySelector('button[data-action="roll"]');

        if (rollButton) {
            rollButton.textContent = `${game.i18n.localize("abfalter.dialogs.roll")}: ${finalValue}`;
        }
    };
    const getDefensiveWeapons = () => {
        const weapons = actor.items.filter(i => i.type === "weapon");

        const hasValidProfiles = (weapon) => {
            const allAttacks = weaponProfiles(weapon,"defensive").map(e=>e.profile);
            return allAttacks.some(profile => {
                const pType = profile.profileType?.trim().toLowerCase();
                return pType === "both" || pType === "defensive";
            });
        };

        const equipped = weapons.filter(w =>
            w.system?.equipped === true && hasValidProfiles(w)
        );

        return [
            {
                id: unarmedOption,
                name: game.i18n.localize("abfalter.unarmed"),
                isUnarmed: true
            },
            ...equipped
        ];
    };
    const getWeaponProfiles = (weapon) => weaponProfiles(weapon, "defensive");
    const getSelectedProfileEntry = () => selectedProfiles?.[selectedProfileIndex] ?? null;
    const getSelectedProfile = () => getSelectedProfileEntry()?.profile ?? null;
    const getSelectedProfileOriginalIndex = () => getSelectedProfileEntry()?.originalIndex ?? -1;
    const getCurrentCombatDefenseValues = () => {
        // Unarmed uses actor defaults
        if (selectedWeaponId === unarmedOption) {
            return {
                block: Number(actor.system.combatValues?.block?.final ?? 0),
                dodge: Number(actor.system.combatValues?.dodge?.final ?? 0)
            };
        }

        const profile = getSelectedProfile();

        return {
            block: Number(
                profile?.finalBlock ??
                selectedWeapon?.system?.derived?.baseBlk ??
                actor.system.combatValues?.block?.final ??
                0
            ),
            dodge: Number(
                profile?.finalDodge ??
                selectedWeapon?.system?.derived?.baseDod ??
                actor.system.combatValues?.dodge?.final ??
                0
            )
        };
    };
    const updateCombatBaseValue = (html, dialog) => {
        switch (selectedDefenseType) {
            case "combat": {
                const profile = getSelectedProfile();
                // Unarmed uses actor defaults
                if (selectedWeaponId === unarmedOption) {
                    if (selectedCombatDefense === "block") {
                        defBaseValue = actor.system.combatValues.block.final;
                    } else {
                        defBaseValue = actor.system.combatValues.dodge.final;
                    }
                    updateFinalValue(html, dialog);
                    break;
                }

                // Weapon selected
                if (selectedCombatDefense === "block") {
                    if (profile?.finalBlock != null) {
                        defBaseValue = Number(profile.finalBlock) || 0;
                    } else if (selectedWeapon?.system?.derived?.baseBlk != null) {
                        defBaseValue = Number(selectedWeapon.system.derived.baseBlk) || 0;
                    } else {
                        defBaseValue = Number(actor.system.combatValues?.block?.final ?? 0);
                    }
                } else {
                    if (profile?.finalDodge != null) {
                        defBaseValue = Number(profile.finalDodge) || 0;
                    } else if (selectedWeapon?.system?.derived?.baseDod != null) {
                        defBaseValue = Number(selectedWeapon.system.derived.baseDod) || 0;
                    } else {
                        defBaseValue = Number(actor.system.combatValues?.dodge?.final ?? 0);
                    }
                }
                updateFinalValue(html, dialog);
                break;
            }

            case "magic":
                defBaseValue = actor.system.toggles.magicDefModule
                    ? actor.system.toggles.magicDodgeModule
                        ? actor.system.mproj.dodModule
                        : actor.system.mproj.defModule
                    : actor.system.mproj.finalDefensive ;
                updateFinalValue(html, dialog);
                break;

            case "psychic":
                defBaseValue = actor.system.toggles.psychicModuleStatus
                    ? actor.system.toggles.psychicDodgeStatus
                        ? actor.system.pproj.dodModule
                        : actor.system.pproj.defModule
                    : actor.system.pproj.finalDef ;
                updateFinalValue(html, dialog);
                break;

            default:
                defBaseValue = 0;
                updateFinalValue(html, dialog);
                break;
        }
    };
    const updateFinalValue = (html, dialog) => {
        const modifierValue = parseInt(html.querySelector('#modifierMod')?.value ?? 0, 10);
        const multDefPenalty = parseInt(html.querySelector('#defNumberDropdown option:checked')?.dataset.penalty ?? 0, 10);
        const fatigueValue = parseInt(html.querySelector('#fatigueDropdown')?.value ?? 0, 10);
        fatigueUsed = fatigueValue;

        finalValue = defBaseValue + (fatigueValue * actor.system.settings.fatigueValue) + modifierValue + multDefPenalty;
        finalFormula = `${defBaseValue}(${game.i18n.localize("abfalter.value")}) + ${fatigueValue * actor.system.settings.fatigueValue}(${game.i18n.localize("abfalter.fatigue")}) + ${modifierValue}(${game.i18n.localize("abfalter.mod")}) + ${multDefPenalty}(${game.i18n.localize("abfalter.multipleDef")})`;

        updateRollButtonLabel(dialog);
    };

    const dialog = new diceDialogV2({
        window: {
            title: `${actor.name} - ${game.i18n.localize('abfalter.defense')}`
        },
        position: {
            width: 400,
        },
        content: htmlContent,
        classes: ["baseAbfalterV2"],
        buttons: [
            {
                action: "roll",
                label: `${game.i18n.localize("abfalter.dialogs.roll")}: ${finalValue}`,
                default: true,
                callback: () => {
                    confirmed = true;
                    return "roll";
                }
            },
            {
                action: "cancel",
                label: game.i18n.localize('abfalter.dialogs.cancel'),
                callback: () => {
                    confirmed = false;
                    return "cancel";
                }
            }
        ],
        onRender: async (html, dialogInstance) => {
            const modifierInput = html.querySelector('#modifierMod');
            const fatigueDropdown = html.querySelector('#fatigueDropdown');
            const fatigueVal = actor.system.fatigue.value;
            const maxFatigue = actor.system.kiAbility.kiUseOfEne.status ? 5 : 2;
            const defenseTypeDropdown = html.querySelector('#defenseTypeDropdown');
            const defNumberDropdown = html.querySelector('#defNumberDropdown');
            const combatDefenseDropdown = html.querySelector('#combatDefenseDropdown');
            const weaponDropdown = html.querySelector('#weaponDropdown');
            const profileDropdown = html.querySelector('#profileDropdown');
            const combatDefenseRow = html.querySelector('#combatDefenseRow');
            const weaponRow = html.querySelector('#weaponRow');
            const profileRow = html.querySelector('#profileRow');
            const armorModInput = html.querySelector('#armorMod');
            const armorFinalValueEl = html.querySelector('#armorFinalValue');
            let armorBaseValue = Number(chosenArmorType?.atValue ?? 0);


            const defensePenalty = [
                { tag: 'first', name: game.i18n.localize('abfalter.firstDef'), penalty: 0 },
                { tag: 'second', name: game.i18n.localize('abfalter.secondDef'), penalty: -30 },
                { tag: 'third', name: game.i18n.localize('abfalter.thirdDef'), penalty: -50 },
                { tag: 'fourth', name: game.i18n.localize('abfalter.fourthDef'), penalty: -70 },
                { tag: 'fifth', name: game.i18n.localize('abfalter.fifthDef'), penalty: -90 }
            ];
            const defenseTypes = [
                { value: "combat", label: game.i18n.localize("abfalter.physical") },
                { value: "magic", label: game.i18n.localize("abfalter.magic") },
                { value: "psychic", label: game.i18n.localize("abfalter.psychic") }
            ];

            // Defense Type Dropdown
            const populateDefenseTypeDropdown = () => {
                clearOptions(defenseTypeDropdown);
                defenseTypes.forEach(type => {
                    appendOption(defenseTypeDropdown, {
                        value: type.value,
                        label: type.label,
                        selected: type.value === selectedDefenseType
                    });
                });
            };

            const populateCombatDefenseDropdown = () => {
                clearOptions(combatDefenseDropdown);

                const values = getCurrentCombatDefenseValues();

                selectedCombatDefense = values.block >= values.dodge ? "block" : "dodge";

                appendOption(combatDefenseDropdown, {
                    value: "block",
                    label: `${game.i18n.localize("abfalter.block")} (${values.block})`,
                    selected: selectedCombatDefense === "block"
                });

                appendOption(combatDefenseDropdown, {
                    value: "dodge",
                    label: `${game.i18n.localize("abfalter.dodge")} (${values.dodge})`,
                    selected: selectedCombatDefense === "dodge"
                });
            };

            const populateWeaponDropdown = () => {
                clearOptions(weaponDropdown);

                const weapons = getDefensiveWeapons();

                if (!weapons.length) {
                    selectedWeaponId = unarmedOption;
                    selectedWeapon = null;
                    selectedProfiles = [];
                    clearOptions(profileDropdown);
                    return;
                }

                const prefWeaponId = actor.system.autoCombat.prefWeapon;
                const isValidEquipped = (id) => id && id !== unarmedOption && weapons.some(w => w.id === id);
                if (!weapons.some(w => w.id === selectedWeaponId)) {
                    if (isValidEquipped(prefWeaponId)) {
                        selectedWeaponId = prefWeaponId;
                    } else {
                        const firstRealWeapon = weapons.find(w => w.id !== unarmedOption);
                        selectedWeaponId = firstRealWeapon ? firstRealWeapon.id : unarmedOption;
                    }
                }

                weapons.forEach(weapon => {
                    appendOption(weaponDropdown, {
                        value: weapon.id,
                        label: weapon.name,
                        selected: weapon.id === selectedWeaponId
                    });
                });

                selectedWeapon = selectedWeaponId === unarmedOption
                    ? null
                    : actor.items.get(selectedWeaponId);
            };

            const populateProfileDropdown = () => {
                clearOptions(profileDropdown);

                if (selectedWeaponId === unarmedOption) {
                    selectedWeapon = null;
                    selectedProfiles = [];
                    selectedProfileIndex = 0;
                    return;
                }

                selectedWeapon = actor.items.get(selectedWeaponId);
                selectedProfiles = getWeaponProfiles(selectedWeapon);

                if (!selectedProfiles.length) {
                    selectedProfileIndex = 0;
                    return;
                }

                const lastDefUsed = Number(selectedWeapon.system.info.lastDefUsed ?? 0);

                selectedProfileIndex = selectedProfiles.findIndex(entry => entry.key === selectedWeapon.system.info.lastDefProfileId);
                if (selectedProfileIndex < 0) selectedProfileIndex = selectedProfiles.findIndex(entry => entry.originalIndex === lastDefUsed);
                if (selectedProfileIndex < 0) selectedProfileIndex = 0;

                selectedProfiles.forEach((entry, index) => {
                    appendOption(profileDropdown, {
                        value: index,
                        label: entry.profile.name,
                        selected: index === selectedProfileIndex
                    });
                });
                profileDropdown.value = String(selectedProfileIndex);
            };

            // Multiple Defense Dropdown
            const populateDefNumberDropdown = () => {
                clearOptions(defNumberDropdown);
                defensePenalty.forEach(part => {
                    appendOption(defNumberDropdown, {
                        value: part.tag,
                        label: `${part.name} (${part.penalty})`,
                        dataset: { penalty: part.penalty }
                    });
                });
            };

            // Fatigue Dropdown
            const populateFatigueDropdown = () => {
                clearOptions(fatigueDropdown);
                const availableFatigue = Math.min(maxFatigue, fatigueVal);
                for (let i = 0; i <= availableFatigue; i++) {
                    appendOption(fatigueDropdown, { 
                        value: i,
                        label: String(i),
                        selected: i === 0
                    });
                }
            };

            // Update on Change Listeners
            const updateArmorValue = () => {
                const mod = parseInt(armorModInput?.value ?? 0, 10);
                armorFinalValue  = armorBaseValue + mod;

                if (armorFinalValueEl) {
                    armorFinalValueEl.textContent = armorFinalValue ;
                }
            };

            const updateDefenseRowsVisibility = () => {
                if (selectedDefenseType === "combat") {
                    showEl(combatDefenseRow);
                    showEl(weaponRow);
                    if (selectedWeaponId === unarmedOption) {
                        hideEl(profileRow);
                    } else {
                        showEl(profileRow);
                    }
                } else {
                    hideEl(combatDefenseRow);
                    hideEl(weaponRow);
                    hideEl(profileRow);
                }
            };

            populateDefenseTypeDropdown();
            populateWeaponDropdown();
            populateProfileDropdown();
            populateCombatDefenseDropdown();
            populateDefNumberDropdown();
            populateFatigueDropdown();
            updateArmorValue();

            updateDefenseRowsVisibility();
            updateCombatBaseValue(html, dialogInstance);

            defenseTypeDropdown?.addEventListener('change', (ev) => {
                selectedDefenseType = ev.currentTarget.value;
                updateDefenseRowsVisibility();
                updateCombatBaseValue(html, dialogInstance);
            });
            combatDefenseDropdown?.addEventListener('change', (ev) => {
                selectedCombatDefense = ev.currentTarget.value;
                updateDefenseRowsVisibility();
                updateCombatBaseValue(html, dialogInstance);
            });
            weaponDropdown?.addEventListener('change', (ev) => {
                selectedWeaponId = ev.currentTarget.value;
                selectedProfileIndex = 0;
                populateProfileDropdown();
                populateCombatDefenseDropdown();
                updateDefenseRowsVisibility();
                updateCombatBaseValue(html, dialogInstance);
            });
            profileDropdown?.addEventListener('change', (ev) => {
                selectedProfileIndex = Number(ev.currentTarget.value);
                populateCombatDefenseDropdown();
                updateCombatBaseValue(html, dialogInstance);
            });

            armorModInput?.addEventListener('input', updateArmorValue);
            modifierInput?.addEventListener('input', () => updateFinalValue(html, dialogInstance));
            fatigueDropdown?.addEventListener('change', () => updateFinalValue(html, dialogInstance));
            defNumberDropdown?.addEventListener('change', () => updateFinalValue(html, dialogInstance));
        },
        onClose: async (html) => {
            if (!confirmed) return;
            await actor.update({ 
                "system.fatigue.value": Math.floor(actor.system.fatigue.value - fatigueUsed),
                "system.autoCombat.prefDefenseType": selectedDefenseType,
                "system.autoCombat.prefWeapon": selectedWeaponId
            });
            if (selectedWeaponId !== unarmedOption && selectedWeapon) {
                await selectedWeapon.update({
                    "system.info.lastDefUsed": getSelectedProfileOriginalIndex(),
                    "system.info.lastDefProfileId": getSelectedProfileEntry()?.key ?? ""
                });
            }

            let chosenIndex = null;
            let chosenWeaponId = getSelectedProfileOriginalIndex();

            switch (selectedDefenseType) {
                case "combat":
                    if (selectedWeaponId === "__unarmed__") {
                        chosenWeaponId = "__unarmed__";
                        chosenIndex = null;
                    } else {
                        chosenWeaponId = selectedWeaponId;
                        chosenIndex = getSelectedProfileOriginalIndex();
                    }
                    break;
                case "magic":
                    chosenWeaponId = null;
                    break;
                case "psychic":
                    chosenWeaponId = null;
                    break;
            } 
        
            const defenseDetails = {
                baseValue: defBaseValue,
                finalValue: finalValue,
                formula: finalFormula,
                defenseType: selectedDefenseType,           // combat / magic / psychic
                combatDefenseType: selectedCombatDefense,   // block / dodge
                armorType: chosenArmorType?.tag ?? null,
                armorFinal: armorFinalValue,
                weaponId: chosenWeaponId,                 // __unarmed__ / weapons
                profileIndex: chosenIndex
            };
            await autoDefenseRoll({actor, tokenId, defenseDetails, parentMessageId, resolutionType});
        }
    });
    dialog.render({ force: true });
}

async function autoDefenseRoll({actor, tokenId, defenseDetails, parentMessageId, resolutionType}) {
    const template = "systems/abfalter/templates/dialogues/diceRolls/defensiveAutoRoll.hbs"
    let weapon; 
    let fumbleRange = 3; 
    let openRange = 90; 
    let isPredetermined;
    let actionName = "";
    let defenseName = "";
    let num = 0;

    if (
        defenseDetails.defenseType === "combat" &&
        defenseDetails.weaponId &&
        defenseDetails.weaponId !== "__unarmed__"
    ) {
        weapon = actor.items.get(defenseDetails.weaponId);
        if (!weapon) console.warn("Weapon not found even though a weapon was used for defense:", defenseDetails.weaponId);
        fumbleRange = weapon.system.derived.baseFumbleRange;
        openRange = weapon.system.derived.baseOpenRollRange;
        const profiles = Object.values(weapon.system.attacks ?? {});
        const profile = defenseDetails.profileIndex === -1
            ? weaponProfiles(weapon,"defensive")[0].profile
            : profiles[defenseDetails.profileIndex];
        isPredetermined = profile?.properties?.predetermined?.bool ?? false;
        actionName = weapon.name;
        defenseDetails.note = profile?.chatNote ?? "";
        defenseName = defenseDetails.combatDefenseType == "block" ? `${profile?.name ?? "Standard Defense"} ${game.i18n.localize("abfalter.block")}` : `${profile?.name ?? "Standard Defense"} ${game.i18n.localize("abfalter.dodge")}`;;
    } else {
        openRange = actor.system.rollRange.final;
        fumbleRange = actor.system.fumleRange.final;
        isPredetermined = false;
        actionName = `${game.i18n.localize("abfalter." + defenseDetails.defenseType)}`;
        if (defenseDetails.defenseType == "combat" && defenseDetails.weaponId == "__unarmed__") {
            defenseName = defenseDetails.combatDefenseType == "block" ? `${game.i18n.localize("abfalter.unarmed")} ${game.i18n.localize("abfalter.block")}` : `${game.i18n.localize("abfalter.unarmed")} ${game.i18n.localize("abfalter.dodge")}`;
        } else {
            defenseName = defenseDetails.defenseType == "magic" ? game.i18n.localize("abfalter.defMagicProj") : game.i18n.localize("abfalter.psyProj");
        }
    }
    if (defenseDetails.baseValue > 199 && fumbleRange > 1) {
        fumbleRange -= 1;
    }

    const rollResult = await createRoll(actor, defenseDetails.finalValue, openRange, fumbleRange, isPredetermined);
    defenseDetails.formula = `(${rollResult.rolledDice}) + ${defenseDetails.formula}`;
    defenseDetails.defTypeName = actionName; // Name of the weapon / magic / psychic.
    defenseDetails.label = defenseName; // Name of profile / defense type

    const rollData = [];
    rollData[0] = {
        roll: rollResult.rolledDice, total: rollResult._total, doubles: rollResult.doubles, openRange: rollResult.openRange, fumbleLevel: rollResult.fumbleLevel,
        fumble: rollResult.fumble, explode: rollResult.explode, color: rollResult.color, formula: defenseDetails.formula, label: defenseDetails.label,
    };

    const isGM = game.user.isGM;
    const needsContinuation = rollResult.explode || rollResult.fumble;
    let status = "";
    if (isGM) {
        status = needsContinuation ? 'pending' : 'complete';
    } else {
        status = needsContinuation ? 'pending' : 'pendingGMAccept';
    }

    let basicInfo = {
        portrait: actor.prototypeToken.texture.src,
        name: actor.name,
        userName: game.user.isGM ? game.i18n.localize("abfalter.gm") : game.user.name
    };

    const defenderToken = actor.getActiveTokens()?.[0];
    const defenderDisposition = defenderToken?.document?.disposition ?? CONST.TOKEN_DISPOSITIONS.NEUTRAL;
    const isFriendly = defenderDisposition === CONST.TOKEN_DISPOSITIONS.FRIENDLY;
    const combatSettings = game.settings.get('abfalter', "combatSettings");
    const defSettings = {
        defTokName: isFriendly || !!combatSettings.defTokName,
        defWepName: isFriendly || !!combatSettings.defWepName,
        defAtkName: isFriendly || !!combatSettings.defAtkName,
        defFinValue: isFriendly || !!combatSettings.defFinValue,
        defFormula: isFriendly || !!combatSettings.defFormula,
        defAT: isFriendly || !!combatSettings.defAT
    }

    const content = await foundry.applications.handlebars.renderTemplate(template, { 
        basicInfo,
        rollData,
        actor,
        defenseDetails,
        defSettings,
        status
    });

    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        sound: CONFIG.sounds.dice,
        content: content,
        rolls: [rollResult],
        flags: {            
            abfalter: {
                customChatHeaderCard: true,
                basicInfo,
                defenseDetails: defenseDetails,
                rollData: rollData,
                num: num,
                defSettings,
                defenseWorkflow: {
                    parentMessageId,
                    resolutionType,
                    defenderActorId: actor.id,
                    defTokenId: tokenId
                }
            } 
        }
    };

    const speakerMode = actor.system.rollRange.speaker; // "default" | "public" | "private"
    let rollMode;
    switch (speakerMode) {
    case "public":
        rollMode = "public";
        break;
    case "private":
        rollMode = "gm";
        break;
    default:
        rollMode = game.settings.get("core", "messageMode");
    }
    ChatMessage.applyMode(chatData, rollMode);
    const createdMessage = await ChatMessage.create(chatData);

    if (!needsContinuation) {
        if (isGM) {
            await finalizeDefenseMessage({
                defenseMessageId: createdMessage.id
            });
        }
    }
}

export async function autoDefContinuationRoll(msg, html, event) {
    const template = "systems/abfalter/templates/dialogues/diceRolls/defensiveAutoRoll.hbs";
    const isGM = game.user.isGM;
    const continuationType = event.currentTarget.dataset.rollType;
    const rollFunction = {
        open: performOpenRoll,
        fumble: performFumbleRoll
    }[continuationType];
    if (!rollFunction) {
        throw new Error(`Unknown effect continuation type: ${continuationType}`);
    }
    const { actor, num, rollData } = await rollFunction(msg);
    const needsContinuation = Boolean(rollData[num]?.explode);
    const status = needsContinuation
        ? "pending"
        : isGM
            ? "complete"
            : "pendingGMAccept";

    const content =
        await foundry.applications.handlebars.renderTemplate(template, {
            basicInfo: msg.flags.abfalter.basicInfo,
            rollData,
            actor,
            defenseDetails: msg.flags.abfalter.defenseDetails,
            defSettings: msg.flags.abfalter.defSettings,
            status
        });

    await msg.update({
        content,
        "flags.abfalter.rollData": rollData,
        "flags.abfalter.num": num
    });

    if (!needsContinuation && isGM) {
        await finalizeDefenseMessage({
            defenseMessageId: msg.id
        });
    }
}



/** Handles psychic & magic effect projection checks
 * @param {Actor} actor - The actor using the weapon.
 * @param {string} effectInfo - Has all values of matrix if complex.
 * @param {string} type - complex has matrix info | simple doesn't
 */
export async function effectProjDialogue({actor, effectInfo}) {
    const template = "systems/abfalter/templates/dialogues/prompt/effectProjCheck.hbs";
    let confirmed = false;
    const useProjection = effectInfo.useProj === true;
    const resistanceTypes = Array.isArray(effectInfo.resTypeList) ? effectInfo.resTypeList.filter(Boolean) : [];
    if (resistanceTypes.length === 0) {
        ui.notifications.warn(game.i18n.localize("abfalter.noResistanceType"));
        return;
    }

    let baseValue = 0;
    let bonusProj = effectInfo.projBonus;
    let baseResValue = effectInfo.resValue;
    let finalResValue = baseResValue;
    let finalValue = 0;
    let finalFormula = "";
    let ppSpent = 0;


    if (effectInfo.type == "psychic") {
        baseValue = actor.system.toggles.psychicModuleStatus ? actor.system.pproj.atkModule : actor.system.pproj.finalOff;
    }

    const htmlContent = await foundry.applications.handlebars.renderTemplate(template);
    // Get Target Token & Prepare Combat Workflow
    let selectedTargetIds = Array.from(game.user.targets).filter(t => t?.actor).map(t => t.id);
    let targetHookId = null;

    const getCurrentSelectedTargetIds = () => {
        return Array.from(game.user.targets)
            .filter(t => t?.actor)
            .map(t => t.id);
    };
    const renderSelectedTargets = (htmlRoot) => {
        const targetListEl = htmlRoot.querySelector('#selectedTargetsList');
        if (!targetListEl) return;

        const tokens = selectedTargetIds
            .map(id => canvas.tokens?.get(id))
            .filter(Boolean);

        targetListEl.textContent = tokens.length
            ? tokens.map(t => t.name).join(", ")
            : game.i18n.localize("abfalter.none");
    };
    const syncSelectedTargets = (htmlRoot) => {
        selectedTargetIds = getCurrentSelectedTargetIds();
        renderSelectedTargets(htmlRoot);
    };
    const clearOptions = (el) => {
        if (el) el.innerHTML = "";
    };
    const appendOption = (el, { value, label, selected = false, dataset = {} }) => {
        if (!el) return;
        const option = document.createElement("option");
        option.value = String(value ?? "");
        option.textContent = label ?? "";
        if (selected) option.selected = true;

        for (const [key, val] of Object.entries(dataset)) {
            option.dataset[key] = String(val);
        }

        el.appendChild(option);
    };
    const updateRollButtonLabel = (dialog) => {
        const root = dialog.element;
        if (!root) return;

        const rollButton =
            root.querySelector('[data-action="roll"]') ||
            root.querySelector('button[data-action="roll"]');

        if (rollButton) {
            rollButton.textContent = useProjection
            ? `${game.i18n.localize("abfalter.dialogs.roll")}: ${finalValue}`
            : game.i18n.localize("abfalter.dialogs.confirm");
        }

        //rollButton.disabled = isMatrixRoll && (potentialSpent < 10 || !selectedMatrixId);
    };
    const updateFinalValue = (html, dialog) => {
        if (!useProjection) {
            finalValue = 0;
            finalFormula = "";
            ppSpent = 0;

            updateRollButtonLabel(dialog);
            return;
        }

        const modifierValue = Number(html.querySelector('#modifierMod')?.value) || 0;
        const selectedModifier = Number(html.querySelector('#modifierSelect')?.value) || 0;

        ppSpent = Number(html.querySelector('#ppDropdown')?.value) || 0;

        finalValue =
            baseValue +
            bonusProj +
            (ppSpent * actor.system.psySettings.projPPValueFinal) +
            modifierValue +
            selectedModifier;

        finalFormula =
            `${baseValue}(${game.i18n.localize("abfalter.potential")}) + ` +
            `${bonusProj}(${game.i18n.localize("abfalter.matrixBonus")}) + ` +
            `${ppSpent * actor.system.psySettings.projPPValueFinal}(${game.i18n.localize("abfalter.pp")}) + ` +
            `${modifierValue}(${game.i18n.localize("abfalter.mod")}) + ` +
            `${selectedModifier}(${game.i18n.localize("abfalter.action")})`;

        updateRollButtonLabel(dialog);
    };

    const dialog = new diceDialogV2({
        window: {
            title: `${actor.name} - ${game.i18n.localize('abfalter.effectProjection')}`
        },
        position: {
            width: 400,
        },
        content: htmlContent,
        classes: ["baseAbfalterV2"],
        buttons: [
            {
                action: "roll",
                label: useProjection
                    ? `${game.i18n.localize("abfalter.dialogs.roll")}: ${finalValue}`
                    : game.i18n.localize("abfalter.dialogs.confirm"),
                default: true,
                callback: () => {
                    confirmed = true;
                    return "roll";
                }
            },
            {
                action: "cancel",
                label: game.i18n.localize('abfalter.dialogs.cancel'),
                callback: () => {
                    confirmed = false;
                    return "cancel";
                }
            }
        ],
        onRender: async (html, dialogInstance) => {
            const modifierInput = html.querySelector('#modifierMod');
            const modifierSelect = html.querySelector('#modifierSelect');
            const ppDropdown = html.querySelector('#ppDropdown');
            const resInfo = html.querySelector("#resInfo");
            const resModifierInput = html.querySelector("#resMod");
            const ppMax = actor.system.psySettings.projMaxPPFinal;
            const availablePP = actor.system.psychicPoint.value;
            const projectionControls = html.querySelector("#projectionControls");
            if (projectionControls) {
                 projectionControls.hidden = !useProjection;
            }

            const populatePPDropdown = () => {
                clearOptions(ppDropdown);
                const usablePP = Math.min(ppMax, availablePP);
                for (let i = 0; i <= usablePP; i++) {
                    appendOption(ppDropdown, {
                        value: i,
                        label: String(i),
                        selected: i === 0
                    });
                }
            };

            const populateModifierDropdown = () => {
                clearOptions(modifierSelect);
                for (let index = 0; index < 10; index++) {
                    const value = -25 * index;

                    appendOption(modifierSelect, {
                        value,
                        label: game.i18n.localize(`abfalter.activeAction${index + 1}`),
                        selected: index === 0
                    });
                }
            };

            const updateResistanceValue = html => {
                const resModifier = Number(html.querySelector("#resMod")?.value) || 0;
                finalResValue = baseResValue + resModifier;
                const finalValueDisplay = html.querySelector("#resFinalValue");
                if (finalValueDisplay) {
                    finalValueDisplay.textContent = String(finalResValue);
                }
            };

            const updateResistanceInfo = () => {
                if (!resInfo) return;

                const localizedResistanceTypes =
                    resistanceTypes.map(type =>
                        game.i18n.localize(
                            `abfalter.${String(type).toLowerCase()}`
                        )
                    );

                const infoParts = [];

                if (useProjection) {
                    infoParts.push(
                        `${game.i18n.localize("abfalter.projShort")}: ${baseValue}`
                    );

                    if (bonusProj !== 0) {
                        infoParts.push(
                            `${game.i18n.localize("abfalter.projBonus")}: ${bonusProj}`
                        );
                    }
                }

                infoParts.push(
                    `${game.i18n.localize("abfalter.resistance")}: ${baseResValue}`
                );

                infoParts.push(
                    `${game.i18n.localize("abfalter.resTypes")}: ` +
                    localizedResistanceTypes.join(", ")
                );

                resInfo.textContent = infoParts.join(" · ");
            };

            resModifierInput?.addEventListener("input", () => updateResistanceValue(html));
            modifierInput?.addEventListener("input", () => { updateFinalValue(html, dialogInstance) });
            ppDropdown?.addEventListener("change", () => { updateFinalValue(html, dialogInstance) });
            modifierSelect?.addEventListener("change", () => { updateFinalValue(html, dialogInstance) });

            updateResistanceValue(html);
            updateResistanceInfo()
            populatePPDropdown();
            populateModifierDropdown();
            updateFinalValue(html, dialogInstance);
            syncSelectedTargets(html);
            targetHookId = Hooks.on("targetToken", (user, token, targeted) => {
                if (user.id !== game.user.id) return;
                syncSelectedTargets(html);
            });
        },
        onClose: async (html) => {
            if (targetHookId !== null) {
                Hooks.off("targetToken", targetHookId);
                targetHookId = null;
            }
            if (!confirmed) return;

            if (useProjection && effectInfo.type === "psychic") {
                await actor.update({
                    "system.psychicPoint.value": Math.max(0, actor.system.psychicPoint.value - ppSpent)
                });
            }

            const workflow = createAttackWorkflow(actor, selectedTargetIds);

            const effectDetails = {
                actionName: effectInfo.type === "psychic"
                    ? game.i18n.localize("abfalter.psychic")
                    : game.i18n.localize("abfalter.magic"),
                label: effectInfo.name,

                effectType: effectInfo.type,
                useProj: useProjection,

                base: baseValue,
                value: finalValue,
                formula: finalFormula,
                resValue: finalResValue,
                resTypeList: resistanceTypes,

                resOnFailedProj: effectInfo.resOnFailedProj === true,
                failedProjResBonus: Number(effectInfo.failedProjResBonus) || 0,

                useAT: effectInfo.useAT,
                atLabel: effectInfo.atLabel,
                useImmunity: effectInfo.useImmunity === true,
                immunityType: effectInfo.immunityType ?? "",


                isFired: effectInfo.isFired,
                isInvisible: effectInfo.isInvisible,

                openRange: actor.system.rollRange.final,
                fumbleRange: actor.system.fumleRange.final,
                isPredetermined: false,
            };

            await finishPotentialMatrixMessage(effectInfo.potentialMsgId);
            await effectRoll({actor, effectDetails, workflow});
        }
    });
    dialog.render({ force: true });
}

async function effectRoll({actor, effectDetails, workflow}) {
    if (!effectDetails.useProj) {
        await createEffectResolutionMessage({effectDetails, workflow});
        return;
    }
    const template = "systems/abfalter/templates/dialogues/diceRolls/effectRoll.hbs";
    let rollData = [];
    let num = 0;
    let fumbleRange = effectDetails.fumbleRange;
    const openRange = effectDetails.openRange;
    if (effectDetails.base > 199 && fumbleRange > 1) {
        fumbleRange -= 1;
    }

    const rollResult = await createRoll(
        actor,
        effectDetails.value,
        openRange,
        fumbleRange,
        effectDetails.isPredetermined
    );

    effectDetails.formula = `(${rollResult.rolledDice}) + ${effectDetails.formula}`;

    rollData[0] = {
        roll: rollResult.rolledDice,
        total: rollResult._total,
        doubles: rollResult.doubles,
        openRange: rollResult.openRange,
        fumbleLevel: rollResult.fumbleLevel,
        fumble: rollResult.fumble,
        explode: rollResult.explode,
        color: rollResult.color,
        formula: effectDetails.formula,
        label: effectDetails.label
    };

    const targetList = workflow.selectedDefenderIds
        .map(tokenId => canvas.tokens?.get(tokenId))
        .filter(Boolean)
        .map(token => {
            const targetActor = token.actor;
            const isOwner = targetActor?.testUserPermission(game.user, "OWNER");

            return {
                tokenId: token.id,
                actorId: targetActor?.id ?? null,
                name: token.name,
                img: token.document?.texture?.src ?? targetActor?.img ?? "",
                canDefend: game.user.isGM || isOwner,
                state: workflow.targetStates[token.id] ?? {status: "pending"}
            };
        });

    const basicInfo = {
        portrait: actor.prototypeToken.texture.src,
        name: actor.name,
        userName: game.user.isGM ? game.i18n.localize("abfalter.gm") : game.user.name
    };

    const defendLocked = isEffectRollPendingResolution(rollData);

    const content = await foundry.applications.handlebars.renderTemplate(template, {
        basicInfo,
        rollData,
        actor,
        effectDetails,
        workflow,
        targetList,
        defendLocked
    });

    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({actor}),
        sound: effectDetails.useProj ? CONFIG.sounds.dice : null,
        content,
        rolls: [rollResult],
        flags: {
            abfalter: {
                customChatHeaderCard: true,
                basicInfo,
                effectDetails,
                rollData,
                num,
                workflow
            }
        }
    };

    const speakerMode = actor.system.rollRange.speaker;
    let rollMode;

    switch (speakerMode) {
        case "public":
            rollMode = "public";
            break;
        case "private":
            rollMode = "gm";
            break;
        default:
            rollMode = game.settings.get("core", "messageMode");
    }

    ChatMessage.applyMode(chatData, rollMode);
    const createdMessage = await ChatMessage.create(chatData);
}

/** Helper function to derermine if the projection roll is fully completed.
 * @param {*} rollData 
 * @returns {Boolean}
 */
function isEffectRollPendingResolution(rollData) {
    if (!Array.isArray(rollData) || !rollData.length) return false;
    const lastRoll = rollData[rollData.length - 1];
    return Boolean(lastRoll?.explode || lastRoll?.fumble);
}

export async function effectContinuationRollFunction(msg, html, event) {
    const template = "systems/abfalter/templates/dialogues/diceRolls/effectRoll.hbs";
    const continuationType = event.currentTarget.dataset.rollType;
    const rollFunction = {
        open: performOpenRoll,
        fumble: performFumbleRoll
    }[continuationType];
    if (!rollFunction) {
        throw new Error(`Unknown effect continuation type: ${continuationType}`);
    }
    const { actor, num, rollData } = await rollFunction(msg);

    const workflow = msg.flags.abfalter.workflow ?? {
        selectedDefenderIds: [],
        targetStates: {}
    };

    const targetList = workflow.selectedDefenderIds
        .map(tokenId => canvas.tokens?.get(tokenId))
        .filter(Boolean)
        .map(token => {
            const targetActor = token.actor;
            const isOwner = targetActor?.testUserPermission( game.user, "OWNER");
            return {
                tokenId: token.id,
                actorId: targetActor?.id ?? null,
                name: token.name,
                img: token.document?.texture?.src ?? targetActor?.img ?? "",
                canDefend: game.user.isGM || isOwner,
                state: workflow.targetStates[token.id] ?? { status: "pending" }
            };
        });

    const defendLocked = isEffectRollPendingResolution(rollData);

    const content = await foundry.applications.handlebars.renderTemplate(template, {
        basicInfo: msg.flags.abfalter.basicInfo,
        rollData,
        actor,
        effectDetails: msg.flags.abfalter.effectDetails,
        workflow,
        targetList,
        defendLocked
    });

    await msg.update({
        content,
        "flags.abfalter.rollData": rollData,
        "flags.abfalter.num": num
    });
}

export async function effectResolverResistance({actor, resData}) {
    const template = "systems/abfalter/templates/dialogues/prompt/effectResolverResistance.hbs";

    const resTypeList = resData.resTypeList ?? [];
    if (!resTypeList.length) return;
    const toModelKey = (type) => type.charAt(0).toUpperCase() + type.slice(1);
    const resLabels = {
        Physical: game.i18n.localize("abfalter.physicalRes"),
        Disease: game.i18n.localize("abfalter.diseaseRes"),
        Poison: game.i18n.localize("abfalter.poisonRes"),
        Magic: game.i18n.localize("abfalter.magicRes"),
        Psychic: game.i18n.localize("abfalter.psychicRes")
    };
    const getResLabel = (type) => {
        const key = toModelKey(type);
        return resLabels[key] ?? `${key} Resistance`;
    };
    const getBaseValue = (type) => {
        const key = toModelKey(type);
        return Number(actor.system.resistances?.[key]?.final ?? 0);
    };
    const resOptions = resTypeList.map(type => ({
        value: type,
        label: getResLabel(type)
    }));

    const multipleResistances = resOptions.length > 1;
    let resType = resOptions[0].value;
    let resLabel = getResLabel(resType);
    let baseValue = getBaseValue(resType);
    let confirmed = false;
    let finalValue = baseValue;
    let finalFormula = "";

    const failedRes = resData.failedRes === true;

    const resBonus = failedRes
        ? Number(resData.resBonus) || 0
        : 0;

    const immunityType = String(resData.immunityType ?? "").toLowerCase();

    const immunityBonus = resData.useImmunity === true
        ? Number(actor.system.immunity?.[immunityType]?.final ?? 0) || 0
        : 0;

    const failedLabel = failedRes
        ? game.i18n.format("abfalter.failedPsyRes", { resBonus })
        : "";

    const htmlContent = await foundry.applications.handlebars.renderTemplate(template,
        {
            resOptions,
            multipleResistances,
            resType,
            resBonus,
            failedRes,
            failedLabel,
            immunityBonus,
            immunityType
        }
    );

    const updateFinalValue = (html, dialog) => {
        const modifierValue = parseInt(html.querySelector('#modifierMod')?.value ?? 0, 10);
        resType = html.querySelector("#resistanceType")?.value ?? resOptions[0].value;
        resLabel = getResLabel(resType);
        baseValue = getBaseValue(resType);

        finalValue =
            baseValue +
            resBonus +
            immunityBonus +
            modifierValue;

        finalFormula = [
            `${baseValue}(${game.i18n.localize("abfalter.value")})`,
            `${resBonus}(Failed Projection)`,
            `${immunityBonus}(${immunityType || "None"} Immunity)`,
            `${modifierValue}(${game.i18n.localize("abfalter.mod")})`
        ].join(" + ");

        updateRollButtonLabel(dialog);
    };

    const updateRollButtonLabel = (dialog) => {
        const root = dialog.element;
        if (!root) return;

        const rollButton =
            root.querySelector('[data-action="roll"]') ||
            root.querySelector('button[data-action="roll"]');

        if (rollButton) {
            rollButton.textContent = `${game.i18n.localize("abfalter.dialogs.roll")}: ${finalValue}`;
        }
    };

    const dialog = new diceDialogV2({
        window: {
            title: `${actor.name} - ${resLabel}`
        },
        position: {
            width: 400,
        },
        content: htmlContent,
        classes: ["baseAbfalterV2"],
        buttons: [
            {
                action: "roll",
                label: `${game.i18n.localize("abfalter.dialogs.roll")}: ${finalValue}`,
                default: true,
                callback: () => {
                    confirmed = true;
                    return "roll";
                }
            },
            {
                action: "cancel",
                label: game.i18n.localize('abfalter.dialogs.cancel'),
                callback: () => {
                    confirmed = false;
                    return "cancel";
                }
            }
        ],
        onRender: async (html, dialogInstance) => {
            const modifierInput = html.querySelector('#modifierMod');
            const resistanceSelect = html.querySelector('#resistanceType');

            updateFinalValue(html, dialogInstance);
            resistanceSelect?.addEventListener('change', () => {
                updateFinalValue(html, dialogInstance);
            });

            modifierInput?.addEventListener('input', () => updateFinalValue(html, dialogInstance));
        },
        onClose: async (html) => {
            if (!confirmed) return;

            const rollDetails = {
                resType,
                resLabel,
                finalValue,
                formula: finalFormula,
                resValue: resData.resValue,
                sourceMessageId: resData.sourceMessageId,
                tokenId: resData.tokenId
            };
            console.log(rollDetails)
            await effeResRoll({actor, rollDetails});
        }
    });
    dialog.render({ force: true });
}

async function effeResRoll({actor, rollDetails}) {
    const template = "systems/abfalter/templates/dialogues/diceRolls/resistanceRoll.hbs"
    const pendingGMAccept = !game.user.isGM;
    let rollResult;
    let finalFormula = "";
    let unlucky = actor.system.rollRange.limits == "unlucky";

    rollResult = await Roll.create("1d100 + @bonus", { bonus: rollDetails.finalValue }).evaluate();
    rollResult.rolledDice = rollResult.dice[0].results[0].result;
    rollResult.color = "";
    rollResult.fumble = false;
    rollResult.explode = false;
    finalFormula = `(${rollResult.rolledDice}) + ` + rollDetails.formula;

    let difference = rollResult.total - rollDetails.resValue;
    let success = difference > 0;

    if (rollResult.rolledDice == 1) {
        rollResult.color = "fumbleRoll";
        rollResult.fumble = true;
        success = false;
    } else if (rollResult.rolledDice == 100 && !unlucky) {
        rollResult.color = "openRoll";
        rollResult.explode = true;
        success = true;
    } else {
        rollResult.color = "normalRoll";
    }

    const effectLabel = success ? game.i18n.localize("abfalter.effectResisted") : game.i18n.localize("abfalter.effectFailed", { difference })

    let basicInfo = {
        portrait: actor.prototypeToken.texture.src,
        name: actor.name,
        userName: game.user.isGM ? game.i18n.localize("abfalter.gm") : game.user.name
    };

    const content = await foundry.applications.handlebars.renderTemplate(template, { 
        rollResult: rollResult, 
        label: rollDetails.resLabel, 
        formula: finalFormula, 
        basicInfo: basicInfo,
        isEffectResolver: true,
        effectLabel,
        pendingGMAccept
    });
    
    const chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actorData: actor }),
        sound: CONFIG.sounds.dice,
        content,
        flags: {            
            abfalter: {
                customChatHeaderCard: true,
                resistanceResult: {
                    sourceMessageId: rollDetails.sourceMessageId,
                    tokenId: rollDetails.tokenId,
                    accepted: false
                }
            } 
        }
    };

    const speakerMode = actor.system.rollRange.speaker; // "default" | "public" | "private"
    let rollMode;
    switch (speakerMode) {
        case "public":
            rollMode = "public";
            break;
        case "private":
            rollMode = "gm";
            break;
        default:
            rollMode = game.settings.get("core", "messageMode");
    }
    ChatMessage.applyMode(chatData, rollMode);
    await ChatMessage.create(chatData);

    if (game.user.isGM) {
        await acceptEffectResistance({
            resistanceMessageId: createdMessage.id
        });
    }
}

export async function acceptEffectResistance({resistanceMessageId}) {
    if (!game.user.isGM) return;

    const resistanceMessage = game.messages.get(resistanceMessageId);
    if (!resistanceMessage) return;

    const result = resistanceMessage.flags?.abfalter?.resistanceResult;
    if (!result || result.accepted) return;

    const sourceMessage = game.messages.get(result.sourceMessageId);
    if (!sourceMessage) {
        ui.notifications.error("Original effect resolution message not found.");
        return;
    }

    const resolveData = foundry.utils.deepClone(
        sourceMessage.flags?.abfalter?.resolveData ?? {}
    );

    const defenderData = resolveData.defenderValues?.[result.tokenId];
    if (!defenderData) {
        ui.notifications.error("Original resistance target not found.");
        return;
    }

    if (defenderData.resistanceAccepted) return;

    // Mark this defender's resistance as accepted.
    defenderData.resistanceAccepted = true;
    defenderData.resistanceMessageId = resistanceMessageId;

    // Update the original effect resolution message.
    await sourceMessage.update({
        "flags.abfalter.resolveData": resolveData
    });

    // Mark the resistance chat message as accepted.
    await resistanceMessage.update({
        "flags.abfalter.resistanceResult.accepted": true
    });
}






/** Shared chat visibility rules for generic and weapon utility rolls. */
function rollModeForActor(actor) {
    switch (actor.system.rollRange.speaker) {
        case "public": return "public";
        case "private": return "gm";
        default: return game.settings.get("core", "messageMode");
    }
}



/** Opens the trap dialogue for melee weapons.
 * @param {Actor} actor - The actor using the weapon.
 * @param {string} label - The label for the dialogue.
 * @param {string} wepId - The ID of the weapon being used.
 */
export async function openMeleeTrapDialogue(actor, label, wepId) {
    const weapon = actor.items.get(wepId);
    if (!weapon) return;
    const entries = weaponProfiles(weapon, "offensive").filter(entry => !entry.isFallback &&
        (Number(weapon.system.profilesVersion) ? entry.profile.properties?.trapping?.bool : !entry.profile.ignoreTrapping));
    if (!entries.length) {
        ui.notifications.error(game.i18n.localize("abfalter.trapError"));
        return;
    }
    const attacks = entries.map(entry => ({
        ...entry.profile,
        trappingType: Number(weapon.system.profilesVersion) && !entry.profile.customizeTrapping
            ? weapon.system.melee.trappingType : entry.profile.trappingType,
        trappingValue: Number(weapon.system.profilesVersion) && !entry.profile.customizeTrapping
            ? weapon.system.melee.trappingValue : entry.profile.trappingValue
    }));
    let selected = Math.max(0, entries.findIndex(e => e.key === weapon.system.info.lastWepProfileId));
    let modifier = 0;
    let confirmed = false;
    const template = "systems/abfalter/templates/dialogues/weaponPrompts/trapAtk.hbs";
    const content = await foundry.applications.handlebars.renderTemplate(template, { weapon, attacks, label });
    const dialog = new diceDialogV2({
        window: { title: game.i18n.localize("abfalter.trapAttack") },
        classes: ["baseAbfalterV2"], content,
        buttons: [
            {action:"roll", label:game.i18n.localize("abfalter.dialogs.roll"), default:true,
                callback:()=>{confirmed=true;return "roll";}},
            {action:"cancel", label:game.i18n.localize("abfalter.dialogs.cancel"),
                callback:()=>{confirmed=false;return "cancel";}}
        ],
        onRender: (html, instance) => {
            const select = html.querySelector("#attackSelect");
            const input = html.querySelector("#modifierMod");
            if (select) {
                select.replaceChildren();
                attacks.forEach((attack,index) => select.add(new Option(attack.name,String(index))));
                select.value = String(selected);
            }
            const refresh = () => {
                selected = Number(select?.value ?? selected);
                modifier = Number(input?.value ?? 0) || 0;
                const attack = attacks[selected];
                const amount = Number(attack.trappingValue ?? 0) + modifier;
                const formula = attack.trappingType === true ? String(amount) : `1d10 + ${amount}`;
                const button = instance.element?.querySelector('[data-action="roll"]');
                if (button) button.textContent = `${game.i18n.localize("abfalter.dialogs.roll")}: ${formula}`;
            };
            select?.addEventListener("change", refresh);
            input?.addEventListener("input", refresh);
            refresh();
        },
        onClose: async (html) => {
            if (!confirmed) return;
            selected = Number(html?.querySelector("#attackSelect")?.value ?? selected);
            modifier = Number(html?.querySelector("#modifierMod")?.value ?? modifier) || 0;
            const attack = attacks[selected];
            if (!attack) return;
            const value = Number(attack.trappingValue ?? 0) + modifier;
            await trapRoll(actor, {
                label: `${attack.name} ${game.i18n.localize("abfalter.trap")}`,
                name:attack.name, wepName:weapon.name, value,
                formula:`${attack.trappingValue}(${game.i18n.localize("abfalter.value")}) + ${modifier}(${game.i18n.localize("abfalter.mod")})`,
                type:attack.trappingType
            });
        }
    });
    return dialog.render({force:true});
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

    ChatMessage.applyMode(chatData, rollModeForActor(actor));
    await ChatMessage.create(chatData);
}

/** Opens the break dialogue for melee weapons.
 * @param {Actor} actor - The actor using the weapon.
 * @param {string} label - The label for the dialogue.
 * @param {string} wepId - The ID of the weapon being used.
 * @param {string} wepType - The type of the weapon (melee or ranged).
 */
export async function openMeleeBreakDialogue(actor, label, wepId, wepType) {
    const weapon = actor.items.get(wepId);
    if (!weapon) return;
    const entries = weaponProfiles(weapon, "offensive");
    if (!entries.length) return;
    let selected = Math.max(0, entries.findIndex(e => e.key === weapon.system.info.lastWepProfileId));
    let ammoId = null;
    let modifier = 0;
    let confirmed = false;
    const template = "systems/abfalter/templates/dialogues/weaponPrompts/weaponBreak.hbs";
    const content = await foundry.applications.handlebars.renderTemplate(template, {
        weaponType:wepType, weapon, attacks:entries.map(e=>e.profile),label
    });
    const dialog = new diceDialogV2({
        window:{title:`${weapon.name} ${game.i18n.localize("abfalter.breakRoll")}`},
        classes:["baseAbfalterV2"],content,
        buttons:[
            {action:"roll", label:game.i18n.localize("abfalter.dialogs.roll"), default:true,
                callback:()=>{confirmed=true;return "roll";}},
            {action:"cancel", label:game.i18n.localize("abfalter.dialogs.cancel"),
                callback:()=>{confirmed=false;return "cancel";}}
        ],
        onRender:(html,instance) => {
            const profileSelect = html.querySelector("#attackSelect");
            const ammoSelect = html.querySelector("#ammoDropdown");
            const modifierInput = html.querySelector("#modifierMod");
            if (profileSelect) {
                profileSelect.replaceChildren();
                entries.forEach((entry,index)=>profileSelect.add(new Option(entry.profile.name,String(index))));
                profileSelect.value = String(selected);
            }
            const updateAmmo = () => {
                const profile = entries[selected]?.profile;
                const ranged = (weapon.system.info.type === "hybrid" ? profile?.atkType : weapon.system.info.type) === "ranged";
                if (!ammoSelect) return;
                ammoSelect.replaceChildren();
                ammoSelect.disabled = true;
                ammoId = null;
                if (!ranged || !profile || !ammoRequirement(weapon,profile)) {
                    ammoSelect.add(new Option(game.i18n.localize("abfalter.none"),"none"));
                    return;
                }
                if (ammoMode(weapon) === "loaded") {
                    const loaded = ammoStats(weapon);
                    ammoId = loaded?.id ?? null;
                    ammoSelect.add(new Option(loaded?.name ?? "Unloaded",ammoId ?? "none"));
                } else if (ammoMode(weapon) === "direct") {
                    ammoSelect.disabled = false;
                    for (const item of weapon.parent?.items ?? []) {
                        if (item.type !== "ammo" || item.system.type !== "ammo" || Number(item.system.quantity) <= 0) continue;
                        ammoSelect.add(new Option(`${item.name} (${item.system.quantity})`,item.id));
                    }
                    ammoId = ammoSelect.value || null;
                    const preferred = weapon.system.ranged.selectedAmmo;
                    if (ammoId && Array.from(ammoSelect.options).some(o=>o.value===preferred)) ammoId=preferred;
                    if (ammoId) ammoSelect.value=ammoId;
                } else {
                    ammoSelect.add(new Option(game.i18n.localize("abfalter.none"),"none"));
                }
            };
            const refresh = () => {
                const profile = entries[selected]?.profile;
                if (!profile) return;
                modifier = Number(modifierInput?.value ?? 0) || 0;
                const ranged = (weapon.system.info.type === "hybrid" ? profile.atkType : weapon.system.info.type) === "ranged";
                const ammo = ranged && ammoRequirement(weapon,profile) ? ammoStats(weapon,ammoId) : null;
                const value = resolvedAttack(weapon,profile,ammo).breakage + modifier;
                const button = instance.element?.querySelector('[data-action="roll"]');
                if (button) button.textContent=`${game.i18n.localize("abfalter.dialogs.roll")}: ${value} + 1d10`;
            };
            profileSelect?.addEventListener("change", () => {
                selected = Number(profileSelect.value); updateAmmo(); refresh();
            });
            ammoSelect?.addEventListener("change", () => {
                if (ammoMode(weapon) !== "direct") return;
                ammoId = ammoSelect.value; refresh();
            });
            modifierInput?.addEventListener("input",refresh);
            updateAmmo(); refresh();
        },
        onClose:async (html) => {
            if (!confirmed) return;
            selected=Number(html?.querySelector("#attackSelect")?.value ?? selected);
            modifier=Number(html?.querySelector("#modifierMod")?.value ?? modifier) || 0;
            const profile=entries[selected]?.profile;
            if (!profile) return;
            const ranged = (weapon.system.info.type === "hybrid" ? profile.atkType : weapon.system.info.type) === "ranged";
            const ammo = ranged && ammoRequirement(weapon,profile) ? ammoStats(weapon,ammoId) : null;
            const base = resolvedAttack(weapon,profile,ammo).breakage;
            await breakRoll(actor, {
                label:`${profile.name} ${game.i18n.localize("abfalter.breakageShort")}`,
                name:profile.name, wepName:weapon.name, wepType:ranged ? "ranged":"melee",
                value:base+modifier,
                formula:`${base}(${game.i18n.localize("abfalter.value")}) + ${modifier}(${game.i18n.localize("abfalter.mod")})`,
                ammoName:ammo?.name ?? ""
            });
        }
    });
    return dialog.render({force:true});
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
    
    ChatMessage.applyMode(chatData, rollModeForActor(actor));
    await ChatMessage.create(chatData);
}

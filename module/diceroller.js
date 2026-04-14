import { abfalter } from "./config.js";
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

/** Creates the initial roll.
 * @param {Actor} actor - The actor using the weapon.
 * @param {Number} bonus - All additional bonuses for the roll in one value.
 * @param {Number} openRange - The open-roll range.
 * @param {Number} fumbleRange - The fumble range.
 */
async function createRoll(actor, bonus, openRange, fumbleRange, isPredetermined) {
    let rollResult;
    if (isPredetermined) {
        rollResult = await Roll.create("@bonus", { bonus: bonus }).evaluate();
        rollResult.rolledDice = 0;
        rollResult.color = "normalRoll";
        rollResult.fumble = false;
        rollResult.explode = false;
        return rollResult;
    }

    rollResult = await Roll.create("1d100 + @bonus", { bonus: bonus }).evaluate();
    rollResult.rolledDice = rollResult.dice[0].results[0].result;

    const doubleValues = [11, 22, 33, 44, 55, 66, 77, 88];
    const isDouble = actor.system.rollRange.doubles === true && doubleValues.includes(rollResult.rolledDice);
    rollResult.doubles = isDouble;
    rollResult.color = "";
    rollResult.fumbleLevel = 0;
    rollResult.fumble = false;
    rollResult.explode = false;

    if (rollResult.rolledDice <= fumbleRange) {
        rollResult.color = "fumbleRoll";
        rollResult.fumble = true;
        while (fumbleRange > rollResult.rolledDice) {
            rollResult.fumbleLevel += 15;
            fumbleRange--;
        }
    } else if (rollResult.rolledDice >= openRange || isDouble) {
        rollResult.color = "openRoll";
        rollResult.explode = true;
        if (!isDouble || rollResult.rolledDice > openRange) {
            openRange = rollResult.rolledDice;
        }
    } else {
        rollResult.color = "normalRoll";
    }
    const rollLimit = actor.system.rollRange.limits;
    if (rollLimit == "unlucky") {
        rollResult.color = "normalRoll";
        rollResult.explode = false;
    }
    let openRollSetting = game.settings.get('abfalter', abfalterSettingsKeys.Corrected_OpenRoll);
    rollResult.openRange = openRollSetting ? actor.system.rollRange.final : openRange;

    return rollResult;
}

/** Core Rules for Open Rolls, Open Roll Range + 1.
 * @param {Actor} actor - The actor using the weapon.
 * @param {Number} bonus - All additional bonuses for the roll in one value.
 * @param {Number} previousRange - The previous open roll range
 * @param {Number} rollNum - The number of open rolls.
 */
async function coreOpenRoll(actor, bonus, previousRange, rollNum) {
    let rollResult;
    rollResult = await Roll.create("1d100 + @bonus", { bonus: bonus }).evaluate();
    rollResult.rolledDice = rollResult.dice[0].results[0].result;
    console.log(rollResult.rolledDice);

    const doubleValues = [11, 22, 33, 44, 55, 66, 77, 88];
    const isDouble = actor.system.rollRange.doubles === true && doubleValues.includes(rollResult.rolledDice);
    rollResult.color = "";
    rollResult.explode = false;

    //Core Open Roll Logic
    rollResult.openRange = previousRange + 1;
    const meetsOpenThreshold = rollResult.rolledDice >= rollResult.openRange;
    if (meetsOpenThreshold || isDouble) {
        rollResult.color = "openRoll";
        rollResult.explode = true;
    } else {
        rollResult.color = "normalRoll";
        rollResult.explode = false;
    }

    const rollLimit = actor.system.rollRange.limits; //none, single, double, triple
    const limitMap = {
        none: 0,
        single: 1,
        double: 2,
        triple: 3
    };
    const limitNum = limitMap[rollLimit] ?? 0;
    if (limitNum == rollNum) {
        rollResult.color = "normalRoll";
        rollResult.explode = false;
    }

    return rollResult;
}

/** Luminita's Open Roll Rules (higher than prior).
 * @param {Actor} actor - The actor using the weapon.
 * @param {Number} bonus - All additional bonuses for the roll in one value.
 * @param {Number} previousRange - The previous open roll range
 * @param {Number} previousRoll - The previous roll total.
 * @param {Number} rollNum - The number of open rolls.
 */
async function lumiOpenRoll(actor, bonus, previousRange, previousRoll, rollNum) {
    let rollResult;
    rollResult = await Roll.create("1d100 + @bonus", { bonus: bonus }).evaluate();
    rollResult.rolledDice = rollResult.dice[0].results[0].result;

    const doubleValues = [11, 22, 33, 44, 55, 66, 77, 88];
    const isDouble = actor.system.rollRange.doubles === true && doubleValues.includes(rollResult.rolledDice);
    rollResult.color = "";
    rollResult.explode = false;

    const isGreaterThanPrevious = rollResult.rolledDice > previousRoll;
    const isGreaterThanOpen = rollResult.rolledDice > previousRange;

    if(rollResult.rolledDice === 100) {
        rollResult.color = "openRoll";
        rollResult.explode = true;
        rollResult.openRange = 100;
    } else if (isDouble && isGreaterThanPrevious) {
        rollResult.color = "openRoll";
        rollResult.explode = true;
        rollResult.openRange = previousRange;
        if (isGreaterThanOpen) rollResult.openRange = rollResult.rolledDice;
    } else if (isGreaterThanOpen) {
        rollResult.color = "openRoll";
        rollResult.explode = true;
        rollResult.openRange = rollResult.rolledDice;
    } else {
        rollResult.color = "normalRoll";
        rollResult.explode = false;
    }

    const rollLimit = actor.system.rollRange.limits; //none, single, double, triple
    const limitMap = {
        none: 0,
        single: 1,
        double: 2,
        triple: 3
    };
    const limitNum = limitMap[rollLimit] ?? 0;
    if (limitNum == rollNum) {
        rollResult.color = "normalRoll";
        rollResult.explode = false;
    }

    return rollResult;
}



/** Opens the weapon profile dialog for the selected weapon. 
 *  Now with DialogV2
 * @param {Actor} actor - The actor using the weapon.
 * @param {string} label - The label for the dialog.
 * @param {string} wepId - The ID of the weapon.
 * @param {string} wepType - The type of the weapon ("hybrid", "melee", "ranged", "shield").
 * @param {string} actionType - The type of profile ("attack", "block", "dodge").
 * @param {string} profileType - The action type ("offensive", "defensive").
 * @param {string} indexOverrideValue - index used to get the chosen profile from the macro.
 */
export async function openWeaponProfileDialogue(actor, label, wepId, wepType, actionType, profileType, indexOverrideValue) {
    const weapon = actor.items.get(wepId);
    const allAttacks = Object.values(weapon.system.attacks ?? {});

    // Break if no Profiles are found
    if (allAttacks.length === 0) {
        ui.notifications.warn(game.i18n.localize("abfalter.noProfilesFound"));
        return;
    }

    // Skip dialog if shift key is held TODO/update
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
                    dmg: weapon.system.derived.meleeDmg,
                    dmgType: weapon.system.primDmgT,
                    atPen: weapon.system.derived.meleeAtPen,
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
                    profileType: profileType,
                    chosenAt: "showAll",
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
                    profileType: profileType,
                    chosenAt: "showAll",
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

    // List of Profiles
    let attacks = allAttacks.filter(atk => {
        const pType = atk.profileType?.trim().toLowerCase();
        const filterType = profileType?.trim().toLowerCase();
        return pType === "both" || pType === filterType;
    });

    // Get the last profile used, if not, reset to the top profile.
    let confirmed = false;
    let usedIndex = 0;
    if (typeof indexOverrideValue === "number" && indexOverrideValue >= 0) {
        usedIndex = indexOverrideValue;
        console.log('error 0');
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

    const templateData = {
        weaponType: wepType,
        profileType: profileType,
        actionType: actionType,
        weapon,
        attacks,
        label,
    };
    const template = "systems/abfalter/templates/dialogues/weaponPrompts/weaponProfile.hbs";
    const htmlContent = await foundry.applications.handlebars.renderTemplate(template, templateData);

    let finalValue = 0;
    let finalFormula = "";
    let fatigueUsed = 0;
    let ammoUsed = 0;
    let ammoIdUsed = "";
    let RangedAmmoUsed = 0;
    let finalDmgNum = 0;
    let finalAtNum = 0;
    let wepValue = 0; // Current selected attack's base value
    let selectedArmorTag = "showAll";
    let selectedDamageType = "";
    let selectedAimTarget = "";

    
    // Armor values for defensive rolls
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

    const updateFinalValue = (html, dialog) => {
        const selectedModifier = parseInt(html.querySelector('#modifierSelect')?.value ?? 0, 10);
        const fatigueValue = parseInt(html.querySelector('#fatigueDropdown')?.value ?? 0, 10);
        const modifierValue = parseInt(html.querySelector('#modifierMod')?.value ?? 0, 10);
        const selectedPenalty = parseInt(html.querySelector('#directedAtkDropdown option:checked')?.dataset.penalty ?? 0, 10);
        const multDefPenalty = parseInt(html.querySelector('#defNumberDropdown option:checked')?.dataset.penalty ?? 0, 10);

        fatigueUsed = fatigueValue;

        switch (actionType) {
            case 'attack':
                finalValue = wepValue + (fatigueValue * actor.system.settings.fatigueValue) + modifierValue + selectedPenalty + selectedModifier;
                finalFormula = `${wepValue}(${game.i18n.localize("abfalter.value")}) + ${fatigueValue * actor.system.settings.fatigueValue}(${game.i18n.localize("abfalter.fatigue")}) + ${modifierValue}(${game.i18n.localize("abfalter.mod")}) + ${selectedPenalty}(${game.i18n.localize("abfalter.aim")}) + ${selectedModifier}(${game.i18n.localize("abfalter.action")})`;
                break;
            case 'block':
            case 'dodge':
                finalValue = wepValue + (fatigueValue * actor.system.settings.fatigueValue) + modifierValue + multDefPenalty;
                finalFormula = `${wepValue}(${game.i18n.localize("abfalter.value")}) + ${fatigueValue * actor.system.settings.fatigueValue}(${game.i18n.localize("abfalter.fatigue")}) + ${modifierValue}(${game.i18n.localize("abfalter.mod")}) + ${multDefPenalty}(${game.i18n.localize("abfalter.multipleDef")})`;
                break;
            default:
                console.log("(Update Final Value)Error: No action type found.");
                ui.notifications.error("(Update Final Value)Error: No action type found.");
                return;
        }

        updateRollButtonLabel(dialog);
    };

    const dialog = new diceDialogV2({
        window: {
            title: `${weapon.name} ${game.i18n.localize('abfalter.' + actionType)}`
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
            const attackSelect = html.querySelector('#attackSelect');
            const modifierSelect = html.querySelector('#modifierSelect');
            const modifierInput = html.querySelector('#modifierMod');
            const fatigueDropdown = html.querySelector('#fatigueDropdown');
            const atkDmgTypeDropdown = html.querySelector('#atkDmgTypeDropdown');
            const directedAtkDropdown = html.querySelector('#directedAtkDropdown');
            const ammoDropdown = html.querySelector('#ammoDropdown');
            const ammoRow = html.querySelector('#ammoRow');
            const defNumberDropdown = html.querySelector('#defNumberDropdown');
            const armorDropdown = html.querySelector('#armorDropdown');
            const noteRow = html.querySelector('#noteRow');

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

            let vorpalLocation = attacks[usedIndex].properties.vorpal.bool
                ? attacks[usedIndex].vorpalLocation
                : weapon.system.info.vorpalLocation;

            let vorpalModifier = attacks[usedIndex].properties.vorpal.bool
                ? attacks[usedIndex].vorpalMod
                : weapon.system.info.vorpalMod;

            let isPrecise = weapon.system.properties.precision.bool && !attacks[usedIndex].properties.precision.bool;
            let isVorpal = weapon.system.properties.vorpal.bool && !attacks[usedIndex].ignoreVorpal;
            let useAmmunition = (wepType === "ranged" || (wepType === "hybrid" && attacks[usedIndex].atkType === "ranged"));
            let currentDmgTypes = [];
            let attackInfo = "";
            let rangeInfo = "";
            let promptNote = "";

            // --- Populate Dropdowns ---

            // Attack options
            clearOptions(attackSelect);
            attacks.forEach((attack, index) => {
                appendOption(attackSelect, {
                    value: index,
                    label: attack.name,
                    selected: index === usedIndex
                });
            });
            if (attackSelect) attackSelect.value = String(usedIndex);

            // Damage type dropdown
            const populateAtkTypeDropdown = () => {
                clearOptions(atkDmgTypeDropdown);

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
            populateAtkTypeDropdown();

            // Active Action Penalty select
            clearOptions(modifierSelect);
            for (let i = 0; i < 10; i++) {
                const value = -25 * i;
                appendOption(modifierSelect, {
                    value,
                    label: game.i18n.localize(`abfalter.activeAction${i + 1}`),
                    selected: i === 0
                });
            }
            if (modifierSelect) modifierSelect.value = "0";

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

            // Directed attack dropdown
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
                    directedAtkDropdown.value = vorpalLocation === "anywhere" ? directedAtk[0].tag : vorpalLocation;
                }
                selectedAimTarget = directedAtkDropdown?.value ?? "none";
            };
            populateDirectedAtkDropdown();

            // Multiple defense dropdown
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

            // Armor dropdown
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

            // --- Event Handlers ---

            // When the attack selection changes, Melee changes
            const updateMeleeDmgTypes = () => {
                currentDmgTypes.length = 0;
                const attackForcesDamageType = attacks[usedIndex].properties.damageType.bool === true;

                if (attackForcesDamageType) {
                    currentDmgTypes.push(attacks[usedIndex].damageType);
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

            // When the attack selection changes, ranged changes
            const updateRangedDmgTypes = (dmgType) => {
                currentDmgTypes.length = 0;
                const attackForcesDamageType = attacks[usedIndex].properties.damageType.bool === true;
                const chosenDmgType = attackForcesDamageType ? attacks[usedIndex].damageType : dmgType;

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

            // When the ammo selection changes, ammo changes
            const updateAmmoValues = () => {
                let ammoDamage = 0;
                let ammoDmgType = "";
                let ammoAtPen = 0;

                if (ammoIdUsed === "special") {
                    ammoDamage = weapon.system.ranged.specialDmg;
                    ammoDmgType = weapon.system.ranged.specialDmgType;
                    ammoAtPen = weapon.system.ranged.specialAtPen;
                } else {
                    const ammoItem = weapon.parent.items.get(ammoIdUsed);
                    ammoDamage = ammoItem?.system.damage || 0;
                    ammoDmgType = ammoItem?.system.dmgType || "";
                    ammoAtPen = ammoItem?.system.atPen || 0;
                }

                updateRangedDmgTypes(ammoDmgType);
                populateAtkTypeDropdown();

                const newRangedDmg = ammoDamage + weapon.system.derived.rangedDmgPreAmmo + attacks[usedIndex].damage;
                const newRangedAT = ammoAtPen + weapon.system.ranged.ammoAtPenMod + attacks[usedIndex].atPen;

                const selectedAttack = attacks[Number(attackSelect?.value ?? usedIndex)];

                setText(html, '#attackPower', selectedAttack.finalAttack);
                setText(html, '#damageNum', newRangedDmg);
                setText(html, '#atPenNum', newRangedAT);

                attackInfo = `${game.i18n.localize('abfalter.baseAtkShort')}: ${selectedAttack.finalAttack}
                     · ${game.i18n.localize('abfalter.baseDmgShort')}: ${newRangedDmg}
                     · ${game.i18n.localize('abfalter.basePenShort')}: ${newRangedAT}
                `;

                finalDmgNum = newRangedDmg;
                finalAtNum = newRangedAT;

                setText(html, '#newAtkInfo', attackInfo);
            };

            // If weapon is ranged, populate and handle ammo dropdown changes
            if (wepType === "ranged" || wepType === "hybrid") {
                clearOptions(ammoDropdown);

                weapon.system.ranged.ammoIds.forEach(ammo => {
                    appendOption(ammoDropdown, {
                        value: ammo.id,
                        label: ammo.name
                    });
                });

                ammoIdUsed = weapon.system.ranged.selectedAmmo;
                if (ammoDropdown) ammoDropdown.value = weapon.system.ranged.selectedAmmo;

                ammoDropdown?.addEventListener('change', (ev) => {
                    ammoIdUsed = ev.currentTarget.value;
                    updateAmmoValues();
                    updateFinalValue(html, dialogInstance);
                });
            }

            // When the attack selection changes
            attackSelect?.addEventListener('change', (ev) => {
                usedIndex = Number(ev.currentTarget.value);
                const selectedAttack = attacks[usedIndex];

                isPrecise = weapon.system.properties.precision.bool && !attacks[usedIndex].properties.precision.bool;
                isVorpal = weapon.system.properties.vorpal.bool && !attacks[usedIndex].ignoreVorpal;
                vorpalLocation = attacks[usedIndex].properties.vorpal.bool ? attacks[usedIndex].vorpalLocation : weapon.system.info.vorpalLocation;
                vorpalModifier = attacks[usedIndex].properties.vorpal.bool ? attacks[usedIndex].vorpalMod : weapon.system.info.vorpalMod;

                populateDirectedAtkDropdown();

                if (weapon.system.properties.throwable.bool) {
                    if (attacks[usedIndex].properties.throwable.bool) {
                        ammoUsed = attacks[usedIndex].quantityConsumed ? 0 : attacks[usedIndex].consumedValue;
                    } else {
                        ammoUsed = weapon.system.melee.returning ? 0 : weapon.system.melee.throwConsumption;
                    }
                    if (attacks[usedIndex].ignoreThrown) ammoUsed = 0;
                }

                if (weapon.system.properties.ammunition.bool) {
                    if (attacks[usedIndex].properties.ammunition.bool) {
                        RangedAmmoUsed = attacks[usedIndex].rangedAmmoConsumed ? 0 : attacks[usedIndex].rangedAmmoConsumedValue;
                    } else {
                        RangedAmmoUsed = weapon.system.ranged.infiniteAmmo ? 0 : weapon.system.ranged.ammoConsumption;
                    }
                    if (attacks[usedIndex].ignoreAmmo) RangedAmmoUsed = 0;
                }

                useAmmunition = (wepType === "ranged" || (wepType === "hybrid" && attacks[usedIndex].atkType === "ranged"));

                setText(html, '#attackPower', selectedAttack.finalAttack);
                setText(html, '#defensePower', selectedAttack.finalBlock);
                setText(html, '#dodgePower', selectedAttack.finalDodge);
                setText(html, '#damageNum', selectedAttack.finalDamage);
                setText(html, '#atPenNum', selectedAttack.finalAtPen);

                attackInfo = `${game.i18n.localize('abfalter.baseAtkShort')}: ${selectedAttack.finalAttack}
                     · ${game.i18n.localize('abfalter.baseDmgShort')}: ${selectedAttack.finalDamage}
                     · ${game.i18n.localize('abfalter.basePenShort')}: ${selectedAttack.finalAtPen}
                `;
                setText(html, '#newAtkInfo', attackInfo);

                finalDmgNum = selectedAttack.finalDamage;
                finalAtNum = selectedAttack.finalAtPen;

                if (useAmmunition) {
                    updateAmmoValues();
                    showEl(ammoRow);
                } else {
                    updateMeleeDmgTypes();
                    populateAtkTypeDropdown();
                    hideEl(ammoRow);
                }

                const reachLabel = game.i18n.localize(`abfalter.${weapon.system.distance.reachUnitType}`);
                const rangeLabel = game.i18n.localize(`abfalter.${weapon.system.distance.rangeUnitType}`);
                const usesRange = (weapon.system.properties.throwable.bool && !attacks[usedIndex].ignoreThrown) || useAmmunition;

                if (usesRange) {
                    rangeInfo = `${game.i18n.localize('abfalter.reach')}: ${weapon.system.distance.reach} ${reachLabel}
                     · ${game.i18n.localize('abfalter.range')}: ${weapon.system.distance.range} ${rangeLabel}
                    `;
                } else {
                    rangeInfo = `${game.i18n.localize('abfalter.reach')}: ${weapon.system.distance.reach} ${reachLabel}`;
                }
                setText(html, '#newRangeInfo', rangeInfo);

                if (attacks[usedIndex].properties.note.bool) {
                    promptNote = attacks[usedIndex].attackNote;
                    showEl(noteRow);
                } else {
                    promptNote = "";
                    hideEl(noteRow);
                }
                setText(html, '#noteInfo', promptNote);

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

                populateAtkTypeDropdown();
                updateFinalValue(html, dialogInstance);
            });

            fatigueDropdown?.addEventListener('change', () => updateFinalValue(html, dialogInstance));
            modifierSelect?.addEventListener('change', () => updateFinalValue(html, dialogInstance));
            defNumberDropdown?.addEventListener('change', () => updateFinalValue(html, dialogInstance));
            directedAtkDropdown?.addEventListener('change', () => updateFinalValue(html, dialogInstance));
            modifierInput?.addEventListener('input', () => updateFinalValue(html, dialogInstance));

            armorDropdown?.addEventListener('change', (ev) => { selectedArmorTag = ev.currentTarget.value; });
            atkDmgTypeDropdown?.addEventListener('change', (ev) => { selectedDamageType = ev.currentTarget.value; });
            directedAtkDropdown?.addEventListener('change', (ev) => {
                selectedAimTarget = ev.currentTarget.value;
                updateFinalValue(html, dialogInstance);
            });

            // Initial target render
            syncSelectedTargets(html);

            targetHookId = Hooks.on("targetToken", (user, token, targeted) => {
                if (user.id !== game.user.id) return;
                syncSelectedTargets(html);
            });

            attackSelect?.dispatchEvent(new Event('change'));
        },

        onClose: async (html) => {
            if (targetHookId !== null) {
                Hooks.off("targetToken", targetHookId);
                targetHookId = null;
            }
            if (!confirmed) return;
            await actor.update({ "system.fatigue.value": Math.floor(actor.system.fatigue.value - fatigueUsed) });
            const ammoName = wepType === "ranged"
                ? weapon.parent.items.get(ammoIdUsed)?.name
                : "No Arrow";

            if (typeof indexOverrideValue === "number" && indexOverrideValue >= 0) {
            } else {
                switch (profileType) {
                    case 'offensive':
                        await weapon.update({ 'system.info.lastWepUsed': usedIndex });
                        break;
                    case 'defensive':
                        await weapon.update({ 'system.info.lastDefUsed': usedIndex });
                        break;
                    default:
                        console.log("(Set Last Index)Error: No action type found.");
                        ui.notifications.error("(Set Last Index)Error: No action type found.");
                        return;
                }
            }

            // Subtract Quantity for Throwable
            if ((wepType === "melee" && actionType === "attack") || (wepType === "hybrid" && attacks[usedIndex].atkType === "melee" && actionType === "attack")) {
                await weapon.update({ 'system.quantity': Math.floor(weapon.system.quantity - ammoUsed) });
            }

            // Subtract Quantity for Ammunition
            if ((wepType === "ranged" && actionType === "attack") || (wepType === "hybrid" && attacks[usedIndex].atkType === "ranged" && actionType === "attack")) {
                const ammoItem = actor.items.get(ammoIdUsed);
                if (ammoItem) {
                    await ammoItem.update({ 'system.quantity': Math.floor(ammoItem.system.quantity - RangedAmmoUsed) });

                    if (weapon.system.ranged.magSize - RangedAmmoUsed <= 0) {
                        await weapon.update({ 'system.ranged.magSize': 0 });
                        await weapon.update({ 'system.ranged.isLoaded': false });
                    } else {
                        await weapon.update({ 'system.ranged.magSize': weapon.system.ranged.magSize - RangedAmmoUsed });
                    }
                }

                await weapon.update({ 'system.ranged.selectedAmmo': ammoIdUsed });
            }

            const isPredetermined = attacks[usedIndex].properties.predetermined.bool;
            const hasNote = attacks[usedIndex].properties.note.bool;
            const note = hasNote ? attacks[usedIndex].chatNote : "";

            const workflow = {
                attackerUserId: game.user.id,
                attackerActorId: actor.id,
                attackerTokenId: actor.getActiveTokens()?.[0]?.id ?? null,
                selectedDefenderIds: selectedTargetIds,
                targetStates: Object.fromEntries(
                    selectedTargetIds.map(id => [id, {
                        status: "pending",
                    }])
                )
            }

            const attackDetails = {
                label: game.i18n.localize('abfalter.' + actionType),
                name: attacks[usedIndex].name,
                base: weapon.system.derived.baseAtk,
                value: finalValue,
                formula: finalFormula,
                dmg: finalDmgNum,
                dmgType: selectedDamageType,
                atPen: finalAtNum,
                target: selectedAimTarget,
                ammoName: ammoName,
                chosenAt: selectedArmorTag,
                wepType: wepType,
                profileType: profileType,
                actionType: actionType,
                isPredetermined: isPredetermined,
                hasNote: hasNote,
                note: note
            };

            weaponRoll(actor, weapon, attackDetails, workflow);
            console.log('Attack Handle Finished');
        }
    });

    dialog.render({ force: true });
}

/** Rolls the weapon attack and sends the result to chat.
 * @param {Actor} actor - The actor using the weapon.
 * @param {Object} weapon - The weapon being used.
 * @param {Object} attackDetails - The details of the roll from OpenWeaponProfileDialogue.
 */
async function weaponRoll(actor, weapon, attackDetails, workflow) {
    let fumbleRange = weapon.system.derived.baseFumbleRange;
    if (attackDetails.base > 199 && fumbleRange > 1) {
        fumbleRange -= 1;
    }

    const rollResult = await createRoll(actor, attackDetails.value, weapon.system.derived.baseOpenRollRange, fumbleRange, attackDetails.isPredetermined);
    attackDetails.formula = `(${rollResult.rolledDice}) + ${attackDetails.formula}`;
    attackDetails.wepName = weapon.name;

    let num = 0;
    let type = "weapon";
    let armorContent = "";

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
        const selectedTag = attackDetails.chosenAt;
        let typesToShow = [];
        if (selectedTag === 'showAll') {
            typesToShow = armorType.filter(t => t.tag !== 'showAll');
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
    attackDetails.chosenAt = armorContent;


    const rollData = [];
    rollData[0] = {
        roll: rollResult.rolledDice, total: rollResult._total, doubles: rollResult.doubles, openRange: rollResult.openRange, fumbleLevel: rollResult.fumbleLevel,
        fumble: rollResult.fumble, explode: rollResult.explode, color: rollResult.color, formula: attackDetails.formula, label: `${attackDetails.name} ${attackDetails.label}`
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

    const template = "systems/abfalter/templates/dialogues/diceRolls/weaponRoll.hbs"
    const content = await foundry.applications.handlebars.renderTemplate(template, { 
        rollData,
        actor,
        attackDetails,
        workflow,
        targetList,
        defendLocked
    });
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
                type: type,
                workflow
            } 
        }
    };

    const speakerMode = actor.system.rollRange.speaker; // "default" | "public" | "private"
    let rollMode;
    switch (speakerMode) {
    case "public":
        rollMode = CONST.DICE_ROLL_MODES.PUBLIC;
        break;
    case "private":
        rollMode = CONST.DICE_ROLL_MODES.PRIVATE;
        break;
    default:
        rollMode = game.settings.get("core", "rollMode");
    }
    ChatMessage.applyRollMode(chatData, rollMode);
    ChatMessage.create(chatData);
}

export async function profileOpenRollFunction(msg) {
    let actor = game.actors.get(msg.speaker.actor);
    let num = msg.flags.abfalter.num;
    let oldData = msg.flags.abfalter.rollData[msg.flags.abfalter.num];
    let openRollSetting = game.settings.get('abfalter', abfalterSettingsKeys.Corrected_OpenRoll);
    let rollResult;

    if (!openRollSetting) {
        //Lumis way of open rolls
        rollResult = await lumiOpenRoll(actor, oldData.total, oldData.openRange, oldData.roll, num+1);
    } else {
        //Core rule for open rolls
        rollResult = await coreOpenRoll(actor, oldData.total, oldData.openRange, num+1)
    }
    let formula = `(${rollResult.rolledDice}) + ${oldData.total}(${game.i18n.localize("abfalter.prevRoll")})`;

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

    // Workflow - Combat Data
    const workflow = msg.flags.abfalter.workflow ?? {
        selectedDefenderIds: [],
        targetStates: {}
    };

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

    const defendLocked = isAttackRollPendingResolution(msg.flags.abfalter.rollData);

    const content = await foundry.applications.handlebars.renderTemplate(template, { 
        rollData: msg.flags.abfalter.rollData,
        actor,
        attackDetails: msg.flags.abfalter.attackDetails,
        workflow,
        targetList,
        defendLocked
    });
    game.messages.get(msg._id).update({
        content,
        "flags.abfalter.rollData": rollData,
        "flags.abfalter.num": num
    });
}

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

    // Workflow - Combat Data
    const workflow = msg.flags.abfalter.workflow ?? {
        selectedDefenderIds: [],
        targetStates: {}
    };

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

    const defendLocked = isAttackRollPendingResolution(msg.flags.abfalter.rollData);

    const content = await foundry.applications.handlebars.renderTemplate(template, { 
        rollData: msg.flags.abfalter.rollData,
        actor,
        attackDetails: msg.flags.abfalter.attackDetails,
        workflow,
        targetList,
        defendLocked
    });
    game.messages.get(msg._id).update({
        content,
        "flags.abfalter.rollData": rollData,
        "flags.abfalter.num": num
    });
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



/**
 * Defensive rolls that are called from attack chat cards.
 * @param {String} atkDmgType - has atk dmg type
 * @param {String} atkMsgId - has atk msg id
 * @param {String} tokenId - has defender token id
 * @returns 
 */
export async function defendAgainstAttacks({atkDmgType, atkMsgId, tokenId}) {
    const defenderToken = canvas.tokens?.get(tokenId);
    const actor = defenderToken?.actor;

    // Armor values for defensive rolls
    const attackType = atkDmgType;
    const armorType = [
        { tag: 'cut', name: game.i18n.localize('abfalter.cut'), atValue: actor.system.armor.body.aCutFinal },
        { tag: 'imp', name: game.i18n.localize('abfalter.imp'), atValue: actor.system.armor.body.aImpFinal },
        { tag: 'thr', name: game.i18n.localize('abfalter.thr'), atValue: actor.system.armor.body.aThrFinal },
        { tag: 'heat', name: game.i18n.localize('abfalter.heat'), atValue: actor.system.armor.body.aHeatFinal },
        { tag: 'cold', name: game.i18n.localize('abfalter.cold'), atValue: actor.system.armor.body.aColdFinal },
        { tag: 'ele', name: game.i18n.localize('abfalter.ele'), atValue: actor.system.armor.body.aEleFinal },
        { tag: 'ene', name: game.i18n.localize('abfalter.ene'), atValue: actor.system.armor.body.aEneFinal }
    ];
    const chosenArmorType = armorType.find(row => row.tag == attackType.toLowerCase());

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
        armorTypeName: chosenArmorType.name,
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
            const allAttacks = Object.values(weapon.system.attacks ?? {});
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
    const getWeaponProfiles = (weapon) => {
        if (!weapon) return [];
        const allAttacks = Object.values(weapon.system.attacks ?? {});
        return allAttacks.filter(profile => {
            const pType = profile.profileType?.trim().toLowerCase();
            return pType === "both" || pType === "defensive";
        });
    };
    const getCurrentCombatDefenseValues = () => {
        // Unarmed uses actor defaults
        if (selectedWeaponId === unarmedOption) {
            return {
                block: Number(actor.system.combatValues?.block?.final ?? 0),
                dodge: Number(actor.system.combatValues?.dodge?.final ?? 0)
            };
        }

        const profile = selectedProfiles?.[selectedProfileIndex];

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
                const profile = selectedProfiles?.[selectedProfileIndex];
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
                defBaseValue = actor.system.mproj.finalDefensive;
                updateFinalValue(html, dialog);
                break;

            case "psychic":
                defBaseValue = actor.system.pproj.final;
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
            populateDefenseTypeDropdown();

            const populateCombatDefenseDropdown = () => {
                clearOptions(combatDefenseDropdown);

                const values = getCurrentCombatDefenseValues();

                if (!["block", "dodge"].includes(selectedCombatDefense)) {
                    selectedCombatDefense = values.block >= values.dodge ? "block" : "dodge";
                }

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
            populateCombatDefenseDropdown();

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
            populateWeaponDropdown();

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

                const lastDefUsed = selectedWeapon.system.info.lastDefUsed;
                selectedProfileIndex = lastDefUsed >= 0 && lastDefUsed < selectedProfiles.length ? lastDefUsed : 0;

                selectedProfiles.forEach((profile, index) => {
                    appendOption(profileDropdown, {
                        value: index,
                        label: profile.name,
                        selected: index === lastDefUsed
                    });
                });
                profileDropdown.value = String(selectedProfileIndex);
            };
            populateProfileDropdown();

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

            // Update on Change Listeners
            const updateArmorValue = () => {
                const mod = parseInt(armorModInput?.value ?? 0, 10);
                armorFinalValue  = armorBaseValue + mod;

                if (armorFinalValueEl) {
                    armorFinalValueEl.textContent = armorFinalValue ;
                }
            };
            updateArmorValue();

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
                if (selectedWeaponId === unarmedOption) {
                    selectedProfileIndex = 0;
                } else {
                    const weapon = actor.items.get(selectedWeaponId);
                    const lastDefUsed = weapon.system.info.lastDefUsed;
                    selectedProfileIndex = lastDefUsed;
                }
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
                    "system.info.lastDefUsed": selectedProfileIndex
                });
            }

            let chosenIndex = null;
            let chosenWeaponId = selectedWeaponId

            switch (selectedDefenseType) {
                case "combat":
                    if (selectedWeaponId === "__unarmed__") {
                        
                    } else {
                        chosenIndex = selectedProfileIndex;
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
                armorType: chosenArmorType.tag,
                armorFinal: armorFinalValue,
                weaponId: chosenWeaponId,                 // __unarmed__ / weapons
                profileIndex: chosenIndex
            };
            autoDefenseRoll({actor, tokenId, defenseDetails, atkMsgId});
        }
    });
    dialog.render({ force: true });
}

async function autoDefenseRoll({actor, tokenId, defenseDetails, atkMsgId}) {
    const template = "systems/abfalter/templates/dialogues/diceRolls/defensiveAutoRoll.hbs"
    let weapon; 
    let fumbleRange = 3; 
    let openRange = 90; 
    let isPredetermined;
    let actionName = "";
    let defenseName = "";
    let num = 0;

    if (defenseDetails.defenseType == "combat" && defenseDetails.weaponId != "__unarmed__") {
        weapon = actor.items.get(defenseDetails.weaponId);
        if (!weapon) console.warn("Weapon not found even though a weapon was used for defense:", defenseDetails.weaponId);
        fumbleRange = weapon.system.derived.baseFumbleRange;
        openRange = weapon.system.derived.baseOpenRollRange;
        const profiles = Object.values(weapon.system.attacks ?? {});
        const profile = profiles[defenseDetails.profileIndex];
        isPredetermined = profile.properties.predetermined.bool ?? false;
        actionName = weapon.name;
        defenseName = defenseDetails.combatDefenseType == "block" ? `${profile.name} ${game.i18n.localize("abfalter.block")}` : `${profile.name} ${game.i18n.localize("abfalter.dodge")}`;;
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

    let basicInfo = [];
    basicInfo.portrait = actor.prototypeToken.texture.src;
    basicInfo.name = actor.name;
    basicInfo.userName = isGM ? "Gamemaster" : game.user.name;

    const content = await foundry.applications.handlebars.renderTemplate(template, { 
        basicInfo,
        rollData,
        actor,
        defenseDetails,
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
                defenseDetails: defenseDetails,
                rollData: rollData,
                num: num,
                defenseWorkflow: {
                    parentAttackMessageId: atkMsgId,
                    defenderActorid: actor.id,
                    defTokenId: tokenId
                }
            } 
        }
    };

    const speakerMode = actor.system.rollRange.speaker; // "default" | "public" | "private"
    let rollMode;
    switch (speakerMode) {
    case "public":
        rollMode = CONST.DICE_ROLL_MODES.PUBLIC;
        break;
    case "private":
        rollMode = CONST.DICE_ROLL_MODES.PRIVATE;
        break;
    default:
        rollMode = game.settings.get("core", "rollMode");
    }
    ChatMessage.applyRollMode(chatData, rollMode);
    const createdMessage = await ChatMessage.create(chatData);

    if (!needsContinuation) {
        if (isGM) {
            await finalizeDefenseAgainstAttackMessage({
                defenseMessageId: createdMessage.id
            });
        }
    }
}

export async function autoDefOpenRollFunction(msg) {
    const template = "systems/abfalter/templates/dialogues/diceRolls/defensiveAutoRoll.hbs";
    let actor = game.actors.get(msg.speaker.actor);
    let num = msg.flags.abfalter.num;
    let oldData = msg.flags.abfalter.rollData[msg.flags.abfalter.num];
    let openRollSetting = game.settings.get('abfalter', abfalterSettingsKeys.Corrected_OpenRoll);
    let rollResult;

    if (!openRollSetting) {
        //Lumis way of open rolls
        rollResult = await lumiOpenRoll(actor, oldData.total, oldData.openRange, oldData.roll, num+1);
    } else {
        //Core rule for open rolls
        rollResult = await coreOpenRoll(actor, oldData.total, oldData.openRange, num+1)
    }
    let formula = `(${rollResult.rolledDice}) + ${oldData.total}(${game.i18n.localize("abfalter.prevRoll")})`;

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
    const isGM = game.user.isGM;
    const needsContinuation = rollData?.[num].explode;
    let status = "";
    if (isGM) {
        status = needsContinuation ? 'pending' : 'complete';
    } else {
        status = needsContinuation ? 'pending' : 'pendingGMAccept';
    }

    let basicInfo = [];
    basicInfo.portrait = actor.prototypeToken.texture.src;
    basicInfo.name = actor.name;
    basicInfo.userName = isGM ? "Gamemaster" : game.user.name;

    const content = await foundry.applications.handlebars.renderTemplate(template, { 
        basicInfo,
        rollData: rollData,
        actor,
        defenseDetails: msg.flags.abfalter.defenseDetails,
        status
    });

    game.messages.get(msg._id).update({
        content,
        "flags.abfalter.rollData": rollData,
        "flags.abfalter.num": num
    });

    const updatedMsg = game.messages.get(msg._id);

    if (!needsContinuation) {
        if (isGM) {
            await finalizeDefenseAgainstAttackMessage({
                defenseMessageId: updatedMsg.id
            });
        }
    }
}

export async function autoDefFumbleRollFunction(msg) {
    const template = "systems/abfalter/templates/dialogues/diceRolls/defensiveAutoRoll.hbs";

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

    const isGM = game.user.isGM;
    const needsContinuation = rollData?.[num].explode;
    let status = "";
    if (isGM) {
        status = needsContinuation ? 'pending' : 'complete';
    } else {
        status = needsContinuation ? 'pending' : 'pendingGMAccept';
    }

    let basicInfo = [];
    basicInfo.portrait = actor.prototypeToken.texture.src;
    basicInfo.name = actor.name;
    basicInfo.userName = isGM ? "Gamemaster" : game.user.name;

    const content = await foundry.applications.handlebars.renderTemplate(template, { 
        basicInfo,
        rollData: rollData,
        actor,
        defenseDetails: msg.flags.abfalter.defenseDetails,
        status
    });
    game.messages.get(msg._id).update({
        content,
        "flags.abfalter.rollData": rollData,
        "flags.abfalter.num": num
    });

    const updatedMsg = game.messages.get(msg._id);
    if (!needsContinuation) {
        if (isGM) {
            await finalizeDefenseAgainstAttackMessage({
                defenseMessageId: updatedMsg.id
            });
        }
    }
}

export async function finalizeDefenseAgainstAttackMessage({ defenseMessageId }) {
    const defenseMessage = game.messages.get(defenseMessageId);
    if (!defenseMessage) return;

    const defenseWorkflow = defenseMessage.flags.abfalter.defenseWorkflow;
    const defenseDetails = defenseMessage.flags.abfalter.defenseDetails;
    const rollData = defenseMessage.flags.abfalter.rollData ?? [];

    if (!defenseWorkflow || !defenseDetails) return;

    const parentAttackMessage = game.messages.get(defenseWorkflow.parentAttackMessageId);
    if (!parentAttackMessage) return;

    const workflow = foundry.utils.deepClone(
        parentAttackMessage.flags.abfalter.workflow ?? {}
    );

    const tokenId = defenseWorkflow.defTokenId;
    if (!workflow.targetStates) workflow.targetStates = {};
    if (!workflow.targetStates[tokenId]) workflow.targetStates[tokenId] = {};

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

    await parentAttackMessage.update({
        "flags.abfalter.workflow": workflow
    });

    const selectedDefenderIds = workflow.selectedDefenderIds ?? [];
    const allDone = selectedDefenderIds.every(id =>
        workflow.targetStates?.[id]?.status === "completed"
    );

    if (allDone) {
        await createCombatResolutionMessage(parentAttackMessage);
    }
}

async function createCombatResolutionMessage(msg) {
    const attackDetails = msg.flags.abfalter.attackDetails;
    const workflow = msg.flags.abfalter.workflow;
    const defenderIds = workflow.selectedDefenderIds;
    const attackerToken = canvas.tokens?.get(workflow.attackerTokenId);

    const resolveData = {
        attackerValues: {
            finalValue: 0,
            formula: attackDetails.formula,
            dmg: attackDetails.dmg,
            dmgType: attackDetails.dmgType,
            atPen: attackDetails.atPen,
            attackSubLabel: attackDetails.wepName,
            attackName: attackDetails.name
        },
        defenderIds,
        defenderValues: Object.fromEntries(
            defenderIds.map(id => {
                const targetState = workflow.targetStates?.[id] ?? {};
                const token = canvas.tokens?.get(id);
                return [id, {
                    portrait: token.document.texture.src,
                    name: token.name,
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
            defenderData.dmgInfo = `Defended! Counterattack Bonus: +${counter}`;
        } else {
            const damagePercent = calculateDamagePercentage(diff, effectiveArmor);
            const percentValue = Math.round((damagePercent * 100) * 100) / 100;
            const actualDamage = damagePercent > 0 ? Math.round(attackDamage * damagePercent) : 0;
            defenderData.ccBonus = 0;
            defenderData.dmgPercentage = percentValue;
            defenderData.totalDmg = -actualDamage;
            defenderData.dmgColor = defenderData.totalDmg < 0 ? "fumbleRoll" : "openRoll";
            defenderData.dmgInfo = damagePercent > 0
                ? `Hit! Lose 1 action & take damage`
                : `Grazed! No damage dealt but lose 1 action`;
        }
        defenderData.effectiveArmor = effectiveArmor;
    }

    let basicInfo = {
        portrait: attackerToken.document.texture.src,
        name: attackerToken.actor.name,
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

    let rollMode = game.settings.get("core", "rollMode");
    ChatMessage.applyRollMode(chatData, rollMode);
    await ChatMessage.create(chatData);
}

function calculateDamagePercentage(diff, armorCount) {
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

    // Find this radio's defender row
    const defenderContainer = radio.closest(".resolveDefenderContainer");
    if (!defenderContainer) return;

    const baseDamage = Number(defenderContainer.dataset.baseDamage ?? 0);
    const totalDamageEl = defenderContainer.querySelector(".resolveDefenderTotalDamageValue");
    if (!totalDamageEl) return;

    const newDamage = Math.floor(baseDamage * multiplier);
    totalDamageEl.textContent = newDamage;
}

export async function resolveApplyDamageToActors(msg, html, ev) {
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

        const hpPath = "system.lp.value"; // change if needed
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
}

/**
 * All Defensive Rolls from the Actor Sheet
 * @param {Actor} actor - actor document
 * @param {String} defLabel - string identifier
 * @param {Number} baseValue - The passed based value of the defensive
 * @param {String} weaponId - It's either null or has the weapon id
 */
export async function defensiveRollDialogue({actor, defLabel, baseValue, weaponId}) {
    const template = "systems/abfalter/templates/dialogues/prompt/defense.hbs";
    let confirmed = false;
    let finalValue = 0;
    let finalFormula = "";
    let fatigueUsed = 0;
    let defenseType = "";
    let defBaseValue = Number(baseValue); 
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
    const updateCombatBaseValue = (html, dialog) => {
        switch (defenseType) {
            case "weapon": {
                const profile = selectedProfiles?.[selectedProfileIndex];
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
                defBaseValue = Number(baseValue); 
                updateFinalValue(html, dialog);
                break;
        }
    };
    const getWeaponProfiles = (weapon) => {
        if (!weapon) return [];
        const allAttacks = Object.values(weapon.system.attacks ?? {});
        return allAttacks.filter(profile => {
            const pType = profile.profileType?.trim().toLowerCase();
            return pType === "both" || pType === "defensive";
        });
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

                const lastDefUsed = weapon.system.info.lastDefUsed;
                selectedProfileIndex = lastDefUsed >= 0 && lastDefUsed < selectedProfiles.length ? lastDefUsed : 0;

                selectedProfiles.forEach((profile, index) => {
                    appendOption(profileDropdown, {
                        value: index,
                        label: profile.name,
                        selected: index === lastDefUsed
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
                chosenIndex = selectedProfileIndex;
                const weapon = actor.items.get(weaponId);
                await weapon.update({
                    "system.info.lastDefUsed": selectedProfileIndex
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
            defenseRoll({actor, defenseDetails});
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
        const profile = profiles[defenseDetails.profileIndex];
        isPredetermined = profile.properties.predetermined.bool ?? false;
        actionName = weapon.name;
        defenseName = defenseDetails.defLabel == "weaponBlock" ? `${profile.name} ${game.i18n.localize("abfalter.block")}` : `${profile.name} ${game.i18n.localize("abfalter.dodge")}`;
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
        rollMode = CONST.DICE_ROLL_MODES.PUBLIC;
        break;
    case "private":
        rollMode = CONST.DICE_ROLL_MODES.PRIVATE;
        break;
    default:
        rollMode = game.settings.get("core", "rollMode");
    }
    ChatMessage.applyRollMode(chatData, rollMode);
    await ChatMessage.create(chatData);
}

export async function defensiveOpenRollFunction(msg) {
    const template = "systems/abfalter/templates/dialogues/diceRolls/defensiveRoll.hbs"
    let actor = game.actors.get(msg.speaker.actor);
    let num = msg.flags.abfalter.num;
    let oldData = msg.flags.abfalter.rollData[msg.flags.abfalter.num];
    let openRollSetting = game.settings.get('abfalter', abfalterSettingsKeys.Corrected_OpenRoll);
    let rollResult;

    if (!openRollSetting) {
        //Lumis way of open rolls
        rollResult = await lumiOpenRoll(actor, oldData.total, oldData.openRange, oldData.roll, num+1);
    } else {
        //Core rule for open rolls
        rollResult = await coreOpenRoll(actor, oldData.total, oldData.openRange, num+1)
    }
    let formula = `(${rollResult.rolledDice}) + ${oldData.total}(${game.i18n.localize("abfalter.prevRoll")})`;

    msg.flags.abfalter.rollData[num].doubles = null;
    msg.flags.abfalter.rollData[num].openRange = null;
    msg.flags.abfalter.rollData[num].explode = false;
    num = num + 1;
    msg.flags.abfalter.rollData[num] = {
        roll: rollResult.rolledDice,
        total: rollResult._total,
        doubles: oldData.doubles,
        openRange: rollResult.openRange,
        label: `${game.i18n.localize("abfalter.openRoll")} #${num}`,
        explode: rollResult.explode,
        formula: formula,
        color: rollResult.color
    };

    const rollData = msg.flags.abfalter.rollData;

    const content = await foundry.applications.handlebars.renderTemplate(template, { 
        basicInfo: msg.flags.abfalter.basicInfo,
        rollData: rollData,
        actor,
        defenseDetails: msg.flags.abfalter.defenseDetails
    });

    game.messages.get(msg._id).update({
        content,
        "flags.abfalter.rollData": rollData,
        "flags.abfalter.num": num
    });
}

export async function defensiveFumbleRollFunction(msg) {
    const template = "systems/abfalter/templates/dialogues/diceRolls/defensiveRoll.hbs"

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
        formula = `${oldData.total}(${game.i18n.localize("abfalter.prevRoll")}) + ${rollResult.rolledDice}(${game.i18n.localize("abfalter.roll")})`;
    } else {
        formula = `${oldData.total}(${game.i18n.localize("abfalter.prevRoll")}) + ${rollResult.rolledDice}(${game.i18n.localize("abfalter.prevRoll")}) - ${oldData.fumbleLevel}(${game.i18n.localize("abfalter.fumbleLevel")})`;
    };

    rollResult.color = "fumbleRoll";
    msg.flags.abfalter.rollData[num].doubles = null;
    msg.flags.abfalter.rollData[num].openRange = null;
    msg.flags.abfalter.rollData[num].explode = false;
    msg.flags.abfalter.rollData[num].fumble = false;
    num = num + 1;
    msg.flags.abfalter.rollData[num] = {
        roll: rollResult.rolledDice, total: rollResult._total, doubles: null, openRange: null, label: `${game.i18n.localize("abfalter.fumbleResult")}`,
        explode: false, formula: formula, color: rollResult.color, showSeverity: true, fumble: false, fumbleS: fumbleS
    };
    const rollData = msg.flags.abfalter.rollData;

    const content = await foundry.applications.handlebars.renderTemplate(template, { 
        basicInfo: msg.flags.abfalter.basicInfo,
        rollData: rollData,
        actor,
        defenseDetails: msg.flags.abfalter.defenseDetails
    });
    game.messages.get(msg._id).update({
        content,
        "flags.abfalter.rollData": rollData,
        "flags.abfalter.num": num
    });
}

/**
 * All Characteristic Rolls 1d10
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

    if (event.shiftKey) {
        console.log('shift key held, skipping attack dialog.');
        let theFormula = `${baseValue}(${game.i18n.localize("abfalter.value")}) + 0(${game.i18n.localize("abfalter.fatigue")}) + 0(${game.i18n.localize("abfalter.mod")})`;
        let theValue = baseValue;
        let rollDetails = {
            chaLabel,
            finalValue: theValue,
            formula: theFormula
        }
        characteristicRoll({actor, rollDetails});
        return;
    }

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
            characteristicRoll({actor, rollDetails});
        }
    });
    dialog.render({ force: true });
}

async function characteristicRoll({actor, rollDetails}) {
    const template = "systems/abfalter/templates/dialogues/diceRolls/characteristicRoll.hbs"
    let rollResult;
    let finalFormula = "";

    rollResult = await Roll.create("1d10 + @bonus", { bonus: rollDetails.finalValue }).evaluate();
    rollResult.rolledDice = rollResult.dice[0].results[0].result;
    rollResult.color = "";
    rollResult.fumble = false;
    rollResult.explode = false;

    if (rollResult.rolledDice == 1) {
        rollResult.color = "fumbleRoll";
        finalFormula = `(${rollResult.rolledDice}) - 3(${game.i18n.localize("abfalter.fumble")}) + ` + rollDetails.formula;
        rollResult.newTotal = rollResult.total - 3;
        rollResult.fumble = true;
    } else if (rollResult.rolledDice == 10) {
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
        rollMode = CONST.DICE_ROLL_MODES.PUBLIC;
        break;
    case "private":
        rollMode = CONST.DICE_ROLL_MODES.PRIVATE;
        break;
    default:
        rollMode = game.settings.get("core", "rollMode");
    }
    ChatMessage.applyRollMode(chatData, rollMode);
    ChatMessage.create(chatData);
}


/**
 * All Resistance Rolls
 * @param {Actor} actor - actor document
 * @param {String} chaLabel - Already localized Name of Action
 * @param {Number} value - The passed based value of the defensive
 * @returns 
 */
export async function resistanceDialogue({actor, chaLabel, value}) {
    const template = "systems/abfalter/templates/dialogues/prompt/basicModifiers.hbs";
    let baseValue = Number(value); 
    let confirmed = false;
    let finalValue = 0;
    let finalFormula = "";
    let fatigueUsed = 0;

    if (event.shiftKey) {
        console.log('shift key held, skipping resistance dialog.');
        let theFormula = `${baseValue}(${game.i18n.localize("abfalter.value")}) + 0(${game.i18n.localize("abfalter.mod")})`;
        let theValue = baseValue;
        let rollDetails = {
            chaLabel,
            finalValue: theValue,
            formula: theFormula
        }
        characteristicRoll({actor, rollDetails});
        return;
    }

    const htmlContent = await foundry.applications.handlebars.renderTemplate(template);

    // Helpers
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
                chaLabel,
                finalValue,
                formula: finalFormula
            }
            resistanceRoll({actor, rollDetails});
        }
    });
    dialog.render({ force: true });
}

export async function resistanceRoll({actor, rollDetails}) {
    const template = "systems/abfalter/templates/dialogues/diceRolls/resistanceRoll.hbs"
    let rollResult;
    let finalFormula = "";

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
    } else if (rollResult.rolledDice == 100) {
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

    const content = await foundry.applications.handlebars.renderTemplate(template, { rollResult: rollResult, label: rollDetails.chaLabel, formula: finalFormula, basicInfo: basicInfo });
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
        rollMode = CONST.DICE_ROLL_MODES.PUBLIC;
        break;
    case "private":
        rollMode = CONST.DICE_ROLL_MODES.PRIVATE;
        break;
    default:
        rollMode = game.settings.get("core", "rollMode");
    }
    ChatMessage.applyRollMode(chatData, rollMode);
    ChatMessage.create(chatData);
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
                    default:
                        console.log("No Roll Function Implemented for this type");
                        break;
                }
            }
        }
    }).render(true);
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

    let fatigueFinal = Math.floor(fatigueMod * actor.system.settings.fatigueValue);
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

    const speakerMode = actor.system.rollRange.speaker; // "default" | "public" | "private"
    let rollMode;
    switch (speakerMode) {
    case "public":
        rollMode = CONST.DICE_ROLL_MODES.PUBLIC;
        break;
    case "private":
        rollMode = CONST.DICE_ROLL_MODES.PRIVATE;
        break;
    default:
        rollMode = game.settings.get("core", "rollMode");
    }
    ChatMessage.applyRollMode(chatData, rollMode);
    //ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
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
 * @param {Actor} actor - the actor rolling the resistance
 * @param {Number} finalValue - the actors final value of the resistance
 * @param {string} label - the label for the roll
 */













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

    const speakerMode = actor.system.rollRange.speaker; // "default" | "public" | "private"
    let rollMode;
    switch (speakerMode) {
    case "public":
        rollMode = CONST.DICE_ROLL_MODES.PUBLIC;
        break;
    case "private":
        rollMode = CONST.DICE_ROLL_MODES.PRIVATE;
        break;
    default:
        rollMode = game.settings.get("core", "rollMode");
    }
    ChatMessage.applyRollMode(chatData, rollMode);
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
    
    const speakerMode = actor.system.rollRange.speaker; // "default" | "public" | "private"
    let rollMode;
    switch (speakerMode) {
    case "public":
        rollMode = CONST.DICE_ROLL_MODES.PUBLIC;
        break;
    case "private":
        rollMode = CONST.DICE_ROLL_MODES.PRIVATE;
        break;
    default:
        rollMode = game.settings.get("core", "rollMode");
    }
    ChatMessage.applyRollMode(chatData, rollMode);
    ChatMessage.create(chatData);
}






/** -------- OLD --------
 * Dialog V1 jQuery usage
 * To Delete if new functions work as intended
 */

const diceDialog = class extends Dialog {
    activateListeners(html) {
        super.activateListeners(html);
        html.find('.collapsable').click(ev => {
            const li = $(ev.currentTarget).next();
            li.toggle("fast");
        });
    }
}

export async function openWeaponProfileDialogueOld(actor, label, wepId, wepType, actionType, profileType, indexOverrideValue) {
    const weapon = actor.items.get(wepId);
    const allAttacks = Object.values(weapon.system.attacks ?? {}); // Turns Attacks into the usual array format for index

    // Break if no Profiles are found
    if (allAttacks.length === 0) {
        ui.notifications.warn(game.i18n.localize("abfalter.noProfilesFound"));
        return;
    }

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
                    dmg: weapon.system.derived.meleeDmg,
                    dmgType: weapon.system.primDmgT,
                    atPen: weapon.system.derived.meleeAtPen,
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

    if (wepType === "ranged" && weapon.system.ranged.infiniteAmmo === false && weapon.system.ranged.magSize <= 0) { //To Change
        ui.notifications.warn(game.i18n.localize("abfalter.noAmmoPrompt"));
    }

    // List of Profiles
    let attacks = allAttacks.filter(atk => {
        const pType = atk.profileType?.trim().toLowerCase();
        const filterType = profileType?.trim().toLowerCase();
        const match = pType === "both" || pType === filterType;
        return match;
    });

    // Get the last profile used, if non reset to the top one.
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


    let finalValue = 0, finalFormula = "", fatigueUsed = 0, ammoUsed = 0, ammoIdUsed = "", RangedAmmoUsed = 0, finalDmgNum = 0, finalAtNum = 0;
    let wepValue = 0; // Current selected attack's base value

    // Armor values for defensive rolls
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
                finalValue = wepValue + (fatigueValue * actor.system.settings.fatigueValue) + modifierValue + selectedPenalty + selectedModifier;
                finalFormula = `${wepValue}(${game.i18n.localize("abfalter.value")}) + ${fatigueValue * actor.system.settings.fatigueValue}(${game.i18n.localize("abfalter.fatigue")}) + ${modifierValue}(${game.i18n.localize("abfalter.mod")}) + ${selectedPenalty}(${game.i18n.localize("abfalter.aim")}) + ${selectedModifier}(${game.i18n.localize("abfalter.action")})`;
                break;
            case 'block':
            case 'dodge':
                finalValue = wepValue + (fatigueValue * actor.system.settings.fatigueValue) + modifierValue + multDefPenalty;
                finalFormula = `${wepValue}(${game.i18n.localize("abfalter.value")}) + ${fatigueValue * actor.system.settings.fatigueValue}(${game.i18n.localize("abfalter.fatigue")}) + ${modifierValue}(${game.i18n.localize("abfalter.mod")}) + ${multDefPenalty}(${game.i18n.localize("abfalter.multipleDef")})`;
                break;
            default:
                console.log("(Update Final Value)Error: No action type found.");
                ui.notifications.error("(Update Final Value)Error: No action type found.");
                return;
        }

        $html.closest('.dialog').find('.dialog-button:first').text(`${game.i18n.localize("abfalter.dialogs.roll")}: ${finalValue}`);
    }

    new diceDialog({
        title: `${weapon.name} ${game.i18n.localize('abfalter.' + actionType)}`,
        content: htmlContent,
        height: "auto",

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
            const $ammoRow = $html.find('#ammoRow');
            const $defNumberDropdown = $html.find('#defNumberDropdown');
            const $armorDropdown = $html.find('#armorDropdown');

            const $noteRow = $html.find('#noteRow');


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
            let vorpalLocation = attacks[usedIndex].properties.vorpal.bool ? attacks[usedIndex].vorpalLocation : weapon.system.info.vorpalLocation;
            let vorpalModifier = attacks[usedIndex].properties.vorpal.bool ? attacks[usedIndex].vorpalMod : weapon.system.info.vorpalMod;
            let isPrecise = weapon.system.properties.precision.bool && !attacks[usedIndex].properties.precision.bool;
            let isVorpal = weapon.system.properties.vorpal.bool && !attacks[usedIndex].ignoreVorpal;
            let useAmmunition = (wepType == "ranged" || (wepType == "hybrid" && attacks[usedIndex].atkType == "ranged")) ? true : false;
            let currentDmgTypes = [];
            let attackInfo = ""; 
            let rangeInfo = "";
            let promptNote = "";

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

                currentDmgTypes.forEach((type, i) => {
                    const labelPrefix =
                        i === 0
                            ? game.i18n.localize('abfalter.primaryShort')
                            : game.i18n.localize('abfalter.secondaryShort');

                    const labelText = type
                        ? `${labelPrefix}${type}`
                        : game.i18n.localize('abfalter.noDamageType');

                    $atkDmgTypeDropdown.append(
                        `<option value="${type}" ${i === 0 ? "selected" : ""}>
                            ${labelText}
                        </option>`
                    );
                });
            };
            populateAtkTypeDropdown();

            // Active Action Penalty select
            $modifierSelect.empty();
            for (let i = 0; i < 10; i++) {
                const value = -25 * i;
                $modifierSelect.append(`<option value="${value}">${game.i18n.localize(`abfalter.activeAction${i + 1}`)}</option>`);
            }
            $modifierSelect.val(0);

            // Fatigue Dropdown
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
                if (isVorpal) {
                    $directedAtkDropdown.val(
                        vorpalLocation === "anywhere" ? directedAtk[0].tag : vorpalLocation
                    );
                }
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
                isPrecise = weapon.system.properties.precision.bool && !attacks[usedIndex].properties.precision.bool;
                isVorpal = weapon.system.properties.vorpal.bool && !attacks[usedIndex].ignoreVorpal;
                vorpalLocation = attacks[usedIndex].properties.vorpal.bool ? attacks[usedIndex].vorpalLocation : weapon.system.info.vorpalLocation;
                vorpalModifier = attacks[usedIndex].properties.vorpal.bool ? attacks[usedIndex].vorpalMod : weapon.system.info.vorpalMod;
                populateDirectedAtkDropdown();
                // Throwable
                if (weapon.system.properties.throwable.bool) {
                    if (attacks[usedIndex].properties.throwable.bool) { //override true
                        ammoUsed = attacks[usedIndex].quantityConsumed ? 0 : attacks[usedIndex].consumedValue;
                    } else {
                        ammoUsed = weapon.system.melee.returning ? 0 : weapon.system.melee.throwConsumption;
                    }
                    if (attacks[usedIndex].ignoreThrown) ammoUsed = 0;
                }
                // Ammunition
                if (weapon.system.properties.ammunition.bool) {
                    if (attacks[usedIndex].properties.ammunition.bool) { //override true
                        RangedAmmoUsed = attacks[usedIndex].rangedAmmoConsumed ? 0 : attacks[usedIndex].rangedAmmoConsumedValue;
                    } else {
                        RangedAmmoUsed = weapon.system.ranged.infiniteAmmo ? 0 : weapon.system.ranged.ammoConsumption;
                    }
                    if (attacks[usedIndex].ignoreAmmo) RangedAmmoUsed = 0;
                }
                useAmmunition = (wepType == "ranged" || (wepType == "hybrid" && attacks[usedIndex].atkType == "ranged")) ? true : false;

                $html.find('#attackPower').text(selectedAttack.finalAttack);
                $html.find('#defensePower').text(selectedAttack.finalBlock);
                $html.find('#dodgePower').text(selectedAttack.finalDodge);
                $html.find('#damageNum').text(selectedAttack.finalDamage);
                $html.find('#atPenNum').text(selectedAttack.finalAtPen);

                attackInfo = `${game.i18n.localize('abfalter.baseAtkShort')}: ${selectedAttack.finalAttack}
                     · ${game.i18n.localize('abfalter.baseDmgShort')}: ${selectedAttack.finalDamage}
                     · ${game.i18n.localize('abfalter.basePenShort')}: ${selectedAttack.finalAtPen}
                `;
                $html.find('#newAtkInfo').text(attackInfo);
                finalDmgNum = selectedAttack.finalDamage;
                finalAtNum = selectedAttack.finalAtPen;

                if (useAmmunition) {
                    updateAmmoValues();
                    $ammoRow.show();
                } else {
                    updateMeleeDmgTypes();
                    $ammoRow.hide();
                }

                let reachLabel = game.i18n.localize(`abfalter.` + weapon.system.distance.reachUnitType);
                let rangeLabel = game.i18n.localize(`abfalter.` + weapon.system.distance.rangeUnitType);
                let usesRange = (weapon.system.properties.throwable.bool && !attacks[usedIndex].ignoreThrown) || useAmmunition;

                if (usesRange) {
                    rangeInfo = `${game.i18n.localize('abfalter.reach')}: ${weapon.system.distance.reach} ${reachLabel}
                     · ${game.i18n.localize('abfalter.range')}: ${weapon.system.distance.range} ${rangeLabel}
                    `;
                } else {
                    rangeInfo = `${game.i18n.localize('abfalter.reach')}: ${weapon.system.distance.reach} ${reachLabel}`;
                }
                $html.find('#newRangeInfo').text(rangeInfo);

                if (attacks[usedIndex].properties.note.bool) {
                    promptNote = attacks[usedIndex].attackNote;
                    $noteRow.show();
                } else {
                    promptNote = "";
                    $noteRow.hide();
                }
                $html.find('#noteInfo').text(promptNote);
                

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

                populateAtkTypeDropdown();
                updateFinalValue($html);
            });

            const updateMeleeDmgTypes = () => {
                currentDmgTypes.length = 0;
                const attackForcesDamageType = attacks[usedIndex].properties.damageType.bool === true;
                if (attackForcesDamageType) {
                    const dmgType = attacks[usedIndex].damageType;
                    currentDmgTypes.push(dmgType);
                    return;
                }

                const prim = weapon?.system?.primDmgT;
                const sec  = weapon?.system?.secDmgT;
                // If neither exists / both none, treat as no damage type
                if ((!prim || String(prim).toLowerCase() === "none" || prim === "NONE") && (!sec || String(sec).toLowerCase() === "none" || sec === "NONE")) {
                    currentDmgTypes.push("");
                    return;
                }

                let availableTypes = [];
                if (prim === "ANY" || sec === "ANY") {
                    const allTypes = Object.keys(damageTypes).filter(t => t !== "NONE");

                    if (prim && prim !== "ANY" && prim !== "NONE") {
                        availableTypes.push(prim);
                        allTypes
                            .filter(t => t !== prim)
                            .forEach(t => availableTypes.push(t));
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
            }
            const updateRangedDmgTypes = (dmgType) => {
                currentDmgTypes.length = 0;
                const attackForcesDamageType = attacks[usedIndex].properties.damageType.bool === true;
                const chosenDmgType = attackForcesDamageType ? attacks[usedIndex].damageType : dmgType;

                if (!chosenDmgType || chosenDmgType.toLowerCase() === "none") {
                    currentDmgTypes.push("");
                    return;
                }

                let availableTypes;
                if (chosenDmgType === "ANY") {
                    availableTypes = Object.keys(damageTypes).filter(type => type !== "NONE");
                } else {
                    availableTypes = [chosenDmgType];
                }

                availableTypes.forEach(type => {
                    currentDmgTypes.push(type);
                });
            }

            const updateAmmoValues = () => {
                let ammoDamage = 0;
                let ammoDmgType = "";
                let ammoAtPen = 0;
                if (ammoIdUsed === "special") {
                    ammoDamage = weapon.system.ranged.specialDmg;
                    ammoDmgType = weapon.system.ranged.specialDmgType;
                    ammoAtPen = weapon.system.ranged.specialAtPen;
                } else {
                    const ammoItem = weapon.parent.items.get(ammoIdUsed);
                    ammoDamage = ammoItem?.system.damage || 0;
                    ammoDmgType = ammoItem?.system.dmgType || "";
                    ammoAtPen = ammoItem?.system.atPen || 0;
                }

                updateRangedDmgTypes(ammoDmgType);
                populateAtkTypeDropdown();

                let newRangedDmg = ammoDamage + weapon.system.derived.rangedDmgPreAmmo + attacks[usedIndex].damage;
                let newRangedAT = ammoAtPen + weapon.system.ranged.ammoAtPenMod + attacks[usedIndex].atPen;

                const selectedAttack = attacks[$attackSelect.val()];
                $html.find('#attackPower').text(selectedAttack.finalAttack);
                $html.find('#damageNum').text(newRangedDmg);
                $html.find('#atPenNum').text(newRangedAT);

                attackInfo = `${game.i18n.localize('abfalter.baseAtkShort')}: ${selectedAttack.finalAttack}
                     · ${game.i18n.localize('abfalter.baseDmgShort')}: ${newRangedDmg}
                     · ${game.i18n.localize('abfalter.basePenShort')}: ${newRangedAT}
                `

                finalDmgNum = newRangedDmg;
                finalAtNum = newRangedAT;
                
                $html.find('#newAtkInfo').text(attackInfo);
            }

            // If weapon is ranged, populate and handle ammo dropdown changes
            if (wepType === "ranged" || wepType === "hybrid") {
                $ammoDropdown.empty();
                weapon.system.ranged.ammoIds.forEach(ammo => {
                    $ammoDropdown.append(`<option value="${ammo.id}">${ammo.name}</option>`);
                });
                ammoIdUsed = weapon.system.ranged.selectedAmmo;
                $ammoDropdown.val(weapon.system.ranged.selectedAmmo);

                $ammoDropdown.on('change', function () {
                    ammoIdUsed = $(this).val();
                    updateAmmoValues();
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

                if (typeof indexOverrideValue === Number && indexOverrideValue >= 0) {
                } else {
                    switch (profileType) {
                        case 'offensive':
                            weapon.update({ 'system.info.lastWepUsed': usedIndex });
                            break;
                        case 'defensive':
                            weapon.update({ 'system.info.lastDefUsed': usedIndex });
                            break;
                        default:
                            console.log("(Set Last Index)Error: No action type found.");
                            ui.notifications.error("(Set Last Index)Error: No action type found.");
                            return;
                    }
                }

                // Subtract Quantity for Throwable
                if ((wepType === "melee" && actionType === "attack") || (wepType === "hybrid" && attacks[usedIndex].atkType === "melee" && actionType === "attack")) {
                    weapon.update({ 'system.quantity': Math.floor(weapon.system.quantity - ammoUsed) });
                }
                
                // Subtract Quantity for Ammunition
                if ((wepType === "ranged" && actionType === "attack") || (wepType === "hybrid" && attacks[usedIndex].atkType === "ranged" && actionType === "attack")) {
                    const ammoItem = actor.items.get(ammoIdUsed);
                    if (ammoItem) {
                        ammoItem.update({ 'system.quantity': Math.floor(ammoItem.system.quantity - RangedAmmoUsed) });

                        if (weapon.system.ranged.magSize - RangedAmmoUsed <= 0) {
                            weapon.update({ 'system.ranged.magSize': 0 });
                            weapon.update({ 'system.ranged.isLoaded': false });
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
                        typesToShow = armorType.filter(t => t.tag !== 'showAll');
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
                let isPredetermined = attacks[usedIndex].properties.predetermined.bool;
                let hasNote = attacks[usedIndex].properties.note.bool;
                let note = hasNote ? attacks[usedIndex].chatNote : ""

                const attackDetails = {
                    label: game.i18n.localize('abfalter.' + actionType),
                    name: attacks[usedIndex].name,
                    base: weapon.system.derived.baseAtk,
                    value: finalValue,
                    formula: finalFormula,
                    dmg: finalDmgNum,
                    dmgType: $html.find('#atkDmgTypeDropdown').val(),
                    atPen: finalAtNum,
                    target: $html.find('#directedAtkDropdown').val(),
                    ammoName: ammoName,
                    chosenAt: armorContent,
                    wepType: wepType,
                    profileType: profileType,
                    actionType: actionType,
                    isPredetermined: isPredetermined,
                    hasNote: hasNote,
                    note: note
                };
                weaponRoll(actor, weapon, attackDetails);
                console.log('Attack Handle Finished');
            }
        }
    }).render(true);
}
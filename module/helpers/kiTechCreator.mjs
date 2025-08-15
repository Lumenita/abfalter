import { templates } from "../utilities/templates.js"
import { kiCreatorDataModel } from "../abfalter.js";
import { kiTechAbilitiesData } from "./kiTechAbilitiesData.js";

/**
 * This opens the Ki Technique Creator dialog and allows the user to create a new ki technique.
 * It is a multi-step process, where from start to finish the user can select options and create a new ki technique item for an actor.
 * It is also able to create a random ki technique.
 */

export function openKiCreatorTitle() {
    new foundry.applications.api.DialogV2({
        classes: ["baseAbfalter", "abfalterDialog", "kiCreatorDialog"],
        window: { title: game.i18n.localize("abfalter.kiAbilityData.kiCreatorMenu") },
        buttons: [
            {
                label: game.i18n.localize("abfalter.kiAbilityData.createKiTech"),
                action: "createKiTech",
                callback: () => {
                    console.log("Launching Ki Tech Creator");
                    new kiTechCreator().render(true);
                }
            },
            {
                label: game.i18n.localize("abfalter.kiAbilityData.randomKiTech"),
                action: "randomKiTech",
                callback: () => {
                    console.log("Launching Random Ki Tech Creator...");
                    ui.notifications.warn("This is currently not implemented. A future update will add this feature.");
                }
            },
            {
                label: game.i18n.localize("abfalter.dialogs.close"),
                action: "close",
                callback: () => {
                    console.log("Cancelled Ki Tech Creator");
                }
            }
        ],
    }).render({ force: true });
}

export default class kiTechCreator extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {
    static DEFAULT_OPTIONS = {
        tag: "form",
        classes: ['baseAbfalter', 'kiTechCreator'],
        form: {
            submitOnChange: true,
            closeOnSubmit: false
        },
        window: {
            resizable: false,
        },
        position: {
            width: 475,
            height: "auto"
        },
        actions: {
            toggleCombValue: this.#toggleCombValue,
            addKiAbility: this.#addKiAbility,
            kiAbilityChange: this.#kiAbilityChange,
            maintAbilityChange: this.#maintAbilityChange,
            toggleOptionalChar: this.#toggleOptionalChar,
            toggleAbilityExpand: this.#toggleAbilityExpand,
            toggleAbilityRemove: this.#toggleAbilityRemove,
            combKiChange: this.#combKiChange,
            continue: this.#continue,
            close: this.#close
        }
    }

    constructor() {
        super();
        this.document = new kiCreatorDataModel(); // persistent state
    }

    static PARTS = {
        main: { scrollable: [""], template: templates.kiTechCreator },
        footer: { scrollable: [""], template: templates.kiTechCreatorFooter }
    }

    async _prepareContext(options) {
        const context = await super._prepareContext(options);
        context.system = this.document;

        //dropdown options
        context.system.kiTechLevelList = { 1: "1", 2: "2", 3: "3" };
        context.system.maintList = {
            "none": game.i18n.localize("abfalter.none"),
            "maintenance": game.i18n.localize("abfalter.maintenance"),
        };
        if (context.system.level >= 2) {
            context.system.maintList["minorSus"] = game.i18n.localize("abfalter.minorSus");
            context.system.maintList["majorSus"] = game.i18n.localize("abfalter.majorSus");
        }

        context.system.showPreview = Object.keys(context.system.abilities).length > 0;
        
        context.system.abilityMk = Object.values(context.system.abilities).reduce((sum, ability) => {
            return sum + (ability.costsFinal.mk || 0);
        }, 0);
        context.system.totalMk = Math.floor(context.system.maintMk + context.system.combAddedMk + context.system.abilityMk);
        context.system.disadvNumber = 0;

        const newFinalValues = {};
        const actionArray = [];
        const frequencyArray = [];
        Object.values(context.system.abilities).forEach(ability => {
            if (ability.category === "disadvantages") {
                context.system.disadvNumber += 1;
                return;
            };
            if (!ability.chosenChars) return;
            if (ability.actionType) actionArray.push(ability.actionType);
            if (ability.frequency) frequencyArray.push(ability.frequency);

            ability.chosenChars.forEach(char => {
                if (!newFinalValues[char.type]) {
                    newFinalValues[char.type] = {
                        type: char.type,
                        combKi: context.system.isCombinable ? context.system.kiFinalValues?.[char.type]?.combKi || 0 : 0,
                        finalKi: 0,
                        finalMaint: 0,
                        _combAdded: false,
                    };
                }

                newFinalValues[char.type].finalMaint += char.maint || 0;
                newFinalValues[char.type].finalKi += char.kiTotal || 0;
                if (context.system.isCombinable && !newFinalValues[char.type]._combAdded) {
                    newFinalValues[char.type].finalKi += newFinalValues[char.type].combKi; 
                    newFinalValues[char.type]._combAdded = true;                   
                }
            });

            // Compile Warning Messages
            ability.warningKi = ability.placedKi != ability.chosenKi;
            ability.warningMaint = ability.placedMaint != ability.chosenMaint;
        });

        // Determine finalActionType
        if (actionArray.length > 0) {
            const uniqueActions = [...new Set(actionArray)];
            context.system.finalActionType = uniqueActions.length === 1
                ? uniqueActions[0]
                : "variable";
        } else {
            context.system.finalActionType = "";
        }

        // Determine finalFrequency
        if (frequencyArray.length > 0) {
            const uniqueFreq = [...new Set(frequencyArray)];
            context.system.finalFrequency = uniqueFreq.length === 1
                ? uniqueFreq[0]
                : "variable";
        } else {
            context.system.finalFrequency = "";
        }

        // Assign rebuilt object back to the context
        context.system.kiFinalValues = newFinalValues;
        context.system.kiFinalLength = Object.keys(newFinalValues).length;
        context.system.combKiPlaced = Object.values(context.system.kiFinalValues).reduce((sum, c) => sum + (c.combKi || 0), 0);
        context.system.unifiedCost = Object.values(context.system.kiFinalValues).reduce((sum, char) => sum + (char.finalMaint || 0), 0);

        // Compile Warning Messages
        context.system.warning.disadvantage = context.system.disadvNumber > context.system.levelDisadvLimit;
        context.system.warning.mk = context.system.totalMk > context.system.levelMaxMk || context.system.totalMk < context.system.levelMinMk;
        context.system.warning.combinableKi = context.system.isCombinable && context.system.combKiPlaced !== context.system.combAddedKi;

        // Compile things for final technique
        const descriptions = Object.values(context.system.abilities).filter(a => a.description && a.description.trim().length > 0).map(a => a.description.trim());
        context.system.previewDescription = descriptions.join('\n\n');

        return context;
    }

    async _onRender(context, options) {
        await super._onRender(context, options);

        const levelDropdowns = this.element.querySelectorAll(".setLevelDropdown");
        for (const el of levelDropdowns) {
            el.addEventListener("change", (e) => {
                e.preventDefault();
                e.stopImmediatePropagation();

                const field = el.dataset.label;
                const value = el.value;

                if (!field) return;
                const parsedValue = isNaN(Number(value)) ? value : Number(value);

                //if value this.document[field] is 2 or 3, and new value is 1, and maintType is not "none", set maintType to "none", if maintType is "maintenance", leave it as is"
                if (this.document[field] > 1 && parsedValue === 1 && this.document.maintType !== "none" && this.document.maintType !== "maintenance") {
                    this.document.maintType = "maintenance";
                }
                this.document[field] = parsedValue;

                const levelSettings = {
                    1: { minMk: 20, maxMk: 50, disadvLimit: 1 },
                    2: { minMk: 40, maxMk: 100, disadvLimit: 2 },
                    3: { minMk: 60, maxMk: 200, disadvLimit: 3 }
                };
                const combSettings = {
                    1: { addKi: 3, addMk: 10 },
                    2: { addKi: 6, addMk: 20 },
                    3: { addKi: 9, addMk: 30 }
                };

                const settings = combSettings[this.document.level];
                if (value && this.document.isCombinable) {
                    this.document.combAddedKi = settings.addKi;
                    this.document.combAddedMk = settings.addMk;
                } else {
                    this.document.combAddedKi = 0;
                    this.document.combAddedMk = 0;
                }

                const settings2 = levelSettings[value];
                if (settings2) {
                    this.document.levelMinMk = settings2.minMk;
                    this.document.levelMaxMk = settings2.maxMk;
                    this.document.levelDisadvLimit = settings2.disadvLimit;
                }

                switch (this.document.maintType) {
                    case "none":
                        this.document.maintMk = 0;
                        break
                    case "maintenance":
                        this.document.maintMk = Math.floor(value * 10);
                        break
                    case "minorSus":
                        this.document.maintMk = Math.floor(value * 20);
                        break
                    case "majorSus":
                        this.document.maintMk = Math.floor(value * 30);
                        break
                }

                Object.keys(this.document.abilities).forEach(async (abilityId) => {
                    //console.log(`Updating ability ${abilityId} for level change`);
                    this.document.abilities[abilityId].chosenMaint = await getMaintValue(this.document.maintType, this.document.abilities[abilityId].costsFinal);
                    // if placedMaint > chosenMaint, set placedMaint to chosenMaint
                    if (this.document.abilities[abilityId].placedMaint > this.document.abilities[abilityId].chosenMaint) {
                        this.document.abilities[abilityId].placedMaint = 0;
                        for (let i = 0; i < this.document.abilities[abilityId].chosenChars.length; i++) {
                            this.document.abilities[abilityId].chosenChars[i].maint = 0;
                            this.document.abilities[abilityId].chosenChars[i].kiTotal = this.document.abilities[abilityId].chosenChars[i].ki;
                        }
                    }
                });

                // Check if level was lowered and combKiPlaced > combAddedKi
                if (this.document.previousLevel && parsedValue < this.document.previousLevel && this.document.combKiPlaced > this.document.combAddedKi) {
                    //console.log(`Level lowered from ${this.document.previousLevel} to ${parsedValue}. Resetting all combKi values.`);
                    for (const charKey in this.document.kiFinalValues) {
                        if (Object.hasOwn(this.document.kiFinalValues, charKey)) {
                            this.document.kiFinalValues[charKey].combKi = 0;
                        }
                    }
                }
                this.document.previousLevel = parsedValue;

                this.render();
            });
        }
        const maintDropdowns = this.element.querySelectorAll(".setMaintDropdown");
        for (const el of maintDropdowns) {
            el.addEventListener("change", (e) => {
                e.preventDefault();
                e.stopImmediatePropagation();

                const field = el.dataset.label;
                const value = el.value;

                if (!field) return;
                const parsedValue = isNaN(Number(value)) ? value : Number(value);
                this.document[field] = parsedValue;

                switch (this.document.maintType) {
                    case "none":
                        this.document.maintMk = 0;
                        break
                    case "maintenance":
                        this.document.maintMk = Math.floor(this.document.level * 10);
                        break
                    case "minorSus":
                        this.document.maintMk = Math.floor(this.document.level * 20);
                        break
                    case "majorSus":
                        this.document.maintMk = Math.floor(this.document.level * 30);
                        break
                }

                Object.keys(this.document.abilities).forEach(async (abilityId) => {
                    this.document.abilities[abilityId].chosenMaint = await getMaintValue(this.document.maintType, this.document.abilities[abilityId].costsFinal);
                    // if placedMaint > chosenMaint, set placedMaint to chosenMaint
                    if (this.document.abilities[abilityId].placedMaint > this.document.abilities[abilityId].chosenMaint) {
                        this.document.abilities[abilityId].placedMaint = 0;
                        for (let i = 0; i < this.document.abilities[abilityId].chosenChars.length; i++) {
                            this.document.abilities[abilityId].chosenChars[i].maint = 0;
                            this.document.abilities[abilityId].chosenChars[i].kiTotal = this.document.abilities[abilityId].chosenChars[i].ki;
                        }
                    }
                });

                this.render();
            });
        }

        console.log(context);
    }

    static #toggleCombValue(ev) {
        const el = ev.currentTarget;
        const target = ev.target.closest('[data-label][data-ability]');
        if (!target) return;
        const label = target.dataset.label;
        let value = target.dataset.ability;
        value = !(value === 'true');
        this.document[label] = value;

        const combSettings = {
            1: { addKi: 3, addMk: 10 },
            2: { addKi: 6, addMk: 20 },
            3: { addKi: 9, addMk: 30 }
        };

        const settings = combSettings[this.document.level];
        if (value) {
            this.document.combAddedKi = settings.addKi;
            this.document.combAddedMk = settings.addMk;
        } else {
            this.document.combAddedKi = 0;
            this.document.combAddedMk = 0;
        }

        this.render();
    }

    static #kiAbilityChange(ev) {
        const el = ev.currentTarget;
        const target = ev.target.closest('[data-value][data-ability][data-index]');
        if (!target) return;
        const abilityId = target.dataset.ability;
        const index = target.dataset.index;
        let value = Number(target.dataset.value);
        if (ev.shiftKey) value *= 5;
        if (ev.ctrlKey) value *= 50;
        let valueMax = this.document.abilities[abilityId].chosenKi;
        let placed = this.document.abilities[abilityId].placedKi;
        let current = this.document.abilities[abilityId].chosenChars[index].ki;

        let totalKiPlaced = this.document.abilities[abilityId].chosenChars.reduce((sum, c) => sum + c.ki, 0);
        let otherKiPlaced = totalKiPlaced - current;

        const maxForThisChar = Math.max(0, valueMax - otherKiPlaced);
        const desired = Math.min(Math.max(current + value, 0), maxForThisChar);
        const delta = desired - current;
        if (delta === 0) return;

        this.document.abilities[abilityId].chosenChars[index].ki = desired;
        this.document.abilities[abilityId].placedKi = Math.min(valueMax, Math.max(0, placed + delta));
        const maint = this.document.abilities[abilityId].chosenChars[index].maint || 0;
        this.document.abilities[abilityId].chosenChars[index].kiTotal = desired + maint;
        this.render();
    }

    static #maintAbilityChange(ev) {
        const el = ev.currentTarget;
        const target = ev.target.closest('[data-value][data-ability][data-index]');
        if (!target) return;
        const abilityId = target.dataset.ability;
        const index = target.dataset.index;
        let value = Number(target.dataset.value);
        if (ev.shiftKey) value *= 5;
        if (ev.ctrlKey) value *= 50;
        let valueMax = this.document.abilities[abilityId].chosenMaint;
        let placed = this.document.abilities[abilityId].placedMaint;
        let current = this.document.abilities[abilityId].chosenChars[index].maint;

        let totalMaintPlaced = this.document.abilities[abilityId].chosenChars.reduce((sum, c) => sum + c.maint, 0);
        let otherMaintPlaced = totalMaintPlaced - current;
        const maxForThisChar = Math.max(0, valueMax - otherMaintPlaced);
        const desired = Math.min(Math.max(current + value, 0), maxForThisChar);
        const delta = desired - current;
        if (delta === 0) return;

        this.document.abilities[abilityId].chosenChars[index].maint = desired;
        this.document.abilities[abilityId].placedMaint = Math.min(valueMax, Math.max(0, placed + delta));
        const ki = this.document.abilities[abilityId].chosenChars[index].ki || 0;
        this.document.abilities[abilityId].chosenChars[index].kiTotal = desired + ki;
        this.render();
    }

    static async #toggleOptionalChar(ev) {
        const el = ev.currentTarget;
        const target = ev.target.closest('[data-ability][data-value][data-index]');
        if (!target) return;
        const abilityId = target.dataset.ability;
        const index = target.dataset.index;
        let value = target.dataset.value;
        //console.log(`Toggling optional char for ability ${abilityId}, index ${index}, value ${value}`);
        value = !(value === 'true');
        this.document.abilities[abilityId].selectedOptionalChars[index].selected = value;
        const ability = this.document.abilities[abilityId];

        // Recalculate Ki cost and chosenChars
        ability.chosenKi = await getKiValue(ability.tag, ability.costsFinal, ability.selectedOptionalChars);
        const newChosenChars = await updateChosenChars(ability.primaryChar, ability.selectedOptionalChars, ability.chosenChars);
        ability.chosenChars = newChosenChars;

        // Recalculate placed values
        let newPlacedKi = newChosenChars.reduce((sum, c) => sum + c.ki, 0);
        let newPlacedMaint = newChosenChars.reduce((sum, c) => sum + c.maint, 0);

        // If placedKi exceeds new max, reset all ki to 0
        if (newPlacedKi > ability.chosenKi) {
            for (let char of ability.chosenChars) {
                char.ki = 0;
                char.kiTotal = char.maint; // reset kiTotal to match only maintenance
            }
            newPlacedKi = 0;
        }

        ability.placedKi = newPlacedKi;
        ability.placedMaint = newPlacedMaint;

        this.render();
    }

    static #toggleAbilityExpand(ev) {
        const el = ev.currentTarget;
        const target = ev.target.closest('[data-ability][data-value]');
        if (!target) return;
        const abilityId = target.dataset.ability;
        let value = target.dataset.value;
        value = !(value === 'true');
        this.document.abilities[abilityId].expand = value;
        this.render();
    }

    static #toggleAbilityRemove(ev) {
        const el = ev.currentTarget;
        const target = ev.target.closest('[data-ability]');
        if (!target) return;
        const abilityId = target.dataset.ability;
        //console.log(`Removing ability ${abilityId}`);
        let rawName = this.document.abilities[abilityId].ability;
        let key = `abfalter.kiAbilityData.${rawName}`;
        let localizedName = game.i18n.localize(key);
        //console.log(`Localized name for ability ${abilityId}: ${localizedName}`);
        foundry.applications.api.DialogV2.confirm({
            window: { title: game.i18n.localize("abfalter.kiAbilityData.removeAbility") },
            classes: ["baseAbfalter"],
            content: game.i18n.format("abfalter.kiAbilityData.removeAbilityConfirmation", { name: localizedName }),
            buttons: [
                {
                    label: game.i18n.localize("abfalter.yes"),
                    action: "yes",
                    callback: async (event, button, dialog) => {
                        const wasPrimary = this.document.abilities[abilityId]?.tag === "primary";
                        delete this.document.abilities[abilityId];

                        if (wasPrimary) {
                            const abilityKeys = Object.keys(this.document.abilities);
                            const newPrimaryId = abilityKeys.find(
                                id => this.document.abilities[id].tag !== "disadvantage"
                            );

                            if (newPrimaryId) {
                                this.document.abilities[newPrimaryId].tag = "primary";
                                this.document.abilities[newPrimaryId].chosenKi = await getKiValue(this.document.abilities[newPrimaryId].tag, this.document.abilities[newPrimaryId].costsFinal, this.document.abilities[newPrimaryId].selectedOptionalChars);
                            }
                        }

                        this.render();
                    },
                }
            ]
        });
    }

    static async #addKiAbility(ev) {
        ev.preventDefault();
        const kiAbilityData = await addNewKiAbility(this.document.level);
        const id = foundry.utils.randomID();
        const hasPrimary = Object.values(this.document.abilities).some(a => a.tag === "primary");

        kiAbilityData.id = id;
        kiAbilityData.placedMaint = 0;
        kiAbilityData.placedKi = 0;
        kiAbilityData.expand = true;
        if (kiAbilityData.category === "disadvantages") {
            kiAbilityData.tag = "disadvantage";
            kiAbilityData.expand = false;
        } else if (!hasPrimary) {
            kiAbilityData.tag = "primary";
        } else {
            kiAbilityData.tag = "secondary";
        }
        // Warnings
        kiAbilityData.warningKi = false;
        kiAbilityData.warningMaint = false;

        //Build Chosen Characteristics
        kiAbilityData.chosenChars = await buildChosenChars(kiAbilityData.primaryChar, kiAbilityData.selectedOptionalChars);
        //Set Visual Maint Value
        kiAbilityData.chosenMaint = await getMaintValue(this.document.maintType, kiAbilityData.costsFinal);
        //Set Visual Ki Value
        kiAbilityData.chosenKi = await getKiValue(kiAbilityData.tag, kiAbilityData.costsFinal, kiAbilityData.selectedOptionalChars);
        //Build subtitle
        const effects = kiAbilityData.selectedAdditionalEffects ?? {};
        const selectedEffectNames = Object.values(effects).filter(effect => effect?.name).map(effect => effect.name);
        kiAbilityData.subTitle = selectedEffectNames.length > 0 ? [kiAbilityData.selectedTier.ability, ...selectedEffectNames].join(', ') : kiAbilityData.selectedTier.ability;

        this.document.abilities[id] = kiAbilityData;
        this.render();
    }

    static #combKiChange(ev) {
        const el = ev.currentTarget;
        const target = ev.target.closest('[data-value][data-char]');
        if (!target) return;
        const char = target.dataset.char;
        let value = Number(target.dataset.value);
        if (ev.shiftKey) value *= 3;
        if (ev.ctrlKey) value *= 9;

        const valueMax = this.document.combAddedKi;
        const current = this.document.kiFinalValues[char]?.combKi || 0;
        const totalCombKi  = Object.values(this.document.kiFinalValues).reduce((sum, c) => sum + (c.combKi || 0), 0);
        const otherKi = totalCombKi - current;
        const remaining = valueMax - otherKi;
        const newValue = Math.max(0, Math.min(current + value, remaining));

        this.document.kiFinalValues[char].combKi = newValue;
        this.render();
    }

    static async #continue(ev) {
        ev.preventDefault();
        const hasWarnings = Object.values(this.document.abilities).some(a => a.warningKi || a.warningMaint);
        let warnings = false;
        let bypassWarnings = false;
        if (hasWarnings || this.document.warning.mk || this.document.warning.disadvantage || this.document.warning.combinableKi) {
            await foundry.applications.api.DialogV2.wait({
                classes: ['baseAbfalter', 'abfalterDialog'],
                window: { title: game.i18n.localize("abfalter.kiAbilityData.fixWarningsTitle") },
                content: game.i18n.localize("abfalter.kiAbilityData.fixWarningsContent"),
                buttons: [
                    {
                        label: game.i18n.localize("abfalter.kiAbilityData.continueAnyways"),
                        action: "continue",
                        callback: async () => {
                            bypassWarnings = true;
                            warnings = true;
                        }
                    },
                    {
                        label: game.i18n.localize("abfalter.dialogs.cancel"),
                        action: "cancel"
                    }
                ]
            })
        } else {
            bypassWarnings = true;
        }
        if (!bypassWarnings) { return; }

        let completed = false;
        const techniqueData = this.document;
        const template = templates.kiTechCreatorName;
        const htmlContent = await foundry.applications.handlebars.renderTemplate(template, {
            actors: game.actors.filter(a => a.isOwner) // Pass owned actors to the template
        });

        await foundry.applications.api.DialogV2.wait({
            classes: ['baseAbfalter', 'abfalterDialog', 'kiTechCreatorName'],
            window: { title: game.i18n.localize("abfalter.kiAbilityData.nameAndActor") },
            position: {
                width: 475,
                height: "auto"
            },
            content: htmlContent,
            buttons: [
                {
                    label: game.i18n.localize("abfalter.kiAbilityData.createClose"),
                    action: "finalize",
                    callback: async (event, button, dialog) => {
                        const name = dialog.element.querySelector("#technique-name")?.value?.trim();
                        const actorId = dialog.element.querySelector("#actor-select")?.value;
                        const actor = game.actors.get(actorId);

                        if (!name || !actor) {
                            ui.notifications.warn("Missing name or actor.");
                            return;
                        }

                        const descriptions = Object.values(techniqueData.abilities).filter(a => a.description && a.description.trim().length > 0).map(a => a.description.trim());
                        const autoGenHeader = game.i18n.localize("abfalter.kiAbilityData.autoGenHeader");
                        const listElementsHeader = game.i18n.localize("abfalter.kiAbilityData.listElementsHeader");
                        const descIntroHeader = game.i18n.localize("abfalter.kiAbilityData.descIntroHeader");
                        const abilityLines = Object.values(techniqueData.abilities)
                        .filter(a => {
                            if (a.category === "disadvantages") return false;
                            return a?.description && a.description.trim().length > 0;
                        })
                        .map(a => {
                            const abilityName = game.i18n.localize("abfalter.kiAbilityData." + a.ability);
                            let elementsLabel = "";
                            let elementText = "";
                            if (a.selectedElement && a.selectedElement.toLowerCase() !== "any") {
                                elementsLabel = game.i18n.localize("abfalter.kiAbilityData.chosenElement");
                                elementText = a.selectedElement;
                            } else {
                                const abilityData = kiTechAbilitiesData().find(b => b.id === a.ability);
                                if (abilityData?.elements?.length) {
                                    elementText = abilityData.elements.join(", ");
                                }
                                elementsLabel = game.i18n.localize("abfalter.kiAbilityData.notChosenElement");
                            }

                            return `${abilityName} ( ${elementsLabel}: ${elementText} )`;
                        });
                        const allLines = [
                            autoGenHeader,
                            listElementsHeader,
                            ...abilityLines,
                            "",
                            descIntroHeader,
                            ...descriptions
                        ];
                        let descriptionFinal = `<p>${allLines.join('</p><p>')}</p>`;

                        const itemData = {
                            name: name,
                            type: "kiTechnique",
                            system: {
                                description: descriptionFinal,
                                expand: true,
                                actor: false, // what is this for?
                                level: techniqueData.level,
                                mk: techniqueData.totalMk,
                                actionType: techniqueData.finalActionType,
                                frequency: techniqueData.finalFrequency,
                                maintainable: techniqueData.maintType,
                                maintBool: techniqueData.maintType !== "none",
                                combinable: techniqueData.isCombinable,
                                use: {
                                    agi: techniqueData.kiFinalValues.agility?.finalKi || 0,
                                    con: techniqueData.kiFinalValues.consti?.finalKi || 0,
                                    dex: techniqueData.kiFinalValues.dexterity?.finalKi || 0,
                                    str: techniqueData.kiFinalValues.strength?.finalKi || 0,
                                    pow: techniqueData.kiFinalValues.power?.finalKi || 0,
                                    wp: techniqueData.kiFinalValues.willpower?.finalKi || 0
                                },
                                maint: {
                                    unified: techniqueData.unifiedCost,
                                    agi: techniqueData.kiFinalValues.agility?.finalMaint || 0,
                                    con: techniqueData.kiFinalValues.consti?.finalMaint || 0,
                                    dex: techniqueData.kiFinalValues.dexterity?.finalMaint || 0,
                                    str: techniqueData.kiFinalValues.strength?.finalMaint || 0,
                                    pow: techniqueData.kiFinalValues.power?.finalMaint || 0,
                                    wp: techniqueData.kiFinalValues.willpower?.finalMaint || 0
                                }
                            }
                        };

                        await actor.createEmbeddedDocuments("Item", [itemData]);
                        completed = true;
                        dialog.close();
                    },
                },
                {
                    label: game.i18n.localize("abfalter.dialogs.cancel"),
                    action: "cancel",
                    callback: (event, button, dialog) => {
                        dialog.close();
                    },
                }
            ],
            render: (ev, dialog) => {
                const search = dialog.element.querySelector("#actor-search");
                const select = dialog.element.querySelector("#actor-select");
                if (!search || !select) return;

                const options = Array.from(select.options);
                const filter = (q) => {
                    const term = (q || "").trim().toLowerCase();
                    // Show all when empty
                    if (!term) {
                    options.forEach(o => o.hidden = false);
                    return;
                    }
                    options.forEach(o => {
                    const text = o.textContent.trim().toLowerCase();
                    // prefix match (begins with)
                    o.hidden = !text.startsWith(term);
                    });

                    // If current selection is hidden, move to first visible
                    const sel = select.selectedOptions[0];
                    if (sel && sel.hidden) {
                    const firstVisible = options.find(o => !o.hidden);
                    if (firstVisible) select.value = firstVisible.value;
                    }
                };
                search.addEventListener('input', () => filter(search.value));
            }
        });
        /* TODO
        if (warnings) {
            const chatData = {
                user: game.user.id,
                speaker: game.user,
                content: `{{localized "abfalter.kiAbilityData.createdWithWarnings"}}`,
            };
            ChatMessage.applyRollMode(chatData, 'game.settings.get("core", "rollMode")');
            ChatMessage.create(chatData);
        }
        */

        if (completed) this.close();
    }

    static #close(ev) {
        ev.preventDefault();
        this.close();
    }
}

async function buildChosenChars(primary, optionalArray) {
    const chosenChars = [];
    chosenChars.push({
        type: primary,
        maint: 0,
        ki: 0,
        kiTotal: 0
    });
    for (const [key, value] of Object.entries(optionalArray)) {
        if (value.selected) {
            chosenChars.push({
                type: value.type,
                maint: 0,
                ki: 0,
                kiTotal: 0
            });
        }
    }
    return chosenChars;
}

async function updateChosenChars(primary, optionalArray, oldArray) {
    const chosenChars = [];
    const findOldChar = (type) => oldArray.find(c => c.type === type);
    // Find the old primary character
    const oldPrimary = findOldChar(primary);
    chosenChars.push({
        type: primary,
        maint: oldPrimary ? oldPrimary.maint : 0,
        ki: oldPrimary ? oldPrimary.ki : 0,
        kiTotal: oldPrimary ? oldPrimary.kiTotal : 0
    });

    // Loop through optionalArray, only keep ones marked selected
    for (const [key, value] of Object.entries(optionalArray)) {
        if (value.selected) {
            const oldChar = findOldChar(value.type);
            chosenChars.push({
                type: value.type,
                maint: oldChar ? oldChar.maint : 0,
                ki: oldChar ? oldChar.ki : 0,
                kiTotal: oldChar ? oldChar.kiTotal : 0
            });
        }
    }
    return chosenChars;
}

async function getMaintValue(maintType, costsFinal) {
    let maintValue = 0;
    switch (maintType) {
        case "maintenance":
            maintValue = costsFinal.maint;
            break;
        case "minorSus":
            maintValue = costsFinal.mis;
            break;
        case "majorSus":
            maintValue = costsFinal.grs;
            break;
        default:
            maintValue = 0;
            break;
    }
    return maintValue;
}

async function getKiValue(tag, costsFinal, selectedOptionalChars) {
    let kiValue = 0;
    if (tag === "primary") {
        kiValue = costsFinal.prim;
    } else if (tag === "secondary") {
        kiValue = costsFinal.sec;
    }

    // Add optional characteristics
    for (const [key, value] of Object.entries(selectedOptionalChars)) {
        if (value.selected) {
            kiValue += value.value;
        }
    }

    return kiValue;
}

// Ki Ability Dialog Function
async function addNewKiAbility(level) {
    let category = "offensive";
    const template = templates.addKiTechAbility;
    const htmlContent = await foundry.applications.handlebars.renderTemplate(template, { category });

    return new Promise((resolve) => {
        let ability = null;
        let selectedElement = "any";
        let selectedTier = null;
        let primaryChar = null;
        let costsFinal = {};
        let selectedOptionalChars = {};
        let selectedAdditionalEffects = {};
        let description = "";
        let actionType = "";
        let frequency = "";
        const categoryList = {
            offensive: game.i18n.localize("abfalter.kiAbilityData.offensive"),
            defensive: game.i18n.localize("abfalter.kiAbilityData.defensive"),
            destructive: game.i18n.localize("abfalter.kiAbilityData.destructive"),
            action: game.i18n.localize("abfalter.kiAbilityData.action"),
            reaction: game.i18n.localize("abfalter.kiAbilityData.reaction"),
            special: game.i18n.localize("abfalter.kiAbilityData.special"),
            effectsOfDurability: game.i18n.localize("abfalter.kiAbilityData.effectsOfDurability"),
            increaseEffects: game.i18n.localize("abfalter.kiAbilityData.increaseEffects"),
            variedEffects: game.i18n.localize("abfalter.kiAbilityData.variedEffects"),
            disadvantages: game.i18n.localize("abfalter.kiAbilityData.disadvantages")
        };

        foundry.applications.api.DialogV2.wait({
            classes: ['baseAbfalter', 'abfalterDialog', 'kiAddAbilityDialog'],
            window: { title: "Add Ki Ability" },
            position: {
                width: 475,
                height: "auto"
            },
            content: htmlContent,
            buttons: [
                {
                    label: game.i18n.localize("abfalter.kiAbilityData.createKiTech"),
                    action: "addAbility",
                    callback: (event, button, dialog) => {
                        const formData = {
                            ability,
                            primaryChar,
                            costsFinal,
                            selectedOptionalChars,
                            selectedElement,
                            selectedTier,
                            selectedAdditionalEffects,
                            description,
                            category,
                            actionType,
                            frequency
                        };
                        resolve(formData);
                    },
                }
            ],
            render: (ev, dialog) => {
                const categorySelect = dialog.element.querySelector("#category-select");
                const elementWrapper = dialog.element.querySelector("#element-wrapper");
                const charSelection  = dialog.element.querySelector(".charSelection");
                const abilitySelect = dialog.element.querySelector("#ability-select");
                const elementSelect = dialog.element.querySelector("#element-select");
                const tierSelect = dialog.element.querySelector("#tier-select");

                // Helper to populate ability dropdown based on current category
                const populateAbilityDropdown = (category) => {
                    if (!abilitySelect) return;

                    const abilities = kiTechAbilitiesData().filter(a => a.cat === category);
                    abilitySelect.innerHTML = "";

                    for (const abilityObj of abilities) {
                        const option = document.createElement("option");
                        option.value = abilityObj.id;
                        option.textContent = abilityObj.name;
                        abilitySelect.appendChild(option);
                    }

                    // Set and track the default selected ability
                    if (abilities.length > 0) {
                        ability = abilities[0].id;
                        abilitySelect.value = ability;
                        populateElementDropdown(ability);
                        populateTierDropdown(ability, level);
                        const selectedAbility = kiTechAbilitiesData().find(a => a.id === ability);
                        updatePrimaryCharDisplay(selectedAbility?.primaryChar);
                        populateOptionalChars(selectedAbility?.optionalChar || []);
                        populateAdditionalEffects(selectedAbility?.additions || [], selectedAbility?.hasAdditionalEffect);
                        generateFullDescription();
                        updateTierDisplay(selectedTier);
                        //console.log(`Populated abilities for category: ${category}`);
                    } else {
                        ability = "none";
                        populateElementDropdown(null);
                        populateTierDropdown(null);
                        updatePrimaryCharDisplay(null);
                        populateOptionalChars([]);
                        populateOptionalChars([]);
                        populateAdditionalEffects([], false);
                        generateFullDescription();
                        updateTierDisplay(selectedTier);
                    }
                };

                // Helper to populate element dropdown based on current ability
                const populateElementDropdown = (abilityId) => {
                    if (!elementSelect) return;

                    const selectedAbility = kiTechAbilitiesData().find(a => a.id === abilityId);
                    elementSelect.innerHTML = "";

                    const anyOption = document.createElement("option");
                    anyOption.value = "any";
                    anyOption.textContent = game.i18n.localize("abfalter.kiAbilityData.anyElement") || "Any";
                    elementSelect.appendChild(anyOption);

                    if (selectedAbility?.elements?.length) {
                        for (const el of selectedAbility.elements) {
                            const option = document.createElement("option");
                            option.value = el;
                            option.textContent = game.i18n.localize(`abfalter.kiAbilityData.${el}`) || el;
                            elementSelect.appendChild(option);
                        }
                    }

                    // Default selected value when ability changes
                    selectedElement = "any";
                    elementSelect.value = "any";
                };

                // Helper to populate tier dropdown based on current ability
                const populateTierDropdown = (abilityId, levelLimit = 3) => {
                    if (!tierSelect) return;

                    const selectedAbility = kiTechAbilitiesData().find(a => a.id === abilityId);
                    tierSelect.innerHTML = "";

                    if (!selectedAbility?.tiers?.length) {
                        selectedTier = null;
                        updateTierDisplay(null);
                        return;
                    }

                    // Filter tiers by levelLimit
                    const validTiers = selectedAbility.tiers.filter(tier => tier.lvl <= levelLimit);

                    if (validTiers.length === 0) {
                        selectedTier = null;
                        updateTierDisplay(null);
                        return;
                    }

                    validTiers.forEach((tier, index) => {
                        const option = document.createElement("option");
                        option.value = index;
                        option.textContent = tier.ability;
                        tierSelect.appendChild(option);
                    });

                    selectedTier = validTiers[0];
                    tierSelect.value = "0";
                    updateTierDisplay(selectedTier);

                    // Store tier list so we can reference it by index in the change handler
                    tierSelect.dataset.validTiers = JSON.stringify(validTiers);
                };

                const updatePrimaryCharDisplay = (char) => {
                    primaryChar = char;
                    const el = dialog.element.querySelector("#primary-char");
                    if (el) el.textContent = game.i18n.localize(`abfalter.${char}`) || char || "-";
                };

                const populateOptionalChars = (optionalChars) => {
                    const container = dialog.element.querySelector("#optional-char-container");
                    container.classList.add("optionalContainer");
                    if (!container) return;

                    container.innerHTML = "";
                    selectedOptionalChars = {};

                    optionalChars.forEach((entry, index) => {
                        const id = `opt-char-${index}`;

                        // Create wrapper
                        const label = document.createElement("label");
                        label.setAttribute("for", id);

                        // Create checkbox
                        const checkbox = document.createElement("input");
                        checkbox.type = "checkbox";
                        checkbox.id = id;
                        checkbox.name = entry.type;
                        checkbox.value = entry.value;

                        // Save state on change
                        checkbox.addEventListener("change", (ev) => {
                            selectedOptionalChars[entry.type] = {
                                selected: ev.target.checked,
                                value: entry.value,
                                type: entry.type
                            };
                            updateTierDisplay(selectedTier);
                        });

                        // Label text
                        const labelText = `${game.i18n.localize(`abfalter.${entry.type}`) || entry.type} (${entry.value})`;

                        label.appendChild(checkbox);
                        label.appendChild(document.createTextNode(" " + labelText));
                        container.appendChild(label);

                        // Default to false
                        selectedOptionalChars[entry.type] = {
                            selected: false,
                            value: entry.value,
                            type: entry.type
                        };
                    });
                };

                const populateAdditionalEffects = (additions, hasEffect) => {
                    const container = dialog.element.querySelector("#additional-effects-container");
                    if (!container) return;

                    container.innerHTML = "";
                    selectedAdditionalEffects = {};

                    if (!hasEffect || !Array.isArray(additions)) return;

                    const title = document.createElement("span");
                    title.textContent = game.i18n.localize("abfalter.kiAbilityData.optionalEffects") || "Error: Can't load title";
                    container.appendChild(title);

                    additions.forEach((group, groupIndex) => {
                        const groupDiv = document.createElement("div");
                        groupDiv.classList.add("effect-group");

                        const label = document.createElement("label");

                        const groupTitle = document.createElement("span");
                        groupTitle.textContent = group.title || group.groupId;
                        label.appendChild(groupTitle);

                        const options = group.options;
                        if (options.length === 1) {
                            // Checkbox
                            const id = `additional-${group.groupId}`;

                            const checkbox = document.createElement("input");
                            checkbox.type = "checkbox";
                            checkbox.id = id;
                            label.setAttribute("for", id);

                            const label2 = document.createElement("label");
                            const span = document.createElement("span");
                            span.textContent = options[0].name;

                            checkbox.addEventListener("change", (ev) => {
                                selectedAdditionalEffects[group.groupId] = ev.target.checked ? options[0] : null;
                                updateTierDisplay(selectedTier);
                                generateFullDescription();
                            });

                            label2.appendChild(checkbox);
                            label2.appendChild(span);
                            label.appendChild(label2);
                            groupDiv.appendChild(label);
                            selectedAdditionalEffects[group.groupId] = null;
                        } else if (options.length > 1) {
                            // Dropdown
                            const select = document.createElement("select");
                            const noneOption = document.createElement("option");
                            noneOption.value = "";
                            noneOption.textContent = game.i18n.localize("abfalter.none") || "None";
                            select.appendChild(noneOption);

                            options.forEach(opt => {
                                const option = document.createElement("option");
                                option.value = opt.optionId;
                                option.textContent = opt.name;
                                select.appendChild(option);
                            });

                            select.addEventListener("change", (ev) => {
                                const selectedId = ev.target.value;
                                const selected = options.find(o => o.optionId === selectedId);
                                selectedAdditionalEffects[group.groupId] = selected || null;
                                updateTierDisplay(selectedTier);
                                generateFullDescription();
                            });

                            label.appendChild(select);
                            groupDiv.appendChild(label);

                            selectedAdditionalEffects[group.groupId] = null;
                        }

                        container.appendChild(groupDiv);
                    });
                };

                const updateVisibility = () => {
                    const hide = category === "disadvantages";
                    elementWrapper?.classList.toggle("hidden", hide);
                    charSelection?.classList.toggle("hidden", hide);
                };
                updateVisibility();

                // Helper to generate full description text
                const generateFullDescription = () => {
                    const selectedAbility = kiTechAbilitiesData().find(a => a.id === ability);
                    const tierName = selectedTier?.ability ?? "";
                    const baseDesc = `${selectedAbility?.name ?? ""}: ${selectedAbility?.description ?? ""} (${tierName})`;

                    const effectDescs = [];

                    for (const groupValue of Object.values(selectedAdditionalEffects)) {
                        if (!groupValue) continue;

                        const effects = Array.isArray(groupValue) ? groupValue : [groupValue];

                        for (const effect of effects) {
                            if (effect?.name && effect?.description) {
                                effectDescs.push(`${effect.name}: ${effect.description}`);
                            }
                        }
                    }
                    description = [baseDesc, ...effectDescs].join("\n\n");
                    //console.log("Generated Description:", description);
                    actionType = selectedAbility?.actionType ?? "";
                    frequency = selectedAbility?.frequency ?? "";

                    const previewEl = dialog.element.querySelector("#ability-description-text");
                    if (previewEl) {
                        previewEl.textContent = description;
                    }
                };

                // Helper to update tier details display
                const updateTierDisplay = (tier) => {
                    const base = {
                        prim: tier?.prim ?? 0,
                        sec: tier?.sec ?? 0,
                        mk: tier?.mk ?? 0,
                        maint: tier?.maint ?? 0,
                        mis: tier?.mis ?? 0,
                        grs: tier?.grs ?? 0,
                        lvl: tier?.lvl ?? 0
                    };

                    // Add selected additional effects
                    for (const group of Object.values(selectedAdditionalEffects)) {
                        if (!group) continue;

                        const effects = Array.isArray(group) ? group : [group];
                        for (const effect of effects) {
                            if (!effect) continue;

                            base.prim += effect.cost ?? 0;
                            base.sec += effect.cost ?? 0;
                            base.mk += effect.mk ?? 0;
                            base.maint += effect.maint ?? 0;
                            base.mis += effect.mis ?? 0;
                            base.grs += effect.grs ?? 0;
                        }
                    }

                    costsFinal.prim = base.prim;
                    costsFinal.sec = base.sec;
                    costsFinal.mk = base.mk;
                    costsFinal.maint = base.maint;
                    costsFinal.mis = base.mis;
                    costsFinal.grs = base.grs;

                    // Add selected optional characteristics (only if checked)
                    for (const [key, obj] of Object.entries(selectedOptionalChars)) {
                        if (obj.selected) {
                            base.prim += obj.value;
                            base.sec += obj.value;
                        }
                    }

                    // Display
                    dialog.element.querySelector("#tier-prim").textContent = base.prim;
                    dialog.element.querySelector("#tier-sec").textContent = base.sec;
                    dialog.element.querySelector("#tier-mk").textContent = base.mk;
                    dialog.element.querySelector("#tier-maint").textContent = base.maint;
                    dialog.element.querySelector("#tier-mis").textContent = base.mis;
                    dialog.element.querySelector("#tier-grs").textContent = base.grs;
                    dialog.element.querySelector("#tier-lvl").textContent = base.lvl;
                };

                // Populate category dropdown
                if (categorySelect) {
                    categorySelect.innerHTML = "";

                    for (const [value, label] of Object.entries(categoryList)) {
                        const option = document.createElement("option");
                        option.value = value;
                        option.textContent = label;
                        categorySelect.appendChild(option);
                    }

                    categorySelect.value = category;

                    categorySelect.addEventListener("change", (ev) => {
                        category = ev.target.value;
                        dialog.category = category;
                        populateAbilityDropdown(category);
                        updateVisibility();
                        //console.log(`Category changed to: ${category}`);
                    });
                }

                // Populate ability dropdown initially
                if (abilitySelect) {
                    populateAbilityDropdown(category);
                    populateElementDropdown(ability);

                    abilitySelect.addEventListener("change", (ev) => {
                        ability = ev.target.value;
                        //console.log(`Ability changed to: ${ability}`);

                        populateElementDropdown(ability);
                        populateTierDropdown(ability, level);
                        const selectedAbility = kiTechAbilitiesData().find(a => a.id === ability);
                        updatePrimaryCharDisplay(selectedAbility?.primaryChar);
                        populateOptionalChars(selectedAbility?.optionalChar || []);
                        populateAdditionalEffects(selectedAbility?.additions || [], selectedAbility?.hasAdditionalEffect);
                        generateFullDescription();
                        updateTierDisplay(selectedTier);
                    });
                }
                // save element value
                elementSelect?.addEventListener("change", (ev) => {
                    selectedElement = ev.target.value;
                });

                // Populate tier values
                tierSelect?.addEventListener("change", (ev) => {
                    const validTiers = JSON.parse(tierSelect.dataset.validTiers || "[]");
                    const index = parseInt(ev.target.value);
                    selectedTier = validTiers[index] || null;
                    updateTierDisplay(selectedTier);
                    generateFullDescription();
                });
            }
        });
    });
}


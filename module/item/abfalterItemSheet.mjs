import { abfalterSettingsKeys } from "../utilities/abfalterSettings.js";

const { sheets, ux } = foundry.applications;

export default class abfalterItemSheet extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.sheets.ItemSheetV2) {
    static DEFAULT_OPTIONS = {
        tag: "form",
        classes: ["abfalter", "sheet", "item"],
        dragDrop: [{ dragSelector: ".draggable", dropSelector: null }],
        position: {
            width: 550,
            height: "auto"

        },
        form: {
            submitOnChange: true,
            closeOnSubmit: false,
            submitOnClose: true
        },
        window: {
            resizable: true
        },
        actions: {
            toggleValue: this.#toggleValue,
            addWepAtk: this.#addWepAtk,
            removeWepAtk: this.#removeWepAtk,
            wepAtkToggle: this.#atkToggle,
            addElanGift: this.#addElanGift,
            removeElanGift: this.#deleteElanGift,
            toggleElanGift: this.#toggleElanGift,
            viewEffect: this.#viewEffect,
            deleteEffect: this.#deleteEffect,
            createEffect: this.#createEffect,
            toggleEffect: this.#toggleEffect,
        }
    }

    static PARTS = {
        header: { scrollable: [""], template: "systems/abfalter/templates/item/partials/item-header.hbs" },
        tabs: { scrollable: [""], template: "systems/abfalter/templates/item/partials/item-tabs.hbs" },
        description: {scrollable: [""], template: "systems/abfalter/templates/item/partials/item-description.hbs"},
        details: { scrollable: [""], template: "dynamic" },
        profiles: {scrollable: [""], template: "systems/abfalter/templates/item/unique/wep-profiles.hbs"},
        gifts: {scrollable: [""], template: "systems/abfalter/templates/item/unique/elan-gifts.hbs"},
        dpCosts: {scrollable: [""], template: "systems/abfalter/templates/item/unique/class-dpCosts.hbs"},
        effects: {scrollable: [""], template: "systems/abfalter/templates/item/partials/item-effects.hbs"},
    }

    static TABS = {
        primary: {
            tabs: [
                { id: "description" },
                { id: "details" },
                { id: "profiles" },
                { id: "gifts" },
                { id: "dpCosts" },
                { id: "effects" },
            ],
            initial: "description",
        }
    }

    _configureRenderParts(options) {
        const { header, tabs, description, details, effects, profiles, gifts, dpCosts } = super._configureRenderParts(options);
    
        const itemType = this.item.type;
        details.template = `systems/abfalter/templates/item/details/${itemType}.hbs`;
        const parts = { header, tabs, description };

        if (this.document.limited) return;

        switch(itemType) {
            case "advantage":
            case "disadvantage": //deprecated removal in 1.5.3
            case "monsterPower":
            case "turnMaint": //deprecated removal in 1.5.3
            case "dailyMaint": //deprecated removal in 1.5.3
            case "maintPower":
            case "arsMagnus":
            case "zeonMaint":
                parts.effects = effects;
                break;
            case "secondary":
            case "spell":
            case "ammo":
                parts.details = details;
                break;
            case "incarnation":
            case "invocation":
            case "mentalPattern":
            case "psychicMatrix":
            case "martialArt":
            case "kiSealCreature":
            case "kiTechnique":
            case "armor":
            case "armorHelmet": //deprecated removal in 1.5.3
            case "inventory":
            case "backgroundInfo":
                parts.details = details;
                parts.effects = effects;
                break;
            case "elan":
                parts.details = details;
                parts.gifts = gifts;
                parts.effects = effects;
                break;
            case "weapon":
                parts.details = details;
                parts.profiles = profiles;
                parts.effects = effects;
                break;
            case "class":
                parts.details = details;
                parts.dpCosts = dpCosts;
                break;
            default:
                //case "proficiency":
                //case "spellPath":
                //case "discipline":
                //case "currency":
                break;
        }

        return parts;
    }
    
    _prepareTabs(group) {
        const tabs = super._prepareTabs(group);
        const itemType = this.item.type;

        if (itemType !== "elan") { delete tabs.gifts; }
        if (itemType !== "weapon") { delete tabs.profiles; }
        if (itemType !== "class") { delete tabs.dpCosts; }
        
        switch(itemType) {
            case "spellPath":
            case "discipline":
            case "currency":
                delete tabs.description;
                delete tabs.details;
                delete tabs.effects;
                break
            case "proficiency":
                delete tabs.details;
                delete tabs.effects;
                break;
            case "advantage":
            case "disadvantage": //deprecated removal in 1.5.3
            case "monsterPower":
            case "turnMaint": //deprecated removal in 1.5.3
            case "dailyMaint": //deprecated removal in 1.5.3
            case "zeonMaint":
            case "arsMagnus":
            case "maintPower":
                delete tabs.details;
                break;
            case "secondary":
            case "spell":
            case "ammo":
                delete tabs.effects;
                break;
            default:
                break;
        }

        return tabs;
    }


    async _prepareContext(options) {
        const context = await super._prepareContext(options);

        context.item = this.item;
        context.document = this.document;
        context.system = this.document.system;
        context.systemFields = this.document.system.schema.fields;
        context.isEditable = this.isEditable;
        context.config = CONFIG.abfalter;
        context.effects = this.prepareActiveEffectCategories();

        switch (this.item.type) {
            case "advantage": {
                context.advObjList = CONFIG.abfalter.advDropdown;
                break;
            }
            case "secondary": {
                context.customSecObjList = CONFIG.abfalter.customSecondaryDropdown;
                break;
            }
            case "proficiency": {
                context.enrichedDesc = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.item.system.description);
                context.proficiencyObjList = CONFIG.abfalter.proficiencyDropdown;
                break;
            }
            case "elan": {
                context.enrichedDesc = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.item.system.description);
                context.enrichedGain = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.item.system.gain);
                context.enrichedGainUpper = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.item.system.gainUpper);
                context.enrichedLose = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.item.system.lose);

                const gifts = this.item.system.gifts ?? {};

                for (const gift of Object.values(gifts)) {
                    gift.enrichedDesc = await foundry.applications.ux.TextEditor.enrichHTML(gift.desc || "", {
                        async: true
                    });
                }
                break;
            }
            case "backgroundInfo": {
                context.enrichedDesc = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.item.system.description);
                context.backgroundInfoObjList = CONFIG.abfalter.backgroundInfoDropdown;
                break;
                
            }
            case "monsterPower": {
                context.monsterTypeObjList = CONFIG.abfalter.MonsterPowerDropdown;
                break;
            }
            case "spell": {
                context.actionObjList = CONFIG.abfalter.ActionDropdown;
                context.spellTypeObjList = CONFIG.abfalter.spellTypeDropdown;
                context.spellProjObjList = CONFIG.abfalter.spellProjDropdown;
                context.spellMaintTypeObjList = CONFIG.abfalter.spellMaintTypeDropdown;
                context.spellBoughtObjList = CONFIG.abfalter.spellBoughtDropdown;
                break;
            }
            case "zeonMaint": {
                context.zeonMaintObjList = CONFIG.abfalter.zeonMaintDropdown;
                break;
            }
            case "psychicMatrix": {
                context.actionObjList = CONFIG.abfalter.ActionDropdown;
                context.yesnoObjList = CONFIG.abfalter.yesnoDropdown;
                context.matrixLevelObjList = {
                    1: "1",
                    2: "2",
                    3: "3"
                }
                break;
            }
            case "martialArt": {
                context.martialArtsObjList = CONFIG.abfalter.martialArtsDropdown;
                break;
            }
            case "kiTechnique": {
                context.kiFrequencyObjList = CONFIG.abfalter.kiFrequencyDropdown;
                context.kiActionTypeObjList = CONFIG.abfalter.kiActionTypeDropdown;
                break;
            }
            case "armor": {
                context.enrichedDesc = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.item.system.description);
                context.armorTypeList = CONFIG.abfalter.armorTypeDropdown;
                context.layerTypeList = CONFIG.abfalter.layerTypeDropdown;
                break;
            }
            case "weapon": {
                context.enrichedDesc = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.item.system.description);
                context.ammoOptions = Object.fromEntries(this.item.system.ranged.ammoIds.map(i => [i.id, i.name]));

                context.customSecObjList = CONFIG.abfalter.customSecondaryDropdown;
                context.shieldObjList = CONFIG.abfalter.shieldDropdown;
                context.damageModObjList = CONFIG.abfalter.damageModDropdown;
                context.wepDamageTypeObjList = CONFIG.abfalter.wepDamageTypeDropdown;
                context.wepDamageTypeSpiritObjList = CONFIG.abfalter.wepDamageTypeSpiritDropdown;
                context.profileTypeList = CONFIG.abfalter.profileTypeDropdown;
                context.weaponTypeList = CONFIG.abfalter.weaponTypeDropdown;
                context.vorpalAtkList = CONFIG.abfalter.vorpalAtkDropdown;
                if (game.settings.get('abfalter', abfalterSettingsKeys.Use_Meters)) {
                    context.throwDistanceDropdown = CONFIG.abfalter.metricDistLongDropdown;
                } else {
                    context.throwDistanceDropdown = CONFIG.abfalter.imperialDistLongDropdown;
                }
                break;
            }
            case "ammo": {
                context.enrichedDesc = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.item.system.description);
                context.currencyOptions = Object.fromEntries(this.item.system.priceListIds.map(i => [i.id, i.name]));

                context.wepDamageTypeObjList = CONFIG.abfalter.wepDamageTypeDropdown;
                context.wepDamageTypeSpiritObjList = CONFIG.abfalter.wepDamageTypeSpiritDropdown;
                context.weightList = CONFIG.abfalter.weightDropdown;
                break;
            }
            case "class": {
                context.enrichedDesc = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.item.system.description);
                context.classppBonusObjList = {
                    3: "+1 PP /3 lvls",
                    2: "+1 PP /2 lvls",
                    1: "+1 PP /1 lvls"
                }
                break;
            }

        }
        return context;
    }

    async _onRender(context, options) {
        await super._onRender(context, options);
        this.#dragDrop.forEach((d) => d.bind(this.element));

        const autoResizes = this.element.querySelectorAll("textarea.textarea-auto-resize");
        for (const textarea of autoResizes) {
            textarea.addEventListener("input", function () {
                if (this.nextElementSibling) {
                    this.nextElementSibling.textContent = this.value;
                }
            });
        }
    }


    static #toggleValue(ev) {
        ev.preventDefault();
        const target = ev.target.closest('[data-label][data-ability]');
        if (!target) return;
        const label = target.dataset.label;
        let value = target.dataset.ability;
        value = !(value === 'true');
        this.document.update({ [label]: value });
    }

    static #addWepAtk(ev) {
        ev.preventDefault();
        const attacks = this.item.system.attacks;
        const isShield = this.item.system.info?.type === "shield";

        attacks[foundry.utils.randomID()]  = {
                expand: true,
                profileType: isShield ? "defensive" : "both",
                wepType: this.item.system.info.type,
                name: "New Attack",
                attack: 0,
                finalAttack: 0,
                block: 0,
                finalBlock: 0,
                dodge: 0,
                finalDodge: 0,
                atPen: 0,
                finalAtPen: 0,
                breakage: 0,
                finalBreakage: 0,
                damage: 0,
                finalDamage: 0,
                ignoreThrown: false,
                fired: false,
                rateOfFire: 0,
                rangedAmmoConsumed: true,
                rangedAmmoConsumedValue: 1,
                quantityConsumed: false,
                consumedValue: 0,
                ignorePrecision: false,
                ignoreVorpal: false,
                ignoreTrapping: false,
                trappingType: false,
                trappingValue: 0,
                parentPrecision: false,
                parentVorpal: false,
                parentTrapping: false,
                parentThrowable: false,
                atkOverride: false,
                blkOverride: false,
                dodOverride: false,
                dmgOverride: false
        };

        this.document.update({ "system.attacks": attacks });
    }

    static #removeWepAtk(ev) {
        ev.preventDefault();
        const target = ev.target.closest('[data-code]');
        const key = target.dataset.code;

        new Dialog({
            title: "Remove Attack",
            content: game.i18n.localize('abfalter.confirmRemAtkPrompt'),
            buttons: {
                yes: {
                    label: game.i18n.localize('abfalter.yes'),
                    callback: () => {
                        this.item.update({ [`system.attacks.-=${key}`]: null });
                    }
                },
                no: {
                    label: game.i18n.localize('abfalter.no')
                }
            },
        }).render(true);
    }

    static async #atkToggle(ev) {
        const target = ev.target.closest('[data-label][data-code][data-value]');
        if (!target) return;
        const label = target.dataset.label;
        const key = target.dataset.code;
        let value = target.dataset.value;
        value = !(value === 'true');
        this.document.update({ [`system.attacks.${key}.${label}`]: value });
    }

    static #addElanGift(ev) {
        ev.preventDefault();
        const gifts = this.item.system.gifts;
        gifts[foundry.utils.randomID()] = {
            name: "Gift Name",
            req: 0,
            cost: 0,
            desc: "",
            expand: true,
            bought: false
        }
        
        this.document.update({ "system.gifts": gifts });
    }

    static #deleteElanGift(ev) {
        ev.preventDefault();
        const target = ev.target.closest('[data-code]');
        const key = target.dataset.code;

        new Dialog({
            title: "Remove Gift",
            content: game.i18n.localize('abfalter.confirmRemGiftPrompt'),
            buttons: {
                yes: {
                    label: game.i18n.localize('abfalter.yes'),
                    callback: () => {
                        this.item.update({ [`system.gifts.-=${key}`]: null });
                    }
                },
                no: {
                    label: game.i18n.localize('abfalter.no')
                }
            },
        }).render(true);
    }

    static #toggleElanGift(ev) {
        const target = ev.target.closest('[data-label][data-code][data-value]');
        if (!target) return;
        const label = target.dataset.label;
        const key = target.dataset.code;
        let value = target.dataset.value;
        value = !(value === 'true');
        this.document.update({ [`system.gifts.${key}.${label}`]: value });
    }

    /**
     * AE inherited from Draw Steel System
     * 
    */
    prepareActiveEffectCategories() {
        const categories = {
            temporary: {
                type: 'temporary',
                label: game.i18n.localize('abfalter.tempEff'),
                effects: [],
            },
            passive: {
                type: 'passive',
                label: game.i18n.localize('abfalter.passEff'),
                effects: [],
            },
            inactive: {
                type: 'inactive',
                label: game.i18n.localize('abfalter.InEff'),
                effects: [],
            },
        };

        // Iterate over active effects, classifying them into categories
        for (const e of this.item.effects) {
        if (!e.transfer) categories.applied.effects.push(e);
        else if (!e.active) categories.inactive.effects.push(e);
        else if (e.isTemporary) categories.temporary.effects.push(e);
        else categories.passive.effects.push(e);
        }

        // Sort each category
        for (const c of Object.values(categories)) {
        c.effects.sort((a, b) => (a.sort || 0) - (b.sort || 0));
        }
        return categories;
    }

    static async #viewEffect(event, target) {
        const effect = this._getEffect(target);
        effect.sheet.render(true);
        
    }

    static async #deleteEffect(event, target) {
        const effect = this._getEffect(target);
        await effect.deleteDialog();
    }

    static async #createEffect(event, target) {
        const aeCls = getDocumentClass("ActiveEffect");
        const effectData = {
            name: aeCls.defaultName({ type: target.dataset.type, parent: this.item }),
        };
        for (const [dataKey, value] of Object.entries(target.dataset)) {
            if (["action", "documentClass"].includes(dataKey)) continue;
            // Nested properties require dot notation in the HTML, e.g. anything with `system`
            foundry.utils.setProperty(effectData, dataKey, value);
        }

        await aeCls.create(effectData, { parent: this.item });
    }

    static async #toggleEffect(event, target) {
        const effect = this._getEffect(target);
        await effect.update({ disabled: !effect.disabled });
    }

    _getEffect(target) {
        const li = target.closest(".effect");
        return this.item.effects.get(li?.dataset?.effectId);
    }

    /**
     * DragDrop inherited from Draw Steel System
     * 
    */
    _canDragStart(selector) {
        // game.user fetches the current user
        return this.isEditable;
    }
    _canDragDrop(selector) {
        // game.user fetches the current user
        return this.isEditable;
    }
    _onDragStart(event) {
        const li = event.currentTarget;
        if ("link" in event.target.dataset) return;

        let dragData = null;

        // Active Effect
        if (li.dataset.effectId) {
            const effect = this.item.effects.get(li.dataset.effectId);
            dragData = effect.toDragData();
        }

        if (!dragData) return;

        // Set data transfer
        event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
    }
    _onDragOver(event) { }

    async _onDrop(event) {
        const data = ux.TextEditor.implementation.getDragEventData(event);
        const item = this.item;
        const allowed = Hooks.call("dropItemSheetData", item, this, data);
        if (allowed === false) return;

        // Handle different data types
        switch (data.type) {
            case "ActiveEffect":
                return this._onDropActiveEffect(event, data);
        }
    }

    async _onDropActiveEffect(event, data) {
        const aeCls = getDocumentClass("ActiveEffect");
        const effect = await aeCls.fromDropData(data);
        if (!this.item.isOwner || !effect) return false;

        if (this.item.uuid === effect.parent?.uuid)
            return this._onEffectSort(event, effect);
        return aeCls.create(effect, { parent: this.item });
    }

    _onEffectSort(event, effect) {
        const effects = this.item.effects;
        const dropTarget = event.target.closest("[data-effect-id]");
        if (!dropTarget) return;
        const target = effects.get(dropTarget.dataset.effectId);

        // Don't sort on yourself
        if (effect.id === target.id) return;

        // Identify sibling items based on adjacent HTML elements
        const siblings = [];
        for (let el of dropTarget.parentElement.children) {
            const siblingId = el.dataset.effectId;
            if (siblingId && (siblingId !== effect.id))
                siblings.push(effects.get(el.dataset.effectId));
        }

        // Perform the sort
        const sortUpdates = foundry.utils.SortingHelpers.performIntegerSort(effect, {
            target,
            siblings,
        });
        const updateData = sortUpdates.map((u) => {
            const update = u.update;
            update._id = u.target._id;
            return update;
        });

        // Perform the update
        return this.item.updateEmbeddedDocuments("ActiveEffect", updateData);
    }

    get dragDrop() {
        return this.#dragDrop;
    }

    #createDragDropHandlers() {
        return this.options.dragDrop.map((d) => {
            d.permissions = {
                dragstart: this._canDragStart.bind(this),
                drop: this._canDragDrop.bind(this),
            };
            d.callbacks = {
                dragstart: this._onDragStart.bind(this),
                dragover: this._onDragOver.bind(this),
                drop: this._onDrop.bind(this),
            };
            return new ux.DragDrop.implementation(d);
        });
    }

    #dragDrop = this.#createDragDropHandlers();

}


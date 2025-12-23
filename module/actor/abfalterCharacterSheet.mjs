import * as diceFunctions from "../diceroller.js";
import { metaMagicSheet } from "../helpers/metaMagicSheet.js";
import * as actorFunctions from "../helpers/actorFunctions.js";
import { genericDialogs } from "../dialogs.js";

export default class abfalterCharacterSheet extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2) {
    static DEFAULT_OPTIONS = {
        tag: "form",
        classes: ["actor", "baseAbfalterActorV2"],
        position: {
            width: 910,
            height: 950
        },
        form: {
            submitOnChange: true,
            closeOnSubmit: false,
            submitOnClose: true
        },
        window: {
            resizable: true
        },
        viewPermission: CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED,
        editPermission: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
        dragDrop: [{ dragSelector: '.draggable', dropSelector: null }],
        actions: {
            toggleValue: this.#toggleValue,
            toggleBoughtFreeButton: this.#toggleDualBoolButton,
            kiAbilityItemToggle: this.#kiAbilityItemToggle,
            itemToggleValue: this.#itemToggleValue,
            itemToChat: this.#itemToChat,
            subItemToChat: this.#subItemToChat,
            characteristicRoll: this.#onChaRoll,
            plainRoll: this.#onPlainRoll,
            createItem: this.#createNewItem,
            kiAccuHalf: this.#kiAccuHalf,
            kiAccuFull: this.#kiAccuFull,
            kiAccuReset: this.#kiAccuReset,
            magicAccuHalf: this.#magicAccuHalf,
            magicAccuFull: this.#magicAccuFull,
            magicRegenFull: this.#magicRegenFull,
            magicRegenActual: this.#magicRegenActual,
            removeMaint: this.#removeMaint,
            openArcanaSephirah: this.#openArcanaSephirah,
            weaponRoll: this.#onWeaponRoll,

            armoryAddItem: this.#armoryAddItem,
            increase: this.#increaseQuantity,
            decrease: this.#decreaseQuantity,
            openMenu: this.#openMenu,
            ammoWeaponToggle: this.#ammoWeaponToggle,

            openDPCalc: this.#openDpCostCalc,
            changeSecNums: this.#changeSecNums,
            createAE: this.#createActiveEffect,
            toggleAE: this.#toggleEffect,
            deleteAE: this.#deleteEffect,
            editAE: this.#editEffect,
            toggleElanGift: this.#toggleElanGift,
            openRestWindow: this.#openRestWindow,
            openDpOffsets: this.#openDpOffsets,
            configButton: this.#configButton,
            openResolveWindow: this.#openResolveWindow,
            addExp: this.#addExp,
            rollInitiative: this.#rollInitiative,
            armorTag: this.#armorTag,
        }
    }

    static PARTS = {
        header: { scrollable: [""], template: "systems/abfalter/templates/actor/actor-header.hbs" },
        tabs: { scrollable: [""], template: "systems/abfalter/templates/actor/actor-tabs.hbs" },
        general: { scrollable: [""], template: "systems/abfalter/templates/actor/parts/general.hbs" },
        background: { scrollable: [""], template: "systems/abfalter/templates/actor/parts/background.hbs" },
        monster: { scrollable: [""], template: "systems/abfalter/templates/actor/parts/monster.hbs" },
        magic: { scrollable: [""], template: "systems/abfalter/templates/actor/parts/magic.hbs" },
        psychic: { scrollable: [""], template: "systems/abfalter/templates/actor/parts/psychic.hbs" },
        ki: { scrollable: [""], template: "systems/abfalter/templates/actor/parts/ki.hbs" },
        armory: { scrollable: [""], template: "systems/abfalter/templates/actor/parts/armory.hbs" },
        effect: { scrollable: [""], template: "systems/abfalter/templates/actor/parts/effect.hbs" },
        bio: { scrollable: [""], template: "systems/abfalter/templates/actor/parts/bio.hbs" },
        settings: { scrollable: [""], template: "systems/abfalter/templates/actor/parts/settings.hbs" },
    }

    static TABS = {
        primary: {
            tabs: [
                { id: "general" },
                { id: "background" },
                { id: "monster" },
                { id: "magic" },
                { id: "psychic" },
                { id: "ki" },
                { id: "armory" },
                { id: "effect" },
                { id: "bio" },
                { id: "settings" },
            ],
            initial: "general",
        },
    };

    _configureRenderParts(options) {
        const parts = super._configureRenderParts(options);

        if (this.document.limited) {
            const { bio } = parts;
            return { bio };
        }

        return parts;
    }

    _prepareTabs(group) {
        const tabs = super._prepareTabs(group);

        if (group === "primary") {
            if (this.document.limited) {
                tabs.bio.active = true;
                tabs.bio.cssClass = "active";
                return { bio: tabs.bio };
            }
        }

        return tabs;
    }

    async _preparePartContext(partId, context, options) {
        await super._preparePartContext(partId, context, options);
        context.partId = `${this.id}-${partId}`;

        switch (partId) {
            case "header":
            case "tabs":
                break
            case "armory":
                context.weightList = CONFIG.abfalter.armoryWeightDropdown;
                break;
            case "general":
                context.customSecObjList = CONFIG.abfalter.customSecondaryDropdown;
                break;
            case "background":
                context.proficiencyObjList = CONFIG.abfalter.proficiencyDropdown;
                break;
            case "monster":
                context.monsterCharObjList = {
                    0: "0",
                    1: "1",
                    2: "2",
                    3: "3",
                    4: "4",
                    5: "5",
                    6: "6",
                    7: "7",
                    8: "8",
                    9: "9",
                    10: "10",
                    11: "11",
                    12: "12",
                    13: "13",
                    14: "14",
                    15: "15"
                }
                break;
            case "magic":
                context.actionObjList = CONFIG.abfalter.ActionDropdown;
                context.MagicTheoryObjList = CONFIG.abfalter.MagicTheoryDropdown;
                context.spellTypeObjList = CONFIG.abfalter.spellTypeDropdown;
                context.spellProjObjList = CONFIG.abfalter.spellProjDropdown;
                context.spellMaintTypeObjList = CONFIG.abfalter.spellMaintTypeDropdown;
                context.spellBoughtObjList = CONFIG.abfalter.spellBoughtDropdown;
                break;
            case "psychic":
                context.actionObjList = CONFIG.abfalter.ActionDropdown;
                context.yesnoObjList = CONFIG.abfalter.yesnoDropdown;
                context.ppotentialObjList = {
                    0: "0",
                    10: "1",
                    20: "3",
                    30: "6",
                    40: "10",
                    50: "15",
                    60: "21",
                    70: "28",
                    80: "36",
                    90: "45",
                    100: "55"
                }
                context.matrixLevelObjList = {
                    1: "1",
                    2: "2",
                    3: "3"
                }
                break;
            case "ki":
                context.damageModObjList = CONFIG.abfalter.damageModDropdown;
                context.martialArtsObjList = CONFIG.abfalter.martialArtsDropdown;
                context.kiFrequencyObjList = CONFIG.abfalter.kiFrequencyDropdown;
                context.kiActionTypeObjList = CONFIG.abfalter.kiActionTypeDropdown;
                context.limitsObjList = CONFIG.abfalter.LimitsDropdown;
                break;
            case "effect":
                context.effects = this.prepareActiveEffectCategories();
                break;
            case "bio":
                context.enrichedBio = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.actor.system.info.bio);
                break;
            case "settings":
                context.InnatePowerObjList = CONFIG.abfalter.innatePowerSettingDropdown;
                break;
        }

        return context;
    }

    async _prepareContext(options) {
        const context = await super._prepareContext(options);
        //context.document = this.document;
        //context.fields = this.document.schema.fields;
        context.system = this.document.system;
        context.systemFields = this.document.system.schema.fields;
        context.config = CONFIG.abfalter;

        //Initialize Items
        const itemTypes = [
            "inventory", "weapon", "armor", "advantage",
            "spell", "class", "secondary", "spellPath", "incarnation", "invocation",
            "currency", "proficiency", "discipline",
            "mentalPattern", "psychicMatrix", "maintPower", "kiSealCreature",
            "kiTechnique", "martialArt", "arsMagnus", "elan", "monsterPower", "ammo",
            "zeonMaint", "backgroundInfo", "kiAbility"
        ];
        for (const type of itemTypes) {
            const items = this.actor.itemTypes[type]?.sort((a, b) => a.sort - b.sort) || [];
            context[`${type}s`] = items;
        }

        return context;
    }

    async _onRender(context, options) {
        await super._onRender(context, options);
            
        if (!this.isEditable) {
            for (const el of this.element.querySelectorAll(".window-content :is(input, button, select, textarea)")) {
                el.disabled = true;
            }
        }

        const inLineEdits = this.element.querySelectorAll(".inline-edit");
        for (const el of inLineEdits) {
            el.addEventListener("change", (e) => {
                e.preventDefault();
                e.stopImmediatePropagation();
                const itemId = e.currentTarget.closest(".item")?.dataset.itemId;
                const field = e.currentTarget.dataset.field;
                const item = this.actor.items.get(itemId);
                if (item && field) {
                    item.update({ [field]: e.currentTarget.value });
                }
            });
        }

        const autoResizes = this.element.querySelectorAll("textarea.textarea-auto-resize");
        for (const textarea of autoResizes) {
            textarea.addEventListener("input", function () {
                if (this.nextElementSibling) {
                    this.nextElementSibling.textContent = this.value;
                }
            });
        }
    }

    async _onFirstRender(context, options) {
        await super._onFirstRender(context, options);

        this._createContextMenu(this._itemContextMenu, ".normal-item", {
            hookName: "itemContextMenu",
            fixed: true,
        });
        this._createContextMenu(this._itemContextMenuV2, ".normal-itemV2", {
            hookName: "itemContextMenuV2",
            fixed: true,
        });
    }

    _itemContextMenu() {
        return [
            {
                name: game.i18n.localize("abfalter.equip"),
                icon: '<i class="fas fa-caret-right"></i>',
                condition: element => {
                    const item = this.actor.items.get(element.dataset.itemId);
                    return element.dataset.canEquip !== "false" && item?.type !== "kiTechnique";
                },
                callback: element => {
                    const item = this.actor.items.get(element.dataset.itemId);
                    element.equipped = !item.system.equipped;
                    item.update({ "system.equipped": element.equipped });
                }
            },
            {
                name: game.i18n.localize("abfalter.toggleActivate"),
                icon: '<i class="fas fa-caret-right"></i>',
                condition: (el) => {
                    const item = this.actor.items.get(el.dataset.itemId);
                    return el.dataset.canEquip !== "false" && item?.type === "kiTechnique";
                },
                callback: (el) => {
                    const item = this.actor.items.get(el.dataset.itemId);
                    if (!item) return;
                    item.update({ "system.active": !item.system?.active });
                }
            },
            {
                name: game.i18n.localize("abfalter.toggle"),
                icon: '<i class="fas fa-caret-right"></i>',
                condition: element => {
                    return element.dataset.canToggle !== "false";
                },
                callback: element => {
                    const item = this.actor.items.get(element.dataset.itemId);
                    element.toggleItem = !item.system.toggleItem;
                    item.update({ "system.toggleItem": element.toggleItem });
                }
            },
            {
                name: game.i18n.localize("abfalter.edit"),
                icon: '<i class="fas fa-edit"></i>',
                condition: element => {
                    return element.dataset.canEdit !== "false";
                },
                callback: element => {
                    const item = this.actor.items.get(element.dataset.itemId);
                    item.sheet.render(true);
                }
            },
            {
                name: game.i18n.localize("abfalter.delete"),
                icon: '<i class="fas fa-trash"></i>',
                condition: element => {
                    return element.dataset.canDelete !== "false";
                },
                callback: element => {
                    new Dialog({
                        title: "Remove Item",
                        content: game.i18n.localize('abfalter.confirmRemPrompt'),
                        buttons: {
                            yes: {
                                label: game.i18n.localize('abfalter.yes'),
                                callback: () => {
                                    this.actor.deleteEmbeddedDocuments("Item", [element.dataset.itemId]);
                                }
                            },
                            no: {
                                label: game.i18n.localize('abfalter.no')
                            }
                        },
                    }).render(true);
                }
            }
        ]
    }

    _itemContextMenuV2() {
        const menu = [
            {
                name: game.i18n.localize("abfalter.edit"),
                icon: '<i class="fas fa-edit"></i>',
                callback: element => {
                    const item = this.actor.items.get(element.dataset.itemId);
                    item.sheet.render(true);
                }
            },
            {
                name: game.i18n.localize("abfalter.duplicate"),
                icon: '<i class="fas fa-copy"></i>',
                callback: element => {
                    const item = this.actor.items.get(element.dataset.itemId);
                    const createData = item.toObject();
                    delete createData._id;
                    createData.name = `${item.name} (Copy)`;
                    this.actor.createEmbeddedDocuments("Item", [createData]);
                }
            },
            {
                name: game.i18n.localize("abfalter.delete"),
                icon: '<i class="fas fa-trash"></i>',
                callback: element => {
                    new Dialog({
                        title: "Remove Item",
                        content: game.i18n.localize('abfalter.confirmRemPrompt'),
                        buttons: {
                            yes: {
                                label: game.i18n.localize('abfalter.yes'),
                                callback: () => {
                                    this.actor.deleteEmbeddedDocuments("Item", [element.dataset.itemId]);
                                }
                            },
                            no: {
                                label: game.i18n.localize('abfalter.no')
                            }
                        },
                    }).render(true);
                }
            },
            {
                name: game.i18n.localize("abfalter.displayChat"),
                icon: '<i class="fa-solid fa-message"></i>',
                condition: element => {
                    return element.dataset.canChat !== "false";
                },
                callback: element => {
                    const item = this.actor.items.get(element.dataset.itemId);
                    item.roll();
                }
            },
            {
                name: game.i18n.localize("abfalter.equip"),
                icon: '<i class="fas fa-shield-alt"></i>',
                condition: element => {
                    const item = this.actor.items.get(element.dataset.itemId);
                    return ("equipped" in item.system);
                },
                callback: element => {
                    const item = this.actor.items.get(element.dataset.itemId);
                    element.equipped = !item.system.equipped;
                    item.update({ "system.equipped": element.equipped });
                }
            },
            {
                name: game.i18n.localize("abfalter.toggleActivate"),
                icon: '<i class="fas fa-caret-right"></i>',
                condition: (el) => {
                    const item = this.actor.items.get(el.dataset.itemId);
                    return el.dataset.canEquip !== "false" && item?.type === "kiTechnique";
                },
                callback: (el) => {
                    const item = this.actor.items.get(el.dataset.itemId);
                    if (!item) return;
                    item.update({ "system.active": !item.system?.active });
                }
            },
            {
                name: game.i18n.localize("abfalter.toggle"),
                icon: '<i class="fas fa-caret-right"></i>',
                condition: element => {
                    const item = this.actor.items.get(element.dataset.itemId);
                    return ("toggleItem" in item.system);
                },
                callback: element => {
                    const item = this.actor.items.get(element.dataset.itemId);
                    element.toggleItem = !item.system.toggleItem;
                    item.update({ "system.toggleItem": element.toggleItem });
                }
            },
            {
                name: game.i18n.localize("abfalter.expand"),
                icon: '<i class="fa-solid fa-expand"></i>',
                condition: element => {
                    const item = this.actor.items.get(element.dataset.itemId);
                    return ("expand" in item.system);
                },
                callback: element => {
                    const item = this.actor.items.get(element.dataset.itemId);
                    element.expand = !item.system.expand;
                    item.update({ "system.expand": element.expand });
                }
            }
        ]
        
        return menu;
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

    static #toggleDualBoolButton(ev) {
        ev.preventDefault();
        let value = ev.target.dataset.ability;
        let value2 = ev.target.dataset.ability2;
        const label = ev.target.dataset.label;
        const label2 = ev.target.dataset.label2;
        if (value == "false" && value2 == "false") {
            value = true;
            value2 = false;
        } else if (value == "true" && value2 == "false") {
            value = true;
            value2 = true;
        } else {
            value = false;
            value2 = false;
        }
        this.document.update({ [label]: value, [label2]: value2 });
    }

    static #kiAbilityItemToggle(ev) {
        let itemId = ev.target.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        let value = ev.target.dataset.ability;
        let value2 = ev.target.dataset.ability2;
        if (value == "false" && value2 == "false") {
            value = true;
            value2 = false;
        } else if (value == "true" && value2 == "false") {
            value = true;
            value2 = true;
        } else {
            value = false;
            value2 = false;
        }
        item.update({ "system.bought": value, "system.bought2": value2 });
    }

    static #itemToggleValue(ev) {
        ev.preventDefault();
        const target = ev.target.closest('[data-label][data-ability]');
        if (!target) return;
        let itemId = ev.target.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        const label = target.dataset.label;
        let value = target.dataset.ability;
        value = !(value === 'true');
        item.update({ [label]: value })
    }

    static #toggleElanGift(ev) {
        ev.preventDefault();
        const target = ev.target.closest('[data-label][data-code][data-value]');
        if (!target) return;
        let itemId = ev.target.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        const label = target.dataset.label;
        const key = target.dataset.code;
        let value = target.dataset.value;
        //console.log(`Toggling Elan Gift: ${key} - ${label} - ${value}`);
        value = !(value === 'true');
        return item.update({ [`system.gifts.${key}.${label}`]: value });
    }

    static #onChaRoll(ev) {
        ev.preventDefault();
        const dataset = ev.target.dataset;
        diceFunctions.openModifierDialogue(this.actor, dataset.roll, dataset.label, dataset.type);
    }

    static #onPlainRoll(ev) {
        ev.preventDefault();
        const dataset = ev.target.dataset;
        diceFunctions.openModifierDialogue(this.actor, dataset.roll, dataset.label, dataset.type, dataset.ability);
    }

    static #kiAccuHalf(ev) {
        let value = this.document.system.kiPool.agi.current + (this.document.system.kiPool.agi.accumulating ? Math.max(1, Math.ceil(this.document.system.kiPool.agi.accumTot / 2)) : 0);
        let value2 = this.document.system.kiPool.con.current + (this.document.system.kiPool.con.accumulating ? Math.max(1, Math.ceil(this.document.system.kiPool.con.accumTot / 2)) : 0);
        let value3 = this.document.system.kiPool.dex.current + (this.document.system.kiPool.dex.accumulating ? Math.max(1, Math.ceil(this.document.system.kiPool.dex.accumTot / 2)) : 0);
        let value4 = this.document.system.kiPool.str.current + (this.document.system.kiPool.str.accumulating ? Math.max(1, Math.ceil(this.document.system.kiPool.str.accumTot / 2)) : 0);
        let value5 = this.document.system.kiPool.pow.current + (this.document.system.kiPool.pow.accumulating ? Math.max(1, Math.ceil(this.document.system.kiPool.pow.accumTot / 2)) : 0);
        let value6 = this.document.system.kiPool.wp.current + (this.document.system.kiPool.wp.accumulating ? Math.max(1, Math.ceil(this.document.system.kiPool.wp.accumTot / 2)) : 0);
        this.document.update({
            "system.kiPool.agi.current": value, "system.kiPool.con.current": value2, "system.kiPool.dex.current": value3,
            "system.kiPool.str.current": value4, "system.kiPool.pow.current": value5, "system.kiPool.wp.current": value6
        });
    }
    static #kiAccuFull(ev) {
        let value = this.document.system.kiPool.agi.current + (this.document.system.kiPool.agi.accumulating ? this.document.system.kiPool.agi.accumTot : 0);
        let value2 = this.document.system.kiPool.con.current + (this.document.system.kiPool.con.accumulating ? this.document.system.kiPool.con.accumTot : 0);
        let value3 = this.document.system.kiPool.dex.current + (this.document.system.kiPool.dex.accumulating ? this.document.system.kiPool.dex.accumTot : 0);
        let value4 = this.document.system.kiPool.str.current + (this.document.system.kiPool.str.accumulating ? this.document.system.kiPool.str.accumTot : 0);
        let value5 = this.document.system.kiPool.pow.current + (this.document.system.kiPool.pow.accumulating ? this.document.system.kiPool.pow.accumTot : 0);
        let value6 = this.document.system.kiPool.wp.current + (this.document.system.kiPool.wp.accumulating ? this.document.system.kiPool.wp.accumTot : 0);
        this.document.update({
            "system.kiPool.agi.current": value, "system.kiPool.con.current": value2, "system.kiPool.dex.current": value3,
            "system.kiPool.str.current": value4, "system.kiPool.pow.current": value5, "system.kiPool.wp.current": value6
        });
    }
    static #kiAccuReset(ev) {
        new Dialog({
            title: "Reset Accumulation",
            content: game.i18n.localize('abfalter.accuKiReset'),
            buttons: {
                yes: {
                    label: game.i18n.localize('abfalter.yes'),
                    callback: () => {
                        this.document.update({
                            "system.kiPool.agi.current": 0, "system.kiPool.con.current": 0, "system.kiPool.dex.current": 0,
                            "system.kiPool.str.current": 0, "system.kiPool.pow.current": 0, "system.kiPool.wp.current": 0
                        });
                    }
                },
                no: {
                    label: game.i18n.localize('abfalter.no')
                }
            },
        }).render(true);
    }

    static #createNewItem(ev) {
        ev.preventDefault();
        const type = ev.target.closest("a").dataset.type;
        const ability = ev.target.closest("a").dataset.ability || null;

        const types = {
            "inventory": game.i18n.localize("abfalter.newInventory"),
            "weapon": game.i18n.localize("abfalter.newWeapon"),
            "armor": game.i18n.localize("abfalter.newArmor"),
            "advantage": game.i18n.localize("abfalter.newAdvantage"),
            "spell": game.i18n.localize("abfalter.newSpell"),
            "class": game.i18n.localize("abfalter.newClass"),
            "spellPath": game.i18n.localize("abfalter.newSpellPath"),
            "incarnation": game.i18n.localize("abfalter.newIncarnation"),
            "invocation": game.i18n.localize("abfalter.newInvocation"),
            "currency": game.i18n.localize("abfalter.newCurrency"),
            "proficiency": game.i18n.localize("abfalter.newProficiency"),
            "discipline": game.i18n.localize("abfalter.newDiscipline"),
            "mentalPattern": game.i18n.localize("abfalter.newMentalPattern"),
            "psychicMatrix": game.i18n.localize("abfalter.newPsychicMatrix"),
            "maintPower": game.i18n.localize("abfalter.newMaintPower"),
            "kiSealCreature": game.i18n.localize("abfalter.newKiSealCreature"),
            "kiTechnique": game.i18n.localize("abfalter.newKiTechnique"),
            "martialArt": game.i18n.localize("abfalter.newMartialArt"),
            "arsMagnus": game.i18n.localize("abfalter.newArsMagnus"),
            "elan": game.i18n.localize("abfalter.newElan"),
            "monsterPower": game.i18n.localize("abfalter.newMonsterPower"),
            "ammo": game.i18n.localize("abfalter.newAmmo"),
            "secondary": game.i18n.localize("abfalter.newSecondary"),
            "zeonMaint": game.i18n.localize("abfalter.newTurnMaint"),
            "backgroundInfo": game.i18n.localize("abfalter.newRace"),
            "kiAbility": game.i18n.localize("abfalter.newKiAbility"),
            "default": game.i18n.localize("abfalter.newItem"),
        };
        const name = (types[type] || types["default"]);
        let itemData = {
            name: name,
            type: type
        }

        switch (type) {
            case "advantage":
                itemData.system = {
                    type: ability
                };
                if (ability === "disadvantage") itemData.name = game.i18n.localize("abfalter.newDisadvantage");
                break;
            case "backgroundInfo":
                itemData.system = {
                    type: ability
                };
                if (ability === "bloodBond") itemData.name = game.i18n.localize("abfalter.newBloodBond");
                if (ability === "culturalRoot") itemData.name = game.i18n.localize("abfalter.newCulturalRoot");
                break;
            case "zeonMaint":
                itemData.system = {
                    type: ability
                };
                if (ability === "daily") itemData.name = game.i18n.localize("abfalter.newDailyMaint");
                break;
            case "armor":
                itemData.system = {
                    armorType: ability
                };
                if (ability === "helmet") itemData.name = game.i18n.localize("abfalter.newArmorHelmet");
                break;
            default:
                break;
        }

        return this.actor.createEmbeddedDocuments("Item", [itemData]);
    }

    static #itemToChat(ev) {
        ev.preventDefault();
        let itemId = ev.target.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        const label = $(ev.currentTarget).attr("data-label");

        item.roll(label);
    }

    static #subItemToChat(ev) {
        ev.preventDefault();
        let itemId = ev.target.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        const label = ev.target.closest("[data-label]").dataset.label;

        item.roll(label);
    }

    static #magicAccuHalf(ev) {
        ev.preventDefault();
        const value = ev.target.dataset.ability;
        this.document.update({ "system.maccu.actual": Math.floor(this.document.system.maccu.actual + (value / 1)) });
    }
    static #magicAccuFull(ev) {
        ev.preventDefault();
        const value = ev.target.dataset.ability;
        this.document.update({ "system.maccu.actual": Math.floor(this.document.system.maccu.actual + (value / 1)) });
    }
    static #magicRegenFull(ev) {
        ev.preventDefault();
        const value = ev.target.dataset.ability;
        const max = ev.target.dataset.ability2;
        this.document.update({ "system.zeon.value": Math.min(Math.floor(this.document.system.zeon.value + (value / 1)), max) });
    }
    static #magicRegenActual(ev) {
        ev.preventDefault();
        const value = ev.target.dataset.ability;
        const max = ev.target.dataset.ability2;
        let dailyMaint = this.actor.system.zeon.dailyMaint;
        this.document.update({ "system.zeon.value": Math.min(Math.floor(this.document.system.zeon.value + (value - dailyMaint)), max) });
    }
    static #removeMaint(ev) {
        ev.preventDefault();
        const value = ev.target.dataset.ability;
        this.document.update({ "system.zeon.value": Math.max(0, Math.floor(this.document.system.zeon.value - value)) });
    }

    static #configButton(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        const target = ev.target.closest('[data-ability]');
        const type = target.dataset.ability;
        let app;

        console.log("Config Button Clicked:", type);
        switch (type) {
            case "classManager":
                app = new classManager({ document: this.actor });
                break;
            case "initiative":
                app = new initiativeWindow({ document: this.actor });
                break;
        }
        app?.render(true);
    }

    static #openArcanaSephirah(ev) {
        ev.preventDefault();
        new metaMagicSheet(this.document).render(true);
    }

    static #openDpOffsets(ev) {
        ev.preventDefault();
        actorFunctions.dpOffSetsWindow(this.actor);
    }

    static #onWeaponRoll(ev) {
        ev.preventDefault();
        const dataset = ev.target.dataset;

        switch (dataset.value) {
            case 'weaponAtk':
                diceFunctions.openWeaponProfileDialogue(this.actor, dataset.label, dataset.id, dataset.type, 'attack', 'offensive');
                break;
            case 'weaponDef':
                diceFunctions.openWeaponProfileDialogue(this.actor, dataset.label, dataset.id, dataset.type, 'block', 'defensive');
                break;
            case 'weaponDod':
                diceFunctions.openWeaponProfileDialogue(this.actor, dataset.label, dataset.id, dataset.type, 'dodge', 'defensive');
                break;
            case 'weaponTrap':
                diceFunctions.openMeleeTrapDialogue(this.actor, dataset.label, dataset.id);
                break;
            case 'weaponBreak':
                diceFunctions.openMeleeBreakDialogue(this.actor, dataset.label, dataset.id, dataset.type);
                break;
            default:
                console.log("Error: This weapon roll type does not exist");
                break;
        }
    }

    static async #armoryAddItem(ev) {
        ev.preventDefault();
        let x = await genericDialogs.armoryItemCreationPrompt();
        if (x.itemType === null || x.itemType === "none") return;
        let itemType = x.itemType;
        let name = x.itemName.trim();
        if (name.length === 0) {
            const types = {
                "inventory": game.i18n.localize("abfalter.newLoot"),
                "weapon": game.i18n.localize("abfalter.newWeapon"),
                "armor": game.i18n.localize("abfalter.newEquipment"),
                "ammo": game.i18n.localize("abfalter.newConsumable"),
            };
            name = (types[itemType] || types["default"]);
        }

        let itemData = {
            name: name,
            type: itemType
        }
        
        const [item] = await this.actor.createEmbeddedDocuments("Item", [{
            name,
            type: itemType
        }]);

        item?.sheet?.render(true);

        return item;
    }

    static #increaseQuantity(ev) {
        ev.preventDefault();
        const target = ev.target.closest('[data-label][data-value]');
        if (!target) return;
        let itemId = ev.target.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        const label = target.dataset.label;
        let value = 1;
        if (ev.shiftKey) value *= 10;
        if (ev.ctrlKey) value *= 100;
        let newValue = Math.floor(target.dataset.value) + value;
        return item.update({ [label]: newValue });
    }

    static #decreaseQuantity(ev) {
        ev.preventDefault();
        const target = ev.target.closest('[data-label][data-value]');
        if (!target) return;
        let itemId = ev.target.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        const label = target.dataset.label;
        let value = 1;
        if (ev.shiftKey) value *= 10;
        if (ev.ctrlKey) value *= 100;
        let newValue = Math.floor(target.dataset.value) - value;
        return item.update({ [label]: newValue });
    }

    static #openMenu(ev) {
        ev.preventDefault();
        ui.notifications.info("This menu function is not implemented, eta v1.6.1"); //TODO
    }

    static #ammoWeaponToggle(ev) {
        ev.preventDefault();
        let itemId = ev.target.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        let ability = ev.target.dataset.ability;
        let label = ev.target.dataset.label;
        let value = ev.target.dataset.value;
        ability = !(ability === 'true');
        value = ability ? value : 0;
        item.update({ [label]: ability, 'system.ranged.magSize': value });
    }

    static #openDpCostCalc(ev) {
        ev.preventDefault();

        const classItems = this.actor.items.filter(item => item.type === "class");
        if (classItems.length > 1) {
            ui.notifications.error(game.i18n.localize('abfalter.multiClassError'));
            console.error(game.i18n.localize('abfalter.multiClassError'));
            return;
        }
        const classItem = classItems[0];
        actorFunctions.calculateDpCost(this.actor, classItem._id);
    }

    static #openRestWindow(ev) {
        ev.preventDefault();
        actorFunctions.restOptions(this.actor);
    }

    static #changeSecNums(ev) {
        ev.preventDefault();
        const type = ev.target.dataset.ability;
        switch (type) {
            case "temp":
                actorFunctions.changeSecondaryTemps(this.actor);
                break;
            case "spec":
                actorFunctions.changeSecondarySpecs(this.actor);
                break;
            default:
                break;
        }

    }


    static async #openResolveWindow(ev) {
        ev.preventDefault();
        const result = await genericDialogs.hpShieldCriticalPrompt();
        if (!result) return;

        const actor = this.actor;
        const type = result.type // "damage" | "heal"
        let amount = Number(result.amount) || 0;
        amount = Math.max(0, amount);

        let crit = Number(result.critical) || 0;
        crit = Math.max(0, crit); // crit cannot be negative

        let lpDamage = 0, lpHeal = 0;
        let shieldDamage = 0, shieldHeal = 0;
        let critDmg = 0, bigCritDmg = 0;


        if (type === "damage") {
            let x = amount;
            // Damage to shield first, with overflow to LP
            if (result.pool === "shield") {
                const currentShield = actor.system.shield.value ?? 0;

                if (currentShield >= x) {
                    shieldDamage = x;
                    x = 0;
                } else {
                    shieldDamage = currentShield;
                    x = x - currentShield;
                }
            }

            // Direct LP damage, or splash damage if shield didn't absorb all
            if (result.pool === "health" || x > 0) {
                lpDamage = x;
            }
        } else if (type === "heal") {
            if (result.pool === "shield") {
                shieldHeal = amount;
            } else {
                lpHeal = amount;
            }
        }

        if (crit > 50) {
            bigCritDmg = Math.floor(crit / 2);
            critDmg = Math.floor(crit - bigCritDmg);
        } else {
            critDmg = crit;
        }

        let lpNew = actor.system.lp.value - lpDamage + lpHeal;
        lpNew = Math.min(lpNew, actor.system.lp.max);

        let shieldNew = actor.system.shield.value - shieldDamage + shieldHeal;
        shieldNew = Math.max(0, Math.min(shieldNew, actor.system.shield.max));
        const critNew = actor.system.aamField.crit - critDmg;
        const critBigNew = actor.system.aamField.critBig - bigCritDmg;

        this.document.update({
            "system.lp.value": lpNew,
            "system.shield.value": shieldNew,
            "system.aamField.crit": critNew,
            "system.aamField.critBig": critBigNew
        });
    }
    static async #addExp(ev) {
        ev.preventDefault();
        const result = await genericDialogs.addExpPrompt();
        if (!result) return;
        let amount = Number(result.amount) || 0;
        let newExp = this.actor.system.levelinfo.experience + amount;
        this.document.update({ "system.levelinfo.experience": newExp });
        return;
    }

    static #armorTag(ev) {
        ev.preventDefault();
        let newLabel;
        if (this.document.system.armor.tag === "body") newLabel = "helmet"; else newLabel = "body";
        this.document.update({ "system.armor.tag": newLabel });
    }

    static #rollInitiative(ev) {
        ev.preventDefault();

    }



    /**
     * AE inherited from Draw Steel System
     * 
    */
    prepareActiveEffectCategories() {
        // Define effect header categories
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
        for (const e of this.actor.allApplicableEffects()) {
        if (!e.active) categories.inactive.effects.push(e);
        else if (e.isTemporary) categories.temporary.effects.push(e);
        else categories.passive.effects.push(e);
        }

        // Sort each category
        for (const c of Object.values(categories)) {
        c.effects.sort((a, b) => (a.sort || 0) - (b.sort || 0));
        }
        return categories;
    }

    static async #createActiveEffect(ev, target) {
        const docCls = getDocumentClass(target.dataset.documentClass);
        const docData = {
        name: docCls.defaultName({ type: target.dataset.type, parent: this.actor }),
        };
        // Loop through the dataset and add it to our docData
        for (const [dataKey, value] of Object.entries(target.dataset)) {
        // These data attributes are reserved for the action handling
        if (["action", "documentClass", "renderSheet"].includes(dataKey)) continue;
        // Nested properties use dot notation like `data-system.prop`
        foundry.utils.setProperty(docData, dataKey, value);
        }

        await docCls.create(docData, { parent: this.actor, renderSheet: target.dataset.renderSheet });
    }

    static async #toggleEffect(ev, target) {
        const effect = this._getEmbeddedDocument(target);
        await effect.update({ disabled: !effect.disabled });
    }

    static async #deleteEffect(event, target) {
        const doc = this._getEmbeddedDocument(target);
        await doc.deleteDialog();
    }

    static async #editEffect(event, target) {
        const doc = this._getEmbeddedDocument(target);
        if (!doc) {
            console.error("Could not find document");
            return;
        }
        await doc.sheet.render({ force: true, mode: this._mode });
    }

    async _onDropActiveEffect(event, effect) {
        if (!this.actor.isOwner || !effect) return;
        if (effect.target === this.actor) await this._onSortActiveEffect(event, effect);
        else await super._onDropActiveEffect(event, effect);
    }

    _getEmbeddedDocument(target) {
        const docRow = target.closest("[data-document-class]");
        if (docRow.dataset.documentClass === "Item") {
        return this.actor.items.get(docRow.dataset.itemId);
        } else if (docRow.dataset.documentClass === "ActiveEffect") {
        const parent =
            docRow.dataset.parentId === this.actor.id
            ? this.actor
            : this.actor.items.get(docRow?.dataset.parentId);
        return parent.effects.get(docRow?.dataset.effectId);
        } else return console.warn("Could not find document class");
    }

    async _onSortActiveEffect(event, effect) {
        /** @type {HTMLElement} */
        const dropTarget = event.target.closest("[data-effect-id]");
        if (!dropTarget) return;
        const target = this._getEmbeddedDocument(dropTarget);

        // Don't sort on yourself
        if (effect.uuid === target.uuid) return;

        // Identify sibling items based on adjacent HTML elements
        const siblings = [];
        for (const el of dropTarget.parentElement.children) {
        const siblingId = el.dataset.effectId;
        const parentId = el.dataset.parentId;
        if (
            siblingId &&
            parentId &&
            ((siblingId !== effect.id) || (parentId !== effect.parent.id))
        )
            siblings.push(this._getEmbeddedDocument(el));
        }

        // Perform the sort
        const sortUpdates = foundry.utils.SortingHelpers.performIntegerSort(effect, {
        target,
        siblings,
        });

        // Split the updates up by parent document
        const directUpdates = [];

        const grandchildUpdateData = sortUpdates.reduce((items, u) => {
        const parentId = u.target.parent.id;
        const update = { _id: u.target.id, ...u.update };
        if (parentId === this.actor.id) {
            directUpdates.push(update);
            return items;
        }
        if (items[parentId]) items[parentId].push(update);
        else items[parentId] = [update];
        return items;
        }, {});

        // Effects-on-items updates
        for (const [itemId, updates] of Object.entries(grandchildUpdateData)) {
        await this.actor.items
            .get(itemId)
            .updateEmbeddedDocuments("ActiveEffect", updates);
        }

        // Update on the main actor
        this.actor.updateEmbeddedDocuments("ActiveEffect", directUpdates);
    }
}

/**
 * Class Manager Application
 * Handles the management of character classes for an actor.
 * @extends {abfalterCharacterSheet}
 */
export class classManager extends abfalterCharacterSheet {
    static DEFAULT_OPTIONS = {
        classes: ["classManager", "baseAbfalterV2"],
        position: {
            width: 420
        },
        actions: {
            cmClassManage: this.#manageClassActions,
        }
    };

    static PARTS = {
        config: {
            template: "systems/abfalter/templates/actor/extensions/classManager.hbs",
        }
    };

    get title() {
        return game.i18n.localize("classManager");
    }

    async _preparePartContext(partId, context, options) {
        context = await super._preparePartContext(partId, context, options);
        const actor = this.actor;
        const classItems = actor.items.filter(i => i.type === "class");
        const classless = classItems.length === 0;

        const levelUpAvailable = !classless && context.system.levelinfo.levelUpAvailable;

        let state = "view";
        if (classless) state = "classless";
        else if (levelUpAvailable) state = "levelUp";

        context.system.levelinfo.classManagerState = state;  // "classless" | "levelUp" | "view"

        console.log(context.system.levelinfo.classManagerState);

        return context;
    }

    _openClassCompendiumPicker() { // NOT YET USED ATM
        // Change this to your real pack id (e.g., "world.classes" or "abfalter.classes")
        const PACK_ID = "abfalter.classes";
        const pack = game.packs.get(PACK_ID);

        if (!pack) {
        ui.notifications?.error(game.i18n.format("ABF.ClassManager.PackMissing", { pack: PACK_ID }));
        return;
        }

        // Open the Compendium window so the user can drag-drop a class Item
        pack.render(true);
    }

    static async #manageClassActions(ev) {
        const action = ev.target.dataset.label;
        const itemId = ev.target.dataset.itemId;
        switch (action) {
            case "levelUp":
                ui.notifications?.info(`${game.i18n.localize(`ABF.ClassManager.${action.capitalize()}For`)} ${classId}`);
                console.log(`${action.capitalize()} Class:`, classId);
                break;
            case "view":
                ui.notifications?.info(`${game.i18n.localize(`ABF.ClassManager.${action.capitalize()}For`)} ${classId}`);
                console.log(`${action.capitalize()} Class:`, classId);
                //const item = this.actor.items.get(element.dataset.itemId);
                //item.sheet.render(true);
                break;
            case "delete":
                console.log(`Delete Class:`, itemId);
                const title = game.i18n.localize("abfalter.removeItem");
                const body = `<p>${game.i18n.localize("abfalter.confirmRemPrompt")}</p>`;
                const confirmed = await genericDialogs.confirm(title, body);
                if (!confirmed) break;
                this.actor.deleteEmbeddedDocuments("Item", [itemId]);
                break;
        }
    }

}      

export class initiativeWindow extends abfalterCharacterSheet {
    static DEFAULT_OPTIONS = {
        classes: ["baseAbfalterV2", "initiativeWindow"],
        position: {
            width: 250,
            height: 270
        },
        window: {
            resizable: false
        },
    };

    static PARTS = {
        config: {
            template: "systems/abfalter/templates/actor/extensions/initiative.hbs",
        }
    };

    get title() {
        return game.i18n.localize("abfalter.initiativeWindow");
        
    }
}

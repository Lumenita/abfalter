import * as diceFunctions from "../diceroller.js";
import { metaMagicSheet } from "../helpers/metaMagicSheet.js";
import * as actorFunctions from "../helpers/actorFunctions.js";

export default class abfalterCharacterSheet extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2) {
    static DEFAULT_OPTIONS = {
        tag: "form",
        classes: ["baseAbfalter", "actor"],
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
            itemToggleValue: this.#itemToggleValue,
            itemToggleValueButton: this.#itemToggleValueButton,
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
            ammoWeaponToggle: this.#ammoWeaponToggle,
            weaponThrowQuantity: this.#weaponThrowQuantity,
            ammoQuantity: this.#ammoQuantity,
            openDPCalc: this.#openDpCostCalc,
            changeSecNums: this.#changeSecNums,
            createAE: this.#createActiveEffect,
            toggleAE: this.#toggleEffect,
            deleteAE: this.#deleteEffect,
            editAE: this.#editEffect,
            toggleElanGift: this.#toggleElanGift,
            openRestWindow: this.#openRestWindow
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
            case "armory":
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

        context.document = this.document;
        context.system = this.document.system;
        context.systemFields = this.document.system.schema.fields;
        context.isEditable = this.isEditable;
        context.config = CONFIG.abfalter;

        //Initialize Items
        //Deprecated items in 1.5.3 "disadvantage", "dailyMaint", "turnMaint", armorHelmet
        const itemTypes = [
            "inventory", "weapon", "armor", "armorHelmet", "advantage", "disadvantage",
            "spell", "class", "secondary", "spellPath", "incarnation", "invocation",
            "dailyMaint", "turnMaint", "currency", "proficiency", "discipline",
            "mentalPattern", "psychicMatrix", "maintPower", "kiSealCreature",
            "kiTechnique", "martialArt", "arsMagnus", "elan", "monsterPower", "ammo",
            "zeonMaint", "backgroundInfo"
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
    }

    _itemContextMenu() {
        return [
            {
                name: game.i18n.localize("abfalter.equip"),
                icon: '<i class="fas fa-caret-right"></i>',
                condition: element => {
                    return element.dataset.canEquip !== "false";
                },
                callback: element => {
                    const item = this.actor.items.get(element.dataset.itemId);
                    element.equipped = !item.system.equipped;
                    item.update({ "system.equipped": element.equipped });
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

    static #itemToggleValue(ev) {
        ev.preventDefault();
        let itemId = ev.target.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        const label = ev.target.closest("a").dataset.label;
        let value = ev.target.closest("a").dataset.ability;
        value = !(value === 'true');
        item.update({ [label]: value })
    }

    static #itemToggleValueButton(ev) {
        ev.preventDefault();
        let itemId = ev.target.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        const label = ev.target.dataset.label;
        let value = ev.target.dataset.ability;
        value = !(value === 'true');
        item.update({ [label]: value })
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
            "default": game.i18n.localize("abfalter.newItem"),
            //Deprecated since 1.5.0
            "disadvantage": game.i18n.localize("abfalter.newDisadvantage"),
            "dailyMaint": game.i18n.localize("abfalter.newDailyMaint"),
            "turnMaint": game.i18n.localize("abfalter.newTurnMaint"),
            "armorHelmet": game.i18n.localize("abfalter.newArmorHelmet")
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

    static #kiAccuHalf(ev) {
        let value = this.document.system.kiPool.agi.current + Math.max(1, Math.floor(this.document.system.kiPool.agi.accumTot / 2));
        let value2 = this.document.system.kiPool.con.current + Math.max(1, Math.floor(this.document.system.kiPool.con.accumTot / 2));
        let value3 = this.document.system.kiPool.dex.current + Math.max(1, Math.floor(this.document.system.kiPool.dex.accumTot / 2));
        let value4 = this.document.system.kiPool.str.current + Math.max(1, Math.floor(this.document.system.kiPool.str.accumTot / 2));
        let value5 = this.document.system.kiPool.pow.current + Math.max(1, Math.floor(this.document.system.kiPool.pow.accumTot / 2));
        let value6 = this.document.system.kiPool.wp.current + Math.max(1, Math.floor(this.document.system.kiPool.wp.accumTot / 2));
        this.document.update({
            "system.kiPool.agi.current": value, "system.kiPool.con.current": value2, "system.kiPool.dex.current": value3,
            "system.kiPool.str.current": value4, "system.kiPool.pow.current": value5, "system.kiPool.wp.current": value6
        });
    }

    static #kiAccuFull(ev) {
        let value = this.document.system.kiPool.agi.current + this.document.system.kiPool.agi.accumTot;
        let value2 = this.document.system.kiPool.con.current + this.document.system.kiPool.con.accumTot;
        let value3 = this.document.system.kiPool.dex.current + this.document.system.kiPool.dex.accumTot;
        let value4 = this.document.system.kiPool.str.current + this.document.system.kiPool.str.accumTot;
        let value5 = this.document.system.kiPool.pow.current + this.document.system.kiPool.pow.accumTot;
        let value6 = this.document.system.kiPool.wp.current + this.document.system.kiPool.wp.accumTot;
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

    static #openArcanaSephirah(ev) {
        ev.preventDefault();
        new metaMagicSheet(this.document).render(true);
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

    static #ammoWeaponToggle(ev) {
        ev.preventDefault();
        let itemId = ev.target.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        let ability = ev.target.dataset.ability;
        let label = ev.target.dataset.label;
        let value = ev.target.dataset.value;
        ability = !(ability === 'true');
        value = ability ? value : 0;
        item.update({ [label]: ability });
        item.update({ 'system.ranged.magSize': value });
    }

    static #weaponThrowQuantity(ev) {
        ev.preventDefault();
        let itemId = ev.target.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        let num = parseInt(ev.target.closest("a").dataset.value);
        item.update({ "system.melee.throwQuantity": Math.floor(item.system.melee.throwQuantity + num) });
    }

    static #ammoQuantity(ev) {
        ev.preventDefault();
        let itemId = ev.target.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        let num = parseInt(ev.target.closest("a").dataset.value);
        return item.update({ "system.quantity": Math.floor(item.system.quantity + num) });

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
    static #toggleElanGift(ev) {
        const target = ev.target.closest('[data-label][data-code][data-value]');
        if (!target) return;
        let itemId = ev.target.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        const label = target.dataset.label;
        const key = target.dataset.code;
        let value = target.dataset.value;
        console.log(`Toggling Elan Gift: ${key} - ${label} - ${value}`);
        value = !(value === 'true');
        return item.update({ [`system.gifts.${key}.${label}`]: value });
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


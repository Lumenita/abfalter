import { openSecondaryDiceDialogue } from "../diceroller.js";

export default class abfalterCharacterSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["abfalter", "sheet", "actor"],
            template: "systems/abfalter/templates/actor/actor-sheet.html",
            width: 900,
            height: 950,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
        });
    }

    itemContextMenuEquip = [
        {
            name: game.i18n.localize("abfalter.sheet.equip"),
            icon: '<i class="fas fa-comment"></i>',
            callback: element => {
                const item = this.actor.items.get(element.data("item-id"));
                if (item.data.data.equipped == false) {
                    element.equipped = true;
                } else {
                    element.equipped = false;
                }
                item.update({ "data.equipped": element.equipped });
            }
        },
        {
            name: game.i18n.localize("abfalter.sheet.edit"),
            icon: '<i class="fas fa-edit"></i>',
            callback: element => {
                const item = this.actor.items.get(element.data("item-id"));
                item.sheet.render(true);
            }
        },
        {
            name: game.i18n.localize("abfalter.sheet.delete"),
            icon: '<i class="fas fa-trash"></i>',
            callback: element => {
                this.actor.deleteEmbeddedDocuments("Item", [element.data("item-id")]);
            }
        }

    ]
    itemContextMenu = [
        {
            name: game.i18n.localize("abfalter.sheet.edit"),
            icon: '<i class="fas fa-edit"></i>',
            callback: element => {
                const item = this.actor.items.get(element.data("item-id"));
                item.sheet.render(true);
            }
        },
        {
            name: game.i18n.localize("abfalter.sheet.delete"),
            icon: '<i class="fas fa-trash"></i>',
            callback: element => {
                this.actor.deleteEmbeddedDocuments("Item", [element.data("item-id")]);
            }
        }

    ]
    itemContextMenuDelete = [
        {
            name: game.i18n.localize("abfalter.sheet.delete"),
            icon: '<i class="fas fa-trash"></i>',
            callback: element => {
                this.actor.deleteEmbeddedDocuments("Item", [element.data("item-id")]);
            }
        }

    ]

    getData() {
        const baseData = super.getData();
        let sheetData = {
            owner: this.actor.isOwner,
            editable: this.isEditable,
            actor: baseData.actor,
            data: baseData.actor.data.data,
            config: CONFIG.abfalter
        }

        //Initialize Items
        sheetData.inventories = baseData.items.filter(function (item) { return item.type == "inventory" });
        sheetData.weapons = baseData.items.filter(function (item) { return item.type == "weapon" });
        sheetData.armors = baseData.items.filter(function (item) { return item.type == "armor" });
        sheetData.armorHelmets = baseData.items.filter(function (item) { return item.type == "armorHelmet" });
        sheetData.advantages = baseData.items.filter(function (item) { return item.type == "advantage" });
        sheetData.disadvantages = baseData.items.filter(function (item) { return item.type == "disadvantage" });
        sheetData.spells = baseData.items.filter(function (item) { return item.type == "spell" });
        sheetData.classes = baseData.items.filter(function (item) { return item.type == "class" });
        sheetData.spellPaths = baseData.items.filter(function (item) { return item.type == "spellPath" });
        sheetData.incarnations = baseData.items.filter(function (item) { return item.type == "incarnation" });
        sheetData.invocations = baseData.items.filter(function (item) { return item.type == "invocation" });
        sheetData.metaMagics = baseData.items.filter(function (item) { return item.type == "metaMagic" });
        sheetData.dailyMaints = baseData.items.filter(function (item) { return item.type == "dailyMaint" });
        sheetData.turnMaints = baseData.items.filter(function (item) { return item.type == "turnMaint" });
        sheetData.currencies = baseData.items.filter(function (item) { return item.type == "currency" });
        sheetData.proficiencies = baseData.items.filter(function (item) { return item.type == "proficiency" });
        sheetData.weaponAttacks = baseData.items.filter(function (item) { return item.type == "weaponAttack" });

        return sheetData;
    }

    activateListeners(html) {
        if (this.isEditable) {
            html.find(".item-create").click(this._onItemCreate.bind(this));
            html.find(".inline-edit").change(this._onLineItemEdit.bind(this));
            html.find(".item-edit").click(this._onItemEdit.bind(this));
            html.find(".item-delete").click(this._onItemDelete.bind(this));

            new ContextMenu(html, ".inventory-item", this.itemContextMenu);

            new ContextMenu(html, ".armor-item", this.itemContextMenuEquip);
            new ContextMenu(html, ".armor-item2", this.itemContextMenuEquip);
            new ContextMenu(html, ".armorHelmet-item", this.itemContextMenuEquip);
            new ContextMenu(html, ".armorHelmet-item2", this.itemContextMenuEquip);
            new ContextMenu(html, ".weapon-item", this.itemContextMenuEquip);

            new ContextMenu(html, ".prof-item", this.itemContextMenuDelete);
            new ContextMenu(html, ".currency-item", this.itemContextMenuDelete);
            new ContextMenu(html, ".spellPath-item", this.itemContextMenuDelete);

        }

        if (this.actor.isOwner) {
            html.find(".item-roll").click(this._onItemRoll.bind(this));

            html.find('.maccuHalf').click(ev => {
                const value = $(ev.currentTarget).attr("data-ability");
                this.document.update({ "data.maccu.actual": Math.floor(this.document.data.data.maccu.actual + (value / 1)) });
            });
            html.find('.maccuFull').click(ev => {
                const value = $(ev.currentTarget).attr("data-ability");
                this.document.update({ "data.maccu.actual": Math.floor(this.document.data.data.maccu.actual + (value / 1)) });
            });
            html.find('.mregenFull').click(ev => {
                const value = $(ev.currentTarget).attr("data-ability");
                this.document.update({ "data.zeon.actual": Math.floor(this.document.data.data.zeon.actual + (value / 1)) });
            }); 

            html.find('.rollSecondary').click(ev => {
                let value = $(ev.currentTarget).attr("data-ability");
                let label = $(ev.currentTarget).attr("data-label");
                openSecondaryDiceDialogue(this.actor, value, label);
            });
        }

        super.activateListeners(html);
    }

    _onItemCreate(event) {
        event.preventDefault();
        let element = event.currentTarget;

        let itemData = {
            name: game.i18n.localize("abfalter.sheet.newItem"),
            type: element.dataset.type
        }

        return this.actor.createEmbeddedDocuments("Item", [itemData]);
    }

    _onItemEdit(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);

        item.sheet.render(true);
    }

    _onItemDelete(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        return this.actor.deleteEmbeddedDocuments("Item", [itemId]);
    }

    _onLineItemEdit(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        let field = element.dataset.field;

        return item.update({ [field]: element.value });
    }










    _onItemRoll(event) {
        event.preventDefault();
        const itemId = event.currentTarget.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);

        item.roll();
    }
}


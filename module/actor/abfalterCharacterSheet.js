import * as diceFunctions from "../diceroller.js";
import { metaMagicSheet } from "../helpers/metaMagicSheet.js";
import * as actorFunctions from "../helpers/actorFunctions.js";
import { onManageActiveEffect, prepareActiveEffectCategories } from '../helpers/effects.js';

export default class abfalterCharacterSheet extends ActorSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["abfalter", "sheet", "actor"],
            template: "systems/abfalter/templates/actor/actor-sheet.hbs",
            width: 900,
            height: 950,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
        });
    }

    itemContextMenuEquip = [
        {
            name: game.i18n.localize("abfalter.equip"),
            icon: '<i class="fas fa-caret-right"></i>',
            callback: element => {
                const item = this.actor.items.get(element.data("item-id"));
                element.equipped = !item.system.equipped;
                item.update({ "system.equipped": element.equipped });
            }
        },
        {
            name: game.i18n.localize("abfalter.edit"),
            icon: '<i class="fas fa-edit"></i>',
            callback: element => {
                const item = this.actor.items.get(element.data("item-id"));
                item.sheet.render(true);
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
                                this.actor.deleteEmbeddedDocuments("Item", [element.data("item-id")]);
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
    itemContextMenu = [
        {
            name: game.i18n.localize("abfalter.edit"),
            icon: '<i class="fas fa-edit"></i>',
            callback: element => {
                const item = this.actor.items.get(element.data("item-id"));
                item.sheet.render(true);
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
                                this.actor.deleteEmbeddedDocuments("Item", [element.data("item-id")]);
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
    itemContextMenuDelete = [
        {
            name: game.i18n.localize("abfalter.toggle"),
            icon: '<i class="fas fa-caret-right"></i>',
            callback: element => {
                const item = this.actor.items.get(element.data("item-id"));
                element.toggleItem = !item.system.toggleItem;
                item.update({ "system.toggleItem": element.toggleItem });
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
                                this.actor.deleteEmbeddedDocuments("Item", [element.data("item-id")]);
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
    itemContextMenuOnlyDelete = [
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
                                this.actor.deleteEmbeddedDocuments("Item", [element.data("item-id")]);
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
    getData() {
        const baseData = super.getData();
        let sheetData = {
            owner: this.actor.isOwner,
            editable: this.isEditable,
            actor: baseData.actor,
            system: baseData.actor.system,
            effects: prepareActiveEffectCategories(this.actor.allApplicableEffects()),
            config: CONFIG.abfalter
        }

        //Dropdowns
        sheetData.customSecObjList = CONFIG.abfalter.customSecondaryDropdown;
        sheetData.InnatePowerObjList = CONFIG.abfalter.innatePowerSettingDropdown;
        sheetData.proficiencyObjList = CONFIG.abfalter.proficiencyDropdown;
        sheetData.shieldObjList = CONFIG.abfalter.shieldDropdown;
        sheetData.damageModObjList = CONFIG.abfalter.damageModDropdown;
        sheetData.damageTypeObjList = CONFIG.abfalter.damageTypeDropdown;
        sheetData.damageTypeSpiritObjList = CONFIG.abfalter.damageTypeSpiritDropdown;
        sheetData.martialArtsObjList = CONFIG.abfalter.martialArtsDropdown; //Martial Arts here
        sheetData.kiFrequencyObjList = CONFIG.abfalter.kiFrequencyDropdown; 
        sheetData.kiActionTypeObjList = CONFIG.abfalter.kiActionTypeDropdown; 
        sheetData.actionObjList = CONFIG.abfalter.ActionDropdown; 
        sheetData.yesnoObjList = CONFIG.abfalter.yesnoDropdown; 
        sheetData.MagicTheoryObjList = CONFIG.abfalter.MagicTheoryDropdown; 
        sheetData.spellTypeObjList = CONFIG.abfalter.spellTypeDropdown; 
        sheetData.spellProjObjList = CONFIG.abfalter.spellProjDropdown; 
        sheetData.spellMaintTypeObjList = CONFIG.abfalter.spellMaintTypeDropdown; 
        sheetData.spellBoughtObjList = CONFIG.abfalter.spellBoughtDropdown; 
        sheetData.limitsObjList = CONFIG.abfalter.LimitsDropdown; 
        sheetData.ppotentialObjList = {
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
        sheetData.matrixLevelObjList = {
            1: "1",
            2: "2",
            3: "3"
        }
        sheetData.monsterCharObjList = {
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

        //Initialize Items
        sheetData.inventories = baseData.items.filter(function (item) { return item.type == "inventory" });
        sheetData.weapons = baseData.items.filter(function (item) { return item.type == "weapon" });
        sheetData.armors = baseData.items.filter(function (item) { return item.type == "armor" });
        sheetData.armorHelmets = baseData.items.filter(function (item) { return item.type == "armorHelmet" });
        sheetData.advantages = baseData.items.filter(function (item) { return item.type == "advantage" });
        sheetData.disadvantages = baseData.items.filter(function (item) { return item.type == "disadvantage" });
        sheetData.spells = baseData.items.filter(function (item) { return item.type == "spell" });
        sheetData.classes = baseData.items.filter(function (item) { return item.type == "class" });
        sheetData.secondaries = baseData.items.filter(function (item) { return item.type == "secondary" });
        sheetData.spellPaths = baseData.items.filter(function (item) { return item.type == "spellPath" });
        sheetData.incarnations = baseData.items.filter(function (item) { return item.type == "incarnation" });
        sheetData.invocations = baseData.items.filter(function (item) { return item.type == "invocation" });
        sheetData.dailyMaints = baseData.items.filter(function (item) { return item.type == "dailyMaint" });
        sheetData.turnMaints = baseData.items.filter(function (item) { return item.type == "turnMaint" });
        sheetData.currencies = baseData.items.filter(function (item) { return item.type == "currency" });
        sheetData.proficiencies = baseData.items.filter(function (item) { return item.type == "proficiency" });
        sheetData.weaponAttacks = baseData.items.filter(function (item) { return item.type == "weaponAttack" });
        sheetData.disciplines = baseData.items.filter(function (item) { return item.type == "discipline" });
        sheetData.mentalPatterns = baseData.items.filter(function (item) { return item.type == "mentalPattern" });
        sheetData.psychicMatrixs = baseData.items.filter(function (item) { return item.type == "psychicMatrix" });
        sheetData.maintPowers = baseData.items.filter(function (item) { return item.type == "maintPower" });
        sheetData.kiSealCreatures = baseData.items.filter(function (item) { return item.type == "kiSealCreature" });
        sheetData.kiTechniques = baseData.items.filter(function (item) { return item.type == "kiTechnique" });
        sheetData.martialArts = baseData.items.filter(function (item) { return item.type == "martialArt" });
        sheetData.arsMagnuses = baseData.items.filter(function (item) { return item.type == "arsMagnus" });
        sheetData.elans = baseData.items.filter(function (item) { return item.type == "elan" });
        sheetData.monsterPowers = baseData.items.filter(function (item) { return item.type == "monsterPower" });
        sheetData.ammos = baseData.items.filter(function (item) { return item.type == "ammo" });

        return sheetData;
    }

    activateListeners(html) {
        if (this.isEditable) {
            html.find(".item-create").click(this._onItemCreate.bind(this));
            html.find(".inline-edit").change(this._onLineItemEdit.bind(this));
            html.find(".item-edit").click(this._onItemEdit.bind(this));
            html.find(".item-delete").click(this._onItemDelete.bind(this));
            html.find(".item-expand").click(this._onItemExpand.bind(this));
            html.find(".item-toggle").click(this._onItemToggle.bind(this));
            html.find(".ammoItem-toggle").click(this._ammoItemtoggle.bind(this));

            new ContextMenu(html, ".normal-item", this.itemContextMenu);
            new ContextMenu(html, ".equip-item", this.itemContextMenuEquip);
            new ContextMenu(html, ".delete-item", this.itemContextMenuDelete);
            new ContextMenu(html, ".onlyDelete-item", this.itemContextMenuOnlyDelete);

            $("textarea.textarea-auto-resize").on("input", function () {
                this.nextElementSibling.textContent = this.value;
            });
        }

        if (this.actor.isOwner) {
            html.find('.maccuHalf').click(ev => {
                const value = $(ev.currentTarget).attr("data-ability");
                this.document.update({ "system.maccu.actual": Math.floor(this.document.system.maccu.actual + (value / 1)) });
            });
            html.find('.maccuFull').click(ev => {
                const value = $(ev.currentTarget).attr("data-ability");
                this.document.update({ "system.maccu.actual": Math.floor(this.document.system.maccu.actual + (value / 1)) });
            });
            html.find('.mregenFull').click(ev => {
                let value = $(ev.currentTarget).attr("data-ability");
                let max = $(ev.currentTarget).attr("data-ability2");
                this.document.update({ "system.zeon.value": Math.min(Math.floor(this.document.system.zeon.value + (value / 1)), max) });
            });
            html.find('.mregenActual').click(ev => {
                let value = $(ev.currentTarget).attr("data-ability");
                let max = $(ev.currentTarget).attr("data-ability2");
                let dailyMaint = this.actor.system.zeon.dailyMaint;


                this.document.update({ "system.zeon.value": Math.min(Math.floor(this.document.system.zeon.value + (value - dailyMaint)), max) });
            });
            html.find('.kiAccuHalf').click(ev => {
                let value = this.document.system.kiPool.agi.current + Math.max(1, Math.floor(this.document.system.kiPool.agi.accumTot / 2));
                let value2 = this.document.system.kiPool.con.current + Math.max(1, Math.floor(this.document.system.kiPool.con.accumTot / 2));
                let value3 = this.document.system.kiPool.dex.current + Math.max(1, Math.floor(this.document.system.kiPool.dex.accumTot / 2));
                let value4 = this.document.system.kiPool.str.current + Math.max(1, Math.floor(this.document.system.kiPool.str.accumTot / 2));
                let value5 = this.document.system.kiPool.pow.current + Math.max(1, Math.floor(this.document.system.kiPool.pow.accumTot / 2));
                let value6 = this.document.system.kiPool.wp.current + Math.max(1, Math.floor(this.document.system.kiPool.wp.accumTot / 2));
                this.document.update({
                    "system.kiPool.agi.current": value, "system.kiPool.con.current": value2, "system.kiPool.dex.current": value3,
                    "system.kiPool.str.current": value4, "system.kiPool.pow.current": value5, "system.kiPool.wp.current": value6 });
            });
            html.find('.kiAccuFull').click(ev => {
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
            });
            html.find('.removeMaint').click(ev => {
                let value = $(ev.currentTarget).attr("data-ability");
                this.document.update({ "system.zeon.value": Math.max(0, Math.floor(this.document.system.zeon.value - value)) });
            });
            html.find(".toggleBoolean").click(ev => {
                let value = $(ev.currentTarget).attr("data-ability");
                let label = $(ev.currentTarget).attr("data-label");
                value = !(value === 'true');
                this.document.update({ [label]: value });
            });
            html.find('.wepThrowQ').click(ev => {
                let element = ev.currentTarget;
                let itemId = element.closest(".item").dataset.itemId;
                let item = this.actor.items.get(itemId);                
                let num = parseInt($(ev.currentTarget).attr("data-value"));
                return item.update({ "system.melee.throwQuantity": Math.floor(item.system.melee.throwQuantity + num) });
            });
            html.find('.ammoQ').click(ev => {
                let element = ev.currentTarget;
                let itemId = element.closest(".item").dataset.itemId;
                let item = this.actor.items.get(itemId);                
                let num = parseInt($(ev.currentTarget).attr("data-value"));
                return item.update({ "system.quantity": Math.floor(item.system.quantity + num) });
            });
            html.find(".kiAbility").click(ev => {
                let value = $(ev.currentTarget).attr("data-ability");
                let value2 = $(ev.currentTarget).attr("data-ability2");
                let label = $(ev.currentTarget).attr("data-label");
                let label2 = $(ev.currentTarget).attr("data-label2");
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
            });

            html.find(".changeSecondaryNums").click(this._changeSecNums.bind(this));
            html.find(".openMetaMagic").click(this._openMetaMagic.bind(this));
            html.find(".openDpCostCalc").click(this._openDpCostCalc.bind(this));
            html.find(".spendKiButton").click(this._openSpendKi.bind(this));

            html.find(".item-chat").click(this._onItemChatRoll.bind(this));
            html.find('.rollable').click(this._onRoll.bind(this));
            html.find('.combatRoll').click(this._onAttackRoll.bind(this));
            html.find('.weaponRoll').click(this._onWeaponRoll.bind(this));

            html.on('click', '.effect-control', (ev) => {
                const row = ev.currentTarget.closest('li');
                //Bypass undefined when creating active effect on Actor sheet
                //Im expecting it to cause issues
                //will be looked at if it breaks
                if (row.dataset.parentId === undefined) {
                    row.dataset.parentId = this.actor.id;
                }
                const document = row.dataset.parentId === this.actor.id ? this.actor : this.actor.items.get(row.dataset.parentId);
                onManageActiveEffect(ev, document);
            });
        }

        super.activateListeners(html);
    }

    _onRoll(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;

        diceFunctions.openModifierDialogue(this.actor, dataset.roll, dataset.label, dataset.type);
    }

    _onAttackRoll(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;

        diceFunctions.openModifierDialogue(this.actor, dataset.roll, dataset.label, dataset.type, dataset.ability);
    }

    _onWeaponRoll(event) {
        event.preventDefault();
        const dataset = event.currentTarget.dataset;

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

    _changeSecNums(event) {
        event.preventDefault();
        let element = event.currentTarget;
        const type = element.dataset.ability;

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

    _openDpCostCalc(event) {
        event.preventDefault();
        //TODO if more than 1 class throw error no multi-class calculations
        const classItems = this.actor.items.filter(item => item.type === "class");
        if (classItems.length > 1) {
            ui.notifications.error("Multi-class calculations are not supported.");
            console.error("Error: Multi-class calculations are not supported.");
            return;
        }
        const classItem = classItems[0];
        actorFunctions.calculateDpCost(this.actor, classItem._id);
    }

    _openMetaMagic(event) {
        event.preventDefault();
        new metaMagicSheet(this.document).render(true);
    }

    _openSpendKi(event) {
        event.preventDefault();
        actorFunctions.openSpendKiWindow(this.actor);
    }

    _onItemCreate(event) {
        event.preventDefault();
        let element = event.currentTarget;
        const type = element.dataset.type;

        const types = {
            "inventory": game.i18n.localize("abfalter.newInventory"),
            "weapon": game.i18n.localize("abfalter.newWeapon"),
            "armor": game.i18n.localize("abfalter.newArmor"),
            "armorHelmet": game.i18n.localize("abfalter.newArmorHelmet"),
            "advantage": game.i18n.localize("abfalter.newAdvantage"),
            "disadvantage": game.i18n.localize("abfalter.newDisadvantage"),
            "spell": game.i18n.localize("abfalter.newSpell"),
            "class": game.i18n.localize("abfalter.newClass"),
            "spellPath": game.i18n.localize("abfalter.newSpellPath"),
            "incarnation": game.i18n.localize("abfalter.newIncarnation"),
            "invocation": game.i18n.localize("abfalter.newInvocation"),
            "dailyMaint": game.i18n.localize("abfalter.newDailyMaint"),
            "turnMaint": game.i18n.localize("abfalter.newTurnMaint"),
            "currency": game.i18n.localize("abfalter.newCurrency"),
            "proficiency": game.i18n.localize("abfalter.newProficiency"),
            "weaponAttack": game.i18n.localize("abfalter.newWeaponAttack"),
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
            "default": game.i18n.localize("abfalter.newItem"),
        };
        const name = (types[type] || types["default"]);
        let itemData = {
            name: name,
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

    _onItemExpand(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        element.expand = !item.system.expand;
        item.update({ "system.expand": element.expand });
    }

    _onItemToggle(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        let value = $(event.currentTarget).attr("data-ability");
        let label = $(event.currentTarget).attr("data-label");
        value = !(value === 'true');
        item.update({ [label]: value });
    }

    _ammoItemtoggle(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        let ability = $(event.currentTarget).attr("data-ability");
        let label = $(event.currentTarget).attr("data-label");
        let value = $(event.currentTarget).attr("data-value");
        ability = !(ability === 'true');
        value = ability ? value : 0;
        item.update({ [label]: ability });
        item.update({ 'system.ranged.magSize': value });
    }

    _onItemChatRoll(event) {
        event.preventDefault();
        const itemID = event.currentTarget.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemID);
        let label = $(event.currentTarget).attr("data-label");

        item.roll(label);
    }
}


import { onManageActiveEffect, prepareActiveEffectCategories } from '../helpers/effects.js';
import { abfalterSettingsKeys } from "../utilities/abfalterSettings.js";

export default class abfalterItemSheet extends ItemSheet {

    constructor(...args) {
        super(...args);

        this.options.height = "auto";
    }

    static get defaultOptions() {
        const options = super.defaultOptions;
        foundry.utils.mergeObject(options, {
            classes: ["abfalter", "sheet", "item"],
            width: 575,
            height: 450,
            resizable: true,
            tabs: [{ navSelector: ".sheet-navigation", contentSelector: ".sheet-body", initial: "description" }],
            submitOnClose: true,
            closeOnSubmit: false,
            submitOnChange: true
        });
        return options;
    }

    get template() {
        const path = "systems/abfalter/templates/item";
        return `${path}/${this.item.type}.hbs`;
    }

    getData() {
        const baseData = super.getData();
        let sheetData = {
            owner: this.item.isOwner,
            editable: this.isEditable,
            item: baseData.item,
            system: baseData.item.system,
            effects: prepareActiveEffectCategories(this.item.effects),
            config: CONFIG.abfalter,
        };
        
        if (this.item.type === 'weapon') {
            sheetData.attacks = this.item.system.attacks;
            sheetData.ammoOptions = Object.fromEntries(this.item.system.ranged.ammoIds.map(i => [i.id, i.name]));
        }

        if (this.item.type === 'ammo') {
            sheetData.currencyOptions = Object.fromEntries(this.item.system.priceListIds.map(i => [i.id, i.name]));
        }

        //Dropdowns
        sheetData.monsterTypeObjList = CONFIG.abfalter.MonsterPowerDropdown;
        sheetData.customSecObjList = CONFIG.abfalter.customSecondaryDropdown;
        sheetData.actionObjList = CONFIG.abfalter.ActionDropdown;
        sheetData.yesnoObjList = CONFIG.abfalter.yesnoDropdown; 
        sheetData.martialArtsObjList = CONFIG.abfalter.martialArtsDropdown; //Martial Arts here
        sheetData.kiFrequencyObjList = CONFIG.abfalter.kiFrequencyDropdown;
        sheetData.kiActionTypeObjList = CONFIG.abfalter.kiActionTypeDropdown; 
        sheetData.proficiencyObjList = CONFIG.abfalter.proficiencyDropdown;
        sheetData.shieldObjList = CONFIG.abfalter.shieldDropdown;
        sheetData.damageModObjList = CONFIG.abfalter.damageModDropdown;
        sheetData.damageTypeObjList = CONFIG.abfalter.damageTypeDropdown;
        sheetData.wepDamageTypeObjList = CONFIG.abfalter.wepDamageTypeDropdown; //dmg type w/out spirit
        sheetData.wepDamageTypeSpiritObjList = CONFIG.abfalter.wepDamageTypeSpiritDropdown; //dmg type w/ spirit
        sheetData.spellTypeObjList = CONFIG.abfalter.spellTypeDropdown;
        sheetData.spellProjObjList = CONFIG.abfalter.spellProjDropdown;
        sheetData.spellMaintTypeObjList = CONFIG.abfalter.spellMaintTypeDropdown;
        sheetData.spellBoughtObjList = CONFIG.abfalter.spellBoughtDropdown; 
        sheetData.profileTypeList = CONFIG.abfalter.profileTypeDropdown;
        sheetData.weaponTypeList = CONFIG.abfalter.weaponTypeDropdown;
        sheetData.vorpalAtkList = CONFIG.abfalter.vorpalAtkDropdown;
        sheetData.weightList = CONFIG.abfalter.weightDropdown;
        sheetData.armorTypeList = CONFIG.abfalter.armorTypeDropdown; 
        sheetData.layerTypeList = CONFIG.abfalter.layerTypeDropdown; 

        if (game.settings.get('abfalter', abfalterSettingsKeys.Use_Meters)) {
            sheetData.throwDistanceDropdown = CONFIG.abfalter.metricDistLongDropdown;
        } else {
            sheetData.throwDistanceDropdown = CONFIG.abfalter.imperialDistLongDropdown;
        }

        sheetData.matrixLevelObjList = {
            1: "1",
            2: "2",
            3: "3"
        }
        sheetData.classppBonusObjList = {
            3: "+1 PP /3 lvls",
            2: "+1 PP /2 lvls",
            1: "+1 PP /1 lvls"
        }
        return sheetData;
    }

    activateListeners(html) {
        super.activateListeners(html);

        $("textarea.textarea-auto-resize").on("input", function () {
            this.nextElementSibling.textContent = this.value;
        });

        // Everything below here is only needed if the sheet is editable
        if (!this.isEditable) return;

        html.find(".toggleBoolean").click(ev => {
            let value = $(ev.currentTarget).attr("data-ability");
            let label = $(ev.currentTarget).attr("data-label");
            value = !(value === 'true');
            this.document.update({ [label]: value });
        });

        html.find(".wepAtkToggle").click(async (ev) => {
            const index = $(ev.currentTarget).attr("data-value");
            const label = $(ev.currentTarget).attr("data-label");
            let attacks = this.item.system.attacks;
            attacks[index][label] = !attacks[index][label];
        
            await this.item.update({ "system.attacks": attacks });
        });

        html.on('click', '.effect-control', (ev) => {
            onManageActiveEffect(ev, this.item);
        });

        // Handle adding new attacks
        html.find("#add-attack").click((ev) => {
            ev.preventDefault();
            const attacks = this.item.system.attacks;
            const attackCount = attacks.length;

            const isShield = this.item.system.info?.type === "shield";
            const newAttack = {
                profileType: isShield ? "defensive" : "both",
                wepType: this.item.system.info.type
            }

            attacks[attackCount] = newAttack;
            this.item.update({ "system.attacks": attacks });
        });

        // Handle removing attacks
        html.find(".remove-attack").click((ev) => {
            ev.preventDefault();
            const index = $(ev.currentTarget).attr("data-index");
    
            new Dialog({
                title: "Remove Attack",
                content: game.i18n.localize('abfalter.confirmRemAtkPrompt'),
                buttons: {
                    yes: {
                        label: game.i18n.localize('abfalter.yes'),
                        callback: () => {
                            const attacks = this.item.system.attacks;
                            attacks.splice(index, 1);
                            this.item.update({ "system.attacks": attacks });
                        }
                    },
                    no: {
                        label: game.i18n.localize('abfalter.no')
                    }
                },
            }).render(true);
        });
    }

    async _updateObject(event, formData) {

        if (this.item.type === 'weapon') {
            let attacks = this.item.system.attacks; 
            for (let [key, value] of Object.entries(formData)) {
                const match = key.match(/attacks\[(\d+)\]\[(\w+)\]$/);
    
                if (match) {
                    const index = match[1]; // Get the index of the attack
                    const field = match[2]; // Get the field (attack, block, etc.)
                    attacks[index][field] = value;
                }
            }
            formData["system.attacks"] = attacks;
            Object.keys(formData).forEach(key => {
                if (/attacks\[\d+\]\[\w+\]/.test(key)) {
                    delete formData[key];
                }
            });
        }
        return super._updateObject(event, formData);
    }
}


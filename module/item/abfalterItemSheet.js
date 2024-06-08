import { onManageActiveEffect, prepareActiveEffectCategories } from '../helpers/effects.js';

export default class abfalterItemSheet extends ItemSheet {

    constructor(...args) {
        super(...args);

        this.options.height = "auto";
    }

    static get defaultOptions() {
        const options = super.defaultOptions;
        foundry.utils.mergeObject(options, {
            classes: ["abfalter", "sheet", "item"],
            width: 500,
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
        return `${path}/${this.item.type}.html`;
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
        sheetData.spellTypeObjList = CONFIG.abfalter.spellTypeDropdown;
        sheetData.spellProjObjList = CONFIG.abfalter.spellProjDropdown;
        sheetData.spellMaintTypeObjList = CONFIG.abfalter.spellMaintTypeDropdown;
        sheetData.spellBoughtObjList = CONFIG.abfalter.spellBoughtDropdown; 

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

        html.on('click', '.effect-control', (ev) => {
            onManageActiveEffect(ev, this.item);
        });

    }
}


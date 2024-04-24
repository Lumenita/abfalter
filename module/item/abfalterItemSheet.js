import { onManageActiveEffect, prepareActiveEffectCategories } from '../helpers/effects.js';

export default class abfalterItemSheet extends ItemSheet {

    constructor(...args) {
        super(...args);

        switch (this.object.type) {
            case "advantage":
            case "disadvantage":
                this.options.height = this.position.height = 350;
                this.options.width = this.position.width = 500;
                break;
            case "armor":
            case "armorHelmet":
                this.options.height = this.position.height = 410;
                break;
            case "arsMagnus":
            case "turnMaint":
            case "dailyMaint":
            case "maintPower":
            case "incarnation":
                this.options.height = this.position.height = 285;
                break;
            case "currency":
                this.options.height = this.position.height = 170;
                break;
            case "discipline":
                this.options.width = this.position.width = 400;
                this.options.height = this.position.height = 155;
                break;
            case "spellPath":
                this.options.height = this.position.height = 195;
                break;
            case "spell":
                this.options.width = this.position.width = 525;
                this.options.height = this.position.height = 800;
                break;
            case "class":
                this.options.width = this.position.width = 525;
                this.options.height = this.position.height = 725;
                break;
            case "mentalPattern":
                this.options.height = this.position.height = 470;
                break;
            case "psychicMatrix":
                this.options.height = this.position.height = 565;
                break;
            case "elan":
                this.options.width = this.position.width = 530;
                this.options.height = this.position.height = 625;
                break;
            case "weapon":
                this.options.width = this.position.width = 550;
                this.options.height = this.position.height = 615;
                break;
            case "inventory":
                this.options.height = this.position.height = 375;
                break;
            case "kiTechnique":
                this.options.width = this.position.width = 550;
                this.options.height = this.position.height = 375;
                break;
            case "proficiency":
                this.options.height = this.position.height = 310;
                break;
            case "martialArt":
                this.options.height = this.position.height = 320;
                break;
            case "kiSealCreature":
                this.options.height = this.position.height = 350;
                break;
            default:
                this.options.height = this.position.height = 400;
                break;
        }
    }

    static get defaultOptions() {
        const options = super.defaultOptions;
        mergeObject(options, {
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
            data: baseData.item.system,
            effects: prepareActiveEffectCategories(this.item.effects),
            config: CONFIG.abfalter,
        };
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


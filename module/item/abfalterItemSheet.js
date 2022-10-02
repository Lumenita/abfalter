export default class abfalterItemSheet extends ItemSheet {

    constructor(...args) {
        super(...args);

        switch (this.object.type) {
            case "advantage":
                this.options.height = this.position.height = 750;
                this.options.width = this.position.width = 500;
                break;
            case "mentalPattern":
                this.options.height = this.position.height = 500;
                break;
            case "psychicMatrix":
                this.options.height = this.position.height = 550;
                break;
            default:
                this.options.height = this.position.height = 400;
                break;
        }
    }


    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["abfalter", "sheet", "item"],
            width: 500,
            height: 450,
            resizable: true,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
        });
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
            config: CONFIG.abfalter
        };
        return sheetData;
    }

    activateListeners(html) {
        html.find(".toggleBoolean").click(ev => {
            let value = $(ev.currentTarget).attr("data-ability");
            let label = $(ev.currentTarget).attr("data-label");
            if (value == "false") {
                value = true;
            } else {
                value = false;
            }
            this.document.update({ [label]: value });
        });
    }
}
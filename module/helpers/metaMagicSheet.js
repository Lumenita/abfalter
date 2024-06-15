export class metaMagicSheet extends ActorSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["abfalter"],
            template: "systems/abfalter/templates/actor/parts/metaMagic.html",
            width: 1300,
            height: 950
        });
    }
    getData() {
        const baseData = super.getData();
        let sheetData = {
            owner: this.actor.isOwner,
            editable: this.isEditable,
            actor: baseData.actor,
            system: baseData.actor.system,
            config: CONFIG.abfalter
        }
        return sheetData;
    }
    activateListeners(html) {
        if (this.actor.isOwner) {
            html.find(".bubble").click(ev => {
                let value = $(ev.currentTarget).attr("data-ability");
                let value2 = $(ev.currentTarget).attr("data-ability2");
                let label = $(ev.currentTarget).attr("data-label");
                let label2 = $(ev.currentTarget).attr("data-label2");
                let cost = $(ev.currentTarget).attr("data-value");
                if (value == "false" && value2 == "false") {
                    value = true;
                    value2 = false;
                    cost = ~~cost;
                } else if (value == "true" && value2 == "false") {
                    value = true;
                    value2 = true;
                    cost = ~~-cost;
                } else {
                    value = false;
                    value2 = false;
                    cost = 0;
                }

                this.document.update({ [label]: value, [label2]: value2, "system.metaMagic.cost": this.document.system.metaMagic.cost + cost });
            });
        }
    }
}
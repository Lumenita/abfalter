export default class abfalterItem extends Item {
    prepareData() {
        super.prepareData();

        let functionName = `prepare${this.type[0].toUpperCase() + this.type.slice(1, this.type.length)}`
        if (this[`${functionName}`])
            this[`${functionName}`]()
    }

    prepareArmor() {
        this.system.qualityValue = Math.floor(this.system.quality / 5);
        this.system.newPresence = Math.floor(+(this.system.qualityValue * 50) + +this.system.presence);
        this.system.newFortitude = Math.floor(+(this.system.qualityValue * 10) + +this.system.fortitude);
        this.system.newReq = Math.floor(+this.system.requirement - +(this.system.qualityValue * 5));
        if (this.system.newReq > 0) {
            this.system.newRequirement = this.system.newReq;
        } else {
            this.system.newRequirement = 0;
        };
        this.system.newNatPen = Math.floor(+this.system.natPenalty - +(this.system.qualityValue * 5));
        if (this.system.newNatPen > 0) {
            this.system.newNatPenalty = this.system.newNatPen;
        } else {
            this.system.newNatPenalty = 0;
        };
        this.system.newMovePen = Math.floor(+this.system.movePenalty - +this.system.qualityValue);
        if (this.system.newMovePen > 0) {
            this.system.newMovePenalty = this.system.newMovePen;
        } else {
            this.system.newMovePenalty = 0;
        };
        this.system.AT.newCut = Math.floor(+this.system.AT.cut + +this.system.qualityValue);
        this.system.AT.newImp = Math.floor(+this.system.AT.imp + +this.system.qualityValue);
        this.system.AT.newThr = Math.floor(+this.system.AT.thr + +this.system.qualityValue);
        this.system.AT.newHeat = Math.floor(+this.system.AT.heat + +this.system.qualityValue);
        this.system.AT.newCold = Math.floor(+this.system.AT.cold + +this.system.qualityValue);
        this.system.AT.newEle = Math.floor(+this.system.AT.ele + +this.system.qualityValue);
        this.system.AT.newEne = Math.floor(+this.system.AT.ene + +this.system.qualityValue);
        this.system.AT.newSpt = Math.floor(+this.system.AT.spt + +this.system.qualityValue);

        if (this.parent != null) {
            if (this.parent) {
                this.system.spiritHomebrew = this.parent.system.toggles.spiritDamageType;
            }
        }
    }

    prepareArmorHelmet() {
        this.system.qualityValue = Math.floor(this.system.quality / 5);
        this.system.newPresence = Math.floor(+(this.system.qualityValue * 50) + +this.system.presence);
        this.system.newFortitude = Math.floor(+(this.system.qualityValue * 10) + +this.system.fortitude);
        this.system.newReq = Math.floor(+this.system.requirement - +(this.system.qualityValue * 5));
        if (this.system.newReq > 0) {
            this.system.newRequirement = this.system.newReq;
        } else {
            this.system.newRequirement = 0;
        };
        this.system.newNatPen = Math.floor(+this.system.natPenalty - +(this.system.qualityValue * 5));
        if (this.system.newNatPen > 0) {
            this.system.newNatPenalty = this.system.newNatPen;
        } else {
            this.system.newNatPenalty = 0;
        };
        this.system.AT.newCut = Math.floor(+this.system.AT.cut + +this.system.qualityValue);
        this.system.AT.newImp = Math.floor(+this.system.AT.imp + +this.system.qualityValue);
        this.system.AT.newThr = Math.floor(+this.system.AT.thr + +this.system.qualityValue);
        this.system.AT.newHeat = Math.floor(+this.system.AT.heat + +this.system.qualityValue);
        this.system.AT.newCold = Math.floor(+this.system.AT.cold + +this.system.qualityValue);
        this.system.AT.newEle = Math.floor(+this.system.AT.ele + +this.system.qualityValue);
        this.system.AT.newEne = Math.floor(+this.system.AT.ene + +this.system.qualityValue);
        this.system.AT.newSpt = Math.floor(+this.system.AT.spt + +this.system.qualityValue);

        if (this.parent != null) {
            if (this.parent) {
                this.system.spiritHomebrew = this.parent.system.toggles.spiritDamageType;
            }
        }
    }

    prepareMentalPattern() {
        if (this.system.toggle == true) {
            this.system.finalCost = Math.floor(+this.system.cost + +this.system.cancelCost);
        } else {
            this.system.finalCost = this.system.cost;
        }
    }

    preparePsychicMatrix() {

        if (this.parent != null) {
            if (this.parent) {
                this.system.type = this.parent.system.other.moduleStatus;
                this.system.newPotential = +this.parent.system.finalPotential + +this.system.bonus;
            }
        }
    }

    prepareKiTechnique() {
        if (this.parent != null) {
            if (this.parent) {
                this.system.unified = this.parent.system.toggles.unifiedPools;
                this.system.innatePower = this.parent.system.toggles.innatePower;
            }
        }
    }










    chatTemplate = {
        "spell": "systems/abfalter/templates/item/spell.html",
    }

    async roll() {
        let chatData = {
            user: game.user.id,
            speaker: ChatMessage.getSpeaker(),
        };

        let cardData = {
            ...this.data,
            owner: this.actor.id
        };

        chatData.content = await renderTemplate(this.chatTemplate[this.type], cardData);

        chatData.roll = true;

        return ChatMessage.create(chatData);
    }


}
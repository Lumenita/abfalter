export default class abfalterItem extends Item {
    prepareData() {
        super.prepareData();

        let functionName = `prepare${this.type[0].toUpperCase() + this.type.slice(1, this.type.length)}`
        if (this[`${functionName}`])
            this[`${functionName}`]()
    }

    prepareArmor() {
        this.data.data.qualityValue = Math.floor(this.data.data.quality / 5);
        this.data.data.newPresence = Math.floor(+(this.data.data.qualityValue * 50) + +this.data.data.presence);
        this.data.data.newFortitude = Math.floor(+(this.data.data.qualityValue * 10) + +this.data.data.fortitude);
        this.data.data.newReq = Math.floor(+this.data.data.requirement - +(this.data.data.qualityValue * 5));
        if (this.data.data.newReq > 0) {
            this.data.data.newRequirement = this.data.data.newReq;
        } else {
            this.data.data.newRequirement = 0;
        };
        this.data.data.newNatPen = Math.floor(+this.data.data.natPenalty - +(this.data.data.qualityValue * 5));
        if (this.data.data.newNatPen > 0) {
            this.data.data.newNatPenalty = this.data.data.newNatPen;
        } else {
            this.data.data.newNatPenalty = 0;
        };
        this.data.data.newMovePen = Math.floor(+this.data.data.movePenalty - +this.data.data.qualityValue);
        if (this.data.data.newMovePen > 0) {
            this.data.data.newMovePenalty = this.data.data.newMovePen;
        } else {
            this.data.data.newMovePenalty = 0;
        };
        this.data.data.AT.newCut = Math.floor(+this.data.data.AT.cut + +this.data.data.qualityValue);
        this.data.data.AT.newImp = Math.floor(+this.data.data.AT.imp + +this.data.data.qualityValue);
        this.data.data.AT.newThr = Math.floor(+this.data.data.AT.thr + +this.data.data.qualityValue);
        this.data.data.AT.newHeat = Math.floor(+this.data.data.AT.heat + +this.data.data.qualityValue);
        this.data.data.AT.newCold = Math.floor(+this.data.data.AT.cold + +this.data.data.qualityValue);
        this.data.data.AT.newEle = Math.floor(+this.data.data.AT.ele + +this.data.data.qualityValue);
        this.data.data.AT.newEne = Math.floor(+this.data.data.AT.ene + +this.data.data.qualityValue);
        this.data.data.AT.newSpt = Math.floor(+this.data.data.AT.spt + +this.data.data.qualityValue);
    }

    prepareArmorHelmet() {
        this.data.data.qualityValue = Math.floor(this.data.data.quality / 5);
        this.data.data.newPresence = Math.floor(+(this.data.data.qualityValue * 50) + +this.data.data.presence);
        this.data.data.newFortitude = Math.floor(+(this.data.data.qualityValue * 10) + +this.data.data.fortitude);
        this.data.data.newReq = Math.floor(+this.data.data.requirement - +(this.data.data.qualityValue * 5));
        if (this.data.data.newReq > 0) {
            this.data.data.newRequirement = this.data.data.newReq;
        } else {
            this.data.data.newRequirement = 0;
        };
        this.data.data.newNatPen = Math.floor(+this.data.data.natPenalty - +(this.data.data.qualityValue * 5));
        if (this.data.data.newNatPen > 0) {
            this.data.data.newNatPenalty = this.data.data.newNatPen;
        } else {
            this.data.data.newNatPenalty = 0;
        };
        this.data.data.AT.newCut = Math.floor(+this.data.data.AT.cut + +this.data.data.qualityValue);
        this.data.data.AT.newImp = Math.floor(+this.data.data.AT.imp + +this.data.data.qualityValue);
        this.data.data.AT.newThr = Math.floor(+this.data.data.AT.thr + +this.data.data.qualityValue);
        this.data.data.AT.newHeat = Math.floor(+this.data.data.AT.heat + +this.data.data.qualityValue);
        this.data.data.AT.newCold = Math.floor(+this.data.data.AT.cold + +this.data.data.qualityValue);
        this.data.data.AT.newEle = Math.floor(+this.data.data.AT.ele + +this.data.data.qualityValue);
        this.data.data.AT.newEne = Math.floor(+this.data.data.AT.ene + +this.data.data.qualityValue);
        this.data.data.AT.newSpt = Math.floor(+this.data.data.AT.spt + +this.data.data.qualityValue);
    }













    chatTemplate = {
        "spell": "systems/abfalter/templates/item/spell.html",
    }

    async roll() {
        let chatData = {
            user: game.user.id,
            speaker: ChatMessage.getSpeaker()
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
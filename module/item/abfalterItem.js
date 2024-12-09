import { abfalterSettingsKeys } from "../utilities/abfalterSettings.js";

export default class abfalterItem extends Item {

    prepareData() {
        let functionName = `prepare${this.type[0].toUpperCase() + this.type.slice(1, this.type.length)}`
        if (this[`${functionName}`])
            this[`${functionName}`]()
        super.prepareData();
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

        //Global Setting
        this.system.spiritHomebrew = game.settings.get('abfalter', abfalterSettingsKeys.Spirit_Damage);
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

        //Global Setting
        this.system.spiritHomebrew = game.settings.get('abfalter', abfalterSettingsKeys.Spirit_Damage);
    }

    prepareWeapon() {
        //Global Setting
        this.system.spiritHomebrew = game.settings.get('abfalter', abfalterSettingsKeys.Spirit_Damage);

        //Inherit from Actor
        if (this.parent != null) {
            this.system.derived.baseAtk = Math.floor(this.parent.system.combatValues.attack.final + this.system.attack + this.system.quality);
            this.system.derived.baseBlk = Math.floor(this.parent.system.combatValues.block.final + this.system.block + this.system.quality);
            this.system.derived.baseDod = Math.floor(this.parent.system.combatValues.dodge.final + this.system.dodge);
            if (this.parent.system.kiAbility.kiAuraEx.status == true) {
                this.system.kiBonusBreakage = 5;
                this.system.kiBonusFort = 10;
                this.system.kiBonusDmg = 10;
            }
            if (this.parent.system.kiAbility.kiEleFire.status == true && this.system.primDmgT =="HEAT") {
                this.system.kiBonusDmg += 10;
            }
            if (this.parent.system.kiAbility.kiEleWater.status == true && this.system.primDmgT == "COLD") {
                this.system.kiBonusDmg += 10;
            }
            if (this.parent.system.kiAbility.kiEleAir.status == true && this.system.primDmgT == "ELE") {
                this.system.kiBonusDmg += 10;
            }
            if (this.parent.system.kiAbility.kiEleEarth.status == true && this.system.primDmgT == "IMP") {
                this.system.kiBonusDmg += 10;
            }
            if (this.parent.system.kiAbility.kiEleLight.status == true && this.system.primDmgT == "ENE") {
                this.system.kiBonusDmg += 10;
            }
            if (this.parent.system.kiAbility.kiEleDark.status == true && this.system.primDmgT == "ENE") {
                this.system.kiBonusDmg += 10;
            }
            if (this.parent.system.kiAbility.kiIncreaseDmg.status == true) {
                this.system.kiBonusDmg += 10;
            }
            this.system.info.actorOpenRollRange = this.parent.system.rollRange.final;
            this.system.info.actorFumbleRange = this.parent.system.fumleRange.final;
        } else {
            this.system.derived.baseAtk = Math.floor(this.system.attack + this.system.quality);
            this.system.derived.baseBlk = Math.floor(this.system.block + this.system.quality);
            this.system.derived.baseDod = Math.floor(this.system.dodge);
            this.system.kiBonusBreakage = 0;
            this.system.kiBonusFort = 0;
            this.system.kiBonusDmg = 0;
            this.system.info.actorOpenRollRange = 90;
            this.system.info.actorFumbleRange = 3;
        }

        this.system.derived.finalFortitude = Math.floor(this.system.fortitude + (this.system.quality * 2) + ~~this.system.kiBonusFort);
        this.system.derived.finalPresence = Math.floor(this.system.presence + (this.system.quality * 10));
        this.system.derived.finalWeaponSpeed = Math.floor(this.system.speed + this.system.quality);
        this.system.derived.baseOpenRollRange = Math.floor(this.system.info.actorOpenRollRange - this.system.info.openRollMod);
        this.system.derived.baseFumbleRange = Math.floor(this.system.info.actorFumbleRange + this.system.info.fumbleRollMod + (this.system.info.complex ? 2 : 0));


        //Melee Weapons
        if (this.system.info.type == "melee") {
            //inherit weapon info to Attacks
            for (let i = 0; i < this.system.attacks.length; i++) {
                this.system.attacks[i].parentPrecision = this.system.info.precision;
                this.system.attacks[i].parentVorpal = this.system.info.vorpal;
                this.system.attacks[i].parentTrapping = this.system.melee.trapping;
                this.system.attacks[i].parentThrowable = this.system.melee.throwable;
            }

            if (this.parent != null) {
                switch (this.system.melee.dmgMod) {
                    case "agi":
                        this.system.melee.bonusDmgMod = this.parent.system.stats.Agility.mod;
                        break;
                    case "con":
                        this.system.melee.bonusDmgMod = this.parent.system.stats.Constitution.mod;
                        break;
                    case "str":
                        this.system.melee.bonusDmgMod = this.parent.system.stats.Strength.mod;
                        break;
                    case "dex":
                        this.system.melee.bonusDmgMod = this.parent.system.stats.Dexterity.mod;
                        break;
                    case "per":
                        this.system.melee.bonusDmgMod = this.parent.system.stats.Perception.mod;
                        break;
                    case "int":
                        this.system.melee.bonusDmgMod = this.parent.system.stats.Intelligence.mod;
                        break;
                    case "pow":
                        this.system.melee.bonusDmgMod = this.parent.system.stats.Power.mod;
                        break;
                    case "wp":
                        this.system.melee.bonusDmgMod = this.parent.system.stats.Willpower.mod;
                        break;
                    case "str2":
                        this.system.melee.bonusDmgMod = Math.floor(~~this.parent.system.stats.Strength.mod * 2);
                        break;
                    case "presence":
                        this.system.melee.bonusDmgMod = Math.floor((~~this.parent.system.levelinfo.presence * 2) + this.parent.system.stats.Power.mod);
                        break;
                    case "none":
                        this.system.melee.bonusDmgMod = 0;
                        break;
                    default:
                        break;
                }
                switch (this.parent.system.stats.Strength.final) {
                    case 8:
                    case 9:
                        this.system.breakageStr = 1;
                        break;
                    case 10:
                        this.system.breakageStr = 2;
                        break;
                    case 11:
                    case 12:
                        this.system.breakageStr = 4;
                        break;
                    case 13:
                    case 14:
                        this.system.breakageStr = 6;
                        break;
                    default:
                        this.system.breakageStr = 0;
                        break;
                }
                if (this.parent.system.stats.Strength.final >= 15) {
                    this.system.breakageStr = 8;
                }
            } else {
                this.system.melee.bonusDmgMod = 0;
                this.system.breakageStr = 0;
            }
            if (this.system.melee.twoHanded == true) {
                this.system.melee.bonusDmgMod = Math.floor(this.system.melee.bonusDmgMod * 2);
            }
            this.system.melee.baseDmg = Math.floor(~~this.system.baseDmg + ~~this.system.melee.bonusDmgMod + (~~this.system.quality * 2) + ~~this.system.kiBonusDmg);
            this.system.melee.finalATPen = Math.floor(~~this.system.atPen + Math.floor(~~this.system.quality / 5));
            this.system.melee.finalBreakage = Math.floor(~~this.system.breakage + ~~this.system.breakageStr + ~~this.system.quality + ~~this.system.kiBonusBreakage);          

            for (let i = 0; i < this.system.attacks.length; i++) {
                this.system.attacks[i].finalAttack = this.system.attacks[i].attack + this.system.derived.baseAtk;
                this.system.attacks[i].finalBlock = this.system.attacks[i].block + this.system.derived.baseBlk;
                this.system.attacks[i].finalDodge = this.system.attacks[i].dodge + this.system.derived.baseDod;
                this.system.attacks[i].finalAtPen = this.system.attacks[i].atPen + this.system.melee.finalATPen;
                this.system.attacks[i].finalBreakage = this.system.attacks[i].breakage + this.system.melee.finalBreakage;
                this.system.attacks[i].finalDamage = this.system.attacks[i].damage + this.system.melee.baseDmg;
            }
        }

        /*
        switch (this.system.shield) {
            case "none":
                this.system.shieldBonus = 0;
                this.system.shieldBonus2 = 0;
                this.system.shieldTypeSpeed = 0;
                break;
            case "buckler":
                this.system.shieldBonus = 10;
                this.system.shieldBonus2 = 5;
                this.system.shieldTypeSpeed = -15;
                break;
            case "shield":
                this.system.shieldBonus = 20;
                this.system.shieldBonus2 = 10;
                this.system.shieldTypeSpeed = -25;
                break;
            case "fShield":
                this.system.shieldBonus = 30;
                this.system.shieldBonus2 = 15;
                this.system.shieldTypeSpeed = -40;
                break;
            default:
                break;
        }
        */


    }

    prepareMentalPattern() {
        if (this.system.toggle == true) {
            this.system.finalCost = Math.floor(+this.system.cost + +this.system.cancelCost);
        } else {
            this.system.finalCost = this.system.cost;
        }
    }

    preparePsychicMatrix() {
        if (this.system.maint == "Yes") {
            this.system.maintName = game.i18n.localize('abfalter.yes');
        } else {
            this.system.maintName = game.i18n.localize('abfalter.no');
        }

        if (this.parent != null) {
            if (this.parent) {
                this.system.newPotential = Math.floor(~~this.parent.system.ppotential.final + ~~this.system.bonus);
            }
        }
    }

    prepareKiTechnique() {
        if (this.parent != null) {
            this.system.actor = false;
            if (this.parent) {
                switch (this.system.frequency) {
                    case "action":
                        this.system.frequencyName = game.i18n.localize('abfalter.action');
                        break;
                    case "turn":
                        this.system.frequencyName = game.i18n.localize('abfalter.turn');
                        break;
                    case "variable":
                        this.system.frequencyName = game.i18n.localize('abfalter.variable');
                        break;
                }
                switch (this.system.actionType) {
                    case "attack":
                        this.system.actionTypeName = game.i18n.localize('abfalter.attack');
                        break;
                    case "defense":
                        this.system.actionTypeName = game.i18n.localize('abfalter.defense');
                        break;
                    case "counterAttack":
                        this.system.actionTypeName = game.i18n.localize('abfalter.counterAttack');
                        break;
                    case "variable":
                        this.system.actionTypeName = game.i18n.localize('abfalter.variable');
                        break;
                }

                this.system.actor = true;
                this.system.unified = this.parent.system.toggles.unifiedPools;
                this.system.innatePower = this.parent.system.toggles.innatePower;
                this.system.tag = this.parent.system.kiPool.innate.tag;
            }
        }
    }

    prepareElan() {
        this.system.totalCost = 0;
        if (this.system.level >= 50) {
            this.system.upper = true;
        } else {
            this.system.upper = false;
        }
        for (let [key, gift] of Object.entries(this.system.gifts)) {
            if (this.system.level >= ~~gift.req && ~~gift.req != 0) {
                gift.bought = true;
            } else {
                gift.bought = false;
            }
            if (gift.req != 0) {
                this.system.totalCost += gift.cost;
            }
        }
    }

    prepareClass() {
        this.system.totalPP = Math.floor(~~this.system.main.levels / ~~this.system.main.pp);
    }

    prepareSecondary() {

        if (this.parent != null) {
            this.system.aam = this.parent.system.aamField.final;
            this.system.collapse = this.parent.system.toggles.customSecondary;

            switch (this.system.atr) {
                case "agi":
                    this.system.mod = this.parent.system.stats.Agility.mod;
                    this.system.localizedName = game.i18n.localize('abfalter.agi');
                    break;
                case "con":
                    this.system.mod = this.parent.system.stats.Constitution.mod;
                    this.system.localizedName = game.i18n.localize('abfalter.con');
                    break;
                case "str":
                    this.system.mod = this.parent.system.stats.Strength.mod;
                    this.system.localizedName = game.i18n.localize('abfalter.str');
                    break;
                case "dex":
                    this.system.mod = this.parent.system.stats.Dexterity.mod;
                    this.system.localizedName = game.i18n.localize('abfalter.dex');
                    break;
                case "int":
                    this.system.mod = this.parent.system.stats.Perception.mod;
                    this.system.localizedName = game.i18n.localize('abfalter.int');
                    break;
                case "per":
                    this.system.mod = this.parent.system.stats.Intelligence.mod;
                    this.system.localizedName = game.i18n.localize('abfalter.per');
                    break;
                case "pow":
                    this.system.mod = this.parent.system.stats.Power.mod;
                    this.system.localizedName = game.i18n.localize('abfalter.pow');
                    break;
                case "wp":
                    this.system.mod = this.parent.system.stats.Willpower.mod;
                    this.system.localizedName = game.i18n.localize('abfalter.wp');
                    break;
                default:
                    this.system.mod = 0;
                    this.system.localizedName = game.i18n.localize('abfalter.none');
                    break;
            }
        } else {
            this.system.mod = 0;
            this.system.aam = 0;
            this.system.collapse = false;
        }

        if (this.system.atr == "agi" || this.system.atr == "con" ||
            this.system.atr == "str" || this.system.atr == "dex" ) {
            this.system.tag = "physical";
        } else if (this.system.atr == "per" || this.system.atr == "pow" ||
            this.system.atr == "int" || this.system.atr == "wp") {
            this.system.tag = "mental";
        } else {
            this.system.tag = ""
        }

        this.system.natFinal = Math.floor(this.system.mod + ~~this.system.natural + Math.ceil(this.system.nat * this.system.mod));
        if (this.system.natFinal > 100) {
            this.system.natFinal = 100;
        }
        this.system.finalValue = Math.floor(~~this.system.base + ~~this.system.extra + ~~this.system.spec + ~~this.system.temp + this.system.natFinal + ~~this.system.aam);


    }

    prepareMonsterPower() {
        if (this.parent != null) {
            this.system.shortDescToggle = this.parent.system.toggles.monsterPowerShortDesc;
        } else {
            this.system.shortDescToggle = false;
        }
    }

    chatTemplate = {
        "spell": "systems/abfalter/templates/chatItem/spellChat.html",
        "psychicMatrix": "systems/abfalter/templates/chatItem/psyMatrixChat.html",
        "kiSealCreature": "systems/abfalter/templates/chatItem/kiSealChat.html",
        "kiTechnique": "systems/abfalter/templates/chatItem/kitechChat.html",
        "armor": "systems/abfalter/templates/chatItem/armorChat.html",
        "armorHelmet": "systems/abfalter/templates/chatItem/armorHelmChat.html",
        "weapon": "systems/abfalter/templates/chatItem/weaponChat.html",
        "inventory": "systems/abfalter/templates/chatItem/invChat.html",
    }

    async roll(label) {

        let cardData = {
            ...this,
            owner: this.actor.id,
        };
        cardData.actorName = this.actor.name;

        //Specialized attributes per item
        switch (this.type) {
            case "psychicMatrix":
                cardData.expand = true;
                cardData.diff = "";
                cardData.effect = "";
                break;
            case "spell":
                switch (label) {
                    case "basic":
                        cardData.basic = true;
                        break;
                    case "int":
                        cardData.int = true;
                        break;
                    case "adv":
                        cardData.adv = true;
                        break;
                    case "arc":
                        cardData.arc = true;
                        break;
                    default:
                        cardData.expand = true;
                        break;
                }
                break;
            case "kiTechnique":
                if (cardData.system.use.agi == 0) {
                    cardData.agi = true;
                }
                if (cardData.system.use.con == 0) {
                    cardData.con = true;
                }
                if (cardData.system.use.dex == 0) {
                    cardData.dex = true;
                }
                if (cardData.system.use.str == 0) {
                    cardData.str = true;
                }
                if (cardData.system.use.pow == 0) {
                    cardData.pow = true;
                }
                if (cardData.system.use.wp == 0) {
                    cardData.wp = true;
                }
                break;
            default:
                break;
        }

        let chatData = {
            user: game.user.id,
            speaker: ChatMessage.getSpeaker(),
            flags: { cardData }
        };
        chatData.content = await renderTemplate(this.chatTemplate[this.type], cardData);
        return ChatMessage.create(chatData);
    }


}
import { abfalterSettingsKeys } from "../utilities/abfalterSettings.js";

export default class abfalterItem extends Item {

    prepareData() {
        let functionName = `prepare${this.type[0].toUpperCase() + this.type.slice(1, this.type.length)}`
        if (this[`${functionName}`])
            this[`${functionName}`]()
        super.prepareData();
    }

    prepareArmor() {
        if (this.parent != null) {
            this.system.kiBonusFort = this.parent.system.kiAbility.kiAuraEx.status ? 10 : 0;
        } else {
            this.system.kiBonusFort = 0;
        }

        this.system.qualityValue = Math.floor(this.system.quality / 5);
        this.system.derived.presence = Math.floor(+(this.system.qualityValue * 50) + +this.system.presence); 
        this.system.derived.fortitude = Math.floor(+(this.system.qualityValue * 10) + +this.system.fortitude + this.system.kiBonusFort); 
        this.system.derived.requirement = Math.max(0, Math.floor(+this.system.requirement - +(this.system.qualityValue * 5)));
        this.system.derived.natPenalty = Math.max(0, Math.floor(+this.system.natPenalty - +(this.system.qualityValue * 5)));
        this.system.derived.movePenalty = Math.max(0, Math.floor(+this.system.movePenalty - +this.system.qualityValue));

        this.system.derived.cut = Math.floor(+this.system.AT.cut + +this.system.qualityValue);
        this.system.derived.imp = Math.floor(+this.system.AT.imp + +this.system.qualityValue);
        this.system.derived.thr = Math.floor(+this.system.AT.thr + +this.system.qualityValue);
        this.system.derived.heat = Math.floor(+this.system.AT.heat + +this.system.qualityValue);
        this.system.derived.cold = Math.floor(+this.system.AT.cold + +this.system.qualityValue);
        this.system.derived.ele = Math.floor(+this.system.AT.ele + +this.system.qualityValue);
        this.system.derived.ene = Math.floor(+this.system.AT.ene + +this.system.qualityValue);
        this.system.derived.spt = Math.floor(+this.system.AT.spt + +this.system.qualityValue);

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
        this.system.ranged.ammoIds = [];

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
                this.system.attacks[i].finalAttack = this.system.attacks[i].attack + (this.system.attacks[i].atkOverride ? 0 : this.system.derived.baseAtk);
                this.system.attacks[i].finalBlock = this.system.attacks[i].block + (this.system.attacks[i].blkOverride ? 0 : this.system.derived.baseBlk);
                this.system.attacks[i].finalDodge = this.system.attacks[i].dodge + (this.system.attacks[i].dodOverride ? 0 : this.system.derived.baseDod);
                this.system.attacks[i].finalAtPen = this.system.attacks[i].atPen + this.system.melee.finalATPen;
                this.system.attacks[i].finalBreakage = this.system.attacks[i].breakage + this.system.melee.finalBreakage;
                this.system.attacks[i].finalDamage = this.system.attacks[i].damage + (this.system.attacks[i].dmgOverride ? 0 : this.system.melee.baseDmg);
            }
        }

        //Ranged Weapons
        if (this.system.info.type == "ranged") { 
            this.system.ranged.strOverrideQualValue = Math.floor(this.system.ranged.strOverrideValue + (this.system.quality / 5));

            if (this.parent) {
                for (let i = 0; i < this.system.attacks.length; i++) {
                    this.system.attacks[i].parentPrecision = this.system.info.precision;
                    this.system.attacks[i].parentVorpal = this.system.info.vorpal;
                    this.system.attacks[i].parentRangedInfAmmo = this.system.ranged.infiniteAmmo;
                }

                this.system.ranged.ammoIds = [
                    {id: 0, name: game.i18n.localize('abfalter.none')},
                    ...(this.system.ranged.specialAmmo ? [{id: 'special', name: game.i18n.localize('abfalter.special')}] : []),
                    ...this.parent.items.filter(i => i.type === "ammo").map(i => ({id: i.id, name: i.name}))
                ];

                if (this.system.ranged.selectedAmmo === "special") {
                    this.system.ranged.ammoDamage = this.system.ranged.specialDmg;
                    this.system.ranged.ammoDmgType = this.system.ranged.specialDmgType;
                    this.system.ranged.ammoBreak = this.system.ranged.specialBreak;
                    this.system.ranged.ammoAtPen = this.system.ranged.specialAtPen;
                } else {
                    this.system.ranged.ammoDamage = this.parent.items.get(this.system.ranged.selectedAmmo)?.system.damage || 0;
                    this.system.ranged.ammoDmgType = this.parent.items.get(this.system.ranged.selectedAmmo)?.system.dmgType || 0;
                    this.system.ranged.ammoBreak = this.parent.items.get(this.system.ranged.selectedAmmo)?.system.break || 0;
                    this.system.ranged.ammoAtPen = this.parent.items.get(this.system.ranged.selectedAmmo)?.system.atPen || 0;
                }
                
                if (this.parent.system.secondaryFields.creative.slofhand.final > this.parent.system.combatValues.attack.final) {
                    this.system.ranged.reloadTag = game.i18n.localize('abfalter.slofhand');
                    this.system.ranged.bestReloadValue = this.parent.system.secondaryFields.creative.slofhand.final;
                } else {
                    this.system.ranged.reloadTag = game.i18n.localize('abfalter.attack');
                    this.system.ranged.bestReloadValue = this.parent.system.combatValues.attack.final;
                }

                this.system.ranged.strField = this.parent.system.stats.Strength.final;
            } else {
                this.system.ranged.ammoIds = [
                    {id: 0, name: game.i18n.localize('abfalter.none')},
                    ...(this.system.ranged.specialAmmo ? [{id: 'special', name: game.i18n.localize('abfalter.special')}] : [])
                ];

                this.system.ranged.ammoDamage = 0;
                this.system.ranged.ammoDmgType = 0;
                this.system.ranged.ammoBreak = 0;
                this.system.ranged.ammoAtPen = 0;
                this.system.ranged.bestReloadValue = 0;
                this.system.ranged.reloadTag = game.i18n.localize('abfalter.none');
                this.system.ranged.strField = 0
            }

            this.system.ranged.reloadTimeFinal = Math.floor(this.system.ranged.reloadTime - Math.floor(this.system.ranged.bestReloadValue / 100));
            this.system.ranged.bonusDmgKi = this.system.kiBonusDmg;

            if (this.system.ranged.showStrFields === true){
                switch (this.system.ranged.strOverride) {
                    case true:
                        switch (this.system.ranged.strOverrideQualValue) {
                            case 0:
                                this.system.ranged.strMod = -40;
                                break;
                            case 1:
                                this.system.ranged.strMod = -30;
                                break;
                            case 2:
                                this.system.ranged.strMod = -20;
                                break;
                            case 3:
                                this.system.ranged.strMod = -10;
                                break;
                            case 4:
                                this.system.ranged.strMod = -5;
                                break;
                            case 5:
                                this.system.ranged.strMod = 0;
                                break;
                            case 6:
                            case 7:
                                this.system.ranged.strMod = 5;
                                break;
                            case 8:
                            case 9:
                                this.system.ranged.strMod = 10;
                                break;
                            case 10:
                                this.system.ranged.strMod = 15;
                                break;
                            case 11:
                            case 12:
                                this.system.ranged.strMod = 20;
                                break;
                            case 13:
                            case 14:
                                this.system.ranged.strMod = 25;
                                break;
                            case 15:
                                this.system.ranged.strMod = 30;
                                break;
                            case 16:
                            case 17:
                                this.system.ranged.strMod = 35;
                                break;
                            case 18:
                            case 19:
                                this.system.ranged.strMod = 40;
                                break;
                            case 20:
                                this.system.ranged.strMod = 45;
                                break;
                            case 21:
                            case 22:
                                this.system.ranged.strMod = 50;
                                break;
                            case 23:
                            case 24:
                                this.system.ranged.strMod = 55;
                                break;
                            case 25:
                                this.system.ranged.strMod = 60;
                                break;
                            case 26:
                            case 27:
                                this.system.ranged.strMod = 65;
                                break;
                            case 28:
                            case 29:
                                this.system.ranged.strMod = 70;
                                break;
                            case 30:
                                this.system.ranged.strMod = 75;
                                break;
                            default:
                                this.system.ranged.strMod = -40;
                        }
                        break;
                    case false:
                        this.system.ranged.strMod = this.parent.system.stats.Strength.mod
                        break;
                }
            }

            this.system.ranged.ammoDamageFinal = Math.floor(this.system.ranged.ammoDamage + this.system.ranged.ammoDmgMod + ~~this.system.kiBonusDmg + (this.system.ranged.showStrFields ? this.system.ranged.strMod : 0));
            this.system.ranged.ammoBreakFinal = this.system.ranged.ammoBreak + this.system.ranged.ammoBreakMod;
            this.system.ranged.ammoAtPenFinal = this.system.ranged.ammoAtPen + this.system.ranged.ammoAtPenMod;

            if (this.system.ranged.readyToFire == true) {
                this.system.derived.finalWeaponSpeed = Math.floor(20 + this.system.quality);
            }

            for (let i = 0; i < this.system.attacks.length; i++) {
                this.system.attacks[i].finalAttack = this.system.attacks[i].attack + (this.system.attacks[i].atkOverride ? 0 : this.system.derived.baseAtk);
                this.system.attacks[i].finalBlock = this.system.attacks[i].block + (this.system.attacks[i].blkOverride ? 0 : this.system.derived.baseBlk);
                this.system.attacks[i].finalDodge = this.system.attacks[i].dodge + (this.system.attacks[i].dodOverride ? 0 : this.system.derived.baseDod);

                this.system.attacks[i].finalAtPen = this.system.attacks[i].atPen + this.system.ranged.ammoAtPenFinal;
                this.system.attacks[i].finalBreakage = this.system.attacks[i].breakage + this.system.ranged.ammoBreakFinal;
                this.system.attacks[i].finalDamage = this.system.attacks[i].damage + (this.system.attacks[i].dmgOverride ? 0 : this.system.ranged.ammoDamageFinal);
            }
        }

        //Shield Weapons
        if (this.system.info.type == "shield") {
            switch (this.system.shield.type) {
                case "shieldBuckler":
                    this.system.shield.blockBonus = 10;
                    this.system.shield.dodgeBonus = 5;
                    this.system.shield.speedBonus = -15;
                    break;
                case "shieldNorm":
                    this.system.shield.blockBonus = 20;
                    this.system.shield.dodgeBonus = 10;
                    this.system.shield.speedBonus = -25;
                    break;
                case "shieldTower":
                    this.system.shield.blockBonus = 30;
                    this.system.shield.dodgeBonus = 15;
                    this.system.shield.speedBonus = -40;
                    break;
                default:
                    this.system.shield.blockBonus = 0;
                    this.system.shield.dodgeBonus = 0;
                    this.system.shield.speedBonus = 0;
                    break;
            }
            this.system.derived.finalWeaponSpeed += this.system.shield.speedBonus;
            this.system.derived.baseBlk += this.system.shield.blockBonus;
            this.system.derived.baseDod += this.system.shield.dodgeBonus;

            for (let i = 0; i < this.system.attacks.length; i++) {
                this.system.attacks[i].finalBlock = this.system.attacks[i].block + (this.system.attacks[i].blkOverride ? 0 : this.system.derived.baseBlk);
                this.system.attacks[i].finalDodge = this.system.attacks[i].dodge + (this.system.attacks[i].dodOverride ? 0 : this.system.derived.baseDod);
            }
        }
    }

    prepareAmmo() {
        //Global Setting
        this.system.spiritHomebrew = game.settings.get('abfalter', abfalterSettingsKeys.Spirit_Damage);
        this.system.priceListIds = [];

        if(this.parent != null) {
            this.system.priceListIds = [
                {id: 'cCoin', name: game.i18n.localize('abfalter.cCoin')},
                {id: 'sCoin', name: game.i18n.localize('abfalter.sCoin')},
                {id: 'gCoin', name: game.i18n.localize('abfalter.gCoin')},
                ...this.parent.items.filter(i => i.type === "currency").map(i => ({id: i.id, name: i.name}))
            ];
        } else {
            this.system.priceListIds = [
                {id: 'cCoin', name: game.i18n.localize('abfalter.cCoin')},
                {id: 'sCoin', name: game.i18n.localize('abfalter.sCoin')},
                {id: 'gCoin', name: game.i18n.localize('abfalter.gCoin')}
            ];
        }
        
        this.system.priceTotal = parseFloat((this.system.price * this.system.quantity).toFixed(1));
        this.system.weightTotal = parseFloat((this.system.weight * this.system.quantity).toFixed(1));
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
                    this.system.mod = this.parent.system.stats.Intelligence.mod;
                    this.system.localizedName = game.i18n.localize('abfalter.int');
                    break;
                case "per":
                    this.system.mod = this.parent.system.stats.Perception.mod;
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
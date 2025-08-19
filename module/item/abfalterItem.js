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
        if (game.settings.get('abfalter', abfalterSettingsKeys.CoreExxet_BreakageFortitude)) {
            this.system.derived.fortitude = Math.floor(+(this.system.qualityValue * 5) + +this.system.fortitude + this.system.kiBonusFort);
        } else {
            this.system.derived.fortitude = Math.floor(+(this.system.qualityValue * 10) + +this.system.fortitude + this.system.kiBonusFort);
        }
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

    prepareWeapon() {
        //Global Setting
        this.system.spiritHomebrew = game.settings.get('abfalter', abfalterSettingsKeys.Spirit_Damage);
        this.system.ranged.ammoIds = [];

        //Inherit from Actor
        if (this.parent != null) {
            const parent = this.parent;
            const parentStats = parent.system.stats;
            const parentCombat = parent.system.combatValues;
            const ki = parent.system.kiAbility;
            
            // Derived Base Values
            this.system.derived.baseAtk = Math.floor(parentCombat.attack.final + this.system.attack + this.system.quality);
            this.system.derived.baseBlk = Math.floor(parentCombat.block.final + this.system.block + this.system.quality);
            this.system.derived.baseDod = Math.floor(parentCombat.dodge.final + this.system.dodge);

            // Ki Bonuses
            this.system.kiBonusBreakage = ki.kiAuraEx.status ? 5 : 0;
            this.system.kiBonusFort = ki.kiAuraEx.status ? 10 : 0;
            this.system.kiBonusDmg = ki.kiAuraEx.status ? 10 : 0;

            const elemBonusMap = {
                "HEAT": ki.kiEleFire.status,
                "COLD": ki.kiEleWater.status,
                "ELE": ki.kiEleAir.status,
                "IMP": ki.kiEleEarth.status,
                "ENE": ki.kiEleLight.status || ki.kiEleDark.status
            };

            if (elemBonusMap[this.system.primDmgT]) this.system.kiBonusDmg += 10;
            if (ki.kiIncreaseDmg.status) this.system.kiBonusDmg += 10;

            // Roll/Fumble Ranges
            this.system.info.actorOpenRollRange = parent.system.rollRange.final;
            this.system.info.actorFumbleRange = parent.system.fumleRange.final;
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

        // ========== Derived Stats ==========
        this.system.derived.finalFortitude = Math.floor(this.system.fortitude + (this.system.quality * 2) + ~~this.system.kiBonusFort);
        this.system.derived.finalPresence = Math.floor(this.system.presence + (this.system.quality * 10));
        this.system.derived.finalWeaponSpeed = Math.floor(this.system.speed + this.system.quality);
        this.system.derived.baseOpenRollRange = Math.floor(this.system.info.actorOpenRollRange - this.system.info.openRollMod);
        this.system.derived.baseFumbleRange = Math.floor(this.system.info.actorFumbleRange + this.system.info.fumbleRollMod + (this.system.info.complex ? 2 : 0));


        // ========== Melee Weapon Setup ==========
        if (this.system.info.type == "melee") {
            //inherit weapon info to Attacks
            for (let [key, attack] of Object.entries(this.system.attacks)) {
                attack.parentPrecision = this.system.info.precision;
                attack.parentVorpal = this.system.info.vorpal;
                attack.parentTrapping = this.system.melee.trapping;
                attack.parentThrowable = this.system.melee.throwable;
            }

            if (this.parent != null) {
                const getMod = stat => this.parent.system.stats[stat]?.mod ?? 0;
                const dmgMods = {
                    agi: getMod('Agility'),
                    con: getMod('Constitution'),
                    str: getMod('Strength'),
                    dex: getMod('Dexterity'),
                    per: getMod('Perception'),
                    int: getMod('Intelligence'),
                    pow: getMod('Power'),
                    wp:  getMod('Willpower'),
                    str2: Math.floor(getMod('Strength') * 2),
                    presence: Math.floor((this.parent.system.levelinfo.presence * 2) + getMod('Power')),
                    none: 0
                };
                this.system.melee.bonusDmgMod = dmgMods[this.system.melee.dmgMod] ?? 0;
                

                const strFinal = this.parent.system.stats.Strength.final;
                if (game.settings.get('abfalter', abfalterSettingsKeys.CoreExxet_BreakageFortitude)) {
                    this.system.breakageStr = 
                        strFinal >= 15 ? 5 :
                        strFinal >= 13 ? 4 :
                        strFinal >= 11 ? 3 :
                        strFinal >= 10 ? 2 :
                        strFinal >= 8  ? 1 : 0;
                } else {
                    this.system.breakageStr = 
                        strFinal >= 15 ? 8 :
                        strFinal >= 13 ? 6 :
                        strFinal >= 11 ? 4 :
                        strFinal >= 10 ? 2 :
                        strFinal >= 8  ? 1 : 0;
                }

            } else {
                this.system.melee.bonusDmgMod = 0;
                this.system.breakageStr = 0;
            }
            if (this.system.melee.twoHanded ) {
                this.system.melee.bonusDmgMod *= 2;
            }
            this.system.melee.baseDmg = Math.floor(~~this.system.baseDmg + ~~this.system.melee.bonusDmgMod + (~~this.system.quality * 2) + ~~this.system.kiBonusDmg);
            this.system.melee.finalATPen = Math.floor(~~this.system.atPen + Math.floor(~~this.system.quality / 5));
            if (game.settings.get('abfalter', abfalterSettingsKeys.CoreExxet_BreakageFortitude)) {
                this.system.melee.finalBreakage = Math.floor(~~this.system.breakage + ~~this.system.breakageStr + (Math.floor(~~this.system.quality / 5) * 2) + ~~this.system.kiBonusBreakage);
            } else {
                this.system.melee.finalBreakage = Math.floor(~~this.system.breakage + ~~this.system.breakageStr + ~~this.system.quality + ~~this.system.kiBonusBreakage);
            }

            for (let attack of Object.values(this.system.attacks)) {
                attack.finalAttack   = attack.attack   + (attack.atkOverride ? 0 : this.system.derived.baseAtk);
                attack.finalBlock    = attack.block    + (attack.blkOverride ? 0 : this.system.derived.baseBlk);
                attack.finalDodge    = attack.dodge    + (attack.dodOverride ? 0 : this.system.derived.baseDod);
                attack.finalAtPen    = attack.atPen    + this.system.melee.finalATPen;
                attack.finalBreakage = attack.breakage + this.system.melee.finalBreakage;
                attack.finalDamage   = attack.damage   + (attack.dmgOverride ? 0 : this.system.melee.baseDmg);
            }
        }

        // ========== Ranged Weapon Setup ==========
        if (this.system.info.type == "ranged") { 
            this.system.ranged.strOverrideQualValue = Math.floor(this.system.ranged.strOverrideValue + (this.system.quality / 5));

            if (this.parent) {
                for (let attack of Object.values(this.system.attacks)) {
                    attack.parentPrecision = this.system.info.precision;
                    attack.parentVorpal = this.system.info.vorpal;
                    attack.parentRangedInfAmmo = this.system.ranged.infiniteAmmo;
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
                    const selected = this.parent.items.get(this.system.ranged.selectedAmmo)?.system;
                    this.system.ranged.ammoDamage = selected?.damage || 0;
                    this.system.ranged.ammoDmgType = selected?.dmgType || 0;
                    this.system.ranged.ammoBreak = selected?.break || 0;
                    this.system.ranged.ammoAtPen = selected?.atPen || 0;
                }
                
                    const reloadUsing = this.parent.system.secondaryFields.creative.slofhand.final > this.parent.system.combatValues.attack.final;
                    this.system.ranged.reloadTag = game.i18n.localize(reloadUsing ? 'abfalter.slofhand' : 'abfalter.attack');
                    this.system.ranged.bestReloadValue = reloadUsing
                        ? this.parent.system.secondaryFields.creative.slofhand.final
                        : this.parent.system.combatValues.attack.final;

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

            for (let attack of Object.values(this.system.attacks)) {
                attack.finalAttack   = attack.attack   + (attack.atkOverride ? 0 : this.system.derived.baseAtk);
                attack.finalBlock    = attack.block    + (attack.blkOverride ? 0 : this.system.derived.baseBlk);
                attack.finalDodge    = attack.dodge    + (attack.dodOverride ? 0 : this.system.derived.baseDod);

                attack.finalAtPen    = attack.atPen    + this.system.ranged.ammoAtPenFinal;
                attack.finalBreakage = attack.breakage + this.system.ranged.ammoBreakFinal;
                attack.finalDamage   = attack.damage   + (attack.dmgOverride ? 0 : this.system.ranged.ammoDamageFinal);
            }
        }

        // ========== Shield Weapon Setup ==========
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

            for (let attack of Object.values(this.system.attacks)) {
                attack.finalBlock = attack.block + (attack.blkOverride ? 0 : this.system.derived.baseBlk);
                attack.finalDodge = attack.dodge + (attack.dodOverride ? 0 : this.system.derived.baseDod);
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
        const sys = this.system;
        sys.maintBool = sys.maintainable === "none" ? false : true;
        sys.unified = this.parent != null ? this.parent.system.toggles.unifiedPools : false;
        sys.innatePower = this.parent != null ? this.parent.system.toggles.innatePower : false;

        const frequencyLabel  = game.i18n.localize('abfalter.frequency');
        const actionTypeLabel = game.i18n.localize('abfalter.actionType');
        let frequencyTypeValue = game.i18n.localize(`abfalter.${sys.frequency}`);
        let actionTypeValue = game.i18n.localize(`abfalter.${sys.actionType}`);
        const tags = [];
        if (String(sys.maintainable).toLowerCase() !== 'none') {
            const mText = game.i18n.localize(`abfalter.` + sys.maintainable);
            tags.push(mText);
        }
        if (sys.combinable) {
            const cText = game.i18n.localize('abfalter.combinable');
            tags.push(cText);
        }
        if (sys.active) {
            const aText = game.i18n.localize('abfalter.active');
            tags.push(aText);
        }
        const left = `${frequencyLabel}: ${frequencyTypeValue}, ${actionTypeLabel}: ${actionTypeValue}`;
        sys.combinedLabel = tags.length ? `${left}, ${tags.join(', ')}` : left;

        for (const [key, val] of Object.entries(sys.use)) {
            if (val > 0) {
                sys.showColumnNumber += 1;
            }
        }
    }

    prepareElan() {
        for (let [key, gift] of Object.entries(this.system.gifts)) {
            if (gift.bought) {
                this.system.totalCost += gift.cost;
                gift.active = this.system.level >= gift.req;
            } else {
                gift.active = false;
            }
        }
        if (this.system.level >= 50) {
            this.system.upper = true;
        } else {
            this.system.upper = false;
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
        "kiTechnique": "systems/abfalter/templates/chatItem/kitechChat.hbs",
        "armor": "systems/abfalter/templates/chatItem/armorChat.html",
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
                cardData.chatDesc = cardData.enrichedDesc;
                console.log(cardData);
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
        chatData.content = await foundry.applications.handlebars.renderTemplate(this.chatTemplate[this.type], cardData);
        return ChatMessage.create(chatData);
    }
}

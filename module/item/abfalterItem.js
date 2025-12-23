import { abfalterSettingsKeys } from "../utilities/abfalterSettings.js";

export default class abfalterItem extends Item {

    prepareData() {
        let functionName = `prepare${this.type[0].toUpperCase() + this.type.slice(1, this.type.length)}`
        if (this[`${functionName}`]) {
            if (this.type === "weapon" || this.type === "armor" || this.type === "inventory" || this.type === "ammo") {
                this.prepareGeneralDetails();
            }
            this[`${functionName}`]()

        }
        super.prepareData();
    }
    /* ---------- Armory Items  ---------- */
    prepareGeneralDetails() {
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

        switch (this.system.priceType) {
            case 'cCoin':
                this.system.priceIcon = 'systems/abfalter/img/currency/copper.png';
                break;
            case 'sCoin':
                this.system.priceIcon = 'systems/abfalter/img/currency/silver.png';
                break;
            case 'gCoin':
                this.system.priceIcon = 'systems/abfalter/img/currency/gold.png';
                break;
            default:
                this.system.priceIcon = this.parent.items.get(this.system.priceType)?.img;
        }
    }

    prepareWeapon() {
        this.system.spiritHomebrew = game.settings.get('abfalter', abfalterSettingsKeys.Spirit_Damage); //Global Setting
        this.system.ranged.ammoIds = [];

        if (this.system.properties.throwable.bool == true || this.system.info.type == "hybrid" || this.system.info.type == "ranged") {
            this.system.distance.usesRange = true;
        } else {
            this.system.distance.usesRange = false;
        }

        if (this.system.properties.vorpal.bool == true || this.system.properties.trapping.bool == true || 
            this.system.properties.throwable.bool == true || this.system.properties.ammunition.bool == true) {
            this.system.info.hasSpecialConditions = true;
        } else {
            this.system.info.hasSpecialConditions = false;
        }

        if (this.parent != null) { 
            const parentCombat = this.parent.system.combatValues;
            const parentStats = this.parent.system.stats;
            const ki = this.parent.system.kiAbility;

            const STAT_KEY_MAP = {
                agi: 'Agility',
                con: 'Constitution',
                str: 'Strength',
                dex: 'Dexterity',
                per: 'Perception',
                int: 'Intelligence',
                pow: 'Power',
                wp:  'WillPower',
                none: null
            };
            const WarningStatFinal = parentStats[STAT_KEY_MAP[this.system.info.reqType]]?.final ?? 0;            
            if (this.system.properties.versatile.bool) {
                if (this.system.info.twoHandedBonus) {
                    this.system.info.reqWarning = WarningStatFinal < this.system.info.reqMod2h;
                } else {
                    this.system.info.reqWarning = WarningStatFinal < this.system.info.reqMod;
                }

            } else {
                this.system.info.reqWarning = WarningStatFinal < this.system.info.reqMod;
            }

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
            this.system.info.actorOpenRollRange = this.parent.system.rollRange.final;
            this.system.info.actorFumbleRange = this.parent.system.fumleRange.final;

            //Reload Time & Rate of Fire
            const reloadUsing = this.parent.system.secondaryFields.creative.slofhand.final > this.parent.system.combatValues.attack.final;
            this.system.ranged.reloadTag = game.i18n.localize(reloadUsing ? 'abfalter.slofhand' : 'abfalter.attack');
            this.system.ranged.bestReloadValue = reloadUsing ? this.parent.system.secondaryFields.creative.slofhand.final : this.parent.system.combatValues.attack.final;

            if (this.system.properties.throwable.bool == true) {
                this.system.melee.rofThrownPerTurn = Math.floor(this.system.ranged.bestReloadValue / this.system.melee.throwableRof);
                this.system.melee.thrownRofDisplay = `${this.system.melee.rofThrownPerTurn} ${game.i18n.localize("abfalter.thrownPerTurn")}`;
                const thownRofCalcPenalty = -10 * (this.system.melee.rofThrownPerTurn - 1);
                this.system.melee.thrownRofCalculationTitle = `${this.system.ranged.bestReloadValue}(${this.system.ranged.reloadTag}) / ${this.system.melee.throwableRof}(${game.i18n.localize("abfalter.rofShort")}) = ${this.system.melee.rofThrownPerTurn}
                    → ${this.system.melee.thrownRofDisplay} (${thownRofCalcPenalty} ${game.i18n.localize("abfalter.penaltySingular")})`; 
            }

            if (this.system.properties.ammunition.bool == true) {
                this.system.ranged.hasMagazine = this.system.ranged.magSizeMax > 0 ? true : false;

                const steps = Math.floor(this.system.ranged.bestReloadValue / 100);
                const baseRT = Number(this.system.ranged.reloadTime ?? 1);
                const effectiveRT = baseRT - steps;

                this.system.ranged.reloadSteps = steps;
                this.system.ranged.reloadTimeEffective = effectiveRT;
                if (effectiveRT >= 1) {
                    this.system.ranged.shotsPerTurn = 1;
                    this.system.ranged.turnsBetweenShots = effectiveRT;
                    this.system.ranged.reloadSpeedPenalty = 0;

                } else {
                    this.system.ranged.shotsPerTurn = 1 - effectiveRT;
                    this.system.ranged.turnsBetweenShots = 1;
                    this.system.ranged.reloadSpeedPenalty = -25 * (this.system.ranged.shotsPerTurn - 1);
                }

                if (effectiveRT >= 1) {
                    this.system.ranged.reloadDisplay = `${this.system.ranged.reloadTimeEffective > 1 ? `${effectiveRT} ${game.i18n.localize("abfalter.turns")}` : `${effectiveRT} ${game.i18n.localize("abfalter.turn")}`} ${game.i18n.localize("abfalter.betweenShots")}`;
                } else {
                    this.system.ranged.reloadDisplay = `${this.system.ranged.shotsPerTurn > 1 ? `${this.system.ranged.shotsPerTurn} ${game.i18n.localize("abfalter.shotsPerTurn")}` : `${this.system.ranged.shotsPerTurn} ${game.i18n.localize("abfalter.shotPerTurn")}`}`;
                }
                // Detailed calculation title
                this.system.ranged.reloadCalculationTitle = `${game.i18n.localize("abfalter.reload")}: ${baseRT} - [${this.system.ranged.bestReloadValue}(${this.system.ranged.reloadTag}) / 100] 
                = ${this.system.ranged.reloadTimeEffective} → ${this.system.ranged.reloadDisplay} (${this.system.ranged.reloadSpeedPenalty} ${game.i18n.localize("abfalter.penaltySingular")})`;

                //system.ranged.magSizeMax
                if (this.system.ranged.hasMagazine) {
                    this.system.ranged.rofShotsPerTurn = Math.floor(this.parent.system.combatValues.attack.final / this.system.ranged.clipRof);
                    this.system.ranged.clipRofDisplay = `${this.system.ranged.rofShotsPerTurn > 1 ? `${this.system.ranged.rofShotsPerTurn} ${game.i18n.localize("abfalter.shotsPerTurn")}` : `${this.system.ranged.rofShotsPerTurn} ${game.i18n.localize("abfalter.shotPerTurn")}`}`;
                    const rofCalcPenalty = -10 * (this.system.ranged.rofShotsPerTurn - 1);
                    this.system.ranged.clipRofCalculationTitle = `${this.parent.system.combatValues.attack.final}(${game.i18n.localize("abfalter.attack")}) / ${this.system.ranged.clipRof}(${game.i18n.localize("abfalter.rofShort")}) = ${this.system.ranged.rofShotsPerTurn}
                     → ${this.system.ranged.clipRofDisplay} (${rofCalcPenalty} ${game.i18n.localize("abfalter.penaltySingular")})`; 
                }
            }

            //Melee Dmg Modifier with custom Char
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
            // Melee Breakage Strength
            const strFinal = this.parent.system.stats.Strength.final;
            this.system.breakageStr = 
                strFinal >= 15 ? 5 :
                strFinal >= 13 ? 4 :
                strFinal >= 11 ? 3 :
                strFinal >= 10 ? 2 :
                strFinal >= 8  ? 1 : 0;

            if (this.system.melee.twoHandedBonusDmg ) {
                this.system.melee.bonusDmgMod *= 2;
            }
        } else {
            this.system.info.reqWarning = false;
            this.system.derived.baseAtk = Math.floor(this.system.attack + this.system.quality);
            this.system.derived.baseBlk = Math.floor(this.system.block + this.system.quality);
            this.system.derived.baseDod = Math.floor(this.system.dodge);
            this.system.kiBonusBreakage = 0;
            this.system.kiBonusFort = 0;
            this.system.kiBonusDmg = 0;
            this.system.info.actorOpenRollRange = 90;
            this.system.info.actorFumbleRange = 3;
            //reload
            this.system.ranged.bestReloadValue = 0;
            this.system.ranged.reloadTag = game.i18n.localize('abfalter.none');
            this.system.ranged.reloadSteps = 0; 
            this.system.ranged.reloadTimeEffective = 0;
            this.system.ranged.shotsPerTurn = 1;
            this.system.ranged.turnsBetweenShots = 1; 
            this.system.ranged.reloadSpeedPenalty = 0;
            this.system.ranged.reloadDisplay = game.i18n.localize("abfalter.dragToActorToCalcReload");
            this.system.ranged.reloadCalculationTitle = game.i18n.localize("abfalter.unknown");
            this.system.melee.rofThrownPerTurn = 0;
            this.system.melee.thrownRofDisplay = game.i18n.localize("abfalter.dragToActorToCalcRof");
            this.system.melee.thrownRofCalculationTitle = game.i18n.localize("abfalter.unknown");
            this.system.melee.bonusDmgMod = 0;
            this.system.breakageStr = 0;
        }


        // ========== Derived Stats ==========
        this.system.derived.finalFortitude = Math.floor(this.system.fortitude + (this.system.quality * 2) + ~~this.system.kiBonusFort);
        this.system.derived.finalPresence = Math.floor(this.system.presence + (this.system.quality * 10));
        this.system.derived.finalWeaponSpeed = Math.floor(this.system.speed + this.system.quality);
        this.system.derived.baseOpenRollRange = Math.floor(this.system.info.actorOpenRollRange - this.system.info.openRollMod);
        this.system.derived.baseFumbleRange = Math.floor(this.system.info.actorFumbleRange + this.system.info.fumbleRollMod + (this.system.info.complex ? 2 : 0));

        // ========== Push Speed ==========
        this.system.pushSpeed.isNegative = this.system.derived.finalWeaponSpeed < 0;
        if (this.system.pushSpeed.isNegative && this.system.melee.dmgMod != "presence") {
            const negMagnitude = Math.abs(this.system.derived.finalWeaponSpeed);
            const charDmg = this.system.melee.bonusDmgMod;
            const maxPush = Math.min(negMagnitude, charDmg);
            let push = Number(this.system.pushSpeed.value ?? 0);
            push = Math.max(0, Math.min(push, maxPush));
            push = Math.round(push / 5) * 5;
            this.system.derived.finalWeaponSpeed = this.system.derived.finalWeaponSpeed + push; // still ≤ 0
            this.system.melee.bonusDmgMod = charDmg - push;
            this.system.pushSpeed.max = maxPush;
            this.system.pushSpeed.applied = push;
        } else {
            this.system.pushSpeed.max = 0;
            this.system.pushSpeed.applied = 0;
            this.system.pushSpeed.value = 0;
        }

        // ========== Melee Stats ==========
        if (this.system.info.type == "melee" || this.system.info.type == "hybrid") { 
            if ( this.system.properties.twoHanded.bool == false && this.system.properties.versatile.bool == false ) {
                // this is a one handed only weapon
                this.system.melee.showVersatileDmgMod = false;
                this.system.melee.twoHandedBonusDmg = false;
            } else if ( this.system.properties.twoHanded.bool == true && this.system.properties.versatile.bool == false ) { 
                // this is a two handed only weapon
                this.system.melee.showVersatileDmgMod = false;
                this.system.melee.twoHandedBonusDmg = true;
            } else {
                // this is a one or two handed weapon depending on button
                this.system.melee.showVersatileDmgMod = true;
            }
        }

        // ========== Ranged Stats ==========
        if (this.system.info.type == "ranged" || this.system.info.type == "hybrid") { 

        }

        // ========== Base Weapon Final Setup ==========
        this.system.derived.meleeAtPen = Math.floor(~~this.system.atPen + Math.floor(~~this.system.quality / 5));
        this.system.derived.meleeBreak = Math.floor(~~this.system.breakage + ~~this.system.breakageStr + (Math.floor(~~this.system.quality / 5) * 2) + ~~this.system.kiBonusBreakage);
        this.system.derived.meleeDmg = Math.floor(~~this.system.baseDmg + ~~this.system.melee.bonusDmgMod + (~~this.system.quality * 2) + ~~this.system.kiBonusDmg);




        // ========== Combined Profile Setup ==========
        /*
        if (this.system.info.type == "melee" || this.system.info.type == "hybrid") { 
            //Inherit weapon properties for per attack overrides
            for (let [key, attack] of Object.entries(this.system.attacks)) { 
                attack.atkType = "melee";
                attack.properties.attack.parent = true;
                attack.properties.block.parent = true;
                attack.properties.dodge.parent = true;
                attack.properties.damage.parent = true;

                attack.properties.precision.parent = this.system.properties.precision.bool;
                attack.properties.vorpal.parent = this.system.properties.vorpal.bool;
                attack.properties.throwable.parent = this.system.properties.throwable.bool;
                attack.properties.trapping.parent = this.system.properties.trapping.bool;
                attack.properties.ammunition.parent = false;
            }
        } else if (this.system.info.type == "ranged") {
            for (let [key, attack] of Object.entries(this.system.attacks)) { 
                attack.atkType = "ranged";
                attack.properties.attack.parent = true;
                attack.properties.block.parent = true;
                attack.properties.dodge.parent = true;
                attack.properties.damage.parent = true;

                attack.properties.precision.parent = this.system.properties.precision.bool;
                attack.properties.vorpal.parent = this.system.properties.vorpal.bool;
                attack.properties.throwable.parent = this.system.properties.throwable.bool;
                attack.properties.trapping.parent = this.system.properties.trapping.bool;
                attack.properties.ammunition.parent = this.system.properties.ammunition.bool;
            }
        } else {

        }*/



        // ========== Melee Weapon Setup ==========
        if (this.system.info.type == "melee") {
            //inherit weapon info to Attacks
            for (let [key, attack] of Object.entries(this.system.attacks)) { //done
                attack.parentPrecision = this.system.properties.precision.bool;
                attack.parentVorpal = this.system.properties.vorpal.bool;
                attack.parentTrapping = this.system.properties.trapping.bool;
                attack.parentThrowable = this.system.properties.throwable.bool;
            }

            for (let attack of Object.values(this.system.attacks)) {
                attack.finalAttack   = attack.attack   + (attack.atkOverride ? 0 : this.system.derived.baseAtk);
                attack.finalBlock    = attack.block    + (attack.blkOverride ? 0 : this.system.derived.baseBlk);
                attack.finalDodge    = attack.dodge    + (attack.dodOverride ? 0 : this.system.derived.baseDod);
                attack.finalAtPen    = attack.atPen    + this.system.derived.meleeAtPen;
                attack.finalBreakage = attack.breakage + this.system.derived.meleeBreak;
                attack.finalDamage   = attack.damage   + (attack.dmgOverride ? 0 : this.system.derived.meleeDmg);
            }
        }

        // ========== Ranged Weapon Setup ==========
        if (this.system.info.type == "ranged") { 
            this.system.ranged.strOverrideQualValue = Math.floor(this.system.ranged.strOverrideValue + (this.system.quality / 5));

            if (this.parent) {
                for (let attack of Object.values(this.system.attacks)) {
                    attack.parentPrecision = this.system.properties.precision.bool;
                    attack.parentVorpal = this.system.properties.vorpal.bool;
                    attack.parentRangedInfAmmo = this.system.ranged.infiniteAmmo;
                }

                this.system.ranged.ammoIds = [
                    {id: 0, name: game.i18n.localize('abfalter.none')},
                    ...(this.system.properties.specialAmmo.bool ? [{id: 'special', name: game.i18n.localize('abfalter.special')}] : []),
                    ...this.parent.items.filter(i => i.type === "ammo"  && i.system.type === "ammo").map(i => ({id: i.id, name: i.name}))
                ];

                if (this.system.ranged.selectedAmmo === "special") {
                    this.system.ranged.ammoAtPen = this.system.ranged.specialAtPen;
                    this.system.ranged.ammoBreak = this.system.ranged.specialBreak;
                    this.system.ranged.ammoDmgType = this.system.ranged.specialDmgType;
                    this.system.ranged.ammoDamage = this.system.ranged.specialDmg;
                } else {
                    const selected = this.parent.items.get(this.system.ranged.selectedAmmo)?.system;
                    this.system.ranged.ammoAtPen = selected?.atPen || 0;
                    this.system.ranged.ammoBreak = selected?.break || 0;
                    this.system.ranged.ammoDmgType = selected?.dmgType || "THR";
                    this.system.ranged.ammoDamage = selected?.damage || 0;
                }
                

                
                this.system.ranged.strField = this.parent.system.stats.Strength.final;
            } else {
                this.system.ranged.ammoIds = [
                    {id: 0, name: game.i18n.localize('abfalter.none')},
                    ...(this.system.ranged.specialAmmo ? [{id: 'special', name: game.i18n.localize('abfalter.special')}] : [])
                ];

                if (this.system.ranged.selectedAmmo === "special") {
                    this.system.ranged.ammoAtPen = this.system.ranged.specialAtPen;
                    this.system.ranged.ammoBreak = this.system.ranged.specialBreak;
                    this.system.ranged.ammoDmgType = this.system.ranged.specialDmgType;
                    this.system.ranged.ammoDamage = this.system.ranged.specialDmg;
                } else { 
                this.system.ranged.ammoAtPen = 0;
                this.system.ranged.ammoBreak = 0;
                this.system.ranged.ammoDmgType = "THR";
                this.system.ranged.ammoDamage = 0;
                }
                this.system.ranged.strField = 0
            }

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
                        this.system.ranged.strMod = this.parent ? this.parent.system.stats.Strength.mod : 0;
                        break;
                }
            }

            this.system.derived.rangedAtPen = this.system.ranged.ammoAtPen + this.system.ranged.ammoAtPenMod;
            this.system.derived.rangedBreak = this.system.ranged.ammoBreak + this.system.ranged.ammoBreakMod;
            this.system.derived.rangedDmg = Math.floor(this.system.ranged.ammoDamage + this.system.ranged.ammoDmgMod + ~~this.system.kiBonusDmg + (this.system.ranged.showStrFields ? this.system.ranged.strMod : 0));

            if (this.system.ranged.useReadyToFire && this.system.ranged.isLoaded) {
                this.system.derived.finalWeaponSpeed = Math.floor(20 + this.system.quality);
            }

            for (let attack of Object.values(this.system.attacks)) {
                attack.finalAttack   = attack.attack   + (attack.atkOverride ? 0 : this.system.derived.baseAtk);
                attack.finalBlock    = attack.block    + (attack.blkOverride ? 0 : this.system.derived.baseBlk);
                attack.finalDodge    = attack.dodge    + (attack.dodOverride ? 0 : this.system.derived.baseDod);

                attack.finalAtPen    = attack.atPen    + this.system.derived.rangedAtPen;
                attack.finalBreakage = attack.breakage + this.system.derived.rangedBreak;
                attack.finalDamage   = attack.damage   + (attack.dmgOverride ? 0 : this.system.derived.rangedDmg);
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

        this.system.descTag = this.system.quality != "" ? `${this.system.quality > 0 ? "+" : ""}${this.system.quality} ` : "";
        this.system.descTag += game.i18n.localize(`abfalter.${this.system.info.type}`);
        this.system.descTag += this.system.rarity != "" ? ` · ${this.system.rarity}` : "";
        if (this.system.info.type == "shield") { 
            this.system.descTag += ` · ${game.i18n.localize('abfalter.' + this.system.shield.type)}`;
        }

        if (this.system.info.type == "hybrid" || this.system.info.type == "melee" || this.system.info.type == "ranged") {
            this.system.descTag += this.system.properties.versatile.bool == false ? this.system.properties.twoHanded.bool == false ? ` · ${game.i18n.localize('abfalter.oneHand')}` : ` · ${game.i18n.localize('abfalter.twoHanded')}`: ` · ${game.i18n.localize('abfalter.versatile')}`;
            this.system.descTag += this.system.properties.precision.bool == false ? "" : ` · ${game.i18n.localize('abfalter.precision')}`;
            this.system.descTag += this.system.properties.vorpal.bool == false ? "" : ` · ${game.i18n.localize('abfalter.vorpal')}`;
            this.system.descTag += this.system.properties.throwable.bool == false ? "" : ` · ${game.i18n.localize('abfalter.throwable')}`;
            if (this.system.properties.throwable.bool == true) this.system.descTag += this.system.melee.returning == false ? "" : ` · ${game.i18n.localize('abfalter.returning')}`;
            this.system.descTag += this.system.properties.trapping.bool == false ? "" : ` · ${game.i18n.localize('abfalter.trapping')}`;
            this.system.descTag += this.system.properties.ammunition.bool == false ? "" : ` · ${game.i18n.localize('abfalter.ammunition')}`;
            if (this.system.properties.ammunition.bool == true) this.system.descTag += this.system.ranged.infiniteAmmo == false ? "" : ` · ${game.i18n.localize('abfalter.infiniteAmmo')}`;
            this.system.descTag += this.system.properties.specialAmmo.bool == false ? "" : ` · ${game.i18n.localize('abfalter.specialAmmo')}`;
        }
        this.system.descTag += this.system.properties.magical.bool == false ? "" : ` · ${game.i18n.localize('abfalter.magical')}`;

        this.system.tags = [];
        this.system.tags.push(game.i18n.localize(`abfalter.${this.system.info.type}`));
        if (this.system.properties.magical.bool) this.system.tags.push(`${this.system.derived.finalPresence} ${game.i18n.localize(`abfalter.presence`)}`);
        this.system.tags.push(`${this.system.derived.finalFortitude} ${game.i18n.localize(`abfalter.fortitude`)}`);
        if (this.system.info.type == "melee" || this.system.info.type == "hybrid") {
            this.system.tags.push(`${this.system.derived.meleeDmg} ${game.i18n.localize('abfalter.melee')} ${game.i18n.localize('abfalter.dmgShort')}`);
            if (this.system.properties.throwable.bool) this.system.tags.push(`${this.system.melee.throwableRof} ${game.i18n.localize(`abfalter.throwRof`)}`);
        }
        if (this.system.info.type == "ranged" || this.system.info.type == "hybrid") {
            this.system.tags.push(`${this.system.derived.rangedDmg} ${game.i18n.localize('abfalter.ranged')} ${game.i18n.localize('abfalter.dmgShort')}`);
            if (this.system.properties.ammunition.bool && this.system.ranged.hasMagazine) {
                this.system.tags.push(`${this.system.ranged.magSize} / ${this.system.ranged.magSizeMax} ${game.i18n.localize(`abfalter.loaded`)}`);
                this.system.tags.push(this.system.ranged.hasClip ? `${this.system.ranged.clipRof} ${game.i18n.localize(`abfalter.clipRof`)}` : `${this.system.ranged.reloadTime} ${game.i18n.localize(`abfalter.reloadTime`)}`);
            } 
        }
        if (this.system.info.type == "hybrid" || this.system.info.type == "melee" || this.system.info.type == "ranged") {
            this.system.tags.push(`${this.system.distance.reach} ${game.i18n.localize(`abfalter.reach`)}`);
            if (this.system.distance.usesRange) this.system.tags.push(`${this.system.distance.range} ${game.i18n.localize(`abfalter.range`)}`);
        }
    }

    prepareArmor() { //Equipment
        this.system.spiritHomebrew = game.settings.get('abfalter', abfalterSettingsKeys.Spirit_Damage); //Global Setting
        this.system.kiBonusFort = this.parent != null ? this.parent.system.kiAbility.kiAuraEx.status ? 10 : 0 : 0;

        this.system.qualityValue = Math.floor(this.system.quality / 5);
        this.system.derived.presence = Math.floor(+(this.system.qualityValue * 50) + +this.system.presence); 
        this.system.derived.fortitude = Math.floor(+(this.system.qualityValue * 5) + +this.system.fortitude + this.system.kiBonusFort);

        if (this.system.type == "armor" || this.system.type == "helmet") {
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
        }

        this.system.descTag = this.system.quality != "" ? `${this.system.quality > 0 ? "+" : ""}${this.system.quality} ` : "";
        this.system.descTag += game.i18n.localize(`abfalter.${this.system.type}`);
        this.system.descTag += this.system.rarity != "" ? ` · ${this.system.rarity}` : "";
        if (this.system.type === "armor") this.system.descTag += ` · ${game.i18n.localize(`abfalter.${this.system.layerType}Layer`)}`;
        this.system.descTag += this.system.properties.unbreakable.bool == false ? "" : ` · ${game.i18n.localize('abfalter.unbreakable')}`;
        this.system.descTag += this.system.properties.magical.bool == false ? "" : ` · ${game.i18n.localize('abfalter.magical')}`;

        this.system.tags = [];
        this.system.tags.push(game.i18n.localize(`abfalter.${this.system.type}`));
        if (this.system.properties.magical.bool) this.system.tags.push(`${this.system.derived.presence} ${game.i18n.localize(`abfalter.presence`)}`);
        this.system.tags.push(`${this.system.derived.fortitude} ${game.i18n.localize(`abfalter.fortitude`)}`);
        
        const dmgTypes = [
            { key: "cut", label: "abfalter.cut" },
            { key: "imp", label: "abfalter.imp" },
            { key: "thr", label: "abfalter.thr" },
            { key: "heat", label: "abfalter.heat" },
            { key: "cold", label: "abfalter.cold" },
            { key: "ele", label: "abfalter.ele" },
            { key: "ene", label: "abfalter.ene" },
            { key: "spt", label: "abfalter.spt", homebrew: true }
        ];
        if (this.system.type === "armor" || this.system.type === "helmet") {
            for (const { key, label, homebrew } of dmgTypes) {
                if (homebrew && !this.system.spiritHomebrew) continue;
                const value = this.system.derived[key];
                if (value > 0) {
                    this.system.tags.push(`${value} ${game.i18n.localize(label)}`);
                }
            }
            if (this.system.type === "armor") {
                if(this.system.derived.movePenalty > 0) this.system.tags.push(`${this.system.derived.movePenalty} ${game.i18n.localize(`abfalter.movePenTag`)}`);
            }
            if (this.system.type === "helmet") {
                if(this.system.derived.natPenalty > 0) this.system.tags.push(`${this.system.derived.natPenalty} ${game.i18n.localize(`abfalter.perPenTag`)}`);
            }
        }
    }

    prepareAmmo() { //Consumables
        this.system.spiritHomebrew = game.settings.get('abfalter', abfalterSettingsKeys.Spirit_Damage); //Global Setting

        //this.system.descTag = this.system.quality != "" ? `${this.system.quality} ` : "";
        this.system.descTag += game.i18n.localize(`abfalter.${this.system.type}`);
        this.system.descTag += this.system.rarity != "" ? ` · ${this.system.rarity}` : "";
        this.system.descTag += this.system.properties.endless.bool == false ? "" : ` · ${game.i18n.localize('abfalter.endless')}`;
        this.system.descTag += this.system.properties.magical.bool == false ? "" : ` · ${game.i18n.localize('abfalter.magical')}`;

        this.system.tags = [];
        this.system.tags.push(game.i18n.localize(`abfalter.${this.system.type}`));
        if (this.system.properties.magical.bool) this.system.tags.push(`${this.system.presence} ${game.i18n.localize(`abfalter.presence`)}`);
        this.system.tags.push(`${this.system.damage} ${game.i18n.localize(`abfalter.damage`)} (${game.i18n.localize(`abfalter.${this.system.dmgType}`)})`);
        this.system.tags.push(`${this.system.atPen} ${game.i18n.localize(`abfalter.atPen`)}`);
        this.system.tags.push(`${this.system.break} ${game.i18n.localize(`abfalter.break`)}`);
    }

    prepareInventory() { //Loot
        this.system.descTag = this.system.quality != "" ? `${this.system.quality} ` : "";
        this.system.descTag += game.i18n.localize(`abfalter.${this.system.type}`);
        this.system.descTag += this.system.rarity != "" ? ` · ${this.system.rarity}` : "";
        this.system.descTag += this.system.properties.magical.bool == false ? "" : ` · ${game.i18n.localize('abfalter.magical')}`;

        this.system.tags = [];
        this.system.tags.push(game.i18n.localize(`abfalter.${this.system.type}`));
        if (this.system.properties.magical.bool) this.system.tags.push(`${this.system.presence} ${game.i18n.localize(`abfalter.presence`)}`); 

        switch (this.system.priceType) {
            case 'cCoin':
                this.system.tags.push(`${this.system.priceTotal} ${game.i18n.localize(`abfalter.copper`)}`);
                break;
            case 'sCoin':
                this.system.tags.push(`${this.system.priceTotal} ${game.i18n.localize(`abfalter.silver`)}`);
                break;
            case 'gCoin':
                this.system.tags.push(`${this.system.priceTotal} ${game.i18n.localize(`abfalter.gold`)}`);
                break;
            default:
                let name = this.parent.items.get(this.system.priceType)?.name;
                this.system.tags.push(`${this.system.priceTotal} ${name}`);
                break;
        }
    }

    /* ---------- Other Items  ---------- */
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
        "weapon": "systems/abfalter/templates/chatItem/weaponChat.hbs",
        "armor": "systems/abfalter/templates/chatItem/equipmentChat.hbs",
        "ammo": "systems/abfalter/templates/chatItem/consumableChat.hbs",
        "inventory": "systems/abfalter/templates/chatItem/lootChat.hbs",
    }

    async roll(label) {

        let cardData = {
            ...this,
            owner: this.actor.id,
        };
        cardData.actorName = this.actor.name;
        cardData.actorImg = this.actor.prototypeToken.texture.src;
        cardData.descToggle = false;
        cardData.type = this.type;


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
            speaker: game.user.id,
            flags: { cardData }
        };
        chatData.content = await foundry.applications.handlebars.renderTemplate(this.chatTemplate[this.type], cardData);
        return ChatMessage.create(chatData);
    }

    // ---- Legacy Data Coercion for before 1.6.0 ----
    // Deprecated after 1.7.0
    static fromSource(source, options) {
        // Clone so we don't mutate the passed object
        const s = foundry.utils.duplicate(source);
        const sys = s.system ?? {};

        // ---- Legacy -> New type coercions (pre-validation) ----
        if (s.type === "disadvantage") {
        s.type = "advantage";
        // Map fields for the new schema; preserve legacy marker
        s.system = {
            ...sys,
            cost: sys.cost ?? sys.benefit ?? 0,
            toggleItem: sys.toggleItem ?? false,
            type: "disadvantage"
            };
        }

        if (s.type === "turnMaint" || s.type === "dailyMaint") {
        const legacy = s.type;
        s.type = "zeonMaint";
        s.system = {
            ...sys,
            zeon: sys.zeon ?? 0,
            cost: sys.cost ?? 0,
            equipped: !!sys.equipped,
            toggleItem: sys.toggleItem ?? false,
            type: (legacy === "turnMaint") ? "turn" : "daily"
            };
        }

        if (s.type === "armorHelmet") {
        s.type = "armor";
        s.system = {
            ...sys,
            AT: {
            cut: sys.AT?.cut, imp: sys.AT?.imp, thr: sys.AT?.thr,
            heat: sys.AT?.heat, cold: sys.AT?.cold, ele: sys.AT?.ele,
            ene: sys.AT?.ene, spt: sys.AT?.spt
            },
            armorType: "helmet"
            };
        }
        return super.fromSource(s, options);
    }
}

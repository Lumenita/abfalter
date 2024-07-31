import { abfalterSettingsKeys } from "../utilities/abfalterSettings.js";

export default class abfalterActor extends Actor {

    prepareData() {
        const isTypeData = this.system instanceof foundry.abstract.TypeDataModel;
        if (isTypeData || (this.system?.prepareBaseData instanceof Function)) this.system.prepareBaseData();
        super.prepareData();
    }

    prepareBaseData() {
        const system = this.system;

        //Global Settings
        system.other.spiritSettings = game.settings.get('abfalter', abfalterSettingsKeys.Spirit_Damage);
        system.other.fumbleSettings = game.settings.get('abfalter', abfalterSettingsKeys.Corrected_Fumble);
        system.other.useMeters = game.settings.get('abfalter', abfalterSettingsKeys.Use_Meters);

        //All Action Mod
        system.aamField.final = system.aamField.base + system.aamField.boon + system.aamField.crit;

        //Main Characteristics & Dragon Seals
        system.aamField.final += system.arsMagnus.dragonSeal * 5 || 0;

        //Monster Powers Prep
        for (let [key, atr] of Object.entries(system.monsterChar)) {
            switch (atr.base) {
                case 1:
                    atr.costBase = 1;
                    break;
                case 2:
                    atr.costBase = 2;
                    break;
                case 3:
                    atr.costBase = 3;
                    break;
                case 4:
                    atr.costBase = 4;
                    break;
                case 5:
                    atr.costBase = 5;
                    break;
                case 6:
                    atr.costBase = 6;
                    break;
                case 7:
                    atr.costBase = 7;
                    break;
                case 8:
                    atr.costBase = 8;
                    break;
                case 9:
                    atr.costBase = 10;
                    break;
                case 10:
                    atr.costBase = 15;
                    break;
                case 11:
                    atr.costBase = 20;
                    break;
                case 12:
                    atr.costBase = 30;
                    break;
                case 13:
                    atr.costBase = 40;
                    break;
                case 14:
                    atr.costBase = 50;
                    break;
                case 15:
                    atr.costBase = 60;
                    break;
                default:
                    atr.costBase = 0;
                    break;
            }
            atr.costAdditional = Math.floor(atr.additional * 20);
            atr.charBaseCostTotal = Math.floor(atr.costBase + atr.costAdditional);
            atr.charBaseTotal = Math.floor(~~atr.base + ~~atr.additional);
        }
        system.monsterStats.charCombinedCost = Math.floor(system.monsterChar.agi.charBaseCostTotal + system.monsterChar.con.charBaseCostTotal + system.monsterChar.str.charBaseCostTotal +
            system.monsterChar.dex.charBaseCostTotal + system.monsterChar.per.charBaseCostTotal + system.monsterChar.int.charBaseCostTotal + system.monsterChar.pow.charBaseCostTotal +
            system.monsterChar.wp.charBaseCostTotal);
        //Size Base Values
        if (system.info.size >= 9 && system.info.size <= 22) {
            system.initiative.sizeBase = 20;
            system.movement.sizeBase = 0;
            system.lifepoints.hpMult = 5;
            system.monsterStats.armor = 3;
            system.monsterStats.physDmg = 10;
            system.monsterStats.naturalDmg = 40;
            system.monsterStats.actionArea = "0";
            system.monsterStats.natBreak = 0;
            system.monsterStats.fort = 12;
        } else if (system.info.size >= 1 && system.info.size <= 3) {
            system.initiative.sizeBase = 40;
            system.movement.sizeBase = -4;
            system.lifepoints.hpMult = 1;
            system.monsterStats.armor = 1;
            system.monsterStats.physDmg = 5;
            system.monsterStats.naturalDmg = 20;
            system.monsterStats.actionArea = "0";
            system.monsterStats.natBreak = -4;
            system.monsterStats.fort = 4;
        } else if (system.info.size >= 4 && system.info.size <= 8) {
            system.initiative.sizeBase = 30;
            system.movement.sizeBase = -2;
            system.lifepoints.hpMult = 2;
            system.monsterStats.armor = 2;
            system.monsterStats.physDmg = 10;
            system.monsterStats.naturalDmg = 30;
            system.monsterStats.actionArea = "0";
            system.monsterStats.natBreak = -2;
            system.monsterStats.fort = 8;
        } else if (system.info.size >= 23 && system.info.size <= 24) {
            system.initiative.sizeBase = 10;
            system.movement.sizeBase = 0;
            system.lifepoints.hpMult = 5;
            system.monsterStats.armor = 4;
            system.monsterStats.physDmg = 20;
            system.monsterStats.naturalDmg = 60;
            system.monsterStats.actionArea = "0";
            system.monsterStats.natBreak = 4;
            system.monsterStats.fort = 16;
        } else if (system.info.size >= 25 && system.info.size <= 28) {
            system.initiative.sizeBase = 0;
            system.movement.sizeBase = 1;
            system.lifepoints.hpMult = 10;
            system.monsterStats.armor = 6;
            system.monsterStats.physDmg = 30;
            system.monsterStats.naturalDmg = 100;
            system.monsterStats.actionArea = "5ft / 1.5m";
            system.monsterStats.natBreak = 8;
            system.monsterStats.fort = 20;
        } else if (system.info.size >= 29 && system.info.size <= 33) {
            system.initiative.sizeBase = -10;
            system.movement.sizeBase = 2;
            system.lifepoints.hpMult = 15;
            system.monsterStats.armor = 8;
            system.monsterStats.physDmg = 40;
            system.monsterStats.naturalDmg = 120;
            system.monsterStats.actionArea = "15ft / 4.5m";
            system.monsterStats.natBreak = 12;
            system.monsterStats.fort = 28;
        } else if (system.info.size >= 34) {
            system.initiative.sizeBase = -20;
            system.movement.sizeBase = 3;
            system.lifepoints.hpMult = 20;
            system.monsterStats.armor = 10;
            system.monsterStats.physDmg = 60;
            system.monsterStats.naturalDmg = 140;
            system.monsterStats.actionArea = "60ft / 18m";
            system.monsterStats.natBreak = 16;
            system.monsterStats.fort = 34;
        } else {
            system.initiative.sizeBase = 0;
            system.movement.sizeBase = 0;
            system.lifepoints.hpMult = 0;
            system.monsterStats.armor = 0;
            system.monsterStats.physDmg = 0;
            system.monsterStats.naturalDmg = 0;
            system.monsterStats.actionArea = "N/A";
            system.monsterStats.natBreak = 0;
            system.monsterStats.fort = 0;
        }

        //Main Char Calc
        if (system.toggles.monsterChar == false) {
            for (let [key, stat] of Object.entries(system.stats)) {
                stat.final = Math.floor(~~stat.base + stat.spec + stat.temp);
            }
        } else {
            system.stats.Agility.final = Math.floor(system.monsterChar.agi.charBaseTotal + system.stats.Agility.spec + system.stats.Agility.temp);
            system.stats.Constitution.final = Math.floor(system.monsterChar.con.charBaseTotal + system.stats.Constitution.spec + system.stats.Constitution.temp);
            system.stats.Strength.final = Math.floor(system.monsterChar.str.charBaseTotal + system.stats.Strength.spec + system.stats.Strength.temp);
            system.stats.Dexterity.final = Math.floor(system.monsterChar.dex.charBaseTotal + system.stats.Dexterity.spec + system.stats.Dexterity.temp);
            system.stats.Perception.final = Math.floor(system.monsterChar.per.charBaseTotal + system.stats.Perception.spec + system.stats.Perception.temp);
            system.stats.Intelligence.final = Math.floor(system.monsterChar.int.charBaseTotal + system.stats.Intelligence.spec + system.stats.Intelligence.temp);
            system.stats.Power.final = Math.floor(system.monsterChar.pow.charBaseTotal + system.stats.Power.spec + system.stats.Power.temp);
            system.stats.Willpower.final = Math.floor(system.monsterChar.wp.charBaseTotal + system.stats.Willpower.spec + system.stats.Willpower.temp);
        }

        system.stats.Agility.final += system.arsMagnus.dragonDoor || 0;
        system.stats.Constitution.final += system.arsMagnus.dragonDoor || 0;
        system.stats.Strength.final += system.arsMagnus.dragonDoor || 0;
        system.stats.Dexterity.final += system.arsMagnus.dragonDoor || 0;
        system.stats.Perception.final += system.arsMagnus.dragonDoor || 0;

        //MetaMagic Capstones
        system.metaMagic.derived.doubleDamageDesc = game.i18n.localize('abfalter.metaMagic.doubleDmgDesc');
        system.metaMagic.derived.highMagicDesc = game.i18n.localize('abfalter.metaMagic.highMagicDesc');
        system.metaMagic.derived.natMaintDesc = game.i18n.localize('abfalter.metaMagic.natMaintDesc');
        system.metaMagic.derived.unlimitedZeonDesc = game.i18n.localize('abfalter.metaMagic.unlimitedZeonDesc');

        //MetaMagic Desc Arcane Warfare
        //empowered shields
        if (!system.metaMagic.empShield.bought && !system.metaMagic.empShield2.bought) {
            system.metaMagic.derived.empShields = false;
            system.metaMagic.derived.empShieldsDesc = "";
        } else if (system.metaMagic.empShield.bought && system.metaMagic.empShield2.bought) {
            system.metaMagic.derived.empShields = true;
            system.metaMagic.derived.empShieldsDesc = game.i18n.localize('abfalter.metaMagic.empShieldDesc2');
        } else {
            system.metaMagic.derived.empShields = true;
            system.metaMagic.derived.empShieldsDesc = game.i18n.localize('abfalter.metaMagic.empShieldDesc1');
        }
        //mystic accuracy
        if (!system.metaMagic.mysticAcc.bought && !system.metaMagic.mysticAcc2.bought) {
            system.metaMagic.derived.mysticAccu = false;
            system.metaMagic.derived.mysticAccuDesc = "";
        } else if (system.metaMagic.mysticAcc.bought && system.metaMagic.mysticAcc2.bought) {
            system.metaMagic.derived.mysticAccu = true;
            system.metaMagic.derived.mysticAccuDesc = game.i18n.localize('abfalter.metaMagic.mysticAccuDesc2');
        } else {
            system.metaMagic.derived.mysticAccu = true;
            system.metaMagic.derived.mysticAccuDesc = game.i18n.localize('abfalter.metaMagic.mysticAccuDesc1');
        }
        //increased destruction
        if (!system.metaMagic.incDestro.bought && !system.metaMagic.incDestro2.bought) {
            system.metaMagic.derived.incDestruction = false;
            system.metaMagic.derived.incDestructionDesc = "";
        } else if (system.metaMagic.incDestro.bought && system.metaMagic.incDestro2.bought) {
            system.metaMagic.derived.incDestruction = true;
            system.metaMagic.derived.incDestructionDesc = game.i18n.localize('abfalter.metaMagic.incDestroDesc2');
        } else {
            system.metaMagic.derived.incDestruction = true;
            system.metaMagic.derived.incDestructionDesc = game.i18n.localize('abfalter.metaMagic.incDestroDesc1');
        }
        //expanded area
        if (!system.metaMagic.expArea.bought && !system.metaMagic.expArea2.bought) {
            system.metaMagic.derived.expandArea = false;
            system.metaMagic.derived.expandAreaDesc = "";
        } else if (system.metaMagic.expArea.bought && system.metaMagic.expArea2.bought) {
            system.metaMagic.derived.expandArea = true;
            system.metaMagic.derived.expandAreaDesc = game.i18n.localize('abfalter.metaMagic.expAreaDesc2');
        } else {
            system.metaMagic.derived.expandArea = true;
            system.metaMagic.derived.expandAreaDesc = game.i18n.localize('abfalter.metaMagic.expAreaDesc1');
        }
        //remove protection
        if (!system.metaMagic.remProtection.bought && !system.metaMagic.remProtection2.bought && !system.metaMagic.remProtection3.bought) {
            system.metaMagic.derived.removeProtection = false;
            system.metaMagic.derived.removeProtectionDesc = "";
        } else if (system.metaMagic.remProtection.bought && system.metaMagic.remProtection2.bought && system.metaMagic.remProtection3.bought) {
            system.metaMagic.derived.removeProtection = true;
            system.metaMagic.derived.removeProtectionDesc = game.i18n.localize('abfalter.metaMagic.remProtectDesc3');
        } else if ((system.metaMagic.remProtection.bought && system.metaMagic.remProtection2.bought) ||
            (system.metaMagic.remProtection2.bought && system.metaMagic.remProtection3.bought) ||
            (system.metaMagic.remProtection.bought && system.metaMagic.remProtection3.bought)) {
            system.metaMagic.derived.removeProtection = true;
            system.metaMagic.derived.removeProtectionDesc = game.i18n.localize('abfalter.metaMagic.remProtectDesc2');
        } else {
            system.metaMagic.derived.removeProtection = true;
            system.metaMagic.derived.removeProtectionDesc = game.i18n.localize('abfalter.metaMagic.remProtectDesc1');
        }
        //defensive expertise
        if (!system.metaMagic.defExper.bought && !system.metaMagic.defExper2.bought && !system.metaMagic.defExper3.bought) {
            system.metaMagic.derived.defenseExpertise = false;
            system.metaMagic.derived.defenseExpertiseDesc = "";
        } else if (system.metaMagic.defExper.bought && system.metaMagic.defExper2.bought && system.metaMagic.defExper3.bought) {
            system.metaMagic.derived.defenseExpertise = true;
            system.metaMagic.derived.defenseExpertiseDesc = game.i18n.localize('abfalter.metaMagic.defExperDesc3');
        } else if ((system.metaMagic.defExper.bought && system.metaMagic.defExper2.bought) ||
            (system.metaMagic.defExper2.bought && system.metaMagic.defExper3.bought) ||
            (system.metaMagic.defExper.bought && system.metaMagic.defExper3.bought)) {
            system.metaMagic.derived.defenseExpertise = true;
            system.metaMagic.derived.defenseExpertiseDesc = game.i18n.localize('abfalter.metaMagic.defExperDesc2');
        } else {
            system.metaMagic.derived.defenseExpertise = true;
            system.metaMagic.derived.defenseExpertiseDesc = game.i18n.localize('abfalter.metaMagic.defExperDesc1');
        }
        //offensive expertise
        if (!system.metaMagic.offExper.bought && !system.metaMagic.offExper2.bought && !system.metaMagic.offExper3.bought) {
            system.metaMagic.derived.offExpertise = false;
            system.metaMagic.derived.offExpertiseDesc = "";
        } else if (system.metaMagic.offExper.bought && system.metaMagic.offExper2.bought && system.metaMagic.offExper3.bought) {
            system.metaMagic.derived.offExpertise = true;
            system.metaMagic.derived.offExpertiseDesc = game.i18n.localize('abfalter.metaMagic.offExperDesc3');
        } else if ((system.metaMagic.offExper.bought && system.metaMagic.offExper2.bought) ||
            (system.metaMagic.offExper2.bought && system.metaMagic.offExper3.bought) ||
            (system.metaMagic.offExper.bought && system.metaMagic.offExper3.bought)) {
            system.metaMagic.derived.offExpertise = true;
            system.metaMagic.derived.offExpertiseDesc = game.i18n.localize('abfalter.metaMagic.offExperDesc2');
        } else {
            system.metaMagic.derived.offExpertise = true;
            system.metaMagic.derived.offExpertiseDesc = game.i18n.localize('abfalter.metaMagic.offExperDesc1');
        }

        //MetaMagic Desc Arcane Esoterica
        //secure defense
        system.metaMagic.derived.secureDefenseDesc = game.i18n.localize('abfalter.metaMagic.secDefenseDesc');
        //life magic
        if (!system.metaMagic.lifeMagic.bought && !system.metaMagic.lifeMagic2.bought) {
            system.metaMagic.derived.lifeMagic = false;
            system.metaMagic.derived.lifeMagicDesc = "";
        } else if (system.metaMagic.lifeMagic.bought && system.metaMagic.lifeMagic2.bought) {
            system.metaMagic.derived.lifeMagic = true;
            system.metaMagic.derived.lifeMagicDesc = game.i18n.localize('abfalter.metaMagic.lifeMagicDesc2');
        } else {
            system.metaMagic.derived.lifeMagic = true;
            system.metaMagic.derived.lifeMagicDesc = game.i18n.localize('abfalter.metaMagic.lifeMagicDesc1');
        }
        //feel magic
        system.metaMagic.derived.feelMagicDesc = game.i18n.localize('abfalter.metaMagic.feelMagicDesc');
        //hidden magic
        system.metaMagic.derived.hiddenMagicDesc = game.i18n.localize('abfalter.metaMagic.hiddenMagicDesc');
        //spiritual loop
        if (!system.metaMagic.spiritLoop.bought && !system.metaMagic.spiritLoop2.bought) {
            system.metaMagic.derived.spiritLoop = false;
            system.metaMagic.derived.spiritLoopDesc = "";
        } else if (system.metaMagic.spiritLoop.bought && system.metaMagic.spiritLoop2.bought) {
            system.metaMagic.derived.spiritLoop = true;
            system.metaMagic.derived.spiritLoopDesc = game.i18n.localize('abfalter.metaMagic.spiritLoopDesc2');
        } else {
            system.metaMagic.derived.spiritLoop = true;
            system.metaMagic.derived.spiritLoopDesc = game.i18n.localize('abfalter.metaMagic.spiritLoopDesc1');
        }
        //control space
        system.metaMagic.derived.controlSpaceDesc = game.i18n.localize('abfalter.metaMagic.controlSpaceDesc');
        //energy control
        system.metaMagic.derived.eneControlDesc = game.i18n.localize('abfalter.metaMagic.eneControlDesc');
        //endure supernatural damage
        system.metaMagic.derived.endureDamageDesc = game.i18n.localize('abfalter.metaMagic.endureDamageDesc');
        //transfer magic
        system.metaMagic.derived.transferMagicDesc = game.i18n.localize('abfalter.metaMagic.transferMagicDesc');
        //force speed
        if (!system.metaMagic.forceSpeed.bought && !system.metaMagic.forceSpeed2.bought && !system.metaMagic.forceSpeed3.bought) {
            system.metaMagic.derived.forceSpeed = false;
            system.metaMagic.derived.forceSpeedDesc = "";
        } else if (system.metaMagic.forceSpeed.bought && system.metaMagic.forceSpeed2.bought && system.metaMagic.forceSpeed3.bought) {
            system.metaMagic.derived.forceSpeed = true;
            system.metaMagic.derived.forceSpeedDesc = game.i18n.localize('abfalter.metaMagic.forceSpeed3');
        } else if ((system.metaMagic.forceSpeed.bought && system.metaMagic.forceSpeed2.bought) ||
            (system.metaMagic.forceSpeed2.bought && system.metaMagic.forceSpeed3.bought) ||
            (system.metaMagic.forceSpeed.bought && system.metaMagic.forceSpeed3.bought)) {
            system.metaMagic.derived.forceSpeed = true;
            system.metaMagic.derived.forceSpeedDesc = game.i18n.localize('abfalter.metaMagic.forceSpeed2');
        } else {
            system.metaMagic.derived.forceSpeed = true;
            system.metaMagic.derived.forceSpeedDesc = game.i18n.localize('abfalter.metaMagic.forceSpeed1');
        }
        //double innate spells
        system.metaMagic.derived.doubleInnateDesc = game.i18n.localize('abfalter.metaMagic.doubleInnateDesc');

        //MetaMagic Desc Arcane Power
        //advanced zeon regen
        if (!system.metaMagic.advZeonRegen.bought && !system.metaMagic.advZeonRegen2.bought && !system.metaMagic.advZeonRegen3.bought) {
            system.metaMagic.derived.advnacedRegen = false;
            system.metaMagic.derived.advnacedRegenDesc = "";
        } else if (system.metaMagic.advZeonRegen.bought && system.metaMagic.advZeonRegen2.bought && system.metaMagic.advZeonRegen3.bought) {
            system.metaMagic.derived.advnacedRegen = true;
            system.metaMagic.derived.advnacedRegenDesc = game.i18n.localize('abfalter.metaMagic.advZeonRegenDesc3');
        } else if ((system.metaMagic.advZeonRegen.bought && system.metaMagic.advZeonRegen2.bought) ||
            (system.metaMagic.advZeonRegen2.bought && system.metaMagic.advZeonRegen3.bought) ||
            (system.metaMagic.advZeonRegen.bought && system.metaMagic.advZeonRegen3.bought)) {
            system.metaMagic.derived.advnacedRegen = true;
            system.metaMagic.derived.advnacedRegenDesc = game.i18n.localize('abfalter.metaMagic.advZeonRegenDesc2');
        } else {
            system.metaMagic.derived.advnacedRegen = true;
            system.metaMagic.derived.advnacedRegenDesc = game.i18n.localize('abfalter.metaMagic.advZeonRegenDesc1');
        }
        //avatar
        system.metaMagic.derived.avatarDesc = game.i18n.localize('abfalter.metaMagic.avatarDesc');
        //combined magic
        system.metaMagic.derived.combinedMagicDesc = game.i18n.localize('abfalter.metaMagic.combinedMagicDesc');
        //define magic projection
        system.metaMagic.derived.definedProjNumber = system.metaMagic.defMagicProj.bought + system.metaMagic.defMagicProj2.bought + system.metaMagic.defMagicProj3.bought
            + system.metaMagic.defMagicProj4.bought + system.metaMagic.defMagicProj5.bought
            + system.metaMagic.defMagicProj6.bought + system.metaMagic.defMagicProj7.bought;
        switch (system.metaMagic.derived.definedProjNumber) {
            case 1:
                system.metaMagic.derived.defMagProjDesc = game.i18n.localize('abfalter.metaMagic.defMagProjDesc1');
                system.metaMagic.derived.definedMagicProj = true;
                break;
            case 2:
                system.metaMagic.derived.defMagProjDesc = game.i18n.localize('abfalter.metaMagic.defMagProjDesc2');
                system.metaMagic.derived.definedMagicProj = true;
                break;
            case 3:
                system.metaMagic.derived.defMagProjDesc = game.i18n.localize('abfalter.metaMagic.defMagProjDesc3');
                system.metaMagic.derived.definedMagicProj = true;
                break;
            case 4:
                system.metaMagic.derived.defMagProjDesc = game.i18n.localize('abfalter.metaMagic.defMagProjDesc4');
                system.metaMagic.derived.definedMagicProj = true;
                break;
            case 5:
                system.metaMagic.derived.defMagProjDesc = game.i18n.localize('abfalter.metaMagic.defMagProjDesc5');
                system.metaMagic.derived.definedMagicProj = true;
                break;
            case 6:
                system.metaMagic.derived.defMagProjDesc = game.i18n.localize('abfalter.metaMagic.defMagProjDesc6');
                system.metaMagic.derived.definedMagicProj = true;
                break;
            case 7:
                system.metaMagic.derived.defMagProjDesc = game.i18n.localize('abfalter.metaMagic.defMagProjDesc7');
                system.metaMagic.derived.definedMagicProj = true;
                break;
            default:
                system.metaMagic.derived.defMagProjDesc = "";
                system.metaMagic.derived.definedMagicProj = false;
                break;
        }
        //elevation
        system.metaMagic.derived.elevationDesc = game.i18n.localize('abfalter.metaMagic.elevationDesc');
        //exploit energy
        if (!system.metaMagic.exploitEne.bought && !system.metaMagic.exploitEne2.bought) {
            system.metaMagic.derived.exploitEnergy = false;
            system.metaMagic.derived.exploitEnergyDesc = "";
        } else if (system.metaMagic.exploitEne.bought && system.metaMagic.exploitEne2.bought) {
            system.metaMagic.derived.exploitEnergy = true;
            system.metaMagic.derived.exploitEnergyDesc = game.i18n.localize('abfalter.metaMagic.exploitEneDesc2');
        } else {
            system.metaMagic.derived.exploitEnergy = true;
            system.metaMagic.derived.exploitEnergyDesc = game.i18n.localize('abfalter.metaMagic.exploitEneDesc1');
        }
        //persistent effects
        system.metaMagic.derived.persisEffectDesc = game.i18n.localize('abfalter.metaMagic.persisEffectDesc');

        //MetaMagic Desc Arcane Knowledge
        //mystic concentration
        system.metaMagic.derived.mysticConceDesc = game.i18n.localize('abfalter.metaMagic.mysticConceDesc');
        //mystic concentration
        if (!system.metaMagic.spellSpec80.bought && !system.metaMagic.spellSpec70.bought && !system.metaMagic.spellSpec60.bought
            && !system.metaMagic.spellSpec60x.bought && !system.metaMagic.spellSpec50.bought && !system.metaMagic.spellSpec30.bought
            && !system.metaMagic.spellSpec30x.bought) {
            system.metaMagic.derived.spellSpecialization = false;
            system.metaMagic.derived.spellSpecializationDesc = "";
        } else if (system.metaMagic.spellSpec80.bought) {
            system.metaMagic.derived.spellSpecialization = true;
            system.metaMagic.derived.spellSpecializationDesc = game.i18n.localize('abfalter.metaMagic.spellSpec80Desc');
        } else if (system.metaMagic.spellSpec70.bought) {
            system.metaMagic.derived.spellSpecialization = true;
            system.metaMagic.derived.spellSpecializationDesc = game.i18n.localize('abfalter.metaMagic.spellSpec70Desc');
        } else if (system.metaMagic.spellSpec60.bought || system.metaMagic.spellSpec60x.bought) {
            system.metaMagic.derived.spellSpecialization = true;
            system.metaMagic.derived.spellSpecializationDesc = game.i18n.localize('abfalter.metaMagic.spellSpec60Desc');
        } else if (system.metaMagic.spellSpec50.bought) {
            system.metaMagic.derived.spellSpecialization = true;
            system.metaMagic.derived.spellSpecializationDesc = game.i18n.localize('abfalter.metaMagic.spellSpec50Desc');
        } else {
            system.metaMagic.derived.spellSpecialization = true;
            system.metaMagic.derived.spellSpecializationDesc = game.i18n.localize('abfalter.metaMagic.spellSpec30Desc');
        }
        //pierce resistances
        if (!system.metaMagic.pierceRes.bought && !system.metaMagic.pierceRes2.bought) {
            system.metaMagic.derived.pierceRes = false;
            system.metaMagic.derived.pierceResDesc = "";
        } else if (system.metaMagic.pierceRes.bought && system.metaMagic.pierceRes2.bought) {
            system.metaMagic.derived.pierceRes = true;
            system.metaMagic.derived.pierceResDesc = game.i18n.localize('abfalter.metaMagic.pierceResDesc2');
        } else {
            system.metaMagic.derived.pierceRes = true;
            system.metaMagic.derived.pierceResDesc = game.i18n.localize('abfalter.metaMagic.pierceResDesc1');
        }
        //increase range
        if (!system.metaMagic.incRange.bought && !system.metaMagic.incRange2.bought) {
            system.metaMagic.derived.increRange = false;
            system.metaMagic.derived.increRangeDesc = "";
        } else if (system.metaMagic.incRange.bought && system.metaMagic.incRange2.bought) {
            system.metaMagic.derived.increRange = true;
            system.metaMagic.derived.increRangeDesc = game.i18n.localize('abfalter.metaMagic.increRangeDesc2');
        } else {
            system.metaMagic.derived.increRange = true;
            system.metaMagic.derived.increRangeDesc = game.i18n.localize('abfalter.metaMagic.increRangeDesc1');
        }
        //bind spells
        system.metaMagic.derived.bindSpellDesc = game.i18n.localize('abfalter.metaMagic.bindSpellDesc');
        //maximize spells
        system.metaMagic.derived.maxSpellsDesc = game.i18n.localize('abfalter.metaMagic.maxSpellsDesc');
        //double spells
        system.metaMagic.derived.doubleSpellDesc = game.i18n.localize('abfalter.metaMagic.doubleSpellDesc');
        //superior innate spell
        system.metaMagic.derived.supInnateDesc = game.i18n.localize('abfalter.metaMagic.supInnateDesc');

        //ML Calculation
        system.metaMagic.totalCost = system.metaMagic.cost + system.metaMagic.extraCost;

    }

    prepareEmbeddedDocuments() {
        super.prepareEmbeddedDocuments();
    }

    prepareDerivedData() {
        const system = this.system;
        const stats = system.stats;

        system.aamField.final += system.aamField.bonus || 0;

        for (let [key, stat] of Object.entries(system.stats)) {
            if (30 < stat.final) {
                stat.final = 30;
            }
            switch (stat.final) {
                case 0:
                    stat.mod = -40;
                    break;
                case 1:
                    stat.mod = -30;
                    break;
                case 2:
                    stat.mod = -20;
                    break;
                case 3:
                    stat.mod = -10;
                    break;
                case 4:
                    stat.mod = -5;
                    break;
                case 5:
                    stat.mod = 0;
                    break;
                case 6:
                case 7:
                    stat.mod = 5;
                    break;
                case 8:
                case 9:
                    stat.mod = 10;
                    break;
                case 10:
                    stat.mod = 15;
                    break;
                case 11:
                case 12:
                    stat.mod = 20;
                    break;
                case 13:
                case 14:
                    stat.mod = 25;
                    break;
                case 15:
                    stat.mod = 30;
                    break;
                case 16:
                case 17:
                    stat.mod = 35;
                    break;
                case 18:
                case 19:
                    stat.mod = 40;
                    break;
                case 20:
                    stat.mod = 45;
                    break;
                case 21:
                case 22:
                    stat.mod = 50;
                    break;
                case 23:
                case 24:
                    stat.mod = 55;
                    break;
                case 25:
                    stat.mod = 60;
                    break;
                case 26:
                case 27:
                    stat.mod = 65;
                    break;
                case 28:
                case 29:
                    stat.mod = 70;
                    break;
                case 30:
                    stat.mod = 75;
                    break;
                default:
                    stat.mod = -40;
            }

            stat.opposedfinal = Math.floor((stat.final + stat.opposed) + ~~(system.aamField.final / 20) + stat.opposedBonus);
            //Ki Pools
            if (stat != "Intelligence" && "Perception") {
                if (stat.final >= 1 && stat.final <= 9) {
                    stat.kiPoolAccuBase = 1;
                } else if (stat.final >= 10 && stat.final <= 12) {
                    stat.kiPoolAccuBase = 2;
                } else if (stat.final >= 13 && stat.final <= 15) {
                    stat.kiPoolAccuBase = 3;
                } else if (stat.final >= 16) {
                    stat.kiPoolAccuBase = 4;
                } else {
                    stat.kiPoolAccuBase = 0;
                }
                if (stat.final <= 10) {
                    stat.kiPoolBase = Math.floor(stat.final);
                } else if (stat.final > 10) {
                    stat.kiPoolBase = Math.floor(((stat.final - 10) * 2) + 10);
                } else {
                    stat.kiPoolBase = 0;
                }
            }
        }

        //Calculating Number of Actions
        const actnumcalc = ~~system.stats.Agility.final + ~~system.stats.Dexterity.final;
        if (actnumcalc < 0) {
            actnumcalc = 0;
        }
        switch (actnumcalc) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
                system.info.actionNumber = 1;
                break;
            case 11:
            case 12:
            case 13:
            case 14:
                system.info.actionNumber = 2;
                break;
            case 15:
            case 16:
            case 17:
            case 18:
            case 19:
                system.info.actionNumber = 3;
                break;
            case 20:
            case 21:
            case 22:
                system.info.actionNumber = 4;
                break;
            case 23:
            case 24:
            case 25:
                system.info.actionNumber = 5;
                break;
            case 26:
            case 27:
            case 28:
                system.info.actionNumber = 6;
                break;
            case 29:
            case 30:
            case 31:
                system.info.actionNumber = 8;
                break;
            default:
                system.info.actionNumber = 10;
                break;
        }

        //Lifepoint Calculation
        system.lifepoints.base = Math.floor(25 + 10 * system.stats.Constitution.final + system.stats.Constitution.mod - Math.ceil((system.stats.Constitution.final - 1) / system.stats.Constitution.final) * 5);
        if (system.toggles.dmgRes == false) {
            system.lp.max = Math.floor(system.lifepoints.base + system.lifepoints.spec + system.lifepoints.temp + system.lifepoints.bonus + Math.ceil(system.lifepoints.multiple * system.stats.Constitution.final));
        } else {
            if (system.monsterStats.hpDp == null) {
                system.monsterStats.hpDp = 0;
            }
            system.lifepoints.hpDmgRes = Math.floor(system.lifepoints.hpMult * system.monsterStats.hpDp);
            system.lp.max = Math.floor(system.lifepoints.base + system.lifepoints.spec + system.lifepoints.temp + system.lifepoints.hpDmgRes + system.lifepoints.bonus);
        }

        //Fatigue Calculation
        system.fatigue.base = system.stats.Constitution.final;
        system.fatigue.max = Math.floor(system.fatigue.base + system.fatigue.spec + system.fatigue.temp + system.fatigue.bonus);
        
        //Regeneration Calculation
        switch (system.stats.Constitution.final) {
            case 1:
            case 2:
                system.regeneration.base = 0;
                break;
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                system.regeneration.base = 1;
                break;
            case 8:
            case 9:
                system.regeneration.base = 2;
                break;
            case 10:
                system.regeneration.base = 3;
                break;
            case 11:
                system.regeneration.base = 4;
                break;
            case 12:
                system.regeneration.base = 5;
                break;
            case 13:
                system.regeneration.base = 6;
                break;
            case 14:
                system.regeneration.base = 7;
                break;
            case 15:
                system.regeneration.base = 8;
                break;
            case 16:
                system.regeneration.base = 9;
                break;
            case 17:
                system.regeneration.base = 10;
                break;
            case 18:
                system.regeneration.base = 11;
                break;
            case 19:
            case 20:
                system.regeneration.base = 12;
                break;
            default:
                system.regeneration.base = 0;
                break;
        }
        if (system.stats.Constitution.final > 20) {
            system.regeneration.base = 12;
        }
        system.regeneration.final = Math.min(Math.floor(system.regeneration.base + system.regeneration.spec + system.regeneration.temp + system.regeneration.bonus), 20);
        switch (system.regeneration.final) {
            case 1:
                system.regeneration.resting = "10/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regeneration.notResting = "5/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regeneration.penaltyReduction = "-5/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regeneration.rawValue = 10;
                break;
            case 2:
                system.regeneration.resting = "20/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regeneration.notResting = "10/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regeneration.penaltyReduction = "-5/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regeneration.rawValue = 20;
                break;
            case 3:
                system.regeneration.resting = "30/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regeneration.notResting = "15/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regeneration.penaltyReduction = "-5/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regeneration.rawValue = 30;
                break;
            case 4:
                system.regeneration.resting = "40/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regeneration.notResting = "20/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regeneration.penaltyReduction = "-10/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regeneration.rawValue = 40;
                break;
            case 5:
                system.regeneration.resting = "50/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regeneration.notResting = "25/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regeneration.penaltyReduction = "-10/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regeneration.rawValue = 50;
                break;
            case 6:
                system.regeneration.resting = "75/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regeneration.notResting = "30/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regeneration.penaltyReduction = "-15/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regeneration.rawValue = 75;
                break;
            case 7:
                system.regeneration.resting = "100/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regeneration.notResting = "50/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regeneration.penaltyReduction = "-20/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regeneration.rawValue = 100;
                break;
            case 8:
                system.regeneration.resting = "250/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regeneration.notResting = "100/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regeneration.penaltyReduction = "-25/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regeneration.rawValue = 250;
                break;
            case 9:
                system.regeneration.resting = "500/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regeneration.notResting = "200/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regeneration.penaltyReduction = "-30/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regeneration.rawValue = 500;
                break;
            case 10:
                system.regeneration.resting = "1/" + game.i18n.localize('abfalter.basicInfo.minute');
                system.regeneration.notResting = "N/A";
                system.regeneration.penaltyReduction = "-40/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regeneration.rawValue = 1440;
                break;
            case 11:
                system.regeneration.resting = "2/" + game.i18n.localize('abfalter.basicInfo.minute');
                system.regeneration.notResting = "N/A";
                system.regeneration.penaltyReduction = "-50/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regeneration.rawValue = 2880;
                break;
            case 12:
                system.regeneration.resting = "5/" + game.i18n.localize('abfalter.basicInfo.minute');
                system.regeneration.notResting = "N/A";
                system.regeneration.penaltyReduction = "-5/" + game.i18n.localize('abfalter.basicInfo.hour');
                system.regeneration.rawValue = 7200;
                break;
            case 13:
                system.regeneration.resting = "10/" + game.i18n.localize('abfalter.basicInfo.minute');
                system.regeneration.notResting = "N/A";
                system.regeneration.penaltyReduction = "-10/" + game.i18n.localize('abfalter.basicInfo.hour');
                system.regeneration.rawValue = 10000;
                break;
            case 14:
                system.regeneration.resting = "1/" + game.i18n.localize('abfalter.magicTab.turn');
                system.regeneration.notResting = "N/A";
                system.regeneration.penaltyReduction = "-15/" + game.i18n.localize('abfalter.basicInfo.hour');
                system.regeneration.rawValue = 20000;
                break;
            case 15:
                system.regeneration.resting = "5/" + game.i18n.localize('abfalter.magicTab.turn');
                system.regeneration.notResting = "N/A";
                system.regeneration.penaltyReduction = "-20/" + game.i18n.localize('abfalter.basicInfo.hour');
                system.regeneration.rawValue = 50000;
                break;
            case 16:
                system.regeneration.resting = "10/" + game.i18n.localize('abfalter.magicTab.turn');
                system.regeneration.notResting = "N/A";
                system.regeneration.penaltyReduction = "-50/" + game.i18n.localize('abfalter.basicInfo.minute');
                system.regeneration.rawValue = 100000;
                break;
            case 17:
                system.regeneration.resting = "25/" + game.i18n.localize('abfalter.magicTab.turn');
                system.regeneration.notResting = "N/A";
                system.regeneration.penaltyReduction = "-10/" + game.i18n.localize('abfalter.magicTab.turn');
                system.regeneration.rawValue = 100000;
                break;
            case 18:
                system.regeneration.resting = "50/" + game.i18n.localize('abfalter.magicTab.turn');
                system.regeneration.notResting = "N/A";
                system.regeneration.penaltyReduction = "-25/" + game.i18n.localize('abfalter.magicTab.turn');
                system.regeneration.rawValue = 100000;
                break;
            case 19:
                system.regeneration.resting = "100/" + game.i18n.localize('abfalter.magicTab.turn');
                system.regeneration.notResting = "N/A";
                system.regeneration.penaltyReduction = "All/" + game.i18n.localize('abfalter.magicTab.turn');
                system.regeneration.rawValue = 100000;
                break;
            case 20:
                system.regeneration.resting = "200/" + game.i18n.localize('abfalter.magicTab.turn');
                system.regeneration.notResting = "N/A";
                system.regeneration.penaltyReduction = "All/" + game.i18n.localize('abfalter.magicTab.turn');
                system.regeneration.rawValue = 100000;
                break;
            default:
                system.regeneration.resting = "0";
                system.regeneration.notResting = "0";
                system.regeneration.penaltyReduction = "0";
                system.regeneration.rawValue = 0;
                break;
        }

        //Initiative
        system.initiative.extraStats = Math.floor(system.stats.Dexterity.mod + system.stats.Agility.mod);
        system.initiative.base = Math.floor(system.stats.Dexterity.mod + system.stats.Agility.mod + system.initiative.sizeBase);
        if (system.aamField.final < 0) {
            system.initiative.base = Math.floor(system.initiative.base + ~~(system.aamField.final / 2));
        }

        //Ki Accumulation
        system.kiPool.agi.accumTot = Math.max(0, Math.floor(system.stats.Agility.kiPoolAccuBase + system.kiPool.agi.spec + system.kiPool.agi.temp + system.kiPool.agi.bonus + system.kiPool.agi.default + Math.min(0, ~~(system.aamField.final / 20))));
        system.kiPool.con.accumTot = Math.max(0, Math.floor(system.stats.Constitution.kiPoolAccuBase + system.kiPool.con.spec + system.kiPool.con.temp + system.kiPool.con.bonus + system.kiPool.con.default + Math.min(0, ~~(system.aamField.final / 20))));
        system.kiPool.dex.accumTot = Math.max(0, Math.floor(system.stats.Dexterity.kiPoolAccuBase + system.kiPool.dex.spec + system.kiPool.dex.temp + system.kiPool.dex.bonus + system.kiPool.dex.default + Math.min(0, ~~(system.aamField.final / 20))));
        system.kiPool.str.accumTot = Math.max(0, Math.floor(system.stats.Strength.kiPoolAccuBase + system.kiPool.str.spec + system.kiPool.str.temp + system.kiPool.str.bonus + system.kiPool.str.default + Math.min(0, ~~(system.aamField.final / 20))));
        system.kiPool.pow.accumTot = Math.max(0, Math.floor(system.stats.Power.kiPoolAccuBase + system.kiPool.pow.spec + system.kiPool.pow.temp + system.kiPool.pow.bonus + system.kiPool.pow.default + Math.min(0, ~~(system.aamField.final / 20))));
        system.kiPool.wp.accumTot = Math.max(0, Math.floor(system.stats.Willpower.kiPoolAccuBase + system.kiPool.wp.spec + system.kiPool.wp.temp + system.kiPool.wp.bonus + system.kiPool.wp.default + Math.min(0, ~~(system.aamField.final / 20))));

        //Ki Pool
        if (system.toggles.innatePower == true) {
            switch (system.kiPool.innate.type) {
                case "AGI":
                    system.stats.Agility.kiPoolBase = system.stats.Agility.kiPoolBase * 6;
                    system.kiPool.innate.tag = game.i18n.localize('abfalter.basicInfo.agi');
                    break;
                case "CON":
                    system.stats.Constitution.kiPoolBase = system.stats.Constitution.kiPoolBase * 6;
                    system.kiPool.innate.tag = game.i18n.localize('abfalter.basicInfo.con');
                    break;
                case "DEX":
                    system.stats.Dexterity.kiPoolBase = system.stats.Dexterity.kiPoolBase * 6;
                    system.kiPool.innate.tag = game.i18n.localize('abfalter.basicInfo.dex');
                    break;
                case "STR":
                    system.stats.Strength.kiPoolBase = system.stats.Strength.kiPoolBase * 6;
                    system.kiPool.innate.tag = game.i18n.localize('abfalter.basicInfo.str');
                    break;
                case "POW":
                    system.stats.Power.kiPoolBase = system.stats.Power.kiPoolBase * 6;
                    system.kiPool.innate.tag = game.i18n.localize('abfalter.basicInfo.pow');
                    break;
                case "WP":
                    system.stats.Willpower.kiPoolBase = system.stats.Willpower.kiPoolBase * 6;
                    system.kiPool.innate.tag = game.i18n.localize('abfalter.basicInfo.wp');
                    break;
                default:
                    system.kiPool.innate.tag = "Error";
                    break;
            }
        }
        system.kiPool.agi.poolTot = Math.floor(system.stats.Agility.kiPoolBase + system.kiPool.agi.specMax + system.kiPool.agi.tempMax + system.kiPool.agi.bonusMax + system.kiPool.agi.defaultMax);
        system.kiPool.con.poolTot = Math.floor(system.stats.Constitution.kiPoolBase + system.kiPool.con.specMax + system.kiPool.con.tempMax + system.kiPool.dex.bonusMax + system.kiPool.con.defaultMax);
        system.kiPool.dex.poolTot = Math.floor(system.stats.Dexterity.kiPoolBase + system.kiPool.dex.specMax + system.kiPool.dex.tempMax + system.kiPool.dex.bonusMax + system.kiPool.dex.defaultMax);
        system.kiPool.str.poolTot = Math.floor(system.stats.Strength.kiPoolBase + system.kiPool.str.specMax + system.kiPool.str.tempMax + system.kiPool.str.bonusMax + system.kiPool.str.defaultMax);
        system.kiPool.pow.poolTot = Math.floor(system.stats.Power.kiPoolBase + system.kiPool.pow.specMax + system.kiPool.pow.tempMax + system.kiPool.pow.bonusMax + system.kiPool.pow.defaultMax);
        system.kiPool.wp.poolTot = Math.floor(system.stats.Willpower.kiPoolBase + system.kiPool.wp.specMax + system.kiPool.wp.tempMax + system.kiPool.wp.bonusMax + system.kiPool.wp.defaultMax);

        if (system.toggles.unifiedPools == true) {
            if (system.toggles.innatePower == true) {
                switch (system.kiPool.innate.type) {
                    case "AGI":
                        system.unifiedKi.max = Math.floor(system.kiPool.innate.bonus + system.kiPool.agi.poolTot);
                        system.kiPool.con.poolTot = 0;
                        system.kiPool.dex.poolTot = 0;
                        system.kiPool.str.poolTot = 0;
                        system.kiPool.pow.poolTot = 0;
                        system.kiPool.wp.poolTot = 0;
                        system.innateAgi = true;
                        break;
                    case "CON":
                        system.unifiedKi.max = Math.floor(system.kiPool.innate.bonus + system.kiPool.con.poolTot);
                        system.kiPool.agi.poolTot = 0;
                        system.kiPool.dex.poolTot = 0;
                        system.kiPool.str.poolTot = 0;
                        system.kiPool.pow.poolTot = 0;
                        system.kiPool.wp.poolTot = 0;
                        break;
                    case "DEX":
                        system.unifiedKi.max = Math.floor(system.kiPool.innate.bonus + system.kiPool.dex.poolTot);
                        system.kiPool.agi.poolTot = 0;
                        system.kiPool.con.poolTot = 0;
                        system.kiPool.str.poolTot = 0;
                        system.kiPool.pow.poolTot = 0;
                        system.kiPool.wp.poolTot = 0;
                        break;
                    case "STR":
                        system.unifiedKi.max = Math.floor(system.kiPool.innate.bonus + system.kiPool.str.poolTot);
                        system.kiPool.agi.poolTot = 0;
                        system.kiPool.con.poolTot = 0;
                        system.kiPool.dex.poolTot = 0;
                        system.kiPool.pow.poolTot = 0;
                        system.kiPool.wp.poolTot = 0;
                        break;
                    case "POW":
                        system.unifiedKi.max = Math.floor(system.kiPool.innate.bonus + system.kiPool.pow.poolTot);
                        system.kiPool.agi.poolTot = 0;
                        system.kiPool.con.poolTot = 0;
                        system.kiPool.dex.poolTot = 0;
                        system.kiPool.str.poolTot = 0;
                        system.kiPool.wp.poolTot = 0;
                        break;
                    case "WP":
                        system.unifiedKi.max = Math.floor(system.kiPool.innate.bonus + system.kiPool.wp.poolTot);
                        system.kiPool.agi.poolTot = 0;
                        system.kiPool.con.poolTot = 0;
                        system.kiPool.dex.poolTot = 0;
                        system.kiPool.str.poolTot = 0;
                        system.kiPool.pow.poolTot = 0;
                        break;
                    default:
                        system.kiPool.innate.tag = "Error";
                        break;
                }
            } else {
                system.unifiedKi.max = Math.floor(system.kiPool.agi.poolTot + system.kiPool.con.poolTot + system.kiPool.dex.poolTot + system.kiPool.str.poolTot + system.kiPool.pow.poolTot + system.kiPool.wp.poolTot + system.kiPool.unifiedBonus);
            }
        }

        //atk, blk, dodge
        system.combatValues.attack.final = Math.floor(system.combatValues.attack.base + system.combatValues.attack.special + system.combatValues.attack.temp + system.combatValues.attack.bonus + system.stats.Dexterity.mod + system.aamField.final);
        system.combatValues.block.final = Math.floor(system.combatValues.block.base + system.combatValues.block.special + system.combatValues.block.temp + system.combatValues.block.bonus + system.stats.Dexterity.mod + system.aamField.final);
        system.combatValues.dodge.final = Math.floor(system.combatValues.dodge.base + system.combatValues.dodge.special + system.combatValues.dodge.temp + system.combatValues.dodge.bonus + system.stats.Agility.mod + system.aamField.final);

        //Magic Projection system.mproj.spec + system.mproj.temp
        system.mproj.final = Math.floor(system.mproj.base + system.stats.Dexterity.mod + system.aamField.final);
        system.mproj.finalOffensive = Math.floor(system.mproj.final + system.mproj.spec + system.mproj.temp + system.mproj.bonus + system.mproj.imbalance);
        system.mproj.finalDefensive = Math.floor(system.mproj.final + system.mproj.spec2 + system.mproj.temp2 + system.mproj.bonus2 - system.mproj.imbalance);

        system.mproj.atkModule = Math.floor(system.combatValues.attack.base + system.mproj.spec + system.mproj.temp + system.mproj.bonus + system.stats.Dexterity.mod + system.aamField.final);
        system.mproj.defModule = Math.floor(system.combatValues.block.base + system.mproj.spec2 + system.mproj.temp2 + system.mproj.bonus2 + system.stats.Dexterity.mod + system.aamField.final);
        system.mproj.dodModule = Math.floor(system.combatValues.dodge.base + system.mproj.spec2 + system.mproj.temp2 + system.mproj.bonus2 + system.stats.Dexterity.mod + system.aamField.final);

        // Psychic Potential
        if (system.stats.Willpower.final < 5) {
            system.ppotential.wpBase = 0;
        } else if (system.stats.Willpower.final >= 5 && system.stats.Willpower.final < 15) {
            system.ppotential.wpBase = Math.floor((system.stats.Willpower.final - 4) * 10);
        } else if (system.stats.Willpower.final >= 15) {
            system.ppotential.wpBase = Math.floor(((system.stats.Willpower.final - 14) * 20) + 100)
        }
        system.ppotential.final = Math.floor(system.ppotential.base + system.ppotential.wpBase + + system.ppotential.spent + system.ppotential.spec + system.ppotential.temp + system.ppotential.bonus);
        switch (system.ppotential.spent) {
            case 10:
                system.ppotential.fromPP = 1;
                break;
            case 20:
                system.ppotential.fromPP = 3;
                break;
            case 30:
                system.ppotential.fromPP = 6;
                break;
            case 40:
                system.ppotential.fromPP = 10;
                break;
            case 50:
                system.ppotential.fromPP = 15;
                break;
            case 60:
                system.ppotential.fromPP = 21;
                break;
            case 70:
                system.ppotential.fromPP = 28;
                break;
            case 80:
                system.ppotential.fromPP = 36;
                break;
            case 90:
                system.ppotential.fromPP = 45;
                break;
            case 100:
                system.ppotential.fromPP = 55;
                break;
            default:
                system.ppotential.fromPP = 0;
                break;
        }

        // Psychic Projection
        system.pproj.final = Math.floor(system.pproj.base + system.pproj.spec + system.pproj.temp + system.pproj.bonusBase + system.stats.Dexterity.mod + system.aamField.final);

        system.pproj.atkModule = Math.floor(system.combatValues.attack.base + system.pproj.spec + system.pproj.temp + system.pproj.bonus + system.stats.Dexterity.mod + system.aamField.final);
        system.pproj.defModule = Math.floor(system.combatValues.block.base + system.pproj.spec + system.pproj.temp + system.pproj.bonus2 + system.stats.Dexterity.mod + system.aamField.final);
        system.pproj.dodModule = Math.floor(system.combatValues.dodge.base + system.pproj.spec + system.pproj.temp + system.pproj.bonus2 + system.stats.Dexterity.mod + system.aamField.final);
        // Wear Armor
        system.armor.wearArmor.final = Math.floor(system.armor.wearArmor.base + system.armor.wearArmor.spec + system.armor.wearArmor.temp + system.armor.wearArmor.bonus + system.stats.Strength.mod);

        const classBonuses = {
            level: 0, lpbonus: 0, ini: 0, atk: 0, dod: 0, blk: 0, weararm: 0, mk: 0, pp: 0, zeon: 0, summon: 0, control: 0, bind: 0, banish: 0, acro: 0,
            athle: 0, climb: 0, jump: 0, ride: 0, swim: 0, etiq: 0, intim: 0, leader: 0, persua: 0, street: 0, style: 0, trading: 0, notice: 0, search: 0, track: 0,
            animals: 0, appra: 0, archi: 0, herb: 0, hist: 0, law: 0, magicapr: 0, medic: 0, mem: 0, navi: 0, occ: 0, science: 0, tactic: 0, comp: 0, fos: 0,
            wstp: 0, disg: 0, hide: 0, lock: 0, poisn: 0, stealth: 0, theft: 0, trapl: 0, alche: 0, anims: 0, art: 0, dance: 0, forgi: 0, jewel: 0, music: 0,
            runes: 0, ritcal: 0, soh: 0, tailoring: 0, quantity: 0, req: 0, natPen: 0, movePen: 0, aCutMax: 0, aCutTot: 0, aImpMax: 0, aImpTot: 0, aThrMax: 0, aThrTot: 0, aHeatMax: 0,
            aHeatTot: 0, aColdMax: 0, aColdTot: 0, aEleMax: 0, aEleTot: 0, aEneMax: 0, aEneTot: 0, aSptMax: 0, aSptTot: 0, ahReq: 0, ahCutMax: 0, ahCutTot: 0, ahImpMax: 0, ahImpTot: 0, ahThrMax: 0,
            ahThrTot: 0, ahHeatMax: 0, ahHeatTot: 0, ahColdMax: 0, ahColdTot: 0, ahEleMax: 0, ahEleTot: 0, ahEneMax: 0, ahEneTot: 0, ahSptMax: 0, ahSptTot: 0, perPen: 0, usedpp: 0, matrixpp: 0, arsMk: 0,
            maMk: 0, techMk: 0, pathLvl: 0, turnMaint: 0, dayMaint: 0, spellCost: 0, wepNum: 0, wepSpd: 0, maKiAtk: 0, maKiBlk: 0, maKiDod: 0, pilot: 0, techmagic: 0, cook: 0, toy: 0,
            kiDect: 0, kiCon: 0, wepName: "", monsterCost: 0
        }
        this.items.reduce((arr, item) => {
                if (item.type === "class") {
                    const classLevels = parseInt(item.system.main.levels) || 0;
                    classBonuses.level += classLevels;
                    classBonuses.lpbonus += classLevels * (parseInt(item.system.main.lp) || 0);
                    classBonuses.ini += classLevels * (parseInt(item.system.main.initiative) || 0);
                    classBonuses.atk += classLevels * (parseInt(item.system.main.attack) || 0);
                    classBonuses.dod += classLevels * (parseInt(item.system.main.dodge) || 0);
                    classBonuses.blk += classLevels * (parseInt(item.system.main.block) || 0);
                    classBonuses.weararm += classLevels * (parseInt(item.system.main.weararmor) || 0);
                    classBonuses.mk += classLevels * (parseInt(item.system.main.mk) || 0);
                    classBonuses.pp += (parseInt(item.system.totalPP) || 0);
                    classBonuses.zeon += classLevels * (parseInt(item.system.main.zeon) || 0);
                    classBonuses.summon += classLevels * (parseInt(item.system.main.summon) || 0);
                    classBonuses.control += classLevels * (parseInt(item.system.main.control) || 0);
                    classBonuses.bind += classLevels * (parseInt(item.system.main.bind) || 0);
                    classBonuses.banish += classLevels * (parseInt(item.system.main.banish) || 0);
                    classBonuses.acro += classLevels * (parseInt(item.system.secondary.acro) || 0);
                    classBonuses.athle += classLevels * (parseInt(item.system.secondary.athleticism) || 0);
                    classBonuses.climb += classLevels * (parseInt(item.system.secondary.climb) || 0);
                    classBonuses.jump += classLevels * (parseInt(item.system.secondary.jump) || 0);
                    classBonuses.pilot += classLevels * (parseInt(item.system.secondary.piloting) || 0);
                    classBonuses.ride += classLevels * (parseInt(item.system.secondary.ride) || 0);
                    classBonuses.swim += classLevels * (parseInt(item.system.secondary.swim) || 0);
                    classBonuses.etiq += classLevels * (parseInt(item.system.secondary.etiquette) || 0);
                    classBonuses.intim += classLevels * (parseInt(item.system.secondary.intimidate) || 0);
                    classBonuses.leader += classLevels * (parseInt(item.system.secondary.leadership) || 0);
                    classBonuses.persua += classLevels * (parseInt(item.system.secondary.persuasion) || 0);
                    classBonuses.street += classLevels * (parseInt(item.system.secondary.streetwise) || 0);
                    classBonuses.style += classLevels * (parseInt(item.system.secondary.style) || 0);
                    classBonuses.trading += classLevels * (parseInt(item.system.secondary.trading) || 0);
                    classBonuses.notice += classLevels * (parseInt(item.system.secondary.notice) || 0);
                    classBonuses.search += classLevels * (parseInt(item.system.secondary.search) || 0);
                    classBonuses.track += classLevels * (parseInt(item.system.secondary.track) || 0);
                    classBonuses.kiDect += classLevels * (parseInt(item.system.secondary.kidetection) || 0);
                    classBonuses.animals += classLevels * (parseInt(item.system.secondary.animals) || 0);
                    classBonuses.appra += classLevels * (parseInt(item.system.secondary.appraisal) || 0);
                    classBonuses.archi += classLevels * (parseInt(item.system.secondary.architecture) || 0);
                    classBonuses.herb += classLevels * (parseInt(item.system.secondary.herballore) || 0);
                    classBonuses.hist += classLevels * (parseInt(item.system.secondary.history) || 0);
                    classBonuses.law += classLevels * (parseInt(item.system.secondary.law) || 0);
                    classBonuses.magicapr += classLevels * (parseInt(item.system.secondary.magicappr) || 0);
                    classBonuses.medic += classLevels * (parseInt(item.system.secondary.medicine) || 0);
                    classBonuses.mem += classLevels * (parseInt(item.system.secondary.memorize) || 0);
                    classBonuses.navi += classLevels * (parseInt(item.system.secondary.navigation) || 0);
                    classBonuses.occ += classLevels * (parseInt(item.system.secondary.occult) || 0);
                    classBonuses.science += classLevels * (parseInt(item.system.secondary.science) || 0);
                    classBonuses.tactic += classLevels * (parseInt(item.system.secondary.tactics) || 0);
                    classBonuses.techmagic += classLevels * (parseInt(item.system.secondary.technomagic) || 0);
                    classBonuses.comp += classLevels * (parseInt(item.system.secondary.composure) || 0);
                    classBonuses.fos += classLevels * (parseInt(item.system.secondary.featsofstr) || 0);
                    classBonuses.wstp += classLevels * (parseInt(item.system.secondary.withstpain) || 0);
                    classBonuses.disg += classLevels * (parseInt(item.system.secondary.disguise) || 0);
                    classBonuses.hide += classLevels * (parseInt(item.system.secondary.hide) || 0);
                    classBonuses.lock += classLevels * (parseInt(item.system.secondary.lockpicking) || 0);
                    classBonuses.poisn += classLevels * (parseInt(item.system.secondary.poisons) || 0);
                    classBonuses.stealth += classLevels * (parseInt(item.system.secondary.stealth) || 0);
                    classBonuses.theft += classLevels * (parseInt(item.system.secondary.theft) || 0);
                    classBonuses.trapl += classLevels * (parseInt(item.system.secondary.traplore) || 0);
                    classBonuses.kiCon += classLevels * (parseInt(item.system.secondary.kiconceal) || 0);
                    classBonuses.alche += classLevels * (parseInt(item.system.secondary.alchemy) || 0);
                    classBonuses.anims += classLevels * (parseInt(item.system.secondary.animism) || 0);
                    classBonuses.art += classLevels * (parseInt(item.system.secondary.art) || 0);
                    classBonuses.cook += classLevels * (parseInt(item.system.secondary.cooking) || 0);
                    classBonuses.dance += classLevels * (parseInt(item.system.secondary.dance) || 0);
                    classBonuses.forgi += classLevels * (parseInt(item.system.secondary.forging) || 0);
                    classBonuses.jewel += classLevels * (parseInt(item.system.secondary.jewelry) || 0);
                    classBonuses.toy += classLevels * (parseInt(item.system.secondary.toymaking) || 0);
                    classBonuses.music += classLevels * (parseInt(item.system.secondary.music) || 0);
                    classBonuses.runes += classLevels * (parseInt(item.system.secondary.runes) || 0);
                    classBonuses.ritcal += classLevels * (parseInt(item.system.secondary.ritualcalig) || 0);
                    classBonuses.soh += classLevels * (parseInt(item.system.secondary.slofhand) || 0);
                    classBonuses.tailoring += classLevels * (parseInt(item.system.secondary.tailoring) || 0);
                }
                if (item.type === "armor") {
                    if (item.system.equipped == true) {
                        classBonuses.quantity += parseInt(item.system.quantity) || 0;
                        classBonuses.req += parseInt(item.system.newRequirement) || 0;
                        classBonuses.natPen += parseInt(item.system.newNatPenalty) || 0;
                        classBonuses.movePen += parseInt(item.system.newMovePenalty) || 0;
                        if (classBonuses.aCutMax < item.system.AT.newCut) {
                            classBonuses.aCutMax = item.system.AT.newCut;
                        }
                        classBonuses.aCutTot += parseInt(item.system.AT.newCut / 2) || 0;
                        if (classBonuses.aImpMax < item.system.AT.newImp) {
                            classBonuses.aImpMax = item.system.AT.newImp;
                        }
                        classBonuses.aImpTot += parseInt(item.system.AT.newImp / 2) || 0;
                        if (classBonuses.aThrMax < item.system.AT.newThr) {
                            classBonuses.aThrMax = item.system.AT.newThr;
                        }
                        classBonuses.aThrTot += parseInt(item.system.AT.newThr / 2) || 0;
                        if (classBonuses.aHeatMax < item.system.AT.newHeat) {
                            classBonuses.aHeatMax = item.system.AT.newHeat;
                        }
                        classBonuses.aHeatTot += parseInt(item.system.AT.newHeat / 2) || 0;
                        if (classBonuses.aColdMax < item.system.AT.newCold) {
                            classBonuses.aColdMax = item.system.AT.newCold;
                        }
                        classBonuses.aColdTot += parseInt(item.system.AT.newCold / 2) || 0;
                        if (classBonuses.aEleMax < item.system.AT.newEle) {
                            classBonuses.aEleMax = item.system.AT.newEle;
                        }
                        classBonuses.aEleTot += parseInt(item.system.AT.newEle / 2) || 0;
                        if (classBonuses.aEneMax < item.system.AT.newEne) {
                            classBonuses.aEneMax = item.system.AT.newEne;
                        }
                        classBonuses.aEneTot += parseInt(item.system.AT.newEne / 2) || 0;
                        if (classBonuses.aSptMax < item.system.AT.newSpt) {
                            classBonuses.aSptMax = item.system.AT.newSpt;
                        }
                        classBonuses.aSptTot += parseInt(item.system.AT.newSpt / 2) || 0;
                    }
                }
                if (item.type === "armorHelmet") {
                    if (item.system.equipped == true) {
                        classBonuses.ahReq += parseInt(item.system.newRequirement) || 0;
                        if (classBonuses.ahCutMax < item.system.AT.newCut) {
                            classBonuses.ahCutMax = item.system.AT.newCut;
                        }
                        classBonuses.ahCutTot += parseInt(item.system.AT.newCut / 2) || 0;
                        if (classBonuses.ahImpMax < item.system.AT.newImp) {
                            classBonuses.ahImpMax = item.system.AT.newImp;
                        }
                        classBonuses.ahImpTot += parseInt(item.system.AT.newImp / 2) || 0;
                        if (classBonuses.ahThrMax < item.system.AT.newThr) {
                            classBonuses.ahThrMax = item.system.AT.newThr;
                        }
                        classBonuses.ahThrTot += parseInt(item.system.AT.newThr / 2) || 0;
                        if (classBonuses.ahHeatMax < item.system.AT.newHeat) {
                            classBonuses.ahHeatMax = item.system.AT.newHeat;
                        }
                        classBonuses.ahHeatTot += parseInt(item.system.AT.newHeat / 2) || 0;
                        if (classBonuses.ahColdMax < item.system.AT.newCold) {
                            classBonuses.ahColdMax = item.system.AT.newCold;
                        }
                        classBonuses.ahColdTot += parseInt(item.system.AT.newCold / 2) || 0;
                        if (classBonuses.ahEleMax < item.system.AT.newEle) {
                            classBonuses.ahEleMax = item.system.AT.newEle;
                        }
                        classBonuses.ahEleTot += parseInt(item.system.AT.newEle / 2) || 0;
                        if (classBonuses.ahEneMax < item.system.AT.newEne) {
                            classBonuses.ahEneMax = item.system.AT.newEne;
                        }
                        classBonuses.ahEneTot += parseInt(item.system.AT.newEne / 2) || 0;
                        if (classBonuses.ahSptMax < item.system.AT.newSpt) {
                            classBonuses.ahSptMax = item.system.AT.newSpt;
                        }
                        classBonuses.ahSptTot += parseInt(item.system.AT.newSpt / 2) || 0;
                        classBonuses.perPen += parseInt(item.system.newNatPenalty) || 0;
                    }
                }
                if (item.type === "discipline") {
                    classBonuses.usedpp += parseInt(item.system.quantity) || 0;
                }
                if (item.type === "psychicMatrix") {
                    classBonuses.usedpp += parseInt(item.system.quantity) || 0;
                    if (system.toggles.psychicStrengthening == true) {
                        classBonuses.matrixpp += parseInt(item.system.bonus / 20) || 0;
                    } else {
                        classBonuses.matrixpp += parseInt(item.system.bonus / 10) || 0;
                    }
                }
                if (item.type === "arsMagnus") {
                    classBonuses.arsMk += parseInt(item.system.mk) || 0;
                }
                if (item.type === "martialArt") {
                    classBonuses.maMk += parseInt(item.system.mk) || 0;
                    classBonuses.maKiAtk += parseInt(item.system.bonusAtk) || 0;
                    classBonuses.maKiBlk += parseInt(item.system.bonusDef) || 0;
                    classBonuses.maKiDod += parseInt(item.system.bonusDod) || 0;
                }
                if (item.type === "kiTechnique") {
                    classBonuses.techMk += parseInt(item.system.mk) || 0;
                }
                if (item.type === "spellPath") {
                    classBonuses.pathLvl += parseInt(item.system.level) || 0;
                }
                if (item.type === "turnMaint") {
                    if (item.system.equipped == true) {
                        classBonuses.turnMaint += parseInt(item.system.zeon) || 0;
                    }
                }
                if (item.type === "dailyMaint") {
                    if (item.system.equipped == true) {
                        classBonuses.dayMaint += parseInt(item.system.zeon) || 0;
                    }
                }
                if (item.type === "spell") {
                    if (item.system.bought == "Single") {
                        classBonuses.spellCost += parseInt(item.system.cost) || 0;
                    }
                }
                if (item.type === "weapon") {
                    if (item.system.equipped == true) {
                        classBonuses.wepNum += 1;
                        if (classBonuses.wepNum == 1) {
                            classBonuses.wepSpd = item.system.FinalWeaponSpeed;
                            classBonuses.wepName = item.name;
                        } else if (classBonuses.wepSpd > item.system.FinalWeaponSpeed) {
                            classBonuses.wepSpd = item.system.FinalWeaponSpeed;
                        }
                    }
                }
                if (item.type === "monsterPower") {
                    classBonuses.monsterCost += parseInt(item.system.cost) || 0;
                }
            });
        //Stuff Xp, Presence, Next lvl Xp
        system.levelinfo.level = classBonuses.level; //class Bonus
        if (system.levelinfo.level == 0) {
            system.levelinfo.dp = 400 + system.levelinfo.dpmod + system.levelinfo.dpmodBonus;
        } else {
            system.levelinfo.dp = Math.floor((system.levelinfo.level * 100) + 500 + system.levelinfo.dpmod + system.levelinfo.dpmodBonus);
        }
        system.levelinfo.presence = Math.floor((system.levelinfo.dp / 20) + system.levelinfo.presencemod + system.levelinfo.presencemodBonus);
        system.levelinfo.nextlevel = Math.floor(((system.levelinfo.level + system.levelinfo.levelmod + system.levelinfo.levelmodBonus) * 25) + 75);

        //Mk Calculations
        system.mk.class = classBonuses.mk; //Class Mk
        system.mk.kiAbilitiesCost = 0; //Ki Abilities Cost
        for (let [key, kiThing] of Object.entries(system.kiAbility)) {
            if (kiThing.status == true && kiThing.status2 == false) {
                system.mk.kiAbilitiesCost += kiThing.cost;
            } else {
                system.mk.kiAbilitiesCost += 0;
            }
        }
        system.mk.kiSealCost = 0; //Minor & Major Seals Cost
        for (let [key, kiSealStuff] of Object.entries(system.kiSeal.minor)) {
            if (kiSealStuff.mastery == true && kiSealStuff.mastery2 == false) {
                system.mk.kiSealCost += 30;
            } else {
                system.mk.kiSealCost += 0;
            }
        }
        for (let [key, kiSealStuff] of Object.entries(system.kiSeal.major)) {
            if (kiSealStuff.mastery == true && kiSealStuff.mastery2 == false) {
                system.mk.kiSealCost += 50;
            } else {
                system.mk.kiSealCost += 0;
            }
        }
        switch (system.limits.limitOne) {
            case "mors":
                system.mk.limitOneCost = 30;
                break;
            case "cenobus":
                system.mk.limitOneCost = 20;
                break;
            case "caelum":
                system.mk.limitOneCost = 15;
                break;
            case "agon":
                system.mk.limitOneCost = 20;
                break;
            case "custodium":
                system.mk.limitOneCost = 10;
                break;
            case "cruor":
                system.mk.limitOneCost = 10;
                break;
            case "terminus":
                system.mk.limitOneCost = 10;
                break;
            default:
                system.mk.limitOneCost = 0;
                break;
        }
        switch (system.limits.limitTwo) {
            case "mors":
                system.mk.limitTwoCost = 30;
                break;
            case "cenobus":
                system.mk.limitTwoCost = 20;
                break;
            case "caelum":
                system.mk.limitTwoCost = 15;
                break;
            case "agon":
                system.mk.limitTwoCost = 20;
                break;
            case "custodium":
                system.mk.limitTwoCost = 10;
                break;
            case "cruor":
                system.mk.limitTwoCost = 10;
                break;
            case "terminus":
                system.mk.limitTwoCost = 10;
                break;
            default:
                system.mk.limitTwoCost = 0;
                break;
        }

        system.mk.limitsTotalCost = +system.mk.limitOneCost + +system.mk.limitTwoCost; //Limits Cost
        system.mk.arsMagCost = classBonuses.arsMk; //Ars Magnus Cost
        system.mk.martialArtsCost = classBonuses.maMk; //Martial Arts Bonus MK
        system.mk.kiTechCost = classBonuses.techMk; //Ki Technique Cost
        system.mk.final = Math.floor(system.mk.base + system.mk.temp + system.mk.spec + system.mk.bonus + system.mk.class + system.mk.martialArtsCost); //Total Final Mk
        system.mk.used = Math.floor(system.mk.limitsTotalCost + system.mk.kiAbilitiesCost + system.mk.kiSealCost + system.mk.arsMagCost + system.mk.kiTechCost); //Total Used Mk

        // Wear Armor
        system.armor.wearArmor.class = classBonuses.weararm;
        system.armor.wearArmor.final += classBonuses.weararm;

        if (system.kiAbility.kiEnergyArmor.status == true) { //Energy armor add 2 energy AT for free
            system.otherStats.enArm = 2;
            if (system.toggles.greaterEnergyArmor == true && system.kiAbility.kiArcaneArmor.status == false) { //Greater energy armor only if arcane is not bought
                system.otherStats.enArm = 4;
            } else if (system.kiAbility.kiArcaneArmor.status == true) {
                system.otherStats.enArm = 4;
                system.toggles.greaterEnergyArmor = false;
                if (system.toggles.arcaneEnergyArmor == true) {
                    system.otherStats.enArm = 6;
                }
            }
        } else {
            system.otherStats.enArm = 0;
        }
        if (system.kiAbility.kiGreaterArmor.status == false) {
            system.toggles.greaterEnergyArmor = false;
        }
        if (system.kiAbility.kiArcaneArmor.status == false) {
            system.toggles.arcaneEnergyArmor = false;
        }
        // Armor Final AT
        system.armor.body.aCutFinal = Math.floor((classBonuses.aCutTot - ~~(classBonuses.aCutMax / 2)) + classBonuses.aCutMax);
        system.armor.body.aImpFinal = Math.floor((classBonuses.aImpTot - ~~(classBonuses.aImpMax / 2)) + classBonuses.aImpMax);
        system.armor.body.aThrFinal = Math.floor((classBonuses.aThrTot - ~~(classBonuses.aThrMax / 2)) + classBonuses.aThrMax);
        system.armor.body.aHeatFinal = Math.floor((classBonuses.aHeatTot - ~~(classBonuses.aHeatMax / 2)) + classBonuses.aHeatMax);
        system.armor.body.aColdFinal = Math.floor((classBonuses.aColdTot - ~~(classBonuses.aColdMax / 2)) + classBonuses.aColdMax);
        system.armor.body.aEleFinal = Math.floor((classBonuses.aEleTot - ~~(classBonuses.aEleMax / 2)) + classBonuses.aEleMax);
        system.armor.body.aEneFinal = Math.floor((classBonuses.aEneTot - ~~(classBonuses.aEneMax / 2)) + classBonuses.aEneMax + system.otherStats.enArm);
        system.armor.body.aSptFinal = Math.floor((classBonuses.aSptTot - ~~(classBonuses.aSptMax / 2)) + classBonuses.aSptMax);

        // Helmet Final AT
        system.armor.helmet.ahCutFinal = Math.floor((classBonuses.ahCutTot - ~~(classBonuses.ahCutMax / 2)) + classBonuses.ahCutMax);
        system.armor.helmet.ahImpFinal = Math.floor((classBonuses.ahImpTot - ~~(classBonuses.ahImpMax / 2)) + classBonuses.ahImpMax);
        system.armor.helmet.ahThrFinal = Math.floor((classBonuses.ahThrTot - ~~(classBonuses.ahThrMax / 2)) + classBonuses.ahThrMax);
        system.armor.helmet.ahHeatFinal = Math.floor((classBonuses.ahHeatTot - ~~(classBonuses.ahHeatMax / 2)) + classBonuses.ahHeatMax);
        system.armor.helmet.ahColdFinal = Math.floor((classBonuses.ahColdTot - ~~(classBonuses.ahColdMax / 2)) + classBonuses.ahColdMax);
        system.armor.helmet.ahEleFinal = Math.floor((classBonuses.ahEleTot - ~~(classBonuses.ahEleMax / 2)) + classBonuses.ahEleMax);
        system.armor.helmet.ahEneFinal = Math.floor((classBonuses.ahEneTot - ~~(classBonuses.ahEneMax / 2)) + classBonuses.ahEneMax);
        system.armor.helmet.ahSptFinal = Math.floor((classBonuses.ahSptTot - ~~(classBonuses.ahSptMax / 2)) + classBonuses.ahSptMax);

        // Armor Stats
        system.armor.wearArmor.totalPerPen = classBonuses.perPen;
        system.armor.wearArmor.mod = Math.floor(system.armor.wearArmor.final - classBonuses.req);
        if (classBonuses.natPen - system.armor.wearArmor.mod < 0) {
            system.armor.wearArmor.totalNatPen = Math.max(0, Math.floor(((classBonuses.quantity - 1) * 20) + 0));
        } else {
            system.armor.wearArmor.totalNatPen = Math.max(0, Math.floor(((classBonuses.quantity - 1) * 20) + (classBonuses.natPen - system.armor.wearArmor.mod)));
        }
        system.armor.wearArmor.movePenMod = Math.max(0, Math.floor(system.armor.wearArmor.mod / 50));
        if (classBonuses.movePen - system.armor.wearArmor.movePenMod < 0) {
            system.armor.wearArmor.totalMovePen = -Math.floor(classBonuses.movePen + Math.max(0, system.armor.wearArmor.totalNatPen / 50));
        } else {
            system.armor.wearArmor.totalMovePen = -Math.floor(classBonuses.movePen + Math.max(0, system.armor.wearArmor.totalNatPen / 50) - system.armor.wearArmor.movePenMod);
        }

        //Resistances
        if (system.kiAbility.kiPhysDom.status == true) { //Physical Dominion adds 10 PhR
            system.otherStats.phrDom = 10;
        } else {
            system.otherStats.phrDom = 0;
        }
        if (system.kiAbility.nemiBodyEmpty.status == true) { //Physical Dominion adds 20 PhR
            system.otherStats.allEmpty = 20;
        } else {
            system.otherStats.allEmpty = 0;
        }

        for (let [key, res] of Object.entries(system.resistances)) {
            switch (key) {
                case "Physical":
                    res.name = game.i18n.localize('abfalter.sheet.physicalRes');
                    res.short = game.i18n.localize('abfalter.sheet.phr');
                    res.final = Math.floor(system.levelinfo.presence + res.mod + stats.Constitution.mod + system.otherStats.phrDom + system.otherStats.allEmpty + res.bonus);
                    break;
                case "Disease":
                    res.name = game.i18n.localize('abfalter.sheet.diseaseRes');
                    res.short = game.i18n.localize('abfalter.sheet.dr');
                    res.final = Math.floor(system.levelinfo.presence + res.mod + stats.Constitution.mod + system.otherStats.allEmpty + res.bonus);
                    break;
                case "Poison":
                    res.name = game.i18n.localize('abfalter.sheet.poisonRes');
                    res.short = game.i18n.localize('abfalter.sheet.psnr');
                    res.final = Math.floor(system.levelinfo.presence + res.mod + stats.Constitution.mod + system.otherStats.allEmpty + res.bonus);
                    break;
                case "Magic":
                    res.name = game.i18n.localize('abfalter.sheet.magicRes');
                    res.short = game.i18n.localize('abfalter.sheet.mr');
                    res.final = Math.floor(system.levelinfo.presence + res.mod + stats.Power.mod + system.otherStats.allEmpty + res.bonus);
                    break;
                case "Psychic":
                    res.name = game.i18n.localize('abfalter.sheet.psychicRes');
                    res.short = game.i18n.localize('abfalter.sheet.psyr');
                    res.final = Math.floor(system.levelinfo.presence + res.mod + stats.Willpower.mod + system.otherStats.allEmpty + res.bonus);
                    break;
                default:
                    break;
            }
        }

        //Movement
        system.movement.final = Math.floor(system.stats.Agility.final + system.movement.spec + system.movement.temp + system.movement.bonus + system.movement.sizeBase - system.movement.pen + Math.min(0, Math.ceil(system.aamField.final / 20)) + system.armor.wearArmor.totalMovePen);
        switch (system.movement.final) {
            case 1:
                if (system.other.useMeters) {
                    system.movement.fullMove = "<1 m.";
                    system.movement.fourthMove = "<1 m.";
                    system.movement.runningMove = "<1 m.";
                } else {
                    system.movement.fullMove = "3 ft";
                    system.movement.fourthMove = "1 ft";
                    system.movement.runningMove = "N/A";
                }
                break;
            case 2:
                if (system.other.useMeters) {
                    system.movement.fullMove = "4 m.";
                    system.movement.fourthMove = "1 m.";
                    system.movement.runningMove = "2 m.";
                } else {
                    system.movement.fullMove = "15 ft";
                    system.movement.fourthMove = "3 ft";
                    system.movement.runningMove = "7 ft";
                }
                break;
            case 3:
                if (system.other.useMeters) {
                    system.movement.fullMove = "8 m.";
                    system.movement.fourthMove = "2 m.";
                    system.movement.runningMove = "4 m.";
                } else {
                    system.movement.fullMove = "25 ft";
                    system.movement.fourthMove = "6 ft";
                    system.movement.runningMove = "12 ft";
                }
                break;
            case 4:
                if (system.other.useMeters) {
                    system.movement.fullMove = "15 m.";
                    system.movement.fourthMove = "4 m.";
                    system.movement.runningMove = "8 m.";
                } else {
                    system.movement.fullMove = "50 ft";
                    system.movement.fourthMove = "12 ft";
                    system.movement.runningMove = "15 ft";
                }
                break;
            case 5:
                if (system.other.useMeters) {
                    system.movement.fullMove = "20 m.";
                    system.movement.fourthMove = "5 m.";
                    system.movement.runningMove = "8 m.";
                } else {
                    system.movement.fullMove = "65 ft";
                    system.movement.fourthMove = "16 ft";
                    system.movement.runningMove = "25 ft";
                }
                break;
            case 6:
                if (system.other.useMeters) {
                    system.movement.fullMove = "22 m.";
                    system.movement.fourthMove = "5 m.";
                    system.movement.runningMove = "15 m.";
                } else {
                    system.movement.fullMove = "70 ft";
                    system.movement.fourthMove = "17 ft";
                    system.movement.runningMove = "50 ft";
                }
                break;
            case 7:
                if (system.other.useMeters) {
                    system.movement.fullMove = "25 m.";
                    system.movement.fourthMove = "6 m.";
                    system.movement.runningMove = "20 m.";
                } else {
                    system.movement.fullMove = "80 ft";
                    system.movement.fourthMove = "20 ft";
                    system.movement.runningMove = "65 ft";
                }
                break;
            case 8:
                if (system.other.useMeters) {
                    system.movement.fullMove = "28 m.";
                    system.movement.fourthMove = "7 m.";
                    system.movement.runningMove = "22 m.";
                } else {
                    system.movement.fullMove = "90 ft";
                    system.movement.fourthMove = "22 ft";
                    system.movement.runningMove = "70 ft";
                }
                break;
            case 9:
                if (system.other.useMeters) {
                    system.movement.fullMove = "32 m.";
                    system.movement.fourthMove = "8 m.";
                    system.movement.runningMove = "25 m.";
                } else {
                    system.movement.fullMove = "105 ft";
                    system.movement.fourthMove = "26 ft";
                    system.movement.runningMove = "80 ft";
                }
                break;
            case 10:
                if (system.other.useMeters) {
                    system.movement.fullMove = "35 m.";
                    system.movement.fourthMove = "9 m.";
                    system.movement.runningMove = "28 m.";
                } else {
                    system.movement.fullMove = "115 ft";
                    system.movement.fourthMove = "28 ft";
                    system.movement.runningMove = "90 ft";
                }
                break;
            case 11:
                if (system.other.useMeters) {
                    system.movement.fullMove = "40 m.";
                    system.movement.fourthMove = "10 m.";
                    system.movement.runningMove = "32 m.";
                } else {
                    system.movement.fullMove = "130 ft";
                    system.movement.fourthMove = "32 ft";
                    system.movement.runningMove = "105 ft";
                }
                break;
            case 12:
                if (system.other.useMeters) {
                    system.movement.fullMove = "50 m.";
                    system.movement.fourthMove = "12 m.";
                    system.movement.runningMove = "35 m.";
                } else {
                    system.movement.fullMove = "160 ft";
                    system.movement.fourthMove = "40 ft";
                    system.movement.runningMove = "115 ft";
                }
                break;
            case 13:
                if (system.other.useMeters) {
                    system.movement.fullMove = "80 m.";
                    system.movement.fourthMove = "20 m.";
                    system.movement.runningMove = "40 m.";
                } else {
                    system.movement.fullMove = "250 ft";
                    system.movement.fourthMove = "62 ft";
                    system.movement.runningMove = "130 ft";
                }
                break;
            case 14:
                if (system.other.useMeters) {
                    system.movement.fullMove = "150 m.";
                    system.movement.fourthMove = "37 m.";
                    system.movement.runningMove = "50 m.";
                } else {
                    system.movement.fullMove = "500 ft";
                    system.movement.fourthMove = "125 ft";
                    system.movement.runningMove = "160 ft";
                }
                break;
            case 15:
                if (system.other.useMeters) {
                    system.movement.fullMove = "250 m.";
                    system.movement.fourthMove = "62 m.";
                    system.movement.runningMove = "80 m.";
                } else {
                    system.movement.fullMove = "800 ft";
                    system.movement.fourthMove = "200 ft";
                    system.movement.runningMove = "250 ft";
                }
                break;
            case 16:
                if (system.other.useMeters) {
                    system.movement.fullMove = "500 m.";
                    system.movement.fourthMove = "125 m.";
                    system.movement.runningMove = "150 m.";
                } else {
                    system.movement.fullMove = "1500 ft";
                    system.movement.fourthMove = "375 ft";
                    system.movement.runningMove = "500 ft";
                }
                break;
            case 17:
                if (system.other.useMeters) {
                    system.movement.fullMove = "1 Km.";
                    system.movement.fourthMove = "250 m.";
                    system.movement.runningMove = "500 m.";
                } else {
                    system.movement.fullMove = "3000 ft";
                    system.movement.fourthMove = "750 ft";
                    system.movement.runningMove = "1500 ft";
                }
                break;
            case 18:
                if (system.other.useMeters) {
                    system.movement.fullMove = "5 Km.";
                    system.movement.fourthMove = "1.2 Km.";
                    system.movement.runningMove = "2.5 Km.";
                } else {
                    system.movement.fullMove = "3 miles";
                    system.movement.fourthMove = "3960 ft";
                    system.movement.runningMove = "1.5 miles";
                }
                break;
            case 19:
                if (system.other.useMeters) {
                    system.movement.fullMove = "25 Km.";
                    system.movement.fourthMove = "6.2 Km.";
                    system.movement.runningMove = "12.5 Km.";
                } else {
                    system.movement.fullMove = "15 miles";
                    system.movement.fourthMove = "3.75 miles";
                    system.movement.runningMove = "7.5 miles";
                }
                break;
            case 20:
                    system.movement.fullMove = game.i18n.localize('abfalter.basicInfo.special');
                    system.movement.fourthMove = game.i18n.localize('abfalter.basicInfo.special');
                    system.movement.runningMove = game.i18n.localize('abfalter.basicInfo.special');
                break;
            default:
                    system.movement.fullMove = "0";
                    system.movement.fourthMove = "0";
                    system.movement.runningMove = "0";
                break;
        }
        if (system.movement.final > 20) {
            system.movement.fullMove = game.i18n.localize('abfalter.basicInfo.special');
            system.movement.fourthMove = game.i18n.localize('abfalter.basicInfo.special');
            system.movement.runningMove = game.i18n.localize('abfalter.basicInfo.special');
        }
        //Lifepoint Calculation
        system.lifepoints.class = classBonuses.lpbonus;
        system.lp.max += classBonuses.lpbonus;
        // Attack, Block, & Dodge post class
        system.combatValues.attack.class = classBonuses.atk + classBonuses.maKiAtk;
        if (system.combatValues.attack.class > 50) {
            system.combatValues.attack.class = 50;
        }
        system.combatValues.attack.final += system.combatValues.attack.class;

        system.combatValues.block.class = classBonuses.blk + classBonuses.maKiBlk;
        if (system.combatValues.block.class > 50) {
            system.combatValues.block.class = 50;
        }
        system.combatValues.block.final += system.combatValues.block.class;

        system.combatValues.dodge.class = classBonuses.dod + classBonuses.maKiDod;
        if (system.combatValues.dodge.class > 50) {
            system.combatValues.dodge.class = 50;
        }
        system.combatValues.dodge.final += system.combatValues.dodge.class;

        // Initiative
        if (system.kiAbility.kiIncreaseSpd.status == true) {
            system.initiative.kiAbilityBonus = 10;
        } else {
            system.initiative.kiAbilityBonus = 0;
        }
        system.initiative.class = classBonuses.ini;
        system.initiative.wepNumber = classBonuses.wepNum;
        system.initiative.wepSpeed = classBonuses.wepSpd;
        system.initiative.wepName = classBonuses.wepName;
        if (system.initiative.wepNumber > 1 && system.initiative.wepSpeed < 0) {
            system.initiative.wepFinalSpeed = system.initiative.wepSpeed - 20;
            system.initiative.wepName = game.i18n.localize('abfalter.basicInfo.multiWield');
        } else if (system.initiative.wepNumber > 1 && system.initiative.wepSpeed >= 0) {
            system.initiative.wepFinalSpeed = system.initiative.wepSpeed - 10;
            system.initiative.wepName = game.i18n.localize('abfalter.basicInfo.multiWield');
        } else if (system.initiative.wepNumber == 0) {
            system.initiative.wepFinalSpeed = 20;
            system.initiative.wepName = game.i18n.localize('abfalter.basicInfo.unarmed');
        } else {
            system.initiative.wepFinalSpeed = system.initiative.wepSpeed;
        }
        system.initiative.final = Math.floor(system.initiative.base + system.initiative.class + system.initiative.spec + system.initiative.bonus + system.initiative.kiAbilityBonus + ~~system.initiative.wepFinalSpeed - system.armor.wearArmor.totalNatPen);

        //@SECONDARIES
        //Athletics Fields
        system.secondaryFields.athletics.acrobatics.classBonus = classBonuses.acro;
        system.secondaryFields.athletics.athleticism.classBonus = classBonuses.athle;
        system.secondaryFields.athletics.climb.classBonus = classBonuses.climb;
        system.secondaryFields.athletics.jump.classBonus = classBonuses.jump;
        system.secondaryFields.athletics.piloting.classBonus = classBonuses.pilot;
        system.secondaryFields.athletics.ride.classBonus = classBonuses.ride;
        system.secondaryFields.athletics.swim.classBonus = classBonuses.swim;
        for (let [key, sec] of Object.entries(system.secondaryFields.athletics)) {
            sec.parentField = system.secondaryFields.category.athletics;
            switch (sec.modifier) {
                case "AGI":
                    sec.modValue = stats.Agility.mod;
                    break;
                case "STR":
                    sec.modValue = stats.Strength.mod;
                    break;
                case "DEX":
                    sec.modValue = stats.Dexterity.mod;
                    break;                
            }
            sec.natTotal = Math.floor(sec.modValue + sec.natural + Math.ceil(sec.nat * sec.modValue));
            sec.natTotal = sec.natTotal < 100 ? sec.natTotal : 100;
            sec.final = Math.floor(sec.base + sec.spec + sec.temp + sec.classBonus + sec.natTotal + sec.bonus + system.aamField.final - system.armor.wearArmor.totalNatPen);
        };

        //Social Fields
        system.secondaryFields.social.etiquette.classBonus = classBonuses.etiq;
        system.secondaryFields.social.intimidate.classBonus = classBonuses.intim;
        system.secondaryFields.social.leadership.classBonus = classBonuses.leader;
        system.secondaryFields.social.persuasion.classBonus = classBonuses.persua;
        system.secondaryFields.social.streetwise.classBonus = classBonuses.street;
        system.secondaryFields.social.style.classBonus = classBonuses.style;
        system.secondaryFields.social.trading.classBonus = classBonuses.trading;
        for (let [key, sec] of Object.entries(system.secondaryFields.social)) {
            sec.parentField = system.secondaryFields.category.social;
            switch (sec.modifier) {
                case "INT":
                    sec.modValue = stats.Intelligence.mod;
                    break;
                case "POW":
                    sec.modValue = stats.Power.mod;
                    break;
                case "WP":
                    sec.modValue = stats.Willpower.mod;
                    break;
            }
            sec.natTotal = Math.floor(sec.modValue + sec.natural + Math.ceil(sec.nat * sec.modValue));
            sec.natTotal = sec.natTotal < 100 ? sec.natTotal : 100;
            sec.final = Math.floor(sec.base + sec.spec + sec.temp + sec.classBonus + sec.natTotal + sec.bonus + system.aamField.final);
        };

        //Perceptive Fields
        system.secondaryFields.perceptive.notice.classBonus = classBonuses.notice;
        system.secondaryFields.perceptive.search.classBonus = classBonuses.search;
        system.secondaryFields.perceptive.track.classBonus = classBonuses.track;
        for (let [key, sec] of Object.entries(system.secondaryFields.perceptive)) {
            if (key === 'kidetection') continue;

            sec.parentField = system.secondaryFields.category.perceptive;
            switch (sec.modifier) {
                case "PER":
                    sec.modValue = stats.Perception.mod;
                    break;
            }
            sec.natTotal = Math.floor(sec.modValue + sec.natural + Math.ceil(sec.nat * sec.modValue));
            sec.natTotal = sec.natTotal < 100 ? sec.natTotal : 100;
            sec.final = Math.floor(sec.base + sec.spec + sec.temp + sec.classBonus + sec.natTotal + sec.bonus + system.aamField.final);
        };
        //Ki Detection
        system.secondaryFields.perceptive.kidetection.display = !system.kiAbility.kiDetection.status;
        system.secondaryFields.perceptive.kidetection.classBonus = classBonuses.kiDect;
        system.secondaryFields.perceptive.kidetection.baseNotice = Math.floor(system.secondaryFields.perceptive.notice.temp + system.secondaryFields.perceptive.notice.spec +
            system.secondaryFields.perceptive.notice.base + system.secondaryFields.perceptive.notice.classBonus + system.secondaryFields.perceptive.notice.natTotal);
        system.secondaryFields.perceptive.kidetection.parentField = system.secondaryFields.category.perceptive;
        system.secondaryFields.perceptive.kidetection.modValue = stats.Perception.mod;
        system.secondaryFields.perceptive.kidetection.natTotal = Math.floor(system.secondaryFields.perceptive.kidetection.modValue + system.secondaryFields.perceptive.kidetection.natural + Math.ceil(system.secondaryFields.perceptive.kidetection.nat * system.secondaryFields.perceptive.kidetection.modValue));
        system.secondaryFields.perceptive.kidetection.natTotal = system.secondaryFields.perceptive.kidetection.natTotal < 100 ? system.secondaryFields.perceptive.kidetection.natTotal : 100;
        system.secondaryFields.perceptive.kidetection.final = Math.floor(system.secondaryFields.perceptive.kidetection.base + system.secondaryFields.perceptive.kidetection.spec + system.secondaryFields.perceptive.kidetection.temp + 
            system.secondaryFields.perceptive.kidetection.classBonus + system.secondaryFields.perceptive.kidetection.natTotal + system.secondaryFields.perceptive.kidetection.bonus + system.aamField.final);

        //Intellectual Fields
        system.secondaryFields.intellectual.animals.classBonus = classBonuses.animals;
        system.secondaryFields.intellectual.appraisal.classBonus = classBonuses.appra;
        system.secondaryFields.intellectual.architecture.classBonus = classBonuses.archi;
        system.secondaryFields.intellectual.herballore.classBonus = classBonuses.herb;
        system.secondaryFields.intellectual.history.classBonus =classBonuses. hist;
        system.secondaryFields.intellectual.law.classBonus = classBonuses.law;
        system.secondaryFields.intellectual.magicappr.classBonus = classBonuses.magicapr;
        system.secondaryFields.intellectual.medicine.classBonus = classBonuses.medic;
        system.secondaryFields.intellectual.memorize.classBonus = classBonuses.mem;
        system.secondaryFields.intellectual.navigation.classBonus = classBonuses.navi;
        system.secondaryFields.intellectual.occult.classBonus = classBonuses.occ;
        system.secondaryFields.intellectual.science.classBonus = classBonuses.science;
        system.secondaryFields.intellectual.tactics.classBonus = classBonuses.tactic;
        system.secondaryFields.intellectual.technomagic.classBonus = classBonuses.techmagic;
        for (let [key, sec] of Object.entries(system.secondaryFields.intellectual)) {
            sec.parentField = system.secondaryFields.category.intellectual;
            switch (sec.modifier) {
                case "INT":
                    sec.modValue = stats.Intelligence.mod;
                    break;
                case "POW":
                    sec.modValue = stats.Power.mod;
                    break;
            }
            sec.natTotal = Math.floor(sec.modValue + sec.natural + Math.ceil(sec.nat * sec.modValue));
            sec.natTotal = sec.natTotal < 100 ? sec.natTotal : 100;
            sec.final = Math.floor(sec.base + sec.spec + sec.temp + sec.classBonus + sec.natTotal + sec.bonus + system.aamField.final);
        };

        //Vigor Fields
        system.secondaryFields.vigor.composure.classBonus = classBonuses.comp;
        system.secondaryFields.vigor.featsofstr.classBonus = classBonuses.fos;
        system.secondaryFields.vigor.withstpain.classBonus = classBonuses.wstp;
        for (let [key, sec] of Object.entries(system.secondaryFields.vigor)) {
            sec.parentField = system.secondaryFields.category.vigor;
            switch (sec.modifier) {
                case "WP":
                    sec.modValue = stats.Willpower.mod;
                    break;
                case "STR":
                    sec.modValue = stats.Strength.mod;
                    break;
            }
            sec.natTotal = Math.floor(sec.modValue + sec.natural + Math.ceil(sec.nat * sec.modValue));
            sec.natTotal = sec.natTotal < 100 ? sec.natTotal : 100;
            sec.final = Math.floor(sec.base + sec.spec + sec.temp + sec.classBonus + sec.natTotal + sec.bonus + system.aamField.final - (sec.armorPen ? system.armor.wearArmor.totalNatPen : 0));
        };

        //Subterfuge Fields
        system.secondaryFields.subterfuge.disguise.classBonus = classBonuses.disg;
        system.secondaryFields.subterfuge.hide.classBonus = classBonuses.hide;
        system.secondaryFields.subterfuge.lockpicking.classBonus = classBonuses.lock;
        system.secondaryFields.subterfuge.poisons.classBonus = classBonuses.poisn;
        system.secondaryFields.subterfuge.stealth.classBonus = classBonuses.stealth;
        system.secondaryFields.subterfuge.theft.classBonus = classBonuses.theft;
        system.secondaryFields.subterfuge.traplore.classBonus = classBonuses.trapl;
        for (let [key, sec] of Object.entries(system.secondaryFields.subterfuge)) {
            if (key === 'kiconceal') continue;

            sec.parentField = system.secondaryFields.category.subterfuge;
            switch (sec.modifier) {
                case "AGI":
                    sec.modValue = stats.Agility.mod;
                    break;
                case "DEX":
                    sec.modValue = stats.Dexterity.mod;
                    break;  
                case "PER":
                    sec.modValue = stats.Perception.mod;
                    break;
                case "INT":
                    sec.modValue = stats.Intelligence.mod;
                    break;
            }
            sec.natTotal = Math.floor(sec.modValue + sec.natural + Math.ceil(sec.nat * sec.modValue));
            sec.natTotal = sec.natTotal < 100 ? sec.natTotal : 100;
            sec.final = Math.floor(sec.base + sec.spec + sec.temp + sec.classBonus + sec.natTotal + sec.bonus + system.aamField.final - (sec.armorPen ? system.armor.wearArmor.totalNatPen : 0));
        };
        //Ki Concealment
        system.secondaryFields.subterfuge.kiconceal.display = !system.kiAbility.kiConceal.status;
        system.secondaryFields.subterfuge.kiconceal.classBonus = classBonuses.kiCon;
        system.secondaryFields.subterfuge.kiconceal.baseNotice = Math.floor(system.secondaryFields.subterfuge.hide.temp + system.secondaryFields.subterfuge.hide.spec +
            system.secondaryFields.subterfuge.hide.base + system.secondaryFields.subterfuge.hide.classBonus + system.secondaryFields.subterfuge.hide.natTotal);
        system.secondaryFields.subterfuge.kiconceal.parentField = system.secondaryFields.category.subterfuge;
        system.secondaryFields.subterfuge.kiconceal.modValue = stats.Perception.mod;
        system.secondaryFields.subterfuge.kiconceal.natTotal = Math.floor(system.secondaryFields.subterfuge.kiconceal.modValue + system.secondaryFields.subterfuge.kiconceal.natural + Math.ceil(system.secondaryFields.subterfuge.kiconceal.nat * system.secondaryFields.subterfuge.kiconceal.modValue));
        system.secondaryFields.subterfuge.kiconceal.natTotal = system.secondaryFields.subterfuge.kiconceal.natTotal < 100 ? system.secondaryFields.subterfuge.kiconceal.natTotal : 100;
        system.secondaryFields.subterfuge.kiconceal.final = Math.floor(system.secondaryFields.subterfuge.kiconceal.base + system.secondaryFields.subterfuge.kiconceal.spec + system.secondaryFields.subterfuge.kiconceal.temp + 
            system.secondaryFields.subterfuge.kiconceal.classBonus + system.secondaryFields.subterfuge.kiconceal.natTotal + system.secondaryFields.subterfuge.kiconceal.bonus + system.aamField.final);

        //Creative Fields
        system.secondaryFields.creative.alchemy.classBonus = classBonuses.alche;
        system.secondaryFields.creative.animism.classBonus = classBonuses.anims;
        system.secondaryFields.creative.art.classBonus = classBonuses.art;
        system.secondaryFields.creative.cooking.classBonus = classBonuses.cook;
        system.secondaryFields.creative.dance.classBonus = classBonuses.dance;
        system.secondaryFields.creative.forging.classBonus = classBonuses.forgi;
        system.secondaryFields.creative.jewelry.classBonus = classBonuses.jewel;
        system.secondaryFields.creative.toymaking.classBonus = classBonuses.toy;
        system.secondaryFields.creative.music.classBonus = classBonuses.music;
        system.secondaryFields.creative.runes.classBonus = classBonuses.runes;
        system.secondaryFields.creative.ritualcalig.classBonus = classBonuses.ritcal;
        system.secondaryFields.creative.slofhand.classBonus = classBonuses.soh;
        system.secondaryFields.creative.tailoring.classBonus = classBonuses.tailoring;
        for (let [key, sec] of Object.entries(system.secondaryFields.creative)) {
            sec.parentField = system.secondaryFields.category.creative;
            switch (sec.modifier) {
                case "AGI":
                    sec.modValue = stats.Agility.mod;
                    break;
                case "DEX":
                    sec.modValue = stats.Dexterity.mod;
                    break;  
                case "INT":
                    sec.modValue = stats.Intelligence.mod;
                    break;
                case "POW":
                    sec.modValue = stats.Power.mod;
                    break;
            }
            sec.natTotal = Math.floor(sec.modValue + sec.natural + Math.ceil(sec.nat * sec.modValue));
            sec.natTotal = sec.natTotal < 100 ? sec.natTotal : 100;
            sec.final = Math.floor(sec.base + sec.spec + sec.temp + sec.classBonus + sec.natTotal + sec.bonus + system.aamField.final - (sec.armorPen ? system.armor.wearArmor.totalNatPen : 0));
        };

        // Magic Accumulation & Zeon
        system.zeon.turnMaint = classBonuses.turnMaint;
        system.zeon.dailyMaint = classBonuses.dayMaint;
        system.zeon.class = classBonuses.zeon;
        switch (system.stats.Power.final) {
            case 1:
                system.maccu.fromPow = 0;
                system.zeon.fromPow = 5;
                break;
            case 2:
                system.maccu.fromPow = 0;
                system.zeon.fromPow = 20;
                break;
            case 3:
                system.maccu.fromPow = 0;
                system.zeon.fromPow = 40;
                break;
            case 4:
                system.maccu.fromPow = 0;
                system.zeon.fromPow = 55;
                break;
            case 5:
                system.maccu.fromPow = 5;
                system.zeon.fromPow = 70;
                break;
            case 6:
                system.maccu.fromPow = 5;
                system.zeon.fromPow = 85;
                break;
            case 7:
                system.maccu.fromPow = 5;
                system.zeon.fromPow = 95;
                break;
            case 8:
                system.maccu.fromPow = 10;
                system.zeon.fromPow = 110;
                break;
            case 9:
                system.maccu.fromPow = 10;
                system.zeon.fromPow = 120;
                break;
            case 10:
                system.maccu.fromPow = 10;
                system.zeon.fromPow = 135;
                break;
            case 11:
                system.maccu.fromPow = 10;
                system.zeon.fromPow = 150;
                break;
            case 12:
                system.maccu.fromPow = 15;
                system.zeon.fromPow = 160;
                break;
            case 13:
                system.maccu.fromPow = 15;
                system.zeon.fromPow = 175;
                break;
            case 14:
                system.maccu.fromPow = 15;
                system.zeon.fromPow = 185;
                break;
            case 15:
                system.maccu.fromPow = 20;
                system.zeon.fromPow = 200;
                break;
            case 16:
                system.maccu.fromPow = 25;
                system.zeon.fromPow = 215;
                break;
            case 17:
                system.maccu.fromPow = 25;
                system.zeon.fromPow = 225;
                break;
            case 18:
                system.maccu.fromPow = 30;
                system.zeon.fromPow = 240;
                break;
            case 19:
                system.maccu.fromPow = 30;
                system.zeon.fromPow = 250;
                break;
            case 20:
                system.maccu.fromPow = 35;
                system.zeon.fromPow = 260;
                break;
            default:
                system.zeon.fromPow = 0;
                break;
        }
        if (system.stats.Power.final > 20) {
            system.maccu.fromPow = 35;
            system.zeon.fromPow = 260;
        }
        system.maccu.finalFull = Math.floor(system.maccu.base + system.maccu.fromPow + (system.maccu.mult * system.maccu.fromPow) + system.maccu.spec + system.maccu.bonus + system.maccu.temp);
        system.maccu.finalHalf = Math.floor(system.maccu.finalFull / 2);
        system.mregen.final = Math.floor(((system.maccu.fromPow * system.mregen.regenmult) + system.mregen.spec + system.mregen.temp + system.mregen.bonus + system.maccu.finalFull) * system.mregen.recoverymult);
        system.zeon.max = Math.floor(system.zeon.base + system.zeon.fromPow + system.zeon.class + system.zeon.spec + system.zeon.temp + system.zeon.bonus);

        // Innate Magic
        if (system.maccu.finalFull >= 10 && system.maccu.finalFull <= 50) {
            system.zeon.minnateFinal = Math.floor(system.zeon.minnate + 10);
        } else if (system.maccu.finalFull > 50 && system.maccu.finalFull <= 70) {
            system.zeon.minnateFinal = Math.floor(system.zeon.minnate + 20);
        } else if (system.maccu.finalFull > 70 && system.maccu.finalFull <= 90) {
            system.zeon.minnateFinal = Math.floor(system.zeon.minnate + 30);
        } else if (system.maccu.finalFull > 90 && system.maccu.finalFull <= 110) {
            system.zeon.minnateFinal = Math.floor(system.zeon.minnate + 40);
        } else if (system.maccu.finalFull > 110 && system.maccu.finalFull <= 130) {
            system.zeon.minnateFinal = Math.floor(system.zeon.minnate + 50);
        } else if (system.maccu.finalFull > 130 && system.maccu.finalFull <= 150) {
            system.zeon.minnateFinal = Math.floor(system.zeon.minnate + 60);
        } else if (system.maccu.finalFull > 150 && system.maccu.finalFull <= 180) {
            system.zeon.minnateFinal = Math.floor(system.zeon.minnate + 70);
        } else if (system.maccu.finalFull > 180 && system.maccu.finalFull <= 200) {
            system.zeon.minnateFinal = Math.floor(system.zeon.minnate + 80);
        } else if (system.maccu.finalFull > 200) {
            system.zeon.minnateFinal = Math.floor(system.zeon.minnate + 90);
        } else {
            system.zeon.minnateFinal = system.zeon.minnate;
        }

        // Magic Levels
        switch (system.stats.Intelligence.final) {
            case 6:
                system.mlevel.fromInt = 10;
                break;
            case 7:
                system.mlevel.fromInt = 20;
                break;
            case 8:
                system.mlevel.fromInt = 30;
                break;
            case 9:
                system.mlevel.fromInt = 40;
                break;
            case 10:
                system.mlevel.fromInt = 50;
                break;
            case 11:
                system.mlevel.fromInt = 75;
                break;
            case 12:
                system.mlevel.fromInt = 100;
                break;
            case 13:
                system.mlevel.fromInt = 150;
                break;
            case 14:
                system.mlevel.fromInt = 200;
                break;
            case 15:
                system.mlevel.fromInt = 300;
                break;
            case 16:
                system.mlevel.fromInt = 400;
                break;
            case 17:
                system.mlevel.fromInt = 500;
                break;
            case 18:
                system.mlevel.fromInt = 600;
                break;
            case 19:
                system.mlevel.fromInt = 700;
                break;
            case 20:
                system.mlevel.fromInt = 800;
                break;
            default:
                system.mlevel.fromInt = 0;
                break;
        }
        if (system.stats.Intelligence.final > 20) {
            system.mlevel.fromInt = 800;
        }
        system.mlevel.pathCost = classBonuses.pathLvl;
        system.mlevel.singleSpellCost = classBonuses.spellCost;
        system.mlevel.final = Math.floor(system.mlevel.base + system.mlevel.spec + system.mlevel.temp + system.mlevel.bonus +system.mlevel.fromInt);
        system.mlevel.used = Math.floor(system.mlevel.pathCost + system.mlevel.singleSpellCost + system.metaMagic.totalCost);

        // Summoning Abilities
        system.summoning.summon.class = classBonuses.summon;
        system.summoning.control.class = classBonuses.control;
        system.summoning.bind.class = classBonuses.bind;
        system.summoning.banish.class = classBonuses.banish;
        system.summoning.summon.final = Math.floor(system.summoning.summon.base + system.summoning.summon.class + system.summoning.summon.spec + system.summoning.summon.bonus + system.stats.Power.mod + Math.min(0, system.aamField.final));
        system.summoning.control.final = Math.floor(system.summoning.control.base + system.summoning.control.class + system.summoning.control.spec + system.summoning.control.bonus + system.stats.Willpower.mod + Math.min(0, system.aamField.final));
        system.summoning.bind.final = Math.floor(system.summoning.bind.base + system.summoning.bind.class + system.summoning.bind.spec + system.summoning.bind.bonus + system.stats.Power.mod + Math.min(0, system.aamField.final));
        system.summoning.banish.final = Math.floor(system.summoning.banish.base + system.summoning.banish.class + system.summoning.banish.spec + system.summoning.banish.bonus + system.stats.Power.mod + Math.min(0, system.aamField.final));

        //Unarmed
        switch (system.fistDamage.multOption) {
            case "agi":
                system.fistDamage.dmgMult1 = Math.floor(system.fistDamage.mult * system.stats.Agility.mod);
                break;
            case "con":
                system.fistDamage.dmgMult1 = Math.floor(system.fistDamage.mult * system.stats.Constitution.mod);
                break;
            case "str":
                system.fistDamage.dmgMult1 = Math.floor(system.fistDamage.mult * system.stats.Strength.mod);
                break;
            case "dex":
                system.fistDamage.dmgMult1 = Math.floor(system.fistDamage.mult * system.stats.Dexterity.mod);
                break;
            case "per":
                system.fistDamage.dmgMult1 = Math.floor(system.fistDamage.mult * system.stats.Perception.mod);
                break;
            case "int":
                system.fistDamage.dmgMult1 = Math.floor(system.fistDamage.mult * system.stats.Intelligence.mod);
                break;
            case "pow":
                system.fistDamage.dmgMult1 = Math.floor(system.fistDamage.mult * system.stats.Power.mod);
                break;
            case "wp":
                system.fistDamage.dmgMult1 = Math.floor(system.fistDamage.mult * system.stats.Willpower.mod);
                break;
            case "str2":
                system.fistDamage.dmgMult1 = Math.floor(system.fistDamage.mult * (system.stats.Strength.mod * 2));
                break;
            case "presence":
                system.fistDamage.dmgMult1 = Math.floor(system.fistDamage.mult * ((system.levelinfo.presence * 2) +  system.stats.Power.mod));
                break;
            default:
                system.fistDamage.dmgMult1 = 0;
                break;
        }
        switch (system.fistDamage.multOption2) {
            case "agi":
                system.fistDamage.dmgMult2 = Math.floor(system.fistDamage.mult2 * system.stats.Agility.mod);
                break;
            case "con":
                system.fistDamage.dmgMult2 = Math.floor(system.fistDamage.mult2 * system.stats.Constitution.mod);
                break;
            case "str":
                system.fistDamage.dmgMult2 = Math.floor(system.fistDamage.mult2 * system.stats.Strength.mod);
                break;
            case "dex":
                system.fistDamage.dmgMult2 = Math.floor(system.fistDamage.mult2 * system.stats.Dexterity.mod);
                break;
            case "per":
                system.fistDamage.dmgMult2 = Math.floor(system.fistDamage.mult2 * system.stats.Perception.mod);
                break;
            case "int":
                system.fistDamage.dmgMult2 = Math.floor(system.fistDamage.mult2 * system.stats.Intelligence.mod);
                break;
            case "pow":
                system.fistDamage.dmgMult2 = Math.floor(system.fistDamage.mult2 * system.stats.Power.mod);
                break;
            case "wp":
                system.fistDamage.dmgMult2 = Math.floor(system.fistDamage.mult2 * system.stats.Willpower.mod);
                break;
            case "str2":
                system.fistDamage.dmgMult2 = Math.floor(system.fistDamage.mult2 * (system.stats.Strength.mod * 2));
                break;
            case "presence":
                system.fistDamage.dmgMult2 = Math.floor(system.fistDamage.mult2 * ((system.levelinfo.presence * 2) + system.stats.Power.mod));
                break;
            default:
                system.fistDamage.dmgMult2 = 0;
                break;
        }
        system.fistDamage.final = Math.floor(system.fistDamage.base + system.fistDamage.dmgMult1 + system.fistDamage.dmgMult2 + system.fistDamage.bonus);

        // Psychic Points
        system.ppoint.class = classBonuses.pp;
        system.ppoint.final = Math.floor(system.ppoint.base + system.ppoint.spec + system.ppoint.bonus + system.ppoint.class);
        system.ppoint.innateSlot = Math.floor(system.other.innateSlots * 2);
        system.psychicPoint.max = Math.floor(system.ppoint.final - (+classBonuses.usedpp + system.ppotential.fromPP + +classBonuses.matrixpp + system.ppoint.innateSlot));

        //Monster
        system.monsterStats.powersCost = classBonuses.monsterCost;
        system.monsterStats.totalDP = Math.floor(system.monsterStats.charCombinedCost + system.monsterStats.powersCost + system.monsterStats.hpDp);



        // Settings
        system.rollRange.final = Math.floor(system.rollRange.base - system.rollRange.spec - system.rollRange.temp - system.rollRange.bonus);
        system.fumleRange.final = Math.floor(system.fumleRange.base + system.fumleRange.spec + system.fumleRange.temp + system.fumleRange.bonus);

        console.log(this);

        // Reload Items to get Atk/Def
        this.items.reduce((arr, item) => {
            if (item.type === "weapon" || item.type === "secondary" ) {
                item.prepareData();
            }
        });
    }
}
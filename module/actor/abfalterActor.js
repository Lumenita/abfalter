import { abfalterSettingsKeys } from "../utilities/abfalterSettings.js";

export default class abfalterActor extends Actor {

    prepareData() {
        super.prepareData();
    }

    prepareBaseData() {
        const system = this.system;

        //Global Settings
        system.spiritSettings = game.settings.get('abfalter', abfalterSettingsKeys.Spirit_Damage);
        system.fumbleSettings = game.settings.get('abfalter', abfalterSettingsKeys.Corrected_Fumble);
        system.useMeters = game.settings.get('abfalter', abfalterSettingsKeys.Use_Meters);

        //All Action Mod
        system.aamFinal = system.aam + system.aamBoon + system.aamCrit;

        //Main Characteristics & Dragon Seals
        system.aamFinal += system.arsMagnus.dragonSeal * 5 || 0;

        //Monster Powers Prep
        for (let [key, atr] of Object.entries(system.monsterChar)) {
            switch (key) {
                case "agi":
                    atr.name = game.i18n.localize('abfalter.basicInfo.agi');
                    break;
                case "con":
                    atr.name = game.i18n.localize('abfalter.basicInfo.con');
                    break;
                case "str":
                    atr.name = game.i18n.localize('abfalter.basicInfo.str');
                    break;
                case "dex":
                    atr.name = game.i18n.localize('abfalter.basicInfo.dex');
                    break;
                case "per":
                    atr.name = game.i18n.localize('abfalter.basicInfo.per');
                    break;
                case "int":
                    atr.name = game.i18n.localize('abfalter.basicInfo.int');
                    break;
                case "pow":
                    atr.name = game.i18n.localize('abfalter.basicInfo.pow');
                    break;
                case "wp":
                    atr.name = game.i18n.localize('abfalter.basicInfo.wp');
                    break;
                default:
                    break;
            }
            switch (atr.base) {
                case "1":
                    atr.costBase = 1;
                    break;
                case "2":
                    atr.costBase = 2;
                    break;
                case "3":
                    atr.costBase = 3;
                    break;
                case "4":
                    atr.costBase = 4;
                    break;
                case "5":
                    atr.costBase = 5;
                    break;
                case "6":
                    atr.costBase = 6;
                    break;
                case "7":
                    atr.costBase = 7;
                    break;
                case "8":
                    atr.costBase = 8;
                    break;
                case "9":
                    atr.costBase = 10;
                    break;
                case "10":
                    atr.costBase = 15;
                    break;
                case "11":
                    atr.costBase = 20;
                    break;
                case "12":
                    atr.costBase = 30;
                    break;
                case "13":
                    atr.costBase = 40;
                    break;
                case "14":
                    atr.costBase = 50;
                    break;
                case "15":
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
        system.monsterCharCombCost = Math.floor(system.monsterChar.agi.charBaseCostTotal + system.monsterChar.con.charBaseCostTotal + system.monsterChar.str.charBaseCostTotal +
            system.monsterChar.dex.charBaseCostTotal + system.monsterChar.per.charBaseCostTotal + system.monsterChar.int.charBaseCostTotal + system.monsterChar.pow.charBaseCostTotal +
            system.monsterChar.wp.charBaseCostTotal);
        //Size Base Values
        if (system.size >= 9 && system.size <= 22) {
            system.initiative.sizeBase = 20;
            system.movement.sizeBase = 0;
            system.lifepoints.hpMult = 5;
            system.monsterArmor = 3;
            system.monsterPhysicalDmg = 10;
            system.monsterNaturalDmg = 40;
            system.monsterActionArea = "0";
            system.monsterNatBreak = 0;
            system.monsternatFort = 12;
        } else if (system.size >= 1 && system.size <= 3) {
            system.initiative.sizeBase = 40;
            system.movement.sizeBase = -4;
            system.lifepoints.hpMult = 1;
            system.monsterArmor = 1;
            system.monsterPhysicalDmg = 5;
            system.monsterNaturalDmg = 20;
            system.monsterActionArea = "0";
            system.monsterNatBreak = -4;
            system.monsternatFort = 4;
        } else if (system.size >= 4 && system.size <= 8) {
            system.initiative.sizeBase = 30;
            system.movement.sizeBase = -2;
            system.lifepoints.hpMult = 2;
            system.monsterArmor = 2;
            system.monsterPhysicalDmg = 10;
            system.monsterNaturalDmg = 30;
            system.monsterActionArea = "0";
            system.monsterNatBreak = -2;
            system.monsternatFort = 8;
        } else if (system.size >= 23 && system.size <= 24) {
            system.initiative.sizeBase = 10;
            system.movement.sizeBase = 0;
            system.lifepoints.hpMult = 5;
            system.monsterArmor = 4;
            system.monsterPhysicalDmg = 20;
            system.monsterNaturalDmg = 60;
            system.monsterActionArea = "0";
            system.monsterNatBreak = 4;
            system.monsternatFort = 16;
        } else if (system.size >= 25 && system.size <= 28) {
            system.initiative.sizeBase = 0;
            system.movement.sizeBase = 1;
            system.lifepoints.hpMult = 10;
            system.monsterArmor = 6;
            system.monsterPhysicalDmg = 30;
            system.monsterNaturalDmg = 100;
            system.monsterActionArea = "5ft / 1.5m";
            system.monsterNatBreak = 8;
            system.monsternatFort = 20;
        } else if (system.size >= 29 && system.size <= 33) {
            system.initiative.sizeBase = -10;
            system.movement.sizeBase = 2;
            system.lifepoints.hpMult = 15;
            system.monsterArmor = 8;
            system.monsterPhysicalDmg = 40;
            system.monsterNaturalDmg = 120;
            system.monsterActionArea = "15ft / 4.5m";
            system.monsterNatBreak = 12;
            system.monsternatFort = 28;
        } else if (system.size >= 34) {
            system.initiative.sizeBase = -20;
            system.movement.sizeBase = 3;
            system.lifepoints.hpMult = 20;
            system.monsterArmor = 10;
            system.monsterPhysicalDmg = 60;
            system.monsterNaturalDmg = 140;
            system.monsterActionArea = "60ft / 18m";
            system.monsterNatBreak = 16;
            system.monsternatFort = 34;
        } else {
            system.initiative.sizeBase = 0;
            system.movement.sizeBase = 0;
            system.lifepoints.hpMult = 0;
            system.monsterArmor = 0;
            system.monsterPhysicalDmg = 0;
            system.monsterNaturalDmg = 0;
            system.monsterActionArea = "N/A";
            system.monsterNatBreak = 0;
            system.monsternatFort = 0;
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
        system.doubleDamageDesc = game.i18n.localize('abfalter.metaMagic.doubleDmgDesc');
        system.highMagicDesc = game.i18n.localize('abfalter.metaMagic.highMagicDesc');
        system.natMaintDesc = game.i18n.localize('abfalter.metaMagic.natMaintDesc');
        system.unlimitedZeonDesc = game.i18n.localize('abfalter.metaMagic.unlimitedZeonDesc');

        //MetaMagic Desc Arcane Warfare
        //empowered shields
        if (!system.metaMagic.empShield.bought && !system.metaMagic.empShield2.bought) {
            system.empShields = false;
            system.empShieldsDesc = "";
        } else if (system.metaMagic.empShield.bought && system.metaMagic.empShield2.bought) {
            system.empShields = true;
            system.empShieldsDesc = game.i18n.localize('abfalter.metaMagic.empShieldDesc2');
        } else {
            system.empShields = true;
            system.empShieldsDesc = game.i18n.localize('abfalter.metaMagic.empShieldDesc1');
        }
        //mystic accuracy
        if (!system.metaMagic.mysticAcc.bought && !system.metaMagic.mysticAcc2.bought) {
            system.mysticAccu = false;
            system.mysticAccuDesc = "";
        } else if (system.metaMagic.mysticAcc.bought && system.metaMagic.mysticAcc2.bought) {
            system.mysticAccu = true;
            system.mysticAccuDesc = game.i18n.localize('abfalter.metaMagic.mysticAccuDesc2');
        } else {
            system.mysticAccu = true;
            system.mysticAccuDesc = game.i18n.localize('abfalter.metaMagic.mysticAccuDesc1');
        }
        //increased destruction
        if (!system.metaMagic.incDestro.bought && !system.metaMagic.incDestro2.bought) {
            system.incDestruction = false;
            system.incDestructionDesc = "";
        } else if (system.metaMagic.incDestro.bought && system.metaMagic.incDestro2.bought) {
            system.incDestruction = true;
            system.incDestructionDesc = game.i18n.localize('abfalter.metaMagic.incDestroDesc2');
        } else {
            system.incDestruction = true;
            system.incDestructionDesc = game.i18n.localize('abfalter.metaMagic.incDestroDesc1');
        }
        //expanded area
        if (!system.metaMagic.expArea.bought && !system.metaMagic.expArea2.bought) {
            system.expandArea = false;
            system.expandAreaDesc = "";
        } else if (system.metaMagic.expArea.bought && system.metaMagic.expArea2.bought) {
            system.expandArea = true;
            system.expandAreaDesc = game.i18n.localize('abfalter.metaMagic.expAreaDesc2');
        } else {
            system.expandArea = true;
            system.expandAreaDesc = game.i18n.localize('abfalter.metaMagic.expAreaDesc1');
        }
        //remove protection
        if (!system.metaMagic.remProtection.bought && !system.metaMagic.remProtection2.bought && !system.metaMagic.remProtection3.bought) {
            system.removeProtection = false;
            system.removeProtectionDesc = "";
        } else if (system.metaMagic.remProtection.bought && system.metaMagic.remProtection2.bought && system.metaMagic.remProtection3.bought) {
            system.removeProtection = true;
            system.removeProtectionDesc = game.i18n.localize('abfalter.metaMagic.remProtectDesc3');
        } else if ((system.metaMagic.remProtection.bought && system.metaMagic.remProtection2.bought) ||
            (system.metaMagic.remProtection2.bought && system.metaMagic.remProtection3.bought) ||
            (system.metaMagic.remProtection.bought && system.metaMagic.remProtection3.bought)) {
            system.removeProtection = true;
            system.removeProtectionDesc = game.i18n.localize('abfalter.metaMagic.remProtectDesc2');
        } else {
            system.removeProtection = true;
            system.removeProtectionDesc = game.i18n.localize('abfalter.metaMagic.remProtectDesc1');
        }
        //defensive expertise
        if (!system.metaMagic.defExper.bought && !system.metaMagic.defExper2.bought && !system.metaMagic.defExper3.bought) {
            system.defenseExpertise = false;
            system.defenseExpertiseDesc = "";
        } else if (system.metaMagic.defExper.bought && system.metaMagic.defExper2.bought && system.metaMagic.defExper3.bought) {
            system.defenseExpertise = true;
            system.defenseExpertiseDesc = game.i18n.localize('abfalter.metaMagic.defExperDesc3');
        } else if ((system.metaMagic.defExper.bought && system.metaMagic.defExper2.bought) ||
            (system.metaMagic.defExper2.bought && system.metaMagic.defExper3.bought) ||
            (system.metaMagic.defExper.bought && system.metaMagic.defExper3.bought)) {
            system.defenseExpertise = true;
            system.defenseExpertiseDesc = game.i18n.localize('abfalter.metaMagic.defExperDesc2');
        } else {
            system.defenseExpertise = true;
            system.defenseExpertiseDesc = game.i18n.localize('abfalter.metaMagic.defExperDesc1');
        }
        //offensive expertise
        if (!system.metaMagic.offExper.bought && !system.metaMagic.offExper2.bought && !system.metaMagic.offExper3.bought) {
            system.offExpertise = false;
            system.offExpertiseDesc = "";
        } else if (system.metaMagic.offExper.bought && system.metaMagic.offExper2.bought && system.metaMagic.offExper3.bought) {
            system.offExpertise = true;
            system.offExpertiseDesc = game.i18n.localize('abfalter.metaMagic.offExperDesc3');
        } else if ((system.metaMagic.offExper.bought && system.metaMagic.offExper2.bought) ||
            (system.metaMagic.offExper2.bought && system.metaMagic.offExper3.bought) ||
            (system.metaMagic.offExper.bought && system.metaMagic.offExper3.bought)) {
            system.offExpertise = true;
            system.offExpertiseDesc = game.i18n.localize('abfalter.metaMagic.offExperDesc2');
        } else {
            system.offExpertise = true;
            system.offExpertiseDesc = game.i18n.localize('abfalter.metaMagic.offExperDesc1');
        }

        //MetaMagic Desc Arcane Esoterica
        //secure defense
        system.secureDefenseDesc = game.i18n.localize('abfalter.metaMagic.secDefenseDesc');
        //life magic
        if (!system.metaMagic.lifeMagic.bought && !system.metaMagic.lifeMagic2.bought) {
            system.lifeMagic = false;
            system.lifeMagicDesc = "";
        } else if (system.metaMagic.lifeMagic.bought && system.metaMagic.lifeMagic2.bought) {
            system.lifeMagic = true;
            system.lifeMagicDesc = game.i18n.localize('abfalter.metaMagic.lifeMagicDesc2');
        } else {
            system.lifeMagic = true;
            system.lifeMagicDesc = game.i18n.localize('abfalter.metaMagic.lifeMagicDesc1');
        }
        //feel magic
        system.feelMagicDesc = game.i18n.localize('abfalter.metaMagic.feelMagicDesc');
        //hidden magic
        system.hiddenMagicDesc = game.i18n.localize('abfalter.metaMagic.hiddenMagicDesc');
        //spiritual loop
        if (!system.metaMagic.spiritLoop.bought && !system.metaMagic.spiritLoop2.bought) {
            system.spiritLoop = false;
            system.spiritLoopDesc = "";
        } else if (system.metaMagic.spiritLoop.bought && system.metaMagic.spiritLoop2.bought) {
            system.spiritLoop = true;
            system.spiritLoopDesc = game.i18n.localize('abfalter.metaMagic.spiritLoopDesc2');
        } else {
            system.spiritLoop = true;
            system.spiritLoopDesc = game.i18n.localize('abfalter.metaMagic.spiritLoopDesc1');
        }
        //control space
        system.controlSpaceDesc = game.i18n.localize('abfalter.metaMagic.controlSpaceDesc');
        //energy control
        system.eneControlDesc = game.i18n.localize('abfalter.metaMagic.eneControlDesc');
        //endure supernatural damage
        system.endureDamageDesc = game.i18n.localize('abfalter.metaMagic.endureDamageDesc');
        //transfer magic
        system.transferMagicDesc = game.i18n.localize('abfalter.metaMagic.transferMagicDesc');
        //force speed
        if (!system.metaMagic.forceSpeed.bought && !system.metaMagic.forceSpeed2.bought && !system.metaMagic.forceSpeed3.bought) {
            system.forceSpeed = false;
            system.forceSpeedDesc = "";
        } else if (system.metaMagic.forceSpeed.bought && system.metaMagic.forceSpeed2.bought && system.metaMagic.forceSpeed3.bought) {
            system.forceSpeed = true;
            system.forceSpeedDesc = game.i18n.localize('abfalter.metaMagic.forceSpeed3');
        } else if ((system.metaMagic.forceSpeed.bought && system.metaMagic.forceSpeed2.bought) ||
            (system.metaMagic.forceSpeed2.bought && system.metaMagic.forceSpeed3.bought) ||
            (system.metaMagic.forceSpeed.bought && system.metaMagic.forceSpeed3.bought)) {
            system.forceSpeed = true;
            system.forceSpeedDesc = game.i18n.localize('abfalter.metaMagic.forceSpeed2');
        } else {
            system.forceSpeed = true;
            system.forceSpeedDesc = game.i18n.localize('abfalter.metaMagic.forceSpeed1');
        }
        //double innate spells
        system.doubleInnateDesc = game.i18n.localize('abfalter.metaMagic.doubleInnateDesc');

        //MetaMagic Desc Arcane Power
        //advanced zeon regen
        if (!system.metaMagic.advZeonRegen.bought && !system.metaMagic.advZeonRegen2.bought && !system.metaMagic.advZeonRegen3.bought) {
            system.advnacedRegen = false;
            system.advnacedRegenDesc = "";
        } else if (system.metaMagic.advZeonRegen.bought && system.metaMagic.advZeonRegen2.bought && system.metaMagic.advZeonRegen3.bought) {
            system.advnacedRegen = true;
            system.advnacedRegenDesc = game.i18n.localize('abfalter.metaMagic.advZeonRegenDesc3');
        } else if ((system.metaMagic.advZeonRegen.bought && system.metaMagic.advZeonRegen2.bought) ||
            (system.metaMagic.advZeonRegen2.bought && system.metaMagic.advZeonRegen3.bought) ||
            (system.metaMagic.advZeonRegen.bought && system.metaMagic.advZeonRegen3.bought)) {
            system.advnacedRegen = true;
            system.advnacedRegenDesc = game.i18n.localize('abfalter.metaMagic.advZeonRegenDesc2');
        } else {
            system.advnacedRegen = true;
            system.advnacedRegenDesc = game.i18n.localize('abfalter.metaMagic.advZeonRegenDesc1');
        }
        //avatar
        system.avatarDesc = game.i18n.localize('abfalter.metaMagic.avatarDesc');
        //combined magic
        system.combinedMagicDesc = game.i18n.localize('abfalter.metaMagic.combinedMagicDesc');
        //define magic projection
        system.definedProjNumber = system.metaMagic.defMagicProj.bought + system.metaMagic.defMagicProj2.bought + system.metaMagic.defMagicProj3.bought
            + system.metaMagic.defMagicProj4.bought + system.metaMagic.defMagicProj5.bought
            + system.metaMagic.defMagicProj6.bought + system.metaMagic.defMagicProj7.bought;
        switch (system.definedProjNumber) {
            case 1:
                system.defMagProjDesc = game.i18n.localize('abfalter.metaMagic.defMagProjDesc1');
                system.definedMagicProj = true;
                break;
            case 2:
                system.defMagProjDesc = game.i18n.localize('abfalter.metaMagic.defMagProjDesc2');
                system.definedMagicProj = true;
                break;
            case 3:
                system.defMagProjDesc = game.i18n.localize('abfalter.metaMagic.defMagProjDesc3');
                system.definedMagicProj = true;
                break;
            case 4:
                system.defMagProjDesc = game.i18n.localize('abfalter.metaMagic.defMagProjDesc4');
                system.definedMagicProj = true;
                break;
            case 5:
                system.defMagProjDesc = game.i18n.localize('abfalter.metaMagic.defMagProjDesc5');
                system.definedMagicProj = true;
                break;
            case 6:
                system.defMagProjDesc = game.i18n.localize('abfalter.metaMagic.defMagProjDesc6');
                system.definedMagicProj = true;
                break;
            case 7:
                system.defMagProjDesc = game.i18n.localize('abfalter.metaMagic.defMagProjDesc7');
                system.definedMagicProj = true;
                break;
            default:
                system.defMagProjDesc = "";
                system.definedMagicProj = false;
                break;
        }
        //elevation
        system.elevationDesc = game.i18n.localize('abfalter.metaMagic.elevationDesc');
        //exploit energy
        if (!system.metaMagic.exploitEne.bought && !system.metaMagic.exploitEne2.bought) {
            system.exploitEnergy = false;
            system.exploitEnergyDesc = "";
        } else if (system.metaMagic.exploitEne.bought && system.metaMagic.exploitEne2.bought) {
            system.exploitEnergy = true;
            system.exploitEnergyDesc = game.i18n.localize('abfalter.metaMagic.exploitEneDesc2');
        } else {
            system.exploitEnergy = true;
            system.exploitEnergyDesc = game.i18n.localize('abfalter.metaMagic.exploitEneDesc1');
        }
        //persistent effects
        system.persisEffectDesc = game.i18n.localize('abfalter.metaMagic.persisEffectDesc');

        //MetaMagic Desc Arcane Knowledge
        //mystic concentration
        system.mysticConceDesc = game.i18n.localize('abfalter.metaMagic.mysticConceDesc');
        //mystic concentration
        if (!system.metaMagic.spellSpec80.bought && !system.metaMagic.spellSpec70.bought && !system.metaMagic.spellSpec60.bought
            && !system.metaMagic.spellSpec60x.bought && !system.metaMagic.spellSpec50.bought && !system.metaMagic.spellSpec30.bought
            && !system.metaMagic.spellSpec30x.bought) {
            system.spellSpecialization = false;
            system.spellSpecializationDesc = "";
        } else if (system.metaMagic.spellSpec80.bought) {
            system.spellSpecialization = true;
            system.spellSpecializationDesc = game.i18n.localize('abfalter.metaMagic.spellSpec80Desc');
        } else if (system.metaMagic.spellSpec70.bought) {
            system.spellSpecialization = true;
            system.spellSpecializationDesc = game.i18n.localize('abfalter.metaMagic.spellSpec70Desc');
        } else if (system.metaMagic.spellSpec60.bought || system.metaMagic.spellSpec60x.bought) {
            system.spellSpecialization = true;
            system.spellSpecializationDesc = game.i18n.localize('abfalter.metaMagic.spellSpec60Desc');
        } else if (system.metaMagic.spellSpec50.bought) {
            system.spellSpecialization = true;
            system.spellSpecializationDesc = game.i18n.localize('abfalter.metaMagic.spellSpec50Desc');
        } else {
            system.spellSpecialization = true;
            system.spellSpecializationDesc = game.i18n.localize('abfalter.metaMagic.spellSpec30Desc');
        }
        //pierce resistances
        if (!system.metaMagic.pierceRes.bought && !system.metaMagic.pierceRes2.bought) {
            system.pierceRes = false;
            system.pierceResDesc = "";
        } else if (system.metaMagic.pierceRes.bought && system.metaMagic.pierceRes2.bought) {
            system.pierceRes = true;
            system.pierceResDesc = game.i18n.localize('abfalter.metaMagic.pierceResDesc2');
        } else {
            system.pierceRes = true;
            system.pierceResDesc = game.i18n.localize('abfalter.metaMagic.pierceResDesc1');
        }
        //increase range
        if (!system.metaMagic.incRange.bought && !system.metaMagic.incRange2.bought) {
            system.increRange = false;
            system.increRangeDesc = "";
        } else if (system.metaMagic.incRange.bought && system.metaMagic.incRange2.bought) {
            system.increRange = true;
            system.increRangeDesc = game.i18n.localize('abfalter.metaMagic.increRangeDesc2');
        } else {
            system.increRange = true;
            system.increRangeDesc = game.i18n.localize('abfalter.metaMagic.increRangeDesc1');
        }
        //bind spells
        system.bindSpellDesc = game.i18n.localize('abfalter.metaMagic.bindSpellDesc');
        //maximize spells
        system.maxSpellsDesc = game.i18n.localize('abfalter.metaMagic.maxSpellsDesc');
        //double spells
        system.doubleSpellDesc = game.i18n.localize('abfalter.metaMagic.doubleSpellDesc');
        //superior innate spell
        system.supInnateDesc = game.i18n.localize('abfalter.metaMagic.supInnateDesc');

        //ML Calculation
        system.metaCost = system.metaMagic.cost + system.metaMagic.extraCost;

    }

    prepareEmbeddedDocuments() {
        super.prepareEmbeddedDocuments();
    }

    prepareDerivedData() {
        const system = this.system;
        const stats = system.stats;

        system.aamFinal += system.aamBonus;

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

            stat.opposedfinal = Math.floor((stat.final + stat.opposed) + ~~(system.aamFinal / 20) + stat.opposedBonus);
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
                system.actionnumber = 1;
                break;
            case 11:
            case 12:
            case 13:
            case 14:
                system.actionnumber = 2;
                break;
            case 15:
            case 16:
            case 17:
            case 18:
            case 19:
                system.actionnumber = 3;
                break;
            case 20:
            case 21:
            case 22:
                system.actionnumber = 4;
                break;
            case 23:
            case 24:
            case 25:
                system.actionnumber = 5;
                break;
            case 26:
            case 27:
            case 28:
                system.actionnumber = 6;
                break;
            case 29:
            case 30:
            case 31:
                system.actionnumber = 8;
                break;
            default:
                system.actionnumber = 10;
                break;
        }

        //Lifepoint Calculation
        system.lpbase = Math.floor(25 + 10 * system.stats.Constitution.final + system.stats.Constitution.mod - Math.ceil((system.stats.Constitution.final - 1) / system.stats.Constitution.final) * 5);
        if (system.toggles.dmgRes == false) {
            system.lp.max = Math.floor(system.lpbase + system.lifepoints.spec + system.lifepoints.temp + system.lifepoints.bonus + Math.ceil(system.lifepoints.multiple * system.stats.Constitution.final));
        } else {
            if (system.monsterStats.hpDp == null) {
                system.monsterStats.hpDp = 0;
            }
            system.lifepoints.hpDmgRes = Math.floor(system.lifepoints.hpMult * system.monsterStats.hpDp);
            system.lp.max = Math.floor(system.lpbase + system.lifepoints.spec + system.lifepoints.temp + system.lifepoints.hpDmgRes + system.lifepoints.bonus);
        }

        //Fatigue Calculation
        system.fatiguebase = system.stats.Constitution.final;
        system.fatigue.max = Math.floor(system.fatiguebase + system.fatigue.spec + system.fatigue.temp + system.fatigue.bonus);
        
        //Regeneration Calculation
        switch (system.stats.Constitution.final) {
            case 1:
            case 2:
                system.regenbase = 0;
                break;
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                system.regenbase = 1;
                break;
            case 8:
            case 9:
                system.regenbase = 2;
                break;
            case 10:
                system.regenbase = 3;
                break;
            case 11:
                system.regenbase = 4;
                break;
            case 12:
                system.regenbase = 5;
                break;
            case 13:
                system.regenbase = 6;
                break;
            case 14:
                system.regenbase = 7;
                break;
            case 15:
                system.regenbase = 8;
                break;
            case 16:
                system.regenbase = 9;
                break;
            case 17:
                system.regenbase = 10;
                break;
            case 18:
                system.regenbase = 11;
                break;
            case 19:
            case 20:
                system.regenbase = 12;
                break;
            default:
                system.regenbase = 0;
                break;
        }
        if (system.stats.Constitution.final > 20) {
            system.regenbase = 12;
        }
        system.regenfinal = Math.min(Math.floor(system.regenbase + system.regeneration.spec + system.regeneration.temp + system.regeneration.bonus), 20);
        switch (system.regenfinal) {
            case 1:
                system.resting = "10/" + game.i18n.localize('abfalter.basicInfo.day');
                system.notresting = "5/" + game.i18n.localize('abfalter.basicInfo.day');
                system.redpenalty = "-5/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regenValue = 10;
                break;
            case 2:
                system.resting = "20/" + game.i18n.localize('abfalter.basicInfo.day');
                system.notresting = "10/" + game.i18n.localize('abfalter.basicInfo.day');
                system.redpenalty = "-5/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regenValue = 20;
                break;
            case 3:
                system.resting = "30/" + game.i18n.localize('abfalter.basicInfo.day');
                system.notresting = "15/" + game.i18n.localize('abfalter.basicInfo.day');
                system.redpenalty = "-5/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regenValue = 30;
                break;
            case 4:
                system.resting = "40/" + game.i18n.localize('abfalter.basicInfo.day');
                system.notresting = "20/" + game.i18n.localize('abfalter.basicInfo.day');
                system.redpenalty = "-10/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regenValue = 40;
                break;
            case 5:
                system.resting = "50/" + game.i18n.localize('abfalter.basicInfo.day');
                system.notresting = "25/" + game.i18n.localize('abfalter.basicInfo.day');
                system.redpenalty = "-10/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regenValue = 50;
                break;
            case 6:
                system.resting = "75/" + game.i18n.localize('abfalter.basicInfo.day');
                system.notresting = "30/" + game.i18n.localize('abfalter.basicInfo.day');
                system.redpenalty = "-15/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regenValue = 75;
                break;
            case 7:
                system.resting = "100/" + game.i18n.localize('abfalter.basicInfo.day');
                system.notresting = "50/" + game.i18n.localize('abfalter.basicInfo.day');
                system.redpenalty = "-20/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regenValue = 100;
                break;
            case 8:
                system.resting = "250/" + game.i18n.localize('abfalter.basicInfo.day');
                system.notresting = "100/" + game.i18n.localize('abfalter.basicInfo.day');
                system.redpenalty = "-25/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regenValue = 250;
                break;
            case 9:
                system.resting = "500/" + game.i18n.localize('abfalter.basicInfo.day');
                system.notresting = "200/" + game.i18n.localize('abfalter.basicInfo.day');
                system.redpenalty = "-30/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regenValue = 500;
                break;
            case 10:
                system.resting = "1/" + game.i18n.localize('abfalter.basicInfo.minute');
                system.notresting = "N/A";
                system.redpenalty = "-40/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regenValue = 1440;
                break;
            case 11:
                system.resting = "2/" + game.i18n.localize('abfalter.basicInfo.minute');
                system.notresting = "N/A";
                system.redpenalty = "-50/" + game.i18n.localize('abfalter.basicInfo.day');
                system.regenValue = 2880;
                break;
            case 12:
                system.resting = "5/" + game.i18n.localize('abfalter.basicInfo.minute');
                system.notresting = "N/A";
                system.redpenalty = "-5/" + game.i18n.localize('abfalter.basicInfo.hour');
                system.regenValue = 7200;
                break;
            case 13:
                system.resting = "10/" + game.i18n.localize('abfalter.basicInfo.minute');
                system.notresting = "N/A";
                system.redpenalty = "-10/" + game.i18n.localize('abfalter.basicInfo.hour');
                system.regenValue = 10000;
                break;
            case 14:
                system.resting = "1/" + game.i18n.localize('abfalter.magicTab.turn');
                system.notresting = "N/A";
                system.redpenalty = "-15/" + game.i18n.localize('abfalter.basicInfo.hour');
                system.regenValue = 20000;
                break;
            case 15:
                system.resting = "5/" + game.i18n.localize('abfalter.magicTab.turn');
                system.notresting = "N/A";
                system.redpenalty = "-20/" + game.i18n.localize('abfalter.basicInfo.hour');
                system.regenValue = 50000;
                break;
            case 16:
                system.resting = "10/" + game.i18n.localize('abfalter.magicTab.turn');
                system.notresting = "N/A";
                system.redpenalty = "-50/" + game.i18n.localize('abfalter.basicInfo.minute');
                system.regenValue = 100000;
                break;
            case 17:
                system.resting = "25/" + game.i18n.localize('abfalter.magicTab.turn');
                system.notresting = "N/A";
                system.redpenalty = "-10/" + game.i18n.localize('abfalter.magicTab.turn');
                system.regenValue = 100000;
                break;
            case 18:
                system.resting = "50/" + game.i18n.localize('abfalter.magicTab.turn');
                system.notresting = "N/A";
                system.redpenalty = "-25/" + game.i18n.localize('abfalter.magicTab.turn');
                system.regenValue = 100000;
                break;
            case 19:
                system.resting = "100/" + game.i18n.localize('abfalter.magicTab.turn');
                system.notresting = "N/A";
                system.redpenalty = "All/" + game.i18n.localize('abfalter.magicTab.turn');
                system.regenValue = 100000;
                break;
            case 20:
                system.resting = "200/" + game.i18n.localize('abfalter.magicTab.turn');
                system.notresting = "N/A";
                system.redpenalty = "All/" + game.i18n.localize('abfalter.magicTab.turn');
                system.regenValue = 100000;
                break;
            default:
                system.resting = "0";
                system.notresting = "0";
                system.redpenalty = "0";
                system.regenValue = 0;
                break;
        }

        //Initiative
        system.initiative.extraStats = Math.floor(system.stats.Dexterity.mod + system.stats.Agility.mod);
        system.iniBase = Math.floor(system.stats.Dexterity.mod + system.stats.Agility.mod + system.initiative.sizeBase);
        if (system.aamFinal < 0) {
            system.iniBase = Math.floor(system.iniBase + ~~(system.aamFinal / 2));
        }

        //Ki Accumulation
        system.kiPoolAgiAccumTot = Math.max(0, Math.floor(system.stats.Agility.kiPoolAccuBase + system.kiPool.agi.spec + system.kiPool.agi.temp + system.kiPool.agi.bonus + system.kiPool.agi.default + Math.min(0, ~~(system.aamFinal / 20))));
        system.kiPoolConAccumTot = Math.max(0, Math.floor(system.stats.Constitution.kiPoolAccuBase + system.kiPool.con.spec + system.kiPool.con.temp + system.kiPool.con.bonus + system.kiPool.con.default + Math.min(0, ~~(system.aamFinal / 20))));
        system.kiPoolDexAccumTot = Math.max(0, Math.floor(system.stats.Dexterity.kiPoolAccuBase + system.kiPool.dex.spec + system.kiPool.dex.temp + system.kiPool.dex.bonus + system.kiPool.dex.default + Math.min(0, ~~(system.aamFinal / 20))));
        system.kiPoolStrAccumTot = Math.max(0, Math.floor(system.stats.Strength.kiPoolAccuBase + system.kiPool.str.spec + system.kiPool.str.temp + system.kiPool.str.bonus + system.kiPool.str.default + Math.min(0, ~~(system.aamFinal / 20))));
        system.kiPoolPowAccumTot = Math.max(0, Math.floor(system.stats.Power.kiPoolAccuBase + system.kiPool.pow.spec + system.kiPool.pow.temp + system.kiPool.pow.bonus + system.kiPool.pow.default + Math.min(0, ~~(system.aamFinal / 20))));
        system.kiPoolWPAccumTot = Math.max(0, Math.floor(system.stats.Willpower.kiPoolAccuBase + system.kiPool.wp.spec + system.kiPool.wp.temp + system.kiPool.wp.bonus + system.kiPool.wp.default + Math.min(0, ~~(system.aamFinal / 20))));

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

        system.kiPoolAgiTot = Math.floor(system.stats.Agility.kiPoolBase + system.kiPool.agi.specMax + system.kiPool.agi.tempMax + system.kiPool.agi.bonusMax + system.kiPool.agi.defaultMax);
        system.kiPoolConTot = Math.floor(system.stats.Constitution.kiPoolBase + system.kiPool.con.specMax + system.kiPool.con.tempMax + system.kiPool.dex.bonusMax + system.kiPool.con.defaultMax);
        system.kiPoolDexTot = Math.floor(system.stats.Dexterity.kiPoolBase + system.kiPool.dex.specMax + system.kiPool.dex.tempMax + system.kiPool.dex.bonusMax + system.kiPool.dex.defaultMax);
        system.kiPoolStrTot = Math.floor(system.stats.Strength.kiPoolBase + system.kiPool.str.specMax + system.kiPool.str.tempMax + system.kiPool.str.bonusMax + system.kiPool.str.defaultMax);
        system.kiPoolPowTot = Math.floor(system.stats.Power.kiPoolBase + system.kiPool.pow.specMax + system.kiPool.pow.tempMax + system.kiPool.pow.bonusMax + system.kiPool.pow.defaultMax);
        system.kiPoolWPTot = Math.floor(system.stats.Willpower.kiPoolBase + system.kiPool.wp.specMax + system.kiPool.wp.tempMax + system.kiPool.wp.bonusMax + system.kiPool.wp.defaultMax);

        if (system.toggles.unifiedPools == true) {
            if (system.toggles.innatePower == true) {
                switch (system.kiPool.innate.type) {
                    case "AGI":
                        system.unifiedKi.max = Math.floor(system.kiPool.innate.bonus + system.kiPoolAgiTot);
                        system.kiPoolConTot = 0;
                        system.kiPoolDexTot = 0;
                        system.kiPoolStrTot = 0;
                        system.kiPoolPowTot = 0;
                        system.kiPoolWPTot = 0;
                        system.innateAgi = true;
                        break;
                    case "CON":
                        system.unifiedKi.max = Math.floor(system.kiPool.innate.bonus + system.kiPoolConTot);
                        system.kiPoolAgiTot = 0;
                        system.kiPoolDexTot = 0;
                        system.kiPoolStrTot = 0;
                        system.kiPoolPowTot = 0;
                        system.kiPoolWPTot = 0;
                        break;
                    case "DEX":
                        system.unifiedKi.max = Math.floor(system.kiPool.innate.bonus + system.kiPoolDexTot);
                        system.kiPoolAgiTot = 0;
                        system.kiPoolConTot = 0;
                        system.kiPoolStrTot = 0;
                        system.kiPoolPowTot = 0;
                        system.kiPoolWPTot = 0;
                        break;
                    case "STR":
                        system.unifiedKi.max = Math.floor(system.kiPool.innate.bonus + system.kiPoolStrTot);
                        system.kiPoolAgiTot = 0;
                        system.kiPoolConTot = 0;
                        system.kiPoolDexTot = 0;
                        system.kiPoolPowTot = 0;
                        system.kiPoolWPTot = 0;
                        break;
                    case "POW":
                        system.unifiedKi.max = Math.floor(system.kiPool.innate.bonus + system.kiPoolPowTot);
                        system.kiPoolAgiTot = 0;
                        system.kiPoolConTot = 0;
                        system.kiPoolDexTot = 0;
                        system.kiPoolStrTot = 0;
                        system.kiPoolWPTot = 0;
                        break;
                    case "WP":
                        system.unifiedKi.max = Math.floor(system.kiPool.innate.bonus + system.kiPoolWPTot);
                        system.kiPoolAgiTot = 0;
                        system.kiPoolConTot = 0;
                        system.kiPoolDexTot = 0;
                        system.kiPoolStrTot = 0;
                        system.kiPoolPowTot = 0;
                        break;
                    default:
                        system.kiPool.innate.tag = "Error";
                        break;
                }
            } else {
                system.unifiedKi.max = Math.floor(system.kiPoolAgiTot + system.kiPoolConTot + system.kiPoolDexTot + system.kiPoolStrTot + system.kiPoolPowTot + system.kiPoolWPTot + system.kiPool.unifiedBonus);
            }
        }

        //atk, blk, dodge
        system.atkfinal = Math.floor(system.combatstats.atkbase + system.combatstats.atkspecial + system.combatstats.atktemp + system.combatstats.atkbonus + system.stats.Dexterity.mod + system.aamFinal);
        system.blkfinal = Math.floor(system.combatstats.blkbase + system.combatstats.blkspecial + system.combatstats.blktemp + system.combatstats.blkbonus + system.stats.Dexterity.mod + system.aamFinal);
        system.dodfinal = Math.floor(system.combatstats.dodbase + system.combatstats.dodspecial + system.combatstats.dodtemp + system.combatstats.dodbonus + system.stats.Agility.mod + system.aamFinal);

        //Magic Projection system.mproj.spec + system.mproj.temp
        system.mprojfinal = Math.floor(system.mproj.base + system.stats.Dexterity.mod + system.aamFinal);
        system.mprojfinaloff = Math.floor(system.mprojfinal + system.mproj.spec + system.mproj.temp + system.mproj.bonus + system.mproj.imbalance);
        system.mprojfinaldef = Math.floor(system.mprojfinal + system.mproj.spec2 + system.mproj.temp2 + system.mproj.bonus2 - system.mproj.imbalance);

        system.mprojAtkModule = Math.floor(system.combatstats.atkbase + system.mproj.spec + system.mproj.temp + system.mproj.bonus + system.stats.Dexterity.mod + system.aamFinal);
        system.mprojDefModule = Math.floor(system.combatstats.blkbase + system.mproj.spec2 + system.mproj.temp2 + system.mproj.bonus2 + system.stats.Dexterity.mod + system.aamFinal);
        system.mprojDodModule = Math.floor(system.combatstats.dodbase + system.mproj.spec2 + system.mproj.temp2 + system.mproj.bonus2 + system.stats.Dexterity.mod + system.aamFinal);

        // Psychic Potential
        if (system.stats.Willpower.final < 5) {
            system.fromWP = 0;
        } else if (system.stats.Willpower.final >= 5 && system.stats.Willpower.final < 15) {
            system.fromWP = Math.floor((system.stats.Willpower.final - 4) * 10);
        } else if (system.stats.Willpower.final >= 15) {
            system.fromWP = Math.floor(((system.stats.Willpower.final - 14) * 20) + 100)
        }
        system.finalPotential = Math.floor(system.ppotential.base + system.fromWP + + system.ppotential.spent + system.ppotential.spec + system.ppotential.temp + system.ppotential.bonus);
        switch (system.ppotential.spent) {
            case "10":
                system.ppotentialpp = 1;
                break;
            case "20":
                system.ppotentialpp = 3;
                break;
            case "30":
                system.ppotentialpp = 6;
                break;
            case "40":
                system.ppotentialpp = 10;
                break;
            case "50":
                system.ppotentialpp = 15;
                break;
            case "60":
                system.ppotentialpp = 21;
                break;
            case "70":
                system.ppotentialpp = 28;
                break;
            case "80":
                system.ppotentialpp = 36;
                break;
            case "90":
                system.ppotentialpp = 45;
                break;
            case "100":
                system.ppotentialpp = 55;
                break;
            default:
                system.ppotentialpp = 0;
                break;
        }

        // Psychic Projection
        system.pprojfinal = Math.floor(system.pproj.base + system.pproj.spec + system.pproj.temp + system.pproj.bonusBase + system.stats.Dexterity.mod + system.aamFinal);

        system.pprojAtkModule = Math.floor(system.combatstats.atkbase + system.pproj.spec + system.pproj.temp + system.pproj.bonus + system.stats.Dexterity.mod + system.aamFinal);
        system.pprojDefModule = Math.floor(system.combatstats.blkbase + system.pproj.spec + system.pproj.temp + system.pproj.bonus2 + system.stats.Dexterity.mod + system.aamFinal);
        system.pprojDodModule = Math.floor(system.combatstats.dodbase + system.pproj.spec + system.pproj.temp + system.pproj.bonus2 + system.stats.Dexterity.mod + system.aamFinal);
        // Wear Armor
        system.wearArmorFinal = Math.floor(system.wearArmor.base + system.wearArmor.spec + system.wearArmor.temp + system.wearArmor.bonus + system.stats.Strength.mod);


        // Determine Item Values / Last used arr[123]  2                    *Look at js map
        const [level, lpbonus, ini, atk, dod, blk, weararm, mk, pp, zeon, summon, control, bind, banish, acro,
            athle, climb, jump, ride, swim, etiq, intim, leader, persua, street, style, trading, notice, search, track,
            animals, appra, archi, herb, hist, law, magicapr, medic, mem, navi, occ, science, tactic, comp, fos,
            wstp, disg, hide, lock, poisn, stealth, theft, trapl, alche, anims, art, dance, forgi, jewel, music,
            runes, ritcal, soh, tailoring, quantity, req, natPen, movePen, aCutMax, aCutTot, aImpMax, aImpTot, aThrMax, aThrTot, aHeatMax,
            aHeatTot, aColdMax, aColdTot, aEleMax, aEleTot, aEneMax, aEneTot, aSptMax, aSptTot, ahReq, ahCutMax, ahCutTot, ahImpMax, ahImpTot, ahThrMax,
            ahThrTot, ahHeatMax, ahHeatTot, ahColdMax, ahColdTot, ahEleMax, ahEleTot, ahEneMax, ahEneTot, ahSptMax, ahSptTot, perPen, usedpp, matrixpp, arsMk,
            maMk, techMk, pathLvl, turnMaint, dayMaint, spellCost, wepNum, wepSpd, maKiAtk, maKiBlk, maKiDod, pilot, techmagic, cook, toy,
            kiDect, kiCon, wepName, monsterCost] = this.items.reduce((arr, item) => {
                if (item.type === "class") {
                    const classLevels = parseInt(item.system.main.levels) || 0;
                    arr[0] += classLevels;
                    arr[1] += classLevels * (parseInt(item.system.main.lp) || 0);
                    arr[2] += classLevels * (parseInt(item.system.main.initiative) || 0);
                    arr[3] += classLevels * (parseInt(item.system.main.attack) || 0);
                    arr[4] += classLevels * (parseInt(item.system.main.dodge) || 0);
                    arr[5] += classLevels * (parseInt(item.system.main.block) || 0);
                    arr[6] += classLevels * (parseInt(item.system.main.weararmor) || 0);
                    arr[7] += classLevels * (parseInt(item.system.main.mk) || 0);
                    arr[8] += (parseInt(item.system.totalPP) || 0);
                    arr[9] += classLevels * (parseInt(item.system.main.zeon) || 0);
                    arr[10] += classLevels * (parseInt(item.system.main.summon) || 0);
                    arr[11] += classLevels * (parseInt(item.system.main.control) || 0);
                    arr[12] += classLevels * (parseInt(item.system.main.bind) || 0);
                    arr[13] += classLevels * (parseInt(item.system.main.banish) || 0);
                    arr[14] += classLevels * (parseInt(item.system.secondary.acro) || 0);
                    arr[15] += classLevels * (parseInt(item.system.secondary.athleticism) || 0);
                    arr[16] += classLevels * (parseInt(item.system.secondary.climb) || 0);
                    arr[17] += classLevels * (parseInt(item.system.secondary.jump) || 0);
                    arr[18] += classLevels * (parseInt(item.system.secondary.ride) || 0);
                    arr[19] += classLevels * (parseInt(item.system.secondary.swim) || 0);
                    arr[20] += classLevels * (parseInt(item.system.secondary.etiquette) || 0);
                    arr[21] += classLevels * (parseInt(item.system.secondary.intimidate) || 0);
                    arr[22] += classLevels * (parseInt(item.system.secondary.leadership) || 0);
                    arr[23] += classLevels * (parseInt(item.system.secondary.persuasion) || 0);
                    arr[24] += classLevels * (parseInt(item.system.secondary.streetwise) || 0);
                    arr[25] += classLevels * (parseInt(item.system.secondary.style) || 0);
                    arr[26] += classLevels * (parseInt(item.system.secondary.trading) || 0);
                    arr[27] += classLevels * (parseInt(item.system.secondary.notice) || 0);
                    arr[28] += classLevels * (parseInt(item.system.secondary.search) || 0);
                    arr[29] += classLevels * (parseInt(item.system.secondary.track) || 0);
                    arr[30] += classLevels * (parseInt(item.system.secondary.animals) || 0);
                    arr[31] += classLevels * (parseInt(item.system.secondary.appraisal) || 0);
                    arr[32] += classLevels * (parseInt(item.system.secondary.architecture) || 0);
                    arr[33] += classLevels * (parseInt(item.system.secondary.herballore) || 0);
                    arr[34] += classLevels * (parseInt(item.system.secondary.history) || 0);
                    arr[35] += classLevels * (parseInt(item.system.secondary.law) || 0);
                    arr[36] += classLevels * (parseInt(item.system.secondary.magicappr) || 0);
                    arr[37] += classLevels * (parseInt(item.system.secondary.medicine) || 0);
                    arr[38] += classLevels * (parseInt(item.system.secondary.memorize) || 0);
                    arr[39] += classLevels * (parseInt(item.system.secondary.navigation) || 0);
                    arr[40] += classLevels * (parseInt(item.system.secondary.occult) || 0);
                    arr[41] += classLevels * (parseInt(item.system.secondary.science) || 0);
                    arr[42] += classLevels * (parseInt(item.system.secondary.tactics) || 0);
                    arr[43] += classLevels * (parseInt(item.system.secondary.composure) || 0);
                    arr[44] += classLevels * (parseInt(item.system.secondary.featsofstr) || 0);
                    arr[45] += classLevels * (parseInt(item.system.secondary.withstpain) || 0);
                    arr[46] += classLevels * (parseInt(item.system.secondary.disguise) || 0);
                    arr[47] += classLevels * (parseInt(item.system.secondary.hide) || 0);
                    arr[48] += classLevels * (parseInt(item.system.secondary.lockpicking) || 0);
                    arr[49] += classLevels * (parseInt(item.system.secondary.poisons) || 0);
                    arr[50] += classLevels * (parseInt(item.system.secondary.stealth) || 0);
                    arr[51] += classLevels * (parseInt(item.system.secondary.theft) || 0);
                    arr[52] += classLevels * (parseInt(item.system.secondary.traplore) || 0);
                    arr[53] += classLevels * (parseInt(item.system.secondary.alchemy) || 0);
                    arr[54] += classLevels * (parseInt(item.system.secondary.animism) || 0);
                    arr[55] += classLevels * (parseInt(item.system.secondary.art) || 0);
                    arr[56] += classLevels * (parseInt(item.system.secondary.dance) || 0);
                    arr[57] += classLevels * (parseInt(item.system.secondary.forging) || 0);
                    arr[58] += classLevels * (parseInt(item.system.secondary.jewelry) || 0);
                    arr[59] += classLevels * (parseInt(item.system.secondary.music) || 0);
                    arr[60] += classLevels * (parseInt(item.system.secondary.runes) || 0);
                    arr[61] += classLevels * (parseInt(item.system.secondary.ritualcalig) || 0);
                    arr[62] += classLevels * (parseInt(item.system.secondary.slofhand) || 0);
                    arr[63] += classLevels * (parseInt(item.system.secondary.tailoring) || 0);
                    arr[116] += classLevels * (parseInt(item.system.secondary.piloting) || 0);
                    arr[117] += classLevels * (parseInt(item.system.secondary.technomagic) || 0);
                    arr[118] += classLevels * (parseInt(item.system.secondary.cooking) || 0);
                    arr[119] += classLevels * (parseInt(item.system.secondary.toymaking) || 0);
                    arr[120] += classLevels * (parseInt(item.system.secondary.kidetection) || 0);
                    arr[121] += classLevels * (parseInt(item.system.secondary.kiconceal) || 0);
                }
                if (item.type === "armor") {
                    if (item.system.equipped == true) {
                        arr[64] += parseInt(item.system.quantity) || 0;
                        arr[65] += parseInt(item.system.newRequirement) || 0;
                        arr[66] += parseInt(item.system.newNatPenalty) || 0;
                        arr[67] += parseInt(item.system.newMovePenalty) || 0;
                        if (arr[68] < item.system.AT.newCut) {
                            arr[68] = item.system.AT.newCut;
                        }
                        arr[69] += parseInt(item.system.AT.newCut / 2) || 0;
                        if (arr[70] < item.system.AT.newImp) {
                            arr[70] = item.system.AT.newImp;
                        }
                        arr[71] += parseInt(item.system.AT.newImp / 2) || 0;
                        if (arr[72] < item.system.AT.newThr) {
                            arr[72] = item.system.AT.newThr;
                        }
                        arr[73] += parseInt(item.system.AT.newThr / 2) || 0;
                        if (arr[74] < item.system.AT.newHeat) {
                            arr[74] = item.system.AT.newHeat;
                        }
                        arr[75] += parseInt(item.system.AT.newHeat / 2) || 0;
                        if (arr[76] < item.system.AT.newCold) {
                            arr[76] = item.system.AT.newCold;
                        }
                        arr[77] += parseInt(item.system.AT.newCold / 2) || 0;
                        if (arr[78] < item.system.AT.newEle) {
                            arr[78] = item.system.AT.newEle;
                        }
                        arr[79] += parseInt(item.system.AT.newEle / 2) || 0;
                        if (arr[80] < item.system.AT.newEne) {
                            arr[80] = item.system.AT.newEne;
                        }
                        arr[81] += parseInt(item.system.AT.newEne / 2) || 0;
                        if (arr[82] < item.system.AT.newSpt) {
                            arr[82] = item.system.AT.newSpt;
                        }
                        arr[83] += parseInt(item.system.AT.newSpt / 2) || 0;
                    }
                }
                if (item.type === "armorHelmet") {
                    if (item.system.equipped == true) {
                        arr[84] += parseInt(item.system.newRequirement) || 0;
                        if (arr[85] < item.system.AT.newCut) {
                            arr[85] = item.system.AT.newCut;
                        }
                        arr[86] += parseInt(item.system.AT.newCut / 2) || 0;
                        if (arr[87] < item.system.AT.newImp) {
                            arr[87] = item.system.AT.newImp;
                        }
                        arr[88] += parseInt(item.system.AT.newImp / 2) || 0;
                        if (arr[89] < item.system.AT.newThr) {
                            arr[89] = item.system.AT.newThr;
                        }
                        arr[90] += parseInt(item.system.AT.newThr / 2) || 0;
                        if (arr[91] < item.system.AT.newHeat) {
                            arr[91] = item.system.AT.newHeat;
                        }
                        arr[92] += parseInt(item.system.AT.newHeat / 2) || 0;
                        if (arr[93] < item.system.AT.newCold) {
                            arr[93] = item.system.AT.newCold;
                        }
                        arr[94] += parseInt(item.system.AT.newCold / 2) || 0;
                        if (arr[95] < item.system.AT.newEle) {
                            arr[95] = item.system.AT.newEle;
                        }
                        arr[96] += parseInt(item.system.AT.newEle / 2) || 0;
                        if (arr[97] < item.system.AT.newEne) {
                            arr[97] = item.system.AT.newEne;
                        }
                        arr[98] += parseInt(item.system.AT.newEne / 2) || 0;
                        if (arr[99] < item.system.AT.newSpt) {
                            arr[99] = item.system.AT.newSpt;
                        }
                        arr[100] += parseInt(item.system.AT.newSpt / 2) || 0;
                        arr[101] += parseInt(item.system.newNatPenalty) || 0;
                    }
                }
                if (item.type === "discipline") {
                    arr[102] += parseInt(item.system.quantity) || 0;
                }
                if (item.type === "psychicMatrix") {
                    arr[102] += parseInt(item.system.quantity) || 0;
                    if (system.toggles.psychicStrengthening == true) {
                        arr[103] += parseInt(item.system.bonus / 20) || 0;
                    } else {
                        arr[103] += parseInt(item.system.bonus / 10) || 0;
                    }
                }
                if (item.type === "arsMagnus") {
                    arr[104] += parseInt(item.system.mk) || 0;
                }
                if (item.type === "martialArt") {
                    arr[105] += parseInt(item.system.mk) || 0;
                    arr[113] += parseInt(item.system.bonusAtk) || 0;
                    arr[114] += parseInt(item.system.bonusDef) || 0;
                    arr[115] += parseInt(item.system.bonusDod) || 0;
                }
                if (item.type === "kiTechnique") {
                    arr[106] += parseInt(item.system.mk) || 0;
                }
                if (item.type === "spellPath") {
                    arr[107] += parseInt(item.system.level) || 0;
                }
                if (item.type === "turnMaint") {
                    if (item.system.equipped == true) {
                        arr[108] += parseInt(item.system.zeon) || 0;
                    }
                }
                if (item.type === "dailyMaint") {
                    if (item.system.equipped == true) {
                        arr[109] += parseInt(item.system.zeon) || 0;
                    }
                }
                if (item.type === "spell") {
                    if (item.system.bought == "Single") {
                        arr[110] += parseInt(item.system.cost) || 0;
                    }
                }
                if (item.type === "weapon") {
                    if (item.system.equipped == true) {
                        arr[111] += 1;
                        if (arr[111] == 1) {
                            arr[112] = item.system.FinalWeaponSpeed;
                            arr[122] = item.name;
                        } else if (arr[112] > item.system.FinalWeaponSpeed) {
                            arr[112] = item.system.FinalWeaponSpeed;
                        }
                    }
                }
                if (item.type === "monsterPower") {
                    arr[123] += parseInt(item.system.cost) || 0;
                }
            return arr;
            }, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0]);

        //Stuff Xp, Presence, Next lvl Xp
        system.level = level; //class Bonus
        if (system.level == 0) {
            system.dp = 400 + system.levelinfo.dpmod + system.levelinfo.dpmodBonus;
        } else {
            system.dp = Math.floor((system.level * 100) + 500 + system.levelinfo.dpmod + system.levelinfo.dpmodBonus);
        }
        system.presence = Math.floor((system.dp / 20) + system.levelinfo.presencemod + system.levelinfo.presencemodBonus);
        system.nextlevel = Math.floor(((system.level + system.levelinfo.levelmod + system.levelinfo.levelmodBonus) * 25) + 75);

        //Mk Calculations
        system.mkBonus = mk; //Class Mk
        system.kiThingMK = 0; //Ki Abilities Cost
        for (let [key, kiThing] of Object.entries(system.kiAbility)) {
            if (kiThing.status == true && kiThing.status2 == false) {
                system.kiThingMK += kiThing.cost;
            } else {
                system.kiThingMK += 0;
            }
        }
        system.kiSealMk = 0; //Minor & Major Seals Cost
        for (let [key, kiSealStuff] of Object.entries(system.kiSeal.minor)) {
            if (kiSealStuff.mastery == true && kiSealStuff.mastery2 == false) {
                system.kiSealMk += 30;
            } else {
                system.kiSealMk += 0;
            }
        }
        for (let [key, kiSealStuff] of Object.entries(system.kiSeal.major)) {
            if (kiSealStuff.mastery == true && kiSealStuff.mastery2 == false) {
                system.kiSealMk += 50;
            } else {
                system.kiSealMk += 0;
            }
        }
        switch (system.limits.limitOne) {
            case "mors":
                system.limitOneCost = 30;
                break;
            case "cenobus":
                system.limitOneCost = 20;
                break;
            case "caelum":
                system.limitOneCost = 15;
                break;
            case "agon":
                system.limitOneCost = 20;
                break;
            case "custodium":
                system.limitOneCost = 10;
                break;
            case "cruor":
                system.limitOneCost = 10;
                break;
            case "terminus":
                system.limitOneCost = 10;
                break;
            default:
                system.limitOneCost = 0;
                break;
        }
        switch (system.limits.limitTwo) {
            case "mors":
                system.limitTwoCost = 30;
                break;
            case "cenobus":
                system.limitTwoCost = 20;
                break;
            case "caelum":
                system.limitTwoCost = 15;
                break;
            case "agon":
                system.limitTwoCost = 20;
                break;
            case "custodium":
                system.limitTwoCost = 10;
                break;
            case "cruor":
                system.limitTwoCost = 10;
                break;
            case "terminus":
                system.limitTwoCost = 10;
                break;
            default:
                system.limitTwoCost = 0;
                break;
        }

        system.limitsMK = +system.limitOneCost + +system.limitTwoCost; //Limits Cost
        system.arsMagMK = arsMk; //Ars Magnus Cost
        system.mArtMk = maMk; //Martial Arts Bonus MK
        system.kiTechMk = techMk; //Ki Technique Cost
        system.mkFinal = Math.floor(system.mk.base + system.mk.temp + system.mk.spec + system.mk.bonus + system.mkBonus + system.mArtMk); //Total Final Mk
        system.mkUsed = Math.floor(system.limitsMK + system.kiThingMK + system.kiSealMk + system.arsMagMK + system.kiTechMk); //Total Used Mk

        // Wear Armor
        system.weararmorbonus = weararm;
        system.wearArmorFinal += weararm;

        if (system.kiAbility.kiEnergyArmor.status == true) { //Energy armor add 2 energy AT for free
            system.enArm = 2;
            if (system.toggles.greaterEnergyArmor == true && system.kiAbility.kiArcaneArmor.status == false) { //Greater energy armor only if arcane is not bought
                system.enArm = 4;
            } else if (system.kiAbility.kiArcaneArmor.status == true) {
                system.enArm = 4;
                system.toggles.greaterEnergyArmor = false;
                if (system.toggles.arcaneEnergyArmor == true) {
                    system.enArm = 6;
                }
            }
        } else {
            system.enArm = 0;
        }
        if (system.kiAbility.kiGreaterArmor.status == false) {
            system.toggles.greaterEnergyArmor = false;
        }
        if (system.kiAbility.kiArcaneArmor.status == false) {
            system.toggles.arcaneEnergyArmor = false;
        }
        // Armor Final AT
        system.aCutFinal = Math.floor((aCutTot - ~~(aCutMax / 2)) + aCutMax);
        system.aImpFinal = Math.floor((aImpTot - ~~(aImpMax / 2)) + aImpMax);
        system.aThrFinal = Math.floor((aThrTot - ~~(aThrMax / 2)) + aThrMax);
        system.aHeatFinal = Math.floor((aHeatTot - ~~(aHeatMax / 2)) + aHeatMax);
        system.aColdFinal = Math.floor((aColdTot - ~~(aColdMax / 2)) + aColdMax);
        system.aEleFinal = Math.floor((aEleTot - ~~(aEleMax / 2)) + aEleMax);
        system.aEneFinal = Math.floor((aEneTot - ~~(aEneMax / 2)) + aEneMax + system.enArm);
        system.aSptFinal = Math.floor((aSptTot - ~~(aSptMax / 2)) + aSptMax);

        // Helmet Final AT
        system.ahCutFinal = Math.floor((ahCutTot - ~~(ahCutMax / 2)) + ahCutMax);
        system.ahImpFinal = Math.floor((ahImpTot - ~~(ahImpMax / 2)) + ahImpMax);
        system.ahThrFinal = Math.floor((ahThrTot - ~~(ahThrMax / 2)) + ahThrMax);
        system.ahHeatFinal = Math.floor((ahHeatTot - ~~(ahHeatMax / 2)) + ahHeatMax);
        system.ahColdFinal = Math.floor((ahColdTot - ~~(ahColdMax / 2)) + ahColdMax);
        system.ahEleFinal = Math.floor((ahEleTot - ~~(ahEleMax / 2)) + ahEleMax);
        system.ahEneFinal = Math.floor((ahEneTot - ~~(ahEneMax / 2)) + ahEneMax);
        system.ahSptFinal = Math.floor((ahSptTot - ~~(ahSptMax / 2)) + ahSptMax);

        // Armor Stats
        system.totalPerPen = perPen;
        system.armorMod = Math.floor(system.wearArmorFinal - req);
        if (natPen - system.armorMod < 0) {
            system.totalNatPen = Math.max(0, Math.floor(((quantity - 1) * 20) + 0));
        } else {
            system.totalNatPen = Math.max(0, Math.floor(((quantity - 1) * 20) + (natPen - system.armorMod)));
        }
        system.movePenMod = Math.max(0, Math.floor(system.armorMod / 50));
        if (movePen - system.movePenMod < 0) {
            system.totalMovePen = -Math.floor(movePen + Math.max(0, system.totalNatPen / 50));
        } else {
            system.totalMovePen = -Math.floor(movePen + Math.max(0, system.totalNatPen / 50) - system.movePenMod);
        }

        //Resistances
        if (system.kiAbility.kiPhysDom.status == true) { //Physical Dominion adds 10 PhR
            system.phrDom = 10;
        } else {
            system.phrDom = 0;
        }
        if (system.kiAbility.nemiBodyEmpty.status == true) { //Physical Dominion adds 20 PhR
            system.allEmpty = 20;
        } else {
            system.allEmpty = 0;
        }

        for (let [key, res] of Object.entries(system.resistances)) {
            switch (key) {
                case "Physical":
                    res.name = game.i18n.localize('abfalter.sheet.physicalRes');
                    res.short = game.i18n.localize('abfalter.sheet.phr');
                    res.final = Math.floor(system.presence + res.mod + stats.Constitution.mod + system.phrDom + system.allEmpty + res.bonus);
                    break;
                case "Disease":
                    res.name = game.i18n.localize('abfalter.sheet.diseaseRes');
                    res.short = game.i18n.localize('abfalter.sheet.dr');
                    res.final = Math.floor(system.presence + res.mod + stats.Constitution.mod + system.allEmpty + res.bonus);
                    break;
                case "Poison":
                    res.name = game.i18n.localize('abfalter.sheet.poisonRes');
                    res.short = game.i18n.localize('abfalter.sheet.psnr');
                    res.final = Math.floor(system.presence + res.mod + stats.Constitution.mod + system.allEmpty + res.bonus);
                    break;
                case "Magic":
                    res.name = game.i18n.localize('abfalter.sheet.magicRes');
                    res.short = game.i18n.localize('abfalter.sheet.mr');
                    res.final = Math.floor(system.presence + res.mod + stats.Power.mod + system.allEmpty + res.bonus);
                    break;
                case "Psychic":
                    res.name = game.i18n.localize('abfalter.sheet.psychicRes');
                    res.short = game.i18n.localize('abfalter.sheet.psyr');
                    res.final = Math.floor(system.presence + res.mod + stats.Willpower.mod + system.allEmpty + res.bonus);
                    break;
                default:
                    break;
            }
        }

        //Movement
        system.finalmove = Math.floor(system.stats.Agility.final + system.movement.spec + system.movement.temp + system.movement.bonus + system.movement.sizeBase - system.movement.pen + Math.min(0, Math.ceil(system.aamFinal / 20)) + system.totalMovePen);
        switch (system.finalmove) {
            case 1:
                if (system.useMeters) {
                    system.fullmove = "<1 m.";
                    system.fourthmove = "<1 m.";
                    system.runningmove = "<1 m.";
                } else {
                    system.fullmove = "3 ft";
                    system.fourthmove = "1 ft";
                    system.runningmove = "N/A";
                }
                break;
            case 2:
                if (system.useMeters) {
                    system.fullmove = "4 m.";
                    system.fourthmove = "1 m.";
                    system.runningmove = "2 m.";
                } else {
                    system.fullmove = "15 ft";
                    system.fourthmove = "3 ft";
                    system.runningmove = "7 ft";
                }
                break;
            case 3:
                if (system.useMeters) {
                    system.fullmove = "8 m.";
                    system.fourthmove = "2 m.";
                    system.runningmove = "4 m.";
                } else {
                    system.fullmove = "25 ft";
                    system.fourthmove = "6 ft";
                    system.runningmove = "12 ft";
                }
                break;
            case 4:
                if (system.useMeters) {
                    system.fullmove = "15 m.";
                    system.fourthmove = "4 m.";
                    system.runningmove = "8 m.";
                } else {
                    system.fullmove = "50 ft";
                    system.fourthmove = "12 ft";
                    system.runningmove = "15 ft";
                }
                break;
            case 5:
                if (system.useMeters) {
                    system.fullmove = "20 m.";
                    system.fourthmove = "5 m.";
                    system.runningmove = "8 m.";
                } else {
                    system.fullmove = "65 ft";
                    system.fourthmove = "16 ft";
                    system.runningmove = "25 ft";
                }
                break;
            case 6:
                if (system.useMeters) {
                    system.fullmove = "22 m.";
                    system.fourthmove = "5 m.";
                    system.runningmove = "15 m.";
                } else {
                    system.fullmove = "70 ft";
                    system.fourthmove = "17 ft";
                    system.runningmove = "50 ft";
                }
                break;
            case 7:
                if (system.useMeters) {
                    system.fullmove = "25 m.";
                    system.fourthmove = "6 m.";
                    system.runningmove = "20 m.";
                } else {
                    system.fullmove = "80 ft";
                    system.fourthmove = "20 ft";
                    system.runningmove = "65 ft";
                }
                break;
            case 8:
                if (system.useMeters) {
                    system.fullmove = "28 m.";
                    system.fourthmove = "7 m.";
                    system.runningmove = "22 m.";
                } else {
                    system.fullmove = "90 ft";
                    system.fourthmove = "22 ft";
                    system.runningmove = "70 ft";
                }
                break;
            case 9:
                if (system.useMeters) {
                    system.fullmove = "32 m.";
                    system.fourthmove = "8 m.";
                    system.runningmove = "25 m.";
                } else {
                    system.fullmove = "105 ft";
                    system.fourthmove = "26 ft";
                    system.runningmove = "80 ft";
                }
                break;
            case 10:
                if (system.useMeters) {
                    system.fullmove = "35 m.";
                    system.fourthmove = "9 m.";
                    system.runningmove = "28 m.";
                } else {
                    system.fullmove = "115 ft";
                    system.fourthmove = "28 ft";
                    system.runningmove = "90 ft";
                }
                break;
            case 11:
                if (system.useMeters) {
                    system.fullmove = "40 m.";
                    system.fourthmove = "10 m.";
                    system.runningmove = "32 m.";
                } else {
                    system.fullmove = "130 ft";
                    system.fourthmove = "32 ft";
                    system.runningmove = "105 ft";
                }
                break;
            case 12:
                if (system.useMeters) {
                    system.fullmove = "50 m.";
                    system.fourthmove = "12 m.";
                    system.runningmove = "35 m.";
                } else {
                    system.fullmove = "160 ft";
                    system.fourthmove = "40 ft";
                    system.runningmove = "115 ft";
                }
                break;
            case 13:
                if (system.useMeters) {
                    system.fullmove = "80 m.";
                    system.fourthmove = "20 m.";
                    system.runningmove = "40 m.";
                } else {
                    system.fullmove = "250 ft";
                    system.fourthmove = "62 ft";
                    system.runningmove = "130 ft";
                }
                break;
            case 14:
                if (system.useMeters) {
                    system.fullmove = "150 m.";
                    system.fourthmove = "37 m.";
                    system.runningmove = "50 m.";
                } else {
                    system.fullmove = "500 ft";
                    system.fourthmove = "125 ft";
                    system.runningmove = "160 ft";
                }
                break;
            case 15:
                if (system.useMeters) {
                    system.fullmove = "250 m.";
                    system.fourthmove = "62 m.";
                    system.runningmove = "80 m.";
                } else {
                    system.fullmove = "800 ft";
                    system.fourthmove = "200 ft";
                    system.runningmove = "250 ft";
                }
                break;
            case 16:
                if (system.useMeters) {
                    system.fullmove = "500 m.";
                    system.fourthmove = "125 m.";
                    system.runningmove = "150 m.";
                } else {
                    system.fullmove = "1500 ft";
                    system.fourthmove = "375 ft";
                    system.runningmove = "500 ft";
                }
                break;
            case 17:
                if (system.useMeters) {
                    system.fullmove = "1 Km.";
                    system.fourthmove = "250 m.";
                    system.runningmove = "500 m.";
                } else {
                    system.fullmove = "3000 ft";
                    system.fourthmove = "750 ft";
                    system.runningmove = "1500 ft";
                }
                break;
            case 18:
                if (system.useMeters) {
                    system.fullmove = "5 Km.";
                    system.fourthmove = "1.2 Km.";
                    system.runningmove = "2.5 Km.";
                } else {
                    system.fullmove = "3 miles";
                    system.fourthmove = "3960 ft";
                    system.runningmove = "1.5 miles";
                }
                break;
            case 19:
                if (system.useMeters) {
                    system.fullmove = "25 Km.";
                    system.fourthmove = "6.2 Km.";
                    system.runningmove = "12.5 Km.";
                } else {
                    system.fullmove = "15 miles";
                    system.fourthmove = "3.75 miles";
                    system.runningmove = "7.5 miles";
                }
                break;
            case 20:
                    system.fullmove = game.i18n.localize('abfalter.basicInfo.special');
                    system.fourthmove = game.i18n.localize('abfalter.basicInfo.special');
                    system.runningmove = game.i18n.localize('abfalter.basicInfo.special');
                break;
            default:
                    system.fullmove = "0";
                    system.fourthmove = "0";
                    system.runningmove = "0";
                break;
        }
        if (system.finalmove > 20) {
            system.fullmove = game.i18n.localize('abfalter.basicInfo.special');
            system.fourthmove = game.i18n.localize('abfalter.basicInfo.special');
            system.runningmove = game.i18n.localize('abfalter.basicInfo.special');
        }
        //Lifepoint Calculation
        system.lpbonus = lpbonus;
        system.lp.max += lpbonus;
        // Attack, Block, & Dodge post class
        system.attackbonus = atk + maKiAtk;
        if (system.attackbonus > 50) {
            system.attackbonus = 50;
        }
        system.atkfinal += system.attackbonus;
        system.blockbonus = blk + maKiBlk;
        if (system.blockbonus > 50) {
            system.blockbonus = 50;
        }
        system.blkfinal += system.blockbonus;
        system.dodgebonus = dod + maKiDod;
        if (system.dodgebonus > 50) {
            system.dodgebonus = 50;
        }
        system.dodfinal += system.dodgebonus;

        // Initiative
        if (system.kiAbility.kiIncreaseSpd.status == true) {
            system.KiBonusSpd = 10;
        } else {
            system.KiBonusSpd = 0;
        }
        system.inibonus = ini;
        system.weaponNumber = wepNum;
        system.weaponSpeed = wepSpd;
        system.weaponName = wepName;
        if (system.weaponNumber > 1 && system.weaponSpeed < 0) {
            system.wepFinSpd = system.weaponSpeed - 20;
            system.weaponName = game.i18n.localize('abfalter.basicInfo.multiWield');
        } else if (system.weaponNumber > 1 && system.weaponSpeed >= 0) {
            system.wepFinSpd = system.weaponSpeed - 10;
            system.weaponName = game.i18n.localize('abfalter.basicInfo.multiWield');
        } else if (system.weaponNumber == 0) {
            system.wepFinSpd = 20;
            system.weaponName = game.i18n.localize('abfalter.basicInfo.unarmed');
        } else {
            system.wepFinSpd = system.weaponSpeed;
        }
        system.iniFinal = Math.floor(system.iniBase + system.inibonus + system.initiative.spec + system.initiative.bonus + system.KiBonusSpd + ~~system.wepFinSpd - system.totalNatPen);

        /*
            Secondaries
        */
        // Acrobatics system.totalNatPen
        system.acrobaticsbonus = acro;
        system.acrobaticsnat = Math.floor(stats.Agility.mod + system.secondary.acrobatics.natural + Math.ceil(system.secondary.acrobatics.nat * stats.Agility.mod));
        if (system.acrobaticsnat < 100) {
            system.acrobaticsnatfinal = system.acrobaticsnat;
        } else {
            system.acrobaticsnatfinal = 100;
        }
        system.acrofinal = Math.floor(system.secondary.acrobatics.bonus + system.secondary.acrobatics.temp + system.secondary.acrobatics.spec + system.secondary.acrobatics.base + system.acrobaticsbonus + system.acrobaticsnatfinal + system.aamFinal - system.totalNatPen);

        // Athelticism
        system.athleticismbonus = athle;

        system.athleticismnat = Math.floor(stats.Agility.mod + system.secondary.athleticism.natural + Math.ceil(system.secondary.athleticism.nat * stats.Agility.mod));
        if (system.athleticismnat < 100) {
            system.athleticismnatfinal = system.athleticismnat;
        } else {
            system.athleticismnatfinal = 100;
        }
        system.athleticismfinal = Math.floor(system.secondary.athleticism.bonus + system.secondary.athleticism.temp + system.secondary.athleticism.spec + system.secondary.athleticism.base + system.athleticismbonus + system.athleticismnatfinal + system.aamFinal - system.totalNatPen);

        // Climb
        system.climbbonus = climb;
        system.climbnat = Math.floor(stats.Agility.mod + system.secondary.climb.natural + Math.ceil(system.secondary.climb.nat * stats.Agility.mod));
        if (system.climbnat < 100) {
            system.climbnatfinal = system.climbnat;
        } else {
            system.climbnatfinal = 100;
        }
        system.climbfinal = Math.floor(system.secondary.climb.bonus + system.secondary.climb.temp + system.secondary.climb.spec + system.secondary.climb.base + system.climbbonus + system.climbnatfinal + system.aamFinal - system.totalNatPen);

        // Jump
        system.jumpbonus = jump;
        system.jumpnat = Math.floor(stats.Strength.mod + system.secondary.jump.natural + Math.ceil(system.secondary.jump.nat * stats.Strength.mod));
        if (system.jumpnat < 100) {
            system.jumpnatfinal = system.jumpnat;
        } else {
            system.jumpnatfinal = 100;
        }
        system.jumpfinal = Math.floor(system.secondary.jump.bonus + system.secondary.jump.temp + system.secondary.jump.spec + system.secondary.jump.base + system.jumpbonus + system.jumpnatfinal + system.aamFinal - system.totalNatPen);

        // Ride
        system.ridebonus = ride;
        system.ridenat = Math.floor(stats.Agility.mod + system.secondary.ride.natural + Math.ceil(system.secondary.ride.nat * stats.Agility.mod));
        if (system.ridenat < 100) {
            system.ridenatfinal = system.ridenat;
        } else {
            system.ridenatfinal = 100;
        }
        system.ridefinal = Math.floor(system.secondary.ride.bonus + system.secondary.ride.temp + system.secondary.ride.spec + system.secondary.ride.base + system.ridebonus + system.ridenatfinal + system.aamFinal - system.totalNatPen);

        // Swim
        system.swimbonus = swim;
        system.swimnat = Math.floor(stats.Agility.mod + system.secondary.swim.natural + Math.ceil(system.secondary.swim.nat * stats.Agility.mod));
        if (system.swimnat < 100) {
            system.swimnatfinal = system.swimnat;
        } else {
            system.swimnatfinal = 100;
        }
        system.swimfinal = Math.floor(system.secondary.swim.bonus + system.secondary.swim.temp + system.secondary.swim.spec + system.secondary.swim.base + system.swimbonus + system.swimnatfinal + system.aamFinal - system.totalNatPen);

        // etiquette
        system.etiquettebonus = etiq;
        system.etiquettenat = Math.floor(stats.Intelligence.mod + system.secondary.etiquette.natural + Math.ceil(system.secondary.etiquette.nat * stats.Intelligence.mod));
        if (system.etiquettenat < 100) {
            system.etiquettenatfinal = system.etiquettenat;
        } else {
            system.etiquettenatfinal = 100;
        }
        system.etiquettefinal = Math.floor(system.secondary.etiquette.bonus + system.secondary.etiquette.temp + system.secondary.etiquette.spec + system.secondary.etiquette.base + system.etiquettebonus + system.etiquettenatfinal + system.aamFinal);

        // Intimidate
        system.intimidatebonus = intim;
        system.intimidatenat = Math.floor(stats.Willpower.mod + system.secondary.intimidate.natural + Math.ceil(system.secondary.intimidate.nat * stats.Willpower.mod));
        if (system.intimidatenat < 100) {
            system.intimidatenatfinal = system.intimidatenat;
        } else {
            system.intimidatenatfinal = 100;
        }
        system.intimidatefinal = Math.floor(system.secondary.intimidate.bonus + system.secondary.intimidate.temp + system.secondary.intimidate.spec + system.secondary.intimidate.base + system.intimidatebonus + system.intimidatenatfinal + system.aamFinal);

        // Leadership
        system.leadershipbonus = leader;
        system.leadershipnat = Math.floor(stats.Power.mod + system.secondary.leadership.natural + Math.ceil(system.secondary.leadership.nat * stats.Power.mod));
        if (system.leadershipnat < 100) {
            system.leadershipnatfinal = system.leadershipnat;
        } else {
            system.leadershipnatfinal = 100;
        }
        system.leadershipfinal = Math.floor(system.secondary.leadership.bonus + system.secondary.leadership.temp + system.secondary.leadership.spec + system.secondary.leadership.base + system.leadershipbonus + system.leadershipnatfinal + system.aamFinal);

        // persuasion
        system.persuasionbonus = persua;
        system.persuasionnat = Math.floor(stats.Intelligence.mod + system.secondary.persuasion.natural + Math.ceil(system.secondary.persuasion.nat * stats.Intelligence.mod));
        if (system.persuasionnat < 100) {
            system.persuasionnatfinal = system.persuasionnat;
        } else {
            system.persuasionnatfinal = 100;
        }
        system.persuasionfinal = Math.floor(system.secondary.persuasion.bonus + system.secondary.persuasion.temp + system.secondary.persuasion.spec + system.secondary.persuasion.base + system.persuasionbonus + system.persuasionnatfinal + system.aamFinal);

        // streetwise
        system.streetwisebonus = street;
        system.streetwisenat = Math.floor(stats.Intelligence.mod + system.secondary.streetwise.natural + Math.ceil(system.secondary.streetwise.nat * stats.Intelligence.mod));
        if (system.streetwisenat < 100) {
            system.streetwisenatfinal = system.streetwisenat;
        } else {
            system.streetwisenatfinal = 100;
        }
        system.streetwisefinal = Math.floor(system.secondary.streetwise.bonus + system.secondary.streetwise.temp + system.secondary.streetwise.spec + system.secondary.streetwise.base + system.streetwisebonus + system.streetwisenatfinal + system.aamFinal);

        // style
        system.stylebonus = style;
        system.stylenat = Math.floor(stats.Power.mod + system.secondary.style.natural + Math.ceil(system.secondary.style.nat * stats.Power.mod));
        if (system.stylenat < 100) {
            system.stylenatfinal = system.stylenat;
        } else {
            system.stylenatfinal = 100;
        }
        system.stylefinal = Math.floor(system.secondary.style.bonus + system.secondary.style.temp + system.secondary.style.spec + system.secondary.style.base + system.stylebonus + system.stylenatfinal + system.aamFinal);

        // trading
        system.tradingbonus = trading;
        system.tradingnat = Math.floor(stats.Intelligence.mod + system.secondary.trading.natural + Math.ceil(system.secondary.trading.nat * stats.Intelligence.mod));
        if (system.tradingnat < 100) {
            system.tradingnatfinal = system.tradingnat;
        } else {
            system.tradingnatfinal = 100;
        }
        system.tradingfinal = Math.floor(system.secondary.trading.bonus + system.secondary.trading.temp + system.secondary.trading.spec + system.secondary.trading.base + system.tradingbonus + system.tradingnatfinal + system.aamFinal);

        // notice
        system.noticebonus = notice;
        system.noticenat = Math.floor(stats.Perception.mod + system.secondary.notice.natural + Math.ceil(system.secondary.notice.nat * stats.Perception.mod));
        if (system.noticenat < 100) {
            system.noticenatfinal = system.noticenat;
        } else {
            system.noticenatfinal = 100;
        }
        system.noticefinal = Math.floor(system.secondary.notice.bonus + system.secondary.notice.temp + system.secondary.notice.spec + system.secondary.notice.base + system.noticebonus + system.noticenatfinal + system.aamFinal);

        // search
        system.searchbonus = search;
        system.searchnat = Math.floor(stats.Perception.mod + system.secondary.search.natural + Math.ceil(system.secondary.search.nat * stats.Perception.mod));
        if (system.searchnat < 100) {
            system.searchnatfinal = system.searchnat;
        } else {
            system.searchnatfinal = 100;
        }
        system.searchfinal = Math.floor(system.secondary.search.bonus + system.secondary.search.temp + system.secondary.search.spec + system.secondary.search.base + system.searchbonus + system.searchnatfinal + system.aamFinal);

        // track
        system.trackbonus = track;
        system.tracknat = Math.floor(stats.Perception.mod + system.secondary.track.natural + Math.ceil(system.secondary.track.nat * stats.Perception.mod));
        if (system.tracknat < 100) {
            system.tracknatfinal = system.tracknat;
        } else {
            system.tracknatfinal = 100;
        }
        system.trackfinal = Math.floor(system.secondary.track.bonus + system.secondary.track.temp + system.secondary.track.spec + system.secondary.track.base + system.trackbonus + system.tracknatfinal + system.aamFinal);

        // animals
        system.animalsbonus = animals;
        system.animalsnat = Math.floor(stats.Intelligence.mod + system.secondary.animals.natural + Math.ceil(system.secondary.animals.nat * stats.Intelligence.mod));
        if (system.animalsnat < 100) {
            system.animalsnatfinal = system.animalsnat;
        } else {
            system.animalsnatfinal = 100;
        }
        system.animalsfinal = Math.floor(system.secondary.animals.bonus + system.secondary.animals.temp + system.secondary.animals.spec + system.secondary.animals.base + system.animalsbonus + system.animalsnatfinal + system.aamFinal);

        // appraisal
        system.appraisalbonus = appra;
        system.appraisalnat = Math.floor(stats.Intelligence.mod + system.secondary.appraisal.natural + Math.ceil(system.secondary.appraisal.nat * stats.Intelligence.mod));
        if (system.appraisalnat < 100) {
            system.appraisalnatfinal = system.appraisalnat;
        } else {
            system.appraisalnatfinal = 100;
        }
        system.appraisalfinal = Math.floor(system.secondary.appraisal.bonus + system.secondary.appraisal.temp + system.secondary.appraisal.spec + system.secondary.appraisal.base + system.appraisalbonus + system.appraisalnatfinal + system.aamFinal);

        // architecture
        system.architecturebonus = archi;
        system.architecturenat = Math.floor(stats.Intelligence.mod + system.secondary.architecture.natural + Math.ceil(system.secondary.architecture.nat * stats.Intelligence.mod));
        if (system.architecturenat < 100) {
            system.architecturenatfinal = system.architecturenat;
        } else {
            system.architecturenatfinal = 100;
        }
        system.architecturefinal = Math.floor(system.secondary.architecture.bonus + system.secondary.architecture.temp + system.secondary.architecture.spec + system.secondary.architecture.base + system.architecturebonus + system.architecturenatfinal + system.aamFinal);

        // herballore
        system.herballorebonus = herb;
        system.herballorenat = Math.floor(stats.Intelligence.mod + system.secondary.herballore.natural + Math.ceil(system.secondary.herballore.nat * stats.Intelligence.mod));
        if (system.herballorenat < 100) {
            system.herballorenatfinal = system.herballorenat;
        } else {
            system.herballorenatfinal = 100;
        }
        system.herballorefinal = Math.floor(system.secondary.herballore.bonus + system.secondary.herballore.temp + system.secondary.herballore.spec + system.secondary.herballore.base + system.herballorebonus + system.herballorenatfinal + system.aamFinal);

        // history
        system.historybonus = hist;
        system.historynat = Math.floor(stats.Intelligence.mod + system.secondary.history.natural + Math.ceil(system.secondary.history.nat * stats.Intelligence.mod));
        if (system.historynat < 100) {
            system.historynatfinal = system.historynat;
        } else {
            system.historynatfinal = 100;
        }
        system.historyfinal = Math.floor(system.secondary.history.bonus + system.secondary.history.temp + system.secondary.history.spec + system.secondary.history.base + system.historybonus + system.historynatfinal + system.aamFinal);

        // law
        system.lawbonus = law;
        system.lawnat = Math.floor(stats.Intelligence.mod + system.secondary.law.natural + Math.ceil(system.secondary.law.nat * stats.Intelligence.mod));
        if (system.lawnat < 100) {
            system.lawnatfinal = system.lawnat;
        } else {
            system.lawnatfinal = 100;
        }
        system.lawfinal = Math.floor(system.secondary.law.bonus + system.secondary.law.temp + system.secondary.law.spec + system.secondary.law.base + system.lawbonus + system.lawnatfinal + system.aamFinal);

        // magicappr
        system.magicapprbonus = magicapr;
        system.magicapprnat = Math.floor(stats.Power.mod + system.secondary.magicappr.natural + Math.ceil(system.secondary.magicappr.nat * stats.Power.mod));
        if (system.magicapprnat < 100) {
            system.magicapprnatfinal = system.magicapprnat;
        } else {
            system.magicapprnatfinal = 100;
        }
        system.magicapprfinal = Math.floor(system.secondary.magicappr.bonus + system.secondary.magicappr.temp + system.secondary.magicappr.spec + system.secondary.magicappr.base + system.magicapprbonus + system.magicapprnatfinal + system.aamFinal);

        // medicine
        system.medicinebonus = medic;
        system.medicinenat = Math.floor(stats.Intelligence.mod + system.secondary.medicine.natural + Math.ceil(system.secondary.medicine.nat * stats.Intelligence.mod));
        if (system.medicinenat < 100) {
            system.medicinenatfinal = system.medicinenat;
        } else {
            system.medicinenatfinal = 100;
        }
        system.medicinefinal = Math.floor(system.secondary.medicine.bonus + system.secondary.medicine.temp + system.secondary.medicine.spec + system.secondary.medicine.base + system.medicinebonus + system.medicinenatfinal + system.aamFinal);

        // memorize
        system.memorizebonus = mem;
        system.memorizenat = Math.floor(stats.Intelligence.mod + system.secondary.memorize.natural + Math.ceil(system.secondary.memorize.nat * stats.Intelligence.mod));
        if (system.memorizenat < 100) {
            system.memorizenatfinal = system.memorizenat;
        } else {
            system.memorizenatfinal = 100;
        }
        system.memorizefinal = Math.floor(system.secondary.memorize.bonus + system.secondary.memorize.temp + system.secondary.memorize.spec + system.secondary.memorize.base + system.memorizebonus + system.memorizenatfinal + system.aamFinal);

        // navigation
        system.navigationbonus = navi;
        system.navigationnat = Math.floor(stats.Intelligence.mod + system.secondary.navigation.natural + Math.ceil(system.secondary.navigation.nat * stats.Intelligence.mod));
        if (system.navigationnat < 100) {
            system.navigationnatfinal = system.navigationnat;
        } else {
            system.navigationnatfinal = 100;
        }
        system.navigationfinal = Math.floor(system.secondary.navigation.bonus + system.secondary.navigation.temp + system.secondary.navigation.spec + system.secondary.navigation.base + system.navigationbonus + system.navigationnatfinal + system.aamFinal);

        // occult
        system.occultbonus = occ;
        system.occultnat = Math.floor(stats.Intelligence.mod + system.secondary.occult.natural + Math.ceil(system.secondary.occult.nat * stats.Intelligence.mod));
        if (system.occultnat < 100) {
            system.occultnatfinal = system.occultnat;
        } else {
            system.occultnatfinal = 100;
        }
        system.occultfinal = Math.floor(system.secondary.occult.bonus + system.secondary.occult.temp + system.secondary.occult.spec + system.secondary.occult.base + system.occultbonus + system.occultnatfinal + system.aamFinal);

        // science
        system.sciencebonus = science;
        system.sciencenat = Math.floor(stats.Intelligence.mod + system.secondary.science.natural + Math.ceil(system.secondary.science.nat * stats.Intelligence.mod));
        if (system.sciencenat < 100) {
            system.sciencenatfinal = system.sciencenat;
        } else {
            system.sciencenatfinal = 100;
        }
        system.sciencefinal = Math.floor(system.secondary.science.bonus + system.secondary.science.temp + system.secondary.science.spec + system.secondary.science.base + system.sciencebonus + system.sciencenatfinal + system.aamFinal);

        // tactics
        system.tacticsbonus = tactic;
        system.tacticsnat = Math.floor(stats.Intelligence.mod + system.secondary.tactics.natural + Math.ceil(system.secondary.tactics.nat * stats.Intelligence.mod));
        if (system.tacticsnat < 100) {
            system.tacticsnatfinal = system.tacticsnat;
        } else {
            system.tacticsnatfinal = 100;
        }
        system.tacticsfinal = Math.floor(system.secondary.tactics.bonus + system.secondary.tactics.temp + system.secondary.tactics.spec + system.secondary.tactics.base + system.tacticsbonus + system.tacticsnatfinal + system.aamFinal);

        // composure
        system.composurebonus = comp;
        system.composurenat = Math.floor(stats.Willpower.mod + system.secondary.composure.natural + Math.ceil(system.secondary.composure.nat * stats.Willpower.mod));
        if (system.composurenat < 100) {
            system.composurenatfinal = system.composurenat;
        } else {
            system.composurenatfinal = 100;
        }
        system.composurefinal = Math.floor(system.secondary.composure.bonus + system.secondary.composure.temp + system.secondary.composure.spec + system.secondary.composure.base + system.composurebonus + system.composurenatfinal + system.aamFinal);

        // featsofstr
        system.featsofstrbonus = fos;
        system.featsofstrnat = Math.floor(stats.Strength.mod + system.secondary.featsofstr.natural + Math.ceil(system.secondary.featsofstr.nat * stats.Strength.mod));
        if (system.featsofstrnat < 100) {
            system.featsofstrnatfinal = system.featsofstrnat;
        } else {
            system.featsofstrnatfinal = 100;
        }
        system.featsofstrfinal = Math.floor(system.secondary.featsofstr.bonus + system.secondary.featsofstr.temp + system.secondary.featsofstr.spec + system.secondary.featsofstr.base + system.featsofstrbonus + system.featsofstrnatfinal + system.aamFinal - system.totalNatPen);

        // withstpain
        system.withstpainbonus = wstp;
        system.withstpainnat = Math.floor(stats.Willpower.mod + system.secondary.withstpain.natural + Math.ceil(system.secondary.withstpain.nat * stats.Willpower.mod));
        if (system.withstpainnat < 100) {
            system.withstpainnatfinal = system.withstpainnat;
        } else {
            system.withstpainnatfinal = 100;
        }
        system.withstpainfinal = Math.floor(system.secondary.withstpain.bonus + system.secondary.withstpain.temp + system.secondary.withstpain.spec + system.secondary.withstpain.base + system.withstpainbonus + system.withstpainnatfinal + system.aamFinal);

        // disguise
        system.disguisebonus = disg;
        system.disguisenat = Math.floor(stats.Dexterity.mod + system.secondary.disguise.natural + Math.ceil(system.secondary.disguise.nat * stats.Dexterity.mod));
        if (system.disguisenat < 100) {
            system.disguisenatfinal = system.disguisenat;
        } else {
            system.disguisenatfinal = 100;
        }
        system.disguisefinal = Math.floor(system.secondary.disguise.bonus + system.secondary.disguise.temp + system.secondary.disguise.spec + system.secondary.disguise.base + system.disguisebonus + system.disguisenatfinal + system.aamFinal);

        // hide
        system.hidebonus = hide;
        system.hidenat = Math.floor(stats.Perception.mod + system.secondary.hide.natural + Math.ceil(system.secondary.hide.nat * stats.Perception.mod));
        if (system.hidenat < 100) {
            system.hidenatfinal = system.hidenat;
        } else {
            system.hidenatfinal = 100;
        }
        system.hidefinal = Math.floor(system.secondary.hide.bonus + system.secondary.hide.temp + system.secondary.hide.spec + system.secondary.hide.base + system.hidebonus + system.hidenatfinal + system.aamFinal - system.totalNatPen);

        // lockpicking
        system.lockpickingbonus = lock;
        system.lockpickingnat = Math.floor(stats.Dexterity.mod + system.secondary.lockpicking.natural + Math.ceil(system.secondary.lockpicking.nat * stats.Dexterity.mod));
        if (system.lockpickingnat < 100) {
            system.lockpickingnatfinal = system.lockpickingnat;
        } else {
            system.lockpickingnatfinal = 100;
        }
        system.lockpickingfinal = Math.floor(system.secondary.lockpicking.bonus + system.secondary.lockpicking.temp + system.secondary.lockpicking.spec + system.secondary.lockpicking.base + system.lockpickingbonus + system.lockpickingnatfinal + system.aamFinal);

        // poisons
        system.poisonsbonus = poisn;
        system.poisonsnat = Math.floor(stats.Intelligence.mod + system.secondary.poisons.natural + Math.ceil(system.secondary.poisons.nat * stats.Intelligence.mod));
        if (system.poisonsnat < 100) {
            system.poisonsnatfinal = system.poisonsnat;
        } else {
            system.poisonsnatfinal = 100;
        }
        system.poisonsfinal = Math.floor(system.secondary.poisons.bonus + system.secondary.poisons.temp + system.secondary.poisons.spec + system.secondary.poisons.base + system.poisonsbonus + system.poisonsnatfinal + system.aamFinal);

        // stealth
        system.stealthbonus = stealth;
        system.stealthnat = Math.floor(stats.Agility.mod + system.secondary.stealth.natural + Math.ceil(system.secondary.stealth.nat * stats.Agility.mod));
        if (system.stealthnat < 100) {
            system.stealthnatfinal = system.stealthnat;
        } else {
            system.stealthnatfinal = 100;
        }
        system.stealthfinal = Math.floor(system.secondary.stealth.bonus + system.secondary.stealth.temp + system.secondary.stealth.spec + system.secondary.stealth.base + system.stealthbonus + system.stealthnatfinal + system.aamFinal - system.totalNatPen);

        // theft
        system.theftbonus = theft;
        system.theftnat = Math.floor(stats.Dexterity.mod + system.secondary.theft.natural + Math.ceil(system.secondary.theft.nat * stats.Dexterity.mod));
        if (system.theftnat < 100) {
            system.theftnatfinal = system.theftnat;
        } else {
            system.theftnatfinal = 100;
        }
        system.theftfinal = Math.floor(system.secondary.theft.bonus + system.secondary.theft.temp + system.secondary.theft.spec + system.secondary.theft.base + system.theftbonus + system.theftnatfinal + system.aamFinal);

        // traplore
        system.traplorebonus = trapl;
        system.traplorenat = Math.floor(stats.Dexterity.mod + system.secondary.traplore.natural + Math.ceil(system.secondary.traplore.nat * stats.Dexterity.mod));
        if (system.traplorenat < 100) {
            system.traplorenatfinal = system.traplorenat;
        } else {
            system.traplorenatfinal = 100;
        }
        system.traplorefinal = Math.floor(system.secondary.traplore.bonus + system.secondary.traplore.temp + system.secondary.traplore.spec + system.secondary.traplore.base + system.traplorebonus + system.traplorenatfinal + system.aamFinal);

        // alchemy
        system.alchemybonus = alche;
        system.alchemynat = Math.floor(stats.Intelligence.mod + system.secondary.alchemy.natural + Math.ceil(system.secondary.alchemy.nat * stats.Intelligence.mod));
        if (system.alchemynat < 100) {
            system.alchemynatfinal = system.alchemynat;
        } else {
            system.alchemynatfinal = 100;
        }
        system.alchemyfinal = Math.floor(system.secondary.alchemy.bonus + system.secondary.alchemy.temp + system.secondary.alchemy.spec + system.secondary.alchemy.base + system.alchemybonus + system.alchemynatfinal + system.aamFinal);

        // animism
        system.animismbonus = anims;
        system.animismnat = Math.floor(stats.Power.mod + system.secondary.animism.natural + Math.ceil(system.secondary.animism.nat * stats.Power.mod));
        if (system.animismnat < 100) {
            system.animismnatfinal = system.animismnat;
        } else {
            system.animismnatfinal = 100;
        }
        system.animismfinal = Math.floor(system.secondary.animism.bonus + system.secondary.animism.temp + system.secondary.animism.spec + system.secondary.animism.base + system.animismbonus + system.animismnatfinal + system.aamFinal);

        // art
        system.artbonus = art;
        system.artnat = Math.floor(stats.Power.mod + system.secondary.art.natural + Math.ceil(system.secondary.art.nat * stats.Power.mod));
        if (system.artnat < 100) {
            system.artnatfinal = system.artnat;
        } else {
            system.artnatfinal = 100;
        }
        system.artfinal = Math.floor(system.secondary.art.bonus + system.secondary.art.temp + system.secondary.art.spec + system.secondary.art.base + system.artbonus + system.artnatfinal + system.aamFinal);

        // dance
        system.dancebonus = dance;
        system.dancenat = Math.floor(stats.Agility.mod + system.secondary.dance.natural + Math.ceil(system.secondary.dance.nat * stats.Agility.mod));
        if (system.dancenat < 100) {
            system.dancenatfinal = system.dancenat;
        } else {
            system.dancenatfinal = 100;
        }
        system.dancefinal = Math.floor(system.secondary.dance.bonus + system.secondary.dance.temp + system.secondary.dance.spec + system.secondary.dance.base + system.dancebonus + system.dancenatfinal + system.aamFinal - system.totalNatPen);

        // forging
        system.forgingbonus = forgi;
        system.forgingnat = Math.floor(stats.Dexterity.mod + system.secondary.forging.natural + Math.ceil(system.secondary.forging.nat * stats.Dexterity.mod));
        if (system.forgingnat < 100) {
            system.forgingnatfinal = system.forgingnat;
        } else {
            system.forgingnatfinal = 100;
        }
        system.forgingfinal = Math.floor(system.secondary.forging.bonus + system.secondary.forging.temp + system.secondary.forging.spec + system.secondary.forging.base + system.forgingbonus + system.forgingnatfinal + system.aamFinal);

        // jewelry
        system.jewelrybonus = jewel;
        system.jewelrynat = Math.floor(stats.Dexterity.mod + system.secondary.jewelry.natural + Math.ceil(system.secondary.jewelry.nat * stats.Dexterity.mod));
        if (system.jewelrynat < 100) {
            system.jewelrynatfinal = system.jewelrynat;
        } else {
            system.jewelrynatfinal = 100;
        }
        system.jewelryfinal = Math.floor(system.secondary.jewelry.bonus + system.secondary.jewelry.temp + system.secondary.jewelry.spec + system.secondary.jewelry.base + system.jewelrybonus + system.jewelrynatfinal + system.aamFinal);

        // music
        system.musicbonus = music;
        system.musicnat = Math.floor(stats.Power.mod + system.secondary.music.natural + Math.ceil(system.secondary.music.nat * stats.Power.mod));
        if (system.musicnat < 100) {
            system.musicnatfinal = system.musicnat;
        } else {
            system.musicnatfinal = 100;
        }
        system.musicfinal = Math.floor(system.secondary.music.bonus + system.secondary.music.temp + system.secondary.music.spec + system.secondary.music.base + system.musicbonus + system.musicnatfinal + system.aamFinal);

        // runes
        system.runesbonus = runes;
        system.runesnat = Math.floor(stats.Dexterity.mod + system.secondary.runes.natural + Math.ceil(system.secondary.runes.nat * stats.Dexterity.mod));
        if (system.runesnat < 100) {
            system.runesnatfinal = system.runesnat;
        } else {
            system.runesnatfinal = 100;
        }
        system.runesfinal = Math.floor(system.secondary.runes.bonus + system.secondary.runes.temp + system.secondary.runes.spec + system.secondary.runes.base + system.runesbonus + system.runesnatfinal + system.aamFinal);

        // ritualcalig
        system.ritualcaligbonus = ritcal;
        system.ritualcalignat = Math.floor(stats.Dexterity.mod + system.secondary.ritualcalig.natural + Math.ceil(system.secondary.ritualcalig.nat * stats.Dexterity.mod));
        if (system.ritualcalignat < 100) {
            system.ritualcalignatfinal = system.ritualcalignat;
        } else {
            system.ritualcalignatfinal = 100;
        }
        system.ritualcaligfinal = Math.floor(system.secondary.ritualcalig.bonus + system.secondary.ritualcalig.temp + system.secondary.ritualcalig.spec + system.secondary.ritualcalig.base + system.ritualcaligbonus + system.ritualcalignatfinal + system.aamFinal);

        // slofhand
        system.slofhandbonus = soh;
        system.slofhandnat = Math.floor(stats.Dexterity.mod + system.secondary.slofhand.natural + Math.ceil(system.secondary.slofhand.nat * stats.Dexterity.mod));
        if (system.slofhandnat < 100) {
            system.slofhandnatfinal = system.slofhandnat;
        } else {
            system.slofhandnatfinal = 100;
        }
        system.slofhandfinal = Math.floor(system.secondary.slofhand.bonus + system.secondary.slofhand.temp + system.secondary.slofhand.spec + system.secondary.slofhand.base + system.slofhandbonus + system.slofhandnatfinal + system.aamFinal);

        // tailoring
        system.tailoringbonus = tailoring;
        system.tailoringnat = Math.floor(stats.Dexterity.mod + system.secondary.tailoring.natural + Math.ceil(system.secondary.tailoring.nat * stats.Dexterity.mod));
        if (system.tailoringnat < 100) {
            system.tailoringnatfinal = system.tailoringnat;
        } else {
            system.tailoringnatfinal = 100;
        }
        system.tailoringfinal = Math.floor(system.secondary.tailoring.bonus + system.secondary.tailoring.temp + system.secondary.tailoring.spec + system.secondary.tailoring.base + system.tailoringbonus + system.tailoringnatfinal + system.aamFinal);

        // piloting
        system.pilotingbonus = pilot;
        system.pilotingnat = Math.floor(stats.Dexterity.mod + system.secondary.piloting.natural + Math.ceil(system.secondary.piloting.nat * stats.Dexterity.mod));
        if (system.pilotingnat < 100) {
            system.pilotingnatfinal = system.pilotingnat;
        } else {
            system.pilotingnatfinal = 100;
        }
        system.pilotingfinal = Math.floor(system.secondary.piloting.bonus + system.secondary.piloting.temp + system.secondary.piloting.spec + system.secondary.piloting.base + system.pilotingbonus + system.pilotingnatfinal + system.aamFinal);

        // cooking
        system.cookingbonus = cook;
        system.cookingnat = Math.floor(stats.Power.mod + system.secondary.cooking.natural + Math.ceil(system.secondary.cooking.nat * stats.Power.mod));
        if (system.cookingnat < 100) {
            system.cookingnatfinal = system.cookingnat;
        } else {
            system.cookingnatfinal = 100;
        }
        system.cookingfinal = Math.floor(system.secondary.cooking.bonus + system.secondary.cooking.temp + system.secondary.cooking.spec + system.secondary.cooking.base + system.cookingbonus + system.cookingnatfinal + system.aamFinal);

        // technomagic
        system.technomagicbonus = techmagic;
        system.technomagicnat = Math.floor(stats.Intelligence.mod + system.secondary.technomagic.natural + Math.ceil(system.secondary.technomagic.nat * stats.Intelligence.mod));
        if (system.technomagicnat < 100) {
            system.technomagicnatfinal = system.technomagicnat;
        } else {
            system.technomagicnatfinal = 100;
        }
        system.technomagicfinal = Math.floor(system.secondary.technomagic.bonus + system.secondary.technomagic.temp + system.secondary.technomagic.spec + system.secondary.technomagic.base + system.technomagicbonus + system.technomagicnatfinal + system.aamFinal);

        //toymaking
        system.toymakingbonus = toy;
        system.toymakingnat = Math.floor(stats.Power.mod + system.secondary.toymaking.natural + Math.ceil(system.secondary.toymaking.nat * stats.Power.mod));
        if (system.toymakingnat < 100) {
            system.toymakingnatfinal = system.toymakingnat;
        } else {
            system.toymakingnatfinal = 100;
        }
        system.toymakingfinal = Math.floor(system.secondary.toymaking.bonus + system.secondary.toymaking.temp + system.secondary.toymaking.spec + system.secondary.toymaking.base + system.toymakingbonus + system.toymakingnatfinal + system.aamFinal);


        //kidetection system.kidetectionbase
        system.noticeDection = Math.floor(system.secondary.notice.temp + system.secondary.notice.spec + system.secondary.notice.base + system.noticebonus + system.noticenatfinal);
        system.kidetectionbase = Math.floor((system.noticeDection + system.mkFinal) / 2);
        system.kidetectionbonus = kiDect;
        system.kidetectionnat = Math.floor(stats.Perception.mod + system.secondary.kidetection.natural + Math.ceil(system.secondary.kidetection.nat * stats.Perception.mod));
        if (system.kidetectionnat < 100) {
            system.kidetectionnatfinal = system.kidetectionnat;
        } else {
            system.kidetectionnatfinal = 100;
        }
        system.kidetectionfinal = Math.floor(system.secondary.kidetection.bonus + system.secondary.kidetection.temp + system.secondary.kidetection.spec + system.kidetectionbase + system.kidetectionbonus + system.kidetectionnatfinal + system.aamFinal);


        //kicoceal
        system.hideConceal = Math.floor(system.secondary.hide.temp + system.secondary.hide.spec + system.secondary.hide.base + system.hidebonus + system.hidenatfinal - system.totalNatPen);
        system.kiconcealbase = Math.floor((system.hideConceal + system.mkFinal) / 2);
        system.kiconcealbonus = kiCon;
        system.kiconcealnat = Math.floor(stats.Perception.mod + system.secondary.kiconceal.natural + Math.ceil(system.secondary.kiconceal.nat * stats.Perception.mod));
        if (system.kiconcealnat < 100) {
            system.kiconcealnatfinal = system.kiconcealnat;
        } else {
            system.kiconcealnatfinal = 100;
        }
        system.kiconcealfinal = Math.floor(system.secondary.kiconceal.bonus + system.secondary.kiconceal.temp + system.secondary.kiconceal.spec + system.kiconcealbase + system.kiconcealbonus + system.kiconcealnatfinal + system.aamFinal);
        /*
         * // z
        system.znat = Math.floor(stats.x.mod + system.secondary.z.natural + Math.ceil(system.secondary.z.nat * stats.x.mod));
        if (system.znat < 100) {
            system.znatfinal = system.znat;
        } else {
            system.znatfinal = 100;
        }
        system.zfinal = Math.floor(system.secondary.z.temp + system.secondary.z.spec + system.secondary.z.base + system.zbonus + system.znatfinal + system.aamFinal);
         */

        // Magic Accumulation & Zeon
        system.turnMaintRemove = turnMaint;
        system.dayMaintRemove = dayMaint;
        system.zeonbonus = zeon;
        switch (system.stats.Power.final) {
            case 1:
                system.maccupow = 0;
                system.zeonpow = 5;
                break;
            case 2:
                system.maccupow = 0;
                system.zeonpow = 20;
                break;
            case 3:
                system.maccupow = 0;
                system.zeonpow = 40;
                break;
            case 4:
                system.maccupow = 0;
                system.zeonpow = 55;
                break;
            case 5:
                system.maccupow = 5;
                system.zeonpow = 70;
                break;
            case 6:
                system.maccupow = 5;
                system.zeonpow = 85;
                break;
            case 7:
                system.maccupow = 5;
                system.zeonpow = 95;
                break;
            case 8:
                system.maccupow = 10;
                system.zeonpow = 110;
                break;
            case 9:
                system.maccupow = 10;
                system.zeonpow = 120;
                break;
            case 10:
                system.maccupow = 10;
                system.zeonpow = 135;
                break;
            case 11:
                system.maccupow = 10;
                system.zeonpow = 150;
                break;
            case 12:
                system.maccupow = 15;
                system.zeonpow = 160;
                break;
            case 13:
                system.maccupow = 15;
                system.zeonpow = 175;
                break;
            case 14:
                system.maccupow = 15;
                system.zeonpow = 185;
                break;
            case 15:
                system.maccupow = 20;
                system.zeonpow = 200;
                break;
            case 16:
                system.maccupow = 25;
                system.zeonpow = 215;
                break;
            case 17:
                system.maccupow = 25;
                system.zeonpow = 225;
                break;
            case 18:
                system.maccupow = 30;
                system.zeonpow = 240;
                break;
            case 19:
                system.maccupow = 30;
                system.zeonpow = 250;
                break;
            case 20:
                system.maccupow = 35;
                system.zeonpow = 260;
                break;
            default:
                system.zeonpow = 0;
                break;
        }
        if (system.stats.Power.final > 20) {
            system.maccupow = 35;
            system.zeonpow = 260;
        }
        system.maccufinal = Math.floor(system.maccu.base + system.maccupow + (system.maccu.mult * system.maccupow) + system.maccu.spec + system.maccu.bonus + system.maccu.temp);
        system.maccuhalffinal = Math.floor(system.maccufinal / 2);
        system.mregenfinal = Math.floor(((system.maccupow * system.mregen.regenmult) + system.mregen.spec + system.mregen.temp + system.mregen.bonus + system.maccufinal) * system.mregen.recoverymult);
        system.zeon.max = Math.floor(system.zeon.base + system.zeonpow + system.zeonbonus + system.zeon.spec + system.zeon.temp + system.zeon.bonus);

        // Innate Magic
        if (system.maccufinal >= 10 && system.maccufinal <= 50) {
            system.minnatefinal = Math.floor(system.zeon.minnate + 10);
        } else if (system.maccufinal > 50 && system.maccufinal <= 70) {
            system.minnatefinal = Math.floor(system.zeon.minnate + 20);
        } else if (system.maccufinal > 70 && system.maccufinal <= 90) {
            system.minnatefinal = Math.floor(system.zeon.minnate + 30);
        } else if (system.maccufinal > 90 && system.maccufinal <= 110) {
            system.minnatefinal = Math.floor(system.zeon.minnate + 40);
        } else if (system.maccufinal > 110 && system.maccufinal <= 130) {
            system.minnatefinal = Math.floor(system.zeon.minnate + 50);
        } else if (system.maccufinal > 130 && system.maccufinal <= 150) {
            system.minnatefinal = Math.floor(system.zeon.minnate + 60);
        } else if (system.maccufinal > 150 && system.maccufinal <= 180) {
            system.minnatefinal = Math.floor(system.zeon.minnate + 70);
        } else if (system.maccufinal > 180 && system.maccufinal <= 200) {
            system.minnatefinal = Math.floor(system.zeon.minnate + 80);
        } else if (system.maccufinal > 200) {
            system.minnatefinal = Math.floor(system.zeon.minnate + 90);
        } else {
            system.minnatefinal = system.zeon.minnate;
        }

        // Magic Levels
        switch (system.stats.Intelligence.final) {
            case 6:
                system.mlevelint = 10;
                break;
            case 7:
                system.mlevelint = 20;
                break;
            case 8:
                system.mlevelint = 30;
                break;
            case 9:
                system.mlevelint = 40;
                break;
            case 10:
                system.mlevelint = 50;
                break;
            case 11:
                system.mlevelint = 75;
                break;
            case 12:
                system.mlevelint = 100;
                break;
            case 13:
                system.mlevelint = 150;
                break;
            case 14:
                system.mlevelint = 200;
                break;
            case 15:
                system.mlevelint = 300;
                break;
            case 16:
                system.mlevelint = 400;
                break;
            case 17:
                system.mlevelint = 500;
                break;
            case 18:
                system.mlevelint = 600;
                break;
            case 19:
                system.mlevelint = 700;
                break;
            case 20:
                system.mlevelint = 800;
                break;
            default:
                system.mlevelint = 0;
                break;
        }
        if (system.stats.Intelligence.final > 20) {
            system.mlevelint = 800;
        }
        system.mlLevels = pathLvl;
        system.spellLevels = spellCost;
        system.mlevelfinal = Math.floor(system.mlevel.base + system.mlevel.spec + system.mlevel.temp + system.mlevel.bonus +system.mlevelint);
        system.mlevelused = Math.floor(system.mlLevels + system.spellLevels + system.metaCost);

        // Summoning Abilities
        system.summonbonus = summon;
        system.controlbonus = control;
        system.bindbonus = bind;
        system.banishbonus = banish;
        system.summonfinal = Math.floor(system.summoning.summon.base + system.summonbonus + system.summoning.summon.spec + system.summoning.summon.bonus + system.stats.Power.mod + Math.min(0, system.aamFinal));
        system.controlfinal = Math.floor(system.summoning.control.base + system.controlbonus + system.summoning.control.spec + system.summoning.control.bonus + system.stats.Willpower.mod + Math.min(0, system.aamFinal));
        system.bindfinal = Math.floor(system.summoning.bind.base + system.bindbonus + system.summoning.bind.spec + system.summoning.bind.bonus + system.stats.Power.mod + Math.min(0, system.aamFinal));
        system.banishfinal = Math.floor(system.summoning.banish.base + system.banishbonus + system.summoning.banish.spec + system.summoning.banish.bonus + system.stats.Power.mod + Math.min(0, system.aamFinal));

        //Unarmed
        switch (system.fistDamage.multOption) {
            case "agi":
                system.unarmedDmgMult1 = Math.floor(system.fistDamage.mult * system.stats.Agility.mod);
                break;
            case "con":
                system.unarmedDmgMult1 = Math.floor(system.fistDamage.mult * system.stats.Constitution.mod);
                break;
            case "str":
                system.unarmedDmgMult1 = Math.floor(system.fistDamage.mult * system.stats.Strength.mod);
                break;
            case "dex":
                system.unarmedDmgMult1 = Math.floor(system.fistDamage.mult * system.stats.Dexterity.mod);
                break;
            case "per":
                system.unarmedDmgMult1 = Math.floor(system.fistDamage.mult * system.stats.Perception.mod);
                break;
            case "int":
                system.unarmedDmgMult1 = Math.floor(system.fistDamage.mult * system.stats.Intelligence.mod);
                break;
            case "pow":
                system.unarmedDmgMult1 = Math.floor(system.fistDamage.mult * system.stats.Power.mod);
                break;
            case "wp":
                system.unarmedDmgMult1 = Math.floor(system.fistDamage.mult * system.stats.Willpower.mod);
                break;
            case "str2":
                system.unarmedDmgMult1 = Math.floor(system.fistDamage.mult * (system.stats.Strength.mod * 2));
                break;
            case "presence":
                system.unarmedDmgMult1 = Math.floor(system.fistDamage.mult * ((system.presence * 2) +  system.stats.Power.mod));
                break;
            default:
                system.unarmedDmgMult1 = 0;
                break;
        }
        switch (system.fistDamage.multOption2) {
            case "agi":
                system.unarmedDmgMult2 = Math.floor(system.fistDamage.mult2 * system.stats.Agility.mod);
                break;
            case "con":
                system.unarmedDmgMult2 = Math.floor(system.fistDamage.mult2 * system.stats.Constitution.mod);
                break;
            case "str":
                system.unarmedDmgMult2 = Math.floor(system.fistDamage.mult2 * system.stats.Strength.mod);
                break;
            case "dex":
                system.unarmedDmgMult2 = Math.floor(system.fistDamage.mult2 * system.stats.Dexterity.mod);
                break;
            case "per":
                system.unarmedDmgMult2 = Math.floor(system.fistDamage.mult2 * system.stats.Perception.mod);
                break;
            case "int":
                system.unarmedDmgMult2 = Math.floor(system.fistDamage.mult2 * system.stats.Intelligence.mod);
                break;
            case "pow":
                system.unarmedDmgMult2 = Math.floor(system.fistDamage.mult2 * system.stats.Power.mod);
                break;
            case "wp":
                system.unarmedDmgMult2 = Math.floor(system.fistDamage.mult2 * system.stats.Willpower.mod);
                break;
            case "str2":
                system.unarmedDmgMult2 = Math.floor(system.fistDamage.mult2 * (system.stats.Strength.mod * 2));
                break;
            case "presence":
                system.unarmedDmgMult2 = Math.floor(system.fistDamage.mult2 * ((system.presence * 2) + system.stats.Power.mod));
                break;
            default:
                system.unarmedDmgMult2 = 0;
                break;
        }
        system.unarmedDmgFinal = Math.floor(system.fistDamage.base + system.unarmedDmgMult1 + system.unarmedDmgMult2 + system.fistDamage.bonus);

        // Psychic Points
        system.ppbonus = pp;
        system.finalpp = Math.floor(system.ppoint.base + system.ppoint.spec + system.ppoint.bonus + system.ppbonus);
        system.innateSlotspp = Math.floor(system.other.innateSlots * 2);
        system.psychicPoint.max = Math.floor(system.finalpp - (+usedpp + system.ppotentialpp + +matrixpp + system.innateSlotspp));

        //Monster
        system.monsterPowerCost = monsterCost;
        system.monstTotDP = Math.floor(system.monsterCharCombCost + system.monsterPowerCost + system.monsterStats.hpDp);



        // Settings
        system.openRangeFinal = Math.floor(system.rollRange.base - system.rollRange.spec - system.rollRange.temp - system.rollRange.bonus);
        system.fumbleRangeFinal = Math.floor(system.fumleRange.base + system.fumleRange.spec + system.fumleRange.temp + system.fumleRange.bonus);


        // Reload Items to get Atk/Def
        this.items.reduce((arr, item) => {
            if (item.type === "weapon" || item.type === "secondary" ) {
                item.prepareData();
            }
        });
    }
}
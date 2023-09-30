export default class abfalterActor extends Actor {

    prepareData() {
        super.prepareData();
    }

    prepareBaseData() {
        const data = this.system;

        //All Action Mod
        data.aamFinal = data.aam + data.aamBoon + data.aamOther - data.aamCrit;
        //Main Characteristics
        for (let [key, stat] of Object.entries(data.stats)) {
            stat.final = Math.floor(~~stat.base + stat.spec + stat.temp);
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

            stat.opposedfinal = Math.floor((stat.final + stat.opposed) + ~~(data.aamFinal / 20));
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
        const actnumcalc = ~~data.stats.Agility.final + ~~data.stats.Dexterity.final;
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
                data.actionnumber = 1;
                break;
            case 11:
            case 12:
            case 13:
            case 14:
                data.actionnumber = 2;
                break;
            case 15:
            case 16:
            case 17:
            case 18:
            case 19:
                data.actionnumber = 3;
                break;
            case 20:
            case 21:
            case 22:
                data.actionnumber = 4;
                break;
            case 23:
            case 24:
            case 25:
                data.actionnumber = 5;
                break;
            case 26:
            case 27:
            case 28:
                data.actionnumber = 6;
                break;
            case 29:
            case 30:
            case 31:
                data.actionnumber = 8;
                break;
            default:
                data.actionnumber = 10;
                break;
        }

        //Lifepoint Calculation
        data.lpbase = Math.floor(25 + 10 * data.stats.Constitution.final + data.stats.Constitution.mod - Math.ceil((data.stats.Constitution.final - 1) / data.stats.Constitution.final) * 5);
        data.lp.max = Math.floor(data.lpbase + data.lifepoints.spec + data.lifepoints.temp + Math.ceil(data.lifepoints.multiple * data.stats.Constitution.final));

        //Fatigue Calculation
        data.fatiguebase = data.stats.Constitution.final;
        data.fatiguefinal = Math.floor(data.fatiguebase + data.fatigue.spec + data.fatigue.temp);

        //Regeneration Calculation
        switch (data.stats.Constitution.final) {
            case 1:
            case 2:
                data.regenbase = 0;
                break;
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                data.regenbase = 1;
                break;
            case 8:
            case 9:
                data.regenbase = 2;
                break;
            case 10:
                data.regenbase = 3;
                break;
            case 11:
                data.regenbase = 4;
                break;
            case 12:
                data.regenbase = 5;
                break;
            case 13:
                data.regenbase = 6;
                break;
            case 14:
                data.regenbase = 7;
                break;
            case 15:
                data.regenbase = 8;
                break;
            case 16:
                data.regenbase = 9;
                break;
            case 17:
                data.regenbase = 10;
                break;
            case 18:
                data.regenbase = 11;
                break;
            case 19:
            case 20:
                data.regenbase = 12;
                break;
            default:
                data.regenbase = 0;
                break;
        }
        if (data.stats.Constitution.final > 20) {
            data.regenbase = 12;
        }
        data.regenfinal = Math.min(Math.floor(data.regenbase + data.regeneration.spec + data.regeneration.temp), 20);
        switch (data.regenfinal) {
            case 1:
                data.resting = "10/day";
                data.notresting = "5/day";
                data.redpenalty = "-5/day";
                break;
            case 2:
                data.resting = "20/day";
                data.notresting = "10/day";
                data.redpenalty = "-5/day";
                break;
            case 3:
                data.resting = "30/day";
                data.notresting = "15/day";
                data.redpenalty = "-5/day";
                break;
            case 4:
                data.resting = "40/day";
                data.notresting = "20/day";
                data.redpenalty = "-10/day";
                break;
            case 5:
                data.resting = "50/day";
                data.notresting = "25/day";
                data.redpenalty = "-10/day";
                break;
            case 6:
                data.resting = "75/day";
                data.notresting = "30/day";
                data.redpenalty = "-15/day";
                break;
            case 7:
                data.resting = "100/day";
                data.notresting = "50/day";
                data.redpenalty = "-20/day";
                break;
            case 8:
                data.resting = "250/day";
                data.notresting = "100/day";
                data.redpenalty = "-25/day";
                break;
            case 9:
                data.resting = "500/day";
                data.notresting = "200/day";
                data.redpenalty = "-30/day";
                break;
            case 10:
                data.resting = "1/min";
                data.notresting = "N/A";
                data.redpenalty = "-40/day";
                break;
            case 11:
                data.resting = "2/min";
                data.notresting = "N/A";
                data.redpenalty = "-50/day";
                break;
            case 12:
                data.resting = "5/min";
                data.notresting = "N/A";
                data.redpenalty = "-5/hour";
                break;
            case 13:
                data.resting = "10/min";
                data.notresting = "N/A";
                data.redpenalty = "-10/hour";
                break;
            case 14:
                data.resting = "1/turn";
                data.notresting = "N/A";
                data.redpenalty = "-15/hour";
                break;
            case 15:
                data.resting = "5/turn";
                data.notresting = "N/A";
                data.redpenalty = "-20/hour";
                break;
            case 16:
                data.resting = "10/turn";
                data.notresting = "N/A";
                data.redpenalty = "-50/min";
                break;
            case 17:
                data.resting = "25/turn";
                data.notresting = "N/A";
                data.redpenalty = "-10/turn";
                break;
            case 18:
                data.resting = "50/turn";
                data.notresting = "N/A";
                data.redpenalty = "-25/turn";
                break;
            case 19:
                data.resting = "100/turn";
                data.notresting = "N/A";
                data.redpenalty = "All/turn";
                break;
            case 20:
                data.resting = "200/turn";
                data.notresting = "N/A";
                data.redpenalty = "All/turn";
                break;
            default:
                data.resting = "0";
                data.notresting = "0";
                data.redpenalty = "0";
                break;
        }

        //Initiative
        data.iniBase = Math.floor(data.stats.Dexterity.mod + data.stats.Agility.mod + 20); // Work here - initiative due to aam penalty
        if (data.aamFinal < 0) {
            data.iniBase = Math.floor(data.iniBase + ~~(data.aamFinal / 2));
        }


        //Ki Pool
        if (data.toggles.innatePower == false) {
            data.kiPoolAgiAccumTot = Math.max(0, Math.floor(data.stats.Agility.kiPoolAccuBase + data.kiPool.agi.spec + data.kiPool.agi.temp + Math.min(0, ~~(data.aamFinal / 20)))); // Math.ceil(data.aam / 20));
            data.kiPoolAgiTot = Math.floor(data.stats.Agility.kiPoolBase + data.kiPool.agi.specMax + data.kiPool.agi.tempMax);
            data.kiPoolConAccumTot = Math.max(0, Math.floor(data.stats.Constitution.kiPoolAccuBase + data.kiPool.con.spec + data.kiPool.con.temp + Math.min(0, ~~(data.aamFinal / 20))));
            data.kiPoolConTot = Math.floor(data.stats.Constitution.kiPoolBase + data.kiPool.con.specMax + data.kiPool.con.tempMax);
            data.kiPoolDexAccumTot = Math.max(0, Math.floor(data.stats.Dexterity.kiPoolAccuBase + data.kiPool.dex.spec + data.kiPool.dex.temp + Math.min(0, ~~(data.aamFinal / 20))));
            data.kiPoolDexTot = Math.floor(data.stats.Dexterity.kiPoolBase + data.kiPool.dex.specMax + data.kiPool.dex.tempMax);
            data.kiPoolStrAccumTot = Math.max(0, Math.floor(data.stats.Strength.kiPoolAccuBase + data.kiPool.str.spec + data.kiPool.str.temp + Math.min(0, ~~(data.aamFinal / 20))));
            data.kiPoolStrTot = Math.floor(data.stats.Strength.kiPoolBase + data.kiPool.str.specMax + data.kiPool.str.tempMax);
            data.kiPoolPowAccumTot = Math.max(0, Math.floor(data.stats.Power.kiPoolAccuBase + data.kiPool.pow.spec + data.kiPool.pow.temp + Math.min(0, ~~(data.aamFinal / 20))));
            data.kiPoolPowTot = Math.floor(data.stats.Power.kiPoolBase + data.kiPool.pow.specMax + data.kiPool.pow.tempMax);
            data.kiPoolWPAccumTot = Math.max(0, Math.floor(data.stats.Willpower.kiPoolAccuBase + data.kiPool.wp.spec + data.kiPool.wp.temp + Math.min(0, ~~(data.aamFinal / 20))));
            data.kiPoolWPTot = Math.floor(data.stats.Willpower.kiPoolBase + data.kiPool.wp.specMax + data.kiPool.wp.tempMax);
            if (data.toggles.unifiedPools == true) {
                data.unifiedTotal = Math.floor(data.kiPoolAgiTot + data.kiPoolConTot + data.kiPoolDexTot + data.kiPoolStrTot + data.kiPoolPowTot + data.kiPoolWPTot);
            }
        } else {
            data.stats.Power.kiPoolAccuBase = data.stats.Power.kiPoolAccuBase * 6;
            data.stats.Power.kiPoolBase = data.stats.Power.kiPoolBase * 6;
            data.kiPoolPowAccumTot = Math.max(0, Math.floor(data.stats.Power.kiPoolAccuBase + data.kiPool.pow.spec + data.kiPool.pow.temp + Math.min(0, ~~(data.aamFinal / 20))));
            data.kiPoolPowTot = Math.floor(data.stats.Power.kiPoolBase + data.kiPool.pow.specMax + data.kiPool.pow.tempMax);
        }

        //atk, blk, dodge
        data.atkfinal = Math.floor(data.combatstats.atkbase + data.combatstats.atkspecial + data.combatstats.atktemp + data.stats.Dexterity.mod + data.aamFinal);
        data.blkfinal = Math.floor(data.combatstats.blkbase + data.combatstats.blkspecial + data.combatstats.blktemp + data.stats.Dexterity.mod + data.aamFinal);
        data.dodfinal = Math.floor(data.combatstats.dodbase + data.combatstats.dodspecial + data.combatstats.dodtemp + data.stats.Agility.mod + data.aamFinal);

        //Magic Projection
        data.mprojfinal = Math.floor(data.mproj.base + data.mproj.spec + data.mproj.temp + data.stats.Dexterity.mod + data.aamFinal);
        data.mprojfinaloff = Math.floor(data.mprojfinal + data.mproj.imbalance);
        data.mprojfinaldef = Math.floor(data.mprojfinal - data.mproj.imbalance);

        // Psychic Potential
        if (data.stats.Willpower.final < 5) {
            data.fromWP = 0;
        } else if (data.stats.Willpower.final >= 5 && data.stats.Willpower.final < 15) {
            data.fromWP = Math.floor((data.stats.Willpower.final - 4) * 10);
        } else if (data.stats.Willpower.final >= 15) {
            data.fromWP = Math.floor(((data.stats.Willpower.final - 14) * 20) + 100)
        }
        data.finalPotential = Math.floor(data.ppotential.base + data.fromWP + +data.ppotential.spent + data.ppotential.spec + data.ppotential.temp);
        switch (data.ppotential.spent) {
            case "10":
                data.ppotentialpp = 1;
                break;
            case "20":
                data.ppotentialpp = 3;
                break;
            case "30":
                data.ppotentialpp = 6;
                break;
            case "40":
                data.ppotentialpp = 10;
                break;
            case "50":
                data.ppotentialpp = 15;
                break;
            case "60":
                data.ppotentialpp = 21;
                break;
            case "70":
                data.ppotentialpp = 28;
                break;
            case "80":
                data.ppotentialpp = 36;
                break;
            case "90":
                data.ppotentialpp = 45;
                break;
            case "100":
                data.ppotentialpp = 55;
                break;
            default:
                data.ppotentialpp = 0;
                break;
        }

        // Psychic Projection
        data.pprojfinal = Math.floor(data.pproj.base + data.pproj.spec + data.pproj.temp + data.stats.Dexterity.mod + data.aamFinal);

        // Wear Armor
        data.wearArmorFinal = Math.floor(data.wearArmor.base + data.wearArmor.spec + data.wearArmor.temp + data.stats.Strength.mod);
    }

    prepareEmbeddedDocuments() {
        super.prepareEmbeddedDocuments();
    }

    prepareDerivedData() {
        const data = this.system;
        const stats = data.stats;


        // Determine Item Values / Last used arr[121]  2                    *Look at js map
        const [level, lpbonus, ini, atk, dod, blk, weararm, mk, pp, zeon, summon, control, bind, banish, acro,
            athle, climb, jump, ride, swim, etiq, intim, leader, persua, street, style, trading, notice, search, track,
            animals, appra, archi, herb, hist, law, magicapr, medic, mem, navi, occ, science, tactic, comp, fos,
            wstp, disg, hide, lock, poisn, stealth, theft, trapl, alche, anims, art, dance, forgi, jewel, music,
            runes, ritcal, soh, tailoring, quantity, req, natPen, movePen, aCutMax, aCutTot, aImpMax, aImpTot, aThrMax, aThrTot, aHeatMax,
            aHeatTot, aColdMax, aColdTot, aEleMax, aEleTot, aEneMax, aEneTot, aSptMax, aSptTot, ahReq, ahCutMax, ahCutTot, ahImpMax, ahImpTot, ahThrMax,
            ahThrTot, ahHeatMax, ahHeatTot, ahColdMax, ahColdTot, ahEleMax, ahEleTot, ahEneMax, ahEneTot, ahSptMax, ahSptTot, perPen, usedpp, matrixpp, arsMk,
            maMk, techMk, pathLvl, turnMaint, dayMaint, spellCost, wepNum, wepSpd, maKiAtk, maKiBlk, maKiDod, pilot, techmagic, cook, toy,
            kiDect, kiCon] = this.items.reduce((arr, item) => {
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
                    if (data.toggles.psychicStrengthening == true) {
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
                        } else if (arr[112] > item.system.FinalWeaponSpeed) {
                            arr[112] = item.system.FinalWeaponSpeed;
                        }
                    }
                }
            return arr;
            }, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0]);

        //Stuff Xp, Presence, Next lvl Xp
        data.level = level; //class Bonus
        if (data.level == 0) {
            data.dp = 400;
        } else {
            data.dp = Math.floor((data.level * 100) + 500);
        }
        data.presence = Math.floor((data.dp / 20) + data.levelinfo.presencemod);
        data.nextlevel = Math.floor(((data.level + data.levelinfo.levelmod) * 25) + 75);

        //Mk Calculations
        data.mkBonus = mk; //Class Mk
        data.kiThingMK = 0; //Ki Abilities Cost
        for (let [key, kiThing] of Object.entries(data.kiAbility)) {
            if (kiThing.status == true && kiThing.status2 == false) {
                data.kiThingMK += kiThing.cost;
            } else {
                data.kiThingMK += 0;
            }
        }
        data.kiSealMk = 0; //Minor & Major Seals Cost
        for (let [key, kiSealStuff] of Object.entries(data.kiSeal.minor)) {
            if (kiSealStuff.mastery == true && kiSealStuff.mastery2 == false) {
                data.kiSealMk += 30;
            } else {
                data.kiSealMk += 0;
            }
        }
        for (let [key, kiSealStuff] of Object.entries(data.kiSeal.major)) {
            if (kiSealStuff.mastery == true && kiSealStuff.mastery2 == false) {
                data.kiSealMk += 50;
            } else {
                data.kiSealMk += 0;
            }
        }
        data.limitsMK = +data.limits.limitOne + +data.limits.limitTwo; //Limits Cost
        data.arsMagMK = arsMk; //Ars Magnus Cost
        data.mArtMk = maMk; //Martial Arts Bonus MK
        data.kiTechMk = techMk; //Ki Technique Cost
        data.mkFinal = Math.floor(data.mk.base + data.mk.temp + data.mk.spec + data.mkBonus + data.mArtMk); //Total Final Mk
        data.mkUsed = Math.floor(data.limitsMK + data.kiThingMK + data.kiSealMk + data.arsMagMK + data.kiTechMk); //Total Used Mk

        // Wear Armor
        data.weararmorbonus = weararm;
        data.wearArmorFinal += weararm;

        if (data.kiAbility.kiEnergyArmor.status == true) { //Energy armor add 2 energy AT for free
            data.enArm = 2;
            if (data.toggles.greaterEnergyArmor == true && data.kiAbility.kiArcaneArmor.status == false) { //Greater energy armor only if arcane is not bought
                data.enArm = 4;
            } else if (data.kiAbility.kiArcaneArmor.status == true) {
                data.enArm = 4;
                data.toggles.greaterEnergyArmor = false;
                if (data.toggles.arcaneEnergyArmor == true) {
                    data.enArm = 6;
                }
            }
        } else {
            data.enArm = 0;
        }
        if (data.kiAbility.kiGreaterArmor.status == false) {
            data.toggles.greaterEnergyArmor = false;
        }
        if (data.kiAbility.kiArcaneArmor.status == false) {
            data.toggles.arcaneEnergyArmor = false;
        }
        // Armor Final AT
        data.aCutFinal = Math.floor((aCutTot - ~~(aCutMax / 2)) + aCutMax);
        data.aImpFinal = Math.floor((aImpTot - ~~(aImpMax / 2)) + aImpMax);
        data.aThrFinal = Math.floor((aThrTot - ~~(aThrMax / 2)) + aThrMax);
        data.aHeatFinal = Math.floor((aHeatTot - ~~(aHeatMax / 2)) + aHeatMax);
        data.aColdFinal = Math.floor((aColdTot - ~~(aColdMax / 2)) + aColdMax);
        data.aEleFinal = Math.floor((aEleTot - ~~(aEleMax / 2)) + aEleMax);
        data.aEneFinal = Math.floor((aEneTot - ~~(aEneMax / 2)) + aEneMax + data.enArm);
        data.aSptFinal = Math.floor((aSptTot - ~~(aSptMax / 2)) + aSptMax);

        // Helmet Final AT
        data.ahCutFinal = Math.floor((ahCutTot - ~~(ahCutMax / 2)) + ahCutMax);
        data.ahImpFinal = Math.floor((ahImpTot - ~~(ahImpMax / 2)) + ahImpMax);
        data.ahThrFinal = Math.floor((ahThrTot - ~~(ahThrMax / 2)) + ahThrMax);
        data.ahHeatFinal = Math.floor((ahHeatTot - ~~(ahHeatMax / 2)) + ahHeatMax);
        data.ahColdFinal = Math.floor((ahColdTot - ~~(ahColdMax / 2)) + ahColdMax);
        data.ahEleFinal = Math.floor((ahEleTot - ~~(ahEleMax / 2)) + ahEleMax);
        data.ahEneFinal = Math.floor((ahEneTot - ~~(ahEneMax / 2)) + ahEneMax);
        data.ahSptFinal = Math.floor((ahSptTot - ~~(ahSptMax / 2)) + ahSptMax);

        // Armor Stats
        data.totalPerPen = perPen;
        data.armorMod = Math.floor(data.wearArmorFinal - req);
        if (natPen - data.armorMod < 0) {
            data.totalNatPen = Math.max(0, Math.floor(((quantity - 1) * 20) + 0));
        } else {
            data.totalNatPen = Math.max(0, Math.floor(((quantity - 1) * 20) + (natPen - data.armorMod)));
        }
        data.movePenMod = Math.max(0, Math.floor(data.armorMod / 50));
        if (movePen - data.movePenMod < 0) {
            data.totalMovePen = Math.floor(movePen + Math.max(0, data.totalNatPen / 50));
        } else {
            data.totalMovePen = Math.floor(movePen + Math.max(0, data.totalNatPen / 50) - data.movePenMod);
        }

        //Resistances
        if (data.kiAbility.kiPhysDom.status == true) { //Physical Dominion adds 10 PhR
            data.phrDom = 10;
        } else {
            data.phrDom = 0;
        }
        if (data.kiAbility.nemiBodyEmpty.status == true) { //Physical Dominion adds 10 PhR
            data.allEmpty = 20;
        } else {
            data.allEmpty = 0;
        }

        for (let [key, res] of Object.entries(data.resistances)) {
            switch (key) {
                case "Physical":
                    res.short = "PhR";
                    res.final = Math.floor(data.presence + res.mod + stats.Constitution.mod + data.phrDom + data.allEmpty);
                    break;
                case "Disease":
                    res.short = "DR";
                    res.final = Math.floor(data.presence + res.mod + stats.Constitution.mod + data.allEmpty);
                    break;
                case "Poison":
                    res.short = "PsnR";
                    res.final = Math.floor(data.presence + res.mod + stats.Constitution.mod + data.allEmpty);
                    break;
                case "Magic":
                    res.short = "MR";
                    res.final = Math.floor(data.presence + res.mod + stats.Power.mod + data.allEmpty);
                    break;
                case "Psychic":
                    res.short = "PsyR";
                    res.final = Math.floor(data.presence + res.mod + stats.Willpower.mod + data.allEmpty);
                    break;
                default:
                    break;
            }
        }

        //Movement
        data.finalmove = Math.floor(data.stats.Agility.final + data.movement.spec + data.movement.temp - data.movement.pen + Math.min(0, Math.ceil(data.aamFinal / 20)) - data.totalMovePen);
        switch (data.finalmove) {
            case 1:
                data.fullmove = "3 ft";
                data.fourthmove = "1 ft";
                data.runningmove = "2 ft";
                break;
            case 2:
                data.fullmove = "15 ft";
                data.fourthmove = "3 ft";
                data.runningmove = "7 ft";
                break;
            case 3:
                data.fullmove = "25 ft";
                data.fourthmove = "6 ft";
                data.runningmove = "12 ft";
                break;
            case 4:
                data.fullmove = "50 ft";
                data.fourthmove = "12 ft";
                data.runningmove = "25 ft";
                break;
            case 5:
                data.fullmove = "65 ft";
                data.fourthmove = "16 ft";
                data.runningmove = "32 ft";
                break;
            case 6:
                data.fullmove = "70 ft";
                data.fourthmove = "17 ft";
                data.runningmove = "35 ft";
                break;
            case 7:
                data.fullmove = "80 ft";
                data.fourthmove = "20 ft";
                data.runningmove = "40 ft";
                break;
            case 8:
                data.fullmove = "90 ft";
                data.fourthmove = "22 ft";
                data.runningmove = "45 ft";
                break;
            case 9:
                data.fullmove = "105 ft";
                data.fourthmove = "26 ft";
                data.runningmove = "52 ft";
                break;
            case 10:
                data.fullmove = "115 ft";
                data.fourthmove = "28 ft";
                data.runningmove = "57 ft";
                break;
            case 11:
                data.fullmove = "130 ft";
                data.fourthmove = "32 ft";
                data.runningmove = "65 ft";
                break;
            case 12:
                data.fullmove = "160 ft";
                data.fourthmove = "40 ft";
                data.runningmove = "80 ft";
                break;
            case 13:
                data.fullmove = "250 ft";
                data.fourthmove = "62 ft";
                data.runningmove = "125 ft";
                break;
            case 14:
                data.fullmove = "500 ft";
                data.fourthmove = "125 ft";
                data.runningmove = "250 ft";
                break;
            case 15:
                data.fullmove = "800 ft";
                data.fourthmove = "200 ft";
                data.runningmove = "400 ft";
                break;
            case 16:
                data.fullmove = "1500 ft";
                data.fourthmove = "375 ft";
                data.runningmove = "750 ft";
                break;
            case 17:
                data.fullmove = "3000 ft";
                data.fourthmove = "750 ft";
                data.runningmove = "1500 ft";
                break;
            case 18:
                data.fullmove = "3 miles";
                data.fourthmove = "3960 ft";
                data.runningmove = "1.5 miles";
                break;
            case 19:
                data.fullmove = "15 miles";
                data.fourthmove = "3.75 miles";
                data.runningmove = "7.5 miles";
                break;
            case 20:
                data.fullmove = "Special";
                data.fourthmove = "Special";
                data.runningmove = "Special";
                break;
            default:
                data.fullmove = "0";
                data.fourthmove = "0";
                data.runningmove = "0";
                break;
        }
        if (data.finalmove > 20) {
            data.fullmove = "Special";
            data.fourthmove = "Special";
            data.runningmove = "Special";
        }
        //Lifepoint Calculation
        data.lpbonus = lpbonus;
        data.lp.max += lpbonus;
        // Attack, Block, & Dodge post class
        data.attackbonus = atk + maKiAtk;
        if (data.attackbonus > 50) {
            data.attackbonus = 50;
        }
        data.atkfinal += data.attackbonus;
        data.blockbonus = blk + maKiBlk;
        if (data.blockbonus > 50) {
            data.blockbonus = 50;
        }
        data.blkfinal += data.blockbonus;
        data.dodgebonus = dod + maKiDod;
        if (data.dodgebonus > 50) {
            data.dodgebonus = 50;
        }
        data.dodfinal += data.dodgebonus;

        // Initiative
        if (data.kiAbility.kiIncreaseSpd.status == true) {
            data.KiBonusSpd = 10;
        } else {
            data.KiBonusSpd = 0;
        }
        data.inibonus = ini;
        data.weaponNumber = wepNum;
        data.weaponSpeed = wepSpd;
        if (data.weaponNumber > 1 && data.weaponSpeed < 0) {
            data.wepFinSpd = data.weaponSpeed - 20;
        } else if (data.weaponNumber > 1 && data.weaponSpeed >= 0) {
            data.wepFinSpd = data.weaponSpeed - 10;
        } else if (data.weaponNumber == 0) {
            data.wepFinSpd = 20;
        } else {
            data.wepFinSpd = data.weaponSpeed;
        }
        data.iniFinal = Math.floor(data.iniBase + data.inibonus + data.initiative.spec + data.KiBonusSpd + ~~data.wepFinSpd - data.totalNatPen); // Base + class + spec + weapon(if equipped) - armor.

        /*
            Secondaries
        */
        // Acrobatics data.totalNatPen
        data.acrobaticsbonus = acro;
        data.acrobaticsnat = Math.floor(stats.Agility.mod + data.secondary.acrobatics.natural + Math.ceil(data.secondary.acrobatics.nat * stats.Agility.mod));
        if (data.acrobaticsnat < 100) {
            data.acrobaticsnatfinal = data.acrobaticsnat;
        } else {
            data.acrobaticsnatfinal = 100;
        }
        data.acrofinal = Math.floor(data.secondary.acrobatics.temp + data.secondary.acrobatics.spec + data.secondary.acrobatics.base + data.acrobaticsbonus + data.acrobaticsnatfinal + data.aamFinal - data.totalNatPen);

        // Athelticism
        data.athleticismbonus = athle;

        data.athleticismnat = Math.floor(stats.Agility.mod + data.secondary.athleticism.natural + Math.ceil(data.secondary.athleticism.nat * stats.Agility.mod));
        if (data.athleticismnat < 100) {
            data.athleticismnatfinal = data.athleticismnat;
        } else {
            data.athleticismnatfinal = 100;
        }
        data.athleticismfinal = Math.floor(data.secondary.athleticism.temp + data.secondary.athleticism.spec + data.secondary.athleticism.base + data.athleticismbonus + data.athleticismnatfinal + data.aamFinal - data.totalNatPen);

        // Climb
        data.climbbonus = climb;
        data.climbnat = Math.floor(stats.Agility.mod + data.secondary.climb.natural + Math.ceil(data.secondary.climb.nat * stats.Agility.mod));
        if (data.climbnat < 100) {
            data.climbnatfinal = data.climbnat;
        } else {
            data.climbnatfinal = 100;
        }
        data.climbfinal = Math.floor(data.secondary.climb.temp + data.secondary.climb.spec + data.secondary.climb.base + data.climbbonus + data.climbnatfinal + data.aamFinal - data.totalNatPen);

        // Jump
        data.jumpbonus = jump;
        data.jumpnat = Math.floor(stats.Strength.mod + data.secondary.jump.natural + Math.ceil(data.secondary.jump.nat * stats.Strength.mod));
        if (data.jumpnat < 100) {
            data.jumpnatfinal = data.jumpnat;
        } else {
            data.jumpnatfinal = 100;
        }
        data.jumpfinal = Math.floor(data.secondary.jump.temp + data.secondary.jump.spec + data.secondary.jump.base + data.jumpbonus + data.jumpnatfinal + data.aamFinal - data.totalNatPen);

        // Ride
        data.ridebonus = ride;
        data.ridenat = Math.floor(stats.Agility.mod + data.secondary.ride.natural + Math.ceil(data.secondary.ride.nat * stats.Agility.mod));
        if (data.ridenat < 100) {
            data.ridenatfinal = data.ridenat;
        } else {
            data.ridenatfinal = 100;
        }
        data.ridefinal = Math.floor(data.secondary.ride.temp + data.secondary.ride.spec + data.secondary.ride.base + data.ridebonus + data.ridenatfinal + data.aamFinal - data.totalNatPen);

        // Swim
        data.swimbonus = swim;
        data.swimnat = Math.floor(stats.Agility.mod + data.secondary.swim.natural + Math.ceil(data.secondary.swim.nat * stats.Agility.mod));
        if (data.swimnat < 100) {
            data.swimnatfinal = data.swimnat;
        } else {
            data.swimnatfinal = 100;
        }
        data.swimfinal = Math.floor(data.secondary.swim.temp + data.secondary.swim.spec + data.secondary.swim.base + data.swimbonus + data.swimnatfinal + data.aamFinal - data.totalNatPen);

        // etiquette
        data.etiquettebonus = etiq;
        data.etiquettenat = Math.floor(stats.Intelligence.mod + data.secondary.etiquette.natural + Math.ceil(data.secondary.etiquette.nat * stats.Intelligence.mod));
        if (data.etiquettenat < 100) {
            data.etiquettenatfinal = data.etiquettenat;
        } else {
            data.etiquettenatfinal = 100;
        }
        data.etiquettefinal = Math.floor(data.secondary.etiquette.temp + data.secondary.etiquette.spec + data.secondary.etiquette.base + data.etiquettebonus + data.etiquettenatfinal + data.aamFinal);

        // Intimidate
        data.intimidatebonus = intim;
        data.intimidatenat = Math.floor(stats.Willpower.mod + data.secondary.intimidate.natural + Math.ceil(data.secondary.intimidate.nat * stats.Willpower.mod));
        if (data.intimidatenat < 100) {
            data.intimidatenatfinal = data.intimidatenat;
        } else {
            data.intimidatenatfinal = 100;
        }
        data.intimidatefinal = Math.floor(data.secondary.intimidate.temp + data.secondary.intimidate.spec + data.secondary.intimidate.base + data.intimidatebonus + data.intimidatenatfinal + data.aamFinal);

        // Leadership
        data.leadershipbonus = leader;
        data.leadershipnat = Math.floor(stats.Power.mod + data.secondary.leadership.natural + Math.ceil(data.secondary.leadership.nat * stats.Power.mod));
        if (data.leadershipnat < 100) {
            data.leadershipnatfinal = data.leadershipnat;
        } else {
            data.leadershipnatfinal = 100;
        }
        data.leadershipfinal = Math.floor(data.secondary.leadership.temp + data.secondary.leadership.spec + data.secondary.leadership.base + data.leadershipbonus + data.leadershipnatfinal + data.aamFinal);

        // persuasion
        data.persuasionbonus = persua;
        data.persuasionnat = Math.floor(stats.Intelligence.mod + data.secondary.persuasion.natural + Math.ceil(data.secondary.persuasion.nat * stats.Intelligence.mod));
        if (data.persuasionnat < 100) {
            data.persuasionnatfinal = data.persuasionnat;
        } else {
            data.persuasionnatfinal = 100;
        }
        data.persuasionfinal = Math.floor(data.secondary.persuasion.temp + data.secondary.persuasion.spec + data.secondary.persuasion.base + data.persuasionbonus + data.persuasionnatfinal + data.aamFinal);

        // streetwise
        data.streetwisebonus = street;
        data.streetwisenat = Math.floor(stats.Intelligence.mod + data.secondary.streetwise.natural + Math.ceil(data.secondary.streetwise.nat * stats.Intelligence.mod));
        if (data.streetwisenat < 100) {
            data.streetwisenatfinal = data.streetwisenat;
        } else {
            data.streetwisenatfinal = 100;
        }
        data.streetwisefinal = Math.floor(data.secondary.streetwise.temp + data.secondary.streetwise.spec + data.secondary.streetwise.base + data.streetwisebonus + data.streetwisenatfinal + data.aamFinal);

        // style
        data.stylebonus = style;
        data.stylenat = Math.floor(stats.Power.mod + data.secondary.style.natural + Math.ceil(data.secondary.style.nat * stats.Power.mod));
        if (data.stylenat < 100) {
            data.stylenatfinal = data.stylenat;
        } else {
            data.stylenatfinal = 100;
        }
        data.stylefinal = Math.floor(data.secondary.style.temp + data.secondary.style.spec + data.secondary.style.base + data.stylebonus + data.stylenatfinal + data.aamFinal);

        // trading
        data.tradingbonus = trading;
        data.tradingnat = Math.floor(stats.Intelligence.mod + data.secondary.trading.natural + Math.ceil(data.secondary.trading.nat * stats.Intelligence.mod));
        if (data.tradingnat < 100) {
            data.tradingnatfinal = data.tradingnat;
        } else {
            data.tradingnatfinal = 100;
        }
        data.tradingfinal = Math.floor(data.secondary.trading.temp + data.secondary.trading.spec + data.secondary.trading.base + data.tradingbonus + data.tradingnatfinal + data.aamFinal);

        // notice
        data.noticebonus = notice;
        data.noticenat = Math.floor(stats.Perception.mod + data.secondary.notice.natural + Math.ceil(data.secondary.notice.nat * stats.Perception.mod));
        if (data.noticenat < 100) {
            data.noticenatfinal = data.noticenat;
        } else {
            data.noticenatfinal = 100;
        }
        data.noticefinal = Math.floor(data.secondary.notice.temp + data.secondary.notice.spec + data.secondary.notice.base + data.noticebonus + data.noticenatfinal + data.aamFinal);

        // search
        data.searchbonus = search;
        data.searchnat = Math.floor(stats.Perception.mod + data.secondary.search.natural + Math.ceil(data.secondary.search.nat * stats.Perception.mod));
        if (data.searchnat < 100) {
            data.searchnatfinal = data.searchnat;
        } else {
            data.searchnatfinal = 100;
        }
        data.searchfinal = Math.floor(data.secondary.search.temp + data.secondary.search.spec + data.secondary.search.base + data.searchbonus + data.searchnatfinal + data.aamFinal);

        // track
        data.trackbonus = track;
        data.tracknat = Math.floor(stats.Perception.mod + data.secondary.track.natural + Math.ceil(data.secondary.track.nat * stats.Perception.mod));
        if (data.tracknat < 100) {
            data.tracknatfinal = data.tracknat;
        } else {
            data.tracknatfinal = 100;
        }
        data.trackfinal = Math.floor(data.secondary.track.temp + data.secondary.track.spec + data.secondary.track.base + data.trackbonus + data.tracknatfinal + data.aamFinal);

        // animals
        data.animalsbonus = animals;
        data.animalsnat = Math.floor(stats.Intelligence.mod + data.secondary.animals.natural + Math.ceil(data.secondary.animals.nat * stats.Intelligence.mod));
        if (data.animalsnat < 100) {
            data.animalsnatfinal = data.animalsnat;
        } else {
            data.animalsnatfinal = 100;
        }
        data.animalsfinal = Math.floor(data.secondary.animals.temp + data.secondary.animals.spec + data.secondary.animals.base + data.animalsbonus + data.animalsnatfinal + data.aamFinal);

        // appraisal
        data.appraisalbonus = appra;
        data.appraisalnat = Math.floor(stats.Intelligence.mod + data.secondary.appraisal.natural + Math.ceil(data.secondary.appraisal.nat * stats.Intelligence.mod));
        if (data.appraisalnat < 100) {
            data.appraisalnatfinal = data.appraisalnat;
        } else {
            data.appraisalnatfinal = 100;
        }
        data.appraisalfinal = Math.floor(data.secondary.appraisal.temp + data.secondary.appraisal.spec + data.secondary.appraisal.base + data.appraisalbonus + data.appraisalnatfinal + data.aamFinal);

        // architecture
        data.architecturebonus = archi;
        data.architecturenat = Math.floor(stats.Intelligence.mod + data.secondary.architecture.natural + Math.ceil(data.secondary.architecture.nat * stats.Intelligence.mod));
        if (data.architecturenat < 100) {
            data.architecturenatfinal = data.architecturenat;
        } else {
            data.architecturenatfinal = 100;
        }
        data.architecturefinal = Math.floor(data.secondary.architecture.temp + data.secondary.architecture.spec + data.secondary.architecture.base + data.architecturebonus + data.architecturenatfinal + data.aamFinal);

        // herballore
        data.herballorebonus = herb;
        data.herballorenat = Math.floor(stats.Intelligence.mod + data.secondary.herballore.natural + Math.ceil(data.secondary.herballore.nat * stats.Intelligence.mod));
        if (data.herballorenat < 100) {
            data.herballorenatfinal = data.herballorenat;
        } else {
            data.herballorenatfinal = 100;
        }
        data.herballorefinal = Math.floor(data.secondary.herballore.temp + data.secondary.herballore.spec + data.secondary.herballore.base + data.herballorebonus + data.herballorenatfinal + data.aamFinal);

        // history
        data.historybonus = hist;
        data.historynat = Math.floor(stats.Intelligence.mod + data.secondary.history.natural + Math.ceil(data.secondary.history.nat * stats.Intelligence.mod));
        if (data.historynat < 100) {
            data.historynatfinal = data.historynat;
        } else {
            data.historynatfinal = 100;
        }
        data.historyfinal = Math.floor(data.secondary.history.temp + data.secondary.history.spec + data.secondary.history.base + data.historybonus + data.historynatfinal + data.aamFinal);

        // law
        data.lawbonus = law;
        data.lawnat = Math.floor(stats.Intelligence.mod + data.secondary.law.natural + Math.ceil(data.secondary.law.nat * stats.Intelligence.mod));
        if (data.lawnat < 100) {
            data.lawnatfinal = data.lawnat;
        } else {
            data.lawnatfinal = 100;
        }
        data.lawfinal = Math.floor(data.secondary.law.temp + data.secondary.law.spec + data.secondary.law.base + data.lawbonus + data.lawnatfinal + data.aamFinal);

        // magicappr
        data.magicapprbonus = magicapr;
        data.magicapprnat = Math.floor(stats.Power.mod + data.secondary.magicappr.natural + Math.ceil(data.secondary.magicappr.nat * stats.Power.mod));
        if (data.magicapprnat < 100) {
            data.magicapprnatfinal = data.magicapprnat;
        } else {
            data.magicapprnatfinal = 100;
        }
        data.magicapprfinal = Math.floor(data.secondary.magicappr.temp + data.secondary.magicappr.spec + data.secondary.magicappr.base + data.magicapprbonus + data.magicapprnatfinal + data.aamFinal);

        // medicine
        data.medicinebonus = medic;
        data.medicinenat = Math.floor(stats.Intelligence.mod + data.secondary.medicine.natural + Math.ceil(data.secondary.medicine.nat * stats.Intelligence.mod));
        if (data.medicinenat < 100) {
            data.medicinenatfinal = data.medicinenat;
        } else {
            data.medicinenatfinal = 100;
        }
        data.medicinefinal = Math.floor(data.secondary.medicine.temp + data.secondary.medicine.spec + data.secondary.medicine.base + data.medicinebonus + data.medicinenatfinal + data.aamFinal);

        // memorize
        data.memorizebonus = mem;
        data.memorizenat = Math.floor(stats.Intelligence.mod + data.secondary.memorize.natural + Math.ceil(data.secondary.memorize.nat * stats.Intelligence.mod));
        if (data.memorizenat < 100) {
            data.memorizenatfinal = data.memorizenat;
        } else {
            data.memorizenatfinal = 100;
        }
        data.memorizefinal = Math.floor(data.secondary.memorize.temp + data.secondary.memorize.spec + data.secondary.memorize.base + data.memorizebonus + data.memorizenatfinal + data.aamFinal);

        // navigation
        data.navigationbonus = navi;
        data.navigationnat = Math.floor(stats.Intelligence.mod + data.secondary.navigation.natural + Math.ceil(data.secondary.navigation.nat * stats.Intelligence.mod));
        if (data.navigationnat < 100) {
            data.navigationnatfinal = data.navigationnat;
        } else {
            data.navigationnatfinal = 100;
        }
        data.navigationfinal = Math.floor(data.secondary.navigation.temp + data.secondary.navigation.spec + data.secondary.navigation.base + data.navigationbonus + data.navigationnatfinal + data.aamFinal);

        // occult
        data.occultbonus = occ;
        data.occultnat = Math.floor(stats.Intelligence.mod + data.secondary.occult.natural + Math.ceil(data.secondary.occult.nat * stats.Intelligence.mod));
        if (data.occultnat < 100) {
            data.occultnatfinal = data.occultnat;
        } else {
            data.occultnatfinal = 100;
        }
        data.occultfinal = Math.floor(data.secondary.occult.temp + data.secondary.occult.spec + data.secondary.occult.base + data.occultbonus + data.occultnatfinal + data.aamFinal);

        // science
        data.sciencebonus = science;
        data.sciencenat = Math.floor(stats.Intelligence.mod + data.secondary.science.natural + Math.ceil(data.secondary.science.nat * stats.Intelligence.mod));
        if (data.sciencenat < 100) {
            data.sciencenatfinal = data.sciencenat;
        } else {
            data.sciencenatfinal = 100;
        }
        data.sciencefinal = Math.floor(data.secondary.science.temp + data.secondary.science.spec + data.secondary.science.base + data.sciencebonus + data.sciencenatfinal + data.aamFinal);

        // tactics
        data.tacticsbonus = tactic;
        data.tacticsnat = Math.floor(stats.Intelligence.mod + data.secondary.tactics.natural + Math.ceil(data.secondary.tactics.nat * stats.Intelligence.mod));
        if (data.tacticsnat < 100) {
            data.tacticsnatfinal = data.tacticsnat;
        } else {
            data.tacticsnatfinal = 100;
        }
        data.tacticsfinal = Math.floor(data.secondary.tactics.temp + data.secondary.tactics.spec + data.secondary.tactics.base + data.tacticsbonus + data.tacticsnatfinal + data.aamFinal);

        // composure
        data.composurebonus = comp;
        data.composurenat = Math.floor(stats.Willpower.mod + data.secondary.composure.natural + Math.ceil(data.secondary.composure.nat * stats.Willpower.mod));
        if (data.composurenat < 100) {
            data.composurenatfinal = data.composurenat;
        } else {
            data.composurenatfinal = 100;
        }
        data.composurefinal = Math.floor(data.secondary.composure.temp + data.secondary.composure.spec + data.secondary.composure.base + data.composurebonus + data.composurenatfinal + data.aamFinal);

        // featsofstr
        data.featsofstrbonus = fos;
        data.featsofstrnat = Math.floor(stats.Strength.mod + data.secondary.featsofstr.natural + Math.ceil(data.secondary.featsofstr.nat * stats.Strength.mod));
        if (data.featsofstrnat < 100) {
            data.featsofstrnatfinal = data.featsofstrnat;
        } else {
            data.featsofstrnatfinal = 100;
        }
        data.featsofstrfinal = Math.floor(data.secondary.featsofstr.temp + data.secondary.featsofstr.spec + data.secondary.featsofstr.base + data.featsofstrbonus + data.featsofstrnatfinal + data.aamFinal - data.totalNatPen);

        // withstpain
        data.withstpainbonus = wstp;
        data.withstpainnat = Math.floor(stats.Willpower.mod + data.secondary.withstpain.natural + Math.ceil(data.secondary.withstpain.nat * stats.Willpower.mod));
        if (data.withstpainnat < 100) {
            data.withstpainnatfinal = data.withstpainnat;
        } else {
            data.withstpainnatfinal = 100;
        }
        data.withstpainfinal = Math.floor(data.secondary.withstpain.temp + data.secondary.withstpain.spec + data.secondary.withstpain.base + data.withstpainbonus + data.withstpainnatfinal + data.aamFinal);

        // disguise
        data.disguisebonus = disg;
        data.disguisenat = Math.floor(stats.Dexterity.mod + data.secondary.disguise.natural + Math.ceil(data.secondary.disguise.nat * stats.Dexterity.mod));
        if (data.disguisenat < 100) {
            data.disguisenatfinal = data.disguisenat;
        } else {
            data.disguisenatfinal = 100;
        }
        data.disguisefinal = Math.floor(data.secondary.disguise.temp + data.secondary.disguise.spec + data.secondary.disguise.base + data.disguisebonus + data.disguisenatfinal + data.aamFinal);

        // hide
        data.hidebonus = hide;
        data.hidenat = Math.floor(stats.Perception.mod + data.secondary.hide.natural + Math.ceil(data.secondary.hide.nat * stats.Perception.mod));
        if (data.hidenat < 100) {
            data.hidenatfinal = data.hidenat;
        } else {
            data.hidenatfinal = 100;
        }
        data.hidefinal = Math.floor(data.secondary.hide.temp + data.secondary.hide.spec + data.secondary.hide.base + data.hidebonus + data.hidenatfinal + data.aamFinal - data.totalNatPen);

        // lockpicking
        data.lockpickingbonus = lock;
        data.lockpickingnat = Math.floor(stats.Dexterity.mod + data.secondary.lockpicking.natural + Math.ceil(data.secondary.lockpicking.nat * stats.Dexterity.mod));
        if (data.lockpickingnat < 100) {
            data.lockpickingnatfinal = data.lockpickingnat;
        } else {
            data.lockpickingnatfinal = 100;
        }
        data.lockpickingfinal = Math.floor(data.secondary.lockpicking.temp + data.secondary.lockpicking.spec + data.secondary.lockpicking.base + data.lockpickingbonus + data.lockpickingnatfinal + data.aamFinal);

        // poisons
        data.poisonsbonus = poisn;
        data.poisonsnat = Math.floor(stats.Intelligence.mod + data.secondary.poisons.natural + Math.ceil(data.secondary.poisons.nat * stats.Intelligence.mod));
        if (data.poisonsnat < 100) {
            data.poisonsnatfinal = data.poisonsnat;
        } else {
            data.poisonsnatfinal = 100;
        }
        data.poisonsfinal = Math.floor(data.secondary.poisons.temp + data.secondary.poisons.spec + data.secondary.poisons.base + data.poisonsbonus + data.poisonsnatfinal + data.aamFinal);

        // stealth
        data.stealthbonus = stealth;
        data.stealthnat = Math.floor(stats.Agility.mod + data.secondary.stealth.natural + Math.ceil(data.secondary.stealth.nat * stats.Agility.mod));
        if (data.stealthnat < 100) {
            data.stealthnatfinal = data.stealthnat;
        } else {
            data.stealthnatfinal = 100;
        }
        data.stealthfinal = Math.floor(data.secondary.stealth.temp + data.secondary.stealth.spec + data.secondary.stealth.base + data.stealthbonus + data.stealthnatfinal + data.aamFinal - data.totalNatPen);

        // theft
        data.theftbonus = theft;
        data.theftnat = Math.floor(stats.Dexterity.mod + data.secondary.theft.natural + Math.ceil(data.secondary.theft.nat * stats.Dexterity.mod));
        if (data.theftnat < 100) {
            data.theftnatfinal = data.theftnat;
        } else {
            data.theftnatfinal = 100;
        }
        data.theftfinal = Math.floor(data.secondary.theft.temp + data.secondary.theft.spec + data.secondary.theft.base + data.theftbonus + data.theftnatfinal + data.aamFinal);

        // traplore
        data.traplorebonus = trapl;
        data.traplorenat = Math.floor(stats.Dexterity.mod + data.secondary.traplore.natural + Math.ceil(data.secondary.traplore.nat * stats.Dexterity.mod));
        if (data.traplorenat < 100) {
            data.traplorenatfinal = data.traplorenat;
        } else {
            data.traplorenatfinal = 100;
        }
        data.traplorefinal = Math.floor(data.secondary.traplore.temp + data.secondary.traplore.spec + data.secondary.traplore.base + data.traplorebonus + data.traplorenatfinal + data.aamFinal);

        // alchemy
        data.alchemybonus = alche;
        data.alchemynat = Math.floor(stats.Intelligence.mod + data.secondary.alchemy.natural + Math.ceil(data.secondary.alchemy.nat * stats.Intelligence.mod));
        if (data.alchemynat < 100) {
            data.alchemynatfinal = data.alchemynat;
        } else {
            data.alchemynatfinal = 100;
        }
        data.alchemyfinal = Math.floor(data.secondary.alchemy.temp + data.secondary.alchemy.spec + data.secondary.alchemy.base + data.alchemybonus + data.alchemynatfinal + data.aamFinal);

        // animism
        data.animismbonus = anims;
        data.animismnat = Math.floor(stats.Power.mod + data.secondary.animism.natural + Math.ceil(data.secondary.animism.nat * stats.Power.mod));
        if (data.animismnat < 100) {
            data.animismnatfinal = data.animismnat;
        } else {
            data.animismnatfinal = 100;
        }
        data.animismfinal = Math.floor(data.secondary.animism.temp + data.secondary.animism.spec + data.secondary.animism.base + data.animismbonus + data.animismnatfinal + data.aamFinal);

        // art
        data.artbonus = art;
        data.artnat = Math.floor(stats.Power.mod + data.secondary.art.natural + Math.ceil(data.secondary.art.nat * stats.Power.mod));
        if (data.artnat < 100) {
            data.artnatfinal = data.artnat;
        } else {
            data.artnatfinal = 100;
        }
        data.artfinal = Math.floor(data.secondary.art.temp + data.secondary.art.spec + data.secondary.art.base + data.artbonus + data.artnatfinal + data.aamFinal);

        // dance
        data.dancebonus = dance;
        data.dancenat = Math.floor(stats.Agility.mod + data.secondary.dance.natural + Math.ceil(data.secondary.dance.nat * stats.Agility.mod));
        if (data.dancenat < 100) {
            data.dancenatfinal = data.dancenat;
        } else {
            data.dancenatfinal = 100;
        }
        data.dancefinal = Math.floor(data.secondary.dance.temp + data.secondary.dance.spec + data.secondary.dance.base + data.dancebonus + data.dancenatfinal + data.aamFinal - data.totalNatPen);

        // forging
        data.forgingbonus = forgi;
        data.forgingnat = Math.floor(stats.Dexterity.mod + data.secondary.forging.natural + Math.ceil(data.secondary.forging.nat * stats.Dexterity.mod));
        if (data.forgingnat < 100) {
            data.forgingnatfinal = data.forgingnat;
        } else {
            data.forgingnatfinal = 100;
        }
        data.forgingfinal = Math.floor(data.secondary.forging.temp + data.secondary.forging.spec + data.secondary.forging.base + data.forgingbonus + data.forgingnatfinal + data.aamFinal);

        // jewelry
        data.jewelrybonus = jewel;
        data.jewelrynat = Math.floor(stats.Dexterity.mod + data.secondary.jewelry.natural + Math.ceil(data.secondary.jewelry.nat * stats.Dexterity.mod));
        if (data.jewelrynat < 100) {
            data.jewelrynatfinal = data.jewelrynat;
        } else {
            data.jewelrynatfinal = 100;
        }
        data.jewelryfinal = Math.floor(data.secondary.jewelry.temp + data.secondary.jewelry.spec + data.secondary.jewelry.base + data.jewelrybonus + data.jewelrynatfinal + data.aamFinal);

        // music
        data.musicbonus = music;
        data.musicnat = Math.floor(stats.Power.mod + data.secondary.music.natural + Math.ceil(data.secondary.music.nat * stats.Power.mod));
        if (data.musicnat < 100) {
            data.musicnatfinal = data.musicnat;
        } else {
            data.musicnatfinal = 100;
        }
        data.musicfinal = Math.floor(data.secondary.music.temp + data.secondary.music.spec + data.secondary.music.base + data.musicbonus + data.musicnatfinal + data.aamFinal);

        // runes
        data.runesbonus = runes;
        data.runesnat = Math.floor(stats.Dexterity.mod + data.secondary.runes.natural + Math.ceil(data.secondary.runes.nat * stats.Dexterity.mod));
        if (data.runesnat < 100) {
            data.runesnatfinal = data.runesnat;
        } else {
            data.runesnatfinal = 100;
        }
        data.runesfinal = Math.floor(data.secondary.runes.temp + data.secondary.runes.spec + data.secondary.runes.base + data.runesbonus + data.runesnatfinal + data.aamFinal);

        // ritualcalig
        data.ritualcaligbonus = ritcal;
        data.ritualcalignat = Math.floor(stats.Dexterity.mod + data.secondary.ritualcalig.natural + Math.ceil(data.secondary.ritualcalig.nat * stats.Dexterity.mod));
        if (data.ritualcalignat < 100) {
            data.ritualcalignatfinal = data.ritualcalignat;
        } else {
            data.ritualcalignatfinal = 100;
        }
        data.ritualcaligfinal = Math.floor(data.secondary.ritualcalig.temp + data.secondary.ritualcalig.spec + data.secondary.ritualcalig.base + data.ritualcaligbonus + data.ritualcalignatfinal + data.aamFinal);

        // slofhand
        data.slofhandbonus = soh;
        data.slofhandnat = Math.floor(stats.Dexterity.mod + data.secondary.slofhand.natural + Math.ceil(data.secondary.slofhand.nat * stats.Dexterity.mod));
        if (data.slofhandnat < 100) {
            data.slofhandnatfinal = data.slofhandnat;
        } else {
            data.slofhandnatfinal = 100;
        }
        data.slofhandfinal = Math.floor(data.secondary.slofhand.temp + data.secondary.slofhand.spec + data.secondary.slofhand.base + data.slofhandbonus + data.slofhandnatfinal + data.aamFinal);

        // tailoring
        data.tailoringbonus = tailoring;
        data.tailoringnat = Math.floor(stats.Dexterity.mod + data.secondary.tailoring.natural + Math.ceil(data.secondary.tailoring.nat * stats.Dexterity.mod));
        if (data.tailoringnat < 100) {
            data.tailoringnatfinal = data.tailoringnat;
        } else {
            data.tailoringnatfinal = 100;
        }
        data.tailoringfinal = Math.floor(data.secondary.tailoring.temp + data.secondary.tailoring.spec + data.secondary.tailoring.base + data.tailoringbonus + data.tailoringnatfinal + data.aamFinal);

        // piloting
        data.pilotingbonus = pilot;
        data.pilotingnat = Math.floor(stats.Dexterity.mod + data.secondary.piloting.natural + Math.ceil(data.secondary.piloting.nat * stats.Dexterity.mod));
        if (data.pilotingnat < 100) {
            data.pilotingnatfinal = data.pilotingnat;
        } else {
            data.pilotingnatfinal = 100;
        }
        data.pilotingfinal = Math.floor(data.secondary.piloting.temp + data.secondary.piloting.spec + data.secondary.piloting.base + data.pilotingbonus + data.pilotingnatfinal + data.aamFinal);

        // cooking
        data.cookingbonus = cook;
        data.cookingnat = Math.floor(stats.Power.mod + data.secondary.cooking.natural + Math.ceil(data.secondary.cooking.nat * stats.Power.mod));
        if (data.cookingnat < 100) {
            data.cookingnatfinal = data.cookingnat;
        } else {
            data.cookingnatfinal = 100;
        }
        data.cookingfinal = Math.floor(data.secondary.cooking.temp + data.secondary.cooking.spec + data.secondary.cooking.base + data.cookingbonus + data.cookingnatfinal + data.aamFinal);

        // technomagic
        data.technomagicbonus = techmagic;
        data.technomagicnat = Math.floor(stats.Intelligence.mod + data.secondary.technomagic.natural + Math.ceil(data.secondary.technomagic.nat * stats.Intelligence.mod));
        if (data.technomagicnat < 100) {
            data.technomagicnatfinal = data.technomagicnat;
        } else {
            data.technomagicnatfinal = 100;
        }
        data.technomagicfinal = Math.floor(data.secondary.technomagic.temp + data.secondary.technomagic.spec + data.secondary.technomagic.base + data.technomagicbonus + data.technomagicnatfinal + data.aamFinal);

        //toymaking
        data.toymakingbonus = toy;
        data.toymakingnat = Math.floor(stats.Power.mod + data.secondary.toymaking.natural + Math.ceil(data.secondary.toymaking.nat * stats.Power.mod));
        if (data.toymakingnat < 100) {
            data.toymakingnatfinal = data.toymakingnat;
        } else {
            data.toymakingnatfinal = 100;
        }
        data.toymakingfinal = Math.floor(data.secondary.toymaking.temp + data.secondary.toymaking.spec + data.secondary.toymaking.base + data.toymakingbonus + data.toymakingnatfinal + data.aamFinal);


        //kidetection data.kidetectionbase
        data.kidetectionbase = Math.floor((data.noticefinal + data.mkFinal) / 2);
        data.kidetectionbonus = kiDect;
        data.kidetectionnat = Math.floor(stats.Perception.mod + data.secondary.kidetection.natural + Math.ceil(data.secondary.kidetection.nat * stats.Perception.mod));
        if (data.kidetectionnat < 100) {
            data.kidetectionnatfinal = data.kidetectionnat;
        } else {
            data.kidetectionnatfinal = 100;
        }
        data.kidetectionfinal = Math.floor(data.secondary.kidetection.temp + data.secondary.kidetection.spec + data.kidetectionbase + data.kidetectionbonus + data.kidetectionnatfinal + data.aamFinal);


        //kicoceal
        data.kiconcealbase = Math.floor((data.hidefinal + data.mkFinal) / 2);
        data.kiconcealbonus = kiCon;
        data.kiconcealnat = Math.floor(stats.Perception.mod + data.secondary.kiconceal.natural + Math.ceil(data.secondary.kiconceal.nat * stats.Perception.mod));
        if (data.kiconcealnat < 100) {
            data.kiconcealnatfinal = data.kiconcealnat;
        } else {
            data.kiconcealnatfinal = 100;
        }
        data.kiconcealfinal = Math.floor(data.secondary.kiconceal.temp + data.secondary.kiconceal.spec + data.kiconcealbase + data.kiconcealbonus + data.kiconcealnatfinal + data.aamFinal);
        /*
         * // z
        data.znat = Math.floor(stats.x.mod + data.secondary.z.natural + Math.ceil(data.secondary.z.nat * stats.x.mod));
        if (data.znat < 100) {
            data.znatfinal = data.znat;
        } else {
            data.znatfinal = 100;
        }
        data.zfinal = Math.floor(data.secondary.z.temp + data.secondary.z.spec + data.secondary.z.base + data.zbonus + data.znatfinal + data.aamFinal);
         */

        // Magic Accumulation & Zeon
        data.turnMaintRemove = turnMaint;
        data.dayMaintRemove = dayMaint;
        data.zeonbonus = zeon;
        switch (data.stats.Power.final) {
            case 1:
                data.maccupow = 0;
                data.zeonpow = 5;
                break;
            case 2:
                data.maccupow = 0;
                data.zeonpow = 20;
                break;
            case 3:
                data.maccupow = 0;
                data.zeonpow = 40;
                break;
            case 4:
                data.maccupow = 0;
                data.zeonpow = 55;
                break;
            case 5:
                data.maccupow = 5;
                data.zeonpow = 70;
                break;
            case 6:
                data.maccupow = 5;
                data.zeonpow = 85;
                break;
            case 7:
                data.maccupow = 5;
                data.zeonpow = 95;
                break;
            case 8:
                data.maccupow = 10;
                data.zeonpow = 110;
                break;
            case 9:
                data.maccupow = 10;
                data.zeonpow = 120;
                break;
            case 10:
                data.maccupow = 10;
                data.zeonpow = 135;
                break;
            case 11:
                data.maccupow = 10;
                data.zeonpow = 150;
                break;
            case 12:
                data.maccupow = 15;
                data.zeonpow = 160;
                break;
            case 13:
                data.maccupow = 15;
                data.zeonpow = 175;
                break;
            case 14:
                data.maccupow = 15;
                data.zeonpow = 185;
                break;
            case 15:
                data.maccupow = 20;
                data.zeonpow = 200;
                break;
            case 16:
                data.maccupow = 25;
                data.zeonpow = 215;
                break;
            case 17:
                data.maccupow = 25;
                data.zeonpow = 225;
                break;
            case 18:
                data.maccupow = 30;
                data.zeonpow = 240;
                break;
            case 19:
                data.maccupow = 30;
                data.zeonpow = 250;
                break;
            case 20:
                data.maccupow = 35;
                data.zeonpow = 260;
                break;
            default:
                data.zeonpow = 0;
                break;
        }
        if (data.stats.Power.final > 20) {
            data.maccupow = 35;
            data.zeonpow = 260;
        }
        data.maccufinal = Math.floor(data.maccu.base + data.maccupow + (data.maccu.mult * data.maccupow) + data.maccu.spec + data.maccu.temp);
        data.maccuhalffinal = Math.floor(data.maccufinal / 2);
        data.mregenfinal = Math.floor(((data.maccupow * data.mregen.regenmult) + data.mregen.spec + data.mregen.temp + data.maccufinal) * data.mregen.recoverymult);
        data.zeonfinal = Math.floor(data.zeon.base + data.zeonpow + data.zeonbonus + data.zeon.spec + data.zeon.temp);

        // Innate Magic
        if (data.maccufinal >= 10 && data.maccufinal <= 50) {
            data.minnatefinal = Math.floor(data.zeon.minnate + 10);
        } else if (data.maccufinal > 50 && data.maccufinal <= 70) {
            data.minnatefinal = Math.floor(data.zeon.minnate + 20);
        } else if (data.maccufinal > 70 && data.maccufinal <= 90) {
            data.minnatefinal = Math.floor(data.zeon.minnate + 30);
        } else if (data.maccufinal > 90 && data.maccufinal <= 110) {
            data.minnatefinal = Math.floor(data.zeon.minnate + 40);
        } else if (data.maccufinal > 110 && data.maccufinal <= 130) {
            data.minnatefinal = Math.floor(data.zeon.minnate + 50);
        } else if (data.maccufinal > 130 && data.maccufinal <= 150) {
            data.minnatefinal = Math.floor(data.zeon.minnate + 60);
        } else if (data.maccufinal > 150 && data.maccufinal <= 180) {
            data.minnatefinal = Math.floor(data.zeon.minnate + 70);
        } else if (data.maccufinal > 180 && data.maccufinal <= 200) {
            data.minnatefinal = Math.floor(data.zeon.minnate + 80);
        } else if (data.maccufinal > 200) {
            data.minnatefinal = Math.floor(data.zeon.minnate + 90);
        } else {
            data.minnatefinal = data.zeon.minnate;
        }

        // Magic Levels
        switch (data.stats.Intelligence.final) {
            case 6:
                data.mlevelint = 10;
                break;
            case 7:
                data.mlevelint = 20;
                break;
            case 8:
                data.mlevelint = 30;
                break;
            case 9:
                data.mlevelint = 40;
                break;
            case 10:
                data.mlevelint = 50;
                break;
            case 11:
                data.mlevelint = 75;
                break;
            case 12:
                data.mlevelint = 100;
                break;
            case 13:
                data.mlevelint = 150;
                break;
            case 14:
                data.mlevelint = 200;
                break;
            case 15:
                data.mlevelint = 300;
                break;
            case 16:
                data.mlevelint = 400;
                break;
            case 17:
                data.mlevelint = 500;
                break;
            case 18:
                data.mlevelint = 600;
                break;
            case 19:
                data.mlevelint = 700;
                break;
            case 20:
                data.mlevelint = 800;
                break;
            default:
                data.mlevelint = 0;
                break;
        }
        if (data.stats.Intelligence.final > 20) {
            data.mlevelint = 800;
        }
        data.mlLevels = pathLvl;
        data.spellLevels = spellCost;
        data.mlevelfinal = Math.floor(data.mlevel.base + data.mlevel.spec + data.mlevel.temp + data.mlevelint);
        data.mlevelused = Math.floor(data.mlLevels + data.spellLevels);

        // Summoning Abilities
        data.summonbonus = summon;
        data.controlbonus = control;
        data.bindbonus = bind;
        data.banishbonus = banish;
        data.summonfinal = Math.floor(data.summoning.summon.base + data.summonbonus + data.summoning.summon.spec + data.stats.Power.mod + Math.min(0, data.aamFinal));
        data.controlfinal = Math.floor(data.summoning.control.base + data.controlbonus + data.summoning.control.spec + data.stats.Willpower.mod + Math.min(0, data.aamFinal));
        data.bindfinal = Math.floor(data.summoning.bind.base + data.bindbonus + data.summoning.bind.spec + data.stats.Power.mod + Math.min(0, data.aamFinal));
        data.banishfinal = Math.floor(data.summoning.banish.base + data.banishbonus + data.summoning.banish.spec + data.stats.Power.mod + Math.min(0, data.aamFinal));

        //Unarmed
        switch (data.fistDamage.multOption) {
            case "agi":
                data.unarmedDmgFinal = Math.floor(data.fistDamage.base + (data.fistDamage.mult * data.stats.Agility.mod));
                break;
            case "con":
                data.unarmedDmgFinal = Math.floor(data.fistDamage.base + (data.fistDamage.mult * data.stats.Constitution.mod));
                break;
            case "str":
                data.unarmedDmgFinal = Math.floor(data.fistDamage.base + (data.fistDamage.mult *  data.stats.Strength.mod));
                break;
            case "dex":
                data.unarmedDmgFinal = Math.floor(data.fistDamage.base + (data.fistDamage.mult * data.stats.Dexterity.mod));
                break;
            case "per":
                data.unarmedDmgFinal = Math.floor(data.fistDamage.base + (data.fistDamage.mult * data.stats.Perception.mod));
                break;
            case "int":
                data.unarmedDmgFinal = Math.floor(data.fistDamage.base + (data.fistDamage.mult * data.stats.Intelligence.mod));
                break;
            case "pow":
                data.unarmedDmgFinal = Math.floor(data.fistDamage.base + (data.fistDamage.mult * data.stats.Power.mod));
                break;
            case "wp":
                data.unarmedDmgFinal = Math.floor(data.fistDamage.base + (data.fistDamage.mult * data.stats.Willpower.mod));
                break;
            case "str2":
                data.unarmedDmgFinal = Math.floor(data.fistDamage.base + (data.fistDamage.mult * (data.stats.Strength.mod * 2)));
                break;
            case "presence":
                data.unarmedDmgFinal = Math.floor(data.fistDamage.base + (data.fistDamage.mult * ((data.presence * 2) +  data.stats.Power.mod)));
                break;
            default:
                data.unarmedDmgFinal = 0;
                break;
        }



        // Psychic Points
        data.ppbonus = pp;
        data.finalpp = Math.floor(data.ppoint.base + data.ppoint.spec + data.ppbonus);
        data.innateSlotspp = Math.floor(data.other.innateSlots * 2);
        data.maxFreepp = Math.floor(data.finalpp - (+usedpp + data.ppotentialpp + +matrixpp + data.innateSlotspp));





        // Settings
        data.openRangeFinal = Math.floor(data.rollRange.base + data.rollRange.spec + data.rollRange.temp);
        data.fumbleRangeFinal = Math.floor(data.fumleRange.base + data.fumleRange.spec + data.fumleRange.temp);


        // Reload Items to get Atk/Def
        this.items.reduce((arr, item) => {
            if (item.type === "weapon") {
                item.prepareData();
            }
        });
    }
}
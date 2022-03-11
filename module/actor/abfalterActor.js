export default class abfalterActor extends Actor {
    prepareData() {
        super.prepareData();
    }

    prepareDerivedData() {
        const actorData = this.data;
        this._prepareCharacterData(actorData);
    }

    _prepareCharacterData(actorData) {
        const data = actorData.data;
        const stats = data.stats;

        // Determine Class Level Bonusses --find a more efficient way?
        const [level, lpbonus, ini, atk, dod, blk, weararm, mk, pp, zeon, summon, control, bind, banish,
            acro, athle, climb, jump, ride, swim, etiq, intim, leader, persua, street, style, trading,
            notice, search, track, animals, appra, archi, herb, hist, law, magicapr, medic, mem, navi, occ,
            science, tactic, comp, fos, wstp, disg, hide, lock, poisn, stealth, theft, trapl, alche, anims,
            art, dance, forgi, jewel, music, runes, ritcal, soh, tailoring] = this.items.reduce((arr, item) => {
            if (item.type === "class") {
                const classLevels = parseInt(item.data.data.main.levels) || 0;
                arr[0] += classLevels;
                arr[1] += classLevels * (parseInt(item.data.data.main.lp) || 0);
                arr[2] += classLevels * (parseInt(item.data.data.main.initiative) || 0);
                arr[3] += classLevels * (parseInt(item.data.data.main.attack) || 0);
                arr[4] += classLevels * (parseInt(item.data.data.main.dodge) || 0);
                arr[5] += classLevels * (parseInt(item.data.data.main.block) || 0);
                arr[6] += classLevels * (parseInt(item.data.data.main.weararmor) || 0);
                arr[7] += classLevels * (parseInt(item.data.data.main.mk) || 0);
                arr[8] += classLevels * (parseInt(item.data.data.main.pp) || 0);
                arr[9] += classLevels * (parseInt(item.data.data.main.zeon) || 0);
                arr[10] += classLevels * (parseInt(item.data.data.main.summon) || 0);
                arr[11] += classLevels * (parseInt(item.data.data.main.control) || 0);
                arr[12] += classLevels * (parseInt(item.data.data.main.bind) || 0);
                arr[13] += classLevels * (parseInt(item.data.data.main.banish) || 0);
                arr[14] += classLevels * (parseInt(item.data.data.secondary.acro) || 0);
                arr[15] += classLevels * (parseInt(item.data.data.secondary.athleticism) || 0);
                arr[16] += classLevels * (parseInt(item.data.data.secondary.climb) || 0);
                arr[17] += classLevels * (parseInt(item.data.data.secondary.jump) || 0);
                arr[18] += classLevels * (parseInt(item.data.data.secondary.ride) || 0);
                arr[19] += classLevels * (parseInt(item.data.data.secondary.swim) || 0);
                arr[20] += classLevels * (parseInt(item.data.data.secondary.etiquette) || 0);
                arr[21] += classLevels * (parseInt(item.data.data.secondary.intimidate) || 0);
                arr[22] += classLevels * (parseInt(item.data.data.secondary.leadership) || 0);
                arr[23] += classLevels * (parseInt(item.data.data.secondary.persuasion) || 0);
                arr[24] += classLevels * (parseInt(item.data.data.secondary.streetwise) || 0);
                arr[25] += classLevels * (parseInt(item.data.data.secondary.style) || 0);
                arr[26] += classLevels * (parseInt(item.data.data.secondary.trading) || 0);
                arr[27] += classLevels * (parseInt(item.data.data.secondary.notice) || 0);
                arr[28] += classLevels * (parseInt(item.data.data.secondary.search) || 0);
                arr[29] += classLevels * (parseInt(item.data.data.secondary.track) || 0);
                arr[30] += classLevels * (parseInt(item.data.data.secondary.animals) || 0);
                arr[31] += classLevels * (parseInt(item.data.data.secondary.appraisal) || 0);
                arr[32] += classLevels * (parseInt(item.data.data.secondary.architecture) || 0);
                arr[33] += classLevels * (parseInt(item.data.data.secondary.herballore) || 0);
                arr[34] += classLevels * (parseInt(item.data.data.secondary.history) || 0);
                arr[35] += classLevels * (parseInt(item.data.data.secondary.law) || 0);
                arr[36] += classLevels * (parseInt(item.data.data.secondary.magicappr) || 0);
                arr[37] += classLevels * (parseInt(item.data.data.secondary.medicine) || 0);
                arr[38] += classLevels * (parseInt(item.data.data.secondary.memorize) || 0);
                arr[39] += classLevels * (parseInt(item.data.data.secondary.navigation) || 0);
                arr[40] += classLevels * (parseInt(item.data.data.secondary.occult) || 0);
                arr[41] += classLevels * (parseInt(item.data.data.secondary.science) || 0);
                arr[42] += classLevels * (parseInt(item.data.data.secondary.tactics) || 0);
                arr[43] += classLevels * (parseInt(item.data.data.secondary.composure) || 0);
                arr[44] += classLevels * (parseInt(item.data.data.secondary.featsofstr) || 0);
                arr[45] += classLevels * (parseInt(item.data.data.secondary.withstpain) || 0);
                arr[46] += classLevels * (parseInt(item.data.data.secondary.disguise) || 0);
                arr[47] += classLevels * (parseInt(item.data.data.secondary.hide) || 0);
                arr[48] += classLevels * (parseInt(item.data.data.secondary.lockpicking) || 0);
                arr[49] += classLevels * (parseInt(item.data.data.secondary.poisons) || 0);
                arr[50] += classLevels * (parseInt(item.data.data.secondary.stealth) || 0);
                arr[51] += classLevels * (parseInt(item.data.data.secondary.theft) || 0);
                arr[52] += classLevels * (parseInt(item.data.data.secondary.traplore) || 0);
                arr[53] += classLevels * (parseInt(item.data.data.secondary.alchemy) || 0);
                arr[54] += classLevels * (parseInt(item.data.data.secondary.animism) || 0);
                arr[55] += classLevels * (parseInt(item.data.data.secondary.art) || 0);
                arr[56] += classLevels * (parseInt(item.data.data.secondary.dance) || 0);
                arr[57] += classLevels * (parseInt(item.data.data.secondary.forging) || 0);
                arr[58] += classLevels * (parseInt(item.data.data.secondary.jewelry) || 0);
                arr[59] += classLevels * (parseInt(item.data.data.secondary.music) || 0);
                arr[60] += classLevels * (parseInt(item.data.data.secondary.runes) || 0);
                arr[61] += classLevels * (parseInt(item.data.data.secondary.ritualcalig) || 0);
                arr[62] += classLevels * (parseInt(item.data.data.secondary.slofhand) || 0);
                arr[63] += classLevels * (parseInt(item.data.data.secondary.tailoring) || 0);

            }
            return arr;
            }, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0]);
        data.level = level;
        data.lpbonus = lpbonus;
        data.inibonus = ini;
        data.attackbonus = atk;
        data.dodgebonus = dod;
        data.blockbonus = blk;
        data.weararmorbonus = weararm;
        data.mkbonus = mk; //unused
        data.ppbonus = pp; //unused
        data.zeonbonus = zeon;
        data.summonbonus = summon;
        data.controlbonus = control;
        data.bindbonus = bind;
        data.banishbonus = banish;
        data.acrobaticsbonus = acro;
        data.athleticismbonus = athle;
        data.climbbonus = climb;
        data.jumpbonus = jump;
        data.ridebonus = ride;
        data.swimbonus = swim;
        data.etiquettebonus = etiq;
        data.intimidatebonus = intim;
        data.leadershipbonus = leader;
        data.persuasionbonus = persua;
        data.streetwisebonus = street;
        data.stylebonus = style;
        data.tradingbonus = trading;
        data.noticebonus = notice;
        data.searchbonus = search;
        data.trackbonus = track;
        data.animalsbonus = animals;
        data.appraisalbonus = appra;
        data.architecturebonus = archi;
        data.herballorebonus = herb;
        data.historybonus = hist;
        data.lawbonus = law;
        data.magicapprbonus = magicapr;
        data.medicinebonus = medic;
        data.memorizebonus = mem;
        data.navigationbonus = navi;
        data.occultbonus = occ;
        data.sciencebonus = science;
        data.tacticsbonus = tactic;
        data.composurebonus = comp;
        data.featsofstrbonus = fos;
        data.withstpainbonus = wstp;
        data.disguisebonus = disg;
        data.hidebonus = hide;
        data.lockpickingbonus = lock;
        data.poisonsbonus = poisn;
        data.stealthbonus = stealth;
        data.theftbonus = theft;
        data.traplorebonus = trapl;
        data.alchemybonus = alche;
        data.animismbonus = anims;
        data.artbonus = art;
        data.dancebonus = dance;
        data.forgingbonus = forgi;
        data.jewelrybonus = jewel;
        data.musicbonus = music;
        data.runesbonus = runes;
        data.ritualcaligbonus = ritcal;
        data.slofhandbonus = soh;
        data.tailoringbonus = tailoring;

        // Characteristics & Mods
        for (let [key, stat] of Object.entries(data.stats)) {
            stat.final = Math.floor(stat.base + stat.spec + stat.temp);
            switch (stat.final) {
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
                default:
                    stat.mod = 0;
            }
            stat.opposedfinal = Math.floor((stat.final + stat.opposed) + (data.aam / 20));
        }

        //Stuff Xp, Presence, Next lvl Xp
        if (data.level == 0) {
            data.dp = 400;
        } else {
            data.dp = Math.floor((data.level * 100) + 500);
        }
        data.presence = Math.floor((data.dp / 20) + data.levelinfo.presencemod);
        data.nextlevel = Math.floor(((data.level + data.levelinfo.levelmod) * 25) + 75);

        //Resistances
        for (let [key, res] of Object.entries(data.resistances)) {
            switch (key) {
                case "Physical":
                    res.short = "PhR";
                    res.final = Math.floor(data.presence + res.mod + stats.Constitution.mod);
                    break;
                case "Disease":
                    res.short = "DR";
                    res.final = Math.floor(data.presence + res.mod + stats.Constitution.mod);
                    break;
                case "Poison":
                    res.short = "PsnR";
                    res.final = Math.floor(data.presence + res.mod + stats.Constitution.mod);
                    break;
                case "Magic":
                    res.short = "MR";
                    res.final = Math.floor(data.presence + res.mod + stats.Power.mod);
                    break;
                case "Psychic":
                    res.short = "PsyR";
                    res.final = Math.floor(data.presence + res.mod + stats.Willpower.mod);
                    break;
                default:
                    break;
            }
        }

        //Calculating Number of Actions
        const actnumcalc = data.stats.Agility.base + data.stats.Dexterity.base;
        switch (actnumcalc) {
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

        //Movement
        if (data.aam > -20) {
            data.finalmove = Math.floor(data.stats.Agility.final + data.movement.spec + data.movement.temp - data.movement.pen);
        } else {
            data.finalmove = Math.floor(data.stats.Agility.final + data.movement.spec + data.movement.temp - data.movement.pen + (data.aam / 20));
        }
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

        //Lifepoint Calculation
        data.lpbase = Math.floor(25 + 10 * data.stats.Constitution.final + data.stats.Constitution.mod - Math.ceil((data.stats.Constitution.final - 1) / data.stats.Constitution.final) * 5);
        data.lpfinal = Math.floor(data.lpbase + lpbonus + data.lifepoints.spec + data.lifepoints.temp + Math.ceil(data.lifepoints.multiple * data.stats.Constitution.final));

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
        data.regenfinal = Math.floor(data.regenbase + data.regeneration.spec + data.regeneration.temp);
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

        // Attack, Block, & Dodge
        data.atkfinal = Math.floor(data.combatstats.atkbase + data.attackbonus + data.combatstats.atkspecial + data.combatstats.atktemp + data.stats.Dexterity.mod + data.aam);
        data.blkfinal = Math.floor(data.combatstats.blkbase + data.blockbonus + data.combatstats.blkspecial + data.combatstats.blktemp + data.stats.Dexterity.mod + data.aam);
        data.dodfinal = Math.floor(data.combatstats.dodbase + data.dodgebonus + data.combatstats.dodspecial + data.combatstats.dodtemp + data.stats.Agility.mod + data.aam);

        // Initiative


        /**
            Secondaries
        */
        // Acrobatics
        data.acrobaticsnat = Math.floor(stats.Agility.mod + data.secondary.acrobatics.natural + Math.ceil(data.secondary.acrobatics.nat * stats.Agility.mod));
        if (data.acrobaticsnat < 100) {
            data.acrobaticsnatfinal = data.acrobaticsnat;
        } else {
            data.acrobaticsnatfinal = 100;
        }
        data.acrofinal = Math.floor(data.secondary.acrobatics.temp + data.secondary.acrobatics.spec + data.secondary.acrobatics.base + data.acrobaticsbonus + data.acrobaticsnatfinal + data.aam);

        // Athelticism
        data.athleticismnat = Math.floor(stats.Agility.mod + data.secondary.athleticism.natural + Math.ceil(data.secondary.athleticism.nat * stats.Agility.mod));
        if (data.athleticismnat < 100) {
            data.athleticismnatfinal = data.athleticismnat;
        } else {
            data.athleticismnatfinal = 100;
        }
        data.athleticismfinal = Math.floor(data.secondary.athleticism.temp + data.secondary.athleticism.spec + data.secondary.athleticism.base + data.athleticismbonus + data.athleticismnatfinal + data.aam);

        // Climb
        data.climbnat = Math.floor(stats.Agility.mod + data.secondary.climb.natural + Math.ceil(data.secondary.climb.nat * stats.Agility.mod));
        if (data.climbnat < 100) {
            data.climbnatfinal = data.climbnat;
        } else {
            data.climbnatfinal = 100;
        }
        data.climbfinal = Math.floor(data.secondary.climb.temp + data.secondary.climb.spec + data.secondary.climb.base + data.climbbonus + data.climbnatfinal + data.aam);

        // Jump
        data.jumpnat = Math.floor(stats.Strength.mod + data.secondary.jump.natural + Math.ceil(data.secondary.jump.nat * stats.Strength.mod));
        if (data.jumpnat < 100) {
            data.jumpnatfinal = data.jumpnat;
        } else {
            data.jumpnatfinal = 100;
        }
        data.jumpfinal = Math.floor(data.secondary.jump.temp + data.secondary.jump.spec + data.secondary.jump.base + data.jumpbonus + data.jumpnatfinal + data.aam);

        // Ride
        data.ridenat = Math.floor(stats.Agility.mod + data.secondary.ride.natural + Math.ceil(data.secondary.ride.nat * stats.Agility.mod));
        if (data.ridenat < 100) {
            data.ridenatfinal = data.ridenat;
        } else {
            data.ridenatfinal = 100;
        }
        data.ridefinal = Math.floor(data.secondary.ride.temp + data.secondary.ride.spec + data.secondary.ride.base + data.ridebonus + data.ridenatfinal + data.aam);

        // Swim
        data.swimnat = Math.floor(stats.Agility.mod + data.secondary.swim.natural + Math.ceil(data.secondary.swim.nat * stats.Agility.mod));
        if (data.swimnat < 100) {
            data.swimnatfinal = data.swimnat;
        } else {
            data.swimnatfinal = 100;
        }
        data.swimfinal = Math.floor(data.secondary.swim.temp + data.secondary.swim.spec + data.secondary.swim.base + data.swimbonus + data.swimnatfinal + data.aam);

        // etiquette
        data.etiquettenat = Math.floor(stats.Intelligence.mod + data.secondary.etiquette.natural + Math.ceil(data.secondary.etiquette.nat * stats.Intelligence.mod));
        if (data.etiquettenat < 100) {
            data.etiquettenatfinal = data.etiquettenat;
        } else {
            data.etiquettenatfinal = 100;
        }
        data.etiquettefinal = Math.floor(data.secondary.etiquette.temp + data.secondary.etiquette.spec + data.secondary.etiquette.base + data.etiquettebonus + data.etiquettenatfinal + data.aam);

        // Intimidate
        data.intimidatenat = Math.floor(stats.Willpower.mod + data.secondary.intimidate.natural + Math.ceil(data.secondary.intimidate.nat * stats.Willpower.mod));
        if (data.intimidatenat < 100) {
            data.intimidatenatfinal = data.intimidatenat;
        } else {
            data.intimidatenatfinal = 100;
        }
        data.intimidatefinal = Math.floor(data.secondary.intimidate.temp + data.secondary.intimidate.spec + data.secondary.intimidate.base + data.intimidatebonus + data.intimidatenatfinal + data.aam);

        // Leadership
        data.leadershipnat = Math.floor(stats.Power.mod + data.secondary.leadership.natural + Math.ceil(data.secondary.leadership.nat * stats.Power.mod));
        if (data.leadershipnat < 100) {
            data.leadershipnatfinal = data.leadershipnat;
        } else {
            data.leadershipnatfinal = 100;
        }
        data.leadershipfinal = Math.floor(data.secondary.leadership.temp + data.secondary.leadership.spec + data.secondary.leadership.base + data.leadershipbonus + data.leadershipnatfinal + data.aam);

        // persuasion
        data.persuasionnat = Math.floor(stats.Intelligence.mod + data.secondary.persuasion.natural + Math.ceil(data.secondary.persuasion.nat * stats.Intelligence.mod));
        if (data.persuasionnat < 100) {
            data.persuasionnatfinal = data.persuasionnat;
        } else {
            data.persuasionnatfinal = 100;
        }
        data.persuasionfinal = Math.floor(data.secondary.persuasion.temp + data.secondary.persuasion.spec + data.secondary.persuasion.base + data.persuasionbonus + data.persuasionnatfinal + data.aam);

        // streetwise
        data.streetwisenat = Math.floor(stats.Intelligence.mod + data.secondary.streetwise.natural + Math.ceil(data.secondary.streetwise.nat * stats.Intelligence.mod));
        if (data.streetwisenat < 100) {
            data.streetwisenatfinal = data.streetwisenat;
        } else {
            data.streetwisenatfinal = 100;
        }
        data.streetwisefinal = Math.floor(data.secondary.streetwise.temp + data.secondary.streetwise.spec + data.secondary.streetwise.base + data.streetwisebonus + data.streetwisenatfinal + data.aam);

        // style
        data.stylenat = Math.floor(stats.Power.mod + data.secondary.style.natural + Math.ceil(data.secondary.style.nat * stats.Power.mod));
        if (data.stylenat < 100) {
            data.stylenatfinal = data.stylenat;
        } else {
            data.stylenatfinal = 100;
        }
        data.stylefinal = Math.floor(data.secondary.style.temp + data.secondary.style.spec + data.secondary.style.base + data.stylebonus + data.stylenatfinal + data.aam);

        // trading
        data.tradingnat = Math.floor(stats.Intelligence.mod + data.secondary.trading.natural + Math.ceil(data.secondary.trading.nat * stats.Intelligence.mod));
        if (data.tradingnat < 100) {
            data.tradingnatfinal = data.tradingnat;
        } else {
            data.tradingnatfinal = 100;
        }
        data.tradingfinal = Math.floor(data.secondary.trading.temp + data.secondary.trading.spec + data.secondary.trading.base + data.tradingbonus + data.tradingnatfinal + data.aam);

        // notice
        data.noticenat = Math.floor(stats.Perception.mod + data.secondary.notice.natural + Math.ceil(data.secondary.notice.nat * stats.Perception.mod));
        if (data.noticenat < 100) {
            data.noticenatfinal = data.noticenat;
        } else {
            data.noticenatfinal = 100;
        }
        data.noticefinal = Math.floor(data.secondary.notice.temp + data.secondary.notice.spec + data.secondary.notice.base + data.noticebonus + data.noticenatfinal + data.aam);

        // search
        data.searchnat = Math.floor(stats.Perception.mod + data.secondary.search.natural + Math.ceil(data.secondary.search.nat * stats.Perception.mod));
        if (data.searchnat < 100) {
            data.searchnatfinal = data.searchnat;
        } else {
            data.searchnatfinal = 100;
        }
        data.searchfinal = Math.floor(data.secondary.search.temp + data.secondary.search.spec + data.secondary.search.base + data.searchbonus + data.searchnatfinal + data.aam);

        // track
        data.tracknat = Math.floor(stats.Perception.mod + data.secondary.track.natural + Math.ceil(data.secondary.track.nat * stats.Perception.mod));
        if (data.tracknat < 100) {
            data.tracknatfinal = data.tracknat;
        } else {
            data.tracknatfinal = 100;
        }
        data.trackfinal = Math.floor(data.secondary.track.temp + data.secondary.track.spec + data.secondary.track.base + data.trackbonus + data.tracknatfinal + data.aam);

        // animals
        data.animalsnat = Math.floor(stats.Intelligence.mod + data.secondary.animals.natural + Math.ceil(data.secondary.animals.nat * stats.Intelligence.mod));
        if (data.animalsnat < 100) {
            data.animalsnatfinal = data.animalsnat;
        } else {
            data.animalsnatfinal = 100;
        }
        data.animalsfinal = Math.floor(data.secondary.animals.temp + data.secondary.animals.spec + data.secondary.animals.base + data.animalsbonus + data.animalsnatfinal + data.aam);

        // appraisal
        data.appraisalnat = Math.floor(stats.Intelligence.mod + data.secondary.appraisal.natural + Math.ceil(data.secondary.appraisal.nat * stats.Intelligence.mod));
        if (data.appraisalnat < 100) {
            data.appraisalnatfinal = data.appraisalnat;
        } else {
            data.appraisalnatfinal = 100;
        }
        data.appraisalfinal = Math.floor(data.secondary.appraisal.temp + data.secondary.appraisal.spec + data.secondary.appraisal.base + data.appraisalbonus + data.appraisalnatfinal + data.aam);

        // architecture
        data.architecturenat = Math.floor(stats.Intelligence.mod + data.secondary.architecture.natural + Math.ceil(data.secondary.architecture.nat * stats.Intelligence.mod));
        if (data.architecturenat < 100) {
            data.architecturenatfinal = data.architecturenat;
        } else {
            data.architecturenatfinal = 100;
        }
        data.architecturefinal = Math.floor(data.secondary.architecture.temp + data.secondary.architecture.spec + data.secondary.architecture.base + data.architecturebonus + data.architecturenatfinal + data.aam);

        // herballore
        data.herballorenat = Math.floor(stats.Intelligence.mod + data.secondary.herballore.natural + Math.ceil(data.secondary.herballore.nat * stats.Intelligence.mod));
        if (data.herballorenat < 100) {
            data.herballorenatfinal = data.herballorenat;
        } else {
            data.herballorenatfinal = 100;
        }
        data.herballorefinal = Math.floor(data.secondary.herballore.temp + data.secondary.herballore.spec + data.secondary.herballore.base + data.herballorebonus + data.herballorenatfinal + data.aam);

        // history
        data.historynat = Math.floor(stats.Intelligence.mod + data.secondary.history.natural + Math.ceil(data.secondary.history.nat * stats.Intelligence.mod));
        if (data.historynat < 100) {
            data.historynatfinal = data.historynat;
        } else {
            data.historynatfinal = 100;
        }
        data.historyfinal = Math.floor(data.secondary.history.temp + data.secondary.history.spec + data.secondary.history.base + data.historybonus + data.historynatfinal + data.aam);

        // law
        data.lawnat = Math.floor(stats.Intelligence.mod + data.secondary.law.natural + Math.ceil(data.secondary.law.nat * stats.Intelligence.mod));
        if (data.lawnat < 100) {
            data.lawnatfinal = data.lawnat;
        } else {
            data.lawnatfinal = 100;
        }
        data.lawfinal = Math.floor(data.secondary.law.temp + data.secondary.law.spec + data.secondary.law.base + data.lawbonus + data.lawnatfinal + data.aam);

        // magicappr
        data.magicapprnat = Math.floor(stats.Power.mod + data.secondary.magicappr.natural + Math.ceil(data.secondary.magicappr.nat * stats.Power.mod));
        if (data.magicapprnat < 100) {
            data.magicapprnatfinal = data.magicapprnat;
        } else {
            data.magicapprnatfinal = 100;
        }
        data.magicapprfinal = Math.floor(data.secondary.magicappr.temp + data.secondary.magicappr.spec + data.secondary.magicappr.base + data.magicapprbonus + data.magicapprnatfinal + data.aam);

        // medicine
        data.medicinenat = Math.floor(stats.Intelligence.mod + data.secondary.medicine.natural + Math.ceil(data.secondary.medicine.nat * stats.Intelligence.mod));
        if (data.medicinenat < 100) {
            data.medicinenatfinal = data.medicinenat;
        } else {
            data.medicinenatfinal = 100;
        }
        data.medicinefinal = Math.floor(data.secondary.medicine.temp + data.secondary.medicine.spec + data.secondary.medicine.base + data.medicinebonus + data.medicinenatfinal + data.aam);

        // memorize
        data.memorizenat = Math.floor(stats.Intelligence.mod + data.secondary.memorize.natural + Math.ceil(data.secondary.memorize.nat * stats.Intelligence.mod));
        if (data.memorizenat < 100) {
            data.memorizenatfinal = data.memorizenat;
        } else {
            data.memorizenatfinal = 100;
        }
        data.memorizefinal = Math.floor(data.secondary.memorize.temp + data.secondary.memorize.spec + data.secondary.memorize.base + data.memorizebonus + data.memorizenatfinal + data.aam);

        // navigation
        data.navigationnat = Math.floor(stats.Intelligence.mod + data.secondary.navigation.natural + Math.ceil(data.secondary.navigation.nat * stats.Intelligence.mod));
        if (data.navigationnat < 100) {
            data.navigationnatfinal = data.navigationnat;
        } else {
            data.navigationnatfinal = 100;
        }
        data.navigationfinal = Math.floor(data.secondary.navigation.temp + data.secondary.navigation.spec + data.secondary.navigation.base + data.navigationbonus + data.navigationnatfinal + data.aam);

        // occult
        data.occultnat = Math.floor(stats.Intelligence.mod + data.secondary.occult.natural + Math.ceil(data.secondary.occult.nat * stats.Intelligence.mod));
        if (data.occultnat < 100) {
            data.occultnatfinal = data.occultnat;
        } else {
            data.occultnatfinal = 100;
        }
        data.occultfinal = Math.floor(data.secondary.occult.temp + data.secondary.occult.spec + data.secondary.occult.base + data.occultbonus + data.occultnatfinal + data.aam);

        // science
        data.sciencenat = Math.floor(stats.Intelligence.mod + data.secondary.science.natural + Math.ceil(data.secondary.science.nat * stats.Intelligence.mod));
        if (data.sciencenat < 100) {
            data.sciencenatfinal = data.sciencenat;
        } else {
            data.sciencenatfinal = 100;
        }
        data.sciencefinal = Math.floor(data.secondary.science.temp + data.secondary.science.spec + data.secondary.science.base + data.sciencebonus + data.sciencenatfinal + data.aam);

        // tactics
        data.tacticsnat = Math.floor(stats.Intelligence.mod + data.secondary.tactics.natural + Math.ceil(data.secondary.tactics.nat * stats.Intelligence.mod));
        if (data.tacticsnat < 100) {
            data.tacticsnatfinal = data.tacticsnat;
        } else {
            data.tacticsnatfinal = 100;
        }
        data.tacticsfinal = Math.floor(data.secondary.tactics.temp + data.secondary.tactics.spec + data.secondary.tactics.base + data.tacticsbonus + data.tacticsnatfinal + data.aam);

        // composure
        data.composurenat = Math.floor(stats.Willpower.mod + data.secondary.composure.natural + Math.ceil(data.secondary.composure.nat * stats.Willpower.mod));
        if (data.composurenat < 100) {
            data.composurenatfinal = data.composurenat;
        } else {
            data.composurenatfinal = 100;
        }
        data.composurefinal = Math.floor(data.secondary.composure.temp + data.secondary.composure.spec + data.secondary.composure.base + data.composurebonus + data.composurenatfinal + data.aam);

        // featsofstr
        data.featsofstrnat = Math.floor(stats.Strength.mod + data.secondary.featsofstr.natural + Math.ceil(data.secondary.featsofstr.nat * stats.Strength.mod));
        if (data.featsofstrnat < 100) {
            data.featsofstrnatfinal = data.featsofstrnat;
        } else {
            data.featsofstrnatfinal = 100;
        }
        data.featsofstrfinal = Math.floor(data.secondary.featsofstr.temp + data.secondary.featsofstr.spec + data.secondary.featsofstr.base + data.featsofstrbonus + data.featsofstrnatfinal + data.aam);

        // withstpain
        data.withstpainnat = Math.floor(stats.Willpower.mod + data.secondary.withstpain.natural + Math.ceil(data.secondary.withstpain.nat * stats.Willpower.mod));
        if (data.withstpainnat < 100) {
            data.withstpainnatfinal = data.withstpainnat;
        } else {
            data.withstpainnatfinal = 100;
        }
        data.withstpainfinal = Math.floor(data.secondary.withstpain.temp + data.secondary.withstpain.spec + data.secondary.withstpain.base + data.withstpainbonus + data.withstpainnatfinal + data.aam);

        // disguise
        data.disguisenat = Math.floor(stats.Dexterity.mod + data.secondary.disguise.natural + Math.ceil(data.secondary.disguise.nat * stats.Dexterity.mod));
        if (data.disguisenat < 100) {
            data.disguisenatfinal = data.disguisenat;
        } else {
            data.disguisenatfinal = 100;
        }
        data.disguisefinal = Math.floor(data.secondary.disguise.temp + data.secondary.disguise.spec + data.secondary.disguise.base + data.disguisebonus + data.disguisenatfinal + data.aam);

        // hide
        data.hidenat = Math.floor(stats.Perception.mod + data.secondary.hide.natural + Math.ceil(data.secondary.hide.nat * stats.Perception.mod));
        if (data.hidenat < 100) {
            data.hidenatfinal = data.hidenat;
        } else {
            data.hidenatfinal = 100;
        }
        data.hidefinal = Math.floor(data.secondary.hide.temp + data.secondary.hide.spec + data.secondary.hide.base + data.hidebonus + data.hidenatfinal + data.aam);

        // lockpicking
        data.lockpickingnat = Math.floor(stats.Dexterity.mod + data.secondary.lockpicking.natural + Math.ceil(data.secondary.lockpicking.nat * stats.Dexterity.mod));
        if (data.lockpickingnat < 100) {
            data.lockpickingnatfinal = data.lockpickingnat;
        } else {
            data.lockpickingnatfinal = 100;
        }
        data.lockpickingfinal = Math.floor(data.secondary.lockpicking.temp + data.secondary.lockpicking.spec + data.secondary.lockpicking.base + data.lockpickingbonus + data.lockpickingnatfinal + data.aam);

        // poisons
        data.poisonsnat = Math.floor(stats.Intelligence.mod + data.secondary.poisons.natural + Math.ceil(data.secondary.poisons.nat * stats.Intelligence.mod));
        if (data.poisonsnat < 100) {
            data.poisonsnatfinal = data.poisonsnat;
        } else {
            data.poisonsnatfinal = 100;
        }
        data.poisonsfinal = Math.floor(data.secondary.poisons.temp + data.secondary.poisons.spec + data.secondary.poisons.base + data.poisonsbonus + data.poisonsnatfinal + data.aam);

        // stealth
        data.stealthnat = Math.floor(stats.Agility.mod + data.secondary.stealth.natural + Math.ceil(data.secondary.stealth.nat * stats.Agility.mod));
        if (data.stealthnat < 100) {
            data.stealthnatfinal = data.stealthnat;
        } else {
            data.stealthnatfinal = 100;
        }
        data.stealthfinal = Math.floor(data.secondary.stealth.temp + data.secondary.stealth.spec + data.secondary.stealth.base + data.stealthbonus + data.stealthnatfinal + data.aam);

        // theft
        data.theftnat = Math.floor(stats.Dexterity.mod + data.secondary.theft.natural + Math.ceil(data.secondary.theft.nat * stats.Dexterity.mod));
        if (data.theftnat < 100) {
            data.theftnatfinal = data.theftnat;
        } else {
            data.theftnatfinal = 100;
        }
        data.theftfinal = Math.floor(data.secondary.theft.temp + data.secondary.theft.spec + data.secondary.theft.base + data.theftbonus + data.theftnatfinal + data.aam);

        // traplore
        data.traplorenat = Math.floor(stats.Dexterity.mod + data.secondary.traplore.natural + Math.ceil(data.secondary.traplore.nat * stats.Dexterity.mod));
        if (data.traplorenat < 100) {
            data.traplorenatfinal = data.traplorenat;
        } else {
            data.traplorenatfinal = 100;
        }
        data.traplorefinal = Math.floor(data.secondary.traplore.temp + data.secondary.traplore.spec + data.secondary.traplore.base + data.traplorebonus + data.traplorenatfinal + data.aam);

        // alchemy
        data.alchemynat = Math.floor(stats.Intelligence.mod + data.secondary.alchemy.natural + Math.ceil(data.secondary.alchemy.nat * stats.Intelligence.mod));
        if (data.alchemynat < 100) {
            data.alchemynatfinal = data.alchemynat;
        } else {
            data.alchemynatfinal = 100;
        }
        data.alchemyfinal = Math.floor(data.secondary.alchemy.temp + data.secondary.alchemy.spec + data.secondary.alchemy.base + data.alchemybonus + data.alchemynatfinal + data.aam);

        // animism
        data.animismnat = Math.floor(stats.Power.mod + data.secondary.animism.natural + Math.ceil(data.secondary.animism.nat * stats.Power.mod));
        if (data.animismnat < 100) {
            data.animismnatfinal = data.animismnat;
        } else {
            data.animismnatfinal = 100;
        }
        data.animismfinal = Math.floor(data.secondary.animism.temp + data.secondary.animism.spec + data.secondary.animism.base + data.animismbonus + data.animismnatfinal + data.aam);

        // art
        data.artnat = Math.floor(stats.Power.mod + data.secondary.art.natural + Math.ceil(data.secondary.art.nat * stats.Power.mod));
        if (data.artnat < 100) {
            data.artnatfinal = data.artnat;
        } else {
            data.artnatfinal = 100;
        }
        data.artfinal = Math.floor(data.secondary.art.temp + data.secondary.art.spec + data.secondary.art.base + data.artbonus + data.artnatfinal + data.aam);

        // dance
        data.dancenat = Math.floor(stats.Agility.mod + data.secondary.dance.natural + Math.ceil(data.secondary.dance.nat * stats.Agility.mod));
        if (data.dancenat < 100) {
            data.dancenatfinal = data.dancenat;
        } else {
            data.dancenatfinal = 100;
        }
        data.dancefinal = Math.floor(data.secondary.dance.temp + data.secondary.dance.spec + data.secondary.dance.base + data.dancebonus + data.dancenatfinal + data.aam);

        // forging
        data.forgingnat = Math.floor(stats.Dexterity.mod + data.secondary.forging.natural + Math.ceil(data.secondary.forging.nat * stats.Dexterity.mod));
        if (data.forgingnat < 100) {
            data.forgingnatfinal = data.forgingnat;
        } else {
            data.forgingnatfinal = 100;
        }
        data.forgingfinal = Math.floor(data.secondary.forging.temp + data.secondary.forging.spec + data.secondary.forging.base + data.forgingbonus + data.forgingnatfinal + data.aam);

        // jewelry
        data.jewelrynat = Math.floor(stats.Dexterity.mod + data.secondary.jewelry.natural + Math.ceil(data.secondary.jewelry.nat * stats.Dexterity.mod));
        if (data.jewelrynat < 100) {
            data.jewelrynatfinal = data.jewelrynat;
        } else {
            data.jewelrynatfinal = 100;
        }
        data.jewelryfinal = Math.floor(data.secondary.jewelry.temp + data.secondary.jewelry.spec + data.secondary.jewelry.base + data.jewelrybonus + data.jewelrynatfinal + data.aam);

        // music
        data.musicnat = Math.floor(stats.Power.mod + data.secondary.music.natural + Math.ceil(data.secondary.music.nat * stats.Power.mod));
        if (data.musicnat < 100) {
            data.musicnatfinal = data.musicnat;
        } else {
            data.musicnatfinal = 100;
        }
        data.musicfinal = Math.floor(data.secondary.music.temp + data.secondary.music.spec + data.secondary.music.base + data.musicbonus + data.musicnatfinal + data.aam);

        // runes
        data.runesnat = Math.floor(stats.Dexterity.mod + data.secondary.runes.natural + Math.ceil(data.secondary.runes.nat * stats.Dexterity.mod));
        if (data.runesnat < 100) {
            data.runesnatfinal = data.runesnat;
        } else {
            data.runesnatfinal = 100;
        }
        data.runesfinal = Math.floor(data.secondary.runes.temp + data.secondary.runes.spec + data.secondary.runes.base + data.runesbonus + data.runesnatfinal + data.aam);

        // ritualcalig
        data.ritualcalignat = Math.floor(stats.Dexterity.mod + data.secondary.ritualcalig.natural + Math.ceil(data.secondary.ritualcalig.nat * stats.Dexterity.mod));
        if (data.ritualcalignat < 100) {
            data.ritualcalignatfinal = data.ritualcalignat;
        } else {
            data.ritualcalignatfinal = 100;
        }
        data.ritualcaligfinal = Math.floor(data.secondary.ritualcalig.temp + data.secondary.ritualcalig.spec + data.secondary.ritualcalig.base + data.ritualcaligbonus + data.ritualcalignatfinal + data.aam);

        // slofhand
        data.slofhandnat = Math.floor(stats.Dexterity.mod + data.secondary.slofhand.natural + Math.ceil(data.secondary.slofhand.nat * stats.Dexterity.mod));
        if (data.slofhandnat < 100) {
            data.slofhandnatfinal = data.slofhandnat;
        } else {
            data.slofhandnatfinal = 100;
        }
        data.slofhandfinal = Math.floor(data.secondary.slofhand.temp + data.secondary.slofhand.spec + data.secondary.slofhand.base + data.slofhandbonus + data.slofhandnatfinal + data.aam);

        // tailoring
        data.tailoringnat = Math.floor(stats.Dexterity.mod + data.secondary.tailoring.natural + Math.ceil(data.secondary.tailoring.nat * stats.Dexterity.mod));
        if (data.tailoringnat < 100) {
            data.tailoringnatfinal = data.tailoringnat;
        } else {
            data.tailoringnatfinal = 100;
        }
        data.tailoringfinal = Math.floor(data.secondary.tailoring.temp + data.secondary.tailoring.spec + data.secondary.tailoring.base + data.tailoringbonus + data.tailoringnatfinal + data.aam);

        /*
         * // z
        data.znat = Math.floor(stats.x.mod + data.secondary.z.natural + Math.ceil(data.secondary.z.nat * stats.x.mod));
        if (data.znat < 100) {
            data.znatfinal = data.znat;
        } else {
            data.znatfinal = 100;
        }
        data.zfinal = Math.floor(data.secondary.z.temp + data.secondary.z.spec + data.secondary.z.base + data.zbonus + data.znatfinal + data.aam);
         */

        // Magic Projection
        data.mprojfinal = Math.floor(data.mproj.base + data.mproj.spec + data.mproj.temp + data.aam + data.stats.Dexterity.mod);
        data.mprojfinaloff = Math.floor(data.mprojfinal + data.mproj.imbalance);
        data.mprojfinaldef = Math.floor(data.mprojfinal - data.mproj.imbalance);

        // Magic Accumulation
        switch (data.stats.Power.final) {
            case 5:
            case 6:
            case 7:
                data.maccupow = 5;
                break;
            case 8:
            case 9:
            case 10:
            case 11:
                data.maccupow = 10;
                break;
            case 12:
            case 13:
            case 14:
                data.maccupow = 15;
                break;
            case 15:
                data.maccupow = 20;
                break;
            case 16:
            case 17:
                data.maccupow = 25;
                break;
            case 18:
            case 19:
                data.maccupow = 30;
                break;
            case 20:
                data.maccupow = 35;
                break;
            default:
                data.maccupow = 0;
                break;
        }
        data.maccufinal = Math.floor(data.maccu.base + data.maccupow + (data.maccu.mult * data.maccupow) + data.maccu.spec + data.maccu.temp);
        data.maccuhalffinal = Math.floor(data.maccufinal / 2);
        data.mregenfinal = Math.floor(((data.maccufinal * data.mregen.regenmult) + data.mregen.spec + data.mregen.temp + data.maccufinal) * data.mregen.recoverymult);

        // Zeon
        switch (data.stats.Power.final) {
            case 1:
                data.zeonpow = 5;
                break;
            case 2:
                data.zeonpow = 20;
                break;
            case 3:
                data.zeonpow = 40;
                break;
            case 4:
                data.zeonpow = 55;
                break;
            case 5:
                data.zeonpow = 70;
                break;
            case 6:
                data.zeonpow = 85;
                break;
            case 7:
                data.zeonpow = 95;
                break;
            case 8:
                data.zeonpow = 110;
                break;
            case 9:
                data.zeonpow = 120;
                break;
            case 10:
                data.zeonpow = 135;
                break;
            case 11:
                data.zeonpow = 150;
                break;
            case 12:
                data.zeonpow = 160;
                break;
            case 13:
                data.zeonpow = 175;
                break;
            case 14:
                data.zeonpow = 185;
                break;
            case 15:
                data.zeonpow = 200;
                break;
            case 16:
                data.zeonpow = 215;
                break;
            case 17:
                data.zeonpow = 225;
                break;
            case 18:
                data.zeonpow = 240;
                break;
            case 19:
                data.zeonpow = 250;
                break;
            case 20:
                data.zeonpow = 260;
                break;
            default:
                data.zeonpow = 0;
                break;
        }
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
        data.mlevelfinal = Math.floor(data.mlevel.base + data.mlevel.spec + data.mlevel.temp + data.mlevelint);
        data.mlevelused = Math.floor(data.mlevelfinal - 1);

        // Summoning Abilities
        if (data.aam > 0) {
            data.summonfinal = Math.floor(data.summoning.summon.base + data.summonbonus + data.summoning.summon.spec + data.stats.Power.mod);
            data.controlfinal = Math.floor(data.summoning.control.base + data.controlbonus + data.summoning.control.spec + data.stats.Willpower.mod);
            data.bindfinal = Math.floor(data.summoning.bind.base + data.bindbonus + data.summoning.bind.spec + data.stats.Power.mod);
            data.banishfinal = Math.floor(data.summoning.banish.base + data.banishbonus + data.summoning.banish.spec + data.stats.Power.mod);
        } else {
            data.summonfinal = Math.floor(data.summoning.summon.base + data.summonbonus + data.summoning.summon.spec + data.stats.Power.mod + data.aam);
            data.controlfinal = Math.floor(data.summoning.control.base + data.controlbonus + data.summoning.control.spec + data.stats.Willpower.mod + data.aam);
            data.bindfinal = Math.floor(data.summoning.bind.base + data.bindbonus + data.summoning.bind.spec + data.stats.Power.mod + data.aam);
            data.banishfinal = Math.floor(data.summoning.banish.base + data.banishbonus + data.summoning.banish.spec + data.stats.Power.mod + data.aam);
        }








        // Wear Armor
        data.wearArmorFinal = Math.floor(data.wearArmor.base + data.weararmorbonus + data.wearArmor.spec + data.wearArmor.temp + data.stats.Strength.mod);
        // Armor
        const [quantity, req, natPen, movePen] = this.items.reduce((arr2, item) => {
            if (item.type === "armor") {
                if (item.data.data.equipped == true) {
                    arr2[0] += parseInt(item.data.data.quantity) || 0;
                    arr2[1] += parseInt(item.data.data.newRequirement) || 0;
                    arr2[2] += parseInt(item.data.data.newNatPenalty) || 0;
                    arr2[3] += parseInt(item.data.data.newMovePenalty) || 0;
                }
            }
            return arr2;
        }, [0, 0, 0, 0]);
        data.armorMod = Math.floor(data.wearArmorFinal - req);
        if (natPen - data.armorMod < 0) {
            data.totalNatPen = Math.floor(((quantity - 1) * 20) + 0);
        } else {
            data.totalNatPen = Math.floor(((quantity - 1) * 20) + (natPen - data.armorMod));
        }
        data.movePenMod = Math.floor(data.armorMod / 50);
        if (movePen - data.movePenMod < 0) {
            data.totalMovePen = movePen;
        } else {
            data.totalMovePen = movePen - data.movePenMod
        }






    }
}
export default class abfalterEffectConfig extends foundry.applications.sheets.ActiveEffectConfig {

    /** @inheritdoc */
    static DEFAULT_OPTIONS = {
        classes: ["abfalterEffect"],
    };

    /** @inheritdoc */
    static PARTS = {
        header: {
            template: "templates/sheets/active-effect/header.hbs",
        },
        tabs: {
            template: "templates/generic/tab-navigation.hbs",
        },
        details: {
            template: "templates/sheets/active-effect/details.hbs",
        },
        duration: {
            template: "templates/sheets/active-effect/duration.hbs",
        },
        changes: {
            template: "systems/abfalter/templates/active-effect/changes.hbs",
        },
        footer: {
            template: "templates/generic/form-footer.hbs",
        },
    };

    async _prepareContext(options) {
        const context = await super._prepareContext(options);

        context.groupedChangeKeys = {
            General: [
            { key: 'system.aamField.bonus', label: game.i18n.localize('abfalter.aam') },
            { key: 'system.initiative.bonus', label: game.i18n.localize('abfalter.initiative') },
            { key: 'system.movement.bonus', label: game.i18n.localize('abfalter.movement') },
            { key: 'system.lifepoints.bonus', label: game.i18n.localize('abfalter.lifePoints') },
            { key: 'system.regeneration.bonus', label: game.i18n.localize('abfalter.activeEffectChanges.healthRegen') },
            { key: 'system.fatigue.bonus', label: game.i18n.localize('abfalter.fatigue') }
            ],
            Characteristics: [
            { key: "system.stats.Agility.final", label: game.i18n.localize('abfalter.agility') },
            { key: "system.stats.Agility.opposedBonus", label: game.i18n.localize('abfalter.opposed') + ' ' + game.i18n.localize('abfalter.agility') },
            { key: "system.stats.Constitution.final", label: game.i18n.localize('abfalter.consti') },
            { key: "system.stats.Constitution.opposedBonus", label: game.i18n.localize('abfalter.opposed') + ' ' + game.i18n.localize('abfalter.consti') },
            { key: "system.stats.Strength.final", label: game.i18n.localize('abfalter.strength') },
            { key: "system.stats.Strength.opposedBonus", label: game.i18n.localize('abfalter.opposed') + ' ' + game.i18n.localize('abfalter.strength') },
            { key: "system.stats.Dexterity.final", label: game.i18n.localize('abfalter.dexerity') },
            { key: "system.stats.Dexterity.opposedBonus", label: game.i18n.localize('abfalter.opposed') + ' ' + game.i18n.localize('abfalter.dexerity') },
            { key: "system.stats.Perception.final", label: game.i18n.localize('abfalter.perception') },
            { key: "system.stats.Perception.opposedBonus", label: game.i18n.localize('abfalter.opposed') + ' ' + game.i18n.localize('abfalter.perception') },
            { key: "system.stats.Intelligence.final", label: game.i18n.localize('abfalter.intell') },
            { key: "system.stats.Intelligence.opposedBonus", label: game.i18n.localize('abfalter.opposed') + ' ' + game.i18n.localize('abfalter.intell') },
            { key: "system.stats.Power.final", label: game.i18n.localize('abfalter.power') },
            { key: "system.stats.Power.opposedBonus", label: game.i18n.localize('abfalter.opposed') + ' ' + game.i18n.localize('abfalter.power') },
            { key: "system.stats.Willpower.final", label: game.i18n.localize('abfalter.willPower') },
            { key: "system.stats.Willpower.opposedBonus", label: game.i18n.localize('abfalter.opposed') + ' ' + game.i18n.localize('abfalter.willPower') }
            ],
            Resistances: [
            { key: "system.resistances.Physical.bonus", label: game.i18n.localize('abfalter.physicalRes') },
            { key: "system.resistances.Disease.bonus", label: game.i18n.localize('abfalter.diseaseRes') },
            { key: "system.resistances.Poison.bonus", label: game.i18n.localize('abfalter.poisonRes') },
            { key: "system.resistances.Magic.bonus", label: game.i18n.localize('abfalter.magicRes') },
            { key: "system.resistances.Psychic.bonus", label: game.i18n.localize('abfalter.psychicRes') }
            ],
            Combat: [
            { key: 'system.combatValues.attack.bonus', label: game.i18n.localize('abfalter.attack') },
            { key: 'system.combatValues.block.bonus', label: game.i18n.localize('abfalter.block') },
            { key: 'system.combatValues.dodge.bonus', label: game.i18n.localize('abfalter.dodge') },
            { key: 'system.armor.wearArmor.bonus', label: game.i18n.localize('abfalter.wearArmor') },
            { key: 'system.otherStats.damageBarrierBonus', label: game.i18n.localize('abfalter.dmgBarrier') },
            { key: 'system.otherStats.dmgRdcBonus', label: game.i18n.localize('abfalter.dmgRdc') },
            ],
            Helmet: [
            { key: 'system.armor.helmet.ahCutBonus', label: game.i18n.localize('abfalter.cut') },
            { key: 'system.armor.helmet.ahImpBonus', label: game.i18n.localize('abfalter.imp') },
            { key: 'system.armor.helmet.ahThrBonus', label: game.i18n.localize('abfalter.thr') },
            { key: 'system.armor.helmet.ahHeatBonus', label: game.i18n.localize('abfalter.heat') },
            { key: 'system.armor.helmet.ahColdBonus', label: game.i18n.localize('abfalter.cold') },
            { key: 'system.armor.helmet.ahEleBonus', label: game.i18n.localize('abfalter.ele')},
            { key: 'system.armor.helmet.ahEneBonus', label: game.i18n.localize('abfalter.ene') },
            { key: 'system.armor.helmet.ahSptBonus', label: game.i18n.localize('abfalter.spirit') },
            ],
            Armor: [
            { key: 'system.armor.body.aCutBonus', label: game.i18n.localize('abfalter.cut') },
            { key: 'system.armor.body.aImpBonus', label: game.i18n.localize('abfalter.imp') },
            { key: 'system.armor.body.aThrBonus', label: game.i18n.localize('abfalter.thr') },
            { key: 'system.armor.body.aHeatBonus', label: game.i18n.localize('abfalter.heat') },
            { key: 'system.armor.body.aColdBonus', label: game.i18n.localize('abfalter.cold') },
            { key: 'system.armor.body.aEleBonus', label: game.i18n.localize('abfalter.ele') },
            { key: 'system.armor.body.aEneBonus', label: game.i18n.localize('abfalter.ene') },
            { key: 'system.armor.body.aSptBonus', label:  game.i18n.localize('abfalter.spirit') },
            ],
            Secondary: [
            { key: 'system.secondaryFields.athletics.acrobatics.bonus', label: game.i18n.localize('abfalter.acrobatic') },
            { key: 'system.secondaryFields.athletics.athleticism.bonus', label: game.i18n.localize('abfalter.athleticism') },
            { key: 'system.secondaryFields.athletics.climb.bonus', label: game.i18n.localize('abfalter.climb') },
            { key: 'system.secondaryFields.athletics.jump.bonus', label: game.i18n.localize('abfalter.jump') },
            { key: 'system.secondaryFields.athletics.piloting.bonus', label: game.i18n.localize('abfalter.piloting') },
            { key: 'system.secondaryFields.athletics.ride.bonus', label: game.i18n.localize('abfalter.ride') },
            { key: 'system.secondaryFields.athletics.swim.bonus', label: game.i18n.localize('abfalter.swim') },
            { key: 'system.secondaryFields.social.etiquette.bonus', label: game.i18n.localize('abfalter.etiquette') },
            { key: 'system.secondaryFields.social.intimidate.bonus', label: game.i18n.localize('abfalter.intimidate') },
            { key: 'system.secondaryFields.social.leadership.bonus', label: game.i18n.localize('abfalter.leadership') },
            { key: 'system.secondaryFields.social.persuasion.bonus', label: game.i18n.localize('abfalter.persuasion') },
            { key: 'system.secondaryFields.social.streetwise.bonus', label: game.i18n.localize('abfalter.streetwise') },
            { key: 'system.secondaryFields.social.style.bonus', label: game.i18n.localize('abfalter.style') },
            { key: 'system.secondaryFields.social.trading.bonus', label: game.i18n.localize('abfalter.trading') },
            { key: 'system.secondaryFields.perceptive.kidetection.bonus', label: game.i18n.localize('abfalter.kiDetection') },
            { key: 'system.secondaryFields.perceptive.notice.bonus', label: game.i18n.localize('abfalter.notice') },
            { key: 'system.secondaryFields.perceptive.search.bonus', label: game.i18n.localize('abfalter.search') },
            { key: 'system.secondaryFields.perceptive.track.bonus', label: game.i18n.localize('abfalter.track') },
            { key: 'system.secondaryFields.intellectual.animals.bonus', label: game.i18n.localize('abfalter.animals') },
            { key: 'system.secondaryFields.intellectual.appraisal.bonus', label: game.i18n.localize('abfalter.appraisal') },
            { key: 'system.secondaryFields.intellectual.architecture.bonus', label: game.i18n.localize('abfalter.architecture') },
            { key: 'system.secondaryFields.intellectual.herballore.bonus', label: game.i18n.localize('abfalter.herballore') },
            { key: 'system.secondaryFields.intellectual.history.bonus', label: game.i18n.localize('abfalter.history') },
            { key: 'system.secondaryFields.intellectual.law.bonus', label: game.i18n.localize('abfalter.law') },
            { key: 'system.secondaryFields.intellectual.magicappr.bonus', label: game.i18n.localize('abfalter.magicAppr') },
            { key: 'system.secondaryFields.intellectual.medicine.bonus', label: game.i18n.localize('abfalter.medicine') },
            { key: 'system.secondaryFields.intellectual.memorize.bonus', label: game.i18n.localize('abfalter.memorize') },
            { key: 'system.secondaryFields.intellectual.navigation.bonus', label: game.i18n.localize('abfalter.navigation') },
            { key: 'system.secondaryFields.intellectual.occult.bonus', label: game.i18n.localize('abfalter.occult') },
            { key: 'system.secondaryFields.intellectual.science.bonus', label: game.i18n.localize('abfalter.science') },
            { key: 'system.secondaryFields.intellectual.tactics.bonus', label: game.i18n.localize('abfalter.tactics') },
            { key: 'system.secondaryFields.intellectual.technomagic.bonus', label: game.i18n.localize('abfalter.technomagic') },
            { key: 'system.secondaryFields.vigor.composure.bonus', label: game.i18n.localize('abfalter.composure') },
            { key: 'system.secondaryFields.vigor.featsofstr.bonus', label: game.i18n.localize('abfalter.featsofstr') },
            { key: 'system.secondaryFields.vigor.withstpain.bonus', label: game.i18n.localize('abfalter.withstpain') },
            { key: 'system.secondaryFields.subterfuge.disguise.bonus', label: game.i18n.localize('abfalter.disguise') },
            { key: 'system.secondaryFields.subterfuge.hide.bonus', label: game.i18n.localize('abfalter.hide') },
            { key: 'system.secondaryFields.subterfuge.kiconceal.bonus', label: game.i18n.localize('abfalter.kiConceal') },
            { key: 'system.secondaryFields.subterfuge.lockpicking.bonus', label: game.i18n.localize('abfalter.lockpicking') },
            { key: 'system.secondaryFields.subterfuge.poisons.bonus', label: game.i18n.localize('abfalter.poisons') },
            { key: 'system.secondaryFields.subterfuge.stealth.bonus', label: game.i18n.localize('abfalter.stealth') },
            { key: 'system.secondaryFields.subterfuge.theft.bonus', label: game.i18n.localize('abfalter.theft') },
            { key: 'system.secondaryFields.subterfuge.traplore.bonus', label: game.i18n.localize('abfalter.traplore') },
            { key: 'system.secondaryFields.creative.alchemy.bonus', label: game.i18n.localize('abfalter.alchemy') },
            { key: 'system.secondaryFields.creative.animism.bonus', label: game.i18n.localize('abfalter.animism') },
            { key: 'system.secondaryFields.creative.art.bonus', label: game.i18n.localize('abfalter.art') },
            { key: 'system.secondaryFields.creative.cooking.bonus', label: game.i18n.localize('abfalter.cooking') },
            { key: 'system.secondaryFields.creative.dance.bonus', label: game.i18n.localize('abfalter.dance') },
            { key: 'system.secondaryFields.creative.forging.bonus', label: game.i18n.localize('abfalter.forging') },
            { key: 'system.secondaryFields.creative.jewelry.bonus', label: game.i18n.localize('abfalter.jewelry') },
            { key: 'system.secondaryFields.creative.toymaking.bonus', label: game.i18n.localize('abfalter.toymaking') },
            { key: 'system.secondaryFields.creative.music.bonus', label: game.i18n.localize('abfalter.music') },
            { key: 'system.secondaryFields.creative.runes.bonus', label: game.i18n.localize('abfalter.runes') },
            { key: 'system.secondaryFields.creative.ritualcalig.bonus', label: game.i18n.localize('abfalter.ritualcalig') },
            { key: 'system.secondaryFields.creative.slofhand.bonus', label: game.i18n.localize('abfalter.slofhand') },
            { key: 'system.secondaryFields.creative.tailoring.bonus', label: game.i18n.localize('abfalter.tailoring') }
            ],
            Mystic: [
            { key: 'system.mproj.bonus', label: game.i18n.localize('abfalter.offensive1') + ' ' + game.i18n.localize('abfalter.mproj') },
            { key: 'system.mproj.bonus2', label: game.i18n.localize('abfalter.defensive1') + ' ' + game.i18n.localize('abfalter.mproj') },
            { key: 'system.maccu.bonus', label: game.i18n.localize('abfalter.maccu') },
            { key: 'system.mregen.bonus', label: game.i18n.localize('abfalter.activeEffectChanges.magicRegen') },
            { key: 'system.zeon.bonus', label: game.i18n.localize('abfalter.zeon') },
            { key: 'system.zeon.minnateBonus', label: game.i18n.localize('abfalter.innateMagic') },
            { key: 'system.mlevel.bonus', label: game.i18n.localize('abfalter.mLevels') },
            { key: 'system.summoning.summon.bonus', label: game.i18n.localize('abfalter.activeEffectChanges.summoning') + ': ' + game.i18n.localize('abfalter.summon') },
            { key: 'system.summoning.control.bonus', label: game.i18n.localize('abfalter.activeEffectChanges.summoning') + ': ' + game.i18n.localize('abfalter.control') },
            { key: 'system.summoning.bind.bonus', label: game.i18n.localize('abfalter.activeEffectChanges.summoning') + ': ' + game.i18n.localize('abfalter.bind') },
            { key: 'system.summoning.banish.bonus', label: game.i18n.localize('abfalter.activeEffectChanges.summoning') + ': ' + game.i18n.localize('abfalter.banish') }
            ],
            Psychic: [
            { key: 'system.ppoint.bonus', label: game.i18n.localize('abfalter.activeEffectChanges.pp') },
            { key: 'system.ppotential.bonus', label: game.i18n.localize('abfalter.psychicPotential') },
            { key: 'system.pproj.bonusBase', label: game.i18n.localize('abfalter.psyProj') },
            { key: 'system.pproj.bonus', label: game.i18n.localize('abfalter.offensive1') + ' ' + game.i18n.localize('abfalter.psyProj') },
            { key: 'system.pproj.bonus2', label: game.i18n.localize('abfalter.defensive1') + ' ' + game.i18n.localize('abfalter.psyProj') }
            ],
            Ki: [
            { key: 'system.mk.bonus', label: game.i18n.localize('abfalter.martialKnow') },
            { key: 'system.kiPool.agi.bonus', label: game.i18n.localize('abfalter.activeEffectChanges.kiAcuAgi') },
            { key: 'system.kiPool.agi.bonusMax', label: game.i18n.localize('abfalter.activeEffectChanges.kiPoolAgi') },
            { key: 'system.kiPool.con.bonus', label: game.i18n.localize('abfalter.activeEffectChanges.kiAcuCon') },
            { key: 'system.kiPool.con.bonusMax', label: game.i18n.localize('abfalter.activeEffectChanges.kiPoolCon') },
            { key: 'system.kiPool.dex.bonus', label: game.i18n.localize('abfalter.activeEffectChanges.kiAcuDex') },
            { key: 'system.kiPool.dex.bonusMax', label: game.i18n.localize('abfalter.activeEffectChanges.kiPoolDex') },
            { key: 'system.kiPool.str.bonus', label: game.i18n.localize('abfalter.activeEffectChanges.kiAcuStr') },
            { key: 'system.kiPool.str.bonusMax', label: game.i18n.localize('abfalter.activeEffectChanges.kiPoolStr') },
            { key: 'system.kiPool.pow.bonus', label: game.i18n.localize('abfalter.activeEffectChanges.kiAcuPow') },
            { key: 'system.kiPool.pow.bonusMax', label: game.i18n.localize('abfalter.activeEffectChanges.kiPoolPow') },
            { key: 'system.kiPool.wp.bonus', label: game.i18n.localize('abfalter.activeEffectChanges.kiAcuWP') },
            { key: 'system.kiPool.wp.bonusMax', label: game.i18n.localize('abfalter.activeEffectChanges.kiPoolWP') },
            { key: 'system.kiPool.unifiedBonus', label: game.i18n.localize('abfalter.activeEffectChanges.kiPoolUnified') },
            { key: 'system.kiPool.innate.bonus', label: game.i18n.localize('abfalter.activeEffectChanges.kiPoolInnate') },
            { key: 'system.fistDamage.bonus', label: game.i18n.localize('abfalter.unarmedDmg') }
            ],
            other: [
            { key: 'system.levelinfo.levelBonus', label: game.i18n.localize('abfalter.level') },
            { key: 'system.rollRange.bonus', label: game.i18n.localize('abfalter.settingsTab.openRoll') },
            { key: 'system.fumleRange.bonus', label: game.i18n.localize('abfalter.settingsTab.fumbleRoll') },
            { key: 'system.levelinfo.levelmodBonus', label: game.i18n.localize('abfalter.settingsTab.levelMod') },
            { key: 'system.levelinfo.presencemodBonus', label: game.i18n.localize('abfalter.settingsTab.presenceMod') },
            { key: 'system.levelinfo.dpmodBonus', label: game.i18n.localize('abfalter.settingsTab.dpMod') },
            { key: 'system.otherStats.mentalHealthBonus', label: game.i18n.localize('abfalter.mentalHealthMax') }
            ]
        };

        return context;
    }
}
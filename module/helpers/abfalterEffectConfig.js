export default class abfalterEffectConfig extends ActiveEffectConfig {

    get template() {
        return "systems/abfalter/templates/item/activeEffect-config.hbs"
    }

    async getData(options = {}) {
        let context = await super.getData(options);     

        context.availableChangeKeys = abfalterEffectConfig._availableChangeKeys;

        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);
    }

   


    static initializeChangeKeys() {
        abfalterEffectConfig._availableChangeKeys = {
            //General Stats
            'system.combatValues.attack.bonus': game.i18n.localize('abfalter.basicInfo.attack'),
            'system.combatValues.block.bonus': game.i18n.localize('abfalter.basicInfo.block'),
            'system.combatValues.dodge.bonus': game.i18n.localize('abfalter.basicInfo.dodge'),
            'system.initiative.bonus': game.i18n.localize('abfalter.generalTab.initiative'),
            'system.aamField.bonus': game.i18n.localize('abfalter.generalTab.aam'),
            'system.stats.Agility.final':game.i18n.localize('abfalter.basicInfo.agility'),
            'system.stats.Agility.opposedBonus': game.i18n.localize('abfalter.generalTab.opposed') + ' ' + game.i18n.localize('abfalter.basicInfo.agility'),
            'system.stats.Constitution.final': game.i18n.localize('abfalter.basicInfo.consti'),
            'system.stats.Constitution.opposedBonus': game.i18n.localize('abfalter.generalTab.opposed') + ' ' + game.i18n.localize('abfalter.basicInfo.consti'),
            'system.stats.Strength.final': game.i18n.localize('abfalter.basicInfo.strength'),
            'system.stats.Strength.opposedBonus': game.i18n.localize('abfalter.generalTab.opposed') + ' ' + game.i18n.localize('abfalter.basicInfo.strength'),
            'system.stats.Dexterity.final': game.i18n.localize('abfalter.basicInfo.dexerity'),
            'system.stats.Dexterity.opposedBonus': game.i18n.localize('abfalter.generalTab.opposed') + ' ' + game.i18n.localize('abfalter.basicInfo.dexerity'),
            'system.stats.Perception.final': game.i18n.localize('abfalter.basicInfo.perception'),
            'system.stats.Perception.opposedBonus': game.i18n.localize('abfalter.generalTab.opposed') + ' ' + game.i18n.localize('abfalter.basicInfo.perception'),
            'system.stats.Intelligence.final': game.i18n.localize('abfalter.basicInfo.intell'),
            'system.stats.Intelligence.opposedBonus': game.i18n.localize('abfalter.generalTab.opposed') + ' ' + game.i18n.localize('abfalter.basicInfo.intell'),
            'system.stats.Power.final': game.i18n.localize('abfalter.basicInfo.power'),
            'system.stats.Power.opposedBonus': game.i18n.localize('abfalter.generalTab.opposed') + ' ' + game.i18n.localize('abfalter.basicInfo.power'),
            'system.stats.Willpower.final': game.i18n.localize('abfalter.basicInfo.willPower'),
            'system.stats.Willpower.opposedBonus': game.i18n.localize('abfalter.generalTab.opposed') + ' ' + game.i18n.localize('abfalter.basicInfo.willPower'),
            'system.resistances.Physical.bonus': game.i18n.localize('abfalter.sheet.physicalRes'),
            'system.resistances.Disease.bonus': game.i18n.localize('abfalter.sheet.diseaseRes'),
            'system.resistances.Poison.bonus': game.i18n.localize('abfalter.sheet.poisonRes'),
            'system.resistances.Magic.bonus': game.i18n.localize('abfalter.sheet.magicRes'),
            'system.resistances.Psychic.bonus': game.i18n.localize('abfalter.sheet.psychicRes'),
            'system.lifepoints.bonus': game.i18n.localize('abfalter.generalTab.lifePoints'),
            'system.regeneration.bonus': game.i18n.localize('abfalter.activeEffectChanges.healthRegen'),
            'system.movement.bonus': game.i18n.localize('abfalter.generalTab.movement'),
            'system.fatigue.bonus': game.i18n.localize('abfalter.generalTab.fatigue'),
            'system.armor.wearArmor.bonus': game.i18n.localize('abfalter.armoryTab.wearArmor'),
            //Secondaries
            'system.secondaryFields.athletics.acrobatics.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.acrobatic'),
            'system.secondaryFields.athletics.athleticism.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.athleticism'),
            'system.secondaryFields.athletics.climb.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.climb'),
            'system.secondaryFields.athletics.jump.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.jump'),
            'system.secondaryFields.athletics.piloting.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.piloting'),
            'system.secondaryFields.athletics.ride.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.ride'),
            'system.secondaryFields.athletics.swim.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.swim'),
            'system.secondaryFields.social.etiquette.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.etiquette'),
            'system.secondaryFields.social.intimidate.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.intimidate'),
            'system.secondaryFields.social.leadership.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.leadership'),
            'system.secondaryFields.social.persuasion.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.persuasion'),
            'system.secondaryFields.social.streetwise.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.streetwise'),
            'system.secondaryFields.social.style.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.style'),
            'system.secondaryFields.social.trading.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.trading'),
            'system.secondaryFields.perceptive.kidetection.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.kiTab.kiDetection'),
            'system.secondaryFields.perceptive.notice.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.notice'),
            'system.secondaryFields.perceptive.search.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.search'),
            'system.secondaryFields.perceptive.track.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.track'),
            'system.secondaryFields.intellectual.animals.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.animals'),
            'system.secondaryFields.intellectual.appraisal.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.appraisal'),
            'system.secondaryFields.intellectual.architecture.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.architecture'),
            'system.secondaryFields.intellectual.herballore.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.herballore'),
            'system.secondaryFields.intellectual.history.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.history'),
            'system.secondaryFields.intellectual.law.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.law'),
            'system.secondaryFields.intellectual.magicappr.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.magicAppr'),
            'system.secondaryFields.intellectual.medicine.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.medicine'),
            'system.secondaryFields.intellectual.memorize.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.memorize'),
            'system.secondaryFields.intellectual.navigation.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.navigation'),
            'system.secondaryFields.intellectual.occult.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.occult'),
            'system.secondaryFields.intellectual.science.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.science'),
            'system.secondaryFields.intellectual.tactics.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.tactics'),
            'system.secondaryFields.intellectual.technomagic.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.technomagic'),
            'system.secondaryFields.vigor.composure.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.composure'),
            'system.secondaryFields.vigor.featsofstr.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.featsOfStr'),
            'system.secondaryFields.vigor.withstpain.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.withstPain'),
            'system.secondaryFields.subterfuge.disguise.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.disguise'),
            'system.secondaryFields.subterfuge.hide.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.hide'),
            'system.secondaryFields.subterfuge.kiconceal.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.kiTab.kiConceal'),
            'system.secondaryFields.subterfuge.lockpicking.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.lockpicking'),
            'system.secondaryFields.subterfuge.poisons.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.poisons'),
            'system.secondaryFields.subterfuge.stealth.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.stealth'),
            'system.secondaryFields.subterfuge.theft.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.theft'),
            'system.secondaryFields.subterfuge.traplore.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.traplore'),
            'system.secondaryFields.creative.alchemy.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.alchemy'),
            'system.secondaryFields.creative.animism.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.animism'),
            'system.secondaryFields.creative.art.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.art'),
            'system.secondaryFields.creative.cooking.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.cooking'),
            'system.secondaryFields.creative.dance.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.dance'),
            'system.secondaryFields.creative.forging.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.forging'),
            'system.secondaryFields.creative.jewelry.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.jewelry'),
            'system.secondaryFields.creative.toymaking.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.toymaking'),
            'system.secondaryFields.creative.music.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.music'),
            'system.secondaryFields.creative.runes.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.runes'),
            'system.secondaryFields.creative.ritualcalig.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.ritualCal'),
            'system.secondaryFields.creative.slofhand.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.soh'),
            'system.secondaryFields.creative.tailoring.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.tailoring'),
            //mystic
            'system.mproj.bonus': game.i18n.localize('abfalter.magicTab.offensive1') + ' ' + game.i18n.localize('abfalter.magicTab.mproj'),
            'system.mproj.bonus2': game.i18n.localize('abfalter.magicTab.defensive1') + ' ' + game.i18n.localize('abfalter.magicTab.mproj'),
            'system.maccu.bonus': game.i18n.localize('abfalter.magicTab.maccu'),
            'system.mregen.bonus': game.i18n.localize('abfalter.activeEffectChanges.magicRegen'),
            'system.zeon.bonus': game.i18n.localize('abfalter.magicTab.zeon'),
            'system.mlevel.bonus': game.i18n.localize('abfalter.magicTab.mLevels'),
            'system.summoning.summon.bonus': game.i18n.localize('abfalter.activeEffectChanges.summoning') + ': ' + game.i18n.localize('abfalter.magicTab.summon'),
            'system.summoning.control.bonus': game.i18n.localize('abfalter.activeEffectChanges.summoning') + ': ' + game.i18n.localize('abfalter.magicTab.control'),
            'system.summoning.bind.bonus': game.i18n.localize('abfalter.activeEffectChanges.summoning') + ': ' + game.i18n.localize('abfalter.magicTab.bind'),
            'system.summoning.banish.bonus': game.i18n.localize('abfalter.activeEffectChanges.summoning') + ': ' + game.i18n.localize('abfalter.magicTab.banish'),
            //psychic
            'system.pproj.bonusBase': game.i18n.localize('abfalter.psychicTab.psyProj'),
            'system.pproj.bonus': game.i18n.localize('abfalter.magicTab.offensive1') + ' ' + game.i18n.localize('abfalter.psychicTab.psyProj'),
            'system.pproj.bonus2': game.i18n.localize('abfalter.magicTab.defensive1') + ' ' +  game.i18n.localize('abfalter.psychicTab.psyProj'),
            'system.ppoint.bonus': game.i18n.localize('abfalter.activeEffectChanges.pp'),
            'system.ppotential.bonus': game.i18n.localize('abfalter.psychicTab.psychicPotential'),
            //ki
            'system.mk.bonus': game.i18n.localize('abfalter.kiTab.martialKnow'),
            'system.kiPool.agi.bonus': game.i18n.localize('abfalter.activeEffectChanges.kiAcuAgi'),
            'system.kiPool.agi.bonusMax': game.i18n.localize('abfalter.activeEffectChanges.kiPoolAgi'),
            'system.kiPool.con.bonus': game.i18n.localize('abfalter.activeEffectChanges.kiAcuCon'),
            'system.kiPool.con.bonusMax': game.i18n.localize('abfalter.activeEffectChanges.kiPoolCon'),
            'system.kiPool.dex.bonus': game.i18n.localize('abfalter.activeEffectChanges.kiAcuDex'),
            'system.kiPool.dex.bonusMax': game.i18n.localize('abfalter.activeEffectChanges.kiPoolDex'),
            'system.kiPool.str.bonus': game.i18n.localize('abfalter.activeEffectChanges.kiAcuStr'),
            'system.kiPool.str.bonusMax': game.i18n.localize('abfalter.activeEffectChanges.kiPoolStr'),
            'system.kiPool.pow.bonus': game.i18n.localize('abfalter.activeEffectChanges.kiAcuPow'),
            'system.kiPool.pow.bonusMax': game.i18n.localize('abfalter.activeEffectChanges.kiPoolPow'),
            'system.kiPool.wp.bonus': game.i18n.localize('abfalter.activeEffectChanges.kiAcuWP'),
            'system.kiPool.wp.bonusMax': game.i18n.localize('abfalter.activeEffectChanges.kiPoolWP'),
            'system.kiPool.unifiedBonus': game.i18n.localize('abfalter.activeEffectChanges.kiPoolUnified'),
            'system.kiPool.innate.bonus': game.i18n.localize('abfalter.activeEffectChanges.kiPoolInnate'),
            'system.fistDamage.bonus': game.i18n.localize('abfalter.kiTab.unarmedDmg'),
            //other
            'system.rollRange.bonus': game.i18n.localize('abfalter.settingsTab.openRoll'),
            'system.fumleRange.bonus': game.i18n.localize('abfalter.settingsTab.fumbleRoll'),
            'system.levelinfo.levelmodBonus': game.i18n.localize('abfalter.settingsTab.levelMod'),
            'system.levelinfo.presencemodBonus': game.i18n.localize('abfalter.settingsTab.presenceMod'),
            'system.levelinfo.dpmodBonus': game.i18n.localize('abfalter.settingsTab.dpMod')
        }
    }
}
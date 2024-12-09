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
            'system.combatValues.attack.bonus': game.i18n.localize('abfalter.attack'),
            'system.combatValues.block.bonus': game.i18n.localize('abfalter.block'),
            'system.combatValues.dodge.bonus': game.i18n.localize('abfalter.dodge'),
            'system.initiative.bonus': game.i18n.localize('abfalter.initiative'),
            'system.aamField.bonus': game.i18n.localize('abfalter.aam'),
            'system.stats.Agility.final':game.i18n.localize('abfalter.agility'),
            'system.stats.Agility.opposedBonus': game.i18n.localize('abfalter.opposed') + ' ' + game.i18n.localize('abfalter.agility'),
            'system.stats.Constitution.final': game.i18n.localize('abfalter.consti'),
            'system.stats.Constitution.opposedBonus': game.i18n.localize('abfalter.opposed') + ' ' + game.i18n.localize('abfalter.consti'),
            'system.stats.Strength.final': game.i18n.localize('abfalter.strength'),
            'system.stats.Strength.opposedBonus': game.i18n.localize('abfalter.opposed') + ' ' + game.i18n.localize('abfalter.strength'),
            'system.stats.Dexterity.final': game.i18n.localize('abfalter.dexerity'),
            'system.stats.Dexterity.opposedBonus': game.i18n.localize('abfalter.opposed') + ' ' + game.i18n.localize('abfalter.dexerity'),
            'system.stats.Perception.final': game.i18n.localize('abfalter.perception'),
            'system.stats.Perception.opposedBonus': game.i18n.localize('abfalter.opposed') + ' ' + game.i18n.localize('abfalter.perception'),
            'system.stats.Intelligence.final': game.i18n.localize('abfalter.intell'),
            'system.stats.Intelligence.opposedBonus': game.i18n.localize('abfalter.opposed') + ' ' + game.i18n.localize('abfalter.intell'),
            'system.stats.Power.final': game.i18n.localize('abfalter.power'),
            'system.stats.Power.opposedBonus': game.i18n.localize('abfalter.opposed') + ' ' + game.i18n.localize('abfalter.power'),
            'system.stats.Willpower.final': game.i18n.localize('abfalter.willPower'),
            'system.stats.Willpower.opposedBonus': game.i18n.localize('abfalter.opposed') + ' ' + game.i18n.localize('abfalter.willPower'),
            'system.resistances.Physical.bonus': game.i18n.localize('abfalter.physicalRes'),
            'system.resistances.Disease.bonus': game.i18n.localize('abfalter.diseaseRes'),
            'system.resistances.Poison.bonus': game.i18n.localize('abfalter.poisonRes'),
            'system.resistances.Magic.bonus': game.i18n.localize('abfalter.magicRes'),
            'system.resistances.Psychic.bonus': game.i18n.localize('abfalter.psychicRes'),
            'system.lifepoints.bonus': game.i18n.localize('abfalter.lifePoints'),
            'system.regeneration.bonus': game.i18n.localize('abfalter.activeEffectChanges.healthRegen'),
            'system.movement.bonus': game.i18n.localize('abfalter.movement'),
            'system.fatigue.bonus': game.i18n.localize('abfalter.fatigue'),
            'system.armor.wearArmor.bonus': game.i18n.localize('abfalter.armoryTab.wearArmor'),
            //Secondaries
            'system.secondaryFields.athletics.acrobatics.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.acrobatic'),
            'system.secondaryFields.athletics.athleticism.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.athleticism'),
            'system.secondaryFields.athletics.climb.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.climb'),
            'system.secondaryFields.athletics.jump.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.jump'),
            'system.secondaryFields.athletics.piloting.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.piloting'),
            'system.secondaryFields.athletics.ride.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.ride'),
            'system.secondaryFields.athletics.swim.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.swim'),
            'system.secondaryFields.social.etiquette.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.etiquette'),
            'system.secondaryFields.social.intimidate.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.intimidate'),
            'system.secondaryFields.social.leadership.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.leadership'),
            'system.secondaryFields.social.persuasion.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.persuasion'),
            'system.secondaryFields.social.streetwise.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.streetwise'),
            'system.secondaryFields.social.style.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.style'),
            'system.secondaryFields.social.trading.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.trading'),
            'system.secondaryFields.perceptive.kidetection.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.kiDetection'),
            'system.secondaryFields.perceptive.notice.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.notice'),
            'system.secondaryFields.perceptive.search.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.search'),
            'system.secondaryFields.perceptive.track.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.track'),
            'system.secondaryFields.intellectual.animals.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.animals'),
            'system.secondaryFields.intellectual.appraisal.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.appraisal'),
            'system.secondaryFields.intellectual.architecture.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.architecture'),
            'system.secondaryFields.intellectual.herballore.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.herballore'),
            'system.secondaryFields.intellectual.history.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.history'),
            'system.secondaryFields.intellectual.law.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.law'),
            'system.secondaryFields.intellectual.magicappr.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.magicAppr'),
            'system.secondaryFields.intellectual.medicine.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.medicine'),
            'system.secondaryFields.intellectual.memorize.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.memorize'),
            'system.secondaryFields.intellectual.navigation.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.navigation'),
            'system.secondaryFields.intellectual.occult.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.occult'),
            'system.secondaryFields.intellectual.science.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.science'),
            'system.secondaryFields.intellectual.tactics.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.tactics'),
            'system.secondaryFields.intellectual.technomagic.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.technomagic'),
            'system.secondaryFields.vigor.composure.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.composure'),
            'system.secondaryFields.vigor.featsofstr.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.featsofstr'),
            'system.secondaryFields.vigor.withstpain.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.withstpain'),
            'system.secondaryFields.subterfuge.disguise.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.disguise'),
            'system.secondaryFields.subterfuge.hide.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.hide'),
            'system.secondaryFields.subterfuge.kiconceal.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.kiConceal'),
            'system.secondaryFields.subterfuge.lockpicking.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.lockpicking'),
            'system.secondaryFields.subterfuge.poisons.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.poisons'),
            'system.secondaryFields.subterfuge.stealth.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.stealth'),
            'system.secondaryFields.subterfuge.theft.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.theft'),
            'system.secondaryFields.subterfuge.traplore.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.traplore'),
            'system.secondaryFields.creative.alchemy.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.alchemy'),
            'system.secondaryFields.creative.animism.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.animism'),
            'system.secondaryFields.creative.art.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.art'),
            'system.secondaryFields.creative.cooking.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.cooking'),
            'system.secondaryFields.creative.dance.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.dance'),
            'system.secondaryFields.creative.forging.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.forging'),
            'system.secondaryFields.creative.jewelry.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.jewelry'),
            'system.secondaryFields.creative.toymaking.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.toymaking'),
            'system.secondaryFields.creative.music.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.music'),
            'system.secondaryFields.creative.runes.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.runes'),
            'system.secondaryFields.creative.ritualcalig.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.ritualcalig'),
            'system.secondaryFields.creative.slofhand.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.slofhand'),
            'system.secondaryFields.creative.tailoring.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.tailoring'),
            //mystic
            'system.mproj.bonus': game.i18n.localize('abfalter.offensive1') + ' ' + game.i18n.localize('abfalter.mproj'),
            'system.mproj.bonus2': game.i18n.localize('abfalter.defensive1') + ' ' + game.i18n.localize('abfalter.mproj'),
            'system.maccu.bonus': game.i18n.localize('abfalter.maccu'),
            'system.mregen.bonus': game.i18n.localize('abfalter.activeEffectChanges.magicRegen'),
            'system.zeon.bonus': game.i18n.localize('abfalter.zeon'),
            'system.mlevel.bonus': game.i18n.localize('abfalter.mLevels'),
            'system.summoning.summon.bonus': game.i18n.localize('abfalter.activeEffectChanges.summoning') + ': ' + game.i18n.localize('abfalter.summon'),
            'system.summoning.control.bonus': game.i18n.localize('abfalter.activeEffectChanges.summoning') + ': ' + game.i18n.localize('abfalter.control'),
            'system.summoning.bind.bonus': game.i18n.localize('abfalter.activeEffectChanges.summoning') + ': ' + game.i18n.localize('abfalter.bind'),
            'system.summoning.banish.bonus': game.i18n.localize('abfalter.activeEffectChanges.summoning') + ': ' + game.i18n.localize('abfalter.banish'),
            //psychic
            'system.pproj.bonusBase': game.i18n.localize('abfalter.psyProj'),
            'system.pproj.bonus': game.i18n.localize('abfalter.offensive1') + ' ' + game.i18n.localize('abfalter.psyProj'),
            'system.pproj.bonus2': game.i18n.localize('abfalter.defensive1') + ' ' +  game.i18n.localize('abfalter.psyProj'),
            'system.ppoint.bonus': game.i18n.localize('abfalter.activeEffectChanges.pp'),
            'system.ppotential.bonus': game.i18n.localize('abfalter.psychicPotential'),
            //ki
            'system.mk.bonus': game.i18n.localize('abfalter.martialKnow'),
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
            'system.fistDamage.bonus': game.i18n.localize('abfalter.unarmedDmg'),
            //other
            'system.rollRange.bonus': game.i18n.localize('abfalter.settingsTab.openRoll'),
            'system.fumleRange.bonus': game.i18n.localize('abfalter.settingsTab.fumbleRoll'),
            'system.levelinfo.levelmodBonus': game.i18n.localize('abfalter.settingsTab.levelMod'),
            'system.levelinfo.presencemodBonus': game.i18n.localize('abfalter.settingsTab.presenceMod'),
            'system.levelinfo.dpmodBonus': game.i18n.localize('abfalter.settingsTab.dpMod')
        }
    }
}
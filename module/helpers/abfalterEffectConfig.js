export default class abfalterEffectConfig extends ActiveEffectConfig {

    get template() {
        return "systems/abfalter/templates/item/activeEffect-config.html"
    }

    async getData(options = {}) {
        let context = await super.getData(options);     

        context.availableChangeKeys = abfalterEffectConfig._availableChangeKeys;

        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find(".activeTypes").change(this._categories.bind(this));
    }

    _categories(event) {
        const dataset = event.currentTarget.dataset.value;
    }


    static initializeChangeKeys() {
        abfalterEffectConfig._availableChangeKeys = {
            //General Stats
            'system.combatstats.atkbonus': game.i18n.localize('abfalter.basicInfo.attack'),
            'system.combatstats.blkbonus': game.i18n.localize('abfalter.basicInfo.block'),
            'system.combatstats.dodbonus': game.i18n.localize('abfalter.basicInfo.dodge'),
            'system.initiative.bonus': game.i18n.localize('abfalter.generalTab.initiative'),
            'system.aamBonus': game.i18n.localize('abfalter.generalTab.aam'),
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
            'system.wearArmor.bonus': game.i18n.localize('abfalter.armoryTab.wearArmor'),
            //Secondaries
            'system.secondary.acrobatics.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.acrobatic'),
            'system.secondary.athleticism.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.athleticism'),
            'system.secondary.climb.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.climb'),
            'system.secondary.jump.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.jump'),
            'system.secondary.piloting.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.piloting'),
            'system.secondary.ride.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.ride'),
            'system.secondary.swim.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.swim'),
            'system.secondary.etiquette.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.etiquette'),
            'system.secondary.intimidate.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.intimidate'),
            'system.secondary.leadership.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.leadership'),
            'system.secondary.persuasion.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.persuasion'),
            'system.secondary.streetwise.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.streetwise'),
            'system.secondary.style.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.style'),
            'system.secondary.trading.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.trading'),
            'system.secondary.kidetection.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.kiTab.kiDetection'),
            'system.secondary.notice.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.notice'),
            'system.secondary.search.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.search'),
            'system.secondary.track.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.track'),
            'system.secondary.animals.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.animals'),
            'system.secondary.appraisal.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.appraisal'),
            'system.secondary.architecture.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.architecture'),
            'system.secondary.herballore.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.herballore'),
            'system.secondary.history.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.history'),
            'system.secondary.law.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.law'),
            'system.secondary.magicappr.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.magicAppr'),
            'system.secondary.medicine.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.medicine'),
            'system.secondary.memorize.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.memorize'),
            'system.secondary.navigation.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.navigation'),
            'system.secondary.occult.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.occult'),
            'system.secondary.science.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.science'),
            'system.secondary.tactics.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.tactics'),
            'system.secondary.technomagic.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.technomagic'),
            'system.secondary.composure.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.composure'),
            'system.secondary.featsofstr.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.featsOfStr'),
            'system.secondary.withstpain.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.withstPain'),
            'system.secondary.disguise.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.disguise'),
            'system.secondary.hide.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.hide'),
            'system.secondary.kiconceal.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.kiTab.kiConceal'),
            'system.secondary.lockpicking.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.lockpicking'),
            'system.secondary.poisons.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.poisons'),
            'system.secondary.stealth.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.stealth'),
            'system.secondary.theft.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.theft'),
            'system.secondary.traplore.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.traplore'),
            'system.secondary.alchemy.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.alchemy'),
            'system.secondary.animism.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.animism'),
            'system.secondary.art.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.art'),
            'system.secondary.cooking.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.cooking'),
            'system.secondary.dance.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.dance'),
            'system.secondary.forging.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.forging'),
            'system.secondary.jewelry.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.jewelry'),
            'system.secondary.toymaking.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.toymaking'),
            'system.secondary.music.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.music'),
            'system.secondary.runes.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.runes'),
            'system.secondary.ritualcalig.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.ritualCal'),
            'system.secondary.slofhand.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.soh'),
            'system.secondary.tailoring.bonus': game.i18n.localize('abfalter.activeEffectChanges.secAbility') + ': ' + game.i18n.localize('abfalter.generalTab.tailoring'),
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
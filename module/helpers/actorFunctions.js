import { renderTemplates } from '../utilities/renderTemplates.js';
import { templates } from '../utilities/templates.js';

export const openOneModDialog = async () => {
    return oneModDialog({
        content: "Modifier",
        placeholder: '0'
    });
}

export const oneModDialog = async ({ content, placeholder = '' }) => {
    const html = await renderTemplates({
        name: templates.dialog.initiative,
        context: {
            content,
            placeholder
        }
    });
    return new Promise(resolve => {
        new Dialog({
            title: 'Secondary Changer',
            content: html,
            buttons: {
                submit: {
                    label: 'Confirm',
                    callback: html => {
                        const results = new foundry.applications.ux.FormDataExtended(html.find('form')[0], {}).object;
                        resolve(results['dialog-input']);
                    }
                },
                cancel: {
                    label: 'Cancel',
                    callback: () => resolve(null)
                }
            },
            render: () => $('#dialog-input').focus()
        }).render(true);
    });
}

export async function restOptions(actor) {
    let confirmed = false;
    const template = "systems/abfalter/templates/dialogues/restOptions.hbs";
    const templateData = {
        actor: actor
    };
    const htmlContent = await foundry.applications.handlebars.renderTemplate(template, templateData);
    new Dialog({
        title: 'Rest Options',
        class: 'baseAbfalter',
        content: htmlContent,
        buttons: {
            rest: { label: game.i18n.localize('abfalter.rest'), callback: () => confirmed = true },
            cancel: { label: game.i18n.localize('abfalter.dialogs.cancel'), callback: () => confirmed = false }
        },
        render: ($html) => {
            
        },
        close: html => {
            if (confirmed) {
                actor.update({ 
                    "system.stats.Agility.temp": 0, "system.stats.Constitution.temp": 0, "system.stats.Strength.temp": 0, "system.stats.Dexterity.temp": 0,
                    "system.stats.Perception.temp": 0, "system.stats.Intelligence.temp": 0, "system.stats.Power.temp": 0, "system.stats.Willpower.temp": 0,
                    "system.movement.temp": 0, "system.lifepoints.temp": 0, "system.fatigue.temp": 0, "system.regeneration.temp": 0,
                    "system.combatValues.attack.temp": 0, "system.block.attack.temp": 0, "system.combatValues.dodge.temp": 0, "system.mproj.temp": 0,
                    "system.mproj.temp2": 0, "system.maccu.temp": 0, "system.mregen.temp": 0, "system.ppotential.temp": 0,
                    "system.pproj.temp": 0, "system.armor.wearArmor.temp": 0,"system.lp.value": Math.floor(actor.system.lp.value + actor.system.regeneration.rawValue),
                    "system.fatigue.value": actor.system.fatigue.max, "system.zeon.value":  Math.min(Math.floor(actor.system.zeon.value + actor.system.mregen.finalMinusMaint), actor.system.zeon.max),
                    "system.psychicPoint.value": actor.system.psychicPoint.max,
                    "system.kiPool.agi.actual": actor.system.kiPool.agi.poolTot,

                     "system.kiPool.con.actual": actor.system.kiPool.con.poolTot, 
                    "system.kiPool.dex.actual": actor.system.kiPool.dex.poolTot,
                    "system.kiPool.str.actual": actor.system.kiPool.str.poolTot, 
                    "system.kiPool.pow.actual": actor.system.kiPool.pow.poolTot, 
                    "system.kiPool.wp.actual": actor.system.kiPool.wp.poolTot,
                    "system.unifiedKi.value": actor.system.unifiedKi.max,
                  });

            }
        }
    }).render(true);
}


export async function changeSecondaryTemps(actorData) {
    const mod = await openOneModDialog() || 0;
    actorData.update({
        "system.secondaryFields.athletics.acrobatics.temp": mod, "system.secondaryFields.athletics.athleticism.temp": mod, "system.secondaryFields.athletics.climb.temp": mod, "system.secondaryFields.athletics.jump.temp": mod,
        "system.secondaryFields.athletics.ride.temp": mod, "system.secondaryFields.athletics.swim.temp": mod, "system.secondaryFields.social.etiquette.temp": mod, "system.secondaryFields.social.intimidate.temp": mod,
        "system.secondaryFields.social.leadership.temp": mod, "system.secondaryFields.social.persuasion.temp": mod, "system.secondaryFields.social.streetwise.temp": mod, "system.secondaryFields.social.style.temp": mod,
        "system.secondaryFields.social.trading.temp": mod, "system.secondaryFields.perceptive.notice.temp": mod, "system.secondaryFields.perceptive.search.temp": mod, "system.secondaryFields.perceptive.track.temp": mod,
        "system.secondaryFields.intellectual.animals.temp": mod, "system.secondaryFields.intellectual.appraisal.temp": mod, "system.secondaryFields.intellectual.architecture.temp": mod, "system.secondaryFields.intellectual.herballore.temp": mod,
        "system.secondaryFields.intellectual.history.temp": mod, "system.secondaryFields.intellectual.law.temp": mod, "system.secondaryFields.intellectual.magicappr.temp": mod, "system.secondaryFields.intellectual.medicine.temp": mod,
        "system.secondaryFields.intellectual.memorize.temp": mod, "system.secondaryFields.intellectual.navigation.temp": mod, "system.secondaryFields.intellectual.occult.temp": mod, "system.secondaryFields.intellectual.science.temp": mod,
        "system.secondaryFields.intellectual.tactics.temp": mod, "system.secondaryFields.vigor.composure.temp": mod, "system.secondaryFields.vigor.featsofstr.temp": mod, "system.secondaryFields.vigor.withstpain.temp": mod,
        "system.secondaryFields.subterfuge.disguise.temp": mod, "system.secondaryFields.subterfuge.hide.temp": mod, "system.secondaryFields.subterfuge.lockpicking.temp": mod, "system.secondaryFields.subterfuge.poisons.temp": mod,
        "system.secondaryFields.subterfuge.stealth.temp": mod, "system.secondaryFields.subterfuge.theft.temp": mod, "system.secondaryFields.subterfuge.traplore.temp": mod, "system.secondaryFields.creative.alchemy.temp": mod,
        "system.secondaryFields.creative.animism.temp": mod, "system.secondaryFields.creative.art.temp": mod, "system.secondaryFields.creative.dance.temp": mod, "system.secondaryFields.creative.forging.temp": mod,
        "system.secondaryFields.creative.jewelry.temp": mod, "system.secondaryFields.creative.music.temp": mod, "system.secondaryFields.creative.runes.temp": mod, "system.secondaryFields.creative.ritualcalig.temp": mod,
        "system.secondaryFields.creative.slofhand.temp": mod, "system.secondaryFields.creative.tailoring.temp": mod, "system.secondaryFields.athletics.piloting.temp": mod, "system.secondaryFields.creative.cooking.temp": mod,
        "system.secondaryFields.intellectual.technomagic.temp": mod, "system.secondaryFields.creative.toymaking.temp": mod, "system.secondaryFields.perceptive.kidetection.temp": mod, "system.secondaryFields.subterfuge.kiconceal.temp": mod
    })
}

export async function changeSecondarySpecs(actorData) {
    const mod = await openOneModDialog() || 0;
    actorData.update({
        "system.secondaryFields.athletics.acrobatics.spec": mod, "system.secondaryFields.athletics.athleticism.spec": mod, "system.secondaryFields.athletics.climb.spec": mod, "system.secondaryFields.athletics.jump.spec": mod,
        "system.secondaryFields.athletics.ride.spec": mod, "system.secondaryFields.athletics.swim.spec": mod, "system.secondaryFields.social.etiquette.spec": mod, "system.secondaryFields.social.intimidate.spec": mod,
        "system.secondaryFields.social.leadership.spec": mod, "system.secondaryFields.social.persuasion.spec": mod, "system.secondaryFields.social.streetwise.spec": mod, "system.secondaryFields.social.style.spec": mod,
        "system.secondaryFields.social.trading.spec": mod, "system.secondaryFields.perceptive.notice.spec": mod, "system.secondaryFields.perceptive.search.spec": mod, "system.secondaryFields.perceptive.track.spec": mod,
        "system.secondaryFields.intellectual.animals.spec": mod, "system.secondaryFields.intellectual.appraisal.spec": mod, "system.secondaryFields.intellectual.architecture.spec": mod, "system.secondaryFields.intellectual.herballore.spec": mod,
        "system.secondaryFields.intellectual.history.spec": mod, "system.secondaryFields.intellectual.law.spec": mod, "system.secondaryFields.intellectual.magicappr.spec": mod, "system.secondaryFields.intellectual.medicine.spec": mod,
        "system.secondaryFields.intellectual.memorize.spec": mod, "system.secondaryFields.intellectual.navigation.spec": mod, "system.secondaryFields.intellectual.occult.spec": mod, "system.secondaryFields.intellectual.science.spec": mod,
        "system.secondaryFields.intellectual.tactics.spec": mod, "system.secondaryFields.vigor.composure.spec": mod, "system.secondaryFields.vigor.featsofstr.spec": mod, "system.secondaryFields.vigor.withstpain.spec": mod,
        "system.secondaryFields.subterfuge.disguise.spec": mod, "system.secondaryFields.subterfuge.hide.spec": mod, "system.secondaryFields.subterfuge.lockpicking.spec": mod, "system.secondaryFields.subterfuge.poisons.spec": mod,
        "system.secondaryFields.subterfuge.stealth.spec": mod, "system.secondaryFields.subterfuge.theft.spec": mod, "system.secondaryFields.subterfuge.traplore.spec": mod, "system.secondaryFields.creative.alchemy.spec": mod,
        "system.secondaryFields.creative.animism.spec": mod, "system.secondaryFields.creative.art.spec": mod, "system.secondaryFields.creative.dance.spec": mod, "system.secondaryFields.creative.forging.spec": mod,
        "system.secondaryFields.creative.jewelry.spec": mod, "system.secondaryFields.creative.music.spec": mod, "system.secondaryFields.creative.runes.spec": mod, "system.secondaryFields.creative.ritualcalig.spec": mod,
        "system.secondaryFields.creative.slofhand.spec": mod, "system.secondaryFields.creative.tailoring.spec": mod, "system.secondaryFields.athletics.piloting.spec": mod, "system.secondaryFields.creative.cooking.spec": mod,
        "system.secondaryFields.intellectual.technomagic.spec": mod, "system.secondaryFields.creative.toymaking.spec": mod, "system.secondaryFields.perceptive.kidetection.spec": mod, "system.secondaryFields.subterfuge.kiconceal.spec": mod
    })
}

export async function calculateDpCost(actorData, classId) {
    const system = actorData.system;
    const myLevel = system.levelinfo.level;
    const classItem = actorData.items.get(classId);
    if (!classItem) {
        console.error(`Class item with id ${classId} not found`);
        return;
    }
    const dpCost = classItem.system.dpCost;
    const totalDpCosts = [];

    const dpLimits = [];
    const totalDP = system.levelinfo.dp;
    dpLimits.maxPrimaryDp = Math.floor(totalDP * (dpCost.limits.primary / 100));
    dpLimits.maxPrimaryCombatDp = Math.floor(totalDP * .5);
    dpLimits.maxMagicDp = Math.floor(totalDP * (dpCost.limits.supernatural / 100));
    dpLimits.maxMagicProjDp = Math.floor(dpLimits.maxMagicDp * .5);
    dpLimits.maxPsychicDp = Math.floor(totalDP * (dpCost.limits.psychic / 100));
    dpLimits.maxPsychicProjDp = Math.floor(dpLimits.maxPsychicDp * .5);

    const dpPrim = [
        { name: game.i18n.localize('abfalter.attack'), value: Math.floor(system.combatValues.attack.base * dpCost.primary.attack) },
        { name: game.i18n.localize('abfalter.block'), value: Math.floor(system.combatValues.block.base * dpCost.primary.block) },
        { name: game.i18n.localize('abfalter.dodge'), value: Math.floor(system.combatValues.dodge.base * dpCost.primary.dodge) },
        { name: game.i18n.localize('abfalter.wearArmor'), value: Math.floor(system.armor.wearArmor.base * dpCost.primary.wearArmor) },
        { name: game.i18n.localize('abfalter.mk'), value: Math.floor(system.mk.base) },
        { name: game.i18n.localize('abfalter.arsMagnus'), value: Math.floor(system.levelinfo.arsDp ) },
        { name: game.i18n.localize('abfalter.martialArts'), value: Math.floor(system.levelinfo.maDp ) },
        { name: game.i18n.localize('abfalter.kiPool'), value: Math.floor(Math.floor(system.kiPool.agi.defaultMax + system.kiPool.con.defaultMax + system.kiPool.dex.defaultMax +
            system.kiPool.str.defaultMax + system.kiPool.pow.defaultMax + system.kiPool.wp.defaultMax) * dpCost.primary.kiPoint) },
        { name: game.i18n.localize('abfalter.kiAccuMult'), value: Math.floor(Math.floor(system.kiPool.agi.default + system.kiPool.con.default + system.kiPool.dex.default +
            system.kiPool.str.default + system.kiPool.pow.default + system.kiPool.wp.default) * dpCost.primary.kiAccuMult) },
        { name: game.i18n.localize('abfalter.profModules'), value: Math.floor(system.levelinfo.profPrimDp ) }

    ];
    totalDpCosts.primary = dpPrim.reduce((acc, { value }) => acc + value, 0);
    totalDpCosts.primaryCombat = Math.floor(dpPrim[0].value + dpPrim[1].value + dpPrim[2].value);

    const dpMagic = [
        { name: game.i18n.localize('abfalter.mLevels'), value: Math.floor(system.mlevel.base) },
        { name: game.i18n.localize('abfalter.zeon'), value: Math.floor((system.zeon.base / 5) * dpCost.supernatural.zeon) },
        { name: game.i18n.localize('abfalter.maMult'), value: Math.floor(system.maccu.mult * dpCost.supernatural.maMult) },
        { name: game.i18n.localize('abfalter.maRegen'), value: Math.floor(system.mregen.regenmult * dpCost.supernatural.maRegen) },
        { name: game.i18n.localize('abfalter.mproj'), value: Math.floor(system.mproj.base * dpCost.supernatural.magicProj) },
        { name: game.i18n.localize('abfalter.summon'), value: Math.floor(system.summoning.summon.base * dpCost.supernatural.summon) },
        { name: game.i18n.localize('abfalter.control'), value: Math.floor(system.summoning.control.base * dpCost.supernatural.control) },
        { name: game.i18n.localize('abfalter.bind'), value: Math.floor(system.summoning.bind.base * dpCost.supernatural.bind) },
        { name: game.i18n.localize('abfalter.banish'), value: Math.floor(system.summoning.banish.base * dpCost.supernatural.banish) },
        { name: game.i18n.localize('abfalter.profModules'), value: Math.floor(system.levelinfo.profMystDp ) }
    ];
    totalDpCosts.magic = dpMagic.reduce((acc, { value }) => acc + value, 0);
    totalDpCosts.magicProj = dpMagic[4].value;

    const dpPsychic = [
        { name: game.i18n.localize('abfalter.activeEffectChanges.pp'), value: Math.floor(system.ppoint.base * dpCost.psychic.psyPoint) },
        { name: game.i18n.localize('abfalter.psyProj'), value: Math.floor(system.pproj.base * dpCost.psychic.psyProj) },
        { name: game.i18n.localize('abfalter.mentalPatternsOne'), value: Math.floor(system.levelinfo.mentalPatDp) },
        { name: game.i18n.localize('abfalter.profModules'), value: Math.floor(system.levelinfo.profPsyDp ) }
    ];
    totalDpCosts.psychic = dpPsychic.reduce((acc, { value }) => acc + value, 0);
    totalDpCosts.psychicProj = dpPsychic[1].value;

    const dpSecondary = [
        { name: game.i18n.localize('abfalter.lpMult'), value: Math.floor(system.lifepoints.multiple * dpCost.other.lpMult) },

        { name: game.i18n.localize('abfalter.acrobatic'), value: Math.floor(system.secondaryFields.athletics.acrobatics.base * (dpCost.fields.athleticsToggle ? dpCost.fields.athletics : dpCost.subject.acro)) },
        { name: game.i18n.localize('abfalter.athleticism'), value: Math.floor(system.secondaryFields.athletics.athleticism.base * (dpCost.fields.athleticsToggle ? dpCost.fields.athletics : dpCost.subject.athleticism)) },
        { name: game.i18n.localize('abfalter.climb'), value: Math.floor(system.secondaryFields.athletics.climb.base * (dpCost.fields.athleticsToggle ? dpCost.fields.athletics : dpCost.subject.climb)) },
        { name: game.i18n.localize('abfalter.jump'), value: Math.floor(system.secondaryFields.athletics.jump.base * (dpCost.fields.athleticsToggle ? dpCost.fields.athletics : dpCost.subject.jump)) },
        { name: game.i18n.localize('abfalter.piloting'), value: Math.floor(system.secondaryFields.athletics.piloting.base * (dpCost.fields.athleticsToggle ? dpCost.fields.athletics : dpCost.subject.piloting)) },
        { name: game.i18n.localize('abfalter.ride'), value: Math.floor(system.secondaryFields.athletics.ride.base * (dpCost.fields.athleticsToggle ? dpCost.fields.athletics : dpCost.subject.ride)) },
        { name: game.i18n.localize('abfalter.swim'), value: Math.floor(system.secondaryFields.athletics.swim.base * (dpCost.fields.athleticsToggle ? dpCost.fields.athletics : dpCost.subject.swim)) },

        { name: game.i18n.localize('abfalter.etiquette'), value: Math.floor(system.secondaryFields.social.etiquette.base * (dpCost.fields.socialToggle ? dpCost.fields.social : dpCost.subject.etiquette)) },
        { name: game.i18n.localize('abfalter.intimidate'), value: Math.floor(system.secondaryFields.social.intimidate.base * (dpCost.fields.socialToggle ? dpCost.fields.social : dpCost.subject.intimidate)) },
        { name: game.i18n.localize('abfalter.leadership'), value: Math.floor(system.secondaryFields.social.leadership.base * (dpCost.fields.socialToggle ? dpCost.fields.social : dpCost.subject.leadership)) },
        { name: game.i18n.localize('abfalter.persuasion'), value: Math.floor(system.secondaryFields.social.persuasion.base * (dpCost.fields.socialToggle ? dpCost.fields.social : dpCost.subject.persuasion)) },
        { name: game.i18n.localize('abfalter.streetwise'), value: Math.floor(system.secondaryFields.social.streetwise.base * (dpCost.fields.socialToggle ? dpCost.fields.social : dpCost.subject.streetwise)) },
        { name: game.i18n.localize('abfalter.style'), value: Math.floor(system.secondaryFields.social.style.base * (dpCost.fields.socialToggle ? dpCost.fields.social : dpCost.subject.style)) },
        { name: game.i18n.localize('abfalter.trading'), value: Math.floor(system.secondaryFields.social.trading.base * (dpCost.fields.socialToggle ? dpCost.fields.social : dpCost.subject.trading)) },

        { name: game.i18n.localize('abfalter.notice'), value: Math.floor(system.secondaryFields.perceptive.notice.base * (dpCost.fields.perceptiveToggle ? dpCost.fields.perceptive : dpCost.subject.notice)) },
        { name: game.i18n.localize('abfalter.search'), value: Math.floor(system.secondaryFields.perceptive.search.base * (dpCost.fields.perceptiveToggle ? dpCost.fields.perceptive : dpCost.subject.search)) },
        { name: game.i18n.localize('abfalter.track'), value: Math.floor(system.secondaryFields.perceptive.track.base * (dpCost.fields.perceptiveToggle ? dpCost.fields.perceptive : dpCost.subject.track)) },

        { name: game.i18n.localize('abfalter.animals'), value: Math.floor(system.secondaryFields.intellectual.animals.base * (dpCost.fields.intellectualToggle ? dpCost.fields.intellectual : dpCost.subject.animals)) },
        { name: game.i18n.localize('abfalter.appraisal'), value: Math.floor(system.secondaryFields.intellectual.appraisal.base * (dpCost.fields.intellectualToggle ? dpCost.fields.intellectual : dpCost.subject.appraisal)) },
        { name: game.i18n.localize('abfalter.architecture'), value: Math.floor(system.secondaryFields.intellectual.architecture.base * (dpCost.fields.intellectualToggle ? dpCost.fields.intellectual : dpCost.subject.architecture)) },
        { name: game.i18n.localize('abfalter.herballore'), value: Math.floor(system.secondaryFields.intellectual.herballore.base * (dpCost.fields.intellectualToggle ? dpCost.fields.intellectual : dpCost.subject.herballore)) },
        { name: game.i18n.localize('abfalter.history'), value: Math.floor(system.secondaryFields.intellectual.history.base * (dpCost.fields.intellectualToggle ? dpCost.fields.intellectual : dpCost.subject.history)) },
        { name: game.i18n.localize('abfalter.law'), value: Math.floor(system.secondaryFields.intellectual.law.base * (dpCost.fields.intellectualToggle ? dpCost.fields.intellectual : dpCost.subject.law)) },
        { name: game.i18n.localize('abfalter.magicAppr'), value: Math.floor(system.secondaryFields.intellectual.magicappr.base * (dpCost.fields.intellectualToggle ? dpCost.fields.intellectual : dpCost.subject.magicappr)) },
        { name: game.i18n.localize('abfalter.medicine'), value: Math.floor(system.secondaryFields.intellectual.medicine.base * (dpCost.fields.intellectualToggle ? dpCost.fields.intellectual : dpCost.subject.medicine)) },
        { name: game.i18n.localize('abfalter.memorize'), value: Math.floor(system.secondaryFields.intellectual.memorize.base * (dpCost.fields.intellectualToggle ? dpCost.fields.intellectual : dpCost.subject.memorize)) },
        { name: game.i18n.localize('abfalter.navigation'), value: Math.floor(system.secondaryFields.intellectual.navigation.base * (dpCost.fields.intellectualToggle ? dpCost.fields.intellectual : dpCost.subject.navigation)) },
        { name: game.i18n.localize('abfalter.occult'), value: Math.floor(system.secondaryFields.intellectual.occult.base * (dpCost.fields.intellectualToggle ? dpCost.fields.intellectual : dpCost.subject.occult)) },
        { name: game.i18n.localize('abfalter.science'), value: Math.floor(system.secondaryFields.intellectual.science.base * (dpCost.fields.intellectualToggle ? dpCost.fields.intellectual : dpCost.subject.science)) },
        { name: game.i18n.localize('abfalter.tactics'), value: Math.floor(system.secondaryFields.intellectual.tactics.base * (dpCost.fields.intellectualToggle ? dpCost.fields.intellectual : dpCost.subject.tactics)) },
        { name: game.i18n.localize('abfalter.technomagic'), value: Math.floor(system.secondaryFields.intellectual.technomagic.base * (dpCost.fields.intellectualToggle ? dpCost.fields.intellectual : dpCost.subject.technomagic)) },

        { name: game.i18n.localize('abfalter.composure'), value: Math.floor(system.secondaryFields.vigor.composure.base * (dpCost.fields.vigorToggle ? dpCost.fields.vigor : dpCost.subject.composure)) },
        { name: game.i18n.localize('abfalter.featsofstr'), value: Math.floor(system.secondaryFields.vigor.featsofstr.base * (dpCost.fields.vigorToggle ? dpCost.fields.vigor : dpCost.subject.featsofstr)) },
        { name: game.i18n.localize('abfalter.withstpain'), value: Math.floor(system.secondaryFields.vigor.withstpain.base * (dpCost.fields.vigorToggle ? dpCost.fields.vigor : dpCost.subject.withstpain)) },

        { name: game.i18n.localize('abfalter.disguise'), value: Math.floor(system.secondaryFields.subterfuge.disguise.base * (dpCost.fields.subterfugeToggle ? dpCost.fields.subterfuge : dpCost.subject.disguise)) },
        { name: game.i18n.localize('abfalter.hide'), value: Math.floor(system.secondaryFields.subterfuge.hide.base * (dpCost.fields.subterfugeToggle ? dpCost.fields.subterfuge : dpCost.subject.hide)) },
        { name: game.i18n.localize('abfalter.lockpicking'), value: Math.floor(system.secondaryFields.subterfuge.lockpicking.base * (dpCost.fields.subterfugeToggle ? dpCost.fields.subterfuge : dpCost.subject.lockpicking)) },
        { name: game.i18n.localize('abfalter.poisons'), value: Math.floor(system.secondaryFields.subterfuge.poisons.base * (dpCost.fields.subterfugeToggle ? dpCost.fields.subterfuge : dpCost.subject.poisons)) },
        { name: game.i18n.localize('abfalter.stealth'), value: Math.floor(system.secondaryFields.subterfuge.stealth.base * (dpCost.fields.subterfugeToggle ? dpCost.fields.subterfuge : dpCost.subject.stealth)) },
        { name: game.i18n.localize('abfalter.theft'), value: Math.floor(system.secondaryFields.subterfuge.theft.base * (dpCost.fields.subterfugeToggle ? dpCost.fields.subterfuge : dpCost.subject.theft)) },
        { name: game.i18n.localize('abfalter.traplore'), value: Math.floor(system.secondaryFields.subterfuge.traplore.base * (dpCost.fields.subterfugeToggle ? dpCost.fields.subterfuge : dpCost.subject.traplore)) },

        { name: game.i18n.localize('abfalter.alchemy'), value: Math.floor(system.secondaryFields.creative.alchemy.base * (dpCost.fields.creativeToggle ? dpCost.fields.creative : dpCost.subject.alchemy)) },
        { name: game.i18n.localize('abfalter.animism'), value: Math.floor(system.secondaryFields.creative.animism.base * (dpCost.fields.creativeToggle ? dpCost.fields.creative : dpCost.subject.animism)) },
        { name: game.i18n.localize('abfalter.art'), value: Math.floor(system.secondaryFields.creative.art.base * (dpCost.fields.creativeToggle ? dpCost.fields.creative : dpCost.subject.art)) },
        { name: game.i18n.localize('abfalter.cooking'), value: Math.floor(system.secondaryFields.creative.cooking.base * (dpCost.fields.creativeToggle ? dpCost.fields.creative : dpCost.subject.cooking)) },
        { name: game.i18n.localize('abfalter.dance'), value: Math.floor(system.secondaryFields.creative.dance.base * (dpCost.fields.creativeToggle ? dpCost.fields.creative : dpCost.subject.dance)) },
        { name: game.i18n.localize('abfalter.forging'), value: Math.floor(system.secondaryFields.creative.forging.base * (dpCost.fields.creativeToggle ? dpCost.fields.creative : dpCost.subject.forging)) },
        { name: game.i18n.localize('abfalter.jewelry'), value: Math.floor(system.secondaryFields.creative.jewelry.base * (dpCost.fields.creativeToggle ? dpCost.fields.creative : dpCost.subject.jewelry)) },
        { name: game.i18n.localize('abfalter.toymaking'), value: Math.floor(system.secondaryFields.creative.toymaking.base * (dpCost.fields.creativeToggle ? dpCost.fields.creative : dpCost.subject.toymaking)) },
        { name: game.i18n.localize('abfalter.music'), value: Math.floor(system.secondaryFields.creative.music.base * (dpCost.fields.creativeToggle ? dpCost.fields.creative : dpCost.subject.music)) },
        { name: game.i18n.localize('abfalter.runes'), value: Math.floor(system.secondaryFields.creative.runes.base * (dpCost.fields.creativeToggle ? dpCost.fields.creative : dpCost.subject.runes)) },
        { name: game.i18n.localize('abfalter.ritualcalig'), value: Math.floor(system.secondaryFields.creative.ritualcalig.base * (dpCost.fields.creativeToggle ? dpCost.fields.creative : dpCost.subject.ritualcalig)) },
        { name: game.i18n.localize('abfalter.slofhand'), value: Math.floor(system.secondaryFields.creative.slofhand.base * (dpCost.fields.creativeToggle ? dpCost.fields.creative : dpCost.subject.slofhand)) },
        { name: game.i18n.localize('abfalter.tailoring'), value: Math.floor(system.secondaryFields.creative.tailoring.base * (dpCost.fields.creativeToggle ? dpCost.fields.creative : dpCost.subject.tailoring)) },

        { name: game.i18n.localize('abfalter.monsterPowTitle'), value: Math.floor(system.monsterStats.totalDP) }
    ];

    
    totalDpCosts.other = dpSecondary.reduce((acc, { value }) => acc + value, 0);
    totalDpCosts.all = Math.floor(totalDpCosts.primary + totalDpCosts.magic + totalDpCosts.psychic + totalDpCosts.other);
    
    const dpWarning = [];
    dpWarning.primary = totalDpCosts.primary > dpLimits.maxPrimaryDp;
    dpWarning.primaryCombat = totalDpCosts.primaryCombat > dpLimits.maxPrimaryCombatDp;
    dpWarning.magic = totalDpCosts.magic > dpLimits.maxMagicDp;
    dpWarning.magicProj = totalDpCosts.magicProj > dpLimits.maxMagicProjDp;
    dpWarning.psychic = totalDpCosts.psychic > dpLimits.maxPsychicDp;
    dpWarning.psychicProj = totalDpCosts.psychicProj > dpLimits.maxPsychicProjDp;
    dpWarning.all = totalDpCosts.all > totalDP;
    
  
    const template = "systems/abfalter/templates/dialogues/dpCost.hbs";
    const templateData = {
        dpPrim: dpPrim,
        dpMagic: dpMagic,
        dpPsychic: dpPsychic,
        dpSecondary: dpSecondary,
        totalDpCosts,
        totalDP,
        dpLimits,
        dpWarning,
        myLevel
    };

    const htmlContent = await foundry.applications.handlebars.renderTemplate(template, templateData);
    new Dialog({
        title: 'DP Cost Calculation',
        content: htmlContent,
        buttons: {
            close: {
                label: 'Close',
                callback: () => {}
            }
        }
    }, {
        width: 500,
    }).render(true);
}


export async function openSpendKiWindow(actorData) {

}
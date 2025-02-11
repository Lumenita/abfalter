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
                        const results = new FormDataExtended(html.find('form')[0], {}).object;
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

export async function changeSecondaryTemps(actorData) {
    const mod = await openOneModDialog() || 0;

    actorData.update({
        "system.secondary.acrobatics.temp": mod, "system.secondary.athleticism.temp": mod, "system.secondary.climb.temp": mod, "system.secondary.jump.temp": mod,
        "system.secondary.ride.temp": mod, "system.secondary.swim.temp": mod, "system.secondary.etiquette.temp": mod, "system.secondary.intimidate.temp": mod,
        "system.secondary.leadership.temp": mod, "system.secondary.persuasion.temp": mod, "system.secondary.streetwise.temp": mod, "system.secondary.style.temp": mod,
        "system.secondary.trading.temp": mod, "system.secondary.notice.temp": mod, "system.secondary.search.temp": mod, "system.secondary.track.temp": mod,
        "system.secondary.animals.temp": mod, "system.secondary.appraisal.temp": mod, "system.secondary.architecture.temp": mod, "system.secondary.herballore.temp": mod,
        "system.secondary.history.temp": mod, "system.secondary.law.temp": mod, "system.secondary.magicappr.temp": mod, "system.secondary.medicine.temp": mod,
        "system.secondary.memorize.temp": mod, "system.secondary.navigation.temp": mod, "system.secondary.occult.temp": mod, "system.secondary.science.temp": mod,
        "system.secondary.tactics.temp": mod, "system.secondary.composure.temp": mod, "system.secondary.featsofstr.temp": mod, "system.secondary.withstpain.temp": mod,
        "system.secondary.disguise.temp": mod, "system.secondary.hide.temp": mod, "system.secondary.lockpicking.temp": mod, "system.secondary.poisons.temp": mod,
        "system.secondary.stealth.temp": mod, "system.secondary.theft.temp": mod, "system.secondary.traplore.temp": mod, "system.secondary.alchemy.temp": mod,
        "system.secondary.animism.temp": mod, "system.secondary.art.temp": mod, "system.secondary.dance.temp": mod, "system.secondary.forging.temp": mod,
        "system.secondary.jewelry.temp": mod, "system.secondary.music.temp": mod, "system.secondary.runes.temp": mod, "system.secondary.ritualcalig.temp": mod,
        "system.secondary.slofhand.temp": mod, "system.secondary.tailoring.temp": mod, "system.secondary.piloting.temp": mod, "system.secondary.cooking.temp": mod,
        "system.secondary.technomagic.temp": mod, "system.secondary.toymaking.temp": mod, "system.secondary.kidetection.temp": mod, "system.secondary.kiconceal.temp": mod
    })
}

export async function changeSecondarySpecs(actorData) {
    const mod = await openOneModDialog() || 0;

    actorData.update({
        "system.secondary.acrobatics.spec": mod, "system.secondary.athleticism.spec": mod, "system.secondary.climb.spec": mod, "system.secondary.jump.spec": mod,
        "system.secondary.ride.spec": mod, "system.secondary.swim.spec": mod, "system.secondary.etiquette.spec": mod, "system.secondary.intimidate.spec": mod,
        "system.secondary.leadership.spec": mod, "system.secondary.persuasion.spec": mod, "system.secondary.streetwise.spec": mod, "system.secondary.style.spec": mod,
        "system.secondary.trading.spec": mod, "system.secondary.notice.spec": mod, "system.secondary.search.spec": mod, "system.secondary.track.spec": mod,
        "system.secondary.animals.spec": mod, "system.secondary.appraisal.spec": mod, "system.secondary.architecture.spec": mod, "system.secondary.herballore.spec": mod,
        "system.secondary.history.spec": mod, "system.secondary.law.spec": mod, "system.secondary.magicappr.spec": mod, "system.secondary.medicine.spec": mod,
        "system.secondary.memorize.spec": mod, "system.secondary.navigation.spec": mod, "system.secondary.occult.spec": mod, "system.secondary.science.spec": mod,
        "system.secondary.tactics.spec": mod, "system.secondary.composure.spec": mod, "system.secondary.featsofstr.spec": mod, "system.secondary.withstpain.spec": mod,
        "system.secondary.disguise.spec": mod, "system.secondary.hide.spec": mod, "system.secondary.lockpicking.spec": mod, "system.secondary.poisons.spec": mod,
        "system.secondary.stealth.spec": mod, "system.secondary.theft.spec": mod, "system.secondary.traplore.spec": mod, "system.secondary.alchemy.spec": mod,
        "system.secondary.animism.spec": mod, "system.secondary.art.spec": mod, "system.secondary.dance.spec": mod, "system.secondary.forging.spec": mod,
        "system.secondary.jewelry.spec": mod, "system.secondary.music.spec": mod, "system.secondary.runes.spec": mod, "system.secondary.ritualcalig.spec": mod,
        "system.secondary.slofhand.spec": mod, "system.secondary.tailoring.spec": mod, "system.secondary.piloting.spec": mod, "system.secondary.cooking.spec": mod,
        "system.secondary.technomagic.spec": mod, "system.secondary.toymaking.spec": mod, "system.secondary.kidetection.spec": mod, "system.secondary.kiconceal.spec": mod
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
        { name: game.i18n.localize('abfalter.kiPool'), value: Math.floor(Math.floor(system.kiPool.agi.defaultMax + system.kiPool.con.defaultMax + system.kiPool.dex.defaultMax +
            system.kiPool.str.defaultMax + system.kiPool.pow.defaultMax + system.kiPool.wp.defaultMax) * dpCost.primary.kiPoint) },
        { name: game.i18n.localize('abfalter.kiAccuMult'), value: Math.floor(Math.floor(system.kiPool.agi.default + system.kiPool.con.default + system.kiPool.dex.default +
            system.kiPool.str.default + system.kiPool.pow.default + system.kiPool.wp.default) * dpCost.primary.kiAccuMult) }
    ];
    totalDpCosts.primary = dpPrim.reduce((acc, { value }) => acc + value, 0);
    totalDpCosts.primaryCombat = Math.floor(dpPrim[0].value + dpPrim[1].value + dpPrim[2].value);

    const dpMagic = [
        { name: game.i18n.localize('abfalter.zeon'), value: Math.floor((system.zeon.base / 5) * dpCost.supernatural.zeon) },
        { name: game.i18n.localize('abfalter.maMult'), value: Math.floor(system.maccu.mult * dpCost.supernatural.maMult) },
        { name: game.i18n.localize('abfalter.maRegen'), value: Math.floor(system.mregen.regenmult * dpCost.supernatural.maRegen) },
        { name: game.i18n.localize('abfalter.mproj'), value: Math.floor(system.mproj.base * dpCost.supernatural.magicProj) },
        { name: game.i18n.localize('abfalter.summon'), value: Math.floor(system.summoning.summon.base * dpCost.supernatural.summon) },
        { name: game.i18n.localize('abfalter.control'), value: Math.floor(system.summoning.control.base * dpCost.supernatural.control) },
        { name: game.i18n.localize('abfalter.bind'), value: Math.floor(system.summoning.bind.base * dpCost.supernatural.bind) },
        { name: game.i18n.localize('abfalter.banish'), value: Math.floor(system.summoning.banish.base * dpCost.supernatural.banish) }
    ];
    totalDpCosts.magic = dpMagic.reduce((acc, { value }) => acc + value, 0);
    totalDpCosts.magicProj = dpMagic[3].value;

    const dpPsychic = [
        { name: game.i18n.localize('abfalter.activeEffectChanges.pp'), value: Math.floor(system.ppoint.base * dpCost.psychic.psyPoint) },
        { name: game.i18n.localize('abfalter.psyProj'), value: Math.floor(system.pproj.base * dpCost.psychic.psyProj) }
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
        { name: game.i18n.localize('abfalter.tailoring'), value: Math.floor(system.secondaryFields.creative.tailoring.base * (dpCost.fields.creativeToggle ? dpCost.fields.creative : dpCost.subject.tailoring)) }
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

    const htmlContent = await renderTemplate(template, templateData);
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
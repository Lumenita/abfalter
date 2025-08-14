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
        context: { content, placeholder }
    });
    return new Promise((resolve) => {
        foundry.applications.api.DialogV2.wait({
            classes: ["baseAbfalter", "abfalterDialog", "oneModDialog"],
            window: { title: game.i18n.localize("abfalter.secondaryChanger") },
            content: html,
            position: {
                width: 275,
                height: "auto"
            },
            buttons: [
                {
                    label: game.i18n.localize("abfalter.dialogs.confirm"),
                    action: 'submit',
                    callback: (event, button, dialog) => {
                        const form = dialog.element.querySelector("form");
                        if (!form) return resolve(null);
                        const data = new foundry.applications.ux.FormDataExtended(form).object;
                        const raw = data["dialog-input"];
                        const value = Number(raw);
                        console.log(value);
                        const formData = {
                            confirmed: true,
                            value: value || 0
                        }
                        resolve(formData);
                    }
                },
                {
                    label: game.i18n.localize("abfalter.dialogs.cancel"),
                    action: 'cancel',
                    callback: (event, button, dialog) => {
                        const formData = {
                            confirmed: false,
                            value: null
                        }
                        resolve(formData);
                    }
                }
            ]
        });
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
                    "system.pproj.temp": 0, "system.armor.wearArmor.temp": 0,
                    "system.lp.value": Math.min(Math.floor(actor.system.lp.value + actor.system.regeneration.rawValue), actor.system.lp.max),
                    "system.fatigue.value": actor.system.fatigue.max, 
                    "system.zeon.value":  Math.min(Math.floor(actor.system.zeon.value + actor.system.mregen.finalMinusMaint), actor.system.zeon.max),
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
    const formData = await openOneModDialog();
    if (!formData.confirmed) return;
    actorData.update({
        "system.secondaryFields.athletics.acrobatics.temp": formData.value, "system.secondaryFields.athletics.athleticism.temp": formData.value, "system.secondaryFields.athletics.climb.temp": formData.value, "system.secondaryFields.athletics.jump.temp": formData.value,
        "system.secondaryFields.athletics.ride.temp": formData.value, "system.secondaryFields.athletics.swim.temp": formData.value, "system.secondaryFields.social.etiquette.temp": formData.value, "system.secondaryFields.social.intimidate.temp": formData.value,
        "system.secondaryFields.social.leadership.temp": formData.value, "system.secondaryFields.social.persuasion.temp": formData.value, "system.secondaryFields.social.streetwise.temp": formData.value, "system.secondaryFields.social.style.temp": formData.value,
        "system.secondaryFields.social.trading.temp": formData.value, "system.secondaryFields.perceptive.notice.temp": formData.value, "system.secondaryFields.perceptive.search.temp": formData.value, "system.secondaryFields.perceptive.track.temp": formData.value,
        "system.secondaryFields.intellectual.animals.temp": formData.value, "system.secondaryFields.intellectual.appraisal.temp": formData.value, "system.secondaryFields.intellectual.architecture.temp": formData.value, "system.secondaryFields.intellectual.herballore.temp": formData.value,
        "system.secondaryFields.intellectual.history.temp": formData.value, "system.secondaryFields.intellectual.law.temp": formData.value, "system.secondaryFields.intellectual.magicappr.temp": formData.value, "system.secondaryFields.intellectual.medicine.temp": formData.value,
        "system.secondaryFields.intellectual.memorize.temp": formData.value, "system.secondaryFields.intellectual.navigation.temp": formData.value, "system.secondaryFields.intellectual.occult.temp": formData.value, "system.secondaryFields.intellectual.science.temp": formData.value,
        "system.secondaryFields.intellectual.tactics.temp": formData.value, "system.secondaryFields.vigor.composure.temp": formData.value, "system.secondaryFields.vigor.featsofstr.temp": formData.value, "system.secondaryFields.vigor.withstpain.temp": formData.value,
        "system.secondaryFields.subterfuge.disguise.temp": formData.value, "system.secondaryFields.subterfuge.hide.temp": formData.value, "system.secondaryFields.subterfuge.lockpicking.temp": formData.value, "system.secondaryFields.subterfuge.poisons.temp": formData.value,
        "system.secondaryFields.subterfuge.stealth.temp": formData.value, "system.secondaryFields.subterfuge.theft.temp": formData.value, "system.secondaryFields.subterfuge.traplore.temp": formData.value, "system.secondaryFields.creative.alchemy.temp": formData.value,
        "system.secondaryFields.creative.animism.temp": formData.value, "system.secondaryFields.creative.art.temp": formData.value, "system.secondaryFields.creative.dance.temp": formData.value, "system.secondaryFields.creative.forging.temp": formData.value,
        "system.secondaryFields.creative.jewelry.temp": formData.value, "system.secondaryFields.creative.music.temp": formData.value, "system.secondaryFields.creative.runes.temp": formData.value, "system.secondaryFields.creative.ritualcalig.temp": formData.value,
        "system.secondaryFields.creative.slofhand.temp": formData.value, "system.secondaryFields.creative.tailoring.temp": formData.value, "system.secondaryFields.athletics.piloting.temp": formData.value, "system.secondaryFields.creative.cooking.temp": formData.value,
        "system.secondaryFields.intellectual.technomagic.temp": formData.value, "system.secondaryFields.creative.toymaking.temp": formData.value, "system.secondaryFields.perceptive.kidetection.temp": formData.value, "system.secondaryFields.subterfuge.kiconceal.temp": formData.value
    })
}

export async function changeSecondarySpecs(actorData) {
    const formData = await openOneModDialog();
    if (!formData.confirmed) return;
    actorData.update({
        "system.secondaryFields.athletics.acrobatics.spec": formData.value, "system.secondaryFields.athletics.athleticism.spec": formData.value, "system.secondaryFields.athletics.climb.spec": formData.value, "system.secondaryFields.athletics.jump.spec": formData.value,
        "system.secondaryFields.athletics.ride.spec": formData.value, "system.secondaryFields.athletics.swim.spec": formData.value, "system.secondaryFields.social.etiquette.spec": formData.value, "system.secondaryFields.social.intimidate.spec": formData.value,
        "system.secondaryFields.social.leadership.spec": formData.value, "system.secondaryFields.social.persuasion.spec": formData.value, "system.secondaryFields.social.streetwise.spec": formData.value, "system.secondaryFields.social.style.spec": formData.value,
        "system.secondaryFields.social.trading.spec": formData.value, "system.secondaryFields.perceptive.notice.spec": formData.value, "system.secondaryFields.perceptive.search.spec": formData.value, "system.secondaryFields.perceptive.track.spec": formData.value,
        "system.secondaryFields.intellectual.animals.spec": formData.value, "system.secondaryFields.intellectual.appraisal.spec": formData.value, "system.secondaryFields.intellectual.architecture.spec": formData.value, "system.secondaryFields.intellectual.herballore.spec": formData.value,
        "system.secondaryFields.intellectual.history.spec": formData.value, "system.secondaryFields.intellectual.law.spec": formData.value, "system.secondaryFields.intellectual.magicappr.spec": formData.value, "system.secondaryFields.intellectual.medicine.spec": formData.value,
        "system.secondaryFields.intellectual.memorize.spec": formData.value, "system.secondaryFields.intellectual.navigation.spec": formData.value, "system.secondaryFields.intellectual.occult.spec": formData.value, "system.secondaryFields.intellectual.science.spec": formData.value,
        "system.secondaryFields.intellectual.tactics.spec": formData.value, "system.secondaryFields.vigor.composure.spec": formData.value, "system.secondaryFields.vigor.featsofstr.spec": formData.value, "system.secondaryFields.vigor.withstpain.spec": formData.value,
        "system.secondaryFields.subterfuge.disguise.spec": formData.value, "system.secondaryFields.subterfuge.hide.spec": formData.value, "system.secondaryFields.subterfuge.lockpicking.spec": formData.value, "system.secondaryFields.subterfuge.poisons.spec": formData.value,
        "system.secondaryFields.subterfuge.stealth.spec": formData.value, "system.secondaryFields.subterfuge.theft.spec": formData.value, "system.secondaryFields.subterfuge.traplore.spec": formData.value, "system.secondaryFields.creative.alchemy.spec": formData.value,
        "system.secondaryFields.creative.animism.spec": formData.value, "system.secondaryFields.creative.art.spec": formData.value, "system.secondaryFields.creative.dance.spec": formData.value, "system.secondaryFields.creative.forging.spec": formData.value,
        "system.secondaryFields.creative.jewelry.spec": formData.value, "system.secondaryFields.creative.music.spec": formData.value, "system.secondaryFields.creative.runes.spec": formData.value, "system.secondaryFields.creative.ritualcalig.spec": formData.value,
        "system.secondaryFields.creative.slofhand.spec": formData.value, "system.secondaryFields.creative.tailoring.spec": formData.value, "system.secondaryFields.athletics.piloting.spec": formData.value, "system.secondaryFields.creative.cooking.spec": formData.value,
        "system.secondaryFields.intellectual.technomagic.spec": formData.value, "system.secondaryFields.creative.toymaking.spec": formData.value, "system.secondaryFields.perceptive.kidetection.spec": formData.value, "system.secondaryFields.subterfuge.kiconceal.spec": formData.value
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
    let totalDP = system.levelinfo.dp;
    dpLimits.maxPrimaryDp = Math.floor(totalDP * (dpCost.limits.primary / 100));
    dpLimits.maxPrimaryCombatDp = Math.floor(totalDP * .5);
    dpLimits.maxMagicDp = Math.floor(totalDP * (dpCost.limits.supernatural / 100));
    dpLimits.maxMagicProjDp = Math.floor(dpLimits.maxMagicDp * .5);
    dpLimits.maxPsychicDp = Math.floor(totalDP * (dpCost.limits.psychic / 100));
    dpLimits.maxPsychicProjDp = Math.floor(dpLimits.maxPsychicDp * .5);
    dpLimits.fortyPercent = Math.floor(totalDP * .4);

    const customSecEntries = actorData.items
        .filter(item => item.type === "secondary")
        .map(item => {
            const name = item.name;
            const value = Math.floor(item.system.base * item.system.dpValue);
            return { name, value };
    });

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

        { name: game.i18n.localize('abfalter.monsterPowTitle'), value: Math.floor(system.monsterStats.totalDP) },
        ...customSecEntries
    ];

    dpLimits.maxPrimaryDp += system.levelinfo.primDpMod;
    dpLimits.maxPrimaryCombatDp += system.levelinfo.combatDpMod;
    dpLimits.maxMagicDp += system.levelinfo.mysticDpMod;
    dpLimits.maxMagicProjDp += system.levelinfo.mysticProjDpMod;
    dpLimits.maxPsychicDp += system.levelinfo.psychicDpMod;
    dpLimits.maxPsychicProjDp += system.levelinfo.psychicProjDpMod;

    totalDpCosts.other = dpSecondary.reduce((acc, { value }) => acc + value, 0);
    totalDpCosts.all = Math.floor(totalDpCosts.primary + totalDpCosts.magic + totalDpCosts.psychic + totalDpCosts.other);
    totalDP += Math.floor(system.levelinfo.primDpMod + system.levelinfo.combatDpMod + system.levelinfo.mysticDpMod 
        + system.levelinfo.mysticProjDpMod + system.levelinfo.psychicDpMod + system.levelinfo.psychicProjDpMod);

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
    foundry.applications.api.DialogV2.wait({
        classes: ["baseAbfalter", "abfalterDialog"],
        window: { title: game.i18n.localize("abfalter.dpCostCalc") },
        content: htmlContent,
        position: {
            width: 500,
            height: "auto"
        },
        buttons: [
            {
                label: 'Calculate',
                action: 'submit',
                callback: async () => {
                    await calculateDpCost(actorData, classId);
                }
            },
            {
                label: 'Close',
                action: 'close',
                callback: () => {}
            }
        ]
    });

}

export async function dpOffSetsWindow(actorData) {
    const template = templates.dpOffsets;
    const templateData = { actor: actorData };
    const htmlContent = await foundry.applications.handlebars.renderTemplate(template, templateData);

    const formData = await new Promise((resolve) => {
        foundry.applications.api.DialogV2.wait({
            classes: ["baseAbfalter", "abfalterDialog", "dpOffSetsDialog"],
            window: { title: game.i18n.localize("abfalter.dpOffsets") },
            content: htmlContent,
            position: {
                width: 475,
                height: "auto"
            },
            buttons: [
                {
                    label: game.i18n.localize("abfalter.dialogs.saveChanges"),
                    action: 'submit',
                    callback: (event, button, dialog) => {
                        const form = dialog.element.querySelector("form");
                        if (!form) return resolve(null);
                        const data = new foundry.applications.ux.FormDataExtended(form).object;
                        let formData = {};
                        formData.confirmed = true;
                        formData.dpmod = Number(data["overallDpMod"]);
                        formData.primDpMod = Number(data["primaryDpMod"]);
                        formData.combatDpMod = Number(data["combatDpMod"]);
                        formData.magicDpMod = Number(data["magicDpMod"]);
                        formData.magicProjDpMod = Number(data["magicProjDpMod"]);
                        formData.psychicDpMod = Number(data["psychicDpMod"]);
                        formData.psychicProjDpMod = Number(data["psychicProjDpMod"]);
                        resolve(formData);
                    }
                },
                {
                    label: game.i18n.localize("abfalter.dialogs.cancel"),
                    action: 'cancel',
                    callback: (event, button, dialog) => {
                        let formData = {};
                        formData.confirmed = false;
                        resolve(formData);
                    }
                }
            ]
        });
    });
    if (!formData || !formData.confirmed) return;
    await actorData.update({
        "system.levelinfo.primDpMod": formData.primDpMod,
        "system.levelinfo.combatDpMod": formData.combatDpMod,
        "system.levelinfo.mysticDpMod": formData.magicDpMod,
        "system.levelinfo.mysticProjDpMod": formData.magicProjDpMod,
        "system.levelinfo.psychicDpMod": formData.psychicDpMod,
        "system.levelinfo.psychicProjDpMod": formData.psychicProjDpMod
    });
}

export async function settingsWindow(actorData) {
    const template = templates.settingsValues;
    const templateData = { actor: actorData };
    const htmlContent = await foundry.applications.handlebars.renderTemplate(template, templateData);

    const formData = await new Promise((resolve) => {
        foundry.applications.api.DialogV2.wait({
            classes: ["baseAbfalter", "abfalterDialog", "settingsValuesDialog"],
            window: { title: game.i18n.localize("abfalter.settingsExtended") },
            content: htmlContent,
            position: {
                width: 475,
                height: "auto"
            },
            buttons: [
                {
                    label: game.i18n.localize("abfalter.dialogs.saveChanges"),
                    action: 'submit',
                    callback: (event, button, dialog) => {
                        const form = dialog.element.querySelector("form");
                        if (!form) return resolve(null);
                        const data = new foundry.applications.ux.FormDataExtended(form).object;
                        let formData = {};
                        formData.confirmed = true;
                        formData.phrMult = Number(data["phrMult"]);
                        formData.drMult = Number(data["drMult"]);
                        formData.psnrMult = Number(data["psnrMult"]);
                        formData.mrMult = Number(data["mrMult"]);
                        formData.psyrMult = Number(data["psyrMult"]);
                        formData.fatigueValue = Number(data["fatigueValue"]);
                        resolve(formData);
                    }
                },
                {
                    label: game.i18n.localize("abfalter.dialogs.cancel"),
                    action: 'cancel',
                    callback: (event, button, dialog) => {
                        let formData = {};
                        formData.confirmed = false;
                        resolve(formData);
                    }
                }
            ]
        });
    });
    if (!formData || !formData.confirmed) return;
        await actorData.update({
        "system.settings.phrMult": formData.phrMult,
        "system.settings.drMult": formData.drMult,
        "system.settings.psnrMult": formData.psnrMult,
        "system.settings.mrMult": formData.mrMult,
        "system.settings.psyrMult": formData.psyrMult,//here
        "system.settings.fatigueValue": formData.fatigueValue
    });
}


export async function openSpendKiWindow(actorData) {

}
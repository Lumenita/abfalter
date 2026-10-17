import { renderTemplates } from '../utilities/renderTemplates.js';
import { templates } from '../utilities/templates.js';
import { genericDialogs } from "../dialogs.js";


export const openOneModDialog = async () => {
    return oneModDialog({
        content: "Modifier",
        placeholder: '0'
    });
}

export const oneModDialog = async ({ content, placeholder = '' }) => {
    const html = await renderTemplates({
        name: templates.initiative,
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
    const template = "systems/abfalter/templates/dialogues/dpCost.hbs";

    // Always use the current actor and class data.
    const renderContent = async () => {
        const templateData = getDpCostData(actorData, classId);

        return foundry.applications.handlebars.renderTemplate(
            template,
            templateData
        );
    };

    class DpCostDialog extends foundry.applications.api.DialogV2 {
        constructor(options) {
            super(options);

            this.updateHooks = [];
            this.refreshing = false;
            this.refreshPending = false;
        }

        async refreshValues() {
            if (this.refreshing) {
                this.refreshPending = true;
                return;
            }

            this.refreshing = true;

            try {
                do {
                    this.refreshPending = false;

                    const content = await renderContent();

                    // Update only the dialog's content.
                    const container = this.element?.querySelector(".dialog-content");

                    if (container) {
                        container.innerHTML = content;
                    }

                } while (this.refreshPending);
            } finally {
                this.refreshing = false;
            }
        }

        registerHooks() {
            const refreshActor = updatedActor => {
                if (updatedActor.id !== actorData.id) return;
                void this.refreshValues();
            };

            const refreshItem = item => {
                if (item.parent?.id !== actorData.id) return;
                void this.refreshValues();
            };

            this.updateHooks.push(
                ["updateActor", Hooks.on("updateActor", refreshActor)],
                ["createItem", Hooks.on("createItem", refreshItem)],
                ["updateItem", Hooks.on("updateItem", refreshItem)],
                ["deleteItem", Hooks.on("deleteItem", refreshItem)]
            );
        }

        async close(options = {}) {
            for (const [hookName, hookId] of this.updateHooks) {
                Hooks.off(hookName, hookId);
            }

            this.updateHooks = [];

            return super.close(options);
        }
    }

    const dialog = new DpCostDialog({
        classes: ["baseAbfalter", "abfalterDialog"],

        window: {
            title: `${actorData.name} - ${game.i18n.localize("abfalter.dpCostCalc")}`
        },

        content: await renderContent(),

        position: {
            width: 500,
            height: "auto"
        },

        buttons: [
            {
                action: "close",
                label: game.i18n.localize("abfalter.dialogs.close"),
                callback: () => { }
            }
        ]
    });

    dialog.registerHooks();
    dialog.render(true);
}

function getDpCostData(actorData, classId) {
    const system = actorData.system;
    const myLevel = system.levelinfo.level;

    const naturalBonuses = {
        green: 0,
        blue: 0,
        natural: 0,
        maxGreen: myLevel,
        maxBlue: myLevel,
        maxNatural: myLevel * 5,
        maxPerAbility: myLevel * 10,
        greenEntries: [],
        blueEntries: [],
        naturalEntries: []
    };

    for (const [field, abilities] of Object.entries(system.secondaryFields)) {
        if (field === "category") continue;

        for (const [key, ability] of Object.entries(abilities)) {
            if (!ability || typeof ability !== "object") continue;

            const nat = Number(ability.nat) || 0;
            const natural = Number(ability.natural) || 0;

            const name = game.i18n.localize(`abfalter.${ability.label}`);

            if (nat > 0) {
                const entry = { name, value: nat };

                if (ability.type === "physical") {
                    naturalBonuses.green += nat;
                    naturalBonuses.greenEntries.push(entry);
                } else {
                    naturalBonuses.blue += nat;
                    naturalBonuses.blueEntries.push(entry);
                }
            }

            if (natural > 0) {
                naturalBonuses.natural += natural / 10;

                naturalBonuses.naturalEntries.push({
                    name,
                    value: natural,
                    warning: natural > naturalBonuses.maxPerAbility
                });
            }
        }
    }
    naturalBonuses.warningGreen = naturalBonuses.green > naturalBonuses.maxGreen;
    naturalBonuses.warningBlue = naturalBonuses.blue > naturalBonuses.maxBlue;
    naturalBonuses.warningNatural = naturalBonuses.natural > naturalBonuses.maxNatural;
    naturalBonuses.warningPerAbility = naturalBonuses.naturalEntries.some(entry => entry.warning);


    const classItem = actorData.items.get(classId);
    if (!classItem) {
        console.error(`Class item with id ${classId} not found`);
        return;
    }
    const dpCost = classItem.system.dpCost;
    const totalDpCosts = [];

    let totalDP = system.levelinfo.dp;
    const dpLimits = {
        maxPrimaryDp: Math.floor(totalDP * dpCost.limits.primary / 100),
        maxPrimaryCombatDp: Math.floor(totalDP * 0.5),
        maxMagicDp: Math.floor(totalDP * dpCost.limits.supernatural / 100),
        maxPsychicDp: Math.floor(totalDP * dpCost.limits.psychic / 100),
        fortyPercent: Math.floor(totalDP * 0.4)
    };
    dpLimits.maxMagicProjDp = Math.floor(dpLimits.maxMagicDp * .5);
    dpLimits.maxPsychicProjDp = Math.floor(dpLimits.maxPsychicDp * .5);

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


    const secondaryKeyMap = {
        acrobatics: "acro"
    };

    const dpSecondary = [
        {
            name: game.i18n.localize("abfalter.lpMult"),
            value: Math.floor(system.lifepoints.multiple * dpCost.other.lpMult)
        }
    ];

    for (const [field, abilities] of Object.entries(system.secondaryFields)) {
        if (field === "category") continue;

        const useFieldCost = dpCost.fields[`${field}Toggle`];
        const fieldCost = dpCost.fields[field];

        for (const [key, ability] of Object.entries(abilities)) {
            if (key === "kidetection" || key === "kiconceal") continue;
            if (!ability || typeof ability !== "object") continue;

            const costKey = secondaryKeyMap[key] ?? key;

            const cost = useFieldCost
                ? fieldCost
                : dpCost.subject[costKey];

            // Skip abilities without a defined DP cost.
            if (cost === undefined) continue;

            dpSecondary.push({
                name: game.i18n.localize(`abfalter.${ability.label}`),
                value: Math.floor(ability.base * cost)
            });
        }
    }

    dpSecondary.push(
        {
            name: game.i18n.localize("abfalter.monsterPowTitle"),
            value: Math.floor(system.monsterStats.totalDP)
        },
        ...customSecEntries
    );


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
    
  
    return {
        dpPrim: dpPrim,
        dpMagic: dpMagic,
        dpPsychic: dpPsychic,
        dpSecondary: dpSecondary,
        totalDpCosts,
        totalDP,
        dpLimits,
        dpWarning,
        myLevel,
        naturalBonuses
    };
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

const KI_ATTRIBUTES = ["agi", "dex", "con", "str", "pow", "wp"];
export function kiAccumulate(actor, amount = "full") {
    const attributes = ["agi", "con", "dex", "str", "pow", "wp"];
    const unifiedPools = actor.system.toggles.unifiedPools ?? false;

    const updateData = {};

    for (const attr of attributes) {
        const pool = actor.system.kiPool[attr];
        let accumulated = 0;

        if (pool.accumulating) {
            switch (amount) {
                case "half":
                    accumulated = Math.max(1, Math.ceil(pool.accumTot / 2));
                    break;
                case "removeHalf":
                    accumulated = -Math.max(1, Math.floor(pool.accumTot / 2));
                    break;
                case "full":
                    accumulated = pool.accumTot;
                    break;
            }
        }
        let newCurrent = Math.max(0, pool.current + accumulated);
        if (!unifiedPools) { newCurrent = Math.min(newCurrent, pool.poolTot ?? 0); }

        updateData[`system.kiPool.${attr}.current`] = newCurrent;
    }

    return actor.update(updateData);
}

export async function kiReset(actor) {
    const confirmed = await genericDialogs.confirm(
        game.i18n.localize("abfalter.ki"),
        game.i18n.localize("abfalter.accuKiReset")
    );

    if (!confirmed) return;

    actor.update({
        "system.kiPool.agi.current": 0, "system.kiPool.con.current": 0, "system.kiPool.dex.current": 0,
        "system.kiPool.str.current": 0, "system.kiPool.pow.current": 0, "system.kiPool.wp.current": 0
    });

    return
}

export async function kiCast(actor) {
    const canPush = actor.system.kiAbility.kiTechPush.status ?? false;
    const unifiedPools = actor.system.toggles.unifiedPools ?? false;
    const localizedAttr = attr => game.i18n.localize(`abfalter.${attr}`);
    const emptyCosts = () => Object.fromEntries(KI_ATTRIBUTES.map(attr => [attr, 0]));

    const getCosts = (technique, pushed = false) => {
        const mult = pushed ? 2 : 1;
        return Object.fromEntries(
            KI_ATTRIBUTES.map(attr => [attr, (technique.system.use[attr] ?? 0) * mult])
        );
    };

    const sumEntries = entries => {
        const totals = emptyCosts();

        for (const entry of entries) {
            const costs = getCosts(entry.technique, entry.pushed);
            for (const attr of KI_ATTRIBUTES) totals[attr] += costs[attr];
        }

        return totals;
    };

    const getUnifiedCost = costs => KI_ATTRIBUTES.reduce((total, attr) => total + costs[attr], 0);

    // Active techniques are hidden.
    // Held techniques always show because their accumulation has already been paid.
    const techniques = actor.items
        .filter(item =>
            item.type === "kiTechnique" &&
            !item.system.active
        )
        .sort((a, b) => a.sort - b.sort);

    if (!techniques.length) {
        ui.notifications.warn(game.i18n.localize("abfalter.noTechniques"));
        return;
    }

    const techniqueData = techniques.map(technique => {
        const held = technique.system.hold ?? false;
        const heldPushed = technique.system.holdPushed ?? false;
        const costs = getCosts(technique);

        const costData = KI_ATTRIBUTES
            .filter(attr => costs[attr] > 0)
            .map(attr => ({
                label: localizedAttr(attr),
                value: costs[attr],
                insufficient:
                    !held &&
                    (actor.system.kiPool[attr]?.current ?? 0) < costs[attr]
            }));

        return {
            id: technique.id,
            name: technique.name,
            held,
            heldPushed,
            canPush: canPush && !held,
            costs: costData
        };
    });

    const content = await foundry.applications.handlebars.renderTemplate(
        "systems/abfalter/templates/dialogues/prompt/kiCast.hbs",
        { techniques: techniqueData }
    );

    const readSelection = html => {
        const selected = [];

        html.querySelectorAll(".kiCastSelect:checked").forEach(checkbox => {
            const id = checkbox.dataset.techniqueId;
            const technique = actor.items.get(id);
            if (!technique) return;

            const held = technique.system.hold ?? false;

            // Techniques already on Hold can only be Cast.
            const mode = held
                ? "cast"
                : html.querySelector(`.kiCastMode[data-technique-id="${id}"]`)?.value ?? "cast";

            // Held techniques remember whether they were pushed when put on Hold.
            const pushed = held
                ? technique.system.holdPushed ?? false
                : canPush && (
                    html.querySelector(`.kiCastPush[data-technique-id="${id}"]`)?.checked ?? false
                );

            selected.push({ technique, held, mode, pushed });
        });

        return selected;
    };

    // New Casts and new Holds pay accumulated/current Ki.
    // Techniques already on Hold do not pay current again.
    const getAccumulationEntries = selected =>
        selected.filter(entry => !entry.held);

    const getActivationEntries = selected =>
        selected.filter(entry => entry.mode === "cast");

    const canPayAccumulation = selected => {
        const costs = sumEntries(getAccumulationEntries(selected));

        return KI_ATTRIBUTES.every(attr =>
            (actor.system.kiPool[attr]?.current ?? 0) >= costs[attr]
        );
    };

    const canPayActual = selected => {
        const costs = sumEntries(getActivationEntries(selected));

        if (unifiedPools) {
            return (actor.system.unifiedKi?.value ?? 0) >= getUnifiedCost(costs);
        }

        return KI_ATTRIBUTES.every(attr =>
            (actor.system.kiPool[attr]?.actual ?? 0) >= costs[attr]
        );
    };

    const formatRemaining = value =>
        value < 0
            ? `<span class="kiNegative">${value}</span>`
            : value;

    const updatePreview = html => {
        const selected = readSelection(html);

        // Enable Push / Cast-Hold controls only when that technique is selected.
        html.querySelectorAll(".kiCastSelect").forEach(checkbox => {
            const id = checkbox.dataset.techniqueId;
            const mode = html.querySelector(`.kiCastMode[data-technique-id="${id}"]`);
            const push = html.querySelector(`.kiCastPush[data-technique-id="${id}"]`);

            if (mode) mode.disabled = !checkbox.checked;
            if (push) push.disabled = !checkbox.checked;
        });

        const accumCosts = sumEntries(getAccumulationEntries(selected));
        const actualCosts = sumEntries(getActivationEntries(selected));

        const accumParts = KI_ATTRIBUTES
            .filter(attr => accumCosts[attr] > 0)
            .map(attr => {
                const current = actor.system.kiPool[attr]?.current ?? 0;
                const remaining = current - accumCosts[attr];
                return `${localizedAttr(attr)} ${formatRemaining(remaining)}`;
            });

        let actualParts;

        if (unifiedPools) {
            const cost = getUnifiedCost(actualCosts);
            const current = actor.system.unifiedKi?.value ?? 0;
            const remaining = current - cost;

            actualParts = cost > 0
                ? [`${game.i18n.localize("abfalter.unified")} ${formatRemaining(remaining)}`]
                : [];
        } else {
            actualParts = KI_ATTRIBUTES
                .filter(attr => actualCosts[attr] > 0)
                .map(attr => {
                    const current = actor.system.kiPool[attr]?.actual ?? 0;
                    const remaining = current - actualCosts[attr];
                    return `${localizedAttr(attr)} ${formatRemaining(remaining)}`;
                });
        }

        const accumResult = html.querySelector(".kiAccumResult");
        const actualResult = html.querySelector(".kiActualResult");
        const accumWarning = html.querySelector(".kiAccumWarning");
        const actualWarning = html.querySelector(".kiActualWarning");
        const confirmButton = html.querySelector('button[data-action="confirm"]');

        if (accumResult) {
            accumResult.innerHTML = accumParts.length
                ? accumParts.join(" / ")
                : `${game.i18n.localize("abfalter.noChange")}`;
        }

        if (actualResult) {
            actualResult.innerHTML = actualParts.length
                ? actualParts.join(" / ")
                : `${game.i18n.localize("abfalter.noChange")}`;
        }

        const enoughAccum = canPayAccumulation(selected);
        const enoughActual = canPayActual(selected);

        if (accumWarning) {
            accumWarning.style.setProperty(
                "display",
                enoughAccum ? "none" : "block",
                "important"
            );
        }

        if (actualWarning) {
            actualWarning.style.setProperty(
                "display",
                enoughActual ? "none" : "block",
                "important"
            );
        }

        if (confirmButton) {
            confirmButton.disabled =
                !selected.length ||
                !enoughAccum ||
                !enoughActual;
        }
    };

    class KiCastDialog extends foundry.applications.api.DialogV2 {
        async _onRender(context, options) {
            await super._onRender(context, options);

            const html = this.element;
            if (!html) return;

            html.querySelectorAll(".kiCastSelect, .kiCastMode, .kiCastPush").forEach(element => {
                element.addEventListener("change", () => updatePreview(html));
            });

            updatePreview(html);
        }
    }

    const dialog = new KiCastDialog({
        window: { title: `${actor.name} - ${game.i18n.localize("abfalter.kiTechnique")}` },
        position: { width: 525 },
        classes: ["baseAbfalterV2", "kiCastDialog"],
        content,
        buttons: [
            {
                action: "confirm",
                label: game.i18n.localize("abfalter.dialogs.confirm"),
                default: true,
                callback: async (event, button, dlg) => {
                    const selected = readSelection(dlg.element);

                    if (!selected.length) {
                        ui.notifications.warn(game.i18n.localize("abfalter.noSelection"));
                        return false;
                    }

                    if (!canPayAccumulation(selected)) {
                        ui.notifications.warn(game.i18n.localize("abfalter.notEnoughAccum"));
                        return false;
                    }

                    if (!canPayActual(selected)) {
                        ui.notifications.warn(game.i18n.localize("abfalter.notEnoughReserve"));
                        return false;
                    }

                    const accumCosts = sumEntries(getAccumulationEntries(selected));
                    const actualCosts = sumEntries(getActivationEntries(selected));
                    const actorUpdate = {};

                    // Pay accumulated/current Ki for newly prepared techniques.
                    for (const attr of KI_ATTRIBUTES) {
                        if (accumCosts[attr] <= 0) continue;

                        actorUpdate[`system.kiPool.${attr}.current`] =
                            (actor.system.kiPool[attr]?.current ?? 0) - accumCosts[attr];
                    }

                    // Pay activation cost only for techniques being Cast.
                    if (unifiedPools) {
                        const cost = getUnifiedCost(actualCosts);

                        if (cost > 0) {
                            actorUpdate["system.unifiedKi.value"] =
                                (actor.system.unifiedKi?.value ?? 0) - cost;
                        }
                    } else {
                        for (const attr of KI_ATTRIBUTES) {
                            if (actualCosts[attr] <= 0) continue;

                            actorUpdate[`system.kiPool.${attr}.actual`] =
                                (actor.system.kiPool[attr]?.actual ?? 0) - actualCosts[attr];
                        }
                    }

                    if (Object.keys(actorUpdate).length) {
                        await actor.update(actorUpdate);
                    }

                    const itemUpdates = selected.map(entry => {
                        // Cast immediately or activate something already On Hold.
                        if (entry.mode === "cast") {
                            return {
                                _id: entry.technique.id,
                                "system.active": true,
                                "system.hold": false,
                                "system.holdPushed": false
                            };
                        }

                        // Put newly prepared technique On Hold.
                        return {
                            _id: entry.technique.id,
                            "system.active": false,
                            "system.hold": true,
                            "system.holdPushed": entry.pushed
                        };
                    });

                    if (itemUpdates.length) {
                        await actor.updateEmbeddedDocuments("Item", itemUpdates);
                    }

                    const casted = selected.some(entry => entry.mode === "cast");
                    if (casted && game.combat) {
                        const combatant = game.combat.getCombatantForActor(actor);

                        if (combatant) {
                            await combatant.setFlag(
                                "abfalter",
                                "kiCastRound",
                                game.combat.round
                            );
                        }
                    }

                    return "confirm";
                }
            },
            {
                action: "cancel",
                label: game.i18n.localize("abfalter.dialogs.cancel"),
                callback: () => "cancel"
            }
        ]
    });

    dialog.render(true);
}

export async function kiRemoveMaint(actor) {
    const unifiedPools = actor.system.toggles.unifiedPools ?? false;
    const updateData = {};

    if (unifiedPools) {
        const actual = actor.system.unifiedKi?.value ?? 0;
        const maint = actor.system.unifiedKi?.maint ?? 0;

        updateData["system.unifiedKi.value"] = Math.max(0, actual - maint);
    } else {
        for (const attr of KI_ATTRIBUTES) {
            const actual = actor.system.kiPool[attr]?.actual ?? 0;
            const maint = actor.system.kiPool[attr]?.maint ?? 0;

            updateData[`system.kiPool.${attr}.actual`] =
                Math.max(0, actual - maint);
        }
    }

    return actor.update(updateData);
}

export async function kiShutdown(actor) {
    const title = game.i18n.localize("abfalter.kiManage");
    const body = `<p>${game.i18n.localize("abfalter.kiShutdownBody")}</p>`;
    const confirmed = await genericDialogs.confirm(title, body);
    if (!confirmed) return;

    const techniques = actor.items.filter(item => item.type === "kiTechnique");

    if (!techniques.length) return;

    const updates = techniques.map(technique => ({
        _id: technique.id,
        "system.active": false,
        "system.hold": false,
        "system.holdPushed": false
    }));

    await actor.updateEmbeddedDocuments("Item", updates);
}
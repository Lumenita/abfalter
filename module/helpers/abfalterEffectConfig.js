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

    _onRender(context, options) {
        super._onRender(context, options);

        const applyChangeDefaults = keySelect => {
            const preset = CHANGE_DEFAULTS[keySelect.value];
            if (!preset) return;

            const li = keySelect.closest("li");
            if (!li) return;

            const phaseInput = li.querySelector(`[name$=".phase"]`);
            const priorityInput = li.querySelector(`[name$=".priority"]`);

            if (phaseInput) phaseInput.value = preset.phase;
        };

        this.element.querySelectorAll(".change-category").forEach(select => {
            select.addEventListener("change", event => {
                const categorySelect = event.currentTarget;
                const li = categorySelect.closest("li");
                const keySelect = li.querySelector(".change-key");

                const category = categorySelect.value;
                const options = this.groupedChangeKeys?.[category] ?? [];

                keySelect.innerHTML = options.map(opt => {
                    return `<option value="${opt.key}">${opt.label}</option>`;
                }).join("");

                if (options[0]) keySelect.value = options[0].key;

                applyChangeDefaults(keySelect);

                keySelect.dispatchEvent(new Event("change", { bubbles: true }));
            });
        });

        this.element.querySelectorAll(".change-key").forEach(keySelect => {
            keySelect.addEventListener("change", event => {
                applyChangeDefaults(event.currentTarget);
            });
        });
    }

    async _renderChange(context) {
        const { change, index } = context;
        const groupedChangeKeys = this.groupedChangeKeys ?? {};

        const selectedCategory = Object.entries(groupedChangeKeys).find(([category, options]) =>
            options.some(opt => opt.key === change.key))?.[0] ?? Object.keys(groupedChangeKeys)[0];

        context.groupedChangeKeys = groupedChangeKeys;
        context.selectedCategory = selectedCategory;
        context.selectedKeyOptions = groupedChangeKeys[selectedCategory] ?? [];

        if (typeof change.value !== "string") {
            change.value = JSON.stringify(change.value);
        }

        Object.assign(change, ["key", "type", "value", "phase", "priority"].reduce((paths, fieldName) => {
            paths[`${fieldName}Path`] = `system.changes.${index}.${fieldName}`;
            return paths;
        }, {}));

        const CHANGE_TYPES = foundry.documents.ActiveEffect.CHANGE_TYPES;
        context.changeTypes = Object.fromEntries(
            Object.entries(CHANGE_TYPES).map(([type, data]) => [
                type,
                game.i18n.localize(data.label ?? `EFFECT.CHANGE_TYPES.${type}`)
            ])
        );

        context.defaultPriority = CONST.ACTIVE_EFFECT_CHANGE_TYPES[change.type] ?? 0;

        return foundry.applications.handlebars.renderTemplate(
            "systems/abfalter/templates/active-effect/change.hbs",
            context
        );
    }

    async _prepareContext(options) {
        const context = await super._prepareContext(options);
        context.systemFields = this.document.system.schema.fields;


        context.groupedChangeKeys = {
            General: [
            { key: 'system.aamField.final', label: game.i18n.localize('abfalter.aam') },
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
            { key: "system.stats.Dexterity.final", label: game.i18n.localize('abfalter.dexterity') },
            { key: "system.stats.Dexterity.opposedBonus", label: game.i18n.localize('abfalter.opposed') + ' ' + game.i18n.localize('abfalter.dexterity') },
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
            { key: 'system.armor.helmet.aCutBonus', label: game.i18n.localize('abfalter.cut') },
            { key: 'system.armor.helmet.aImpBonus', label: game.i18n.localize('abfalter.imp') },
            { key: 'system.armor.helmet.aThrBonus', label: game.i18n.localize('abfalter.thr') },
            { key: 'system.armor.helmet.aHeatBonus', label: game.i18n.localize('abfalter.heat') },
            { key: 'system.armor.helmet.aColdBonus', label: game.i18n.localize('abfalter.cold') },
            { key: 'system.armor.helmet.aEleBonus', label: game.i18n.localize('abfalter.ele')},
            { key: 'system.armor.helmet.aEneBonus', label: game.i18n.localize('abfalter.ene') },
            { key: 'system.armor.helmet.aSptBonus', label: game.i18n.localize('abfalter.spirit') },
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
        this.groupedChangeKeys = context.groupedChangeKeys; 
        
        return context;
    }
}

const AE_PHASE = {
    INITIAL: "initial",
    FINAL: "final"
};


const CHANGE_DEFAULTS = {
    // General
    "system.aamField.final": { phase: AE_PHASE.INITIAL },
    "system.initiative.bonus": { phase: AE_PHASE.INITIAL },
    "system.movement.bonus": { phase: AE_PHASE.INITIAL },
    "system.lifepoints.bonus": { phase: AE_PHASE.INITIAL },
    "system.regeneration.bonus": { phase: AE_PHASE.INITIAL },
    "system.fatigue.bonus": { phase: AE_PHASE.INITIAL },

    // Characteristics
    "system.stats.Agility.final": { phase: AE_PHASE.INITIAL },
    "system.stats.Agility.opposedBonus": { phase: AE_PHASE.INITIAL },
    "system.stats.Constitution.final": { phase: AE_PHASE.INITIAL },
    "system.stats.Constitution.opposedBonus": { phase: AE_PHASE.INITIAL },
    "system.stats.Strength.final": { phase: AE_PHASE.INITIAL },
    "system.stats.Strength.opposedBonus": { phase: AE_PHASE.INITIAL },
    "system.stats.Dexterity.final": { phase: AE_PHASE.INITIAL },
    "system.stats.Dexterity.opposedBonus": { phase: AE_PHASE.INITIAL },
    "system.stats.Perception.final": { phase: AE_PHASE.INITIAL },
    "system.stats.Perception.opposedBonus": { phase: AE_PHASE.INITIAL },
    "system.stats.Intelligence.final": { phase: AE_PHASE.INITIAL },
    "system.stats.Intelligence.opposedBonus": { phase: AE_PHASE.INITIAL },
    "system.stats.Power.final": { phase: AE_PHASE.INITIAL },
    "system.stats.Power.opposedBonus": { phase: AE_PHASE.INITIAL },
    "system.stats.Willpower.final": { phase: AE_PHASE.INITIAL },
    "system.stats.Willpower.opposedBonus": { phase: AE_PHASE.INITIAL },

    // Resistances
    "system.resistances.Physical.bonus": { phase: AE_PHASE.INITIAL },
    "system.resistances.Disease.bonus": { phase: AE_PHASE.INITIAL },
    "system.resistances.Poison.bonus": { phase: AE_PHASE.INITIAL },
    "system.resistances.Magic.bonus": { phase: AE_PHASE.INITIAL },
    "system.resistances.Psychic.bonus": { phase: AE_PHASE.INITIAL },

    // Combat
    "system.combatValues.attack.bonus": { phase: AE_PHASE.INITIAL },
    "system.combatValues.block.bonus": { phase: AE_PHASE.INITIAL },
    "system.combatValues.dodge.bonus": { phase: AE_PHASE.INITIAL },
    "system.armor.wearArmor.bonus": { phase: AE_PHASE.INITIAL },
    "system.otherStats.damageBarrierBonus": { phase: AE_PHASE.INITIAL },
    "system.otherStats.dmgRdcBonus": { phase: AE_PHASE.INITIAL },

    // Helmet
    "system.armor.helmet.aCutBonus": { phase: AE_PHASE.INITIAL },
    "system.armor.helmet.aImpBonus": { phase: AE_PHASE.INITIAL },
    "system.armor.helmet.aThrBonus": { phase: AE_PHASE.INITIAL },
    "system.armor.helmet.aHeatBonus": { phase: AE_PHASE.INITIAL },
    "system.armor.helmet.aColdBonus": { phase: AE_PHASE.INITIAL },
    "system.armor.helmet.aEleBonus": { phase: AE_PHASE.INITIAL },
    "system.armor.helmet.aEneBonus": { phase: AE_PHASE.INITIAL },
    "system.armor.helmet.aSptBonus": { phase: AE_PHASE.INITIAL },

    // Armor
    "system.armor.body.aCutBonus": { phase: AE_PHASE.INITIAL },
    "system.armor.body.aImpBonus": { phase: AE_PHASE.INITIAL },
    "system.armor.body.aThrBonus": { phase: AE_PHASE.INITIAL },
    "system.armor.body.aHeatBonus": { phase: AE_PHASE.INITIAL },
    "system.armor.body.aColdBonus": { phase: AE_PHASE.INITIAL },
    "system.armor.body.aEleBonus": { phase: AE_PHASE.INITIAL },
    "system.armor.body.aEneBonus": { phase: AE_PHASE.INITIAL },
    "system.armor.body.aSptBonus": { phase: AE_PHASE.INITIAL },

    // Secondary
    "system.secondaryFields.athletics.acrobatics.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.athletics.athleticism.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.athletics.climb.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.athletics.jump.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.athletics.piloting.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.athletics.ride.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.athletics.swim.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.social.etiquette.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.social.intimidate.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.social.leadership.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.social.persuasion.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.social.streetwise.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.social.style.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.social.trading.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.perceptive.kidetection.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.perceptive.notice.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.perceptive.search.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.perceptive.track.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.intellectual.animals.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.intellectual.appraisal.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.intellectual.architecture.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.intellectual.herballore.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.intellectual.history.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.intellectual.law.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.intellectual.magicappr.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.intellectual.medicine.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.intellectual.memorize.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.intellectual.navigation.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.intellectual.occult.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.intellectual.science.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.intellectual.tactics.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.intellectual.technomagic.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.vigor.composure.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.vigor.featsofstr.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.vigor.withstpain.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.subterfuge.disguise.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.subterfuge.hide.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.subterfuge.kiconceal.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.subterfuge.lockpicking.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.subterfuge.poisons.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.subterfuge.stealth.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.subterfuge.theft.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.subterfuge.traplore.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.creative.alchemy.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.creative.animism.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.creative.art.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.creative.cooking.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.creative.dance.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.creative.forging.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.creative.jewelry.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.creative.toymaking.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.creative.music.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.creative.runes.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.creative.ritualcalig.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.creative.slofhand.bonus": { phase: AE_PHASE.INITIAL },
    "system.secondaryFields.creative.tailoring.bonus": { phase: AE_PHASE.INITIAL },

    // Mystic
    "system.mproj.bonus": { phase: AE_PHASE.INITIAL },
    "system.mproj.bonus2": { phase: AE_PHASE.INITIAL },
    "system.maccu.bonus": { phase: AE_PHASE.INITIAL },
    "system.mregen.bonus": { phase: AE_PHASE.INITIAL },
    "system.zeon.bonus": { phase: AE_PHASE.INITIAL },
    "system.zeon.minnateBonus": { phase: AE_PHASE.INITIAL },
    "system.mlevel.bonus": { phase: AE_PHASE.INITIAL },
    "system.summoning.summon.bonus": { phase: AE_PHASE.INITIAL },
    "system.summoning.control.bonus": { phase: AE_PHASE.INITIAL },
    "system.summoning.bind.bonus": { phase: AE_PHASE.INITIAL },
    "system.summoning.banish.bonus": { phase: AE_PHASE.INITIAL },

    // Psychic
    "system.ppoint.bonus": { phase: AE_PHASE.INITIAL },
    "system.ppotential.bonus": { phase: AE_PHASE.INITIAL },
    "system.pproj.bonusBase": { phase: AE_PHASE.INITIAL },
    "system.pproj.bonus": { phase: AE_PHASE.INITIAL },
    "system.pproj.bonus2": { phase: AE_PHASE.INITIAL },

    // Ki
    "system.mk.bonus": { phase: AE_PHASE.INITIAL },
    "system.kiPool.agi.bonus": { phase: AE_PHASE.INITIAL },
    "system.kiPool.agi.bonusMax": { phase: AE_PHASE.INITIAL },
    "system.kiPool.con.bonus": { phase: AE_PHASE.INITIAL },
    "system.kiPool.con.bonusMax": { phase: AE_PHASE.INITIAL },
    "system.kiPool.dex.bonus": { phase: AE_PHASE.INITIAL },
    "system.kiPool.dex.bonusMax": { phase: AE_PHASE.INITIAL },
    "system.kiPool.str.bonus": { phase: AE_PHASE.INITIAL },
    "system.kiPool.str.bonusMax": { phase: AE_PHASE.INITIAL },
    "system.kiPool.pow.bonus": { phase: AE_PHASE.INITIAL },
    "system.kiPool.pow.bonusMax": { phase: AE_PHASE.INITIAL },
    "system.kiPool.wp.bonus": { phase: AE_PHASE.INITIAL },
    "system.kiPool.wp.bonusMax": { phase: AE_PHASE.INITIAL },
    "system.kiPool.unifiedBonus": { phase: AE_PHASE.INITIAL },
    "system.kiPool.innate.bonus": { phase: AE_PHASE.INITIAL },
    "system.fistDamage.bonus": { phase: AE_PHASE.INITIAL },

    // Other
    "system.levelinfo.levelBonus": { phase: AE_PHASE.INITIAL },
    "system.rollRange.bonus": { phase: AE_PHASE.INITIAL },
    "system.fumleRange.bonus": { phase: AE_PHASE.INITIAL },
    "system.levelinfo.levelmodBonus": { phase: AE_PHASE.INITIAL },
    "system.levelinfo.presencemodBonus": { phase: AE_PHASE.INITIAL },
    "system.levelinfo.dpmodBonus": { phase: AE_PHASE.INITIAL },
    "system.otherStats.mentalHealthBonus": { phase: AE_PHASE.INITIAL },
};
export var abfalterSettingsKeys;
(function (abfalterSettingsKeys) {
    abfalterSettingsKeys["Spirit_Damage"] = "Spirit_Damage";
    abfalterSettingsKeys["Corrected_Fumble"] = "Corrected_Fumble";
    abfalterSettingsKeys["Use_Meters"] = "Use_Meters";
    abfalterSettingsKeys["Change_Theme"] = "Change_Theme";
    abfalterSettingsKeys["Corrected_OpenRoll"] = "Corrected_OpenRoll";
    abfalterSettingsKeys["Corrected_InitiativeRoll"] = "Corrected_InitiativeRoll";
})(abfalterSettingsKeys || (abfalterSettingsKeys = {}));
export const abfalterSettings = () => {
    game.settings.register("abfalter", "migrationInProgress", {
        name: "Migration in Progress (internal)",
        scope: "world", 
        config: false, 
        type: Boolean, 
        default: false
    });
    game.settings.register('abfalter', "systemMigrationVersion", {
        name: "System Migration Version",
        scope: 'world',
        config: false,
        default: "",
        type: String
    });
    game.settings.register("abfalter", "forceMigration", {
        name: "Force migration on next launch",
        hint: "Runs all migration steps on next load, regardless of stored version.",
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });
    game.settings.register('abfalter', "systemChangeLog", {
        name: "Don't show me the system changelog",
        hint: "when toggled on, the system changelog will not show for the current version again, when toggled off it will show everytime on bootup.",
        scope: 'world',
        config: true,
        default: false,
        type: Boolean
    });
    game.settings.register("abfalter", "combatSettings", {
        name: "Combat Settings Data",
        scope: "world",
        config: false,
        type: Object,
        default: {
            atkTokName: true,
            atkWepName: true,
            atkAtkName: true,
            atkFinValue: false,
            atkFormula: false,
            atkDmg: false,
            atkAtPen: false,
            atkNote: false,
            defTokName: true,
            defWepName: true,
            defAtkName: true,
            defFinValue: false,
            defFormula: false,
            defAT: false,
            defNote: false,
            resDmgFormula: true,
            resFinalAT: false,
            resDefDmgTaken: false,
            resDefDmgPer: false,
            resDefInfoMsg: false,
            resDefInfoLumi: false,
            resCcNum: false
        }
    });
    game.settings.registerMenu("abfalter", "combatSettingsMenu", {
        name: "Combat Settings",
        label: "Configure",
        hint: "Open the advanced combat settings which allow the configuration of what is visible on attack / defense cards.",
        icon: "fas fa-sliders-h",
        type: ABFAlterCombatSettingsForm,
        restricted: true
    });
    game.settings.register('abfalter', abfalterSettingsKeys.Spirit_Damage, {
        name: game.i18n.localize('abfalter.globalSettings.spiritDmg'),
        hint: game.i18n.localize('abfalter.globalSettings.spiritDetail'),
        scope: 'world',
        config: true,
        default: false,
        type: Boolean
    });
    game.settings.register('abfalter', abfalterSettingsKeys.Change_Theme, {
        name: game.i18n.localize('abfalter.globalSettings.changeThemeName'),
        hint: game.i18n.localize('abfalter.globalSettings.changeThemeDetails'),
        scope: 'client',
        config: true,
        default: false,
        type: Boolean
    });
    game.settings.register('abfalter', abfalterSettingsKeys.Corrected_Fumble, {
        name: game.i18n.localize('abfalter.globalSettings.fumbleName'),
        hint: game.i18n.localize('abfalter.globalSettings.fumbleDetail'),
        scope: 'world',
        config: true,
        default: false,
        type: Boolean
    });
    game.settings.register('abfalter', abfalterSettingsKeys.Use_Meters, {
        name: game.i18n.localize('abfalter.globalSettings.meterName'),
        hint: game.i18n.localize('abfalter.globalSettings.meterDetail'),
        scope: 'world',
        config: true,
        default: false,
        type: Boolean,
        onChange: value => {
            updateGridUnits(value);
        }
    });
    game.settings.register('abfalter', abfalterSettingsKeys.Corrected_OpenRoll, {
        name: game.i18n.localize('abfalter.globalSettings.openRollName'),
        hint: game.i18n.localize('abfalter.globalSettings.openRollNameDetails'),
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });
    game.settings.register('abfalter', abfalterSettingsKeys.Corrected_InitiativeRoll, {
        name: game.i18n.localize('abfalter.globalSettings.openRollInitiative'),
        hint: game.i18n.localize('abfalter.globalSettings.openRollInitiativeDetails'),
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });
};
function updateGridUnits(value) {
    const units = value ? 'm' : 'ft';
    const scenes = game.scenes.contents;
    for (let scene of scenes) {
        scene.update({ gridUnits: units });
    }
}
class ABFAlterCombatSettingsForm extends FormApplication {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "abfalter-combat-settings",
            title: "Advanced ABF Alter Settings",
            template: "systems/abfalter/templates/dialogues/combatSettings.hbs",
            width: 500,
            closeOnSubmit: false,
            submitOnChange: true,
            submitOnClose: true
        });
    }

    async getData() {
        const settings = game.settings.get("abfalter", "combatSettings");

        return {
            settings
        };
    }

    async _updateObject(event, formData) {
        const current = game.settings.get("abfalter", "combatSettings");

        const expanded = foundry.utils.expandObject(formData);

        const updated = foundry.utils.mergeObject(current, expanded, {
            inplace: false
        });

        await game.settings.set("abfalter", "combatSettings", updated);
    }
}
export var abfalterSettingsKeys;
(function (abfalterSettingsKeys) {
    abfalterSettingsKeys["Spirit_Damage"] = "Spirit_Damage";
    abfalterSettingsKeys["Corrected_Fumble"] = "Corrected_Fumble";
    abfalterSettingsKeys["Use_Meters"] = "Use_Meters";
})(abfalterSettingsKeys || (abfalterSettingsKeys = {}));
export const abfalterSettings = () => {
    game.settings.register('abfalter', "systemMigrationVersion", {
        name: "System Migration Version",
        scope: 'world',
        config: false,
        default: "",
        type: String
    });
    game.settings.register('abfalter', abfalterSettingsKeys.Spirit_Damage, {
        name: game.i18n.localize('abfalter.globalSettings.spiritDmg'),
        hint: game.i18n.localize('abfalter.globalSettings.spiritDetail'),
        scope: 'client',
        config: true,
        default: false,
        type: Boolean
    });
    game.settings.register('abfalter', abfalterSettingsKeys.Corrected_Fumble, {
        name: game.i18n.localize('abfalter.globalSettings.fumbleName'),
        hint: game.i18n.localize('abfalter.globalSettings.fumbleDetail'),
        scope: 'client',
        config: true,
        default: false,
        type: Boolean
    });
    game.settings.register('abfalter', abfalterSettingsKeys.Use_Meters, {
        name: game.i18n.localize('abfalter.globalSettings.meterName'),
        hint: game.i18n.localize('abfalter.globalSettings.meterDetail'),
        scope: 'client',
        config: true,
        default: false,
        type: Boolean
    });
};
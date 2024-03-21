export var abfalterSettingsKeys;
(function (abfalterSettingsKeys) {
    abfalterSettingsKeys["Spirit_Damage"] = "Spirit_Damage";
    abfalterSettingsKeys["Corrected_Fumble"] = "Corrected_Fumble";
    abfalterSettingsKeys["Use_Meters"] = "Use_Meters";
    abfalterSettingsKeys["Change_Theme"] = "Change_Theme";
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
        type: Boolean,
        onChange: value => {
            updateGridUnits(value);
        }
    });
};
function updateGridUnits(value) {
    const units = value ? 'm' : 'ft';
    const scenes = game.scenes.contents;
    for (let scene of scenes) {
        scene.update({ gridUnits: units });
    }
}
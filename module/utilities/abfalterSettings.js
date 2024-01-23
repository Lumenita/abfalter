export var abfalterSettingsKeys;
(function (abfalterSettingsKeys) {
    abfalterSettingsKeys["Spirit_Damage"] = "Spirit_Damage";
})(abfalterSettingsKeys || (abfalterSettingsKeys = {}));
export const abfalterSettings = () => {
    const gameCopy = game;
    gameCopy.settings.register('abfalter', abfalterSettingsKeys.Spirit_Damage, {
        name: 'Spirit Damage',
        hint: 'Turns on Homebrew Spirit Damage, requires refresh (f5) to take effect',
        Scope: 'world',
        config: true,
        default: false,
        type: Boolean
    });
};
export var abfalterSettingsKeys;
(function (abfalterSettingsKeys) {
    abfalterSettingsKeys["Spirit_Damage"] = "Spirit_Damage";
    abfalterSettingsKeys["Corrected_Fumble"] = "Corrected_Fumble";
})(abfalterSettingsKeys || (abfalterSettingsKeys = {}));
export const abfalterSettings = () => {
    const gameCopy = game;
    gameCopy.settings.register('abfalter', abfalterSettingsKeys.Spirit_Damage, {
        name: 'Spirit Damage',
        hint: 'Turns on Homebrew Spirit Damage, requires refresh (f5) to take effect. This homebrew is my own(Luminita).',
        Scope: 'world',
        config: true,
        default: false,
        type: Boolean
    });
    gameCopy.settings.register('abfalter', abfalterSettingsKeys.Corrected_Fumble, {
        name: 'Core Exxet Correction Fumble',
        hint: 'Switches the method fubmles are calculated away from the core book and instead uses the core exxet corretion. This means that all rolls under the fumble range are failures and a 1d100 is rolled to calculate the degree of failure.',
        Scope: 'world',
        config: true,
        default: false,
        type: Boolean
    });
};
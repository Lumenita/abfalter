import { renderTemplates } from "../utilities/renderTemplates.js";
import { templates } from "../utilities/templates.js";

const gmMacro = [
    {
        macroSelectorId: '#sendAttack',
        hotkey: e => e.ctrlKey && e.key === '1',
        fn: () => window.Websocket.sendAttack?.()
    }
];
const playerMacro = [
    {
        macroSelectorId: '#sendAttackRequest',
        hotkey: e => e.ctrlKey && e.key === '1',
        fn: () => window.Websocket.sendAttackRequest?.()
    }
];

export const customMacroBar = async () => {
    const gameCopy = game;
    const isGM = gameCopy.user?.isGM;
    const [customHotbarHTML] = await renderTemplates({
        name: templates.CustomHotBar,
        context: { isGM }
    });
    $('.system-abfalter').append(customHotbarHTML);
    const defaultMacroConfigs = isGM ? gmMacro : playerMacro;

    for (const config of defaultMacroConfigs) {
        if (config.macroSelectorId) {
            $(config.macroSelectorId).click(() => {
                config.fn();
            });
        }
    }
    document.addEventListener('keyup', () => {
        for (const config of defaultMacroConfigs) {
            if (config.macroSelectorId) {
                $(config.macroSelectorId).removeClass('hover');
            }
        }
    });
    document.addEventListener('keydown', e => {
        for (const config of defaultMacroConfigs) {
            if (e.ctrlKey && config.macroSelectorId) {
                $(config.macroSelectorId).addClass('hover');
            }
            if (config.hotkey(e)) {
                e.preventDefault();
                config.fn();
            }
        }
    });
}
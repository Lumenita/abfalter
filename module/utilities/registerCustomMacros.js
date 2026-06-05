import { openSimpleCalculator } from './simpleCalc.js';
import { openKiCreatorTitle } from "../helpers/kiTechCreator.mjs";

export const registerCustomMacros = () => {
    const gameCopy = game;
    if (gameCopy.user?.isGM) {
        window.Websocket = {
            openSimpleCalc: async () => openSimpleCalculator(),
            kiCreator: async () => openKiCreatorTitle()
        };
    } else {
        window.Websocket = {
            openSimpleCalc: async () => openSimpleCalculator(),
            kiCreator: async () => openKiCreatorTitle()
        };
    }
}

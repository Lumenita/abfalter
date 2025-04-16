import { gmCombatManager } from "./gm/gmCombatManager.js";
import { playerCombatManager } from "./player/playerCombatManager.js";
import { openSimpleCalculator } from './simpleCalc.js';

export const registerCustomMacros = () => {
    const gameCopy = game;
    if (gameCopy.user?.isGM) {
        const combatManager = new gmCombatManager(gameCopy);
        window.Websocket = {
            sendAttack: async () => {
                try { combatManager.sendAttack(); }
                catch (e) { combatManager.endCombat(); }
            },
            openSimpleCalc: async () => openSimpleCalculator()
        };
    } else {
        const combatManager = new playerCombatManager(gameCopy);
        window.Websocket = {
            sendAttackRequest: async () => {
                try { combatManager.sendAttackRequest(); }
                catch (e) { combatManager.endCombat(); }
            }
        };
    }
}

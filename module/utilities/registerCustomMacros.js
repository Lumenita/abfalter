import { gmCombatManager } from "../autoCombat/gm/gmCombatManager.js";
import { playerCombatManager } from "../autoCombat/player/playerCombatManager.js";
import { openSimpleCalculator } from '../autoCombat/simpleCalc.js';
import { openKiCreatorTitle } from "../helpers/kiTechCreator.mjs";

export const registerCustomMacros = () => {
    const gameCopy = game;
    if (gameCopy.user?.isGM) {
        const combatManager = new gmCombatManager(gameCopy);
        window.Websocket = {
            sendAttack: async () => {
                try { combatManager.sendAttack(); }
                catch (e) { 
                    console.error("Combat Macro Error:", e);
                    combatManager.endCombat(); 
                }
            },
            openSimpleCalc: async () => openSimpleCalculator(),
            kiCreator: async () => openKiCreatorTitle()
        };
    } else {
        const combatManager = new playerCombatManager(gameCopy);
        window.Websocket = {
            sendAttackRequest: async () => {
                try { combatManager.sendAttackRequest(); }
                catch (e) { 
                    console.error("Combat Macro Error:", e);
                    combatManager.endCombat(); 
                }
            }
        };
    }
}

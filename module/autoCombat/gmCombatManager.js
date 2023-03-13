import { combatManager } from "./combatManager.js"
import { gmCombatMsg } from "./gmCombatmsg.js"
import { assertCurrentScene, getSelectedToken, getTargetToken } from "./utilities.js"
import { genericDialogs } from "../dialogs.js";

export class gmCombatManager extends combatManager {
    constructor(game) {
        super(game);
    }

    endCombat() {
        console.log("combat closed/ended");
        if (this.combat) {
            const msg = { type: gmCombatMsg.CancelCombat, combatId: this.combat.id };
            this.emit(msg);
            this.combat.close({ executeHook: false });
            this.combat = undefined;
        }
    }

    async sendAttack() {
        assertCurrentScene(); // Checks if the token is in the current scene.
        const { user } = this.game;
        if (!user) return;
        const attackerToken = getSelectedToken(this.game); // makes the selected token the attacker, there can only be 1 attacker.
        const { targets } = user;
        const targetToken = getTargetToken(attackerToken, targets);

        if (targetToken.length === undefined) {
            console.log("Single Attack");
            if (attackerToken?.id) {
                await genericDialogs.confirm(this.game.i18n.format('macros.combat.dialog.attackConfirm.title'), this.game.i18n.format('macros.combat.dialog.attackConfirm.body.title', { target: targetToken.name }), {
                    onConfirm: () => {
                        if (attackerToken?.id && targetToken?.id) {
                            this.combat = this.createNewCombat(attackerToken, targetToken);
                            this.manageAttack(attackerToken, targetToken);
                        }
                    }
                });
            }
        } else {
            console.log("Aoe Attack");
        }

    }

    createNewCombat(attacker, defender) {
        console.log("I made it");

    }

    manageAttack(attacker, defender, bonus) {
        console.log("I made it");
    }

}
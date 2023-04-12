import { combatManager } from "../combatManager.js"
import { gmCombatType } from "./gmCombatType.js"
import { playerCombatType } from "../player/playerCombatType.js"
import { assertCurrentScene, getSelectedToken, getTargetToken, canOwnerReceiveMessage } from "../utilities.js"
import { genericDialogs } from "../../dialogs.js";
import { gmCombatDialog } from "../dialogs/gmCombatDialog.js"
import { combatAttackDialog} from "../dialogs/combatAttackDialog.js"
import { combatDefenseDialog } from "../dialogs/combatDefenseDialog.js"


export class gmCombatManager extends combatManager {
    constructor(game) {
        super(game);
    }
    endCombat() {
        console.log("combat closed/ended");
        if (this.combat) {
            const msg = { type: gmCombatType.CancelCombat, combatId: this.combat.id };
            this.emit(msg);
            this.combat.close({ executeHook: false });
            this.combat = undefined;
        }
        /*
        if (this.defendDialog) {
            this.defendDialog.close({ force: true });
            this.defendDialog = undefined;
        }
        if (this.attackDialog) {
            this.attackDialog.close({ force: true });
            this.attackDialog = undefined;
        }
        */
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
            console.log("Aoe Attack"); //not implemented
        }
    }

    createNewCombat(attacker, defender) {
        console.log("I made it: Created New Combat");
        return new gmCombatDialog(attacker, defender, {
            onClose: () => {
                this.endCombat();
            },
            onCounterAttack: bonus => {
                this.endCombat();
                this.combat = new gmCombatDialog(defender, attacker, {
                    onClose: () => {
                        this.endCombat();
                    },
                    onCounterAttack: () => {
                        this.endCombat();
                    }
                }, { isCounter: true, counterAttackBonus: bonus });
                if (canOwnerReceiveMessage(defender.actor)) {
                    const newMsg = {
                        type: gmCombatType.counterAttack,
                        payload: { attackerTokenId: defender.id, defenderTokenId: attacker.id, counterAttackBonus: bonus }
                    };
                    this.emit(newMsg);
                } else {
                    this.manageAttack(defender, attacker, bonus);
                }
            }
        });
        console.log("I did it: Created New Combat Ending");

    }

    manageAttack(attacker, defender, bonus) {
        this.attackDialog = new combatAttackDialog(attacker, defender, {
            onAttack: result => {
                this.attackDialog?.close({ force: true });
                this.attackDialog = undefined;
                if (this.combat) {
                    this.combat.updateAttackerData(result);
                    if (canOwnerReceiveMessage(defender.actor)) {
                        const newMsg = {
                            type: gmCombatType.Attack,
                            payload: { attackerTokenId: attacker.id, defenderTokenId: defender.id, result }
                        };
                        this.emit(newMsg);
                    }
                    else {
                        const { critic } = result.values;
                        try {
                            this.manageDefense(attacker, defender, result.type, critic);
                        }
                        catch (err) {
                            if (err) {
                                Log.error(err);
                            }
                            this.endCombat();
                        }
                    }
                }
            }
        }, { counterAttackBonus: bonus });
    }
    manageDefense(attacker, defender, attackType, critic) {
        this.defendDialog = new combatDefenseDialog({ token: attacker, attackType, critic }, defender, {
            onDefense: result => {
                if (this.defendDialog) {
                    this.defendDialog.close({ force: true });
                    this.defendDialog = undefined;
                    if (this.combat) {
                        this.combat.updateDefenderData(result);
                    }
                }
            }
        });
    }


    receive(msg) {
        switch (msg.type) {
            case playerCombatType.RequestToAttack:
                this.managePlayerAttackRequest(msg);
                break;
            case playerCombatType.Attack:
                this.managePlayerAttack(msg);
                break;
            case playerCombatType.Defend:
                this.managePlayerDefense(msg);
                break;
            default:
                Log.warn('Unknown message', msg);
        }
    }
       /*
    async managePlayerAttack(msg) {
        if (this.combat) {
            this.combat.updateAttackerData(msg.payload);
            const { attackerToken, defenderToken, defenderActor } = this.combat;
            const { critic } = msg.payload.values;
            if (canOwnerReceiveMessafe(defenderActor)) {
                const newMsg = {
                    type: gmCombatType.Attack,
                    payload: { attackerTokenId: attackerToken.id, defenderTokenId: defenderToken.id, result: msg.payload }
                };
                this.emit(newMsg);
            } else {
                try {
                    this.manageDefense(attackerToken, defenderToken, msg.payload.type, critic);
                } catch (e) {
                    if (e) {
                        Log.error(e);
                    }
                    this.endCombat();
                }
            }
        }
    }

    managePlayerDefense(msg) {
        if (this.combat) {
            this.combat.updateDefenderData(msg.payload);
        } else {
            Log.warn('User attack received but none combat is running');
        }
    }
    */
    async managePlayerAttackRequest(msg) {

    }
}
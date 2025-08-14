import { combatManager } from "../combatManager.js"
import { gmCombatType } from "./gmCombatType.js"
import { playerCombatType } from "../player/playerCombatType.js"
import { assertCurrentScene, getSelectedToken, getTargetToken, canOwnerReceiveMessage } from "../utilities.js"
import { genericDialogs } from "../../dialogs.js";
import { gmCombatDialog } from "../dialogs/gmCombatDialog.js"
import { combatAttackDialog} from "../dialogs/combatAttackDialog.mjs"
import { combatDefenseDialog } from "../dialogs/combatDefenseDialog.js"

export class gmCombatManager extends combatManager {
    constructor(game) {
        super(game);
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

    endCombat() {
        console.log("combat closed/ended");
        if (this.combat) {
            const msg = { type: gmCombatType.CancelCombat, combatId: this.combat.id };
            this.emit(msg);
            
        if (Array.isArray(this.combat._childDialogs)) {
            for (const dialog of this.combat._childDialogs) {
                if (dialog?.close) {
                    dialog.close({ force: true });
                }
            }
            this.combat._childDialogs.length = 0;
        }

        this.combat.close({ executeHook: false });
            this.combat = undefined;
        }
    }

    createNewCombat(attacker, defenders) {
        const isAoE = Array.isArray(defenders);
        const defenderTokens = isAoE ? defenders : [defenders];
        const dialog = new gmCombatDialog(attacker, defenderTokens, {
            onClose: () => this.endCombat(),
            onCounterAttack: (bonus) => this._handleCounterAttack(attacker, defenderTokens, bonus)
        }, {
            isAoE
        });

        this.combat = dialog;
        return dialog;
    }

    async sendAttack() {
        assertCurrentScene();

        if (this.combat) {
            console.warn("A combat is already running. Please finish or cancel it before starting a new one.");
            const msg = this.game.i18n.localize("abfalter.dialogs.combatAlreadyActive");
            genericDialogs.prompt(this.game.i18n.localize("abfalter.dialogs.combatAlreadyActiveTitle"), msg);
            return;
        }

        const attackerToken = getSelectedToken(this.game);
        let allTargets;
        try {
            allTargets = getTargetToken(attackerToken, this.game.user.targets);
        } catch (e) {
            return;
        }

        console.log("All Targets:", allTargets.map(t => t.document.name));
        const names = allTargets.map(t => t.document.name);
        const targetList = names.length === 1
            ? names[0]
            : names.slice(0, -1).join(", ") + " & " + names[names.length - 1];

        const confirmAtk = this.game.i18n.format("abfalter.dialogs.attackConfirm") + ": " + targetList;

        await genericDialogs.confirm(game.i18n.format("abfalter.dialogs.attackConfirmTitle"), confirmAtk, {
            onConfirm: () => {
                this.combat = this.createNewCombat(attackerToken, allTargets);
                this.manageAttack(attackerToken, allTargets);
            }
        });
    }

    manageAttack(attacker, defenders, bonus) {
        const isAoE = Array.isArray(defenders);
        const defenderTokens = isAoE ? defenders : [defenders];

        this.attackDialog = new combatAttackDialog(attacker, defenderTokens, {
            onAttack: result => {
                this.attackDialog?.close({ force: true });
                this.attackDialog = undefined;

                if (this.combat) {
                    this.combat.updateAttackerData(result);

                    for (const defender of defenderTokens) {
                        if (canOwnerReceiveMessage(defender.actor)) {
                            this.emit({
                                type: gmCombatType.Attack,
                                payload: {
                                    attackerTokenId: attacker.id,
                                    defenderTokenId: defender.id,

                                    result
                                }
                            });
                        } else {
                            try {
                                this.manageDefense(attacker, defender, result.type, result.values.critic);
                            } catch (err) {
                                console.error(err);
                                this.endCombat();
                            }
                        }
                    }
                }
            }
        }, { counterAttackBonus: bonus });
        
        this.combat._childDialogs.push(this.attackDialog);
    }

    _handleCounterAttack(attacker, defender, bonus) {
        this.endCombat();

        const counterDialog = new gmCombatDialog(defender, attacker, {
            onClose: () => this.endCombat(),
            onCounterAttack: () => this.endCombat()
        }, {
            isCounter: true,
            counterAttackBonus: bonus
        });

        this.combat = counterDialog;

        if (canOwnerReceiveMessage(defender.actor)) {
            this.emit({
                type: gmCombatType.CounterAttack,
                payload: {
                    attackerTokenId: defender.id,
                    defenderTokenId: attacker.id,
                    counterAttackBonus: bonus
                }
            });
        } else {
            this.manageAttack(defender, attacker, bonus);
        }
    }

    manageDefense(attacker, defender, attackType, critic) {
        this.defendDialog = new combatDefenseDialog({ token: attacker, attackType, critic }, defender, {
            onDefense: result => {
                if (this.defendDialog) {
                    this.defendDialog.close({ force: true });
                    this.defendDialog = undefined;
                    if (this.combat) {
                        this.combat.updateDefenderData(result, defender); // optional: pass which defender
                    }
                }
            }
        });
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
import { templates } from "../../utilities/templates.js"

const getInitialData = (attacker, defender, options = {}) => {
    const isGM = !!game.user?.isGM;
    const attackerActor = attacker.actor;
    const defenderActor = defender.actor;
    return {
        ui: {
            isGM,
            isAoE: options.isAoE ?? false,
            hasFatiguePoints: attackerActor.system.fatigue.actual > 0,
        },
        attacker: {
            token: attacker,
            actor: attackerActor,
            showRoll: !isGM,
            withoutRoll: false,
            counterAttackBonus: options.counterAttackBonus,
            combat: {
                fatigueUsed: 0,
                modifier: 0,
                unarmed: false,
                weaponsList: undefined,
                weaponUsed: undefined,
                weapon: undefined,
                damage: {
                    base: 0,
                    final: 0
                }
            }/*,
            mystic: {
                modifier: 0,
                magicProjectionType: undefined,
                spellUsed: undefined,
                spellGrade: undefined,
                critic: undefined,
                damage: 0
            },
            psychic: {
                modifier: 0,
                psychicProjection: undefined,
                psychicPotential: undefined,
                powerUsed: undefined,
                critic: undefined,
                damage: 0
            }*/
        },
        defender: {
            token: defender,
            actor: defenderActor
        },
        attackSent: false,
        allowed: false
    };
};

export class combatAttackDialog extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {

    constructor(attacker, defender, hooks, options = {}) {
        super(getInitialData(attacker, defender, options));
        this.hooks = hooks;
        this.data = getInitialData(attacker, defender, options);
        const weapons = attacker.actor.items.filter(item => item.type === "weapon"); //filters through actor items for weapons
        this.data.attacker.combat.weaponsList = weapons; //sends filtered weapons to form data

        if (weapons.length > 0) {
            this.data.attacker.combat.weaponUsed = weapons[0]._id; //sets first weapon on select list
        } else {
            this.data.attacker.combat.unarmed = true;
        }

        this.data.allowed = game.user?.isGm || (options.allowed ?? false);
        this.render(true);
    } 


    static DEFAULT_Options = {
        tag: "form",
        classes: ['combatAttackDialog'],
        form: {
            submitOnChange: true,
            closeOnSubmit: false
        },
        window: {
            resizable: true,
        },
        position: {
            width: 910,
            height: 850
        },
        actions: {
            sendAttack: this.#sendAttack
        }
    }

    static PARTS = {
        main: { scrollable: [""], template: templates.dialog.combat.combatAttackDialog.main }
    }

    /*
    static TABS = {
        primary: {

        }
    }
    */

    async _prepareContext(options) {
        const context = await super._prepareContext(options);

        context.document = this.data;

        context.weaponList = this.attackerActor.items.filter(item => item.type === "weapon");

        return context;
    }

    async _onRender(context, options) {
        await super._onRender(context, options);

    }

    activateListeners(html) { //replaced by _onRender & actions
        super.activateListeners(html);
        
        html.find('select[name="attacker.combat.weaponUsed"]').on('change', this._onWeaponSelectionChange.bind(this));

        html.find('.sendNormAttack').click(() => {
            const { fatigueUsed, modifier, unarmed, weaponsList, weaponUsed, damage } = this.data.attacker.combat; // from getInitial Data stuff
            const weapon = weaponsList.find(w => w._id === weaponUsed);
            if (typeof damage !== 'undefined') {
                console.log(weapon);
                this.data.attackSent = true;
                this.render();
            }
            //#TODO ADD Logic for a const result = []
        });

        html.find('.sendMysticAttack').click(() => {
            const { weapon, criticSelected, modifier, fatigueUsed, damage } = this.data.attacker.combat; // from getInitial Data stuff
            if (typeof damage !== 'undefined') {

                this.data.attackSent = true;
                this.render();
            }
        });
        html.find('.sendPsychicAttack').click(() => {
            const { weapon, criticSelected, modifier, fatigueUsed, damage } = this.data.attacker.combat; // from getInitial Data stuff
            if (typeof damage !== 'undefined') {

                this.data.attackSent = true;
                this.render();
            }
        });
    }

    //Actions
    static #sendAttack(ev) {
        console.log("Attack Sent");
    }



    //Other stuff
    get attackerActor() {
        return this.data.attacker.token.actor;
    }

    updatePermissions(allowed) { //checks if user is waiting or is allowed to input
        this.data.allowed = allowed;
        this.render();
    }

    _onWeaponSelectionChange(event) {
        event.preventDefault();
        const selectedWeaponId = event.target.value;
        this.data.attacker.combat.weaponUsed = selectedWeaponId; // Update the selected weapon
        this._updateObject(event);// Call the update method with the updated data
    }

    async _updateObject(event, formData) {
        this.render();
    }

    async close(options = { force: false }) {
        // Prevent closing unless forced
        if (!options?.force) return;
        return super.close();
    }

    // Results for the attack roll unused
    buildResult() {
    const { fatigueUsed, modifier, unarmed, weaponsList, weaponUsed } = this.data.attacker.combat;
    const actor = this.attackerActor;

    let base = 0;
    if (unarmed) {
        base = actor.system.characteristics.dex.final.value + actor.system.combat.attack.final.value;
    } else {
        const weapon = weaponsList.find(w => w._id === weaponUsed);
        base = weapon?.system.attack ?? 0;
    }

    const counter = this.data.attacker.counterAttackBonus || 0;
    const custom = Number(modifier) || 0;
    const fatigue = Number(fatigueUsed) || 0;

    return {
        type: "combat",
        values: {
            base,
            custom,
            counter,
            fatigue,
            total: base + custom + counter + fatigue,
            critic: "none"
        }
    };
}
}
import { templates } from "../../utilities/templates.js"

const getInitialData = (attacker, defender, options = {}) => {
    //const showRollByDefault = !!game.settings.get('animabf', ABFSettingsKeys.SEND_ROLL_MESSAGES_ON_COMBAT_BY_DEFAULT);
    const isGM = !!game.user?.isGM;
    const attackerActor = attacker.actor;
    const defenderActor = defender.actor;
    return {
        ui: {
            isGM,
            hasFatiguePoints: attackerActor.system.fatigue.actual > 0,
        },
        attacker: {
            token: attacker,
            actor: attackerActor,
            showRoll: !isGM, // || showRollByDefault,
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
                magicProjectionType: 'normal',
                spellUsed: undefined,
                spellGrade: 'base',
                critic: NoneWeaponCritic.NONE,
                damage: 0
            },
            psychic: {
                modifier: 0,
                psychicProjection: attackerActor.data.data.psychic.psychicProjection.imbalance.offensive.final.value,
                psychicPotential: { special: 0, final: attackerActor.data.data.psychic.psychicPotential.final.value },
                powerUsed: undefined,
                critic: NoneWeaponCritic.NONE,
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
export class combatAttackDialog extends FormApplication {
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
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['combatAttackDialog noClose'],
            submitOnChange: true,
            closeOnSubmit: false,
            width: null,
            height: null,
            resizable: true,
            template: templates.dialog.combat.combatAttackDialog.main,
            title: 'Attacker',
            tabs: [
                {
                    navSelector: '.sheet-tabs',
                    contentSelector: '.sheet-body',
                    initial: 'combat'
                }
            ]
        });
    }
    get attackerActor() {
        return this.data.attacker.token.actor;
    }
    updatePermissions(allowed) { //checks if user is waiting or is allowe to input
        this.data.allowed = allowed;
        this.render();
    }
    activateListeners(html) {
        super.activateListeners(html);
        html.find('select[name="attacker.combat.weaponUsed"]').on('change', this._onWeaponSelectionChange.bind(this));

        html.find('.sendNormAttack').click(() => {
            const { fatigueUsed, modifier, unarmed, weaponsList, weaponUsed, damage } = this.data.attacker.combat; // from getInitial Data stuff
            //console.log(this.data.attacker.combat);
            const weapon = weaponsList.find(w => w._id === weaponUsed);
            if (typeof damage !== 'undefined') {
                console.log(weapon);
                this.data.attackSent = true;
                this.render();
            }
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

    getData() {
        const weapons = this.attackerActor.items.filter(item => item.type === "weapon");
        return this.data;
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
}
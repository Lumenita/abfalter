







const getInitialData = (attacker, defender, options = {}) => {
    const attackerActor = attacker.actor;
    const defenderActor = defender.actor;
    return {
        ui: {
            isCounter: options.isCounter ?? false
        },
        attacker: {
            token: attacker,
            actor: attackerActor,
            customModifier: 0,
            counterAttackBonus: options.counterAttackBonus,
            isReady: false
        },
        defender: {
            token: defender,
            actor: defenderActor,
            customModifier: 0,
            isReady: false
        }
    };
};
export class gmCombatDialog extends FormApplication {
    constructor(attacker, defender, hooks, options = {}) {
        super(getInitialData(attacker, defender, options));
        this.hooks = hooks;
        this.data = getInitialData(attacker, defender, options);
        this.render(true);
    }
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['abf-dialog gm-combat-dialog'],
            submitOnChange: true,
            closeOnSubmit: false,
            height: 600,
            width: 700,
            template: 'systems/abfalter/templates/autoCombat/gmCombatDialog.html',
            title: 'GM Combat'
        });
    }
    get attackerActor() {
        return this.data.attacker.actor;
    }
    get defenderActor() {
        return this.data.defender.actor;
    }
    get attackerToken() {
        return this.data.attacker.token;
    }
    get defenderToken() {
        return this.data.defender.token;
    }
    async close(options = { executeHook: true }) {
        if (options?.executeHook) {
            await this.hooks.onClose();
        }
        return super.close();
    }
    activateListeners(html) {
        super.activateListeners(html);

    }

}
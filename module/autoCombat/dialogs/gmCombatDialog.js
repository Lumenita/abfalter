







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
            classes: ['gmCombatDialog'],
            submitOnChange: true,
            closeOnSubmit: false,
            height: 600,
            width: 700,
            template: 'systems/abfalter/templates/autoCombat/gmCombatDialog.html',
            title: 'GM Combat'
        });
    }
    get attackerActor() {
        return this.data.attacker.token.actor;
    }
    get defenderActor() {
        return this.data.defender.token.actor;
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
        html.find('.cancelButton').click(() => {
            this.close();
        });
    }





    updateAttackerData(result) {
        this.data.attacker.result = result;
        //if combat/mystic/psychic
        this.render();
    }
    updateDefenderData(result) {
        result.values.total = Math.max(0, result.values.total);
        this.data.defender.result = result;
        // if shield or marial
        this.render();
    }






}
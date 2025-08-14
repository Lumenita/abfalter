const getInitialData = (attacker, defenders, options = {}) => {
    const defenderList = Array.isArray(defenders) ? defenders : [defenders];
    return {
        ui: {
            isCounter: options.isCounter ?? false,
            isAoE: defenderList.length > 1
        },
        attacker: {
            token: attacker,
            actor: attacker.actor,
            customModifier: 0,
            counterAttackBonus: options.counterAttackBonus,
            isReady: false,
            result: null
        },
        defenders: defenderList.map(def => ({
            token: def,
            actor: def.actor,
            customModifier: 0,
            isReady: false,
            result: null
        }))
    };
};

export class gmCombatDialog extends FormApplication {
    constructor(attacker, defenders, hooks, options = {}) {
        super(getInitialData(attacker, defenders, options));
        this.hooks = hooks;
        this.data = getInitialData(attacker, defenders, options);

        this._childDialogs = [];

        this.render(true);
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
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

    get attackerToken() {
        return this.data.attacker.token;
    }

    async close(options = { executeHook: true }) {
        if (options?.executeHook) {
            await this.hooks.onClose();
        }
        return super.close();
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('.cancelButton').click(() => this.close());
    }

    updateAttackerData(result) {
        this.data.attacker.result = result;
        this.render();
    }

    updateDefenderData(result, defenderToken = null) {
        result.values.total = Math.max(0, result.values.total);

        // Match the correct defender
        const tokenId = defenderToken?.id ?? this.data.defenders[0].token.id;
        const entry = this.data.defenders.find(d => d.token.id === tokenId);

        if (entry) {
            entry.result = result;
            entry.isReady = true;
            this.render();
        }
    }
}
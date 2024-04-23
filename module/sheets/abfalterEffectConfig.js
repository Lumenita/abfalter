export default class abfalterEffectConfig extends ActiveEffectConfig {
    get template() {
        return "systems/abfalter/templates/item/activeEffect-config.html"
    }

    async getData(options = {}) {
        let context = await super.getData(options);

        context.availableChangeKeys = abfalterEffectConfig._availableChangeKeys;

        return context;
    }

    static initializeChangeKeys() {
        abfalterEffectConfig._availableChangeKeys = {
            // Attributes
            'system.atkfinal': game.i18n.localize('abfalter.activeEffectChanges.atk'),
            'system.blkfinal': game.i18n.localize('abfalter.activeEffectChanges.blk')
        }
    }
}
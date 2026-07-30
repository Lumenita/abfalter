export default class abfalterCombatTracker extends foundry.applications.sidebar.tabs.CombatTracker {

    /**Add custom entries to the combatant context menu.
     * @returns {ContextMenuEntry[]}
     */
    _getEntryContextOptions() {
        const options = super._getEntryContextOptions();
        const getCombatant = target => {
            const combatantElement = target?.closest?.("[data-combatant-id]") ?? target;
            const combatantId = combatantElement?.dataset?.combatantId;
            if (!combatantId) return null;
            return this.viewed?.combatants.get(combatantId) ?? null;
        };
        options.splice(options.length - 1, 0, {
            label: game.i18n.localize("abfalter.resetPsychicPotential"),
            icon: "fa-solid fa-brain",
            visible: target => {
                if (!game.user.isGM) return false;
                const combatant = getCombatant(target);
                if (!combatant?.actor) return false;
                const max = this.viewed.getMaximumPsychicPotential(combatant.actor);
                const remaining = combatant.getFlag("abfalter", "remainingPsychicPotential");
                // No flag yet? Treat it as full.
                const current = remaining === undefined
                        ? max
                        : Number(remaining);
                return current < max;
            },
            onClick: async (event, target) => {
                const combat = this.viewed;
                const combatant = getCombatant(target);
                if (!combatant?.actor) {
                    ui.notifications.warn("The selected combatant does not have an actor.");
                    return;
                }
                try {
                    const restored = await combat.resetPsychicPotential(combatant);
                    ui.notifications.info(`${combatant.name}'s Psychic Potential was restored to ${restored}.`);
                } catch (error) {
                    console.error("ABFALTER | Failed to reset Psychic Potential:", error);
                    ui.notifications.error(error.message);
                }
            }
        });

        return options;
    }
}
export default class abfalterCombat extends Combat {

 
    async nextRound() {
        await this.resetAll();
        return super.nextRound();
    }

    async rollInitiative(ids, formulaopt, updateTurnopt, messageOptionsopt) {
        await super.rollInitiative(ids, formulaopt, updateTurnopt, messageOptionsopt);
        return this.update({ turn: 0 });
    }

    /* Modify rollInitiative so that it asks for modifiers
    async rollInitiative(ids, { updateTurn = false, messageOptions } = {}) {
        const mod = await openModDialog();
        if (typeof ids === 'string') {
            ids = [ids];
        }
        for (const id of ids) {
            const combatant = this.data.combatants.get(id);
            await super.rollInitiative(id, {
                formula: `1d100Initiative + ${combatant?.actor?.data.data.characteristics.secondaries.initiative.final.value} + ${mod}`,
                updateTurn,
                messageOptions
            });
        }
        return this;
    }*/

}
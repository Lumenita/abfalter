






export class combatDefenseDialog extends FormApplication {
    constructor(attacker, defender, hooks) {
        super(getInitialData(attacker, defender));
        this.hooks = hooks;
        this.data = getInitialData(attacker, defender);
        this._tabs[0].callback = (event, tabs, tabName) => {
            this.data.ui.activeTab = tabName;
            this.render(true);
        };
        const weapons = 0;
        //const weapons = this.defenderActor.data.data.combat.weapons;
        if (weapons.length > 0) {
            this.data.defender.combat.weaponUsed = weapons[0]._id;
        }
        else {
            this.data.defender.combat.unarmed = true;
        }
        this.render(true);
    }
}
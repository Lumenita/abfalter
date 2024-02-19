import { renderTemplates } from './utilities/renderTemplates.js';
import { templates } from './utilities/templates.js';
export default class abfalterCombat extends Combat {

 
    async nextRound() {
        await this.resetAll();
        return super.nextRound();
    }

    async rollInitiative(ids, { updateTurn = false, messageOptions } = {}) {
        const mod = await openInitiativeDialog() || 0;

        if (typeof ids === 'string') {
            ids = [ids];
        }

        for (const id of ids) {
            const combatant = this.combatants.get(id);

            await super.rollInitiative(id, {
                formula: `1d100 + ${combatant?.actor?.system.iniFinal} + ${mod}`,
                updateTurn,
                messageOptions
            });

        }
        return this.update({ turn: 0 });
    }
}

export const openInitiativeDialog = async () => {
    return initiativeDialog({
        content: "Modifier",
        placeholder: '0'
    });
}

export const initiativeDialog = async ({ content, placeholder = '' }) => {
    const html = await renderTemplates({
        name: templates.dialog.initiative,
        context: {
            content,
            placeholder
        }
    });
    return new Promise(resolve => {
        new Dialog({
            title: 'Initiative Roller',
            content: html,
            buttons: {
                submit: {
                    label: 'Continue',
                    callback: html => {
                        const results = new FormDataExtended(html.find('form')[0], {}).object;
                        resolve(results['dialog-input']);
                    }
                }
            },
            default: 'submit',
            render: () => $('#dialog-input').focus()
        }).render(true);
    });
}
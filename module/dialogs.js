import { templates } from "./utilities/templates.js";
export const genericDialogs = {
    prompt: (body) => new Promise(resolve => {
        new promptDialog(body, { onAccept: () => resolve() });
    }),
    confirm: (title, body, { onConfirm, onCancel } = {}) => new Promise(resolve => {
        new confirmationDialog(title, body, {
            onConfirm: () => {
                onConfirm?.();
                resolve();
            },
            onCancel: () => {
                onCancel?.();
                resolve();
            }
        });
    })
};

export class genericDialog extends FormApplication {
    constructor(data) {
        super(data);
        this.data = data;
        this.render(true);
    }
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['abfalter-dialog generic-dialog'],
            submitOnChange: true,
            closeOnSubmit: false,
            width: 300,
            height: 300,
            resizable: true,
            template: templates.dialog.generic,
            title: 'Dialog'
        });
    }
    activateListeners(html) {
        super.activateListeners(html);
        for (const button of this.data.buttons) {
            html.find(`#${button.id}`).click(e => {
                button.fn?.(e);
                this.close();
            });
        }
    }
    async close() {
        if (!this.data.onClose?.()) {
            return super.close();
        }
        return undefined;
    }
    getData() {
        return this.data;
    }
    async _updateObject(event, formData) {
        this.data = mergeObject(this.data, formData);
        this.render();
    }
}

export class promptDialog extends genericDialog {
    constructor(body, { onAccept } = {}) {
        super({
            class: 'prompt-dialog',
            content: `<p class='body'>${body}</p>`,
            buttons: [
                {
                    id: 'on-confirm-button',
                    fn: onAccept,
                    content: game.i18n.localize('dialogs.accept')
                }
            ]
        });
    }
}


export class confirmationDialog extends genericDialog {
    constructor(title, body, { onConfirm, onCancel } = {
        onConfirm: () => {
            this.close();
        },
        onCancel: () => {
            this.close();
        }
    }) {
        super({
            class: 'confirmation-dialog',
            content: `
    <p class='title'>${title}</p>
    <p class='body'>${body}</p>
`,
            buttons: [
                { id: 'on-cancel-button', fn: onCancel, content: game.i18n.localize('dialogs.cancel') },
                { id: 'on-confirm-button', fn: onConfirm, content: game.i18n.localize('dialogs.accept') }
            ]
        });
    }
}
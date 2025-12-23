export const genericDialogs = {
    prompt: (title, body) => {
        return foundry.applications.api.DialogV2.prompt({
            classes: ["abfalterDialog", "abfalterPromptDialog"],
            window: { title },
            content: body,
        });
    },

    // Returns values of prompted form
    promptForm: (title, bodyHtml, yesButtonLabel, cancel) => {
        return new Promise((resolve) => {
            const dlg = new foundry.applications.api.DialogV2({
                classes: ["baseAbfalterV2", "abfalterPromptDialog"],
                window: { title },
                content: `<form class="flexcol">${bodyHtml}</form>`,
                buttons: [
                    {
                        action: "ok",
                        label: yesButtonLabel,
                        callback: (event, button, dialog) => {
                            const form = button.form;
                            const out = {};

                            for (const el of form.elements) {
                                if (!el.name) continue;
                                if (el.type === "radio" && !el.checked) continue;
                                out[el.name] =
                                    el.type === "checkbox" ? el.checked :
                                    el.type === "number"   ? (el.valueAsNumber ?? Number(el.value)) :
                                    el.value;
                            }

                            resolve(out);
                        }
                    },
                    {
                        action: "cancel",
                        label: game.i18n.localize("abfalter.dialogs.cancel"),
                        callback: () => resolve(null)
                    }
                ]
            });

            const originalClose = dlg.close.bind(dlg);
            dlg.close = async (...args) => {
                resolve(null);
                return originalClose(...args);
            };

            dlg.render(true);
        });
    },

    // Returns values of prompted form
    promptForm1b: (title, bodyHtml, yesButtonLabel, cancel) => {
        return new Promise((resolve) => {
            const dlg = new foundry.applications.api.DialogV2({
                classes: ["baseAbfalterV2", "abfalterPromptDialog"],
                window: { title },
                content: `<form class="flexcol">${bodyHtml}</form>`,
                buttons: [
                    {
                        action: "ok",
                        label: yesButtonLabel,
                        callback: (event, button, dialog) => {
                            const form = button.form;
                            const out = {};

                            for (const el of form.elements) {
                                if (!el.name) continue;
                                if (el.type === "radio" && !el.checked) continue;
                                out[el.name] =
                                    el.type === "checkbox" ? el.checked :
                                    el.type === "number"   ? (el.valueAsNumber ?? Number(el.value)) :
                                    el.value;
                            }

                            resolve(out);
                        }
                    }
                ]
            });

            const originalClose = dlg.close.bind(dlg);
            dlg.close = async (...args) => {
                resolve(null);
                return originalClose(...args);
            };

            dlg.render(true);
        });
    },

    // Returns Promise<boolean>: true on Confirm, false on Cancel/close
    confirm: (title, body, { onConfirm, onCancel } = {}) => {
        return new Promise((resolve) => {
            let done = false;
            const safeResolve = (v) => {
                if (done) return;
                done = true;
                resolve(v);
            };

            const dlg = new foundry.applications.api.DialogV2({
                classes: ["abfalterDialog", "abfalterConfirmationDialog"],
                window: { title },
                content: body,
                buttons: [
                    {
                        icon: '<i class="fas fa-check"></i>',
                        label: game.i18n.localize("abfalter.dialogs.confirm"),
                        action: "confirm",
                        callback: () => {
                            onConfirm?.();
                            safeResolve(true);
                        }
                    },
                    {
                        label: game.i18n.localize("abfalter.dialogs.cancel"),
                        action: "cancel",
                        callback: () => {
                            onCancel?.();
                            safeResolve(false);
                        }
                    },
                ]
            });

            const originalClose = dlg.close.bind(dlg);
            dlg.close = async (...args) => {
                safeResolve(false);
                return originalClose(...args);
            };

            dlg.render(true);
        });
    },

    // Custom Helpers
    
    /* 
    * Prompt for applying HP, Shield, and Criticals
    * returns { pool, amount, critical }
    */
    hpShieldCriticalPrompt: async () => {
        const templatePath = "systems/abfalter/templates/dialogues/prompt/resolveWindow.hbs";
        const html = await foundry.applications.handlebars.renderTemplate(templatePath, {});
        return genericDialogs.promptForm(
            game.i18n.localize("abfalter.resolveWindowTitle"),
            html,
            game.i18n.localize("abfalter.dialogs.confirm")
        ); 
    },
    addExpPrompt: async () => {
        const label = game.i18n.localize("abfalter.amount");
        const html =   `<div class="abfDivFormat addExpPrompt">
                            <label style="display:flex">
                                <span>${label}</span>
                                <input type="number" name="amount">
                            </label>
                        </div>`
        return genericDialogs.promptForm(
            game.i18n.localize("abfalter.addExpDialogTitle"),
            html,
            game.i18n.localize("abfalter.dialogs.confirm")
        ); 
    },
    armoryItemCreationPrompt: async () => {
        const templatePath = "systems/abfalter/templates/dialogues/prompt/armoryItemCreation.hbs";
        const html = await foundry.applications.handlebars.renderTemplate(templatePath, {});
        return genericDialogs.promptForm1b(
            "",
            html,
            game.i18n.localize("abfalter.createItem")
        ); 
    }
};

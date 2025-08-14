export const genericDialogs = {
    prompt: (title, body) => {
        foundry.applications.api.DialogV2.prompt({ 
            classes: ["abfalterDialog", "abfalterPromptDialog"],
            window: { title: title },
            content: body,
        });
    },

    confirm: (title, body, { onConfirm, onCancel } = {}) => {
        new foundry.applications.api.DialogV2({ 
            classes: ["abfalterDialog", "abfalterConfirmationDialog"],
            window: { title: title },
            content: body,
            buttons: [
                {
                    icon: '<i class="fas fa-check"></i>',
                    label: game.i18n.localize("abfalter.dialogs.confirm"),
                    action: "confirm",
                    callback: () => {
                        if (onConfirm) onConfirm();
                    }
                },
                {
                    label: game.i18n.localize("abfalter.dialogs.cancel"),
                    action: "cancel",
                    callback: () => {
                        if (onCancel) onCancel();
                    }
                },
            ]
        }).render(true);
    }
};

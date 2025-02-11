class ChangelogForm extends FormApplication {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            title: "Changelog",
            template: "systems/abfalter/templates/dialogues/changelog.hbs",
            width: 800,
            height: "auto",
            closeOnSubmit: false,
            resizable: true,
            classes: ["changelog-form"], 
        });
    }

    getData() {
        return {};
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('button[name="close"]').click(this._onClose.bind(this));
        html.find('button[name="dontShowAgain"]').click(this._onDontShowAgain.bind(this));
    }

    _onClose(event) {
        event.preventDefault();
        this.close();
    }

    _onDontShowAgain(event) {
        event.preventDefault();
        game.settings.set("abfalter", "systemChangeLog", true);
        this.close();
    }
}

export async function handleChangelog() {
    if (!game.user.isGM) {
        return;
    }
    new ChangelogForm().render(true);
}
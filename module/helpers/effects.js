export function onManageActiveEffect(event, owner) {
    event.preventDefault();
    const a = event.currentTarget;
    const li = a.closest('li');
    const effect = li.dataset.effectId ? owner.effects.get(li.dataset.effectId) : null;
    switch (a.dataset.action) {
        case "create":
            return owner.createEmbeddedDocuments('ActiveEffect', [{
                name: game.i18n.localize('abfalter.newEff'),
                icon: "icons/svg/aura.svg",
                origin: owner.uuid,
                'duration.rounds':
                    li.dataset.effectType === 'temporary' ? 1 : undefined,
                disabled: li.dataset.effectType === 'inactive'
            }]);
        case "edit":
            return effect.sheet.render(true);
        case "delete":
            return effect.delete();
        case "toggle":
            return effect.update({ disabled: !effect.disabled });
    }
}

export function prepareActiveEffectCategories() {
    // Define effect header categories
    const categories = {
        temporary: {
            type: 'temporary',
            label: game.i18n.localize('abfalter.tempEff'),
            effects: [],
        },
        passive: {
            type: 'passive',
            label: game.i18n.localize('abfalter.passEff'),
            effects: [],
        },
        inactive: {
            type: 'inactive',
            label: game.i18n.localize('abfalter.InEff'),
            effects: [],
        },
    };

    // Iterate over active effects, classifying them into categories
    for (const e of this.actor.allApplicableEffects()) {
      if (!e.active) categories.inactive.effects.push(e);
      else if (e.isTemporary) categories.temporary.effects.push(e);
      else categories.passive.effects.push(e);
    }

    // Sort each category
    for (const c of Object.values(categories)) {
      c.effects.sort((a, b) => (a.sort || 0) - (b.sort || 0));
    }
    return categories;
}

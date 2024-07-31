import { templates } from "./templates.js"

export const preloadHandlebarsTemplates = () => {
    const templatePaths = [
        templates.CustomHotBar,
        templates.dialog.generic,
        templates.dialog.initiative,
        templates.dialog.combat.combatAttackDialog.main,
        templates.dialog.combat.combatAttackDialog.parts.combat,
        templates.dialog.combat.combatAttackDialog.parts.mystic,
        //actor tabs
        "systems/abfalter/templates/actor/parts/bio.hbs",
        "systems/abfalter/templates/actor/parts/general.hbs",
        "systems/abfalter/templates/actor/parts/background.hbs",
        "systems/abfalter/templates/actor/parts/magic.hbs",
        "systems/abfalter/templates/actor/parts/psychic.hbs",
        "systems/abfalter/templates/actor/parts/ki.hbs",
        "systems/abfalter/templates/actor/parts/armory.hbs",
        "systems/abfalter/templates/actor/parts/settings.hbs",
        "systems/abfalter/templates/actor/parts/monster.hbs",
        "systems/abfalter/templates/actor/parts/effect.hbs",
        //partials
        "systems/abfalter/templates/actor/parts/metaMagic.hbs",
        "systems/abfalter/templates/actor/parts/active-effects.hbs",
        "systems/abfalter/templates/dialogues/changelog.hbs"
    ];
    return loadTemplates(templatePaths);
};
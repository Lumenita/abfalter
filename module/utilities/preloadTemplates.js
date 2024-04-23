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
        "systems/abfalter/templates/actor/parts/bio.html",
        "systems/abfalter/templates/actor/parts/general.html",
        "systems/abfalter/templates/actor/parts/background.html",
        "systems/abfalter/templates/actor/parts/magic.html",
        "systems/abfalter/templates/actor/parts/psychic.html",
        "systems/abfalter/templates/actor/parts/ki.html",
        "systems/abfalter/templates/actor/parts/armory.html",
        "systems/abfalter/templates/actor/parts/settings.html",
        "systems/abfalter/templates/actor/parts/monster.html",
        "systems/abfalter/templates/actor/parts/effect.html",
        //partials
        "systems/abfalter/templates/actor/parts/metaMagic.html",
        "systems/abfalter/templates/actor/parts/active-effects.html"
    ];
    return loadTemplates(templatePaths);
};
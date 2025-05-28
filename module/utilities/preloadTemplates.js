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
        "systems/abfalter/templates/dialogues/changelog.hbs",
        //item partials
        "systems/abfalter/templates/item/partials/subHeader/advantage.hbs",
        "systems/abfalter/templates/item/partials/subHeader/disadvantage.hbs",//deprecated
        "systems/abfalter/templates/item/partials/subHeader/secondary.hbs",
        "systems/abfalter/templates/item/partials/subHeader/proficiency.hbs",
        "systems/abfalter/templates/item/partials/subHeader/elan.hbs",
        "systems/abfalter/templates/item/partials/subHeader/backgroundInfo.hbs",
        "systems/abfalter/templates/item/partials/subHeader/monsterPower.hbs",
        "systems/abfalter/templates/item/partials/subHeader/spellPath.hbs",
        "systems/abfalter/templates/item/partials/subHeader/zeonMaint.hbs",
        "systems/abfalter/templates/item/partials/subHeader/turnMaint.hbs",//deprecated
        "systems/abfalter/templates/item/partials/subHeader/dailyMaint.hbs",//deprecated
        "systems/abfalter/templates/item/partials/subHeader/spell.hbs",
        "systems/abfalter/templates/item/partials/subHeader/incarnation.hbs",
        "systems/abfalter/templates/item/partials/subHeader/invocation.hbs",
        "systems/abfalter/templates/item/partials/subHeader/discipline.hbs",
        "systems/abfalter/templates/item/partials/subHeader/mentalPattern.hbs",
        "systems/abfalter/templates/item/partials/subHeader/psychicMatrix.hbs",
        "systems/abfalter/templates/item/partials/subHeader/maintPower.hbs",
        "systems/abfalter/templates/item/partials/subHeader/arsMagnus.hbs",
        "systems/abfalter/templates/item/partials/subHeader/martialArt.hbs",
        "systems/abfalter/templates/item/partials/subHeader/kiSealCreature.hbs",
        "systems/abfalter/templates/item/partials/subHeader/kiTechnique.hbs",
        "systems/abfalter/templates/item/partials/subHeader/currency.hbs",
        "systems/abfalter/templates/item/partials/subHeader/armor.hbs",
        "systems/abfalter/templates/item/partials/subHeader/armorHelmet.hbs",//deprecated
        "systems/abfalter/templates/item/partials/subHeader/weapon.hbs",
        "systems/abfalter/templates/item/partials/subHeader/ammo.hbs",
        "systems/abfalter/templates/item/partials/subHeader/inventory.hbs",
        "systems/abfalter/templates/item/partials/subHeader/class.hbs",
        //Active Effects
        "systems/abfalter/templates/active-effect/changes.hbs"
    ];
    return foundry.applications.handlebars.loadTemplates(templatePaths);
};
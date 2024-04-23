import { abfalter } from "./config.js";
import { preloadHandlebarsTemplates } from "./utilities/preloadTemplates.js";
import * as Chat from "./chat.js";
import abfalterCombat from "./combat.js";
import abfalterItem from "./item/abfalterItem.js";
import abfalterItemSheet from "./item/abfalterItemSheet.js";
import abfalterActor from "./actor/abfalterActor.js";
import abfalterCharacterSheet from "./actor/abfalterCharacterSheet.js";
import { registerCustomMacros } from "./autoCombat/registerCustomMacros.js";
import { customMacroBar } from "./autoCombat/customMacroBar.js";
import { abfalterSettings } from "./utilities/abfalterSettings.js";
import { migrateWorld } from "./utilities/migration.js";
import { abfalterSettingsKeys } from "./utilities/abfalterSettings.js";
import abfalterEffectConfig from "./sheets/abfalterEffectConfig.js";

Hooks.once("init", async () => {
    console.log("abfalter | Initializing Anima Beyond Fantasy Alter System");
    // Custom Classes
    CONFIG.abfalter = abfalter;
    CONFIG.Actor.documentClass = abfalterActor;
    CONFIG.Item.documentClass = abfalterItem;
    CONFIG.Combat.documentClass = abfalterCombat;
    DocumentSheetConfig.registerSheet(ActiveEffect, "abfalter", abfalterEffectConfig, { makeDefault: true });
    CONFIG.ActiveEffect.legacyTransferral = false;
    abfalterSettings();

    CONFIG.time.roundTime = 6;

    // Custom Sheets
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("abfalter", abfalterCharacterSheet, { makeDefault: true });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("abfalter", abfalterItemSheet, { makeDefault: true });

    return preloadHandlebarsTemplates();
});
 
Hooks.on("renderChatMessage", (_app, html, _msg) => {
    Chat.addChatListeners(html, _msg);
    Chat.hideChatActionButtons(_app, html, _msg);
});

Hooks.once('ready', () => {
    registerCustomMacros();
    customMacroBar();
    if (game.settings.get('abfalter', abfalterSettingsKeys.Change_Theme) == true) {
        document.documentElement.setAttribute('data-theme', 'light');
        console.log("dark theme is gone")
    }
});

Hooks.once("ready", function () {

    if (!game.user.isGM) {
        return;
    }

    const currentVersion = game.settings.get("abfalter", "systemMigrationVersion");
    const NEEDS_MIGRATION_VERSION = "1.1.1";

    const needsMigration = !currentVersion || isNewerVersion(NEEDS_MIGRATION_VERSION, currentVersion);

    if (needsMigration) {
        migrateWorld();
    }
})

Hooks.once('setup', function () {
    // Set active effect keys-labels
    abfalterEffectConfig.initializeChangeKeys();
})

Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
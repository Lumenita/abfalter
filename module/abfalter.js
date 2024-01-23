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


Hooks.once("init", async () => {
    console.log("abfalter | Initializing Anima Beyond Fantasy Alter System");
    // Custom Classes
    CONFIG.Actor.documentClass = abfalterActor;
    CONFIG.Item.documentClass = abfalterItem;
    CONFIG.abfalter = abfalter;
    CONFIG.Combat.documentClass = abfalterCombat;
    abfalterSettings();

    await preloadHandlebarsTemplates();
    // Custom Sheets
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("abfalter", abfalterCharacterSheet, { makeDefault: true });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("abfalter", abfalterItemSheet, { makeDefault: true });
});
 
Hooks.on("renderChatMessage", (_app, html, _msg) => {
    Chat.addChatListeners(html, _msg);
    Chat.hideChatActionButtons(_app, html, _msg);
});

Hooks.once('ready', () => {
    registerCustomMacros();
    customMacroBar();
});
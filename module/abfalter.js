import { abfalter } from "./config.js"
import * as Chat from "./chat.js"
import abfalterItem from "./item/abfalterItem.js"
import abfalterItemSheet from "./item/abfalterItemSheet.js"
import abfalterActor from "./actor/abfalterActor.js"
import abfalterCharacterSheet from "./actor/abfalterCharacterSheet.js"


async function preloadHandlebarsTemplates () {
    const templatePaths = [
        "systems/abfalter/templates/actor/parts/bio.html",
        "systems/abfalter/templates/actor/parts/general.html",
        "systems/abfalter/templates/actor/parts/background.html",
        "systems/abfalter/templates/actor/parts/magic.html",
        "systems/abfalter/templates/actor/parts/psychic.html",
        "systems/abfalter/templates/actor/parts/ki.html",
        "systems/abfalter/templates/actor/parts/armory.html",
        "systems/abfalter/templates/actor/parts/settings.html",
        "templates/dice/roll.html"
    ];
    return loadTemplates(templatePaths);
};

Hooks.once("init", function () {
    console.log("abfalter | Initializing Anima Beyond Fantasy Alter System");

    CONFIG.Actor.documentClass = abfalterActor;
    CONFIG.Item.documentClass = abfalterItem;
    CONFIG.abfalter = abfalter;

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

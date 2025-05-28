import { abfalter } from "./config.js";
import { preloadHandlebarsTemplates } from "./utilities/preloadTemplates.js";
import * as Chat from "./chat.js";
import abfalterCombat from "./combat.js";
import abfalterItem from "./item/abfalterItem.js";
import abfalterItemSheet from "./item/abfalterItemSheet.mjs";
import abfalterActor from "./actor/abfalterActor.js";
import abfalterCharacterSheet from "./actor/abfalterCharacterSheet.mjs";
import { registerCustomMacros } from "./autoCombat/registerCustomMacros.js";
import { customMacroBar } from "./autoCombat/customMacroBar.js";
import { abfalterSettings } from "./utilities/abfalterSettings.js";
import { handleMigrations } from "./utilities/migration.js";
import { handleChangelog } from "./utilities/changelog.js";
import { abfalterSettingsKeys } from "./utilities/abfalterSettings.js";
import abfalterEffectConfig from "./helpers/abfalterEffectConfig.js";
import * as dice from "./diceroller.js";

Hooks.once("init", async () => {
    console.log("abfalter | Initializing Anima Beyond Fantasy Alter System");

    // Custom Sheets
    foundry.documents.collections.Actors.unregisterSheet("core", foundry.appv1.sheets.ActorSheet);
    foundry.documents.collections.Actors.registerSheet("abfalter", abfalterCharacterSheet, { types:["character"], makeDefault: true });
    foundry.documents.collections.Items.unregisterSheet("core", foundry.appv1.sheets.ItemSheet);
    foundry.documents.collections.Items.registerSheet("abfalter", abfalterItemSheet, { makeDefault: true });

    foundry.applications.apps.DocumentSheetConfig.unregisterSheet(ActiveEffect, "core", foundry.applications.sheets.ActiveEffectConfig);
    foundry.applications.apps.DocumentSheetConfig.registerSheet(ActiveEffect, "abfalter", abfalterEffectConfig, { makeDefault: true });

    // Register data models
    CONFIG.Actor.dataModels["character"] = actorDataModel;

    CONFIG.Item.dataModels = {
        //general
        advantage: advantageDataModel,
        disadvantage: disadvantageDataModel, //Deprecated removal in 1.5.3
        secondary: secondaryDataModel,
        //Background
        proficiency: proficiencyDataModel,
        elan: elanDataModel,
        backgroundInfo: backgroundInfoDataModel,
        //Creature
        monsterPower: monsterPowerDataModel,
        //Magic
        spellPath: spellPathDataModel,
        turnMaint: turnMaintDataModel, //Deprecated removal in 1.5.3
        dailyMaint: dailyMaintDataModel, //Deprecated removal in 1.5.3
        zeonMaint: zeonMaintDataModel,
        spell: spellDataModel,
        incarnation: incarnationDataModel,
        invocation: invocationDataModel,
        //Psychic
        discipline: disciplineDataModel,
        mentalPattern: mentalPatternDataModel,
        psychicMatrix: psychicMatrixDataModel,
        maintPower: maintPowerDataModel,
        //Ki
        arsMagnus: arsMagnusDataModel,
        martialArt: martialArtDataModel,
        kiSealCreature: kiSealCreatureDataModel,
        kiTechnique: kiTechniqueDataModel,
        //Armory
        currency: currencyDataModel,
        armorHelmet: armorHelmetDataModel, //Deprecated removal in 1.5.3
        armor: armorDataModel,
        weapon: weaponDataModel,
        ammo: ammoDataModel,
        inventory: inventoryDataModel,
        //Settings
        class: classDataModel,
    }

    //Exposing all roll functions to the game object
    game.abfalter = {
        openWeaponProfileDialogue: dice.openWeaponProfileDialogue,
        profileOpenRollFunction: dice.profileOpenRollFunction,
        profileFumbleRollFunction: dice.profileFumbleRollFunction,
        openMeleeTrapDialogue: dice.openMeleeTrapDialogue,
        openMeleeBreakDialogue: dice.openMeleeBreakDialogue,
        rollResistance: dice.rollResistance,
        rollCharacteristic: dice.rollCharacteristic,
        plainRoll: dice.plainRoll
    }

    CONFIG.time.roundTime = 6;

    // Custom Classes
    CONFIG.abfalter = abfalter;
    CONFIG.Actor.documentClass = abfalterActor;
    CONFIG.Item.documentClass = abfalterItem;
    CONFIG.Combat.documentClass = abfalterCombat;
    CONFIG.ActiveEffect.legacyTransferral = false;
    abfalterSettings();

    
    return preloadHandlebarsTemplates();
});
 
Hooks.on("renderChatMessageHTML", (chatMessage, html) => {
    Chat.addChatListeners(chatMessage, html);
    //Chat.hideChatActionButtons(chatMessage, html);
});

//Custom Macro Bar
Hooks.once('ready', () => {
    registerCustomMacros();
    customMacroBar();
    if (game.settings.get('abfalter', abfalterSettingsKeys.Change_Theme) == true) {
        document.documentElement.setAttribute('data-theme', 'light');
        console.log("dark theme is gone");
    }
});

Hooks.once("ready", function () {
    if (!game.user.isGM) {
        return
    }
    if (foundry.utils.isNewerVersion('1.5.0', game.settings.get("abfalter", "systemMigrationVersion"))) {
        game.settings.set('abfalter', 'systemChangeLog', false);
    }

    if (game.settings.get("abfalter", "systemChangeLog") === false) {
        handleChangelog();
    }
    handleMigrations();
})

Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
Handlebars.registerHelper('ifIn', function (val, list, options) {
    if (list.includes(val)) return options.fn(this);
    return options.inverse(this);
  });
Handlebars.registerHelper('getDistanceType', function (arg1) {
    const metric = game.settings.get('abfalter', abfalterSettingsKeys.Use_Meters);

    switch (arg1) {
        case "small":
            return metric ? "m" : "ft";
        case "big":
            return metric ? "km" : "mi";
        default:
            return arg1;            
    }
});


//Automatically activate/deactivate effects when item is equipped/unequipped
Hooks.on('updateItem', async (item, _updateData, _options, userId) => { 
    if (game.user.id !== userId) return;
    const isEquipped = foundry.utils.getProperty(_updateData, "system.equipped");
    if (isEquipped === undefined) return;

    if (isEquipped) {
        activateItemEffects(item);
    } else {
        deactivateItemEffects(item);
    }
});

async function activateItemEffects(item) {
    const actor = item.actor;
    const effects = item.effects.contents;
    for (let effect of effects) {
        if (!effect.disabled) continue; // Ignore already active effects
        await effect.update({ disabled: false });
    }
}

async function deactivateItemEffects(item) {
    const actor = item.actor;
    const effects = item.effects.contents;

    for (let effect of effects) {
        if (effect.disabled) continue; // Ignore already inactive effects
        await effect.update({ disabled: true });
    }
}

/**
 * Data Models from here on 
 */
function makeIntField(init = 0, max, min) {
    return new foundry.data.fields.NumberField({
        required: true,
        initial: init,
        min: min,
        max: max,
        integer: true
    })
}
function makeLongIntField(init = 0, max, min) {
    return new foundry.data.fields.NumberField({
        required: true,
        initial: init,
        min: min,
        max: max,
        integer: false
    })
}

function makeBoolField(init = false) {
    return new foundry.data.fields.BooleanField({
        initial: init
    })
}

function makeStringField(init = '', blank = true) {
    return new foundry.data.fields.StringField({
        initial: init,
        blank: blank
    })
}

function makeHtmlField(init = '') {
    return new foundry.data.fields.HTMLField({
        initial: init,
    })
}

class actorDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        const type = 'character';

        return {
            lp: valueMaxAbility(),
            shield: valueMaxAbility(),
            unifiedKi: valueMaxAbility(),
            psychicPoint: valueMaxAbility(),
            innatePowerKi: valueMaxAbility(),
            mentalHealth: valueMaxAbility(),
            info: new foundry.data.fields.SchemaField({
                race: makeStringField(),
                class: makeStringField(),
                gender: makeStringField(),
                height: makeStringField(),
                weight: makeStringField(),
                size: makeStringField(),
                age: makeStringField(),
                appearance: makeStringField(),
                notesOne: makeStringField(),
                notesTwo: makeStringField(),
                destiny: makeIntField(),
                gnosis: makeIntField(),
                bio: makeHtmlField(),
                enrichedBio: makeHtmlField()
            }),
            levelinfo: new foundry.data.fields.SchemaField({
                experience: makeIntField(),
                levelmod: makeIntField(),
                levelmodBonus: makeIntField(),
                presencemod: makeIntField(),
                presencemodBonus: makeIntField(),
                dpmod: makeIntField(),
                dpmodBonus: makeIntField(),
                totalCP: makeIntField(),
                extraCP: makeIntField(),
                totalLvlMod: makeIntField(),
            }),
            aamField: new foundry.data.fields.SchemaField({
                base: makeIntField(),
                boon: makeIntField(),
                crit: makeIntField(),
                bonus: makeIntField()
            }),
            otherStats: new foundry.data.fields.SchemaField({
                itemPresence: makeIntField(),
                damageBarrier: makeIntField(),
                dmgRdc: makeIntField(),
                artPresence: makeIntField(),
                damageBarrierFinal: makeIntField(),
                dmgRdcFinal: makeIntField(),
                mentalThreshold: makeIntField(),
            }),
            rollRange: new foundry.data.fields.SchemaField({
                base: makeIntField(90),
                spec: makeIntField(),
                temp: makeIntField(),
                bonus: makeIntField(),
                doubles: makeBoolField()
            }),
            fumleRange: new foundry.data.fields.SchemaField({
                base: makeIntField(3),
                spec: makeIntField(),
                temp: makeIntField(),
                bonus: makeIntField()
            }),
            itemToggle: new foundry.data.fields.SchemaField({
                advantages: makeBoolField(),
                disadvantages: makeBoolField(),
                discipline: makeBoolField(),
                mentalPattern: makeBoolField(),
                psychicMatrix: makeBoolField(),
                maintPowers: makeBoolField(),
                arsMagnus: makeBoolField(),
                martialArt: makeBoolField(),
                kiSealCreature: makeBoolField(),
                kiTechnique: makeBoolField(),
                proficiency: makeBoolField(),
                weapon: makeBoolField(),
                currency: makeBoolField(),
                inventory: makeBoolField(),
                armor: makeBoolField(),
                armorHelmet: makeBoolField(),
                spellPath: makeBoolField(),
                spell: makeBoolField(),
                invocation: makeBoolField(),
                incarnation: makeBoolField(),
                turnMaint: makeBoolField(),
                dailyMaint: makeBoolField(),
                elan: makeBoolField(),
                class: makeBoolField(),
                secondary: makeBoolField(),
                monsterPowers: makeBoolField(),
                ammo: makeBoolField(),
                race: makeBoolField(),
                culturalRoots: makeBoolField(),
                bloodBonds: makeBoolField(),
            }),
            toggles: new foundry.data.fields.SchemaField({
                actorHeaderInfo1: makeBoolField(),
                greaterEnergyArmor: makeBoolField(),
                arcaneEnergyArmor: makeBoolField(),
                psychicStrengthening: makeBoolField(),
                unifiedPools: makeBoolField(),
                innatePower: makeBoolField(),
                dragonSeals: makeBoolField(),
                currencyHide: makeBoolField(),
                magicAtkModule: makeBoolField(),
                magicDefModule: makeBoolField(),
                magicDodgeModule: makeBoolField(),
                psychicDodgeStatus: makeBoolField(),
                backgroundTab: makeBoolField(),
                magicTab: makeBoolField(),
                psychicTab: makeBoolField(),
                kiTab: makeBoolField(),
                bioTab: makeBoolField(),
                shield: makeBoolField(),
                magicTheoryVis: makeBoolField(),
                innateMagicVis: makeBoolField(),
                summoningVis: makeBoolField(),
                invocationsVis: makeBoolField(),
                incarnationsVis: makeBoolField(),
                spellcastingVis: makeBoolField(),
                turnMaintVis: makeBoolField(),
                mentalPatternsvis: makeBoolField(),
                arsMagVis: makeBoolField(),
                maVis: makeBoolField(),
                unarmedVis: makeBoolField(),
                nemesisVis: makeBoolField(),
                kiSealsVis: makeBoolField(),
                kiTech: makeBoolField(),
                customSecondary: makeBoolField(),
                monsterPowerShortDesc: makeBoolField(),
                dmgRes: makeBoolField(),
                monsterChar: makeBoolField(),
                movementInfo: makeBoolField(),
                monsterNatWep: makeBoolField(),
                monsterdisadvVis: makeBoolField(),
                monsterdefVis: makeBoolField(),
                monsterdivineVis: makeBoolField(),
                monsterTab: makeBoolField(true),
                effectTab: makeBoolField(),
                psychicDodgeStatus: makeBoolField(),
                psychicModuleStatus: makeBoolField(),
                elanStatus: makeBoolField(),
                bloodBondsStatus: makeBoolField(),
                raceRootsStatus: makeBoolField(),
                mentalHealthStatus: makeBoolField()
            }),
            stats: new foundry.data.fields.SchemaField({
                Agility: characteristics(),
                Constitution: characteristics(),
                Strength: characteristics(),
                Dexterity: characteristics(),
                Perception: characteristics(),
                Intelligence: characteristics(),
                Power: characteristics(),
                Willpower: characteristics()
            }),
            resistances: new foundry.data.fields.SchemaField({
                Physical: resistances(),
                Disease: resistances(),
                Poison: resistances(),
                Magic: resistances(),
                Psychic: resistances()
            }),
            movement: new foundry.data.fields.SchemaField({
                pen: makeIntField(),
                spec: makeIntField(),
                temp: makeIntField(),
                bonus: makeIntField()
            }),
            lifepoints: new foundry.data.fields.SchemaField({
                status: makeBoolField(),
                multiple: makeIntField(),
                spec: makeIntField(),
                temp: makeIntField(),
                actual: makeIntField(),
                bonus: makeIntField()
            }),
            fatigue: new foundry.data.fields.SchemaField({
                status: makeBoolField(),
                spec: makeIntField(),
                temp: makeIntField(),
                actual: makeIntField(),
                value: makeIntField(),
                max: makeIntField(),
                bonus: makeIntField()
            }),
            regeneration: new foundry.data.fields.SchemaField({
                spec: makeIntField(),
                temp: makeIntField(),
                value: makeIntField(),
                bonus: makeIntField()
            }),
            combatValues: new foundry.data.fields.SchemaField({
                attack: combatValues(),
                block: combatValues(),
                dodge: combatValues()
            }),
            initiative: new foundry.data.fields.SchemaField({
                status: makeBoolField(),
                spec: makeIntField(),
                bonus: makeIntField()
            }),
            secondaryFields: new foundry.data.fields.SchemaField({
                category: new foundry.data.fields.SchemaField({
                    athletics: makeBoolField(),
                    social: makeBoolField(),
                    perceptive: makeBoolField(),
                    intellectual: makeBoolField(),
                    vigor: makeBoolField(),
                    subterfuge: makeBoolField(),
                    creative: makeBoolField()
                }),
                athletics: new foundry.data.fields.SchemaField({
                    acrobatics: secondaryAbilities('acrobatic', 'agi', 'physical', true),
                    athleticism: secondaryAbilities('athleticism', 'agi', 'physical', true),
                    climb: secondaryAbilities('climb', 'agi', 'physical', true),
                    jump: secondaryAbilities('jump', 'str', 'physical', true),
                    piloting: secondaryAbilities('piloting', 'dex', 'physical', true),
                    ride: secondaryAbilities('ride', 'agi', 'physical', true),
                    swim: secondaryAbilities('swim', 'agi', 'physical', true)
                }),
                social: new foundry.data.fields.SchemaField({
                    etiquette: secondaryAbilities('etiquette', 'int', 'mental', false),
                    intimidate: secondaryAbilities('intimidate', 'wp', 'mental', false),
                    leadership: secondaryAbilities('leadership', 'pow', 'mental', false),
                    persuasion: secondaryAbilities('persuasion', 'int', 'mental', false),
                    streetwise: secondaryAbilities('streetwise', 'int', 'mental', false),
                    style: secondaryAbilities('style', 'pow', 'mental', false),
                    trading: secondaryAbilities('trading', 'int', 'mental', false)
                }),
                perceptive: new foundry.data.fields.SchemaField({
                    kidetection: secondaryAbilities('kiDetection', 'per', 'mental', false),
                    notice: secondaryAbilities('notice', 'per', 'mental', false),
                    search: secondaryAbilities('search', 'per', 'mental', false),
                    track: secondaryAbilities('track', 'per', 'mental', false)
                }),
                intellectual: new foundry.data.fields.SchemaField({
                    animals: secondaryAbilities('animals', 'int', 'mental', false),
                    appraisal: secondaryAbilities('appraisal', 'int', 'mental', false),
                    architecture: secondaryAbilities('architecture', 'int', 'mental', false),
                    herballore: secondaryAbilities('herballore', 'int', 'mental', false),
                    history: secondaryAbilities('history', 'int', 'mental', false),
                    law: secondaryAbilities('law', 'int', 'mental', false),
                    magicappr: secondaryAbilities('magicAppr', 'pow', 'mental', false),
                    medicine: secondaryAbilities('medicine', 'int', 'mental', false),
                    memorize: secondaryAbilities('memorize', 'int', 'mental', false),
                    navigation: secondaryAbilities('navigation', 'int', 'mental', false),
                    occult: secondaryAbilities('occult', 'int', 'mental', false),
                    science: secondaryAbilities('science', 'int', 'mental', false),
                    tactics: secondaryAbilities('tactics', 'int', 'mental', false),
                    technomagic: secondaryAbilities('technomagic', 'int', 'mental', false)
                }),
                vigor: new foundry.data.fields.SchemaField({
                    composure: secondaryAbilities('composure', 'wp', 'mental', false),
                    featsofstr: secondaryAbilities('featsofstr', 'str', 'mental', true),
                    withstpain: secondaryAbilities('withstpain', 'wp', 'mental', false)
                }),
                subterfuge: new foundry.data.fields.SchemaField({
                    disguise: secondaryAbilities('disguise', 'dex', 'physical', false),
                    hide: secondaryAbilities('hide', 'per', 'mental', true),
                    kiconceal: secondaryAbilities('kiConceal', 'per', 'mental', false),
                    lockpicking: secondaryAbilities('lockpicking', 'dex', 'physical', false),
                    poisons: secondaryAbilities('poisons', 'int', 'mental', false),
                    stealth: secondaryAbilities('stealth', 'agi', 'physical', true),
                    theft: secondaryAbilities('theft', 'dex', 'physical', false),
                    traplore: secondaryAbilities('traplore', 'dex', 'physical', false)
                }),
                creative: new foundry.data.fields.SchemaField({
                    alchemy: secondaryAbilities('alchemy', 'int', 'mental', false),
                    animism: secondaryAbilities('animism', 'pow', 'mental', false),
                    art: secondaryAbilities('art', 'pow', 'mental', false),
                    cooking: secondaryAbilities('cooking', 'pow', 'mental', false),
                    dance: secondaryAbilities('dance', 'agi', 'physical', true),
                    forging: secondaryAbilities('forging', 'dex', 'physical', false),
                    jewelry: secondaryAbilities('jewelry', 'dex', 'physical', false),
                    toymaking: secondaryAbilities('toymaking', 'pow', 'mental', false),
                    music: secondaryAbilities('music', 'pow', 'mental', false),
                    runes: secondaryAbilities('runes', 'dex', 'physical', false),
                    ritualcalig: secondaryAbilities('ritualcalig', 'dex', 'physical', false),
                    slofhand: secondaryAbilities('slofhand', 'dex', 'physical', false),
                    tailoring: secondaryAbilities('tailoring', 'dex', 'physical', false)
                })
            }),
            monsterChar: new foundry.data.fields.SchemaField({
                agi: monsterCharacteristics("physical", game.i18n.localize('abfalter.agi')),
                con: monsterCharacteristics("physical", game.i18n.localize('abfalter.con')),
                str: monsterCharacteristics("physical", game.i18n.localize('abfalter.str')),
                dex: monsterCharacteristics("physical", game.i18n.localize('abfalter.dex')),
                per: monsterCharacteristics("mental", game.i18n.localize('abfalter.per')),
                int: monsterCharacteristics("mental", game.i18n.localize('abfalter.int')),
                pow: monsterCharacteristics("mental", game.i18n.localize('abfalter.pow')),
                wp: monsterCharacteristics("mental", game.i18n.localize('abfalter.wp'))
            }),
            monsterStats: new foundry.data.fields.SchemaField({
                hpDp: makeIntField()
            }),
            mproj: new foundry.data.fields.SchemaField({
                base: makeIntField(),
                spec: makeIntField(),
                spec2: makeIntField(),
                imbalance: makeIntField(),
                temp: makeIntField(),
                temp2: makeIntField(),
                bonus: makeIntField(),
                bonus2: makeIntField(),
                mtheory: makeStringField("Standard"),
                status: makeBoolField()
            }),
            maccu: new foundry.data.fields.SchemaField({
                base: makeIntField(),
                mult: makeIntField(),
                spec: makeIntField(),
                temp: makeIntField(),
                actual: makeIntField(),
                bonus: makeIntField(),
                status: makeBoolField()
            }),
            mregen: new foundry.data.fields.SchemaField({
                regenmult: makeIntField(),
                spec: makeIntField(),
                recoverymult: makeIntField(),
                temp: makeIntField(),
                bonus: makeIntField(),
                status: makeBoolField()
            }),
            zeon: new foundry.data.fields.SchemaField({
                base: makeIntField(),
                spec: makeIntField(),
                temp: makeIntField(),
                actual: makeIntField(),
                value: makeIntField(),
                max: makeIntField(),
                minnate: makeIntField(),
                bonus: makeIntField(),
                status: makeBoolField()
            }),
            mlevel: new foundry.data.fields.SchemaField({
                base: makeIntField(),
                spec: makeIntField(),
                temp: makeIntField(),
                bonus: makeIntField(),
                status: makeBoolField()
            }),
            summoning: new foundry.data.fields.SchemaField({
                summon: summoningAbiities(),
                control: summoningAbiities(),
                bind: summoningAbiities(),
                banish: summoningAbiities()
            }),
            metaMagic: new foundry.data.fields.SchemaField({
                derived: new foundry.data.fields.SchemaField({
                }),
                info: makeStringField(),
                cost: makeIntField(),
                extraCost: makeIntField(),
                incDestro: metamagic(),
                incDestro2: metamagic(),
                empShield: metamagic(),
                empShield2: metamagic(),
                remProtection: metamagic(),
                remProtection2: metamagic(),
                remProtection3: metamagic(),
                defExper: metamagic(),
                defExper2: metamagic(),
                defExper3: metamagic(),
                mysticAcc: metamagic(),
                mysticAcc2: metamagic(),
                expArea: metamagic(),
                expArea2: metamagic(),
                offExper: metamagic(),
                offExper2: metamagic(),
                offExper3: metamagic(),
                doubleDmg: metamagic(),
                secDefense: metamagic(),
                lifeMagic: metamagic(),
                lifeMagic2: metamagic(),
                feelMagic: metamagic(),
                hiddenMagic: metamagic(),
                spiritLoop: metamagic(),
                spiritLoop2: metamagic(),
                controlSpace: metamagic(),
                eneControl: metamagic(),
                endureDamage: metamagic(),
                transferMagic: metamagic(),
                forceSpeed: metamagic(),
                forceSpeed2: metamagic(),
                forceSpeed3: metamagic(),
                doubleInnate: metamagic(),
                natMaint: metamagic(),
                combinedMagic: metamagic(),
                persisEffects: metamagic(),
                defMagicProj: metamagic(),
                defMagicProj2: metamagic(),
                defMagicProj3: metamagic(),
                defMagicProj4: metamagic(),
                defMagicProj5: metamagic(),
                defMagicProj6: metamagic(),
                defMagicProj7: metamagic(),
                exploitEne: metamagic(),
                exploitEne2: metamagic(),
                advZeonRegen: metamagic(),
                advZeonRegen2: metamagic(),
                advZeonRegen3: metamagic(),
                elevation: metamagic(),
                avatar: metamagic(),
                unlimitedZeon: metamagic(),
                mysticConcen: metamagic(),
                spellSpec30: metamagic(),
                spellSpec30x: metamagic(),
                spellSpec50: metamagic(),
                spellSpec60: metamagic(),
                spellSpec60x: metamagic(),
                spellSpec70: metamagic(),
                spellSpec80: metamagic(),
                pierceRes: metamagic(),
                pierceRes2: metamagic(),
                incRange: metamagic(),
                incRange2: metamagic(),
                bindSpells: metamagic(),
                maxSpells: metamagic(),
                doubleSpell: metamagic(),
                supInnateSpell: metamagic(),
                highMagic: metamagic()
            }),
            kiAbility: new foundry.data.fields.SchemaField({
                useOfKi: kiAbility(40),
                kiControl: kiAbility(30),
                kiDetection: kiAbility(20),
                kiErudition: kiAbility(10),
                kiCombatAura: kiAbility(10),
                kiPhysDom: kiAbility(10),
                kiPhysChange: kiAbility(30),
                kiSuperiorChange: kiAbility(20),
                kiMultBodies: kiAbility(30),
                kiGreaterMult: kiAbility(30),
                kiArcaneMult: kiAbility(40),
                kiMagnitude: kiAbility(30),
                kiArcaneMagn: kiAbility(30),
                kiAgeControl: kiAbility(20),
                kiTechImi: kiAbility(50),
                kiTechPush: kiAbility(20),
                weightElimination: kiAbility(10),
                kiLevitation: kiAbility(20),
                kiObjectMotion: kiAbility(10),
                kiMassMove: kiAbility(20),
                kiFlight: kiAbility(20),
                kiPresenceEx: kiAbility(10),
                kiEnergyArmor: kiAbility(10),
                kiGreaterArmor: kiAbility(10),
                kiArcaneArmor: kiAbility(10),
                kiAuraEx: kiAbility(10),
                kiEleFire: kiAbility(10),
                kiEleWater: kiAbility(10),
                kiEleAir: kiAbility(10),
                kiEleEarth: kiAbility(10),
                kiEleLight: kiAbility(10),
                kiEleDark: kiAbility(10),
                kiIncreaseDmg: kiAbility(10),
                kiIncreaseReach: kiAbility(10),
                kiIncreaseSpd: kiAbility(10),
                kiDestruction: kiAbility(20),
                kiAbsorbtion: kiAbility(30),
                kiPhysShield: kiAbility(10),
                kiTrans: kiAbility(10),
                kiHeal: kiAbility(10),
                kiSupHeal: kiAbility(10),
                kiStabil: kiAbility(10),
                kiLifeSac: kiAbility(10),
                kiUseOfEne: kiAbility(10),
                kiConceal: kiAbility(10),
                kiAuraConceal: kiAbility(10),
                kiFalseDeath: kiAbility(10),
                kiEleminationOfNec: kiAbility(10),
                kiEleImmHeat: kiAbility(20),
                kiEleImmCold: kiAbility(20),
                kiEleImmEle: kiAbility(20),
                kiPenRed: kiAbility(20),
                kiRecovery: kiAbility(20),
                kiRestoreOther: kiAbility(10),
                kiCharacAug: kiAbility(20),
                kiSupCharacAug: kiAbility(20),
                kiImpovTech: kiAbility(50),
                kiInhumanity: kiAbility(30),
                kiZen: kiAbility(50),
                useOfNemesis: kiAbility(70), //Nemesis abilities
                nemiArmor: kiAbility(20),
                nemiNoht: kiAbility(30),
                nemiKiCancel: kiAbility(30),
                nemiGreaterKiCancel: kiAbility(20),
                nemiMysticCancel: kiAbility(30),
                nemiGreaterMysticCancel: kiAbility(20),
                nemiMatrixCancel: kiAbility(30),
                nemiGreaterMatrixCancel: kiAbility(20),
                nemiBindCancel: kiAbility(30),
                nemiEmptyExt: kiAbility(30),
                nemiFormOfEmpty: kiAbility(30),
                nemiBodyEmpty: kiAbility(10),
                nemiNoNeeds: kiAbility(10),
                nemiMoveEmpty: kiAbility(20),
                nemiEssenceEmpty: kiAbility(20),
                nemiOneNothing: kiAbility(40),
                nemiAuraEmpty: kiAbility(30),
                nemiUndetectable: kiAbility(10),
                nemiInhumanity: kiAbility(20),
                useOfnemiZenKi: kiAbility(40)
            }),
            fistDamage: new foundry.data.fields.SchemaField({
                base: makeIntField(),
                mult: makeIntField(),
                mult2: makeIntField(),
                descNum: makeIntField(),
                desc: makeStringField(),
                multOption: makeStringField("str"),
                multOption2: makeStringField("none"),
                bonus: makeIntField(),
            }),
            kiPool: new foundry.data.fields.SchemaField({
                agi: kiPoolAbilities(),
                con: kiPoolAbilities(),
                dex: kiPoolAbilities(),
                str: kiPoolAbilities(),
                pow: kiPoolAbilities(),
                wp: kiPoolAbilities(),
                unified: makeIntField(),
                unifiedBonus: makeIntField(),
                innate: new foundry.data.fields.SchemaField({
                    type: makeStringField("POW"),
                    tag: makeStringField("POW"),
                    spec: makeIntField(),
                    temp: makeIntField(),
                    actual: makeIntField(),
                    bonus: makeIntField(),
                    status: makeBoolField()
                })
            }),
            mk: new foundry.data.fields.SchemaField({
                base: makeIntField(),
                spec: makeIntField(),
                temp: makeIntField(),
                bonus: makeIntField(),
                status: makeBoolField()
            }),
            kiSeal: new foundry.data.fields.SchemaField({
                status: makeBoolField(),
                minor: new foundry.data.fields.SchemaField({
                    wood: kiSealAbilities(),
                    metal: kiSealAbilities(),
                    air: kiSealAbilities(),
                    water: kiSealAbilities(),
                    fire: kiSealAbilities()
                }),
                major: new foundry.data.fields.SchemaField({
                    wood: kiSealAbilities(),
                    metal: kiSealAbilities(),
                    air: kiSealAbilities(),
                    water: kiSealAbilities(),
                    fire: kiSealAbilities()
                })
            }),
            limits: new foundry.data.fields.SchemaField({
                limitOne: makeStringField(),
                limitTwo: makeStringField()
            }),
            arsMagnus: new foundry.data.fields.SchemaField({
                dragonSeal: makeIntField(),
                dragonDoor: makeIntField()
            }),
            armor: new foundry.data.fields.SchemaField({
                wearArmor: new foundry.data.fields.SchemaField({
                    base: makeIntField(),
                    spec: makeIntField(),
                    temp: makeIntField(),
                    bonus: makeIntField()
                }),
                body: new foundry.data.fields.SchemaField({
                }),
                helmet: new foundry.data.fields.SchemaField({
                })
            }),
            currency: new foundry.data.fields.SchemaField({
                copper: makeIntField(),
                silver: makeIntField(),
                gold: makeIntField()
            }),
            ppoint: new foundry.data.fields.SchemaField({
                base: makeIntField(),
                spec: makeIntField(),
                freepp: makeIntField(),
                desc: makeStringField(),
                bonus: makeIntField(),
                status: makeBoolField()
            }),
            ppotential: new foundry.data.fields.SchemaField({
                base: makeIntField(),
                spent: makeIntField(),
                spec: makeIntField(),
                temp: makeIntField(),
                bonus: makeIntField(),
                status: makeBoolField()
            }),
            pproj: new foundry.data.fields.SchemaField({
                base: makeIntField(),
                spec: makeIntField(),
                temp: makeIntField(),
                bonusBase: makeIntField(),
                bonus: makeIntField(),
                bonus2: makeIntField(),
                status: makeBoolField()
            }),
            other: new foundry.data.fields.SchemaField({
                innateSlots: makeIntField(),
                status: makeBoolField(),
                accuZeonBar: new foundry.data.fields.SchemaField({
                    value: makeIntField(),
                    max: makeIntField()
                })
            })
        }
    }

    static migrateData(source) {
        return super.migrateData(source);
    }

    get type() {
        return 'character'
    }
}

class ammoDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            description: makeHtmlField(),
            presence: makeIntField(),
            price: makeIntField(),
            priceType: makeStringField("sCoin"),
            priceTotal: makeIntField(),
            weight: makeLongIntField(),
            weightType: makeStringField("lb"),
            weightTotal: makeLongIntField(),
            quantity: makeIntField(),
            damage: makeIntField(),
            dmgType: makeStringField("THR"),
            break: makeIntField(),
            atPen: makeIntField(),
            expand: makeBoolField()
        }
    }
}

class weaponDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            description: makeHtmlField(),
            info: new foundry.data.fields.SchemaField({
                type: makeStringField("melee"),
                complex: makeBoolField(),
                openRollMod: makeIntField(),
                fumbleRollMod: makeIntField(),
                reqType: makeStringField("str"),
                reqWarning: makeBoolField(),
                reqMod: makeIntField(),
                reqMod2h: makeIntField(),
                precision: makeBoolField(),
                vorpal: makeBoolField(),
                vorpalLocation: makeStringField("anywhere"),
                vorpalMod: makeIntField(),
                weaponClass: makeStringField(),
                lastWepUsed: makeIntField(),
                lastDefUsed: makeIntField()
            }),
            rarity: makeStringField(),
            quality: makeIntField(),
            fortitude: makeIntField(),
            speed: makeIntField(),
            presence: makeIntField(),
            attack: makeIntField(),
            block: makeIntField(),
            dodge: makeIntField(),
            baseDmg: makeIntField(),
            breakage: makeIntField(),
            atPen: makeIntField(),
            strBreak: makeStringField(),
            primDmgT: makeStringField("CUT"),
            secDmgT: makeStringField("NONE"),
            derived: new foundry.data.fields.SchemaField({
                baseAtk: makeIntField(),
                baseBlk: makeIntField(),
                baseDod: makeIntField(),
                finalFortitude: makeIntField(),
                finalPresence: makeIntField(),
                finalWeaponSpeed: makeIntField()
            }),
            melee: new foundry.data.fields.SchemaField({
                dmgMod: makeStringField("str"),
                twoHanded: makeBoolField(),
                baseDmg: makeIntField(),
                finalATPen: makeIntField(),
                finalBreakage: makeIntField(),
                throwable: makeBoolField(),
                throwRange: makeIntField(),
                throwDistanceType: makeStringField("small"),
                throwQuantity: makeIntField(),
                trapping: makeBoolField(),
                trappingTypeF: makeStringField("str"),
                trappingTypeS: makeStringField("agi")
            }),
            ranged: new foundry.data.fields.SchemaField({
                selectedAmmo: makeStringField("none"),
                reloadTime: makeIntField(),
                bestReloadValue: makeIntField(),
                reloadTag: makeStringField("none"),
                fired: makeBoolField(true),
                range: makeIntField(),
                rangeType: makeStringField("small"),
                ammoDmgMod: makeIntField(),
                ammoBreakMod: makeIntField(),
                ammoAtPenMod: makeIntField(),
                infiniteAmmo: makeBoolField(),
                specialAmmo: makeBoolField(),
                specialDmg: makeIntField(),
                specialBreak: makeIntField(),
                specialAtPen: makeIntField(),
                specialDmgType: makeStringField("THR"),
                readyToFire: makeBoolField(),
                magSize: makeIntField(),
                magSizeMax: makeIntField(1),
                showStrFields: makeBoolField(),
                strField: makeIntField(),
                strOverride: makeBoolField(),
                strOverrideValue: makeIntField(),
                reloadTimeFinal: makeIntField(),    

            }),
            shield: new foundry.data.fields.SchemaField({
                type: makeStringField("shieldBuckler")
            }),
            attacks: new foundry.data.fields.TypedObjectField(
                new foundry.data.fields.SchemaField({
                    expand: makeBoolField(true),
                    profileType: makeStringField("both"),
                    wepType: makeStringField("melee"),
                    name: makeStringField(),
                    attack: makeIntField(),
                    finalAttack: makeIntField(),
                    block: makeIntField(),
                    finalBlock: makeIntField(),
                    dodge: makeIntField(),
                    finalDodge: makeIntField(),
                    atPen: makeIntField(),
                    finalAtPen: makeIntField(),
                    breakage: makeIntField(),
                    finalBreakage: makeIntField(),
                    damage: makeIntField(),
                    finalDamage: makeIntField(),                
                    ignoreThrown: makeBoolField(),
                    fired: makeBoolField(),
                    rateOfFire: makeIntField(),
                    rangedAmmoConsumed: makeBoolField(true),
                    rangedAmmoConsumedValue: makeIntField(1),
                    quantityConsumed: makeBoolField(),
                    consumedValue:  makeIntField(),
                    ignorePrecision: makeBoolField(),
                    ignoreVorpal: makeBoolField(false),
                    ignoreTrapping: makeBoolField(false),
                    trappingType: makeBoolField(),                
                    trappingValue: makeIntField(),
                    parentPrecision: makeBoolField(),
                    parentVorpal: makeBoolField(),
                    parentTrapping: makeBoolField(),
                    parentThrowable: makeBoolField(),
                    atkOverride: makeBoolField(),
                    blkOverride: makeBoolField(),
                    dodOverride: makeBoolField(),
                    dmgOverride: makeBoolField()
                })
            ),
            equipped: makeBoolField(),
            expand: makeBoolField()
        }
    }

    static migrateData(source) {
        if (Array.isArray(source.attacks)) { // v1.5.0 Change from array to typedObjectField so each individual save does not replace the whole array
            console.log("Migrating weapon attacks from array to typedObjectField");
            const newAttacks = {};
            for (let atk of source.attacks) {
                newAttacks[foundry.utils.randomID()] = atk;
            }
            source.attacks = newAttacks;
        }
        return super.migrateData(source);
    }

    get type() {
        return 'weapon'
    }
}

class classDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            description: makeHtmlField(),
            expand: makeBoolField(),
            athletics: makeBoolField(),
            social: makeBoolField(),
            perceptive: makeBoolField(),
            intellectual: makeBoolField(),
            vigor: makeBoolField(),
            subterfuge: makeBoolField(),
            creative: makeBoolField(),
            main: new foundry.data.fields.SchemaField({
                levels: makeIntField(0),
                archeType: makeStringField(),
                lp: makeIntField(),
                initiative: makeIntField(),
                attack: makeIntField(),
                dodge: makeIntField(),
                block: makeIntField(),
                weararmor: makeIntField(),
                mk: makeIntField(),
                pp: makeIntField(),
                zeon: makeIntField(),
                summon: makeIntField(),
                control: makeIntField(),
                bind: makeIntField(),
                banish: makeIntField()
            }),
            secondary: new foundry.data.fields.SchemaField({
                acro: makeIntField(),
                athleticism: makeIntField(),
                climb: makeIntField(),
                jump: makeIntField(),
                ride: makeIntField(),
                swim: makeIntField(),
                etiquette: makeIntField(),
                intimidate: makeIntField(),
                leadership: makeIntField(),
                persuasion: makeIntField(),
                streetwise: makeIntField(),
                style: makeIntField(),
                trading: makeIntField(),
                notice: makeIntField(),
                search: makeIntField(),
                track: makeIntField(),
                animals: makeIntField(),
                appraisal: makeIntField(),
                architecture: makeIntField(),
                herballore: makeIntField(),
                history: makeIntField(),
                law: makeIntField(),
                magicappr: makeIntField(),
                medicine: makeIntField(),
                memorize: makeIntField(),
                navigation: makeIntField(),
                occult: makeIntField(),
                science: makeIntField(),
                tactics: makeIntField(),
                composure: makeIntField(),
                featsofstr: makeIntField(),
                withstpain: makeIntField(),
                disguise: makeIntField(),
                hide: makeIntField(),
                lockpicking: makeIntField(),
                poisons: makeIntField(),
                stealth: makeIntField(),
                theft: makeIntField(),
                traplore: makeIntField(),
                alchemy: makeIntField(),
                animism: makeIntField(),
                art: makeIntField(),
                dance: makeIntField(),
                forging: makeIntField(),
                jewelry: makeIntField(),
                music: makeIntField(),
                runes: makeIntField(),
                ritualcalig: makeIntField(),
                slofhand: makeIntField(),
                tailoring: makeIntField(),
                cooking: makeIntField(),
                technomagic: makeIntField(),
                piloting: makeIntField(),
                toymaking: makeIntField(),
                kiDetection: makeIntField(),
                kiconceal: makeIntField()
            }),
            dpCost: new foundry.data.fields.SchemaField({
                limits: new foundry.data.fields.SchemaField({
                    primary: makeLongIntField(50),
                    supernatural: makeLongIntField(50),
                    psychic: makeLongIntField(50)
                }),
                primary: new foundry.data.fields.SchemaField({
                    attack: makeLongIntField(2),
                    block: makeLongIntField(2),
                    dodge: makeLongIntField(2),
                    wearArmor: makeLongIntField(2),
                    kiPoint: makeLongIntField(2),
                    kiAccuMult: makeLongIntField(20),
                }),
                supernatural: new foundry.data.fields.SchemaField({
                    zeon: makeLongIntField(2),
                    maMult: makeLongIntField(50),
                    maRegen: makeLongIntField(25),
                    magicProj: makeLongIntField(2),
                    summon: makeLongIntField(2),
                    control: makeLongIntField(2),
                    bind: makeLongIntField(2),
                    banish: makeLongIntField(2)
                }),
                psychic: new foundry.data.fields.SchemaField({
                    psyPoint: makeLongIntField(10),
                    psyProj: makeLongIntField(2)
                }),
                other: new foundry.data.fields.SchemaField({
                    lpMult: makeLongIntField(20)
                }),
                fields: new foundry.data.fields.SchemaField({
                    athletics: makeLongIntField(2),
                    athleticsToggle: makeBoolField(true),
                    social: makeLongIntField(2),
                    socialToggle: makeBoolField(true),
                    perceptive: makeLongIntField(2),
                    perceptiveToggle: makeBoolField(true),
                    intellectual: makeLongIntField(2),
                    intellectualToggle: makeBoolField(true),
                    vigor: makeLongIntField(2),
                    vigorToggle: makeBoolField(true),
                    subterfuge: makeLongIntField(2),
                    subterfugeToggle: makeBoolField(true),
                    creative: makeLongIntField(2),
                    creativeToggle: makeBoolField(true)
                }),
                subject: new foundry.data.fields.SchemaField({
                    acro: makeLongIntField(2),
                    athleticism: makeLongIntField(2),
                    climb: makeLongIntField(2),
                    jump: makeLongIntField(2),
                    piloting: makeLongIntField(2),
                    ride: makeLongIntField(2),
                    swim: makeLongIntField(2),
                    etiquette: makeLongIntField(2),
                    intimidate: makeLongIntField(2),
                    leadership: makeLongIntField(2),
                    persuasion: makeLongIntField(2),
                    streetwise: makeLongIntField(2),
                    style: makeLongIntField(2),
                    trading: makeLongIntField(2),
                    notice: makeLongIntField(2),
                    search: makeLongIntField(2),
                    track: makeLongIntField(2),
                    animals: makeLongIntField(2),
                    appraisal: makeLongIntField(2),
                    architecture: makeLongIntField(2),
                    herballore: makeLongIntField(2),
                    history: makeLongIntField(2),
                    law: makeLongIntField(2),
                    magicappr: makeLongIntField(2),
                    medicine: makeLongIntField(2),
                    memorize: makeLongIntField(2),
                    navigation: makeLongIntField(2),
                    occult: makeLongIntField(2),
                    science: makeLongIntField(2),
                    tactics: makeLongIntField(2),
                    technomagic: makeLongIntField(2),
                    composure: makeLongIntField(2),
                    featsofstr: makeLongIntField(2),
                    withstpain: makeLongIntField(2),
                    disguise: makeLongIntField(2),
                    hide: makeLongIntField(2),
                    lockpicking: makeLongIntField(2),
                    poisons: makeLongIntField(2),
                    stealth: makeLongIntField(2),
                    theft: makeLongIntField(2),
                    traplore: makeLongIntField(2),
                    alchemy: makeLongIntField(2),
                    animism: makeLongIntField(2),
                    art: makeLongIntField(2),
                    cooking: makeLongIntField(2),
                    dance: makeLongIntField(2),
                    forging: makeLongIntField(2),
                    jewelry: makeLongIntField(2),
                    toymaking: makeLongIntField(2),
                    music: makeLongIntField(2),
                    runes: makeLongIntField(2),
                    ritualcalig: makeLongIntField(2),
                    slofhand: makeLongIntField(2),
                    tailoring: makeLongIntField(2)
                })
            })
        }
    }

    static migrateData(source) {
        return super.migrateData(source);
    }

    get type() {
        return 'class'
    }
}

class armorDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            description: makeHtmlField(),
            equipped: makeBoolField(),
            ignorePenalty: makeBoolField(),
            ignoreLayerRules: makeBoolField(),
            spiritHomebrew: makeBoolField(),
            armorType: makeStringField("armor"),
            layerType: makeStringField("soft"),
            quantity: makeIntField(1),
            quality: makeIntField(),
            presence: makeIntField(),
            fortitude: makeIntField(),
            requirement: makeIntField(),
            natPenalty: makeIntField(),
            movePenalty: makeIntField(),
            AT: new foundry.data.fields.SchemaField({
                cut: makeIntField(),
                imp: makeIntField(),
                thr: makeIntField(),
                heat: makeIntField(),
                cold: makeIntField(),
                ele: makeIntField(),
                ene: makeIntField(),
                spt: makeIntField()
            }),
            derived: new foundry.data.fields.SchemaField({
                presence: makeIntField(),
                fortitude: makeIntField(),
                requirement: makeIntField(),
                natPenalty: makeIntField(),
                movePenalty: makeIntField(),
                cut: makeIntField(),
                imp: makeIntField(),
                thr: makeIntField(),
                heat: makeIntField(),
                cold: makeIntField(),
                ele: makeIntField(),
                ene: makeIntField(),
                spt: makeIntField()
            })
        }
    }

    static migrateData(source) {
        return super.migrateData(source);
    }
}

class proficiencyDataModel extends foundry.abstract.DataModel { 
    static defineSchema() {
        return {
            description: makeHtmlField(),
            type: makeStringField("Starting"),
            cost: makeIntField(),
            expand: makeBoolField(),
            toggleItem: makeBoolField(),
        }
    }

    static migrateData(source) {
        return super.migrateData(source);
    }
}

class elanDataModel extends foundry.abstract.DataModel { 
    static defineSchema() {
        
        return {
            description: makeHtmlField(),
            expand: makeBoolField(),
            showDesc: makeBoolField(),
            showGains: makeBoolField(),
            upper: makeBoolField(), //Show above 50 Elan gain on true
            title: makeStringField(), 
            gain: makeHtmlField(), //how to gain elan below 50
            gainUpper: makeHtmlField(), //how to gain elan above 50
            lose: makeHtmlField(), //ways to lose elan
            level: makeIntField(),
            totalCost: makeIntField(),
            gifts: new foundry.data.fields.TypedObjectField(
                new foundry.data.fields.SchemaField({
                    name: makeStringField(),
                    req: makeIntField(),
                    cost: makeIntField(),
                    desc: makeHtmlField(),
                    expand: makeBoolField(true),
                    bought: makeBoolField(),
                    active: makeBoolField(),
                    showGift: makeBoolField(true),
            })),
        }
    }

    static migrateData(source) {
        return super.migrateData(source);
    }
}

class backgroundInfoDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            description: makeHtmlField(),
            type: makeStringField("race"),
            expand: makeBoolField(),
            descToggle: makeBoolField(),
            levelMod: makeIntField(),
            expPen: makeIntField(),
            region: makeStringField(),
            city: makeStringField(),
            cpCost: makeIntField()
        }
    }

    static migrateData(source) {
        return super.migrateData(source);
    }
}

class secondaryDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            description: makeStringField(),
            base: makeIntField(),
            spec: makeIntField(),
            extra: makeIntField(),
            temp: makeIntField(),
            nat: makeIntField(),
            natural: makeIntField(),
            atr: makeStringField("none"),
            expand: makeBoolField(),
            fav: makeBoolField(),
        }
    }

    static migrateData(source) {
        return super.migrateData(source);
    }
}

class advantageDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            description: makeStringField(),
            expand: makeBoolField(),
            cost: makeIntField(),
            toggleItem: makeBoolField(),
            type: makeStringField("advantage"),
        }
    }

    static migrateData(source) {
        return super.migrateData(source);
    }
}

class spellPathDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            level: makeIntField(),
            toggleItem: makeBoolField(),
        }
    }

    static migrateData(source) {
        return super.migrateData(source);
    }
}

class spellDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            description: makeStringField(),
            expand: makeBoolField(),
            path: makeStringField(),
            level: makeIntField(),
            action: makeStringField("Active"),
            projection: makeStringField("Offensive"),
            bought: makeStringField("SpellPath"),
            cost: makeIntField(),
            type: makeStringField("Attack"),
            maintType: makeStringField("None"),
            basic: spellDif(),
            intermediate: spellDif(),
            advanced: spellDif(),
            arcane: spellDif()
        }
    }

    static migrateData(source) {
        return super.migrateData(source);
    }
}

class incarnationDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            description: makeStringField(),
            level: makeIntField(),
            cost: makeIntField(),
            difficulty: makeIntField(),
            expand: makeBoolField()
        }
    }

    static migrateData(source) {
        return super.migrateData(source);
    }
}
//Combine with incarnationDataModel to make a single model for both
class invocationDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            description: makeStringField(),
            difficulty: makeIntField(),
            cost: makeIntField(),
            atk: makeStringField("N/A"),
            def: makeStringField("N/A"),
            action: makeStringField(),
            pact: makeStringField(),
            expand: makeBoolField(),
        }
    }

    static migrateData(source) {
        return super.migrateData(source);
    }
}

class zeonMaintDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            description: makeStringField(),
            expand: makeBoolField(),
            zeon: makeIntField(),
            cost: makeIntField(),
            equipped: makeBoolField(),
            type: makeStringField("turn"),
            toggleItem: makeBoolField(),
        }
    }

    static migrateData(source) {
        return super.migrateData(source);
    }
}

class inventoryDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            description: makeStringField(),
            expand: makeBoolField(),
            quantity: makeIntField(),
            price: makeStringField(),
            quality: makeStringField(),
            weight: makeIntField(),
            fortitude: makeStringField(),
            presence: makeIntField(),
            rarity: makeStringField("Common")
        }
    }

    static migrateData(source) {
        return super.migrateData(source);
    }
}

class currencyDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            quantity: makeIntField(),
            toggleItem: makeBoolField(true),
        }
    }

    static migrateData(source) {
        return super.migrateData(source);
    }
}

class disciplineDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            quantity: makeIntField(1),
            toggleItem: makeBoolField(),
        }
    }

    static migrateData(source) {
        return super.migrateData(source);
    }
}

class mentalPatternDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            description: makeStringField(),
            cost: makeIntField(),
            expand: makeBoolField(),
            toggle: makeBoolField(),
            cancelCost: makeIntField(),
            opposite: makeStringField(),
            penalty: makeIntField(),
        }
    }

    static migrateData(source) {
        return super.migrateData(source);
    }
}

class psychicMatrixDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            description: makeStringField(),
            shortDesc: makeStringField(),
            quantity: makeIntField(1),
            expand: makeBoolField(),
            bonus: makeIntField(),
            level: makeIntField(1),
            action: makeStringField("Active"),
            maint: makeStringField("No"),
            effect20: makeStringField(),
            effect40: makeStringField(),
            effect80: makeStringField(),
            effect120: makeStringField(),
            effect140: makeStringField(),
            effect180: makeStringField(),
            effect240: makeStringField(),
            effect280: makeStringField(),
            effect320: makeStringField(),
            effect440: makeStringField()
        }
    }

    static migrateData(source) {
        return super.migrateData(source);
    }
}

class maintPowerDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            description: makeStringField(),
            value: makeIntField(),
            expand: makeBoolField(),
            equipped: makeBoolField()
        }
    }

    static migrateData(source) {
        return super.migrateData(source);
    }
}

class monsterPowerDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            description: makeStringField(),
            shortDesc: makeStringField(),
            type: makeStringField("other"),
            expand: makeBoolField(),
            cost: makeStringField(),
            gnosis: makeIntField()
        }
    }

    static migrateData(source) {
        return super.migrateData(source);
    }
}

class kiSealCreatureDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            description: makeStringField(),
            level: makeIntField(),
            expand: makeBoolField(),
            minor: new foundry.data.fields.SchemaField({
                wood: makeIntField(),
                metal: makeIntField(),
                air: makeIntField(),
                fire: makeIntField(),
                water: makeIntField()
            }),
            major: new foundry.data.fields.SchemaField({
                wood: makeIntField(),
                metal: makeIntField(),
                air: makeIntField(),
                fire: makeIntField(),
                water: makeIntField()
            })
        }
    }

    static migrateData(source) {
        return super.migrateData(source);
    }
}

class kiTechniqueDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            description: makeStringField(),
            expand: makeBoolField(),
            actor: makeBoolField(),
            level: makeIntField(),
            mk: makeIntField(),
            actionType: makeStringField("attack"),
            frequency: makeStringField("action"),
            use: new foundry.data.fields.SchemaField({
                unified: makeIntField(),
                agi: makeIntField(),
                con: makeIntField(),
                dex: makeIntField(),
                str: makeIntField(),
                pow: makeIntField(),
                wp: makeIntField()
            }),
            maint: new foundry.data.fields.SchemaField({
                unified: makeIntField(),
                agi: makeIntField(),
                con: makeIntField(),
                dex: makeIntField(),
                str: makeIntField(),
                pow: makeIntField(),
                wp: makeIntField()
            })
        }
    }

    static migrateData(source) {
        return super.migrateData(source);
    }
}

class arsMagnusDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            description: makeStringField(),
            expand: makeBoolField(),
            dp: makeIntField(),
            mk: makeIntField()
        }
    }

    static migrateData(source) {
        return super.migrateData(source);
    }
}

class martialArtDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            description: makeStringField(),
            expand: makeBoolField(),
            bonusAtk: makeIntField(),
            bonusDef: makeIntField(),
            bonusDod: makeIntField(),
            dp: makeIntField(),
            mk: makeIntField(),
            degree: makeStringField("base"),
        }
    }

    static migrateData(source) {
        return super.migrateData(source);
    }
}

//Deprecated DataModels since 1.5.0 removing in 1.5.3
class disadvantageDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            description: makeStringField(),
            expand: makeBoolField(),
            benefit: makeIntField()
        }
    }

    static migrateData(source) {
        return super.migrateData(source);
    }
}
class turnMaintDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            description: makeStringField(),
            expand: makeBoolField(),
            zeon: makeIntField(),
            cost: makeIntField(),
            equipped: makeBoolField()
        }
    }

    static migrateData(source) {
        return super.migrateData(source);
    }
}
class dailyMaintDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            description: makeStringField(),
            expand: makeBoolField(),
            zeon: makeIntField(),
            cost: makeIntField(),
            equipped: makeBoolField()
        }
    }

    static migrateData(source) {
        return super.migrateData(source);
    }
}
class armorHelmetDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            description: makeHtmlField(),
            quantity: makeIntField(1),
            quality: makeIntField(),
            presence: makeIntField(),
            fortitude: makeIntField(),
            requirement: makeIntField(),
            natPenalty: makeIntField(),
            equipped: makeBoolField(),
            AT: new foundry.data.fields.SchemaField({
                cut: makeIntField(),
                imp: makeIntField(),
                thr: makeIntField(),
                heat: makeIntField(),
                cold: makeIntField(),
                ele: makeIntField(),
                ene: makeIntField(),
                spt: makeIntField()
            })
        }
    }

    static migrateData(source) {
        return super.migrateData(source);
    }
}
//End of deprecated DataModels


function valueMaxAbility() {
    return new foundry.data.fields.SchemaField({
        value: makeIntField(),
        max: makeIntField()
    })
}

function characteristics() {
    return new foundry.data.fields.SchemaField({
        base: makeIntField(5),
        spec: makeIntField(),
        temp: makeIntField(),
        opposed: makeIntField(),
        opposedBonus: makeIntField(),
        status: makeBoolField()
    })
}

function combatValues() {
    return new foundry.data.fields.SchemaField({
        base: makeIntField(),
        special: makeIntField(),
        temp: makeIntField(),
        status: makeBoolField(),
        bonus: makeIntField()
    })
}

function resistances() {
    return new foundry.data.fields.SchemaField({
        mod: makeIntField(),
        bonus: makeIntField()
    })
}

function secondaryAbilities(label, mod, type, armor) {
    return new foundry.data.fields.SchemaField({
        base: makeIntField(),
        spec: makeIntField(),
        temp: makeIntField(-30),
        nat: makeIntField(),
        natural: makeIntField(),
        bonus: makeIntField(),
        label: makeStringField(label),
        modifier: makeStringField(mod),
        type: makeStringField(type),
        armorPen: makeBoolField(armor),
        fav: makeBoolField(),
        status: makeBoolField()
    })
}

function monsterCharacteristics(type, name) {
    return new foundry.data.fields.SchemaField({
        base: makeIntField(),
        additional: makeIntField(),
        type: makeStringField(type),
        name: makeStringField(name)
    })
}

function summoningAbiities() {
    return new foundry.data.fields.SchemaField({
        base: makeIntField(),
        spec: makeIntField(),
        bonus: makeIntField()
    })
}

function metamagic() {
    return new foundry.data.fields.SchemaField({
        bought: makeBoolField(),
        free: makeBoolField()
    })
}

function kiAbility(num) {
    return new foundry.data.fields.SchemaField({
        status: makeBoolField(),
        status2: makeBoolField(),
        cost: makeIntField(num)
    })
}

function kiPoolAbilities() {
    return new foundry.data.fields.SchemaField({
        spec: makeIntField(),
        specMax: makeIntField(),
        temp: makeIntField(),
        tempMax: makeIntField(),
        default: makeIntField(),
        defaultMax: makeIntField(),
        actual: makeIntField(),
        current: makeIntField(),
        bonus: makeIntField(),
        bonusMax: makeIntField(),
        status: makeBoolField()
    })
}

function kiSealAbilities() {
    return new foundry.data.fields.SchemaField({
        mastery: makeBoolField(),
        mastery2: makeBoolField()
    })
}

function spellDif() {
    return new foundry.data.fields.SchemaField({
        intReq: makeIntField(),
        zeonCost: makeIntField(),
        maint: makeIntField(),
        rollDesc: makeStringField()
    })
}
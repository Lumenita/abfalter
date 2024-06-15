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
import abfalterEffectConfig from "./helpers/abfalterEffectConfig.js";

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

    // Register data models
    CONFIG.Actor.dataModels.character = actorDataModel;

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
    const NEEDS_MIGRATION_VERSION = "1.4.0";

    console.log(currentVersion);

    const needsMigration = !currentVersion || foundry.utils.isNewerVersion(NEEDS_MIGRATION_VERSION, currentVersion);

    console.log(needsMigration);


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

Hooks.on('createActiveEffect', async (activeEffect, _, userId) => {
    let activeType = "attack";
    const arr = [{ activeType }];
    await activeEffect.setFlag('abfalter', 'data.changes', arr);
})

/*
const _preLocalizationRegistrations = {};

function preLocalize(configKeyPath, { key, keys = [], sort = false } = {}) {
    if (key) keys.unshift(key);
    _preLocalizationRegistrations[configKeyPath] = { keys, sort };
}*/



function makeIntField(init = 0, max, min) {
    return new foundry.data.fields.NumberField({
        required: true,
        initial: init,
        min: min,
        max: max,
        integer: true
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
            system: new foundry.data.fields.SchemaField({ //move out of system to info @CHANGE
                bio: makeHtmlField()
            }),
            race: makeStringField(), //bundle all the info together @CHANGE
            class: makeStringField(),
            gender: makeStringField(),
            height: makeStringField(),
            weight: makeStringField(),
            size: makeStringField(),
            age: makeStringField(),
            appearance: makeStringField(),
            experience: makeIntField(), //bundle info partial break
            notesOne: makeStringField(), //bundle all info cont @CHANGE
            notesTwo: makeStringField(),
            destiny: makeIntField(),
            gnosis: makeIntField(), //bundle info end
            levelinfo: new foundry.data.fields.SchemaField({
                levelmod: makeIntField(),
                levelmodBonus: makeIntField(),
                presencemod: makeIntField(),
                presencemodBonus: makeIntField(),
                dpmod: makeIntField(),
                dpmodBonus: makeIntField()
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
                turnMaint: makeBoolField(),
                elan: makeBoolField(),
                class: makeBoolField(),
                secondary: makeBoolField(),
                monsterPowers: makeBoolField()
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
                monsterTab: makeBoolField(),
                effectTab: makeBoolField()
            }),
            lp: valueMaxAbility(),
            shield: valueMaxAbility(),
            unifiedKi: valueMaxAbility(),
            psychicPoint: valueMaxAbility(),
            innatePowerKi: valueMaxAbility(),
            stats: new foundry.data.fields.SchemaField({ //rename stats to characteristics && toLowercase @CHANGE
                Agility: characteristics(),
                Constitution: characteristics(),
                Strength: characteristics(),
                Dexterity: characteristics(),
                Perception: characteristics(),
                Intelligence: characteristics(),
                Power: characteristics(),
                Willpower: characteristics()
            }),
            resistances: new foundry.data.fields.SchemaField({ //to lowercase @CHANGE
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
            combatstats: new foundry.data.fields.SchemaField({ //organize @CHANGE
                atkbase: makeIntField(),
                atkspecial: makeIntField(),
                atktemp: makeIntField(),
                atkbonus: makeIntField(),
                atkStatus: makeBoolField(),
                blkbase: makeIntField(),
                blkspecial: makeIntField(),
                blktemp: makeIntField(),
                blkbonus: makeIntField(),
                blkStatus: makeBoolField(),
                dodbase: makeIntField(),
                dodspecial: makeIntField(),
                dodtemp: makeIntField(),
                dodbonus: makeIntField(),
                dodStatus: makeBoolField()
            }),
            initiative: new foundry.data.fields.SchemaField({
                status: makeBoolField(),
                name: makeStringField(), //useless - delete @CHANGE
                spec: makeIntField(),
                bonus: makeIntField()
            }),
            secondary: new foundry.data.fields.SchemaField({
                main: new foundry.data.fields.SchemaField({
                    athletics: makeBoolField(),
                    social: makeBoolField(),
                    perceptive: makeBoolField(),
                    intellectual: makeBoolField(),
                    vigor: makeBoolField(),
                    subterfuge: makeBoolField(),
                    creative: makeBoolField()
                }),
                acrobatics: secondaryAbilities(),
                athleticism: secondaryAbilities(),
                climb: secondaryAbilities(),
                jump: secondaryAbilities(),
                ride: secondaryAbilities(),
                swim: secondaryAbilities(),
                etiquette: secondaryAbilities(),
                intimidate: secondaryAbilities(),
                leadership: secondaryAbilities(),
                persuasion: secondaryAbilities(),
                streetwise: secondaryAbilities(),
                style: secondaryAbilities(),
                trading: secondaryAbilities(),
                notice: secondaryAbilities(),
                search: secondaryAbilities(),
                track: secondaryAbilities(),
                animals: secondaryAbilities(),
                appraisal: secondaryAbilities(),
                architecture: secondaryAbilities(),
                herballore: secondaryAbilities(),
                history: secondaryAbilities(),
                law: secondaryAbilities(),
                magicappr: secondaryAbilities(),
                medicine: secondaryAbilities(),
                memorize: secondaryAbilities(),
                navigation: secondaryAbilities(),
                occult: secondaryAbilities(),
                science: secondaryAbilities(),
                tactics: secondaryAbilities(),
                composure: secondaryAbilities(),
                featsofstr: secondaryAbilities(),
                withstpain: secondaryAbilities(),
                disguise: secondaryAbilities(),
                hide: secondaryAbilities(),
                lockpicking: secondaryAbilities(),
                poisons: secondaryAbilities(),
                stealth: secondaryAbilities(),
                theft: secondaryAbilities(),
                traplore: secondaryAbilities(),
                alchemy: secondaryAbilities(),
                animism: secondaryAbilities(),
                art: secondaryAbilities(),
                dance: secondaryAbilities(),
                forging: secondaryAbilities(),
                jewelry: secondaryAbilities(),
                music: secondaryAbilities(),
                runes: secondaryAbilities(),
                ritualcalig: secondaryAbilities(),
                slofhand: secondaryAbilities(),
                tailoring: secondaryAbilities(),
                piloting: secondaryAbilities(),
                cooking: secondaryAbilities(),
                technomagic: secondaryAbilities(),
                toymaking: secondaryAbilities(),
                kidetection: secondaryAbilities(),
                kiconceal: secondaryAbilities()
            }),
            aam: makeIntField(), //bundle all aam together @CHANGE
            aamBoon: makeIntField(),
            aamCrit: makeIntField(),
            aamOther: makeIntField(),
            aamBonus: makeIntField(),
            aamStatus: makeBoolField(), //bundle aam end
            monsterChar: new foundry.data.fields.SchemaField({
                agi: monsterCharacteristics("physical"),
                con: monsterCharacteristics("physical"),
                str: monsterCharacteristics("physical"),
                dex: monsterCharacteristics("physical"),
                per: monsterCharacteristics("mental"),
                int: monsterCharacteristics("mental"),
                pow: monsterCharacteristics("mental"),
                wp: monsterCharacteristics("mental")
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
                desc: makeStringField(), //html field?
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
            wearArmor: new foundry.data.fields.SchemaField({
                base: makeIntField(),
                spec: makeIntField(),
                temp: makeIntField(),
                bonus: makeIntField()
            }),
            currency: new foundry.data.fields.SchemaField({
                copper: makeIntField(),
                silver: makeIntField(),
                gold: makeIntField()
            }),
            otherStats: new foundry.data.fields.SchemaField({
                itemPresence: makeIntField(),
                damageBarrier: makeIntField(),
                dmgRdc: makeIntField(),
                artPresence: makeIntField()
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
                status: makeBoolField()
            }),
        }
    }

    static migrateData(source) {
        return super.migrateData(source);
    }

    get type() {
        return 'character'
    }
}

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

function resistances() {
    return new foundry.data.fields.SchemaField({
        mod: makeIntField(),
        bonus: makeIntField()
    })
}

function secondaryAbilities() {
    return new foundry.data.fields.SchemaField({
        base: makeIntField(),
        spec: makeIntField(),
        temp: makeIntField(-30),
        nat: makeIntField(),
        natural: makeIntField(),
        bonus: makeIntField(),
        fav: makeBoolField(),
        status: makeBoolField()
    })
}

function monsterCharacteristics(type) {
    return new foundry.data.fields.SchemaField({
        base: makeIntField(),
        additional: makeIntField(),
        type: makeStringField(type)
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
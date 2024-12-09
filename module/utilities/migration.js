export async function handleMigrations() {
    if (!game.user.isGM) {
        return
    }
    //migrateSecondaryLanguage(); //force update on reload (testing purposes)
    const currentVersion = game.settings.get("abfalter", "systemMigrationVersion");
    
    if (!currentVersion) {
        // If no version is saved, no need to migrate
        return game.settings.set('abfalter', 'systemMigrationVersion', game.system.version)
    }
    // Compatibility warning
    const COMPATIBLE_MIGRATION_VERSION = '1.3';
    if (currentVersion && foundry.utils.isNewerVersion(COMPATIBLE_MIGRATION_VERSION, currentVersion)) {
        const warning =
            'Your ABF Alter system data is too old and cannot be reliably migrated to the latest version. The process will be attempted, but errors may occur.';
        ui.notifications.error(warning, { permanent: true });
    }

    // Define migration tasks
    const migrations = [
        { version: '1.4.2', migrate: migrateDataModels }, // Reorganize all data into data models
        { version: '1.4.4', migrate: migrateSecondaryLanguage }   // Secondary Abilities language fix
    ];

    for (const { version, migrate } of migrations) {
        if (foundry.utils.isNewerVersion(version, currentVersion)) {
            console.log(`Starting migration for version ${version}`);
            await migrate();
        }
    }

    return game.settings.set('abfalter', 'systemMigrationVersion', game.system.version);
}
export async function migrateSecondaryLanguage() {
    for (let actor of game.actors.contents) {
        const updateData = await migrate144Data(actor);
        if (!foundry.utils.isEmpty(updateData)) {
            console.log(`Migrating Actor entity ${actor.name}`);
            await actor.update(updateData);
        }
    }

    for (let scene of game.scenes.contents) {
        let sceneUpdate = migrate144SceneData(scene)
        if (!foundry.utils / foundry.utils.isEmpty(sceneUpdate)) {
            console.log(`Migrating Scene ${scene.name}`);
            await scene.update(sceneUpdate);
        }
    }
    
    for (let pack of game.packs) {
        const packType = pack.metadata.type;
        if (!["Actor", "Scene"].includes(packType)) {
            continue;
        }
        if (["Actor"].includes(packType)) {
            const wasLocked = pack.locked;
            await pack.configure({ locked: false });
    
            await pack.migrate();
            const documents = await pack.getDocuments();
    
            for (let document of documents) {
                const updateData = await migrate144Data(document);
                if (foundry.utils.isEmpty(updateData)) {
                    continue;
                }
                await document.update(updateData);
                console.log(`Migrated ${packType} entity ${document.name} in Compendium ${pack.collection}`);
            }
    
            await pack.configure({ locked: wasLocked });
        }

        if (["Scene"].includes(packType)) {
            const wasLocked = pack.locked;
            await pack.configure({ locked: false });
    
            await pack.migrate();
            const documents = await pack.getDocuments();
    
            for (let document of documents) {
                const updateData = await migrate144Data(document);
                if (foundry.utils.isEmpty(updateData)) {
                    continue;
                }
                await document.update(migrate144SceneData);
                console.log(`Migrated ${packType} entity ${document.name} in Compendium ${pack.collection}`);
            }
    
            await pack.configure({ locked: wasLocked });    
        }
    }
    console.log("Migration Complete for 1.4.4");
}

function migrate144SceneData(scene) {
    const tokens = scene.tokens.map(token => {
        const t = token.toJSON();

        if (!t.actorLink) {
            const actor = foundry.utils.duplicate(t.delta);
            actor.type = t.actor?.type;
            const update = migrate144Data(actor);
            foundry.utils.mergeObject(t.delta, update);
        }
        return t;
    });

    return { tokens };
}

async function migrate144Data() {
    let updateData = {};

    updateData["system.secondaryFields.athletics.acrobatics.label"] = 'acrobatic';
    updateData["system.secondaryFields.athletics.acrobatics.modifier"] = 'agi';
    updateData["system.secondaryFields.athletics.athleticism.label"] = 'athleticism';
    updateData["system.secondaryFields.athletics.athleticism.modifier"] = 'agi';
    updateData["system.secondaryFields.athletics.climb.label"] = 'climb';
    updateData["system.secondaryFields.athletics.climb.modifier"] = 'agi';
    updateData["system.secondaryFields.athletics.jump.label"] = 'jump';
    updateData["system.secondaryFields.athletics.jump.modifier"] = 'str';
    updateData["system.secondaryFields.athletics.piloting.label"] = 'piloting';
    updateData["system.secondaryFields.athletics.piloting.modifier"] = 'dex';
    updateData["system.secondaryFields.athletics.ride.label"] = 'ride';
    updateData["system.secondaryFields.athletics.ride.modifier"] = 'agi';
    updateData["system.secondaryFields.athletics.swim.label"] = 'swim';
    updateData["system.secondaryFields.athletics.swim.modifier"] = 'agi';

    updateData["system.secondaryFields.social.etiquette.label"] = 'etiquette';
    updateData["system.secondaryFields.social.etiquette.modifier"] = 'int';
    updateData["system.secondaryFields.social.intimidate.label"] = 'intimidate';
    updateData["system.secondaryFields.social.intimidate.modifier"] = 'wp';
    updateData["system.secondaryFields.social.leadership.label"] = 'leadership';
    updateData["system.secondaryFields.social.leadership.modifier"] = 'pow';
    updateData["system.secondaryFields.social.persuasion.label"] = 'persuasion';
    updateData["system.secondaryFields.social.persuasion.modifier"] = 'int';
    updateData["system.secondaryFields.social.streetwise.label"] = 'streetwise';
    updateData["system.secondaryFields.social.streetwise.modifier"] = 'int';
    updateData["system.secondaryFields.social.style.label"] = 'style';
    updateData["system.secondaryFields.social.style.modifier"] = 'pow';
    updateData["system.secondaryFields.social.trading.label"] = 'trading';
    updateData["system.secondaryFields.social.trading.modifier"] = 'int';

    updateData["system.secondaryFields.perceptive.kidetection.label"] = 'kiDetection';
    updateData["system.secondaryFields.perceptive.kidetection.modifier"] = 'per';
    updateData["system.secondaryFields.perceptive.notice.label"] = 'notice';
    updateData["system.secondaryFields.perceptive.notice.modifier"] = 'per';   
    updateData["system.secondaryFields.perceptive.search.label"] = 'search';
    updateData["system.secondaryFields.perceptive.search.modifier"] = 'per';
    updateData["system.secondaryFields.perceptive.track.label"] = 'track';
    updateData["system.secondaryFields.perceptive.track.modifier"] = 'per';

    updateData["system.secondaryFields.intellectual.animals.label"] = 'animals';
    updateData["system.secondaryFields.intellectual.animals.modifier"] = 'int';
    updateData["system.secondaryFields.intellectual.appraisal.label"] = 'appraisal';
    updateData["system.secondaryFields.intellectual.appraisal.modifier"] = 'int';  
    updateData["system.secondaryFields.intellectual.architecture.label"] = 'architecture';
    updateData["system.secondaryFields.intellectual.architecture.modifier"] = 'int';
    updateData["system.secondaryFields.intellectual.herballore.label"] = 'herballore';
    updateData["system.secondaryFields.intellectual.herballore.modifier"] = 'int';
    updateData["system.secondaryFields.intellectual.history.label"] = 'history';
    updateData["system.secondaryFields.intellectual.history.modifier"] = 'int';
    updateData["system.secondaryFields.intellectual.law.label"] = 'law';
    updateData["system.secondaryFields.intellectual.law.modifier"] = 'int';
    updateData["system.secondaryFields.intellectual.magicappr.label"] = 'magicAppr';
    updateData["system.secondaryFields.intellectual.magicappr.modifier"] = 'int';
    updateData["system.secondaryFields.intellectual.medicine.label"] = 'medicine';
    updateData["system.secondaryFields.intellectual.medicine.modifier"] = 'int';
    updateData["system.secondaryFields.intellectual.memorize.label"] = 'memorize';
    updateData["system.secondaryFields.intellectual.memorize.modifier"] = 'int';
    updateData["system.secondaryFields.intellectual.navigation.label"] = 'navigation';
    updateData["system.secondaryFields.intellectual.navigation.modifier"] = 'int';
    updateData["system.secondaryFields.intellectual.occult.label"] = 'occult';
    updateData["system.secondaryFields.intellectual.occult.modifier"] = 'int';
    updateData["system.secondaryFields.intellectual.science.label"] = 'science';
    updateData["system.secondaryFields.intellectual.science.modifier"] = 'int';
    updateData["system.secondaryFields.intellectual.tactics.label"] = 'tactics';
    updateData["system.secondaryFields.intellectual.tactics.modifier"] = 'int';
    updateData["system.secondaryFields.intellectual.technomagic.label"] = 'technomagic';
    updateData["system.secondaryFields.intellectual.technomagic.modifier"] = 'int';

    updateData["system.secondaryFields.vigor.composure.label"] = 'composure';
    updateData["system.secondaryFields.vigor.composure.modifier"] = 'wp';
    updateData["system.secondaryFields.vigor.featsofstr.label"] = 'featsofstr';
    updateData["system.secondaryFields.vigor.featsofstr.modifier"] = 'str';
    updateData["system.secondaryFields.vigor.withstpain.label"] = 'withstpain';
    updateData["system.secondaryFields.vigor.withstpain.modifier"] = 'wp';

    updateData["system.secondaryFields.subterfuge.disguise.label"] = 'disguise';
    updateData["system.secondaryFields.subterfuge.disguise.modifier"] = 'dex';
    updateData["system.secondaryFields.subterfuge.hide.label"] = 'hide';
    updateData["system.secondaryFields.subterfuge.hide.modifier"] = 'per';
    updateData["system.secondaryFields.subterfuge.kiconceal.label"] = 'kiconceal';
    updateData["system.secondaryFields.subterfuge.kiconceal.modifier"] = 'per';
    updateData["system.secondaryFields.subterfuge.lockpicking.label"] = 'lockpicking';
    updateData["system.secondaryFields.subterfuge.lockpicking.modifier"] = 'dex';
    updateData["system.secondaryFields.subterfuge.poisons.label"] = 'poisons';
    updateData["system.secondaryFields.subterfuge.poisons.modifier"] = 'int';
    updateData["system.secondaryFields.subterfuge.stealth.label"] = 'stealth';
    updateData["system.secondaryFields.subterfuge.stealth.modifier"] = 'agi';
    updateData["system.secondaryFields.subterfuge.theft.label"] = 'theft';
    updateData["system.secondaryFields.subterfuge.theft.modifier"] = 'dex';
    updateData["system.secondaryFields.subterfuge.traplore.label"] = 'traplore';
    updateData["system.secondaryFields.subterfuge.traplore.modifier"] = 'dex';

    updateData["system.secondaryFields.creative.alchemy.label"] = 'alchemy';
    updateData["system.secondaryFields.creative.alchemy.modifier"] = 'int';
    updateData["system.secondaryFields.creative.animism.label"] = 'animism';
    updateData["system.secondaryFields.creative.animism.modifier"] = 'pow';
    updateData["system.secondaryFields.creative.art.label"] = 'art';
    updateData["system.secondaryFields.creative.art.modifier"] = 'pow';
    updateData["system.secondaryFields.creative.cooking.label"] = 'cooking';
    updateData["system.secondaryFields.creative.cooking.modifier"] = 'pow';
    updateData["system.secondaryFields.creative.dance.label"] = 'dance';
    updateData["system.secondaryFields.creative.dance.modifier"] = 'agi';
    updateData["system.secondaryFields.creative.forging.label"] = 'forging';
    updateData["system.secondaryFields.creative.forging.modifier"] = 'dex';
    updateData["system.secondaryFields.creative.jewelry.label"] = 'jewelry';
    updateData["system.secondaryFields.creative.jewelry.modifier"] = 'dex';
    updateData["system.secondaryFields.creative.toymaking.label"] = 'toymaking';
    updateData["system.secondaryFields.creative.toymaking.modifier"] = 'pow';
    updateData["system.secondaryFields.creative.music.label"] = 'music';
    updateData["system.secondaryFields.creative.music.modifier"] = 'pow';
    updateData["system.secondaryFields.creative.runes.label"] = 'runes';
    updateData["system.secondaryFields.creative.runes.modifier"] = 'dex';
    updateData["system.secondaryFields.creative.ritualcalig.label"] = 'ritualcalig';
    updateData["system.secondaryFields.creative.ritualcalig.modifier"] = 'dex';
    updateData["system.secondaryFields.creative.slofhand.label"] = 'slofhand';
    updateData["system.secondaryFields.creative.slofhand.modifier"] = 'dex';
    updateData["system.secondaryFields.creative.tailoring.label"] = 'tailoring';
    updateData["system.secondaryFields.creative.tailoring.modifier"] = 'dex';

    return updateData;
}

export async function migrateDataModels() {
    for (let actor of game.actors.contents) {
        const updateData = await migrate142Data(actor);
        if (!foundry.utils.isEmpty(updateData)) {
            console.log(`Migrating Actor entity ${actor.name}`);
            await actor.update(updateData);
            //await actor.updateEmbeddedDocuments("Item", updateData);
        }
    }

    for (let scene of game.scenes.contents) {
        let sceneUpdate = migrate142SceneData(scene)
        if (!foundry.utils / foundry.utils.isEmpty(sceneUpdate)) {
            console.log(`Migrating Scene ${scene.name}`);
            await scene.update(sceneUpdate);
        }
    }
    
    for (let pack of game.packs) {
        const packType = pack.metadata.type;
        if (!["Actor", "Scene"].includes(packType)) {
            continue;
        }
        if (["Actor"].includes(packType)) {
            const wasLocked = pack.locked;
            await pack.configure({ locked: false });
    
            await pack.migrate();
            const documents = await pack.getDocuments();
    
            for (let document of documents) {
                const updateData = await migrate142Data(document);
                if (foundry.utils.isEmpty(updateData)) {
                    continue;
                }
                await document.update(updateData);
                console.log(`Migrated ${packType} entity ${document.name} in Compendium ${pack.collection}`);
            }
    
            await pack.configure({ locked: wasLocked });
        }

        if (["Scene"].includes(packType)) {
            const wasLocked = pack.locked;
            await pack.configure({ locked: false });
    
            await pack.migrate();
            const documents = await pack.getDocuments();
    
            for (let document of documents) {
                const updateData = await migrate142Data(document);
                if (foundry.utils.isEmpty(updateData)) {
                    continue;
                }
                await document.update(sceneUpdate);
                console.log(`Migrated ${packType} entity ${document.name} in Compendium ${pack.collection}`);
            }
    
            await pack.configure({ locked: wasLocked });
        }
    }
    console.log("Migration Complete for 1.4.2");
    game.settings.set('abfalter', 'systemMigrationVersion', '1.4.2');
}

function migrate142SceneData(scene) {
    const tokens = scene.tokens.map(token => {
        const t = token.toJSON();

        if (!t.actorLink) {
            const actor = foundry.utils.duplicate(t.delta);
            actor.type = t.actor?.type;
            const update = migrate142Data(actor);
            foundry.utils.mergeObject(t.delta, update);
        }
        return t;
    });

    return { tokens };
}

async function migrate142Data(actor) {
    let updateData = {};

    //Save all old values to new paths
    updateData["system.combatValues.attack.base"] = actor.system.combatstats.atkbase;
    updateData["system.combatValues.attack.special"] = actor.system.combatstats.atkspecial;
    updateData["system.combatValues.attack.temp"] = actor.system.combatstats.atktemp;
    updateData["system.combatValues.attack.status"] = actor.system.combatstats.atkStatus;

    updateData["system.combatValues.block.base"] = actor.system.combatstats.blkbase;
    updateData["system.combatValues.block.special"] = actor.system.combatstats.blkspecial;
    updateData["system.combatValues.block.temp"] = actor.system.combatstats.blktemp;
    updateData["system.combatValues.block.status"] = actor.system.combatstats.blkStatus;

    updateData["system.combatValues.dodge.base"] = actor.system.combatstats.dodbase;
    updateData["system.combatValues.dodge.special"] = actor.system.combatstats.dodspecial;
    updateData["system.combatValues.dodge.temp"] = actor.system.combatstats.dodtemp;
    updateData["system.combatValues.dodge.status"] = actor.system.combatstats.dodStatus;

    if (actor.system.wearArmor) {
    updateData["system.armor.wearArmor.base"] = actor.system.wearArmor.base;
    updateData["system.armor.wearArmor.spec"] = actor.system.wearArmor.spec;
    updateData["system.armor.wearArmor.temp"] = actor.system.wearArmor.temp;
    }
    
    if (actor.system.secondary) {
    updateData["system.secondaryFields.athletics.acrobatics.base"] = actor.system.secondary.acrobatics.base;
    updateData["system.secondaryFields.athletics.acrobatics.spec"] = actor.system.secondary.acrobatics.spec;
    updateData["system.secondaryFields.athletics.acrobatics.temp"] = actor.system.secondary.acrobatics.temp;
    updateData["system.secondaryFields.athletics.acrobatics.nat"] = actor.system.secondary.acrobatics.nat;
    updateData["system.secondaryFields.athletics.acrobatics.natural"] = actor.system.secondary.acrobatics.natural;
    updateData["system.secondaryFields.athletics.acrobatics.fav"] = actor.system.secondary.acrobatics.fav;
    updateData["system.secondaryFields.athletics.acrobatics.status"] = actor.system.secondary.acrobatics.status;

    updateData["system.secondaryFields.athletics.athleticism.base"] = actor.system.secondary.athleticism.base;
    updateData["system.secondaryFields.athletics.athleticism.spec"] = actor.system.secondary.athleticism.spec;
    updateData["system.secondaryFields.athletics.athleticism.temp"] = actor.system.secondary.athleticism.temp;
    updateData["system.secondaryFields.athletics.athleticism.nat"] = actor.system.secondary.athleticism.nat;
    updateData["system.secondaryFields.athletics.athleticism.natural"] = actor.system.secondary.athleticism.natural;
    updateData["system.secondaryFields.athletics.athleticism.fav"] = actor.system.secondary.athleticism.fav;
    updateData["system.secondaryFields.athletics.athleticism.status"] = actor.system.secondary.athleticism.status;

    updateData["system.secondaryFields.athletics.climb.base"] = actor.system.secondary.climb.base;
    updateData["system.secondaryFields.athletics.climb.spec"] = actor.system.secondary.climb.spec;
    updateData["system.secondaryFields.athletics.climb.temp"] = actor.system.secondary.climb.temp;
    updateData["system.secondaryFields.athletics.climb.nat"] = actor.system.secondary.climb.nat;
    updateData["system.secondaryFields.athletics.climb.natural"] = actor.system.secondary.climb.natural;
    updateData["system.secondaryFields.athletics.climb.fav"] = actor.system.secondary.climb.fav;
    updateData["system.secondaryFields.athletics.climb.status"] = actor.system.secondary.climb.status;

    updateData["system.secondaryFields.athletics.jump.base"] = actor.system.secondary.jump.base;
    updateData["system.secondaryFields.athletics.jump.spec"] = actor.system.secondary.jump.spec;
    updateData["system.secondaryFields.athletics.jump.temp"] = actor.system.secondary.jump.temp;
    updateData["system.secondaryFields.athletics.jump.nat"] = actor.system.secondary.jump.nat;
    updateData["system.secondaryFields.athletics.jump.natural"] = actor.system.secondary.jump.natural;
    updateData["system.secondaryFields.athletics.jump.fav"] = actor.system.secondary.jump.fav;
    updateData["system.secondaryFields.athletics.jump.status"] = actor.system.secondary.jump.status;

    updateData["system.secondaryFields.athletics.piloting.base"] = actor.system.secondary.piloting.base;
    updateData["system.secondaryFields.athletics.piloting.spec"] = actor.system.secondary.piloting.spec;
    updateData["system.secondaryFields.athletics.piloting.temp"] = actor.system.secondary.piloting.temp;
    updateData["system.secondaryFields.athletics.piloting.nat"] = actor.system.secondary.piloting.nat;
    updateData["system.secondaryFields.athletics.piloting.natural"] = actor.system.secondary.piloting.natural;
    updateData["system.secondaryFields.athletics.piloting.fav"] = actor.system.secondary.piloting.fav;
    updateData["system.secondaryFields.athletics.piloting.status"] = actor.system.secondary.piloting.status;

    updateData["system.secondaryFields.athletics.ride.base"] = actor.system.secondary.ride.base;
    updateData["system.secondaryFields.athletics.ride.spec"] = actor.system.secondary.ride.spec;
    updateData["system.secondaryFields.athletics.ride.temp"] = actor.system.secondary.ride.temp;
    updateData["system.secondaryFields.athletics.ride.nat"] = actor.system.secondary.ride.nat;
    updateData["system.secondaryFields.athletics.ride.natural"] = actor.system.secondary.ride.natural;
    updateData["system.secondaryFields.athletics.ride.fav"] = actor.system.secondary.ride.fav;
    updateData["system.secondaryFields.athletics.ride.status"] = actor.system.secondary.ride.status;

    updateData["system.secondaryFields.athletics.swim.base"] = actor.system.secondary.swim.base;
    updateData["system.secondaryFields.athletics.swim.spec"] = actor.system.secondary.swim.spec;
    updateData["system.secondaryFields.athletics.swim.temp"] = actor.system.secondary.swim.temp;
    updateData["system.secondaryFields.athletics.swim.nat"] = actor.system.secondary.swim.nat;
    updateData["system.secondaryFields.athletics.swim.natural"] = actor.system.secondary.swim.natural;
    updateData["system.secondaryFields.athletics.swim.fav"] = actor.system.secondary.swim.fav;
    updateData["system.secondaryFields.athletics.swim.status"] = actor.system.secondary.swim.status;

    updateData["system.secondaryFields.social.etiquette.base"] = actor.system.secondary.etiquette.base;
    updateData["system.secondaryFields.social.etiquette.spec"] = actor.system.secondary.etiquette.spec;
    updateData["system.secondaryFields.social.etiquette.temp"] = actor.system.secondary.etiquette.temp;
    updateData["system.secondaryFields.social.etiquette.nat"] = actor.system.secondary.etiquette.nat;
    updateData["system.secondaryFields.social.etiquette.natural"] = actor.system.secondary.etiquette.natural;
    updateData["system.secondaryFields.social.etiquette.fav"] = actor.system.secondary.etiquette.fav;
    updateData["system.secondaryFields.social.etiquette.status"] = actor.system.secondary.etiquette.status;

    updateData["system.secondaryFields.social.intimidate.base"] = actor.system.secondary.intimidate.base;
    updateData["system.secondaryFields.social.intimidate.spec"] = actor.system.secondary.intimidate.spec;
    updateData["system.secondaryFields.social.intimidate.temp"] = actor.system.secondary.intimidate.temp;
    updateData["system.secondaryFields.social.intimidate.nat"] = actor.system.secondary.intimidate.nat;
    updateData["system.secondaryFields.social.intimidate.natural"] = actor.system.secondary.intimidate.natural;
    updateData["system.secondaryFields.social.intimidate.fav"] = actor.system.secondary.intimidate.fav;
    updateData["system.secondaryFields.social.intimidate.status"] = actor.system.secondary.intimidate.status;

    updateData["system.secondaryFields.social.leadership.base"] = actor.system.secondary.leadership.base;
    updateData["system.secondaryFields.social.leadership.spec"] = actor.system.secondary.leadership.spec;
    updateData["system.secondaryFields.social.leadership.temp"] = actor.system.secondary.leadership.temp;
    updateData["system.secondaryFields.social.leadership.nat"] = actor.system.secondary.leadership.nat;
    updateData["system.secondaryFields.social.leadership.natural"] = actor.system.secondary.leadership.natural;
    updateData["system.secondaryFields.social.leadership.fav"] = actor.system.secondary.leadership.fav;
    updateData["system.secondaryFields.social.leadership.status"] = actor.system.secondary.leadership.status;

    updateData["system.secondaryFields.social.persuasion.base"] = actor.system.secondary.persuasion.base;
    updateData["system.secondaryFields.social.persuasion.spec"] = actor.system.secondary.persuasion.spec;
    updateData["system.secondaryFields.social.persuasion.temp"] = actor.system.secondary.persuasion.temp;
    updateData["system.secondaryFields.social.persuasion.nat"] = actor.system.secondary.persuasion.nat;
    updateData["system.secondaryFields.social.persuasion.natural"] = actor.system.secondary.persuasion.natural;
    updateData["system.secondaryFields.social.persuasion.fav"] = actor.system.secondary.persuasion.fav;
    updateData["system.secondaryFields.social.persuasion.status"] = actor.system.secondary.persuasion.status;

    updateData["system.secondaryFields.social.streetwise.base"] = actor.system.secondary.streetwise.base;
    updateData["system.secondaryFields.social.streetwise.spec"] = actor.system.secondary.streetwise.spec;
    updateData["system.secondaryFields.social.streetwise.temp"] = actor.system.secondary.streetwise.temp;
    updateData["system.secondaryFields.social.streetwise.nat"] = actor.system.secondary.streetwise.nat;
    updateData["system.secondaryFields.social.streetwise.natural"] = actor.system.secondary.streetwise.natural;
    updateData["system.secondaryFields.social.streetwise.fav"] = actor.system.secondary.streetwise.fav;
    updateData["system.secondaryFields.social.streetwise.status"] = actor.system.secondary.streetwise.status;

    updateData["system.secondaryFields.social.style.base"] = actor.system.secondary.style.base;
    updateData["system.secondaryFields.social.style.spec"] = actor.system.secondary.style.spec;
    updateData["system.secondaryFields.social.style.temp"] = actor.system.secondary.style.temp;
    updateData["system.secondaryFields.social.style.nat"] = actor.system.secondary.style.nat;
    updateData["system.secondaryFields.social.style.natural"] = actor.system.secondary.style.natural;
    updateData["system.secondaryFields.social.style.fav"] = actor.system.secondary.style.fav;
    updateData["system.secondaryFields.social.style.status"] = actor.system.secondary.style.status;

    updateData["system.secondaryFields.social.trading.base"] = actor.system.secondary.trading.base;
    updateData["system.secondaryFields.social.trading.spec"] = actor.system.secondary.trading.spec;
    updateData["system.secondaryFields.social.trading.temp"] = actor.system.secondary.trading.temp;
    updateData["system.secondaryFields.social.trading.nat"] = actor.system.secondary.trading.nat;
    updateData["system.secondaryFields.social.trading.natural"] = actor.system.secondary.trading.natural;
    updateData["system.secondaryFields.social.trading.fav"] = actor.system.secondary.trading.fav;
    updateData["system.secondaryFields.social.trading.status"] = actor.system.secondary.trading.status;

    updateData["system.secondaryFields.perceptive.notice.base"] = actor.system.secondary.notice.base;
    updateData["system.secondaryFields.perceptive.notice.spec"] = actor.system.secondary.notice.spec;
    updateData["system.secondaryFields.perceptive.notice.temp"] = actor.system.secondary.notice.temp;
    updateData["system.secondaryFields.perceptive.notice.nat"] = actor.system.secondary.notice.nat;
    updateData["system.secondaryFields.perceptive.notice.natural"] = actor.system.secondary.notice.natural;
    updateData["system.secondaryFields.perceptive.notice.fav"] = actor.system.secondary.notice.fav;
    updateData["system.secondaryFields.perceptive.notice.status"] = actor.system.secondary.notice.status;

    updateData["system.secondaryFields.perceptive.search.base"] = actor.system.secondary.search.base;
    updateData["system.secondaryFields.perceptive.search.spec"] = actor.system.secondary.search.spec;
    updateData["system.secondaryFields.perceptive.search.temp"] = actor.system.secondary.search.temp;
    updateData["system.secondaryFields.perceptive.search.nat"] = actor.system.secondary.search.nat;
    updateData["system.secondaryFields.perceptive.search.natural"] = actor.system.secondary.search.natural;
    updateData["system.secondaryFields.perceptive.search.fav"] = actor.system.secondary.search.fav;
    updateData["system.secondaryFields.perceptive.search.status"] = actor.system.secondary.search.status;

    updateData["system.secondaryFields.perceptive.track.base"] = actor.system.secondary.track.base;
    updateData["system.secondaryFields.perceptive.track.spec"] = actor.system.secondary.track.spec;
    updateData["system.secondaryFields.perceptive.track.temp"] = actor.system.secondary.track.temp;
    updateData["system.secondaryFields.perceptive.track.nat"] = actor.system.secondary.track.nat;
    updateData["system.secondaryFields.perceptive.track.natural"] = actor.system.secondary.track.natural;
    updateData["system.secondaryFields.perceptive.track.fav"] = actor.system.secondary.track.fav;
    updateData["system.secondaryFields.perceptive.track.status"] = actor.system.secondary.track.status;

    updateData["system.secondaryFields.intellectual.animals.base"] = actor.system.secondary.animals.base;
    updateData["system.secondaryFields.intellectual.animals.spec"] = actor.system.secondary.animals.spec;
    updateData["system.secondaryFields.intellectual.animals.temp"] = actor.system.secondary.animals.temp;
    updateData["system.secondaryFields.intellectual.animals.nat"] = actor.system.secondary.animals.nat;
    updateData["system.secondaryFields.intellectual.animals.natural"] = actor.system.secondary.animals.natural;
    updateData["system.secondaryFields.intellectual.animals.fav"] = actor.system.secondary.animals.fav;
    updateData["system.secondaryFields.intellectual.animals.status"] = actor.system.secondary.animals.status;

    updateData["system.secondaryFields.intellectual.appraisal.base"] = actor.system.secondary.appraisal.base;
    updateData["system.secondaryFields.intellectual.appraisal.spec"] = actor.system.secondary.appraisal.spec;
    updateData["system.secondaryFields.intellectual.appraisal.temp"] = actor.system.secondary.appraisal.temp;
    updateData["system.secondaryFields.intellectual.appraisal.nat"] = actor.system.secondary.appraisal.nat;
    updateData["system.secondaryFields.intellectual.appraisal.natural"] = actor.system.secondary.appraisal.natural;
    updateData["system.secondaryFields.intellectual.appraisal.fav"] = actor.system.secondary.appraisal.fav;
    updateData["system.secondaryFields.intellectual.appraisal.status"] = actor.system.secondary.appraisal.status;

    updateData["system.secondaryFields.intellectual.architecture.base"] = actor.system.secondary.architecture.base;
    updateData["system.secondaryFields.intellectual.architecture.spec"] = actor.system.secondary.architecture.spec;
    updateData["system.secondaryFields.intellectual.architecture.temp"] = actor.system.secondary.architecture.temp;
    updateData["system.secondaryFields.intellectual.architecture.nat"] = actor.system.secondary.architecture.nat;
    updateData["system.secondaryFields.intellectual.architecture.natural"] = actor.system.secondary.architecture.natural;
    updateData["system.secondaryFields.intellectual.architecture.fav"] = actor.system.secondary.architecture.fav;
    updateData["system.secondaryFields.intellectual.architecture.status"] = actor.system.secondary.architecture.status;

    updateData["system.secondaryFields.intellectual.herballore.base"] = actor.system.secondary.herballore.base;
    updateData["system.secondaryFields.intellectual.herballore.spec"] = actor.system.secondary.herballore.spec;
    updateData["system.secondaryFields.intellectual.herballore.temp"] = actor.system.secondary.herballore.temp;
    updateData["system.secondaryFields.intellectual.herballore.nat"] = actor.system.secondary.herballore.nat;
    updateData["system.secondaryFields.intellectual.herballore.natural"] = actor.system.secondary.herballore.natural;
    updateData["system.secondaryFields.intellectual.herballore.fav"] = actor.system.secondary.herballore.fav;
    updateData["system.secondaryFields.intellectual.herballore.status"] = actor.system.secondary.herballore.status;

    updateData["system.secondaryFields.intellectual.history.base"] = actor.system.secondary.history.base;
    updateData["system.secondaryFields.intellectual.history.spec"] = actor.system.secondary.history.spec;
    updateData["system.secondaryFields.intellectual.history.temp"] = actor.system.secondary.history.temp;
    updateData["system.secondaryFields.intellectual.history.nat"] = actor.system.secondary.history.nat;
    updateData["system.secondaryFields.intellectual.history.natural"] = actor.system.secondary.history.natural;
    updateData["system.secondaryFields.intellectual.history.fav"] = actor.system.secondary.history.fav;
    updateData["system.secondaryFields.intellectual.history.status"] = actor.system.secondary.history.status;

    updateData["system.secondaryFields.intellectual.law.base"] = actor.system.secondary.law.base;
    updateData["system.secondaryFields.intellectual.law.spec"] = actor.system.secondary.law.spec;
    updateData["system.secondaryFields.intellectual.law.temp"] = actor.system.secondary.law.temp;
    updateData["system.secondaryFields.intellectual.law.nat"] = actor.system.secondary.law.nat;
    updateData["system.secondaryFields.intellectual.law.natural"] = actor.system.secondary.law.natural;
    updateData["system.secondaryFields.intellectual.law.fav"] = actor.system.secondary.law.fav;
    updateData["system.secondaryFields.intellectual.law.status"] = actor.system.secondary.law.status;

    updateData["system.secondaryFields.intellectual.magicappr.base"] = actor.system.secondary.magicappr.base;
    updateData["system.secondaryFields.intellectual.magicappr.spec"] = actor.system.secondary.magicappr.spec;
    updateData["system.secondaryFields.intellectual.magicappr.temp"] = actor.system.secondary.magicappr.temp;
    updateData["system.secondaryFields.intellectual.magicappr.nat"] = actor.system.secondary.magicappr.nat;
    updateData["system.secondaryFields.intellectual.magicappr.natural"] = actor.system.secondary.magicappr.natural;
    updateData["system.secondaryFields.intellectual.magicappr.fav"] = actor.system.secondary.magicappr.fav;
    updateData["system.secondaryFields.intellectual.magicappr.status"] = actor.system.secondary.magicappr.status;

    updateData["system.secondaryFields.intellectual.medicine.base"] = actor.system.secondary.medicine.base;
    updateData["system.secondaryFields.intellectual.medicine.spec"] = actor.system.secondary.medicine.spec;
    updateData["system.secondaryFields.intellectual.medicine.temp"] = actor.system.secondary.medicine.temp;
    updateData["system.secondaryFields.intellectual.medicine.nat"] = actor.system.secondary.medicine.nat;
    updateData["system.secondaryFields.intellectual.medicine.natural"] = actor.system.secondary.medicine.natural;
    updateData["system.secondaryFields.intellectual.medicine.fav"] = actor.system.secondary.medicine.fav;
    updateData["system.secondaryFields.intellectual.medicine.status"] = actor.system.secondary.medicine.status;

    updateData["system.secondaryFields.intellectual.memorize.base"] = actor.system.secondary.memorize.base;
    updateData["system.secondaryFields.intellectual.memorize.spec"] = actor.system.secondary.memorize.spec;
    updateData["system.secondaryFields.intellectual.memorize.temp"] = actor.system.secondary.memorize.temp;
    updateData["system.secondaryFields.intellectual.memorize.nat"] = actor.system.secondary.memorize.nat;
    updateData["system.secondaryFields.intellectual.memorize.natural"] = actor.system.secondary.memorize.natural;
    updateData["system.secondaryFields.intellectual.memorize.fav"] = actor.system.secondary.memorize.fav;
    updateData["system.secondaryFields.intellectual.memorize.status"] = actor.system.secondary.memorize.status;

    updateData["system.secondaryFields.intellectual.navigation.base"] = actor.system.secondary.navigation.base;
    updateData["system.secondaryFields.intellectual.navigation.spec"] = actor.system.secondary.navigation.spec;
    updateData["system.secondaryFields.intellectual.navigation.temp"] = actor.system.secondary.navigation.temp;
    updateData["system.secondaryFields.intellectual.navigation.nat"] = actor.system.secondary.navigation.nat;
    updateData["system.secondaryFields.intellectual.navigation.natural"] = actor.system.secondary.navigation.natural;
    updateData["system.secondaryFields.intellectual.navigation.fav"] = actor.system.secondary.navigation.fav;
    updateData["system.secondaryFields.intellectual.navigation.status"] = actor.system.secondary.navigation.status;

    updateData["system.secondaryFields.intellectual.occult.base"] = actor.system.secondary.occult.base;
    updateData["system.secondaryFields.intellectual.occult.spec"] = actor.system.secondary.occult.spec;
    updateData["system.secondaryFields.intellectual.occult.temp"] = actor.system.secondary.occult.temp;
    updateData["system.secondaryFields.intellectual.occult.nat"] = actor.system.secondary.occult.nat;
    updateData["system.secondaryFields.intellectual.occult.natural"] = actor.system.secondary.occult.natural;
    updateData["system.secondaryFields.intellectual.occult.fav"] = actor.system.secondary.occult.fav;
    updateData["system.secondaryFields.intellectual.occult.status"] = actor.system.secondary.occult.status;

    updateData["system.secondaryFields.intellectual.science.base"] = actor.system.secondary.science.base;
    updateData["system.secondaryFields.intellectual.science.spec"] = actor.system.secondary.science.spec;
    updateData["system.secondaryFields.intellectual.science.temp"] = actor.system.secondary.science.temp;
    updateData["system.secondaryFields.intellectual.science.nat"] = actor.system.secondary.science.nat;
    updateData["system.secondaryFields.intellectual.science.natural"] = actor.system.secondary.science.natural;
    updateData["system.secondaryFields.intellectual.science.fav"] = actor.system.secondary.science.fav;
    updateData["system.secondaryFields.intellectual.science.status"] = actor.system.secondary.science.status;

    updateData["system.secondaryFields.intellectual.tactics.base"] = actor.system.secondary.tactics.base;
    updateData["system.secondaryFields.intellectual.tactics.spec"] = actor.system.secondary.tactics.spec;
    updateData["system.secondaryFields.intellectual.tactics.temp"] = actor.system.secondary.tactics.temp;
    updateData["system.secondaryFields.intellectual.tactics.nat"] = actor.system.secondary.tactics.nat;
    updateData["system.secondaryFields.intellectual.tactics.natural"] = actor.system.secondary.tactics.natural;
    updateData["system.secondaryFields.intellectual.tactics.fav"] = actor.system.secondary.tactics.fav;
    updateData["system.secondaryFields.intellectual.tactics.status"] = actor.system.secondary.tactics.status;

    updateData["system.secondaryFields.intellectual.technomagic.base"] = actor.system.secondary.technomagic.base;
    updateData["system.secondaryFields.intellectual.technomagic.spec"] = actor.system.secondary.technomagic.spec;
    updateData["system.secondaryFields.intellectual.technomagic.temp"] = actor.system.secondary.technomagic.temp;
    updateData["system.secondaryFields.intellectual.technomagic.nat"] = actor.system.secondary.technomagic.nat;
    updateData["system.secondaryFields.intellectual.technomagic.natural"] = actor.system.secondary.technomagic.natural;
    updateData["system.secondaryFields.intellectual.technomagic.fav"] = actor.system.secondary.technomagic.fav;
    updateData["system.secondaryFields.intellectual.technomagic.status"] = actor.system.secondary.technomagic.status;

    updateData["system.secondaryFields.vigor.composure.base"] = actor.system.secondary.composure.base;
    updateData["system.secondaryFields.vigor.composure.spec"] = actor.system.secondary.composure.spec;
    updateData["system.secondaryFields.vigor.composure.temp"] = actor.system.secondary.composure.temp;
    updateData["system.secondaryFields.vigor.composure.nat"] = actor.system.secondary.composure.nat;
    updateData["system.secondaryFields.vigor.composure.natural"] = actor.system.secondary.composure.natural;
    updateData["system.secondaryFields.vigor.composure.fav"] = actor.system.secondary.composure.fav;
    updateData["system.secondaryFields.vigor.composure.status"] = actor.system.secondary.composure.status;

    updateData["system.secondaryFields.vigor.featsofstr.base"] = actor.system.secondary.featsofstr.base;
    updateData["system.secondaryFields.vigor.featsofstr.spec"] = actor.system.secondary.featsofstr.spec;
    updateData["system.secondaryFields.vigor.featsofstr.temp"] = actor.system.secondary.featsofstr.temp;
    updateData["system.secondaryFields.vigor.featsofstr.nat"] = actor.system.secondary.featsofstr.nat;
    updateData["system.secondaryFields.vigor.featsofstr.natural"] = actor.system.secondary.featsofstr.natural;
    updateData["system.secondaryFields.vigor.featsofstr.fav"] = actor.system.secondary.featsofstr.fav;
    updateData["system.secondaryFields.vigor.featsofstr.status"] = actor.system.secondary.featsofstr.status;

    updateData["system.secondaryFields.vigor.withstpain.base"] = actor.system.secondary.withstpain.base;
    updateData["system.secondaryFields.vigor.withstpain.spec"] = actor.system.secondary.withstpain.spec;
    updateData["system.secondaryFields.vigor.withstpain.temp"] = actor.system.secondary.withstpain.temp;
    updateData["system.secondaryFields.vigor.withstpain.nat"] = actor.system.secondary.withstpain.nat;
    updateData["system.secondaryFields.vigor.withstpain.natural"] = actor.system.secondary.withstpain.natural;
    updateData["system.secondaryFields.vigor.withstpain.fav"] = actor.system.secondary.withstpain.fav;
    updateData["system.secondaryFields.vigor.withstpain.status"] = actor.system.secondary.withstpain.status;

    updateData["system.secondaryFields.subterfuge.disguise.base"] = actor.system.secondary.disguise.base;
    updateData["system.secondaryFields.subterfuge.disguise.spec"] = actor.system.secondary.disguise.spec;
    updateData["system.secondaryFields.subterfuge.disguise.temp"] = actor.system.secondary.disguise.temp;
    updateData["system.secondaryFields.subterfuge.disguise.nat"] = actor.system.secondary.disguise.nat;
    updateData["system.secondaryFields.subterfuge.disguise.natural"] = actor.system.secondary.disguise.natural;
    updateData["system.secondaryFields.subterfuge.disguise.fav"] = actor.system.secondary.disguise.fav;
    updateData["system.secondaryFields.subterfuge.disguise.status"] = actor.system.secondary.disguise.status;

    updateData["system.secondaryFields.subterfuge.hide.base"] = actor.system.secondary.hide.base;
    updateData["system.secondaryFields.subterfuge.hide.spec"] = actor.system.secondary.hide.spec;
    updateData["system.secondaryFields.subterfuge.hide.temp"] = actor.system.secondary.hide.temp;
    updateData["system.secondaryFields.subterfuge.hide.nat"] = actor.system.secondary.hide.nat;
    updateData["system.secondaryFields.subterfuge.hide.natural"] = actor.system.secondary.hide.natural;
    updateData["system.secondaryFields.subterfuge.hide.fav"] = actor.system.secondary.hide.fav;
    updateData["system.secondaryFields.subterfuge.hide.status"] = actor.system.secondary.hide.status;

    updateData["system.secondaryFields.subterfuge.lockpicking.base"] = actor.system.secondary.lockpicking.base;
    updateData["system.secondaryFields.subterfuge.lockpicking.spec"] = actor.system.secondary.lockpicking.spec;
    updateData["system.secondaryFields.subterfuge.lockpicking.temp"] = actor.system.secondary.lockpicking.temp;
    updateData["system.secondaryFields.subterfuge.lockpicking.nat"] = actor.system.secondary.lockpicking.nat;
    updateData["system.secondaryFields.subterfuge.lockpicking.natural"] = actor.system.secondary.lockpicking.natural;
    updateData["system.secondaryFields.subterfuge.lockpicking.fav"] = actor.system.secondary.lockpicking.fav;
    updateData["system.secondaryFields.subterfuge.lockpicking.status"] = actor.system.secondary.lockpicking.status;

    updateData["system.secondaryFields.subterfuge.poisons.base"] = actor.system.secondary.poisons.base;
    updateData["system.secondaryFields.subterfuge.poisons.spec"] = actor.system.secondary.poisons.spec;
    updateData["system.secondaryFields.subterfuge.poisons.temp"] = actor.system.secondary.poisons.temp;
    updateData["system.secondaryFields.subterfuge.poisons.nat"] = actor.system.secondary.poisons.nat;
    updateData["system.secondaryFields.subterfuge.poisons.natural"] = actor.system.secondary.poisons.natural;
    updateData["system.secondaryFields.subterfuge.poisons.fav"] = actor.system.secondary.poisons.fav;
    updateData["system.secondaryFields.subterfuge.poisons.status"] = actor.system.secondary.poisons.status;

    updateData["system.secondaryFields.subterfuge.stealth.base"] = actor.system.secondary.stealth.base;
    updateData["system.secondaryFields.subterfuge.stealth.spec"] = actor.system.secondary.stealth.spec;
    updateData["system.secondaryFields.subterfuge.stealth.temp"] = actor.system.secondary.stealth.temp;
    updateData["system.secondaryFields.subterfuge.stealth.nat"] = actor.system.secondary.stealth.nat;
    updateData["system.secondaryFields.subterfuge.stealth.natural"] = actor.system.secondary.stealth.natural;
    updateData["system.secondaryFields.subterfuge.stealth.fav"] = actor.system.secondary.stealth.fav;
    updateData["system.secondaryFields.subterfuge.stealth.status"] = actor.system.secondary.stealth.status;

    updateData["system.secondaryFields.subterfuge.theft.base"] = actor.system.secondary.theft.base;
    updateData["system.secondaryFields.subterfuge.theft.spec"] = actor.system.secondary.theft.spec;
    updateData["system.secondaryFields.subterfuge.theft.temp"] = actor.system.secondary.theft.temp;
    updateData["system.secondaryFields.subterfuge.theft.nat"] = actor.system.secondary.theft.nat;
    updateData["system.secondaryFields.subterfuge.theft.natural"] = actor.system.secondary.theft.natural;
    updateData["system.secondaryFields.subterfuge.theft.fav"] = actor.system.secondary.theft.fav;
    updateData["system.secondaryFields.subterfuge.theft.status"] = actor.system.secondary.theft.status;

    updateData["system.secondaryFields.subterfuge.traplore.base"] = actor.system.secondary.traplore.base;
    updateData["system.secondaryFields.subterfuge.traplore.spec"] = actor.system.secondary.traplore.spec;
    updateData["system.secondaryFields.subterfuge.traplore.temp"] = actor.system.secondary.traplore.temp;
    updateData["system.secondaryFields.subterfuge.traplore.nat"] = actor.system.secondary.traplore.nat;
    updateData["system.secondaryFields.subterfuge.traplore.natural"] = actor.system.secondary.traplore.natural;
    updateData["system.secondaryFields.subterfuge.traplore.fav"] = actor.system.secondary.traplore.fav;
    updateData["system.secondaryFields.subterfuge.traplore.status"] = actor.system.secondary.traplore.status;

    updateData["system.secondaryFields.creative.alchemy.base"] = actor.system.secondary.alchemy.base;
    updateData["system.secondaryFields.creative.alchemy.spec"] = actor.system.secondary.alchemy.spec;
    updateData["system.secondaryFields.creative.alchemy.temp"] = actor.system.secondary.alchemy.temp;
    updateData["system.secondaryFields.creative.alchemy.nat"] = actor.system.secondary.alchemy.nat;
    updateData["system.secondaryFields.creative.alchemy.natural"] = actor.system.secondary.alchemy.natural;
    updateData["system.secondaryFields.creative.alchemy.fav"] = actor.system.secondary.alchemy.fav;
    updateData["system.secondaryFields.creative.alchemy.status"] = actor.system.secondary.alchemy.status;

    updateData["system.secondaryFields.creative.animism.base"] = actor.system.secondary.animism.base;
    updateData["system.secondaryFields.creative.animism.spec"] = actor.system.secondary.animism.spec;
    updateData["system.secondaryFields.creative.animism.temp"] = actor.system.secondary.animism.temp;
    updateData["system.secondaryFields.creative.animism.nat"] = actor.system.secondary.animism.nat;
    updateData["system.secondaryFields.creative.animism.natural"] = actor.system.secondary.animism.natural;
    updateData["system.secondaryFields.creative.animism.fav"] = actor.system.secondary.animism.fav;
    updateData["system.secondaryFields.creative.animism.status"] = actor.system.secondary.animism.status;

    updateData["system.secondaryFields.creative.art.base"] = actor.system.secondary.art.base;
    updateData["system.secondaryFields.creative.art.spec"] = actor.system.secondary.art.spec;
    updateData["system.secondaryFields.creative.art.temp"] = actor.system.secondary.art.temp;
    updateData["system.secondaryFields.creative.art.nat"] = actor.system.secondary.art.nat;
    updateData["system.secondaryFields.creative.art.natural"] = actor.system.secondary.art.natural;
    updateData["system.secondaryFields.creative.art.fav"] = actor.system.secondary.art.fav;
    updateData["system.secondaryFields.creative.art.status"] = actor.system.secondary.art.status;

    updateData["system.secondaryFields.creative.cooking.base"] = actor.system.secondary.cooking.base;
    updateData["system.secondaryFields.creative.cooking.spec"] = actor.system.secondary.cooking.spec;
    updateData["system.secondaryFields.creative.cooking.temp"] = actor.system.secondary.cooking.temp;
    updateData["system.secondaryFields.creative.cooking.nat"] = actor.system.secondary.cooking.nat;
    updateData["system.secondaryFields.creative.cooking.natural"] = actor.system.secondary.cooking.natural;
    updateData["system.secondaryFields.creative.cooking.fav"] = actor.system.secondary.cooking.fav;
    updateData["system.secondaryFields.creative.cooking.status"] = actor.system.secondary.cooking.status;

    updateData["system.secondaryFields.creative.dance.base"] = actor.system.secondary.dance.base;
    updateData["system.secondaryFields.creative.dance.spec"] = actor.system.secondary.dance.spec;
    updateData["system.secondaryFields.creative.dance.temp"] = actor.system.secondary.dance.temp;
    updateData["system.secondaryFields.creative.dance.nat"] = actor.system.secondary.dance.nat;
    updateData["system.secondaryFields.creative.dance.natural"] = actor.system.secondary.dance.natural;
    updateData["system.secondaryFields.creative.dance.fav"] = actor.system.secondary.dance.fav;
    updateData["system.secondaryFields.creative.dance.status"] = actor.system.secondary.dance.status;

    updateData["system.secondaryFields.creative.forging.base"] = actor.system.secondary.forging.base;
    updateData["system.secondaryFields.creative.forging.spec"] = actor.system.secondary.forging.spec;
    updateData["system.secondaryFields.creative.forging.temp"] = actor.system.secondary.forging.temp;
    updateData["system.secondaryFields.creative.forging.nat"] = actor.system.secondary.forging.nat;
    updateData["system.secondaryFields.creative.forging.natural"] = actor.system.secondary.forging.natural;
    updateData["system.secondaryFields.creative.forging.fav"] = actor.system.secondary.forging.fav;
    updateData["system.secondaryFields.creative.forging.status"] = actor.system.secondary.forging.status;

    updateData["system.secondaryFields.creative.jewelry.base"] = actor.system.secondary.jewelry.base;
    updateData["system.secondaryFields.creative.jewelry.spec"] = actor.system.secondary.jewelry.spec;
    updateData["system.secondaryFields.creative.jewelry.temp"] = actor.system.secondary.jewelry.temp;
    updateData["system.secondaryFields.creative.jewelry.nat"] = actor.system.secondary.jewelry.nat;
    updateData["system.secondaryFields.creative.jewelry.natural"] = actor.system.secondary.jewelry.natural;
    updateData["system.secondaryFields.creative.jewelry.fav"] = actor.system.secondary.jewelry.fav;
    updateData["system.secondaryFields.creative.jewelry.status"] = actor.system.secondary.jewelry.status;

    updateData["system.secondaryFields.creative.toymaking.base"] = actor.system.secondary.toymaking.base;
    updateData["system.secondaryFields.creative.toymaking.spec"] = actor.system.secondary.toymaking.spec;
    updateData["system.secondaryFields.creative.toymaking.temp"] = actor.system.secondary.toymaking.temp;
    updateData["system.secondaryFields.creative.toymaking.nat"] = actor.system.secondary.toymaking.nat;
    updateData["system.secondaryFields.creative.toymaking.natural"] = actor.system.secondary.toymaking.natural;
    updateData["system.secondaryFields.creative.toymaking.fav"] = actor.system.secondary.toymaking.fav;
    updateData["system.secondaryFields.creative.toymaking.status"] = actor.system.secondary.toymaking.status;

    updateData["system.secondaryFields.creative.music.base"] = actor.system.secondary.music.base;
    updateData["system.secondaryFields.creative.music.spec"] = actor.system.secondary.music.spec;
    updateData["system.secondaryFields.creative.music.temp"] = actor.system.secondary.music.temp;
    updateData["system.secondaryFields.creative.music.nat"] = actor.system.secondary.music.nat;
    updateData["system.secondaryFields.creative.music.natural"] = actor.system.secondary.music.natural;
    updateData["system.secondaryFields.creative.music.fav"] = actor.system.secondary.music.fav;
    updateData["system.secondaryFields.creative.music.status"] = actor.system.secondary.music.status;

    updateData["system.secondaryFields.creative.runes.base"] = actor.system.secondary.runes.base;
    updateData["system.secondaryFields.creative.runes.spec"] = actor.system.secondary.runes.spec;
    updateData["system.secondaryFields.creative.runes.temp"] = actor.system.secondary.runes.temp;
    updateData["system.secondaryFields.creative.runes.nat"] = actor.system.secondary.runes.nat;
    updateData["system.secondaryFields.creative.runes.natural"] = actor.system.secondary.runes.natural;
    updateData["system.secondaryFields.creative.runes.fav"] = actor.system.secondary.runes.fav;
    updateData["system.secondaryFields.creative.runes.status"] = actor.system.secondary.runes.status;

    updateData["system.secondaryFields.creative.ritualcalig.base"] = actor.system.secondary.ritualcalig.base;
    updateData["system.secondaryFields.creative.ritualcalig.spec"] = actor.system.secondary.ritualcalig.spec;
    updateData["system.secondaryFields.creative.ritualcalig.temp"] = actor.system.secondary.ritualcalig.temp;
    updateData["system.secondaryFields.creative.ritualcalig.nat"] = actor.system.secondary.ritualcalig.nat;
    updateData["system.secondaryFields.creative.ritualcalig.natural"] = actor.system.secondary.ritualcalig.natural;
    updateData["system.secondaryFields.creative.ritualcalig.fav"] = actor.system.secondary.ritualcalig.fav;
    updateData["system.secondaryFields.creative.ritualcalig.status"] = actor.system.secondary.ritualcalig.status;

    updateData["system.secondaryFields.creative.slofhand.base"] = actor.system.secondary.slofhand.base;
    updateData["system.secondaryFields.creative.slofhand.spec"] = actor.system.secondary.slofhand.spec;
    updateData["system.secondaryFields.creative.slofhand.temp"] = actor.system.secondary.slofhand.temp;
    updateData["system.secondaryFields.creative.slofhand.nat"] = actor.system.secondary.slofhand.nat;
    updateData["system.secondaryFields.creative.slofhand.natural"] = actor.system.secondary.slofhand.natural;
    updateData["system.secondaryFields.creative.slofhand.fav"] = actor.system.secondary.slofhand.fav;
    updateData["system.secondaryFields.creative.slofhand.status"] = actor.system.secondary.slofhand.status;

    updateData["system.secondaryFields.creative.tailoring.base"] = actor.system.secondary.tailoring.base;
    updateData["system.secondaryFields.creative.tailoring.spec"] = actor.system.secondary.tailoring.spec;
    updateData["system.secondaryFields.creative.tailoring.temp"] = actor.system.secondary.tailoring.temp;
    updateData["system.secondaryFields.creative.tailoring.nat"] = actor.system.secondary.tailoring.nat;
    updateData["system.secondaryFields.creative.tailoring.natural"] = actor.system.secondary.tailoring.natural;
    updateData["system.secondaryFields.creative.tailoring.fav"] = actor.system.secondary.tailoring.fav;
    updateData["system.secondaryFields.creative.tailoring.status"] = actor.system.secondary.tailoring.status;

    updateData["system.secondaryFields.category.athletics"] = actor.system.secondary.main.athletics;
    updateData["system.secondaryFields.category.social"] = actor.system.secondary.main.social;
    updateData["system.secondaryFields.category.perceptive"] = actor.system.secondary.main.perceptive;
    updateData["system.secondaryFields.category.intellectual"] = actor.system.secondary.main.intellectual;
    updateData["system.secondaryFields.category.vigor"] = actor.system.secondary.main.vigor;
    updateData["system.secondaryFields.category.subterfuge"] = actor.system.secondary.main.subterfuge;
    updateData["system.secondaryFields.category.creative"] = actor.system.secondary.main.creative;
    }
    updateData["system.info.race"] = actor.system.race;
    updateData["system.info.class"] = actor.system.class;
    updateData["system.info.gender"] = actor.system.gender;
    updateData["system.info.height"] = actor.system.height;
    updateData["system.info.weight"] = actor.system.weight;
    updateData["system.info.age"] = actor.system.age;
    updateData["system.info.size"] = actor.system.size;
    updateData["system.info.appearance"] = actor.system.appearance;
    updateData["system.info.notesOne"] = actor.system.notesOne;
    updateData["system.info.notesTwo"] = actor.system.notesTwo;
    updateData["system.info.destiny"] = actor.system.destiny;
    updateData["system.info.gnosis"] = actor.system.gnosis;
    if (actor.system.system) {
    updateData["system.info.bio"] = actor.system.system.bio;
    }
    updateData["system.levelinfo.experience"] = actor.system.experience;

    updateData["system.aamField.base"] = actor.system.aam;
    updateData["system.aamField.boon"] = actor.system.aamBoon;
    updateData["system.aamField.crit"] = actor.system.aamCrit;

    return updateData;
    /*
    const updates = [];
    for (const item of actor.items) if (item.type === "monsterPower") {
        let newType = "";
        switch (item.system.type) {
            case "":
            case "other":
                newType = "other";
                break;
            case "1":
            case "essential":
                newType = "essential";
                break;
            case "2":
            case "disadv":
                newType = "disadv";
                break;
            case "3":
            case "combat":
                newType = "combat";
                break;
            case "4":
            case "defense":
                newType = "defense";
                break;
            case "5":
            case "misc":
                newType = "misc";
                break;
            case "6":
            case "divine":
                newType = "divine";
                break;
            default:
                newType = "other";
                break;
        }
        item.system.type = newType;

        // Collect the updates
        updates.push({ _id: item.id, 'system.type': newType });
    }
        return updates;
    */

}


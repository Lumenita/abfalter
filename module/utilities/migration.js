export async function handleMigrations() {
    if (!game.user.isGM) return;

    const migrationStart = 'Migration in progress. Please wait until it completes before using the system.';
    const migrationEnd = 'Migration has finished. You can now use the system.';

    const COMPATIBLE_MIGRATION_VERSION = '1.4.3';

    // --- Show Non-Closable Dialog ---
    let migrationDialog;
    const showMigrationDialog = () => {
        migrationDialog = new Dialog({
            title: "System Migration",
            content: `<p>${migrationStart}</p>`,
            buttons: {},
            close: () => migrationDialog?.render(true)  // Prevent manual closing
        }, {
            id: "abfalter-migration-dialog",
            width: 400
        });
        migrationDialog.render(true);
    };

    const closeMigrationDialog = () => {
        migrationDialog?.close({ force: true });
    };

    // --- Get current version ---
    const currentVersion = game.settings.get("abfalter", "systemMigrationVersion");
    
    //Force migration for testing
    //migrateItemFusion();

    // If no version is saved, no need to migrate
    if (!currentVersion) {
        return game.settings.set('abfalter', 'systemMigrationVersion', game.system.version);
    }

    // Compatibility warning, Warn if version is too old
    if (currentVersion && foundry.utils.isNewerVersion(COMPATIBLE_MIGRATION_VERSION, currentVersion)) {
        const warning = 'Your ABF Alter system data is too old and cannot be reliably migrated to the latest version. The process will be attempted, but errors may occur.';
        ui.notifications.error(warning, { permanent: true });
    }

    // Define migration tasks
    const migrations = [
        { version: '1.4.6', migrate: migrateSecondaryLanguage },   // Secondary Abilities language fix
        { version: '1.5.0', migrate: migrateItemFusion }   // Merge Items into 1
    ];

    // Check if migration is needed
    const needsMigration = migrations.some(({ version }) =>
        foundry.utils.isNewerVersion(version, currentVersion)
    );

    if (needsMigration) { showMigrationDialog(); }

    for (const { version, migrate } of migrations) {
        if (foundry.utils.isNewerVersion(version, currentVersion)) {
            console.log(`Starting migration for version ${version}`);
            await migrate();
        }
    }

    if (needsMigration) {
        closeMigrationDialog();
        ui.notifications.info(migrationEnd);
    }

    return game.settings.set('abfalter', 'systemMigrationVersion', game.system.version);
}


/**
 * Migrates items of type "disadvantage" to "advantage"
 * Version 1.5.0
 */
export async function migrateItemFusion() {
    for (let actor of game.actors.contents) {
        const { createData, deleteIds } = await migrate150Data(actor);
        if (createData.length > 0 || deleteIds.length > 0) {
            console.log(`Migrating items for Actor ${actor.name}`);
            if (createData.length > 0) {
                await actor.createEmbeddedDocuments("Item", createData);
            }
            if (deleteIds.length > 0) {
                await actor.deleteEmbeddedDocuments("Item", deleteIds);
            }
        }
    }

    for (let scene of game.scenes.contents) {
        migrate150SceneData(scene);
    }

    for (let pack of game.packs) {
        console.log(pack.metadata.packageType);
        if (pack.metadata.packageType !== "world") continue;

        const packType = pack.metadata.type;
        if (!["Actor", "Scene", "Item"].includes(packType)) continue;

        const wasLocked = pack.locked;
        await pack.configure({ locked: false });
        await pack.migrate();
        const documents = await pack.getDocuments();

        for (let document of documents) {
            if (packType === "Actor") {
                const { createData, deleteIds } = await migrate150Data(document);
                if (createData.length || deleteIds.length) {
                    if (deleteIds.length > 0) {
                        await document.deleteEmbeddedDocuments("Item", deleteIds);
                    }
                    if (createData.length > 0) {
                        await document.createEmbeddedDocuments("Item", createData);
                    }
                    console.log(`Migrated Actor ${document.name} in Compendium ${pack.collection}`);
                }
            }

            if (packType === "Scene") {
                migrate150SceneData(document);
                console.log(`Migrated Scene ${document.name} in Compendium ${pack.collection}`);
            }

            if (packType === "Item") {
                if (document.type === "disadvantage") {
                    const newItemData = {
                        name: document.name,
                        type: "advantage",
                        system: {
                            description: document.system.description,
                            expand: document.system.expand,
                            cost: document.system.benefit,
                            toggleItem: false,
                            type: "disadvantage"
                        }
                    };
                    await document.update(newItemData, { recursive: false });
                    console.log(`Migrated Item ${document.name} in Compendium ${pack.collection}`);
                }
                if (document.type === "turnMaint" || document.type === "dailyMaint") {
                    const newItemData = {
                        name: document.name,
                        type: "zeonMaint",
                        system: {
                            description: document.system.description,
                            expand: document.system.expand,
                            zeon: document.system.zeon,
                            cost: document.system.benefit,
                            equipped: document.system.equipped,
                            toggleItem: false,
                            type: document.type === "turnMaint" ? "turn" : "daily"
                        }
                    };
                    await document.update(newItemData, { recursive: false });
                    console.log(`Migrated Item ${document.name} in Compendium ${pack.collection}`);
                }
                if (document.type === "armorHelmet") {
                    const newItemData = {
                        name: document.name,
                        type: "armor",
                        system: {
                            description: document.system.description,
                            quantity: document.system.quantity,
                            quality: document.system.quality,
                            presence: document.system.presence,
                            fortitude: document.system.fortitude,
                            requirement: document.system.requirement,
                            natPenalty: document.system.natPenalty,
                            equipped: document.system.equipped,
                            AT: {
                                cut: document.system.AT.cut,
                                imp: document.system.AT.imp,
                                thr: document.system.AT.thr,
                                heat: document.system.AT.heat,
                                cold: document.system.AT.cold,
                                ele: document.system.AT.ele,
                                ene: document.system.AT.ene,
                                spt: document.system.AT.spt,
                            },
                            armorType: "helmet"
                        }
                    };
                    await document.update(newItemData, { recursive: false });
                    console.log(`Migrated Item ${document.name} in Compendium ${pack.collection}`);
                }
            }
        }

        await pack.configure({ locked: wasLocked });
    }
}

async function migrate150Data(actor) {
    const createData = [];
    const deleteIds = [];
    for (const item of actor.items) {
        if (item.type === "disadvantage") {
            const { description, expand, benefit } = item.system;

            createData.push({
                name: item.name,
                type: "advantage",
                system: {
                    description,
                    expand,
                    cost: benefit,
                    toggleItem: false,
                    type: "disadvantage" 
                }
            });

            deleteIds.push(item.id);
        }
        if (item.type === "turnMaint" || item.type === "dailyMaint") {
            const { description, expand, zeon, cost } = item.system;

            createData.push({
                name: item.name,
                type: "zeonMaint",
                system: {
                    description,
                    expand,
                    zeon,
                    cost,
                    equipped: item.system.equipped,
                    toggleItem: false,
                    type: item.type === "turnMaint" ? "turn" : "daily"
                }
            });

            deleteIds.push(item.id);
        }
        if (item.type === "armorHelmet") {
            console.log(`Migrating Item: ${item.name}`);
            createData.push({
                name: item.name,
                type: "armor",
                system: {
                    description: item.system.description,
                    quantity: item.system.quantity,
                    quality: item.system.quality,
                    presence: item.system.presence,
                    fortitude: item.system.fortitude,
                    requirement: item.system.requirement,
                    natPenalty: item.system.natPenalty,
                    equipped: item.system.equipped,
                    AT: {
                        cut: item.system.AT.cut,
                        imp: item.system.AT.imp,
                        thr: item.system.AT.thr,
                        heat: item.system.AT.heat,
                        cold: item.system.AT.cold,
                        ele: item.system.AT.ele,
                        ene: item.system.AT.ene,
                        spt: item.system.AT.spt,
                    },
                    armorType: "helmet"
                }
            });

            deleteIds.push(item.id);
        }        
    }
    return { createData, deleteIds };
}

async function migrate150SceneData(scene) {
    const updatedTokens = [];

    for (let tokenDoc of scene.tokens) {
        if (tokenDoc.actorLink) continue;
        const t = tokenDoc.toObject();
        const items = t.delta.items || [];
        console.log(`Migrating Unlinked Token: ${t.name}`);

        const { createData, deleteIds } = await migrate150TokenData(t.delta);

        if (createData.length === 0 && deleteIds.length === 0) continue;

        const remainingItems = (t.delta.items || []).filter(i => !deleteIds.includes(i._id));
        const updatedItems = [...remainingItems, ...createData];
        t.delta = {
            items: updatedItems
        };

        updatedTokens.push(t);
    }
    if (updatedTokens.length > 0) {
        console.log(`Migrating Scene: ${scene.name}`);
        await scene.deleteEmbeddedDocuments("Token", updatedTokens.map(t => t._id));
        await scene.createEmbeddedDocuments("Token", updatedTokens);
    }
    return;
}

async function migrate150TokenData(actor) {
    const createData = [];
    const deleteIds = [];
    for (const item of actor.items) {
        if (item.type === "disadvantage") {
            const { description, expand, benefit } = item.system;

            createData.push({
                name: item.name,
                type: "advantage",
                system: {
                    description,
                    expand,
                    cost: benefit,
                    toggleItem: false,
                    type: "disadvantage" 
                }
            });

            deleteIds.push(item._id);
        }
        if (item.type === "turnMaint" || item.type === "dailyMaint") {
            const { description, expand, zeon, cost } = item.system;

            createData.push({
                name: item.name,
                type: "zeonMaint",
                system: {
                    description,
                    expand,
                    zeon,
                    cost,
                    equipped: item.system.equipped,
                    toggleItem: false,
                    type: item.type === "turnMaint" ? "turn" : "daily"
                }
            });

            deleteIds.push(item._id);
        }
        if (item.type === "armorHelmet") {
            console.log(`Migrating Item: ${item.name}`);
            createData.push({
                name: item.name,
                type: "armor",
                system: {
                    description: item.system.description,
                    quantity: item.system.quantity,
                    quality: item.system.quality,
                    presence: item.system.presence,
                    fortitude: item.system.fortitude,
                    requirement: item.system.requirement,
                    natPenalty: item.system.natPenalty,
                    equipped: item.system.equipped,
                    AT: {
                        cut: item.system.AT.cut,
                        imp: item.system.AT.imp,
                        thr: item.system.AT.thr,
                        heat: item.system.AT.heat,
                        cold: item.system.AT.cold,
                        ele: item.system.AT.ele,
                        ene: item.system.AT.ene,
                        spt: item.system.AT.spt,
                    },
                    armorType: "helmet"
                }
            });

            deleteIds.push(item._id);
        } 
    }
    return { createData, deleteIds };
}


/**
 * Migrates the secondary language fields in actors and scenes
 * Version 1.4.6
 */
export async function migrateSecondaryLanguage() {
    for (let actor of game.actors.contents) {
        const updateData = await migrate146Data(actor);
        if (!foundry.utils.isEmpty(updateData)) {
            console.log(`Migrating Actor entity ${actor.name}`);
            await actor.update(updateData);
        }
    }

    for (let scene of game.scenes.contents) {
        let sceneUpdate = migrate146SceneData(scene)
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
                const updateData = await migrate146Data(document);
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
                const updateData = await migrate146Data(document);
                if (foundry.utils.isEmpty(updateData)) {
                    continue;
                }
                await document.update(migrate146SceneData);
                console.log(`Migrated ${packType} entity ${document.name} in Compendium ${pack.collection}`);
            }
    
            await pack.configure({ locked: wasLocked });    
        }
    }
    console.log("Migration Complete for 1.4.6");
}

function migrate146SceneData(scene) {
    const tokens = scene.tokens.map(token => {
        const t = token.toJSON();

        if (!t.actorLink) {
            const actor = foundry.utils.duplicate(t.delta);
            actor.type = t.actor?.type;
            const update = migrate146Data(actor);
            foundry.utils.mergeObject(t.delta, update);
        }
        return t;
    });

    return { tokens };
}

async function migrate146Data() {
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
    updateData["system.secondaryFields.intellectual.magicappr.modifier"] = 'pow';
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

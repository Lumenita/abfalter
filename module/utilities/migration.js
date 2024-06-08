async function migrateActorData(actor) {
    /*
        let updateData = {};
    if (actor.metaMagic) {
        updateData["system.metaMagic.cost"] = 0;
        updateData["system.metaMagic.extraCost"] = 0;
        for (let [key, meta] of Object.entries(actor.metaMagic)) {
            if (key !== "info" && key !== "cost" && key !== "extraCost") {
                let path = "system.metaMagic." + key + ".bought";
                let path2 = "system.metaMagic." + key + ".free";
                updateData[path] = false;
                updateData[path2] = false;
            }
        }
    }

    if (actor.mproj) {
        updateData["system.mproj.spec2"] = 0;
        updateData["system.mproj.temp2"] = 0;

    }
    */
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
}

function migrateSceneData(scene) {
    const tokens = scene.tokens.map(token => {
        const t = token.toJSON();

        if (!t.actorLink) {
            const actor = foundry.utils.duplicate(t.delta);
            actor.type = t.actor?.type;
            const update = migrateActorData(actor);
            foundry.utils.mergeObject(t.delta, update);
        }
        return t;
    });

    return { tokens };
}

export async function migrateWorld() {
    for (let actor of game.actors.contents) {
        const updateData = await migrateActorData(actor);
        if (!foundry.utils.isEmpty(updateData)) {
            console.log(`Migrating Actor entity ${actor.system.name}`);
            //await actor.update(updateData);
            await actor.updateEmbeddedDocuments("Item", updateData);
        }
    }

    for (let scene of game.scenes.contents) {
        let sceneUpdate = migrateSceneData(scene)
        if (!foundry.utils / foundry.utils.isEmpty(sceneUpdate)) {
            console.log(`Migrating Scene ${scene.name}`);
            await scene.update(sceneUpdate);
        }
    }
    for (let pack of game.packs) {
        const packType = pack.metadata.entity;
        if (!["Actor", "Scene"].includes(packType)) {
            continue;
        }

        const wasLocked = pack.locked;
        await pack.configure({ locked: false });

        await pack.migrate();
        const documents = await pack.getDocuments();

        for (let document of documents) {
            let updateData = {};
            switch (packType) {
                case "Actor":
                    updateData = migrateActorData(document.data);
                    break;
                case "Scene":
                    updataData = migrateSceneData(document.scene);
                    break;
            }
            if (foundry.utils.isObjectEmpty(updateData)) {
                continue;
            }
            await document.update(updataData);
            console.log(`Migrated ${packType} entity ${document.name} in Compendium ${pack.collection}`);
        }

        await pack.configue({ locked: wasLocked });
    }
    console.log("Migration Complete");
    game.settings.set('abfalter', 'systemMigrationVersion', game.system.version);
}

import { abfalter } from "../config.js";
import { abfalterSettingsKeys } from "../utilities/abfalterSettings.js";

export async function handleMigrations({ force: forceArg = false } = {}) {
    if (!game.user.isGM) return;

    const COMPATIBLE_MIGRATION_VERSION = '1.4.3';
    const systemVersion  = game.system.version ?? game.system.data?.version ?? "0.0.0";
    const storedVersion  = game.settings.get("abfalter", "systemMigrationVersion") ?? "0.0.0";
    const forceSetting = game.settings.get("abfalter", "forceMigration") === true;
    const force = !!(forceArg || forceSetting);

    // ---- Singleton guard: bail if already running
    if (game.settings.get("abfalter", "migrationInProgress")) {
        console.warn("ABF Alter: migration already in progress, skipping duplicate call.");
        return;
    }

    // Define migrations (ordered)
    const migrations = [
        { version: '1.4.6', label: 'Secondary Abilities language fix', migrate: migrateSecondaryLanguage },
        { version: '1.5.0', label: 'Item fusion (merge items)',        migrate: migrateItemFusion },
        { version: '1.6.0', label: 'Weapon Migration',        migrate: migrateWeapons }

    ];

    // Decide whether any migration is needed
    const needsMigration = force || migrations.some(({ version }) =>
        foundry.utils.isNewerVersion(version, storedVersion)
    );

    if (!needsMigration) {
        // Nothing to do, but ensure version is set
        if (!storedVersion) await game.settings.set('abfalter', 'systemMigrationVersion', systemVersion);
        return;
    }

    // Compatibility warning if the stored version is older than your “guaranteed compatible” floor
    if (storedVersion && foundry.utils.isNewerVersion(COMPATIBLE_MIGRATION_VERSION, storedVersion)) {
        ui.notifications.error(
        'Your ABF Alter system data is too old and cannot be reliably migrated to the latest version. The process will be attempted, but errors may occur.',
        { permanent: true }
        );
    }

    // --- Sticky modal dialog helpers ---
    const DIALOG_ID = "abfalter-migration-dialog";
    let dlg = null;

    const ensureDialog = () => {
        // Reuse if exists
        const existing = Object.values(ui.windows ?? {}).find(w => w?.id === DIALOG_ID);
        if (existing) { dlg = existing; return dlg; }

        dlg = new Dialog(
        {
            title: "System Migration",
            content: `
            <div class="abfalter-migration">
                <p>Migration in progress. Please wait until it completes before using the system.</p>
                <p><strong class="abfalter-step">Preparing…</strong></p>
            </div>
            `,
            buttons: {}
        },
        { id: DIALOG_ID, width: 440, modal: true, closeOnEscape: false }
        );

        dlg.render(true);

        // Hide close button once the dialog is first rendered
        Hooks.once("renderDialog", (app, html) => {
        if (app.id === DIALOG_ID) {
            html.closest(".window-app").find(".header-button.close").hide();
            app.options.draggable = false;
        }
        });

        return dlg;
    };

    const setStep = (html) => {
        // Update the existing DOM instead of re-rendering (prevents duplicate dialogs)
        const win = dlg?.element?.length ? dlg.element : $(`.window-app#${DIALOG_ID}`);
        win.find(".abfalter-step").html(html);
    };

    const closeAllMigrationDialogs = async () => {
        // Close our tracked dialog
        if (dlg?.rendered) await dlg.close({ force: true });
        // Close any stray windows with same id (defensive)
        for (const app of Object.values(ui.windows ?? {})) {
        if (app?.id === DIALOG_ID && app !== dlg && app.rendered) {
            try { await app.close({ force: true }); } catch {}
        }
        }
    };

    // ---- Run
    await game.settings.set("abfalter", "migrationInProgress", true);

    try {
        ensureDialog();
        setStep("Starting…");

        for (const { version, migrate, label } of migrations) {
        if (force || foundry.utils.isNewerVersion(version, storedVersion)) {
            console.log(`ABF Alter: starting migration ${version} — ${label}`);
            setStep(`Running: ${label ?? version} <small>(this may take a moment)</small>`);
            await migrate();
        }
        }

        await game.settings.set("abfalter", "systemMigrationVersion", systemVersion);

        if (forceSetting) {
        // Reset the toggle so it only runs once per opt-in
        await game.settings.set("abfalter", "forceMigration", false);
        }

        ui.notifications.info("Migration has finished. You can now use the system.");
    } catch (err) {
        console.error(err);
        ui.notifications.error(`Migration failed: ${err?.message ?? err}`, { permanent: true });
    } finally {
        await closeAllMigrationDialogs();
        await game.settings.set("abfalter", "migrationInProgress", false);
    }
};


/**
 * v1.6.0 — Weapon property normalization
 *
 * Scope:
 * - World Actors (embedded items)
 * - World Items (directory)
 * - Scenes (unlinked token delta items)
 * - World compendiums (Actor/Item/Scene)
 */
export async function migrateWeapons() {
  const meters = game.settings.get('abfalter', abfalterSettingsKeys.Use_Meters); 

  // 1) WORLD ACTORS
  for (const actor of game.actors.contents) {
    const updates = collectActorWeaponUpdates(actor);
    if (updates.length) {
      console.log(`v1.6 Migrating Actor Weapons: ${actor.name}`);
      await actor.updateEmbeddedDocuments("Item", updates);
    }
  }

  // 2) WORLD ITEMS
  const worldItemUpdates = [];
  for (const item of game.items.contents) {
    
    const upd = buildWeaponUpdate(item, meters);
    if (upd) worldItemUpdates.push({ _id: item.id, ...upd });
  }
  if (worldItemUpdates.length) {
    console.log(`v1.6 Migrating World Weapons: ${worldItemUpdates.length} item(s)`);
    await Item.updateDocuments(worldItemUpdates);
  }

  // 3) SCENES — UNLINKED TOKENS ONLY (delta items)
  for (const scene of game.scenes.contents) {
    await migrateSceneUnlinkedTokenWeaponsV16(scene);
  }

  // 4) COMPENDIUMS (WORLD only)
  for (const pack of game.packs) {
    if (!["Actor", "Scene", "Item"].includes(pack.metadata.type)) continue;

    const wasLocked = pack.locked;
    await pack.configure({ locked: false });
    await pack.migrate(); // schema sync

    const docs = await pack.getDocuments();

    if (pack.metadata.type === "Actor") {
      for (const actor of docs) {
        const updates = collectActorWeaponUpdates(actor);
        if (updates.length) {
          console.log(`v1.6 Migrating Actor in ${pack.collection}: ${actor.name}`);
          await actor.updateEmbeddedDocuments("Item", updates);
          await actor.pack?.setDocument(actor);
        }
      }
    }

    if (pack.metadata.type === "Item") {
      const updates = [];
      for (const it of docs) {
        const upd = buildWeaponUpdate(it, meters);
        if (upd) updates.push({ _id: it.id, ...upd });
      }
      if (updates.length) {
        console.log(`v1.6 Migrating Items in ${pack.collection}: ${updates.length} item(s)`);
        await Item.updateDocuments(updates, { pack: pack.collection });
      }
    }

    if (pack.metadata.type === "Scene") {
      for (const scn of docs) {
        await migrateSceneUnlinkedTokenWeaponsV16(scn);
        await scn.pack?.setDocument(scn);
      }
    }

    await pack.configure({ locked: wasLocked });
  }

  ui.notifications.info("Migration v1.6.0: Weapon fields updated.");
}

/* -------------------------------------------- */
/* Actor embedded items                         */
/* -------------------------------------------- */

function collectActorWeaponUpdates(actor) {
  const updates = [];
  const meters = game.settings.get('abfalter', abfalterSettingsKeys.Use_Meters); 

  for (const it of actor.items) {
    const upd = buildWeaponUpdate(it, meters);
    if (upd) updates.push({ _id: it.id, ...upd });
  }

  return updates;
}

/* -------------------------------------------- */
/* World/Pack item update builder               */
/* -------------------------------------------- */

/**
 * Builds update data for a weapon item migration.
 */
function buildWeaponUpdate(item, meters) {
  if (item.type !== "weapon") return null;

  const sys = item.system ?? {};
  const props = sys.properties ?? {};
  const ranged = sys.ranged ?? {};
  const melee = sys.melee ?? {};

  const updates = {};

  console.log(meters);
  updates["system.properties.specialAmmo.bool"] = !!ranged.specialAmmo;
  updates["system.properties.trapping.bool"] = !!melee.trapping;
  updates["system.properties.throwable.bool"] = !!melee.throwable;
  updates["system.properties.twoHanded.bool"] = !!melee.twoHanded;
  updates["system.properties.precision.bool"] = !!sys.info.precision;
  updates["system.properties.vorpal.bool"] = !!sys.info.vorpal;

  if (sys.info.type === "ranged") {
    updates["system.properties.ammunition.bool"] = true;
    updates["system.ranged.useReadyToFire"] = !!ranged.readyToFire; //new field
    updates["system.distance.range"] = ranged.range || 0;
    if (ranged.rangeType == "small" || ranged.rangeType == "big") {
      if (meters) {
        console.log("meters true"); 
        updates["system.distance.rangeUnitType"] = ranged.rangeType == "small" ? "m" : "km"; 
      } else {
        updates["system.distance.rangeUnitType"] = ranged.rangeType == "small" ? "ft" : "mi"; 
      }
    } else {
      updates["system.distance.rangeUnitType"] = ranged.rangeType;
    }
  }
  if (sys.info.type === "melee") {
    updates["system.distance.range"] = melee.throwRange || 0;
    if (melee.throwDistanceType == "small" || melee.throwDistanceType == "big") {
      if (meters) {
        updates["system.distance.rangeUnitType"] = melee.throwDistanceType == "small" ? "m" : "km"; 
      } else {
        updates["system.distance.rangeUnitType"] = melee.throwDistanceType == "small" ? "ft" : "mi"; 
      }
    } else {
      updates["system.distance.rangeUnitType"] = melee.throwDistanceType;
    }
    updates["system.quantity"] = melee.throwQuantity || 1;
  }
  console.log(updates);
  return updates;
}

/* -------------------------------------------- */
/* Scenes — Unlinked token deltas               */
/* -------------------------------------------- */

async function migrateSceneUnlinkedTokenWeaponsV16(scene) {
  const updates = [];

  for (const token of scene.tokens) {
    if (token.actorLink) continue;

    const t = token.toObject();
    const items = t.delta?.items ?? [];
    if (!items.length) continue;

    let changed = false;

    for (const it of items) {
      if (it.type !== "weapon") continue;

      const sys = it.system ?? {};
      sys.ranged ??= {};
      sys.properties ??= {};

      const oldSpecialAmmo = sys.ranged.specialAmmo;
      const newSpecialAmmoBool = sys.properties?.specialAmmo?.bool;

      if (oldSpecialAmmo !== undefined && oldSpecialAmmo !== null && newSpecialAmmoBool === undefined) {
        sys.properties.specialAmmo ??= {};
        sys.properties.specialAmmo.bool = !!oldSpecialAmmo;
        delete sys.ranged.specialAmmo;
        changed = true;
      }

      it.system = sys;
    }

    if (!changed) continue;

    t.delta = { ...(t.delta ?? {}), items };
    updates.push(t);
  }

  if (updates.length) {
    console.log(`v1.6 Migrating Scene Unlinked Tokens: ${scene.name}`);
    await scene.deleteEmbeddedDocuments("Token", updates.map(t => t._id));
    await scene.createEmbeddedDocuments("Token", updates);
  }
}


/**
 * v1.5.0 — Item fusion
 * - disadvantage -> advantage (system.cost = benefit, system.type = "disadvantage")
 * - turnMaint/dailyMaint -> zeonMaint (system.type = "turn"/"daily")
 * - armorHelmet -> armor (system.armorType = "helmet")
 */
export async function migrateItemFusion() {
  // 1) WORLD ACTORS
  for (const actor of game.actors.contents) {
    const { toCreate, toDelete } = collectActorItemChanges(actor);
    if (toCreate.length || toDelete.length) {
      console.log(`Migrating Actor: ${actor.name}`);
      // Delete first, then create in one go to avoid collisions
      if (toDelete.length) await actor.deleteEmbeddedDocuments("Item", toDelete);
      if (toCreate.length) await actor.createEmbeddedDocuments("Item", toCreate);
    }
  }

  // 2) WORLD ITEMS (directory items not embedded in actors)
  for (const item of game.items.contents) {
    const repl = remakeItemIfNeeded(item);
    if (repl) {
      console.log(`Migrating World Item: ${item.name}`);
      await item.delete();                      // remove old (wrong type)
      await Item.create(repl, { temporary: false });  // create new with correct type
    }
  }

  // 3) SCENES — UNLINKED TOKENS ONLY
  for (const scene of game.scenes.contents) {
    await migrateSceneUnlinkedTokens(scene);
  }

  // 4) COMPENDIUMS (WORLD only)
  for (const pack of game.packs) {
    if (pack.metadata.packageType !== "world") continue;
    if (!["Actor", "Scene", "Item"].includes(pack.metadata.type)) continue;

    const wasLocked = pack.locked;
    await pack.configure({ locked: false });
    await pack.migrate(); // ensure schema

    const docs = await pack.getDocuments();

    if (pack.metadata.type === "Actor") {
      for (const actor of docs) {
        const { toCreate, toDelete } = collectActorItemChanges(actor);
        if (toCreate.length || toDelete.length) {
          console.log(`Migrating Actor in ${pack.collection}: ${actor.name}`);
          if (toDelete.length) await actor.deleteEmbeddedDocuments("Item", toDelete);
          if (toCreate.length) await actor.createEmbeddedDocuments("Item", toCreate);
          await actor.pack?.setDocument(actor); // persist
        }
      }
    }

    if (pack.metadata.type === "Scene") {
      for (const scn of docs) {
        await migrateSceneUnlinkedTokens(scn);
        await scn.pack?.setDocument(scn);
      }
    }

    if (pack.metadata.type === "Item") {
      for (const it of docs) {
        const repl = remakeItemIfNeeded(it);
        if (repl) {
          console.log(`Migrating Item in ${pack.collection}: ${it.name}`);
          await it.delete();
          // Important: create into the same pack
          await Item.create(repl, { pack: pack.collection });
        }
      }
    }

    await pack.configure({ locked: wasLocked });
  }

  // 5) SAFETY SWEEP
  await safetySweepLogAndFix();
}

function collectActorItemChanges(actor) {
  const toCreate = [];
  const toDelete = [];

  for (const it of actor.items) {
    if (it.type === "disadvantage") {
      const { description, expand, benefit } = it.system;
      toCreate.push({
        name: it.name,
        type: "advantage",
        system: {
          description, expand,
          cost: benefit ?? 0,
          toggleItem: false,
          type: "disadvantage"
        },
        img: it.img, flags: it.flags
      });
      toDelete.push(it.id);
    }

    if (it.type === "turnMaint" || it.type === "dailyMaint") {
      const { description, expand, zeon, cost, equipped } = it.system;
      toCreate.push({
        name: it.name,
        type: "zeonMaint",
        system: {
          description, expand,
          zeon: zeon ?? 0,
          cost: cost ?? 0,
          equipped: !!equipped,
          toggleItem: false,
          type: it.type === "turnMaint" ? "turn" : "daily"
        },
        img: it.img, flags: it.flags
      });
      toDelete.push(it.id);
    }

    if (it.type === "armorHelmet") {
      const s = it.system;
      toCreate.push({
        name: it.name,
        type: "armor",
        system: {
          description: s.description,
          quantity: s.quantity, quality: s.quality,
          presence: s.presence, fortitude: s.fortitude,
          requirement: s.requirement, natPenalty: s.natPenalty,
          equipped: s.equipped,
          AT: { cut: s.AT?.cut, imp: s.AT?.imp, thr: s.AT?.thr, heat: s.AT?.heat, cold: s.AT?.cold, ele: s.AT?.ele, ene: s.AT?.ene, spt: s.AT?.spt },
          armorType: "helmet"
        },
        img: it.img, flags: it.flags
      });
      toDelete.push(it.id);
    }
  }

  return { toCreate, toDelete };
}

async function migrateSceneUnlinkedTokens(scene) {
  const updates = [];
  for (const token of scene.tokens) {
    if (token.actorLink) continue; // linked tokens use the base Actor
    const t = token.toObject();
    const items = t.delta?.items ?? [];
    if (!items.length) continue;

    const { create, remove } = collectTokenItemChanges(items);
    if (!create.length && !remove.length) continue;

    const remaining = items.filter(i => !remove.has(i._id));
    t.delta = { ...(t.delta ?? {}), items: [...remaining, ...create] };
    updates.push(t);
  }

  if (updates.length) {
    console.log(`Migrating Scene: ${scene.name}`);
    await scene.deleteEmbeddedDocuments("Token", updates.map(t => t._id));
    await scene.createEmbeddedDocuments("Token", updates);
  }
}

function collectTokenItemChanges(itemsArray) {
  const create = [];
  const remove = new Set();

  for (const it of itemsArray) {
    if (it.type === "disadvantage") {
      const { description, expand, benefit } = it.system ?? {};
      create.push({
        name: it.name,
        type: "advantage",
        system: {
          description, expand,
          cost: benefit ?? 0,
          toggleItem: false,
          type: "disadvantage"
        },
        img: it.img, flags: it.flags
      });
      if (it._id) remove.add(it._id);
    }

    if (it.type === "turnMaint" || it.type === "dailyMaint") {
      const { description, expand, zeon, cost, equipped } = it.system ?? {};
      create.push({
        name: it.name,
        type: "zeonMaint",
        system: {
          description, expand,
          zeon: zeon ?? 0,
          cost: cost ?? 0,
          equipped: !!equipped,
          toggleItem: false,
          type: it.type === "turnMaint" ? "turn" : "daily"
        },
        img: it.img, flags: it.flags
      });
      if (it._id) remove.add(it._id);
    }

    if (it.type === "armorHelmet") {
      const s = it.system ?? {};
      create.push({
        name: it.name,
        type: "armor",
        system: {
          description: s.description,
          quantity: s.quantity, quality: s.quality,
          presence: s.presence, fortitude: s.fortitude,
          requirement: s.requirement, natPenalty: s.natPenalty,
          equipped: s.equipped,
          AT: { cut: s.AT?.cut, imp: s.AT?.imp, thr: s.AT?.thr, heat: s.AT?.heat, cold: s.AT?.cold, ele: s.AT?.ele, ene: s.AT?.ene, spt: s.AT?.spt },
          armorType: "helmet"
        },
        img: it.img, flags: it.flags
      });
      if (it._id) remove.add(it._id);
    }
  }

  return { create, remove };
}

function remakeItemIfNeeded(item) {
  if (item.type === "disadvantage") {
    const { description, expand, benefit } = item.system;
    return {
      name: item.name,
      type: "advantage",
      system: {
        description, expand,
        cost: benefit ?? 0,
        toggleItem: false,
        type: "disadvantage"
      },
      img: item.img, flags: item.flags
    };
  }
  if (item.type === "turnMaint" || item.type === "dailyMaint") {
    const { description, expand, zeon, cost, equipped } = item.system;
    return {
      name: item.name,
      type: "zeonMaint",
      system: {
        description, expand,
        zeon: zeon ?? 0,
        cost: cost ?? 0,
        equipped: !!equipped,
        toggleItem: false,
        type: item.type === "turnMaint" ? "turn" : "daily"
      },
      img: item.img, flags: item.flags
    };
  }
  if (item.type === "armorHelmet") {
    const s = item.system;
    return {
      name: item.name,
      type: "armor",
      system: {
        description: s.description,
        quantity: s.quantity, quality: s.quality,
        presence: s.presence, fortitude: s.fortitude,
        requirement: s.requirement, natPenalty: s.natPenalty,
        equipped: s.equipped,
        AT: { cut: s.AT?.cut, imp: s.AT?.imp, thr: s.AT?.thr, heat: s.AT?.heat, cold: s.AT?.cold, ele: s.AT?.ele, ene: s.AT?.ene, spt: s.AT?.spt },
        armorType: "helmet"
      },
      img: item.img, flags: item.flags
    };
  }
  return null;
}

async function safetySweepLogAndFix() {
  let fixed = 0;

  // Actors
  for (const actor of game.actors.contents) {
    const bad = actor.items.filter(i => i.type === "disadvantage");
    if (!bad.length) continue;
    console.warn(`Safety sweep — Actor "${actor.name}" still has ${bad.length} disadvantage item(s). Fixing…`);
    const toCreate = bad.map(i => ({
      name: i.name,
      type: "advantage",
      system: {
        description: i.system.description,
        expand: i.system.expand,
        cost: i.system.benefit ?? 0,
        toggleItem: false,
        type: "disadvantage"
      },
      img: i.img, flags: i.flags
    }));
    const toDelete = bad.map(i => i.id);
    await actor.deleteEmbeddedDocuments("Item", toDelete);
    await actor.createEmbeddedDocuments("Item", toCreate);
    fixed += bad.length;
  }

  // World Items
  for (const item of game.items.filter(i => i.type === "disadvantage")) {
    console.warn(`Safety sweep — World Item "${item.name}" is still disadvantage. Fixing…`);
    const repl = remakeItemIfNeeded(item);
    await item.delete();
    await Item.create(repl, { temporary: false });
    fixed++;
  }

  // Tokens in scenes (unlinked)
  for (const scene of game.scenes.contents) {
    const ups = [];
    for (const token of scene.tokens) {
      if (token.actorLink) continue;
      const t = token.toObject();
      const items = t.delta?.items ?? [];
      if (!items.some(i => i.type === "disadvantage")) continue;
      console.warn(`Safety sweep — Unlinked token "${t.name}" in scene "${scene.name}" has disadvantage items. Fixing…`);
      const { create, remove } = collectTokenItemChanges(items);
      const remaining = items.filter(i => !remove.has(i._id));
      t.delta = { ...(t.delta ?? {}), items: [...remaining, ...create] };
      ups.push(t);
      fixed += remove.size;
    }
    if (ups.length) {
      await scene.deleteEmbeddedDocuments("Token", ups.map(t => t._id));
      await scene.createEmbeddedDocuments("Token", ups);
    }
  }

  if (fixed) ui.notifications.info(`Migration 1.5.0 safety sweep fixed ${fixed} lingering item(s).`);
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
        if (pack.metadata.packageType !== "world") continue;
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

import { abfalter } from "../config.js";
import { abfalterSettingsKeys } from "../utilities/abfalterSettings.js";

class ABFMigrationProgress extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "abfalter-migration-dialog",
      title: "System Migration",
      width: 440,
      height: "auto",
      popOut: true,
      minimizable: false,
      resizable: false
    });
  }

  constructor() {
    super();
    this.step = "Preparing…";
    this.percent = 0;
  }

  async _renderInner() {
    return $(`
      <div class="abfalter-migration">
        <p>Migration in progress. Please wait until it completes before using the system.</p>

        <div class="abfalter-migration-bar">
          <div class="abfalter-migration-bar-fill" style="width: ${this.percent}%"></div>
        </div>

        <p><strong class="abfalter-step">${this.step}</strong></p>
      </div>
    `);
  }

  async setProgress(step, percent = this.percent) {
    this.step = step;
    this.percent = Math.clamp(percent, 0, 100);

    if (!this.rendered) {
      await this.render(true);
    }

    this.element.find(".abfalter-step").html(this.step);
    this.element.find(".abfalter-migration-bar-fill").css("width", `${this.percent}%`);
    this.element.find(".header-button.close").hide();
    this.options.draggable = false;
  }

  async close(options = {}) {
    return super.close({ ...options, force: true });
  }
}

export async function handleMigrations({ force: forceArg = false } = {}) {
  if (!game.user.isGM) return;

  const COMPATIBLE_MIGRATION_VERSION = "1.6.0";
  const systemVersion = game.system.version ?? game.system.data?.version ?? "0.0.0";
  const storedVersion = game.settings.get("abfalter", "systemMigrationVersion") ?? "0.0.0";
  const forceSetting = game.settings.get("abfalter", "forceMigration") === true;
  const force = !!(forceArg || forceSetting);

  const migrations = [
    {
      version: "1.6.0",
      label: "Weapon migration",
      migrate: migrateWeapons
    },
    {
      version: "1.6.2",
      label: "Psychic Matrix effect migration",
      migrate: migratePsychicMatrixEffects
    },
    {
      version: "1.6.3",
      label: "Active Effect key migration",
      migrate: migrateActiveEffectKeys
    }
  ];

  const migrationsToRun = migrations.filter(({ version }) => {
    return force || foundry.utils.isNewerVersion(version, storedVersion);
  });

  const needsMigration = migrationsToRun.length > 0;

  if (!needsMigration) {
    if (foundry.utils.isNewerVersion(systemVersion, storedVersion)) {
      await game.settings.set("abfalter", "systemMigrationVersion", systemVersion);
      await game.settings.set("abfalter", "systemChangeLog", false);
    }
    return;
  }

  if (game.settings.get("abfalter", "migrationInProgress")) {
    console.warn("ABF Alter | Migration already in progress. Skipping duplicate call.");
    return;
  }

  if (
    storedVersion &&
    foundry.utils.isNewerVersion(COMPATIBLE_MIGRATION_VERSION, storedVersion)
  ) {
    ui.notifications.error(
      "Your ABF Alter system data is very old. Migration will be attempted, but errors may occur.",
      { permanent: true }
    );
  }

  let progress = null;

  const ensureProgress = async () => {
    const existing = Object.values(ui.windows ?? {}).find(
      w => w?.id === "abfalter-migration-dialog"
    );

    if (existing) {
      progress = existing;
      return progress;
    }

    progress = new ABFMigrationProgress();
    await progress.render(true);
    progress.element.find(".header-button.close").hide();
    progress.options.draggable = false;
    return progress;
  };

  const setStep = async (text, percent) => {
    await ensureProgress();
    await progress.setProgress(text, percent);
  };

  const closeProgress = async () => {
    for (const app of Object.values(ui.windows ?? {})) {
      if (app?.id === "abfalter-migration-dialog" && app.rendered) {
        try {
          await app.close({ force: true });
        } catch (err) {
          console.warn("ABF Alter | Failed to close migration dialog.", err);
        }
      }
    }
  };

  await game.settings.set("abfalter", "migrationInProgress", true);

  try {
    await setStep("Starting migration…", 0);

    for (let i = 0; i < migrationsToRun.length; i++) {
      const { version, label, migrate } = migrationsToRun[i];

      const startPercent = Math.floor((i / migrationsToRun.length) * 100);
      const endPercent = Math.floor(((i + 1) / migrationsToRun.length) * 100);

      console.log(`ABF Alter | Starting migration ${version}: ${label}`);
      await setStep(`Running ${version}: ${label}`, startPercent);

      await migrate();

      console.log(`ABF Alter | Finished migration ${version}: ${label}`);
      await setStep(`Finished ${version}: ${label}`, endPercent);
    }

    await setStep("Finalizing migration…", 100);

    await game.settings.set("abfalter", "systemMigrationVersion", systemVersion);
    await game.settings.set("abfalter", "systemChangeLog", false);

    if (forceSetting) {
      await game.settings.set("abfalter", "forceMigration", false);
    }

    ui.notifications.info("Migration has finished. You can now use the system.");
  } catch (err) {
    console.error("ABF Alter | Migration failed.", err);
    ui.notifications.error(`Migration failed: ${err?.message ?? err}`, {
      permanent: true
    });
  } finally {
    await closeProgress();
    await game.settings.set("abfalter", "migrationInProgress", false);
  }
}


/**
 * v1.6.3 — Active Effect key migration
 *
 * Moves old Active Effect change keys to their new paths.
 */
export async function migrateActiveEffectKeys() {
  const KEY_MIGRATIONS = {
    "system.aamField.bonus": {
      key: "system.aamField.final",
      phase: "final"
    }
  };

  const migrateEffectCollection = async parentDoc => {
    const updates = [];

    for (const effect of parentDoc.effects ?? []) {
      const effectData = effect.toObject();
      const changes = effectData.system?.changes ?? [];

      let changed = false;

      for (const change of changes) {
        const migration = KEY_MIGRATIONS[change.key];
        if (!migration) continue;

        change.key = migration.key;
        change.phase = migration.phase;
        changed = true;
      }

      if (changed) {
        updates.push({
          _id: effect.id,
          "system.changes": changes
        });
      }
    }

    if (updates.length) {
      await parentDoc.updateEmbeddedDocuments("ActiveEffect", updates);
    }

    return updates.length;
  };

  // World actors + actor-owned items
  for (const actor of game.actors.contents) {
    const actorCount = await migrateEffectCollection(actor);

    if (actorCount) {
      console.log(`ABF Alter | Migrated ${actorCount} Active Effects on Actor: ${actor.name}`);
    }

    for (const item of actor.items) {
      const itemCount = await migrateEffectCollection(item);

      if (itemCount) {
        console.log(`ABF Alter | Migrated ${itemCount} Active Effects on Item ${item.name} on Actor: ${actor.name}`);
      }
    }
  }

  // World items
  for (const item of game.items.contents) {
    const itemCount = await migrateEffectCollection(item);

    if (itemCount) {
      console.log(`ABF Alter | Migrated ${itemCount} Active Effects on World Item: ${item.name}`);
    }
  }

  // Scene unlinked token delta effects/items
  for (const scene of game.scenes.contents) {
    await migrateSceneActiveEffectKeys(scene, KEY_MIGRATIONS);
  }

  // World compendiums
  for (const pack of game.packs) {
    if (pack.metadata.packageType !== "world") continue;
    if (!["Actor", "Item", "Scene"].includes(pack.metadata.type)) continue;

    const wasLocked = pack.locked;
    await pack.configure({ locked: false });
    await pack.migrate();

    const docs = await pack.getDocuments();

    if (pack.metadata.type === "Actor") {
      for (const actor of docs) {
        await migrateEffectCollection(actor);

        for (const item of actor.items) {
          await migrateEffectCollection(item);
        }
      }
    }

    if (pack.metadata.type === "Item") {
      for (const item of docs) {
        await migrateEffectCollection(item);
      }
    }

    if (pack.metadata.type === "Scene") {
      for (const scene of docs) {
        await migrateSceneActiveEffectKeys(scene, KEY_MIGRATIONS);
      }
    }

    await pack.configure({ locked: wasLocked });
  }

  ui.notifications.info("Migration v1.6.3: Active Effect keys updated.");
}

async function migrateSceneActiveEffectKeys(scene, keyMigrations) {
  const tokenUpdates = [];

  for (const token of scene.tokens) {
    if (token.actorLink) continue;

    const tokenData = token.toObject();
    const delta = foundry.utils.deepClone(tokenData.delta ?? {});

    let changed = false;

    // Token actor delta Active Effects
    for (const effect of delta.effects ?? []) {
      const changes = effect.system?.changes ?? [];

      for (const change of changes) {
        const migration = keyMigrations[change.key];
        if (!migration) continue;

        change.key = migration.key;
        change.phase = migration.phase;
        changed = true;
      }
    }

    // Token actor delta Item Active Effects
    for (const item of delta.items ?? []) {
      for (const effect of item.effects ?? []) {
        const changes = effect.system?.changes ?? [];

        for (const change of changes) {
          const migration = keyMigrations[change.key];
          if (!migration) continue;

          change.key = migration.key;
          change.phase = migration.phase;
          changed = true;
        }
      }
    }

    if (!changed) continue;

    tokenUpdates.push({
      _id: token.id,
      delta
    });
  }

  if (tokenUpdates.length) {
    console.log(`ABF Alter | Migrating Active Effects on Scene: ${scene.name}`);
    await scene.updateEmbeddedDocuments("Token", tokenUpdates);
  }
}













/**
 * v1.6.2 — Psychic Matrix effect migration
 *
 * Moves:
 * system.effect20 -> system.matrixDetails.effect20.description
 * system.effect40 -> system.matrixDetails.effect40.description
 * etc.
 */
export async function migratePsychicMatrixEffects() {
  const effectKeys = [
    "effect20",
    "effect40",
    "effect80",
    "effect120",
    "effect140",
    "effect180",
    "effect240",
    "effect280",
    "effect320",
    "effect440"
  ];

  const buildPsychicMatrixUpdate = item => {
    if (item.type !== "psychicMatrix") return null;

    const system = item.system ?? {};
    const updateData = {};

    for (const key of effectKeys) {
      const oldValue = system[key];
      if (oldValue === undefined || oldValue === null || oldValue === "") continue;

      const currentDescription = system.matrixDetails?.[key]?.description ?? "";

      if (!currentDescription.includes(oldValue)) {
        updateData[`system.matrixDetails.${key}.description`] = currentDescription
          ? `${currentDescription}\n\n${oldValue}`
          : oldValue;
      }

      updateData[`system.-=${key}`] = null;
    }

    return foundry.utils.isEmpty(updateData) ? null : updateData;
  };

  const migrateItemCollection = async items => {
    const updates = [];

    for (const item of items) {
      const updateData = buildPsychicMatrixUpdate(item);
      if (updateData) {
        updates.push({ _id: item.id, ...updateData });
      }
    }

    return updates;
  };

  // World actors embedded items
  for (const actor of game.actors.contents) {
    const updates = await migrateItemCollection(actor.items);

    if (updates.length) {
      console.log(`ABF Alter | Migrating psychicMatrix items on Actor: ${actor.name}`);
      await actor.updateEmbeddedDocuments("Item", updates);
    }
  }

  // World items
  const worldItemUpdates = await migrateItemCollection(game.items.contents);

  if (worldItemUpdates.length) {
    console.log(`ABF Alter | Migrating world psychicMatrix items: ${worldItemUpdates.length}`);
    await Item.updateDocuments(worldItemUpdates);
  }

  // Scene unlinked token delta items
  for (const scene of game.scenes.contents) {
    await migrateScenePsychicMatrixEffects(scene, effectKeys);
  }

  // World compendiums
  for (const pack of game.packs) {
    if (pack.metadata.packageType !== "world") continue;
    if (!["Actor", "Item", "Scene"].includes(pack.metadata.type)) continue;

    const wasLocked = pack.locked;
    await pack.configure({ locked: false });
    await pack.migrate();

    const docs = await pack.getDocuments();

    if (pack.metadata.type === "Actor") {
      for (const actor of docs) {
        const updates = await migrateItemCollection(actor.items);

        if (updates.length) {
          console.log(`ABF Alter | Migrating psychicMatrix items on Actor in ${pack.collection}: ${actor.name}`);
          await actor.updateEmbeddedDocuments("Item", updates);
        }
      }
    }

    if (pack.metadata.type === "Item") {
      const updates = await migrateItemCollection(docs);

      if (updates.length) {
        console.log(`ABF Alter | Migrating psychicMatrix items in ${pack.collection}: ${updates.length}`);
        await Item.updateDocuments(updates, { pack: pack.collection });
      }
    }

    if (pack.metadata.type === "Scene") {
      for (const scene of docs) {
        await migrateScenePsychicMatrixEffects(scene, effectKeys);
      }
    }

    await pack.configure({ locked: wasLocked });
  }

  ui.notifications.info("Migration v1.6.2: Psychic Matrix effects updated.");
}

async function migrateScenePsychicMatrixEffects(scene, effectKeys) {
  const tokenUpdates = [];

  for (const token of scene.tokens) {
    if (token.actorLink) continue;

    const tokenData = token.toObject();
    const items = tokenData.delta?.items ?? [];
    if (!items.length) continue;

    let changed = false;

    for (const item of items) {
      if (item.type !== "psychicMatrix") continue;

      item.system ??= {};
      item.system.matrixDetails ??= {};

      for (const key of effectKeys) {
        const oldValue = item.system[key];
        if (oldValue === undefined || oldValue === null || oldValue === "") continue;

        item.system.matrixDetails[key] ??= {};

        const currentDescription = item.system.matrixDetails[key].description ?? "";

        if (!currentDescription.includes(oldValue)) {
          item.system.matrixDetails[key].description = currentDescription
            ? `${currentDescription}\n\n${oldValue}`
            : oldValue;

          changed = true;
        }

        if (key in item.system) {
          delete item.system[key];
          changed = true;
        }
      }
    }

    if (!changed) continue;

    tokenData.delta = {
      ...(tokenData.delta ?? {}),
      items
    };

    tokenUpdates.push(tokenData);
  }

  if (tokenUpdates.length) {
    console.log(`ABF Alter | Migrating psychicMatrix items on Scene: ${scene.name}`);
    await scene.updateEmbeddedDocuments("Token", tokenUpdates);
  }
}
































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
    if (pack.metadata.packageType !== "world") continue;
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

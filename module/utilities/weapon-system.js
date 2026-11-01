/** Weapon combat and ammunition rules shared by Item, ItemSheet, and roller. */
const whole = value => Math.max(0, Math.floor(Number(value) || 0));
const clone = value => foundry.utils.deepClone(value);

export const ammoMode = weapon => weapon.system.ranged?.ammoHandling ?? "direct";
export const loadedCount = weapon => whole(weapon.system.ranged?.loadedAmmo?.quantity);

export function ammoStats(weapon, ammoId = null) {
    const ranged = weapon.system.ranged;
    const mode = ammoMode(weapon);
    if (mode === "none") return {
        id: "none", name: "", damage: 0, atPen: 0, break: 0,
        dmgType: weapon.system.primDmgT ?? "THR"
    };
    if (mode === "loaded") {
        const loaded = ranged.loadedAmmo;
        if (!loaded || whole(loaded.quantity) === 0) return null;
        return { id: loaded.itemId, name: loaded.name, damage: loaded.damage, atPen: loaded.atPen, break: loaded.break, dmgType: loaded.dmgType };
    }
    const id = ammoId ?? ranged.selectedAmmo;
    const item = weapon.parent?.items?.get(id);
    if (!item || item.type !== "ammo" || item.system.type !== "ammo") return null;
    return { id: item.id, name: item.name, damage: item.system.damage, atPen: item.system.atPen, break: item.system.break, dmgType: item.system.dmgType };
}

/** A ranged profile can create an intrinsic shot, or use an ammo source without expending it. */
export function profileUsesAmmo(profile) {
    return !profile?.ammoIndependent && profile?.properties?.ammunition?.bool !== false;
}

export function ammoCost(weapon, profile) {
    if (ammoMode(weapon) === "none") return 0;
    if (!Number(weapon.system.profilesVersion) && !profile?.isFallback) {
        if (profile.ignoreAmmo) return 0;
        if (profile.properties?.ammunition?.bool)
            return profile.rangedAmmoConsumed ? 0 : whole(profile.rangedAmmoConsumedValue);
        return weapon.system.ranged.infiniteAmmo ? 0 : whole(weapon.system.ranged.ammoConsumption);
    }
    if (!profileUsesAmmo(profile)) return 0;
    if (weapon.system.ranged.infiniteAmmo || profile?.ammoNoConsume) return 0;
    return whole(profile?.ammoCustomConsumption ? profile.ammoConsumption : weapon.system.ranged.ammoConsumption);
}
export function ammoRequirement(weapon, profile) {
    if (ammoMode(weapon) === "none" || (Number(weapon.system.profilesVersion) ? !profileUsesAmmo(profile) : (!profile?.isFallback && profile?.ignoreAmmo))) return 0;
    return Math.max(1, ammoCost(weapon, profile));
}

/** The display/roll order is numeric sort, with creation order as the stable tie-breaker. */
export function sortedProfileIds(attacks = {}) {
    return Object.entries(attacks)
        .map(([id, profile], index) => ({ id, index, sort: Number(profile.sort ?? 0) }))
        .sort((a, b) => a.sort - b.sort || a.index - b.index)
        .map(entry => entry.id);
}

/** Build minimal Foundry updates: never replace whole profiles just to reorder. */
export function profileSortUpdate(ids) {
    return Object.fromEntries(ids.map((id, index) => [`system.attacks.${id}.sort`, index]));
}

/** A stable profile ID is kept separately from its user-defined sort position. */
export function weaponProfiles(weapon, role) {
    if (!weapon) return [];
    const type = weapon.system.info.type;
    const derived = weapon.system.derived;
    const fallback = (mode, name, id) => ({
        key: id, originalIndex: -1, isFallback: true,
        profile: {
            isFallback:true, name, profileType: role, atkType: mode, properties: { predetermined: {bool:false}, note: {bool:false}, precision: {bool: false}, vorpal: {bool:false}, throwable: {bool:false}, trapping: {bool:false}, ammunition: {bool:mode === "ranged"}, damageType: {bool:false} },
            attack:0, block:0, dodge:0, damage:0, atPen:0, breakage:0, criticalMod:0,
            finalCriticalBoost: Number(weapon.system.criticalBoost ?? 0),
            finalAttack: Number(derived.baseAtk ?? 0), finalBlock: Number(derived.baseBlk ?? 0), finalDodge: Number(derived.baseDod ?? 0),
            finalAtPen: Number(mode === "ranged" ? derived.rangedAtPen : derived.meleeAtPen),
            finalBreakage: Number(mode === "ranged" ? derived.rangedBreak : derived.meleeBreak),
            finalDamage: Number(mode === "ranged" ? derived.rangedDmg : derived.meleeDmg),
            damageMultiplier: 1, ammoIndependent: false, ammoNoConsume: false, ammoCustomConsumption: false,
            chatNote:"", attackNote:""
        }
    });
    const entries = Object.entries(weapon.system.attacks ?? {}).map(([key, profile], originalIndex) => ({key, originalIndex, profile}))
        .filter(({profile}) => role === "offensive" ? ["offensive", "both"].includes(profile.profileType) : ["defensive", "both"].includes(profile.profileType))
        .sort((a,b)=>Number(a.profile.sort ?? 0)-Number(b.profile.sort ?? 0) || a.originalIndex-b.originalIndex);
    if (role === "offensive" && type !== "shield") {
        // Always provide a standard action even if the player creates specialized attacks.
        entries.unshift(fallback("melee", "Standard Melee Attack", "__default_melee"));
        if (type === "ranged") entries.shift();
        if (type === "ranged" || type === "hybrid") entries.unshift(fallback("ranged", "Standard Ranged Attack", "__default_ranged"));
    }
    if (role === "defensive") entries.unshift(fallback("melee", "Standard Defense", "__default_defense"));
    return entries;
}

export function resolvedAttack(weapon, profile, ammo = null) {
    const mode = weapon.system.info.type === "hybrid" ? (profile.atkType ?? "melee") : weapon.system.info.type;
    const ranged = mode === "ranged";
    const d = weapon.system.derived;
    const a = ammo ?? {damage:0, atPen:0, break:0, dmgType:weapon.system.primDmgT ?? "THR"};
    const weaponSpeed = Number(d.finalWeaponSpeed ?? 0);
    const baseDmg = ranged ? Number(d.rangedDmgPreAmmo ?? 0) + Number(a.damage ?? 0) : Number(d.meleeDmg ?? 0);
    const basePen = ranged ? Number(weapon.system.ranged.ammoAtPenMod ?? 0) + Number(a.atPen ?? 0) : Number(d.meleeAtPen ?? 0);
    const baseBreak = ranged ? Number(weapon.system.ranged.ammoBreakMod ?? 0) + Number(a.break ?? 0) : Number(d.meleeBreak ?? 0);
    if (!Number(weapon.system.profilesVersion) && !profile.isFallback) {
        const replaced = stat => Boolean(profile.properties?.[stat]?.bool);
        return {
            mode,
            speed: weaponSpeed,
            criticalBoost: Number(weapon.system.criticalBoost ?? 0) + Number(profile.criticalMod ?? 0),
            attack: Number(profile.attack ?? 0) + (replaced("attack") ? 0 : Number(d.baseAtk ?? 0)),
            block: Number(profile.block ?? 0) + (replaced("block") ? 0 : Number(d.baseBlk ?? 0)),
            dodge: Number(profile.dodge ?? 0) + (replaced("dodge") ? 0 : Number(d.baseDod ?? 0)),
            damage: Number(profile.damage ?? 0) + (replaced("damage") ? 0 : baseDmg),
            atPen: basePen + Number(profile.atPen ?? 0),
            breakage: baseBreak + Number(profile.breakage ?? 0),
            dmgType: profile.properties?.damageType?.bool ? profile.damageType : (ranged ? a.dmgType : weapon.system.primDmgT)
        };
    }
    // A checked property makes that one input the full value; otherwise the
    // input adds to the weapon baseline. No independent replacement-base field.
    const value = (base,stat) => Number(profile[stat] ?? 0) +
        (profile.properties?.[stat]?.bool ? 0 : Number(base));
    return {
        mode,
        speed: weaponSpeed,
        criticalBoost: Number(weapon.system.criticalBoost ?? 0) + Number(profile.criticalMod ?? 0),
        attack: value(d.baseAtk,"attack"),
        block: value(d.baseBlk,"block"),
        dodge: value(d.baseDod,"dodge"),
        damage: Math.floor(value(baseDmg,"damage") * Number(profile.damageMultiplier ?? 1)),
        atPen: value(basePen,"atPen"),
        breakage: value(baseBreak,"breakage"),
        dmgType: profile.properties?.damageType?.bool ? profile.damageType : (ranged ? a.dmgType : weapon.system.primDmgT)
    };
}

function inventoryAmmo(weapon, id) {
    const item = weapon.parent?.items?.get(id);
    return item?.type === "ammo" && item.system.type === "ammo" ? item : null;
}

function sameAmmoType(loaded, item) {
    if (!loaded || !item) return false;
    const prior = loaded.itemData ?? {};
    return loaded.name === item.name &&
        Number(loaded.damage) === Number(item.system.damage) &&
        Number(loaded.atPen) === Number(item.system.atPen) &&
        Number(loaded.break) === Number(item.system.break) &&
        loaded.dmgType === item.system.dmgType &&
        JSON.stringify(prior.system?.properties ?? {}) === JSON.stringify(item.toObject().system?.properties ?? {}) &&
        JSON.stringify(prior.effects ?? []) === JSON.stringify(item.toObject().effects ?? []);
}

/** Loads only matching rounds; loading an incompatible type requires unloading first. */
export async function loadWeaponAmmo(weapon, id, amount = Infinity) {
    if (ammoMode(weapon) !== "loaded" || !weapon.parent) throw Error("This weapon is not configured for loaded ammunition.");
    const item = inventoryAmmo(weapon, id);
    if (!item) throw Error("Select ammunition from this character's inventory.");
    const loaded = weapon.system.ranged.loadedAmmo;
    const current = loadedCount(weapon);
    if (current && loaded.itemId !== id && !sameAmmoType(loaded,item))
        throw Error("Unload the current ammunition before switching types.");
    const capacity = whole(weapon.system.ranged.magSizeMax);
    const count = Math.min(whole(amount), whole(item.system.quantity), capacity - current);
    if (count <= 0) throw Error("No ammunition available or the weapon is already full.");
    const snapshot = clone(item.toObject());
    const state = current ? { ...clone(loaded), quantity: current + count } : {
        itemId: item.id, name: item.name, quantity: current + count,
        damage: Number(item.system.damage ?? 0), dmgType: item.system.dmgType ?? "THR",
        atPen: Number(item.system.atPen ?? 0), break: Number(item.system.break ?? 0),
        itemData: snapshot
    };
    // Commit inventory first, and restore it on failure. Do not delete empty stacks.
    await item.update({"system.quantity": whole(item.system.quantity) - count});
    try {
        await weapon.update({"system.ranged.loadedAmmo": state, "system.ranged.magSize": current+count, "system.ranged.isLoaded":true, "system.ranged.ammoModelVersion":1});
    } catch (error) {
        await item.update({"system.quantity":whole(item.system.quantity) + count});
        throw error;
    }
    return count;
}

export async function unloadWeaponAmmo(weapon) {
    if (ammoMode(weapon) !== "loaded" || !weapon.parent) throw Error("This weapon is not configured for loaded ammunition.");
    const loaded = weapon.system.ranged.loadedAmmo;
    const count = loadedCount(weapon);
    if (!count) return 0;
    let item = inventoryAmmo(weapon, loaded.itemId);
    // Move ammo out of the weapon before restoring it to inventory, to avoid duplicates.
    await weapon.update({"system.ranged.loadedAmmo.quantity":0, "system.ranged.magSize":0, "system.ranged.isLoaded":false});
    try {
        if (item) {
            await item.update({"system.quantity": whole(item.system.quantity) + count});
        } else {
            const data = clone(loaded.itemData ?? {});
            if (data.type !== "ammo") throw Error("The loaded ammo snapshot is missing its item data.");
            delete data._id;
            data.system.quantity = count;
            await weapon.parent.createEmbeddedDocuments("Item",[data]);
        }
    } catch(error) {
        await weapon.update({"system.ranged.loadedAmmo.quantity": count, "system.ranged.magSize":count, "system.ranged.isLoaded":true});
        throw error;
    }
    return count;
}

export async function spendWeaponAmmo(weapon, profile, id) {
    const mode = ammoMode(weapon);
    const cost = ammoCost(weapon, profile);
    const required = ammoRequirement(weapon, profile);
    if (!required) return;
    if (mode === "loaded") {
        const count = loadedCount(weapon);
        if (count < required) throw Error(`Not enough rounds loaded (${count}/${required}).`);
        if (cost) await weapon.update({"system.ranged.loadedAmmo.quantity":count-cost,"system.ranged.magSize":count-cost,"system.ranged.isLoaded":count-cost>0});
    } else if (mode === "direct") {
        const item = inventoryAmmo(weapon,id);
        if (!item || whole(item.system.quantity) < required) throw Error(`Not enough ammunition available (${required} required).`);
        if (cost) await item.update({"system.quantity":whole(item.system.quantity)-cost});
    }
}

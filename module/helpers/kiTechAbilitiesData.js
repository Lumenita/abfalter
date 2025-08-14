export function kiTechAbilitiesData() {
    return [
        {
            id: "attackAbilitySingle",
            cat: "offensive",
            name: game.i18n.localize("abfalter.kiAbilityData.attackAbilitySingle"),
            description: game.i18n.localize("abfalter.kiAbilityData.attackAbilitySingle"),
            frequency: "action",
            actionType: "attack",
            elements: ["air", "fire", "darkness"],
            primaryChar: "dexterity",
            optionalChar: [
                { type: "agility", value: 2 },
                { type: "strength", value: 2 },
                { type: "power", value: 2 },
                { type: "willPower", value: 3 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.atk10"), prim: 2, sec: 4, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.atk25"), prim: 3, sec: 5, mk: 5, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.atk40"), prim: 4, sec: 6, mk: 10, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.atk50"), prim: 5, sec: 8, mk: 15, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.atk75"), prim: 9, sec: 12, mk: 20, maint: 6, mis: 12, grs: 21, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.atk90"), prim: 12, sec: 15, mk: 25, maint: 8, mis: 16, grs: 28, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.atk100"), prim: 14, sec: 18, mk: 30, maint: 10, mis: 20, grs: 35, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.atk125"), prim: 18, sec: 22, mk: 35, maint: 12, mis: 24, grs: 42, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.atk150"), prim: 22, sec: 26, mk: 40, maint: 14, mis: 28, grs: 49, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.atk175"), prim: 26, sec: 32, mk: 45, maint: 16, mis: 32, grs: 56, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.atk200"), prim: 30, sec: 36, mk: 50, maint: 18, mis: 36, grs: 63, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "attackAbilityMultiple",
            cat: "offensive",
            name: game.i18n.localize("abfalter.kiAbilityData.attackAbilityMultiple"),
            description: game.i18n.localize("abfalter.kiAbilityData.attackAbilityMultipleDesc"),
            frequency: "turn",
            actionType: "attack",
            elements: ["air", "fire", "darkness"],
            primaryChar: "dexterity",
            optionalChar: [
                { type: "agility", value: 2 },
                { type: "strength", value: 2 },
                { type: "power", value: 2 },
                { type: "willPower", value: 3 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.atk10"), prim: 4, sec: 6, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.atk25"), prim: 8, sec: 11, mk: 15, maint: 5, mis: 10, grs: 18, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.atk40"), prim: 10, sec: 13, mk: 20, maint: 8, mis: 16, grs: 28, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.atk50"), prim: 12, sec: 15, mk: 30, maint: 10, mis: 20, grs: 35, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.atk75"), prim: 18, sec: 22, mk: 50, maint: 14, mis: 28, grs: 49, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.atk90"), prim: 24, sec: 29, mk: 60, maint: 18, mis: 36, grs: 63, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.atk100"), prim: 28, sec: 32, mk: 70, maint: 20, mis: 40, grs: 70, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "predeterminedAttack",
            cat: "offensive",
            name: game.i18n.localize("abfalter.kiAbilityData.predeterminedAttack"),
            description: game.i18n.localize("abfalter.kiAbilityData.predeterminedAttackDesc"),
            frequency: "action",
            actionType: "attack",
            elements: ["light", "darkness", "earth"],
            primaryChar: "power",
            optionalChar: [
                { type: "agility", value: 2 },
                { type: "dexterity", value: 2 },
                { type: "strength", value: 3 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.moderate80"), prim: 2, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.difficult120"), prim: 4, sec: 6, mk: 5, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.veryDifficult140"), prim: 6, sec: 9, mk: 5, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.absurd180"), prim: 8, sec: 11, mk: 10, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.almostImpossible240"), prim: 12, sec: 15, mk: 15, maint: 6, mis: 12, grs: 21, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.impossible280"), prim: 16, sec: 20, mk: 25, maint: 8, mis: 16, grs: 28, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.inhuman320"), prim: 20, sec: 24, mk: 35, maint: 10, mis: 20, grs: 35, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.zen440"), prim: 26, sec: 32, mk: 45, maint: 12, mis: 24, grs: 42, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "counterattackAbility",
            cat: "offensive",
            name: game.i18n.localize("abfalter.kiAbilityData.counterattackAbility"),
            description: game.i18n.localize("abfalter.kiAbilityData.counterattackAbilityDesc"),
            frequency: "action",
            actionType: "counterattack",
            elements: ["water", "air", "earth"],
            primaryChar: "dexterity",
            optionalChar: [
                { type: "agility", value: 2 },
                { type: "strength", value: 2 },
                { type: "power", value: 2 },
                { type: "willPower", value: 3 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.atk10"), prim: 1, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.atk25"), prim: 2, sec: 4, mk: 5, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.atk40"), prim: 3, sec: 5, mk: 10, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.atk50"), prim: 4, sec: 6, mk: 10, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.atk75"), prim: 6, sec: 9, mk: 15, maint: 6, mis: 12, grs: 21, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.atk90"), prim: 9, sec: 12, mk: 20, maint: 8, mis: 16, grs: 28, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.atk100"), prim: 12, sec: 15, mk: 25, maint: 10, mis: 20, grs: 35, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.atk125"), prim: 14, sec: 18, mk: 30, maint: 12, mis: 24, grs: 42, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.atk150"), prim: 18, sec: 22, mk: 35, maint: 14, mis: 28, grs: 49, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.atk175"), prim: 22, sec: 26, mk: 40, maint: 16, mis: 32, grs: 56, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.atk200"), prim: 26, sec: 32, mk: 45, maint: 18, mis: 36, grs: 63, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "combatManeuversAimingSingle",
            cat: "offensive",
            name: game.i18n.localize("abfalter.kiAbilityData.combatManeuversAimingSingle"),
            description: game.i18n.localize("abfalter.kiAbilityData.combatManeuversAimingSingleDesc"),
            frequency: "action",
            actionType: "attack",
            elements: ["air"],
            primaryChar: "dexterity",
            optionalChar: [
                { type: "agility", value: 1 },
                { type: "consti", value: 2 },
                { type: "power", value: 2 },
                { type: "willPower", value: 2 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.precision10"), prim: 1, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.precision25"), prim: 2, sec: 4, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.precision50"), prim: 3, sec: 5, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.precision75"), prim: 4, sec: 6, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.precision100"), prim: 6, sec: 9, mk: 15, maint: 3, mis: 6, grs: 11, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.precision120"), prim: 8, sec: 11, mk: 20, maint: 3, mis: 6, grs: 11, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "combatManeuversAimingMultiple",
            cat: "offensive",
            name: game.i18n.localize("abfalter.kiAbilityData.combatManeuversAimingMultiple"),
            description: game.i18n.localize("abfalter.kiAbilityData.combatManeuversAimingMultipleDesc"),
            frequency: "turn",
            actionType: "attack",
            elements: ["air"],
            primaryChar: "dexterity",
            optionalChar: [
                { type: "agility", value: 1 },
                { type: "consti", value: 2 },
                { type: "power", value: 2 },
                { type: "willPower", value: 2 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.precision10"), prim: 2, sec: 4, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.precision25"), prim: 4, sec: 6, mk: 15, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.precision50"), prim: 6, sec: 9, mk: 20, maint: 4, mis: 8, grs: 14, lvl: 2 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "indirectAttack",
            cat: "offensive",
            name: game.i18n.localize("abfalter.kiAbilityData.indirectAttack"),
            description: game.i18n.localize("abfalter.kiAbilityData.indirectAttackDesc"),
            frequency: "action",
            actionType: "attack",
            elements: ["water", "air", "darkness"],
            primaryChar: "power",
            optionalChar: [
                { type: "agility", value: 2 },
                { type: "consti", value: 2 },
                { type: "dexterity", value: 2 },
                { type: "willPower", value: 2 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.indirectAttack1"), prim: 3, sec: 5, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.indirectAttack2"), prim: 6, sec: 9, mk: 20, maint: 4, mis: 8, grs: 14, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.indirectAttack3"), prim: 9, sec: 12, mk: 30, maint: 6, mis: 12, grs: 21, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "camouflageAttack",
            cat: "offensive",
            name: game.i18n.localize("abfalter.kiAbilityData.camouflageAttack"),
            description: game.i18n.localize("abfalter.kiAbilityData.camouflageAttackDesc"),
            frequency: "action",
            actionType: "attack",
            elements: ["water", "air", "darkness"],
            primaryChar: "power",
            optionalChar: [
                { type: "agility", value: 2 },
                { type: "consti", value: 3 },
                { type: "dexterity", value: 1 },
                { type: "willPower", value: 2 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.moderate80"), prim: 1, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.difficult120"), prim: 2, sec: 4, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.veryDifficult140"), prim: 3, sec: 5, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.absurd180"), prim: 5, sec: 8, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.almostImpossible240"), prim: 6, sec: 9, mk: 10, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.impossible280"), prim: 7, sec: 10, mk: 15, maint: 4, mis: 8, grs: 14, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.inhuman320"), prim: 8, sec: 11, mk: 20, maint: 5, mis: 10, grs: 18, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.zen440"), prim: 10, sec: 13, mk: 25, maint: 6, mis: 12, grs: 21, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "blockAbilitySingle",
            cat: "defensive",
            name: game.i18n.localize("abfalter.kiAbilityData.blockAbilitySingle"),
            description: game.i18n.localize("abfalter.kiAbilityData.blockAbilitySingleDesc"),
            frequency: "action",
            actionType: "defense",
            elements: ["water", "light", "earth"],
            primaryChar: "dexterity",
            optionalChar: [
                { type: "agility", value: 2 },
                { type: "strength", value: 2 },
                { type: "power", value: 2 },
                { type: "willPower", value: 3 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.block10"), prim: 2, sec: 4, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.block25"), prim: 3, sec: 5, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.block40"), prim: 4, sec: 6, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.block50"), prim: 5, sec: 8, mk: 15, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.block75"), prim: 9, sec: 12, mk: 20, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.block90"), prim: 12, sec: 15, mk: 25, maint: 5, mis: 10, grs: 18, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.block100"), prim: 14, sec: 18, mk: 30, maint: 8, mis: 16, grs: 28, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.block125"), prim: 18, sec: 22, mk: 35, maint: 10, mis: 20, grs: 35, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.block150"), prim: 22, sec: 26, mk: 40, maint: 12, mis: 24, grs: 42, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.block175"), prim: 26, sec: 32, mk: 45, maint: 14, mis: 28, grs: 49, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.block200"), prim: 30, sec: 36, mk: 50, maint: 16, mis: 32, grs: 56, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "blockAbilityMultiple",
            cat: "defensive",
            name: game.i18n.localize("abfalter.kiAbilityData.blockAbilityMultiple"),
            description: game.i18n.localize("abfalter.kiAbilityData.blockAbilityMultipleDesc"),
            frequency: "turn",
            actionType: "defense",
            elements: ["water", "light", "earth"],
            primaryChar: "dexterity",
            optionalChar: [
                { type: "agility", value: 2 },
                { type: "strength", value: 2 },
                { type: "power", value: 2 },
                { type: "willPower", value: 3 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.block10"), prim: 4, sec: 6, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.block25"), prim: 6, sec: 9, mk: 15, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.block40"), prim: 9, sec: 12, mk: 20, maint: 6, mis: 12, grs: 21, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.block50"), prim: 12, sec: 15, mk: 35, maint: 9, mis: 18, grs: 32, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.block75"), prim: 18, sec: 22, mk: 50, maint: 12, mis: 24, grs: 42, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.block90"), prim: 26, sec: 32, mk: 65, maint: 15, mis: 30, grs: 53, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.block100"), prim: 30, sec: 36, mk: 75, maint: 18, mis: 36, grs: 63, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "limitedBlockAbility",
            cat: "defensive",
            name: game.i18n.localize("abfalter.kiAbilityData.limitedBlockAbility"),
            description: game.i18n.localize("abfalter.kiAbilityData.limitedBlockAbilityDesc"),
            frequency: "action",
            actionType: "defense",
            elements: ["water", "light", "earth"],
            primaryChar: "dexterity",
            optionalChar: [
                { type: "agility", value: 2 },
                { type: "strength", value: 2 },
                { type: "power", value: 2 },
                { type: "willPower", value: 3 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.block10"), prim: 1, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.block25"), prim: 2, sec: 4, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.block40"), prim: 3, sec: 5, mk: 10, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.block50"), prim: 4, sec: 6, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.block75"), prim: 6, sec: 9, mk: 15, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.block90"), prim: 8, sec: 11, mk: 20, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.block100"), prim: 10, sec: 13, mk: 25, maint: 6, mis: 12, grs: 21, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.block125"), prim: 12, sec: 15, mk: 30, maint: 8, mis: 16, grs: 28, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.block150"), prim: 16, sec: 20, mk: 35, maint: 10, mis: 20, grs: 35, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.block175"), prim: 20, sec: 24, mk: 40, maint: 12, mis: 24, grs: 42, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.block200"), prim: 24, sec: 29, mk: 45, maint: 14, mis: 28, grs: 49, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "dodgeAbilitySingle",
            cat: "defensive",
            name: game.i18n.localize("abfalter.kiAbilityData.dodgeAbilitySingle"),
            description: game.i18n.localize("abfalter.kiAbilityData.dodgeAbilitySingleDesc"),
            frequency: "action",
            actionType: "defense",
            elements: ["water", "air", "light"],
            primaryChar: "agility",
            optionalChar: [
                { type: "consti", value: 2 },
                { type: "dexterity", value: 2 },
                { type: "power", value: 2 },
                { type: "willPower", value: 3 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.dodge10"), prim: 2, sec: 4, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.dodge25"), prim: 3, sec: 5, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.dodge40"), prim: 4, sec: 6, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.dodge50"), prim: 5, sec: 8, mk: 15, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.dodge75"), prim: 8, sec: 11, mk: 20, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.dodge90"), prim: 12, sec: 15, mk: 25, maint: 5, mis: 10, grs: 18, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.dodge100"), prim: 14, sec: 18, mk: 30, maint: 8, mis: 16, grs: 28, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.dodge125"), prim: 18, sec: 22, mk: 35, maint: 10, mis: 20, grs: 35, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.dodge150"), prim: 22, sec: 26, mk: 40, maint: 12, mis: 24, grs: 42, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.dodge175"), prim: 26, sec: 32, mk: 45, maint: 14, mis: 28, grs: 49, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.dodge200"), prim: 30, sec: 36, mk: 50, maint: 16, mis: 32, grs: 56, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "dodgeAbilityMultiple",
            cat: "defensive",
            name: game.i18n.localize("abfalter.kiAbilityData.dodgeAbilityMultiple"),
            description: game.i18n.localize("abfalter.kiAbilityData.dodgeAbilityMultipleDesc"),
            frequency: "turn",
            actionType: "defense",
            elements: ["water", "air", "light"],
            primaryChar: "agility",
            optionalChar: [
                { type: "consti", value: 2 },
                { type: "dexterity", value: 2 },
                { type: "power", value: 2 },
                { type: "willPower", value: 3 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.dodge10"), prim: 4, sec: 6, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.dodge25"), prim: 6, sec: 9, mk: 15, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.dodge40"), prim: 9, sec: 12, mk: 20, maint: 6, mis: 12, grs: 21, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.dodge50"), prim: 12, sec: 15, mk: 35, maint: 9, mis: 18, grs: 32, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.dodge75"), prim: 18, sec: 22, mk: 50, maint: 12, mis: 24, grs: 42, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.dodge90"), prim: 26, sec: 32, mk: 65, maint: 15, mis: 30, grs: 53, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.dodge100"), prim: 30, sec: 36, mk: 75, maint: 18, mis: 36, grs: 63, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "limitedDodgeAbility",
            cat: "defensive",
            name: game.i18n.localize("abfalter.kiAbilityData.limitedDodgeAbility"),
            description: game.i18n.localize("abfalter.kiAbilityData.limitedDodgeAbilityDesc"),
            frequency: "action",
            actionType: "defense",
            elements: ["air", "light", "darkness"],
            primaryChar: "agility",
            optionalChar: [
                { type: "consti", value: 2 },
                { type: "dexterity", value: 2 },
                { type: "power", value: 2 },
                { type: "willPower", value: 3 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.dodge10"), prim: 1, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.dodge25"), prim: 2, sec: 4, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.dodge40"), prim: 3, sec: 5, mk: 10, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.dodge50"), prim: 4, sec: 6, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.dodge75"), prim: 6, sec: 9, mk: 15, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.dodge90"), prim: 8, sec: 11, mk: 20, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.dodge100"), prim: 10, sec: 13, mk: 25, maint: 6, mis: 12, grs: 21, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.dodge125"), prim: 12, sec: 15, mk: 30, maint: 8, mis: 16, grs: 28, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.dodge150"), prim: 16, sec: 20, mk: 35, maint: 10, mis: 20, grs: 35, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.dodge175"), prim: 20, sec: 24, mk: 40, maint: 12, mis: 24, grs: 42, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.dodge200"), prim: 24, sec: 29, mk: 45, maint: 14, mis: 28, grs: 49, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "predeterminedDefense",
            cat: "defensive",
            name: game.i18n.localize("abfalter.kiAbilityData.predeterminedDefense"),
            description: game.i18n.localize("abfalter.kiAbilityData.predeterminedDefenseDesc"),
            frequency: "action",
            actionType: "defense",
            elements: ["water", "light", "earth"],
            primaryChar: "dexterity",
            optionalChar: [
                { type: "agility", value: 1 },
                { type: "consti", value: 3 },
                { type: "power", value: 2 },
                { type: "willPower", value: 2 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.moderate80"), prim: 2, sec: 4, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.difficult120"), prim: 4, sec: 6, mk: 5, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.veryDifficult140"), prim: 6, sec: 9, mk: 5, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.absurd180"), prim: 8, sec: 11, mk: 10, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.almostImpossible240"), prim: 12, sec: 15, mk: 15, maint: 6, mis: 12, grs: 21, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.impossible280"), prim: 16, sec: 20, mk: 25, maint: 8, mis: 16, grs: 28, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.inhuman320"), prim: 20, sec: 24, mk: 35, maint: 10, mis: 20, grs: 35, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.zen440"), prim: 26, sec: 32, mk: 45, maint: 12, mis: 24, grs: 42, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "damageAugmentationSingle",
            cat: "destructive",
            name: game.i18n.localize("abfalter.kiAbilityData.damageAugmentationSingle"),
            description: game.i18n.localize("abfalter.kiAbilityData.damageAugmentationSingleDesc"),
            frequency: "action",
            actionType: "attack",
            elements: ["fire", "earth"],
            primaryChar: "strength",
            optionalChar: [
                { type: "consti", value: 1 },
                { type: "dexterity", value: 3 },
                { type: "power", value: 2 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.damage10"), prim: 1, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damage25"), prim: 2, sec: 4, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damage40"), prim: 3, sec: 5, mk: 10, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damage50"), prim: 4, sec: 6, mk: 15, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damage75"), prim: 6, sec: 9, mk: 20, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damage90"), prim: 8, sec: 11, mk: 25, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damage100"), prim: 10, sec: 13, mk: 30, maint: 5, mis: 10, grs: 18, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damage125"), prim: 14, sec: 18, mk: 35, maint: 6, mis: 12, grs: 21, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damage150"), prim: 16, sec: 20, mk: 40, maint: 8, mis: 16, grs: 28, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damage175"), prim: 18, sec: 22, mk: 45, maint: 10, mis: 20, grs: 35, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damage200"), prim: 20, sec: 24, mk: 50, maint: 12, mis: 24, grs: 42, lvl: 3 }
            ],
            hasAdditionalEffect: true,
            additions: [
                {
                    groupId: "sacrifice",
                    title: game.i18n.localize("abfalter.kiAbilityData.advSacrificeTitle"),
                    type: "advantage",
                    exclusive: true,
                    options: [
                        {
                            optionId: "vitalSacrifice",
                            name: game.i18n.localize("abfalter.kiAbilityData.vitalSacrifice"),
                            description: game.i18n.localize("abfalter.kiAbilityData.vitalSacrificeDesc"),
                            cost: 4,
                            mk: 15,
                            maint: 3,
                            mis: 6,
                            grs: 11
                        },
                        {
                            optionId: "doubleVitalSacrifice",
                            name: game.i18n.localize("abfalter.kiAbilityData.doubleVitalSacrifice"),
                            description: game.i18n.localize("abfalter.kiAbilityData.doubleVitalSacrificeDesc"),
                            cost: 10,
                            mk: 50,
                            maint: 4,
                            mis: 8,
                            grs: 14
                        },
                        {
                            optionId: "healthSacrifice",
                            name: game.i18n.localize("abfalter.kiAbilityData.healthSacrifice"),
                            description: game.i18n.localize("abfalter.kiAbilityData.healthSacrificeDesc"),
                            cost: 2,
                            mk: 10,
                            maint: 2,
                            mis: 4,
                            grs: 7
                        },
                        {
                            optionId: "characteristicSacrifice",
                            name: game.i18n.localize("abfalter.kiAbilityData.characteristicSacrifice"),
                            description: game.i18n.localize("abfalter.kiAbilityData.characteristicSacrificeDesc"),
                            cost: 2,
                            mk: 10,
                            maint: 2,
                            mis: 4,
                            grs: 7
                        }
                    ]
                },
                {
                    groupId: "limitedDamage",
                    title: game.i18n.localize("abfalter.kiAbilityData.genericAdv"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "limitedDamage",
                            name: game.i18n.localize("abfalter.kiAbilityData.limitedDamage"),
                            description: game.i18n.localize("abfalter.kiAbilityData.limitedDamageDesc"),
                            cost: 12,
                            mk: 30,
                            maint: 4,
                            mis: 8,
                            grs: 14
                        }
                    ]
                }
            ]
        },
        {
            id: "damageAugmentationMultiple",
            cat: "destructive",
            name: game.i18n.localize("abfalter.kiAbilityData.damageAugmentationMultiple"),
            description: game.i18n.localize("abfalter.kiAbilityData.damageAugmentationMultipleDesc"),
            frequency: "turn",
            actionType: "attack",
            elements: ["fire", "earth"],
            primaryChar: "strength",
            optionalChar: [
                { type: "consti", value: 1 },
                { type: "dexterity", value: 3 },
                { type: "power", value: 2 },
                { type: "willPower", value: 2 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.damage10"), prim: 2, sec: 4, mk: 10, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damage25"), prim: 3, sec: 5, mk: 15, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damage40"), prim: 5, sec: 8, mk: 20, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damage50"), prim: 7, sec: 10, mk: 25, maint: 4, mis: 8, grs: 14, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damage75"), prim: 10, sec: 13, mk: 35, maint: 6, mis: 12, grs: 21, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damage90"), prim: 12, sec: 15, mk: 40, maint: 8, mis: 16, grs: 28, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damage100"), prim: 14, sec: 18, mk: 50, maint: 10, mis: 20, grs: 35, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "damageMultiplierSingle",
            cat: "destructive",
            name: game.i18n.localize("abfalter.kiAbilityData.damageMultiplierSingle"),
            description: game.i18n.localize("abfalter.kiAbilityData.damageMultiplierSingleDesc"),
            frequency: "action",
            actionType: "attack",
            elements: ["fire", "earth"],
            primaryChar: "strength",
            optionalChar: [
                { type: "consti", value: 2 },
                { type: "dexterity", value: 3 },
                { type: "power", value: 1 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.x2mult"), prim: 10, sec: 15, mk: 25, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.x3mult"), prim: 15, sec: 20, mk: 40, maint: 8, mis: 16, grs: 28, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.x4mult"), prim: 20, sec: 30, mk: 80, maint: 12, mis: 24, grs: 42, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "damageMultiplierMultiple",
            cat: "destructive",
            name: game.i18n.localize("abfalter.kiAbilityData.damageMultiplierMultiple"),
            description: game.i18n.localize("abfalter.kiAbilityData.damageMultiplierMultipleDesc"),
            frequency: "turn",
            actionType: "attack",
            elements: ["fire", "earth"],
            primaryChar: "strength",
            optionalChar: [
                { type: "consti", value: 2 },
                { type: "dexterity", value: 3 },
                { type: "power", value: 1 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.x2mult"), prim: 20, sec: 30, mk: 40, maint: 8, mis: 16, grs: 28, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.x3mult"), prim: 30, sec: 36, mk: 70, maint: 16, mis: 32, grs: 56, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.x4mult"), prim: 40, sec: 48, mk: 100, maint: 22, mis: 44, grs: 77, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "predeterminedDamageSingle",
            cat: "destructive",
            name: game.i18n.localize("abfalter.kiAbilityData.predeterminedDamageSingle"),
            description: game.i18n.localize("abfalter.kiAbilityData.predeterminedDamageSingleDesc"),
            frequency: "action",
            actionType: "attack",
            elements: ["fire", "earth"],
            primaryChar: "strength",
            optionalChar: [
                { type: "consti", value: 1 },
                { type: "dexterity", value: 3 },
                { type: "power", value: 2 },
                { type: "willPower", value: 2 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.50dmg"), prim: 1, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.100dmg"), prim: 3, sec: 5, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.120dmg"), prim: 5, sec: 8, mk: 15, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.150dmg"), prim: 7, sec: 10, mk: 20, maint: 5, mis: 10, grs: 18, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.180dmg"), prim: 9, sec: 12, mk: 25, maint: 7, mis: 14, grs: 28, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.200dmg"), prim: 12, sec: 15, mk: 30, maint: 8, mis: 18, grs: 32, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.250dmg"), prim: 15, sec: 19, mk: 35, maint: 12, mis: 24, grs: 42, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "predeterminedDamageMultiple",
            cat: "destructive",
            name: game.i18n.localize("abfalter.kiAbilityData.predeterminedDamageMultiple"),
            description: game.i18n.localize("abfalter.kiAbilityData.predeterminedDamageMultipleDesc"),
            frequency: "turn",
            actionType: "attack",
            elements: ["fire", "earth"],
            primaryChar: "strength",
            optionalChar: [
                { type: "consti", value: 1 },
                { type: "dexterity", value: 3 },
                { type: "power", value: 2 },
                { type: "willPower", value: 2 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.50dmg"), prim: 3, sec: 5, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.100dmg"), prim: 5, sec: 8, mk: 15, maint: 5, mis: 10, grs: 18, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.150dmg"), prim: 8, sec: 11, mk: 20, maint: 6, mis: 12, grs: 21, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.180dmg"), prim: 15, sec: 19, mk: 40, maint: 10, mis: 20, grs: 35, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.200dmg"), prim: 18, sec: 22, mk: 50, maint: 12, mis: 24, grs: 42, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "additionalAttacks",
            cat: "action",
            name: game.i18n.localize("abfalter.kiAbilityData.additionalAttacks"),
            description: game.i18n.localize("abfalter.kiAbilityData.additionalAttacksDesc"),
            frequency: "action",
            actionType: "attack",
            elements: ["water", "air"],
            primaryChar: "dexterity",
            optionalChar: [
                { type: "agility", value: 2 },
                { type: "consti", value: 1 },
                { type: "power", value: 3 },
                { type: "willPower", value: 3 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.additionalAttack1"), prim: 6, sec: 9, mk: 20, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.additionalAttack2"), prim: 12, sec: 15, mk: 30, maint: 6, mis: 12, grs: 21, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.additionalAttack3"), prim: 18, sec: 22, mk: 40, maint: 9, mis: 18, grs: 32, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.additionalAttack4"), prim: 24, sec: 29, mk: 50, maint: 12, mis: 24, grs: 42, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.additionalAttack5"), prim: 30, sec: 36, mk: 60, maint: 15, mis: 30, grs: 53, lvl: 3 }
            ],
            hasAdditionalEffect: true,
            additions: [
                {
                    groupId: "continuousAttack",
                    title: game.i18n.localize("abfalter.kiAbilityData.genericAdv"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "continuousAttack",
                            name: game.i18n.localize("abfalter.kiAbilityData.continuousAttack"),
                            description: game.i18n.localize("abfalter.kiAbilityData.continuousAttackDesc"),
                            cost: 10,
                            mk: 30,
                            maint: 5,
                            mis: 10,
                            grs: 18
                        }
                    ]
                },
                {
                    groupId: "addedFatigueBonus",
                    title: game.i18n.localize("abfalter.kiAbilityData.genericAdv"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "addedFatigueBonus",
                            name: game.i18n.localize("abfalter.kiAbilityData.addedFatigueBonus"),
                            description: game.i18n.localize("abfalter.kiAbilityData.addedFatigueBonusDesc"),
                            cost: 6,
                            mk: 20,
                            maint: 2,
                            mis: 4,
                            grs: 7
                        }
                    ]
                },
                {
                    groupId: "combo",
                    title: game.i18n.localize("abfalter.kiAbilityData.disadvComboTitle"),
                    type: "disadvantage",
                    exclusive: true,
                    options: [
                        {
                            optionId: "comboUpTo2",
                            name: game.i18n.localize("abfalter.kiAbilityData.comboUpTo2"),
                            description: game.i18n.localize("abfalter.kiAbilityData.comboUpToXDesc"),
                            cost: -3,
                            mk: -10
                        },
                        {
                            optionId: "combo3OrMore",
                            name: game.i18n.localize("abfalter.kiAbilityData.combo3OrMore"),
                            description: game.i18n.localize("abfalter.kiAbilityData.comboUpToXDesc"),
                            cost: -6,
                            mk: -20
                        }
                    ]
                }
            ]
        },
        {
            id: "limitedAdditionalAttack",
            cat: "action",
            name: game.i18n.localize("abfalter.kiAbilityData.limitedAdditionalAttack"),
            description: game.i18n.localize("abfalter.kiAbilityData.limitedAdditionalAttackDesc"),
            frequency: "action",
            actionType: "attack",
            elements: ["water", "air", "darkness"],
            primaryChar: "dexterity",
            optionalChar: [
                { type: "agility", value: 2 },
                { type: "consti", value: 1 },
                { type: "power", value: 3 },
                { type: "willPower", value: 3 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.additionalAttack1"), prim: 3, sec: 5, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.additionalAttack2"), prim: 6, sec: 9, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.additionalAttack3"), prim: 9, sec: 12, mk: 15, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.additionalAttack4"), prim: 12, sec: 15, mk: 20, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.additionalAttack5"), prim: 15, sec: 19, mk: 30, maint: 6, mis: 12, grs: 21, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.additionalAttack6"), prim: 18, sec: 22, mk: 40, maint: 8, mis: 16, grs: 28, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.additionalAttack8"), prim: 22, sec: 26, mk: 50, maint: 10, mis: 20, grs: 35, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.additionalAttack10"), prim: 26, sec: 32, mk: 60, maint: 12, mis: 24, grs: 42, lvl: 3 }
            ],
            hasAdditionalEffect: true,
            additions: [
                {
                    groupId: "continuousAttack",
                    title: game.i18n.localize("abfalter.kiAbilityData.genericAdv"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "continuousAttack",
                            name: game.i18n.localize("abfalter.kiAbilityData.continuousAttack"),
                            description: game.i18n.localize("abfalter.kiAbilityData.continuousAttackDesc"),
                            cost: 10,
                            mk: 30,
                            maint: 5,
                            mis: 10,
                            grs: 18
                        }
                    ]
                },
            ]
        },
        {
            id: "additionalDefenses",
            cat: "action",
            name: game.i18n.localize("abfalter.kiAbilityData.additionalDefenses"),
            description: game.i18n.localize("abfalter.kiAbilityData.additionalDefensesDesc"),
            frequency: "action",
            actionType: "defense",
            elements: ["light"],
            primaryChar: "agility",
            optionalChar: [
                { type: "consti", value: 2 },
                { type: "dexterity", value: 1 },
                { type: "power", value: 3 },
                { type: "willPower", value: 3 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.additionalDef1"), prim: 1, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.additionalDef2"), prim: 2, sec: 4, mk: 5, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.additionalDef3"), prim: 3, sec: 5, mk: 10, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.additionalDef4"), prim: 4, sec: 6, mk: 15, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.additionalDef6"), prim: 5, sec: 8, mk: 20, maint: 6, mis: 12, grs: 21, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.additionalDef8"), prim: 6, sec: 10, mk: 25, maint: 8, mis: 16, grs: 28, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.additionalDef10"), prim: 7, sec: 12, mk: 30, maint: 10, mis: 20, grs: 35, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.additionalDefUnlimited"), prim: 8, sec: 11, mk: 35, maint: 12, mis: 24, grs: 42, lvl: 3 }
            ],
            hasAdditionalEffect: true,
            additions: [
                {
                    groupId: "addedFatigueBonus",
                    title: game.i18n.localize("abfalter.kiAbilityData.genericAdv"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "addedFatigueBonus",
                            name: game.i18n.localize("abfalter.kiAbilityData.addedFatigueBonus"),
                            description: game.i18n.localize("abfalter.kiAbilityData.addedFatigueBonusDesc"),
                            cost: 6,
                            mk: 20,
                            maint: 2,
                            mis: 4,
                            grs: 7
                        }
                    ]
                }
            ]
        },
        {
            id: "additionalActions",
            cat: "action",
            name: game.i18n.localize("abfalter.kiAbilityData.additionalActions"),
            description: game.i18n.localize("abfalter.kiAbilityData.additionalActionsDesc"),
            frequency: "turn",
            actionType: "variable",
            elements: ["air"],
            primaryChar: "dexterity",
            optionalChar: [
                { type: "agility", value: 1 },
                { type: "consti", value: 1 },
                { type: "power", value: 3 },
                { type: "willPower", value: 2 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.additionalAction1"), prim: 1, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.additionalAction2"), prim: 2, sec: 4, mk: 5, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.additionalAction3"), prim: 3, sec: 5, mk: 10, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.additionalAction4"), prim: 4, sec: 6, mk: 15, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.additionalAction5"), prim: 5, sec: 8, mk: 20, maint: 6, mis: 12, grs: 21, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.additionalAction6"), prim: 6, sec: 9, mk: 25, maint: 8, mis: 16, grs: 28, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.additionalAction8"), prim: 7, sec: 10, mk: 30, maint: 10, mis: 20, grs: 35, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.additionalAction10"), prim: 8, sec: 11, mk: 35, maint: 12, mis: 24, grs: 42, lvl: 3 }
            ],
            hasAdditionalEffect: true,
            additions: [
                {
                    groupId: "addedFatigueBonus",
                    title: game.i18n.localize("abfalter.kiAbilityData.genericAdv"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "addedFatigueBonus",
                            name: game.i18n.localize("abfalter.kiAbilityData.addedFatigueBonus"),
                            description: game.i18n.localize("abfalter.kiAbilityData.addedFatigueBonusDesc"),
                            cost: 6,
                            mk: 20,
                            maint: 2,
                            mis: 4,
                            grs: 7
                        }
                    ]
                }
            ]
        },
        {
            id: "initiativeAugmentation",
            cat: "reaction",
            name: game.i18n.localize("abfalter.kiAbilityData.initiativeAugmentation"),
            description: game.i18n.localize("abfalter.kiAbilityData.initiativeAugmentationDesc"),
            frequency: "turn",
            actionType: "variable",
            elements: ["air"],
            primaryChar: "agility",
            optionalChar: [
                { type: "consti", value: 2 },
                { type: "dexterity", value: 1 },
                { type: "power", value: 3 },
                { type: "willPower", value: 3 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.iniBonus25"), prim: 1, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.iniBonus50"), prim: 2, sec: 4, mk: 10, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.iniBonus75"), prim: 4, sec: 6, mk: 15, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.iniBonus100"), prim: 6, sec: 9, mk: 20, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.iniBonus125"), prim: 8, sec: 11, mk: 25, maint: 4, mis: 8, grs: 14, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.iniBonus150"), prim: 10, sec: 13, mk: 30, maint: 5, mis: 10, grs: 18, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.iniBonus175"), prim: 12, sec: 15, mk: 35, maint: 6, mis: 12, grs: 21, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.iniBonus200"), prim: 14, sec: 18, mk: 40, maint: 7, mis: 14, grs: 25, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "quickRecovery",
            cat: "reaction",
            name: game.i18n.localize("abfalter.kiAbilityData.quickRecovery"),
            description: game.i18n.localize("abfalter.kiAbilityData.quickRecoveryDesc"),
            frequency: "action",
            actionType: "variable",
            elements: ["air", "light", "water"],
            primaryChar: "willPower",
            optionalChar: [
                { type: "agility", value: 2 },
                { type: "consti", value: 2 },
                { type: "dexterity", value: 3 },
                { type: "power", value: 2 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.quickRecovery"), prim: 6, sec: 9, mk: 25, maint: 2, mis: 4, grs: 7, lvl: 1 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "foretell",
            cat: "reaction",
            name: game.i18n.localize("abfalter.kiAbilityData.foretell"),
            description: game.i18n.localize("abfalter.kiAbilityData.foretellDesc"),
            frequency: "turn",
            actionType: "variable",
            elements: ["air", "fire", "light"],
            primaryChar: "power",
            optionalChar: [
                { type: "consti", value: 2 },
                { type: "dexterity", value: 3 },
                { type: "strength", value: 1 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.foretellHalf"), prim: 3, sec: 5, mk: 10, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.foretellFull"), prim: 6, sec: 9, mk: 25, maint: 3, mis: 6, grs: 11, lvl: 1 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "longDistanceAttackSingle",
            cat: "special",
            name: game.i18n.localize("abfalter.kiAbilityData.longDistanceAttackSingle"),
            description: game.i18n.localize("abfalter.kiAbilityData.longDistanceAttackSingleDesc"),
            frequency: "action",
            actionType: "attack",
            elements: ["water", "air", "fire"],
            primaryChar: "power",
            optionalChar: [
                { type: "agility", value: 3 },
                { type: "consti", value: 4 },
                { type: "dexterity", value: 2 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.distance15ft"), prim: 1, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.distance30ft"), prim: 2, sec: 4, mk: 10, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.distance60ft"), prim: 3, sec: 5, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.distance150ft"), prim: 4, sec: 6, mk: 15, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.distance300ft"), prim: 5, sec: 8, mk: 20, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.distance800ft"), prim: 6, sec: 9, mk: 25, maint: 5, mis: 10, grs: 18, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.distance1500ft"), prim: 8, sec: 11, mk: 30, maint: 6, mis: 12, grs: 21, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.distance3000ft"), prim: 10, sec: 13, mk: 35, maint: 8, mis: 16, grs: 28, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.distance3miles"), prim: 14, sec: 18, mk: 40, maint: 10, mis: 20, grs: 35, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.distance6miles"), prim: 18, sec: 22, mk: 45, maint: 12, mis: 24, grs: 42, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.distance60miles"), prim: 22, sec: 26, mk: 50, maint: 14, mis: 28, grs: 49, lvl: 3 }
            ],
            hasAdditionalEffect: true,
            additions: [
                {
                    groupId: "projection",
                    title: game.i18n.localize("abfalter.kiAbilityData.genericAdv"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "projection",
                            name: game.i18n.localize("abfalter.kiAbilityData.projection"),
                            description: game.i18n.localize("abfalter.kiAbilityData.projectionDesc"),
                            cost: 4,
                            mk: 10,
                            maint: 1,
                            mis: 2,
                            grs: 4
                        }
                    ]
                },
                {
                    groupId: "trailOfDestruction",
                    title: game.i18n.localize("abfalter.kiAbilityData.genericAdv"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "trailOfDestruction",
                            name: game.i18n.localize("abfalter.kiAbilityData.trailOfDestruction"),
                            description: game.i18n.localize("abfalter.kiAbilityData.trailOfDestructionDesc"),
                            cost: 8,
                            mk: 20,
                            maint: 1,
                            mis: 2,
                            grs: 4
                        }
                    ]
                }
            ]
        },
        {
            id: "longDistanceAttackMultiple",
            cat: "special",
            name: game.i18n.localize("abfalter.kiAbilityData.longDistanceAttackMultiple"),
            description: game.i18n.localize("abfalter.kiAbilityData.longDistanceAttackMultipleDesc"),
            frequency: "turn",
            actionType: "attack",
            elements: ["water", "air", "fire"],
            primaryChar: "power",
            optionalChar: [
                { type: "agility", value: 3 },
                { type: "consti", value: 4 },
                { type: "dexterity", value: 2 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.distance15ft"), prim: 2, sec: 4, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.distance30ft"), prim: 4, sec: 6, mk: 15, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.distance60ft"), prim: 6, sec: 9, mk: 20, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.distance150ft"), prim: 8, sec: 11, mk: 25, maint: 5, mis: 10, grs: 18, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.distance300ft"), prim: 10, sec: 13, mk: 35, maint: 6, mis: 12, grs: 21, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.distance800ft"), prim: 12, sec: 15, mk: 45, maint: 8, mis: 16, grs: 28, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.distance1500ft"), prim: 16, sec: 20, mk: 55, maint: 10, mis: 20, grs: 35, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.distance3000ft"), prim: 20, sec: 24, mk: 70, maint: 12, mis: 24, grs: 42, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "areaAttackSingle",
            cat: "special",
            name: game.i18n.localize("abfalter.kiAbilityData.areaAttackSingle"),
            description: game.i18n.localize("abfalter.kiAbilityData.areaAttackSingleDesc"),
            frequency: "action",
            actionType: "attack",
            elements: ["fire", "light", "darkness"],
            primaryChar: "power",
            optionalChar: [
                { type: "agility", value: 2 },
                { type: "consti", value: 3 },
                { type: "dexterity", value: 2 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.radius3ft"), prim: 1, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.radius15ft"), prim: 2, sec: 4, mk: 10, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.radius30ft"), prim: 3, sec: 5, mk: 15, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.radius80ft"), prim: 4, sec: 6, mk: 20, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.radius150ft"), prim: 6, sec: 9, mk: 25, maint: 4, mis: 8, grs: 14, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.radius300ft"), prim: 8, sec: 11, mk: 30, maint: 5, mis: 10, grs: 18, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.radius1500ft"), prim: 10, sec: 13, mk: 40, maint: 6, mis: 12, grs: 21, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.radius3000ft"), prim: 12, sec: 15, mk: 50, maint: 8, mis: 16, grs: 28, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.radius3miles"), prim: 16, sec: 20, mk: 60, maint: 10, mis: 20, grs: 35, lvl: 3 }
            ],
            hasAdditionalEffect: true,
            additions: [
                {
                    groupId: "targetChoice",
                    title: game.i18n.localize("abfalter.kiAbilityData.genericAdv"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "targetChoice",
                            name: game.i18n.localize("abfalter.kiAbilityData.targetChoice"),
                            description: game.i18n.localize("abfalter.kiAbilityData.targetChoiceDesc"),
                            cost: 2,
                            mk: 10,
                            maint: 1,
                            mis: 2,
                            grs: 4
                        }
                    ]
                }
            ]
        },
        {
            id: "areaAttackMultiple",
            cat: "special",
            name: game.i18n.localize("abfalter.kiAbilityData.areaAttackMultiple"),
            description: game.i18n.localize("abfalter.kiAbilityData.areaAttackMultipleDesc"),
            frequency: "turn",
            actionType: "attack",
            elements: ["fire", "light", "darkness"],
            primaryChar: "power",
            optionalChar: [
                { type: "agility", value: 3 },
                { type: "consti", value: 3 },
                { type: "dexterity", value: 2 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.radius3ft"), prim: 2, sec: 4, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.radius15ft"), prim: 4, sec: 6, mk: 15, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.radius30ft"), prim: 6, sec: 9, mk: 20, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.radius80ft"), prim: 8, sec: 11, mk: 30, maint: 5, mis: 10, grs: 18, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.radius150ft"), prim: 12, sec: 15, mk: 45, maint: 6, mis: 12, grs: 21, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.radius300ft"), prim: 16, sec: 20, mk: 65, maint: 8, mis: 16, grs: 28, lvl: 3 }
            ],
            hasAdditionalEffect: true,
            additions: [
                {
                    groupId: "targetChoice",
                    title: game.i18n.localize("abfalter.kiAbilityData.genericAdv"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "targetChoice",
                            name: game.i18n.localize("abfalter.kiAbilityData.targetChoice"),
                            description: game.i18n.localize("abfalter.kiAbilityData.targetChoiceDesc"),
                            cost: 2,
                            mk: 10,
                            maint: 1,
                            mis: 2,
                            grs: 4
                        }
                    ]
                }
            ]
        },
        {
            id: "areaBlock",
            cat: "special",
            name: game.i18n.localize("abfalter.kiAbilityData.areaBlock"),
            description: game.i18n.localize("abfalter.kiAbilityData.areaBlockDesc"),
            frequency: "action",
            actionType: "defense",
            elements: ["light", "earth", "water"],
            primaryChar: "power",
            optionalChar: [
                { type: "consti", value: 2 },
                { type: "dexterity", value: 2 },
                { type: "strength", value: 2 },
                { type: "willPower", value: 3 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.radius3ft"), prim: 1, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.radius15ft"), prim: 2, sec: 4, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.radius30ft"), prim: 3, sec: 5, mk: 15, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.radius80ft"), prim: 4, sec: 6, mk: 20, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.radius150ft"), prim: 5, sec: 8, mk: 25, maint: 5, mis: 10, grs: 18, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.radius300ft"), prim: 6, sec: 9, mk: 30, maint: 6, mis: 12, grs: 21, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.radius1500ft"), prim: 8, sec: 11, mk: 35, maint: 7, mis: 14, grs: 25, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.radius3000ft"), prim: 10, sec: 13, mk: 35, maint: 8, mis: 16, grs: 28, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "automaticTransportation",
            cat: "special",
            name: game.i18n.localize("abfalter.kiAbilityData.automaticTransportation"),
            description: game.i18n.localize("abfalter.kiAbilityData.automaticTransportationDesc"),
            frequency: "action",
            actionType: "variable",
            elements: ["air", "light", "darkness"],
            primaryChar: "agility",
            optionalChar: [
                { type: "consti", value: 2 },
                { type: "dexterity", value: 2 },
                { type: "strength", value: 2 },
                { type: "power", value: 3 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.distance30ft"), prim: 2, sec: 4, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.distance60ft"), prim: 3, sec: 5, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.distance150ft"), prim: 4, sec: 6, mk: 10, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.distance300ft"), prim: 5, sec: 8, mk: 15, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.distance800ft"), prim: 6, sec: 9, mk: 20, maint: 5, mis: 10, grs: 18, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.distance1500ft"), prim: 8, sec: 11, mk: 25, maint: 6, mis: 12, grs: 21, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.distance3000ft"), prim: 10, sec: 13, mk: 30, maint: 7, mis: 14, grs: 25, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.distance3miles"), prim: 14, sec: 18, mk: 35, maint: 8, mis: 16, grs: 28, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.distance6miles"), prim: 18, sec: 22, mk: 40, maint: 10, mis: 20, grs: 35, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.distance60miles"), prim: 22, sec: 26, mk: 50, maint: 12, mis: 24, grs: 42, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "breakageAugmentation",
            cat: "effectsOfDurability",
            name: game.i18n.localize("abfalter.kiAbilityData.breakageAugmentation"),
            description: game.i18n.localize("abfalter.kiAbilityData.breakageAugmentationDesc"),
            frequency: "turn",
            actionType: "attack",
            elements: ["fire", "earth"],
            primaryChar: "strength",
            optionalChar: [
                { type: "consti", value: 2 },
                { type: "dexterity", value: 4 },
                { type: "power", value: 2 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.breakage5"), prim: 1, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.breakage10"), prim: 2, sec: 4, mk: 10, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.breakage15"), prim: 4, sec: 6, mk: 15, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.breakage20"), prim: 6, sec: 9, mk: 20, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.breakage25"), prim: 8, sec: 11, mk: 25, maint: 4, mis: 8, grs: 14, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.breakage30"), prim: 12, sec: 15, mk: 30, maint: 5, mis: 10, grs: 18, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.breakage35"), prim: 14, sec: 18, mk: 35, maint: 6, mis: 12, grs: 21, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.breakage40"), prim: 18, sec: 22, mk: 40, maint: 8, mis: 16, grs: 28, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "fortitudeAugmentation",
            cat: "effectsOfDurability",
            name: game.i18n.localize("abfalter.kiAbilityData.fortitudeAugmentation"),
            description: game.i18n.localize("abfalter.kiAbilityData.fortitudeAugmentationDesc"),
            frequency: "turn",
            actionType: "defense",
            elements: ["fire", "light", "earth"],
            primaryChar: "consti",
            optionalChar: [
                { type: "strength", value: 2 },
                { type: "dexterity", value: 4 },
                { type: "power", value: 2 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.fortitude10"), prim: 1, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.fortitude15"), prim: 2, sec: 4, mk: 10, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.fortitude20"), prim: 3, sec: 5, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.fortitude25"), prim: 4, sec: 6, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.fortitude30"), prim: 5, sec: 8, mk: 15, maint: 3, mis: 6, grs: 11, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.fortitude35"), prim: 6, sec: 9, mk: 20, maint: 3, mis: 6, grs: 11, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.fortitude40"), prim: 7, sec: 10, mk: 25, maint: 4, mis: 8, grs: 14, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "armorPenetration",
            cat: "effectsOfDurability",
            name: game.i18n.localize("abfalter.kiAbilityData.armorPenetration"),
            description: game.i18n.localize("abfalter.kiAbilityData.armorPenetrationDesc"),
            frequency: "action",
            actionType: "attack",
            elements: ["fire", "darkness"],
            primaryChar: "strength",
            optionalChar: [
                { type: "consti", value: 2 },
                { type: "dexterity", value: 2 },
                { type: "power", value: 1 },
                { type: "willPower", value: 2 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.reduction1at"), prim: 1, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.reduction2at"), prim: 2, sec: 4, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.reduction3at"), prim: 3, sec: 5, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.reduction4at"), prim: 4, sec: 6, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.reduction5at"), prim: 5, sec: 8, mk: 15, maint: 3, mis: 6, grs: 11, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.reduction6at"), prim: 6, sec: 9, mk: 20, maint: 3, mis: 6, grs: 11, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.reduction7at"), prim: 8, sec: 11, mk: 25, maint: 4, mis: 8, grs: 14, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.reduction8at"), prim: 10, sec: 13, mk: 30, maint: 5, mis: 10, grs: 18, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.ignoresArmor"), prim: 12, sec: 15, mk: 40, maint: 6, mis: 12, grs: 21, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "armorAugmentation",
            cat: "effectsOfDurability",
            name: game.i18n.localize("abfalter.kiAbilityData.armorAugmentation"),
            description: game.i18n.localize("abfalter.kiAbilityData.armorAugmentationDesc"),
            frequency: "turn",
            actionType: "defense",
            elements: ["water", "light", "earth"],
            primaryChar: "consti",
            optionalChar: [
                { type: "agility", value: 3 },
                { type: "strength", value: 2 },
                { type: "power", value: 1 },
                { type: "willPower", value: 2 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.armorType1"), prim: 1, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.armorType2"), prim: 2, sec: 4, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.armorType3"), prim: 4, sec: 6, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.armorType4"), prim: 6, sec: 9, mk: 15, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.armorType5"), prim: 8, sec: 11, mk: 20, maint: 3, mis: 6, grs: 11, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.armorType6"), prim: 10, sec: 13, mk: 25, maint: 3, mis: 6, grs: 11, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.armorType7"), prim: 12, sec: 15, mk: 30, maint: 4, mis: 8, grs: 14, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.armorType8"), prim: 14, sec: 18, mk: 40, maint: 5, mis: 10, grs: 18, lvl: 3 }
            ],
            hasAdditionalEffect: true,
            additions: [
                {
                    groupId: "unmodifiable",
                    title: game.i18n.localize("abfalter.kiAbilityData.genericAdv"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "unmodifiable",
                            name: game.i18n.localize("abfalter.kiAbilityData.unmodifiable"),
                            description: game.i18n.localize("abfalter.kiAbilityData.unmodifiableDesc"),
                            cost: 4,
                            mk: 15,
                            maint: 2,
                            mis: 4,
                            grs: 7
                        }
                    ]
                },
                {
                    groupId: "physicalArmor",
                    title: game.i18n.localize("abfalter.kiAbilityData.genericDisadv"),
                    type: "disadvantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "physicalArmor",
                            name: game.i18n.localize("abfalter.kiAbilityData.physicalArmor"),
                            description: game.i18n.localize("abfalter.kiAbilityData.physicalArmorDesc"),
                            cost: -1,
                            mk: -5
                        }
                    ]
                },
                {
                    groupId: "slowness",
                    title: game.i18n.localize("abfalter.kiAbilityData.genericDisadv"),
                    type: "disadvantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "slowness",
                            name: game.i18n.localize("abfalter.kiAbilityData.slowness"),
                            description: game.i18n.localize("abfalter.kiAbilityData.slownessDesc"),
                            cost: -1,
                            mk: -10
                        }
                    ]
                }
            ]
        },
        {
            id: "movementIncrease",
            cat: "increaseEffects",
            name: game.i18n.localize("abfalter.kiAbilityData.movementIncrease"),
            description: game.i18n.localize("abfalter.kiAbilityData.movementIncreaseDesc"),
            frequency: "turn",
            actionType: "variable",
            elements: ["air", "fire", "light"],
            primaryChar: "agility",
            optionalChar: [
                { type: "consti", value: 1 },
                { type: "dexterity", value: 4 },
                { type: "power", value: 3 },
                { type: "willPower", value: 3 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.movementBonus1"), prim: 1, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.movementBonus2"), prim: 2, sec: 4, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.movementBonus3"), prim: 4, sec: 6, mk: 15, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.movementBonus4"), prim: 6, sec: 9, mk: 20, maint: 4, mis: 8, grs: 14, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.movementBonus5"), prim: 8, sec: 11, mk: 25, maint: 5, mis: 10, grs: 18, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "abilityIncrease",
            cat: "increaseEffects",
            name: game.i18n.localize("abfalter.kiAbilityData.abilityIncrease"),
            description: game.i18n.localize("abfalter.kiAbilityData.abilityIncreaseDesc"),
            frequency: "turn",
            actionType: "variable",
            elements: ["water", "light", "earth"],
            primaryChar: "consti",
            optionalChar: [
                { type: "agility", value: 2 },
                { type: "dexterity", value: 3 },
                { type: "power", value: 2 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.abilityBonus25"), prim: 2, sec: 4, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.abilityBonus50"), prim: 4, sec: 6, mk: 5, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.abilityBonus75"), prim: 6, sec: 9, mk: 10, maint: 3, mis: 6, grs: 11, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.abilityBonus100"), prim: 9, sec: 12, mk: 15, maint: 4, mis: 8, grs: 14, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.abilityBonus125"), prim: 12, sec: 15, mk: 20, maint: 5, mis: 10, grs: 18, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.abilityBonus150"), prim: 15, sec: 19, mk: 25, maint: 6, mis: 12, grs: 21, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "increasedBonus",
            cat: "increaseEffects",
            name: game.i18n.localize("abfalter.kiAbilityData.increasedBonus"),
            description: game.i18n.localize("abfalter.kiAbilityData.increasedBonusDesc"),
            frequency: "action",
            actionType: "variable",
            elements: ["water", "fire", "darkness"],
            primaryChar: "variable",
            optionalChar: [
                { type: "consti", value: 1 },
                { type: "power", value: 1 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.charBonus1"), prim: 1, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.charBonus2"), prim: 2, sec: 4, mk: 5, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.charBonus3"), prim: 4, sec: 6, mk: 5, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.charBonus4"), prim: 6, sec: 9, mk: 10, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.charBonus5"), prim: 8, sec: 11, mk: 15, maint: 5, mis: 10, grs: 18, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.charBonus6"), prim: 10, sec: 13, mk: 20, maint: 6, mis: 12, grs: 21, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.charBonus7"), prim: 12, sec: 15, mk: 25, maint: 7, mis: 14, grs: 25, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.charBonus8"), prim: 14, sec: 18, mk: 30, maint: 8, mis: 16, grs: 28, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "physicalResistanceIncrease",
            cat: "increaseEffects",
            name: game.i18n.localize("abfalter.kiAbilityData.physicalResistanceIncrease"),
            description: game.i18n.localize("abfalter.kiAbilityData.physicalResistanceIncreaseDesc"),
            frequency: "turn",
            actionType: "variable",
            elements: ["water", "light", "earth"],
            primaryChar: "consti",
            optionalChar: [
                { type: "dexterity", value: 3 },
                { type: "strength", value: 2 },
                { type: "power", value: 1 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.resistBonus10"), prim: 1, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.resistBonus20"), prim: 2, sec: 4, mk: 5, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.resistBonus30"), prim: 4, sec: 6, mk: 10, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.resistBonus40"), prim: 6, sec: 9, mk: 15, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.resistBonus50"), prim: 8, sec: 11, mk: 20, maint: 5, mis: 10, grs: 18, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.resistBonus60"), prim: 10, sec: 13, mk: 25, maint: 6, mis: 12, grs: 21, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.resistBonus80"), prim: 14, sec: 18, mk: 30, maint: 7, mis: 14, grs: 25, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.resistBonus100"), prim: 18, sec: 22, mk: 40, maint: 8, mis: 16, grs: 28, lvl: 3 }
            ],
            hasAdditionalEffect: true,
            additions: [
                {
                    groupId: "diseaseResistance",
                    title: game.i18n.localize("abfalter.kiAbilityData.genericAdv"),
                    type: "advantage",
                    exclusive: true,
                    options: [
                        {
                            optionId: "diseaseResistance",
                            name: game.i18n.localize("abfalter.kiAbilityData.diseaseResistance"),
                            description: game.i18n.localize("abfalter.kiAbilityData.diseaseResistanceDesc"),
                            cost: 1,
                            mk: 5,
                            maint: 1,
                            mis: 2,
                            grs: 4
                        },
                    ]
                },
                {
                    groupId: "poisonResistance",
                    title: game.i18n.localize("abfalter.kiAbilityData.genericAdv"),
                    type: "advantage",
                    exclusive: true,
                    options: [
                        {
                            optionId: "poisonResistance",
                            name: game.i18n.localize("abfalter.kiAbilityData.poisonResistance"),
                            description: game.i18n.localize("abfalter.kiAbilityData.poisonResistanceDesc"),
                            cost: 1,
                            mk: 5,
                            maint: 1,
                            mis: 2,
                            grs: 4
                        }
                    ]
                }
            ]
        },
        {
            id: "magicalResistanceIncrease",
            cat: "increaseEffects",
            name: game.i18n.localize("abfalter.kiAbilityData.magicalResistanceIncrease"),
            description: game.i18n.localize("abfalter.kiAbilityData.magicalResistanceIncreaseDesc"),
            frequency: "turn",
            actionType: "variable",
            elements: ["air", "fire", "light"],
            primaryChar: "power",
            optionalChar: [
                { type: "consti", value: 2 },
                { type: "dexterity", value: 3 },
                { type: "strength", value: 2 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.resistBonus10"), prim: 1, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.resistBonus20"), prim: 2, sec: 4, mk: 5, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.resistBonus30"), prim: 4, sec: 6, mk: 10, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.resistBonus40"), prim: 6, sec: 9, mk: 15, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.resistBonus50"), prim: 8, sec: 11, mk: 20, maint: 5, mis: 10, grs: 18, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.resistBonus60"), prim: 10, sec: 13, mk: 25, maint: 6, mis: 12, grs: 21, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.resistBonus80"), prim: 14, sec: 18, mk: 30, maint: 7, mis: 14, grs: 25, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.resistBonus100"), prim: 18, sec: 22, mk: 40, maint: 8, mis: 16, grs: 28, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "psychicResistanceIncrease",
            cat: "increaseEffects",
            name: game.i18n.localize("abfalter.kiAbilityData.psychicResistanceIncrease"),
            description: game.i18n.localize("abfalter.kiAbilityData.psychicResistanceIncreaseDesc"),
            frequency: "turn",
            actionType: "variable",
            elements: ["air", "water", "light"],
            primaryChar: "willPower",
            optionalChar: [
                { type: "consti", value: 2 },
                { type: "dexterity", value: 3 },
                { type: "strength", value: 2 },
                { type: "power", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.resistBonus10"), prim: 1, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.resistBonus20"), prim: 2, sec: 4, mk: 5, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.resistBonus30"), prim: 4, sec: 6, mk: 10, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.resistBonus40"), prim: 6, sec: 9, mk: 15, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.resistBonus50"), prim: 8, sec: 11, mk: 20, maint: 5, mis: 10, grs: 18, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.resistBonus60"), prim: 10, sec: 13, mk: 25, maint: 6, mis: 12, grs: 21, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.resistBonus80"), prim: 14, sec: 18, mk: 30, maint: 7, mis: 14, grs: 25, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.resistBonus100"), prim: 18, sec: 22, mk: 40, maint: 8, mis: 16, grs: 28, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "perceptiveAbilities",
            cat: "increaseEffects",
            name: game.i18n.localize("abfalter.kiAbilityData.perceptiveAbilities"),
            description: game.i18n.localize("abfalter.kiAbilityData.perceptiveAbilitiesDesc"),
            frequency: "turn",
            actionType: "variable",
            elements: ["water", "air", "light"],
            primaryChar: "power",
            optionalChar: [
                { type: "agility", value: 4 },
                { type: "consti", value: 4 },
                { type: "dexterity", value: 4 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.nightVision"), prim: 2, sec: 4, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.radialVision"), prim: 4, sec: 6, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.spiritualVision"), prim: 3, sec: 5, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.magicVision"), prim: 3, sec: 5, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.matricesVision"), prim: 3, sec: 5, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.seeSupernatural"), prim: 5, sec: 8, mk: 15, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.greaterSeeSupernatural"), prim: 8, sec: 11, mk: 25, maint: 2, mis: 4, grs: 7, lvl: 2 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "energyDamagingAttack",
            cat: "variedEffects",
            name: game.i18n.localize("abfalter.kiAbilityData.energyDamagingAttack"),
            description: game.i18n.localize("abfalter.kiAbilityData.energyDamagingAttackDesc"),
            frequency: "action",
            actionType: "attack",
            elements: ["fire", "light", "darkness"],
            primaryChar: "power",
            optionalChar: [
                { type: "consti", value: 2 },
                { type: "dexterity", value: 3 },
                { type: "strength", value: 3 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.energyAttack"), prim: 1, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "elementalAttack",
            cat: "variedEffects",
            name: game.i18n.localize("abfalter.kiAbilityData.elementalAttack"),
            description: game.i18n.localize("abfalter.kiAbilityData.elementalAttackDesc"),
            frequency: "turn",
            actionType: "attack",
            elements: ["variable"],
            primaryChar: "power",
            optionalChar: [
                { type: "consti", value: 2 },
                { type: "dexterity", value: 3 },
                { type: "strength", value: 3 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.elementalAttack"), prim: 2, sec: 4, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "physicalKiWeapons",
            cat: "variedEffects",
            name: game.i18n.localize("abfalter.kiAbilityData.physicalKiWeapons"),
            description: game.i18n.localize("abfalter.kiAbilityData.physicalKiWeaponsDesc"),
            frequency: "turn",
            actionType: "variable",
            elements: ["light", "darkness", "earth"],
            primaryChar: "power",
            optionalChar: [
                { type: "consti", value: 1 },
                { type: "dexterity", value: 3 },
                { type: "strength", value: 2 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.quality0"), prim: 2, sec: 4, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.quality5"), prim: 4, sec: 6, mk: 10, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.quality10"), prim: 6, sec: 9, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.quality15"), prim: 8, sec: 11, mk: 15, maint: 3, mis: 6, grs: 11, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.quality20"), prim: 10, sec: 13, mk: 20, maint: 4, mis: 8, grs: 14, lvl: 3 }
            ],
            hasAdditionalEffect: true,
            additions: [
                {
                    groupId: "projectileWeapon",
                    title: game.i18n.localize("abfalter.kiAbilityData.genericAdv"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "projectileWeapon",
                            name: game.i18n.localize("abfalter.kiAbilityData.projectileWeapon"),
                            description: game.i18n.localize("abfalter.kiAbilityData.projectileWeaponDesc"),
                            cost: 2,
                            mk: 10,
                            maint: 1,
                            mis: 2,
                            grs: 4
                        }
                    ]
                },
                {
                    groupId: "additionalWeapons",
                    title: game.i18n.localize("abfalter.kiAbilityData.additionalWeaponsTitle"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "1weapon",
                            name: game.i18n.localize("abfalter.kiAbilityData.additionalWeapon1"),
                            description: game.i18n.localize("abfalter.kiAbilityData.additionalWeaponDesc"),
                            cost: 1,
                            mk: 5,
                            maint: 1,
                            mis: 2,
                            grs: 4
                        },
                        {
                            optionId: "3weapons",
                            name: game.i18n.localize("abfalter.kiAbilityData.additionalWeapon3"),
                            description: game.i18n.localize("abfalter.kiAbilityData.additionalWeaponDesc"),
                            cost: 2,
                            mk: 10,
                            maint: 2,
                            mis: 4,
                            grs: 7
                        },
                        {
                            optionId: "10weapons",
                            name: game.i18n.localize("abfalter.kiAbilityData.additionalWeapon10"),
                            description: game.i18n.localize("abfalter.kiAbilityData.additionalWeaponDesc"),
                            cost: 4,
                            mk: 15,
                            maint: 3,
                            mis: 6,
                            grs: 11
                        },
                        {
                            optionId: "unlimitedWeapons",
                            name: game.i18n.localize("abfalter.kiAbilityData.additionalWeaponUnlimited"),
                            description: game.i18n.localize("abfalter.kiAbilityData.additionalWeaponDesc"),
                            cost: 6,
                            mk: 20,
                            maint: 4,
                            mis: 8,
                            grs: 14
                        }
                    ]
                }
            ]
        },
        {
            id: "supernaturalAttack",
            cat: "variedEffects",
            name: game.i18n.localize("abfalter.kiAbilityData.supernaturalAttack"),
            description: game.i18n.localize("abfalter.kiAbilityData.supernaturalAttackDesc"),
            frequency: "action",
            actionType: "attack",
            elements: ["light", "darkness"],
            primaryChar: "power",
            optionalChar: [
                { type: "consti", value: 2 },
                { type: "dexterity", value: 3 },
                { type: "strength", value: 3 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.supernaturalAttack"), prim: 5, sec: 8, mk: 10, maint: 1, mis: 2, grs: 4, lvl: 1 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "kiAbsorption",
            cat: "variedEffects",
            name: game.i18n.localize("abfalter.kiAbilityData.kiAbsorption"),
            description: game.i18n.localize("abfalter.kiAbilityData.kiAbsorptionDesc"),
            frequency: "action",
            actionType: "defense",
            elements: ["water", "air", "earth"],
            primaryChar: "power",
            optionalChar: [
                { type: "consti", value: 3 },
                { type: "dexterity", value: 4 },
                { type: "strength", value: 3 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.kiAbsorption5"), prim: 1, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.kiAbsorption10"), prim: 2, sec: 4, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.kiAbsorption15"), prim: 4, sec: 6, mk: 15, maint: 3, mis: 6, grs: 11, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.kiAbsorption20"), prim: 6, sec: 9, mk: 20, maint: 4, mis: 8, grs: 14, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.kiAbsorption25"), prim: 8, sec: 11, mk: 25, maint: 6, mis: 12, grs: 21, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.kiAbsorptionUnlimited"), prim: 10, sec: 13, mk: 30, maint: 8, mis: 16, grs: 28, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "trapping",
            cat: "variedEffects",
            name: game.i18n.localize("abfalter.kiAbilityData.trapping"),
            description: game.i18n.localize("abfalter.kiAbilityData.trappingDesc"),
            frequency: "action",
            actionType: "attack",
            elements: ["earth"],
            primaryChar: "strength",
            optionalChar: [
                { type: "consti", value: 2 },
                { type: "dexterity", value: 1 },
                { type: "power", value: 2 },
                { type: "willPower", value: 2 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.trapping4"), prim: 2, sec: 4, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.trapping6"), prim: 3, sec: 5, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.trapping8"), prim: 4, sec: 6, mk: 10, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.trapping10"), prim: 5, sec: 8, mk: 15, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.trapping12"), prim: 6, sec: 9, mk: 20, maint: 5, mis: 10, grs: 18, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.trapping14"), prim: 8, sec: 11, mk: 25, maint: 6, mis: 12, grs: 21, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.trapping16"), prim: 10, sec: 13, mk: 30, maint: 7, mis: 14, grs: 25, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.trapping18"), prim: 14, sec: 18, mk: 35, maint: 8, mis: 16, grs: 28, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.trapping20"), prim: 18, sec: 22, mk: 40, maint: 10, mis: 20, grs: 35, lvl: 3 }
            ],
            hasAdditionalEffect: true,
            additions: [
                {
                    groupId: "spiritTrap",
                    title: game.i18n.localize("abfalter.kiAbilityData.genericAdv"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "spiritTrap",
                            name: game.i18n.localize("abfalter.kiAbilityData.spiritTrap"),
                            description: game.i18n.localize("abfalter.kiAbilityData.spiritTrapDesc"),
                            cost: 1,
                            mk: 5,
                            maint: 1,
                            mis: 2,
                            grs: 4
                        }
                    ]
                }
            ]
        },
        {
            id: "physicalShock",
            cat: "variedEffects",
            name: game.i18n.localize("abfalter.kiAbilityData.physicalShock"),
            description: game.i18n.localize("abfalter.kiAbilityData.physicalShockDesc"),
            frequency: "action",
            actionType: "attack",
            elements: ["water", "light", "earth"],
            primaryChar: "power",
            optionalChar: [
                { type: "consti", value: 1 },
                { type: "dexterity", value: 3 },
                { type: "strength", value: 1 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.physicalShock"), prim: 1, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "damageResistance",
            cat: "variedEffects",
            name: game.i18n.localize("abfalter.kiAbilityData.damageResistance"),
            description: game.i18n.localize("abfalter.kiAbilityData.damageResistanceDesc"),
            frequency: "turn",
            actionType: "defense",
            elements: ["earth"],
            primaryChar: "consti",
            optionalChar: [
                { type: "dexterity", value: 3 },
                { type: "strength", value: 3 },
                { type: "power", value: 3 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.damageResistance100"), prim: 2, sec: 4, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damageResistance200"), prim: 3, sec: 5, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damageResistance300"), prim: 4, sec: 6, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damageResistance400"), prim: 5, sec: 8, mk: 15, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damageResistance600"), prim: 8, sec: 11, mk: 20, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damageResistance800"), prim: 12, sec: 15, mk: 25, maint: 5, mis: 10, grs: 18, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damageResistance1000"), prim: 14, sec: 18, mk: 30, maint: 8, mis: 16, grs: 28, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damageResistance1200"), prim: 18, sec: 22, mk: 35, maint: 10, mis: 20, grs: 35, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damageResistance1500"), prim: 22, sec: 26, mk: 40, maint: 12, mis: 24, grs: 42, lvl: 3 }
            ],
            hasAdditionalEffect: true,
            additions: [
                {
                    groupId: "regeneration",
                    title: game.i18n.localize("abfalter.kiAbilityData.regenerationTitle"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "regeneration100",
                            name: game.i18n.localize("abfalter.kiAbilityData.regeneration100"),
                            description: game.i18n.localize("abfalter.kiAbilityData.regeneration100Desc"),
                            cost: 1,
                            mk: 5,
                            maint: 1,
                            mis: 2,
                            grs: 4
                        },
                        {
                            optionId: "regeneration250",
                            name: game.i18n.localize("abfalter.kiAbilityData.regeneration250"),
                            description: game.i18n.localize("abfalter.kiAbilityData.regeneration250Desc"),
                            cost: 2,
                            mk: 10,
                            maint: 2,
                            mis: 4,
                            grs: 7
                        },
                        {
                            optionId: "regeneration500",
                            name: game.i18n.localize("abfalter.kiAbilityData.regeneration500"),
                            description: game.i18n.localize("abfalter.kiAbilityData.regeneration500Desc"),
                            cost: 4,
                            mk: 15,
                            maint: 3,
                            mis: 6,
                            grs: 11
                        }
                    ]
                }
            ]
        },
        {
            id: "mirage",
            cat: "variedEffects",
            name: game.i18n.localize("abfalter.kiAbilityData.mirage"),
            description: game.i18n.localize("abfalter.kiAbilityData.mirageDesc"),
            frequency: "turn",
            actionType: "variable",
            elements: ["water", "darkness"],
            primaryChar: "willPower",
            optionalChar: [
                { type: "agility", value: 2 },
                { type: "dexterity", value: 3 },
                { type: "consti", value: 3 },
                { type: "power", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.mirage1"), prim: 1, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.mirage2"), prim: 2, sec: 4, mk: 5, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.mirage4"), prim: 4, sec: 6, mk: 10, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.mirage6"), prim: 6, sec: 9, mk: 10, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.mirage10"), prim: 8, sec: 11, mk: 15, maint: 6, mis: 12, grs: 21, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.mirage15"), prim: 10, sec: 13, mk: 20, maint: 8, mis: 16, grs: 28, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.mirage20"), prim: 12, sec: 15, mk: 25, maint: 10, mis: 20, grs: 35, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.mirage25"), prim: 14, sec: 18, mk: 30, maint: 12, mis: 24, grs: 42, lvl: 3 }
            ],
            hasAdditionalEffect: true,
            additions: [
                {
                    groupId: "nonDetection",
                    title: game.i18n.localize("abfalter.kiAbilityData.nonDetection"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        { optionId: "nonDetectionModerate", name: game.i18n.localize("abfalter.kiAbilityData.moderate80"), description: game.i18n.localize("abfalter.kiAbilityData.nonDetectionDesc"), cost: 1, mk: 5, maint: 1, mis: 2, grs: 4 },
                        { optionId: "nonDetectionDifficult", name: game.i18n.localize("abfalter.kiAbilityData.difficult120"), description: game.i18n.localize("abfalter.kiAbilityData.nonDetectionDesc"), cost: 2, mk: 10, maint: 1, mis: 2, grs: 4 },
                        { optionId: "nonDetectionVeryDifficult", name: game.i18n.localize("abfalter.kiAbilityData.veryDifficult140"), description: game.i18n.localize("abfalter.kiAbilityData.nonDetectionDesc"), cost: 3, mk: 10, maint: 2, mis: 4, grs: 7 },
                        { optionId: "nonDetectionAbsurd", name: game.i18n.localize("abfalter.kiAbilityData.absurd180"), description: game.i18n.localize("abfalter.kiAbilityData.nonDetectionDesc"), cost: 4, mk: 15, maint: 2, mis: 4, grs: 7 },
                        { optionId: "nonDetectionAlmostImpossible", name: game.i18n.localize("abfalter.kiAbilityData.almostImpossible240"), description: game.i18n.localize("abfalter.kiAbilityData.nonDetectionDesc"), cost: 5, mk: 15, maint: 3, mis: 6, grs: 11 },
                        { optionId: "nonDetectionImpossible", name: game.i18n.localize("abfalter.kiAbilityData.impossible280"), description: game.i18n.localize("abfalter.kiAbilityData.nonDetectionDesc"), cost: 6, mk: 20, maint: 3, mis: 6, grs: 11, lvl: 2 },
                        { optionId: "nonDetectionInhuman", name: game.i18n.localize("abfalter.kiAbilityData.inhuman320"), description: game.i18n.localize("abfalter.kiAbilityData.nonDetectionDesc"), cost: 7, mk: 20, maint: 4, mis: 8, grs: 14, lvl: 2 },
                        { optionId: "nonDetectionZen", name: game.i18n.localize("abfalter.kiAbilityData.zen440"), description: game.i18n.localize("abfalter.kiAbilityData.nonDetectionDesc"), cost: 8, mk: 30, maint: 4, mis: 8, grs: 14, lvl: 3 }
                    ]
                },
                {
                    groupId: "changeAppearance",
                    title: game.i18n.localize("abfalter.kiAbilityData.genericAdv"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "changeAppearance",
                            name: game.i18n.localize("abfalter.kiAbilityData.changeAppearance"),
                            description: game.i18n.localize("abfalter.kiAbilityData.changeAppearanceDesc"),
                            cost: 2,
                            mk: 10,
                            maint: 2,
                            mis: 4,
                            grs: 7
                        }
                    ]
                },
                {
                    groupId: "phantasmalIllusions",
                    title: game.i18n.localize("abfalter.kiAbilityData.advPhantasmalIllusions"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "phantasmal140",
                            name: game.i18n.localize("abfalter.kiAbilityData.phantasmal140"),
                            description: game.i18n.localize("abfalter.kiAbilityData.phantasmalDesc"),
                            cost: 3,
                            mk: 10,
                            maint: 2,
                            mis: 4,
                            grs: 7
                        },
                        {
                            optionId: "phantasmal180",
                            name: game.i18n.localize("abfalter.kiAbilityData.phantasmal180"),
                            description: game.i18n.localize("abfalter.kiAbilityData.phantasmalDesc"),
                            cost: 4,
                            mk: 15,
                            maint: 3,
                            mis: 6,
                            grs: 11
                        },
                        {
                            optionId: "phantasmal240",
                            name: game.i18n.localize("abfalter.kiAbilityData.phantasmal240"),
                            description: game.i18n.localize("abfalter.kiAbilityData.phantasmalDesc"),
                            cost: 6,
                            mk: 20,
                            maint: 4,
                            mis: 8,
                            grs: 14
                        }
                    ]
                }
            ]
        },
        {
            id: "energyShield",
            cat: "variedEffects",
            name: game.i18n.localize("abfalter.kiAbilityData.energyShield"),
            description: game.i18n.localize("abfalter.kiAbilityData.energyShieldDesc"),
            frequency: "turn",
            actionType: "defense",
            elements: ["water", "light"],
            primaryChar: "power",
            optionalChar: [
                { type: "agility", value: 3 },
                { type: "consti", value: 2 },
                { type: "dexterity", value: 3 },
                { type: "strength", value: 2 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.damageResistance100"), prim: 2, sec: 4, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damageResistance200"), prim: 3, sec: 5, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damageResistance300"), prim: 4, sec: 6, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damageResistance400"), prim: 5, sec: 8, mk: 15, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damageResistance500"), prim: 8, sec: 11, mk: 20, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damageResistance800"), prim: 12, sec: 15, mk: 25, maint: 5, mis: 10, grs: 18, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damageResistance1000"), prim: 14, sec: 18, mk: 30, maint: 8, mis: 16, grs: 28, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damageResistance1250"), prim: 18, sec: 22, mk: 35, maint: 10, mis: 20, grs: 35, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damageResistance1500"), prim: 22, sec: 26, mk: 40, maint: 12, mis: 24, grs: 42, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.damageResistance2000"), prim: 26, sec: 32, mk: 45, maint: 14, mis: 28, grs: 49, lvl: 3 }
            ],
            hasAdditionalEffect: true,
            additions: [
                {
                    groupId: "regeneration",
                    title: game.i18n.localize("abfalter.kiAbilityData.regenerationTitle"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "regeneration100",
                            name: game.i18n.localize("abfalter.kiAbilityData.regeneration100"),
                            description: game.i18n.localize("abfalter.kiAbilityData.regeneration100Desc"),
                            cost: 1,
                            mk: 5,
                            maint: 1,
                            mis: 2,
                            grs: 4
                        },
                        {
                            optionId: "regeneration250",
                            name: game.i18n.localize("abfalter.kiAbilityData.regeneration250"),
                            description: game.i18n.localize("abfalter.kiAbilityData.regeneration250Desc"),
                            cost: 2,
                            mk: 10,
                            maint: 2,
                            mis: 4,
                            grs: 7
                        },
                        {
                            optionId: "regeneration500",
                            name: game.i18n.localize("abfalter.kiAbilityData.regeneration500"),
                            description: game.i18n.localize("abfalter.kiAbilityData.regeneration500Desc"),
                            cost: 4,
                            mk: 15,
                            maint: 3,
                            mis: 6,
                            grs: 11
                        }
                    ]
                }
            ]
        },
        {
            id: "supernaturalStates",
            cat: "variedEffects",
            name: game.i18n.localize("abfalter.kiAbilityData.supernaturalStates"),
            description: game.i18n.localize("abfalter.kiAbilityData.supernaturalStatesDesc"),
            frequency: "action",
            actionType: "attack",
            elements: ["light", "darkness"],
            primaryChar: "power",
            optionalChar: [
                { type: "consti", value: 4 },
                { type: "dexterity", value: 4 },
                { type: "strength", value: 4 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.supernaturalState40"), prim: 1, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.supernaturalState60"), prim: 2, sec: 4, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.supernaturalState80"), prim: 3, sec: 5, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.supernaturalState100"), prim: 5, sec: 8, mk: 15, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.supernaturalState120"), prim: 6, sec: 9, mk: 20, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.supernaturalState140"), prim: 8, sec: 11, mk: 25, maint: 5, mis: 10, grs: 18, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.supernaturalState160"), prim: 10, sec: 14, mk: 35, maint: 6, mis: 12, grs: 25, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.supernaturalState180"), prim: 20, sec: 24, mk: 50, maint: 8, mis: 16, grs: 28, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.supernaturalState200"), prim: 28, sec: 32, mk: 80, maint: 10, mis: 20, grs: 35, lvl: 3 }
            ],
            hasAdditionalEffect: true,
            additions: [
                {
                    groupId: "addedState",
                    title: game.i18n.localize("abfalter.kiAbilityData.addedStateTitle1"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        { optionId: "minorActionPenalty", name: game.i18n.localize("abfalter.kiAbilityData.minorActionPenalty"), description: game.i18n.localize("abfalter.kiAbilityData.effect1") + " " + game.i18n.localize("abfalter.kiAbilityData.minorActionPenaltyDesc"), cost: 1, mk: 5 },
                        { optionId: "greaterActionPenalty", name: game.i18n.localize("abfalter.kiAbilityData.greaterActionPenalty"), description: game.i18n.localize("abfalter.kiAbilityData.effect1") + " " + game.i18n.localize("abfalter.kiAbilityData.greaterActionPenaltyDesc"), cost: 4, mk: 5 },
                        { optionId: "blindness", name: game.i18n.localize("abfalter.kiAbilityData.blindness"), description: game.i18n.localize("abfalter.kiAbilityData.effect1") + " " + game.i18n.localize("abfalter.kiAbilityData.blindnessDesc"), cost: 6, mk: 15 },
                        { optionId: "charRedOne", name: game.i18n.localize("abfalter.kiAbilityData.charRedOne"), description: game.i18n.localize("abfalter.kiAbilityData.effect1") + " " + game.i18n.localize("abfalter.kiAbilityData.charRedOneDesc"), cost: 2, mk: 10 },
                        { optionId: "charRedAll", name: game.i18n.localize("abfalter.kiAbilityData.charRedAll"), description: game.i18n.localize("abfalter.kiAbilityData.effect1") + " " + game.i18n.localize("abfalter.kiAbilityData.charRedAllDesc"), cost: 5, mk: 15 },
                        { optionId: "damage", name: game.i18n.localize("abfalter.kiAbilityData.damage"), description: game.i18n.localize("abfalter.kiAbilityData.effect1") + " " + game.i18n.localize("abfalter.kiAbilityData.damageDesc"), cost: 1, mk: 5 },
                        { optionId: "doubleDamage", name: game.i18n.localize("abfalter.kiAbilityData.doubleDamage"), description: game.i18n.localize("abfalter.kiAbilityData.effect1") + " " + game.i18n.localize("abfalter.kiAbilityData.doubleDamageDesc"), cost: 5, mk: 10 },
                        { optionId: "phrReduction", name: game.i18n.localize("abfalter.kiAbilityData.phrReduction"), description: game.i18n.localize("abfalter.kiAbilityData.effect1") + " " + game.i18n.localize("abfalter.kiAbilityData.phrReductionDesc"), cost: 2, mk: 10 },
                        { optionId: "psrReduction", name: game.i18n.localize("abfalter.kiAbilityData.psrReduction"), description: game.i18n.localize("abfalter.kiAbilityData.effect1") + " " + game.i18n.localize("abfalter.kiAbilityData.psrReductionDesc"), cost: 2, mk: 10 },
                        { optionId: "fascination", name: game.i18n.localize("abfalter.kiAbilityData.fascination"), description: game.i18n.localize("abfalter.kiAbilityData.effect1") + " " + game.i18n.localize("abfalter.kiAbilityData.fascinationDesc"), cost: 6, mk: 10 },
                        { optionId: "partialParalysis", name: game.i18n.localize("abfalter.kiAbilityData.partialParalysis"), description: game.i18n.localize("abfalter.kiAbilityData.effect1") + " " + game.i18n.localize("abfalter.kiAbilityData.partialParalysisDesc"), cost: 6, mk: 10 },
                        { optionId: "fear", name: game.i18n.localize("abfalter.kiAbilityData.fear"), description: game.i18n.localize("abfalter.kiAbilityData.effect1") + " " + game.i18n.localize("abfalter.kiAbilityData.fearDesc"), cost: 3, mk: 10 },
                        { optionId: "terror", name: game.i18n.localize("abfalter.kiAbilityData.terror"), description: game.i18n.localize("abfalter.kiAbilityData.effect1") + " " + game.i18n.localize("abfalter.kiAbilityData.terrorDesc"), cost: 6, mk: 15 },
                        { optionId: "pain", name: game.i18n.localize("abfalter.kiAbilityData.pain"), description: game.i18n.localize("abfalter.kiAbilityData.effect1") + " " + game.i18n.localize("abfalter.kiAbilityData.painDesc"), cost: 3, mk: 10 },
                        { optionId: "extremePain", name: game.i18n.localize("abfalter.kiAbilityData.extremePain"), description: game.i18n.localize("abfalter.kiAbilityData.effect1") + " " + game.i18n.localize("abfalter.kiAbilityData.extremePainDesc"), cost: 6, mk: 15 },
                        { optionId: "drainKi", name: game.i18n.localize("abfalter.kiAbilityData.drainKi"), description: game.i18n.localize("abfalter.kiAbilityData.effect1") + " " + game.i18n.localize("abfalter.kiAbilityData.drainKiDesc"), cost: 8, mk: 20, lvl: 2 },
                        { optionId: "illusion", name: game.i18n.localize("abfalter.kiAbilityData.illusion"), description: game.i18n.localize("abfalter.kiAbilityData.effect1") + " " + game.i18n.localize("abfalter.kiAbilityData.illusionDesc"), cost: 7, mk: 10 },
                        { optionId: "greaterIllusion", name: game.i18n.localize("abfalter.kiAbilityData.greaterIllusion"), description: game.i18n.localize("abfalter.kiAbilityData.effect1") + " " + game.i18n.localize("abfalter.kiAbilityData.greaterIllusionDesc"), cost: 9, mk: 15 },
                        { optionId: "phantasmalIllusion", name: game.i18n.localize("abfalter.kiAbilityData.phantasmalIllusion"), description: game.i18n.localize("abfalter.kiAbilityData.effect1") + " " + game.i18n.localize("abfalter.kiAbilityData.phantasmalIllusionDesc"), cost: 11, mk: 20 },
                        { optionId: "coma", name: game.i18n.localize("abfalter.kiAbilityData.coma"), description: game.i18n.localize("abfalter.kiAbilityData.effect1") + " " + game.i18n.localize("abfalter.kiAbilityData.comaDesc"), cost: 14, mk: 40, lvl: 2 },
                        { optionId: "control", name: game.i18n.localize("abfalter.kiAbilityData.control"), description: game.i18n.localize("abfalter.kiAbilityData.effect1") + " " + game.i18n.localize("abfalter.kiAbilityData.controlDesc"), cost: 14, mk: 40, lvl: 2 },
                        { optionId: "drainLife", name: game.i18n.localize("abfalter.kiAbilityData.drainLife"), description: game.i18n.localize("abfalter.kiAbilityData.effect1") + " " + game.i18n.localize("abfalter.kiAbilityData.drainLifeDesc"), cost: 8, mk: 15, lvl: 2 },
                        { optionId: "totalParalysis", name: game.i18n.localize("abfalter.kiAbilityData.totalParalysis"), description: game.i18n.localize("abfalter.kiAbilityData.effect1") + " " + game.i18n.localize("abfalter.kiAbilityData.totalParalysisDesc"), cost: 12, mk: 20, lvl: 2 },
                        { optionId: "unconsciousness", name: game.i18n.localize("abfalter.kiAbilityData.unconsciousness"), description: game.i18n.localize("abfalter.kiAbilityData.effect1") + " " + game.i18n.localize("abfalter.kiAbilityData.unconsciousnessDesc"), cost: 12, mk: 35, lvl: 2 },
                        { optionId: "death", name: game.i18n.localize("abfalter.kiAbilityData.death"), description: game.i18n.localize("abfalter.kiAbilityData.effect1") + " " + game.i18n.localize("abfalter.kiAbilityData.deathDesc"), cost: 20, mk: 50, lvl: 3 }
                    ]
                },
                {
                    groupId: "addedState2",
                    title: game.i18n.localize("abfalter.kiAbilityData.addedStateTitle2"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        { optionId: "minorActionPenalty", name: game.i18n.localize("abfalter.kiAbilityData.minorActionPenalty"), description: game.i18n.localize("abfalter.kiAbilityData.effect2") + " " + game.i18n.localize("abfalter.kiAbilityData.minorActionPenaltyDesc"), cost: 3, mk: 5 },
                        { optionId: "greaterActionPenalty", name: game.i18n.localize("abfalter.kiAbilityData.greaterActionPenalty"), description: game.i18n.localize("abfalter.kiAbilityData.effect2") + " " + game.i18n.localize("abfalter.kiAbilityData.greaterActionPenaltyDesc"), cost: 6, mk: 5 },
                        { optionId: "blindness", name: game.i18n.localize("abfalter.kiAbilityData.blindness"), description: game.i18n.localize("abfalter.kiAbilityData.effect2") + " " + game.i18n.localize("abfalter.kiAbilityData.blindnessDesc"), cost: 8, mk: 15 },
                        { optionId: "charRedOne", name: game.i18n.localize("abfalter.kiAbilityData.charRedOne"), description: game.i18n.localize("abfalter.kiAbilityData.effect2") + " " + game.i18n.localize("abfalter.kiAbilityData.charRedOneDesc"), cost: 4, mk: 10 },
                        { optionId: "charRedAll", name: game.i18n.localize("abfalter.kiAbilityData.charRedAll"), description: game.i18n.localize("abfalter.kiAbilityData.effect2") + " " + game.i18n.localize("abfalter.kiAbilityData.charRedAllDesc"), cost: 7, mk: 15 },
                        { optionId: "damage", name: game.i18n.localize("abfalter.kiAbilityData.damage"), description: game.i18n.localize("abfalter.kiAbilityData.effect2") + " " + game.i18n.localize("abfalter.kiAbilityData.damageDesc"), cost: 3, mk: 5 },
                        { optionId: "doubleDamage", name: game.i18n.localize("abfalter.kiAbilityData.doubleDamage"), description: game.i18n.localize("abfalter.kiAbilityData.effect2") + " " + game.i18n.localize("abfalter.kiAbilityData.doubleDamageDesc"), cost: 7, mk: 10 },
                        { optionId: "phrReduction", name: game.i18n.localize("abfalter.kiAbilityData.phrReduction"), description: game.i18n.localize("abfalter.kiAbilityData.effect2") + " " + game.i18n.localize("abfalter.kiAbilityData.phrReductionDesc"), cost: 4, mk: 10 },
                        { optionId: "psrReduction", name: game.i18n.localize("abfalter.kiAbilityData.psrReduction"), description: game.i18n.localize("abfalter.kiAbilityData.effect2") + " " + game.i18n.localize("abfalter.kiAbilityData.psrReductionDesc"), cost: 4, mk: 10 },
                        { optionId: "fascination", name: game.i18n.localize("abfalter.kiAbilityData.fascination"), description: game.i18n.localize("abfalter.kiAbilityData.effect2") + " " + game.i18n.localize("abfalter.kiAbilityData.fascinationDesc"), cost: 8, mk: 10 },
                        { optionId: "partialParalysis", name: game.i18n.localize("abfalter.kiAbilityData.partialParalysis"), description: game.i18n.localize("abfalter.kiAbilityData.effect2") + " " + game.i18n.localize("abfalter.kiAbilityData.partialParalysisDesc"), cost: 8, mk: 10 },
                        { optionId: "fear", name: game.i18n.localize("abfalter.kiAbilityData.fear"), description: game.i18n.localize("abfalter.kiAbilityData.effect2") + " " + game.i18n.localize("abfalter.kiAbilityData.fearDesc"), cost: 5, mk: 10 },
                        { optionId: "terror", name: game.i18n.localize("abfalter.kiAbilityData.terror"), description: game.i18n.localize("abfalter.kiAbilityData.effect2") + " " + game.i18n.localize("abfalter.kiAbilityData.terrorDesc"), cost: 8, mk: 15 },
                        { optionId: "pain", name: game.i18n.localize("abfalter.kiAbilityData.pain"), description: game.i18n.localize("abfalter.kiAbilityData.effect2") + " " + game.i18n.localize("abfalter.kiAbilityData.painDesc"), cost: 5, mk: 10 },
                        { optionId: "extremePain", name: game.i18n.localize("abfalter.kiAbilityData.extremePain"), description: game.i18n.localize("abfalter.kiAbilityData.effect2") + " " + game.i18n.localize("abfalter.kiAbilityData.extremePainDesc"), cost: 8, mk: 15 },
                        { optionId: "drainKi", name: game.i18n.localize("abfalter.kiAbilityData.drainKi"), description: game.i18n.localize("abfalter.kiAbilityData.effect2") + " " + game.i18n.localize("abfalter.kiAbilityData.drainKiDesc"), cost: 10, mk: 20, lvl: 2 },
                        { optionId: "illusion", name: game.i18n.localize("abfalter.kiAbilityData.illusion"), description: game.i18n.localize("abfalter.kiAbilityData.effect2") + " " + game.i18n.localize("abfalter.kiAbilityData.illusionDesc"), cost: 9, mk: 10 },
                        { optionId: "greaterIllusion", name: game.i18n.localize("abfalter.kiAbilityData.greaterIllusion"), description: game.i18n.localize("abfalter.kiAbilityData.effect2") + " " + game.i18n.localize("abfalter.kiAbilityData.greaterIllusionDesc"), cost: 11, mk: 15 },
                        { optionId: "phantasmalIllusion", name: game.i18n.localize("abfalter.kiAbilityData.phantasmalIllusion"), description: game.i18n.localize("abfalter.kiAbilityData.effect2") + " " + game.i18n.localize("abfalter.kiAbilityData.phantasmalIllusionDesc"), cost: 13, mk: 20 },
                        { optionId: "coma", name: game.i18n.localize("abfalter.kiAbilityData.coma"), description: game.i18n.localize("abfalter.kiAbilityData.effect2") + " " + game.i18n.localize("abfalter.kiAbilityData.comaDesc"), cost: 16, mk: 40, lvl: 2 },
                        { optionId: "control", name: game.i18n.localize("abfalter.kiAbilityData.control"), description: game.i18n.localize("abfalter.kiAbilityData.effect2") + " " + game.i18n.localize("abfalter.kiAbilityData.controlDesc"), cost: 16, mk: 40, lvl: 2 },
                        { optionId: "drainLife", name: game.i18n.localize("abfalter.kiAbilityData.drainLife"), description: game.i18n.localize("abfalter.kiAbilityData.effect2") + " " + game.i18n.localize("abfalter.kiAbilityData.drainLifeDesc"), cost: 10, mk: 15, lvl: 2 },
                        { optionId: "totalParalysis", name: game.i18n.localize("abfalter.kiAbilityData.totalParalysis"), description: game.i18n.localize("abfalter.kiAbilityData.effect2") + " " + game.i18n.localize("abfalter.kiAbilityData.totalParalysisDesc"), cost: 14, mk: 20, lvl: 2 },
                        { optionId: "unconsciousness", name: game.i18n.localize("abfalter.kiAbilityData.unconsciousness"), description: game.i18n.localize("abfalter.kiAbilityData.effect2") + " " + game.i18n.localize("abfalter.kiAbilityData.unconsciousnessDesc"), cost: 14, mk: 35, lvl: 2 },
                        { optionId: "death", name: game.i18n.localize("abfalter.kiAbilityData.death"), description: game.i18n.localize("abfalter.kiAbilityData.effect2") + " " + game.i18n.localize("abfalter.kiAbilityData.deathDesc"), cost: 22, mk: 50, lvl: 3 }
                    ]
                },
                {
                    groupId: "addedState3",
                    title: game.i18n.localize("abfalter.kiAbilityData.addedStateTitle3"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        { optionId: "minorActionPenalty", name: game.i18n.localize("abfalter.kiAbilityData.minorActionPenalty"), description: game.i18n.localize("abfalter.kiAbilityData.effect3") + " " + game.i18n.localize("abfalter.kiAbilityData.minorActionPenaltyDesc"), cost: 5, mk: 5 },
                        { optionId: "greaterActionPenalty", name: game.i18n.localize("abfalter.kiAbilityData.greaterActionPenalty"), description: game.i18n.localize("abfalter.kiAbilityData.effect3") + " " + game.i18n.localize("abfalter.kiAbilityData.greaterActionPenaltyDesc"), cost: 7, mk: 5 },
                        { optionId: "blindness", name: game.i18n.localize("abfalter.kiAbilityData.blindness"), description: game.i18n.localize("abfalter.kiAbilityData.effect3") + " " + game.i18n.localize("abfalter.kiAbilityData.blindnessDesc"), cost: 10, mk: 15 },
                        { optionId: "charRedOne", name: game.i18n.localize("abfalter.kiAbilityData.charRedOne"), description: game.i18n.localize("abfalter.kiAbilityData.effect3") + " " + game.i18n.localize("abfalter.kiAbilityData.charRedOneDesc"), cost: 6, mk: 10 },
                        { optionId: "charRedAll", name: game.i18n.localize("abfalter.kiAbilityData.charRedAll"), description: game.i18n.localize("abfalter.kiAbilityData.effect3") + " " + game.i18n.localize("abfalter.kiAbilityData.charRedAllDesc"), cost: 9, mk: 15 },
                        { optionId: "damage", name: game.i18n.localize("abfalter.kiAbilityData.damage"), description: game.i18n.localize("abfalter.kiAbilityData.effect3") + " " + game.i18n.localize("abfalter.kiAbilityData.damageDesc"), cost: 5, mk: 5 },
                        { optionId: "doubleDamage", name: game.i18n.localize("abfalter.kiAbilityData.doubleDamage"), description: game.i18n.localize("abfalter.kiAbilityData.effect3") + " " + game.i18n.localize("abfalter.kiAbilityData.doubleDamageDesc"), cost: 9, mk: 10 },
                        { optionId: "phrReduction", name: game.i18n.localize("abfalter.kiAbilityData.phrReduction"), description: game.i18n.localize("abfalter.kiAbilityData.effect3") + " " + game.i18n.localize("abfalter.kiAbilityData.phrReductionDesc"), cost: 6, mk: 10 },
                        { optionId: "psrReduction", name: game.i18n.localize("abfalter.kiAbilityData.psrReduction"), description: game.i18n.localize("abfalter.kiAbilityData.effect3") + " " + game.i18n.localize("abfalter.kiAbilityData.psrReductionDesc"), cost: 6, mk: 10 },
                        { optionId: "fascination", name: game.i18n.localize("abfalter.kiAbilityData.fascination"), description: game.i18n.localize("abfalter.kiAbilityData.effect3") + " " + game.i18n.localize("abfalter.kiAbilityData.fascinationDesc"), cost: 10, mk: 10 },
                        { optionId: "partialParalysis", name: game.i18n.localize("abfalter.kiAbilityData.partialParalysis"), description: game.i18n.localize("abfalter.kiAbilityData.effect3") + " " + game.i18n.localize("abfalter.kiAbilityData.partialParalysisDesc"), cost: 10, mk: 10 },
                        { optionId: "fear", name: game.i18n.localize("abfalter.kiAbilityData.fear"), description: game.i18n.localize("abfalter.kiAbilityData.effect3") + " " + game.i18n.localize("abfalter.kiAbilityData.fearDesc"), cost: 7, mk: 10 },
                        { optionId: "terror", name: game.i18n.localize("abfalter.kiAbilityData.terror"), description: game.i18n.localize("abfalter.kiAbilityData.effect3") + " " + game.i18n.localize("abfalter.kiAbilityData.terrorDesc"), cost: 10, mk: 15 },
                        { optionId: "pain", name: game.i18n.localize("abfalter.kiAbilityData.pain"), description: game.i18n.localize("abfalter.kiAbilityData.effect3") + " " + game.i18n.localize("abfalter.kiAbilityData.painDesc"), cost: 7, mk: 10 },
                        { optionId: "extremePain", name: game.i18n.localize("abfalter.kiAbilityData.extremePain"), description: game.i18n.localize("abfalter.kiAbilityData.effect3") + " " + game.i18n.localize("abfalter.kiAbilityData.extremePainDesc"), cost: 10, mk: 15 },
                        { optionId: "drainKi", name: game.i18n.localize("abfalter.kiAbilityData.drainKi"), description: game.i18n.localize("abfalter.kiAbilityData.effect3") + " " + game.i18n.localize("abfalter.kiAbilityData.drainKiDesc"), cost: 12, mk: 20, lvl: 2 },
                        { optionId: "illusion", name: game.i18n.localize("abfalter.kiAbilityData.illusion"), description: game.i18n.localize("abfalter.kiAbilityData.effect3") + " " + game.i18n.localize("abfalter.kiAbilityData.illusionDesc"), cost: 11, mk: 10 },
                        { optionId: "greaterIllusion", name: game.i18n.localize("abfalter.kiAbilityData.greaterIllusion"), description: game.i18n.localize("abfalter.kiAbilityData.effect3") + " " + game.i18n.localize("abfalter.kiAbilityData.greaterIllusionDesc"), cost: 13, mk: 15 },
                        { optionId: "phantasmalIllusion", name: game.i18n.localize("abfalter.kiAbilityData.phantasmalIllusion"), description: game.i18n.localize("abfalter.kiAbilityData.effect3") + " " + game.i18n.localize("abfalter.kiAbilityData.phantasmalIllusionDesc"), cost: 15, mk: 20 },
                        { optionId: "coma", name: game.i18n.localize("abfalter.kiAbilityData.coma"), description: game.i18n.localize("abfalter.kiAbilityData.effect3") + " " + game.i18n.localize("abfalter.kiAbilityData.comaDesc"), cost: 18, mk: 40, lvl: 2 },
                        { optionId: "control", name: game.i18n.localize("abfalter.kiAbilityData.control"), description: game.i18n.localize("abfalter.kiAbilityData.effect3") + " " + game.i18n.localize("abfalter.kiAbilityData.controlDesc"), cost: 18, mk: 40, lvl: 2 },
                        { optionId: "drainLife", name: game.i18n.localize("abfalter.kiAbilityData.drainLife"), description: game.i18n.localize("abfalter.kiAbilityData.effect3") + " " + game.i18n.localize("abfalter.kiAbilityData.drainLifeDesc"), cost: 12, mk: 15, lvl: 2 },
                        { optionId: "totalParalysis", name: game.i18n.localize("abfalter.kiAbilityData.totalParalysis"), description: game.i18n.localize("abfalter.kiAbilityData.effect3") + " " + game.i18n.localize("abfalter.kiAbilityData.totalParalysisDesc"), cost: 16, mk: 20, lvl: 2 },
                        { optionId: "unconsciousness", name: game.i18n.localize("abfalter.kiAbilityData.unconsciousness"), description: game.i18n.localize("abfalter.kiAbilityData.effect3") + " " + game.i18n.localize("abfalter.kiAbilityData.unconsciousnessDesc"), cost: 16, mk: 35, lvl: 2 },
                        { optionId: "death", name: game.i18n.localize("abfalter.kiAbilityData.death"), description: game.i18n.localize("abfalter.kiAbilityData.effect3") + " " + game.i18n.localize("abfalter.kiAbilityData.deathDesc"), cost: 24, mk: 50, lvl: 3 }
                    ]
                },
                {
                    groupId: "predeterminedCondition",
                    title: game.i18n.localize("abfalter.kiAbilityData.advPredeterminedCondition"),
                    type: "advantage",
                    exclusive: true,
                    options: [
                        { optionId: "attack", name: game.i18n.localize("abfalter.kiAbilityData.attack"), description: game.i18n.localize("abfalter.kiAbilityData.attackDesc") },
                        { optionId: "kiss", name: game.i18n.localize("abfalter.kiAbilityData.kiss"), description: game.i18n.localize("abfalter.kiAbilityData.kissDesc"), cost: 1, mk: 10 },
                        { optionId: "physicalContact", name: game.i18n.localize("abfalter.kiAbilityData.physicalContact"), description: game.i18n.localize("abfalter.kiAbilityData.physicalContactDesc"), cost: 2, mk: 5 },
                        { optionId: "mutualVisual", name: game.i18n.localize("abfalter.kiAbilityData.mutualVisual"), description: game.i18n.localize("abfalter.kiAbilityData.mutualVisualDesc"), cost: 8, mk: 15 },
                        { optionId: "visualOne", name: game.i18n.localize("abfalter.kiAbilityData.visualOne"), description: game.i18n.localize("abfalter.kiAbilityData.visualOneDesc"), cost: 12, mk: 30, lvl: 2 },
                        { optionId: "visualSeveral", name: game.i18n.localize("abfalter.kiAbilityData.visualSeveral"), description: game.i18n.localize("abfalter.kiAbilityData.visualSeveralDesc"), cost: 16, mk: 40, lvl: 3 },
                        { optionId: "inhaled", name: game.i18n.localize("abfalter.kiAbilityData.inhaled"), description: game.i18n.localize("abfalter.kiAbilityData.inhaledDesc"), cost: 20, mk: 50, lvl: 3 },
                        { optionId: "heardOne", name: game.i18n.localize("abfalter.kiAbilityData.heardOne"), description: game.i18n.localize("abfalter.kiAbilityData.heardOneDesc"), cost: 13, mk: 35, lvl: 2 },
                        { optionId: "heardSeveral", name: game.i18n.localize("abfalter.kiAbilityData.heardSeveral"), description: game.i18n.localize("abfalter.kiAbilityData.heardSeveralDesc"), cost: 18, mk: 45, lvl: 3 },
                        { optionId: "alongGround", name: game.i18n.localize("abfalter.kiAbilityData.alongGround"), description: game.i18n.localize("abfalter.kiAbilityData.alongGroundDesc"), cost: 12, mk: 30, lvl: 2 },
                        { optionId: "alongGroundImproved", name: game.i18n.localize("abfalter.kiAbilityData.alongGroundImproved"), description: game.i18n.localize("abfalter.kiAbilityData.alongGroundImprovedDesc"), cost: 18, mk: 45, lvl: 3 }
                    ]
                },
                {
                    groupId: "rangeOfEffect",
                    title: game.i18n.localize("abfalter.kiAbilityData.rangeOfEffectTitle"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        { optionId: "range3", name: game.i18n.localize("abfalter.kiAbilityData.distance3ft"), description: game.i18n.localize("abfalter.kiAbilityData.rangeOfEffectDesc"), cost: 1, mk: 5 },
                        { optionId: "range15", name: game.i18n.localize("abfalter.kiAbilityData.distance15ft"), description: game.i18n.localize("abfalter.kiAbilityData.rangeOfEffectDesc"), cost: 3, mk: 5 },
                        { optionId: "range30", name: game.i18n.localize("abfalter.kiAbilityData.distance30ft"), description: game.i18n.localize("abfalter.kiAbilityData.rangeOfEffectDesc"), cost: 5, mk: 10 },
                        { optionId: "range80", name: game.i18n.localize("abfalter.kiAbilityData.distance80ft"), description: game.i18n.localize("abfalter.kiAbilityData.rangeOfEffectDesc"), cost: 8, mk: 10 },
                        { optionId: "range150", name: game.i18n.localize("abfalter.kiAbilityData.distance150ft"), description: game.i18n.localize("abfalter.kiAbilityData.rangeOfEffectDesc"), cost: 12, mk: 15, lvl: 2 },
                        { optionId: "range300", name: game.i18n.localize("abfalter.kiAbilityData.distance300ft"), description: game.i18n.localize("abfalter.kiAbilityData.rangeOfEffectDesc"), cost: 15, mk: 20, lvl: 2 },
                        { optionId: "range500", name: game.i18n.localize("abfalter.kiAbilityData.distance500ft"), description: game.i18n.localize("abfalter.kiAbilityData.rangeOfEffectDesc"), cost: 20, mk: 25, lvl: 3 },
                        { optionId: "range1500", name: game.i18n.localize("abfalter.kiAbilityData.distance1500ft"), description: game.i18n.localize("abfalter.kiAbilityData.rangeOfEffectDesc"), cost: 25, mk: 30, lvl: 3 }
                    ]
                }
            ]
        },
        {
            id: "impact",
            cat: "variedEffects",
            name: game.i18n.localize("abfalter.kiAbilityData.impact"),
            description: game.i18n.localize("abfalter.kiAbilityData.impactDesc"),
            frequency: "action",
            actionType: "attack",
            elements: ["fire", "earth"],
            primaryChar: "strength",
            optionalChar: [
                { type: "consti", value: 2 },
                { type: "dexterity", value: 3 },
                { type: "power", value: 1 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.impact4"), prim: 1, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.impact6"), prim: 2, sec: 4, mk: 5, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.impact8"), prim: 3, sec: 5, mk: 10, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.impact10"), prim: 4, sec: 6, mk: 10, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.impact12"), prim: 5, sec: 8, mk: 15, maint: 5, mis: 10, grs: 18, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.impact14"), prim: 6, sec: 9, mk: 20, maint: 6, mis: 12, grs: 21, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.impact16"), prim: 8, sec: 11, mk: 25, maint: 7, mis: 14, grs: 25, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.impact18"), prim: 10, sec: 13, mk: 30, maint: 8, mis: 16, grs: 28, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.impact20"), prim: 12, sec: 15, mk: 35, maint: 10, mis: 20, grs: 35, lvl: 3 }
            ],
            hasAdditionalEffect: true,
            additions: [
                {
                    groupId: "attract",
                    title: game.i18n.localize("abfalter.kiAbilityData.genericAdv"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "attract",
                            name: game.i18n.localize("abfalter.kiAbilityData.attract"),
                            description: game.i18n.localize("abfalter.kiAbilityData.attractDesc"),
                            cost: 1,
                            mk: 5,
                            maint: 1,
                            mis: 2,
                            grs: 4
                        }
                    ]
                }
            ]
        },
        {
            id: "interruption",
            cat: "variedEffects",
            name: game.i18n.localize("abfalter.kiAbilityData.interruption"),
            description: game.i18n.localize("abfalter.kiAbilityData.interruptionDesc"),
            frequency: "action",
            actionType: "attack",
            elements: ["water", "air", "light"],
            primaryChar: "willPower",
            optionalChar: [
                { type: "consti", value: 3 },
                { type: "dexterity", value: 3 },
                { type: "strength", value: 2 },
                { type: "power", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.interruptDamage"), prim: 1, sec: 2, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.interruptDamage20"), prim: 2, sec: 4, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.interruptDamage40"), prim: 4, sec: 6, mk: 15, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.interruptDamage60"), prim: 6, sec: 9, mk: 20, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.interruptDamage80"), prim: 8, sec: 11, mk: 25, maint: 6, mis: 12, grs: 21, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.interruptDamage100"), prim: 12, sec: 15, mk: 30, maint: 8, mis: 16, grs: 28, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.interruptDamage120"), prim: 16, sec: 20, mk: 35, maint: 10, mis: 20, grs: 35, lvl: 3 }
            ],
            hasAdditionalEffect: true,
            additions: [
                {
                    groupId: "typeOfInterruption",
                    title: game.i18n.localize("abfalter.kiAbilityData.typeOfInterruptionTitle"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "interruptKi",
                            name: game.i18n.localize("abfalter.kiAbilityData.interruptKi"),
                            description: game.i18n.localize("abfalter.kiAbilityData.interruptKiDesc"),
                            cost: 2,
                            mk: 5,
                            maint: 1,
                            mis: 2,
                            grs: 4
                        },
                        {
                            optionId: "interruptMagic",
                            name: game.i18n.localize("abfalter.kiAbilityData.interruptMagic"),
                            description: game.i18n.localize("abfalter.kiAbilityData.interruptMagicDesc"),
                            cost: 2,
                            mk: 5,
                            maint: 1,
                            mis: 2,
                            grs: 4
                        },
                        {
                            optionId: "interruptPsychic",
                            name: game.i18n.localize("abfalter.kiAbilityData.interruptPsychic"),
                            description: game.i18n.localize("abfalter.kiAbilityData.interruptPsychicDesc"),
                            cost: 2,
                            mk: 5,
                            maint: 1,
                            mis: 2,
                            grs: 4
                        }
                    ]
                },
                {
                    groupId: "typeOfInterruption2",
                    title: game.i18n.localize("abfalter.kiAbilityData.typeOfInterruptionTitle"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "interruptKi",
                            name: game.i18n.localize("abfalter.kiAbilityData.interruptKi"),
                            description: game.i18n.localize("abfalter.kiAbilityData.interruptKiDesc"),
                            cost: 2,
                            mk: 5,
                            maint: 1,
                            mis: 2,
                            grs: 4
                        },
                        {
                            optionId: "interruptMagic",
                            name: game.i18n.localize("abfalter.kiAbilityData.interruptMagic"),
                            description: game.i18n.localize("abfalter.kiAbilityData.interruptMagicDesc"),
                            cost: 2,
                            mk: 5,
                            maint: 1,
                            mis: 2,
                            grs: 4
                        },
                        {
                            optionId: "interruptPsychic",
                            name: game.i18n.localize("abfalter.kiAbilityData.interruptPsychic"),
                            description: game.i18n.localize("abfalter.kiAbilityData.interruptPsychicDesc"),
                            cost: 2,
                            mk: 5,
                            maint: 1,
                            mis: 2,
                            grs: 4
                        }
                    ]
                },
                {
                    groupId: "typeOfInterruption3",
                    title: game.i18n.localize("abfalter.kiAbilityData.typeOfInterruptionTitle"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "interruptKi",
                            name: game.i18n.localize("abfalter.kiAbilityData.interruptKi"),
                            description: game.i18n.localize("abfalter.kiAbilityData.interruptKiDesc"),
                            cost: 2,
                            mk: 5,
                            maint: 1,
                            mis: 2,
                            grs: 4
                        },
                        {
                            optionId: "interruptMagic",
                            name: game.i18n.localize("abfalter.kiAbilityData.interruptMagic"),
                            description: game.i18n.localize("abfalter.kiAbilityData.interruptMagicDesc"),
                            cost: 2,
                            mk: 5,
                            maint: 1,
                            mis: 2,
                            grs: 4
                        },
                        {
                            optionId: "interruptPsychic",
                            name: game.i18n.localize("abfalter.kiAbilityData.interruptPsychic"),
                            description: game.i18n.localize("abfalter.kiAbilityData.interruptPsychicDesc"),
                            cost: 2,
                            mk: 5,
                            maint: 1,
                            mis: 2,
                            grs: 4
                        }
                    ]
                }
            ]
        },
        {
            id: "brand",
            cat: "variedEffects",
            name: game.i18n.localize("abfalter.kiAbilityData.brand"),
            description: game.i18n.localize("abfalter.kiAbilityData.brandDesc"),
            frequency: "action",
            actionType: "attack",
            elements: ["air", "light", "darkness"],
            primaryChar: "power",
            optionalChar: [
                { type: "consti", value: 2 },
                { type: "dexterity", value: 3 },
                { type: "strength", value: 3 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.minorBrand"), prim: 4, sec: 6, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.greaterBrand"), prim: 10, sec: 13, mk: 25, maint: 4, mis: 8, grs: 14, lvl: 2 }
            ],
            hasAdditionalEffect: true,
            additions: [
                {
                    groupId: "extendDuration",
                    title: game.i18n.localize("abfalter.kiAbilityData.extendDurationTitle"),
                    type: "advantage",
                    exclusive: true,
                    options: [
                        {
                            optionId: "prolonged",
                            name: game.i18n.localize("abfalter.kiAbilityData.extendDurationProlonged"),
                            description: game.i18n.localize("abfalter.kiAbilityData.extendDurationProlongedDesc"),
                            cost: 4,
                            mk: 10,
                            maint: 0,
                            mis: 0,
                            grs: 0
                        },
                        {
                            optionId: "eternal",
                            name: game.i18n.localize("abfalter.kiAbilityData.extendDurationEternal"),
                            description: game.i18n.localize("abfalter.kiAbilityData.extendDurationEternalDesc"),
                            cost: 10,
                            mk: 30,
                            maint: 2,
                            mis: 4,
                            grs: 7
                        }
                    ]
                }
            ]
        },
        {
            id: "intangibility",
            cat: "variedEffects",
            name: game.i18n.localize("abfalter.kiAbilityData.intangibility"),
            description: game.i18n.localize("abfalter.kiAbilityData.intangibilityDesc"),
            frequency: "turn",
            actionType: "variable",
            elements: ["water", "light", "darkness"],
            primaryChar: "power",
            optionalChar: [
                { type: "consti", value: 3 },
                { type: "dexterity", value: 3 },
                { type: "strength", value: 3 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.intangibility"), prim: 3, sec: 5, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 }
            ],
            hasAdditionalEffect: true,
            additions: [
                {
                    groupId: "affectOthers",
                    title: game.i18n.localize("abfalter.kiAbilityData.affectOthersTitle"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "simplePresence",
                            name: game.i18n.localize("abfalter.kiAbilityData.simplePresence"),
                            description: game.i18n.localize("abfalter.kiAbilityData.simplePresenceDesc"),
                            cost: 1,
                            mk: 5,
                            maint: 1,
                            mis: 2,
                            grs: 4
                        },
                        {
                            optionId: "extendedPresence",
                            name: game.i18n.localize("abfalter.kiAbilityData.extendedPresence"),
                            description: game.i18n.localize("abfalter.kiAbilityData.extendedPresenceDesc"),
                            cost: 3,
                            mk: 10,
                            maint: 2,
                            mis: 4,
                            grs: 7
                        }
                    ]
                },
                {
                    groupId: "fusion",
                    title: game.i18n.localize("abfalter.kiAbilityData.genericAdv"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "fusion",
                            name: game.i18n.localize("abfalter.kiAbilityData.fusion"),
                            description: game.i18n.localize("abfalter.kiAbilityData.fusionDesc"),
                            cost: 2,
                            mk: 10,
                            maint: 2,
                            mis: 4,
                            grs: 7
                        }
                    ]
                }
            ]
        },
        {
            id: "criticalEnhancementSingle",
            cat: "variedEffects",
            name: game.i18n.localize("abfalter.kiAbilityData.criticalEnhancementSingle"),
            description: game.i18n.localize("abfalter.kiAbilityData.criticalEnhancementSingleDesc"),
            frequency: "action",
            actionType: "attack",
            elements: ["fire", "earth"],
            primaryChar: "power",
            optionalChar: [
                { type: "consti", value: 2 },
                { type: "dexterity", value: 2 },
                { type: "strength", value: 1 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.criticalPlus10"), prim: 2, sec: 4, mk: 5, maint: 1, mis: 2, grs: 4, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.criticalPlus25"), prim: 3, sec: 5, mk: 5, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.criticalPlus40"), prim: 4, sec: 6, mk: 10, maint: 3, mis: 6, grs: 11, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.criticalPlus50"), prim: 5, sec: 8, mk: 15, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.criticalPlus75"), prim: 8, sec: 11, mk: 20, maint: 6, mis: 12, grs: 21, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.criticalPlus90"), prim: 12, sec: 15, mk: 25, maint: 8, mis: 16, grs: 28, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.criticalPlus100"), prim: 14, sec: 18, mk: 30, maint: 10, mis: 20, grs: 35, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.criticalPlus125"), prim: 18, sec: 22, mk: 35, maint: 12, mis: 24, grs: 42, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.criticalPlus150"), prim: 22, sec: 26, mk: 40, maint: 14, mis: 28, grs: 49, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.criticalPlus175"), prim: 26, sec: 32, mk: 45, maint: 16, mis: 32, grs: 56, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.criticalPlus200"), prim: 30, sec: 36, mk: 50, maint: 18, mis: 36, grs: 63, lvl: 3 }
            ],
            hasAdditionalEffect: true,
            additions: [
                {
                    groupId: "autoCritical",
                    title: game.i18n.localize("abfalter.kiAbilityData.genericAdv"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "autoCritical",
                            name: game.i18n.localize("abfalter.kiAbilityData.automaticCritical"),
                            description: game.i18n.localize("abfalter.kiAbilityData.automaticCriticalDesc"),
                            cost: 8,
                            mk: 30,
                            maint: 4,
                            mis: 8,
                            grs: 14
                        }
                    ]
                }
            ]
        },
        {
            id: "criticalEnhancementMultiple",
            cat: "variedEffects",
            name: game.i18n.localize("abfalter.kiAbilityData.criticalEnhancementMultiple"),
            description: game.i18n.localize("abfalter.kiAbilityData.criticalEnhancementMultipleDesc"),
            frequency: "turn",
            actionType: "attack",
            elements: ["fire", "earth"],
            primaryChar: "power",
            optionalChar: [
                { type: "consti", value: 2 },
                { type: "dexterity", value: 2 },
                { type: "strength", value: 1 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.criticalPlus10"), prim: 3, sec: 5, mk: 10, maint: 2, mis: 4, grs: 7, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.criticalPlus25"), prim: 5, sec: 8, mk: 20, maint: 4, mis: 8, grs: 14, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.criticalPlus40"), prim: 7, sec: 9, mk: 25, maint: 6, mis: 12, grs: 21, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.criticalPlus50"), prim: 9, sec: 12, mk: 35, maint: 8, mis: 16, grs: 28, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.criticalPlus75"), prim: 12, sec: 15, mk: 50, maint: 10, mis: 20, grs: 35, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.criticalPlus90"), prim: 16, sec: 20, mk: 60, maint: 12, mis: 24, grs: 42, lvl: 3 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.criticalPlus100"), prim: 18, sec: 22, mk: 65, maint: 14, mis: 28, grs: 49, lvl: 3 }
            ],
            hasAdditionalEffect: true,
            additions: [
                {
                    groupId: "autoCritical",
                    title: game.i18n.localize("abfalter.kiAbilityData.genericAdv"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "autoCritical",
                            name: game.i18n.localize("abfalter.kiAbilityData.automaticCritical"),
                            description: game.i18n.localize("abfalter.kiAbilityData.automaticCriticalDesc"),
                            cost: 8,
                            mk: 30,
                            maint: 4,
                            mis: 8,
                            grs: 14
                        }
                    ]
                }
            ]
        },
        {
            id: "attackMirroring",
            cat: "variedEffects",
            name: game.i18n.localize("abfalter.kiAbilityData.attackMirroring"),
            description: game.i18n.localize("abfalter.kiAbilityData.attackMirroringDesc"),
            frequency: "action",
            actionType: "defense",
            elements: ["water", "light", "darkness"],
            primaryChar: "power",
            optionalChar: [
                { type: "agility", value: 3 },
                { type: "dexterity", value: 3 },
                { type: "strength", value: 2 },
                { type: "willPower", value: 1 }
            ],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.attackMirroring"), prim: 12, sec: 15, mk: 30, maint: 8, mis: 16, grs: 28, lvl: 2 }
            ],
            hasAdditionalEffect: true,
            additions: [
                {
                    groupId: "targetChoice",
                    title: game.i18n.localize("abfalter.kiAbilityData.genericAdv"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "targetChoice",
                            name: game.i18n.localize("abfalter.kiAbilityData.targetChoice"),
                            description: game.i18n.localize("abfalter.kiAbilityData.targetChoiceDesc"),
                            cost: 2,
                            mk: 10,
                            maint: 2,
                            mis: 4,
                            grs: 7
                        }
                    ]
                },
                {
                    groupId: "mirrorEsoteric",
                    title: game.i18n.localize("abfalter.kiAbilityData.genericAdv"),
                    type: "advantage",
                    exclusive: false,
                    options: [
                        {
                            optionId: "mirrorEsoteric",
                            name: game.i18n.localize("abfalter.kiAbilityData.mirrorEsoteric"),
                            description: game.i18n.localize("abfalter.kiAbilityData.mirrorEsotericDesc"),
                            cost: 4,
                            mk: 20,
                            maint: 1,
                            mis: 2,
                            grs: 4
                        }
                    ]
                }
            ]
        },
        {
            id: "exhaustion",
            cat: "disadvantages",
            name: game.i18n.localize("abfalter.kiAbilityData.exhaustion"),
            description: game.i18n.localize("abfalter.kiAbilityData.exhaustionDesc"),
            frequency: "variable",
            actionType: "variable",
            elements: [],
            primaryChar: "",
            optionalChar: [],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.exhaustion1"), prim: 0, sec: 0, mk: -5, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.exhaustion2"), prim: 0, sec: 0, mk: -10, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.exhaustion3"), prim: 0, sec: 0, mk: -15, maint: 0, mis: 0, grs: 0, lvl: 2 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "elementalBinding",
            cat: "disadvantages",
            name: game.i18n.localize("abfalter.kiAbilityData.elementalBinding"),
            description: game.i18n.localize("abfalter.kiAbilityData.elementalBindingDesc"),
            frequency: "variable",
            actionType: "variable",
            elements: [],
            primaryChar: "",
            optionalChar: [],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.elementalBinding1"), prim: 0, sec: 0, mk: -15, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.elementalBinding2"), prim: 0, sec: 0, mk: -10, maint: 0, mis: 0, grs: 0, lvl: 1 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "specializedAttack",
            cat: "disadvantages",
            name: game.i18n.localize("abfalter.kiAbilityData.specializedAttack"),
            description: game.i18n.localize("abfalter.kiAbilityData.specializedAttackDesc"),
            frequency: "attack",
            actionType: "attack",
            elements: [],
            primaryChar: "",
            optionalChar: [],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.onlyAgainstBlock"), prim: 0, sec: 0, mk: -10, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.onlyAgainstDodge"), prim: 0, sec: 0, mk: -10, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.onlyAgainstResistance"), prim: 0, sec: 0, mk: -10, maint: 0, mis: 0, grs: 0, lvl: 1 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "tiedToWeapon",
            cat: "disadvantages",
            name: game.i18n.localize("abfalter.kiAbilityData.tiedToWeapon"),
            description: game.i18n.localize("abfalter.kiAbilityData.tiedToWeaponDesc"),
            frequency: "variable",
            actionType: "variable",
            elements: [],
            primaryChar: "",
            optionalChar: [],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.weaponType"), prim: 0, sec: 0, mk: -5, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.specificWeapon"), prim: 0, sec: 0, mk: -10, maint: 0, mis: 0, grs: 0, lvl: 1 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "limitedCircumstance",
            cat: "disadvantages",
            name: game.i18n.localize("abfalter.kiAbilityData.limitedCircumstance"),
            description: game.i18n.localize("abfalter.kiAbilityData.limitedCircumstanceDesc"),
            frequency: "variable",
            actionType: "variable",
            elements: [],
            primaryChar: "",
            optionalChar: [],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.suffersDamage"), prim: 0, sec: 0, mk: -10, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.halfLifePoints"), prim: 0, sec: 0, mk: -10, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.quarterLifePoints"), prim: 0, sec: 0, mk: -15, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.negativeLifePoints"), prim: 0, sec: 0, mk: -25, maint: 0, mis: 0, grs: 0, lvl: 2 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "combatCircumstance",
            cat: "disadvantages",
            name: game.i18n.localize("abfalter.kiAbilityData.combatCircumstance"),
            description: game.i18n.localize("abfalter.kiAbilityData.combatCircumstanceDesc"),
            frequency: "attack",
            actionType: "attack",
            elements: [],
            primaryChar: "",
            optionalChar: [],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.combatCircumstance"), prim: 0, sec: 0, mk: -5, maint: 0, mis: 0, grs: 0, lvl: 1 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "complex",
            cat: "disadvantages",
            name: game.i18n.localize("abfalter.kiAbilityData.complex"),
            description: game.i18n.localize("abfalter.kiAbilityData.complexDesc"),
            frequency: "variable",
            actionType: "variable",
            elements: [],
            primaryChar: "",
            optionalChar: [],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.complex"), prim: 0, sec: 0, mk: -5, maint: 0, mis: 0, grs: 0, lvl: 2 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "conditions",
            cat: "disadvantages",
            name: game.i18n.localize("abfalter.kiAbilityData.conditions"),
            description: game.i18n.localize("abfalter.kiAbilityData.conditionsDesc"),
            frequency: "variable",
            actionType: "variable",
            elements: [],
            primaryChar: "",
            optionalChar: [],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.unsheathe"), prim: 0, sec: 0, mk: -5, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.flying"), prim: 0, sec: 0, mk: -5, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.charging"), prim: 0, sec: 0, mk: -5, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.mounted"), prim: 0, sec: 0, mk: -5, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.day"), prim: 0, sec: 0, mk: -10, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.night"), prim: 0, sec: 0, mk: -10, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.terrain"), prim: 0, sec: 0, mk: -10, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.time"), prim: 0, sec: 0, mk: -20, maint: 0, mis: 0, grs: 0, lvl: 2 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "reducedDamage",
            cat: "disadvantages",
            name: game.i18n.localize("abfalter.kiAbilityData.reducedDamage"),
            description: game.i18n.localize("abfalter.kiAbilityData.reducedDamageDesc"),
            frequency: "attack",
            actionType: "attack",
            elements: [],
            primaryChar: "",
            optionalChar: [],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.noDamage"), prim: 0, sec: 0, mk: -20, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.halfDamage"), prim: 0, sec: 0, mk: -10, maint: 0, mis: 0, grs: 0, lvl: 1 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "specializedDefense",
            cat: "disadvantages",
            name: game.i18n.localize("abfalter.kiAbilityData.specializedDefense"),
            description: game.i18n.localize("abfalter.kiAbilityData.specializedDefenseDesc"),
            frequency: "defense",
            actionType: "defense",
            elements: [],
            primaryChar: "",
            optionalChar: [],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.physicalAttacks"), prim: 0, sec: 0, mk: -5, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.projectiles"), prim: 0, sec: 0, mk: -10, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.kiTechniques"), prim: 0, sec: 0, mk: -10, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.spells"), prim: 0, sec: 0, mk: -15, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.psychicPowers"), prim: 0, sec: 0, mk: -15, maint: 0, mis: 0, grs: 0, lvl: 1 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "exterminator",
            cat: "disadvantages",
            name: game.i18n.localize("abfalter.kiAbilityData.exterminator"),
            description: game.i18n.localize("abfalter.kiAbilityData.exterminatorDesc"),
            frequency: "attack",
            actionType: "attack",
            elements: [],
            primaryChar: "",
            optionalChar: [],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.againstHumanoids"), prim: 0, sec: 0, mk: -5, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.againstType"), prim: 0, sec: 0, mk: -10, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.againstSpecific"), prim: 0, sec: 0, mk: -30, maint: 0, mis: 0, grs: 0, lvl: 2 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "excessiveEnergyUse",
            cat: "disadvantages",
            name: game.i18n.localize("abfalter.kiAbilityData.excessiveEnergyUse"),
            description: game.i18n.localize("abfalter.kiAbilityData.excessiveEnergyUseDesc"),
            frequency: "variable",
            actionType: "variable",
            elements: [],
            primaryChar: "",
            optionalChar: [],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.excessiveEnergyUse"), prim: 0, sec: 0, mk: -15, maint: 0, mis: 0, grs: 0, lvl: 1 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "weaponLoss",
            cat: "disadvantages",
            name: game.i18n.localize("abfalter.kiAbilityData.weaponLoss"),
            description: game.i18n.localize("abfalter.kiAbilityData.weaponLossDesc"),
            frequency: "variable",
            actionType: "variable",
            elements: [],
            primaryChar: "",
            optionalChar: [],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.weaponLoss"), prim: 0, sec: 0, mk: -10, maint: 0, mis: 0, grs: 0, lvl: 1 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "actionPenalty",
            cat: "disadvantages",
            name: game.i18n.localize("abfalter.kiAbilityData.actionPenalty"),
            description: game.i18n.localize("abfalter.kiAbilityData.actionPenaltyDesc"),
            frequency: "variable",
            actionType: "variable",
            elements: [],
            primaryChar: "",
            optionalChar: [],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.penalty50"), prim: 0, sec: 0, mk: -10, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.penalty75"), prim: 0, sec: 0, mk: -15, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.penalty100"), prim: 0, sec: 0, mk: -20, maint: 0, mis: 0, grs: 0, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.penalty125"), prim: 0, sec: 0, mk: -25, maint: 0, mis: 0, grs: 0, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.penalty150"), prim: 0, sec: 0, mk: -30, maint: 0, mis: 0, grs: 0, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "predetermination",
            cat: "disadvantages",
            name: game.i18n.localize("abfalter.kiAbilityData.predetermination"),
            description: game.i18n.localize("abfalter.kiAbilityData.predeterminationDesc"),
            frequency: "variable",
            actionType: "variable",
            elements: [],
            primaryChar: "",
            optionalChar: [],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.predetermination"), prim: 0, sec: 0, mk: -20, maint: 0, mis: 0, grs: 0, lvl: 2 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "advancePreparation",
            cat: "disadvantages",
            name: game.i18n.localize("abfalter.kiAbilityData.advancePreparation"),
            description: game.i18n.localize("abfalter.kiAbilityData.advancePreparationDesc"),
            frequency: "variable",
            actionType: "variable",
            elements: [],
            primaryChar: "",
            optionalChar: [],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.oneMinutePrep"), prim: 0, sec: 0, mk: -10, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.oneHourPrep"), prim: 0, sec: 0, mk: -15, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.oneDayPrep"), prim: 0, sec: 0, mk: -25, maint: 0, mis: 0, grs: 0, lvl: 2 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "elementalRequirements",
            cat: "disadvantages",
            name: game.i18n.localize("abfalter.kiAbilityData.elementalRequirements"),
            description: game.i18n.localize("abfalter.kiAbilityData.elementalRequirementsDesc"),
            frequency: "variable",
            actionType: "variable",
            elements: [],
            primaryChar: "",
            optionalChar: [],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.lesserIntensity"), prim: 0, sec: 0, mk: -10, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.greaterIntensity"), prim: 0, sec: 0, mk: -5, maint: 0, mis: 0, grs: 0, lvl: 1 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "vitalSacrifice",
            cat: "disadvantages",
            name: game.i18n.localize("abfalter.kiAbilityData.vitalSacrificeDisv"),
            description: game.i18n.localize("abfalter.kiAbilityData.vitalSacrificeDisvDesc"),
            frequency: "variable",
            actionType: "variable",
            elements: [],
            primaryChar: "",
            optionalChar: [],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.sacrifice25"), prim: 0, sec: 0, mk: -5, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.sacrifice50"), prim: 0, sec: 0, mk: -10, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.sacrifice75"), prim: 0, sec: 0, mk: -15, maint: 0, mis: 0, grs: 0, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.sacrifice100"), prim: 0, sec: 0, mk: -20, maint: 0, mis: 0, grs: 0, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.sacrificeAll"), prim: 0, sec: 0, mk: -25, maint: 0, mis: 0, grs: 0, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "characteristicSacrifice",
            cat: "disadvantages",
            name: game.i18n.localize("abfalter.kiAbilityData.characteristicSacrificeDisv"),
            description: game.i18n.localize("abfalter.kiAbilityData.characteristicSacrificeDisvDesc"),
            frequency: "variable",
            actionType: "variable",
            elements: [],
            primaryChar: "",
            optionalChar: [],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.characteristicSacrificeDisv"), prim: 0, sec: 0, mk: -30, maint: 0, mis: 0, grs: 0, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "defenseless",
            cat: "disadvantages",
            name: game.i18n.localize("abfalter.kiAbilityData.defenseless"),
            description: game.i18n.localize("abfalter.kiAbilityData.defenselessDesc"),
            frequency: "attack",
            actionType: "attack",
            elements: [],
            primaryChar: "",
            optionalChar: [],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.defenseless"), prim: 0, sec: 0, mk: -15, maint: 0, mis: 0, grs: 0, lvl: 1 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "overload",
            cat: "disadvantages",
            name: game.i18n.localize("abfalter.kiAbilityData.overload"),
            description: game.i18n.localize("abfalter.kiAbilityData.overloadDesc"),
            frequency: "variable",
            actionType: "variable",
            elements: [],
            primaryChar: "",
            optionalChar: [],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.delay5"), prim: 0, sec: 0, mk: -5, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.delay20"), prim: 0, sec: 0, mk: -10, maint: 0, mis: 0, grs: 0, lvl: 1 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "finalTechnique",
            cat: "disadvantages",
            name: game.i18n.localize("abfalter.kiAbilityData.finalTechnique"),
            description: game.i18n.localize("abfalter.kiAbilityData.finalTechniqueDesc"),
            frequency: "variable",
            actionType: "variable",
            elements: [],
            primaryChar: "",
            optionalChar: [],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.finalTechnique"), prim: 0, sec: 0, mk: -55, maint: 0, mis: 0, grs: 0, lvl: 2 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "maintainedTechnique",
            cat: "disadvantages",
            name: game.i18n.localize("abfalter.kiAbilityData.maintainedTechnique"),
            description: game.i18n.localize("abfalter.kiAbilityData.maintainedTechniqueDesc"),
            frequency: "variable",
            actionType: "variable",
            elements: [],
            primaryChar: "",
            optionalChar: [],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.level1Technique"), prim: 0, sec: 0, mk: -5, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.level2Technique"), prim: 0, sec: 0, mk: -10, maint: 0, mis: 0, grs: 0, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.level3Technique"), prim: 0, sec: 0, mk: -15, maint: 0, mis: 0, grs: 0, lvl: 3 }
            ],
            hasAdditionalEffect: false
        },
        {
            id: "limitedUses",
            cat: "disadvantages",
            name: game.i18n.localize("abfalter.kiAbilityData.limitedUses"),
            description: game.i18n.localize("abfalter.kiAbilityData.limitedUsesDesc"),
            frequency: "variable",
            actionType: "variable",
            elements: [],
            primaryChar: "",
            optionalChar: [],
            tiers: [
                { ability: game.i18n.localize("abfalter.kiAbilityData.twentyUses"), prim: 0, sec: 0, mk: -10, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.tenUses"), prim: 0, sec: 0, mk: -20, maint: 0, mis: 0, grs: 0, lvl: 1 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.fiveUses"), prim: 0, sec: 0, mk: -25, maint: 0, mis: 0, grs: 0, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.threeUses"), prim: 0, sec: 0, mk: -30, maint: 0, mis: 0, grs: 0, lvl: 2 },
                { ability: game.i18n.localize("abfalter.kiAbilityData.oneUse"), prim: 0, sec: 0, mk: -40, maint: 0, mis: 0, grs: 0, lvl: 3 }
            ],
            hasAdditionalEffect: false
        }
    ]
}
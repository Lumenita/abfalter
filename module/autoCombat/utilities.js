import { genericDialogs } from "../dialogs.js";

export const assertCurrentScene = () => {
    if (game.scenes?.current?.id !== game.scenes?.active?.id) {
        const msg = game.i18n.localize('abfalter.dialogs.wrongScene');
        genericDialogs.prompt(game.i18n.localize('abfalter.dialogs.wrongSceneTitle'), msg);
        throw new Error(msg);
    }
};

export function getSelectedToken(gameRef) {
    const selectedTokens = gameRef.canvas.tokens?.controlled ?? [];
    if (selectedTokens.length !== 1) {
        const msg = gameRef.i18n.localize(selectedTokens.length > 0 ? 'abfalter.dialogs.noMultiSelect' : 'abfalter.dialogs.noSelectToken');
        genericDialogs.prompt(gameRef.i18n.localize('abfalter.dialogs.selectTokenTitle'), msg);
        throw new Error(msg);
    }
    return selectedTokens[0].document;
}

export const getTargetToken = (attackerToken, targets) => {
    const gameCopy = game;
    const allTargets = Array.from(targets);

    if (allTargets.length === 0) {
        const msg = gameCopy.i18n.localize('abfalter.dialogs.mustTarget');
        genericDialogs.prompt(gameCopy.i18n.localize('abfalter.dialogs.mustTargetTitle'), msg);
        throw new Error(msg);
    }

    for (const t of allTargets) {
        if (!t.actor?.id) {
            const msg = gameCopy.i18n.localize('abfalter.dialogs.noActor');
            genericDialogs.prompt(gameCopy.i18n.localize('abfalter.dialogs.noActorTitle'), msg);
            throw new Error(msg);
        }
        if (t.id === attackerToken.id) {
            const msg = gameCopy.i18n.localize('abfalter.dialogs.noAtkSelf');
            genericDialogs.prompt(gameCopy.i18n.localize('abfalter.dialogs.noAtkSelfTitle'), msg);
            throw new Error(msg);
        }
    }

    return allTargets;
};

export const canOwnerReceiveMessage = (actor) => {
    const gameCopy = game;
    if (!actor.hasPlayerOwner || !actor.id) {
        return false;
    }
    const activePlayers = gameCopy.users.players.filter(u => u.active);
    return activePlayers.filter(u => actor.testUserPermission(u, 'OWNER')).length === 1;
};

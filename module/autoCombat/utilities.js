import { genericDialogs } from "../dialogs.js";

export const assertCurrentScene = () => {
    const gameCopy = game;
    if (gameCopy.scenes?.current?.id !== gameCopy.scenes?.active?.id) {
        const msg = gameCopy.i18n.localize('abfalter.dialogs.wrongScene');
        genericDialogs.prompt(msg);
        throw new Error(msg);
    }
};

export function getSelectedToken(game) {
    const selectedTokens = game.canvas.tokens?.controlled ?? [];
    if (selectedTokens.length !== 1) {
        const msg = game.i18n.localize(selectedTokens.length > 0 ? 'abfalter.dialogs.noMultiSelect' : 'abfalter.dialogs.noSelectToken');
        genericDialogs.prompt(msg);
        throw new Error(msg);
    }
    return selectedTokens[0].document;
}

export const getTargetToken = (attackerToken, targetTokens) => {
    const gameCopy = game;
    let msg;

    if (targetTokens.ids.length > 1) {
        let targets = Array.from(game.user.targets);
        for (let i = 0; i < targetTokens.ids.length; i++) {
            if (!targets[i].actor?.id) {
                msg = gameCopy.i18n.localize('abfalter.dialogs.noActor');
                genericDialogs.prompt(msg);
                throw new Error(msg);
            }
            if (targets[i].id === attackerToken.id) {
                msg = gameCopy.i18n.localize('abfalter.dialogs.noAtkSelf');
                genericDialogs.prompt(msg);
                throw new Error(msg);
            }
        }
        msg = gameCopy.i18n.localize('abfalter.dialogs.aoeAttack');
        genericDialogs.prompt(msg);
        return targets;
    }
    if (targetTokens.ids.length === 0) {
        msg = gameCopy.i18n.localize('abfalter.dialogs.mustTarget');
    }
    if (msg) {
        genericDialogs.prompt(msg);
        throw new Error(msg);
    }
    const target = targetTokens.values().next().value;
    if (!target.actor?.id) {
        msg = gameCopy.i18n.localize('abfalter.dialogs.noActor');
    }
    if (target.id === attackerToken.id) {
        msg = gameCopy.i18n.localize('abfalter.dialogs.noAtkSelf');
    }
    if (msg) {
        genericDialogs.prompt(msg);
        throw new Error(msg);
    }
    return target;
};

export const canOwnerReceiveMessage = (actor) => {
    const gameCopy = game;
    if (!actor.hasPlayerOwner || !actor.id) {
        return false;
    }
    const activePlayers = gameCopy.users.players.filter(u => u.active);
    return activePlayers.filter(u => actor.testUserPermission(u, 'OWNER')).length === 1;
};

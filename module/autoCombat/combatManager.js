import { genericDialogs } from "../dialogs.js";

export class combatManager {
	constructor(game) {
		this.game = game
		game.socket?.on('system.abfalter', msg => this.receive(msg));
	}
	emit(msg) {
		this.game.socket?.emit('system.abfalter', msg);
	}
	findTokenById(tokenId) {
		const token = this.game.scenes?.find(scene => !!scene.tokens.find(u => u?.id === tokenId))
			?.tokens.find(u => u?.id === tokenId);
		if (!token) {
			const message = this.game.i18n.format('macros.combat.dialog.error.noExistTokenAnymore.title', {
				token: tokenId
			});
			genericDialogs.prompt(message);
			throw new Error(message);
		}
		if (!token.actor) {
			const message = this.game.i18n.format('macros.combat.dialog.error.noActorAssociatedToToken.title', {
				token: tokenId
			});
			genericDialogs.prompt(message);
			throw new Error(message);
		}
		return token;
	}
}
import { genericDialogs } from "../dialogs.js";
export class combatManager {
	constructor(game) {
		this.game = game
		this._boundReceive = this.receive.bind(this);
		game.socket?.on('system.abfalter', this._boundReceive);
	}
	emit(msg) {
		this.game.socket?.emit('system.abfalter', msg);
	}
	findTokenById(tokenId) {
		const token = this.game.scenes?.active?.tokens?.get(tokenId);
		if (!token) {
			const message = this.game.i18n.format('abfalter.dialogs.noExistTokenAnymore', {
				token: tokenId
			});
			genericDialogs.prompt(game.i18n.format('abfalter.dialogs.noExistTokenAnymoreTitle'), message);
			throw new Error(message);
		}
		if (!token.actor) {
			const message = this.game.i18n.format('abfalter.dialogs.noActorAssociatedToToken', {
				token: tokenId
			});
			genericDialogs.prompt(game.i18n.format('abfalter.dialogs.noActorAssociatedToTokenTitle'), message);
			throw new Error(message);
		}
		return token;
	}
}
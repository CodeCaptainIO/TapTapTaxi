var TTTBlinker = (function() {

	function TTTBlinker(phaserGame, spriteToBlink) {
		this.game = phaserGame;
		this.sprite = spriteToBlink;
		this.tween = undefined;
	}

	TTTBlinker.prototype.startBlinking = function() {
		this.tween = this.game.add.tween(this.sprite);
		this.tween.to({
			alpha: [0, 1]
		}, 2000, Phaser.Easing.Quadratic.Out, false, 500);
		this.tween.start();
		this.tween.loop(-1); // loops infinitely
	};

	TTTBlinker.prototype.stopBlinking = function() {
		this.tween.stop();
	};

	return TTTBlinker;

})();
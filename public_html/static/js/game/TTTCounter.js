var TTTCounter = (function(){

	function TTTCounter(phaserGame, x, y) {

		// We need to call the initializer of the 'super' class
		Phaser.Sprite.call(this, phaserGame, x, y);

		// Custom variables for TTTCounter
		this.tween = undefined;
		this.score = 0;

	}

	// Don't create new functions here

	// Required for creating custom sprites
	TTTCounter.prototype = Object.create(Phaser.Sprite.prototype);
	TTTCounter.prototype.constructor = TTTCounter;

	// Create functions after we set the prototype

	TTTCounter.prototype.setScore = function(score, animated) {
		this.score = '' + score; // Cast to a string
		this.render();

		if (animated) {
			this.shake();
		};

	};

	TTTCounter.prototype.shake = function() {
		this.tween = this.game.add.tween(this);
		this.tween.to({
			y: [this.y + 5, this.y] // You can tween to multiple values using an array
		}, 200, Phaser.Easing.Quadratic.Out);
		this.tween.start();
	};

	TTTCounter.prototype.render = function() {
		// Let's start with a clear canvas
		if (this.children.length !== 0) {
			this.removeChildren();
		};

		var xpos = 0;
		var totalWidth = 0;

		// Loop over all numbers in 'score'
		for (var i = 0; i < this.score.length; i++) {
			var myChar = this.score.charAt(i);
			var sprite = new Phaser.Sprite(this.game, 0, 0, 'numbers', myChar);
			sprite.x = xpos;
			this.addChild(sprite);
			xpos += sprite.width + 2;
			totalWidth += sprite.width + 2;
		}

		// We don't want the last 2 pixels of padding
		totalWidth -= 2;

		// Reposition the sprites
		for (var j = 0; j < this.children.length; j++) {
			var child = this.children[j];
			child.x -= totalWidth / 2;
		}

	};

	return TTTCounter;

})();
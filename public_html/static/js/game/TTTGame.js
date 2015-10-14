var TTTGame = (function(){

	function TTTGame(phaserGame) {
		this.game = phaserGame;
	}

	TTTGame.prototype.preload = function() {
		// This.game.load = instance of Phaser.Loader
		this.game.load.image('tile_road_1', 'static/img/assets/tile_road_1.png');
	};

	TTTGame.prototype.init = function() {
		this.game.stage.backgroundColor = '#9bd3e1';
		this.game.add.plugin(Phaser.Plugin.Debug);
	};

	TTTGame.prototype.create = function() {
		// Our assets are available
		var sprite = this.game.add.sprite(0, 0, 'tile_road_1');
		sprite.anchor.setTo(0.5, 0.5);
		sprite.x = this.game.world.centerX;
		sprite.y = this.game.world.centerY;
	};

	TTTGame.prototype.update = function() {
		
	};

	return TTTGame;

})();
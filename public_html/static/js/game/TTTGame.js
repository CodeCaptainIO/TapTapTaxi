var TTTGame = (function(){

	var ANGLE = 26.55;
	var TILE_WIDTH = 68;
	var SPEED = 5;

	function TTTGame(phaserGame) {
		this.game = phaserGame;

		this.arrTiles = [];
		this.numberOfIterations = 0;
		this.roadStartPosition = {
			x: GAME_WIDTH + 100,
			y: GAME_HEIGHT / 2 - 100,
		}
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
		this.generateRoad();
	};

	TTTGame.prototype.generateRoad = function() {
		//var sprite = this.game.add.sprite(0, 0, 'tile_road_1');
		var x = this.roadStartPosition.x;
		var y = this.roadStartPosition.y;
		var sprite = new Phaser.Sprite(this.game, x, y, 'tile_road_1');
		sprite.anchor.setTo(0.5, 0.5);
		this.game.world.addChildAt(sprite, 0);
		this.arrTiles.push(sprite);
	};

	TTTGame.prototype.moveTilesWithSpeed = function(speed) {
		var i = this.arrTiles.length - 1;

		while (i >= 0) {
			var sprite = this.arrTiles[i];
			// Move the sprite
			sprite.x -= speed * Math.cos( ANGLE * Math.PI / 180 );
			sprite.y += speed * Math.sin( ANGLE * Math.PI / 180 );

			if (sprite.x < -120) {
				this.arrTiles.splice(i, 1);
				sprite.destroy();
			}

			i--;
		}
	};

	TTTGame.prototype.update = function() {
		// Gets called at 60fps

		this.numberOfIterations++;

		if (this.numberOfIterations > TILE_WIDTH / SPEED) {
			this.generateRoad();
			this.numberOfIterations = 0;
		};

		this.moveTilesWithSpeed(SPEED);
	};

	return TTTGame;

})();
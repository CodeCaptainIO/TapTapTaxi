var TTTGame = (function(){

	var ANGLE = 26.55;
	var TILE_WIDTH = 68;
	var SPEED = 5;
	var TAXI_START_X = 30;
	var JUMP_HEIGHT = 7;

	function TTTGame(phaserGame) {
		this.game = phaserGame;

		// Taxi variables
		this.taxi = undefined;
		this.taxiX = TAXI_START_X;

		// Taxi jump variables
		this.jumpSpeed = JUMP_HEIGHT;
		this.isJumping = false;
		this.currentJumpHeight = 0;

		// General game variables
		this.mouseTouchDown = false;

		this.arrTiles = [];
		this.numberOfIterations = 0;
		this.roadStartPosition = {
			x: GAME_WIDTH + 100,
			y: GAME_HEIGHT / 2 - 100,
		};
	}

	TTTGame.prototype.preload = function() {
		// This.game.load = instance of Phaser.Loader
		this.game.load.image('tile_road_1', 'static/img/assets/tile_road_1.png');
		this.game.load.image('taxi', 'static/img/assets/taxi.png');
	};

	TTTGame.prototype.init = function() {
		this.game.stage.backgroundColor = '#9bd3e1';
		this.game.add.plugin(Phaser.Plugin.Debug);
	};

	TTTGame.prototype.create = function() {
		// Our assets are available
		this.generateRoad();
		
		var x = GAME_WIDTH / 2;
		var y = GAME_HEIGHT / 2;
		this.taxi = new Phaser.Sprite(this.game, x, y, 'taxi');
		this.taxi.anchor.setTo(0.5, 1.0);
		this.game.world.addChild(this.taxi);
	};

	TTTGame.prototype.generateRoad = function() {
		//var sprite = this.game.add.sprite(0, 0, 'tile_road_1');
		var x = this.roadStartPosition.x;
		var y = this.roadStartPosition.y;
		var sprite = new Phaser.Sprite(this.game, x, y, 'tile_road_1');
		sprite.anchor.setTo(0.5, 1.0);
		this.game.world.addChildAt(sprite, 0);
		this.arrTiles.push(sprite);
	};

	TTTGame.prototype.calculatePositionOnRoadWithXPosition = function(xpos) {
		var adjacent = this.roadStartPosition.x - xpos;
		var alpha = ANGLE * Math.PI / 180;
		var hypotenuse = adjacent / Math.cos(alpha);
		var opposite = Math.sin(alpha) * hypotenuse;
		return {
			x: xpos,
			y: this.roadStartPosition.y + opposite - 57
		};
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

	TTTGame.prototype.touchDown = function() {
		this.mouseTouchDown = true;
		if (!this.isJumping) {
			this.isJumping = true;
		};
	};

	TTTGame.prototype.touchUp = function() {
		this.mouseTouchDown = false;
	};

	TTTGame.prototype.taxiJump = function() {
		this.currentJumpHeight -= this.jumpSpeed;
		this.jumpSpeed -= 0.5;
		if (this.jumpSpeed < -JUMP_HEIGHT) {
			this.jumpSpeed = JUMP_HEIGHT;
			this.isJumping = false;
		};
	};

	TTTGame.prototype.update = function() {
		// Gets called at 60fps

		if (this.game.input.activePointer.isDown) {
			if (!this.mouseTouchDown) {
				this.touchDown();
			};
		} else {
			if (this.mouseTouchDown) {
				this.touchUp();
			};
		}

		this.numberOfIterations++;

		if (this.numberOfIterations > TILE_WIDTH / SPEED) {
			this.generateRoad();
			this.numberOfIterations = 0;
		}

		if (this.isJumping) {
			this.taxiJump();
		}

		var pointOnRoad = this.calculatePositionOnRoadWithXPosition(this.taxiX);
		this.taxi.x = pointOnRoad.x;
		this.taxi.y = pointOnRoad.y + this.currentJumpHeight;

		this.moveTilesWithSpeed(SPEED);
	};

	return TTTGame;

})();
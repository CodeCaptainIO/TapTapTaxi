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

		// Road variables
		this.roadCount = 0;
		this.nextObstacleIndex = 0;
		this.arrObstacles = [];

		// General game variables
		this.mouseTouchDown = false;
		this.hasStarted = false;
		this.isDead = false;
		this.gameOverGraphic = undefined;

		this.arrTiles = [];
		this.numberOfIterations = 0;
		this.roadStartPosition = {
			x: GAME_WIDTH + 100,
			y: GAME_HEIGHT / 2 - 100,
		};
	}

	TTTGame.prototype.reset = function() {
		// General game variables
		this.mouseTouchDown = false;
		this.hasStarted = false;
		this.isDead = false;

		// Road variables
		this.arrObstacles = [];
		this.nextObstacleIndex = 0;

		// Taxi jump variables
		this.jumpSpeed = JUMP_HEIGHT;
		this.isJumping = false;
		this.currentJumpHeight = 0;

		// Taxi properties
		this.game.tweens.removeFrom(this.taxi);
		this.taxiX = TAXI_START_X;
		this.taxi.rotation = 0;

		// Sprite visibility
		this.gameOverGraphic.visible = false;
	};

	TTTGame.prototype.preload = function() {
		// This.game.load = instance of Phaser.Loader
		this.game.load.image('tile_road_1', 'static/img/assets/tile_road_1.png');
		this.game.load.image('taxi', 'static/img/assets/taxi.png');
		this.game.load.image('obstacle_1', 'static/img/assets/obstacle_1.png');
		this.game.load.image('gameover', 'static/img/assets/gameover.png');
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

		x = this.game.world.centerX;
		y = this.game.world.centerY;

		this.gameOverGraphic = new Phaser.Sprite(this.game, x, y, 'gameover');
		this.gameOverGraphic.anchor.setTo(0.5, 0.5);
		this.game.add.existing(this.gameOverGraphic);
		
		this.reset();
	};

	TTTGame.prototype.calculateNextObstacleIndex = function() {
		var minimumOffset = 3;
		var maximumOffset = 10;
		var num = Math.random() * (maximumOffset - minimumOffset);
		this.nextObstacleIndex = this.roadCount + Math.round(num) + minimumOffset;
	};

	TTTGame.prototype.checkObstacles = function() {
		var i = this.arrObstacles.length - 1;

		while (i >= 0) {
			var sprite = this.arrObstacles[i];

			if (sprite.x < this.taxi.x - 10) {
				this.arrObstacles.splice(i, 1);
			}

			// Distance formula
			var dx = sprite.x - this.taxi.x;
			dx = Math.pow(dx, 2);

			var dy = (sprite.y - sprite.height / 2) - this.taxi.y;
			dy = Math.pow(dy, 2);

			var distance = Math.sqrt(dx + dy);

			if (distance < 25) {
				if (!this.isDead) {
					this.gameOver();
				};
			};

			i--;
		}

	};

	TTTGame.prototype.gameOver = function() {

		this.gameOverGraphic.visible = true;

		this.isDead = true;
		this.hasStarted = false;
		this.arrObstacles = [];

		var dieSpeed = SPEED / 10;

		var tween_1 = this.game.add.tween(this.taxi);
		tween_1.to({
			x: this.taxi.x + 20,
			y: this.taxi.y - 40
		}, 300 * dieSpeed, Phaser.Easing.Quadratic.Out);

		var tween_2 = this.game.add.tween(this.taxi);
		tween_2.to({
			y: GAME_HEIGHT + 40
		}, 1000 * dieSpeed, Phaser.Easing.Quadratic.In);

		tween_1.chain(tween_2);
		tween_1.start();

		var tween_rotate = this.game.add.tween(this.taxi);
		tween_rotate.to({
			angle: 200
		}, 1300 * dieSpeed, Phaser.Easing.Linear.None);
		tween_rotate.start();

	};

	TTTGame.prototype.generateRoad = function() {

		this.roadCount++;
		var tile = 'tile_road_1';
		var isObstacle = false;

		if (this.roadCount > this.nextObstacleIndex && this.hasStarted) {
			this.calculateNextObstacleIndex();
			tile = 'obstacle_1';
			isObstacle = true;
		};

		//var sprite = this.game.add.sprite(0, 0, 'tile_road_1');
		var x = this.roadStartPosition.x;
		var y = this.roadStartPosition.y;
		var sprite = new Phaser.Sprite(this.game, x, y, tile);
		sprite.anchor.setTo(0.5, 1.0);
		this.game.world.addChildAt(sprite, 0);
		this.arrTiles.push(sprite);
		
		if (isObstacle) {
			this.arrObstacles.push(sprite);
		};
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

		if (this.isDead) {
			this.reset();
			return;
		};

		if (!this.hasStarted) {
			this.hasStarted = true;
		};

		if (!this.isJumping) {
			this.isJumping = true;
		}
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
		}
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

		if (!this.isDead) {
			if (this.isJumping) {
				this.taxiJump();
			}

			var pointOnRoad = this.calculatePositionOnRoadWithXPosition(this.taxiX);
			this.taxi.x = pointOnRoad.x;
			this.taxi.y = pointOnRoad.y + this.currentJumpHeight;

			this.checkObstacles();
		}

		this.moveTilesWithSpeed(SPEED);
	};

	return TTTGame;

})();
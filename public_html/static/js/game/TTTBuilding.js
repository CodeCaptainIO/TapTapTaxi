var TTTBuilding = (function(){

	function TTTBuilding(phaserGame, x, y) {

		Phaser.Sprite.call(this, phaserGame, x, y, 'gameAssets', this.getRandomBase());
		this.game = phaserGame;

		this.colors = ['brown', 'beige', 'red', 'grey'];
		this.windowTypes = ['small', 'big'];

		this.buildFloors( Math.round(Math.random() * 4) + 1 );

	}

	TTTBuilding.prototype = Object.create(Phaser.Sprite.prototype);
	TTTBuilding.prototype.constructor = TTTBuilding;

	TTTBuilding.prototype.getRandomBase = function() {
		var numberOfVariations = 4;
		var num = Math.ceil(Math.random() * numberOfVariations - 1) + 1;
		return 'building_base_' + num;
	};

	TTTBuilding.prototype.getRandomFloorForColor = function(color, windowType) {
		var numberOfVariations = 2;
		var num = Math.ceil(Math.random() * numberOfVariations - 1) + 1;
		return 'building_middle_' + windowType + '_' + color + '_' + num;
	};

	TTTBuilding.prototype.buildFloors = function(numberOfFloors) {
		
		var prevFloor = this;

		var randomColorIndex = Math.ceil(Math.random() * this.colors.length) - 1;
		var randomWindowTypeIndex = Math.ceil(Math.random() * this.windowTypes.length) - 1;
		var color = this.colors[randomColorIndex];
		var windowType = this.windowTypes[randomWindowTypeIndex];

		var i = 0;
		while (i < numberOfFloors) {

			var floor = this.game.make.sprite(0, 0, 'gameAssets', this.getRandomFloorForColor(color, windowType));
			//var floor = new Phaser.Sprite(this.game, 0, 0, 'building_2');
			floor.anchor.setTo(0.5, 1.0);

			// There's a height difference between the start tile and the floor tiles
			if (prevFloor == this) {
				floor.y = prevFloor.y - prevFloor.height / 2 - 12;
			} else {
				floor.y = prevFloor.y - prevFloor.height / 2 + 10;
			}

			this.addChild(floor)
			prevFloor = floor;

			i++;
		}

	};

	return TTTBuilding;

})();
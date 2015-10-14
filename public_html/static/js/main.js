var GAME_WIDTH = 480;
var GAME_HEIGHT = 640;

var state = {
	preload: preload,
	init: init,
	update: update,
	create: create
};

var phaserGame = new Phaser.Game(
	GAME_WIDTH,
	GAME_HEIGHT,
	Phaser.AUTO, // Renderer (Canvas or WebGL)
	'container', // ID for the containing tag
	state // State object
);

var taxiGame = new TTTGame(phaserGame);

function preload() {
	taxiGame.preload();
}
function init() {
	taxiGame.init();
}
function create() {
	taxiGame.create();
}
function update() {
	taxiGame.update();
}
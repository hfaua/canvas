game = {

	/*
	 * Y-coord of view window
	 */
	viewHeight: 0,

	/*
	 * Frame duration in seconds
	 */
	frameDuration: 1000.0 / 30.0,

	/*
	 * Game over
	 */
	gameOver: false,

	/*
	 * Initialize all game data
	 */
	init: function() {
		game.initCanvas();
		game.initTimer();
		game.initControlls();
		game.loadImages();
		map.build();
	},

	/*
	 * Init canvas
	 */
	initCanvas: function() {
		var canvasElement = document.getElementById('game-window');

		game.context = canvasElement.getContext('2d');
		game.width = canvasElement.width;
		game.height = canvasElement.height;

		// Set text coordinates to top line
		game.context.textBaseline = 'top';
	},

	/*
	 * Init timer
	 */
	initTimer: function() {
		game.lastUpdate = Date.now();
	},

	/*
	 * Return elapsed milliseconds since last update
	 */
	elapsedSeconds: function() {

		var deltaTime = Date.now() - game.lastUpdate;
		game.lastUpdate = Date.now();

		return deltaTime / 1000.0;
	},

	/*
	 * Init controlls
	 *
	 * Keycodes:
	 * 37: Arrow Left
	 * 38: Arrow Up
	 * 39: Arrow Right
	 */
	initControlls: function() {

		document.onkeydown = function(event) {

			switch(event.keyCode) {

				case 38:
					player.jump();
					break;

				case 37:
					player.startWalking('left');
					break;

				case 39:
					player.startWalking('right');
					break;
			}
		};

		document.onkeyup = function(event) {

			switch(event.keyCode) {

				case 37:
				case 39:
					player.stopWalking();
					break;
			}
		};
	},

	/*
	 * Deal with game images
	 */
	loadImages: function() {
		game.standImage = document.getElementById('stand-image');
		game.walkAnimation = document.getElementById('walk-animation');
		game.jumpAnimation = document.getElementById('jump-animation');
		game.guiImage = document.getElementById('gui-image');
	},

	/*
	 * Convert our coordinates with origin in down-left corner
	 * to canvas coordinates with origin in up-left corner
	 */
	toCanvasCoords: function (element) {
		return game.height - (element.positionY - game.viewHeight + element.height);
	},

	/*
	 * Move screen constantly upwards
	 */
	moveScreen: function(deltaTime) {
		game.viewHeight += deltaTime * 50.0 + game.viewHeight * 0.002;
	},

	/*
	 * Check if player has failed
	 */
	checkGameOver: function() {

		if(player.positionY < game.viewHeight) {
			game.gameOver = true;
		}
	},

	/*
	 * Draw whole frame
	 */
	drawFrame: function() {
		game.clearFrame();
		game.drawTiles();
		game.drawPlayer();
		game.drawGUI();

		if(game.gameOver) {
			game.drawGameOver();
		}
	},

	/*
	 * Clear whole frame
	 */
	clearFrame: function() {
		game.context.fillStyle = map.pascalBackground;
		game.context.fillRect(
			0,
			0,
			game.width,
			game.height
		);
	},

	/*
	 * Draw all tiles
	 */
	drawTiles: function() {
		game.context.fillStyle = map.pascalForeground;
		game.context.font = map.pascalFont;
		game.context.textAlign = 'left';

		for(var i = 0; i < map.platformsCount; i++) {

			game.context.fillText(
				map[i].text,
				map[i].positionX,
				game.toCanvasCoords(map[i])
			);
		}
	},

	/*
	 * Draw player animation
	 */
	drawPlayer: function() {

		game.context.drawImage(
			player.animationImage(),
			player.currentFrame() * player.width,
			0,
			player.width,
			player.height,
			player.positionX,
			game.toCanvasCoords(player),
			player.width,
			player.height
		);
	},

	drawGUI: function() {

		game.context.drawImage(
			game.guiImage,
			0,
			0,
			game.guiImage.width,
			game.guiImage.height
		);

		game.context.fillText(
			player.highScore,
			730, 31
		);
	},

	/*
	 * Draw GAME OVER text
	 */
	drawGameOver: function() {

		game.context.fillStyle = 'red';
		game.context.textAlign = 'center';
		game.context.fillText(
			'GAME OVER',
			game.width / 2,
			game.height / 2
		);
	},

	/*
	 * Game loop
	 */
	gameLoop: function() {
		var deltaTime = game.elapsedSeconds();

		player.update(deltaTime);
		game.moveScreen(deltaTime);
		game.checkGameOver();
		game.drawFrame();
	},
};

window.onload = function() {

	game.init();

	window.setInterval(game.gameLoop, game.frameDuration);
};

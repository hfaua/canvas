player = {

	/*
	 * Initial position
	 */
	positionX: 200,
	positionY: 500,

	/*
	 * Initial velocity
	 */
	velocityX: 0,
	velocityY: 0,

	/*
	 * Initial forces
	 */
	forceX: 0,
	forceY: 0,

	/*
	 * Player's mass
	 */
	mass: 200,

	/*
	 * Player's dimensions
	 */
	width: 128,
	height: 128,

	/*
	 * Highest position
	 */
	highScore: 0.0,

	/*
	 * Is player touching the ground
	 */
	isOnGround: false,

	/*
	 * Moment of animation we're currently in
	 */
	animationTime: 0.0,

	/*
	 * Current animation name
	 */
	currentAnimation: 'stand',

	/*
	 * Perform jump action
	 */
	jump: function() {

		if(player.isOnGround) {
			player.isOnGround = false;
			player.velocityY = 8.0;
			player.animationTime = 0.0;
			player.currentAnimation = 'jump';
		}
	},

	/*
	 * Return animation info depending on current animation
	 */
	animationImage: function() {

		switch(player.currentAnimation) {
			case 'stand':
				return game.standImage;

			case 'walk':
				return game.walkAnimation;

			case 'jump':
				return game.jumpAnimation;
		}
	},

	/*
	 * Return current fram number
	 */
	currentFrame: function() {

		switch(player.currentAnimation) {
			case 'stand':
				return 0;

			case 'walk':
				return Math.floor((player.animationTime % 0.2) * 70);

			case 'jump':
				if(player.animationTime > 0.2)
					return 4;
				else
					return Math.floor((player.animationTime % 0.2) * 25);
		}
	},

	/*
	 * Start walking
	 */
	startWalking: function(direction) {

		switch(direction) {
			case 'left':
				player.velocityX = -5.0;
				break;

			case 'right':
				player.velocityX = 5.0;
				break;
		}

		if(player.currentAnimation != 'walk') {
			player.animationTime = 0.0;
			player.currentAnimation = 'walk';
		}
	},

	/*
	 * Stop walking
	 */
	stopWalking: function() {
		player.velocityX = 0.0;
		player.currentAnimation = 'stand';
	},

	/*
	 * Update player data by specified deltaTime
	 */
	update: function(deltaTime) {

		player.calculateMove(deltaTime);
		player.checkCollision();
		player.updateHighScore();
		player.animationTime += deltaTime;
	},

	/*
	 * Calculate position of player according to forces
	 */
	calculateMove: function(deltaTime) {

		// Force of gravity
		player.forceY = player.mass * -10.0;
		player.forceX = 0.0;

		// F = da / dt
		var accelerationX = player.forceX / player.mass;
		var accelerationY = player.forceY / player.mass;

		// a = dv / dt
		player.velocityX += accelerationX * deltaTime;
		player.velocityY += accelerationY * deltaTime;

		// v = dx / dt
		player.positionX += player.velocityX * deltaTime * 60;
		player.positionY += player.velocityY * deltaTime * 60;
	},

	/*
	 * Calculate collision with map
	 */
	checkCollision: function() {

		var collidingPlatform = map.collidingPlatform();

		if(collidingPlatform) {
			player.isOnGround = true;
			player.positionY = collidingPlatform.positionY + collidingPlatform.height;
			player.velocityY = 0.0;

			if(player.currentAnimation == 'jump') {
				player.currentAnimation = 'stand';
			}
		}
	},

	/*
	 * Check if high score was beaten
	 */
	updateHighScore: function() {

		if(player.positionY > player.highScore) {
			player.highScore = Math.floor(player.positionY);
		}
	}
};

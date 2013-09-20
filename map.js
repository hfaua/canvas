map = {

	/*
	 * Dimensions of single platform/letter
	 */
	tileHeight: 48,
	tileWidth: 26,

	/*
	 * Number of platforms
	 */
	platformsCount: 100,

	/*
	 * Vertical distance between platforms
	 */
	platformDistance: 70,

	/*
	 * Keywords in Turbo Psacal
	 */
	pascalKeywords: [
		'ABSOLUTE', 'AND', 'ARRAY', 'ASM', 'BEGIN', 'CASE', 'CONST',
		'CONSTRUCTOR', 'DESTRUCTOR', 'DIV', 'DO', 'DOWNTO', 'ELSE', 'END',
		'FILE', 'FOR', 'FUNCTION', 'GOTO', 'IF', 'IMPLEMENTATION', 'IN',
		'INHERITED', 'INLINE', 'INTERFACE', 'LABEL', 'MOD', 'NIL', 'NOT',
		'OBJECT', 'OF', 'ON', 'OPERATOR', 'OR', 'PACKED', 'PROCEDURE',
		'PROGRAM', 'RECORD', 'REINTRODUCE', 'REPEAT', 'SELF', 'SET', 'SHL',
		'SHR', 'STRING', 'THEN', 'TO', 'TYPE', 'UNIT', 'UNTIL', 'USES', 'VAR',
		'WHILE', 'WITH', 'XOR'
	],

	/*
	 * Turbo Pascal background
	 */
	pascalBackground: '#0000A0',

	/*
	 * Turbo Pascal foreground
	 */
	pascalForeground: '#FFF850',

	/*
	 * Turbo Pascal font
	 */
	pascalFont: '48px TurboPascalFont',

	/*
	 * Get random Turbo Pascal keyword
	 */
	randomKeyword: function() {

		var wordIndex = Math.randomNumber(map.pascalKeywords.length);
		return map.pascalKeywords[wordIndex];
	},

	/*
	 * Build whole map
	 */
	build: function() {

		for(var i = 0; i < map.platformsCount; i++) {

			var randomKeyword = map.randomKeyword();

			map[i] = {
				positionX: Math.randomNumber(game.width),
				positionY: map.platformDistance * i,
				width:     map.tileWidth * randomKeyword.length,
				height:    map.tileHeight,
				text:      randomKeyword
			};
		}

	},

	/*
	 * Detect collision with line between two points
	 */
	collidingPlatform: function() {

		for(var i = map.platformsCount - 1; i >= 0; i--) {

			var playerBottom   = player.positionY;
			var playerTop      = player.positionY + player.height;
			var playerLeft     = player.positionX;
			var playerRight    = player.positionX + player.width;

			var platformBottom = map[i].positionY;
			var platformTop    = map[i].positionY + map[i].height;
			var platformLeft   = map[i].positionX;
			var platformRight  = map[i].positionX + map[i].width;

			if(playerBottom > platformBottom && playerBottom < platformTop) {

				if((platformLeft  > playerLeft  && platformLeft  < playerRight) ||
				   (platformRight > playerLeft  && platformRight < playerRight) ||
				   (platformRight > playerRight && platformLeft  < playerLeft)) {

					// Collision occurs only when moving downwards
					if(player.velocityY < 0.0)
						return map[i];
				}
			}
		}

		return false;
	}
};

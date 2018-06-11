var PlayGround = function(game) {};

// Load images and sounds

var map, Walllayer, Floorlayer;
var exitArrow;
var isSign=false;
var newLevel = false;

PlayGround.prototype={
    preload:function(){
    },
    // Setup the example
    create:function() {
        // tiles + tilemaps to load the 'BG'
        map = game.add.tilemap('bank');
        map.addTilesetImage('TotalTileset','tiles');
        Floorlayer = map.createLayer('Floor');
        Walllayer = map.createLayer('Walls');

        //the lower the second number is the better performance we have. 
        //but it has to. be high enough to include all the tiles we want collision with.
        //map.setCollisionBetween(1,THIS NUMBER, true, 'Walls');
        map.setCollisionBetween(1,28,true,'Walls');

        // SFX
        Alert = game.add.audio('alert');
    	Safe = game.add.audio('safe');
    	CoinPU = game.add.audio('coinPU');
    	Level1 = game.add.audio('level1');
    	Level2 = game.add.audio('level2');
    	Rewind = game.add.audio('rewind');
    	Level1.loop=true;
    	Level2.loop=true;
        // play the music!
    	Level1.play();

        //Start arcade physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //Create the guards group
		guards=game.add.group();
        guard = new Guard(game, 'guard', 1, 0, 800, 300);
        game.add.existing(guard);
		guards.add(guard);
		
		//adding coins
        Coins = game.add.group();
        Coins.enableBody=true;


        //adding moveable walls
        //adding Push Walls (Green)
        Gwalls = game.add.group();
        Gwalls.enableBody = true;
        GreenWall = Gwalls.create(288, 200,'atlas', 'GreenWall');
        GreenWall.scale.setTo(16,2);
        GreenWall.body.collideWorldBounds = true;
        GreenWall.body.drag.set(175);
        GreenWall = Gwalls.create(288, 550, 'atlas', 'GreenWall');
        GreenWall.scale.setTo(16,2);
        GreenWall.body.collideWorldBounds = true;
        GreenWall.body.drag.set(175);

        //adding pink walls
        //Sliding walls (Pink)
        Pwalls = game.add.group();
        Pwalls.enableBody = true;
        PinkWall = Pwalls.create(300, 300,'atlas', 'PinkWall');
        PinkWall.scale.setTo(2,16);
        PinkWall.body.collideWorldBounds=true;

        // Solid wall group
        Swalls = game.add.group();
        Swalls.enableBody = true;

        var top = Swalls.create(0,0,'masterAtlas','topwall');
        top.body.immovable = true;
        var bot = Swalls.create(0,game.height,'masterAtlas','topwall');
        bot.body.immovable=true;
        bot.scale.setTo(1,-1);

        var left = Swalls.create(0,0,'masterAtlas','sidewall');
        left.body.immovable=true;
        var right = Swalls.create(game.width,0,'masterAtlas','sidewall');
        right.body.immovable=true;
        right.scale.setTo(-1,1);

        var Ltopwall = Swalls.create(62, 256, 'masterAtlas','singlewall');
        Ltopwall.body.immovable = true;
        Ltopwall.scale.setTo(3.5,-1);
        var Lbotwall = Swalls.create(62, 511.5, 'masterAtlas','singlewall');
        Lbotwall.body.immovable = true; 
        Lbotwall.scale.setTo(3.5,1); 

        var Mtopwall = Swalls.create(417, 256, 'masterAtlas', 'shortwall');
        Mtopwall.body.immovable = true;   
        Mtopwall.scale.setTo(1,-1);
        var Mbotwall = Swalls.create(417, 512, 'masterAtlas', 'shortwall');
        Mbotwall.body.immovable = true;  

        var Rtopwall = Swalls.create(961, 256, 'masterAtlas', 'singlewall');
        Rtopwall.body.immovable = true;   
        Rtopwall.scale.setTo(-3.5,-1);
        var Rbotwall = Swalls.create(961, 512, 'masterAtlas', 'singlewall');
        Rbotwall.body.immovable = true;   
        Rbotwall.scale.setTo(-3.5,1);

        // enable bitmap to the size of our game
		bitmap = this.game.add.bitmapData(this.game.width, this.game.height);
		
		//light enabled after walls spawned in so the walls are not lit up
        // the circles will be white and placed over the game, multiply mode enabled
        bitmap.context.fillStyle = 'rgb(255, 255, 255)';
        bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
        lightBitmap = this.game.add.image(0, 0, bitmap);
        game.physics.enable(lightBitmap);
        lightBitmap.blendMode = Phaser.blendModes.MULTIPLY;

        //Create the player object
        player = new Player(game, 'playerWalk01', 'playerAtlas', 1, 0, 100, 400);
        players=game.add.group();
        game.add.existing(player);
        players.add(player);
        
        //player animations
        player.animations.add('left', [0, 1], 10, true);
        player.animations.add('right', [2, 3], 10, true);

        //adding coins
        Coins = game.add.group();
        Coins.enableBody=true;

        // tutorial levels coins
        var Coin = Coins.create(200,350,'masterAtlas','coin');	// middle left coin
        Coin = Coins.create(150,650,'masterAtlas','coin');		// bot left coin
        Coin = Coins.create(150,80,'masterAtlas','coin');		// top left coin
        Coin = Coins.create(900,80,'masterAtlas','coin');		// top right coin
        Coin = Coins.create(850,350,'masterAtlas','coin');		// mid right coin

        //Update Coin display text
        coinText=game.add.text(32,16,'', style);
        scoreImage = game.add.sprite(145,6, 'decoration', 'moneybagempty');
		coinsCollected=0;

        // update level display text
        levelText=game.add.text(900,16,'', style);
        
        // add the door and allow the player to collide with it but not let it float away
		door = game.add.sprite( 600, 722, 'masterAtlas', 'door');
        game.physics.arcade.enable(door);
		door.body.immovable=true;
    },  // end of create

    update:function() {
        // player collision with tiled layer
    	game.physics.arcade.collide(player, Walllayer);

        // constantly fill the bitmap 
        bitmap.context.fillStyle = 'rgb(100, 100, 100)';
        bitmap.context.fillRect(0, 0, this.game.width, this.game.height);

        // Player collision with all walls and coins 
        var hitGwalls=game.physics.arcade.collide(player, Gwalls);
        var hitPwalls=game.physics.arcade.collide(player, Pwalls);
        // call collectCoin function when player collides with coin
        var hitCoins=game.physics.arcade.overlap(player, Coins, collectCoin, null, this);
        var hitSwalls = game.physics.arcade.overlap(player, Swalls);
        var hitWalls = game.physics.arcade.overlap(player, Walllayer);
        // Player collides with door
        var Pexit = game.physics.arcade.collide(player, door);
        
        //green wall collision
        var GwallHitWalls=game.physics.arcade.collide(Gwalls, Walllayer);
        var GwallHitGwall=game.physics.arcade.collide(Gwalls, Gwalls);
        //pink wall collision
        var PwallHitWalls=game.physics.arcade.collide(Pwalls, Walllayer);
        var PwallhitPwall=game.physics.arcade.collide(Pwalls, Pwalls);
        //color wall collisions
        var PwallHitGwall=game.physics.arcade.collide(Pwalls, Gwalls);
        // solid wall collisions
        var SwallHitGwall = game.physics.arcade.collide(Swalls, Gwalls);
        var SwallHitPwall = game.physics.arcade.collide(Swalls, Pwalls);

        // update score
        coinText.text="coins: "+coinsCollected;
        // update level
        levelText.text = "level: " + level;

        // when the player collects a coin, play a sound, kill coin, update score
        function collectCoin(player, Coin){
        	CoinPU.play();
            Coin.kill();
            coinsCollected+=1;
        }

        // should take x, y coordinates so we can manually place guards
        function addGuard(x,y){
        	guard = new Guard(game, 'guard', 1, 0, x, y);
        	game.add.existing(guard);
			guards.add(guard);
        }

         // places arrow animation/sprite at x and y, above the door       
        function addExitArrow(x,y) {
        	exitArrow = game.add.sprite( x+1, y - 100, 'exitArrow');
           	var arrow = exitArrow.animations.add('arrow');
           	exitArrow.animations.play('arrow', 1, true);
        }

        // tutorial level
        if( level == 0 ) {
            // if 5 coins are collected
            if(coinsCollected >= 5) {
                //  if sign doesn't exist, add the exit arrow animation and set the isSign var true
                if(isSign == false ){
                    // just kill the empty bag image
                    scoreImage.kill();
                    // add the full bag
                    scoreImage = game.add.sprite(145,6,'decoration', 'moneybagfull');
                    // scale it down
                    scoreImage.scale.setTo(.8,.8);
                    // call the exit arrow function to play the animation over it
                    addExitArrow(door.x,door.y);
                    // set isSign back to true to end this statement
                    isSign=true;
                }
                //  if the player collides with the door with 5 or more coins, event Pexit becomes true, go to museum level
                if(Pexit==true){
                    newLevel = true;
                    // kill the arrow exit
                    exitArrow.kill();
                    scoreImage.kill();
                    // set isSign to false
                    isSign=false;
                    // play rewind sound
                    Rewind.play();
                    // stop level1 music
                    Level1.stop();
                    // play level2 music
                    Level2.play();
                    // set coinsCollected to 0t
                    coinsCollected=0;
                    // set new player coordinates
                    player.body.x=100;
                    player.body.y=400;

                    // increase the level
                    level += 1;
                    // start Museum level
                    state='Museum';
                    game.state.start(state);
                } // end of Pexit
            } // end of coinsCollected
        }   // end of level 0
       

        // Press Q to return to mainmenu
        if(game.input.keyboard.justPressed(Phaser.Keyboard.Q)){
        	// stop the sound from looping
        	game.sound.stopAll();
            game.state.start('Mainmenu');
        }

    } // end of update function
    
} // end of playground

// Given a ray, this function iterates through all of the walls and
// returns the closest wall intersection from the start of the ray
// or null if the ray does not intersect any walls.
function getWallIntersection (ray) {
        var distanceToWall = Number.POSITIVE_INFINITY;
        var closestIntersection = null;
		
        // For each of the walls...
        this.Swalls.forEach(function(Swall) {
            // Create an array of lines that represent the four edges of each wall
            var lines = [
                new Phaser.Line(Swall.x, Swall.y, Swall.x + Swall.width, Swall.y),
                new Phaser.Line(Swall.x, Swall.y, Swall.x, Swall.y + Swall.height),
                new Phaser.Line(Swall.x + Swall.width, Swall.y,
                    Swall.x + Swall.width, Swall.y + Swall.height),
                new Phaser.Line(Swall.x, Swall.y + Swall.height,
                    Swall.x + Swall.width, Swall.y + Swall.height)
            ];

            // Test each of the edges in this wall against the ray.
            // If the ray intersects any of the edges then the wall must be in the way.
            for(var i = 0; i < lines.length; i++) {
                var intersect = Phaser.Line.intersects(ray, lines[i]);
                if (intersect) {
                    // Find the closest intersection
                    distance =
                        this.game.math.distance(ray.start.x, ray.start.y, intersect.x, intersect.y);
                    if (distance < distanceToWall) {
                        distanceToWall = distance;
                        closestIntersection = intersect;
                    }
                }
            }
        }, this);

        this.Gwalls.forEach(function(Gwall) {
            // Create an array of lines that represent the four edges of each wall
            var lines = [
                new Phaser.Line(Gwall.x, Gwall.y, Gwall.x + Gwall.width, Gwall.y),
                new Phaser.Line(Gwall.x, Gwall.y, Gwall.x, Gwall.y + Gwall.height),
                new Phaser.Line(Gwall.x + Gwall.width, Gwall.y,
                    Gwall.x + Gwall.width, Gwall.y + Gwall.height),
                new Phaser.Line(Gwall.x, Gwall.y + Gwall.height,
                    Gwall.x + Gwall.width, Gwall.y + Gwall.height)
            ];

            // Test each of the edges in this wall against the ray.
            // If the ray intersects any of the edges then the wall must be in the way.
            for(var i = 0; i < lines.length; i++) {
                var intersect = Phaser.Line.intersects(ray, lines[i]);
                if (intersect) {
                    // Find the closest intersection
                    distance =
                        this.game.math.distance(ray.start.x, ray.start.y, intersect.x, intersect.y);
                    if (distance < distanceToWall) {
                        distanceToWall = distance;
                        closestIntersection = intersect;
                    }
                }
            }
        }, this);
        this.Pwalls.forEach(function(Pwall) {
            // Create an array of lines that represent the four edges of each wall
            var lines = [
                new Phaser.Line(Pwall.x, Pwall.y, Pwall.x + Pwall.width, Pwall.y),
                new Phaser.Line(Pwall.x, Pwall.y, Pwall.x, Pwall.y + Pwall.height),
                new Phaser.Line(Pwall.x + Pwall.width, Pwall.y,
                    Pwall.x + Pwall.width, Pwall.y + Pwall.height),
                new Phaser.Line(Pwall.x, Pwall.y + Pwall.height,
                    Pwall.x + Pwall.width, Pwall.y + Pwall.height)
            ];

            // Test each of the edges in this wall against the ray.
            // If the ray intersects any of the edges then the wall must be in the way.
            for(var i = 0; i < lines.length; i++) {
                var intersect = Phaser.Line.intersects(ray, lines[i]);
                if (intersect) {
                    // Find the closest intersection
                    distance =
                        this.game.math.distance(ray.start.x, ray.start.y, intersect.x, intersect.y);
                    if (distance < distanceToWall) {
                        distanceToWall = distance;
                        closestIntersection = intersect;
                    }
                }
            }
        }, this);
        
         return closestIntersection;
     }

game.state.add('PlayGround', PlayGround);

/*----------------------------------------------------------
Museum.js
contains Museum levels, 1, 2, and 3
----------------------------------------------------------*/

var Museum = function(game){};

// global variables
var exitArrow;
var Swalls;
var scoreImage;

Museum.prototype={
    preload:function(){		
    },

    create:function(){
		setting='museum';

        // load the museum floor as a tilesprite
        game.add.tileSprite(0,0,game.width,game.height,'masterAtlas', '2floor');
        //Start arcade physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //Create the guards group
		guards=game.add.group();
        guard = new DumbGuard(game, 'guardWalk01', 'guardAtlas', 1, 0, 600, 700, [600,450,900,450,600,450,600,700]);
        game.add.existing(guard);
        guards.add(guard);

        // solid walls
        Swalls = game.add.group();
        Swalls.enableBody = true;

        // where all of the walls are being placed
        var top2 = Swalls.create(0,0,'masterAtlas','2topwall');
        top2.body.immovable = true;
        var bot2 = Swalls.create(0,game.height-64,'masterAtlas','2bottomwall');
        bot2.body.immovable = true;
        var left2 = Swalls.create(0,0,'masterAtlas','2leftwall');
        left2.body.immovable = true;
        var right2 = Swalls.create(game.width-64,0,'masterAtlas','2rightwall');
        right2.body.immovable = true;

        var mediumWall = Swalls.create(64,512,'masterAtlas','mediumwall2');
        mediumWall.body.immovable = true;
        var mediumWall2 =Swalls.create(640,512,'masterAtlas','mediumwall2');
        mediumWall2.body.immovable = true;

        var longWall = Swalls.create(320,64,'masterAtlas','verticalwall2');
        longWall.body.immovable = true;

        var topleft = Swalls.create(704,64,'masterAtlas','rotated2');
        topleft.body.immovable = true;
        topleft.scale.setTo(1,2);

        var topright = Swalls.create(704,320,'masterAtlas','mediumwall2');
        topright.body.immovable = true;
        topright.scale.setTo(1,-1);        


        //adding moveable walls
        //adding Push Walls (Green)
        Gwalls = game.add.group();
        Gwalls.enableBody = true;
        // top left green wall
        GreenWall = Gwalls.create(150, 100,'atlas', 'GreenWall');
        GreenWall.scale.setTo(12,2);
        GreenWall.body.collideWorldBounds = true;
        GreenWall.body.drag.set(175);
        // bottom right green wall
        GreenWall = Gwalls.create(700, 610, 'atlas', 'GreenWall');
        GreenWall.scale.setTo(2,12);
        GreenWall.body.collideWorldBounds = true;
        GreenWall.body.drag.set(175);

    
        //adding pink walls
        //Sliding walls (Pink)
        Pwalls = game.add.group();
        Pwalls.enableBody = true;
        PinkWall = Pwalls.create(320, 450,'atlas', 'PinkWall');
        PinkWall.scale.setTo(2,7);
        PinkWall.body.collideWorldBounds=true;
  

        // Create a bitmap texture for drawing light cones
        bitmap = this.game.add.bitmapData(this.game.width, this.game.height);
        bitmap.context.fillStyle = 'rgb(255, 255, 255)';
        bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
        lightBitmap = this.game.add.image(0, 0, bitmap);
        game.physics.enable(lightBitmap);

        lightBitmap.blendMode = Phaser.blendModes.MULTIPLY;

        //Create the player object
        player = new Player(game, 'playerWalk01', 'playerAtlas', 1, 0, 100, 650);
        players=game.add.group();
        game.add.existing(player);
        players.add(player);
        
		//adding coins
        Coins = game.add.group();
        Coins.enableBody=true;
        
        // place Coin display text
        coinText=game.add.text(32,16,'', style);
		coinsCollected=0;
        // place level display text
        levelText=game.add.text(900,16,'', style);
        // empty bag on load out
        scoreImageEmpty = game.add.sprite(145,3,'decoration', 'moneybagempty');
        // full bag offscreen
        scoreImageFull = game.add.sprite(-100,-100,'decoration', 'moneybagfull');
        scoreImageFull.scale.setTo(.8,.8);
        // create the door and allow physics, but dont make it move
		door = game.add.sprite( 100, 400, 'masterAtlas','door');
        game.physics.arcade.enable(door);
		door.body.immovable=true;

        // create the coins for this level
		Coin = Coins.create( 100,100,'masterAtlas','coin');		// top left coin
		Coin = Coins.create( 300,660,'masterAtlas','coin');		// bottom left coin
		Coin = Coins.create( 500,320,'masterAtlas','coin');		// middle coin
		Coin = Coins.create( 925,73,'masterAtlas','coin');		// top right coin
		Coin = Coins.create( 925,700,'masterAtlas','coin');		// bottom right coin 

    },
    update:function(){

    	game.physics.arcade.collide(player, Swalls);

        // constantly fill the bitmap 
        bitmap.context.fillStyle = 'rgb(100, 100, 100)';
        bitmap.context.fillRect(0, 0, this.game.width, this.game.height);

        // Player collision with all walls and coins
        var hitGwalls=game.physics.arcade.collide(player, Gwalls);
        var hitPwalls=game.physics.arcade.collide(player, Pwalls);
        var hitSwalls=game.physics.arcade.collide(guards, Swalls);
        // call collectCoin function when player collides with coin
        var hitCoins=game.physics.arcade.overlap(player, Coins, collectCoin, null, this);
        // allow player to collide with the tiled wallayer
        var hitWalls = game.physics.arcade.overlap(player, Walllayer);
        // allow player to collide with the door
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

        // update level display text
        levelText.text = "level: " + level;
        // update coin display text
        coinText.text="coins: "+coinsCollected;

        // when the player collects a coin, play a sound, kill coin, update score
        function collectCoin(player, Coin){
        	CoinPU.play();
            Coin.kill();
            coinsCollected+=1;
        }

        // should take x, y coordinates so we can manually place guards
        function addGuard(x,y){
        	guard = new DumbGuard(game, 'guardWalk01', 'guardAtlas', 1, 0, 200, 200, [250,475,500,500,500,200,500,500,250,475,200,250]);
        	game.add.existing(guard);
        	guards.add(guard);
        }

         // places arrow animation/sprite at x and y, above the door       
        function addExitArrow(x,y) {
        	exitArrow = game.add.sprite( x+1, y - 100, 'exitArrow');
           	var arrow = exitArrow.animations.add('arrow');
           	exitArrow.animations.play('arrow', 1, true);
        }


        if( level == 1 ) {
            // if 5 coins are collected
            if(coinsCollected >= 5) {
                //  if sign doesn't exist, add the exit arrow animation and set the isSign var true
                if(!isSign){
                    // move empty bag sprite offscreen
                    scoreImageEmpty.x = -200;
                    scoreImageEmpty.y = -200;
                    // move full bag sprite in its place
                    scoreImageFull.x = 145;
                    scoreImageFull.y = 3;
                    // add the arrow above the door
                    addExitArrow(door.x,door.y);
                    // set is sign to true to exit this loop
                    isSign=true;
                }
                //  if the player collides with the door, event Pexit becomes true, level resets
                if(Pexit==true){
                    coinReset = true;
                    // kill the arrow exit
                    exitArrow.kill();
                    // set isSign to false
                    isSign=false;
                    // play rewind sound
                    Rewind.play();
                    // stop level1 music
                    Level1.stop();
                    // play level2 music
                    Level2.play();
                    // set coinsCollected to 0
                    coinsCollected=0;
                    // create the coins for this level
					Coin = Coins.create( 100,100,'masterAtlas','coin');		// top left coin
					Coin = Coins.create( 300,660,'masterAtlas','coin');		// bottom left coin
					Coin = Coins.create( 500,320,'masterAtlas','coin');		// middle coin
					Coin = Coins.create( 925,73,'masterAtlas','coin');		// top right coin
					Coin = Coins.create( 925,700,'masterAtlas','coin');		// bottom right coin 
                    // set new player coordinates
                    player.body.x=100;
                    player.body.y=650;
                    // add a guard at these coordinates
                    addGuard(300,200);
                    // move full bag sprite offscreen
                    scoreImageFull.x = -200;
                    scoreImageFull.y = -200;
                    // move empty bag sprite in its place
                    scoreImageEmpty.x = 145;
                    scoreImageEmpty.y = 3;
                    // increase the level
                    level += 1;
                }
            }
        }   // end of level 1

        if( level == 2 ) {
            // if 5 coins are collected
            if(coinsCollected >= 5) {
                //  if sign doesn't exist, add the exit arrow animation and set the isSign var true
                if(!isSign){
                    // move empty bag sprite offscreen
                    scoreImageEmpty.x = -200;
                    scoreImageEmpty.y = -200;
                    // move full bag sprite in its place
                    scoreImageFull.x = 145;
                    scoreImageFull.y = 3;
                    // add the arrow above the door
                    addExitArrow(door.x,door.y);
                    // set is sign to true to exit this loop
                    isSign=true;
                }
                //  if the player collides with the door, event Pexit becomes true, level resets
                if(Pexit==true){
                    coinReset = true;
                    // kill the arrow exit
                    exitArrow.kill();
                    // set isSign to false
                    isSign=false;
                    // play rewind sound
                    Rewind.play();
                    // stop level1 music
                    Level1.stop();
                    // play level2 music
                    Level2.play();
                    // set coinsCollected to 0
                    coinsCollected=0;
                    //set level to 1 for bank
                    level = 1;
                    // change state to bank, 2
                    state = 2;
                    // begin bank level
                    game.state.start('Bank');
                }
            }
        }   // end of level 2


        // Press Q to return to mainmenu
        if(game.input.keyboard.justPressed(Phaser.Keyboard.Q)){
        	// stop the sound from looping
        	game.sound.stopAll();
            game.state.start('Mainmenu');
        }
    }
}
game.state.add('Museum', Museum);
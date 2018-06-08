// Museum.js
var Museum = function(game){};
//var map, Walllayer, Floorlayer;
var camera, exitArrow;
//var level = 1;
//var isSign=false;
var newLevel = false;
var tutorialWallsExist = false;
var Swalls;
var scoreImage;


Museum.prototype={
    preload:function(){
        console.log('Museum: preload');
        game.load.image('coin', 'assets/img/pngformat/coin.png');
       
        game.load.atlas('atlas', 'assets/img/atlas.png', 'assets/img/atlas.json');
        game.load.atlas('masterAtlas', 'assets/img/MasterAtlas.png', 'assets/img/MasterAtlas.json');
    },

    create:function(){
        console.log('Museum: create');
        //game.stage.backgroundColor = "#4488AA";
        game.add.tileSprite(0,0,game.width,game.height,'masterAtlas', '2floor');
        //Start arcade physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //Create the guards group
		guards=game.add.group();
        guard = new DumbGuard(game, 'guard', 1, 0, 600, 700, [600,450,900,450,600,450,600,700]);
        game.add.existing(guard);
        guards.add(guard);

        // solid walls
        Swalls = game.add.group();
        Swalls.enableBody = true;

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
        GreenWall.scale.setTo(18,12);
        GreenWall.body.collideWorldBounds = true;
        GreenWall.body.drag.set(175);
        // bottom right green wall
        GreenWall = Gwalls.create(700, 610, 'atlas', 'GreenWall');
        GreenWall.scale.setTo(18,12);
        GreenWall.body.collideWorldBounds = true;
        GreenWall.body.drag.set(175);

        /*
        //adding pink walls
        //Sliding walls (Pink)
        Pwalls = game.add.group();
        Pwalls.enableBody = true;
        PinkWall = Pwalls.create(300, 240,'atlas', 'PinkWall');
        PinkWall.scale.setTo(2,16);
        PinkWall.body.collideWorldBounds=true;
        */
  

        // Create a bitmap texture for drawing light cones
        bitmap = this.game.add.bitmapData(this.game.width, this.game.height);
        bitmap.context.fillStyle = 'rgb(255, 255, 255)';
        bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
        lightBitmap = this.game.add.image(0, 0, bitmap);
        game.physics.enable(lightBitmap);

        lightBitmap.blendMode = Phaser.blendModes.MULTIPLY;

        //Create the player object
        player = new Player(game, 'player', 1, 0, 100, 650);
        players=game.add.group();
        game.add.existing(player);
        players.add(player);
        
		//adding coins
        Coins = game.add.group();
        Coins.enableBody=true;
        

        //Update Coin display text
        coinText=game.add.text(16,16,'', {fontSize: '32px', fill:'#000'});
		coinsCollected=0;
        // empty bag on load out
        scoreImageEmpty = game.add.sprite(145,6,'emptybag');
        // full bag offscreen
        scoreImageFull = game.add.sprite(-100,-100,'fullbag');
		door = game.add.sprite( 100, 400, 'door');
        game.physics.arcade.enable(door);
		door.body.immovable=true;

		Coin = Coins.create( 100,100,'coin');		// top left coin
		Coin = Coins.create( 300,660,'coin');		// bottom left coin
		Coin = Coins.create( 500,320,'coin');		// middle coin
		Coin = Coins.create( 925,73,'coin');		// top right coin
		Coin = Coins.create( 925,700,'coin');		// bottom right coin 

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
        var hitCoins=game.physics.arcade.overlap(player, Coins, collectCoin, null, this);

        var hitWalls = game.physics.arcade.overlap(player, Walllayer);
        
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


        coinText.text="coins: "+coinsCollected;

        // when the player collects a coin, play a sound, kill coin, update score
        function collectCoin(player, Coin){
        	CoinPU.play();
            Coin.kill();
            coinsCollected+=1;
        }

        // should take x, y coordinates so we can manually place guards
        function addGuard(x,y){
        	guard = new DumbGuard(game, 'guard', 1, 0, 200, 200, [500,200,350,300,350,300,200,200]);
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

            if(newLevel == true) {
                console.log('This is level 1');
                newLevel = false;
            }
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
                    // set new player coordinates
                    player.body.x=125;
                    player.body.y=125;
                    // add a guard at these coordinates
                    addGuard(300,200);
                    // move full bag sprite offscreen
                    scoreImageFull.x = -200;
                    scoreImageFull.y = -200;
                    // move empty bag sprite in its place
                    scoreImageEmpty.x = 145;
                    scoreImageEmpty.y = 3;
                    // generate 5 coins
                    Coin = Coins.create( 100,100,'coin');       // top left coin
                    Coin = Coins.create( 300,660,'coin');       // bottom left coin
                    Coin = Coins.create( 500,320,'coin');       // middle coin
                    Coin = Coins.create( 950,40,'coin');        // top right coin
                    Coin = Coins.create( 925,700,'coin');       // bottom right coin 
                    // increase the level
                    level += 1;
                }
            }
        }   // end of level 1

        if( level == 2 ) {
            if(newLevel == true) {
                console.log('This is level 2');
                newLevel = false;
            }
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
                    // set new player coordinates
                    player.body.x=125;
                    player.body.y=125;
                    // add a guard at these coordinates
                    addGuard(500,500);
                    // move full bag sprite offscreen
                    scoreImageFull.x = -200;
                    scoreImageFull.y = -200;
                    // move empty bag sprite in its place
                    scoreImageEmpty.x = 145;
                    scoreImageEmpty.y = 3;
                    // generate 5 coins
                    Coin = Coins.create( 100,100,'coin');       // top left coin
                    Coin = Coins.create( 300,660,'coin');       // bottom left coin
                    Coin = Coins.create( 500,320,'coin');       // middle coin
                    Coin = Coins.create( 950,40,'coin');        // top right coin
                    Coin = Coins.create( 925,700,'coin');       // bottom right coin 
                    // increase the level
                    level += 1;
                }
            }
        }   // end of level 2

        // if the player is on the last level, run this code
         if( level == 3 ) {
            // just a variable that reads the level
            if(newLevel == true) {
                console.log('This is level 3');
                newLevel = false;
            }
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
                    // begin bank level
                    game.state.start('Bank');

                }
            }
        }   // end of level 3

        if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
            game.state.start('Mainmenu');
        }
        if(game.input.keyboard.justPressed(Phaser.Keyboard.G)){
            addGuard(500,500);
        }
        if(game.input.keyboard.justPressed(Phaser.Keyboard.C)){
            coinsCollected+=1;
        }
        if(game.input.keyboard.justPressed(Phaser.Keyboard.L)){
        	state='Bank';
            game.state.start('Bank');
        }
    }
}
game.state.add('Museum', Museum);
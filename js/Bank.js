// Bank.js
var Bank = function(game){};
var map, Walllayer, Floorlayer;
var camera, exitArrow;
var isSign=false;
var newLevel = true;
var tutorialWallsExist = false;
var Swalls;


Bank.prototype={
    preload:function(){
        console.log('Bank: preload');
        game.load.image('coin', 'assets/img/pngformat/coin.png');
        game.load.atlas('wallAtlas', 'assets/img/wallatlas.png', 'assets/img/wallatlas.json');
        game.load.atlas('atlas', 'assets/img/atlas.png', 'assets/img/atlas.json');
        game.load.atlas('masterAtlas', 'assets/img/MasterAtlas.png', 'assets/img/MasterAtlas.json');
        game.load.image('floor', 'assets/img/pngformat/floor.png');
		
    },

    create:function(){
        console.log('Bank: create');
		setting='bank';
        game.add.tileSprite(0,0,game.width,game.height,'floor');

        //Start arcade physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //Create the guards group
        guards=game.add.group();
        guard = new DumbGuard(game, 'guard', 1, 0, 900, 100, [600,100,600,500,200,500,200,100,200,500,600,500,600,100,900,100]);
        game.add.existing(guard);
        guards.add(guard);

        // solid walls
        Swalls = game.add.group();
        Swalls.enableBody = true;

        // borders
        var top = Swalls.create(0, 0, 'masterAtlas','topwall');
        top.body.immovable = true;
        var bot = Swalls.create(0, game.height -64, 'masterAtlas','bottomwall');
        bot.body.immovable = true;
        var left = Swalls.create(0, 0, 'masterAtlas','blankside');
        left.body.immovable = true;
        var right = Swalls.create(game.width, 0, 'masterAtlas','blankside');
        right.body.immovable = true;
        right.scale.setTo(-1,1);

        //corners
        topmid = Swalls.create(512,0, 'masterAtlas', '1corner');
        topmid.body.immovable = true;
        topmid.scale.setTo(-1,1);
        leftmid = Swalls.create(0,416, 'masterAtlas', '1corner');
        leftmid.body.immovable = true;
        leftmid.scale.setTo(1,-1);
        botleft = Swalls.create(292,game.height, 'masterAtlas', '1corner');
        botleft.body.immovable = true;
        botleft.scale.setTo(-1,-1);

        rightbot = Swalls.create(game.width,544, 'masterAtlas', '1corner');
        rightbot.body.immovable = true;
        rightbot.scale.setTo(-1,1);


        //top right
        cornerright = Swalls.create(game.width-320,352, 'masterAtlas', '1corner');
        cornerright.scale.setTo(1,-1);
        cornerright.body.immovable = true;
        smallboi4 = Swalls.create(game.width-256,160, 'masterAtlas', 'endcapmini');
        smallboi4.scale.setTo(-1,1);
        smallboi4.body.immovable = true;
        smallboi3 = Swalls.create(game.width-256,288, 'masterAtlas', 'minismall');
        smallboi3.body.immovable = true;
        doorpiece =  Swalls.create(game.width-196,160, 'masterAtlas', 'singlewall');
        doorpiece.body.immovable = true;
        //top left
        cornertop = Swalls.create(384,416, 'masterAtlas', '1corner');
        cornertop.scale.setTo(-1,-1);
        cornertop.body.immovable = true;
        smallboi1 = Swalls.create(64,352, 'masterAtlas', 'minismall');
        smallboi1.body.immovable = true;
        smallboi2 = Swalls.create(384,352, 'masterAtlas', 'minismall');
        smallboi2.body.immovable = true;
        vert1 = Swalls.create(320,352, 'masterAtlas', 'verttopleft');
        vert1.scale.setTo(1,-1);
        vert1.body.immovable = true;
        topsmall = Swalls.create(320,416, 'masterAtlas', 'singlewall');
        topsmall.scale.setTo(-1,-1);
        topsmall.body.immovable = true;
        vert2 = Swalls.create(448,64, 'masterAtlas', 'verttopleft');
        vert2.body.immovable = true;
        //bottom left
        singlebot = Swalls.create(228,game.height-256, 'masterAtlas', 'singlewall');
        singlebot.scale.setTo(-1,1);
        singlebot.body.immovable = true;
        cornerbot = Swalls.create(292,game.height-256, 'masterAtlas', '1corner');
        cornerbot.scale.setTo(-1,1);
        cornerbot.body.immovable = true;
        mini = Swalls.create(228,game.height-192, 'masterAtlas', 'mini');
        mini.body.immovable = true;
        //bottom right
        cornerright = Swalls.create(game.width-320,544, 'masterAtlas', '1corner'); 
        cornerright.body.immovable = true;
        lastboi = Swalls.create(game.width-256,544, 'masterAtlas', 'lastboi'); 
        lastboi.body.immovable = true;
        singular = Swalls.create(game.width-320,608, 'masterAtlas', 'singlewall');
        singular.body.immovable = true; 





        //adding moveable walls
        //adding Push Walls (Green)
        Gwalls = game.add.group();
        Gwalls.enableBody = true;

        // bot left green wall
        GreenWall = Gwalls.create(64, 544,'atlas', 'GreenWall');
        GreenWall.scale.setTo(12,2);
        GreenWall.body.collideWorldBounds = true;
        GreenWall.body.drag.set(175);
        // mid left green wall
        GreenWall = Gwalls.create(449, 289, 'atlas', 'GreenWall');
        GreenWall.scale.setTo(2,7.9);
        GreenWall.body.collideWorldBounds = true;
        GreenWall.body.drag.set(175);
        // bottom right green wall
        GreenWall = Gwalls.create(705, 672, 'atlas', 'GreenWall');
        GreenWall.scale.setTo(2,8);
        GreenWall.body.collideWorldBounds = true;
        GreenWall.body.drag.set(175);
        // top right green wall
        GreenWall = Gwalls.create(896, 330, 'atlas', 'GreenWall');
        GreenWall.scale.setTo(7.9,2);
        GreenWall.body.collideWorldBounds = true;
        GreenWall.body.drag.set(175);
    
        //adding pink walls
        //Sliding walls (Pink)
        Pwalls = game.add.group();
        Pwalls.enableBody = true;
        PinkWall = Pwalls.create(384, 125,'atlas', 'PinkWall');
        PinkWall.scale.setTo(8,2);
        PinkWall.body.collideWorldBounds=true;

        // Create a bitmap texture for drawing light cones
        bitmap = this.game.add.bitmapData(this.game.width, this.game.height);
        bitmap.context.fillStyle = 'rgb(255, 255, 255)';
        bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
        lightBitmap = this.game.add.image(0, 0, bitmap);
        game.physics.enable(lightBitmap);

        lightBitmap.blendMode = Phaser.blendModes.MULTIPLY;

        
        // start the player at these coordinates
        player = new Player(game, 'player', 1, 0, 100, 700);
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
        door = game.add.sprite( 828, 155, 'door');
        game.physics.arcade.enable(door);
        door.body.immovable=true;

        // create the coins at specific coordinates
        Coin = Coins.create( 100,100,'coin');       // top left coin
        Coin = Coins.create( 300,660,'coin');       // bottom left coin
        Coin = Coins.create( 460,300,'coin');       // middle coin
        Coin = Coins.create( 900,100,'coin');        // top right coin
        Coin = Coins.create( 875,675,'coin');       // bottom right coin 

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
        function addGuard(){
            guard = new DumbGuard(game, 'guard', 1, 0, 925, 725, [925,625,925,700]);
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
                    player.body.x=100;
                    player.body.y=700;
                    // add a guard at these coordinates
                    addGuard();
                                        // move full bag sprite offscreen
                    scoreImageFull.x = -200;
                    scoreImageFull.y = -200;
                    // move empty bag sprite in its place
                    scoreImageEmpty.x = 145;
                    scoreImageEmpty.y = 3;
                    // generate 5 coins
                    Coin = Coins.create( 100,100,'coin');       // top left coin
					Coin = Coins.create( 300,660,'coin');       // bottom left coin
					Coin = Coins.create( 460,300,'coin');       // middle coin
					Coin = Coins.create( 900,100,'coin');        // top right coin
					Coin = Coins.create( 875,675,'coin');       // bottom right coin 
                    // increase the level
                    level += 1;
                }
            }
        }   // end of level 1

        // if the player is on the 2nd level, run this code
         if( level == 2 ) {
            // just a variable that reads the level
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
                    // move full bag sprite offscreen
                    scoreImageFull.x = -200;
                    scoreImageFull.y = -200;
                    // move empty bag sprite in its place
                    scoreImageEmpty.x = 145;
                    scoreImageEmpty.y = 3;

                    // increase the level
                    level += 1;
                    console.log('Game Over, You Win!');
					// game over function go here
					game.state.start('YouWin');
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
			game.state.start('YouWin');
		}
    }
}
game.state.add('Bank', Bank);
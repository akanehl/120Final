// Level1.js
var Level1 = function(game){};
//var map, Walllayer, Floorlayer;
var camera, exitArrow;
//var level = 1;
//var isSign=false;
var newLevel = false;
var tutorialWallsExist = false;

Level1.prototype={
    preload:function(){
        console.log('Level1: preload');
        /*
        game.load.atlas('atlas', 'assets/img/atlas.png', 'assets/img/atlas.json');
		game.load.atlas('MenuAtlas', 'assets/img/MenuSprites/menuSheet.png', 'assets/img/MenuSprites/menuSprites.json');
		game.load.image('Wall', 'assets/img/pngformat/Walls/topwall.png');
        //game.load.tilemap('bank','assets/img/Bank.json',null, Phaser.Tilemap.TILED_JSON);
        game.load.image('floor', 'assets/img/pngformat/floor.png');
        game.load.image('tiles','assets/img/pngformat/TotalTileset.png');
        game.load.atlas('camera', 'assets/img/camera.png', 'assets/img/camera.json');
        game.load.image('door', 'assets/img/pngformat/door.png');
        game.load.atlas('exitArrow', 'assets/img/ExitArrow.png', 'assets/img/ExitArrow.json');
        //game.load.image('player','assets/img/pngformat/player.png');
		
        game.load.audio('safe', 'assets/sound/Safe.mp3');
        game.load.audio('alert', 'assets/sound/Alert.mp3');
        game.load.audio('coinPU', 'assets/sound/CoinPickUp.mp3');
        game.load.audio('level1', 'assets/sound/Level1.mp3');
        game.load.audio('level2', 'assets/sound/Level2.mp3');
        game.load.audio('rewind', 'assets/sound/Rewind.mp3');
        */
        game.load.image('coin', 'assets/img/pngformat/coin.png');
        //game.load.atlas('wallAtlas', 'assets/img/wallatlas.png', 'assets/img/wallatlas.json');
    },
    create:function(){
        console.log('Level1: create');
        //game.stage.backgroundColor = "#4488AA";

        //Start arcade physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //Create the player object
        player = new Player(game, 'atlas', 'Player', 1, 0, 100, 650);
        players=game.add.group();
        game.add.existing(player);
        players.add(player);

        //Create the guards group
		guards=game.add.group();
        guard = new Guard(game, 'atlas', 'Enemy', 1, 0, 650, 700);
        game.add.existing(guard);
		guards.add(guard);

        // Create a bitmap texture for drawing light cones
        bitmap = this.game.add.bitmapData(this.game.width, this.game.height);
        bitmap.context.fillStyle = 'rgb(255, 255, 255)';
        bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
        lightBitmap = this.game.add.image(0, 0, bitmap);
        game.physics.enable(lightBitmap);

        lightBitmap.blendMode = Phaser.blendModes.MULTIPLY;

       	//adding moveable walls
        //adding Push Walls (Green)
        Gwalls = game.add.group();
        Gwalls.enableBody = true;
        // top left green wall
        GreenWall = Gwalls.create(200, 200,'atlas', 'GreenWall');
        GreenWall.scale.setTo(16,9);
        GreenWall.body.collideWorldBounds = true;
        GreenWall.body.drag.set(175);
        // bottom right green wall
        GreenWall = Gwalls.create(800, 550, 'atlas', 'GreenWall');
        GreenWall.scale.setTo(16,9);
        GreenWall.body.collideWorldBounds = true;
        GreenWall.body.drag.set(175);

        //adding pink walls
        //Sliding walls (Pink)
        Pwalls = game.add.group();
        Pwalls.enableBody = true;
        PinkWall = Pwalls.create(300, 240,'atlas', 'PinkWall');
        PinkWall.scale.setTo(2,16);
        PinkWall.body.collideWorldBounds=true;
        PinkWall = Pwalls.create(700, 240,'atlas', 'PinkWall');

        Swalls = game.add.group();
        Swalls.enableBody = true;
        var midwall = Swalls.create(500, 400, 'wallAtlas','shortwall');
        Swalls.scale.setTo(25,15);
        
        //adding coins
        Coins = game.add.group();
        Coins.enableBody=true;

        //Update Coin display text
        coinText=game.add.text(16,16,'', {fontSize: '32px', fill:'#000'});
		coinsCollected=0;
		door = game.add.sprite( 100, 400, 'door');
        game.physics.arcade.enable(door);
		door.body.immovable=true;

		Coin = Coins.create( 100,100,'coin');		// top left coin
		Coin = Coins.create( 300,650,'coin');		// bottom left coin
		Coin = Coins.create( 500,350,'coin');		// middle coin
		Coin = Coins.create( 950,40,'coin');		// top right coin
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

        coinText.text="coins: "+coinsCollected;

        // if a coin is in a wall, kill the coin and create a new one in its place
        function respawnCoin( coin, walls ) {
            coin.kill();
            Coin = Coins.create(Math.random()*game.width,Math.random()*game.height,'atlas', 'Coin');
            console.log('another coin was respawned');
            respawnCoin = game.physics.arcade.overlap(Coin, walls, respawnCoin, null, this);
        }

        // when the player collects a coin, play a sound, kill coin, update score
        function collectCoin(player, Coin){
        	CoinPU.play();
            Coin.kill();
            coinsCollected+=1;
        }

        // should take x, y coordinates so we can manually place guards
        function addGuard(x,y){
        	guard = new Guard(game, 'atlas', 'Enemy', 1, 0, x, y);
        	game.add.existing(guard);
			guards.add(guard);
        }

         // places arrow animation/sprite at x and y, above the door       
        function addExitArrow(x,y) {
        	exitArrow = game.add.sprite( x+1, y - 100, 'exitArrow');
           	var arrow = exitArrow.animations.add('arrow');
           	exitArrow.animations.play('arrow', 1, true);
        }

        function addCoin(x,y) {
            Coin = Coins.create( x,y, 'atlas', 'Coin');
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
                    addExitArrow(door.x,door.y);
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
                    player.body.x=75;
                    player.body.y=300;
                    // add a guard at these coordinates
                    addGuard(300,200);
                    // generate 5 random coins
                    for(var i =0; i<5; i++){
                        var Coin = Coins.create(game.rnd.integerInRange(150, 900),game.rnd.integerInRange(150, 700),'atlas', 'Coin');
                    }
                    // increase the level
                    level += 1;
                }
            }
        }   // end of level 1
        if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
            game.state.start('Mainmenu');
        }
    }
}
game.state.add('Level1', Level1);
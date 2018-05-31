/* Version Notes:
Guard Wanders
Tiled BG implemented but no wall collision
Light ray bug fixed
// Copyright © 2014 John Watson
*/


var game = new Phaser.Game(1024,800,Phaser.AUTO);
var coinsCollected=0;
var coinText;
var Swalls;

var Mainmenu = function(game){};
var map, Floorlayer;
Mainmenu.prototype ={
    preload:function(){
        console.log('Mainmenu: preload');
        game.load.atlas('atlas', 'assets/img/atlas.png', 'assets/img/atlas.json');
		game.load.atlas('MenuAtlas', 'assets/img/MenuSprites/menuSheet.png', 'assets/img/MenuSprites/menuSprites.json');
		game.load.image('Wall', 'assets/img/pngformat/Walls/topwall.png');
        game.load.tilemap('bank','assets/img/Bank.json',null, Phaser.Tilemap.TILED_JSON);
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
    },
    create:function(){
        console.log('Mainmenu: create');
        move=true;
        game.add.tileSprite(0,0,game.width,game.height,'floor');

        //create sprites that run around in the background
        fakePlayer=game.add.sprite( 300, 400, 'atlas', 'Player');
        fakeGuard=game.add.sprite(400,300, 'atlas', 'Enemy');
        game.physics.arcade.enable(fakeGuard);
        game.physics.arcade.enable(fakePlayer);
        fakePlayer.anchor.setTo(.5,.5);
        MenuDoor=game.add.sprite(700,740, 'door');
        game.physics.arcade.enable(MenuDoor);



        selected=0;
		Coin=game.add.sprite(375, 225,'atlas','Coin');
        game.physics.arcade.enable(Coin);

		
		ControlsStyle={
			font:'Character',
			fontSize:25,
		};
        GameNameStyle={
            font:'Character',
            fontSize:75,
        };
        MenuStyle={
            font:'Character',
            fontSize:50,
        };
        GameName=game.add.text(325, 110, 'Coin Thief',GameNameStyle);
        PlayText=game.add.text(420, 200, 'Play',MenuStyle);
        CreditsText=game.add.text(400,260, 'Credits', MenuStyle);
		controlsText= game.add.text(400,450, 'Controls\nArrow Keys to move things \nSpacebar to do things', ControlsStyle);
    },
    update:function(){
        coinCollide=game.physics.arcade.collide(fakePlayer, Coin);
        playerExitDoor=game.physics.arcade.collide(fakePlayer, MenuDoor);
        if(move){
        	if(game.input.keyboard.justPressed(Phaser.Keyboard.UP)){
                if(selected>0){
                	selected--;
                	Coin.y-=60;
                }
            }
        }
        if(move){
            if(game.input.keyboard.justPressed(Phaser.Keyboard.DOWN)){
                if(selected<1){
                	selected++;
                	Coin.y+=60
                }
            }
        }
        if(move){
            if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)){
                if(selected==0){
                    move=false;
                    line=new Phaser.Line(fakePlayer.body.x,fakePlayer.body.y,Coin.body.x,Coin.body.y);
                    //Update the fakePlayers angle to the line
                    fakePlayer.angle=(line.angle/Math.PI)*180;
                    fakePlayer.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(fakePlayer.angle, 130));
                    

                	//game.state.start('PlayGround');
                }else if(selected==1){
                	console.log('credits');
                }else{
                	console.log('error with selected');
                }
                
            }
        }
        if(coinCollide){
            console.log('collide');
            Coin.kill();
            exitArrow = game.add.sprite( MenuDoor.body.x+1, MenuDoor.body.y - 100, 'exitArrow');
            var arrow = exitArrow.animations.add('arrow');
            exitArrow.animations.play('arrow', 1, true);
            line1=new Phaser.Line(fakePlayer.body.x,fakePlayer.body.y,MenuDoor.x,MenuDoor.y);
            //Update the fakePlayers angle to the line
            fakePlayer.angle=(line1.angle/Math.PI)*180;
            fakePlayer.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(fakePlayer.angle, 130));
        }
        if(playerExitDoor){
            game.state.start('PlayGround');
        }
    }
}

/*-------------------------------------------------------------------------------*/
/*Start of GameState Function*/
/*-------------------------------------------------------------------------------*/

var PlayGround = function(game) {};

// Load images and sounds


var map, Walllayer, Floorlayer;
var camera, exitArrow;
var level = 0;
var isSign=false;
var newLevel = false;
var tutorialWallsExist = false;

PlayGround.prototype={
    preload:function(){
        console.log('PlayGround: preload');

        game.load.image('Wall', 'assets/img/pngformat/Walls/topwall.png');
        game.load.tilemap('bank','assets/img/Bank.json',null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles','assets/img/pngformat/TotalTileset.png');
        game.load.atlas('camera', 'assets/img/camera.png', 'assets/img/camera.json');
        game.load.atlas('cameralight', 'assets/img/cameralight.png', 'assets/img/cameralight.json');
        
        game.load.image('coin', 'assets/img/pngformat/coin.png');
        game.load.atlas('wallAtlas', 'assets/img/wallatlas.png', 'assets/img/wallatlas.json');
    },


// Setup the example
    create:function() {
        console.log('PlayGround: create');

        map = game.add.tilemap('bank');
        map.addTilesetImage('TotalTileset','tiles');
        Floorlayer = map.createLayer('Floor');
        Walllayer = map.createLayer('Walls');



        //the lower the second number is the better performance we have. 
        //but it has to. be high enough to include all the tiles we want collision with.
        //map.setCollisionBetween(1,THIS NUMBER, true, 'Walls');
        map.setCollisionBetween(1,28,true,'Walls');

        Alert = game.add.audio('alert');
    	Safe = game.add.audio('safe');
    	CoinPU = game.add.audio('coinPU');
    	Level1 = game.add.audio('level1');
    	Level2 = game.add.audio('level2');
    	Rewind = game.add.audio('rewind');
    	Level1.loop=true;
    	Level2.loop=true;
    	Level1.play();

        //Start arcade physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //Create the player object
        player = new Player(game, 'atlas', 'Player', 1, 0, 100, 400);
        players=game.add.group();
        game.add.existing(player);
        players.add(player);

        //Create the guards group
		guards=game.add.group();
        guard = new Guard(game, 'atlas', 'Enemy', 1, 0, 900, 650);
        game.add.existing(guard);
		guards.add(guard);


        // Create a bitmap texture for drawing light cones
        bitmap = this.game.add.bitmapData(this.game.width, this.game.height);
        bitmap.context.fillStyle = 'rgb(255, 255, 255)';
        bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
        lightBitmap = this.game.add.image(0, 0, bitmap);
        game.physics.enable(lightBitmap);

        /* This bitmap is drawn onto the screen using the MULTIPLY blend mode.
        Since this bitmap is over the background, dark areas of the bitmap
        will make the background darker. White areas of the bitmap will allow
        the normal colors of the background to show through. Blend modes are
        only supported in WebGL. If your browser doesn't support WebGL then
        you'll see gray shadows and white light instead of colors and it
        generally won't look nearly as cool. So use a browser with WebGL. */
        lightBitmap.blendMode = Phaser.blendModes.MULTIPLY;

        //Create generic game walls before the sprites are ready

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
        PinkWall = Pwalls.create(300, 240,'atlas', 'PinkWall');
        PinkWall.scale.setTo(2,16);
        PinkWall.body.collideWorldBounds=true;

        Cameras = game.add.group();
        Swalls = game.add.group();
        Swalls.enableBody = true;
        
        var Ltopwall = Swalls.create(62, 190, 'wallAtlas','shortwalUDl');
        Ltopwall.scale.setTo(1.18,1);
        var Lbotwall = Swalls.create(62, 512, 'wallAtlas','shortwall');
        Lbotwall.scale.setTo(1.18,1);
        var Mtopwall = Swalls.create(417, 190, 'wallAtlas', 'shortwalUDl');
        var Mbotwall = Swalls.create(417, 512, 'wallAtlas', 'shortwall');
        var Rtopwall = Swalls.create(737, 190, 'wallAtlas', 'shortwalUDl');
        Rtopwall.scale.setTo(1.17,1);
        var Rbotwall = Swalls.create(737, 512, 'wallAtlas', 'shortwall');
        Rbotwall.scale.setTo(1.17,1);

        //adding coins
        Coins = game.add.group();
        Coins.enableBody=true;

        // tutorial levels coins
        var Coin = Coins.create(200,350,'coin');	// middle left coin
        Coin = Coins.create(150,650,'coin');		// bot left coin
        Coin = Coins.create(150,80,'coin');			// top left coin
        Coin = Coins.create(900,80,'coin');			// top right coin
        Coin = Coins.create(850,350,'coin');		// mid right coin

        //Update Coin display text
        coinText=game.add.text(16,16,'', {fontSize: '32px', fill:'#000'});
		coinsCollected=0;
		door = game.add.sprite( -50, -50, 'door');
        game.physics.arcade.enable(door);
		door.body.immovable=true;
    },

// The update() method is called every frame
    update:function() {
    	game.physics.arcade.collide(player, Walllayer);

        // constantly fill the bitmap 
        bitmap.context.fillStyle = 'rgb(100, 100, 100)';
        bitmap.context.fillRect(0, 0, this.game.width, this.game.height);

        // Player collision with all walls and coins 
        var hitGwalls=game.physics.arcade.collide(player, Gwalls);
        var hitPwalls=game.physics.arcade.collide(player, Pwalls);
        var hitCoins=game.physics.arcade.overlap(player, Coins, collectCoin, null, this);
        var hitSwalls = game.physics.arcade.overlap(player, Swalls);

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

        // places camera animation/sprite at x and y
        function addCamera(x,y) {
            camera = game.add.sprite( x, y, 'camera');
            var record = camera.animations.add('record');
            camera.animations.play('record', 3, true);
            cameras.add(camera);
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

        // tutorial level
        if( level == 0 ) {
            // set new door coordinates
        	door.x = 700;
        	door.y = 700;

            // if 5 coins are collected
            if(coinsCollected >= 5) {
                //  if sign doesn't exist, add the exit arrow animation and set the isSign var true
                if(isSign == false ){
                    addExitArrow(door.x,door.y);
                    isSign=true;
                    //spawnTutorialWalls();
                }
                //  if the player collides with the door, event Pexit becomes true, level resets
            if(Pexit==true){
                newLevel = true;
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
                // set coinsCollected to 0t
                coinsCollected=0;
                // set new player coordinates
                player.body.x=75;
                player.body.y=300;
                // add a guard at these coordinates
                //addGuard(300,200);
                // generate 5 random coins
                    
                for(var i =0; i<5; i++){
                    var Coin = Coins.create(game.rnd.integerInRange(150, 900),game.rnd.integerInRange(150, 700),'atlas', 'Coin');
                }

                

                // increase the level
                level += 1;
                game.state.start('Level1')
                }
            }
        }   // end of level 0

        

        if( level == 2 ) {
            // if 5 coins are collected
            if(coinsCollected >= 5) {
                //  if sign doesn't exist, add the exit arrow animation and set the isSign var true
                if(!isSign){
                    addExitArrow(door.x,door.y);
                    isSign=true;
                }
                //  if the player collides with the door, event Pexit becomes true, level resets
                if(Pexit==true){
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
                    addGuard(500,400);
                    // generate 5 random coins
                    for(var i =0; i<5; i++){
                        var Coin = Coins.create(game.rnd.integerInRange(150, 900),game.rnd.integerInRange(150, 700),'atlas', 'Coin');
                    }
                    // increase the level
                    level += 1;
                }
            }
        }   // end of level 2

        if( level == 3 ) {
            // if 5 coins are collected
            if(coinsCollected >= 5) {
                //  if sign doesn't exist, add the exit arrow animation and set the isSign var true
                if(!isSign){
                    addExitArrow(door.x,door.y);
                    isSign=true;
                }
                //  if the player collides with the door, event Pexit becomes true, level resets
                if(Pexit==true){
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
                    addGuard(800,600);
                    // generate 5 random coins
                    for(var i =0; i<5; i++){
                        var Coin = Coins.create(game.rnd.integerInRange(150, 900),game.rnd.integerInRange(150, 700),'atlas', 'Coin');
                    }
                    // increase the level
                    level += 1;
                }
            }
        }   // end of level 3

       
        if(game.input.keyboard.justPressed(Phaser.Keyboard.G)){
            addGuard(500,500);
        }
        if(game.input.keyboard.justPressed(Phaser.Keyboard.C)){
            coinsCollected+=1;
        }
        
        if(game.input.keyboard.justPressed(Phaser.Keyboard.S)){
           
           addCamera(500,500); 
        }        
        if(game.input.keyboard.justPressed(Phaser.Keyboard.L)){
            skipToLevel1();
        }
        function skipToLevel1() {
            game.state.start('Level1');
        }


/*----------------------------------------------------------------------
                             Start of the Light Code
----------------------------------------------------------------------*/
        
            // Connect the dots and fill in the shape, which are cones of light,
            // with a bright white color. When multiplied with the background,
            // the white color will allow the full color of the background to
            // shine through.
        
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

/*----------------------------------------------------------------------
End of the Light Code
----------------------------------------------------------------------*/


/*-------------------------------------------------------------------------------*/
/*Start of GameOver Function*/
/*-------------------------------------------------------------------------------*/

var GameOver = function(game){};
GameOver.prototype={
    preload:function(){
        console.log('GameOver: preload');
    },
    create:function(){
        console.log('GameOver: create');
        OverScreen=game.add.sprite(0,0,'atlas', 'GameOver');
        OverScreen.scale.setTo(1.28,1.34);

    },
    update:function(){
        if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
            game.state.start('Mainmenu');
        }
    }
}
game.state.add('Mainmenu', Mainmenu);
game.state.add('PlayGround', PlayGround);
game.state.add('GameOver', GameOver);
//game.state.add('Level1', Level1);

game.state.start('Mainmenu');



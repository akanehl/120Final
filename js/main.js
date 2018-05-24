/* Version Notes:
Guard Wanders
Tiled BG implemented but no wall collision
Light ray bug fixed
// Copyright © 2014 John Watson
*/


var game = new Phaser.Game(1024,800,Phaser.AUTO);
var coinsCollected=0;
var coinText;

var Mainmenu = function(game){};
Mainmenu.prototype ={
    preload:function(){
        console.log('Mainmenu: preload');
        game.load.atlas('atlas', 'assets/img/atlas.png', 'assets/img/atlas.json');
        game.load.audio('safe', 'assets/sound/Safe.mp3');
        game.load.audio('alert', 'assets/sound/Alert.mp3');
        game.load.audio('coinPU', 'assets/sound/CoinPickUp.mp3');
        game.load.audio('level1', 'assets/sound/Level1.mp3');
        game.load.audio('level2', 'assets/sound/Level2.mp3');
        game.load.audio('rewind', 'assets/sound/Rewind.mp3');
    },
    create:function(){
        console.log('Mainmenu: create');
        MainMenu=game.add.sprite(0,0,'atlas', 'Menu');
        MainMenu.scale.setTo(1.28,1.34);
    },
    update:function(){
        if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
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
var doorX, doorY;

PlayGround.prototype={
    preload:function(){
        console.log('PlayGround: preload');
        game.load.image('Wall', 'assets/img/pngformat/top-wall.png');
        game.load.tilemap('bank','assets/img/Bank.json',null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles','assets/img/pngformat/TotalTileset.png');
        game.load.atlas('camera', 'assets/img/camera.png', 'assets/img/camera.json');
        game.load.atlas('cameralight', 'assets/img/cameralight.png', 'assets/img/cameralight.json');
        game.load.atlas('exitArrow', 'assets/img/ExitArrow.png', 'assets/img/ExitArrow.json');
        game.load.atlas('door', 'assets/img/tempdoor.png', 'assets/img/tempdoor.json');
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
        player = new Player(game, 'atlas', 'Player', 1, 0, 100, 350);
        players=game.add.group();
        game.add.existing(player);
        players.add(player);

        //Create the guards group
		guards=game.add.group();
        guard = new Guard(game, 'atlas', 'Enemy', 1, 0, 400, 500);
        game.add.existing(guard);
		guards.add(guard);

		

        // Add the light

        // Set the pivot point of the light to the center of the texture

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
        GreenWall.body.allowRotation=true;
        GreenWall.body.collideWorldBounds = true;
        GreenWall.body.drag.set(175);

        //adding pink walls
        //Sliding walls (Pink)
        Pwalls = game.add.group();
        Pwalls.enableBody = true;
        PinkWall = Pwalls.create(300, 240,'atlas', 'PinkWall');
        PinkWall.scale.setTo(2,16);
        PinkWall.body.collideWorldBounds=true;


        
        //adding coins
        Coins = game.add.group();
        Coins.enableBody=true;
        for(var i =0; i<5; i++){
            var Coin = Coins.create(game.rnd.integerInRange(150, 900),game.rnd.integerInRange(150, 700),'atlas', 'Coin');
        }
        //Update Coin display text
        coinText=game.add.text(16,16,'', {fontSize: '32px', fill:'#000'});
		coinsCollected=0;
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


        var hitWalls = game.physics.arcade.overlap(player, Walllayer);
        // if a coin was spawned in a wall, respawn the coin with new coordinates
    
        

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

        function addCamera(x,y) {
            camera = game.add.sprite( x, y, 'camera');
            var record = camera.animations.add('record');
            camera.animations.play('record', 3, true);
        }

        function addDoor(x,y) {
        	door = game.add.sprite( x, y, 'door');
        }
        function addExitArrow(x,y) {
        	exitArrow = game.add.sprite( x, y - 50, 'exitArrow');
           	var arrow = exitArrow.animations.add('arrow');
           	exitArrow.animations.play('arrow', 1, true);
        }

        if( level == 0 ) {
        	doorX = 700;
        	doorY = 700;
        	addDoor(doorX,doorY);

        	if(coinsCollected == 5) {
        		addExitArrow(doorX,doorY);
           	}
        }
        if(coinsCollected == 5) {

        	
        	/*
        	Rewind.play();
        	Level1.stop();
        	Level2.play();
        	coinsCollected=0;
        	player.body.x=75;
        	player.body.y=300;
        	addGuard(300,200);
        	for(var i =0; i<5; i++){
            	var Coin = Coins.create(game.rnd.integerInRange(150, 900),game.rnd.integerInRange(150, 700),'atlas', 'Coin');
        	}
		*/
        }
        /*
        //if all 5 coins are collected, the player pos is reset and another guard is spawned with 5 more coins.
        if(coinsCollected==5){
        	Rewind.play();
        	Level1.stop();
        	Level2.play();
        	coinsCollected=0;
        	player.body.x=75;
        	player.body.y=300;
        	addGuard();
        	for(var i =0; i<5; i++){
            	var Coin = Coins.create(game.rnd.integerInRange(150, 900),game.rnd.integerInRange(150, 700),'atlas', 'Coin');
        	}
        }
        */
        if(game.input.keyboard.justPressed(Phaser.Keyboard.G)){
            addGuard();
        }
        if(game.input.keyboard.justPressed(Phaser.Keyboard.C)){
            coinsCollected+=1;
        }
        
        if(game.input.keyboard.justPressed(Phaser.Keyboard.S)){
            addCamera(500,500);
        }
        
        guards.forEach(function(guard){
        	setFill(guard.x,guard.y);
        },this);

/*----------------------------------------------------------------------
                             Start of the Light Code
----------------------------------------------------------------------*/
        function setFill(x,y){
            var points=[];
            for(var a = 0; a < Math.PI*2; a += Math.PI/360) {
                // Create a ray from the light to a point on the circle
                var ray = new Phaser.Line(x, y, x+Math.cos(a)*125, y+Math.sin(a)*125);

                // Check if the ray intersected any walls
                var intersect = getWallIntersection(ray);

                // Save the intersection or the end of the ray
                if (intersect) {
                    points.push(intersect);
                } else {
                    points.push(ray.end);
                }
            }
            draw(points);
        }
            // Connect the dots and fill in the shape, which are cones of light,
            // with a bright white color. When multiplied with the background,
            // the white color will allow the full color of the background to
            // shine through.
        function draw(points){
                bitmap.context.beginPath();
                bitmap.context.fillStyle = 'rgb(255, 255, 255)';


                for(var i = 0; i < points.length-1; i++) {
                    bitmap.context.lineTo(points[i].x, points[i].y);
                }
                bitmap.context.closePath();
                bitmap.context.fill();

                // This just tells the engine it should update the texture cache
                bitmap.dirty = true;
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
        
        /*function Walllayer (){
            // Create an array of lines that represent the four edges of each wall
            var lines = [
                new Phaser.Line(Walllayer.x, Walllayer.y, Walllayer.x + Walllayer.width, Walllayer.y),
                new Phaser.Line(Walllayer.x, Walllayer.y, Walllayer.x, Walllayer.y + Walllayer.height),
                new Phaser.Line(Walllayer.x + Walllayer.width, Walllayer.y,
                    Walllayer.x + Walllayer.width, Walllayer.y + Walllayer.height),
                new Phaser.Line(Walllayer.x, Walllayer.y + Walllayer.height,
                    Walllayer.x + Walllayer.width, Walllayer.y + Walllayer.height)
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
        }*/
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
game.state.start('Mainmenu');



// This example uses the Phaser 2.2.2 framework

// Copyright © 2014 John Watson
// Licensed under the terms of the MIT License

var game = new Phaser.Game(800,600,Phaser.AUTO);
var coinsCollected=0;
var coinText;
var chase=false;
var Mainmenu = function(game){};
Mainmenu.prototype ={
    preload:function(){
        console.log('Mainmenu: preload');
        game.load.atlas('atlas', 'assets/img/atlas.png', 'assets/img/atlas.json');
        game.load.audio('safe', 'assets/sound/safe.mp3');
        game.load.audio('alert', 'assets/sound/alert.mp3');
        game.load.audio('coinPU', 'assets/sound/CoinPickUp.mp3');
    },
    create:function(){
        console.log('Mainmenu: create');
        game.add.sprite(0,0,'atlas', 'Menu');
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

PlayGround.prototype={
    preload:function(){
        console.log('PlayGround: preload');
        
    },


// Setup the example
    create:function() {
        console.log('PlayGround: create');
        Alert = game.add.audio('alert');
    	Safe = game.add.audio('safe');
    	CoinPU = game.add.audio('coinPU');
        //Start arcade physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //adding background and immovable black walls
        game.add.image(0,0, 'atlas', 'GameBack');

        //Create the player object
        player = new Player(game, 'atlas', 'Player', 1, 0);
        players=game.add.group();
        game.add.existing(player);
        players.add(player);

        //Create the guards group
		guards=game.add.group();
        guard = new Guard(game, 'atlas', 'Enemy', 1, 0);
        game.add.existing(guard);
		guards.add(guard);
		chase=false;

		

        // Add the light

        // Set the pivot point of the light to the center of the texture

        // Create a bitmap texture for drawing light cones
        this.bitmap = this.game.add.bitmapData(this.game.width, this.game.height);
        this.bitmap.context.fillStyle = 'rgb(255, 255, 255)';
        this.bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
        lightBitmap = this.game.add.image(0, 0, this.bitmap);
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
        walls = game.add.group();
        walls.enableBody = true;

        BlackWall = walls.create(0, 180, 'atlas', 'Wall');
        BlackWall.scale.setTo(30,1);
        BlackWall.body.immovable = true;
        BlackWall = walls.create(30, game.height-188, 'atlas','Wall');
        BlackWall.scale.setTo(30,1);
        BlackWall.body.immovable = true;
        BlackWall = walls.create(440, 180,'atlas', 'Wall');
        BlackWall.scale.setTo(30,1);
        BlackWall.body.immovable = true;
        BlackWall = walls.create(440, game.height-188,'atlas', 'Wall');
        BlackWall.scale.setTo(30,1);
        BlackWall.body.immovable = true;

        BlackWall = walls.create(64, 240,'atlas', 'Wall');
        BlackWall.scale.setTo(1,1);
        BlackWall.body.immovable = true;
        BlackWall = walls.create(64, 360,'atlas', 'Wall');
        BlackWall.scale.setTo(1,1);
        BlackWall.body.immovable = true;
        BlackWall = walls.create(625, 240,'atlas', 'Wall');
        BlackWall.scale.setTo(1,1);
        BlackWall.body.immovable = true;
        BlackWall = walls.create(625, 360,'atlas', 'Wall');
        BlackWall.scale.setTo(1,1);
        BlackWall.body.immovable = true;

        //adding moveable walls
        //adding Push Walls (Green)
        Gwalls = game.add.group();
        Gwalls.enableBody = true;
        GreenWall = Gwalls.create(360, 180,'atlas', 'GreenWall');
        GreenWall.scale.setTo(10,2);
        GreenWall.body.collideWorldBounds = true;
        GreenWall.body.drag.set(175);
        GreenWall = Gwalls.create(360, game.height-188,'atlas', 'GreenWall');
        GreenWall.scale.setTo(10,2);
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
            var Coin = Coins.create(Math.random()*800,Math.random()*600,'atlas', 'Coin');
        }
        //Update Coin display text
        coinText=game.add.text(16,16,'', {fontSize: '32px', fill:'#000'});
		coinsCollected=0;
    },

// The update() method is called every frame
    update:function() {
        //collision
        //player collision
        var hitBlackWalls=game.physics.arcade.collide(player, walls);
        var hitGwalls=game.physics.arcade.collide(player, Gwalls);
        var hitPwalls=game.physics.arcade.collide(player, Pwalls);
        var hitCoins=game.physics.arcade.overlap(player, Coins, collectCoin, null, this);
 
        //green wall collision
        var GwallHitWalls=game.physics.arcade.collide(Gwalls, walls);
        var GwallHitGwall=game.physics.arcade.collide(Gwalls, Gwalls);
        //pink wall collision
        var PwallHitWalls=game.physics.arcade.collide(Pwalls, walls);
        var PwallhitPwall=game.physics.arcade.collide(Pwalls, Pwalls);
        //color wall collisions
        var PwallHitGwall=game.physics.arcade.collide(Pwalls, Gwalls);

        coinText.text="coins: "+coinsCollected;

        function collectCoin(player, Coin){
        	CoinPU.play();
            Coin.kill();
            coinsCollected+=1;
        }
        function addGuard(){
        	guard = new Guard(game, 'atlas', 'Enemy', 1, 0);
        	game.add.existing(guard);
			guards.add(guard);
        }
        //if all 5 coins are collected, the player pos is reset and another guard is spawned with 5 more coins.
        if(coinsCollected==5){
        	coinsCollected=0;
        	player.body.x=30;
        	player.body.y=30;
        	chase=false;
        	addGuard();
        	for(var i =0; i<5; i++){
            var Coin = Coins.create(Math.random()*800,Math.random()*600,'atlas', 'Coin');
        }
        }

/*----------------------------------------------------------------------
                             Start of the Light Code
----------------------------------------------------------------------*/

        // Next, fill the entire light bitmap with a dark shadow color.
        this.bitmap.context.fillStyle = 'rgb(100, 100, 100)';
        this.bitmap.context.fillRect(0, 0, this.game.width, this.game.height);

        // Ray casting!
        // Cast rays at intervals in a large circle around the light.
        // Save all of the intersection points or ray end points if there was no intersection.
        var points=[];
        guards.forEach(function(guard){
        for(var a = 0; a < Math.PI*2; a += Math.PI/360) {
            // Create a ray from the light to a point on the circle
            var ray = new Phaser.Line(guard.x, guard.y, guard.x+Math.cos(a)*125, guard.y+Math.sin(a)*125);

            // Check if the ray intersected any walls
            var intersect = getWallIntersection(ray);

            // Save the intersection or the end of the ray
            if (intersect) {
                points.push(intersect);
            } else {
                points.push(ray.end);
            }
        }
    }, this);
		
        // Connect the dots and fill in the shape, which are cones of light,
        // with a bright white color. When multiplied with the background,
        // the white color will allow the full color of the background to
        // shine through.
        for(var j=0; j<1; j++){
        this.bitmap.context.beginPath();
        this.bitmap.context.fillStyle = 'rgb(255, 255, 255)';


        //^^^THIS IS WHAT CAUSES THE LINE TO BE DRAWN FROM ONE GUARD TO ANOTHER^^^


        for(var i = 0; i < points.length; i++) {
            this.bitmap.context.lineTo(points[i].x, points[i].y);
        }
        this.bitmap.context.closePath();
        this.bitmap.context.fill();

        // This just tells the engine it should update the texture cache
        this.bitmap.dirty = true;
    }
}
};

// Given a ray, this function iterates through all of the walls and
// returns the closest wall intersection from the start of the ray
// or null if the ray does not intersect any walls.
function getWallIntersection (ray) {
        var distanceToWall = Number.POSITIVE_INFINITY;
        var closestIntersection = null;
		
		
		
        // For each of the walls...
        this.walls.forEach(function(wall) {
            // Create an array of lines that represent the four edges of each wall
            var lines = [
                new Phaser.Line(wall.x, wall.y, wall.x + wall.width, wall.y),
                new Phaser.Line(wall.x, wall.y, wall.x, wall.y + wall.height),
                new Phaser.Line(wall.x + wall.width, wall.y,
                    wall.x + wall.width, wall.y + wall.height),
                new Phaser.Line(wall.x, wall.y + wall.height,
                    wall.x + wall.width, wall.y + wall.height)
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
        this.players.forEach(function(player) {
            // Create an array of lines that represent the four edges of each wall
            var lines = [
                new Phaser.Line(player.x, player.y, player.x + player.width, player.y),
                new Phaser.Line(player.x, player.y, player.x, player.y + player.height),
                new Phaser.Line(player.x + player.width, player.y,
                    player.x + player.width, player.y + player.height),
                new Phaser.Line(player.x, player.y + player.height,
                    player.x + player.width, player.y + player.height)
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
                        Chase();
					}else{
						NoChase();
					}
					function Chase(){
						Alert.play();
						chase=true;
					}
					function NoChase(){
						Safe.play();
						chase=false;
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
        game.add.sprite(0,0,'atlas', 'GameOver');

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


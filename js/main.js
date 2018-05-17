// FINAL MERGE
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
PlayGround.prototype.preload = function() {
    console.log('PlayGround: preload');
    game.load.image('floor', 'assets/img/pngformat/floor.png');
    game.load.image('Wall', 'assets/img/pngformat/top-wall.png');
};

// Setup the example
PlayGround.prototype.create = function() {
    // Set stage background color
    
    //this.game.stage.backgroundColor = 0x4488cc;
    game.add.tileSprite(0,0,800,600,'floor');

    Alert = game.add.audio('alert');
    Safe = game.add.audio('safe');
    CoinPU = game.add.audio('coinPU');

    //Start arcade physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    player = new Player(game, 'atlas', 'Player', 1, 0);
    players=game.add.group();
    game.add.existing(player);
    players.add(player);

        //Create the guards group
        guards = game.add.group();
        guard = new Guard(game, 'atlas', 'Enemy', 1, 0, 300, 300);
        game.add.existing(guard);
        guards.add(guard);


    // Create a bitmap texture for drawing light cones
    this.bitmap = this.game.add.bitmapData(this.game.width, this.game.height);
    this.bitmap.context.fillStyle = 'rgb(255, 255, 255)';
    this.bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
    var lightBitmap = this.game.add.image(0, 0, this.bitmap);

    game.physics.enable(lightBitmap);

    lightBitmap.blendMode = Phaser.blendModes.MULTIPLY;

        this.walls = this.game.add.group();
        this.walls.enableBody = true;

        BlackWall = this.walls.create(0, 180, 'Wall');
        BlackWall.scale.setTo(4,.5);
        BlackWall.body.immovable = true;
        BlackWall = this.walls.create(0, game.height-188,'Wall');
        BlackWall.scale.setTo(4,.5);
        BlackWall.body.immovable = true;
        BlackWall = this.walls.create(440, 180, 'Wall');
        BlackWall.scale.setTo(4,.5);
        BlackWall.body.immovable = true;
        BlackWall = this.walls.create(440, game.height-188, 'Wall');
        BlackWall.scale.setTo(4,.5);
        BlackWall.body.immovable = true;

        BlackWall = this.walls.create(64, 240, 'Wall');
        BlackWall.scale.setTo(.25,.25);
        BlackWall.body.immovable = true;
        BlackWall = this.walls.create(64, 360,'Wall');
        BlackWall.scale.setTo(.25,.25);
        BlackWall.body.immovable = true;
        BlackWall = this.walls.create(625, 240, 'Wall');
        BlackWall.scale.setTo(.25,.25);
        BlackWall.body.immovable = true;
        BlackWall = this.walls.create(625, 360, 'Wall');
        BlackWall.scale.setTo(.25,.25);
        BlackWall.body.immovable = true;

        //adding moveable walls
        //adding Push Walls (Green)
        this.Gwalls = this.game.add.group();
        this.Gwalls.enableBody = true;
        GreenWall = this.Gwalls.create(360, 180,'atlas', 'GreenWall');
        GreenWall.scale.setTo(10,2);
        GreenWall.body.collideWorldBounds = true;
        GreenWall.body.drag.set(175);
        GreenWall = this.Gwalls.create(360, game.height-188,'atlas', 'GreenWall');
        GreenWall.scale.setTo(10,2);
        GreenWall.body.allowRotation=true;
        GreenWall.body.collideWorldBounds = true;
        GreenWall.body.drag.set(175);

        //adding pink walls
        //Sliding walls (Pink)
        this.Pwalls = this.game.add.group();
        this.Pwalls.enableBody = true;
        PinkWall = this.Pwalls.create(300, 240,'atlas', 'PinkWall');
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

};


PlayGround.prototype.update = function() {
    var hitBlackWalls = game.physics.arcade.collide(player, this.walls);
    var hitGwalls = game.physics.arcade.collide(player, this.Gwalls);
    var hitPwalls = game.physics.arcade.collide(player, this.Pwalls);
    var hitCoins = game.physics.arcade.overlap(player, Coins, collectCoin, null, this);
    // if a coin was spawned in a wall, respawn the coin with new coordinates
    var respawnCoin = game.physics.arcade.overlap(Coins, this.walls, respawnCoin, null, this);
        //green wall collision
    var GwallHitWalls=game.physics.arcade.collide(this.Gwalls, this.walls);
    var GwallHitGwall=game.physics.arcade.collide(this.Gwalls, this.Gwalls);
    //pink wall collision
    var PwallHitWalls=game.physics.arcade.collide(this.Pwalls, this.walls);
    var PwallhitPwall=game.physics.arcade.collide(this.Pwalls, this.Pwalls);
    //color wall collisions
    var PwallHitGwall=game.physics.arcade.collide(this.Pwalls, this.Gwalls);

    coinText.text="coins: "+coinsCollected;

    // if a coin is in a wall, kill the coin and create a new one in its place
    function respawnCoin( coin, walls ) {
        coin.kill();
        Coin = Coins.create(Math.random()*800,Math.random()*600,'atlas', 'Coin');
        console.log('another coin was respawned');
        respawnCoin = game.physics.arcade.overlap(Coin, walls, respawnCoin, null, this);
    }

        function collectCoin(player, Coin){
            CoinPU.play();
            Coin.kill();
            coinsCollected+=1;
        }


        //if all 5 coins are collected, the player pos is reset and another guard is spawned with 5 more coins.
        if(coinsCollected==5){
            coinsCollected=0;
            player.body.x=30;
            player.body.y=300;
            addGuard();
            for(var i =0; i<5; i++){
                var Coin = Coins.create(Math.random()*800,Math.random()*600,'atlas', 'Coin');
            }
        }
        if(game.input.keyboard.justPressed(Phaser.Keyboard.G)){
            addGuard();
        }
        function addGuard(){
            guard = new Guard(game, 'atlas', 'Enemy', 1, 0, 600,600);
            console.log('new guard spawned: x ' + guard.x + ' and y: ' + guard.y);
            game.add.existing(guard);
            guards.add(guard);
        }


/*----------------------------------------------------------------------
                   Start of the Light Code
----------------------------------------------------------------------*/

    this.bitmap.context.fillStyle = 'rgb(100, 100, 100)';
    this.bitmap.context.fillRect(0, 0, this.game.width, this.game.height);

    this.setFill(player.x,player.y);
    guards.forEach(function(guard){
        this.setFill(guard.x,guard.y);
     },this);
};

PlayGround.prototype.setFill= function(x,y) {
    var points = [];
    for(var a = 0; a < Math.PI * 2; a += Math.PI/360) {
        // Create a ray from the light to a point on the circle
        var ray = new Phaser.Line(x, y,
            x + Math.cos(a) * 150, y + Math.sin(a) * 150);

        // Check if the ray intersected any walls
        var intersect = this.getWallIntersection(ray);

        // Save the intersection or the end of the ray
        if (intersect) {
            points.push(intersect);
        } else {
            points.push(ray.end);
        }
    }
    this.draw(points);

}; 

PlayGround.prototype.draw = function(points) {
    this.bitmap.context.beginPath();
    this.bitmap.context.fillStyle = 'rgb(255, 255, 255)';
    this.bitmap.context.moveTo(points[0].x, points[0].y);
    for(var i = 0; i < points.length; i++) {
        this.bitmap.context.lineTo(points[i].x, points[i].y);
    }
    this.bitmap.context.closePath();
    this.bitmap.context.fill();

    // This just tells the engine it should update the texture cache
    this.bitmap.dirty = true;
};

// Given a ray, this function iterates through all of the walls and
// returns the closest wall intersection from the start of the ray
// or null if the ray does not intersect any walls.
PlayGround.prototype.getWallIntersection = function(ray) {
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
         return closestIntersection;
     }

/*----------------------------------------------------------------------
                        End of the Light Code
----------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------
                     Start of GameOver Function
-------------------------------------------------------------------------------*/

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



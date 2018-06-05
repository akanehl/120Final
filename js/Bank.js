// Bank.js
var Bank = function(game){};
var map, Walllayer, Floorlayer;
var camera, exitArrow;
var isSign=false;
var newLevel = true;
var tutorialWallsExist = false;
var Swalls;
var level = 0;


Bank.prototype={
    preload:function(){
        console.log('Bank: preload');
        game.load.image('coin', 'assets/img/pngformat/coin.png');
        game.load.atlas('wallAtlas', 'assets/img/wallatlas.png', 'assets/img/wallatlas.json');
        game.load.atlas('atlas', 'assets/img/atlas.png', 'assets/img/atlas.json');
    },

    create:function(){
        console.log('Bank: create');
        game.stage.backgroundColor = "#4488AA";

        //Start arcade physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //Create the player object
        player = new Player(game, 'player', 1, 0, 100, 650);
        players=game.add.group();
        game.add.existing(player);
        players.add(player);

        //Create the guards group
        guards=game.add.group();
        guard = new Guard(game, 'guard', 1, 0, 650, 700);
        game.add.existing(guard);
        guards.add(guard);

        // solid walls
        Swalls = game.add.group();
        Swalls.enableBody = true;
        /*
        var Wall = Swalls.create(0, game.height-200, 'wallAtlas','shortwall');   // middle wall
        Wall.body.immovable=true;
        Wall = Swalls.create(300, game.height-200, 'wallAtlas','sidewall');
        Wall.scale.setTo(1,.3);
        Wall.body.immovable=true;
        
        Wall = Swalls.create(0, game.height-500, 'wallAtlas','shortwall');   // top left
        Wall.body.immovable=true;
        Wall.scale.setTo(1.5,1);
        Wall = Swalls.create(525, 0, 'wallAtlas','sidewall');   // middle wall
        Wall.body.immovable=true;
        Wall.scale.setTo(1,.455);
        Wall = Swalls.create(400, 0, 'wallAtlas','sidewall');   // middle wall
        Wall.body.immovable=true;
        Wall.scale.setTo(1,.455);
        Wall = Swalls.create(625, 400, 'wallAtlas','sidewall');   // middle wall
        Wall.body.immovable=true;
        Wall.scale.setTo(1,.3);
        Wall = Swalls.create(625, 400, 'wallAtlas','topwall');   // middle wall
        Wall.body.immovable=true;
        Wall = Swalls.create(625, game.height-100, 'wallAtlas','sidewall');   // middle wall
        Wall.body.immovable=true;
        Wall.scale.setTo(1,.3);
*/
        //*Evs Crap
        // top left area
        var leftMidWallPiece = Swalls.create(0, 400, 'wallAtlas','shortwall');   // left middle wall
        leftMidWallPiece.body.immovable = true;
        leftMidWallPiece.scale.setTo(.6,1);
        var rightMidWallPiece = Swalls.create(200, 400, 'wallAtlas','shortwall');   // right mid wall
        rightMidWallPiece.body.immovable = true;   
        rightMidWallPiece.scale.setTo(1.5,1);
        var LHallway = Swalls.create(300, 90, 'wallAtlas','sidewall');   // left hallway wall
        LHallway.body.immovable = true;   
        LHallway.scale.setTo(.9,.51);
        var RHallway = Swalls.create(440, -60, 'wallAtlas','sidewall');   // right hallway wall
        RHallway.body.immovable = true;   
        RHallway.scale.setTo(.8,.5);

        var rightWall = Swalls.create(180, 650, 'wallAtlas','sidewall');   // right wall in small room
        rightWall.body.immovable = true;
        rightWall.scale.setTo(.4,.3);
        var botWall = Swalls.create(110, 650, 'wallAtlas','shortwall');   // top/bot wall in small room
        botWall.body.immovable = true;
        botWall.scale.setTo(.5,.5);

        // top right room quadrant
        var leftwall = Swalls.create(710, 50, 'wallAtlas','sidewall');   // left wall
        leftwall.body.immovable = true;   
        leftwall.scale.setTo(.8,.41);
        var Botwall = Swalls.create(710, 300, 'wallAtlas','shortwall');   // bottom wall
        Botwall.body.immovable = true;   
        Botwall.scale.setTo(1.1,1);
        var block = Swalls.create(815, 170, 'wallAtlas','shortwall');   // block wall
        block.body.immovable = true;   
        block.scale.setTo(.45,1.2);

        // bottom right room quadrant
        var Topwall= Swalls.create(710, 530, 'wallAtlas','shortwall');   // top wall
        Topwall.body.immovable = true;   
        Topwall.scale.setTo(1.7,1);
        var topPiece = Swalls.create(710, 550, 'wallAtlas','sidewall');   // left top piece wall
        topPiece.body.immovable = true;   
        topPiece.scale.setTo(.3,.13);
        var botPiece = Swalls.create(710, 710, 'wallAtlas','sidewall');   // left bot piece wall
        botPiece.body.immovable = true;   
        botPiece.scale.setTo(.3,.13);
        

//>>>>>>> Stashed changes
        //adding moveable walls
        //adding Push Walls (Green)
        Gwalls = game.add.group();
        Gwalls.enableBody = true;
//<<<<<<< Updated upstream
        // top left green wall
        GreenWall = Gwalls.create(290, game.height-500,'atlas', 'GreenWall');
        GreenWall.scale.setTo(13.5,8);
        GreenWall.body.collideWorldBounds = true;
        GreenWall.body.drag.set(175);
        // bottom right green wall
        GreenWall = Gwalls.create(625, 640, 'atlas', 'GreenWall');
        GreenWall.scale.setTo(8,7.5);
//=======
        // bot left green wall
        GreenWall = Gwalls.create(10, 660,'atlas', 'GreenWall');
        GreenWall.scale.setTo(12,2);
        GreenWall.body.collideWorldBounds = true;
        GreenWall.body.drag.set(175);
        // mid left green wall
        GreenWall = Gwalls.create(440, 310, 'atlas', 'GreenWall');
        GreenWall.scale.setTo(2,11);
        GreenWall.body.collideWorldBounds = true;
        GreenWall.body.drag.set(175);
        // bottom right green wall
        GreenWall = Gwalls.create(710, 650, 'atlas', 'GreenWall');
        GreenWall.scale.setTo(2,7);
//>>>>>>> Stashed changes
        GreenWall.body.collideWorldBounds = true;
        GreenWall.body.drag.set(175);
        // top right green wall
        GreenWall = Gwalls.create(950, 330, 'atlas', 'GreenWall');
        GreenWall.scale.setTo(15,2);
        GreenWall.body.collideWorldBounds = true;
        GreenWall.body.drag.set(175);
    
        //adding pink walls
        //Sliding walls (Pink)
        Pwalls = game.add.group();
        Pwalls.enableBody = true;
        PinkWall = Pwalls.create(360, 100,'atlas', 'PinkWall');
        PinkWall.scale.setTo(10,2);
        PinkWall.body.collideWorldBounds=true;

        // Create a bitmap texture for drawing light cones
        bitmap = this.game.add.bitmapData(this.game.width, this.game.height);
        bitmap.context.fillStyle = 'rgb(255, 255, 255)';
        bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
        lightBitmap = this.game.add.image(0, 0, bitmap);
        game.physics.enable(lightBitmap);

        lightBitmap.blendMode = Phaser.blendModes.MULTIPLY;

        //adding coins
        Coins = game.add.group();
        Coins.enableBody=true;
        

        //Update Coin display text
        coinText=game.add.text(16,16,'', {fontSize: '32px', fill:'#000'});
        coinsCollected=0;
        door = game.add.sprite( 100, 400, 'door');
        game.physics.arcade.enable(door);
        door.body.immovable=true;

        Coin = Coins.create( 100,100,'coin');       // top left coin
        Coin = Coins.create( 300,660,'coin');       // bottom left coin
        Coin = Coins.create( 500,320,'coin');       // middle coin
        Coin = Coins.create( 950,40,'coin');        // top right coin
        Coin = Coins.create( 925,700,'coin');       // bottom right coin 

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
                    player.body.x=125;
                    player.body.y=125;
                    // add a guard at these coordinates
                    addGuard(300,200);
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

        
        if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
            game.state.start('Mainmenu');
        }
        if(game.input.keyboard.justPressed(Phaser.Keyboard.G)){
            addGuard(500,500);
        }
        if(game.input.keyboard.justPressed(Phaser.Keyboard.C)){
            coinsCollected+=1;
        }
    }
}
game.state.add('Bank', Bank);
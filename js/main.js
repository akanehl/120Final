/*----------------------------------------------------------
main.js
contains MainMenu and Credits Functions
// Copyright © 2014 John Watson
----------------------------------------------------------*/

// make a new game of this size
var game = new Phaser.Game(1024,800,Phaser.AUTO);

//global variables
var coinsCollected=0;
var coinText, levelText;
var scoreImage;
var Swalls;
var level = 0;
var setting='tutorial';
var state='PlayGround';
var multi=125;

// Mainmenu function
var Mainmenu = function(game){};
var map, Floorlayer;
Mainmenu.prototype ={
    preload:function(){
        game.load.atlas('atlas', 'assets/img/atlas.png', 'assets/img/atlas.json');
        game.load.atlas('decoration', 'assets/img/decoration.png', 'assets/img/decoration.json');
        game.load.tilemap('bank','assets/img/Bank.json',null, Phaser.Tilemap.TILED_JSON);

        game.load.image('tiles','assets/img/pngformat/TotalTileset.png');

        game.load.atlas('exitArrow', 'assets/img/ExitArrow.png', 'assets/img/ExitArrow.json');
        game.load.atlas('masterAtlas', 'assets/img/MasterAtlas.png', 'assets/img/MasterAtlas.json');
        game.load.atlas('guardAtlas', 'assets/img/guardWalk.png', 'assets/img/guardWalk.json')

        game.load.image('player', 'assets/img/pngformat/player.png');
        game.load.image('guard', 'assets/img/pngformat/Guard.png');
		
        // load SFX and Music
        game.load.audio('safe', 'assets/sound/Safe.mp3');
        game.load.audio('alert', 'assets/sound/Alert.mp3');
        game.load.audio('coinPU', 'assets/sound/CoinPickUp.mp3');
        game.load.audio('level1', 'assets/sound/Level1.mp3');
        game.load.audio('level2', 'assets/sound/Level2.mp3');
        game.load.audio('rewind', 'assets/sound/Rewind.mp3');

        //game.load.spritesheet('player', 'assets/img/thiefSpriteSheet.png', 32, 32);
    },
    create:function(){

        // Mainmenu Background Sprite
        var MMBG = game.add.sprite( 0,0, 'decoration', 'mainmenubg');

        // allow the player to move up and down the menu select
        move=true;

        //create sprites that run around in the background
        fakePlayer=game.add.sprite( 200, 500, 'player');
        fakeGuard=game.add.sprite(420,520, 'guard');
        game.physics.arcade.enable(fakeGuard);
        game.physics.arcade.enable(fakePlayer);
        fakePlayer.anchor.setTo(.5,.5);
        MenuDoor=game.add.sprite(120,680, 'masterAtlas','door');
        game.physics.arcade.enable(MenuDoor);

        // selected variable that activates when the user presses space on an option, select 1 or select 2
        selected=0;
        // add the coin sprite as the cursor select and enable physics on it
		Coin=game.add.sprite(250, 510,'masterAtlas','coin');
        game.physics.arcade.enable(Coin);

        // texts and fonts
		textStyle = {
            font: 'Bungee Outline',
            fontSize:100,
        };
        textStyle2 = {
            font: 'Bungee Shade',
            fontSize:150,
            wordWrap: true,
        };
        style = {
             font: "25px Sarpanch", 
             fill: "#ffffff", // white
             align: "center" 
        };
        style2 = {
             font: "35px Sarpanch", 
             fill: "#000000", // black
             align: "center" 
        };

        // Play text
        PlayText=game.add.text(300, 507, 'PLAY', style2);
        // Credits text
        CreditsText=game.add.text(300,577, 'CREDITS', style2);
        // TitleScreen text
        titleText=game.add.text(game.world.centerX ,game.world.centerY - 200,'COIN THIEF', textStyle2);
        titleText.anchor.set(0.5,0.5);

        // permanently display controls
        var arrowKeys = game.add.sprite( game.world.centerX +270, game.world.centerY+100, 'decoration', 'keyboardkeys');
        arrowKeys.anchor.set(0.5,0.5);
        var QtoQuit = game.add.sprite( game.world.centerX+270, game.world.centerY+280, 'decoration', 'Qkey');
        QtoQuit.anchor.set(0.5,0.5);
        // add text
        var pressSpace = game.add.text(arrowKeys.x, arrowKeys.y + 80,'Use the ARROW KEYS to move!',style);
        pressSpace.anchor.set(0.5,0.5);
        var pressQ = game.add.text(QtoQuit.x, QtoQuit.y + 80,'Press Q Anytime to Quit',style);
        pressQ.anchor.set(0.5,0.5);
        pressSpace = game.add.text(pressQ.x - 410, pressQ.y,'Press SPACEBAR to continue',style);
        pressSpace.anchor.set(0.5,0.5);
    },

    update:function(){
        // allow the fakeplayer to collide with the coin
        coinCollide=game.physics.arcade.collide(fakePlayer, Coin);
        // allow the fakeplayer to collide with the menudoor/ fake door
        playerExitDoor=game.physics.arcade.collide(fakePlayer, MenuDoor);

        // if the player can move around the menu select
        if(move){
            // if the up key is read
        	if(game.input.keyboard.justPressed(Phaser.Keyboard.UP)){
                // and if they are not at the top option (PLAY)
                if(selected>0){
                	selected--;
                    // move the coin/cursor up
                	Coin.y-=70;
                }
            }
        }
        // if the player can move around the menu select
        if(move){
            // if the down key is read
            if(game.input.keyboard.justPressed(Phaser.Keyboard.DOWN)){
                // and if they are not at the bottom option (CREDITS)
                if(selected<1){
                	selected++;
                    // move the coin/cursor down
                	Coin.y+=70;
                }
            }
        }
        // if the player can move around the menu select
        if(move){
            // if the space key is read
            if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)){
                // if the player selected the first option (PLAY)
                if(selected==0){
                    // set move to false so the coin cursor cannot move
                    move=false;
                    // create a line from the fakePlayer's x and y to the coin's/cursor's x and y coordinates
                    line=new Phaser.Line(fakePlayer.body.x,fakePlayer.body.y,Coin.body.x,Coin.body.y);
                    //Update the fakePlayers angle to the line
                    fakePlayer.angle=(line.angle/Math.PI)*180;
                    fakePlayer.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(fakePlayer.angle, 130));

                // if the player selected the second option (CREDITS)
                }else if(selected==1){
                    // move to the credits screen
                    game.state.start('Credits');
                } // end of credits option
            }
        } // end of the spacebar/select

        // if the coinCollide variable is activated
        if(coinCollide){
            // kill the  oin sprite
            Coin.kill();
            // display the exitarrow animation over the menudoor
            exitArrow = game.add.sprite( MenuDoor.body.x+1, MenuDoor.body.y - 100, 'exitArrow');
            var arrow = exitArrow.animations.add('arrow');
            exitArrow.animations.play('arrow', 1, true);
            // create a new line from the fakePlayer's x and y to the menudoor's x and y coordinates
            line1=new Phaser.Line(fakePlayer.body.x,fakePlayer.body.y,MenuDoor.x,MenuDoor.y);
            //Update the fakePlayers angle to the line
            fakePlayer.angle=(line1.angle/Math.PI)*180;
            fakePlayer.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(fakePlayer.angle, 130));
        }
        //  if the player collides with the door start the tutorial/PlayGround level
        if(playerExitDoor){
            game.state.start('PlayGround');
        }
    }// end of update
}// end of mainmenu

// credits!
var Credits = function(game) {};
Credits.prototype={
	preload:function(){
		console.log('Credits: preload');
	},
	create:function(){
		console.log('Credits: create');
        // change the BG color
		game.stage.backgroundColor = "#4488AA";
        // Some text
        pressSpace = game.add.text(600,450,'we will add some crap',style);
	},
	update:function(){
        // if spacebar is pressed return back to mainmenu
        if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)){
            game.state.start('Mainmenu');
        }
        // allow the player to move the cursor/ coin again
		move = true;
	},
} // end of credits

// Gameover
var GameOver = function(game){};
GameOver.prototype={
    preload:function(){
    },
    create:function(){

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

game.state.add('Credits', Credits);

game.state.add('GameOver', GameOver);

game.state.start('Mainmenu');


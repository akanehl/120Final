/* Version Notes:
Guard Wanders
Tiled BG implemented but no wall collision
Light ray bug fixed
// Copyright © 2014 John Watson
*/


var game = new Phaser.Game(1024,800,Phaser.AUTO);
var coinsCollected=0;
var coinText;
var scoreImage;
var Swalls;
var level = 0;
var setting='tutorial';
var state='PlayGround';
var multi=125;

var Mainmenu = function(game){};
var map, Floorlayer;
Mainmenu.prototype ={
    preload:function(){
        console.log('Mainmenu: preload');
        game.load.atlas('atlas', 'assets/img/atlas.png', 'assets/img/atlas.json');
		game.load.image('Wall', 'assets/img/pngformat/Walls/topwall.png');
        game.load.tilemap('bank','assets/img/Bank.json',null, Phaser.Tilemap.TILED_JSON);
        game.load.image('floor', 'assets/img/pngformat/floor.png');
        game.load.image('tiles','assets/img/pngformat/TotalTileset.png');

        game.load.image('door', 'assets/img/pngformat/door.png');
        game.load.atlas('exitArrow', 'assets/img/ExitArrow.png', 'assets/img/ExitArrow.json');
        game.load.atlas('masterAtlas', 'assets/img/MasterAtlas.png', 'assets/img/MasterAtlas.json');

        game.load.image('player', 'assets/img/pngformat/player.png');
        game.load.image('guard', 'assets/img/pngformat/Guard.png');

        game.load.image('emptybag', 'assets/img/moneybagempty.png');
        game.load.image('fullbag', 'assets/img/moneybagfull.png');
		
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
        fakePlayer=game.add.sprite( 200, 500, 'player');
        fakeGuard=game.add.sprite(400,300, 'guard');
        game.physics.arcade.enable(fakeGuard);
        game.physics.arcade.enable(fakePlayer);
        fakePlayer.anchor.setTo(.5,.5);
        MenuDoor=game.add.sprite(200,700, 'door');
        game.physics.arcade.enable(MenuDoor);



        selected=0;
		Coin=game.add.sprite(250, 480,'masterAtlas','coin');
        game.physics.arcade.enable(Coin);

		textStyle = {
            font: 'Bungee Outline',
            fontSize:100,
        };
        textStyle2 = {
            font: 'Bungee Shade',
            fontSize:150,
            wordWrap: true,
        };
        textStyle3 = {
            font: 'Sarpanch',
            fontSize:100,
        };
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
        //GameName=game.add.text(325, 110, 'Coin Thief',GameNameStyle);
        PlayText=game.add.text(300, 470, 'Play',MenuStyle);
        CreditsText=game.add.text(300,530, 'Credits', MenuStyle);
        //Controls =game.add.text(300,530, 'Controls', MenuStyle);
		controlsText= game.add.text(300,590, 'Controls\nArrow Keys to move things \nSpacebar to do things', ControlsStyle);
        //text=game.add.text(325,110,'COIN THIEF', textStyle);
        text2=game.add.text(200,70,'COIN THIEF', textStyle2);
        text3=game.add.text(400,800,'COIN THIEF', textStyle3);
		
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

                    //game.state.start('PlayGround');

                    move=false;
                    line=new Phaser.Line(fakePlayer.body.x,fakePlayer.body.y,Coin.body.x,Coin.body.y);
                    //Update the fakePlayers angle to the line
                    fakePlayer.angle=(line.angle/Math.PI)*180;
                    fakePlayer.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(fakePlayer.angle, 130));
                    

                	//game.state.start('PlayGround');
                }else if(selected==1){
                	console.log('credits');
                	game.state.start('Credits');
                }else if(selected==2){
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

var Credits = function(game) {};
Credits.prototype={
	preload:function(){
		console.log('Credits: preload');
	},
	create:function(){
		console.log('Credits: create');
		game.stage.backgroundColor = "#4488AA";
	},
	update:function(){
		
	},


} // end of credits

// turn this into a control option
var Tutorial = function(game) {};
Tutorial.prototype={
	preload:function(){
		console.log('Tutorial: preload');
		game.load.image('keys', 'assets/img/keyboardkeys.png');
		game.load.image('Qkey', 'assets/img/Qkey.png');

	},
	create:function(){
		console.log('Tutorial: create');

		game.stage.backgroundColor = "#000000";
		var style = { font: "30px Arial", fill: "#ffffff", align: "center" };
		var pressSpace = game.add.text(200,70,'hi',style);
		pressSpace.addColor('#ffffff',16);

		arrowKeys = game.add.sprite( game.world.centerX-300,game.world.centerY+100, 'keys');
		pressSpace = game.add.text(game.world.centerX-425,game.world.centerY+200,'Use the ARROW KEYS to move!',style);
		QtoQuit = game.add.sprite( game.world.centerX-300, 400, 'Qkey');
		pressSpace = game.add.text(600,450,'Press Q Anytime to Quit and return to the Main Menu',style);
	},
	update:function(){
		// press space to start the game!
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
        	game.state.start('PlayGround');
        }
	},


} // end of Tutorial

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
game.state.add('Tutorial', Tutorial);
game.state.add('Credits', Credits);

game.state.add('GameOver', GameOver);

game.state.start('Mainmenu');


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
        game.load.image('MainmenuBG', 'assets/img/mainmenubg.png');

        game.load.image('door', 'assets/img/pngformat/door.png');
        game.load.atlas('exitArrow', 'assets/img/ExitArrow.png', 'assets/img/ExitArrow.json');
        game.load.atlas('masterAtlas', 'assets/img/MasterAtlas.png', 'assets/img/MasterAtlas.json');

        game.load.image('player', 'assets/img/pngformat/player.png');
        game.load.image('guard', 'assets/img/pngformat/Guard.png');

        game.load.image('emptybag', 'assets/img/moneybagempty.png');
        game.load.image('fullbag', 'assets/img/moneybagfull.png');
        game.load.image('keys', 'assets/img/keyboardkeys.png');
        game.load.image('Qkey', 'assets/img/Qkey.png');
		
        game.load.audio('safe', 'assets/sound/Safe.mp3');
        game.load.audio('alert', 'assets/sound/Alert.mp3');
        game.load.audio('coinPU', 'assets/sound/CoinPickUp.mp3');
        game.load.audio('level1', 'assets/sound/Level1.mp3');
        game.load.audio('level2', 'assets/sound/Level2.mp3');
        game.load.audio('rewind', 'assets/sound/Rewind.mp3');

        //game.load.spritesheet('player', 'assets/img/thiefSpriteSheet.png', 32, 32);
    },
    create:function(){
        console.log('Mainmenu: create');
        var MMBG = game.add.sprite( 0,0, 'MainmenuBG');

        move=true;

        //create sprites that run around in the background
        fakePlayer=game.add.sprite( 200, 500, 'player');
        fakeGuard=game.add.sprite(420,520, 'guard');
        game.physics.arcade.enable(fakeGuard);
        game.physics.arcade.enable(fakePlayer);
        fakePlayer.anchor.setTo(.5,.5);
        MenuDoor=game.add.sprite(120,680, 'door');
        game.physics.arcade.enable(MenuDoor);



        selected=0;
		Coin=game.add.sprite(250, 510,'masterAtlas','coin');
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

        style = {
             font: "25px Sarpanch", 
             fill: "#ffffff", 
             align: "center" 
        };

        style2 = {
             font: "35px Sarpanch", 
             fill: "#000000", 
             align: "center" 
        };

        /*
        // three options
        PlayText=game.add.text(300, 470, 'Play',MenuStyle);
        //Controls =game.add.text(300,530, 'Controls', MenuStyle);
        CreditsText=game.add.text(300,590, 'Credits', MenuStyle);
    */

        // only 2 options
        PlayText=game.add.text(300, 507, 'PLAY', style2);
        CreditsText=game.add.text(300,577, 'CREDITS', style2);

        text2=game.add.text(game.world.centerX ,game.world.centerY - 200,'COIN THIEF', textStyle2);
        text2.anchor.set(0.5,0.5);

        // permanently display controls
        var arrowKeys = game.add.sprite( game.world.centerX +270, game.world.centerY+100, 'keys');
        arrowKeys.anchor.set(0.5,0.5);
        var QtoQuit = game.add.sprite( game.world.centerX+270, game.world.centerY+280, 'Qkey');
        QtoQuit.anchor.set(0.5,0.5);
        // add text
        var pressSpace = game.add.text(arrowKeys.x, arrowKeys.y + 80,'Use the ARROW KEYS to move!',style);
        pressSpace.anchor.set(0.5,0.5);
        var pressQ = game.add.text(QtoQuit.x, QtoQuit.y + 80,'Press Q Anytime to Quit',style);
        pressQ.anchor.set(0.5,0.5);
        pressSpace = game.add.text(pressQ.x - 410, pressQ.y,'Press SPACEBAR to select',style);
        pressSpace.anchor.set(0.5,0.5);
    },
    update:function(){
        coinCollide=game.physics.arcade.collide(fakePlayer, Coin);
        playerExitDoor=game.physics.arcade.collide(fakePlayer, MenuDoor);
        if(move){
        	if(game.input.keyboard.justPressed(Phaser.Keyboard.UP)){
                if(selected>0){
                	selected--;
                    // OG -60, if 3 options
                	Coin.y-=70;   //OG -60

                }
            }
        }
        if(move){
            if(game.input.keyboard.justPressed(Phaser.Keyboard.DOWN)){
                if(selected<1){
                	selected++;
                	Coin.y+=70;
                }/* if three options
                if(selected<2){
                    selected++;
                    Coin.y+=60
                }*/
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

                }else if(selected==1){
                    
                    game.state.start('Credits');

                    /*
                    // permanently display controls
                    var arrowKeys = game.add.sprite( game.world.centerX +230, game.world.centerY+100, 'keys');
                    arrowKeys.anchor.set(0.5,0.5);
                    var QtoQuit = game.add.sprite( game.world.centerX+230, game.world.centerY+280, 'Qkey');
                    QtoQuit.anchor.set(0.5,0.5);
                    // add text
                    var pressSpace = game.add.text(arrowKeys.x, arrowKeys.y + 80,'Use the ARROW KEYS to move!',style);
                    pressSpace.anchor.set(0.5,0.5);
                    pressSpace = game.add.text(QtoQuit.x, QtoQuit.y + 80,'Press Q Anytime to Quit',style);
                    pressSpace.anchor.set(0.5,0.5);
                    */

                /*}else if(selected==2){
                    move = false;
                    game.state.start('Credits');*/
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
        pressSpace = game.add.text(600,450,'we will add some crap',style);
	},
	update:function(){
        if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)){
            game.state.start('Mainmenu');
        }
		move = true;
	},


} // end of credits

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
//game.state.add('Tutorial', Tutorial);
game.state.add('Credits', Credits);

game.state.add('GameOver', GameOver);

game.state.start('Mainmenu');


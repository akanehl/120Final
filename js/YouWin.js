
var YouWin = function(game){};
YouWin.prototype={
    preload:function(){
		
	},
    create:function(){
		setting='YouWin';
		
		Style={
            font:'Character',
            fontSize:75,
        };
		
		

        game.add.tileSprite(0,0,game.width,game.height,'floor');
		
		Swalls = game.add.group();
        Swalls.enableBody = true;

		
		guards=game.add.group();
        guard = new DumbGuard(game, 'guard', 1, 0, 200, 650, [Math.random()*800+100,Math.random()*600+100,Math.random()*800+100,Math.random()*650+100,Math.random()*800+100,Math.random()*650+100,Math.random()*800+100,Math.random()*650+100]);
        game.add.existing(guard);
        guards.add(guard);
		guard = new DumbGuard(game, 'guard', 1, 0, 800, 175, [Math.random()*800+100,Math.random()*650+100,Math.random()*800+100,Math.random()*650+100,Math.random()*800+100,Math.random()*650+100,Math.random()*800+100,Math.random()*650+100]);
        game.add.existing(guard);
        guards.add(guard);
		guard = new DumbGuard(game, 'guard', 1, 0, 200, 175, [Math.random()*800+100,Math.random()*650+100,Math.random()*800+100,Math.random()*650+100,Math.random()*800+100,Math.random()*650+100,Math.random()*800+100,Math.random()*650+100]);
        game.add.existing(guard);
        guards.add(guard);
		bitmap = this.game.add.bitmapData(this.game.width, this.game.height);
		
		//light enabled after walls spawned in so the walls are not lit up
        bitmap.context.fillStyle = 'rgb(255, 255, 255)';
        bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
        lightBitmap = this.game.add.image(0, 0, bitmap);
        game.physics.enable(lightBitmap);
        lightBitmap.blendMode = Phaser.blendModes.MULTIPLY;
		
		player = new Player(game, 'player', 1, 0, 500, 400);
        players=game.add.group();
        game.add.existing(player);
        players.add(player);
		game.add.text(300,300,'You win',Style);
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

        var hitWalls = game.physics.arcade.overlap(player, Walllayer);
        
        var Pexit = game.physics.arcade.collide(player, door);
	}
}
game.state.add('YouWin', YouWin);
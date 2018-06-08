var YouWin = function(game){};
YouWin.prototype={
    preload:function(){
		
	},
    create:function(){
		player = new Player(game, 'player', 1, 0, 500, 400);
        players=game.add.group();
        game.add.existing(player);
        players.add(player);
		
		guards=game.add.group();
        guard = new DumbGuard(game, 'guard', 1, 0, 200, 650, [800,650,800,175,200,175,200,650]);
        game.add.existing(guard);
        guards.add(guard);
		Style={
            font:'Character',
            fontSize:75,
        };
		game.add.text(300,300,'You win',Style);
	},
	update:function(){
		guards.forEach(function(guard){
			guard.chase=false;
		});
		
	}
}
game.state.add('YouWin', YouWin);
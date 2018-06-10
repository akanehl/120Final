function Player(game, key, atlas, scale, rotation, x, y){
    //Set up the Sprite call
	Phaser.Sprite.call(this, game, x, y, atlas, key);

    //Set some player properties
	this.anchor.set(0.5,0.5);
	this.scale.x = scale;
	this.scale.y = scale;
	this.rotation = rotation;
    //x and y pos are for checking if the player has moved and to stop the animation if needed
    this.xpos=0;
    this.ypos=0;
    //create animation for walking
    this.animations.add('walk', Phaser.Animation.generateFrameNames('playerWalk',1,8,'',2),6,true);
    //enable physics
	game.physics.enable(this);
	this.body.collideWorldBounds = true;
    this.body.allowRotation = true;
}
//Override constructor methods
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

//Override the update function for player to have the movement keys
Player.prototype.update=function() {
	
	//player controls
	cursors = game.input.keyboard.createCursorKeys();
    player.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(player.angle, 0));
        //the controls change the player sprite's angle and apply a forward velocity
        if(cursors.left.isDown){
        player.angle=180;
        player.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(player.angle, 125));
        player.animations.play('walk');
        }
        if(cursors.right.isDown){
            player.angle=0;
        player.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(player.angle, 125));
        player.animations.play('walk');
        }
        if(cursors.up.isDown){
            player.angle=-90;
        player.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(player.angle, 125));
        player.animations.play('walk');
        }
        if(cursors.down.isDown){
            player.angle=90;
        player.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(player.angle, 125));
        player.animations.play('walk');
        }
        //diagonal movements
        if(cursors.down.isDown&&cursors.left.isDown){
            player.angle=135;
        player.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(player.angle, 125));
        player.animations.play('walk');
        }
        if(cursors.down.isDown&&cursors.right.isDown){
            player.angle=45;
        player.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(player.angle, 125));
        player.animations.play('walk');
        }
        if(cursors.up.isDown&&cursors.right.isDown){
            player.angle=-45;
        player.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(player.angle, 125));
        player.animations.play('walk');
        }
        if(cursors.up.isDown&&cursors.left.isDown){
            player.angle=-135;
        player.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(player.angle, 125));
        player.animations.play('walk');
        }
        //check if the player is moveing from its current position and if they havent, stop the movement animation
        //it is done this way because of the velocityFromAngle() function.
        if(player.xpos==player.body.x&&player.ypos==player.body.y){
            player.animations.stop('walk');
        }else{
            player.xpos=player.body.x;
            player.ypos=player.body.y;
        }
}
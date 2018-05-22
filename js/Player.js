function Player(game, key, frame, scale, rotation){
    //Set up the Sprite call
	Phaser.Sprite.call(this, game, 30, 300, key, frame);

    //Set some player properties
	this.anchor.set(0.5,0.5);
	this.scale.x = scale;
	this.scale.y = scale;
	this.rotation = rotation;

	game.physics.enable(this);
	this.body.collideWorldBounds = true;
    this.body.allowRotation = true;
}
//Override constructor methods
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

//Override the update function for player to have the movement keys
Player.prototype.update=function() {
	cursors = game.input.keyboard.createCursorKeys();
    player.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(player.angle, 0));

        if(cursors.left.isDown){
            player.angle=180;
        player.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(player.angle, 125));
        }
        if(cursors.right.isDown){
            player.angle=0;
        player.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(player.angle, 125));
        }
        if(cursors.up.isDown){
            player.angle=-90;
        player.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(player.angle, 125));
        }
        if(cursors.down.isDown){
            player.angle=90;
        player.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(player.angle, 125));
        }

        if(cursors.down.isDown&&cursors.left.isDown){
            player.angle=135;
        player.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(player.angle, 125));
        }
        if(cursors.down.isDown&&cursors.right.isDown){
            player.angle=45;
        player.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(player.angle, 125));
        }
        if(cursors.up.isDown&&cursors.right.isDown){
            player.angle=-45;
        player.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(player.angle, 125));
        }
        if(cursors.up.isDown&&cursors.left.isDown){
            player.angle=-135;
        player.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(player.angle, 125));
        }
}
function Player(game, key, frame, scale, rotation){
	Phaser.Sprite.call(this, game, 30, 30, key, frame);

	this.anchor.set(0,0);
	this.scale.x = scale;
	this.scale.y = scale;
	this.rotation = rotation;

	game.physics.enable(this);
	this.body.collideWorldBounds = true;
}
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update=function() {
	cursors = game.input.keyboard.createCursorKeys();
        player.body.velocity.x=0;
        player.body.velocity.y=0;
        if(cursors.left.isDown){
            player.body.velocity.x= -125;
        }
        if(cursors.right.isDown){
            player.body.velocity.x= 125;
        }
        if(cursors.up.isDown){
            player.body.velocity.y= -125;
        }
        if(cursors.down.isDown){
            player.body.velocity.y= 125;
        }
}
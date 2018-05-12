 function Guard(game, key, frame, scale, rotation){
	Phaser.Sprite.call(this, game, 300, 400, key, frame);

	this.anchor.set(0.5, 0.5);
	this.scale.x = scale;
	this.scale.y = scale;
	this.angle=Math.random()*30;
	

	game.physics.enable(this);
	this.body.collideWorldBounds = true;
	this.body.allowRotation=true;
}
Guard.prototype = Object.create(Phaser.Sprite.prototype);
Guard.prototype.constructor = Guard;

Guard.prototype.update=function() {
	var GhitWalls=game.physics.arcade.collide(guard, walls);
	var GhitPlayer=game.physics.arcade.collide(guard, player);
	var GhitGwalls=game.physics.arcade.collide(guard, Gwalls);
	var GhitPwalls=game.physics.arcade.collide(guard, Pwalls);
	if(GhitPlayer){
		game.state.start('GameOver');
	}
	if(chase==true){
		line=new Phaser.Line(guard.body.x,guard.body.y,player.body.x,player.body.y);
		guard.angle=(line.angle/Math.PI)*180;
		console.log(guard.angle);

		guard.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(guard.angle, 135));
	}else{
		guard.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(guard.angle, 60));

        
			if(guard.body.x>700){
				if(Math.abs(guard.angle-(-90))<Math.abs(guard.angle-(90))){
					guard.body.angularVelocity=-60;
				}
				else if(Math.abs(guard.angle-(-90))>Math.abs(guard.angle-(90))){
					guard.body.angularVelocity=60;
				}
				else{
					guard.body.angularVelocity=0;
				}
			}else if(guard.body.x<100){
				if(Math.abs(guard.angle-(-90))<Math.abs(guard.angle-(90))){
					guard.body.angularVelocity=60;
				}
				else if(Math.abs(guard.angle-(-90))>Math.abs(guard.angle-(90))){
					guard.body.angularVelocity=-60;
				}
				else{
					guard.body.angularVelocity=0;
				}
			}else if(guard.body.y>500){
				if(Math.abs(guard.angle-(180))<Math.abs(guard.angle-(0))){
					guard.body.angularVelocity=60;
				}
				else if(Math.abs(guard.angle-(180))>Math.abs(guard.angle-(0))){
					guard.body.angularVelocity=-60;
				}
				else{
					guard.body.angularVelocity=0;
				}
			}else if(guard.body.y<100&&guard.body.x>100){
				if(Math.abs(guard.angle-(-180))<Math.abs(guard.angle-(0))){
					guard.body.angularVelocity=-60;
				}
				else if(Math.abs(guard.angle-(-180))>Math.abs(guard.angle-(0))){
					guard.body.angularVelocity=60;
				}
				else if(guard.body.angle==180||-180)
				{
					guard.angle=90;
				}else{
					guard.body.angularVelocity=0;
				}
			}else if(GhitWalls){
				guard.body.angularVelocity=100;
			}else{
				guard.body.angularVelocity=0;
			}
	}
}


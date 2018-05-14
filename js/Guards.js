 function Guard(game, key, frame, scale, rotation){
 	//Set up the sprite call for the guard
	Phaser.Sprite.call(this, game, 300, 400, key, frame);

	//Set up basic guard stats
	this.anchor.set(0.5, 0.5);
	this.scale.x = scale;
	this.scale.y = scale;
	this.angle=Math.random()*30;
	this.chase=false;
	this.alert=false;
	this.safe=false;
	

	game.physics.enable(this);
	this.body.collideWorldBounds = true;
	this.body.allowRotation=true;
}

//Override the guard constructor
Guard.prototype = Object.create(Phaser.Sprite.prototype);
Guard.prototype.constructor = Guard;

//Override the update function for guard
Guard.prototype.update=function() {
	guards.forEach(function(guard){
	//Collision booleans for AI 
	var GhitWalls=game.physics.arcade.collide(guard, walls);
	var GhitPlayer=game.physics.arcade.collide(guard, player);
	var GhitGwalls=game.physics.arcade.collide(guard, Gwalls);
	var GhitPwalls=game.physics.arcade.collide(guard, Pwalls);

	if(GhitPlayer){
		//End game upon guard collision with player
		game.state.start('GameOver');
	}
	//Guard Chase AI
        guards.forEach(function(guard){
        	var LoS= new Phaser.Line(guard.x, guard.y, player.x, player.y);
        	var LoSInter = getWallIntersection(LoS);
        	if(LoSInter){
        		guard.chase=false;
        		if(guard.safe==false){
        			guard.safe=true;
        			guard.alert=false;
        			Safe.play();
        			console.log('safe');
        		}
        	}else if(LoS.length<=127){
        		guard.chase=true;
        		if(guard.alert==false){
        			guard.alert=true;
        			guard.safe=false;
        			Alert.play();
        			console.log('alert');
        		}
        	}
        }, this);
	//AI for guard chase
	if(guard.chase==true){
		//Draw line between the guard and the player every frame
		line=new Phaser.Line(guard.body.x,guard.body.y,player.body.x,player.body.y);
		//Update the guards angle to the line
		guard.angle=(line.angle/Math.PI)*180;

		//Update the velocity of the guard
		guard.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(guard.angle, 130));
	}
	//Guard is idle
	else{
		//Standard velocity
		guard.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(guard.angle, 60));

			/* Guard AI: 
				If (Guard is approaching a wall) {
					Determine which angle is smaller (Guard and wall)
					Update angle to move away from wall. 
				}
				NOTE: Following are several cases that adjust based on which wall it is checking.*/
				 
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
			if(GhitWalls){
				guard.body.angularVelocity+=30;
			}
	}
}, this);
}


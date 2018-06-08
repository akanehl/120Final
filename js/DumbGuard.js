function DumbGuard(game, key, scale, rotation, x, y, points){
 	//Set up the sprite call for the guard
	Phaser.Sprite.call(this, game, x, y, key, points);

	//Set up basic guard stats
	this.anchor.set(0.5, 0.5);
	this.scale.x = scale;
	this.scale.y = scale;
	this.angle=0;
	this.chase=false;
	this.alert=false;
	this.safe=false;
	this.points=points;
	this.pointRef=0;
	
	
	game.physics.enable(this);
	this.body.collideWorldBounds = true;
	this.body.allowRotation=true;
}
	DumbGuard.prototype = Object.create(Phaser.Sprite.prototype);
	DumbGuard.prototype.constructor = DumbGuard;
	DumbGuard.prototype.update=function() {
		var DGhitWalls=game.physics.arcade.collide(guards, Walllayer);
		var DGhitPlayer=game.physics.arcade.collide(guards, player);
		var DGhitGwalls=game.physics.arcade.collide(guards, Gwalls);
		var DGhitPwalls=game.physics.arcade.collide(guards, Pwalls);
		var DGhitSwalls=game.physics.arcade.collide(guards, Swalls);
		guards.forEach(function(guard){
		

//Guard Chase AI
        	var LoS= new Phaser.Line(guard.x, guard.y, player.x, player.y);
        	var LoSInter = getWallIntersection(LoS);
        	if(LoSInter||LoS.length>127){
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
	//AI for guard chase
	if(guard.chase==true){
		//Draw line between the guard and the player every frame
		line=new Phaser.Line(guard.body.x,guard.body.y,player.body.x,player.body.y);
		//Update the guards angle to the line
		guard.angle=(line.angle/Math.PI)*180;

		//Update the velocity of the guard
		guard.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(guard.angle, 130));
	}else{
		//follow points
		var pathLine=new Phaser.Line(guard.body.x,guard.body.y,guard.points[guard.pointRef],guard.points[guard.pointRef+1]);
			guard.angle=(pathLine.angle/Math.PI)*180;
			guard.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(guard.angle, 60));

		if(Math.floor(guard.body.x)<guard.points[guard.pointRef]+5&&Math.floor(guard.body.x)>guard.points[guard.pointRef]-5){
			if(Math.floor(guard.body.y)<guard.points[guard.pointRef+1]+5&&Math.floor(guard.body.y)>guard.points[guard.pointRef+1]-5){
				guard.pointRef+=2;
				if(guard.pointRef==guard.points.length){
					guard.pointRef=0;
				}
			console.log('here');
			}
		}
	}
});
	if(DGhitPlayer){
		// kill all coins
		//Coins.callAll('kill');
		// stop the music
		Level1.stop();
		Level2.stop();
		/*
		if(level<0){
			level-=1;
		}*/

        // kill the arrow exit
		if(exitArrow){
            exitArrow.kill();
		}
            // set isSign to false
            isSign=false;
            // play rewind sound
            Rewind.play();
            // stop level1 music
            Level1.stop();
            // play level2 music
            Level2.play();
            // set new player coordinates
            player.body.x=75;
            player.body.y=300;
		//End game upon guard collision with player
		//game.state.start('GameOver');
		//coinsCollected = 0;
		newLevel = true;

		if(level == 0) {
			player.body.x = 100;
			player.body.y = 400;
		}
		// if the player loses on level 1 or 2 or 3, reset them to 1
		if( level == 1 || level == 2 || level == 3 ) {
			game.state.start(state);
			level = 1;
		}
	}
	guards.forEach(function(guard){
	setFill(guard.x,guard.y);
});
	}
	function setFill(x,y){
            var points=[];
			if (setting=='bank'){
				multi=200;
			}else if(setting=='museum'){
				multi=150;
			}else{
				multi=125;
			}
            for(var a = 0; a < Math.PI*2; a += Math.PI/360) {
                // Create a ray from the light to a point on the circle
                var ray = new Phaser.Line(x, y, x+Math.cos(a)*multi, y+Math.sin(a)*multi);

                // Check if the ray intersected any walls
                var intersect = getWallIntersection(ray);

                // Save the intersection or the end of the ray
                if (intersect) {
                    points.push(intersect);
                } else {
                    points.push(ray.end);
                }
            }
            draw(points);
        }
		function draw(points){
                bitmap.context.beginPath();
                bitmap.context.fillStyle = 'rgb(255, 255, 255)';


                for(var i = 0; i < points.length-1; i++) {
                    bitmap.context.lineTo(points[i].x, points[i].y);
                }
                bitmap.context.closePath();
                bitmap.context.fill();

                // This just tells the engine it should update the texture cache
                bitmap.dirty = true;
        }
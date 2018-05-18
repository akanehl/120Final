 function Guard(game, key, frame, scale, rotation){
 	//Set up the sprite call for the guard
	Phaser.Sprite.call(this, game, 500, 50, key, frame);

	//Set up basic guard stats
	this.anchor.set(0.5, 0.5);
	this.scale.x = scale;
	this.scale.y = scale;
	this.angle=0;
	
	this.hitWalls;
	this.hitPlayer;
	this.hitGwalls;
	this.hitPwalls;
	
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
Guard.prototype.update=function(game) {
	guards.forEach(function(guard){
	//Collision booleans for AI 
	guard.hitWalls=game.physics.arcade.collide(guards, walls);
	guard.hitPlayer=game.physics.arcade.collide(guard, player);
	guard.hitGwalls=game.physics.arcade.collide(guard, Gwalls);
	guard.hitPwalls=game.physics.arcade.collide(guard, Pwalls);
	game.physics.arcade.collide(guards);

	if(guard.hitPlayer){
		//End game upon guard collision with player
		game.state.start('GameOver');
	}
	//Check if guard should start chasing player
        guards.forEach(function(guard){
        //draw a line from the guard to the player
        	var LoS= new Phaser.Line(guard.x, guard.y, player.body.x, player.body.y);
        	//check if there are any walls in between the guard and player
        	var LoSInter = this.getWallIntersection(LoS);
        	//if there is a wall
        	if(LoSInter){
        	//guard is not chasing
        		guard.chase=false;
        		//if the safe sound was not played
        		if(guard.safe==false){
        		//play the sound and say the sound was played
        			guard.safe=true;
        			guard.alert=false;
        			Safe.play();
        			console.log('safe');
        		}
        		//if the player is not out of the guard's circle of perception
        	}else if(LoS.length<=127){
        	//chase the player
        		guard.chase=true;
        		//if the alert sound has not been played
        		if(guard.alert==false){
        		//play the sound and say that its been played
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
		if(line.length>125){
			guard.chase=false;
		}else{
			guard.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(guard.angle, 130));
		}
	}
	/* Guard AI: 
				If (Guard is approaching a wall) {
					Determine which angle is smaller (to turn left or right)
					Update angle to move away from wall. 
				}
				NOTE: Following are several cases that adjust based on which wall it is checking.*/

	else{
		//Standard velocity
		guard.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(guard.angle, 60));

		//Check Right Side
		if(guard.body.x>game.width-100){
			if(guard.angle<0){
				guard.body.angularVelocity=-60;
			}else{
				guard.body.angularVelocity=60;
			}
		}//Check Left Side
		else if(guard.body.x<100){
			if(guard.angle<180){
				guard.body.angularVelocity=-60;
			}else{
				guard.body.angularVelocity=60;
			}
		}//Check Bottom
		else if(guard.body.y>game.height-100){
			if(guard.angle>90||guard.angle<-90){
				guard.body.angularVelocity=60;
			}else{
				guard.body.angularVelocity=-60;
			}
		}//Check Top
		else if(guard.body.y<100){
			if(guard.angle>-90||guard.angle<90){
				guard.body.angularVelocity=60;
			}else{
				guard.body.angularVelocity=-60;
			}
		}//Check for collision with walls
		else if(guard.hitWalls){
		console.log('hit wall');
			guard.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(guard.angle, 0));
			guard.body.angularVelocity=90;
			//wait a bit
			guard.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(guard.angle, 60));
		}else{
			guard.body.angularVelocity=0;
		}
	}
},this);
	guards.forEach(function(guard){
        this.setFill(guard.x,guard.y);
    },this);
}



Guard.prototype.setFill=function(x,y){
    var points=[];
        for(var a = 0; a < Math.PI*2; a += Math.PI/360) {
            // Create a ray from the light to a point on the circle
            var ray = new Phaser.Line(guard.x, guard.y, guard.x+Math.cos(a)*125, guard.y+Math.sin(a)*125);

            // Check if the ray intersected any walls
            var intersect = this.getWallIntersection(ray);

            // Save the intersection or the end of the ray
            if (intersect) {
                points.push(intersect);
            } else {
                points.push(ray.end);
            }
        }
        this.draw(points);
}
		
        // Connect the dots and fill in the shape, which are cones of light,
        // with a bright white color. When multiplied with the background,
        // the white color will allow the full color of the background to
        // shine through.
Guard.prototype.draw=function (points){
        this.bitmap.context.beginPath();
        this.bitmap.context.fillStyle = 'rgb(255, 255, 255)';


        //^^^THIS IS WHAT CAUSES THE LINE TO BE DRAWN FROM ONE GUARD TO ANOTHER^^^


        for(var i = 0; i < points.length-1; i++) {
            this.bitmap.context.lineTo(points[i].x, points[i].y);
        }
        this.bitmap.context.closePath();
        this.bitmap.context.fill();

        // This just tells the engine it should update the texture cache
        this.bitmap.dirty = true;
    }
Guard.prototype.getWallIntersection=function (ray) {
        var distanceToWall = Number.POSITIVE_INFINITY;
        var closestIntersection = null;
		
		
		
        // For each of the walls...
        walls.forEach(function(wall) {
            // Create an array of lines that represent the four edges of each wall
            var lines = [
                new Phaser.Line(wall.x, wall.y, wall.x + wall.width, wall.y),
                new Phaser.Line(wall.x, wall.y, wall.x, wall.y + wall.height),
                new Phaser.Line(wall.x + wall.width, wall.y,
                    wall.x + wall.width, wall.y + wall.height),
                new Phaser.Line(wall.x, wall.y + wall.height,
                    wall.x + wall.width, wall.y + wall.height)
            ];

            // Test each of the edges in this wall against the ray.
            // If the ray intersects any of the edges then the wall must be in the way.
            for(var i = 0; i < lines.length; i++) {
                var intersect = Phaser.Line.intersects(ray, lines[i]);
                if (intersect) {
                    // Find the closest intersection
                    distance =
                        this.game.math.distance(ray.start.x, ray.start.y, intersect.x, intersect.y);
                    if (distance < distanceToWall) {
                        distanceToWall = distance;
                        closestIntersection = intersect;
                    }
                }
            }
        }, this);
      	Gwalls.forEach(function(Gwall) {
            // Create an array of lines that represent the four edges of each wall
            var lines = [
                new Phaser.Line(Gwall.x, Gwall.y, Gwall.x + Gwall.width, Gwall.y),
                new Phaser.Line(Gwall.x, Gwall.y, Gwall.x, Gwall.y + Gwall.height),
                new Phaser.Line(Gwall.x + Gwall.width, Gwall.y,
                    Gwall.x + Gwall.width, Gwall.y + Gwall.height),
                new Phaser.Line(Gwall.x, Gwall.y + Gwall.height,
                    Gwall.x + Gwall.width, Gwall.y + Gwall.height)
            ];

            // Test each of the edges in this wall against the ray.
            // If the ray intersects any of the edges then the wall must be in the way.
            for(var i = 0; i < lines.length; i++) {
                var intersect = Phaser.Line.intersects(ray, lines[i]);
                if (intersect) {
                    // Find the closest intersection
                    distance =
                        this.game.math.distance(ray.start.x, ray.start.y, intersect.x, intersect.y);
                    if (distance < distanceToWall) {
                        distanceToWall = distance;
                        closestIntersection = intersect;
                    }
                }
            }
        }, this);
        Pwalls.forEach(function(Pwall) {
            // Create an array of lines that represent the four edges of each wall
            var lines = [
                new Phaser.Line(Pwall.x, Pwall.y, Pwall.x + Pwall.width, Pwall.y),
                new Phaser.Line(Pwall.x, Pwall.y, Pwall.x, Pwall.y + Pwall.height),
                new Phaser.Line(Pwall.x + Pwall.width, Pwall.y,
                    Pwall.x + Pwall.width, Pwall.y + Pwall.height),
                new Phaser.Line(Pwall.x, Pwall.y + Pwall.height,
                    Pwall.x + Pwall.width, Pwall.y + Pwall.height)
            ];

            // Test each of the edges in this wall against the ray.
            // If the ray intersects any of the edges then the wall must be in the way.
            for(var i = 0; i < lines.length; i++) {
                var intersect = Phaser.Line.intersects(ray, lines[i]);
                if (intersect) {
                    // Find the closest intersection
                    distance =
                        this.game.math.distance(ray.start.x, ray.start.y, intersect.x, intersect.y);
                    if (distance < distanceToWall) {
                        distanceToWall = distance;
                        closestIntersection = intersect;
                    }
                }
            }
        }, this);
         return closestIntersection;
     }


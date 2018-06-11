function Guard(game, key, scale, rotation, x, y){
 	//Set up the sprite call for the guard
	Phaser.Sprite.call(this, game, x, y, key);

	//Set up basic guard stats
	this.anchor.set(0.5, 0.5);
	this.scale.x = scale;
	this.scale.y = scale;
	this.angle=Math.random()*30;
	this.chase=false;
	this.alert=false;
	this.safe=false;
	this.xpos=0;
	this.ypos=0;
	
	game.physics.enable(this);
	this.body.collideWorldBounds = true;
	this.body.allowRotation=true;
	
	this.rotateCheck=game.time.create(false);
	this.rotateCheck.loop(100, guardRotationCheck);
	this.rotateCheck.start();
	function guardRotationCheck(){
	guards.forEach(function(guard){

/*if y pos not move go left or right depend on angle
	if x pos not move go up or down depend on angle*/
		if(guard.xpos==guard.x){
			if(guard.angle<-90||guard.angle>90){
				//facing left
				if(guard.angle<-90){
					//go up
					guard.angle+=20;
				}else{
					//go down
					guard.angle-=20;
				}
			}else{
				//facing right
				if(guard.angle<0){
					//go up
					guard.angle-=20;
				}else{
					//go down
					guard.angle+=20;
				}
			}
		}
		else if(guard.ypos==guard.y){
			if(guard.angle<0){
				//facing up
				if(guard.angle<-90){
					//go left
					guard.angle-=20;
				}else{
					//go right
					guard.angle+=20;
				}
			}else{
				//facing down
				if(guard.angle>90){
					//go left
					guard.angle+=20;
				}else{
					//go right
					guard.angle-=20;
				}
			}
		}
		else{
			guard.xpos=guard.x;
			guard.ypos=guard.y;
		}
	})
	};
	
	

	
}
//Override the guard constructor
Guard.prototype = Object.create(Phaser.Sprite.prototype);
Guard.prototype.constructor = Guard;



//Override the update function for guard
Guard.prototype.update=function() {
	

	guards.forEach(function(guard){
	//Collision booleans for AI 
	//Has to be guards with an 's' if not in the guards.forEach loop
	//because we want the whole group to collide, not just one
	
	var GhitWalls=game.physics.arcade.collide(guard, Walllayer);
	var GhitPlayer=game.physics.arcade.collide(guard, player);
	var GhitGwalls=game.physics.arcade.collide(guard, Gwalls);
	var GhitPwalls=game.physics.arcade.collide(guard, Pwalls);
	var GhitSwalls=game.physics.arcade.collide(guard, Swalls);


	
	

	if(GhitPlayer){
		// kill all coins
		//Coins.callAll('kill');
		// stop the music
		Level1.stop();
		Level2.stop();

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

		newLevel = true;

		if(level == 0) {
			player.body.x = 100;
			player.body.y = 400;
			guard.x = 800;
			guard.y = 300;
		}
	}
	//Guard Chase AI
        	var LoS= new Phaser.Line(guard.x, guard.y, player.x, player.y);
        	var LoSInter = getWallIntersection(LoS);
        	if(LoSInter||LoS.length>127){
        		guard.chase=false;
        		if(guard.safe==false){
        			guard.safe=true;
        			guard.alert=false;
        			Safe.play();
        		}
        	}else if(LoS.length<=127){
        		guard.chase=true;
        		if(guard.alert==false){
        			guard.alert=true;
        			guard.safe=false;
        			Alert.play();
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
				 
		if(guard.body.x>game.width-128){
			if(guard.angle<0){
				guard.body.angularVelocity=-60;
			}else{
				guard.body.angularVelocity=60;
			}
		}else if(guard.body.x<128){
			if(guard.angle<0||guard.angle==180){
				guard.body.angularVelocity=60;
			}else{
				guard.body.angularVelocity=-60;
			}
		}else if(guard.body.y>game.height-128){
			if(guard.angle>90||guard.angle<-90){
				guard.body.angularVelocity=60;
			}else{
				guard.body.angularVelocity=-60;
			}
		}else if(guard.body.y<128){
			if(guard.angle>-90&&guard.angle<90){
				guard.body.angularVelocity=60;
			}else{
				guard.body.angularVelocity=-60;
			}
		}else{
			guard.body.angularVelocity=0;
		}
	}
	
	setFill(guard.x,guard.y);
	
	
	
	
},this);


function setFillCamera(x,y){
			var PointPush=false;
            var points=[];
            for(var a = x-100; a < x+100; a++) {
                // Create a ray from the light to a point on the circle
                var ray = new Phaser.Line(x, y, a, y-257);

                // Check if the ray intersected any walls
                var intersect = getWallIntersection(ray);

                // Save the intersection or the end of the ray
                if (intersect) {
                if(PointPush==false){
                    	points.push(ray.start);
                    	PointPush=true;
                    }
                    points.push(intersect);
                } else {
                if(PointPush==false){
                    	points.push(ray.start);
                    	PointPush=true;
                    }
                    points.push(ray.end);
                    
                }
            }
            
            draw(points);
        }

function setFill(x,y){
            var points=[];
            for(var a = 0; a < Math.PI*2; a += Math.PI/360) {
                // Create a ray from the light to a point on the circle
                var ray = new Phaser.Line(x, y, x+Math.cos(a)*125, y+Math.sin(a)*125);

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
}

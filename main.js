window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d'); 
    canvas.width = 800;
    canvas.height = 800;   

    ctx.fillStyle = "rgba(135, 206, 250, 0.5)";
    ctx.font = "25px Trebuchet MS, Lucida Sans Unicode, Lucida Grande, Lucida Sans, Arial, sans-serif";
    
    // interactivity
    let moveRight = false;
    let moveLeft = false;
    let shooting=false;
    // move
    this.document.body.addEventListener('keydown', function(event){
        const key = event.key;
        switch (key) {
            
            case 'ArrowRight':                
                moveRight=true;
                break; 

            case 'ArrowLeft':                    
                moveLeft=true;
                break; 
            case ' ':                    
                shooting=true;
                break; 
            default:
                break;
        }
    });

    // end move
    this.document.body.addEventListener('keyup', function(event){
        const key = event.key;
        switch (key) {
            
            case 'ArrowRight':                
                moveRight=false;
                break; 

            case 'ArrowLeft':                    
                moveLeft=false;
                break; 
            case ' ':                    
                shooting=false;
                //console.log('shooting from listener');
                break; 
            default:
                break;
        }
    });   
   

    class Game {
        constructor(canvas){
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.player = new Player(this, moveRight, moveLeft);
            this.stateBar = new StateBar(this, 70, this.height-50, this.player.damage, 15, 'green');
            this.shots=[];
            this.enemies=[];
            this.particles=[];
            this.enemyShots = [];
            this.counter = 0;
            this.direction = 1;
            this.leftDirection = false;
            this.rightDirection = true;
            this.score=0;
            this.stars=[];

        }
        
        init(){
            for (let i = 0; i < 57; i++){
                let x = Math.floor(Math.random() * this.width -10)+10;
                let y = Math.floor(Math.random() * this.height*0.7) + 50;
                let star = new Particle(this, x, y, 0, 'white');
                star.width = Math.floor(Math.random() * 5 - 1) + 1;
                star.height = star.width;
                this.stars.push(star);
            }
            this.stateBar.draw(ctx);
            let startX = 100;
            let startY = 45;
            let row = 1;
            let column = 1;
            for(let i=0; i<20; i++){                
                for(let j=0; j<10; j++){
                    const enemy = new Enemy(this, startX, startY);
                    column === 10 ? enemy.last = true : enemy.last = false;
                    enemy.last ? enemy.color = 'yellow' : enemy.color = 'cyan';
                    enemy.row = row;
                    enemy.column = column;
                    //console.log('last ', enemy.last);
                    //console.log('column ', column);
                    this.enemies.push(enemy);
                    startY += 30;   
                    column += 1;
                }                
                startX += 30;
                startY = 45;
                row += 1;
                column = 1;
                
            }      

            

        }

        isOnRightBorder(){
            let onRightBorder = this.enemies.filter(enemy=>enemy.x >= this.width-60);      
            
            if (onRightBorder.length>0){
                this.direction = -1;                
                return true;
            }           

            else {return false;}
        }

        isOnLeftBorder(){
            let onLeftBorder = this.enemies.filter(enemy=>enemy.x <= 30);

            if (onLeftBorder.length>0){
                this.direction = 1;                
                return true;
            }
            else {
                return false;
            }
        }

        updateEnemies(context){
            // update position
            
            if (this.counter%40==0){
                if (this.isOnRightBorder() && this.rightDirection == true){
                    //console.log('isOnRightBorder');
                    // descend one line
                    this.enemies.forEach(enemy =>{                        
                        enemy.y += 30;                                                    
                        enemy.draw(context);            
                    });
                    this.rightDirection = false;
                    this.leftDirection=true;
                }
                else if (this.isOnLeftBorder() && this.leftDirection == true){
                    //console.log('isOnleftBorder');
                    this.enemies.forEach(enemy =>{                        
                        enemy.y += 30;                                                    
                        enemy.draw(context);            
                    });
                    this.rightDirection = true;
                    this.leftDirection=false;
                }
                else {
                    this.enemies.forEach(enemy =>{                        
                        enemy.x += enemy.speed * this.direction;                            
                        enemy.draw(context);            
                    });
                }
                
            }
            else {
                this.enemies.forEach(enemy =>{
                        
                    //enemy.x += enemy.speed * this.direction;
                        
                    enemy.draw(context);            
                });
            }
            
            this.counter++;           
        }

        drawShots(context){
            // update position
            this.shots.forEach(shot =>{
                if(shot.y>0){
                    shot.y += shot.speed*shot.direction;
                }    
                shot.draw(context);            
            });

        }

        playerShotsCollision(){
            for (let i =0; i < this.shots.length; i++) {
                for (let j =0; j < this.enemies.length; j++){
                    if (this.detectCollision(this.shots[i], this.enemies[j])) {
                        this.shots[i].markedForDeletion = true;
                        this.enemies[j].markedForDeletion = true;
                        this.enemies[j].last ? this.score += 25 : this.score += 15;
                    };
                }
            }
        }
        explosion(enemy){
            let numParticles = Math.floor(Math.random() * (7-4+1))+4;            
            let angleStep = Math.floor(Math.random() * (90-30+1))+30;
            let angle = Math.floor(Math.random() * 365);

            for (let i =0; i< numParticles; i++){                              
                angle = angle + angleStep;                
                const particle = new Particle(this, enemy.x+enemy.width/2, enemy.y, angle);
            this.particles.push(particle);
            //console.log(particle);
            }       

        }
        updateExplosions(context){
            if (this.particles.length>0){
                this.particles.forEach(particle=>{
                    particle.update();
                    particle.draw(context);
                });
            }           
            
        }

        // check collision of enemy shots

        checkEnemyShotsCollision(){
            for (let i =0; i < this.enemyShots.length; i++) {
                for (let j =0; j < this.shots.length; j++){
                    if (this.detectCollision(this.enemyShots[i], this.shots[j])) {
                        this.enemyShots[i].markedForDeletion = true;
                        this.shots[j].markedForDeletion = true;
                    };
                }
            }

            this.enemyShots.forEach(shot => {
                if(this.detectCollision(shot, this.player)){
                    shot.markedForDeletion=true;
                    //console.log('BANG!!!');
                    this.player.damage -= 10;
                    console.log('Damage: ', this.player.damage);
                }
            })
        }
        // detect collision of 2 objects
        detectCollision(object1, object2) {
            let collision = false;
            
            const criticWidth = (object1.width + object2.width)/2;            
            const criticHeight = (object1.height + object2.height)/2;           

            if(object1.x - object2.x <=0 && object1.y - object2.y <= 0){
                if(Math.abs(object1.x - object2.x) < object1.width && Math.abs(object1.y - object2.y) < object1.height){
                    collision = true;    
                }
            }

            if(object1.x - object2.x <=0 && object1.y - object2.y >= 0){
                if(Math.abs(object1.x - object2.x) < object1.width && Math.abs(object1.y - object2.y) < object2.height){
                    collision = true;    
                }
            }

            if(object1.x - object2.x > 0 && object1.y - object2.y <= 0){
                if(Math.abs(object1.x - object2.x) < object2.width && Math.abs(object1.y - object2.y) < object1.height){
                    collision = true;    
                }
            }

            if(object1.x - object2.x > 0 && object1.y - object2.y >= 0){
                if(Math.abs(object1.x - object2.x) < object2.width && Math.abs(object1.y - object2.y) < object2.height){
                    collision = true;    
                }
            }
            
            return collision;            

        }
        outShots() {
            this.shots.forEach(shot =>{                
                    if(shot.y<=0){
                        shot.markedForDeletion=true;               
                    }
                });
        }

        outEnemyShots() {
            this.enemyShots.forEach(shot =>{                
                    if(shot.y>=this.height - 50){
                        shot.markedForDeletion=true;               
                    }
                });
        }

        removeEnemies(){ 
            const burntEnemies = this.enemies.filter(enemy => enemy.markedForDeletion).map(item => this.explosion(item));

            const lastBurntEnemies = this.enemies.filter(enemy => enemy.last && enemy.markedForDeletion);            
            
            for (let i = 0; i < lastBurntEnemies.length; i++) {
                const element = lastBurntEnemies[i];
                const columnEnemies = this.enemies.filter(en => en.row === element.row);
                
                //console.log('column enemies', columnEnemies.length);
                if (columnEnemies.length > 0){
                    columnEnemies.sort(function(a, b){return b.column - a.column});
                    //console.log("last column ", columnEnemies[0].column);
                    if (columnEnemies.length > 1){
                        let last = columnEnemies.length-1;
                        columnEnemies[1].color = 'yellow';
                        columnEnemies[1].last = true;
                                
                        columnEnemies[1].draw(ctx);
                    }
                    
                }
                
            }            
        
            this.enemies=this.enemies.filter(enemy => !enemy.markedForDeletion);                                 
        }

        enemyShooting(){
            let starter = Math.floor(Math.random()*120)+1;
            //console.log('starter ', starter);
            if (starter === 20) {
                //console.log('starter OK');
                const shootingEnemies = this.enemies.filter(enemy => enemy.last);
                //console.log('Last enemies ', shootingEnemies.length);
                //let shooterId = Math.floor(Math.random()*10) + 1;
                //console.log('ShooterID ', shooterId);
                //let len = shootingEnemies.lengths;
                if (shootingEnemies.length > 0){
                    let shooterId = Math.floor(Math.random()*shootingEnemies.length-1) + 1;
                    //console.log('ShooterID OK');
                    const shooter = shootingEnemies[shooterId];
                    //console.log('shooter ', shooter);
                    const enemyShot = new Shot(this, shooter.x+shooter.width/2, shooter.y+shooter.height, 3, 15, 'blue', 1, 3);
                    this.enemyShots.push(enemyShot);
                }
                
            }
        }
        
        drawEnemyShots(context){
            this.enemyShots.forEach(shot =>{
                if(shot.y>0){
                    shot.y += shot.speed*shot.direction;
                }    
                shot.draw(context);            
            });
        }


        removeShots(){         
            this.shots=this.shots.filter(object => !object.markedForDeletion);                                 
        }

        removeEnemyShots(){         
            this.enemyShots=this.enemyShots.filter(object => !object.markedForDeletion);                                 
        }

        removeParticles(){
            this.particles=this.particles.filter(object => !object.markedForDeletion);                                 
        }
        
        render(context){
            ctx.save();
            ctx.fillStyle = "rgba(135, 206, 250, 0.5)";
            ctx.font = "25px Trebuchet MS, Lucida Sans Unicode, Lucida   Grande, Lucida Sans, Arial, sans-serif";            
            ctx.fillText(`Score: ${this.score}`, 50, 30);
            ctx.restore();
            this.player.update(moveRight, moveLeft); 
            this.stateBar.update(this.player.damage);           
            
            // shooting logic
            if(shooting==true){
                //console.log('shooting');
                const shot=new Shot(this, this.player.x+this.player.width/2, this.player.y+this.player.height/2, 5, 15, 'orange', -1);
                this.shots.push(shot);
                shooting=false;
            }            
            this.enemyShooting();
            this.drawEnemyShots(ctx);
            this.outShots();
            this.outEnemyShots();            
            this.playerShotsCollision();
            this.checkEnemyShotsCollision();            
            this.enemyShooting();
            this.drawEnemyShots(ctx);
            this.removeShots();
            this.removeEnemyShots();
            this.removeEnemies();
            this.removeParticles();
            this.updateEnemies(context);
            this.updateExplosions(context);
            this.drawShots(context);    
            this.player.draw(context); 
            this.stateBar.draw(context);           
            //this.counter++;

        }

        
    }
    const game = new Game(canvas);
    game.init();
    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render(ctx);
        requestAnimationFrame(animate);
    }

    animate();
});


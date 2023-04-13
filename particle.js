class Particle {
    constructor(game, x, y, angle, color='red'){
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = Math.floor(Math.random() * (50 - 15 + 1)) + 15;
        this.height = this.width;
        this.directionX = Math.random()>0.5 ? 1 : -1;
        this.directionY = Math.random()>0.5 ? 1 : -1;
        this.angle = Math.floor(angle*Math.PI / 180);
        this.speed = Math.floor(Math.random() * (10 - 5 +1 )) + 5;
        this.speedX = (Math.cos(this.angle) + this.speed)*this.directionX;
        this.speedY = (Math.sin(this.angle) + this.speed)*this.directionY;
       
        this.color = 'red';
        this.markedForDeletion=false;       

        //console.log('angle ', this.angle);
        //console.log('direction ', this.direction);        
    }

    draw(context){
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
        //console.log('x angle: ', this.speedX);
        //console.log('y angle: ', this.speedY);
    }

    update(){

        this.x += this.speedX;
        this.y += this.speedY;
        if (this.width > 5){
            this.width -= 5;
            this.height -= 5;
        }
        else {
            this.markedForDeletion=true;
        }



    }


}
class Player {
    constructor(game){
        this.game = game;
        this.width = 30;
        this.height = 30;
        this.color = 'green';
        this.x = this.game.width/2;
        this.y = this.game.height - 3*this.height;
        this.speed = 5;   
        this.damage = 100;     
        this.energie = 100;
    }

    update(moveRight, moveLeft){
        if(moveRight==true && this.x < this.game.width-this.width){
            this.x += this.speed;
        }

        if(moveLeft==true && this.x > 0){
            this.x -= this.speed;
        }   
    }       

    draw(context){
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);

    }
}
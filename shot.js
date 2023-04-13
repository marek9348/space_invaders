class Shot {
    constructor(game, x, y, width, height, color, direction, speed=10){
        this.player = game.player;
        //this.game = game;
        this.width=width;
        this.height=height;            
        this.color= color; //'rgba(255,165,0,0)';
        this.x= x; //this.player.x+this.player.width/2;
        this.y= y; //this.player.y-this.height*1.5;
        this.speed=speed;
        this.direction = direction;
        this.markedForDeletion=false;
    }       

    draw(context){
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);       
        
    }
}   
class Enemy {
    constructor(game, x, y){
        this.player = game.player;
        //this.game = game;
        this.width=20;
        this.height=20;
        this.row = 0;            
        this.column = 0;
        this.color='cyan';
        this.x=x;
        this.y=y;
        this.speed=10;
        this.markedForDeletion=false;
        this.shootable = true;
        this.last = false;

    }

    draw(context){
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);

    }
}
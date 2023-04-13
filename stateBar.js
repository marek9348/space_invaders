class StateBar {
    constructor(game, x, y, width, height, color, lineWidth = 3){
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.frameWidth = width;
        this.totalWidth = width;
        this.height = height;
        this.color = color;
        this.lineWidth = lineWidth;
    }

    update(width){
        if (width >= 0){
            this.width = width;
        }
        else {
            this.width = 0;
        }
        

        if (this.width < Math.floor(this.totalWidth*0.8) && this.width > Math.floor(this.totalWidth*0.3)){
            this.color = 'yellow';
        }
        if (this.width < Math.floor(this.totalWidth*0.3)){
            this.color = 'red';
        }

        
        
    }

    draw(context){
        
    context.fillStyle=this.color;
    context.beginPath();
    context.lineWidth = "2";
    context.strokeStyle = this.color;
    context.rect(this.x, this.y, this.frameWidth*2, this.height);  
    context.stroke();            
    context.fillRect(this.x, this.y, this.width*2, this.height);  
    
    }        
    
}
    
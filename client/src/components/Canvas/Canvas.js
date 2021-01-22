import React, { Component, PropTypes, useState } from 'react';
import Pause from "../Pause/Pause";
import Dino from "../../game/assets/sprites/DinoSprites-doux.png"
import BG from "../../game/assets/maps/country/countryLevel2.png"
import { Redirect } from "react-router-dom";
import { style } from "../../utils/theme"



export default class Canvas extends Component {

    state = {
        changeRoom: false,
        isPaused: false
    }
    
     //ANIMATION=========================================
componentDidMount() {
    this.updateCanvas();
}

updateCanvas() {
    const ctx = this.refs.canvas.getContext('2d');
    //1.import images=====================
    let imageObj = new Image();
    imageObj.src = Dino 

    let imageObj2 = new Image();
    imageObj2.src = Dino 

    //KEY COMMANDS================================================
    
    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);

    let rightPressed = false;
    let leftPressed = false;
    let upPressed = false;
    let downPressed = false;
    let spacePressed = false;
    let escPressed = false
    
    function keyDownHandler(event) {
        switch (event.keyCode) {
            case 68:
                rightPressed = true;
                break;
            case 65:
                leftPressed = true;
                break;
            case 83:
                downPressed = true;
                break;
            case 87:
                upPressed = true;
                break;
            case 32:
                spacePressed = true;
                break;
            case 27:
                escPressed = !escPressed;
                break;
        }
    }
    function keyUpHandler(event) {
        switch (event.keyCode) {
            case 68:
                rightPressed = false;
                break;
            case 65:
                leftPressed = false;
                break;
            case 83:
                downPressed = false;
                break;
            case 87:
                upPressed = false;
                break;
        }
    }
    
    
    
    //SETTING VRIABLES FOR RENDERING==========
    //scale of character
    const scale = 1.5;
    //width and height of spritesheet frame
    const width = 24;
    const height = 24;
    //self explanatory
    const scaledWidth = scale * width;
    const scaledHeight = scale * height;

    //starting variables for move function
    let currentLoopIndex = 0;
    let frameCount = 0;

    //SETTING "STATES"

    let lastMove = 0 //<<====numbers to be passed as identifiers for conditionals or switches

    //position of PLayer(drawframe) on canvas
    let canvasX = 600;
    let canvasY = 360;
    // let enemyX = 100
    // let enemyY = 200
    //COMBAT STUFF=======================
    let playerHurt = false
    let playerHurtLength = 0
    let attackLength = 0
    let playerHealth = 100
    let beforeRoom = 0

    //spoofer =======================
    function frameRateSpoof(nums){
        const frameOutput = []
        nums.forEach(element => {
            for(let i = 0; i < 5; i++){
                frameOutput.push(element)
            }
        });
    
        return frameOutput
    
    };
    //animation frames====================================
        const rightAnimate = frameRateSpoof([4,5,6,7,8,9])
        const leftAnimate =  frameRateSpoof([43,42,41,40,39,38])
        const baseRightAnimate = frameRateSpoof([0,0,1,2,3,3])
        const baseLeftAnimate = frameRateSpoof([47,47,46,45,44,44])
        const attackRight = frameRateSpoof([10,11,11,11,12,13])
        const attackLeft = frameRateSpoof([37,36,36,36,35,34])
        const hurtAnimateRight = frameRateSpoof([14,14,15,15,16,16])
        const hurtAnimateLeft = frameRateSpoof([33,33,32,32,31,31])
    //  (enemyX, enemyY, img, width, height, scale, HP, ATK, EXP)
    //starting position for other entity(entities)
    let animation = []

    class Enemy{
        constructor(img, enemyX, enemyY, scale, enemyAnimation, HP,ATK, attackBuild){
            this.enemyX = enemyX;
            this.enemyY = enemyY;
            this.img = img;
            this.width = 24;
            this.height = 24;
            this.scale = scale
            this.enemyAnimation = enemyAnimation
            this.HP = HP;
            this.ATK = ATK;
            this.attackBuild = attackBuild;

        }
           
        drawFrame2(frameX, frameY) {
            ctx.drawImage(this.img,
                          frameX * this.width, frameY * this.height, this.width, this.height,
                          this.enemyX, this.enemyY, this.scale*this.width, this.scale*this.width);
        }
        step2 = () => {
            
            let distanceX = canvasX - this.enemyX 
            let distanceY = canvasY - this.enemyY
            let unitVector = Math.hypot(distanceX,distanceY)

            if(spacePressed && unitVector<=15){
                console.log(this.attackBuild)
                this.attackBuild+=10
                if(lastMove === 0 && distanceX < 0){
                    this.enemyAnimation = hurtAnimateLeft
                    this.HP -= 1
                }else if(lastMove === 1 && distanceX > 0){
                    this.enemyAnimation = hurtAnimateRight
                    this.HP -= 1
                }
                
            }else{
                if(unitVector <= 15){
                    console.log(this.attackBuild)
                    if(distanceX < 0){
                        this.enemyAnimation = attackLeft
                    }else{
                        this.enemyAnimation = attackRight
                    }
                    this.attackBuild+=5
                    if(this.attackBuild>=500){
                        
                        playerHurt = true
                        playerHealth-=this.ATK

                        this.attackBuild = 0
                    }
                }else{
                    if(distanceX > 0 ){
                       
                        this.enemyAnimation = rightAnimate
                    }
                    else if(distanceX < 0){
                        
                        this.enemyAnimation = leftAnimate
                    }
                    this.enemyX+=(distanceX/(2*unitVector))
                    this.enemyY+=(distanceY/(2*unitVector))
                }  

            }
            
            
                
            if(this.HP <= 0){
                this.enemyAnimation = []
                beforeRoom++
                console.log(beforeRoom)
            }

        }
            
            
        
        
    }

    //construct enemies
    const enemy = new Enemy(imageObj2,  Math.random()*1050, 0, 1, [], 100, 10, 0)
    const enemy1 = new Enemy(imageObj2,  Math.random()*1050, 0, 1, [], 100, 10, 0)
    const enemy2 = new Enemy(imageObj2,  Math.random()*1050, 0, 1, [], 100, 10, 0)
    const enemy3 = new Enemy(imageObj2,  Math.random()*1050, 0, 1, [], 100, 10, 0)
    const enemy4 = new Enemy(imageObj2,  Math.random()*1050, 0, 1, [], 100, 10, 0)
    const enemy5 = new Enemy(imageObj2, Math.random()*1050, 0, 1, [], 100, 10, 0)
    const BOSS = new Enemy(imageObj2, 200, 300, 5, [], 1000,200, 0)

    


   
    //draws main character (player)==================
    function drawFrame(img, frameX, frameY) {
        ctx.drawImage(img,
                      frameX * width, frameY * height, width, height,
                      canvasX, canvasY, scaledWidth, scaledHeight);
    }
        

    //basic animation function===================================
    //add in cycleLoop for each entity so they can have seperate animations
    function move(cycleLoop, cycleLoop2, cycleLoop3, cycleLoop4, cycleLoop5, cycleLoop6, cycleLoop7, cycleLoop8){
        drawFrame(imageObj,cycleLoop[currentLoopIndex], 0, 0, 0); 
        enemy.drawFrame2(cycleLoop2[currentLoopIndex], 0, 0, 0);
        enemy1.drawFrame2(cycleLoop4[currentLoopIndex], 0, 0, 0);
        enemy2.drawFrame2(cycleLoop5[currentLoopIndex], 0, 0, 0);
        enemy3.drawFrame2(cycleLoop6[currentLoopIndex], 0, 0, 0);
        enemy4.drawFrame2(cycleLoop7[currentLoopIndex], 0, 0, 0);
        enemy5.drawFrame2(cycleLoop8[currentLoopIndex], 0, 0, 0);
        BOSS.drawFrame2(cycleLoop3[currentLoopIndex], 0, 0, 0);

        currentLoopIndex++;
        if (currentLoopIndex >= cycleLoop.length) {
          currentLoopIndex = 0;
        }
    }

        

        //============movement functions======================
            
        //move right function
        function right(){
            animation = rightAnimate
            lastMove=0
            canvasX += 2;
            if(upPressed){
                canvasY -= 2;
            }
            else if(downPressed){
                canvasY += 2;
            }
            
        }
        //move left function
        function left(){
            animation = leftAnimate
            lastMove = 1
            canvasX -= 2;
            if(upPressed){
                canvasY -= 2;
            }
            else if(downPressed){
                canvasY += 2;
            }
        }
        //move down function
        function down(){
            if(lastMove===0){
                animation = rightAnimate
            }else{
                animation = leftAnimate
            }
        
            canvasY += 2;
        }
        //move up function
        function up(){
            if(lastMove===0){
                animation = rightAnimate
            }else{
               animation = leftAnimate
            }
            canvasY -= 2;
        }
        //player attack logic
        function attack(){
            if(rightPressed){
                lastMove=0
                if(canvasX >=1020) {
                    canvasX -= 6;
                }
                if(upPressed){
                    if(canvasY <= 0) {
                        canvasY += 6;
                        canvasX += 2;
                    }
                    else {
                        canvasX += 2;
                        canvasY -= 2;
                    }
                }
                else if(downPressed){
                    if(canvasY >= 560) {
                        canvasY -= 6;
                        canvasX += 2;
                    }
                    else {
                        canvasX += 2;
                        canvasY += 2;
                    }
                }
                else {
                    canvasX += 2;
                }
            }
            else if(leftPressed){
                lastMove = 1
                if(canvasX <= 0) {
                    canvasX += 6;
                }
                if(upPressed){
                    if(canvasY <= 0) {
                        canvasY += 6;
                        canvasX -= 2;
                    }
                    else {
                        canvasX -= 2;
                        canvasY -= 2;
                    }
                }
                else if(downPressed){
                    if(canvasY >= 560) {
                        canvasY -= 6;
                        canvasX -= 2;
                    }
                    else {
                        canvasX -= 2;
                        canvasY += 2;
                    }
                }
                else {
                    canvasX -= 2;
                }
            }
            else if(upPressed){
                if(canvasY <= 0) {
                    canvasY += 6;
                }
                else {
                    canvasY -= 2
                }
            }
            else if(downPressed){
                if(canvasY >= 560) {
                    canvasY -= 6;
                }
                else {
                    canvasY += 2
                }
            }
            attackLength++
                if(lastMove===0){
                    animation = attackRight
                }else{
                    animation = attackLeft
                }
                if(attackLength===30){
                    spacePressed = false
                    attackLength = 0
                }
        }


    //function for directing rendering by keypress======(character movement/collision/behavior)
    const step = () => {
        if (canvasX < 10 && canvasY < 10) {
           this.setState({changeRoom: true});
        };
        
        if(playerHurt == true){
            playerHurtLength++
            switch(lastMove){
                case 0 : animation = hurtAnimateRight
                break;
                case 1 : animation =  hurtAnimateLeft
                break;
            
            }
            if(playerHurtLength == 45){
                playerHurt = false
                playerHurtLength = 0
            }
        }else{

        
        switch(true){
            case spacePressed:
                attack();
            break;
            case rightPressed:

                if(canvasX >= 1040) {

                    animation = rightAnimate
                    canvasX -= 6;
                //===================
                }
                else if(canvasY <= 0) {
                    animation = rightAnimate
                    canvasY += 6;
                    canvasX += 2;
                }
                else if(canvasY >= 560) {
                    animation = rightAnimate
                    canvasY -= 6;
                    canvasX += 2;
                }
                else{
                    right()
                }
            break;
            case leftPressed:

                if(canvasX <=0){

                    animation = leftAnimate
                    canvasX += 6;
                //===================
                }
                else if(canvasY <= 0) {
                    animation = leftAnimate
                    canvasY += 6;
                    canvasX -= 2;
                }
                else if(canvasY >= 560) {
                    animation = leftAnimate
                    canvasY -= 6;
                    canvasX -= 2;
                }
                else{
                    left()
                }   
            break;
            case downPressed:
                if(canvasY >= 560){
                    if(lastMove===0){
                        animation = rightAnimate
                        canvasY -= 6;
                    }else{
                        animation = leftAnimate
                        canvasY -= 6;
                    }
                }else{
                down()
                }
            break;
            case upPressed:
                if(canvasY <=0){
                    if(lastMove===0){
                        animation = rightAnimate
                        canvasY += 6;
                    }else{
                        animation = leftAnimate
                        canvasY += 6;
                    }
    
                }else{
                    up()
                }
            break;
            default:
                if(lastMove===0){
                   animation = baseRightAnimate
                }else{
                   animation = baseLeftAnimate
                }
            }}
            if(playerHealth <= 0){
                animation = []
                return
            }
            //pass each entities animations into this function
           
           
            
            
        
        
        
    }

    const master = () => {
        frameCount++;
             if (frameCount <1) {
             window.requestAnimationFrame(master);
             return;
             }
            frameCount = 0;
            ctx.clearRect(0, 0, 1200, 720);
        if(escPressed){
            this.setState({isPaused: true})
        }else{
            enemy.step2()
            enemy1.step2()
            enemy2.step2()
            enemy3.step2()
            enemy4.step2()
            enemy5.step2()
            BOSS.step2()
            step()
            this.setState({isPaused: false})
        }
            
            move(animation, enemy.enemyAnimation, BOSS.enemyAnimation, enemy1.enemyAnimation, enemy2.enemyAnimation, enemy3.enemyAnimation, enemy4.enemyAnimation, enemy5.enemyAnimation)
            setTimeout(() => {
                window.requestAnimationFrame(master);
            }, 15);
        
    }
    
    

    //calls first animation loop=================
    //make sure all entities are called in here
    function init() {
        window.requestAnimationFrame(master);
    }
    
    //calls init(for second onload)
    imageObj.onload = function() {
        init();
    }

}

render() {

    const styles = {
        backgroundImage: "url(" + BG + ")",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
    }

    return (
        <div style={style.body} className="d-flex justify-content-center">
            {this.state.isPaused ? <Pause /> : <div/>}
            <canvas ref="canvas" className="mt-4 mb-4"
            width={1200} height={720} 
            style={styles}></canvas>
            {this.state.changeRoom ? <Redirect to="/harmony/level1"/> : <Redirect to="/harmony/refactor" />}
        </div>
        

    );
 }
};

   
//variables pour créer les sprites
var nebula,vaisseau,play;
//variables pour les images
var nebulaImg,vaisseauImg,thrustImg,rockImg, laserImg,explosionImg,playImg;

//variables pour les groupes
var rock_groupe, laser_groupe;

//dimension zone de jeu
var LARGEUR = 900;
var HAUTEUR = 600;

// variables états de jeu
var vie, score, bestscore,statut;
vie = 3;
score = 0;
bestscore = 0;
statut="play"

  function preload(){
  //télécharger les images ici
  nebulaImg = loadImage("nebula.jpg");
  vaisseauImg = loadImage("spaceship.png");
  thrustImg = loadImage("thrust.png");
  rockImg = loadImage("rock.png");
  laserImg = loadImage("laser.png");
  playImg = loadImage("play.png");
   explosionImg =     loadAnimation("explosion300.png","explosion301.png","explosion302.png","explosion303.png","e4.png","explosion305.png","explosion306.png","explosion307.png","explosion308.png","explosion309.png","explosion310.png","explosion311.png","explosion312.png","explosion313.png","explosion314.png","explosion315.png")
  }

function setup(){
  createCanvas(LARGEUR,HAUTEUR)
  
  nebula = createSprite(LARGEUR/2,HAUTEUR/2,LARGEUR,HAUTEUR);
  nebula.addImage(nebulaImg);
  nebula.scale = 1.1;
  
  vaisseau = createSprite(LARGEUR/2,HAUTEUR/2,20,20);
  vaisseau.addAnimation("spaceship",vaisseauImg);
  vaisseau.addAnimation("thrust",thrustImg);
  vaisseau.scale = 0.25;
  vaisseau.debug = false;
  vaisseau.setCollider("rectangle",0,0,450,350);
  rock_groupe = createGroup();
  laser_groupe = createGroup();
  play=createSprite(LARGEUR/2,HAUTEUR/2+100);
  play.addAnimation("play",playImg);
  play.scale=0.4;
 }

function draw(){            
  drawSprites();
  
fill("black");
textSize(30);
text("vie:"+vie,LARGEUR-100,30);
  
text("score:"+score,LARGEUR-250,30);

text("bestscore:"+bestscore,LARGEUR-500,30);
  
  if(statut==="play"){
play.visible=true;
if(mousePressedOver(play)){
statut="joue";
play.visible=false;
}
}
if(statut==="joue"){
  if (keyDown("right")){  
vaisseau.rotation+=10;
}
if (keyDown("left")){  
vaisseau.rotation-=10;
}

if (keyDown("up")){  
vaisseau.velocityX+=5* Math.cos(radians(vaisseau.rotation));
vaisseau.velocityY+=5* Math.sin(radians(vaisseau.rotation));
vaisseau.changeAnimation("thrust") ;
}
if(keyWentUp("up")){
   vaisseau.changeAnimation("spaceship");
}
  casse()
 traverser(vaisseau) 
 rock_spawner()
 laser_spawner() 
  destruction()
vaisseau.velocityY/=1.3;
vaisseau.velocityX/=1.3; 
}
if(vie===0){ 
statut="perdu";

}
if(statut==="perdu"){
textSize(60);
fill("black");
text("Game over",310,200);
vaisseau.visible=false;
laser_groupe.destroyEach();
rock_groupe.destroyEach();
play.visible=true; 
if (score>bestscore){
bestscore=score;
}
if(mousePressedOver(play)){
vie=3;
score=0;
vaisseau.visible=true;
statut="play";
}
}                                                      
}

function traverser(sprite){
  
if (sprite.x>LARGEUR){
sprite.x=0;
}

if (sprite.x<0){
sprite.x=LARGEUR;
}

if (sprite.y>HAUTEUR){
sprite.y=0;
}

if (sprite.y<0){
sprite.y=HAUTEUR;
}

}

function rock_spawner(){
  if(World.frameCount%90 === 0){
      
    //positions aléatoire du rocher
    var rockX, rockY;
    rockX = LARGEUR*Math.random();
    rockY = HAUTEUR*Math.random();

    while(Math.abs(rockX - vaisseau.x) < 100 && Math.abs(rockY - vaisseau.y) < 100){
      rockX = LARGEUR*Math.random();
      rockY = HAUTEUR*Math.random();
    } 
      
    var rock = createSprite(rockX,rockY,30,30);
    rock.addImage(rockImg);
    rock.scale = 0.30;
    rock.rotationSpeed = 3*Math.random();
    rock.velocityY = (10*Math.random()-5)*(1+score/5000);
    rock.velocityX = (10*Math.random()-5)*(1+score/5000);
    rock.lifetime = 400;
        
    rock.setCollider("circle",0,0,220);
        
    rock_groupe.add(rock);
  }
}

function laser_spawner(){
  
  if(keyDown("space") && laser_groupe.length < 25){
    var laser;
    laser = createSprite(vaisseau.x, vaisseau.y);
    laser.addImage(laserImg);
    laser.scale = 0.9;
    laser.rotation = vaisseau.rotation;
    
    laser.x = vaisseau.x + 45*Math.cos(radians(vaisseau.rotation));
    laser.y = vaisseau.y + 45*Math.sin(radians(vaisseau.rotation));
    laser.velocityX = 8*Math.cos(radians(vaisseau.rotation));
    laser.velocityY = 8*Math.sin(radians(vaisseau.rotation));

    laser.lifetime = 100;
    
    laser_groupe.add(laser);
    laser.setCollider("rectangle",-10,0,120,60);
  }
}

function destruction(){
 for (var i = 0; i < rock_groupe.length; i++) {
if(rock_groupe.get(i).isTouching(vaisseau)){
var explosion=createSprite(rock_groupe.get(i).x,rock_groupe.get(i).y);
explosion.addAnimation("explosion",explosionImg);
explosion.lifetime=20;
explosion.scale=3;
rock_groupe.get(i).destroy(); 
score-=1;
vie-=1
}  
}      
}

function casse(){
for (var i = 0; i < laser_groupe.length; i++) {
for (var j = 0; j < rock_groupe.length; j++) {
if(laser_groupe.get(i).isTouching(rock_groupe.get(j))){
laser_groupe.get(i).destroy();
var explose = createSprite(rock_groupe.get(j).x,rock_groupe.get(j).y);
explose.addAnimation("explose",explosionImg);
explose.scale=1.5;
explose.lifetime=20;
rock_groupe.get(j).destroy();
score=score+1;
}
}
}
}
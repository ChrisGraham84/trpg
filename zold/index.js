//Limits
let min_x = 0;
let max_x = 275;
let min_y = 0;
let max_y = 100;
if(window.innerwidth < 700){
     min_x = 0;
     max_x = 575;
     min_y = 0;
     max_y = 375;
}
//global start
let score = 0;
let units = [];
let enemyunits = [];

//get game div
const game = document.getElementById('game');

//set up play area
const play_area = document.createElement('section');
play_area.classList.add('play-area');

const fighter_area = document.createElement('div');
fighter_area.classList.add('area', 'fighter-area');

const enemy_area = document.createElement('div');
enemy_area.classList.add('area', 'enemy-area');

play_area.appendChild(fighter_area);
play_area.appendChild(enemy_area);

//set up inventory area
const play_inventory = document.createElement('section');
play_inventory.classList.add('play-inventory');

//set up score area
const play_ui = document.createElement('section');
play_ui.classList.add('play-ui');
const score_ui = document.createElement('span');
score_ui.innerHTML = `SCORE: ${score}`;
play_ui.appendChild(score_ui);

//createPlayUnit();


game.appendChild(play_area);

const add_fighter = document.createElement('div');
add_fighter.classList.add('auto-margin', 'btn');
add_fighter.innerText = "Add Fighter";
add_fighter.addEventListener('click', createFighter);
game.appendChild(add_fighter);

const add_enemy = document.createElement('div');
add_enemy.classList.add('auto-margin', 'btn');
add_enemy.innerText = "Add Enemy";
add_enemy.addEventListener('click', createEnemy);
game.appendChild(add_enemy);

const logt = document.createElement('div');
logt.classList.add('auto-margin', 'btn');
logt.innerText = "Show log";
logt.addEventListener('click', () => {console.log(units, enemyunits)});
game.appendChild(logt);

game.appendChild(play_inventory);
game.appendChild(play_ui);

function createUnit(){
    return {
        name: "Test",
        el: document.createElement("div"),
        hp: 5,
        spd: 2,
        atk: 1
    };
}

function createFighter(){
    if(units.length < 4){
        const play_unit =  createUnit();
        play_unit.el.classList.add('play-unit');
        play_unit.el.addEventListener("click", () => console.log("Punch Punch" + play_unit.atk));
        //play_unit.dataset.hp = 4;
        //getRandomPoint(play_unit);
        getRandomColor(play_unit.el);
        fighter_area.appendChild(play_unit.el);
        units.push(play_unit);
    }
    
}

function createEnemy(){
    if(enemyunits.length < 4){
        const enemy_unit = document.createElement('div');
        enemy_unit.classList.add('play-unit');
        enemy_unit.addEventListener("click", () => console.log("claw swipe"));
        enemy_unit.dataset.hp = 4;
        //getRandomPoint(play_unit);
        getRandomColor(enemy_unit);
        enemy_area.appendChild(enemy_unit);
        enemyunits.push(enemy_unit);
    }
    
}

function getRandomColor(playUnit){
    var color = getColorList()[Math.floor(Math.random() * getColorList().length)]

    playUnit.style.backgroundColor = color;
}

function getRandomPoint(playUnit){
    var x = Math.floor(Math.random() * max_x);
    var y = Math.floor(Math.random() * max_y);

    playUnit.style.left = `${x}px`;
    playUnit.style.top = `${y}px`;
}


function getColorList(){
    const colorList = [
        "pink",
        "indianred",
        "lightcoral",
        "gold",
        "darkorange",
        "forestgreen",
        "springgreen",
        "olive",
        "darkolivegreen",
        "aqua",
        "darkturquoise",
        "teal",
        "powderblue",
        "cornflowerblue",
        "royalblue",
        "slateblue",
        "thisle",
        "mediumorchid",
        "darkviolet",
        //"mistyrose", to light
        "silver",
        "slategray",
        "burlywood",
        "rosybrown",
        "sandybrown",
        "peru",
        "sienna"
    ]

    return colorList;
}
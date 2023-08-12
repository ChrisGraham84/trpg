//get game div
const gameUI = document.getElementById("game");

//instructions until autobattler
const instruction = document.createElement('div')
instruction.style.color = "black";
instruction.style.fontWeight = "bold";
instruction.innerHTML = "left-click = attacker select <----------------> right-click = target select";


const timeIndicator = document.createElement("div");
timeIndicator.style.color = "red"


//create battleground
const battleground = document.createElement("div");
battleground.classList.add("wrapper")
gameUI.appendChild(battleground);
gameUI.appendChild(instruction);

gameUI.appendChild(timeIndicator);


//create columbs
const col1 = document.createElement("div");
const col2 = document.createElement("div");
const col3 = document.createElement("div");
const col4 = document.createElement("div");

col1.id = "box1";
col2.id = "box2";
col3.id = "box3";
col4.id = "box4";

battleground.appendChild(col1);
battleground.appendChild(col2);
battleground.appendChild(col3);
battleground.appendChild(col4);

const detail1 = document.createElement("div");
const detail2 = document.createElement("div");
const detail3 = document.createElement("div");
const detail4 = document.createElement("div");

detail1.classList.add("centerblock");
detail2.classList.add("centerblock");
detail3.classList.add("centerblock");
detail4.classList.add("centerblock");

detail4.id = "hero-detail";
detail4.innerHTML = "Detail<br/>";

col2.appendChild(detail1);
col2.appendChild(detail2);
col2.appendChild(detail3);
col2.appendChild(detail4);

var btnAttack = document.getElementById("btnAttack");
var btnGenerateField = document.getElementById("btnGenerateField");
var heroDet = document.getElementById("hero-detail")
var selectedunit = null;
var targetedunit = null;
var units = [];
var paused = false;

  //----global timer action
        //create set intraval countdown
        //when countown reaches 0, cycle through selectable targets

        
       function globalTineStart(){
        if(paused == false){
            var t = new Date()
            var countDownDate = t.setSeconds(t.getSeconds() + 4);
            var x = setInterval(()=>{
            var now = new Date().getTime();
            var remainingTime = countDownDate - now;
        
            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
            var hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
        
            timeIndicator.innerHTML = `COUNTDOWN: ${seconds}s`
            timeIndicator.style.color = "red";
        
                if(remainingTime < 0){
                    clearInterval(x);
                    timeIndicator.innerHTML = "ACTION";
                    timeIndicator.style.color = "green";
                    var heros = units.filter(x=> x.isenemy == false);
                    var enemies = units.filter(y=>y.isenemy == true);
                    
                    /*var h = 0;
                    function loop(){
                        setTimeout(() => {
                            attack(heros[h], targetedunit)
                            h++
                            if(h < heros.length){
                                loop();
                            }
                        }, 500)
                    }
                    loop();*/

                    attack(selectedunit,targetedunit)

                    globalTineStart();
                }
        
            },1000);
        }    

       }
      


        //----per character time action
        //each character has a time as it is created
        //(additionally make a time progress bar)
        //when the timer reaches 0, acharacter acts
        //(additionally make the ability to select action during count down)
        

generateField();
globalTineStart();

function draw() {
    for (let i = 0; i < units.length; i++) {
           units[i].el.classList.remove("selectedUnit")
           units[i].el.classList.remove("targetedUnit")

           units[i].el.children.namedItem(units[i].props.name +"HP").value = units[i].props.hp
    }
    if(selectedunit){
        selectedunit.el.classList.add("selectedUnit");
    }
    if(targetedunit){
        targetedunit.el.classList.add("targetedUnit");
    }
}

function createUnit(elName, isenemy){
    var parentEl = document.createElement("div");
    parentEl.id = elName;
    var blk = null;
    if(isenemy){
        parentEl.classList.add("enemyblock") 
        blk = document.getElementById("box3");
    }
    else{
        parentEl.classList.add("heroblock")
        blk = document.getElementById("box1");
    }
    blk.appendChild(parentEl);
    
    //unit
    var unit = {
        id: elName,
        el: parentEl,
        isenemy: isenemy,
        props: {
            name: getRandomName(),
            hp: isenemy ? 100 : 10,
            mp: 10,
            atk: 5,
            def: 5,
            agi: 5,
            mag: 5
        }
    }

    unitimg = document.createElement('img');
    unitimg.src = unit.isenemy == true ? "img/" + getRandomeEnemyImage() : "img/porkchop_patch.png";
    unitimg.alt = unit.props.name;
    unit.el.appendChild(unitimg);

    unit.el.appendChild(document.createElement("br"));

    unithp = document.createElement('progress');
    unithp.max = unit.props.hp;
    unithp.value = unit.props.hp;
    unithp.id = unit.props.name +"HP";
    unit.el.appendChild(unithp);

    unit.el.addEventListener('click', function () {
        setSelected(units.find(x => this.id == x.el.id));
        showDetail(selectedunit, heroDet);
        draw();
    })

    unit.el.addEventListener('contextmenu', function (ev) {
        ev.preventDefault();
        setTarget(units.find(x => this.id == x.el.id));
        showDetail(targetedunit, heroDet);
        draw();
        return false;
    })
    units.push(unit);
}

function generateField(){
               
    units = [];
    selectedunit = null;
    targetedunit = null;
    document.getElementById("box1").innerText = "";
    document.getElementById("box3").innerText = "";

    for (let i = 0; i < 2; i++) {
        createUnit("Hero" + i, false);
    }

    for (let i = 0; i < 3; i++) {
        createUnit("Enemy" + i, true);
    }

    draw();
}

function attack(attacker, target){
    if((attacker && target) && attacker !== target && target.props.hp > 0 && attacker.props.hp >0){
        var attackClass = attacker.isenemy ? "give-damage" : "hr-give-damage";
        var targetClass = target.isenemy ? "take-damage" : "hr-take-damage"; 

        target.props.hp -= attacker.props.atk;
        attacker.el.children[0].classList.add(attackClass);
        setTimeout(() => attacker.el.children[0].classList.remove(attackClass), 300);

        target.el.children[0].classList.add(targetClass);
        setTimeout(() => target.el.children[0].classList.remove(targetClass), 200);
    }
    if(target && target.props.hp <= 0){
        target.el.children[0].classList.add("ded");
    }
    draw()
}

function showDetail(unit, panel){
    panel.innerText = "";
    if(unit){
        var name = document.createElement("div");
        var hp = document.createElement("div");
        var mp = document.createElement("div");
        var atk = document.createElement("div");
        var mag = document.createElement("div");
        var def = document.createElement("div");
        var agi = document.createElement("div");

        name.innerText = "Name: " + unit.props.name
        hp.innerText = "HP: " + unit.props.hp
        mp.innerText = "MP: " + unit.props.mp
        atk.innerText = "Attack: " + unit.props.atk
        mag.innerText = "Magic: " + unit.props.mag
        def.innerText = "Defense: " + unit.props.def
        agi.innerText = "Agility: " + unit.props.agi

        panel.append(...[name,hp,mp,atk,mag,def,agi])
    }
   
}

function setSelected(selected){
    if(selected === selectedunit){
        selectedunit = null;
    }
    else{
        selectedunit = null;
        selectedunit = selected;
    }
}
function setTarget(targeted){
    console.log(targeted);
    if(targeted == targetedunit){
        targetedunit = null;
    }
    else{
        targetedunit = targeted;
    }
}

function getRandomName(){
    return getNameList()[Math.floor(Math.random() * getNameList().length)]
}

function getRandomeEnemyImage(){
    return getEnemyImage()[Math.floor(Math.random() * getEnemyImage().length)]
}

btnGenerateField.addEventListener( 'click', function(){
    generateField();
} )

btnAttack.addEventListener('click', function() {
   /* this.enabled = false;
    if(selectedunit){
        attack(selectedunit, targetedunit)
    }*/
    if(paused)
    {
        paused = false;
        this.innerHTML = "Pause";
        globalTineStart();
    }
    else
    {
        paused = true;
        this.innerHTML = "Unpause";
    }
})


function getEnemyImage(){
    return [
        "bug_man.png",
        "coo_ki.png",
        "coolwizarddog.png",
        "good_morning.png",
        "i_scream.png",
        "jelly_bean.png",
        "mad_bird.png",
        "peep_mad.png",
        "poptart.png",
        "shot_talk.png",
        "taco_hi.png",
        "toasted.png"
    ]
}

function getNameList(){
   return [
   "Liam",
    "Noah",
    "Oliver",
    "Elijah",
    "William",
    "James",
    "Benjamin",
    "Lucas",
    "Henry",
    "Alexander",
    "Mason",
    "Michael",
    "Ethan",
    "Daniel",
    "Jacob",
    "Logan",
    "Jackson",
    "Levi",
    "Sebastian",
    "Mateo",
    "Jack",
    "Owen",
    "Theodore",
    "Aiden",
    "Samuel",
    "Joseph",
    "John",
    "David",
    "Wyatt",
    "Matthew",
    "Luke",
    "Asher",
    "Carter",
    "Julian",
    "Grayson",
    "Leo",
    "Jayden",
    "Gabriel",
    "Isaac",
    "Lincoln",
    "Anthony",
    "Hudson",
    "Dylan",
    "Ezra",
    "Thomas",
    "Charles",
    "Christopher",
    "Jaxon",
    "Maverick",
    "Josiah",
    "Isaiah",
    "Andrew",
    "Elias",
    "Joshua",
    "Nathan",
    "Caleb",
    "Ryan",
    "Adrian",
    "Miles",
    "Eli",
    "Nolan",
    "Christian",
    "Aaron",
    "Cameron",
    "Ezekiel",
    "Colton",
    "Luca",
    "Landon",
    "Hunter",
    "Jonathan",
    "Santiago",
    "Axel",
    "Easton",
    "Cooper",
    "Jeremiah",
    "Angel",
    "Roman",
    "Connor",
    "Jameson",
    "Robert",
    "Greyson",
    "Jordan",
    "Ian",
    "Carson",
    "Jaxson",
    "Leonardo",
    "Nicholas",
    "Dominic",
    "Austin",
    "Everett",
    "Brooks",
    "Xavier",
    "Kai",
    "Jose",
    "Parker",
    "Adam",
    "Jace",
    "Wesley",
    "Kayden",
    "Silas",
    "Bennett",
    "Declan",
    "Waylon",
    "Weston",
    "Evan",
    "Emmett",
    "Micah",
    "Ryder",
    "Beau",
    "Damian",
    "Brayden",
    "Gael",
    "Rowan",
    "Harrison",
    "Bryson",
    "Sawyer",
    "Amir",
    "Kingston",
    "Jason",
    "Giovanni",
    "Vincent",
    "Ayden",
    "Chase",
    "Myles",
    "Diego",
    "Nathaniel",
    "Legend",
    "Jonah",
    "River",
    "Tyler",
    "Cole",
    "Braxton",
    "George",
    "Milo",
    "Zachary",
    "Ashton",
    "Luis",
    "Jasper",
    "Kaiden",
    "Adriel",
    "Gavin",
    "Bentley",
    "Calvin",
    "Zion",
    "Juan",
    "Maxwell",
    "Max",
    "Ryker",
    "Carlos",
    "Emmanuel",
    "Jayce",
    "Lorenzo",
    "Ivan",
    "Jude",
    "August",
    "Kevin",
    "Malachi",
    "Elliott",
    "Rhett",
    "Archer",
    "Karter",
    "Arthur",
    "Luka",
    "Elliot",
    "Thiago",
    "Brandon",
    "Camden",
    "Justin",
    "Jesus",
    "Maddox",
    "King",
    "Theo",
    "Enzo",
    "Matteo",
    "Emiliano",
    "Dean",
    "Hayden",
    "Finn",
    "Brody",
    "Antonio",
    "Abel",
    "Alex",
    "Tristan",
    "Graham",
    "Zayden",
    "Judah",
    "Xander",
    "Miguel",
    "Atlas",
    "Messiah",
    "Barrett",
    "Tucker",
    "Timothy",
    "Alan",
    "Edward",
    "Leon",
    "Dawson",
    "Eric",
    "Ace",
    "Victor",
    "Abraham",
    "Nicolas",
    "Jesse",
    "Charlie",
    "Patrick",
    "Walker",
    "Joel",
    "Richard",
    "Beckett",
    "Blake",
    "Alejandro",
    "Avery",
    "Grant",
    "Peter",
    "Oscar",
    "Matias",
    "Amari",
    "Lukas",
    "Andres",
    "Arlo",
    "Colt",
    "Adonis",
    "Kyrie",
    "Steven",
    "Felix",
    "Preston",
    "Marcus",
    "Holden",
    "Emilio",
    "Remington",
    "Jeremy",
    "Kaleb",
    "Brantley",
    "Bryce",
    "Mark",
    "Knox",
    "Israel",
    "Phoenix",
    "Kobe",
    "Nash",
    "Griffin",
    "Caden",
    "Kenneth",
    "Kyler",
    "Hayes",
    "Jax",
    "Rafael",
    "Beckham",
    "Javier",
    "Maximus",
    "Simon",
    "Paul",
    "Omar",
    "Kaden",
    "Kash",
    "Lane",
    "Bryan",
    "Riley",
    "Zane",
    "Louis",
    "Aidan",
    "",
    "Paxton",
    "Maximiliano",
    "Karson",
    "Cash",
    "Cayden",
    "Emerson",
    "Tobias",
    "Ronan",
    "Brian",
    "Dallas",
    "Bradley",
    "Jorge",
    "Walter",
    "Josue",
    "Khalil",
    "Damien",
    "Jett",
    "Kairo",
    "Zander",
    "Andre",
    "Cohen",
    "Crew",
    "Hendrix",
    "Colin",
    "Chance",
    "Malakai",
    "Clayton",
    "Daxton",
    "Malcolm",
    "Lennox",
    "Martin",
    "Jaden",
    "Kayson",
    "Bodhi",
    "Francisco",
    "Cody",
    "Erick",
    "Kameron",
    "Atticus",
    "Dante",
    "Jensen",
    "Cruz",
    "Finley",
    "Brady",
    "Joaquin",
    "Anderson",
    "Gunner",
    "Muhammad",
    "Zayn",
    "Derek",
    "Raymond",
    "Kyle",
    "Angelo",
    "Reid",
    "Spencer",
    "Nico",
    "Jaylen",
    "Jake",
    "Prince",
    "Manuel",
    "Ali",
    "Gideon",
    "Stephen",
    "Ellis",
    "Orion",
    "Rylan",
    "Eduardo",
    "Mario",
    "Rory",
    "Cristian",
    "Odin",
    "Tanner",
    "Julius",
    "Callum",
    "Sean",
    "Kane",
    "Ricardo",
    "Travis",
    "Wade",
    "Warren",
    "Fernando",
    "Titus",
    "Leonel",
    "Edwin",
    "Cairo",
    "Corbin",
    "Dakota",
    "Ismael",
    "Colson",
    "Killian",
    "Major",
    "Tate",
    "Gianni",
    "Elian",
    "Remy",
    "Lawson",
    "Niko",
    "Nasir",
    "Kade",
    "Armani",
    "Ezequiel",
    "Marshall",
    "Hector",
    "Desmond",
    "Kason",
    "Garrett",
    "Jared",
    "Cyrus",
    "Russell",
    "Cesar",
    "Tyson",
    "Malik",
    "Donovan",
    "Jaxton",
    "Cade",
    "Romeo",
    "Nehemiah",
    "Sergio",
    "Iker",
    "Caiden",
    "Jay",
    "Pablo",
    "Devin",
    "Jeffrey",
    "Otto",
    "Kamari",
    "Ronin",
    "Johnny",
    "Clark",
    "Ari",
    "Marco",
    "",
    "Edgar",
    "Bowen",
    "Jaiden",
    "Grady",
    "Zayne",
    "Sullivan",
    "Jayceon",
    "Sterling",
    "Andy",
    "Conor",
    "Raiden",
    "Royal",
    "Royce",
    "Solomon",
    "Trevor",
    "Winston",
    "Emanuel",
    "Finnegan",
    "Pedro",
    "Luciano",
    "Harvey",
    "Franklin",
    "Noel",
    "Troy",
    "Princeton",
    "Johnathan",
    "Erik",
    "Fabian",
    "Oakley",
    "Rhys",
    "Porter",
    "Hugo",
    "Frank",
    "Damon",
    "Kendrick",
    "Mathias",
    "Milan",
    "Peyton",
    "Wilder",
    "Callan",
    "Gregory",
    "Seth",
    "Matthias",
    "Briggs",
    "Ibrahim",
    "Roberto",
    "Conner",
    "Quinn",
    "Kashton",
    "Sage",
    "Santino",
    "Kolton",
    "Alijah",
    "Dominick",
    "Zyaire",
    "Apollo",
    "Kylo",
    "Reed",
    "Philip",
    "Kian",
    "Shawn",
    "Kaison",
    "Leonidas",
    "Ayaan",
    "Lucca",
    "Memphis",
    "Ford",
    "Baylor",
    "Kyson",
    "Uriel",
    "Allen",
    "Collin",
    "Ruben",
    "Archie",
    "Dalton",
    "Esteban",
    "Adan",
    "Forrest",
    "Alonzo",
    "Isaias",
    "Leland",
    "Jase",
    "Dax",
    "Kasen",
    "Gage",
    "Kamden",
    "Marcos",
    "Jamison",
    "Francis",
    "Hank",
    "Alexis",
    "Tripp",
    "Frederick",
    "Jonas",
    "Stetson",
    "Cassius",
    "Izaiah",
    "Eden",
    "Maximilian",
    "Rocco",
    "Tatum",
    "Keegan",
    "Aziel",
    "Moses",
    "Bruce",
    "Lewis",
    "Braylen",
    "Omari",
    "Mack",
    "Augustus",
    "Enrique",
    "Armando",
    "Pierce",
    "Moises",
    "Asa",
    "Shane",
    "Emmitt",
    "Soren",
    "Dorian",
    "Keanu",
    "Zaiden",
    "Raphael",
    "Deacon",
    "Abdiel",
    "Kieran",
    "Phillip",
    "Ryland",
    "Zachariah",
    "",
    "Casey",
    "Zaire",
    "Albert",
    "Baker",
    "Corey",
    "Kylan",
    "Denver",
    "Gunnar",
    "Jayson",
    "Drew",
    "Callen",
    "Jasiah",
    "Drake",
    "Kannon",
    "Braylon",
    "Sonny",
    "Bo",
    "Moshe",
    "Huxley",
    "Quentin",
    "Rowen",
    "Santana",
    "Cannon",
    "Kenzo",
    "Wells",
    "Julio",
    "Nikolai",
    "Conrad",
    "Jalen",
    "Makai",
    "Benson",
    "Derrick",
    "Gerardo",
    "Davis",
    "Abram",
    "Mohamed",
    "Ronald",
    "Raul",
    "Arjun",
    "Dexter",
    "Kaysen",
    "Jaime",
    "Scott",
    "Lawrence",
    "Ariel",
    "Skyler",
    "Danny",
    "Roland",
    "Chandler",
    "Yusuf",
    "Samson",
    "Case",
    "Zain",
    "Roy",
    "Rodrigo",
    "Sutton",
    "Boone",
    "Saint",
    "Saul",
    "Jaziel",
    "Hezekiah",
    "Alec",
    "Arturo",
    "Jamari",
    "Jaxtyn",
    "Julien",
    "Koa",
    "Reece",
    "Landen",
    "Koda",
    "Darius",
    "Sylas",
    "Ares",
    "Kyree",
    "Boston",
    "Keith",
    "Taylor",
    "Johan",
    "Edison",
    "Sincere",
    "Watson",
    "Jerry",
    "Nikolas",
    "Quincy",
    "Shepherd",
    "Brycen",
    "Marvin",
    "Dariel",
    "Axton",
    "Donald",
    "Bodie",
    "Finnley",
    "Onyx",
    "Rayan",
    "Raylan",
    "Brixton",
    "Colby",
    "Shiloh",
    "Valentino",
    "Layton",
    "Trenton",
    "Landyn",
    "Alessandro",
    "Ahmad",
    "Gustavo",
    "Ledger",
    "Ridge",
    "Ander",
    "Ahmed",
    "Kingsley",
    "Issac",
    "Mauricio",
    "Tony",
    "Leonard",
    "Mohammed",
    "Uriah",
    "Duke",
    "Kareem",
    "Lucian",
    "Marcelo",
    "Aarav",
    "Leandro",
    "Reign",
    "Clay",
    "Kohen",
    "Dennis",
    "Samir",
    "Ermias",
    "Otis",
    "Emir",
    "Nixon",
    "",
    "Ty",
    "Sam",
    "Fletcher",
    "Wilson",
    "Dustin",
    "Hamza",
    "Bryant",
    "Flynn",
    "Lionel",
    "Mohammad",
    "Cason",
    "Jamir",
    "Aden",
    "Dakari",
    "Justice",
    "Dillon",
    "Layne",
    "Zaid",
    "Alden",
    "Nelson",
    "Devon",
    "Titan",
    "Chris",
    "Khari",
    "Zeke",
    "Noe",
    "Alberto",
    "Roger",
    "Brock",
    "Rex",
    "Quinton",
    "Alvin",
    "Cullen",
    "Azariah",
    "Harlan",
    "Kellan",
    "Lennon",
    "Marcel",
    "Keaton",
    "Morgan",
    "Ricky",
    "Trey",
    "Karsyn",
    "Langston",
    "Miller",
    "Chaim",
    "Salvador",
    "Amias",
    "Tadeo",
    "Curtis",
    "Lachlan",
    "Amos",
    "Anakin",
    "Krew",
    "Tomas",
    "Jefferson",
    "Yosef",
    "Bruno",
    "Korbin",
    "Augustine",
    "Cayson",
    "Mathew",
    "Vihaan",
    "Jamie",
    "Clyde",
    "Brendan",
    "Jagger",
    "Carmelo",
    "Harry",
    "Nathanael",
    "Mitchell",
    "Darren",
    "Ray",
    "Jedidiah",
    "Jimmy",
    "Lochlan",
    "Bellamy",
    "Eddie",
    "Rayden",
    "Reese",
    "Stanley",
    "Joe",
    "Houston",
    "Douglas",
    "Vincenzo",
    "Casen",
    "Emery",
    "Joziah",
    "Leighton",
    "Marcellus",
    "Atreus",
    "Aron",
    "Hugh",
    "Musa",
    "Tommy",
    "Alfredo",
    "Junior",
    "Neil",
    "Westley",
    "Banks",
    "Eliel",
    "Melvin",
    "Maximo",
    "Briar",
    "Colten",
    "Lance",
    "Nova",
    "Trace",
    "Axl",
    "Ramon",
    "Vicente",
    "Brennan",
    "Caspian",
    "Remi",
    "Deandre",
    "Legacy",
    "Lee",
    "Valentin",
    "Ben",
    "Louie",
    "Westin",
    "Wayne",
    "Benicio",
    "Grey",
    "Zayd",
    "Gatlin",
    "Mekhi",
    "Orlando",
    "Bjorn",
    "Harley",
    "Alonso",
    "",
    "Rio",
    "Aldo",
    "Byron",
    "Eliseo",
    "Ernesto",
    "Talon",
    "Thaddeus",
    "Brecken",
    "Kace",
    "Kellen",
    "Enoch",
    "Kiaan",
    "Lian",
    "Creed",
    "Rohan",
    "Callahan",
    "Jaxxon",
    "Ocean",
    "Crosby",
    "Dash",
    "Gary",
    "Mylo",
    "Ira",
    "Magnus",
    "Salem",
    "Abdullah",
    "Kye",
    "Tru",
    "Forest",
    "Jon",
    "Misael",
    "Madden",
    "Braden",
    "Carl",
    "Hassan",
    "Emory",
    "Kristian",
    "Alaric",
    "Ambrose",
    "Dario",
    "Allan",
    "Bode",
    "Boden",
    "Juelz",
    "Kristopher",
    "Genesis",
    "Idris",
    "Ameer",
    "Anders",
    "Darian",
    "Kase",
    "Aryan",
    "Dane",
    "Guillermo",
    "Elisha",
    "Jakobe",
    "Thatcher",
    "Eugene",
    "Ishaan",
    "Larry",
    "Wesson",
    "Yehuda",
    "Alvaro",
    "Bobby",
    "Bronson",
    "Dilan",
    "Kole",
    "Kyro",
    "Tristen",
    "Blaze",
    "Brayan",
    "Jadiel",
    "Kamryn",
    "Demetrius",
    "Maurice",
    "Arian",
    "Kabir",
    "Rocky",
    "Rudy",
    "Randy",
    "Rodney",
    "Yousef",
    "Felipe",
    "Robin",
    "Aydin",
    "Dior",
    "Kaiser",
    "Van",
    "Brodie",
    "London",
    "Eithan",
    "Stefan",
    "Ulises",
    "Camilo",
    "Branson",
    "Jakari",
    "Judson",
    "Yahir",
    "Zavier",
    "Damari",
    "Jakob",
    "Jaxx",
    "Bentlee",
    "Cain",
    "Niklaus",
    "Rey",
    "Zahir",
    "Aries",
    "Blaine",
    "Kyng",
    "Castiel",
    "Henrik",
    "Joey",
    "Khalid",
    "Bear",
    "Graysen",
    "Jair",
    "Kylen",
    "Darwin",
    "Alfred",
    "Ayan",
    "Kenji",
    "Zakai",
    "Avi",
    "Cory",
    "Fisher",
    "Jacoby",
    "Osiris",
    "Harlem",
    "Jamal",
    "Santos",
    "Wallace",
    "Brett",
    "Fox",
    "Leif",
    "",
    "Maison",
    "Reuben",
    "Adler",
    "Zev",
    "Calum",
    "Kelvin",
    "Zechariah",
    "Bridger",
    "Mccoy",
    "Seven",
    "Shepard",
    "Azrael",
    "Leroy",
    "Terry",
    "Harold",
    "Mac",
    "Mordechai",
    "Ahmir",
    "Cal",
    "Franco",
    "Trent",
    "Blaise",
    "Coen",
    "Dominik",
    "Marley",
    "Davion",
    "Jeremias",
    "Riggs",
    "Jones",
    "Will",
    "Damir",
    "Dangelo",
    "Canaan",
    "Dion",
    "Jabari",
    "Landry",
    "Salvatore",
    "Kody",
    "Hakeem",
    "Truett",
    "Gerald",
    "Lyric",
    "Gordon",
    "Jovanni",
    "Kamdyn",
    "Alistair",
    "Cillian",
    "Foster",
    "Terrance",
    "Murphy",
    "Zyair",
    "Cedric",
    "Rome",
    "Abner",
    "Colter",
    "Dayton",
    "Jad",
    "Xzavier",
    "Rene",
    "Vance",
    "Duncan",
    "Frankie",
    "Bishop",
    "Davian",
    "Everest",
    "Heath",
    "Jaxen",
    "Marlon",
    "Maxton",
    "Reginald",
    "Harris",
    "Jericho",
    "Keenan",
    "Korbyn",
    "Wes",
    "Eliezer",
    "Jeffery",
    "Kalel",
    "Kylian",
    "Turner",
    "Willie",
    "Rogelio",
    "Ephraim",
    "Olivia",
    "Emma",
    "Ava",
    "Charlotte",
    "Sophia",
    "Amelia",
    "Isabella",
    "Mia",
    "Evelyn",
    "Harper",
    "Camila",
    "Gianna",
    "Abigail",
    "Luna",
    "Ella",
    "Elizabeth",
    "Sofia",
    "Emily",
    "Avery",
    "Mila",
    "Scarlett",
    "Eleanor",
    "Madison",
    "Layla",
    "Penelope",
    "Aria",
    "Chloe",
    "Grace",
    "Ellie",
    "Nora",
    "Hazel",
    "Zoey",
    "Riley",
    "Victoria",
    "Lily",
    "Aurora",
    "Violet",
    "Nova",
    "Hannah",
    "Emilia",
    "Zoe",
    "Stella",
    "Everly",
    "Isla",
    "Leah",
    "Lillian",
    "Addison",
    "Willow",
    "Lucy",
    "Paisley",
    "Natalie",
    "Naomi",
    "Eliana",
    "Brooklyn",
    "Elena",
    "Aubrey",
    "Claire",
    "Ivy",
    "Kinsley",
    "Audrey",
    "Maya",
    "Genesis",
    "Skylar",
    "Bella",
    "Aaliyah",
    "Madelyn",
    "Savannah",
    "Anna",
    "Delilah",
    "Serenity",
    "Caroline",
    "Kennedy",
    "Valentina",
    "Ruby",
    "Sophie",
    "Alice",
    "Gabriella",
    "Sadie",
    "Ariana",
    "Allison",
    "Hailey",
    "Autumn",
    "Nevaeh",
    "Natalia",
    "Quinn",
    "Josephine",
    "Sarah",
    "Cora",
    "Emery",
    "Samantha",
    "Piper",
    "Leilani",
    "Eva",
    "Everleigh",
    "Madeline",
    "Lydia",
    "Jade",
    "Peyton",
    "Brielle",
    "Adeline",
    "Vivian",
    "Rylee",
    "Clara",
    "Raelynn",
    "Melanie",
    "Melody",
    "Julia",
    "Athena",
    "Maria",
    "Liliana",
    "Hadley",
    "Arya",
    "Rose",
    "Reagan",
    "Eliza",
    "Adalynn",
    "Kaylee",
    "Lyla",
    "Mackenzie",
    "Alaia",
    "Isabelle",
    "Charlie",
    "Arianna",
    "Mary",
    "Remi",
    "Margaret",
    "Iris",
    "Parker",
    "Ximena",
    "Eden",
    "Ayla",
    "Kylie",
    "Elliana",
    "Josie",
    "Katherine",
    "Faith",
    "Alexandra",
    "Eloise",
    "Adalyn",
    "Amaya",
    "Jasmine",
    "Amara",
    "Daisy",
    "Reese",
    "Valerie",
    "Brianna",
    "Cecilia",
    "Andrea",
    "Summer",
    "Valeria",
    "Norah",
    "Ariella",
    "Esther",
    "Ashley",
    "Emerson",
    "Aubree",
    "Isabel",
    "Anastasia",
    "Ryleigh",
    "Khloe",
    "Taylor",
    "Londyn",
    "Lucia",
    "Emersyn",
    "Callie",
    "Sienna",
    "Blakely",
    "Kehlani",
    "Genevieve",
    "Alina",
    "Bailey",
    "Juniper",
    "Maeve",
    "Molly",
    "Harmony",
    "Georgia",
    "Magnolia",
    "Catalina",
    "Freya",
    "Juliette",
    "Sloane",
    "June",
    "Sara",
    "Ada",
    "Kimberly",
    "River",
    "Ember",
    "Juliana",
    "Aliyah",
    "Millie",
    "Brynlee",
    "Teagan",
    "Morgan",
    "Jordyn",
    "London",
    "Alaina",
    "Olive",
    "Rosalie",
    "Alyssa",
    "Ariel",
    "Finley",
    "Arabella",
    "Journee",
    "Hope",
    "Leila",
    "Alana",
    "Gemma",
    "Vanessa",
    "Gracie",
    "Noelle",
    "Marley",
    "Elise",
    "Presley",
    "Kamila",
    "Zara",
    "Amy",
    "Kayla",
    "Payton",
    "Blake",
    "Ruth",
    "Alani",
    "Annabelle",
    "Sage",
    "Aspen",
    "Laila",
    "Lila",
    "Rachel",
    "Trinity",
    "Daniela",
    "Alexa",
    "Lilly",
    "Lauren",
    "Elsie",
    "Margot",
    "Adelyn",
    "Zuri",
    "Brooke",
    "Sawyer",
    "Lilah",
    "Lola",
    "Selena",
    "Mya",
    "Sydney",
    "Diana",
    "Ana",
    "Vera",
    "Alayna",
    "Nyla",
    "Elaina",
    "Rebecca",
    "Angela",
    "Kali",
    "Alivia",
    "Raegan",
    "Rowan",
    "Phoebe",
    "",
    "Camilla",
    "Joanna",
    "Malia",
    "Vivienne",
    "Dakota",
    "Brooklynn",
    "Evangeline",
    "Camille",
    "Jane",
    "Nicole",
    "Catherine",
    "Jocelyn",
    "Julianna",
    "Lena",
    "Lucille",
    "Mckenna",
    "Paige",
    "Adelaide",
    "Charlee",
    "Mariana",
    "Myla",
    "Mckenzie",
    "Tessa",
    "Miriam",
    "Oakley",
    "Kailani",
    "Alayah",
    "Amira",
    "Adaline",
    "Phoenix",
    "Milani",
    "Annie",
    "Lia",
    "Angelina",
    "Harley",
    "Cali",
    "Maggie",
    "Hayden",
    "Leia",
    "Fiona",
    "Briella",
    "Journey",
    "Lennon",
    "Saylor",
    "Jayla",
    "Kaia",
    "Thea",
    "Adriana",
    "Mariah",
    "Juliet",
    "Oaklynn",
    "Kiara",
    "Alexis",
    "Haven",
    "Aniyah",
    "Delaney",
    "Gracelynn",
    "Kendall",
    "Winter",
    "Lilith",
    "Logan",
    "Amiyah",
    "Evie",
    "Alexandria",
    "Gracelyn",
    "Gabriela",
    "Sutton",
    "Harlow",
    "Madilyn",
    "Makayla",
    "Evelynn",
    "Gia",
    "Nina",
    "Amina",
    "Giselle",
    "Brynn",
    "Blair",
    "Amari",
    "Octavia",
    "Michelle",
    "Talia",
    "Demi",
    "Alaya",
    "Kaylani",
    "Izabella",
    "Fatima",
    "Tatum",
    "Makenzie",
    "Lilliana",
    "Arielle",
    "Palmer",
    "Melissa",
    "Willa",
    "Samara",
    "Destiny",
    "Dahlia",
    "Celeste",
    "Ainsley",
    "Rylie",
    "Reign",
    "Laura",
    "Adelynn",
    "Gabrielle",
    "Remington",
    "Wren",
    "Brinley",
    "Amora",
    "Lainey",
    "Collins",
    "Lexi",
    "Aitana",
    "Alessandra",
    "Kenzie",
    "Raelyn",
    "Elle",
    "Everlee",
    "Haisley",
    "Hallie",
    "Wynter",
    "Daleyza",
    "Gwendolyn",
    "Paislee",
    "",
    "Ariyah",
    "Veronica",
    "Heidi",
    "Anaya",
    "Cataleya",
    "Kira",
    "Avianna",
    "Felicity",
    "Aylin",
    "Miracle",
    "Sabrina",
    "Lana",
    "Ophelia",
    "Elianna",
    "Royalty",
    "Madeleine",
    "Esmeralda",
    "Joy",
    "Kalani",
    "Esme",
    "Jessica",
    "Leighton",
    "Ariah",
    "Makenna",
    "Nylah",
    "Viviana",
    "Camryn",
    "Cassidy",
    "Dream",
    "Luciana",
    "Maisie",
    "Stevie",
    "Kate",
    "Lyric",
    "Daniella",
    "Alicia",
    "Daphne",
    "Frances",
    "Charli",
    "Raven",
    "Paris",
    "Nayeli",
    "Serena",
    "Heaven",
    "Bianca",
    "Helen",
    "Hattie",
    "Averie",
    "Mabel",
    "Selah",
    "Allie",
    "Marlee",
    "Kinley",
    "Regina",
    "Carmen",
    "Jennifer",
    "Jordan",
    "Alison",
    "Stephanie",
    "Maren",
    "Kayleigh",
    "Angel",
    "Annalise",
    "Jacqueline",
    "Braelynn",
    "Emory",
    "Rosemary",
    "Scarlet",
    "Amanda",
    "Danielle",
    "Emelia",
    "Ryan",
    "Carolina",
    "Astrid",
    "Kensley",
    "Shiloh",
    "Maci",
    "Francesca",
    "Rory",
    "Celine",
    "Kamryn",
    "Zariah",
    "Liana",
    "Poppy",
    "Maliyah",
    "Keira",
    "Skyler",
    "Noa",
    "Skye",
    "Nadia",
    "Addilyn",
    "Rosie",
    "Eve",
    "Sarai",
    "Edith",
    "Jolene",
    "Maddison",
    "Meadow",
    "Charleigh",
    "Matilda",
    "Elliott",
    "Madelynn",
    "Holly",
    "Leona",
    "Azalea",
    "Katie",
    "Mira",
    "Ari",
    "Kaitlyn",
    "Danna",
    "Cameron",
    "Kyla",
    "Bristol",
    "Kora",
    "Armani",
    "Nia",
    "Malani",
    "Dylan",
    "Remy",
    "Maia",
    "Dior",
    "Legacy",
    "Alessia",
    "Shelby",
    "Maryam",
    "Sylvia",
    "",
    "Yaretzi",
    "Lorelei",
    "Madilynn",
    "Abby",
    "Helena",
    "Jimena",
    "Elisa",
    "Renata",
    "Amber",
    "Aviana",
    "Carter",
    "Emmy",
    "Haley",
    "Alondra",
    "Elaine",
    "Erin",
    "April",
    "Emely",
    "Imani",
    "Kennedi",
    "Lorelai",
    "Hanna",
    "Kelsey",
    "Aurelia",
    "Colette",
    "Jaliyah",
    "Kylee",
    "Macie",
    "Aisha",
    "Dorothy",
    "Charley",
    "Kathryn",
    "Adelina",
    "Adley",
    "Monroe",
    "Sierra",
    "Ailani",
    "Miranda",
    "Mikayla",
    "Alejandra",
    "Amirah",
    "Jada",
    "Jazlyn",
    "Jenna",
    "Jayleen",
    "Beatrice",
    "Kendra",
    "Lyra",
    "Nola",
    "Emberly",
    "Mckinley",
    "Myra",
    "Katalina",
    "Antonella",
    "Zelda",
    "Alanna",
    "Amaia",
    "Priscilla",
    "Briar",
    "Kaliyah",
    "Itzel",
    "Oaklyn",
    "Alma",
    "Mallory",
    "Novah",
    "Amalia",
    "Fernanda",
    "Alia",
    "Angelica",
    "Elliot",
    "Justice",
    "Mae",
    "Cecelia",
    "Gloria",
    "Ariya",
    "Virginia",
    "Cheyenne",
    "Aleah",
    "Jemma",
    "Henley",
    "Meredith",
    "Leyla",
    "Lennox",
    "Ensley",
    "Zahra",
    "Reina",
    "Frankie",
    "Lylah",
    "Nalani",
    "Reyna",
    "Saige",
    "Ivanna",
    "Aleena",
    "Emerie",
    "Ivory",
    "Leslie",
    "Alora",
    "Ashlyn",
    "Bethany",
    "Bonnie",
    "Sasha",
    "Xiomara",
    "Salem",
    "Adrianna",
    "Dayana",
    "Clementine",
    "Karina",
    "Karsyn",
    "Emmie",
    "Julie",
    "Julieta",
    "Briana",
    "Carly",
    "Macy",
    "Marie",
    "Oaklee",
    "Christina",
    "Malaysia",
    "Ellis",
    "Irene",
    "Anne",
    "Anahi",
    "Mara",
    "Rhea",
    "Davina",
    "Dallas",
    "",
    "Jayda",
    "Mariam",
    "Skyla",
    "Siena",
    "Elora",
    "Marilyn",
    "Jazmin",
    "Megan",
    "Rosa",
    "Savanna",
    "Allyson",
    "Milan",
    "Coraline",
    "Johanna",
    "Melany",
    "Chelsea",
    "Michaela",
    "Melina",
    "Angie",
    "Cassandra",
    "Yara",
    "Kassidy",
    "Liberty",
    "Lilian",
    "Avah",
    "Anya",
    "Laney",
    "Navy",
    "Opal",
    "Amani",
    "Zaylee",
    "Mina",
    "Sloan",
    "Romina",
    "Ashlynn",
    "Aliza",
    "Liv",
    "Malaya",
    "Blaire",
    "Janelle",
    "Kara",
    "Analia",
    "Hadassah",
    "Hayley",
    "Karla",
    "Chaya",
    "Cadence",
    "Kyra",
    "Alena",
    "Ellianna",
    "Katelyn",
    "Kimber",
    "Laurel",
    "Lina",
    "Capri",
    "Braelyn",
    "Faye",
    "Kamiyah",
    "Kenna",
    "Louise",
    "Calliope",
    "Kaydence",
    "Nala",
    "Tiana",
    "Aileen",
    "Sunny",
    "Zariyah",
    "Milana",
    "Giuliana",
    "Eileen",
    "Elodie",
    "Rayna",
    "Monica",
    "Galilea",
    "Journi",
    "Lara",
    "Marina",
    "Aliana",
    "Harmoni",
    "Jamie",
    "Holland",
    "Emmalyn",
    "Lauryn",
    "Chanel",
    "Tinsley",
    "Jessie",
    "Lacey",
    "Elyse",
    "Janiyah",
    "Jolie",
    "Ezra",
    "Marleigh",
    "Roselyn",
    "Lillie",
    "Louisa",
    "Madisyn",
    "Penny",
    "Kinslee",
    "Treasure",
    "Zaniyah",
    "Estella",
    "Jaylah",
    "Khaleesi",
    "Alexia",
    "Dulce",
    "Indie",
    "Maxine",
    "Waverly",
    "Giovanna",
    "Miley",
    "Saoirse",
    "Estrella",
    "Greta",
    "Rosalia",
    "Mylah",
    "Teresa",
    "Bridget",
    "Kelly",
    "Adalee",
    "Aubrie",
    "Lea",
    "Harlee",
    "Anika",
    "Itzayana",
    "Hana",
    "Kaisley",
    "",
    "Mikaela",
    "Naya",
    "Avalynn",
    "Margo",
    "Sevyn",
    "Florence",
    "Keilani",
    "Lyanna",
    "Joelle",
    "Kataleya",
    "Royal",
    "Averi",
    "Kallie",
    "Winnie",
    "Baylee",
    "Martha",
    "Pearl",
    "Alaiya",
    "Rayne",
    "Sylvie",
    "Brylee",
    "Jazmine",
    "Ryann",
    "Kori",
    "Noemi",
    "Haylee",
    "Julissa",
    "Celia",
    "Laylah",
    "Rebekah",
    "Rosalee",
    "Aya",
    "Bria",
    "Adele",
    "Aubrielle",
    "Tiffany",
    "Addyson",
    "Kai",
    "Bellamy",
    "Leilany",
    "Princess",
    "Chana",
    "Estelle",
    "Selene",
    "Sky",
    "Dani",
    "Thalia",
    "Ellen",
    "Rivka",
    "Amelie",
    "Andi",
    "Kynlee",
    "Raina",
    "Vienna",
    "Alianna",
    "Livia",
    "Madalyn",
    "Mercy",
    "Novalee",
    "Ramona",
    "Vada",
    "Berkley",
    "Gwen",
    "Persephone",
    "Milena",
    "Paula",
    "Clare",
    "Kairi",
    "Linda",
    "Paulina",
    "Kamilah",
    "Amoura",
    "Hunter",
    "Isabela",
    "Karen",
    "Marianna",
    "Sariyah",
    "Theodora",
    "Annika",
    "Kyleigh",
    "Nellie",
    "Scarlette",
    "Keyla",
    "Kailey",
    "Mavis",
    "Lilianna",
    "Rosalyn",
    "Sariah",
    "Tori",
    "Yareli",
    "Aubriella",
    "Bexley",
    "Bailee",
    "Jianna",
    "Keily",
    "Annabella",
    "Azariah",
    "Denisse",
    "Promise",
    "August",
    "Hadlee",
    "Halle",
    "Fallon",
    "Oakleigh",
    "Zaria",
    "Jaylin",
    "Paisleigh",
    "Crystal",
    "Ila",
    "Aliya",
    "Cynthia",
    "Giana",
    "Maleah",
    "Rylan",
    "Aniya",
    "Denise",
    "Emmeline",
    "Scout",
    "Simone",
    "Noah",
    "Zora",
    "Meghan",
    "Landry",
    "Ainhoa",
    "Lilyana",
    "",
    "Noor",
    "Belen",
    "Brynleigh",
    "Cleo",
    "Meilani",
    "Karter",
    "Amaris",
    "Frida",
    "Iliana",
    "Violeta",
    "Addisyn",
    "Nancy",
    "Denver",
    "Leanna",
    "Braylee",
    "Kiana",
    "Wrenley",
    "Barbara",
    "Khalani",
    "Aspyn",
    "Ellison",
    "Judith",
    "Robin",
    "Valery",
    "Aila",
    "Deborah",
    "Cara",
    "Clarissa",
    "Iyla",
    "Lexie",
    "Anais",
    "Kaylie",
    "Nathalie",
    "Alisson",
    "Della",
    "Addilynn",
    "Elsa",
    "Zoya",
    "Layne",
    "Marlowe",
    "Jovie",
    "Kenia",
    "Samira",
    "Jaylee",
    "Jenesis",
    "Etta",
    "Shay",
    "Amayah",
    "Avayah",
    "Egypt",
    "Flora",
    "Raquel",
    "Whitney",
    "Zola",
    "Giavanna",
    "Raya",
    "Veda",
    "Halo",
    "Paloma",
    "Nataly",
    "Whitley",
    "Dalary",
    "Drew",
    "Guadalupe",
    "Kamari",
    "Esperanza",
    "Loretta",
    "Malayah",
    "Natasha",
    "Stormi",
    "Ansley",
    "Carolyn",
    "Corinne",
    "Paola",
    "Brittany",
    "Emerald",
    "Freyja",
    "Zainab",
    "Artemis",
    "Jillian",
    "Kimora",
    "Zoie",
    "Aislinn",
    "Emmaline",
    "Ayleen",
    "Queen",
    "Jaycee",
    "Murphy",
    "Nyomi",
    "Elina",
    "Hadleigh",
    "Marceline",
    "Marisol",
    "Yasmin",
    "Zendaya",
    "Chandler",
    "Emani",
    "Jaelynn",
    "Kaiya",
    "Nathalia",
    "Violette",
    "Joyce",
    "Paityn",
    "Elisabeth",
    "Emmalynn",
    "Luella",
    "Yamileth",
    "Aarya",
    "Luisa",
    "Zhuri",
    "Araceli",
    "Harleigh",
    "Madalynn",
    "Melani",
    "Laylani",
    "Magdalena",
    "Mazikeen",
    "Belle",
    "Kadence"
   ]
}

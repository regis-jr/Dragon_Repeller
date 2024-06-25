let xp = 0;
let health = 100;
let gold = 50;
let currentWeaponIndex = 0;
let fighting;
let monsterHealth;
let inventory = ["Porrete"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");

const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");

const backgroundMusic = document.getElementById('backgroundMusic');

const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const weapons = [
{
    name: "Porrete",
    power: 5
},
{
    name: "Adaga",
    power: 30
},
{
    name: "Martelão",
    power: 50
},
{
    name: "Espada",
    power: 100
}
];

const monsters = [
    {
        name: "Zumbi",
        level: 2,
        health: 15
    },
    {
        name: "Besta implacável",
        level: 8,
        health: 60
    },
    {
        name: "Dragão",
        level: 20,
        health: 300
    }
];

const monsterHealthText = document.querySelector("#monsterHealth");
const locations = [{
    name: "town square",
    'button text': [
        "Vá para a loja \u{1F3E0}",
        "Vá para a caverna \u{1F573}",
        "Enfrentar o dragão \u{1F409}"
    ],
    'button functions': [
      goStore,
      goCave,
      fightDragon
    ],
    text: "Você está na praça da cidade. Você vê uma placa que diz \"Loja\".",
  },
    {
        name: "store",
        'button text': [
        "Comprar 10 de saúde (10 moedas)",
        "Comprar arma (30 moedas)",
        "Ir para a praça \u{1F3DB}"
    ],
        'button functions': [
        buyHealth,
        buyWeapon,
        goTown
    ],
    text: "Você entrou na loja."
    },
    {
        name: "cave",
        'button text': [
        "Lutar com Zumbi \u{1F9DF}",
        "Lutar com Besta Implacável \u{1F981}",
        "Ir para a praça \u{1F3DB}"
    ],
        'button functions': [
        fightSlime,
        fightBeast,
        goTown
    ],
    text: "Você entrou na caverna e encontrou alguns monstros."
    },
    {
        name: "fight",
        'button text': [
        "Ataque! \u{1F5E1}",
        "Desviar \u{1F6E1}",
        "Correr \u{1F413}"
    ],
        'button functions': [
        attack,
        dodge,
        goTown
    ],
    text: "Você está lutando com um monstro!"
    },
    {
        name: "kill monster",
        'button text': [
        "Ir para a cidade",
        "Ir para a cidade",
        "Ir para a cidade"
    ],
        'button functions': [
        goTown,
        goTown,
        easterEgg
    ],
    text: 'O monstro gritou "Arg!" e morreu... Você ganhou moedas e experiência.'
    },
    {
        name: "lose",
        'button text': [
        "Jogar de novo?",
        "Jogar de novo?",
        "Jogar de novo?"
    ],
        'button functions': [
        restart,
        restart,
        restart
    ],
    text: "Você morreu. &#x2620; \n (Dica: tente comprar equipamentos melhores, cuide de sua saúde e escolha bem seus inimigos)."
    },
    {
        name: "win",
        'button text': [
        "Jogar de novo?",
        "Jogar de novo?",
        "Jogar de novo?"
    ],
        'button functions': [
        restart,
        restart,
        restart
    ],
    text: "Você derrotou o dragão! VOCÊ GANHOU O JOGO! &#x1F389;"
    },
    {
        name: "easter egg",
        'button text': [
        "2",
        "8",
        "Ir para a cidade?"
    ],
        'button functions': [
        pickTwo,
        pickEight,
        goTown
    ],
    text: "Você achou um baú secreto! Escolha um número acima. Dez números estão dispostos na tranca mágica, aleatoriamente, entre 0 e 10. Se o número que você escolher corresponder a um dos números aleatórios, você ganha!"
    }
];

//initialize buttons

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location){
    monsterStats.style.display = "none";
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    text.innerHTML = location.text;
}

function goTown() {
    update(locations[0]);
}

function goStore() {
    update(locations[1]);
}

function goCave() {
    update(locations[2]);
}

function buyHealth() {
    if(gold >= 10){
        gold -= 10;
        health += 10;
        goldText.innerText = gold;
        healthText.innerText = health;
    }else{
        text.innerText = "Você não tem moedas suficientes para repor a saúde."
    }
}

function buyWeapon() {
    if (currentWeaponIndex < weapons.length - 1) {
        if (gold >= 30) {
            gold -= 30;
            currentWeaponIndex++;
            goldText.innerText = gold;
            let newWeapon = weapons[currentWeaponIndex].name;
            text.innerText = "Você agora tem: " + newWeapon + ".\n\n";
            inventory.push(newWeapon);
            text.innerText += "Itens na mochila: " + formatInventory(inventory);
        } else {
            text.innerText = "Você não tem moedas suficientes para comprar armas.";
        }
    } else {
        text.innerText = "Você já tem a arma mais poderosa!";
        button2.innerText = "Vender arma por 15 moedas.";
        button2.onclick = sellWeapon;
    }
}

function formatInventory(inventory) {
    if (inventory.length === 1) {
        return inventory[0];
    }
    return inventory.slice(0, -1).join(', ') + ' e ' + inventory[inventory.length - 1];
}


function sellWeapon() {
    if(inventory.length > 1){
        gold += 15;
        goldText.innerText = gold;
        let currentWeapon = inventory.shift();
        text.innerText = "Você vendeu: "+currentWeapon+".\n\n";
        text.innerText += "Itens na mochila: "+inventory;
    }else{
        text.innerText = "Não venda sua única arma!";
    }
}

function fightSlime() {
    fighting = 0;
    goFight();
}

function fightBeast() {
    fighting = 1;
    goFight();
}

function fightDragon() {
    fighting = 2;
    goFight();
}

function goFight(){
    update(locations[3]);
    monsterHealth = monsters[fighting].health;  
    monsterStats.style.display = 'block';
    monsterName.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;
}

function attack(){
    text.innerText = monsters[fighting].name+" atacou!";
    text.innerText += " Você revidou com "+weapons[currentWeaponIndex].name+".";
    health -= getMonsterAttackValue(monsters[fighting].level);
    
    if(isMonsterHit()){
        monsterHealth -= weapons[currentWeaponIndex].power + Math.floor(Math.random() * xp) + 1;
    }else{
        text.innerText += " Errou...";
    }
    
    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;
    if(health <= 0){
        lose();
    }
    else if(monsterHealth <= 0){
        if (fighting === 2) {
            winGame();
        } else {
            defeatMonster();
        }
    }
    if(Math.random() <= .1 && inventory.length !== 1){
        text.innerText += inventory.pop()+" quebrou."
        currentWeaponIndex --;
    }
}

function getMonsterAttackValue(level){
    const hit = (level * 5) - (Math.floor(Math.random() * xp));
    console.log(hit);
    return hit > 0 ? hit : 0;
}

function isMonsterHit(){
    return Math.random() > .2 || health < 20;
}

function dodge(){
    text.innerText = "Você desviou do ataque de "+ monsters[fighting].name +".";
}

function defeatMonster() {
    gold += Math.floor((monsters[fighting].level * 6.7)); 
    xp += monsters[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;
    update(locations[4]);
}

function lose(){
    update(locations[5]);
}

function restart() {
    xp = 0;
    health = 100;
    gold = 50;
    currentWeaponIndex = 0;
    inventory = ["Porrete"];
    goldText.innerText = gold;
    xpText.innerText = xp;
    healthText.innerText = health;    
    goTown();
}

function winGame(){
    update(locations[6]);
}

function easterEgg(){
    update(locations[7]);
}

function pickTwo() {
    pick(2);
}

function pickEight() {
    pick(8);
}

function pick(guess){
    const numbers = [];
    while(numbers.length < 10){
        numbers.push(Math.floor(Math.random() * 11));
    }
    text.innerText = "Você pegou "+guess+".\n Aqui está os números aleatórios:\n";
    for(let i = 0; i < 10; i++){
        text.innerText += numbers[i]+" ";
    }
    if(numbers.includes(guess)){
        text.innerText += "\n\nAcertou! Ganhou 20 moedas!";
        gold += 20;
        goldText.innerText = gold;
    }else{
        text.innerText += "\n\nErrou! Perdeu 10 de saúde!";
        health -= 10;
        healthText.innerText = health;
        if (health <= 0) {
            lose(); 
        }
    }
}

const startButton = document.querySelector("#startButton");

startButton.onclick = startGame;

function startGame() {
    backgroundMusic.play();
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("stats").style.display = "block";
    document.getElementById("controls").style.display = "block";
    document.getElementById("text").style.display = "block";
    goTown();
}

backgroundMusic.addEventListener('ended', () => {
    backgroundMusic.currentTime = 0; 
    backgroundMusic.play(); 
});

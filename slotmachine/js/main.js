/// <reference path="jquery.js" />
var playerMoney = 1000;
var winnings = 0;
var jackpot = 5000;
var turn = 0;
var playerBet = 0;
var winNumber = 0;
var lossNumber = 0;
var spinResult;
var fruits = "";
var winRatio = 0;
var grapes = 0;
var bananas = 0;
var oranges = 0;
var cherries = 0;
var bars = 0;
var bells = 0;
var sevens = 0;
var blanks = 0;
var stage;
//buttons
var bet5N;
var bet5S;
var bet10N;
var bet10S;
var bet15N;
var bet15S;
var resetS;
var resetN;
var closeN;
var closeS;
var spinN;
var spinS;
var handleN;
//image reel
var bunny;
var bomb;
var fishbone;
var skull;
var shrine;
var bell;
var heart;
var blank;
//main bg
var mainSlot;
//text
var jackpotText;
var playerPotText;
var winningText;
//reels
var reel1;
var reel2;
var reel3;

    function init() {
        canvas = document.getElementById("slotDisplay");
        stage = new createjs.Stage(canvas); //Set the canvas
        stage.enableMouseOver(); //Enable mouse over
        queue = new createjs.LoadQueue(false);
        queue.installPlugin(createjs.Sound);
        var manifest = 
                    [{ src: "../images/10betN.png" },
                     { src: "../images/10betS.png" },
                     { src: "../images/15betN.png" },
                     { src: "../images/15betS.png" },
                     { src: "../images/5betN.png" },
                     { src: "../images/5betS.png" },
                     { src: "../images/closeN.png" },
                     { src: "../images/closeS.png" },
                     { src: "../images/handleN.png" },
                     { src: "../images/resetN.png" },
                     { src: "../images/resetS.png" },
                     { src: "../images/SPINn.png" },
                     { src: "../images/spinS.png" },
                     //the reel images
                     { src: "../images/bell.png" },
                     { src: "../images/blank.png" },
                     { src: "../images/bomb.png" },
                     { src: "../images/bunny.png" },
                     { src: "../images/fishbone.png" },
                     { src: "../images/heart.png" },
                     { src: "../images/shrine.png" },
                     { src: "../images/skull.png" },
                     //main
                    { src: "../images/mainSlot.png" }];//load all the images at the start for the slot machine
        queue.on("fileload", handleFileLoad, this); //Called when file loads
        queue.on("complete", handleComplete, this); //Called when file completes
        queue.loadManifest(manifest); //Load the manifest
    }

    function handleFileLoad(event) {
        console.log("All files loaded.");
    }

    //On load complete
    function handleComplete(event) {
        createjs.Ticker.addEventListener("tick", tickHandler); //Run tick handler for animations
        createjs.Ticker.setFPS(60); //Set FPS higher
        //load the slotmachine
        loadMain();
    }

    function loadMain() {
        //put all the main things on the screen
        //add main image
        mainSlot = new createjs.Bitmap("../images/mainSlot.png");
        stage.addChild(mainSlot);
        mainSlot.x = 0;
        mainSlot.y = 0;
        //add the buttons
        bet5N = new createjs.Bitmap("../images/5betN.png");
        stage.addChild(bet5N);
        bet5N.name = "five";
        bet5N.x = 60;
        bet5N.y = 530;
        bet5N.addEventListener("click", setBet);

        bet10N = new createjs.Bitmap("../images/10betN.png");
        stage.addChild(bet10N);
        bet10N.name = "ten";
        bet10N.x = bet5N.x+bet5N.image.width+5;
        bet10N.y = 530;
        bet10N.addEventListener("click", setBet);

        bet15N = new createjs.Bitmap("../images/15betN.png");
        stage.addChild(bet15N);
        bet15N.name = "fifteen";
        bet15N.x = bet10N.x + bet10N.image.width + 5;
        bet15N.y = 530;
        bet15N.addEventListener("click", setBet);

        spinN = new createjs.Bitmap("../images/SPINn.png");
        stage.addChild(spinN);
        spinN.x = 520;
        spinN.y = 535;
        spinN.addEventListener("click", spin);
        spinN.addEventListener("mouseover", spinOrange);
        spinN.addEventListener("mouseout", removeSpinOrange);

        resetN = new createjs.Bitmap("../images/resetN.png");
        stage.addChild(resetN);
        resetN.x = 515;
        resetN.y = 625;
        resetN.addEventListener("click", reset);
        resetN.addEventListener("mouseover", resetOrange);
        resetN.addEventListener("mouseout", removeResetOrange);

        closeN = new createjs.Bitmap("../images/closeN.png");
        stage.addChild(closeN);
        closeN.x = resetN.image.width+resetN.x+5;
        closeN.y = 625;
        closeN.addEventListener("click", close);
        closeN.addEventListener("mouseover", closeOrange);
        closeN.addEventListener("mouseout", removeCloseOrange);

        handleN = new createjs.Bitmap("../images/handleN.png");
        stage.addChild(handleN);
        handleN.x = 700;
        handleN.y = 200;
        handleN.addEventListener("click", spin);

        //add the basic text
        jackpotText = new createjs.Text();
        jackpotText.font = "50px Monoton";
        jackpotText.color = "#ffffff";
        jackpotText.text = "+" + jackpot + "+";
        stage.addChild(jackpotText);
        jackpotText.x = 250;
        jackpotText.y = 35;

        playerPotText = new createjs.Text();
        playerPotText.font = "40px Monoton";
        playerPotText.color = "#ffffff";
        playerPotText.text = playerMoney;
        stage.addChild(playerPotText);
        playerPotText.x = 80;
        playerPotText.y = 615;

        winningText = new createjs.Text();
        winningText.font = "40px Monoton";
        winningText.color = "#ffffff";
        winningText.text = winnings;
        stage.addChild(winningText);
        winningText.x = 245;
        winningText.y = 130;
    }

//-----------------------------------------------------------//
//=========         Event Listeners            ==============//
//-----------------------------------------------------------//
    //Ticker to control all animations on the stage
    function tickHandler(e) {
        stage.update();
    }

    function setBet(e) {
        //change all bet buttons back to normal
        if (stage.contains(bet5S)) {
            stage.removeChild(bet5S);
        }

        if (stage.contains(bet10S)) {
            stage.removeChild(bet10S);
        }

        if (stage.contains(bet15S)) {
            stage.removeChild(bet15S);
        }

        switch (e.currentTarget.name) {
            case ("five"):
                playerBet = 5;
                bet5S = new createjs.Bitmap("../images/5betS.png");
                stage.addChild(bet5S);
                bet5S.x = 60;
                bet5S.y = 530;
                break;
            case ("ten"):
                playerBet = 10;
                bet10S = new createjs.Bitmap("../images/10betS.png");
                stage.addChild(bet10S);
                bet10S.x = bet5N.x + bet5N.image.width + 5;
                bet10S.y = 530;
                break;
            case ("fifteen"):
                playerBet = 15;
                bet15S = new createjs.Bitmap("../images/15betS.png");
                stage.addChild(bet15S);
                bet15S.name = "fifteen";
                bet15S.x = bet10N.x + bet10N.image.width + 5;
                bet15S.y = 530;
                break;
        }   
    }

    function reset(e) {
       
        resetFruitTally();
        resetAll();
        init();
    }

    function resetOrange(e){
        resetS = new createjs.Bitmap("../images/resetS.png");
        stage.addChild(resetS);
        resetS.x = 515;
        resetS.y = 625;
        resetS.addEventListener("click", reset);
    }

    function removeResetOrange(e){
        stage.removeChild(resetS);
    }

    function spinOrange(e) {
        spinS = new createjs.Bitmap("../images/spinS.png");
        stage.addChild(spinS);
        spinS.x = 520;
        spinS.y = 535;
        spinS.addEventListener("click", spin);
    }

    function removeSpinOrange(e) {
        stage.removeChild(spinS);
    }

    function closeOrange(e) {
        closeS = new createjs.Bitmap("../images/closeS.png");
        stage.addChild(closeS);
        closeS.x = resetN.image.width + resetN.x + 5;
        closeS.y = 625;
        closeS.addEventListener("click", close);
    }

    function removeCloseOrange(e) {
        stage.removeChild(closeS);
    }

    function close(e) {
        window.open('', '_parent', '');
        window.close();
        window.open('', '_self', ''); window.close();
    }

//-----------------------------------------------------------//
//=========             Tom's code             ==============//
//-----------------------------------------------------------// 


    /* When the player clicks the spin button the game kicks off */
    function spin(e) {
        //    playerBet = $("div#betEntry>input").val();
        if (playerBet == 0) {
            alert("You must place a bet before you can spin!");
        }
        else {
            if (playerMoney == 0) {
                if (confirm("You ran out of Money! \nDo you want to play again?")) {
                    resetAll();
                    showPlayerStats();
                }
            }
            else if (playerBet > playerMoney) {
                alert("You don't have enough Money to place that bet.");
            }
            else if (playerBet < 0) {
                alert("All bets must be a positive $ amount.");
            }
            else if (playerBet <= playerMoney) {
                spinResult = Reels();

                if (stage.contains(reel1) && stage.contains(reel2) && stage.contains(reel3)) {
                    stage.removeChild(reel1);
                    stage.removeChild(reel2);
                    stage.removeChild(reel3);
                }

                reel1 = new createjs.Bitmap(spinResult[0]);
                reel1.x = 85;
                reel1.y = 250;
                spinResult[1].x = 600;
                stage.addChild(reel1);

                reel2 = new createjs.Bitmap(spinResult[1]);
                reel2.x = 290;
                reel2.y = 250;
                stage.addChild(reel2);

                reel3 = new createjs.Bitmap(spinResult[2]);
                reel3.x = 495;
                reel3.y = 250;
                stage.addChild(reel3);

                determineWinnings();
                turn++;
                showPlayerStats();
            }
            else {
                alert("Please enter a valid bet amount");
            }

            //redo the basic text
            jackpotText.text = "+" + jackpot + "+";
            playerPotText.text = playerMoney;
            stage.update;
        }
    }


/* Utility function to show Player Stats */
function showPlayerStats() {
    winRatio = winNumber / turn;
    $("#jackpot").text("Jackpot: " + jackpot);
    $("#playerMoney").text("Player Money: " + playerMoney);
    $("#playerTurn").text("Turn: " + turn);
    $("#playerWins").text("Wins: " + winNumber);
    $("#playerLosses").text("Losses: " + lossNumber);
    $("#playerWinRatio").text("Win Ratio: " + (winRatio * 100).toFixed(2) + "%");
}

/* Utility function to reset all fruit tallies */
function resetFruitTally() {
    grapes = 0;
    bananas = 0;
    oranges = 0;
    cherries = 0;
    bars = 0;
    bells = 0;
    sevens = 0;
    blanks = 0;
}

/* Utility function to reset the player stats */
function resetAll() {
    playerMoney = 1000;
    winnings = 0;
    jackpot = 5000;
    turn = 0;
    playerBet = 0;
    winNumber = 0;
    lossNumber = 0;
    winRatio = 0;
}


/* Check to see if the player won the jackpot */
function checkJackPot() {
    /* compare two random values */
    var jackPotTry = Math.floor(Math.random() * 51 + 1);
    var jackPotWin = Math.floor(Math.random() * 51 + 1);
    if (jackPotTry == jackPotWin) {
        alert("You Won the $" + jackpot + " Jackpot!!");
        playerMoney += jackpot;
        jackpot = 1000;
    }
}

/* Utility function to show a win message and increase player money */
function showWinMessage() {
    playerMoney += winnings;
    winningText.text = "You Won: $" + winnings;
    resetFruitTally();
    checkJackPot();
}

/* Utility function to show a loss message and reduce player money */
function showLossMessage() {
    playerMoney -= playerBet;
    jackpot += playerBet;
    winningText.text = "You Lost!";
    resetFruitTally();
}

/* Utility function to check if a value falls within a range of bounds */
function checkRange(value, lowerBounds, upperBounds) {
    if (value >= lowerBounds && value <= upperBounds) {
        return value;
    }
    else {
        return !value;
    }
}

/* When this function is called it determines the betLine results.
e.g. Bar - Orange - Banana */
function Reels() {
    var betLine = [];
    var outCome = [0, 0, 0];

    for (var spin = 0; spin < 3; spin++) {
        outCome[spin] = Math.floor((Math.random() * 65) + 1);
        switch (outCome[spin]) {
            case checkRange(outCome[spin], 1, 27):  // 41.5% probability
                betLine[spin] = "../images/blank.png";
                blanks++;
                break;
            case checkRange(outCome[spin], 28, 37): // 15.4% probability
                betLine[spin] = "../images/heart.png";
                grapes++;
                break;
            case checkRange(outCome[spin], 38, 46): // 13.8% probability
                betLine[spin] = "../images/fishbone.png";
                bananas++;
                break;
            case checkRange(outCome[spin], 47, 54): // 12.3% probability
                betLine[spin] = "../images/skull.png";
                oranges++;
                break;
            case checkRange(outCome[spin], 55, 59): //  7.7% probability
                betLine[spin] = "../images/bunny.png";
                cherries++;
                break;
            case checkRange(outCome[spin], 60, 62): //  4.6% probability
                betLine[spin] = "../images/shrine.png";
                bars++;
                break;
            case checkRange(outCome[spin], 63, 64): //  3.1% probability
                betLine[spin] = "../images/bell.png";
                bells++;
                break;
            case checkRange(outCome[spin], 65, 65): //  1.5% probability
                betLine[spin] = "../images/bomb.png";
                sevens++;
                break;
        }
    }
    return betLine;
}

/* This function calculates the player's winnings, if any */
function determineWinnings() {
    if (blanks == 0) {
        if (grapes == 3) {
            winnings = playerBet * 10;
        }
        else if (bananas == 3) {
            winnings = playerBet * 20;
        }
        else if (oranges == 3) {
            winnings = playerBet * 30;
        }
        else if (cherries == 3) {
            winnings = playerBet * 40;
        }
        else if (bars == 3) {
            winnings = playerBet * 50;
        }
        else if (bells == 3) {
            winnings = playerBet * 75;
        }
        else if (sevens == 3) {
            winnings = playerBet * 100;
        }
        else if (grapes == 2) {
            winnings = playerBet * 2;
        }
        else if (bananas == 2) {
            winnings = playerBet * 2;
        }
        else if (oranges == 2) {
            winnings = playerBet * 3;
        }
        else if (cherries == 2) {
            winnings = playerBet * 4;
        }
        else if (bars == 2) {
            winnings = playerBet * 5;
        }
        else if (bells == 2) {
            winnings = playerBet * 10;
        }
        else if (sevens == 2) {
            winnings = playerBet * 20;
        }
        else if (sevens == 1) {
            winnings = playerBet * 5;
        }
        else {
            winnings = playerBet * 1;
        }
        winNumber++;
        showWinMessage();
    }
    else {
        lossNumber++;
        showLossMessage();
    }

}


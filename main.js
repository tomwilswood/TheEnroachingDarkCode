//start of new lore notifier p1

let newLoreUnseen = false;
let loreSeen;
if (localStorage.getItem("loreSeen") === "null") {
    loreSeen = [false, false, false];
} else {
    loreSeen = JSON.parse(localStorage.getItem("loreSeen"));
}
localStorage.setItem("loreSeen", JSON.stringify(loreSeen));
let highScoresNeeded = [1, 1200, 1400];

//end of new lore notifier p1







//start of Game 
let highScore = 0;
if (localStorage.getItem("highScore") !== null) {
    highScore = localStorage.getItem("highScore");
}

if (document.getElementsByTagName("title")[0].innerHTML === "Web Asessment 2 - Game") { //displays canvas only if on the game tab

    let darknessWidth = 0;
    let darknessRate = 0.5; //0.5 base value
    let starXs = [];
    let starYs = [];

    let targetStarFound = false;
    let targetStarX;
    let targetStarY;
    let newTargetStarNeeded = true;
    let targetRingWidth = 50;
    let targetRingRate = 0.5;

    let score = 0;
    let scoreRate = 1;
    let postGameLoaded = false;

    let playButtonPressed = false;


    function setup() {
        let canvas = createCanvas(650, 650);

        canvas.parent('canvasHolder');
        background(0);
        for (let i = 0; i < 1000; i++) {
            drawStar(i);
        }
    }

    function draw() {
        if (!playButtonPressed) {
            textSize(32);
            textFont('Times New Roman');
            scoreRate = 0;
            drawButtonWithHoverAnim(width / 2 - 40, 320, 80, 50, "Play", 10);
        }

        if (playButtonPressed) {
            if (darknessWidth < 920) { //stops the scene from drawing once the darkness covers everthing.
                cursor("default");
                drawBackground();
                noFill();
                strokeWeight(1);
                stroke(255);
                circle(targetStarX, targetStarY, targetRingWidth);
                if (targetRingWidth > 0) {
                    targetRingWidth -= targetRingRate;
                }
                if (targetRingWidth <= 0 && darknessWidth < width) {
                    newTargetStarNeeded = true;

                }

                fill(0);
                stroke(0);
                strokeWeight(0);
                circle(width / 2, height / 2, darknessWidth);
                darknessWidth += darknessRate;

                if (newTargetStarNeeded && darknessWidth < width) {
                    getTargetStar();
                    targetStarFound = false;
                }
            } else if (!postGameLoaded) { //if the game has finished but the post game hasn't loaded yet.
                //perform after game operations
                highScore = localStorage.getItem("highScore");
                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem("highScore", Math.round(highScore));
                }
                fill(255);
                text("Your score: " + Math.round(score), (width / 2) - 120, height / 3, 300);
                if (localStorage.getItem("highScore") !== null) {
                    text("High Score: " + localStorage.getItem("highScore"), width / 2 - 120, height / 3 + 40, 300);
                } else {
                    text("High Score: " + highScore, width / 2 - 100, height / 3 - 20, 300);
                }
                updateLoreNotifier();
                postGameLoaded = true;
            }
            if (!(darknessWidth < 920)) {
                drawButtonWithHoverAnim(width / 2 - 50, 320, 105, 40, "Restart", 5);
            }
        }
    } //end of draw

    setInterval(function () { //plays 10 times a second compared to the 60 of draw
        if (darknessWidth < 920 && playButtonPressed) {
            darknessRate += 0.01;
            targetRingRate += 0.0001;
            score += scoreRate;
            scoreRate += 0.1;
        }

        document.getElementById("currentScoreDisplay").innerHTML = "Current Score: " + Math.round(score);
        if (localStorage.getItem("highScore") !== null) {
            document.getElementById("highScoreDisplay").innerHTML = "High Score: " + localStorage.getItem("highScore");
        } else {
            document.getElementById("highScoreDisplay").innerHTML = "High Score: " + highScore;
        }


    }, 100);

    function mouseClicked() {
        if (withinBounds(mouseX, mouseY, targetRingWidth, targetStarX, targetStarY)) { //if the player clicks within the target ring
            if (darknessWidth - 50 > 0) {
                darknessWidth -= (50 - targetRingWidth); //reduces the width of the darkness by an amount inversely proportional to how wide the target ring is - the smaller the target when you click, the greater the darkness is reduced
            } else {
                darknessWidth = 0;
            }
            newTargetStarNeeded = true;
        }
        if (withinButtonBounds(width / 2 - 50, 320, 100, 40) && !(darknessWidth < 920)) {
            restartGame();
        }
        if (!playButtonPressed && withinButtonBounds(width / 2 - 40, 320, 70, 40)) {
            playButtonPressed = true;
        }
    }

    function drawButtonWithHoverAnim(buttonX, buttonY, buttonWidth, buttonHeight, buttonText, buttonBorder) {
        if (withinButtonBounds(buttonX, buttonY, buttonWidth, buttonHeight, buttonBorder)) { //changes the colour of the button when the player hovers over it
            drawButton(200, buttonX, buttonY, buttonWidth, buttonHeight, buttonText, buttonBorder);
            cursor("pointer");
        } else {
            drawButton(255, buttonX, buttonY, buttonWidth, buttonHeight, buttonText, buttonBorder);
            cursor("default");
        }
    }

    function drawButton(colour, buttonX, buttonY, buttonWidth, buttonHeight, buttonText, buttonBorder) {
        fill(colour);
        rect(buttonX, buttonY, buttonWidth, buttonHeight, 5)
        fill(0);
        text(buttonText, buttonX + buttonBorder, buttonY + buttonBorder, 300);
    }

    function withinButtonBounds(buttonX, buttonY, buttonWidth, buttonHeight) {
        if ((mouseX < buttonX + buttonWidth && mouseX > buttonX)
            && (mouseY < buttonY + buttonHeight && mouseY > buttonY)) {
            return true;
        } else {
            return false;
        }
    }

    function drawStar(index) {
        strokeWeight(0);
        starX = random(0, 650);
        starY = random(0, 650);
        circle(starX, starY, 1);

        starXs[index] = starX;
        starYs[index] = starY;
    }

    function drawBackground() {
        background(0);
        fill(255);
        for (let i = 0; i < 1000; i++) {
            circle(starXs[i], starYs[i], 1);
        }
    }

    function restartGame() {
        if (postGameLoaded) {
            score = 0;
            scoreRate = 1
            darknessWidth = 0;
            darknessRate = 0.5
            targetRingRate = 0.5;
            postGameLoaded = false;
        }
    }

    function getTargetStar() {
        while (!targetStarFound) {
            let index = int(random(0, 1000));

            if (!(withinBounds(starXs[index], starYs[index], darknessWidth, width / 2, width / 2))) { //if the star found is outside of the growing Darkness
                circle(starXs[index], starYs[index], 10);
                targetStarX = starXs[index];
                targetStarY = starYs[index];
                targetStarFound = true;
                newTargetStarNeeded = false;
                targetRingWidth = 50;
            }
        }
    }

    function withinBounds(xValueToCheck, yValueToCheck, widthToCheck, startingXPoint, startingYPoint) {
        if ((xValueToCheck < (startingXPoint + widthToCheck / 2) && (xValueToCheck > (startingXPoint - widthToCheck / 2)))
            && (yValueToCheck < (startingYPoint + widthToCheck / 2) && (yValueToCheck > (startingYPoint - widthToCheck / 2)))) {
            return true;
        } else {
            return false;
        }
    }
}

// end of Game










//start of Lore

if (document.getElementsByTagName("title")[0].innerHTML === "Web Asessment 2 - Lore") { //displays only if on the Lore tab
    let highScoreForNextLore = 1;
    document.getElementById("loreSection1").style.display = "none";
    document.getElementById("loreSection2").style.display = "none";
    document.getElementById("loreSection3").style.display = "none";

    if (localStorage.getItem("highScore") !== null && localStorage.getItem("highScore") > highScoresNeeded[0]) {
        document.getElementById("loreSection1").style.display = "block";
        highScoreForNextLore = highScoresNeeded[1];
        loreSeen[0] = true;
    }

    if (localStorage.getItem("highScore") !== null && localStorage.getItem("highScore") > highScoresNeeded[1]) {
        document.getElementById("loreSection2").style.display = "block";
        highScoreForNextLore = highScoresNeeded[2];
        loreSeen[1] = true;
    }

    if (localStorage.getItem("highScore") !== null && localStorage.getItem("highScore") > highScoresNeeded[2]) {
        document.getElementById("loreSection3").style.display = "block";
        document.getElementById("loreLockedBar").style.display = "none";
        loreSeen[2] = true;
    }

    localStorage.setItem("loreSeen", JSON.stringify(loreSeen));


    document.getElementById("lockedBarText").innerHTML = "You haven't earned enough points to unlock this yet. <br> High score needed: " + highScoreForNextLore;

    let loreAudio1 = new Audio("Assets/Andrea with background 1.mp3");
    let loreAudio2 = new Audio("Assets/Andrea with background 2.mp3");
    let loreAudio3 = new Audio("Assets/Andrea with background 3 longer.mp3");

    document.getElementById("loreAudioButton1").addEventListener("click", () => {
        playAudio(loreAudio1);
    })

    document.getElementById("loreAudioButton2").addEventListener("click", () => {
        playAudio(loreAudio2);
    })

    function playAudio(audio) {
        if (loreAudio1.paused && loreAudio2.paused && loreAudio3.paused) {
            audio.play();
        }
    }


    let loreDarknessShouldGrow = false;
    let loreLightShouldGrow = false;

    let loreDarknessWidth = 0;
    let loreDarknessRate = 1;

    let loreLightWidth = 0;
    let loreLightRate = 10;

    document.getElementById("loreAudioButton3").addEventListener("click", () => {
        playAudio(loreAudio3);
        if (loreAudio1.paused && loreAudio2.paused) {
            window.scrollTo(0, 0);
            disableScrolling(65);
            document.getElementById("loreCanvasHolder").style.display = "block";
            document.getElementById("loreCanvasHolder").style.zIndex = 1;
            loreDarknessShouldGrow = true;
            loreLightShouldGrow = false;

            loreDarknessWidth = 0;
            loreDarknessRate = 0;

            loreLightWidth = 0;
            loreLightRate = 10;
        }
    })


    function setup() {
        let canvas = createCanvas(1920, 1080);

        canvas.parent('loreCanvasHolder');
        background(0, 0, 0, 0);
        fill(0);
    }

    function draw() {
        if (loreDarknessShouldGrow) {
            fill(0);
            circle(width / 2, height / 2, loreDarknessWidth)
            loreDarknessWidth += loreDarknessRate;
            loreDarknessRate += 0.0008;
            if (loreDarknessWidth > 2200) {
                loreDarknessShouldGrow = false;
            }
            setTimeout(setLightShouldGrow, 63000); //time calculated with reguards to the audio reaching a certain point.
        }
        if (loreLightShouldGrow) {
            fill(255);
            circle(width / 2, height / 2, loreLightWidth)
            loreLightWidth += loreLightRate;
            loreLightRate += 0.1;
            if (loreLightWidth > 2300) {
                loreLightShouldGrow = false;
                document.getElementById("loreCanvasHolder").style.display = "none";
                clear();
            }
        }
    }

    function setLightShouldGrow() {
        loreLightShouldGrow = true;
    }

    function disableScrolling(timeInSeconds) {
        window.onscroll = function () {
            window.scrollTo(0, 0)
        };
        setTimeout(enableScroll, timeInSeconds * 1000);
    }
    function enableScroll() {
        window.onscroll = function () { };
    }

}
//end of Lore




//start of new lore notifier p2
updateLoreNotifier();
function updateLoreNotifier() {
    loreSeen = JSON.parse(localStorage.getItem("loreSeen"));
    for (let i = 0; i < 3; i++) {
        if (localStorage.getItem("highScore") !== null && localStorage.getItem("highScore") > highScoresNeeded[i] && !loreSeen[i]) {
            newLoreUnseen = true;
        }
    }
    if (newLoreUnseen) {
        document.getElementById("loreLink").innerHTML = 'Lore<span id="loreNotifier">*</span >';
    }
}


//end of new lore notifier p2






//start of Accounts


if (document.getElementsByTagName("title")[0].innerHTML === "Web Asessment 2 - Account") { //only goes through this code if the user is on the account page

    let loginOrCreateSection = document.getElementById("loginOrCreateSection");
    let loginSection = document.getElementById("loginSection");
    let createAccountSection = document.getElementById("createAccountSection");
    let backButton = document.getElementById("backButton");
    let accountSection = document.getElementById("accountPageSection");

    let loginErrorPresent = false;


    //start of accessing different section code

    loginSection.style.display = "none";
    createAccountSection.style.display = "none";
    backButton.style.display = "none";
    accountSection.style.display = "none";

    let accountPageLoginButton = document.getElementById("accountPageLoginButton");
    accountPageLoginButton.addEventListener("click", () => {
        displaySection(loginSection);
    });

    let createAccountButton = document.getElementById("createAccountButton");
    createAccountButton.addEventListener("click", () => {
        displaySection(createAccountSection);
    });

    backButton.addEventListener("click", () => {
        displaySection(loginOrCreateSection);
    });

    if (localStorage.getItem("pageIndex") === "0") {
        displaySection(loginOrCreateSection);
    } else if (localStorage.getItem("pageIndex") === "1") {
        displaySection(accountSection);
    }


    function disableIfNotDisabled(elementUsed) {
        if (elementUsed.style.display !== "none") {
            elementUsed.style.display = "none";
        }
    };

    function displaySection(sectionToDisplay) {
        if (!(sectionToDisplay === loginOrCreateSection)) {
            disableIfNotDisabled(loginOrCreateSection);
        } else {
            loginOrCreateSection.style.display = "block";
            disableIfNotDisabled(backButton);
            localStorage.setItem("pageIndex", 0);
        }

        if (!(sectionToDisplay === loginSection)) {
            disableIfNotDisabled(loginSection);
        } else {
            loginSection.style.display = "flex";
            backButton.style.display = "inline";
            if (loginErrorPresent) {
                document.getElementById("loginErrorMessage").parentElement.removeChild(document.getElementById("loginErrorMessage"));
            }
        }

        if (!(sectionToDisplay === createAccountSection)) {
            disableIfNotDisabled(createAccountSection);
        } else {
            createAccountSection.style.display = "flex";
            backButton.style.display = "inline";
        }

        if (!(sectionToDisplay === accountSection)) {
            disableIfNotDisabled(accountSection);
            if (document.getElementById("backButtonContents").innerText !== "Back") {
                document.getElementById("backButtonContents").innerText = "Back";
            }
        } else {
            accountSection.style.display = "flex";
            backButton.style.display = "inline";
            //assign the data from the form to the account page for display and changes the text on the back button
            document.getElementById("accountPageGreeting").innerHTML = "Hello " + localStorage.getItem("firstName") + ". <br> The Darkness Awaits";
            document.getElementById("accountPageName").innerHTML = "Name: " + localStorage.getItem("firstName") + " " + localStorage.getItem("lastName");
            document.getElementById("accountPageEmail").innerHTML = "Email: " + localStorage.getItem("email");
            document.getElementById("backButtonContents").innerText = "Log out";
            localStorage.setItem("pageIndex", 1);
        }
    }

    //end of accessing different section code


    //start of changing input code

    let whatFearInput = document.getElementById("whatFearInput");
    let whatUnceasingInput = document.getElementById("whatUnceasingInput");
    let whatEndInput = document.getElementById("whatEndInput");
    let afraidYesRadioButton = document.getElementById("afraidYesRadioButton");
    let afraidNoRadioButton = document.getElementById("afraidNoRadioButton");



    setInterval(function () {
        //sets values of the questions like 'What do you fear?' to "The Dark" and changes "are you already afraid?" to yes, provided they have answered the questions and they are on the right section, in order to unsettle the player and add to the atmosphere.
        if (createAccountSection.style.display !== "none") {
            replaceWithTheDark(whatFearInput);
            replaceWithTheDark(whatUnceasingInput);
            replaceWithTheDark(whatEndInput);

            if (afraidNoRadioButton.checked) {
                afraidYesRadioButton.checked = true;
            }
        }
    }, 1000);

    function replaceWithTheDark(elementToCheck) {
        if (elementToCheck.value !== "" && elementToCheck.value !== "The Dark") { //if elementToCheck has something written in it which isn't "The Dark"
            elementToCheck.value = "The Dark";
        }

    }

    //end of changing input code


    //start of checking inputs are correct code
    let firstNameInput = document.getElementById("firstNameInput");
    let firstNameInputContainer = document.getElementById("firstNameInputContainer");
    let firstNameErrorPresent = false;

    setInterval(function () {
        if (createAccountSection.style.display !== "none") { //if the user is in the create account section
            errorMessageHandler(document.getElementById("emailInput").value.includes("@") && document.getElementById("emailInput").value.includes("."),
                document.getElementById("emailInput"), document.getElementById("emailInputContainer"), 0, "Please enter email in the following format: example@exampleSite.com.");
            errorMessageHandler(document.getElementById("passwordInput").value === document.getElementById("passwordConfirmInput").value,
                document.getElementById("passwordInput"), document.getElementById("passwordConfirmInputContainer"), 1, "Passwords must match.");
        }
    }, 100);

    let errorPresent = [false, false, false, false];

    function errorMessageHandler(correctCondition, elementToCheck, elementContainer, index, messageString) {
        if (!correctCondition && elementToCheck.value !== '' && elementToCheck !== document.activeElement) {
            //if the input doesn't meet requirements (is incorrect) AND elementToCheck isn't nothing AND elementToCheck isn't the active element
            if (!errorPresent[index]) { //if the error isn't present already
                elementContainer.insertAdjacentHTML("afterend", '<p class="accountCreationErrorMessage" id="errorMessage' + index + '"> Error: ' + messageString + '</p>')
                errorPresent[index] = true;
            }
        } else if (document.getElementById("errorMessage" + index) !== null) { //if the error message has already been created but the conditions for having the error message present are not true, then removes the error message
            let errorMessage = document.getElementById("errorMessage" + index);
            errorMessage.parentElement.removeChild(errorMessage);
            errorPresent[index] = false;
        }
    }

    //end of checking inputs are correct code


    //start of submitting form and saving code

    document.getElementById("submitButton").addEventListener("click", (submit) => {
        submit.preventDefault();
        if (noErrorsPresent() && formComplete()) { //if there are no errors in the form (and it's complete) then SUBMIT  
            disableIfNotDisabled(createAccountSection);
            accountSection.style.display = "flex";
            localStorage.setItem("email", document.getElementById("emailInput").value);
            localStorage.setItem("password", document.getElementById("passwordInput").value);
            localStorage.setItem("firstName", document.getElementById("firstNameInput").value);
            localStorage.setItem("lastName", document.getElementById("lastNameInput").value);

            document.getElementById("createAccountSection").reset();
            disableErrorMessageIfNotNull(2); //disable both the form error messages if they're present so they won't be there if the user tries to create another account
            disableErrorMessageIfNotNull(3);
            displaySection(accountSection);
        } else {
            //error messages for each condition
            errorMessageHandler(noErrorsPresent(), document.getElementById("requiredWarning"), document.getElementById("requiredWarning"), 2,
                "Please fix all previous errors before submitting");
            errorMessageHandler(formComplete(), document.getElementById("requiredWarning"), document.getElementById("requiredWarning"), 3,
                "Please complete all required fields before submitting");
        }
    })

    function disableErrorMessageIfNotNull(index) { //removes the error message and sets the error present to recognise it's gone
        if (document.getElementById("errorMessage" + index) !== null) {
            document.getElementById("errorMessage" + index).parentElement.removeChild(document.getElementById("errorMessage" + index));
            errorPresent[index] = false;
        }
    }

    function formComplete() { //returns true if each field has something in it and at least one radio button is checked, otherwise false.
        if (fieldFilled("firstNameInput") && fieldFilled("lastNameInput") && fieldFilled("emailInput") && fieldFilled("passwordInput") && fieldFilled("passwordConfirmInput") &&
            fieldFilled("whatFearInput") && fieldFilled("whatUnceasingInput") && fieldFilled("whatEndInput") && (afraidYesRadioButton.checked || afraidNoRadioButton.checked)) {
            return true;
        } else {
            return false;
        }
    }

    function fieldFilled(field) { //returns false if field is empty, otherwise true.
        if (document.getElementById(field).value === '') {
            return false;
        } else {
            return true;
        }
    }

    function noErrorsPresent() {
        for (let i = 0; i < 2; i++) { //only does 0 and 1 as they are the only errors as part of the actual form.
            if (errorPresent[i]) { //if any error IS present (errorPresent[i] === true) thus meaning the function (noErrorsPresent) will return false, since there are, in fact, errors pressent.
                return false;
            }
        }
        return true;
    }

    //end of submitting form and saving code


    //start of login code

    document.getElementById("loginPageLoginButton").addEventListener("click", () => {
        if (document.getElementById("emailInputLogin").value === localStorage.getItem("email") && document.getElementById("passwordInputLogin").value === localStorage.getItem("password")
            && document.getElementById("emailInputLogin") !== "" && document.getElementById("passwordInputLogin") !== "") { //if the password and email match those in storage and arent' empty

            loginErrorPresent = false;
            displaySection(accountSection);
            document.getElementById("loginDetailsForm").reset();

            document.getElementById("loginErrorMessage").parentElement.removeChild(document.getElementById("loginErrorMessage"));

        } else {
            if (!loginErrorPresent) {
                document.getElementById("passwordInputLoginContainer").insertAdjacentHTML("afterend", '<p class="accountCreationErrorMessage" id="loginErrorMessage"> The email or password is incorrect </p>')
                loginErrorPresent = true;
            }
        }
    });

    //end of login code


    //start of continue button code
    document.getElementById("accountPageSectionContinueButton").addEventListener("click", () => {
        window.location.assign("index.html");
    });

    //end of continue button code
}
//end of Accounts

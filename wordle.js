const alertModal = document.getElementById('alertModal');

const firstRow = document.getElementsByClassName('letterBox 1');
const secondRow = document.getElementsByClassName('letterBox 2');
const thirdRow = document.getElementsByClassName('letterBox 3');
const fourthRow = document.getElementsByClassName('letterBox 4');
const fifthRow = document.getElementsByClassName('letterBox 5');
const sixthRow = document.getElementsByClassName('letterBox 6');

let rowChecker = [
    firstRow,
    secondRow,
    thirdRow,
    fourthRow,
    fifthRow,
    sixthRow
]

let wordList = [];
let guesses = [];

function alertMessage(e, string){
    e.style.display = 'block';
    let timeLeft = 2;
    e.firstElementChild.innerText = string;
    let timer = setInterval(function(){
        if(timeLeft <= 0){
            e.style.display = 'none';
        }
        timeLeft -= 1;
    }, 1000);
}

//function to return a random index of an array
function getRandomWord(array){
    return array[Math.floor(Math.random() * array.length)];
}

//when listening for keyboard checks, this function will check if the button pushed is a letter
function isLetter(str){
    return str.length === 1 && str.match(/[a-z]/i);
}

!async function(){
    let data = await fetch("words.json")
        .then(res => res.json())
        .then(data => {
            //makes a new list of words that are only 5 letters and do not have
            //repeating letters in them
            var word = data.words;
            //var duplicateCheck = (/([a-zA-Z]).*?\1/); //regex check for any letters that repeat in the string given
            //!duplicateCheck.test(word[i]);
            for (let i = 0; i < word.length; i++) {
                //if the word is exactly 5 letters and comes back false for the duplicate check
                if(word[i].length === 5){
                    wordList.push(word[i]);
                }
            }
        })
        .catch(error => {
            console.error(error);
        });

        //style each box according to matches
        function testWord(currentRow, guessWord, wordToGuess){
            
            for (let i = 0; i < 5; i++) {
                
                
                let letterPosition = wordToGuess.indexOf(guessWord[i]);

                if(letterPosition === -1){
                    rowChecker[currentRow][i].style.background = '#3A393B';
                    rowChecker[currentRow][i].style.borderColor = '#181817';
                } else {
                    if(guessWord[i] === wordToGuess[i]){
                        rowChecker[currentRow][i].style.background = '#548D4E';
                        rowChecker[currentRow][i].style.borderColor = '#181817';
                    } else {
                        rowChecker[currentRow][i].style.background = '#B59F39';
                        rowChecker[currentRow][i].style.borderColor = '#181817';
                    }
                }
                
            }
            
        }

        //main game stuff
        let currentRow = 0;

        

        let wordToGuess = getRandomWord(wordList).toUpperCase();
        console.log(`current word is: ${wordToGuess}`);

        document.addEventListener('keydown', (e)=>{
            var letterTyped = e.key;
            var enterKey = 'Enter';
            var backspaceKey = 'Backspace';
            let guessWord = '';
            if (letterTyped === enterKey){
                console.log('Enter pressed');
                
                //loop through boxes and see if we have all boxes filled
                //if we do, then save the word and currentRow++;
                
                if(rowChecker[currentRow][4].innerText.length == 1){
                    //player has typed a full 5 letter word and hit enter
                    //loop through the row and collect each letter to form a new string
                    for (let i = 0; i < rowChecker[currentRow].length; i++) {
                        guessWord += rowChecker[currentRow][i].innerText;
                    }
                } else {
                    console.log('Must enter a full 5 letter word!');
                    alertMessage(alertModal, 'Must enter 5 letter word!');
                }
                //if word has already not been found, add it to the list of guesses
                if(guesses.includes(guessWord)){
                    console.log('You already found that word!');
                    alertMessage(alertModal, 'Word found already!');
                    //clear the row?
                } else if(wordList.includes(guessWord.toLowerCase())){
                    guesses.push(guessWord);
                    testWord(currentRow, guessWord, wordToGuess);

                    if(guessWord === wordToGuess){
                        console.log('found word!');
                        alertMessage(alertModal, 'You found the word!');
                        return;
                    }
                    
                    currentRow++;
                } else {
                    console.log('Not in word list!');
                    alertMessage(alertModal, "Not in word list!");
                }
                
                return;
            } else if (letterTyped === backspaceKey){
                //loop through all boxes in current row
                for (let i = 0; i < rowChecker[currentRow].length; i++) {

                    try {
                        //find first box that has 0 length, make box just before it an empty string
                        if(rowChecker[currentRow][i].innerText.length == 0){
                            rowChecker[currentRow][i - 1].innerText = '';
                        }
                    } catch (TypeError) {
                        //should only pop up if you are hitting backspace with no letters to clear
                        console.log('Nothing to backspace!');
                        console.log(TypeError);
                    }
                }
                //if no boxes have 0 length, then they are all full. make last box an empty string
                if(rowChecker[currentRow][4].innerText.length == 1){
                    rowChecker[currentRow][4].innerText = '';
                }

                return;
            } else {
                //if its not enter or backspace, and its a letter..
                if(isLetter(letterTyped)){
                    //loop through current row in rowchecker
                    //once it finds a div with an innerText.length of 0, it puts the letterTyped
                    //in that box and breaks the loop
                    for (let i = 0; i < rowChecker[currentRow].length; i++) {
                        if(rowChecker[currentRow][i].innerText.length == 0){
                            rowChecker[currentRow][i].innerText = letterTyped.toUpperCase();
                            break;
                        }
                    }

                }
            }

            
        });
        

    }();






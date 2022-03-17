/*
  This file contains the functions necessary to make
  the puzzles hidden in posts modifiable.
  
  To change the answers, change the variables
  in the file ChangeableVariables.jsx.
*/

import React from 'react';
import colors from './TabContent.css'
import { ANSWER_TO_BE_ENCRYPTED, ENCRYPTION_KEY, CLUE_DATE, LETTER_COLOR, LETTER_FONT, COURSE_CODE_1, COURSE_CODE_2, THREE_DINOS, HINT_COURSES, HINT_DINOS } from '../ChangeableValues';

export default function Puzzles(post) {

  // Checks if a post is a puzzle and in that case which puzzle it is.
  // Depending on the result it will return different displays.
  if(post.isPuzzle) {
    switch (post.puzzleNr) {
      case "2b": return puzzle2b(post);
      case "2c": return puzzle2c(post);
      case "c1": return puzzleChat(post); //This is just an ordinary post. Nothing to add.
      case "c2": return puzzleChat(post);
    }  
  } else {
    return (
        <div class="post">
          <div class="post-date">
            {post.date[0]}.{post.date[1]}.{post.date[2]}
          <div class="post-name"> 
            {post.poster} 
          <pre class="post-content"> 
            {post.content}
          </pre>
            {hasPicture(post)}
          </div>
        </div>
      </div>
    )
  }


/* -------------------- Functions -------------------- */  

  // This function changes the color of the letters in a post, where the 
  // argument count is the "x":th letter of that type.
  function changeColor(post, letter, count) {
    var indexArray = new Array(letter.length);
    var counter = 0;
    for(let i = 0; i < letter.length; i++){
      const NUMBER = (post.content.split(letter[i]).length - 1)
      var index = post.content.indexOf(letter[i]);
      var count1 = count % NUMBER;
      while(count1 > 0) {
        index = post.content.indexOf(letter[i], index+1);
        count1--;
      }
      indexArray[counter] = index;
      counter++;
    }
    const INDEX_1 = indexArray[0];
    const INDEX_2 = indexArray[1];
    const INDEX_3 = indexArray[2];
    const finalArray = [[INDEX_1,"color"],[INDEX_2, "color"],[INDEX_3, "color"]];
    return finalArray;
  }

  // This function changes the font of the letters in a post, where the 
  // argument count is the "x":th letter of that type. It does this 
  // with the help of the previous 'changeColor' function that works
  // in a similar way.
  function changeFont(post,letter, count) {
    var col = changeColor(post, letter, count);
    col[0][1] = "font";
    col[1][1] = "font";
    col[2][1] = "font";
    return col;
  }

  // This function takes two results from either 'changeColor' or
  // 'changeFont' or both and appends them together to then return it in
  // a HTML format appropriate for the post itself.
  function changeString(post, array1, array2) {
    var totalArray = array1.concat(array2);
    var sortedArray = totalArray.sort(function(a,b){return (a[0]-b[0])});
    
    return (
      // With the help of the 'helpChangeString' function each individual 
      // letter that is specified is modified by either it's color or
      // it's font.
      <pre class="post-content">
        {post.content.slice(0,sortedArray[0][0])}
        {helpChangeString(post, sortedArray[0])}
        {post.content.slice(sortedArray[0][0]+1,sortedArray[1][0])}
        {helpChangeString(post, sortedArray[1])}
        {post.content.slice(sortedArray[1][0]+1,sortedArray[2][0])}
        {helpChangeString(post, sortedArray[2])}
        {post.content.slice(sortedArray[2][0]+1,sortedArray[3][0])}
        {helpChangeString(post, sortedArray[3])}
        {post.content.slice(sortedArray[3][0]+1,sortedArray[4][0])}
        {helpChangeString(post, sortedArray[4])}
        {post.content.slice(sortedArray[4][0]+1,sortedArray[5][0])}
        {helpChangeString(post, sortedArray[5])}
        {post.content.slice(sortedArray[5][0]+1)}
      </pre> 
      )
  }

  // Helper function to assign a character either a change in
  // font or a change in color and then help return that
  // in a proper HTML format.
  function helpChangeString(post, element) {
    if (element[1] == "color") {
      return (<font color={LETTER_COLOR}>{post.content[element[0]]}</font>)
    } else if (element[1] == "font") {
      return (<font face={LETTER_FONT}>{post.content[element[0]]}</font>)
    } else {
      return
    }
  }

  // Check if the post has picture(s) and
  // if it does, return it/them in proper HTML format.
  function hasPicture(post) {
    if(post.hasOwnProperty('pictures')) {
      return (<div class="post-images">
              {post.pictures.map (picture => {
                    return (
                      <div>
                       <img src={picture[0]} alt={picture[1]} class="post-image"/>
                      </div>
                    )
                  })}
                </div>  
                )
    }
    return true;
  }

  // Function to shift an array to the left,
  // with the first element becoming the
  // new last element.
  function shiftArrayWrap(array, amount) {
    if(amount < 0) {
        amount = array.length + amount;
    }
    var tempNr;
    for (var a = 0; a < amount; a++) {
        tempNr = array.shift();
        array.push(tempNr);

        // Old code that is both slower and non-functional.
      /*for (var i = array.length-1; i >= 0; i--) {
          if(i == 0) {
            tempArray[array.length - 1] = array[i];
          }  else {
            tempArray[i-1]=array[i];
          }
        }
        array = tempArray; */
    }
    return array;
  }

  // Encodes a string according to a key of letters and numbers.
  // The encoding is according to the Mexican Army Wheel Cipher.
  function encodedMsg(toBeEncoded) {
    toBeEncoded = toBeEncoded.toLowerCase();

    if (ENCRYPTION_KEY[0][1] < 1 || ENCRYPTION_KEY[0][1] > 26) {
      throw "First number of encryption key must be within bounds [1,26].";
    } 
    if (ENCRYPTION_KEY[1][1] < 27 || ENCRYPTION_KEY[1][1] > 52) {
      throw "Second number of encryption key must be within bounds [27,53].";
    }
    if (ENCRYPTION_KEY[2][1] < 53 || ENCRYPTION_KEY[1][1] > 78) {
      throw "Third number of encryption key must be within bounds [53,78].";
    }
    if (ENCRYPTION_KEY[3][1] < 79 || ENCRYPTION_KEY[1][1] > 100) {
      throw "Fourth number of encryption key must be within bounds [79,100].";
    }

    // The different rings on a mexican wheel.
    var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    var lowNumbers = ["01", "02", "03", "04", "05", "06", "07", "08", "09", 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];
    var mediumNumbers = [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52];
    var largeNumbers = [53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78];
    var highestNumbers = [79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98 , 99, 100, "", "", "", ""];

    // Find indexes for placements of all keys.
    var letterIndexLow = letters.indexOf(ENCRYPTION_KEY[0][0]);
    var lowNumbersIndex = lowNumbers.indexOf(ENCRYPTION_KEY[0][1]);
    var letterIndexMedium = letters.indexOf(ENCRYPTION_KEY[1][0]);
    var mediumNumbersIndex = mediumNumbers.indexOf(ENCRYPTION_KEY[1][1]);
    var letterIndexLarge = letters.indexOf(ENCRYPTION_KEY[2][0]);
    var largeNumbersIndex = largeNumbers.indexOf(ENCRYPTION_KEY[2][1]);
    var letterIndexHighest = letters.indexOf(ENCRYPTION_KEY[3][0]);
    var highestNumbersIndex = highestNumbers.indexOf(ENCRYPTION_KEY[3][1]);

    // Shift the arrays to turn the rings according to the key.
    lowNumbers = shiftArrayWrap(lowNumbers, (lowNumbersIndex-letterIndexLow));
    mediumNumbers = shiftArrayWrap(mediumNumbers, (mediumNumbersIndex-letterIndexMedium));
    largeNumbers = shiftArrayWrap(largeNumbers, (largeNumbersIndex-letterIndexLarge));
    highestNumbers = shiftArrayWrap(highestNumbers, (highestNumbersIndex-letterIndexHighest));

    // Create some variables to help the encoding.
    var encodedArray = new Array(toBeEncoded.length);
    var tempIndex;
    var whichArray;

    // Encode each letter with a number from a 
    // random choice of the four rings.
    for (var i = 0; i < toBeEncoded.length; i++) {
        tempIndex = letters.indexOf(toBeEncoded[i]);

        // If the character isn't a letter,
        // keep it as it is without encoding it.
        if(tempIndex == -1) {
            encodedArray[i] = toBeEncoded[i];
            continue;
        }

        whichArray = getRandomInt(1,5)

        // Choose a random ring to take the encoding from
        // and apply it to the output.
        if(whichArray == 1) {
            encodedArray[i] = lowNumbers[tempIndex];   
        } else if (whichArray == 2) {
            encodedArray[i] = mediumNumbers[tempIndex];
        } else if (whichArray == 3) {
            encodedArray[i] = largeNumbers[tempIndex];
        } else if (whichArray == 4) {
            if (highestNumbers[i] == "") {
                i--;
            } else {
                encodedArray[i] = highestNumbers[tempIndex];
            }
        }
    }

    // Format the output appropriately by displaying
    // each element of the array next to each other.
    encodedArray = encodedArray.join("");

    return encodedArray;
  }

  // Function to get a random number.
  // The maximum is exclusive and the minimum is inclusive.
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random(2) * (max - min) + min); 
  }

  function changeDinos(post){
    const dino1 = THREE_DINOS[0][0].toUpperCase() + THREE_DINOS[0].slice(1);
    const dino2 = THREE_DINOS[1][0].toLocaleUpperCase() + THREE_DINOS[1].slice(1);
    const dino3 = THREE_DINOS[2][0].toLocaleUpperCase() + THREE_DINOS[2].slice(1);
    post.content = post.content.replace("XXDINO1XX", dino1);
    post.content = post.content.replace("XXDINO2XX", dino2);
    post.content = post.content.replace("XXDINO3XX", dino3);
    return post;
  }

  function checkForHelper(post){
    if(post.comment == "This post is helper post 1 to puzzle 2c."){
      return HINT_DINOS;
    } else if (post.comment == "This post is helper post 2 to puzzle 2c") {
      return HINT_COURSES;
    }
    return;
  }

  // Function to encode the puzzle 2c.
  // See documentation for an explanation of the puzzle.
  // TODO: add name of document.
  function puzzle2c(post) {
    post = changeDinos(post);
    // This post has the puzzle in it.
    if (post.comment == "This is the main post to puzzle 2c.") {
      return (
        <div class="post">
          <div class="post-date">
            {CLUE_DATE}
          <div class="post-name"> 
            {post.poster} 
          {changeString(post,changeColor(post, COURSE_CODE_1, 2),changeFont(post, COURSE_CODE_2, 1))}
          <p style={{margin: '0', color: colors.postBackground}}> 
              {encodedMsg(ANSWER_TO_BE_ENCRYPTED)}
          </p>
          {hasPicture(post)}
          </div>
        </div>
      </div>
     )
    }
    // Else, it is one of the helper posts which also has a strange date as clue.
    return (
      <div class="post">
        <div class="post-date">
          {CLUE_DATE}
        <div class="post-name"> 
          {post.poster} 
        <pre class="post-content">
          {post.content}
        </pre>
        <p style={{margin: '0', color: colors.postBackground}}>
          {checkForHelper(post)}
        </p>
        {hasPicture(post)}
        </div>
      </div>
    </div>
   )
  }

  //TODO! Puzzle is implemented but doesn't require it's own function.
  // Not sure what to do here.
  function puzzle2b(post) {
    return (
      <div class="post">
        <div class="post-date">
          {post.date[0]}.{post.date[1]}.{post.date[2]}
        <div class="post-name"> 
          {post.poster} 
        <pre class="post-content">
          {post.content}
        </pre>
        {hasPicture(post)}
        </div>
      </div>
    </div>
   )
  }

  function puzzleChat(post) {
    return (
      <div class="post">
        <div class="post-date">
          {post.date[0]}.{post.date[1]}.{post.date[2]}
        <div class="post-name"> 
          {post.poster} 
        <pre class="post-content"> 
          {post.content}
        </pre>
          {hasPicture(post)}
        </div>
      </div>
    </div>
  )
  }
}
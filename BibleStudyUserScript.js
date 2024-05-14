// ==UserScript==
// @name         Bible Study
// @namespace    https://esv.literalword.com/
// @version      2024-03-27
// @description  Make Bible Studies better for reading and splitting up the reading into chunks for each person.
// @author       You
// @match        https://*.literalword.com/*
// @require      https://unpkg.com/chroma-js@1.3.7/chroma.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant        none
// ==/UserScript==
// Function to set a cookie
let divWidth = 200;
let divHeight = 125;
setCookie = function(cname, cvalue, exdays = 30) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Function to get a cookie
getCookie = function(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

let isDivTransformed = false;
let BibleStudyNavWidthSmall = '25px';
transformOrUntransform = function(divElement, defaultSize = null, defaultHeight = null){
    defaultSize = defaultSize || divWidth;
    defaultHeight = defaultHeight || divHeight;
    let isDivTransformed = divElement.style.width == BibleStudyNavWidthSmall;

         if (!isDivTransformed) {
            console.log('Making div smaller (transformed)');
             $('.BibleStudyNav .options').hide();
             $('.BibleStudyNav').removeClass('open').addClass('closed');

            // Add transformation
            divElement.style.width = BibleStudyNavWidthSmall;
            divElement.style.height = BibleStudyNavWidthSmall;
             divElement.style.opacity = '0.3';
            // Update state
            isDivTransformed = true;
        } else {

            console.log('Div is transformed, reverting to original');
            $('.BibleStudyNav .options').show();
            $('.BibleStudyNav').removeClass('closed').addClass('open');
            // Revert to original size and position
            divElement.style.width = defaultSize + 'px';
            divElement.style.height = defaultHeight + 'px';
             divElement.style.opacity = '1';
            // Update state
            isDivTransformed = false;
        }
}

function resizeOnDblClick(divElement) {
    // Define the default style
    let defaultSize = divWidth // getComputedStyle(divElement).width;
    let defaultHeight = divHeight;
    let defaultPosition = getComputedStyle(divElement).left;

    // Add event listener for double click
    divElement.addEventListener('dblclick', function() {
        // Check if div is in normal state
        transformOrUntransform(divElement, defaultSize, defaultHeight);

    });
}

function addStyles(styles){
    $('<style>').text(styles).appendTo(document.head);
}

function generateRandomColor() {
    let color = '#';
    for (let i = 0; i < 6; i++) {
        const random = Math.random() * 16 | 0;
        color += (i === 0 ? random & 0x7 : random).toString(16);
    }
    return color.toUpperCase();
}

function intToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function padHex(c, shouldDarken) {
    let value = Math.max(0, Math.min(255, c));
    if(shouldDarken) {
        value = Math.floor(value * 0.7);
    } else {
        value = Math.floor(value + (255 - value) * 0.3);
    }
    return intToHex(value);
}

function generateColorScheme(shouldFitDarkScheme) {
    const baseColor = generateRandomColor();
    const baseRed = parseInt(baseColor.substring(1,3), 16);
    const baseGreen = parseInt(baseColor.substring(3,5), 16);
    const baseBlue = parseInt(baseColor.substring(5,7), 16);

    const colorOne = "#" + intToHex(255 - baseRed) + intToHex(255 - baseGreen) + intToHex(255 - baseBlue);
    const colorTwo = "#" + padHex(baseRed, shouldFitDarkScheme) + padHex(baseGreen, shouldFitDarkScheme) + padHex(baseBlue, shouldFitDarkScheme);
    const colorThree = "#" + padHex(baseRed, !shouldFitDarkScheme) + padHex(baseGreen, !shouldFitDarkScheme) + padHex(baseBlue, !shouldFitDarkScheme);

    return [baseColor, colorOne, colorTwo, colorThree];
}


function getRandomColor1(){
  const randomColor = Math.floor(Math.random()*16777215).toString(16);
  return randomColor;
}

function getRandomColor2() {
    let color = "";
    for (let i = 0; i < 3; i++) {
        // Generate a random number between 0 and 255,
        // but limit it from 0 to 175 (or 'AF' in hexadecimal) to ensure color is not too light and visible on white background
        let part = Math.floor(Math.random() * 176).toString(16);
        while (part.length < 2) { // Adding padding if number is single digit
            part = "0" + part;
        }
        color += part;
    }
    return color;
}

function getRandomColor3(excludeColor) {
    let color = "#";

    for (let i = 0; i < 3; i++) {
        // Generate a random number between 0 and 255 inclusive,
        // but limit it from 0 to 175 inclusive (or 'AF' in hexadecimal) to ensure the color is not too light and visible on white background
        let part;
        do {
            part = Math.floor(Math.random() * 176).toString(16);
        } while (excludeColor[i * 2 + 1] === part[0] || excludeColor[i * 2 + 1] === part[1])

        while (part.length < 2) { // Adding padding if number is single digit
            part = "0" + part;
        }
        color += part;
    }

    return color;
}

function objectToString(obj) {
  let result = '';

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result += key + ': ' + obj[key] + "\n";
    }
  }

  // Remove the trailing ', ' for clean formatting
  result = result.substring(0, result.length - 1);

  return result;
}


GENERATE_BIBLE_STUDY = function(numPeople = 2, numVersesToSwitchAt = 5, mode = null, peopleColors = null){
    if (mode === null){
        mode = $('.modeDarkLight').val();
    }
    if (peopleColors === true){
        setCookie("peopleColors", "");
    }
    let o = bibleStudyOptionsSave();
    if (peopleColors === null && o.peopleColors && numPeople > 1 && numVersesToSwitchAt > 1){
        peopleColors = o.peopleColors;
        if (!Array.isArray(peopleColors)){
            peopleColors = [];
        }
    }else{
        peopleColors = [];
    }

    if (Array.isArray(peopleColors) && peopleColors.length === 0){
        let lastColor = '#FFFFFF';
        let fourColors = generateColorScheme(mode === 'dark');
        console.log(fourColors);
        for (let i = 0; i < numPeople; ++i){
            let c = fourColors[i];
            if (!c){
                c = getRandomColor(lastColor);
            }
            let rc = c;
            peopleColors.push(rc);
            lastColor = rc;
        }
        setCookie('peopleColors', JSON.stringify(peopleColors));
    }

    let eachPersonReads = {};
    let verseCounter = 0;
    let p = 0;
    let color;

    if (peopleColors[p]){
        color = peopleColors[p];
    }else{
        color = '';
    }
    $('span.bV').each(function(){
        let person = "Person " + (p+1);
        let $span = $(this);
        let $ch = $span.find('.bCh');
        let $vs = $span.find('.bVN');
        if ($ch.length > 0){
            verseCounter = 1;
        }else{
            verseCounter++;
        }
        if (typeof(eachPersonReads[person]) === "undefined"){
           eachPersonReads[person] = 1;
        }else{
           eachPersonReads[person] = parseInt(eachPersonReads[person], 10) + 1;
        }
        $span.css('color', color).attr('title', person);
        let doSwitch = verseCounter % numVersesToSwitchAt;
        if (doSwitch === 0){
            p++;
            if (p >= numPeople){
                p = 0;
            }
            if (color !== ''){
                color = peopleColors[p];
            }
        }
    });

    $('.BibleStudyNav .status').html(objectToString(eachPersonReads));
}


function addDivWithScroll() {
    // Create a new div element
    var newDiv = document.createElement("div");

    // Apply styles to make it scroll with page
    newDiv.style.position = "fixed";
    newDiv.style.top = "0"; // adjust position as per requirement
    newDiv.style.left = "0"; // adjust position as per requirement
    newDiv.style.width = divWidth + "px"; // adjust size as per requirement
    newDiv.style.height = divHeight + "px"; // adjust size as per requirement
    newDiv.style.backgroundColor = "#ddd"; // adjust color as per requirement
    newDiv.style.overflow = "auto";

    // Add some content to the new div
    newDiv.innerHTML = `
    <div class="transformDiv">
    <img class="bibleToggleOpenClose" title="Bible Study Helper: Toggle Open/Close" onclick="transformOrUntransform($(this).closest('div.BibleStudyNav').get(0))" style="width: 25px" src="data:image/png;base64,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" />
</div>
<div class="options">
<h3 title="Bible Study Nav by Jim K"><b>Bible Study Helper</b></h3>
    <label>People
    <select class="numPeople" onchange="setCookie('numPeople', this.value); GENERATE_BIBLE_STUDY(this.value, $(this).closest('div').find('.numVerses').val())">
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
    </select></label>
    <label>Verses
    <select class="numVerses" onchange="setCookie('numVerses', this.value); GENERATE_BIBLE_STUDY($(this).closest('div').find('.numPeople').val(), this.value)">
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option selected>5</option>
      <option>6</option>
      <option>7</option>
      <option>8</option>
      <option>9</option>
      <option>10</option>
      <option>11</option>
      <option>12</option>
      <option>13</option>
      <option>14</option>
      <option>15</option>
    </select>
    </label>

    <div class="status"></div>
    <button type="button" onclick="GENERATE_BIBLE_STUDY($(this).closest('div').find('.numPeople').val(), $(this).closest('div').find('.numVerses').val(), null, true);">New Colors</button>
    <button type="button" onclick="GENERATE_BIBLE_STUDY(0, 1);">No Colors</button>
    <div>
    <label>Mode
    <select class="modeDarkLight">
      <option>light</option>
      <option>dark</option>
    </select></label>
    </div>

    </div>
    `;
    newDiv.className = 'BibleStudyNav';

    // Add the new div to the body of the current webpage
    document.body.appendChild(newDiv);
    $(newDiv).addClass('open');
    return newDiv;
}

function loadScript(url, callback) {
    // Create a new script element
    var script = document.createElement("script");
    script.type = "text/javascript";

    // If the browser supports the `onload` event (all browsers but IE),
    // use it, else use `onreadystatechange` (for IE)
    if (script.readyState) {
        script.onreadystatechange = function() {
            if (script.readyState === "loaded" || script.readyState === "complete") {
                script.onreadystatechange = null;

                // If a callback function was provided, execute it
                if (callback) callback();
            }
        };
    } else {
        script.onload = function() {
            // If a callback function was provided, execute it
            if (callback) callback();
        };
    }

    // Set the source of the script to the provided URL
    script.src = url;

    // Add the script to the `head` of the document
    document.getElementsByTagName("head")[0].appendChild(script);
}



function getRandomColor4(excludeColor) {
    let newColor;
    if (typeof(chroma) === "undefined"){
        console.log('chroma not really defined');
        return getRandomColor3(excludeColor);
    }
    do {
        newColor = chroma.random();
    } while(chroma.deltaE(newColor, excludeColor) < 80);

    return newColor.hex();
}


function getRandomColor(excludeColor) {
    // Convert the excludeColor to Lab color space
    var excludeColorLab = chroma(excludeColor).lab();

    var newColor;

    // Generate colors until one is found that is different enough from excludeColor and dark enough
    do {
        newColor = chroma.random();

        // Convert the new color to Lab color space
        var newColorLab = newColor.lab();

        // Get the Euclidean distance in Lab color space between the new color and excludeColor
        var colorDistance = Math.sqrt(Math.pow(newColorLab[0] - excludeColorLab[0], 2) +
            Math.pow(newColorLab[1] - excludeColorLab[1], 2) +
            Math.pow(newColorLab[2] - excludeColorLab[2], 2));

        // Get the lightness of the new color
        var lightness = newColorLab[0];
    }
    // Keep going until we get a color that is both sufficiently different from excludeColor (colorDistance > 80)
    // and also dark enough to contrast with a light background (lightness < 70)
    while (colorDistance < 80 || lightness > 70);

    return newColor.hex();
}

getFromCookieOrDefaultAndSetCookie = function(key){
    let val = getCookie(key);
    if (val !== ''){
        $('.'+key).val(val);
    }else{
        val = $('.'+key).val();
        setCookie(key, val);
    }
    return val;
}

bibleStudyOptionsSave = function(){
    let numPeople = getFromCookieOrDefaultAndSetCookie('numPeople');
    let numVerses = getFromCookieOrDefaultAndSetCookie('numVerses');
    let mode = getFromCookieOrDefaultAndSetCookie('modeDarkLight');
    let peopleColors = getCookie('peopleColors');
    if (peopleColors !== ''){
        peopleColors = JSON.parse(peopleColors);
    }
    console.log("From Cookies: ", "numPeople", numPeople, "numVerses", numVerses, "mode", mode, "peopleColors", peopleColors);
    return {numPeople: numPeople, numVerses: numVerses, mode: mode, peopleColors: peopleColors};
}

$(function(){
    let div = addDivWithScroll();
    addStyles(`
    .BibleStudyNav {
      background: rgba(255,255,255,0.5); /* make the background 50% transparent white */
      box-shadow: 0px 0px 10px 5px rgba(0,0,0,0.5); /* add a box shadow */
      padding-left: 3px;
      color: black;
    }
    .BibleStudyNav .transformDiv{
      float: left;
    }

    .BibleStudyNav.closed, .BibleStudyNav.closed .transformDiv{
       overflow: hidden !important; /* Hide scrollbars */
    }
    .BibleStudyNav img.bibleToggleOpenClose {
      cursor: pointer;
    }
    `);



    $('.modeDarkLight').change(function(){
        let mode = $(this).val();
        switch(mode){
            case 'dark':
                $('body').css('background-color', 'black').css('color', 'white');
                $('body').css('color-scheme', 'dark');
                $('.bMeatWrapper').css('background-color', '#5C4033');
                break;
            case 'light':
                $('body').css('background-color','').css('color','');
                $('body').css('color-scheme', '');
                $('.bMeatWrapper').css('background-color', '');
                break;

        }
        setCookie('modeDarkLight', mode);
    });
    let o = bibleStudyOptionsSave();
    if (o.numPeople !== '' && o.numVerses !== ''){
       GENERATE_BIBLE_STUDY(o.numPeople, o.numVerses);
    }else{
       GENERATE_BIBLE_STUDY();
    }
    $('.modeDarkLight').change();
    $('.bibleToggleOpenClose').click();
    //Taken out because not needed with big bible image //resizeOnDblClick(div);
});




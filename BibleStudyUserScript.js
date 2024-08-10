// ==UserScript==
// @name         Bible Study
// @namespace    https://esv.literalword.com/
// @version      2024-03-27
// @description  Make Bible Studies better for reading and splitting up the reading into chunks for each person.
// @author       You
// @match        https://*.literalword.com/*
// @match        https://*.biblegateway.com/*
// @match        https://*.biblehub.com/*
// @match        https://*.bible.com/*
// @match        https://*.bibleref.com/*
// @match        https://*.blueletterbible.org/*
// @match        https://*.biblestudytools.com/*
// @match        https://*.esv.org/*
// @match        https://*.kingjamesbibleonline.org/*
// @match        https://*.bibleref.com/*
// @match        https://*.biblia.com/*
// @match        https://*.bible.org/*
// @match        https://*.studylight.org/*
// @match        https://*.openbible.info/*
// @match        https://*.netbible.org/*
// @match        https://*.bibles.org/*
// @match        https://*.bible.is/*
// @match        https://*.online-bible.com/*
// @match        https://*.biblestudyonline.org/*
// @match        https://*.scripturetext.com/*
// @match        https://*.sermoncentral.com/*
// @match        https://*.theonlinebible.com/*
// @match        https://*.bibleanswers.io/*
// @match        https://*.studybible.com/*
// @match        https://*.blueletterbible.org/*
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

extractBibleReference = function(url = null) {
    if (!url){
       url = window.location.href;
    }
    const books = {
        "Genesis": "Genesis|Gen|Ge|Gn",
        "Exodus": "Exodus|Exod|Ex|Exo",
        "Leviticus": "Leviticus|Lev|Le|Lv",
        "Numbers": "Numbers|Num|Nu|Nm",
        "Deuteronomy": "Deuteronomy|Deut|Dt|De",
        "Joshua": "Joshua|Josh|Jos|Jo",
        "Judges": "Judges|Judg|Jdg|Jd",
        "Ruth": "Ruth|Ru|Rt",
        "1 Samuel": "1 Samuel|1 Sam|1 S|1 Sa",
        "2 Samuel": "2 Samuel|2 Sam|2 S|2 Sa",
        "1 Kings": "1 Kings|1 Kings|1 K|1 Ki",
        "2 Kings": "2 Kings|2 Kings|2 K|2 Ki",
        "1 Chronicles": "1 Chronicles|1 Chron|1 Ch|1 Chr",
        "2 Chronicles": "2 Chronicles|2 Chron|2 Ch|2 Chr",
        "Ezra": "Ezra|Ezra|Ez|Ezr",
        "Nehemiah": "Nehemiah|Neh|Ne|Neh",
        "Esther": "Esther|Esth|Es|Est",
        "Job": "Job|Job|Jb|Job",
        "Psalms": "Psalms|Psalms|Ps|Psm",
        "Proverbs": "Proverbs|Prov|Pr|Prv",
        "Ecclesiastes": "Ecclesiastes|Eccl|Ec|Ecc",
        "Song of Solomon": "Song of Solomon|Song|So|Sg",
        "Isaiah": "Isaiah|Isa|Is|Isa",
        "Jeremiah": "Jeremiah|Jer|Je|Jer",
        "Lamentations": "Lamentations|Lam|La|Lam",
        "Ezekiel": "Ezekiel|Ezek|Ezk|Ez",
        "Daniel": "Daniel|Dan|Da|Dn",
        "Hosea": "Hosea|Hos|Ho|Hos",
        "Joel": "Joel|Joel|Jl|Joe",
        "Amos": "Amos|Amos|Am|Amo",
        "Obadiah": "Obadiah|Obad|Ob|Oba",
        "Jonah": "Jonah|Jon|Jon|Jon",
        "Micah": "Micah|Mic|Mi|Mic",
        "Nahum": "Nahum|Nah|Na|Nah",
        "Habakkuk": "Habakkuk|Hab|Hb|Hab",
        "Zephaniah": "Zephaniah|Zeph|Zep|Zeph",
        "Haggai": "Haggai|Hag|Hg|Hag",
        "Zechariah": "Zechariah|Zech|Zec|Zech",
        "Malachi": "Malachi|Mal|Ml|Mal",
        "Matthew": "Matthew|Matt|Mt|Mat",
        "Mark": "Mark|Mark|Mk|Mar",
        "Luke": "Luke|Luke|Lk|Luk",
        "John": "John|John|Jn|Joh",
        "Acts": "Acts|Acts|Ac|Act",
        "Romans": "Romans|Rom|Ro|Rm",
        "1 Corinthians": "1 Corinthians|1 Cor|1 Co|1 Cor",
        "2 Corinthians": "2 Corinthians|2 Cor|2 Co|2 Cor",
        "Galatians": "Galatians|Gal|Ga|Gal",
        "Ephesians": "Ephesians|Eph|Ep|Eph",
        "Philippians": "Philippians|Phil|Ph|Php",
        "Colossians": "Colossians|Col|Co|Col",
        "1 Thessalonians": "1 Thessalonians|1 Thess|1 Th|1 Thes",
        "2 Thessalonians": "2 Thessalonians|2 Thess|2 Th|2 Thes",
        "1 Timothy": "1 Timothy|1 Tim|1 Ti|1 Tm",
        "2 Timothy": "2 Timothy|2 Tim|2 Ti|2 Tm",
        "Titus": "Titus|Titus|Tit|Tit",
        "Philemon": "Philemon|Phlm|Phm|Phile",
        "Hebrews": "Hebrews|Heb|He|Heb",
        "James": "James|James|Ja|Jas",
        "1 Peter": "1 Peter|1 Pet|1 Pe|1 Pt",
        "2 Peter": "2 Peter|2 Pet|2 Pe|2 Pt",
        "1 John": "1 John|1 John|1 Jn|1 Jo",
        "2 John": "2 John|2 John|2 Jn|2 Jo",
        "3 John": "3 John|3 John|3 Jn|3 Jo",
        "Jude": "Jude|Jude|Jud|Jd",
        "Revelation": "Revelation|Rev|Re|Rv"
    };

    const bookPattern = Object.values(books).join("|");
    const regex = new RegExp(`(${bookPattern})\\s*(\\d+)(?:(:|-)(\\d+)(?:-(\\d+))?)?`, "i");

    // Replace plus signs with spaces
    url = url.replace(/(\+|%20|\/|\-)/g, ' ');
    console.log('test url', url);

    const match = url.match(regex);

    if (!match) {
        return false;
    }

    // Find the full book name based on the matched abbreviation
    let book = null;
    for (let [fullName, pattern] of Object.entries(books)) {
        if (new RegExp(`^(${pattern})$`, "i").test(match[1])) {
            book = fullName;
            break;
        }
    }

    let chapter = parseInt(match[2], 10);
    const verseMin = match[3] ? parseInt(match[3], 10) : null;
    const verseMax = match[4] ? parseInt(match[4], 10) : verseMin;

    if (!chapter){
        chapter = 1;
    }
    return { book, chapter, verseMin, verseMax };
}

capitalizeTitle = function(title) {
  const smallWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'by', 'with'];

  return title
    .split(' ')
    .map((word, index) => {
      if (index === 0 || index === title.split(' ').length - 1) {
        // Always capitalize the first and last word
        return word.charAt(0).toUpperCase() + word.slice(1);
      } else if (smallWords.includes(word.toLowerCase())) {
        // Do not capitalize small words
        return word.toLowerCase();
      } else {
        // Capitalize the first letter of other words
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
    })
    .join(' ');
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

let lastFocusedElement = null;

// Listen for focusin events to keep track of the last focused element
$(document).mousedown(function(event) {
    lastFocusedElement = event.target;
    console.log("Element saved:", lastFocusedElement);
});


document.addEventListener('mouseup', function(event) {
   if (lastFocusedElement){
       if (lastFocusedElement.tagName === 'INPUT' || lastFocusedElement.tagName === 'TEXTAREA' || lastFocusedElement.tagName === 'SELECT') {
           return;
       }
   }
  //if (event.button === 1) { // 1 is the code for the middle mouse button
  if ((event.metaKey || event.altKey)) { // Check for middle mouse button and Cmd key on macOS or Alt key on Windows
    highlightSelection(-1);
  }else{
    highlightSelection(6000); //if using left mouse button alone, then remove the highlight after 6 seconds
  }
});

function highlightSelection(removeHighlightDuration = -1) {
  var userSelection = window.getSelection().getRangeAt(0);
  var safeRanges = getSafeRanges(userSelection);
  for (var i = 0; i < safeRanges.length; i++) {
    highlightRange(safeRanges[i], removeHighlightDuration);
  }
}

function highlightRange(range, removeHighlightDuration = -1) {
  var newNode = document.createElement("div");
  newNode.setAttribute(
    "style",
    "background-color: yellow; display: inline;"
  );
  range.surroundContents(newNode);

    if (removeHighlightDuration > 0){
        // Set a timeout to remove the highlight after 10 seconds
        setTimeout(function() {
            var parent = newNode.parentNode;
            while (newNode.firstChild) {
                parent.insertBefore(newNode.firstChild, newNode);
            }
            parent.removeChild(newNode);
        }, removeHighlightDuration);
    }
}

function getSafeRanges(dangerous) {
  var a = dangerous.commonAncestorContainer;
  // Starts -- Work inward from the start, selecting the largest safe range
  var s = new Array(0), rs = new Array(0);
  if (dangerous.startContainer != a) {
    for (var i = dangerous.startContainer; i != a; i = i.parentNode) {
      s.push(i);
    }
  }
  if (s.length > 0) {
    for (var i = 0; i < s.length; i++) {
      var xs = document.createRange();
      if (i) {
        xs.setStartAfter(s[i - 1]);
        xs.setEndAfter(s[i].lastChild);
      } else {
        xs.setStart(s[i], dangerous.startOffset);
        xs.setEndAfter((s[i].nodeType == Node.TEXT_NODE) ? s[i] : s[i].lastChild);
      }
      rs.push(xs);
    }
  }

  // Ends -- basically the same code reversed
  var e = new Array(0), re = new Array(0);
  if (dangerous.endContainer != a) {
    for (var i = dangerous.endContainer; i != a; i = i.parentNode) {
      e.push(i);
    }
  }
  if (e.length > 0) {
    for (var i = 0; i < e.length; i++) {
      var xe = document.createRange();
      if (i) {
        xe.setStartBefore(e[i].firstChild);
        xe.setEndBefore(e[i - 1]);
      } else {
        xe.setStartBefore((e[i].nodeType == Node.TEXT_NODE) ? e[i] : e[i].firstChild);
        xe.setEnd(e[i], dangerous.endOffset);
      }
      re.unshift(xe);
    }
  }

  // Middle -- the uncaptured middle
  if ((s.length > 0) && (e.length > 0)) {
    var xm = document.createRange();
    xm.setStartAfter(s[s.length - 1]);
    xm.setEndBefore(e[e.length - 1]);
  } else {
    return [dangerous];
  }

  // Concat
  rs.push(xm);
  response = rs.concat(re);

  // Send to Console
  return response;
}

function parseBibleURL() {
    const url = window.location.href;

    const patterns = [
        { regex: /bibleref\.com\/.*\/([^+]+)-(\d+)-(\d+).html/, keys: ['book', 'chapter', 'verse'] },
        { regex: /biblegateway\.com\/passage\/\?search=([^+]+)\+(\d+):(\d+)&/, keys: ['book', 'chapter', 'verse'] },
        { regex: /biblegateway\.com\/passage\/\?search=([^+]+)\+(\d+)/, keys: ['book', 'chapter'] },
        { regex: /biblehub\.com\/([^/]+)\/(\d+)-(\d+)\.htm/, keys: ['book', 'chapter', 'verse'] },
        { regex: /biblehub\.com\/([^/]+)\/(\d+)\.htm/, keys: ['book', 'chapter'] },
        { regex: /bible\.com\/bible\/\d+\/([^\.]+)\.(\d+)\.(\d+)/, keys: ['book', 'chapter', 'verse'] },
        { regex: /bible\.com\/bible\/\d+\/([^\.]+)\.(\d+)/, keys: ['book', 'chapter'] },
        { regex: /blueletterbible\.org\/\w+\/([^/]+)\/(\d+)\/(\d+)\.cfm/, keys: ['book', 'chapter', 'verse'] },
        { regex: /blueletterbible\.org\/\w+\/([^/]+)\/(\d+)\.cfm/, keys: ['book', 'chapter'] },
        { regex: /biblestudytools\.com\/passage\/\?q=([^+]+)\+(\d+):(\d+)/, keys: ['book', 'chapter', 'verse'] },
        { regex: /biblestudytools\.com\/passage\/\?q=([^+]+)\+(\d+)/, keys: ['book', 'chapter'] },
        { regex: /esv\.org\/([^+]+)\+(\d+):(\d+)\//, keys: ['book', 'chapter', 'verse'] },
        { regex: /esv\.org\/([^+]+)\+(\d+)\//, keys: ['book', 'chapter'] },
        { regex: /kingjamesbibleonline\.org\/([^/]+)-(\d+)-(\d+)\//, keys: ['book', 'chapter', 'verse'] },
        { regex: /kingjamesbibleonline\.org\/([^/]+)-(\d+)\//, keys: ['book', 'chapter'] },
        { regex: /bibleref\.com\/([^/]+)\/(\d+)\/([^/]+)-(\d+)-(\d+)\.html/, keys: ['book', 'chapter', 'verse'] },
        { regex: /bibleref\.com\/([^/]+)\/(\d+)\/([^/]+)\.html/, keys: ['book', 'chapter'] },
        { regex: /biblia\.com\/bible\/\w+\/([^\.]+)\.(\d+)\.(\d+)/, keys: ['book', 'chapter', 'verse'] },
        { regex: /biblia\.com\/bible\/\w+\/([^\.]+)\.(\d+)/, keys: ['book', 'chapter'] },
        { regex: /bible\.org\/verse\/([^/]+)-(\d+)-(\d+)/, keys: ['book', 'chapter', 'verse'] },
        { regex: /bible\.org\/verse\/([^/]+)-(\d+)/, keys: ['book', 'chapter'] },
        { regex: /studylight\.org\/bible\/\w+\/([^/]+)\/(\d+)-(\d+)\.html/, keys: ['book', 'chapter', 'verse'] },
        { regex: /studylight\.org\/bible\/\w+\/([^/]+)\/(\d+)\.html/, keys: ['book', 'chapter'] },
        { regex: /openbible\.info\/topics\/([^_]+)_(\d+)_(\d+)/, keys: ['book', 'chapter', 'verse'] },
        { regex: /openbible\.info\/topics\/([^_]+)_(\d+)/, keys: ['book', 'chapter'] },
        { regex: /netbible\.org\/bible\/([^+]+)\+(\d+):(\d+)/, keys: ['book', 'chapter', 'verse'] },
        { regex: /netbible\.org\/bible\/([^+]+)\+(\d+)/, keys: ['book', 'chapter'] },
        { regex: /biblestudytools\.com\/search\/\?q=([^+]+)\+(\d+):(\d+)/, keys: ['book', 'chapter', 'verse'] },
        { regex: /biblestudytools\.com\/search\/\?q=([^+]+)\+(\d+)/, keys: ['book', 'chapter'] },
        { regex: /bibles\.org\/eng-\w+\/([^/]+)\/(\d+)\/(\d+)/, keys: ['book', 'chapter', 'verse'] },
        { regex: /bibles\.org\/eng-\w+\/([^/]+)\/(\d+)/, keys: ['book', 'chapter'] },
        { regex: /bible\.is\/bible\/\w+\/([^\.]+)\.(\d+)\.(\d+)/, keys: ['book', 'chapter', 'verse'] },
        { regex: /bible\.is\/bible\/\w+\/([^\.]+)\.(\d+)/, keys: ['book', 'chapter'] },
        { regex: /online-bible\.com\/versions\/\w+\/([^\.]+)\.(\d+)\.(\d+)/, keys: ['book', 'chapter', 'verse'] },
        { regex: /online-bible\.com\/versions\/\w+\/([^\.]+)\.(\d+)/, keys: ['book', 'chapter'] },
        { regex: /biblestudyonline\.org\/bible\/\w+\/([^\.]+)\.(\d+)\.(\d+)/, keys: ['book', 'chapter', 'verse'] },
        { regex: /biblestudyonline\.org\/bible\/\w+\/([^\.]+)\.(\d+)/, keys: ['book', 'chapter'] },
        { regex: /scripturetext\.com\/([^/]+)\/(\d+)-(\d+)\.htm/, keys: ['book', 'chapter', 'verse'] },
        { regex: /scripturetext\.com\/([^/]+)\/(\d+)\.htm/, keys: ['book', 'chapter'] },
        { regex: /sermoncentral\.com\/bible\/\w+\/([^/]+)-(\d+)-(\d+)/, keys: ['book', 'chapter', 'verse'] },
        { regex: /sermoncentral\.com\/bible\/\w+\/([^/]+)-(\d+)/, keys: ['book', 'chapter'] },
        { regex: /theonlinebible\.com\/bible\/\w+\/([^\.]+)\.(\d+)\.(\d+)/, keys: ['book', 'chapter', 'verse'] },
        { regex: /theonlinebible\.com\/bible\/\w+\/([^\.]+)\.(\d+)/, keys: ['book', 'chapter'] },
        { regex: /bibleanswers\.io\/bible\/([^\.]+)\.(\d+)\.(\d+)/, keys: ['book', 'chapter', 'verse'] },
        { regex: /bibleanswers\.io\/bible\/([^\.]+)\.(\d+)/, keys: ['book', 'chapter'] },
        { regex: /studybible\.com\/([^/]+)\/(\d+)-(\d+)/, keys: ['book', 'chapter', 'verse'] },
        { regex: /studybible\.com\/([^/]+)\/(\d+)/, keys: ['book', 'chapter'] },
        { regex: /blueletterbible\.org\/\w+\/([^/]+)\/(\d+)\/(\d+)\/s_\d+/, keys: ['book', 'chapter', 'verse'] } // New pattern for blueletterbible.org
    ];

    for (const { regex, keys } of patterns) {
        const match = url.match(regex);
        if (match) {
            const result = { onSupportedSite: true };
            keys.forEach((key, index) => result[key] = match[index + 1]);
            return result;
        }
    }

    const baseUrls = [
        'bibleref.com',
        'biblegateway.com',
        'biblehub.com',
        'bible.com',
        'blueletterbible.org',
        'biblestudytools.com',
        'esv.org',
        'kingjamesbibleonline.org',
        'bibleref.com',
        'biblia.com',
        'bible.org',
        'studylight.org',
        'openbible.info',
        'netbible.org',
        'bibles.org',
        'bible.is',
        'online-bible.com',
        'biblestudyonline.org',
        'scripturetext.com',
        'sermoncentral.com',
        'theonlinebible.com',
        'bibleanswers.io',
        'studybible.com'
    ];

    const strippedUrl = url.replace(/^https?:\/\/(www\.)?/, '');

    for (const baseUrl of baseUrls) {
        if (strippedUrl.startsWith(baseUrl)) {
            return {
                onSupportedSite: true,
                book: 0,
                chapter: 0,
                verse: 0
            };
        }
    }

    return {
        onSupportedSite: false,
        book: 0,
        chapter: 0,
        verse: 0
    };  // Return default object if no pattern matches
}

onLiteralWordSite = function(){
    if (window.location.href.includes('literalword')){
        return true;
    }else{
        return false;
    }
}

// Example usage
let parsedBibleFromUrl = extractBibleReference();
if (parsedBibleFromUrl){
    parsedBibleFromUrl.onSupportedSite = true;
}
if (!parsedBibleFromUrl || parsedBibleFromUrl.book === 0){
    parsedBibleFromUrl = parseBibleURL();
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

    let queryStr = null;
    let esvLink = null;
    let nasbLink = null;
    let litWordLink = '';
    let ref = '';
     if (onLiteralWordSite() === false && parsedBibleFromUrl.book !== 0){
         ref = parsedBibleFromUrl.book + ' ' + parsedBibleFromUrl.chapter;
        queryStr = '?q='+parsedBibleFromUrl.book+'+'+parsedBibleFromUrl.chapter;
         if (parsedBibleFromUrl.verseMin){
            queryStr += ':'+parsedBibleFromUrl.verseMin;
             ref += ':'+parsedBibleFromUrl.verseMin;
         }
         if (parsedBibleFromUrl.verseMax){
             queryStr += '-'+parsedBibleFromUrl.verseMax;
             ref += '-'+parsedBibleFromUrl.verseMax;
         }
        esvLink = 'https://esv.literalword.com/'+queryStr;
        nasbLink = 'https://nasb.literalword.com/'+queryStr;
         litWordLink = '<span class="litWordLink">' + ref + ' <a  target="_blank" title="View this on esv.literalword.com" href="' + esvLink + '">ESV</a> ' +
             '<a target="_blank" title="View this on nasb.literalword.com" href="' + nasbLink + '">NASB</a></span>';
         divHeight = 30;
    }else if (parsedBibleFromUrl.onSupportedSite){
       //on supported site but cannot parse
        litWordLink = '<div class="note">Bible Study Helper Tool Available on this site, Navigate to specific chapter to enable jump to LiteralWord</div>';
    }

    let html = '';
    // Add some content to the new div
    html += `
    <div class="transformDiv">
    <img class="bibleToggleOpenClose" title="Bible Study Helper: Toggle Open/Close" onclick="transformOrUntransform($(this).closest('div.BibleStudyNav').get(0))" style="width: 25px" src="data:image/png;base64,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" />
</div>
`;
    if (onLiteralWordSite() === false && parsedBibleFromUrl.onSupportedSite){
       html += litWordLink;
    }else{
    html += `
<div class="options">
<h3 title="Bible Study Nav by Jim K"><b>Bible Study Helper</b></h3>
    <label>People
    <select class="numPeople" onchange="setCookie('numPeople', this.value); GENERATE_BIBLE_STUDY(this.value, $(this).closest('div').find('.numVerses').val())">
      <option>1</option>
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

    <section class="random">
        <h6>Random Word or Book:</h6>
        <ul>
          <li><a class="bn-word bn-esv" href="javascript: randomWord('esv');">Word [esv]</a></li>
          <li><a class="bn-word bn-nasb" href="javascript: randomWord('nasb');">Word [nasb]</a></li>
          <li><a class="bn-book bn-esv" href="javascript: window.location.href = 'https://esv.literalword.com/?q='+getRandomBibleBook();">Book [esv]</a></li>
          <li><a class="bn-book bn-nasb" href="javascript: window.location.href = 'https://nasb.literalword.com/?q='+getRandomBibleBook();">Book [nasb]</a></li>
          <li><a class="bn-book bn-esv bn-nt" href="javascript: window.location.href = 'https://esv.literalword.com/?q='+getRandomBibleBook({nt:1});">Book NT [esv]</a></li>
          <li><a class="bn-book bn-nasb bn-nt" href="javascript: window.location.href = 'https://nasb.literalword.com/?q='+getRandomBibleBook({nt:1});">Book NT [nasb]</a></li>
          <li><a class="bn-book bn-esv bn-ot" href="javascript: window.location.href = 'https://esv.literalword.com/?q='+getRandomBibleBook({ot:1});">Book OT [esv]</a></li>
          <li><a class="bn-book bn-nasb bn-ot" href="javascript: window.location.href = 'https://nasb.literalword.com/?q='+getRandomBibleBook({ot:1});">Book OT [nasb]</a></li>
        </ul>
    </section>
    </div>
    `;
    }
     newDiv.innerHTML = html;
    newDiv.className = 'BibleStudyNav';

    // Add the new div to the body of the current webpage
    document.body.appendChild(newDiv);
    $(newDiv).addClass('open');
    return newDiv;
}

function coinFlip() {
    return Math.random() < 0.5 ? 'Heads' : 'Tails';
}

getRandomBibleBook = function(opts = {}){

    const bibleBooksOT = [
        "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
        "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
        "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
        "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
        "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah",
        "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel",
        "Amos", "Obadiah", "Jonah", "Micah", "Nahum",
        "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"
    ];

    const bibleBooksNT = [
        "Matthew", "Mark", "Luke", "John", "Acts",
        "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
        "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy",
        "2 Timothy", "Titus", "Philemon", "Hebrews", "James",
        "1 Peter", "2 Peter", "1 John", "2 John", "3 John",
        "Jude", "Revelation"
    ];

    let rand = 1;
    let coin = coinFlip();

    if (opts.nt || coin === 'Heads'){
        rand = Math.floor(Math.random()*bibleBooksNT.length);
        return bibleBooksNT[rand];
    }
    if (opts.ot || coin === 'Tails'){
        rand = Math.floor(Math.random()*bibleBooksOT.length);
        return bibleBooksOT[rand];
    }
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

function getBaseUrl() {
    let url = new URL(window.location.href);
    let baseUrl = url.protocol + "//" + url.host;
    return baseUrl;
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

randomWord = function(bibleVersion){
    bibleVersion = bibleVersion || "esv";
    var rand = Math.floor(Math.random()*500);
var wordbank=new Array();
wordbank[0]="love";
wordbank[1]="the";
wordbank[2]="tree";
wordbank[3]="john";
wordbank[4]="heaven";
wordbank[5]="god";
wordbank[6]="of";
wordbank[7]="prayer";
wordbank[8]="law";
wordbank[9]="all is lawful";
wordbank[10]="spirit";
wordbank[11]="covenant";
wordbank[12]="pray";
wordbank[13]="him";
wordbank[14]="joy";
wordbank[15]="salvation";
wordbank[16]="great";
wordbank[17]="stone";
wordbank[18]="believe";
wordbank[19]="truly";
wordbank[20]="faith";
wordbank[21]="work";
wordbank[22]="anything";
wordbank[23]="fruits";
wordbank[24]="gaius";
wordbank[25]="love of god";
wordbank[26]="wisdom";
wordbank[27]="angel";
wordbank[28]="wife";
wordbank[29]="truth";
wordbank[30]="played";
wordbank[31]="\"son of man\"";
wordbank[32]="children";
wordbank[33]="word of";
wordbank[34]="friend";
wordbank[35]="gopher";
wordbank[36]="elders";
wordbank[37]="month";
wordbank[38]="holy spirit";
wordbank[39]="enemy";
wordbank[40]="forgive";
wordbank[41]="judge";
wordbank[42]="heaven";
wordbank[43]="truth";
wordbank[44]="wrath";
wordbank[45]="angel";
wordbank[46]="rejoice";
wordbank[47]="hell";
wordbank[48]="a";
wordbank[49]="lord";
wordbank[50]="sin";
wordbank[51]="mercy";
wordbank[52]="cross";
wordbank[53]="jesus";
wordbank[54]="peace";
wordbank[55]="grace";
wordbank[56]="jesus wept";
wordbank[57]="love of god";
wordbank[58]="eternal";
wordbank[59]="gift";
wordbank[60]="hope";
wordbank[61]="jesus";
wordbank[62]="light";
wordbank[63]="reward";
wordbank[64]="grace";
wordbank[65]="holy";
wordbank[66]="weary";
wordbank[67]="gospel";
wordbank[68]="grace";
wordbank[69]="strength";
wordbank[70]="believe";
wordbank[71]="heart";
wordbank[72]="pure";
wordbank[73]="thanksgiving";
wordbank[74]="father";
wordbank[75]="god";
wordbank[76]="test";
wordbank[77]="hell";
wordbank[78]="repent";
wordbank[79]="stand";
wordbank[80]="fool";
wordbank[81]="fruit";
wordbank[82]="israel";
wordbank[83]="power";
wordbank[84]="david";
wordbank[85]="fear";
wordbank[86]="the";
wordbank[87]="entangle";
wordbank[88]="husband";
wordbank[89]="news";
wordbank[90]="anger";
wordbank[91]="rest";
wordbank[92]="sword";
wordbank[93]="tongue";
wordbank[94]="saul";
wordbank[95]="judgment";
wordbank[96]="sabbath";
wordbank[97]="ambition";
wordbank[98]="restoring";
wordbank[99]="elijah";
wordbank[100]="holiness";
wordbank[101]="look";
wordbank[102]="persecute";
wordbank[103]="word";
wordbank[104]="fear god";
wordbank[105]="jew";
wordbank[106]="thanks";
wordbank[107]="spirit";
wordbank[108]="boast";
wordbank[109]="fire";
wordbank[110]="one";
wordbank[111]="who";
wordbank[112]="\"one another\"";
wordbank[113]="comfort";
wordbank[114]="crown";
wordbank[115]="marriage";
wordbank[116]="righteous";
wordbank[117]="temple";
wordbank[118]="prayer";
wordbank[119]="innocent";
wordbank[120]="persecution";
wordbank[121]="love joy peace";
wordbank[122]="gospel";
wordbank[123]="husbands";
wordbank[124]="nailed to the cross";
wordbank[125]="precious";
wordbank[126]="\"love of god\"";
wordbank[127]="disciples";
wordbank[128]="knowledge";
wordbank[129]="mind";
wordbank[130]="sacrifice";
wordbank[131]="seed";
wordbank[132]="word";
wordbank[133]="faith";
wordbank[134]="son";
wordbank[135]="what";
wordbank[136]="beauty";
wordbank[137]="cup";
wordbank[138]="repentance";
wordbank[139]="go";
wordbank[140]="silver";
wordbank[141]="desire";
wordbank[142]="everlasting";
wordbank[143]="noah";
wordbank[144]="praise";
wordbank[145]="serve";
wordbank[146]="wise";
wordbank[147]="yoke";
wordbank[148]="stumble";
wordbank[149]="endurance";
wordbank[150]="glory";
wordbank[151]="new creature";
wordbank[152]="son of god";
wordbank[153]="soul";
wordbank[154]="testimony";
wordbank[155]="spirit";
wordbank[156]="son";
wordbank[157]="god is good";
wordbank[158]="do not fear";
wordbank[159]="encourage";
wordbank[160]="fight";
wordbank[161]="kingdom";
wordbank[162]="riches";
wordbank[163]="war";
wordbank[164]="his";
wordbank[165]="paul";
wordbank[166]="church";
wordbank[167]="elder";
wordbank[168]="tongues";
wordbank[169]="give thanks";
wordbank[170]="jesus";
wordbank[171]="abomination";
wordbank[172]="baptism";
wordbank[173]="death";
wordbank[174]="faithful";
wordbank[175]="gentile";
wordbank[176]="sin";
wordbank[177]="sleep";
wordbank[178]="who is like";
wordbank[179]="woman";
wordbank[180]="fruit";
wordbank[181]="hate";
wordbank[182]="abraham";
wordbank[183]="bitter";
wordbank[184]="deacon";
wordbank[185]="flee";
wordbank[186]="food";
wordbank[187]="gentiles";
wordbank[188]="harlot";
wordbank[189]="lend";
wordbank[190]="moses";
wordbank[191]="need";
wordbank[192]="search";
wordbank[193]="blood";
wordbank[194]="church";
wordbank[195]="demon";
wordbank[196]="jerusalem";
wordbank[197]="justice";
wordbank[198]="mother";
wordbank[199]="perseverance";
wordbank[200]="signs";
wordbank[201]="barnabas";
wordbank[202]="raised";
wordbank[203]="snare";
wordbank[204]="where";
wordbank[205]="wisdom";
wordbank[206]="fear of the lord";
wordbank[207]="fruit spirit";
wordbank[208]="give thanks";
wordbank[209]="honor";
wordbank[210]="nailed cross";
wordbank[211]="name";
wordbank[212]="provide";
wordbank[213]="words";
wordbank[214]="worry";
wordbank[215]="mercy";
wordbank[216]="i";
wordbank[217]="judge";
wordbank[218]="circumcision";
wordbank[219]="die";
wordbank[220]="dream";
wordbank[221]="filthy rags";
wordbank[222]="good";
wordbank[223]="slave";
wordbank[224]="women";
wordbank[225]="forgive";
wordbank[226]="kill";
wordbank[227]="king saul";
wordbank[228]="\"my son\"";
wordbank[229]="praise";
wordbank[230]="red";
wordbank[231]="\"just as\"";
wordbank[232]="anxious";
wordbank[233]="father";
wordbank[234]="gossip";
wordbank[235]="hear";
wordbank[236]="know";
wordbank[237]="lord day";
wordbank[238]="paul";
wordbank[239]="solomon";
wordbank[240]="thank god";
wordbank[241]="treasure";
wordbank[242]="god";
wordbank[243]="wine";
wordbank[244]="loves";
wordbank[245]="\"the day\"";
wordbank[246]="come to me";
wordbank[247]="counsel";
wordbank[248]="divorce";
wordbank[249]="hate";
wordbank[250]="\"i am\"";
wordbank[251]="life";
wordbank[252]="mouth";
wordbank[253]="saul";
wordbank[254]="saved";
wordbank[255]="service";
wordbank[256]="slaves";
wordbank[257]="unity";
wordbank[258]="fear";
wordbank[259]="an";
wordbank[260]="shepherd";
wordbank[261]="said";
wordbank[262]="god";
wordbank[263]="\"kingdom of god\"";
wordbank[264]="ashamed";
wordbank[265]="strong";
wordbank[266]="delight";
wordbank[267]="despise";
wordbank[268]="drunk";
wordbank[269]="guide";
wordbank[270]="\"is a\"";
wordbank[271]="righteousness";
wordbank[272]="rock";
wordbank[273]="weights";
wordbank[274]="inheritance";
wordbank[275]="joy";
wordbank[276]="alone";
wordbank[277]="baptized";
wordbank[278]="blind";
wordbank[279]="calling";
wordbank[280]="compassion";
wordbank[281]="content";
wordbank[282]="gentle";
wordbank[283]="man";
wordbank[284]="jesus";
wordbank[285]="more";
wordbank[286]="test yourself";
wordbank[287]="apostle";
wordbank[288]="eternal life";
wordbank[289]="glory of god";
wordbank[290]="hosanna";
wordbank[291]="listen";
wordbank[292]="men";
wordbank[293]="money";
wordbank[294]="old";
wordbank[295]="plans";
wordbank[296]="promise";
wordbank[297]="vineyard";
wordbank[298]="weak";
wordbank[299]="word of god";
wordbank[300]="young men";
wordbank[301]="authority";
wordbank[302]="disciple";
wordbank[303]="heart";
wordbank[304]="heavens earth";
wordbank[305]="hope";
wordbank[306]="husbands";
wordbank[307]="jesus said";
wordbank[308]="third day";
wordbank[309]="ant";
wordbank[310]="authority";
wordbank[311]="devout";
wordbank[312]="healing";
wordbank[313]="lamb";
wordbank[314]="lazarus";
wordbank[315]="mark";
wordbank[316]="perfect";
wordbank[317]="peter";
wordbank[318]="seek";
wordbank[319]="shepherd";
wordbank[320]="the law";
wordbank[321]="witness";
wordbank[322]="wives";
wordbank[323]="joy";
wordbank[324]="christ";
wordbank[325]="door";
wordbank[326]="fool";
wordbank[327]="holy spirit";
wordbank[328]="humble";
wordbank[329]="light";
wordbank[330]="tongue";
wordbank[331]="who is";
wordbank[332]="adam";
wordbank[333]="age";
wordbank[334]="destroy";
wordbank[335]="drink";
wordbank[336]="fellowship";
wordbank[337]="fruits";
wordbank[338]="leader";
wordbank[339]="love your neighbor";
wordbank[340]="passover lamb";
wordbank[341]="perish";
wordbank[342]="punish";
wordbank[343]="remember";
wordbank[344]="seek first";
wordbank[345]="separate";
wordbank[346]="servant";
wordbank[347]="submit";
wordbank[348]="water";
wordbank[349]="worship";
wordbank[350]="\"son of god\"";
wordbank[351]="appear";
wordbank[352]="money";
wordbank[353]="thanksgiving";
wordbank[354]="grass";
wordbank[355]="help";
wordbank[356]="rejoice";
wordbank[357]="weeping";
wordbank[358]="\"tree of life\"";
wordbank[359]="adultery";
wordbank[360]="birth";
wordbank[361]="called";
wordbank[362]="christ";
wordbank[363]="days are evil";
wordbank[364]="demons";
wordbank[365]="faithfulness";
wordbank[366]="household";
wordbank[367]="interest";
wordbank[368]="labor";
wordbank[369]="lord";
wordbank[370]="lydia";
wordbank[371]="obey";
wordbank[372]="rebuke";
wordbank[373]="sheol";
wordbank[374]="holy";
wordbank[375]="peace";
wordbank[376]="thanks";
wordbank[377]="wisdom";
wordbank[378]="\"love of god\"";
wordbank[379]="compassion";
wordbank[380]="dog";
wordbank[381]="elders";
wordbank[382]="follow me";
wordbank[383]="greeting";
wordbank[384]="jealousy";
wordbank[385]="king";
wordbank[386]="kingdom";
wordbank[387]="repentance";
wordbank[388]="return";
wordbank[389]="woman";
wordbank[390]="jesus wept";
wordbank[391]="battle";
wordbank[392]="build up";
wordbank[393]="comforter";
wordbank[394]="confess";
wordbank[395]="conscience";
wordbank[396]="god's will";
wordbank[397]="house";
wordbank[398]="it is finished";
wordbank[399]="jacob";
wordbank[400]="laziness";
wordbank[401]="learning";
wordbank[402]="love is";
wordbank[403]="love god";
wordbank[404]="love your enemies";
wordbank[405]="molech";
wordbank[406]="narrow";
wordbank[407]="rod";
wordbank[408]="soldier";
wordbank[409]="thousand";
wordbank[410]="glory";
wordbank[411]="all";
wordbank[412]="faith love";
wordbank[413]="fast";
wordbank[414]="god love";
wordbank[415]="The";
wordbank[416]="heart";
wordbank[417]="\"light\"";
wordbank[418]="\"love of god\"";
wordbank[419]="all things";
wordbank[420]="beautiful";
wordbank[421]="cephas";
wordbank[422]="children blessing";
wordbank[423]="cursed";
wordbank[424]="encouragement";
wordbank[425]="follow me";
wordbank[426]="forgiveness";
wordbank[427]="foundation";
wordbank[428]="her";
wordbank[429]="joseph";
wordbank[430]="kindness";
wordbank[431]="leaders";
wordbank[432]="melchizedek";
wordbank[433]="pharisee";
wordbank[434]="scribes";
wordbank[435]="serve";
wordbank[436]="suffering";
wordbank[437]="the word of god";
wordbank[438]="today";
wordbank[439]="witnesses";
wordbank[440]="wolves";
wordbank[441]="womb";
wordbank[442]="love";
wordbank[443]="pray";
wordbank[444]="truth";
wordbank[445]="able";
wordbank[446]="bread";
wordbank[447]="david";
wordbank[448]="have not heard";
wordbank[449]="life";
wordbank[450]="marriage";
wordbank[451]="saints";
wordbank[452]="some";
wordbank[453]="faith";
wordbank[454]="life";
wordbank[455]="\"holy one\"";
wordbank[456]="anointing";
wordbank[457]="baptize";
wordbank[458]="body";
wordbank[459]="bones";
wordbank[460]="book of life";
wordbank[461]="bride";
wordbank[462]="brother";
wordbank[463]="courage";
wordbank[464]="covering";
wordbank[465]="diligence";
wordbank[466]="dwell";
wordbank[467]="esau";
wordbank[468]="feet";
wordbank[469]="immorality";
wordbank[470]="made";
wordbank[471]="mary";
wordbank[472]="milk";
wordbank[473]="prepared";
wordbank[474]="profitable";
wordbank[475]="purity";
wordbank[476]="sinner";
wordbank[477]="strong";
wordbank[478]="\"take up\"";
wordbank[479]="tree";
wordbank[480]="widow";
wordbank[481]="will of god";
wordbank[482]="gentle";
wordbank[483]="faith";
wordbank[484]="grace";
wordbank[485]="listen";
wordbank[486]="\"in him\"";
wordbank[487]="death";
wordbank[488]="faith";
wordbank[489]="friend";
wordbank[490]="righteousness";
wordbank[491]="slave";
wordbank[492]="sword";
wordbank[493]="chariots";
wordbank[494]="come";
wordbank[495]="darkness";
wordbank[496]="discipline";
wordbank[497]="ears";
wordbank[498]="eternity";
wordbank[499]="fathers";

//alert("You open the Bible and find every verse containing \'"+wordbank[rand]+"\'");
window.location="http://"+bibleVersion+".literalword.com/?words="+wordbank[rand]+"";
}

$(function(){
    let div = addDivWithScroll();
    addStyles(`
    .BibleStudyNav {
      background: rgba(255,255,255,0.5); /* make the background 50% transparent white */
      box-shadow: 0px 0px 10px 5px rgba(0,0,0,0.5); /* add a box shadow */
      padding-left: 3px;
      color: black;
      z-index: 50000;
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
    .BibleStudyNav section.random li {
      font-size: 11px;
      display: inline-block;
    }
    .BibleStudyNav section.random ul {
        list-style-type: none;

    }
    .BibleStudyNav h6{
        font-size: 11px;
        font-weight: bold;
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






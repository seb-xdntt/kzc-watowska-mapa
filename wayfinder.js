const budynekwords = ["bud",/(bud\d{1,})|(bud\b.{0,}\d{1,})|(b\d{1,})|(b\b.{0,}\d{1,})|(budynek\b.{0,}\d{1,})|(budynek\d{1,})/i]
const bibliotekawords = ["bg", "bib"]
const akademik_wojskowywords = ["aw","akademik"]
const stolowka_wojskowawords = ["sw", "stolowka","stołówka"]
const sztabwords =["sztab","100","^s$",/s\./, "sz$",/sz\./]
const wordFamilies = [budynekwords,bibliotekawords,akademik_wojskowywords,stolowka_wojskowawords,sztabwords]

function checkFamily(inputstring, wordgroup){
    let returnValue = false 
    wordgroup.forEach(word => {
        function matchWord(){return RegExp(word,)}
        if(inputstring.match(matchWord()) !== null){
            returnValue = true
        }
    });
    return returnValue
}

function findClass(inputstring) {
    //if number class as budynek
    if(!isNaN(inputstring) && inputstring !== "100"){
        return "bud"
    }
    //console.log('inputstring: ', inputstring);
    //else find class
    for (let index = 0; index < wordFamilies.length; index++) {
        let family = wordFamilies[index];
        let result = checkFamily(inputstring,family)
        if (result == true) {
            console.log(result, "family: ", family[0])
            return family[0]
        }
    }
}

function findNumber(inputstring){
    let outputString = inputstring.match(/\d{1,}/)[0]
    console.log('findNumber outputString :>> ', outputString);
    return outputString
}

function cleanInput() {
    var inputstring = document.getElementById("searchbar").value
    var outputString
    inputstring = inputstring.trim()
    inputstring = inputstring.toLowerCase()
    inputClass = findClass(inputstring)
    console.log('inputClass :>> ', inputClass);
    switch (inputClass) {
        case "bud":
            outputString = findNumber(inputstring)
            break
        case "sztab":
            outputString = "Sztab"
            break
        case "bg":
            outputString = "Biblioteka Glowna WAT"
            break
        case "aw":
            outputString = "AW"+findNumber(inputstring)
            break
        case "sw":
            outputString = "SW"+findNumber(inputstring)
            break
        default:
            outputString = inputstring
            break;
    }
    console.log('outputString: ', outputString);
    return outputString
}
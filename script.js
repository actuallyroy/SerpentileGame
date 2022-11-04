const x5 = document.getElementById("x5");
const x6 = document.getElementById("x6");
const x7 = document.getElementById("x7");
const x8 = document.getElementById("x8");
const x9 = document.getElementById("x9");
const grid = document.getElementById("grid")
const foundWordsE = document.getElementById("foundWords");


// import words from "./words.js"
import words from "./simple_english_dictionary.js"





var allTd = document.querySelectorAll("td")
let wordArr = []
let word = ""

let foundWords = []

let points = 0


let clicked = false


window.onmousedown = (e) => {
    clicked = true
    let tag = e.target.tagName
    if(tag == "SPAN" || tag == "TD"){
        if(tag == "SPAN"){
            e.target.parentElement.style.background = "green"
            e.target.parentElement.style.boxShadow = "none"
            wordArr.push(e.target.parentElement.id)
            word += e.target.innerHTML
        }else{
            e.target.style.background = "green"
            e.target.style.boxShadow = "none"
            wordArr.push(e.target.id)
            word += e.target.firstChild.innerHTML
        }
    }
}

window.onmouseup = () => {
    clicked = false
    allTd.forEach(item => {
        item.removeAttribute("style")
    })

    let checking = true

    for(var i = 0; i < wordArr.length-1; i++){
        if(!checkAdjacenty(wordArr[i], wordArr[i+1])){
            checking = false
        }
    }
    word = word.toLowerCase();
    if(!foundWords.includes(word)){
        if(checking && word.length > 2 && words[word]){
            points += word.length
            document.getElementById('point').innerHTML = `Points ${points}`
            document.getElementById("foundWord").innerHTML = `<div style="color: green; font-size: 30px; font-weight: bold; width: 1000px; text-align: center">Word:&nbsp;${word} + ${word.length}</div><br><div style="padding: 20px">${words[word]}</div>`
            foundWords.push(word)
            foundWordsE.innerHTML = `<div style="color: green">${word} + ${word.length}</div>` + foundWordsE.innerHTML
        }else{
            if(word.length > 2){
                document.getElementById("foundWord").innerHTML = `<div style="color: red; font-size: larger; font-weight: bold;">Word:&nbsp; ${word}</div>`
                foundWordsE.innerHTML = `<div style="color: red">${word}</div>` + foundWordsE.innerHTML
                document.getElementById('point').innerHTML = `Points ${points}`
            }
        }
    }else{
        document.getElementById('point').innerHTML = `Points ${points}`
        document.getElementById("foundWord").innerHTML = `<div style="color: gold; font-size: larger; font-weight: bold;">${word} already found</div>`
        foundWordsE.innerHTML = `<div style="color: gold">${word} already found</div>` + foundWordsE.innerHTML
    }
    word = ""
    wordArr = []
}


function checkAdjacenty(str1, str2){
    return (Math.abs(str2[0] - str1[0]) <= 1 && Math.abs(str2[1] - str1[1]) <= 1)
}

x5.onclick = () => {
    drawTable(5)
}


x6.onclick = () => {
    drawTable(6)
}

x7.onclick = () => {
    drawTable(7)
}

x8.onclick = () => {
    drawTable(8)
}

x9.onclick = () => {
    drawTable(9)
}

function drawTable(m){
    points = 0
    foundWords = []
    grid.innerHTML = "";
    foundWordsE.innerHTML = ""
    document.getElementById("foundWord").innerHTML = "."
    document.getElementById("point").innerHTML = `Points ${points}`
    for(let i = 0; i < m; i++){
        grid.innerHTML += "<tr></tr>"
        for(let j = 0; j < m; j++){
            let temp = getRandomLtr().toUpperCase();
            grid.lastChild.innerHTML += `<td id="${i}${j}"><span style='padding: 10px'>${temp}</span></td>`
        }
    }

    allTd = document.querySelectorAll("td");
    allTd.forEach(item => {
        item.firstChild.onmouseenter = (e) => {
            if(clicked && item.style.backgroundColor == ""){
                item.style.background = "green";
                item.style.boxShadow = "none"
                wordArr.push(item.id)
                word += item.firstChild.innerHTML
            }
        }
    })
    
}


const alphaFreq = {
    e: 56,
    a: 43,
    r: 38,
    i: 38,
    o: 36,
    t: 35,
    n: 34,
    s: 29,
    l: 27,
    c: 23,
    u: 19,
    d: 17,
    p: 16,
    m: 15,
    h: 15,
    g: 13,
    b: 10,
    f: 9,
    y: 9,
    w: 7,
    k: 6,
    v: 5,
    x: 2,
    z: 1,
    j: 1,
    q: 1
}

function getRandomLtr(){
    let arr = []

    Object.keys(alphaFreq).forEach(item => {
        for(var i = 0; i < alphaFreq[item]; i++){
            arr.push(item)
        }
    })
    let n = Math.round(Math.random()*(arr.length-1))
    return arr[n]
}


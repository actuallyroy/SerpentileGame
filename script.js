const x5 = document.getElementById("x5");
const x6 = document.getElementById("x6");
const x7 = document.getElementById("x7");
const x8 = document.getElementById("x8");
const x9 = document.getElementById("x9");
const grid = document.getElementById("grid")
const foundWordsE = document.getElementById("foundWords");


import words from "./words.js"


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
            document.getElementById("foundWord").innerHTML = `Word:&nbsp;<div style="color: green">${word} + ${word.length}</div>`
            foundWords.push(word)
            foundWordsE.innerHTML = `<div style="color: green">${word} + ${word.length}</div>` + foundWordsE.innerHTML
        }else{
            if(word.length != 0){
                document.getElementById("foundWord").innerHTML = `Word:&nbsp;<div style="color: red">${word}</div>`
                foundWordsE.innerHTML = `<div style="color: red">${word}</div>` + foundWordsE.innerHTML
                document.getElementById('point').innerHTML = `Points ${points}`
            }
        }
    }else{
        document.getElementById('point').innerHTML = `Points ${points}`
        document.getElementById("foundWord").innerHTML = `<div style="color: gold">${word} already found</div>`
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
            let temp = String.fromCharCode(Math.round(Math.random()*25 + 65))
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


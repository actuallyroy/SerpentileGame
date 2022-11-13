const x5 = document.getElementById("x5");
const x6 = document.getElementById("x6");
const x7 = document.getElementById("x7");
const x8 = document.getElementById("x8");
const x9 = document.getElementById("x9");
const grid = document.getElementById("grid")
const foundWordsE = document.getElementById("foundWords");
const foundWordTxt = document.getElementById("foundWordTxt")
const meaningTxt = document.getElementById("meaningTxt");



// import words from "./words.js"
import words from "./simple_english_dictionary.js"
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js';
import { getDatabase, ref, set, get, onValue, update } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyCb-TCCOXnPtBU0PpQwU7RJrgjxK9BeMng",
    authDomain: "teacher-mignon.firebaseapp.com",
    databaseURL: "https://teacher-mignon-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "teacher-mignon",
    storageBucket: "teacher-mignon.appspot.com",
    messagingSenderId: "980519638773",
    appId: "1:980519638773:web:5a89b64e00157f851457bc",
    measurementId: "G-N4BBN6VPBF"
  };

const app = initializeApp(firebaseConfig);

const db = getDatabase();


let roomNum = localStorage.getItem("roomNum")
if(!roomNum){
    roomNum = (Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000)
    localStorage.setItem("roomNum", roomNum)
}





const urlParams = new URLSearchParams(window.location.search);

if(urlParams.get("name")){
    localStorage.setItem("name", urlParams.get("name"))
}

let name = localStorage.getItem("name")
let oplayerName = "";

document.getElementById("myID").innerHTML = `${name || "My room No.:"}#${roomNum}`

let connectedWithFriend = false


let currentRoom = roomNum

if(urlParams.get('r'))
    get(ref(db, 'rooms/' + urlParams.get('r')))
    .then((snapshot) => {
        if(snapshot.exists()){
            connectedWithFriend = true
            currentRoom = urlParams.get("r")
            update(ref(db, 'rooms/' + currentRoom), {
                oplayer: {
                    name: name,
                    roomNum: roomNum
                }
            })
            onValue(ref(db, 'rooms/' + currentRoom + "/letters"), (snapshot) => {
                if(snapshot.exists()){
                    drawTable(Math.sqrt(snapshot.val().length), snapshot.val())
                }
            })
        }else{
            window.location.href = "join.html?e=nf"
        }
    })
    .catch(error => console.log(error))
else{
    update(ref(db, 'rooms/' + currentRoom), {
        name: name,
        oplayer: null
    })
    onValue(ref(db, 'rooms/' + currentRoom + "/oplayer"), (snapshot) => {
        if(snapshot.val()){
            console.log(snapshot.val());
            connectedWithFriend = true
            oplayerName = snapshot.val().name
        }
    })
    onValue(ref(db, 'rooms/' + currentRoom + "/letters"), (snapshot) => {
        if(snapshot.exists()){
            drawTable(Math.sqrt(snapshot.val().length), snapshot.val())
        }
    })
}









var allTd = document.querySelectorAll("td")
let wordArr = []
let word = ""

let foundWords = {}

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
    if(!Object.keys(foundWords).includes(word)){
        if(checking && word.length > 2 && words[word]){
            meaningTxt.innerHTML = ""
            points += word.length
            document.getElementById('point').innerHTML = `Points ${points}`
            foundWords[word] = name
            foundWordsE.innerHTML = `<div style="color: green">${word} + ${word.length}</div>` + foundWordsE.innerHTML
            foundWordTxt.innerHTML = `Word: ${word} + ${word.length}`
            foundWordTxt.style.color = 'green'
            fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word, {method: "GET"})
            .then(item => item.json())
            .then(data => {
                document.getElementById("meaningTxt").innerHTML = data[0].meanings[0].definitions[0].definition
            })
        }else if(word.length > 2){
            meaningTxt.innerHTML = ""
            foundWordTxt.innerHTML = word
            foundWordTxt.style.color = 'red'
            foundWordsE.innerHTML = `<div style="color: red">${word}</div>` + foundWordsE.innerHTML
            document.getElementById('point').innerHTML = `Points ${points}`
        }
    }else{
        meaningTxt.innerHTML = ""
        document.getElementById('point').innerHTML = `Points ${points}`
        foundWordTxt.innerHTML = `${word} already found`
        foundWordTxt.style.color = "gold"
        foundWordsE.innerHTML = `<div style="color: gold">${word} already found</div>` + foundWordsE.innerHTML
    }
    word = ""
    wordArr = []
}


function checkAdjacenty(str1, str2){
    return (Math.abs(str2[0] - str1[0]) <= 1 && Math.abs(str2[1] - str1[1]) <= 1)
}

x5.onclick = () => {
    drawTable(5, gnrtRndmLtrs(5))
}


x6.onclick = () => {
    drawTable(6, gnrtRndmLtrs(6))
}

x7.onclick = () => {
    drawTable(7, gnrtRndmLtrs(7))
}

x8.onclick = () => {
    drawTable(8, gnrtRndmLtrs(8))
}

x9.onclick = () => {
    drawTable(9, gnrtRndmLtrs(9))
}

function drawTable(m, randomLtrsArr){
    points = 0
    foundWords = {}
    grid.innerHTML = "";
    foundWordsE.innerHTML = ""
    // let randomLtrsArr = gnrtRndmLtrs(m);
    document.getElementById("point").innerHTML = `Points ${points}`
    for(let i = 0; i < m; i++){
        grid.innerHTML += "<tr></tr>"
        for(let j = 0; j < m; j++){
            grid.lastChild.innerHTML += `<td id="${i}${j}"><span style='padding: 10px'>${randomLtrsArr[i*m+j].toUpperCase()}</span></td>`
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


function gnrtRndmLtrs(m){
    let result = []
    for(let i = 0; i < m*m; i++){
        result.push(getRandomLtr());
    }
    update(ref(db, 'rooms/' + currentRoom), {
        letters: result
    })
    return result
}


function getRandomLtr(){
    let arr = []
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

    Object.keys(alphaFreq).forEach(item => {
        for(var i = 0; i < alphaFreq[item]; i++){
            arr.push(item)
        }
    })
    let n = Math.round(Math.random()*(arr.length-1))
    return arr[n]
}

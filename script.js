const x5 = document.getElementById("x5");
const x6 = document.getElementById("x6");
const x7 = document.getElementById("x7");
const x8 = document.getElementById("x8");
const x9 = document.getElementById("x9");
const grid = document.getElementById("grid")
const foundWordsE = document.getElementById("foundWords");
const foundWordTxt = document.getElementById("foundWordTxt")
const meaningTxt = document.getElementById("meaningTxt")
const oNumber = document.getElementById("o-number")
const oPoint = document.getElementById("o-point")
const timer = document.getElementById("timer")
const playBtn = document.getElementById("playBtn")
const popUp = document.getElementById("popup")





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
let imOplayer = false

let timerIsRunning = false

let currentRoom = roomNum

update(ref(db, 'rooms/' + currentRoom), {
    play: false
})

if(urlParams.get('r')){
    imOplayer = true
    get(ref(db, 'rooms/' + urlParams.get('r')))
    .then((snapshot) => {
        if(snapshot.exists()){
            connectedWithFriend = true
            oplayerName = snapshot.val().name
            currentRoom = urlParams.get("r")
            update(ref(db, 'rooms/' + currentRoom), {
                oplayer: {
                    name: name,
                    roomNum: roomNum
                },
                oPlayerwords: null,
                mywords: null
            })
            console.log(snapshot.val())
            oNumber.innerHTML = `Playing with: ${snapshot.val().name}#${urlParams.get('r')}`
            oPoint.innerHTML = `${snapshot.val().name}: 0`
            onValue(ref(db, 'rooms/' + currentRoom + "/letters"), (snapshot) => {
                if(snapshot.exists()){
                    drawTable(Math.sqrt(snapshot.val().length), snapshot.val())
                }
            })
            onValue(ref(db, 'rooms/' + currentRoom + "/oPlayerWords"), (snapshot) => {
                if(snapshot.exists()){
                    console.log(snapshot.val())
                }
            })
            onValue(ref(db, 'rooms/' + currentRoom + "/play"), (snapshot) => {
                if(snapshot.exists()){
                    if(snapshot.val()){
                        playBtn.style.display = "none"
                        timerIsRunning = true
                        startTimer()
                        oPlayerPoints = 0
                        points = 0
                        foundWords = []
                        foundWordsE.innerHTML = ""
                        foundWordTxt.value = ""
                        meaningTxt.innerHTML = ""
                    }
                }
            })

        }else{
            window.location.href = "join.html?e=nf"
        }
    })
    .catch(error => console.log(error))
}
else{

    playBtn.style.display = "block"
    playBtn.onclick = () => {
        if(!timerIsRunning){
            timerIsRunning = true
            update(ref(db, 'rooms/' + currentRoom), {play: true})
            startTimer()
            oPlayerPoints = 0
            points = 0
            foundWordsArr = []
            foundWordsE.innerHTML = ""  
            foundWordTxt.innerHTML = ""
            meaningTxt.innerHTML = ""
        }
    }


    update(ref(db, 'rooms/' + currentRoom), {
        name: name,
        oplayer: null
    })
    onValue(ref(db, 'rooms/' + currentRoom + "/oplayer"), (snapshot) => {
        if(snapshot.val()){
            console.log(snapshot.val());
            connectedWithFriend = true
            oplayerName = snapshot.val().name
            oPoint.innerHTML = `${oplayerName}: 0`
            oNumber.innerHTML = `Playing with: ${oplayerName}#${snapshot.val().roomNum}`
        }
    })
    onValue(ref(db, 'rooms/' + currentRoom + "/letters"), (snapshot) => {
        if(snapshot.exists()){
            drawTable(Math.sqrt(snapshot.val().length), snapshot.val())
        }
    })
}



function startTimer() {
    let d = new Date().getTime();
    let d1 = new Date(d+600000)
    timer.style.color = "red"
    let x = setInterval(function() {
        let now = new Date().getTime();
        let distance = d1 - now;
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        timer.innerHTML = (minutes < 10? "0" + minutes : minutes) + ":" + (seconds < 10? "0" + seconds : seconds);
        if (distance < 0) {
            clearInterval(x);
            timerIsRunning = false
            timer.innerHTML = "00:00";
            update(ref(db, 'rooms/' + currentRoom), {play: false})
            popUp.style.display = "flex"
            document.querySelector("h1").innerHTML = points < oPlayerPoints ? `${oplayerName} won!!! yaay!🎉🎉🎉` : `${name} won!! yaay!🎉🎉🎉`
        }
    }, 1000);
}








var allTd = document.querySelectorAll("td")
let ltrsArr = []
let word = ""

let foundWords = {}

let foundWordsArr = []


let points = 0

let oPlayerPoints = 0


let clicked = false


window.onmousedown = (e) => {
    clicked = true
    let tag = e.target.tagName
    if(tag == "SPAN" || tag == "TD"){
        if(tag == "SPAN"){
            e.target.parentElement.style.background = "green"
            e.target.parentElement.style.boxShadow = "none"
            ltrsArr.push(e.target.parentElement.id)
            word += e.target.innerHTML
        }else{
            e.target.style.background = "green"
            e.target.style.boxShadow = "none"
            ltrsArr.push(e.target.id)
            word += e.target.firstChild.innerHTML
        }
    }
}

window.onmouseup = () => {
    clicked = false
    let wordObj = {
        right: null,
        wrong: null,
        already: null
    }
    allTd.forEach(item => {
        item.removeAttribute("style")
    })

    let checking = true

    for(var i = 0; i < ltrsArr.length-1; i++){
        if(!checkAdjacenty(ltrsArr[i], ltrsArr[i+1])){
            checking = false
        }
    }
    word = word.toLowerCase();
    if(!foundWordsArr.includes(word) && word.length > 2){
        if(checking && words[word]){
            points += word.length
            document.getElementById('point').innerHTML = `${name} ${points}`
            fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word, {method: "GET"})
            .then(item => item.json())
            .then(data => {
                document.getElementById("meaningTxt").innerHTML = data[0].meanings[0].definitions[0].definition
            })
            wordObj["right"] = word
            foundWords[name] = word
            foundWordsArr.push(word)
        }else {
            wordObj["wrong"] = word
        }
    }else if(word.length > 2){
        wordObj["already"] = word
    }
    word = ""
    ltrsArr = []
    if(imOplayer){
        addFoundWordToSideList(wordObj, urlParams.get("name"))
        update(ref(db, 'rooms/' + currentRoom + "/oPlayerwords"), wordObj)
    }else{
        addFoundWordToSideList(wordObj, name)
        update(ref(db, 'rooms/' + currentRoom + "/mywords"), wordObj)
    }
}
setTimeout(() => {
    if(imOplayer){
        console.log(oplayerName)
        onValue(ref(db, 'rooms/' + currentRoom + "/mywords"), (snapshot) => {
            if(snapshot.exists()){
                console.log(snapshot.val())
                if(snapshot.val().right){
                    oPlayerPoints += snapshot.val().right.length
                    oPoint.innerHTML = `${oplayerName}: ${oPlayerPoints}`
                    foundWordsArr.push(snapshot.val().right)
                }
                foundWords[oplayerName] = snapshot.val().right || snapshot.val().wrong || snapshot.val().already
                addFoundWordToSideList(snapshot.val(), oplayerName)
            }
        })
    }
}, 2000);
onValue(ref(db, 'rooms/' + currentRoom + "/oPlayerwords"), (snapshot) => {
    if(snapshot.exists()){
        console.log(snapshot.val())
        if(snapshot.val().right){
            oPlayerPoints += snapshot.val().right.length
            oPoint.innerHTML = `${oplayerName}: ${oPlayerPoints}`
            foundWordsArr.push(snapshot.val().right)
        }
        foundWords[oplayerName] = snapshot.val().right || snapshot.val().wrong || snapshot.val().already
        addFoundWordToSideList(snapshot.val(), oplayerName)
    }
})


function addFoundWordToSideList(wordobj, name){
    meaningTxt.innerHTML = ""
    foundWordTxt.innerHTML = ""
    if(wordobj.right){
        foundWordsE.innerHTML = `<div style="color: green">${name}: ${wordobj.right}</div>` + foundWordsE.innerHTML
        foundWordTxt.innerHTML = `Word: ${wordobj.right} + ${wordobj.right.length}`
        foundWordTxt.style.color = 'green'
    }else if(wordobj.wrong){
        foundWordsE.innerHTML = `<div style="color: red">${name}: ${wordobj.wrong}</div>` + foundWordsE.innerHTML
        foundWordTxt.innerHTML = wordobj.wrong
        foundWordTxt.style.color = 'red'
    }else if(wordobj.already){
        foundWordsE.innerHTML = `<div style="color: gold">${name}: ${wordobj.already} already found</div>` + foundWordsE.innerHTML
        foundWordTxt.innerHTML = `${wordobj.already} already found`
        foundWordTxt.style.color = "gold"
    }
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
    oPlayerPoints = 0
    foundWords = {}
    grid.innerHTML = "";
    foundWordsE.innerHTML = ""
    // let randomLtrsArr = gnrtRndmLtrs(m);
    document.getElementById("point").innerHTML = `${name}: ${points}`
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
                ltrsArr.push(item.id)
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

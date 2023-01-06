const colors = [
    {
        english: 'red',
        korean: '빨간색',
        color: '#C21010'
    },
    {
        english: 'pink',
        korean: '분훙색',
        color: '#FF597B'
    },
    {
        english: 'orange',
        korean: '주황색',
        color: 'orange'
    },
    {
        english: 'yellow',
        korean: '노란색',
        color: ' #FDFD97'
    },
    {
        english: 'green',
        korean: '초록색',
        color: '#379237'
    },
    {
        english: 'lightgreen',
        korean: '면두색',
        color: '#D5F591'
    },
    {
        english: 'blue',
        korean: '파란색',
        color: '#1167b1'
    },
    {
        english: 'indigo',
        korean: '남색',
        color: '#03254c'
    },
    {
        english: 'sky blue',
        korean: '하늘색',
        color: '#8ecae6'
    },
    {
        english: 'purple',
        korean: '보라색',
        color: '#6C00FF'
    },
    {
        english: 'grey',
        korean: '회색',
        color: '#888888'
    },
    {
        english: 'white',
        korean: '횐색',
        color: 'white'
    },
    {
        english: 'black',
        korean: '검정색',
        color: 'black'
    },
]

const btnStart = document.querySelector('.btn-start')
const colorToGuess = document.querySelector('.color-to-guess')
const choicesContainer = document.querySelector('.choices')
const choiceDivs = document.querySelectorAll('.choice')
const btnShowColors = document.querySelector('.btn-show-colors')
const colorList = document.querySelector('.color-list')

// Audio
let rightSound = document.getElementById('right');
let wrongSound = document.getElementById('wrong');
let splatSound = document.getElementById('splat');
splatSound.volume = 0.5
wrongSound.volume = 0.2
rightSound.volume = 0.5

const numberOfChoices = 4
let lastQuestions = []
let choices = []
let currentAnswer;
let showColorList = false
let answerFound = false

function getRandomColor() {
    const index = Math.floor(Math.random() * colors.length)
    const color = colors[index]

    if (choices.includes(color)) return getRandomColor()
    return color
}

function pickAnswer() {
    const index = Math.floor(Math.random() * numberOfChoices)
    const color = choices[index]

    if (lastQuestions.includes(color)) return pickAnswer()

    lastQuestions.push(color)
    if (lastQuestions.length > 4) {
        lastQuestions.shift()
    }

    return color
}

function newGuess() {
    choices = []
    for (let i = 0; i < numberOfChoices; i++) {
        choices[i] = getRandomColor()
    }
    
    choiceDivs.forEach(div => {
        div.textContent = ''
        div.classList.add('flip')
    })
    const answerColor = pickAnswer()
    currentAnswer = answerColor
    changeSVGColor(answerColor.color)
    setTimeout(() => {
        answerFound = false
        choiceDivs.forEach(div => {
            div.classList.remove('flip')
            setTimeout(() => {
                const index = div.dataset.index
                div.textContent = choices[index].korean
            }, 100)
        })
    }, 1000)
}

function changeSVGColor(color) {
    const image = colorToGuess.contentDocument
    const svg = image.querySelector('svg')
    const g = image.querySelector('g')
    if (g) {
        setTimeout(() => {
            g.style.fill = color
            splatSound.play()
            colorToGuess.classList.remove('active')
        }, 500)
    } else {
        setTimeout(() => {
            changeSVGColor(color)
        }, 10)
    }
  }

function checkAnswer() {
    if (answerFound) return
    const index = this.dataset.index
    const colorSelected = choices[index]
    if (colorSelected !== currentAnswer) {
        this.classList.add('wrong-answer')
        wrongSound.currentTime = 0
        wrongSound.play()
    } else {
        answerFound = true
        this.classList.add('right-answer')
        party.confetti(this, {
            count: party.variation.range(20, 40),
        });
        colorToGuess.classList.add('active')
        rightSound.play()
        setTimeout(() => {
            choiceDivs.forEach(div => {
                div.classList.remove('right-answer')
                div.classList.remove('wrong-answer')
            })
            newGuess()
        }, 2000)
    }
}

function setupListColors() {
    let html = ''
    colors.forEach(color => {
        html += `<div class="color-line">
            <div style="background-color: ${color.color}" class="square"></div>
            <span class="korean">${color.korean}</class>
        </div>`
    })
    colorList.innerHTML = html
}

function handleShowColors() {
    colorList.style.visibility = showColorList ? 'hidden' : 'visible'
    btnShowColors.textContent = showColorList ? '📖' : '📕'
    btnShowColors.style.backgroundColor = showColorList ? '#fef6e4' : 'lightblue'
    showColorList = !showColorList
}

function startGame() {
    btnStart.style.visibility = 'hidden'
    setTimeout(() => {
        colorToGuess.style.opacity = 1
        newGuess()
        setTimeout(() => {
            choicesContainer.style.opacity = 1
        }, 1000)
    }, 500)
}

choiceDivs.forEach(div => {
    div.addEventListener('click', checkAnswer)
})

btnShowColors.addEventListener('click', handleShowColors)
btnStart.addEventListener('click', startGame)

setupListColors()

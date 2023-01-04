const colors = [
    {
        english: 'red',
        korean: '빨간색',
        color: '#FF6663'
    },
    {
        english: 'orange',
        korean: '주황색',
        color: '#FEB144'
    },
    {
        english: 'yellow',
        korean: '노란색',
        color: ' #FDFD97'
    },
    {
        english: 'green',
        korean: '초록색',
        color: '#9EE09E'
    },
    {
        english: 'blue',
        korean: '파란색',
        color: '#9EC1CF'
    },
    {
        english: 'indigo',
        korean: '남색',
        color: '#8686AF'
    },
    {
        english: 'purple',
        korean: '보라색',
        color: '#CC99C9'
    },
]

const colorToGuess = document.querySelector('.color-to-guess')
const choiceDivs = document.querySelectorAll('.choice')
const btnShowColors = document.querySelector('.btn-show-colors')
const colorList = document.querySelector('.color-list')

const numberOfChoices = 4
let lastQuestions = []
let choices = []
let currentAnswer;
let showColorList = false

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
    if (lastQuestions.length > 3) {
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
        const index = div.dataset.index
        div.textContent = choices[index].korean
    })

    const answerColor = pickAnswer()
    currentAnswer = answerColor
    changeSVGColor(answerColor.color)
}

function changeSVGColor(color) {
    const image = colorToGuess.contentDocument
    const svg = image.querySelector('svg')
    const g = image.querySelector('g')
    if (g) {
        g.style.fill = color
    } else {
        setTimeout(() => {
            changeSVGColor(color)
        }, 10)
    }
  }

function checkAnswer() {
    const index = this.dataset.index
    const colorSelected = choices[index]
    if (colorSelected !== currentAnswer) {
        this.classList.add('wrong-answer')
    } else {
        this.classList.add('right-answer')
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
    showColorList = !showColorList
}

choiceDivs.forEach(div => {
    div.addEventListener('click', checkAnswer)
})

btnShowColors.addEventListener('click', handleShowColors)

setupListColors()
newGuess()

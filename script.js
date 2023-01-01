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

const numberOfChoices = 4
let lastQuestions = []
let choices = []
let currentAnswer;

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
    colorToGuess.style.backgroundColor = answerColor.color
}

function checkAnswer() {
    const index = this.dataset.index
    const colorSelected = choices[index]
    console.log({currentAnswer, colorSelected})
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

choiceDivs.forEach(div => {
    div.addEventListener('click', checkAnswer)
})

newGuess()
// quiz-script.js

document.addEventListener('DOMContentLoaded', () => {
    const quizArea = document.getElementById('quiz-area');
    const submitButton = document.getElementById('submit-quiz-btn');
    const quizResult = document.getElementById('quiz-result');
    const scoreValue = document.getElementById('score-value');
    const totalQuestionsSpan = document.getElementById('total-questions');
    const feedbackArea = document.getElementById('feedback-area');
    const retakeButton = document.getElementById('retake-quiz-btn');

    const quizQuestions = [
        {
            id: 'q1',
            question: "Who invented HTML?",
            options: ["Bill Gates", "Neal Armstrong", "Brendan Eich", "Elon Musk", "Tim Berners-Lee"],
            correctAnswer: "Tim Berners-Lee"
        },
        {
            id: 'q2',
            question: "What is the main purpose of CSS?",
            options: ["Add interactivity", "Store data", "Style web pages", "Secure websites"],
            correctAnswer: "Style web pages"
        },
        {
            id: 'q3',
            question: "In which year was JavaScript created?",
            options: ["1989", "1991", "1995", "2001"],
            correctAnswer: "1995"
        },
        {
            id: 'q4',
            question: "Who developed JavaScript?",
            options: ["Tim Berners-Lee", "Håkon Wium Lie", "Brendan Eich", "Marc Andreessen"],
            correctAnswer: "Brendan Eich"
        },
        {
            id: 'q5',
            question: "What major update modernized HTML in the late 2000s?",
            options: ["HTML2", "HTML4", "XHTML", "HTML5"],
            correctAnswer: "HTML5"
        }
    ];

    let userAnswers = {};
    totalQuestionsSpan.textContent = quizQuestions.length;

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function renderQuiz() {
        quizArea.innerHTML = '';
        userAnswers = {};

        const shuffledQuestions = shuffleArray([...quizQuestions]);

        shuffledQuestions.forEach((q, displayIndex) => {
            const questionCard = document.createElement('div');
            questionCard.classList.add('question-card');
            questionCard.dataset.questionId = q.id;
            questionCard.dataset.displayIndex = displayIndex;

            const questionText = document.createElement('p');
            questionText.classList.add('question-text');
            questionText.textContent = `${displayIndex + 1}. ${q.question}`;
            questionCard.appendChild(questionText);

            const optionsList = document.createElement('ul');
            optionsList.classList.add('options-list');

            const shuffledOptions = shuffleArray([...q.options]);

            shuffledOptions.forEach((option, oIndex) => {
                const listItem = document.createElement('li');
                const radioInput = document.createElement('input');
                radioInput.type = 'radio';
                radioInput.name = `question-${q.id}`;
                radioInput.id = `q${q.id}-option${oIndex}`;
                radioInput.value = option;

                radioInput.addEventListener('change', (event) => {
                    userAnswers[q.id] = event.target.value;
                    checkAllAnswered();
                });

                const label = document.createElement('label');
                label.classList.add('option-label');
                label.setAttribute('for', `q${q.id}-option${oIndex}`);
                label.textContent = option;
                label.prepend(radioInput);

                listItem.appendChild(label);
                optionsList.appendChild(listItem);
            });

            quizArea.appendChild(questionCard);
            questionCard.appendChild(optionsList);
        });

        submitButton.style.display = 'block';
        submitButton.disabled = true;
        quizResult.classList.add('hidden');
        feedbackArea.innerHTML = '';
    }

    function checkAllAnswered() {
        const allAnswered = quizQuestions.every(q => userAnswers.hasOwnProperty(q.id));
        submitButton.disabled = !allAnswered;
    }

    function submitQuiz() {
        let score = 0;
        feedbackArea.innerHTML = '';

        const displayedQuestionCards = quizArea.querySelectorAll('.question-card');
        displayedQuestionCards.forEach((questionCard) => {
            const questionId = questionCard.dataset.questionId;
            const displayIndex = parseInt(questionCard.dataset.displayIndex);

            const q = quizQuestions.find(item => item.id === questionId);

            if (!q) return;

            const userAnswer = userAnswers[q.id];
            const isCorrect = userAnswer === q.correctAnswer;

            if (isCorrect) {
                score++;
                questionCard.classList.add('correct-answer');
            } else {
                questionCard.classList.add('incorrect-answer');
            }

            const options = questionCard.querySelectorAll('.option-label');
            options.forEach(optionLabel => {
                const radioInput = optionLabel.querySelector('input[type="radio"]');
                optionLabel.classList.remove('selected', 'correct');

                if (radioInput.value === userAnswer && radioInput.checked) {
                    optionLabel.classList.add('selected');
                }
                if (radioInput.value === q.correctAnswer) {
                    optionLabel.classList.add('correct');
                }

                radioInput.disabled = true;
            });

            const feedbackItem = document.createElement('div');
            feedbackItem.classList.add('question-feedback');
            feedbackItem.classList.add(isCorrect ? 'correct' : 'incorrect');

            feedbackItem.innerHTML = `
                <p class="feedback-question-text">${displayIndex + 1}. ${q.question}</p>
                <p class="your-answer">Your Answer: <strong>${userAnswer || 'Not Answered'}</strong></p>
                ${!isCorrect ? `<p class="correct-answer-text">Correct Answer: <strong>${q.correctAnswer}</strong></p>` : ''}
            `;
            feedbackArea.appendChild(feedbackItem);
        });

        scoreValue.textContent = score;
        quizResult.classList.remove('hidden');
        submitButton.style.display = 'none';
    }

    submitButton.addEventListener('click', submitQuiz);
    retakeButton.addEventListener('click', renderQuiz);

    renderQuiz();
});

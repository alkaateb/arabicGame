document.addEventListener("DOMContentLoaded", () => {
    shuffleWords();
});

const wordsContainer = document.getElementById('words-container');
const words = document.querySelectorAll('.word');
const dropzones = document.querySelectorAll('.dropzone');
const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');

words.forEach(word => {
    word.addEventListener('dragstart', dragStart);
    word.addEventListener('dragend', dragEnd);
});

dropzones.forEach(dropzone => {
    dropzone.addEventListener('dragstart', dragStartFromDropzone);
    dropzone.addEventListener('dragover', dragOver);
    dropzone.addEventListener('drop', drop);
});

function dragStart(event) {
    event.dataTransfer.setData('text', event.target.textContent);
    setTimeout(() => {
        event.target.style.visibility = 'hidden';
    }, 0);
}

function dragStartFromDropzone(event) {
    if (event.target.textContent) {
        event.dataTransfer.setData('text', event.target.textContent);
        setTimeout(() => {
            event.target.textContent = '';
            event.target.style.border = '2px dashed #ccc';
        }, 0);
    }
}

function dragEnd(event) {
    event.target.style.visibility = 'visible';
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text');
    const wordElement = Array.from(words).find(word => word.textContent === data);

    if (event.target.classList.contains('dropzone')) {
        if (event.target.textContent) {
            const previousDropzone = Array.from(dropzones).find(dropzone => dropzone.textContent === data);
            if (previousDropzone) {
                previousDropzone.textContent = '';
                previousDropzone.style.border = '2px dashed #ccc';
            }
        }
        event.target.textContent = data;
        event.target.style.border = '2px solid #007bff';
        if (wordElement) {
            wordElement.style.display = 'none';
        }
    } else if (event.target.classList.contains('word')) {
        const previousDropzone = Array.from(dropzones).find(dropzone => dropzone.textContent === data);
        if (previousDropzone) {
            previousDropzone.textContent = '';
            previousDropzone.style.border = '2px dashed #ccc';
        }
        event.target.textContent = data;
        event.target.style.display = 'inline-block';
    }
}

function checkAnswers() {
    let allCorrect = true;
    let correctCount = 0;
    dropzones.forEach(dropzone => {
        const answer = dropzone.getAttribute('data-answer');
        if (dropzone.textContent === answer) {
            dropzone.style.border = '2px solid green';
            correctCount++;
        } else {
            dropzone.style.border = '2px solid red';
            allCorrect = false;
        }
    });

    if (allCorrect) {
        correctSound.play();
        alert('جميع الإجابات صحيحة!');
    } else {
        const wrongCount = dropzones.length - correctCount;
        wrongSound.play();
        alert(`بعض الإجابات خاطئة. لديك ${wrongCount} إجابات خاطئة من أصل ${dropzones.length}. حاول مرة أخرى.`);
        resetGame();
    }
}

function resetGame() {
    dropzones.forEach(dropzone => {
        dropzone.textContent = '';
        dropzone.style.border = '2px dashed #ccc';
    });

    words.forEach(word => {
        word.style.display = 'inline-block';
        word.style.visibility = 'visible';
    });

    shuffleWords();
}

function shuffleWords() {
    const wordsArray = Array.from(wordsContainer.children);
    while (wordsArray.length) {
        const randomIndex = Math.floor(Math.random() * wordsArray.length);
        wordsContainer.appendChild(wordsArray.splice(randomIndex, 1)[0]);
    }
}


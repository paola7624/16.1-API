document.getElementById('start').addEventListener('click', function () {
    document.getElementById('welcome').classList.add('d-none');
    document.getElementById('game').classList.remove('d-none');
    document.getElementById('results').classList.add('d-none'); 

    // Mostrar mensaje de carga
    const loadingMessage = document.createElement('p');
    loadingMessage.textContent = "Cargando preguntas, por favor espera...";
    document.getElementById('game').appendChild(loadingMessage);

    // Cargar preguntas
    fetch("https://opentdb.com/api.php?amount=50&category=9")
      .then(response => response.json())
      .then(async data => {
        const allQuestions = data.results;

        if (allQuestions.length === 0) {
          throw new Error("No se encontraron preguntas en la API.");
        }

        // Selecciona 10 preguntas aleatorias
        const selectedQuestions = [];
        while (selectedQuestions.length < 10) {
            const randomIndex = Math.floor(Math.random() * allQuestions.length);
            const question = allQuestions[randomIndex];
            if (!selectedQuestions.includes(question)) {
              selectedQuestions.push(question);
            }
        }

        // // Aplica la traducción a cada pregunta con manejo de errores
        // for (const question of selectedQuestions) {
        //     question.question = await translateText(question.question);
        //     question.correct_answer = await translateText(question.correct_answer);
        //     question.incorrect_answers = await Promise.all(
        //         question.incorrect_answers.map(async (answer) => await translateText(answer))
        //     );
        // }

        // Llama a loadQuestions con las preguntas seleccionadas
        loadQuestions(selectedQuestions);

        // Quitar mensaje de carga
        loadingMessage.remove();
      })
      .catch(error => {
        console.error("Error al cargar preguntas:", error);
        alert("Hubo un problema al cargar las preguntas. Inténtalo de nuevo más tarde.");
      });
});


// // Función para traducir las preguntas de inglés a español
// async function translateText(text) {
//     try {
//         const response = await fetch("https://api.libretranslate.com/translate", {
//             method: "POST",
//             body: JSON.stringify({
//                 q: text,
//                 source: "en",
//                 target: "es",
//                 format: "text"
//             }),
//             headers: { "Content-Type": "application/json" }
//         });
//         const data = await response.json();
//         return data.translatedText || text; // Devuelve el texto original si no se pudo traducir
//     } catch (error) {
//         console.error("Error en la traducción:", error);
//         return text; // Devuelve el texto original si ocurre un error
//     }
// }

// Variables para manejo de preguntas
let currentQuestionIndex = 0;
let selectedQuestions = [];
let userAnswers = [];

// Función para cargar preguntas
function loadQuestions(questions) {
    selectedQuestions = questions;
    showQuestion(currentQuestionIndex);
}


// Funcion para mostrar correctamente el texto
function decodeHtmlEntities(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
}


// Función para mostrar una pregunta
function showQuestion(index) {
    const question = selectedQuestions[index];
    const questionNumberContainer = document.getElementById("question-number");
    const questionContainer = document.getElementById("question");
    const answersContainer = document.getElementById("answers");

    // Mostrar el número y texto de la pregunta
    questionNumberContainer.textContent = index + 1;
    questionContainer.textContent = decodeHtmlEntities(question.question);


    // Limpiar respuestas anteriores
    answersContainer.innerHTML = "";

    // Mezclar respuestas
    const answers = [...question.incorrect_answers, question.correct_answer];
    answers.sort(() => Math.random() - 0.5);

    answers.forEach((answer, idx) => {
        const optionDiv = document.createElement('div');
        optionDiv.classList.add('option-btn', 'btn', 'btn-outline-primary', 'custom-control', 'custom-radio', 'mb-2');
        
        const input = document.createElement('input');
        input.type = 'radio';
        input.id = `option${idx}`;
        input.name = "answer";
        input.classList.add('custom-control-input');
        input.value = answer;

        const label = document.createElement('label');
        label.classList.add('custom-control-label');
        label.setAttribute('for', `option${idx}`);
        label.innerHTML = decodeHtmlEntities(answer);

        optionDiv.appendChild(input);
        optionDiv.appendChild(label);
        answersContainer.appendChild(optionDiv);
    });
}

// Manejador para enviar respuesta y pasar a la siguiente pregunta
document.getElementById('answer-form').addEventListener('submit', function (event) {
    event.preventDefault();

    // Verifica que haya una pregunta cargada antes de continuar
    if (!selectedQuestions || selectedQuestions.length === 0) {
        alert("Las preguntas no se han cargado correctamente. Por favor, recarga la página.");
        return;
    }

    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (selectedOption) {
        userAnswers[currentQuestionIndex] = selectedOption.value;
        
        if (currentQuestionIndex < selectedQuestions.length - 1) {
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        } else {
            document.getElementById('game').classList.add('d-none');
            document.getElementById('results').classList.remove('d-none');
            calculateScore();
        }
    } else {
        alert("Por favor selecciona una respuesta antes de continuar.");
    }
});

function calculateScore() {
    let score = 0;
    selectedQuestions.forEach((question, index) => {
        if (userAnswers[index] === question.correct_answer) {
            score++;
        }
    });

    const pointsContainer = document.getElementById('points');
    pointsContainer.innerHTML = `
        <h2>Resultados</h2>
        <p>¡Has obtenido ${score} de ${selectedQuestions.length} puntos!</p>
    `;
}

    



//Proceso/Logica:
    //carggar 50 preguntas de de la api
    // selecionar 10 (const = arreglo)
    // Traducir esas 10

    //llamar a los contendores en el index.html de la seccion del juego
    // append el question.question en el questionContainer

    //declara una variable con un arreglo que contenga la respuesta correcta y las incorrectas. 
    //modificar esa variable para que sea aliatoria la posiscion cada vez
    //forEach para generar un div por cada opcion
        // <div class="option-btn btn btn-outline-primary custom-control custom-radio mb-2">
            // input type="radio" id="option1" name="answer" class="custom-control-input">
            // <label class="custom-control-label" for="option1"><span>A. </span>${question.incorrect-answer}</label>
        // </div>
    //append al contenedor de respuestas
        
    //al hacer click en el boton id="next-question", presente otra pregunta


import {
    getCurrentDate,
    getTextDay,
    formatDate
} from "./calendar.js";

import {
    loadTextMetadata
} from "./metadata.js";

import {
    openEnvelope,
    closeEnvelope
} from "./envelope.js";


const envelope =
    document.querySelector(".envelope");


const letter =
    document.querySelector("#letter");


const levelButtons =
    document.querySelectorAll(".level-seal");


const readButton =
    document.querySelector("#read-button");


const readingContent =
    document.querySelector("#reading-content");


const textDate =
    document.querySelector("#text-date");


const textMetadata =
    document.querySelector("#text-metadata");


let selectedLevel =
    null;


let envelopeOpen =
    false;


/* =========================================
   CONFIGURAÇÃO
========================================= */

const CLOSED_ENVELOPE_HEIGHT = 520;

const FRONT_HEIGHT = 170;

const LETTER_TOP_GAP = 30;


/* =========================================
   DATA ATUAL
========================================= */

const currentDate =
    getCurrentDate();


const textDay =
    getTextDay(
        currentDate
    );


textDate.textContent =
    formatDate(
        currentDate
    );


/* =========================================
   CALCULA A ALTURA DO ENVELOPE
========================================= */

function calculateEnvelopeHeight() {

    const letterHeight =
        letter.offsetHeight;


    const requiredHeight =
        letterHeight +
        FRONT_HEIGHT +
        LETTER_TOP_GAP;


    return Math.max(
        CLOSED_ENVELOPE_HEIGHT,
        requiredHeight
    );

}


/* =========================================
   CENTRALIZA O ENVELOPE
========================================= */

function centerEnvelope() {

    if (!envelopeOpen) {
        return;
    }


    const envelopeRect =
        envelope.getBoundingClientRect();


    const envelopeCenter =
        envelopeRect.top +
        (envelopeRect.height / 2);


    const viewportCenter =
        window.innerHeight / 2;


    const difference =
        viewportCenter -
        envelopeCenter;


    envelope.style.transform =
        `translateY(${difference}px)`;

}


/* =========================================
   RESTAURA POSIÇÃO
========================================= */

function resetEnvelopePosition() {

    envelope.style.transform =
        "";

}


/* =========================================
   AJUSTA A ALTURA
========================================= */

function resizeEnvelope() {

    const newHeight =
        calculateEnvelopeHeight();


    envelope.style.height =
        `${newHeight}px`;

}


/* =========================================
   EXIBE METADADOS
========================================= */

function displayMetadata(
    text
) {

    textMetadata.innerHTML = `

        <h1>
            ${text.title}
        </h1>

        <p class="text-author">
            ${text.author}
        </p>

        <p class="text-details">
            ${text.genre}
            <span>·</span>
            ${text.theme}
        </p>

    `;

}


/* =========================================
   LIMPA METADADOS
========================================= */

function clearMetadata() {

    textMetadata.innerHTML =
        "";

}


/* =========================================
   SELEÇÃO DE NÍVEL
========================================= */

levelButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {


            levelButtons.forEach(
                levelButton => {

                    levelButton.classList.remove(
                        "selected"
                    );

                }
            );


            button.classList.add(
                "selected"
            );


            selectedLevel =
                button.dataset.level;


            readButton.disabled =
                false;

        }
    );

});


/* =========================================
   ABRIR A CARTA
========================================= */

async function openLetter() {


    if (!selectedLevel) {
        return;
    }


    try {


        readingContent.innerHTML = `

            <p>
                Abrindo a correspondência de hoje...
            </p>

        `;


        clearMetadata();


        /*
         * CARREGA TEXTO + METADADOS
         */

        const text =
            await loadTextMetadata(
                selectedLevel,
                textDay
            );


        /*
         * EXIBE METADADOS
         */

        displayMetadata(
            text
        );


        /*
         * EXIBE CONTEÚDO
         */

        readingContent.innerHTML =
            text.content;


        /*
         * CALCULA ALTURA REAL
         */

        resizeEnvelope();


        /*
         * ABRE ENVELOPE
         */

        envelope.classList.remove(
    "level-1",
    "level-2",
    "level-3",
    "level-4"
);

envelope.classList.add(
    selectedLevel
);


openEnvelope(
    envelope,
    selectedLevel
);


        envelopeOpen =
            true;


        /*
         * CENTRALIZA CARTA
         */

        requestAnimationFrame(
            () => {

                centerEnvelope();

            }
        );


    } catch (error) {


        console.error(
            "Erro ao carregar texto:",
            error
        );


        clearMetadata();


        readingContent.innerHTML = `

            <div class="reading-error">

                <h2>
                    Pedimos desculpas.
                </h2>

                <p>
                    Aconteceu um erro inesperado
                    ao buscar o texto de hoje.
                    Tente novamente em instantes.
                </p>

            </div>

        `;


        resizeEnvelope();


        openEnvelope(
            envelope,
            selectedLevel
        );


        envelopeOpen =
            true;


        requestAnimationFrame(
            () => {

                centerEnvelope();

            }
        );

    }

}


/* =========================================
   FECHAR A CARTA
========================================= */

function closeLetter() {


    envelopeOpen =
        false;


    closeEnvelope(
        envelope
    );


    resetEnvelopePosition();


    envelope.style.height =
        `${CLOSED_ENVELOPE_HEIGHT}px`;


    readingContent.innerHTML =
        "";


    clearMetadata();


    levelButtons.forEach(
        button => {

            button.classList.remove(
                "selected"
            );

        }
    );


    selectedLevel =
        null;


    readButton.disabled =
        true;

}


/* =========================================
   BOTÃO PRINCIPAL
========================================= */

readButton.addEventListener(
    "click",
    async () => {


        if (envelopeOpen) {

            closeLetter();

            return;

        }


        await openLetter();

    }
);


/* =========================================
   REDIMENSIONAMENTO
========================================= */

window.addEventListener(
    "resize",
    () => {


        if (!envelopeOpen) {
            return;
        }


        resizeEnvelope();


        requestAnimationFrame(
            () => {

                centerEnvelope();

            }
        );

    }
);
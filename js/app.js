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
    document.querySelector(
        ".envelope"
    );


const letter =
    document.querySelector(
        "#letter"
    );


const levelButtons =
    document.querySelectorAll(
        ".level-seal"
    );


const readButton =
    document.querySelector(
        "#read-button"
    );


const readingContent =
    document.querySelector(
        "#reading-content"
    );


const textDate =
    document.querySelector(
        "#text-date"
    );


const textMetadata =
    document.querySelector(
        "#text-metadata"
    );


let selectedLevel =
    null;


let envelopeOpen =
    false;


const CLOSED_ENVELOPE_HEIGHT =
    520;


const FRONT_HEIGHT =
    170;


const LETTER_TOP_GAP =
    30;


/* =========================================
   DATA
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
   ALTURA DO ENVELOPE
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
   CENTRALIZAÇÃO
========================================= */

function centerEnvelope() {


    if (
        !envelopeOpen
    ) {

        return;

    }


    const envelopeRect =
        envelope.getBoundingClientRect();


    const envelopeCenter =
        envelopeRect.top +
        envelopeRect.height / 2;


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
   AJUSTA ALTURA
========================================= */

function resizeEnvelope() {


    envelope.style.height =
        `${calculateEnvelopeHeight()}px`;

}


/* =========================================
   METADADOS
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


function clearMetadata() {


    textMetadata.innerHTML =
        "";

}


/* =========================================
   SELEÇÃO DO NÍVEL
========================================= */

levelButtons.forEach(
    button => {


        button.addEventListener(
            "click",
            () => {


                levelButtons.forEach(
                    item => {

                        item.classList.remove(
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

    }
);


/* =========================================
   ABRIR CARTA
========================================= */

async function openLetter() {


    if (
        !selectedLevel
    ) {

        return;

    }


    try {


        readingContent.innerHTML = `

            <p>
                Abrindo a correspondência de hoje.
            </p>

        `;


        clearMetadata();


        const text =
            await loadTextMetadata(
                selectedLevel,
                textDay
            );


        displayMetadata(
            text
        );


        readingContent.innerHTML =
            text.content;


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


    } catch (
        error
    ) {


        console.error(
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
   FECHAR CARTA
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
   BOTÃO
========================================= */

readButton.addEventListener(
    "click",
    async () => {


        if (
            envelopeOpen
        ) {

            closeLetter();

            return;

        }


        await openLetter();

    }
);


/* =========================================
   RESPONSIVIDADE
========================================= */

window.addEventListener(
    "resize",
    () => {


        if (
            !envelopeOpen
        ) {

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
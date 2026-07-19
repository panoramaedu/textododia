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


import {
    isOfflineEnabled,
    setOfflineEnabled,
    downloadOfflineLibrary,
    clearOfflineLibrary
} from "./offline.js";


/* =========================================
   ELEMENTOS
========================================= */

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


const menuButton =
    document.querySelector(
        "#menu-button"
    );


const menuClose =
    document.querySelector(
        "#menu-close"
    );


const sideMenu =
    document.querySelector(
        "#side-menu"
    );


const menuOverlay =
    document.querySelector(
        "#menu-overlay"
    );


const offlineToggle =
    document.querySelector(
        "#offline-toggle"
    );


const offlineStatus =
    document.querySelector(
        "#offline-status"
    );


/* =========================================
   ESTADO
========================================= */

let selectedLevel =
    null;


let envelopeOpen =
    false;


/* =========================================
   CONFIGURAÇÃO DA CARTA
========================================= */

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
   CARTA
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


function resizeEnvelope() {


    envelope.style.height =
        `${calculateEnvelopeHeight()}px`;

}


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


function resetEnvelopePosition() {


    envelope.style.transform =
        "";

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
   NÍVEL
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
   ABRE CARTA
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


        envelope.classList.remove(

            "level-1",
            "level-2",
            "level-3",
            "level-4"

        );


        envelope.classList.add(
            selectedLevel
        );


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
   FECHA CARTA
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


    envelope.classList.remove(

        "level-1",
        "level-2",
        "level-3",
        "level-4"

    );


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
   BOTÃO LER
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
   MENU
========================================= */

function openMenu() {


    sideMenu.classList.add(
        "open"
    );


    menuOverlay.classList.add(
        "open"
    );


    menuButton.setAttribute(
        "aria-expanded",
        "true"
    );


    sideMenu.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeMenu() {


    sideMenu.classList.remove(
        "open"
    );


    menuOverlay.classList.remove(
        "open"
    );


    menuButton.setAttribute(
        "aria-expanded",
        "false"
    );


    sideMenu.setAttribute(
        "aria-hidden",
        "true"
    );

}


menuButton.addEventListener(
    "click",
    openMenu
);


menuClose.addEventListener(
    "click",
    closeMenu
);


menuOverlay.addEventListener(
    "click",
    closeMenu
);


/* =========================================
   OFFLINE
========================================= */

function updateOfflineStatus(
    message
) {


    offlineStatus.textContent =
        message;

}


async function enableOffline() {


    offlineToggle.disabled =
        true;


    updateOfflineStatus(
        "Preparando sua biblioteca..."
    );


    try {


        await downloadOfflineLibrary(
            (
                completed,
                total
            ) => {


                const percentage =
                    Math.round(
                        completed / total * 100
                    );


                updateOfflineStatus(
                    `Biblioteca offline: ${percentage}%`
                );

            }
        );


        setOfflineEnabled(
            true
        );


        updateOfflineStatus(
            "Textos disponíveis offline."
        );


    } catch (
        error
    ) {


        console.error(
            error
        );


        setOfflineEnabled(
            false
        );


        offlineToggle.checked =
            false;


        updateOfflineStatus(
            "Não foi possível preparar a biblioteca."
        );

    }


    offlineToggle.disabled =
        false;

}


async function disableOffline() {


    offlineToggle.disabled =
        true;


    updateOfflineStatus(
        "Removendo biblioteca offline..."
    );


    await clearOfflineLibrary();


    setOfflineEnabled(
        false
    );


    updateOfflineStatus(
        "Textos offline desativados."
    );


    offlineToggle.disabled =
        false;

}


offlineToggle.checked =
    isOfflineEnabled();


if (
    offlineToggle.checked
) {


    updateOfflineStatus(
        "Textos offline ativados."
    );

}


offlineToggle.addEventListener(
    "change",
    async () => {


        if (
            offlineToggle.checked
        ) {


            await enableOffline();


        } else {


            await disableOffline();

        }

    }
);


/* =========================================
   RESIZE
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


/* =========================================
   SERVICE WORKER
========================================= */

if (
    "serviceWorker" in navigator
) {


    window.addEventListener(
        "load",
        () => {


            navigator.serviceWorker.register(
                "./service-worker.js"
            );

        }
    );

}
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


import {
    shareTextImage
} from "./share.js";


import {
    parseCurrentRoute,
    goToRoute,
    goToHome
} from "./router.js";


import {
    recordReadDay,
    recordHistoryEntry,
    getCurrentStreak,
    updateLongestStreak
} from "./reading-log.js";


import {
    createReadingCalendar
} from "./calendar-ui.js";


import {
    createReadingHistory
} from "./history-ui.js";


import {
    renderStreakBadge,
    renderStreakDetails
} from "./streak-ui.js";


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


const shareButton =
    document.querySelector(
        "#share-button"
    );


const calendarOpenButton =
    document.querySelector(
        "#calendar-open-button"
    );


const menuStreak =
    document.querySelector(
        "#menu-streak"
    );


const calendarStreak =
    document.querySelector(
        "#calendar-streak"
    );


const calendarModal =
    document.querySelector(
        "#calendar-modal"
    );


const calendarOverlay =
    document.querySelector(
        "#calendar-overlay"
    );


const calendarClose =
    document.querySelector(
        "#calendar-close"
    );


const calendarPrev =
    document.querySelector(
        "#calendar-prev"
    );


const calendarNext =
    document.querySelector(
        "#calendar-next"
    );


const calendarTitle =
    document.querySelector(
        "#calendar-title"
    );


const calendarGrid =
    document.querySelector(
        "#calendar-grid"
    );


const historyOpenButton =
    document.querySelector(
        "#history-open-button"
    );


const historyModal =
    document.querySelector(
        "#history-modal"
    );


const historyOverlay =
    document.querySelector(
        "#history-overlay"
    );


const historyClose =
    document.querySelector(
        "#history-close"
    );


const historyList =
    document.querySelector(
        "#history-list"
    );


const historyEmpty =
    document.querySelector(
        "#history-empty"
    );


const historyClearButton =
    document.querySelector(
        "#history-clear"
    );


/* =========================================
   ESTADO
========================================= */

let selectedLevel =
    null;


let envelopeOpen =
    false;


let currentText =
    null;


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

function selectLevelButton(
    level
) {


    levelButtons.forEach(
        item => {


            item.classList.toggle(
                "selected",
                item.dataset.level === level
            );

        }
    );


    selectedLevel =
        level;


    readButton.disabled =
        false;

}


levelButtons.forEach(
    button => {


        button.addEventListener(
            "click",
            () => {


                selectLevelButton(
                    button.dataset.level
                );

            }
        );

    }
);


/* =========================================
   ABRE CARTA
========================================= */

async function openLetter(
    level,
    day,
    { updateUrl = true, replaceUrl = false } = {}
) {


    if (
        !level
    ) {

        return;

    }


    selectedLevel =
        level;


    try {


        readingContent.innerHTML = `

            <p>
                Abrindo a correspondência de hoje.
            </p>

        `;


        clearMetadata();


        const text =
            await loadTextMetadata(
                level,
                day
            );


        currentText =
            text;


        recordReadDay(
            (
                new Date()
            ).getFullYear(),
            day,
            level
        );


        recordHistoryEntry(
            {
                year:
                    (
                        new Date()
                    ).getFullYear(),

                day,

                level,

                title:
                    text.title,

                author:
                    text.author
            }
        );


        updateLongestStreak(
            getCurrentStreak()
        );


        renderStreakBadge(
            menuStreak
        );


        displayMetadata(
            text
        );


        readingContent.innerHTML =
            text.content;


        shareButton.disabled =
            false;


        if (
            updateUrl
        ) {

            goToRoute(
                level,
                day,
                { replace: replaceUrl }
            );

        }


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


        currentText =
            null;


        shareButton.disabled =
            true;


        if (
            updateUrl
        ) {

            goToRoute(
                level,
                day,
                { replace: true }
            );

        }


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

function closeLetter(
    { updateUrl = true } = {}
) {


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


    currentText =
        null;


    shareButton.disabled =
        true;


    if (
        updateUrl
    ) {

        goToHome();

    }


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


        await openLetter(
            selectedLevel,
            textDay
        );

    }
);


/* =========================================
   MENU
========================================= */

function openMenu() {


    renderStreakBadge(
        menuStreak
    );


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
   CALENDÁRIO DE LEITURA (FASE 4)
========================================= */

const readingCalendar =
    createReadingCalendar(
        {
            modal: calendarModal,
            overlay: calendarOverlay,
            closeButton: calendarClose,
            prevButton: calendarPrev,
            nextButton: calendarNext,
            titleEl: calendarTitle,
            gridEl: calendarGrid,
            onSelectDay: (
                level,
                day
            ) => {


                readingCalendar.close();


                closeMenu();


                openLetter(
                    level,
                    day
                );

            }
        }
    );


calendarOpenButton.addEventListener(
    "click",
    () => {


        closeMenu();


        renderStreakDetails(
            calendarStreak
        );


        readingCalendar.open();

    }
);


/* =========================================
   HISTÓRICO DE LEITURA (FASE 7)
========================================= */

const readingHistory =
    createReadingHistory(
        {
            modal: historyModal,
            overlay: historyOverlay,
            closeButton: historyClose,
            listEl: historyList,
            emptyEl: historyEmpty,
            clearButton: historyClearButton,
            onSelectEntry: (
                level,
                day
            ) => {


                readingHistory.close();


                closeMenu();


                openLetter(
                    level,
                    day
                );

            }
        }
    );


historyOpenButton.addEventListener(
    "click",
    () => {


        closeMenu();


        readingHistory.open();

    }
);


/* =========================================
   COMPARTILHAR
========================================= */

shareButton.addEventListener(
    "click",
    async () => {


        if (
            !currentText
        ) {

            return;

        }


        const originalLabel =
            shareButton.textContent;


        shareButton.disabled =
            true;


        shareButton.textContent =
            "Gerando imagem...";


        try {


            await shareTextImage({

                title:
                    currentText.title,

                author:
                    currentText.author,

                genre:
                    currentText.genre,

                theme:
                    currentText.theme,

                excerpt:
                    currentText.excerpt,

                url:
                    window.location.href

            });


        } catch (
            error
        ) {


            console.error(
                error
            );

        }


        shareButton.textContent =
            originalLabel;


        shareButton.disabled =
            !currentText;

    }
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
   ROTEAMENTO (FASE 6)
========================================= */

function applyRoute(
    route,
    { updateUrl = false, replaceUrl = false } = {}
) {


    if (
        !route
    ) {

        if (
            envelopeOpen
        ) {

            closeLetter(
                { updateUrl }
            );

        }


        return;

    }


    selectLevelButton(
        route.level
    );


    openLetter(
        route.level,
        route.day,
        { updateUrl, replaceUrl }
    );

}


const initialRoute =
    parseCurrentRoute();


if (
    initialRoute
) {


    applyRoute(
        initialRoute,
        { updateUrl: true, replaceUrl: true }
    );


} else if (
    window.location.search.includes(
        "redirect="
    )
) {


    // Veio do fallback de 404, mas o caminho
    // não bateu com nenhuma rota conhecida —
    // limpa a URL e volta para a home.

    goToHome(
        { replace: true }
    );

}


window.addEventListener(
    "popstate",
    () => {


        applyRoute(
            parseCurrentRoute(),
            { updateUrl: false }
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
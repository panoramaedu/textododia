import {
    getCurrentDate,
    getTextDay,
    formatDate
} from "./calendar.js";

import {
    loadMarkdown
} from "./markdown.js";

import {
    openEnvelope,
    closeEnvelope
} from "./envelope.js";

const envelope = document.querySelector(".envelope");

const levelButtons = document.querySelectorAll(".level-seal");

const readButton = document.querySelector("#read-button");

const readingContent = document.querySelector("#reading-content");

const textDate = document.querySelector("#text-date");

let selectedLevel = null;

const currentDate = getCurrentDate();

const textDay = getTextDay(currentDate);

textDate.textContent = formatDate(currentDate);

levelButtons.forEach(button => {

    button.addEventListener("click", () => {

        levelButtons.forEach(levelButton => {
            levelButton.classList.remove("selected");
        });

        button.classList.add("selected");

        selectedLevel = button.dataset.level;

        readButton.disabled = false;

    });

});

readButton.addEventListener("click", async () => {

    if (envelope.classList.contains("open")) {

        closeEnvelope(envelope);

        levelButtons.forEach(button => {
            button.classList.remove("selected");
        });

        selectedLevel = null;

        readButton.disabled = true;

        readingContent.innerHTML = "";

        return;
    }

    if (!selectedLevel) {
        return;
    }

    try {

        readingContent.innerHTML = `
            <p>Carregando o texto de hoje...</p>
        `;

        openEnvelope(envelope, selectedLevel);

        const content = await loadMarkdown(
            selectedLevel,
            textDay
        );

        readingContent.innerHTML = content;

    } catch (error) {

        readingContent.innerHTML = `
            <div class="reading-error">

                <h2>Pedimos desculpas.</h2>

                <p>
                    Aconteceu um erro inesperado ao buscar o texto de hoje.
                    Tente novamente em instantes.
                </p>

            </div>
        `;

    }

});
import {
    formatDate
} from "./calendar.js";


import {
    getHistory,
    clearHistory
} from "./reading-log.js";


const LEVEL_LABELS = {

    "nivel-1": "Nível 1",
    "nivel-2": "Nível 2",
    "nivel-3": "Nível 3",
    "nivel-4": "Nível 4"

};


export function createReadingHistory(
    {
        modal,
        overlay,
        closeButton,
        listEl,
        emptyEl,
        clearButton,
        onSelectEntry
    }
) {


    function render() {


        const history =
            getHistory();


        listEl.innerHTML =
            "";


        if (
            !history.length
        ) {


            emptyEl.hidden =
                false;


            listEl.hidden =
                true;


            clearButton.hidden =
                true;


            return;

        }


        emptyEl.hidden =
            true;


        listEl.hidden =
            false;


        clearButton.hidden =
            false;


        history.forEach(
            entry => {


                const item =
                    document.createElement(
                        "button"
                    );


                item.type =
                    "button";


                item.className =
                    "history-item";


                const readAt =
                    new Date(
                        entry.timestamp
                    );


                const levelLabel =
                    LEVEL_LABELS[entry.level] ||
                    entry.level;


                const authorLine =
                    entry.author ?
                        `${entry.author} · ` :
                        "";


                item.innerHTML = `

                    <span class="history-item-date">
                        ${formatDate(readAt)}
                    </span>

                    <span class="history-item-title">
                        ${entry.title || "Texto sem título"}
                    </span>

                    <span class="history-item-meta">
                        ${authorLine}${levelLabel}
                    </span>

                `;


                item.addEventListener(
                    "click",
                    () => {

                        onSelectEntry(
                            entry.level,
                            entry.day
                        );

                    }
                );


                listEl.appendChild(
                    item
                );

            }
        );

    }


    function open() {


        render();


        modal.classList.add(
            "open"
        );


        overlay.classList.add(
            "open"
        );


        modal.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    function close() {


        modal.classList.remove(
            "open"
        );


        overlay.classList.remove(
            "open"
        );


        modal.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    closeButton.addEventListener(
        "click",
        close
    );


    overlay.addEventListener(
        "click",
        close
    );


    clearButton.addEventListener(
        "click",
        () => {


            const confirmed =
                window.confirm(
                    "Apagar todo o histórico de leitura deste aparelho?"
                );


            if (
                !confirmed
            ) {

                return;

            }


            clearHistory();


            render();

        }
    );


    return {
        open,
        close
    };

}

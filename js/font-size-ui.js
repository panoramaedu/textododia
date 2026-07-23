/* =========================================
   CONTROLE DE TAMANHO DE FONTE

   Aplica um multiplicador (--reading-scale)
   sobre o tamanho de fonte já definido para
   cada nível em css/style.css.
========================================= */

const STORAGE_KEY =
    "textododia-font-scale";


const STEPS = [
    0.85,
    1,
    1.15,
    1.3,
    1.45
];


const DEFAULT_STEP_INDEX =
    1;


function readStoredIndex() {


    try {


        const raw =
            window.localStorage.getItem(
                STORAGE_KEY
            );


        const index =
            Number(
                raw
            );


        if (
            Number.isInteger(index) &&
            index >= 0 &&
            index < STEPS.length
        ) {

            return index;

        }


    } catch (
        error
    ) {


        console.error(
            error
        );

    }


    return DEFAULT_STEP_INDEX;

}


function writeStoredIndex(
    index
) {


    try {


        window.localStorage.setItem(
            STORAGE_KEY,
            String(
                index
            )
        );


    } catch (
        error
    ) {


        console.error(
            error
        );

    }

}


export function initFontSizeControl(
    {
        decreaseButton,
        resetButton,
        increaseButton
    }
) {


    let currentIndex =
        readStoredIndex();


    function apply() {


        document.documentElement.style.setProperty(
            "--reading-scale",
            STEPS[currentIndex]
        );


        decreaseButton.disabled =
            currentIndex === 0;


        increaseButton.disabled =
            currentIndex === STEPS.length - 1;

    }


    decreaseButton.addEventListener(
        "click",
        () => {


            if (
                currentIndex === 0
            ) {

                return;

            }


            currentIndex -=
                1;


            writeStoredIndex(
                currentIndex
            );


            apply();

        }
    );


    increaseButton.addEventListener(
        "click",
        () => {


            if (
                currentIndex === STEPS.length - 1
            ) {

                return;

            }


            currentIndex +=
                1;


            writeStoredIndex(
                currentIndex
            );


            apply();

        }
    );


    resetButton.addEventListener(
        "click",
        () => {


            currentIndex =
                DEFAULT_STEP_INDEX;


            writeStoredIndex(
                currentIndex
            );


            apply();

        }
    );


    apply();

}

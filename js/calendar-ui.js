import {
    getMonthLabel,
    getDaysInMonth,
    getFirstWeekdayOfMonth,
    isSameDate,
    getTextDay
} from "./calendar.js";


import {
    getLevelReadOnDay
} from "./reading-log.js";


function capitalize(
    text
) {

    return text.charAt(0).toUpperCase() +
        text.slice(1);

}


export function createReadingCalendar(
    {
        modal,
        overlay,
        closeButton,
        prevButton,
        nextButton,
        titleEl,
        gridEl,
        onSelectDay
    }
) {


    const today =
        new Date();


    let viewYear =
        today.getFullYear();


    let viewMonth =
        today.getMonth();


    function isBeyondCurrentMonth(
        year,
        month
    ) {

        return (

            year > today.getFullYear() ||

            (
                year === today.getFullYear() &&
                month >= today.getMonth()
            )

        );

    }


    function render() {


        titleEl.textContent =
            capitalize(
                getMonthLabel(
                    viewYear,
                    viewMonth
                )
            );


        gridEl.innerHTML =
            "";


        const daysInMonth =
            getDaysInMonth(
                viewYear,
                viewMonth
            );


        const firstWeekday =
            getFirstWeekdayOfMonth(
                viewYear,
                viewMonth
            );


        for (
            let i = 0;
            i < firstWeekday;
            i++
        ) {


            const placeholder =
                document.createElement(
                    "span"
                );


            placeholder.className =
                "calendar-day empty";


            gridEl.appendChild(
                placeholder
            );

        }


        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {


            const cellDate =
                new Date(
                    viewYear,
                    viewMonth,
                    day
                );


            const dayOfYear =
                getTextDay(
                    cellDate
                );


            const level =
                getLevelReadOnDay(
                    viewYear,
                    dayOfYear
                );


            const isRead =
                Boolean(
                    level
                );


            const isToday =
                isSameDate(
                    cellDate,
                    today
                );


            const isFuture =
                cellDate > today &&
                !isToday;


            const cell =
                document.createElement(
                    "button"
                );


            cell.type =
                "button";


            cell.className =
                "calendar-day";


            cell.textContent =
                String(
                    day
                );


            if (
                isRead
            ) {

                cell.classList.add(
                    "read"
                );

            }


            if (
                isToday
            ) {

                cell.classList.add(
                    "today"
                );

            }


            if (
                isFuture
            ) {

                cell.classList.add(
                    "future"
                );

            }


            if (
                isRead
            ) {


                cell.setAttribute(
                    "aria-label",
                    `Dia ${day}, texto lido`
                );


                cell.addEventListener(
                    "click",
                    () => {

                        onSelectDay(
                            level,
                            dayOfYear
                        );

                    }
                );


            } else {


                cell.disabled =
                    true;


                cell.setAttribute(
                    "aria-label",
                    isFuture ?
                        `Dia ${day}, ainda não chegou` :
                        `Dia ${day}, sem leitura`
                );

            }


            gridEl.appendChild(
                cell
            );

        }


        nextButton.disabled =
            isBeyondCurrentMonth(
                viewYear,
                viewMonth
            );

    }


    function goToPreviousMonth() {


        viewMonth -=
            1;


        if (
            viewMonth < 0
        ) {

            viewMonth =
                11;

            viewYear -=
                1;

        }


        render();

    }


    function goToNextMonth() {


        if (
            isBeyondCurrentMonth(
                viewYear,
                viewMonth
            )
        ) {

            return;

        }


        viewMonth +=
            1;


        if (
            viewMonth > 11
        ) {

            viewMonth =
                0;

            viewYear +=
                1;

        }


        render();

    }


    function open() {


        viewYear =
            today.getFullYear();


        viewMonth =
            today.getMonth();


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


    prevButton.addEventListener(
        "click",
        goToPreviousMonth
    );


    nextButton.addEventListener(
        "click",
        goToNextMonth
    );


    closeButton.addEventListener(
        "click",
        close
    );


    overlay.addEventListener(
        "click",
        close
    );


    return {
        open,
        close
    };

}

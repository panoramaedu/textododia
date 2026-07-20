export function getCurrentDate() {

    return new Date();

}


export function getTextDay(
    date
) {

    const month =
        date.getMonth();


    const day =
        date.getDate();


    /*
     * 29 DE FEVEREIRO
     * USA O TEXTO 366
     */

    if (
        month === 1 &&
        day === 29
    ) {

        return 366;

    }


    const start =
        new Date(
            date.getFullYear(),
            0,
            1
        );


    const difference =
        date - start;


    const oneDay =
        1000 *
        60 *
        60 *
        24;


    return Math.floor(
        difference / oneDay
    ) + 1;

}


export function formatDate(
    date
) {

    return new Intl.DateTimeFormat(
        "pt-BR",
        {
            day: "numeric",
            month: "long"
        }
    ).format(date);

}


/* =========================================
   UTILITÁRIOS DE GRADE MENSAL
   (usados pelo calendário de leitura)
========================================= */

export function getMonthLabel(
    year,
    month
) {

    return new Intl.DateTimeFormat(
        "pt-BR",
        {
            month: "long",
            year: "numeric"
        }
    ).format(
        new Date(
            year,
            month,
            1
        )
    );

}


export function getDaysInMonth(
    year,
    month
) {

    return new Date(
        year,
        month + 1,
        0
    ).getDate();

}


export function getFirstWeekdayOfMonth(
    year,
    month
) {

    return new Date(
        year,
        month,
        1
    ).getDay();

}


export function isSameDate(
    dateA,
    dateB
) {

    return (

        dateA.getFullYear() === dateB.getFullYear() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getDate() === dateB.getDate()

    );

}
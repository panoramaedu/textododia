/* =========================================
   REGISTRO DE LEITURA

   Guarda, por ano, quais dias (dia-do-ano)
   já foram lidos e em qual nível — usado
   para pintar o calendário da Fase 4.

   Formato salvo no localStorage:

   {
     "2026": {
       "199": "nivel-1",
       "200": "nivel-2"
     }
   }

   Observação: este módulo é intencionalmente
   simples (só "lido/não lido" + nível). A
   Fase 7 (histórico completo) deve construir
   em cima desta mesma chave, sem precisar
   migrar dados.
========================================= */

const STORAGE_KEY =
    "textododia-reading-log";


function readLog() {


    try {


        const raw =
            window.localStorage.getItem(
                STORAGE_KEY
            );


        if (
            !raw
        ) {

            return {};

        }


        const parsed =
            JSON.parse(
                raw
            );


        return (
            parsed &&
            typeof parsed === "object"
        ) ?
            parsed :
            {};


    } catch (
        error
    ) {


        console.error(
            error
        );


        return {};

    }

}


function writeLog(
    log
) {


    try {


        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                log
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


export function recordReadDay(
    year,
    dayOfYear,
    level
) {


    const log =
        readLog();


    const yearKey =
        String(
            year
        );


    if (
        !log[yearKey]
    ) {

        log[yearKey] = {};

    }


    log[yearKey][String(dayOfYear)] =
        level;


    writeLog(
        log
    );

}


export function getLevelReadOnDay(
    year,
    dayOfYear
) {


    const log =
        readLog();


    const yearKey =
        String(
            year
        );


    if (
        !log[yearKey]
    ) {

        return null;

    }


    return log[yearKey][String(dayOfYear)] ||
        null;

}


export function isDayRead(
    year,
    dayOfYear
) {

    return Boolean(
        getLevelReadOnDay(
            year,
            dayOfYear
        )
    );

}


/* =========================================
   HISTÓRICO (FASE 7)

   Lista cronológica de leituras (mais recente
   primeiro), separada do registro por dia usado
   no calendário — não interfere nele.

   Cada item:
   {
     year, day, level,
     title, author,
     timestamp
   }
========================================= */

const HISTORY_KEY =
    "textododia-history";


const HISTORY_LIMIT =
    100;


function readHistory() {


    try {


        const raw =
            window.localStorage.getItem(
                HISTORY_KEY
            );


        if (
            !raw
        ) {

            return [];

        }


        const parsed =
            JSON.parse(
                raw
            );


        return Array.isArray(
            parsed
        ) ?
            parsed :
            [];


    } catch (
        error
    ) {


        console.error(
            error
        );


        return [];

    }

}


function writeHistory(
    list
) {


    try {


        window.localStorage.setItem(
            HISTORY_KEY,
            JSON.stringify(
                list
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


export function recordHistoryEntry(
    {
        year,
        day,
        level,
        title,
        author
    }
) {


    const history =
        readHistory();


    const existingIndex =
        history.findIndex(
            entry =>

                entry.year === year &&
                entry.day === day &&
                entry.level === level

        );


    if (
        existingIndex !== -1
    ) {

        history.splice(
            existingIndex,
            1
        );

    }


    history.unshift(
        {
            year,
            day,
            level,
            title,
            author,
            timestamp: Date.now()
        }
    );


    if (
        history.length > HISTORY_LIMIT
    ) {

        history.length =
            HISTORY_LIMIT;

    }


    writeHistory(
        history
    );

}


export function getHistory() {

    return readHistory();

}


export function getLastReadEntry() {


    const history =
        readHistory();


    return history.length ?
        history[0] :
        null;

}


export function clearHistory() {

    writeHistory(
        []
    );

}


/* =========================================
   SEQUÊNCIA DE LEITURA (FASE 5)

   Calculada a partir das datas reais de acesso
   já guardadas no histórico (Fase 7) — um dia
   "conta" se pelo menos um texto foi aberto
   naquela data, não importa qual dia-do-ano
   o texto pertencia (ex.: reler um texto antigo
   pelo calendário também mantém a sequência viva).
========================================= */

function toDateKey(
    date
) {

    const year =
        date.getFullYear();


    const month =
        String(date.getMonth() + 1).padStart(2, "0");


    const day =
        String(date.getDate()).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


function keyToDate(
    key
) {

    const [
        year,
        month,
        day
    ] =
        key.split("-").map(Number);


    return new Date(
        year,
        month - 1,
        day
    );

}


function addDays(
    date,
    delta
) {

    const result =
        new Date(
            date
        );


    result.setDate(
        result.getDate() + delta
    );


    return result;

}


function getReadDateKeys() {


    const history =
        readHistory();


    const keys =
        new Set();


    history.forEach(
        entry => {

            keys.add(
                toDateKey(
                    new Date(
                        entry.timestamp
                    )
                )
            );

        }
    );


    return keys;

}


export function getCurrentStreak() {


    const readDates =
        getReadDateKeys();


    if (
        !readDates.size
    ) {

        return 0;

    }


    const today =
        new Date();


    let cursorDate =
        today;


    if (
        !readDates.has(
            toDateKey(
                today
            )
        )
    ) {


        const yesterday =
            addDays(
                today,
                -1
            );


        if (
            !readDates.has(
                toDateKey(
                    yesterday
                )
            )
        ) {

            return 0;

        }


        cursorDate =
            yesterday;

    }


    let streak =
        0;


    while (
        readDates.has(
            toDateKey(
                cursorDate
            )
        )
    ) {


        streak +=
            1;


        cursorDate =
            addDays(
                cursorDate,
                -1
            );

    }


    return streak;

}


const STREAK_RECORD_KEY =
    "textododia-streak-record";


function readStreakRecord() {


    try {


        const raw =
            window.localStorage.getItem(
                STREAK_RECORD_KEY
            );


        if (
            !raw
        ) {

            return { longest: 0 };

        }


        const parsed =
            JSON.parse(
                raw
            );


        return (
            parsed &&
            typeof parsed.longest === "number"
        ) ?
            parsed :
            { longest: 0 };


    } catch (
        error
    ) {


        console.error(
            error
        );


        return { longest: 0 };

    }

}


function writeStreakRecord(
    record
) {


    try {


        window.localStorage.setItem(
            STREAK_RECORD_KEY,
            JSON.stringify(
                record
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


export function getLongestStreak() {

    return readStreakRecord().longest;

}


export function updateLongestStreak(
    currentStreak
) {


    const record =
        readStreakRecord();


    if (
        currentStreak > record.longest
    ) {


        record.longest =
            currentStreak;


        writeStreakRecord(
            record
        );

    }


    return record.longest;

}

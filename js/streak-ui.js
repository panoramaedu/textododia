import {
    getCurrentStreak,
    getLongestStreak
} from "./reading-log.js";


function formatDays(
    count
) {

    return `${count} ${count === 1 ? "dia" : "dias"}`;

}


/* =========================================
   INDICADOR CURTO
   (usado no menu lateral)
========================================= */

export function renderStreakBadge(
    el
) {


    const streak =
        getCurrentStreak();


    if (
        streak > 0
    ) {


        el.textContent =
            `🔥 ${formatDays(streak)} seguidos`;


        el.classList.remove(
            "streak-empty"
        );


    } else {


        el.textContent =
            "Leia hoje para começar uma sequência.";


        el.classList.add(
            "streak-empty"
        );

    }


    return streak;

}


/* =========================================
   DETALHE COMPLETO
   (usado dentro do calendário)
========================================= */

export function renderStreakDetails(
    el
) {


    const streak =
        getCurrentStreak();


    const longest =
        getLongestStreak();


    if (
        streak > 0
    ) {


        el.innerHTML = `

            <span class="streak-current">
                🔥 ${formatDays(streak)} seguidos
            </span>

            <span class="streak-record">
                Recorde: ${formatDays(longest)}
            </span>

        `;


    } else if (
        longest > 0
    ) {


        el.innerHTML = `

            <span class="streak-current streak-empty">
                Sequência zerada — leia hoje para recomeçar.
            </span>

            <span class="streak-record">
                Recorde: ${formatDays(longest)}
            </span>

        `;


    } else {


        el.innerHTML = `

            <span class="streak-current streak-empty">
                Leia todo dia para começar uma sequência.
            </span>

        `;

    }

}

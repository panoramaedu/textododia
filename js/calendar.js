export function getCurrentDate() {
    return new Date();
}

export function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);

    const difference =
        date - start +
        ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);

    const oneDay = 1000 * 60 * 60 * 24;

    return Math.floor(difference / oneDay);
}

export function getTextDay(date) {

    const dayOfYear = getDayOfYear(date);

    const isLeapYear =
        new Date(date.getFullYear(), 1, 29).getMonth() === 1;

    if (isLeapYear && dayOfYear === 60) {
        return 366;
    }

    return dayOfYear;
}

export function formatDate(date) {

    return new Intl.DateTimeFormat("pt-BR", {
        day: "numeric",
        month: "long"
    }).format(date);

}
export function openEnvelope(envelope, level) {

    envelope.classList.add("open");

    envelope.classList.remove(
        "level-1-active",
        "level-2-active",
        "level-3-active"
    );

    envelope.classList.add(`${level}-active`);
}

export function closeEnvelope(envelope) {

    envelope.classList.remove("open");

    envelope.classList.remove(
        "level-1-active",
        "level-2-active",
        "level-3-active"
    );
}
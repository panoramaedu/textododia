export function openEnvelope(envelope, level) {

    envelope.classList.remove(
        "level-1-active",
        "level-2-active",
        "level-3-active",
        "level-4-active"
    );


    envelope.classList.add(
        "open",
        `level-${level}-active`
    );

}


export function closeEnvelope(envelope) {

    envelope.classList.remove(
        "open",
        "level-1-active",
        "level-2-active",
        "level-3-active",
        "level-4-active"
    );

}
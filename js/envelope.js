export function openEnvelope(
    envelope,
    level
) {


    envelope.classList.remove(

        "nivel-1",
        "nivel-2",
        "nivel-3",
        "nivel-4"

    );


    envelope.classList.add(
        level
    );


    envelope.classList.add(
        "open"
    );

}


export function closeEnvelope(
    envelope
) {


    envelope.classList.remove(
        "open"
    );


    envelope.classList.remove(

        "nivel-1",
        "nivel-2",
        "nivel-3",
        "nivel-4"

    );

}
import {
    getOfflineText
} from "./offline.js";


export async function loadTextMetadata(
    level,
    day
) {


    let rawText =
        await getOfflineText(
            level,
            day
        );


    if (
        !rawText
    ) {


        const path =
            `textos/${level}/${day}.md`;


        const response =
            await fetch(
                path
            );


        if (
            !response.ok
        ) {

            throw new Error(
                "Texto não encontrado."
            );

        }


        rawText =
            await response.text();

    }


    const frontMatterMatch =
        rawText.match(
            /^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/m
        );


    if (
        !frontMatterMatch
    ) {

        throw new Error(
            "Metadados inválidos."
        );

    }


    const metadataBlock =
        frontMatterMatch[1];


    const content =
        frontMatterMatch[2];


    const metadata =
        {};


    metadataBlock
        .split("\n")
        .forEach(
            line => {


                const separator =
                    line.indexOf(
                        ":"
                    );


                if (
                    separator === -1
                ) {

                    return;

                }


                const key =
                    line
                        .slice(
                            0,
                            separator
                        )
                        .trim();


                const value =
                    line
                        .slice(
                            separator + 1
                        )
                        .trim();


                metadata[key] =
                    value;

            }
        );


    return {


        title:
            metadata.title,


        author:
            metadata.author,


        genre:
            metadata.genre,


        theme:
            metadata.theme,


        content:
            marked.parse(
                content
            )

    };

}
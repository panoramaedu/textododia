/* =========================================
   METADADOS DOS TEXTOS
========================================= */


/**
 * Lê um arquivo Markdown e separa
 * os metadados do conteúdo
 */
export async function loadTextMetadata(
    level,
    day
) {

    const response = await fetch(
        `textos/${level}/${day}.md`
    );


    if (!response.ok) {

        throw new Error(
            `Não foi possível carregar o texto ${day}`
        );

    }


    const rawMarkdown =
        await response.text();


    const parsed =
        parseFrontMatter(
            rawMarkdown
        );


    return {

        ...parsed.metadata,

        content: marked.parse(
            parsed.content
        )

    };

}


/**
 * Interpreta o Front Matter
 */
function parseFrontMatter(
    markdown
) {

    const frontMatterRegex =
        /^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/;


    const match =
        markdown.match(
            frontMatterRegex
        );


    if (!match) {

        throw new Error(
            "O texto não possui metadados válidos."
        );

    }


    const metadataBlock =
        match[1];


    const content =
        match[2].trim();


    const metadata = {};


    metadataBlock
        .split("\n")
        .forEach(line => {


            const separator =
                line.indexOf(":");


            if (separator === -1) {
                return;
            }


            const key =
                line
                    .slice(0, separator)
                    .trim();


            const value =
                line
                    .slice(separator + 1)
                    .trim();


            metadata[key] =
                value;

        });


    validateMetadata(
        metadata
    );


    return {

        metadata,
        content

    };

}


/**
 * Valida os metadados obrigatórios
 */
function validateMetadata(
    metadata
) {

    const requiredFields = [

        "title",
        "author",
        "genre",
        "theme"

    ];


    const missingFields =
        requiredFields.filter(
            field =>
                !metadata[field]
        );


    if (missingFields.length > 0) {

        throw new Error(
            `Metadados ausentes: ${missingFields.join(", ")}`
        );

    }

}
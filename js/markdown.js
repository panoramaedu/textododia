export async function loadMarkdown(level, day) {

    const path = `textos/${level}/${day}.md`;

    const response = await fetch(path);

    if (!response.ok) {
        throw new Error("Texto não encontrado.");
    }

    const markdown = await response.text();

    return marked.parse(markdown);
}
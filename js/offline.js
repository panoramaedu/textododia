const DB_NAME =
    "textododia-offline";


const DB_VERSION =
    1;


const STORE_NAME =
    "texts";


const OFFLINE_KEY =
    "textododia-offline-enabled";


const LEVELS = [

    "nivel-1",
    "nivel-2",
    "nivel-3",
    "nivel-4"

];


const TOTAL_TEXTS =
    LEVELS.length * 366;


/* =========================================
   BANCO
========================================= */

function openDatabase() {

    return new Promise(
        (
            resolve,
            reject
        ) => {


            const request =
                indexedDB.open(
                    DB_NAME,
                    DB_VERSION
                );


            request.onupgradeneeded =
                () => {


                    const database =
                        request.result;


                    if (
                        !database.objectStoreNames.contains(
                            STORE_NAME
                        )
                    ) {


                        database.createObjectStore(
                            STORE_NAME
                        );

                    }

                };


            request.onsuccess =
                () => {

                    resolve(
                        request.result
                    );

                };


            request.onerror =
                () => {

                    reject(
                        request.error
                    );

                };

        }
    );

}


/* =========================================
   STATUS
========================================= */

export function isOfflineEnabled() {

    return localStorage.getItem(
        OFFLINE_KEY
    ) === "true";

}


export function setOfflineEnabled(
    value
) {

    localStorage.setItem(
        OFFLINE_KEY,
        String(value)
    );

}


/* =========================================
   BUSCA TEXTO
========================================= */

export async function getOfflineText(
    level,
    day
) {


    if (
        !isOfflineEnabled()
    ) {

        return null;

    }


    const database =
        await openDatabase();


    return new Promise(
        (
            resolve,
            reject
        ) => {


            const transaction =
                database.transaction(
                    STORE_NAME,
                    "readonly"
                );


            const store =
                transaction.objectStore(
                    STORE_NAME
                );


            const request =
                store.get(
                    `${level}/${day}`
                );


            request.onsuccess =
                () => {

                    resolve(
                        request.result || null
                    );

                };


            request.onerror =
                () => {

                    reject(
                        request.error
                    );

                };

        }
    );

}


/* =========================================
   SALVA TEXTO
========================================= */

function saveText(
    level,
    day,
    content
) {

    return openDatabase()
        .then(
            database => {


                return new Promise(
                    (
                        resolve,
                        reject
                    ) => {


                        const transaction =
                            database.transaction(
                                STORE_NAME,
                                "readwrite"
                            );


                        const store =
                            transaction.objectStore(
                                STORE_NAME
                            );


                        const request =
                            store.put(
                                content,
                                `${level}/${day}`
                            );


                        request.onsuccess =
                            () => {

                                resolve();

                            };


                        request.onerror =
                            () => {

                                reject(
                                    request.error
                                );

                            };

                    }
                );

            }
        );

}


/* =========================================
   DOWNLOAD DA BIBLIOTECA
========================================= */

export async function downloadOfflineLibrary(
    onProgress
) {


    const tasks =
        [];


    LEVELS.forEach(
        level => {


            for (
                let day = 1;
                day <= 366;
                day++
            ) {


                tasks.push({
                    level,
                    day
                });

            }

        }
    );


    let completed =
        0;


    const concurrency =
        8;


    for (
        let index = 0;
        index < tasks.length;
        index += concurrency
    ) {


        const batch =
            tasks.slice(
                index,
                index + concurrency
            );


        await Promise.all(

            batch.map(
                async task => {


                    const path =
                        `textos/${task.level}/${task.day}.md`;


                    const response =
                        await fetch(
                            path
                        );


                    if (
                        !response.ok
                    ) {

                        throw new Error(
                            `Texto não encontrado: ${path}`
                        );

                    }


                    const content =
                        await response.text();


                    await saveText(
                        task.level,
                        task.day,
                        content
                    );


                    completed++;


                    if (
                        onProgress
                    ) {


                        onProgress(
                            completed,
                            TOTAL_TEXTS
                        );

                    }

                }
            )

        );

    }

}


/* =========================================
   LIMPA BIBLIOTECA
========================================= */

export async function clearOfflineLibrary() {


    const database =
        await openDatabase();


    return new Promise(
        (
            resolve,
            reject
        ) => {


            const transaction =
                database.transaction(
                    STORE_NAME,
                    "readwrite"
                );


            const store =
                transaction.objectStore(
                    STORE_NAME
                );


            const request =
                store.clear();


            request.onsuccess =
                () => {

                    resolve();

                };


            request.onerror =
                () => {

                    reject(
                        request.error
                    );

                };

        }
    );

}
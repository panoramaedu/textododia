const CACHE_NAME =
    "textododia-shell-v5";


const CORE_ASSETS = [

    "./",
    "./index.html",
    "./404.html",

    "./css/style.css",

    "./js/app.js",
    "./js/calendar.js",
    "./js/calendar-ui.js",
    "./js/reading-log.js",
    "./js/history-ui.js",
    "./js/streak-ui.js",
    "./js/metadata.js",
    "./js/envelope.js",
    "./js/offline.js",
    "./js/share.js",
    "./js/router.js",

    "./manifest.json",

    "./icons/icon-192.png",
    "./icons/icon-512.png"

];


self.addEventListener(
    "install",
    event => {


        event.waitUntil(

            caches.open(
                CACHE_NAME
            )
            .then(
                cache => {

                    return cache.addAll(
                        CORE_ASSETS
                    );

                }
            )

        );


        self.skipWaiting();

    }
);


self.addEventListener(
    "activate",
    event => {


        event.waitUntil(

            caches.keys()
                .then(
                    keys => {


                        return Promise.all(

                            keys
                                .filter(
                                    key =>
                                        key !== CACHE_NAME
                                )
                                .map(
                                    key =>
                                        caches.delete(
                                            key
                                        )
                                )

                        );

                    }
                )

        );


        self.clients.claim();

    }
);


self.addEventListener(
    "fetch",
    event => {


        const request =
            event.request;


        const url =
            new URL(
                request.url
            );


        if (
            url.origin === location.origin
        ) {


            if (
                request.mode === "navigate"
            ) {


                event.respondWith(

                    fetch(
                        request
                    )
                    .catch(
                        () =>

                            caches.match(
                                "./index.html"
                            )

                    )

                );


                return;

            }


            event.respondWith(

                caches.match(
                    request
                )
                .then(
                    cached => {


                        if (
                            cached
                        ) {

                            return cached;

                        }


                        return fetch(
                            request
                        )
                        .then(
                            response => {


                                const copy =
                                    response.clone();


                                caches.open(
                                    CACHE_NAME
                                )
                                .then(
                                    cache => {

                                        cache.put(
                                            request,
                                            copy
                                        );

                                    }
                                );


                                return response;

                            }
                        );

                    }
                )

            );


            return;

        }


        if (
            url.hostname === "cdn.jsdelivr.net"
        ) {


            event.respondWith(

                caches.match(
                    request
                )
                .then(
                    cached => {


                        const network =
                            fetch(
                                request
                            )
                            .then(
                                response => {


                                    const copy =
                                        response.clone();


                                    caches.open(
                                        CACHE_NAME
                                    )
                                    .then(
                                        cache => {


                                            cache.put(
                                                request,
                                                copy
                                            );

                                        }
                                    );


                                    return response;

                                }
                            );


                        return cached || network;

                    }
                )

            );

        }

    }
);
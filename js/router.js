/* =========================================
   FASE 6 — URL INDIVIDUAL POR TEXTO

   Formato da rota:
   /leitura/<nivel>/<dia>

   Exemplo:
   /leitura/nivel-2/200

   Se o site for hospedado numa subpasta
   (ex.: usuario.github.io/textododia/),
   ajuste BASE_PATH abaixo, sem barra no final
   (ex.: "/textododia").
========================================= */

export const BASE_PATH =
    "";


const ROUTE_PATTERN =
    new RegExp(
        `^${BASE_PATH}/leitura/(nivel-[1-4])/(\\d{1,3})/?$`
    );


/* =========================================
   LÊ A ROTA ATUAL

   Suporta tanto o caminho normal
   (/leitura/nivel-2/200) quanto o parâmetro
   ?redirect= usado pelo fallback do 404.html
   em hospedagens estáticas sem rewrite
   configurado no servidor.
========================================= */

export function parseCurrentRoute() {


    const params =
        new URLSearchParams(
            window.location.search
        );


    const redirectParam =
        params.get(
            "redirect"
        );


    const pathname =
        redirectParam ?
            decodeURIComponent(redirectParam) :
            window.location.pathname;


    const match =
        pathname.match(
            ROUTE_PATTERN
        );


    if (
        !match
    ) {

        return null;

    }


    const level =
        match[1];


    const day =
        Number(
            match[2]
        );


    if (
        !Number.isInteger(day) ||
        day < 1 ||
        day > 366
    ) {

        return null;

    }


    return {
        level,
        day
    };

}


/* =========================================
   MONTA O CAMINHO DE UM TEXTO
========================================= */

export function buildRoutePath(
    level,
    day
) {

    return `${BASE_PATH}/leitura/${level}/${day}`;

}


/* =========================================
   NAVEGAÇÃO (SEM RECARREGAR A PÁGINA)
========================================= */

export function goToRoute(
    level,
    day,
    { replace = false } = {}
) {


    const path =
        buildRoutePath(
            level,
            day
        );


    if (
        window.location.pathname === path &&
        !window.location.search
    ) {

        return;

    }


    const method =
        replace ?
            "replaceState" :
            "pushState";


    window.history[method](
        { level, day },
        "",
        path
    );

}


export function goToHome(
    { replace = false } = {}
) {


    const path =
        `${BASE_PATH}/` || "/";


    if (
        window.location.pathname === path &&
        !window.location.search
    ) {

        return;

    }


    const method =
        replace ?
            "replaceState" :
            "pushState";


    window.history[method](
        {},
        "",
        path
    );

}

/* =========================================
   INSTALAÇÃO DO APP (FASE 8)

   Android/Chrome: captura o beforeinstallprompt
   e mostra um botão próprio, dentro do menu.

   iOS Safari: não existe beforeinstallprompt,
   então mostramos uma dica de "Adicionar à
   Tela de Início".

   Se o app já estiver instalado (rodando em
   modo standalone), a seção inteira fica oculta.
========================================= */

function isIos() {

    const userAgent =
        window.navigator.userAgent;


    if (
        /iphone|ipad|ipod/i.test(userAgent)
    ) {

        return true;

    }


    // iPadOS 13+ se identifica como Mac,
    // mas tem suporte a toque multiplo.

    return (

        window.navigator.platform === "MacIntel" &&
        window.navigator.maxTouchPoints > 1

    );

}


function isStandalone() {

    return (

        window.matchMedia(
            "(display-mode: standalone)"
        ).matches ||

        window.navigator.standalone === true

    );

}


export function initInstallPrompt(
    {
        section,
        button,
        iosTip
    }
) {


    if (
        isStandalone()
    ) {

        return;

    }


    let deferredPrompt =
        null;


    window.addEventListener(
        "beforeinstallprompt",
        event => {


            event.preventDefault();


            deferredPrompt =
                event;


            section.hidden =
                false;


            button.hidden =
                false;


            iosTip.hidden =
                true;

        }
    );


    window.addEventListener(
        "appinstalled",
        () => {


            section.hidden =
                true;


            deferredPrompt =
                null;

        }
    );


    button.addEventListener(
        "click",
        async () => {


            if (
                !deferredPrompt
            ) {

                return;

            }


            button.disabled =
                true;


            deferredPrompt.prompt();


            try {


                await deferredPrompt.userChoice;


            } catch (
                error
            ) {


                console.error(
                    error
                );

            }


            deferredPrompt =
                null;


            button.disabled =
                false;

        }
    );


    if (
        isIos()
    ) {


        section.hidden =
            false;


        button.hidden =
            true;


        iosTip.hidden =
            false;

    }

}

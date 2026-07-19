const SHARE_CANVAS_WIDTH =
    1080;


const SHARE_CANVAS_HEIGHT =
    1350;


function escapeCanvasText(
    text
) {

    return String(
        text || ""
    );

}


function drawWrappedText(
    context,
    text,
    x,
    y,
    maxWidth,
    lineHeight,
    maxLines
) {


    const words =
        escapeCanvasText(
            text
        ).split(" ");


    let line =
        "";


    let lines =
        [];


    words.forEach(
        word => {


            const testLine =
                `${line}${word} `;


            const width =
                context.measureText(
                    testLine
                ).width;


            if (
                width > maxWidth &&
                line !== ""
            ) {


                lines.push(
                    line.trim()
                );


                line =
                    `${word} `;


            } else {


                line =
                    testLine;

            }

        }
    );


    if (
        line.trim()
    ) {


        lines.push(
            line.trim()
        );

    }


    lines =
        lines.slice(
            0,
            maxLines
        );


    lines.forEach(
        (
            currentLine,
            index
        ) => {


            context.fillText(
                currentLine,
                x,
                y + index * lineHeight
            );

        }
    );


    return lines.length;

}


export async function generateShareImage(
    data
) {


    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        SHARE_CANVAS_WIDTH;


    canvas.height =
        SHARE_CANVAS_HEIGHT;


    const context =
        canvas.getContext(
            "2d"
        );


    /* =====================================
       FUNDO
    ===================================== */

    context.fillStyle =
        "#edf0e4";


    context.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* =====================================
       TEXTURA
    ===================================== */

    context.globalAlpha =
        0.04;


    for (
        let i = 0;
        i < 9000;
        i++
    ) {


        const x =
            Math.random() *
            canvas.width;


        const y =
            Math.random() *
            canvas.height;


        context.fillStyle =
            "#641f2c";


        context.fillRect(
            x,
            y,
            1,
            1
        );

    }


    context.globalAlpha =
        1;


    /* =====================================
       FOLHA
    ===================================== */

    const paperX =
        90;


    const paperY =
        70;


    const paperWidth =
        canvas.width - 180;


    const paperHeight =
        canvas.height - 140;


    context.fillStyle =
        "#fffdf8";


    context.shadowColor =
        "rgba(67, 44, 29, 0.18)";


    context.shadowBlur =
        30;


    context.shadowOffsetY =
        12;


    context.fillRect(
        paperX,
        paperY,
        paperWidth,
        paperHeight
    );


    context.shadowColor =
        "transparent";


    context.shadowBlur =
        0;


    context.shadowOffsetY =
        0;


    /* =====================================
       CABEÇALHO
    ===================================== */

    context.textAlign =
        "center";


    context.fillStyle =
        "#641f2c";


    context.font =
        "600 58px 'Georgia', serif";


    context.fillText(
        "Textododia",
        canvas.width / 2,
        170
    );


    context.fillStyle =
        "#bd9853";


    context.fillRect(
        canvas.width / 2 - 35,
        205,
        70,
        2
    );


    /* =====================================
       TÍTULO
    ===================================== */

    context.fillStyle =
        "#641f2c";


    context.font =
        "600 40px 'Georgia', serif";


    const titleLines =
        drawWrappedText(
            context,
            data.title,
            canvas.width / 2,
            290,
            780,
            52,
            3
        );


    let currentY =
        290 +
        titleLines * 52;


    /* =====================================
       AUTOR
    ===================================== */

    context.fillStyle =
        "#3d121b";


    context.font =
        "italic 25px 'Georgia', serif";


    context.fillText(
        data.author,
        canvas.width / 2,
        currentY + 55
    );


    /* =====================================
       METADADOS
    ===================================== */

    context.fillStyle =
        "#bd9853";


    context.font =
        "700 18px Arial, sans-serif";


    context.fillText(
        `${data.genre}  ·  ${data.theme}`,
        canvas.width / 2,
        currentY + 100
    );


    /* =====================================
       TEXTO
    ===================================== */

    context.textAlign =
        "left";


    context.fillStyle =
        "#332d2a";


    context.font =
        "26px Arial, sans-serif";


    const excerpt =
        data.excerpt ||
        "Uma leitura para cada dia.";


    drawWrappedText(
        context,
        excerpt,
        170,
        currentY + 190,
        740,
        40,
        9
    );


    /* =====================================
       QR CODE
    ===================================== */

    const qrCanvas =
        document.createElement(
            "canvas"
        );


    await QRCode.toCanvas(
        qrCanvas,
        data.url,
        {
            width: 180,
            margin: 1,
            color: {
                dark: "#641f2c",
                light: "#fffdf8"
            }
        }
    );


    context.drawImage(
        qrCanvas,
        canvas.width - 320,
        canvas.height - 340,
        180,
        180
    );


    context.textAlign =
        "center";


    context.fillStyle =
        "#641f2c";


    context.font =
        "600 22px 'Georgia', serif";


    context.fillText(
        "Leia no Textododia",
        canvas.width - 230,
        canvas.height - 125
    );


    /* =====================================
       EMBLEMA
    ===================================== */

    context.fillStyle =
        "#641f2c";


    context.font =
        "700 26px 'Georgia', serif";


    context.fillText(
        "TTD",
        190,
        canvas.height - 150
    );


    context.fillStyle =
        "#bd9853";


    context.fillRect(
        165,
        canvas.height - 125,
        50,
        2
    );


    return canvas;

}


/* =========================================
   COMPARTILHAMENTO
========================================= */

export async function shareTextImage(
    data
) {


    const canvas =
        await generateShareImage(
            data
        );


    const blob =
        await new Promise(
            resolve => {


                canvas.toBlob(
                    resolve,
                    "image/png"
                );

            }
        );


    const file =
        new File(
            [
                blob
            ],
            "textododia.png",
            {
                type: "image/png"
            }
        );


    if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({
            files: [
                file
            ]
        })
    ) {


        await navigator.share({

            title:
                data.title,

            text:
                "Uma leitura do Textododia.",

            files: [
                file
            ]

        });


        return;

    }


    const link =
        document.createElement(
            "a"
        );


    link.download =
        "textododia.png";


    link.href =
        canvas.toDataURL(
            "image/png"
        );


    link.click();

}
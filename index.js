const path = require("path");
const { getCropedSize, jimpContrast, processImage, getImageBrightness, compositImg, brightnessImg, grayImg } = require("./libs");
const sharp = require("sharp");



const main = async () => {
    try {
        for (let i = 0; i < 595; i++) { // 595
            const input = path.format({ dir: "D:/movie/sathi-9-7/part-1", base: `1 (${i + 1}).png` });
            const output = path.format({ dir: "D:/movie/sathi-9-7/part-1-1", base: `1 (${i + 1}).png` });
            const { x, y, w, h } = await getCropedSize(input, 80);

            await processImage(input, output, x, y, w, h, 1080, 1920, false);
        }
    } catch (err) {
        console.error(err);
    }
}

 main();

const main2 = async () => {
    try {

        const inputFile = path.join(__dirname, "prova_pencil.png");
        const outputFile = path.join(__dirname, "output.png");

        //   const inputFile = path.format({ dir: "E:/web/p-1/sathi khan/pics", base: "1 (12).png" });
        //    const outputFile = path.format({ dir: "E:/web/p-1/sathi khan/pics", base: "1 (12)-1.png" });

        const { x, y, w, h } = await getCropedSize(inputFile, 80);
        console.log({ x, w, h })



        await processImage(inputFile, outputFile, x, y, w, h, 1080, 1920, true);

    } catch (err) {
        console.error(err);
    }
}

//main2();




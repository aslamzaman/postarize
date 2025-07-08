const path = require("path");
const { jimpContrast, processImage, getImageBrightness, compositImg, brightnessImg, grayImg } = require("./libs");
const sharp = require("sharp");



const main = async () => {
    try {
        for (let i = 0; i < 743; i++) { // 743
            const input = path.format({ dir: "D:/movie/Dhodi_Dekha_K_Nach/pics", base: `1 (${i + 1}).png` });
            const output = path.format({ dir: "D:/movie/Dhodi_Dekha_K_Nach/bw_c", base: `1 (${i + 1}).png` });
            await processImage(input, output, 716, 106, 487, 866, 1080, 1920, 1.2, 1.1, false);
            //    await processImage("1.png", "output.png", 716, 106, 487, 866, 1080, 1920, 1.2,1.1, false);
        }
    } catch (err) {
        console.error(err);
    }
}

// main();

const main2 = async () => {
    try {

        const inputFile = path.format({ dir: "E:/web/p-1/sathi khan/pics", base: "1 (12).png" });
        const outputFile = path.format({ dir: "E:/web/p-1/sathi khan/pics", base: "1 (12)-1.png" });
        const outputFile2 = path.format({ dir: "D:/2025/Zohur/2025-01-013/Only picture", base: "1 (6)-1-1.jpg" });
        const metadata = await sharp(inputFile).metadata();

        const width = metadata.width;
        const height = metadata.height;

     //   const jimbuffer = await jimpContrast(inputFile);

        // const composit = await compositImg(inputFile, inputFile, "overlay");
        // const composit2 = await compositImg(composit, composit, "screen");
        // const bright = await brightnessImg(composit2,1);
    //    sharp(jimbuffer).png().toFile(outputFile2);




          await processImage(inputFile, outputFile, 0, 0, width, height, width, height, 0, 3, false);
        // const data1 = await getImageBrightness(inputFile);
        // const data2 = await getImageBrightness(outputFile);
        // console.log({ data1, data2 });

    } catch (err) {
        console.error(err);
    }
}

main2();




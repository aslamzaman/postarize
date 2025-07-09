const path = require("path");
const { getCropedSize, jimpContrast, processImage, getImageBrightness, compositImg, brightnessImg, grayImg } = require("./libs");
const sharp = require("sharp");
const fs = require("fs");
const { Jimp } = require('jimp');



const main = async () => {
    try {
        // const images = fs.readdirSync("E:/web/p-1/sathi khan/pics");
        //for (let i = 0; i < images.length; i++) { // 595
        // const inputPath = path.format({ dir: "E:/web/p-1/sathi khan/pics", base: `${images[i]}` })
        // const output = path.join(__dirname, `pics/${images[i]}`);

        const img = path.join(__dirname, "image1590.png");
        const { x, y, w, h, width, height } = await getCropedSize(img, 80);
        await processImage(img, "image1590_poster_color.png", 0, 0, width, height, width, height, true);
        // }
    } catch (err) {
        console.error(err);
    }
}

//main();





const creatPosterizeColor = async (inputPath, outputPath) => {
    const intensity = await getImageBrightness(inputPath);
    const contrast = intensity * 0.00121716692227172;
    const image = await Jimp.read(inputPath);
    image.contrast(contrast); // 0.5 No change
    image.brightness(1.3); // 1 No change
    image.posterize(3);
    await image.write(outputPath);
    console.log("Jimp created poster");
}

const bgt = async () => {
    try {
  const intensity = await getImageBrightness(inputPath);

    const contrast = intensity * 0.00121716692227172;

        const image = await Jimp.read(inputPath);
        image.greyscale();
        image.contrast(contrast); // 0.5 No change
        const buffer = image.getBuffer("image/png");

        const intensityForBrightness = await getImageBrightness(buffer);
        const bright = (1 / intensityForBrightness) * 236;
        return bright;
    } catch (err) {
        console.log(err);
    }
}

// https://pinetools.com/change-image-contrast
const creatPosterizeGray = async (inputPath, outputPath) => {
    const intensity = await getImageBrightness(inputPath);

    const contrast = intensity * 0.00121716692227172;
    console.log({ intensity, brightness })

    const image = await Jimp.read(inputPath);
    image.greyscale();
    image.contrast(contrast); // 0.5 No change
    const buffer = image.getBuffer("image/png");

    const intensityForBrightness = await getImageBrightness(buffer);
    const bright = (1 / intensityForBrightness) * 236;


    image.brightness(bright); // 1 No change
    image.posterize(3);
    await image.write(outputPath);
    console.log("Jimp created poster");
}

const dd = async () => {
    try {
        const img = path.join(__dirname, "1.png");
        const outputPath = "temp.png";

        await creatPosterizeGray(img, outputPath); // 0.2 liting
    } catch (err) {
        console.log(err);
    }
}
dd();









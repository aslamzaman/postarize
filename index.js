const path = require("path");
const { getCropedSize, jimpContrast, processImage, getImageBrightness, compositImg, brightnessImg, grayImg } = require("./libs");
const sharp = require("sharp");
const fs = require("fs");



const main = async () => {
    try {
       // const images = fs.readdirSync("E:/web/p-1/sathi khan/pics");
        //for (let i = 0; i < images.length; i++) { // 595
           // const inputPath = path.format({ dir: "E:/web/p-1/sathi khan/pics", base: `${images[i]}` })
           // const output = path.join(__dirname, `pics/${images[i]}`);

           const img = path.join(__dirname,"cover.png");
            const { x, y, w, h, width, height } = await getCropedSize(img, 80);
            await processImage(img, "cover_final.png", 0, 0, width, height, width, height, false);
       // }
    } catch (err) {
        console.error(err);
    }
}

main();









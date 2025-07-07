const path = require("path");
const { processImage, grayImg, createSvg } = require("./libs");
const sharp = require("sharp");

const main = async () => {
    try {
    for (let i = 0; i < 743; i++) { // 743
        const input = path.format({ dir: "D:/movie/Dhodi_Dekha_K_Nach/pics", base: `1 (${i + 1}).png` });
        const output = path.format({ dir: "D:/movie/Dhodi_Dekha_K_Nach/bw_l", base: `1 (${i + 1}).png` });
           await processImage(input, output, 472, 106, 487, 866, 1080, 1920, 1.2, 1.1, false);
     }
    } catch (err) {
        console.error(err);
    }
}
 main();

// lib.js
const sharp = require('sharp');
const potrace = require('potrace');


const createSvg = (bufferImg) => {
    return new Promise((resolve, reject) => {
        try {
            potrace.posterize(bufferImg, { steps: 4 }, (err, svg) => {
                if (err) {
                    console.log("Error creating svg!");
                    return;
                };
                resolve(Buffer.from(svg));
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}

const cropedImg = async (inputPath, left, top, width, height) => {
    try {
        const cropedBuffer = await sharp(inputPath)
            .extract({
                left: left,
                top: top,
                width: width,
                height: height
            })
            .toBuffer();
        return cropedBuffer;
    } catch (err) {
        console.error(err);
    }
}


const grayImg = async (inputPath) => {
    try {
        const grayBuffer = await sharp(inputPath)
            .grayscale()
            .toBuffer();
        return grayBuffer;
    } catch (err) {
        console.error(err);
    }
}


const brightnessImg = async (inputPath, brightness) => {
    try {
        const brighnessBuffer = await sharp(inputPath)
            .modulate({
                brightness: brightness
            })
            .toBuffer();
        return brighnessBuffer;
    } catch (err) {
        console.error(err);
    }
}


const compositImg = async (inputPath1, inputPath2, blendOption) => {
    try {
        const blendBuffer = await sharp(inputPath1)
            .composite([{ input: inputPath2, blend: blendOption }])
            .toBuffer();
        return blendBuffer;
    } catch (err) {
        console.error(err);
    }
}

/**
 * 
 * @param {String} inputPath Input image path 
 * @param {String} outputPath  Output image path
 * @param {Number} left Croped distance from left margin
 * @param {Number} top  Croped distance from top margin
 * @param {Number} width Croped width
 * @param {Number} height Croped height
 * @param {Number} width1 New width
 * @param {Number} height1 New width
 * @param {Number} brightness Background image brightness
 * @param {Boolean} isColor If color = true otherwise false
 */
const processImage = async (inputPath, outputPath, left, top, width, height, width1, height1, brightness, isColor) => {
    try {
        const start = Date.now();

        const contrastBuffer = await compositImg(inputPath, inputPath, "multiply", 2); // Increase contrast
        const cropedBuffer = await cropedImg(contrastBuffer, left, top, width, height); // Croped Image


        const svgImg = await createSvg(cropedBuffer); // Creating SVG

        const svgBufferImg = await sharp(svgImg) // SVG to sharp buffer
            .toBuffer();

        const grayScaleImg = await grayImg(cropedBuffer); // Grayscale

        const colorOpt = isColor ? cropedBuffer : grayScaleImg;
        const backgroundImg = await brightnessImg(colorOpt, brightness); // For background image brightness

        const blendImg = await compositImg(backgroundImg, svgBufferImg, 'multiply'); // Blend background with svg


        sharp(blendImg)
            .resize(width1, height1)
            .png()
            .toFile(outputPath);


        const timeTaken = ((Date.now() - start) / 1000).toFixed(2);
        console.log(`Image created: ${outputPath} in ${timeTaken}s`);

    } catch (err) {
        console.error("Error:", err.message);
    }
};


module.exports = { cropedImg, grayImg, brightnessImg, compositImg, createSvg, processImage };



/*
// package.json
{
  "name": "p-7",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "potrace": "^2.1.8",
    "sharp": "^0.34.2"
  }
}


// index.js
const path = require("path");
const { processImage } = require("./utils");

const main = async () => {
    try {
        for (let i = 0; i < 20; i++) { // 602
            const input = path.format({ dir: "F:/videos/sathi/pics", base: `1 (${i + 1}).png` });
            const output = path.format({ dir: "F:/videos/sathi/test", base: `1 (${i + 1}).png` });
            await processImage(input, output, 486, 86, 307, 546, 1080, 1920, 1.5, false);
        }
    } catch (err) {
        console.error(err);
    }
}
 main();
 */
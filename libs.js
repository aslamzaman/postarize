// lib.js
const sharp = require('sharp');
const { Jimp } = require("jimp");
const potrace = require('potrace');


const jimpContrast = async (inputPath, contrast) => {
    try {
        const image = await Jimp.read(inputPath);
        image.contrast(contrast);
        const buffer = await image.getBuffer("image/png");
        console.log(`Created poster image`);
        return buffer;
    } catch (err) {
        console.error(err);
        throw err;
    }
};





const getImageBrightness = async (imagePath) => {
    try {
        const stats = await sharp(imagePath)
            .grayscale()
            .stats();
        const brightness = stats.channels[0].mean;
        return brightness;
    } catch (error) {
        console.error('Error processing image:', error);
        return null;
    }
}




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
 * @param {Number} overAllBrightness Overall image brightness
 * @param {Boolean} isColor If color = true otherwise false
 */
const processImage = async (inputPath, outputPath, left, top, width, height, width1, height1, contrast, overAllBrightness, isColor) => {
    try {
        const start = Date.now();

       // const contrastBuffer = await compositImg(inputPath, inputPath, "multiply"); // Increase contrast
      const contrastBuffer = await jimpContrast(inputPath, contrast);
        const cropedBuffer = await cropedImg(contrastBuffer, left, top, width, height); // Croped Image


        const svgImg = await createSvg(cropedBuffer); // Creating SVG

     //   const svgBufferImg = await sharp(svgImg) // SVG to sharp buffer
        //    .toBuffer();

        const grayScaleImg = await grayImg(cropedBuffer); // Grayscale

        const colorOpt = isColor ? cropedBuffer : grayScaleImg;


        const blendImg = await compositImg(colorOpt, svgImg, 'multiply'); // Blend background with svg

        const overAllBrightnessBuffer = await brightnessImg(blendImg, overAllBrightness);
        sharp(overAllBrightnessBuffer)
            .resize(width1, height1)
            .png()
            .toFile(outputPath);


        const timeTaken = ((Date.now() - start) / 1000).toFixed(2);
        console.log(`Image created: ${outputPath} in ${timeTaken}s`);

    } catch (err) {
        console.error("Error:", err.message);
    }
};


module.exports = { jimpContrast, getImageBrightness, cropedImg, grayImg, brightnessImg, compositImg, createSvg, processImage };


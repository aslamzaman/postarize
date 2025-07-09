// lib.js
const sharp = require('sharp');
const { Jimp } = require("jimp");
const potrace = require('potrace');


const getCropedSize = async (inputFile, y) => {
    try {
        const metadata = await sharp(inputFile).metadata();
        const width = metadata.width;
        const height = metadata.height;
        const h = height - (y * 2)

        const w = parseInt((9 / 16) * h);
        const x = parseInt((width - w) / 2);
        return { x, y, w, h, width, height };
    } catch (err) {
        console.error(err);
        throw err;
    }
}


/**
 * 
 * @param {String} inputPath Image path 
 * @param {Number} contrast 0 - 1 
 * @returns 
 */
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
            potrace.posterize(bufferImg, { steps: 3 }, (err, svg) => {
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
const processImage = async (inputPath, outputPath, left, top, width, height, width1, height1, isColor) => {
    try {
        const start = Date.now();

       //  const contrastBuffer = await compositImg(inputPath, inputPath, "multiply"); // Increase contrast
        const contrastImg = await jimpContrast(inputPath,0.20);
        const cropedBuffer = await cropedImg(contrastImg, left, top, width, height); // Croped Image


const blendImgXX = await compositImg(cropedBuffer, cropedBuffer, 'multiply'); // Blend background with svg

        const svgImg = await createSvg(blendImgXX); // Creating SVG


        const grayScaleImg = await grayImg(cropedBuffer); // Grayscale

        const colorOpt = isColor ? cropedBuffer : grayScaleImg;


        const dd= await compositImg(svgImg, svgImg, 'multiply'); // Blend background with svg
        const blendImg = await compositImg(blendImgXX, dd, 'multiply'); // Blend background with svg


        const brightness = await getImageBrightness(cropedBuffer);
        const x = (1 / brightness) * 180;

        const overAllBrightnessBuffer = await brightnessImg(blendImg, x);
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


module.exports = { getCropedSize, jimpContrast, getImageBrightness, cropedImg, grayImg, brightnessImg, compositImg, createSvg, processImage };


const path = require("path");
const fs = require("fs");
const { Jimp } = require('jimp');



const analyzeImageBrightness = async (imagePath) => {
    try {
        const image = await Jimp.read(imagePath);
        let totalBrightness = 0;
        let pixelCount = 0;

        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            // Get RGB values
            const red = this.bitmap.data[idx + 0];
            const green = this.bitmap.data[idx + 1];
            const blue = this.bitmap.data[idx + 2];

            // Calculate perceived brightness (luminance) for the pixel
            // This formula is often used for human perception of brightness
            const brightness = Math.round((0.2126 * red + 0.7152 * green + 0.0722 * blue));

            totalBrightness += brightness;
            pixelCount++;
        });

        const averageBrightness = totalBrightness / pixelCount;
        return averageBrightness;

    } catch (err) {
        console.error(`Error processing image ${imagePath}:`, err);
        return null;
    }
}





const adjustImageBrightnessLinear = async (imagePath, outputPath) => {
    try {
        const start = Date.now();
        const image = await Jimp.read(imagePath);
        const currentBrightness = await analyzeImageBrightness(imagePath);
        const customBrightness = currentBrightness * 1.5;
        console.log({ current: currentBrightness, custom: customBrightness });
        // Avoid division by zero
        if (currentBrightness <= 0) currentBrightness = 1;

        // Calculate scaling factor
        const scale = customBrightness / currentBrightness;

        // Apply scaling while clamping to [0, 255]
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
            image.bitmap.data[idx + 0] = Math.min(255, image.bitmap.data[idx + 0] * scale);
            image.bitmap.data[idx + 1] = Math.min(255, image.bitmap.data[idx + 1] * scale);
            image.bitmap.data[idx + 2] = Math.min(255, image.bitmap.data[idx + 2] * scale);
        });
        image.posterize(4);
        image.greyscale();
        await image.write(outputPath);

        const timeTaken = ((Date.now() - start) / 1000).toFixed(2);
        console.log(`Image created: ${outputPath} in ${timeTaken}s`);

    } catch (err) {
        console.error(err);
        return null;
    }
};



const testBrightness = async (imagePath, outputPath, scale) => {
    try {
        const start = Date.now();
        const image = await Jimp.read(imagePath);
        const currentBrightness = await analyzeImageBrightness(imagePath);
       
        // Avoid division by zero
        if (currentBrightness <= 0) currentBrightness = 1;


        // Apply scaling while clamping to [0, 255]
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
            image.bitmap.data[idx + 0] = Math.min(255, image.bitmap.data[idx + 0] * scale);
            image.bitmap.data[idx + 1] = Math.min(255, image.bitmap.data[idx + 1] * scale);
            image.bitmap.data[idx + 2] = Math.min(255, image.bitmap.data[idx + 2] * scale);
        });
        image.posterize(4);
        image.greyscale();
        await image.write(outputPath);

        const timeTaken = ((Date.now() - start) / 1000).toFixed(2);
        console.log(`Image created: ${outputPath} in ${timeTaken}s`);

    } catch (err) {
        console.error(err);
        return null;
    }
};




const main = async () => {
    try {
        const path1 = "F:/download/nw/pics";
        const path2 = "F:/download/nw/bw";
        const images = fs.readdirSync(path1);
        for (let i = 0; i < images.length; i++) { // 595
            const inputPath = path.format({ dir: path1, base: `${images[i]}` })
            const outputPath = path.format({ dir: path2, base: `${images[i]}` })
            // const output = path.join(__dirname, `bw/${images[i]}`);

            //  const img = path.join(__dirname, "image1590.png");
            //  const { x, y, w, h, width, height } = await getCropedSize(img, 80);
            await adjustImageBrightnessLinear(inputPath, outputPath);
            console.log(`Create poster: ${i + 1}/${images.length}`);
        }
    } catch (err) {
        console.error(err);
    }
}


 main();


const test = async () => {
    try {
        const scale = [ 0.90, 1.00, 1.10, 1.20, 1.30, 1.40, 1.50, 1.60, 1.70, 1.80 ];
        const path1 = "F:/download/nw";
        const path2 = "F:/download/nw/test";
        const images = fs.readdirSync(path1);

        for (let i = 0; i < scale.length; i++) { // 595
            const inputPath = path.format({ dir: path1, base: `2052.png` })
            const outputPath = path.format({ dir: path2, base: `scale_${scale[i]}_2052.png` })

            await testBrightness(inputPath, outputPath, scale[i]);
            console.log(`Create poster: ${i + 1}/${scale.length}`);
        }
    } catch (err) {
        console.error(err);
    }
}

// test();



















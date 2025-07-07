const path = require("path");
const { processImage } = require("./libs");

const main = async () => {
    try {
      //  for (let i = 0; i < 20; i++) { // 602
         //   const input = path.format({ dir: "F:/videos/sathi/pics", base: `1 (${i + 1}).png` });
         //   const output = path.format({ dir: "F:/videos/sathi/test", base: `1 (${i + 1}).png` });
            await processImage("input.png", "input-2.png", 486, 86, 307, 546, 1080, 1920, 1.5, true);
       // }
    } catch (err) {
        console.error(err);
    }
}
 main();

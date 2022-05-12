const Jimp = require(`jimp`);

const createCaptcha = async () => {
    const code = Math.random().toString(36).slice(2, 8);
    const image = new Jimp(175, 50, `white`);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    const w = image.bitmap.width;
    const h = image.bitmap.height;
    const textWidth = Jimp.measureText(font, code);
    const textHeight = Jimp.measureTextHeight(font, code);

    image.print(font, (w / 2 - textWidth / 2), (h / 2 - textHeight / 2), code);
    image.write(`./temp/captcha/${code}.png`);

    return code;
}

module.exports = {
    createCaptcha
}
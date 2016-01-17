module.exports = {
    getAspectRatio: getAspectRatio,
}


function getAspectRatio(width, height) {
    var theGCD = gcd(width, height)
    var ratioHor = width / theGCD
    var ratioVer = height / theGCD

    // Only one of width or height is valid
    if (isNaN(ratioHor) || isNaN(ratioVer)) {
        ratioHor = NaN
        ratioVer = NaN
    } else if (ratioHor === 683 && ratioVer === 384) {
        // 1366 x 768
        ratioHor = 16
        ratioVer = 9
    } else if (ratioHor === 64 && ratioVer === 27) {
        // 2560 x 1080
        ratioHor = 21
        ratioVer = 9
    } else if (ratioHor === 43 && ratioVer === 18) {
        // 3440 x 1440
        ratioHor = 21
        ratioVer = 9
    } else if (ratioHor === 8 && ratioVer === 5) {
        // Change 8:5 to 16:10
        ratioHor = 16
        ratioVer = 10
    }

    return {
        ratio: width / height,
        ratioHor: ratioHor,
        ratioVer: ratioVer,
    }
}


function gcd(a, b) {
    // Not fastest algorithm but good enough
    if (!b) {
        return a
    }
    return gcd(b, a % b)
}

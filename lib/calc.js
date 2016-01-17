module.exports = calculate


const mathsUtils = require('./mathsUtils')


function calculate(info) {
    /* Take in info = { // in metric form
      diagonalLength: ,
      resW: ,
      resH: ,
      distance: ,
      scaling:
    }
    return { // in metric form
      aspectRatio: 2.3755435,
      aspectRatioW: 21, // or "uncommon"
      aspectRatioH: 9,  // or "uncommon"
      scaledResW: 2560,
      scaledResH: 1080,
      horizontalFOV: ,
      PPD: ,
      scaledPPD: ,

      // Unit dependent (in metric):
      lengthW: ,
      lengthH: ,
      PPCM: ,
      scaledPPCM:
    }*/

    var ratioInfo = mathsUtils.getAspectRatio(info.resW, info.resH)
    var aspectRatio = ratioInfo.ratio
    var aspectRatioW = ratioInfo.ratioHor
    var aspectRatioH = ratioInfo.ratioVer

    // Scaled resolution
    var scaledResW = info.resW / info.scaling
    var scaledResH = info.resH / info.scaling

    var lengthW = info.diagonalLength / Math.sqrt(1 + Math.pow(aspectRatio, -2))
    var lengthH = info.diagonalLength / Math.sqrt(1 + Math.pow(aspectRatio, 2))

    var horizontalFOV = 180 / Math.PI * 2 * Math.atan(lengthW / 2 / info.distance)
    var PPD = info.resW / horizontalFOV
    var scaledPPD = scaledResW / horizontalFOV

    var PPCM = info.resW / lengthW // Pixels per unit
    var scaledPPCM = PPCM / info.scaling

    return {
        aspectRatio: aspectRatio,
        aspectRatioW: aspectRatioW,
        aspectRatioH: aspectRatioH,
        scaledResW: scaledResW,
        scaledResH: scaledResH,
        horizontalFOV: horizontalFOV,
        PPD: PPD,
        scaledPPD: scaledPPD,

        lengthW: lengthW,
        lengthH: lengthH,
        PPCM: PPCM,
        scaledPPCM: scaledPPCM,
    }
}

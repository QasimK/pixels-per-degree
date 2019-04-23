module.exports = {
  calculate,
  calculateBasics, calculateDataRates, calculateMinBandwidths
}

const mathsUtils = require('./mathsUtils')

function calculate (info) {
  /* Take in info = { // in metric form
      diagonalLength: ,
      resW: ,
      resH: ,
      distance: ,
      scaling: ,
      refreshRate: ,
      hdr: ,
    }

    refreshRate and hdr are optional and used to calculate
    the bandwidth requirements

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
      scaledPPCM: ,

      // Optional data rates (bit/s)
      rawDataRate: ,
      cvtR2DataRate: ,

      // Optional minimum version requirements to support data rate
      dpMinBandwidth: ,
      hdmiMinBandwidth: ,
    }
  */

  const basics = calculateBasics(
    info.diagonalLength, info.resW, info.resH, info.distance, info.scaling)
  const dateRates = calculateDataRates(
    info.resW, info.resH, info.refreshRate, info.hdr
  )
  const minBandwidths = calculateMinBandwidths(dataRates.cvtR2DataRate)

  return {
    ...basics,
    ...dateRates,
    ...minBandwidths,
  }
}

function calculateBasics (
  diagonalLength,
  resolutionWidth,
  resolutionHeight,
  distance,
  scaling,
) {
  var ratioInfo = mathsUtils.getAspectRatio(resolutionWidth, resolutionHeight)
  var aspectRatio = ratioInfo.ratio
  var aspectRatioW = ratioInfo.ratioHor
  var aspectRatioH = ratioInfo.ratioVer

  // Scaled resolution
  var scaledResW = resolutionWidth / scaling
  var scaledResH = resolutionHeight / scaling

  var lengthW = diagonalLength / Math.sqrt(1 + Math.pow(aspectRatio, -2))
  var lengthH = diagonalLength / Math.sqrt(1 + Math.pow(aspectRatio, 2))

  var horizontalFOV = 180 / Math.PI * 2 * Math.atan(lengthW / 2 / distance)
  var PPD = resolutionWidth / horizontalFOV
  var scaledPPD = scaledResW / horizontalFOV

  var PPCM = resolutionWidth / lengthW  // Pixels per unit
  var scaledPPCM = PPCM / scaling

  return {
    aspectRatio,
    aspectRatioW,
    aspectRatioH,
    scaledResW,
    scaledResH,
    horizontalFOV,
    PPD,
    scaledPPD,

    lengthW,
    lengthH,
    PPCM,
    scaledPPCM,
  }
}

function calculateDataRates(resolutionWidth, resolutionHeight, refreshRate, colorDepth) {
  const numSubPixels = 3

  if (resolutionWidth === undefined || resolutionHeight === undefined || refreshRate === undefined ||
    colorDepth === undefined) {
    return {
      rawDataRate: undefined,
      cvtR2DataRate: undefined,
    }
  }

  const rawDataRate = resolutionWidth * resolutionHeight * refreshRate * colorDepth * numSubPixels

  // DisplayPort & HDMI *usually* use CVT-R2 blanking
  // https://en.wikipedia.org/wiki/Coordinated_Video_Timings
  // This is complicated to calculate!
  // Simplified: https://linustechtips.com/main/topic/729232-guide-to-display-cables-adapters-v2/
  // The timings can vary a little bit!
  const hBlankPixels = 80
  const vMinSeconds = 0.00046
  const vBlackPixelsDecimal = (resolutionHeight * vMinSeconds) / ( (1 / refreshRate) - vMinSeconds)
  const vBlackPixels = Math.ceil(vBlackPixelsDecimal)
  const cvtR2DataRate = (resolutionWidth + hBlankPixels) * (resolutionHeight + vBlackPixels) * refreshRate * colorDepth * numSubPixels

  return { rawDataRate, cvtR2DataRate }
}


function calculateMinBandwidths(cvtR2DataRate) {
  let dpMinBandwidth = null
  let smallestDPRate = Number.POSITIVE_INFINITY
  for (const [key, value] of Object.entries(DP_DATA_RATES)) {
    if (value >= cvtR2DataRate && value < smallestDPRate) {
      dpMinBandwidth = key
      smallestDPRate = value
    }
  }

  var hdmiMinBandwidth = null
  let smallestHDMIRate = Number.POSITIVE_INFINITY
  for (const [key, value] of Object.entries(HDMI_DATA_RATES)) {
    if (value >= cvtR2DataRate && value < smallestHDMIRate) {
      hdmiMinBandwidth = key
      smallestHDMIRate = value
    }
  }

  return {dpMinBandwidth, hdmiMinBandwidth}
}


// These are the data rates (bit/s) rather than the total bandwidth
const DP_DATA_RATES = {
  'RBR':   5184000000,  // 8b/10b encoding (RBR introduced in DP 1.0)
  'HBR':   8640000000,  // 8b/10b encoding (HBR introduced in DP 1.0)
  'HBR2': 17280000000,  // 8b/10b encoding (HBR2 introduced in DP 1.2)
  'HBR3': 25920000000,  // 8b/10b encoding (HBR3 & DSC 1.2 introduced in DP 1.3)
}

const HDMI_DATA_RATES = {
  '1.0+':  3960000000,  // 8b/10b encoding
  '1.3+':  8160000000,  // 8b/10b encoding
  '2.0+': 14400000000,  // 8b/10b encoding
  '2.1+': 42666666666,  // 16b/18b encoding; DSC 1.2
}

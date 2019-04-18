/* eslint-env mocha */

const should = require('chai').should() // eslint-disable-line no-unused-vars

const ppdCalc = require('../lib/index.js')

// Test resources
const info = {
  diagonalLength: 100,
  resW: 160,
  resH: 90,
  distance: 100,
  scaling: 1
}

const infoScaled = {
  diagonalLength: 100,
  resW: 160,
  resH: 90,
  distance: 100,
  scaling: 2
}

const expectedResult = {
  aspectRatio: 1.7777777777777777,
  aspectRatioW: 16,
  aspectRatioH: 9,
  scaledResW: 160,
  scaledResH: 90,
  horizontalFOV: 47.09396651697574,
  PPD: 3.397462813889876,
  scaledPPD: 3.397462813889876,
  lengthW: 87.15755371245493,
  lengthH: 49.0261239632559,
  PPCM: 1.835755975068582,
  scaledPPCM: 1.835755975068582
}

const expectedScaledResult = {
  aspectRatio: 1.7777777777777777,
  aspectRatioW: 16,
  aspectRatioH: 9,
  scaledResW: 80,
  scaledResH: 45,
  horizontalFOV: 47.09396651697574,
  PPD: 3.397462813889876,
  scaledPPD: 1.698731406944938,
  lengthW: 87.15755371245493,
  lengthH: 49.0261239632559,
  PPCM: 1.835755975068582,
  scaledPPCM: 0.917877987534291
}

describe('calculates all results correctly.', function () {
  context('without scaling', function () {
    it('returns the correct result', function () {
      ppdCalc.ppdCalc(info).should.deep.equal(expectedResult)
    })
  })

  context('with scaling', function () {
    it('returns the correct result', function () {
      ppdCalc.ppdCalc(infoScaled).should.deep.equal(expectedScaledResult)
    })
  })
})

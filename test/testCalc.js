/* eslint-env mocha */

const should = require('chai').should() // eslint-disable-line no-unused-vars

const calc = require('../lib/calc.js')

describe('calculateBasics', function () {
  context('without scaling', function () {
    it('should return the expected results', function () {
      calc.calculateBasics(100, 160, 90, 100, 1).should.deep.equal({
        aspectRatio: 1.7777777777777777,
        aspectRatioW: 16,
        aspectRatioH: 9,
        scaledResolutionWidth: 160,
        scaledResolutionHeight: 90,
        horizontalFOV: 47.09396651697574,
        PPD: 3.397462813889876,
        scaledPPD: 3.397462813889876,
        lengthW: 87.15755371245493,
        lengthH: 49.0261239632559,
        PPCM: 1.835755975068582,
        scaledPPCM: 1.835755975068582
      })
    })
  })

  context('with scaling', function () {
    it('should return the expected results', function () {
      calc.calculateBasics(100, 160, 90, 100, 2).should.deep.equal({
        aspectRatio: 1.7777777777777777,
        aspectRatioW: 16,
        aspectRatioH: 9,
        scaledResolutionWidth: 80,
        scaledResolutionHeight: 45,
        horizontalFOV: 47.09396651697574,
        PPD: 3.397462813889876,
        scaledPPD: 1.698731406944938,
        lengthW: 87.15755371245493,
        lengthH: 49.0261239632559,
        PPCM: 1.835755975068582,
        scaledPPCM: 0.917877987534291
      })
    })
  })
})

describe('calculates data rate correctly', function () {
  it('returns the correct result', function () {
    calc.calculateDataRates(2, 5, 7, 11).should.deep.equal({
      rawDataRate: 2310,
      cvtR2DataRate: 113652
    })
  })

  it('returns the correct result for 720p', function () {
    calc.calculateDataRates(1280, 720, 60, 8).should.deep.equal({
      rawDataRate: 1327104000,
      cvtR2DataRate: 1451174400
    })
  })

  it('returns the correct result for 4k30', function () {
    calc.calculateDataRates(3840, 2160, 30, 8).should.deep.equal({
      rawDataRate: 5971968000,
      cvtR2DataRate: 6183878400
    })
  })

  it('returns the correct result for 4k60@10-bit', function () {
    calc.calculateDataRates(3840, 2160, 60, 10).should.deep.equal({
      rawDataRate: 14929920000,
      cvtR2DataRate: 15678432000
    })
  })

  it('returns the correct result for 8k30', function () {
    calc.calculateDataRates(7680, 4320, 30, 8).should.deep.equal({
      rawDataRate: 23887872000,
      cvtR2DataRate: 24477523200
    })
  })

  it('returns the correct result for something impossible', function () {
    calc.calculateDataRates(7680, 4320, 1000, 12).should.deep.equal({
      rawDataRate: 1194393600000,
      cvtR2DataRate: 2234880000000
    })
  })
})

describe('calculates minimum bandwidth requirements correctly', function () {
  it('returns the correct result for 720p', function () {
    calc.calculateMinBandwidths(1451174400).should.deep.equal({
      dpMinBandwidth: 'RBR',
      hdmiMinBandwidth: '1.0+'
    })
  })

  it('returns the correct result for 4k30', function () {
    calc.calculateMinBandwidths(6183878400).should.deep.equal({
      dpMinBandwidth: 'HBR',
      hdmiMinBandwidth: '1.3+'
    })
  })

  it('returns the correct result for 4k60@10-bit', function () {
    calc.calculateMinBandwidths(15678432000).should.deep.equal({
      dpMinBandwidth: 'HBR2',
      hdmiMinBandwidth: '2.1+'
    })
  })

  it('returns the correct result for 8k30', function () {
    calc.calculateMinBandwidths(24477523200).should.deep.contain({
      dpMinBandwidth: 'HBR3',
      hdmiMinBandwidth: '2.1+'
    })
  })

  it('returns the correct result for something impossible', function () {
    calc.calculateMinBandwidths(2234880000000).should.deep.contain({
      dpMinBandwidth: null,
      hdmiMinBandwidth: null
    })
  })
})

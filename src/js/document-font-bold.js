﻿export const fontBold = function (jsPDFAPI) {
  var font =
  var callAddFont = function () {
    this.addFileToVFS('TimesNewRoman-bold.ttf', font)
    this.addFont('TimesNewRoman-bold.ttf', 'TimesNewRoman', 'bold')
  }
  jsPDFAPI.events.push(['addFonts', callAddFont])
}
﻿export const fontNormal = function (jsPDFAPI) {
  var font =
  var callAddFont = function () {
    this.addFileToVFS('TimesNewRoman-normal.ttf', font)
    this.addFont('TimesNewRoman-normal.ttf', 'TimesNewRoman', 'normal')
  }
  jsPDFAPI.events.push(['addFonts', callAddFont])
}
var langcodes = require('./langcodes.js');

module.exports = {

  // Decompress zip
  decompress: function(dataBuff, callback) {
    try {
      console.log(dataBuff);
      var AdmZip  = require('adm-zip');
      var zip = new AdmZip(dataBuff);
      var zipEntries = zip.getEntries();
      console.log(zipEntries);
      // TODO: Shouldn't we look for only 1 file ???
      zipEntries.forEach(function(zipEntry, key) {
        if (zipEntry.entryName.indexOf('.srt') != -1) {
          var decompressedData = zip.readFile(zipEntry);
          callback(decompressedData);
        }
      });
    } catch (error) {
      console.log('Failed to decompress subtitle!', error);
    }
  },

  // Handles charset encoding
  decode: function(dataBuff, language, callback) {
    var charsetDetect = require('jschardet');
    var targetEncodingCharset = 'utf8';

    var charset = charsetDetect.detect(dataBuff);
    var detectedEncoding = charset.encoding;
    console.log("SUB charset detected: "+detectedEncoding);
    // Do we need decoding?
    if (detectedEncoding.toLowerCase().replace('-','') == targetEncodingCharset) {
      callback(dataBuff.toString('utf-8'));
    // We do
    } else {
      var iconv = require('iconv-lite');
      var langInfo = langcodes[language] || {};
      console.log("SUB charset expected: "+langInfo.encoding);
      if (langInfo.encoding !== undefined && langInfo.encoding.indexOf(detectedEncoding) < 0) {
        // The detected encoding was unexepected to the language, so we'll use the most common
        // encoding for that language instead.
        detectedEncoding = langInfo.encoding[0];
      }
      console.log("SUB charset used: "+detectedEncoding);
      dataBuff = iconv.encode( iconv.decode(dataBuff, detectedEncoding), targetEncodingCharset );
      callback(dataBuff.toString('utf-8'));
    }
  }
}

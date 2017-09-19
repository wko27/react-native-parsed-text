'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TextExtraction = function () {
  /**
   * @param {String} text - Text to be parsed
   * @param {Object[]} patterns - Patterns to be used when parsed
   *                              other options than pattern would be added to the parsed content
   * @param {RegExp} patterns[].pattern - RegExp to be used for parsing
   */
  function TextExtraction(text, patterns) {
    _classCallCheck(this, TextExtraction);

    this.text = text;
    this.patterns = patterns || [];
  }

  /**
   * Returns parts of the text with their own props
   * @return {Object[]} - props for all the parts of the text
   */


  _createClass(TextExtraction, [{
    key: 'parse',
    value: function parse() {
      var _this = this;

      var parsedTexts = [{ children: this.text }];
      this.patterns.forEach(function (pattern) {
        var newParts = [];

        parsedTexts.forEach(function (parsedText) {
          // Only allow for now one parsing
          if (parsedText._matched) {
            newParts.push(parsedText);

            return;
          }

          var parts = [];
          var textLeft = parsedText.children;

          while (textLeft) {
            var matches = pattern.pattern.exec(textLeft);

            if (!matches) {
              break;
            }

            var previousText = textLeft.substr(0, matches.index);

            parts.push({ children: previousText });

            parts.push(_this.getMatchedPart(pattern, matches[0], matches));

            textLeft = textLeft.substr(matches.index + matches[0].length);
          }

          parts.push({ children: textLeft });

          newParts.push.apply(newParts, parts);
        });

        parsedTexts = newParts;
      });

      // Remove _matched key.
      parsedTexts.forEach(function (parsedText) {
        return delete parsedText._matched;
      });

      return parsedTexts.filter(function (t) {
        return !!t.children;
      });
    }

    // private

    /**
     * @param {Object} matchedPattern - pattern configuration of the pattern used to match the text
     * @param {RegExp} matchedPattern.pattern - pattern used to match the text
     * @param {String} text - Text matching the pattern
     * @param {String[]} text - Result of the RegExp.exec
     * @return {Object} props for the matched text
     */

  }, {
    key: 'getMatchedPart',
    value: function getMatchedPart(matchedPattern, text, matches) {
      var props = {};

      Object.keys(matchedPattern).forEach(function (key) {
        if (key === 'pattern' || key === 'renderText') {
          return;
        }

        if (typeof matchedPattern[key] === 'function') {
          props[key] = function () {
            return matchedPattern[key](text);
          };
        } else {
          props[key] = matchedPattern[key];
        }
      });

      var children = text;
      if (matchedPattern.renderText && typeof matchedPattern.renderText === 'function') {
        children = matchedPattern.renderText(text, matches);
      }

      return _extends({}, props, {
        children: children,
        _matched: true
      });
    }
  }]);

  return TextExtraction;
}();

exports.default = TextExtraction;
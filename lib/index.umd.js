(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('@emotion/styled'), require('@emotion/core')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react', '@emotion/styled', '@emotion/core'], factory) :
  (global = global || self, factory(global.blackboxReactComponentsLibrary = {}, global.React, global.styled, global.core));
}(this, function (exports, React, styled, core) { 'use strict';

  React = React && React.hasOwnProperty('default') ? React['default'] : React;
  styled = styled && styled.hasOwnProperty('default') ? styled['default'] : styled;

  function _taggedTemplateLiteral(strings, raw) {
    if (!raw) {
      raw = strings.slice(0);
    }

    return Object.freeze(Object.defineProperties(strings, {
      raw: {
        value: Object.freeze(raw)
      }
    }));
  }

  function _templateObject3() {
    var data = _taggedTemplateLiteral(["\n  background: #5cdb95;\n  color: #05385b;\n"]);

    _templateObject3 = function _templateObject3() {
      return data;
    };

    return data;
  }

  function _templateObject2() {
    var data = _taggedTemplateLiteral(["\n  border: none;\n  border-radius: 5px;\n  padding: 10px 20px;\n"]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    var data = _taggedTemplateLiteral(["\n  text-transform: uppercase;\n  font-size: 1.5em;\n  font-weight: bold;\n  letter-spacing: 4px;\n"]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }
  var font = core.css(_templateObject());
  var shape = core.css(_templateObject2());
  var primaryColors = core.css(_templateObject3());

  function _templateObject$1() {
    var data = _taggedTemplateLiteral(["\n  ", "\n  ", "\n  ", "\n"]);

    _templateObject$1 = function _templateObject() {
      return data;
    };

    return data;
  }
  var Wrapper = styled.button(_templateObject$1(), font, primaryColors, shape);
  function Button(_ref) {
    var text = _ref.text,
        onClick = _ref.onClick;
    return React.createElement(Wrapper, {
      onClick: onClick
    }, text);
  }

  exports.Button = Button;

  Object.defineProperty(exports, '__esModule', { value: true });

}));

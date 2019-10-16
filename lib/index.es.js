import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

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
var font = css(_templateObject());
var shape = css(_templateObject2());
var primaryColors = css(_templateObject3());

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

export { Button };

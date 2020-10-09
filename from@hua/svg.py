# -*- coding:UTF-8 -*-
from xml.parsers.expat import ParserCreate
from os import listdir
import sys
import os

try:
  reload(sys)
  sys.setdefaultencoding('utf-8')
  version = 2
except:
  version = 3
  

args = sys.argv
if len(args) > 1: 
  inputPath = args[1]
else:
  inputPath = "resource"

if len(args) > 2: 
  outputPath = args[2]
else:
  outputPath = "./"



js = """/* eslint-disable */
const symbolSvgs = '<symbol>template</symbol>';
let svgSprite = `<svg>${symbolSvgs}</svg>`;
const script = (function () {
  const scripts = document.getElementsByTagName('script');
  return scripts[scripts.length - 1];
}());

const shouldInjectCss = script.getAttribute('data-injectcss');

const before = function (el, target) {
  target.parentNode.insertBefore(el, target);
};

const prepend = function (el, target) {
  if (target.firstChild) {
    before(el, target.firstChild);
  } else {
    target.appendChild(el);
  }
};

function appendSvg() {
  let div = null;
  let svg = null;
  div = document.createElement('div');
  div.innerHTML = svgSprite;
  svgSprite = null;
  svg = div.getElementsByTagName('svg')[0];
  if (svg) {
    svg.setAttribute('aria-hidden', 'true');
    svg.style.position = 'absolute';
    svg.style.width = 0;
    svg.style.height = 0;
    svg.style.overflow = 'hidden';
    prepend(svg, document.body);
  }
}

if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
  window.__iconfont__svg__cssinject__ = true;
  try {
    document.write('<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>')
  } catch (e) {
    console && console.log(e)
  }
}
export default appendSvg;
"""
svgTag = ["rect", "circle", "ellipse", "line", "polyline", "polygon", "path"]

class svgHandler:
  result = ""
  fileName = ""
  def startElement(self, name, attr):
    if (name == "svg"):
      self.result += "<symbol id=\"" + self.fileName + "\"  viewBox=\"" + attr["viewBox"] + "\">"
  
    elif (name in svgTag):
      self.result += "<" + name
      for key in attr:
         self.result += " " + key + "=\"" + attr[key] + "\""

      self.result += ">"
      
  def endElement(self, name):
    if (name == "svg"):
      self.result += "</symbol>"
  
    elif (name in svgTag):
      self.result += "</" + name + ">"

  def data(self, text):
    self.result += text


handler = svgHandler()
parser = ParserCreate()
parser.StartElementHandler = handler.startElement
parser.EndElementHandler = handler.endElement
parser.CharacterDataHandler = handler.data

filebox = listdir(inputPath)
for fileName in filebox:
  
  if version == 3:
    with open(os.path.join(inputPath, fileName), "r", encoding="utf-8") as f:
      icon = f.read()
      ff = fileName.replace(".svg", "");
      handler.fileName = ff;
      parser = ParserCreate()
      parser.StartElementHandler = handler.startElement
      parser.EndElementHandler = handler.endElement
      parser.CharacterDataHandler = handler.data
      parser.Parse(icon)
  else:
    with open(os.path.join(inputPath, fileName), "r") as f:
      icon = f.read()
      ff = fileName.replace(".svg", "");
      handler.fileName = ff;
      parser = ParserCreate()
      parser.StartElementHandler = handler.startElement
      parser.EndElementHandler = handler.endElement
      parser.CharacterDataHandler = handler.data
      parser.Parse(icon)

js = js.replace("<symbol>template</symbol>", handler.result.replace("\n", ""))

with open(os.path.join(outputPath, 'iconSvg.js'), "w") as f:
  f.write(js)

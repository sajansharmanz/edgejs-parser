import { createToken, Lexer } from "chevrotain";

// Default Mode
export const HTML_COMMENT = createToken({
  name: "HTML_COMMENT",
  pattern: /<!--[\s\S]*?-->/,
  line_breaks: true,
});

export const HTML_CONDITIONAL_COMMENT = createToken({
  name: "HTML_CONDITIONAL_COMMENT",
  pattern: /<!\[[\s\S]*?\]>/,
  line_breaks: true,
});

export const XML = createToken({
  name: "XML",
  pattern: /<\?xml(?:.|\s)*?\?>/,
});

export const CDATA = createToken({
  name: "CDATA",
  pattern: /<!\[CDATA\[[\s\S]*?]]>/,
});

export const DTD = createToken({
  name: "DTD",
  pattern: /<!.*?>/,
});

export const SCRIPTLET = createToken({
  name: "SCRIPTLET",
  pattern: /<%(.*?)%>|<\?(.*?)\?>/,
});

export const SEA_WS = createToken({
  name: "SEA_WS",
  pattern: /[ \t\r\n]+/,
  group: Lexer.SKIPPED,
});

export const SCRIPT_OPEN = createToken({
  name: "SCRIPT_OPEN",
  pattern: /<script\b[^>]*>/,
  push_mode: "SCRIPT",
});

export const STYLE_OPEN = createToken({
  name: "STYLE_OPEN",
  pattern: /<style\b[^>]*>/,
  push_mode: "STYLE",
});

export const TAG_OPEN = createToken({
  name: "TAG_OPEN",
  pattern: /</,
  push_mode: "TAG",
});

export const HTML_TEXT = createToken({
  name: "HTML_TEXT",
  pattern: /[^<@{]+/,
  line_breaks: true,
});

// Tag Mode
export const TAG_CLOSE = createToken({
  name: "TAG_CLOSE",
  pattern: />/,
  pop_mode: true,
});

export const TAG_SLASH_CLOSE = createToken({
  name: "TAG_SLASH_CLOSE",
  pattern: /\/>/,
  pop_mode: true,
});

export const TAG_SLASH = createToken({
  name: "TAG_SLASH",
  pattern: /\//,
});

// Attribute - Default Mode
export const TAG_EQUALS = createToken({
  name: "TAG_EQUALS",
  pattern: /=/,
  push_mode: "ATTVALUE",
});

export const TAG_NAME = createToken({
  name: "TAG_NAME",
  pattern:
    /[:@a-zA-Z\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:\.\-@\u00B7\u0300-\u036F\u203F-\u2040.0-9a-zA-Z]*/,
});

export const TAG_WHITESPACE = createToken({
  name: "TAG_WHITESPACE",
  pattern: /[ \t\r\n]+/,
  group: Lexer.SKIPPED,
});

// Script Mode
export const SCRIPT_BODY = createToken({
  name: "SCRIPT_BODY",
  pattern: /[\s\S]*?<\/script>/,
  pop_mode: true,
});

// Style Mode
export const STYLE_BODY = createToken({
  name: "STYLE_BODY",
  pattern: /[\s\S]*?<\/style>/,
  pop_mode: true,
});

// Attribute Value Mode
export const ATTVALUE_VALUE = createToken({
  name: "ATTVALUE_VALUE",
  pattern:
    / *("[^<"]*"|'[^<']*'|[-_./+,?=:#;0-9a-zA-Z]+ ?|#[0-9a-fA-F]+|[0-9]+%?)/,
  pop_mode: true,
});

// EdgeJS - Default Mode
export const EDGE_COMMENT = createToken({
  name: "EDGE_COMMENT",
  pattern: /{{--[\s\S]*?--}}/,
  line_breaks: true,
});

export const EDGE_MUSTACHE = createToken({
  name: "EDGE_MUSTACHE",
  pattern: /{{[\s\S]*?}}/,
});

export const EDGE_SAFE_MUSTACHE = createToken({
  name: "EDGE_SAFE_MUSTACHE",
  pattern: /{{{[\s\S]*?}}}/,
});

export const EDGE_ESCAPED_MUSTACHE = createToken({
  name: "EDGE_ESCAPED_MUSTACHE",
  pattern: /@{{[\s\S]*?}}/,
});

export const EDGE_TAG = createToken({
  name: "EDGE_TAG",
  pattern:
    /@(?:!?\w+(?:\.\w+)?)\s*(?:\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\))?/,
});

export const EDGE_PROPS = createToken({
  name: "EDGE_PROPS",
  pattern: /{{\s*\$props\.\s*(?:[^}]|}(?!}))*\s*}}/,
});

export const lexerDefinition = {
  defaultMode: "default",
  modes: {
    default: [
      HTML_COMMENT,
      HTML_CONDITIONAL_COMMENT,
      XML,
      CDATA,
      DTD,
      SCRIPTLET,
      SEA_WS,
      SCRIPT_OPEN,
      STYLE_OPEN,
      TAG_OPEN,
      EDGE_COMMENT,
      EDGE_ESCAPED_MUSTACHE,
      EDGE_SAFE_MUSTACHE,
      EDGE_MUSTACHE,
      EDGE_TAG,
      HTML_TEXT,
    ],
    TAG: [
      TAG_CLOSE,
      TAG_SLASH_CLOSE,
      TAG_SLASH,
      TAG_EQUALS,
      EDGE_PROPS,
      TAG_NAME,
      TAG_WHITESPACE,
    ],
    SCRIPT: [SCRIPT_BODY],
    STYLE: [STYLE_BODY],
    ATTVALUE: [ATTVALUE_VALUE],
  },
};

export const getAllTokens = () => {
  const tokens = [];

  for (const mode in lexerDefinition.modes) {
    tokens.push(...lexerDefinition.modes[mode]);
  }

  return tokens;
};

import { CstParser } from "chevrotain";
import {
  ATTVALUE_VALUE,
  CDATA,
  DTD,
  getAllTokens,
  HTML_COMMENT,
  HTML_CONDITIONAL_COMMENT,
  HTML_TEXT,
  SCRIPT_BODY,
  SCRIPT_OPEN,
  SCRIPTLET,
  STYLE_BODY,
  STYLE_OPEN,
  TAG_CLOSE,
  TAG_EQUALS,
  TAG_NAME,
  TAG_OPEN,
  TAG_SLASH_CLOSE,
  TAG_SLASH,
  EDGE_COMMENT,
  EDGE_MUSTACHE,
  EDGE_SAFE_MUSTACHE,
  EDGE_ESCAPED_MUSTACHE,
  EDGE_TAG,
  EDGE_PROPS,
} from "./tokens";

export class EdgeParser extends CstParser {
  constructor() {
    super(getAllTokens());

    const $ = this;

    $.RULE("document", () => {
      $.MANY(() => {
        $.SUBRULE($.content);
      });
    });

    $.RULE("content", () => {
      $.OR([
        { ALT: () => $.CONSUME(HTML_TEXT) },
        { ALT: () => $.SUBRULE($.element) },
        { ALT: () => $.SUBRULE($.scriptlet) },
        { ALT: () => $.SUBRULE($.htmlComment) },
        { ALT: () => $.SUBRULE($.htmlConditionalComment) },
        { ALT: () => $.SUBRULE($.cdata) },
        { ALT: () => $.SUBRULE($.dtd) },
        { ALT: () => $.SUBRULE($.scriptElement) },
        { ALT: () => $.SUBRULE($.styleElement) },
        { ALT: () => $.SUBRULE($.edgeComment) },
        { ALT: () => $.SUBRULE($.edgeSafeMustache) },
        { ALT: () => $.SUBRULE($.edgeMustache) },
        { ALT: () => $.SUBRULE($.edgeEscapedMustache) },
        { ALT: () => $.SUBRULE($.edgeTag) },
      ]);
    });

    $.RULE("element", () => {
      $.OR([
        {
          ALT: () => $.SUBRULE($.openingTag),
        },
        {
          ALT: () => $.SUBRULE($.closingTag),
        },
      ]);
    });

    $.RULE("openingTag", () => {
      $.CONSUME(TAG_OPEN);
      $.CONSUME(TAG_NAME);
      $.MANY(() => {
        $.OR([
          { ALT: () => $.SUBRULE($.edgeProps) },
          { ALT: () => $.SUBRULE($.attribute) },
        ]);
      });
      $.OR1([
        { ALT: () => $.CONSUME1(TAG_SLASH_CLOSE) },
        { ALT: () => $.CONSUME1(TAG_CLOSE) },
      ]);
    });

    $.RULE("attribute", () => {
      $.CONSUME(TAG_NAME);
      $.OPTION(() => {
        $.CONSUME(TAG_EQUALS);
        $.CONSUME(ATTVALUE_VALUE);
      });
    });

    $.RULE("closingTag", () => {
      $.CONSUME(TAG_OPEN);
      $.CONSUME(TAG_SLASH);
      $.CONSUME(TAG_NAME);
      $.CONSUME(TAG_CLOSE);
    });

    $.RULE("scriptlet", () => {
      $.CONSUME(SCRIPTLET);
    });

    $.RULE("htmlComment", () => {
      $.CONSUME(HTML_COMMENT);
    });

    $.RULE("htmlConditionalComment", () => {
      $.CONSUME(HTML_CONDITIONAL_COMMENT);
    });

    $.RULE("cdata", () => {
      $.CONSUME(CDATA);
    });

    $.RULE("dtd", () => {
      $.CONSUME(DTD);
    });

    $.RULE("scriptElement", () => {
      $.CONSUME(SCRIPT_OPEN);
      $.CONSUME(SCRIPT_BODY);
    });

    $.RULE("styleElement", () => {
      $.CONSUME(STYLE_OPEN);
      $.CONSUME(STYLE_BODY);
    });

    $.RULE("edgeComment", () => {
      $.CONSUME(EDGE_COMMENT);
    });

    $.RULE("edgeMustache", () => {
      $.CONSUME(EDGE_MUSTACHE);
    });

    $.RULE("edgeSafeMustache", () => {
      $.CONSUME(EDGE_SAFE_MUSTACHE);
    });

    $.RULE("edgeEscapedMustache", () => {
      $.CONSUME(EDGE_ESCAPED_MUSTACHE);
    });

    $.RULE("edgeTag", () => {
      $.CONSUME(EDGE_TAG);
    });

    $.RULE("edgeProps", () => {
      $.CONSUME(EDGE_PROPS);
    });

    this.performSelfAnalysis();
  }
}

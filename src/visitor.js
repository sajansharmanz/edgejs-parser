import { EdgeParser } from "./parser";

const parser = new EdgeParser();
const BaseVisitor = parser.getBaseCstVisitorConstructor();

export class EdgeVisitor extends BaseVisitor {
  #inlineTags = new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
    // Below are for SVGs
    "animateMotion",
    "animateTransform",
    "animate",
    "circle",
    "ellipse",
    "feGaussianBlur",
    "feDropShadow",
    "feOffset",
    "feBlend",
    "feColorMatrix",
    "feComposite",
    "feDisplacementMap",
    "feFlood",
    "feImage",
    "feMergeNode",
    "feMorphology",
    "fePointLight",
    "feSpotLight",
    "feTile",
    "feTurbulence",
    "image",
    "line",
    "mpath",
    "path",
    "polygon",
    "polyline",
    "rect",
    "set",
    "stop",
    "use",
    "view",
  ]);

  constructor() {
    super();
    this.validateVisitor();
  }

  #isInlineTag(tagName) {
    return this.#inlineTags.has(tagName);
  }

  document(ctx) {
    const start = ctx.content[0].startOffset;
    const end = ctx.content[ctx.content.length - 1].endOffset;
    return {
      type: "document",
      children: ctx.content.map((child) => this.visit(child)),
      start,
      end,
    };
  }

  content(ctx) {
    if (ctx.HTML_TEXT) {
      return {
        type: "htmlText",
        value: ctx.HTML_TEXT[0].image,
        start: ctx.HTML_TEXT[0].startOffset,
        end: ctx.HTML_TEXT[0].endOffset,
      };
    }

    if (ctx.LINE_BREAK) {
      return {
        type: "linebreak",
        value: ctx.LINE_BREAK[0].image,
        start: ctx.LINE_BREAK[0].startOffset,
        end: ctx.LINE_BREAK[0].endOffset,
      };
    }

    const node =
      ctx.element ||
      ctx.scriptlet ||
      ctx.htmlComment ||
      ctx.htmlConditionalComment ||
      ctx.cdata ||
      ctx.dtd ||
      ctx.scriptElement ||
      ctx.styleElement ||
      ctx.edgeComment ||
      ctx.edgeMustache ||
      ctx.edgeSafeMustache ||
      ctx.edgeEscapedMustache ||
      ctx.edgeTag ||
      ctx.htmlText;
    return this.visit(node);
  }

  element(ctx) {
    if (ctx.openingTag) {
      return this.visit(ctx.openingTag);
    } else if (ctx.selfClosingTag) {
      return this.visit(ctx.selfClosingTag);
    } else {
      return this.visit(ctx.closingTag);
    }
  }

  openingTag(ctx) {
    const tagName = ctx.TAG_NAME[0].image;

    const edgeSafeMustaches = ctx.edgeSafeMustache
      ? ctx.edgeSafeMustache.map((prop) => this.visit(prop))
      : [];

    const edgeMustaches = ctx.edgeMustache
      ? ctx.edgeMustache.map((prop) => this.visit(prop))
      : [];

    const edgeTagProps = ctx.edgeTagProp
      ? ctx.edgeTagProp.map((prop) => this.visit(prop))
      : [];

    const attributes = ctx.attribute
      ? ctx.attribute.map((attr) => this.visit(attr))
      : [];

    const comments = ctx.edgeComment
      ? ctx.edgeComment.map((comment) => this.visit(comment))
      : [];

    const start = ctx.TAG_NAME[0].startOffset;
    const end = ctx.TAG_NAME[0].endOffset;

    if (this.#isInlineTag(tagName) || ctx.TAG_SLASH_CLOSE) {
      return {
        type: "voidTag",
        tagName,
        edgeSafeMustaches,
        edgeMustaches,
        edgeTagProps,
        attributes,
        comments,
        start,
        end,
      };
    }

    return {
      type: "openingTag",
      tagName,
      edgeSafeMustaches,
      edgeMustaches,
      edgeTagProps,
      attributes,
      comments,
      start,
      end,
    };
  }

  attribute(ctx) {
    const attributeName = ctx.TAG_NAME[0].image;
    const attributeValue = ctx.ATTVALUE_VALUE?.[0]?.image?.trim();
    const start = ctx.TAG_NAME[0].startOffset;
    const end = ctx.ATTVALUE_VALUE
      ? ctx.ATTVALUE_VALUE[0].endOffset
      : ctx.TAG_NAME[0].endOffset;
    return { type: "attribute", attributeName, attributeValue, start, end };
  }

  closingTag(ctx) {
    const tagName = ctx.TAG_NAME[0].image;
    const start = ctx.TAG_OPEN[0].startOffset;
    const end = ctx.TAG_CLOSE[0].endOffset;

    if (this.#isInlineTag(tagName)) {
      return {
        type: "doNotPrint",
      };
    }

    return { type: "closingTag", tagName, start, end };
  }

  scriptlet(ctx) {
    const value = ctx.SCRIPTLET[0].image;
    const start = ctx.SCRIPTLET[0].startOffset;
    const end = ctx.SCRIPTLET[0].endOffset;
    return { type: "scriptlet", value, start, end };
  }

  htmlComment(ctx) {
    const value = ctx.HTML_COMMENT[0].image;
    const start = ctx.HTML_COMMENT[0].startOffset;
    const end = ctx.HTML_COMMENT[0].endOffset;
    return { type: "htmlComment", value, start, end };
  }

  htmlConditionalComment(ctx) {
    const value = ctx.HTML_CONDITIONAL_COMMENT[0].image;
    const start = ctx.HTML_CONDITIONAL_COMMENT[0].startOffset;
    const end = ctx.HTML_CONDITIONAL_COMMENT[0].endOffset;
    return { type: "htmlConditionalComment", value, start, end };
  }

  cdata(ctx) {
    const value = ctx.CDATA[0].image;
    const start = ctx.CDATA[0].startOffset;
    const end = ctx.CDATA[0].endOffset;
    return { type: "cdata", value, start, end };
  }

  dtd(ctx) {
    const value = ctx.DTD[0].image;
    const start = ctx.DTD[0].startOffset;
    const end = ctx.DTD[0].endOffset;
    return { type: "dtd", value, start, end };
  }

  scriptElement(ctx) {
    const value = ctx.SCRIPT_OPEN[0].image + ctx.SCRIPT_BODY[0].image;
    const start = ctx.SCRIPT_OPEN[0].startOffset;
    const end = ctx.SCRIPT_BODY[0].endOffset;
    return { type: "scriptElement", value, start, end };
  }

  styleElement(ctx) {
    const value = ctx.STYLE_OPEN[0].image + ctx.STYLE_BODY[0].image;
    const start = ctx.STYLE_OPEN[0].startOffset;
    const end = ctx.STYLE_BODY[0].endOffset;
    return { type: "styleElement", value, start, end };
  }

  edgeComment(ctx) {
    const value = ctx.EDGE_COMMENT[0].image;
    const start = ctx.EDGE_COMMENT[0].startOffset;
    const end = ctx.EDGE_COMMENT[0].endOffset;
    return { type: "edgeComment", value, start, end };
  }

  edgeMustache(ctx) {
    const value = ctx.EDGE_MUSTACHE[0].image;
    const start = ctx.EDGE_MUSTACHE[0].startOffset;
    const end = ctx.EDGE_MUSTACHE[0].endOffset;
    return { type: "edgeMustache", value, start, end };
  }

  edgeSafeMustache(ctx) {
    const value = ctx.EDGE_SAFE_MUSTACHE[0].image;
    const start = ctx.EDGE_SAFE_MUSTACHE[0].startOffset;
    const end = ctx.EDGE_SAFE_MUSTACHE[0].endOffset;
    return { type: "edgeSafeMustache", value, start, end };
  }

  edgeEscapedMustache(ctx) {
    const value = ctx.EDGE_ESCAPED_MUSTACHE[0].image;
    const start = ctx.EDGE_ESCAPED_MUSTACHE[0].startOffset;
    const end = ctx.EDGE_ESCAPED_MUSTACHE[0].endOffset;
    return { type: "edgeEscapedMustache", value, start, end };
  }

  edgeTag(ctx) {
    const value = ctx.EDGE_TAG[0].image;
    const start = ctx.EDGE_TAG[0].startOffset;
    const end = ctx.EDGE_TAG[0].endOffset;
    return { type: "edgeTag", value, start, end };
  }

  edgeTagProp(ctx) {
    const value = ctx.EDGE_TAG_PROP[0].image;
    const start = ctx.EDGE_TAG_PROP[0].startOffset;
    const end = ctx.EDGE_TAG_PROP[0].endOffset;
    return { type: "edgeTagProp", value, start, end };
  }
}

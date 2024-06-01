import { EdgeLexer } from "./lexer";
import { EdgeParser } from "./parser";
import { EdgeVisitor } from "./visitor";

const parser = new EdgeParser();
const visitor = new EdgeVisitor();

export default function parse(text) {
  const lexingResult = EdgeLexer.tokenize(text);

  parser.input = lexingResult.tokens;

  const cst = parser.document();

  if (parser.errors.length > 0) {
    throw new Error(
      `Parsing Errors Detected: ${JSON.stringify(parser.errors)}`,
    );
  }

  const ast = visitor.visit(cst);
  return ast;
}

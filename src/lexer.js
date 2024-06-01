import { Lexer } from "chevrotain";

import { lexerDefinition } from "./tokens";

export const EdgeLexer = new Lexer(lexerDefinition);

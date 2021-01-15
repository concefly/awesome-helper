import { Schema } from 'jsonschema';
import { Project, SourceFile, Type, Symbol, Node } from 'ts-morph';

function symbol2Type(sym: Symbol) {
  return sym.getTypeAtLocation(sym.getValueDeclarationOrThrow());
}

export class Ts2Schema {
  constructor(readonly tsConfigFilePath: string) {}

  private proj = new Project({ tsConfigFilePath: this.tsConfigFilePath });

  private type2Schema(type: Type, depth = 0): Schema {
    if (depth >= 9) return {};

    const title = type.getSymbol()?.getEscapedName();

    if (type.isString() || type.isStringLiteral()) return { title, type: 'string' };
    if (type.isNumber() || type.isNumberLiteral()) return { title, type: 'integer' };

    // class
    if (type.isClass()) {
      const sym = type.getSymbolOrThrow();
      const properties: any = {};

      sym.getMembers().forEach(mSym => {
        const mType = symbol2Type(mSym);

        properties[mSym.getEscapedName()] = this.type2Schema(mType, depth + 1);
      });

      return {
        title,
        type: 'object',
        properties,
      };
    }

    const callSignatures = type.getCallSignatures();
    if (callSignatures.length) {
      const fNode = type.getSymbolOrThrow().getValueDeclarationOrThrow();
      let decSchema!: Schema;

      if (Node.isMethodDeclaration(fNode)) {
        const decorators = fNode.getDecorators();
        if (decorators.length) {
          decSchema = {
            type: 'array',
            items: decorators.map(d => {
              const decExp = d.getCallExpressionOrThrow();

              return {
                title: d.getName(),
                type: 'object',
                properties: {
                  arguments: {
                    type: 'array',
                    items: decExp.getArguments().map(argNode => {
                      if (Node.isStringLiteral(argNode)) {
                        return { type: 'string', const: argNode.getText() } as Schema;
                      }
                      return {};
                    }),
                  },
                },
              } as Schema;
            }),
          };
        }
      }

      return {
        title,
        type: 'object',
        format: 'function',
        properties: {
          ...(decSchema && { decorators: decSchema }),
          signatures: {
            type: 'array',
            items: callSignatures.map(callSig => {
              return {
                type: 'object',
                properties: {
                  params: {
                    type: 'array',
                    items: callSig
                      .getParameters()
                      .map(p => symbol2Type(p))
                      .map(t => this.type2Schema(t, depth + 1)),
                  },
                  return: this.type2Schema(callSig.getReturnType(), depth + 1),
                },
              } as Schema;
            }),
          },
        },
      };
    }

    // promise
    if (type.getProperty('then') && type.getProperty('catch')) {
      return {
        type: 'object',
        format: 'promise',
        properties: {
          typeArguments: {
            type: 'array',
            items: type.getTypeArguments().map(argType => this.type2Schema(argType, depth + 1)),
          },
        },
      };
    }

    // any object
    if (type.isObject()) {
      const properties: any = {};

      type.getApparentProperties().forEach(ap => {
        const apt = ap.getTypeAtLocation(ap.getValueDeclarationOrThrow());
        properties[ap.getEscapedName()] = this.type2Schema(apt, depth + 1);
      });

      return {
        type: 'object',
        properties,
      };
    }

    return {};
  }

  private getSchemaOneFile(file: SourceFile) {
    const schema: Schema = {
      title: file.getFilePath().replace(process.cwd() + '/', ''),
      type: 'object',
      properties: {
        classes: {
          type: 'array',
          items: file.getClasses().map(cls => this.type2Schema(cls.getType())),
        },
        functions: {
          type: 'array',
          items: file.getFunctions().map(fn => this.type2Schema(fn.getType())),
        },
      },
    };

    return schema;
  }

  getSchema(pattern: string) {
    const files = this.proj.getSourceFiles(pattern);

    const schema: Schema = {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: files.map(file => this.getSchemaOneFile(file)),
        },
      },
    };

    return schema;
  }
}

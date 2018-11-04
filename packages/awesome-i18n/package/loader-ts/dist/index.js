"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const walk_1 = require("./walk");
const ts = require("typescript");
class Loader {
    constructor(config = {}) {
        this.config = Object.assign({ plugins: { jsx: true } }, config);
    }
    parseCallExpression(node) {
        const method = node.expression.getText();
        if (['__', '__define'].indexOf(method) >= 0) {
            const [key, description] = node.arguments;
            // 只提取 key 为字符串字面量的 token
            const normalizedKey = key && ts.isStringLiteral(key) && key.getText().replace(/^"|^'|"$|'$/g, '');
            const normalizedDesc = description &&
                ts.isStringLiteral(description) &&
                description.getText().replace(/^"|^'|"$|'$/g, '');
            if (normalizedKey) {
                const re = {
                    mark: {
                        key: normalizedKey,
                    },
                };
                if (normalizedDesc) {
                    re.mark.description = normalizedDesc;
                }
                return re;
            }
        }
    }
    parse(code, filePath) {
        const source = (this.ast = ts.createSourceFile(filePath, code, ts.ScriptTarget.ES2015, 
        /*setParentNodes */ true));
        const markList = [];
        walk_1.walk(source, node => {
            if (ts.isCallExpression(node)) {
                const r = this.parseCallExpression(node);
                if (r)
                    markList.push(r);
            }
        });
        return markList;
    }
}
exports.default = Loader;

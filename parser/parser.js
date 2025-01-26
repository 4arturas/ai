const TOKENS = {
    number: 'number',
    identifier: 'identifier',
    operator: 'operator',
    assignment: 'assignment',
    type: 'type',
    keyword: 'keyword',
    separator: 'separator',
    boolean: 'boolean'
};

const NODE_TYPES = {
    Literal: 'Literal',
    Identifier: 'Identifier',
    BinaryExpression: 'BinaryExpression',
    Assignment: 'Assignment',
    FunctionCall: 'FunctionCall',
    Type: 'Type',
    Boolean: 'Boolean'
};

const OPERATORS = ['+', '-', '*', '/', '(', ')'];
const RELATIONAL_OPERATORS = ['>', '<', '>=', '<=', '==', '!='];

class ASTNode {
    constructor(type, value = null, left = null, right = null, args = null) {
        this.type = type;
        this.value = value;
        this.left = left;
        this.right = right;
        this.args = args;
    }
}

function parseExpression(expression) {
    const tokens = tokenize(expression);
    const ast = buildAST(tokens);
    return ast;
}

function tokenize(expression) {
    const tokens = [];
    let current = 0;

    while (current < expression.length) {
        let char = expression[current];

        if (char === ' ' || char === '\t' || char === '\n' || char === ';') {
            current++;
            continue;
        }

        if (OPERATORS.includes(char)) {
            tokens.push({ type: TOKENS.operator, value: char });
            current++;
            continue;
        }

        if (char === '=') {
            if (expression[current + 1] === '=') {
                tokens.push({ type: TOKENS.boolean, value: '==' });
                current += 2;
            } else if (expression[current + 1] === '>') {
                tokens.push({ type: TOKENS.boolean, value: '>=' });
                current += 2;
            } else {
                tokens.push({ type: TOKENS.assignment, value: char });
                current++;
            }
            continue;
        }

        if (char >= '0' && char <= '9') {
            let value = '';
            while (char >= '0' && char <= '9' && current < expression.length) {
                value += char;
                char = expression[++current];
            }
            tokens.push({ type: TOKENS.number, value });
            continue;
        }

        if (char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z' || char === '_') {
            let value = '';
            while ((char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z' || char === '_' || char >= '0' && char <= '9') && current < expression.length) {
                value += char;
                char = expression[++current];
            }
            tokens.push({ type: TOKENS.identifier, value });
            continue;
        }

        if (char === '(' || char === ')') {
            tokens.push({ type: TOKENS.separator, value: char });
            current++;
            continue;
        }

        if (['>', '<', '!'].includes(char)) {
            if (expression[current + 1] === '=') {
                tokens.push({ type: TOKENS.boolean, value: char + '=' });
                current += 2;
            } else {
                tokens.push({ type: TOKENS.boolean, value: char });
                current++;
            }
            continue;
        }

        throw new Error(`Unexpected character: ${char}`);
    }

    return tokens;
}

function buildAST(tokens) {
    let current = 0;

    function walk() {
        let token = tokens[current];

        function parsePrimary() {
            token = tokens[current];

            if (token.type === TOKENS.number) {
                current++;
                return new ASTNode(NODE_TYPES.Literal, token.value);
            }

            if (token.type === TOKENS.identifier) {
                current++;
                return new ASTNode(NODE_TYPES.Identifier, token.value);
            }

            if (token.value === '(') {
                current++;
                let node = walk();
                current++;
                return node;
            }

            throw new Error(`Unexpected token: ${token.value}`);
        }

        function parseMultiplicative() {
            let left = parsePrimary();
            token = tokens[current];

            while (token && ['*', '/'].includes(token.value)) {
                let operator = token.value;
                current++;
                let right = parsePrimary();
                left = new ASTNode(NODE_TYPES.BinaryExpression, operator, left, right);
                token = tokens[current];
            }

            return left;
        }

        function parseAdditive() {
            let left = parseMultiplicative();
            token = tokens[current];

            while (token && ['+', '-'].includes(token.value)) {
                let operator = token.value;
                current++;
                let right = parseMultiplicative();
                left = new ASTNode(NODE_TYPES.BinaryExpression, operator, left, right);
                token = tokens[current];
            }

            return left;
        }

        function parseRelational() {
            let left = parseAdditive();
            token = tokens[current];

            while (token && RELATIONAL_OPERATORS.includes(token.value)) {
                let operator = token.value;
                current++;
                let right = parseAdditive();
                left = new ASTNode(NODE_TYPES.Boolean, operator, left, right);
                token = tokens[current];
            }

            return left;
        }

        return parseRelational();
    }

    function parseFunctionCall() {
        let functionName = tokens[current].value;
        current++; // Skip the function name
        current++; // Skip the opening parenthesis
        let args = [];
        while (tokens[current]?.value !== ')') {
            args.push(walk());
            if (tokens[current]?.value === ',') {
                current++; // Skip the comma
            }
        }
        current++; // Skip the closing parenthesis
        return new ASTNode(NODE_TYPES.FunctionCall, functionName, null, null, args);
    }

    let ast = [];
    while (current < tokens.length) {
        let token = tokens[current];

        if (token.type === TOKENS.identifier && tokens[current + 1]?.type === TOKENS.identifier && tokens[current + 2]?.type === TOKENS.assignment) {
            let typeNode = new ASTNode(NODE_TYPES.Type, tokens[current].value);
            current++;
            let identifierNode = new ASTNode(NODE_TYPES.Identifier, tokens[current].value);
            current++;
            current++; // Skip the assignment token
            let expressionNode = walk();
            ast.push(new ASTNode(NODE_TYPES.Assignment, '=', typeNode, new ASTNode(NODE_TYPES.BinaryExpression, '=', identifierNode, expressionNode)));
        } else if (token.type === TOKENS.identifier && tokens[current + 1]?.value === '(') {
            ast.push(parseFunctionCall());
        } else {
            ast.push(walk());
        }
    }

    return ast;
}

function printAST(node, indent = 0) {
    let prefix = ' '.repeat(indent);
    console.log(`${prefix}${node.type}: ${node.value}`);
    if (node.left) printAST(node.left, indent + 2);
    if (node.right) printAST(node.right, indent + 2);
    if (node.args) {
        node.args.forEach(arg => printAST(arg, indent + 2));
    }
}

function evaluate(ast) {
    const environment = {};

    function evalNode(node) {
        if (node.type === NODE_TYPES.Literal) {
            return parseInt(node.value, 10);
        }

        if (node.type === NODE_TYPES.Identifier) {
            return environment[node.value];
        }

        if (node.type === NODE_TYPES.BinaryExpression) {
            const left = evalNode(node.left);
            const right = evalNode(node.right);
            switch (node.value) {
                case '+': return left + right;
                case '-': return left - right;
                case '*': return left * right;
                case '/': return left / right;
                default: throw new Error(`Unknown operator: ${node.value}`);
            }
        }

        if (node.type === NODE_TYPES.Boolean) {
            const left = evalNode(node.left);
            const right = evalNode(node.right);
            switch (node.value) {
                case '>': return left > right;
                case '<': return left < right;
                case '>=': return left >= right;
                case '<=': return left <= right;
                case '==': return left === right;
                case '!=': return left !== right;
                default: throw new Error(`Unknown operator: ${node.value}`);
            }
        }

        if (node.type === NODE_TYPES.Assignment) {
            const value = evalNode(node.right.right);
            environment[node.right.left.value] = value;
            return value;
        }

        if (node.type === NODE_TYPES.FunctionCall) {
            if (node.value === 'print') {
                const arg = evalNode(node.args[0]);
                console.log(arg);
                return arg;
            }
            throw new Error(`Unknown function: ${node.value}`);
        }

        throw new Error(`Unknown node type: ${node.type}`);
    }

    ast.forEach(node => evalNode(node));
}

const expression = `
numeric sum =    2 * (3 + 5    );
print(sum);
bool myBoolean = 1 < 2;
print(myBoolean);
bool myBoolean2 = 1 >= 2;
print(myBoolean2);
`;
const ast = parseExpression(expression);
ast.forEach(node => printAST(node));
evaluate(ast);
module.exports = (file, api, options) => {
    const j = api.jscodeshift;
    const root = j(file.source);

    // We have to add "use strict" for node to play nice
    // Taken from https://github.com/cpojer/js-codemod/blob/master/transforms/use-strict.js
    const hasStrictMode = body =>
        body.some(
            statement => j.match(statement, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 'use strict',
                },
            }
        )
    );

    const withComments = (to, from) => {
        to.comments = from.comments;
        return to;
    };

    const createUseStrictExpression = () => (
        j.expressionStatement(
            j.literal('use strict')
        )
    );

    // Convert prototype style function classes into new es6 syntax
    const paths = {};

    const createMethodDefinition = (identifier, fn) => {
        return j.methodDefinition(
            "method",
            identifier,
            j.functionExpression(
                null, fn.params, fn.body
            )
        )
    };

    const hasModifiedFile = root
    // Find all function declarations in the document
    .find(j.FunctionDeclaration)
    // Filter to only contain methods with names
    .filter(path => (
        path.value.id &&
        path.value.id.type === "Identifier"
    ))
    // Only select methods that have upper case leading character
    // This is usually a sign that this is a class
    .filter(path => {
        const char = path.value.id.name[0];
        return char === char.toUpperCase();
    })
    // For each identified function,
    // transform into a class definition
    // and transform the named function into the constructor
    // and add it to our class definition paths
    .forEach(path => {
        const className = path.value.id.name;
        paths[className] = paths[className] || {};
        j(path).replaceWith(
            withComments(j.classDeclaration(
                path.value.id,
                j.classBody([
                    createMethodDefinition(
                        j.identifier('constructor'),
                        path.value
                    )
                ])
            ), path.value)
        )
        paths[className] = path;
    })
    .size() > 0;

    root
    // Find all assignments in the document
    .find(j.AssignmentExpression, {
        left: {
            // that assigns to a member
            type: "MemberExpression"
        }
    })
    // right-hand assignment can be either a CallExpression or a FunctionExpression
    .filter(path => {
        return ["CallExpression", "FunctionExpression"].includes(path.value.right.type)
    })
    // Filter to only contain members that assign to the prototype
    .filter(path => {
        return (
            path.value.left.object &&
            path.value.left.object.property &&
            path.value.left.object.property.name === "prototype"
            );
    })
    // For all identified assignments
    // transform into a method on the relevant class definition
    // and remove the function from the current path
    .forEach(path => {
        const className = path.value.left.object.object.name;
        const classPath = paths[className];
        const classBody = classPath.value.body.body;
        const classMethodName = path.value.left.property;
        const classMethodFunction = path.value.right.type === "CallExpression" ?
            path.value.right.callee.object
            : path.value.right;
        classBody.push(
            withComments(createMethodDefinition(
                classMethodName,
                classMethodFunction
            ), path.parentPath.value)
        );
        j(path).remove();
    })

    if (hasModifiedFile) {
        const body = root.get().value.program.body;
        if (!body.length) {
            return null;
        }

        if (!hasStrictMode(body)) {
            body.unshift(withComments(createUseStrictExpression(), body[0]));
            body[0].comments = body[1].comments;
            delete body[1].comments;
        }
    }

    return root.toSource();
};
# Migration Guide to ES2015

Stuff to migrate:

* from prototypical inheritance to `class` sugar
* from `require('...')` to `import`, `export` (`default`)
* to proper utility exports
* to lodash-es (lodash v4)

## to `class`

Use [jscodeshift]():

```
jscodeshift lib/**/*.js -t proto-to-cls.js
jscodeshift test/**/*.js -t proto-to-cls.js
jscodeshift index.js -t proto-to-cls.js
```

## to `import`, `export` (`default`)

*   Replace
    ```
    (var\s+|\s+)([^\s]+) = require\('([^']+)'\)(,|;)\n
    ```
    with
    ```
    import $2 from '$3';\n`
    ```

# to lodash-es

*   Replace
    ```
    'lodash/[^/]+/([^']+)'
    ```
    with
    ```
    'lodash/$1'
    ```

*   Replace `lodash/any` with `lodash/some`
*   Replace `lodash/unique` with `lodash/uniq`

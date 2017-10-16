# Collecting ES2015 spike results

Test app is [Gitter](https://github.com/philippfromme/gitter) + [Gitter Demo](https://github.com/philippfromme/gitter-demo).
Use `ES2015` version of [diagram-js](https://github.com/bpmn-io/diagram-js).


## Results

### Bundling

Results for bundling [`Gitter`](https://github.com/philippfromme/gitter/blob/master/src/Gitter.js), with and without minification using `UglifyJS`.

#### Specs

* `npm run build` bundles the file to `dist/gitter.js`
* `npm run minify` minifies the file to `dist/gitter.min.js`
* Bundle exposes `Gitter` on window (UMD build).


#### Size

| bundler | bundled | minified | minified + gzipped |  
|:---|:---|:---|:---|
| [webpack@3 + ES6 + module concat + lodash optimizer + babel `{ modules: false }`](https://github.com/philippfromme/gitter/tree/ES2015) | 3.0M +0% | 1.5M +0% | 340K __-2%__ |
| [webpack@3 + ES6 + module concat + lodash optimizer](https://github.com/philippfromme/gitter/tree/ES2015) | 3.1M +3% | 1.6M +6% | 344K __+0%__ |
| webpack@3 + ES6 | 3.3M +10% | 1.6M +6% | 352K +2% |
| [webpack@2 + ES6](https://github.com/philippfromme/gitter/tree/ES2015-webpack) | 3.3M +10% | 1.6M +6% | 352K +2% |
| webpack@3 + ES5 + module concat + lodash optimizer | 3.0M __+0%__| 1.5M __+0%__ | 344K __+0%__ |
| webpack@3 + ES5                 | 3.2M +7% | 1.6M +6%| 348K +1% |
| [browserify + ES6](https://github.com/philippfromme/gitter/tree/ES2015-browserify)              | 3.3M +10%| 1.7M +13%| 352K +2% |
| browserify + ES5              | 3.3M +10% | 1.7M +13% | 360K +4% |
| [rollup + ES6](https://github.com/philippfromme/gitter/tree/ES2015-rollup)                  | 3.0M __+0%__ | 1.5M __+0%__ | 348K __+1%__ |

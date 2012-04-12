# connect middleware for [requirejs optimizer](https://github.com/jrburke/r.js)

This module is just for development. Don't use in production. It's insanely inefficient to use in production.

## Benefit

the benefit using this middleware is quite simeple. Rather than doing like

```html
<!-- use main-built.js in production -->
<!-- <script src='/javascripts/libs/require.js' data-main='/javascripts/main-built.js'></script> -->
<script src='/javascripts/libs/require.js' data-main='/javascripts/main.js'></script>
```

Let's go simple with a single line of code

`<script src='/javascripts/libs/require.js' data-main='/javascripts/main-built.js'></script>`

## Example

The following code will listen `./public/javascripts/main-built.js`

    var connentRjs = require('connect-rjs');

    app.use(connectRjs({
      src: __dirname + '/public',
      baseUrl: '/javascripts',
      name: 'main'
    }));

You can use [minimatch](https://github.com/isaacs/minimatch) to specify `name`.

    app.use(connectRjs({
      src: __dirname + '/public',
      baseUrl: '/javascripts',
      name: 'views/**/main'
    }));

will match

* ./public/javascripts/views/home/main-built.js
* ./public/javascripts/views/about/main-built.js
* ./public/javascripts/views/tos/main-built.js
* ./public/javascripts/views/any_string/main-built.js

You can also pass Array of options.

    app.use(connectRjs([
      {
        src: __dirname + '/public',
        baseUrl: '/javascripts',
        name: 'models/main'
      },
      {
        src: __dirname + '/public',
        baseUrl: '/javascripts',
        name: 'views/**/main'
      }
    ]));

Or, you can pass second argument as defaults option

    app.use(connectRjs([
      { name: 'models/main' },
      { name: 'views/**/main' }
    ],{
        src: __dirname + '/public',
        baseUrl: '/javascripts'
      }
    ));

Since this module is for development, the configure is like this in express app.

    app.configure(function(){
      app.set('view engine', 'jade');
      app.use(express.bodyParser());
      app.use(express.cookieParser('fooo'));
      app.use(express.session());
      app.use(express.methodOverride());
    });
    
    app.configure('development', function(){
      app.use(require('connect-rjs')([
        { name: 'model/main' },
        { name: 'collection/main }'
        { name: 'views/**/main }'
      ],{
        baseUrl: '/javascripts'
        src: __dirname + '/public'
      }
    ));
    
    app.configure(function(){
      app.use(app.router);
      app.use(express.static(__dirname + '/public'));
    });

## Options

*  all options are passing to `requirejs.optimize` unless it's connect-rjs specific options. For details [r.js options](https://github.com/jrburke/r.js/blob/master/build/example.build.js)
* `optimize` : `none` by default. No uglify by default since this module is just for development.

### connect-rjs specific options

* `suffix` : `-built.js` by defaults.
* `src` : required. In express application, it'll be `__dirname + '/public'`;


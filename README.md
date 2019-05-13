@expresso/app
---

> Basic boilerplate as a library that creates an express instance and sets common middlewares up

- [@expresso/app](#expressoapp)
- [What is Expresso](#what-is-expresso)
  - [What does Expresso include](#what-does-expresso-include)
- [Getting Started](#getting-started)
  - [The config object](#the-config-object)
  - [Option object](#option-object)

## What is Expresso

Expresso is an Express wrapper. It contains several pre-built configurations which allows the developer to stop thinking about starter boilerplates and start thinking about routes and logic.

### What does Expresso include

- [JWT Authentication](https://github.com/auth0/express-jwt#readme)
- [Morgan](https://www.npmjs.com/package/morgan)
- [Deep Trace](https://github.com/deep-trace/nodejs-plugins/tree/master/packages/deeptrace-express)
- User Behalf headers (`x-on-behalf-of` headers become `req.onBehalfOf`)
- [CORS](https://github.com/expressjs/cors#readme)
- [Body Parser](https://www.npmjs.com/package/body-parser)
- [Helmet](https://helmetjs.github.io/)
- [JWKS RSA](https://github.com/auth0/node-jwks-rsa)
- [Debug](https://github.com/visionmedia/debug)


## Getting Started

Expresso exposes a function, this functions receives another function with two arguments, the first argument is an Express app and the second is a configuration object. Then it returns a factory function which will receive an `options` object and a string containing your current environment name (e.g: `production`):

```ts
import { Express } from 'express'
import { app, IExpressoAppConfig } from '@expresso/app'

const apiFactory = app((app: Express, config: IExpressoAppConfig) => {
  app.post('/your-path/:with-params', middleware, middleware, middleware)
})

apiFactory(options, environment)
  .then(app => app.listen(8080))
```

### The config object

This object is an object containing all user configurations you might want to set. It can be anything, and it'll be passed to your app inside the function.

```ts
// app-config.ts
import { IExpressoAppConfig } from '@expresso/app'

export interface IAppConfig extends IExpressAppConfig {
  myProp: {
    myValue: string
  }
}

export default {
  /** other config options **/
  myProp: {
    myValue: process.env.MY_VALUE
  }
}
```

```ts
import { Express } from 'express'
import { app, IExpressoAppConfig } from '@expresso/app'

const apiFactory = app((app: Express, config: IAppConfig) => {
  const myUsefulConfig = config.myProp.myValue

  app.post('/your-path/:with-params', middleware, middleware, middleware(myUsefulConfig))
})

apiFactory(options, environment)
  .then(app => app.listen(8080))
```

### Option object

The option object is a simple object containing the application configuration that is gonna be passed to the whole express application:

- `name`: Is the name of your application. It'll be used as the default name for logging
  - Type: *string*
  - Default: `process.env.APP_NAME` || `process.env.npm_package_name` || `app`
- `version`: The version of your app
  - Type: *string*
  - Default: `process.env.GIT_RELEASE`
- `server` **(Required if you are using the [built-in server](#built-in-server))**: Webserver configuration options
  - Type: *Object*
  - Properties:
    - `binding.ip`: IP on which the server will be bound to
      - Type: *string*
      - Default: `process.env.SERVER_BINDING_IP` || `0.0.0.0`
    - `binding.port`: Port to bind the server to
      - Type: *number*
      - Default: `process.env.SERVER_BINDING_PORT` || `3000`
- `deeptrace`: Deeptrace configuration object
  - Type: *object*
  - Properties:
    - `dsn` **(Required if using Deeptrace)**: Deeptrace API URL
      - Type: *string*
      - Default: `undefined`, it'll error if you try to use Deeptrace without setting it
    - `timeout`: Timeout before Deeptrace gives up on registering the sent request
      - Type: *number*
      - Default: `process.env.DEEPTRACE_TIMEOUT` || `3000`
    - `tags`: Tags that will be applied to each registered request
      - Type: *Object*
      - Default:
        - `environment`: Environment string passed as mentioned above
        - `service`: `process.env.DEEPTRACE_TAGS_SERVICE` || `name` property on this same object
        - `commit`: `process.env.DEEPTRACE_TAGS_COMMIT` || `process.env.GIT_COMMIT`
        - `release`: `process.env.DEEPTRACE_TAGS_RELEASE` || `process.env.GIT_RELEASE`
- `morgan`: Morgan configuration object
  - Type: *Object*
  - Default:
    - `format`: `':method :url :status :: :response-time ms :: :res[deeptrace-id]'`
- `cors`: CORS configuration object
  - Type: *Object*
  - Default:
    - `origin`: `*`
    - `methods`: `['GET', 'POST', 'PUT', 'PATCH', 'DELETE']`
    - `preflightContinue`: `false`
    - `optionsSuccessStatus`: `204`
- `bodyParser`: BodyParser configuration Object
  - Type: *Object*
  - Default:
    - `json`: `true` (controls if BodyParser will accept JSON payloads)
    - `urlEncoded`: `true` (controls if BodyParser will accept URL Encoded payloads)
  - **Important**: Both `json` and `urlEncoded` properties can accept a `boolean` or their respective options following the BodyParser guide itself

Any other keys will be **ignored** by expresso, but they'll be passed to your application anyway; all configs can be overriden by passing an object with the same keys but different values.

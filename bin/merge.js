const fs = require('fs')
const path = require('path')
const commander = require('commander')
const package = require('../package.json')

commander
  .usage('-r <req-config-path> -s <schema-path> -o <output-path>')
  .version(package.version)
  .option('-r, --req-config [req-config-path]', 'request config path[path.ts]', 'path.js')
  .option('-s, --schema [schema-path]', 'schema file path [schema.json]', 'schema.json')
  .option('-o, --output [output-path]', 'output file path [swagger.json]', 'swagger.json')
  .parse(process.argv)

const defaultSchema = require('../basic-swagger-config')

const reqPaths = require(path.resolve(commander.reqConfig))
const typeSchema = require(path.resolve(commander.schema))

const schema = Object.assign(defaultSchema, {
  paths: reqPaths,
  definitions: typeSchema ? typeSchema.definitions : { }
})

fs.writeFileSync(
  path.resolve(path.resolve(commander.output)),
  JSON.stringify(schema, null, 2),
  { encoding: 'utf-8', flag: 'w' }
)

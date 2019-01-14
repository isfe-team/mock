const fs = require('fs')
const path = require('path')
const commander = require('commander')
const package = require('../package.json')
// @see https://github.com/YousefED/typescript-json-schema
const TJS = require('typescript-json-schema')

// now, no options
commander
  .usage('-s <source-path> -c <config-path> -o <output-path>')
  .version(package.version)
  .option('-s, --source [source-path]', 'source file path [index.ts]', 'index.ts')
  .option('-c, --config [config-path]', 'configuration file path [tsconfig.json]', 'tsconfig.json')
  .option('-o, --output [output-path]', 'output file path [schema.json]', 'schema.json')
  .parse(process.argv)

module.exports = TJS

if (require.main === module) {
  const config = require(path.resolve(commander.config))
  const program = TJS.getProgramFromFiles([path.resolve(commander.source)], config.compileOptions, '.')

  const schema = TJS.generateSchema(program, '*')

  // require('json-schema-to-openapi-schema')(schema)
  fs.writeFileSync(path.join(commander.output), JSON.stringify(schema, null, 2), { encoding: 'utf-8' })
  return
}

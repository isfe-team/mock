const fs = require('fs')
const path = require('path')
const defaultSchema = require('../basic-swagger-config')
const reqPaths = require('./path')
const typeSchema = require('./schema')

const schema = Object.assign(defaultSchema, {
  paths: reqPaths,
  definitions: typeSchema ? typeSchema.definitions : { }
})

fs.writeFileSync(path.resolve('swagger.json'), JSON.stringify(schema, null, 2), { encoding: 'utf-8', flag: 'w' })

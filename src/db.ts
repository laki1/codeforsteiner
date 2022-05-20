import knex from 'knex'
import knexFirebirdDialect from 'knex-firebird-dialect'

export default knex({
  client: knexFirebirdDialect,
  connection: {
    host: '127.0.0.1',
    database: '/firebird/data/tabunis.fdb',
    user: 'SYSDBA',
    password: 'masterkey',
    lowercase_keys: true,
    port: 3050,
    debug: true,
  },
})

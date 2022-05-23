import knex from "knex";
import knexFirebirdDialect from "knex-firebird-dialect";
import knexMariaDbDialect from "knex-mariadb";
import { DEBUG, DB }  from "~/config.js";

let config = {};

if (DB.TYPE === "mariadb") {
  config = {
    client: knexMariaDbDialect,
    connection: {    
      host:     DB.SERVER,
      port:     DB.PORT,
      user:     DB.USER,
      password: DB.PASSWORD,
      database: DB.DATABASE_CONNECTION_STRING
    },
    debug: DEBUG
  };
} else {
  //default: firebird
  config = {
    client: knexFirebirdDialect,
    connection: {
      host:     DB.SERVER,
      port:     DB.PORT,
      database: DB.DATABASE_CONNECTION_STRING,
      user:     DB.USER,
      password: DB.PASSWORD,
      lowercase_keys: true,      
      debug: DEBUG
    }
  }; 
}

export default knex( config );

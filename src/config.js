//common
export const DEBUG = !!import.meta.env.VITE_DEUG || false;

//DB
export const DB = {
    TYPE: import.meta.env.VITE_DB_TYPE || "firebird",
    SERVER: import.meta.env.VITE_DB_SERVER,
    PORT: import.meta.env.VITE_DB_PORT,
    USER: import.meta.env.VITE_DB_USER,
    PASSWORD: import.meta.env.VITE_DB_PASSWORD,
    DATABASE_CONNECTION_STRING: import.meta.env.VITE_DB_DATABASE_CONNECTION_STRING,
    TABLE_DGA: import.meta.env.VITE_DB_TABLE_DGA
};

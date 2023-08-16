import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const connection = await open({
    filename: process.env.DATABASE_DB_NAME,
    driver: sqlite3.Database
});

export default connection;

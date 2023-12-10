import mysql from 'mysql'

export const databseConfiguration = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: '',
    database: 'accredian'
})

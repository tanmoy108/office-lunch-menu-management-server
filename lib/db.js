const Pool = require('pg').Pool
const pool = new Pool({
  user: 'office_lunch',
  host: 'localhost',
  database: 'office',
  password: 'arya46p1',
  port: 5432,
})

module.exports = pool;
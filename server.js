const express = require('express');
const app = express();
const pg = require('pg');
const client = new pg.Client(
    process.env.DATABASE_URL || 'postgres://localhost/acme_hr_directory'
  );
  const port = process.env.PORT || 3000;


//deployment routes

app.use(express.json());
app.use(require('morgan')('dev'));

//crud/express routes

//database connection

const init = async () => {
    await client.connect();

    //creating department and employee table 
    let SQL = `
        DROP TABLE IF EXISTS departments;
        DROP TABLE IF EXISTS employees;
        CREATE TABLE departments(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );
        CREATE TABLE employees(
            id SERIAL PRIMARY KEY,
            created_at TIMESTAMP DEFAULT now(),
            updated_at TIMESTAMP DEFAULT now(),
            department_id INTEGER REFERENCES departments(id) NOT NULL
        );
    `
    await client.query(SQL);
    console.log("Confirmation of table creation.");
    SQL = ``;
    await client.query(SQL);
    console.log("Confirmation of seeded data.");

    //establishing port
    app.listen(port, () => console.log(`Now listening on port ${port}.`));
}

//invocation
init();
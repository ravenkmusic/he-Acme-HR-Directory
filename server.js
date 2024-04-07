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
        DROP TABLE IF EXISTS employees;
        DROP TABLE IF EXISTS departments;
        CREATE TABLE departments(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );
        CREATE TABLE employees(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT now(),
            updated_at TIMESTAMP DEFAULT now(),
            department_id INTEGER REFERENCES departments(id) NOT NULL
        );
    `
    await client.query(SQL);
    console.log("Confirmation of table creation.");
    SQL = `
        INSERT INTO departments(name) VALUES('SUPPORT');
        INSERT INTO departments(name) VALUES('MARKETING');
        INSERT INTO departments(name) VALUES('FINANCE');
        INSERT INTO departments(name) VALUES('ADMINISTRATION');

        INSERT INTO employees(name, department_id) VALUES('Jane Doe', (SELECT id FROM departments WHERE name='ADMINISTRATION'));
        INSERT INTO employees(name, department_id) VALUES('Emily Frost', (SELECT id FROM departments WHERE name='MARKETING'));
        INSERT INTO employees(name, department_id) VALUES('Daniel Ford', (SELECT id FROM departments WHERE name='FINANCE'));
        INSERT INTO employees(name, department_id) VALUES('Francesco Vivaldi', (SELECT id FROM departments WHERE name='MARKETING'));
        INSERT INTO employees(name, department_id) VALUES('Donovan Edwards', (SELECT id FROM departments WHERE name='ADMINISTRATION'));
        INSERT INTO employees(name, department_id) VALUES('Lee Roman', (SELECT id FROM departments WHERE name='MARKETING'));
        INSERT INTO employees(name, department_id) VALUES('Erykah Scott', (SELECT id FROM departments WHERE name='SUPPORT'));
        INSERT INTO employees(name, department_id) VALUES('Shawn Reynolds', (SELECT id FROM departments WHERE name='MARKETING'));
        INSERT INTO employees(name, department_id) VALUES('Nicholas Gurr', (SELECT id FROM departments WHERE name='FINANCE'));
        INSERT INTO employees(name, department_id) VALUES('Tonya White', (SELECT id FROM departments WHERE name='SUPPORT'));
        INSERT INTO employees(name, department_id) VALUES('Ray Johnson', (SELECT id FROM departments WHERE name='FINANCE'));
        INSERT INTO employees(name, department_id) VALUES('Oswald Stark', (SELECT id FROM departments WHERE name='ADMINISTRATION'));
        INSERT INTO employees(name, department_id) VALUES('Eduardo Perez', (SELECT id FROM departments WHERE name='SUPPORT'));
        INSERT INTO employees(name, department_id) VALUES('Muhammed Ordo', (SELECT id FROM departments WHERE name='MARKETING'));
    `;
    await client.query(SQL);
    console.log("Confirmation of seeded data.");

    //establishing port
    app.listen(port, () => console.log(`Now listening on port ${port}.`));
}

//invocation
init();
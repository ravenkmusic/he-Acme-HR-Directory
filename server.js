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

//get departments

app.get('/api/departments', async (req, res, next)=> {
    try {
        const SQL = `
            SELECT * from departments
        `;
        const response = await client.query(SQL);
        res.send(response.rows);
    } catch (ex) {
        next(ex);
    }
});

//get employees

app.get('/api/employees', async (req, res, next) => {
    try {
        const SQL = `
            SELECT * from employees
        `;
        const response = await client.query(SQL);
        res.send(response.rows);
    } catch (error) {
        next(error);
    }
});

//add employee

app.post('/api/employees', async (req, res, next) => {
    try {
        const SQL = `
            INSERT INTO employees(name, department_id)
            VALUES($1, $2)
            RETURNING *
        `;
        const response = await client.query(SQL, [req.body.name, req.body.department_id]);
        res.send(response.rows[0]);
    } catch (error) {
        next(error);
    }
});

//update employee
app.put('/api/employees', async (req, res, next) => {
    try {
        const SQL = `
            UPDATE employees
            SET name = $1, department_id = $2, updated_at= now()
            WHERE id = $3 RETURNING *
        `;
        const response = await client.query(SQL, [req.body.name, req.body.department_id, req.params.id]);
        res.send(response.rows[0]);
    } catch (error) {
        next(error)
    }
});

//delete employee
app.delete('/api/employees/:id', async (req, res, next) => {
    try {
        const SQL = `
            DELETE from employees
            where id = $1
        `;
        const response = await client.query(SQL, [req.params.id]);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
});

//error route
app.use((error, req, res, next) => {
    res.status(res.status || 500).send({ error: error });
});

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
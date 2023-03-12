const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
app.use(cors()); // Add this line to enable CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// const pool = new Pool({
//   user: 'mea',
//   host: 'dpg-cg6e1kpmbg5ab7kbf700-a',
//   database: 'mea_acc_db',
//   password: '2WZUd641PAuPIl3H5ALEkK4Wiot5fK2M',
//   port: 5432,
// });

const pool = new Pool({
  connectionString: 'postgres://mea:2WZUd641PAuPIl3H5ALEkK4Wiot5fK2M@dpg-cg6e1kpmbg5ab7kbf700-a.singapore-postgres.render.com/mea_acc_db',
  ssl: {
    rejectUnauthorized: false
  }
});

// Create the Form_Responses table if it doesn't exist
pool.query(`
  CREATE TABLE IF NOT EXISTS public."Form_Responses" (
    "Id" SERIAL PRIMARY KEY,
    "Name" VARCHAR(255) NOT NULL,
    "Gender" VARCHAR(10) NOT NULL,
    "Email_id" VARCHAR(255) NOT NULL,
    "phone_no" BIGINT NOT NULL,
    "From_Date" DATE NOT NULL,
    "To_Date" DATE NOT NULL
  );
`).then(res => {
  console.log('Form_Responses table created or already exists');
}).catch(err => {
  console.error(err);
});

app.get("/", (req,res) => {
  res.json({name:"shital", gender:"male"})
});

app.post('/submit-form', (req, res) => {
  const { name, gender, email, phone, from_date, to_date } = req.body;
  res.send({name, gender, phone ,email, from_date, to_date});

  const text = 'INSERT INTO public."Form_Responses" ("Name", "Gender", "Email_id", "phone_no", "From_Date", "To_Date") VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
  const values = [name, gender, email, phone, from_date, to_date];

  pool.query(text, values)
  .then(res => {
    console.log(res.rows[0]);
  })
  .catch(err => {
    console.error(err);
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

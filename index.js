const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bodyParser = require('body-parser')

const app = express();
app.use(cors()); // Add this line to enable CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())

const pool = new Pool({
  user: 'mea',
  host: 'dpg-cg6e1kpmbg5ab7kbf700-a',
  database: 'mea_acc_db',
  password: '2WZUd641PAuPIl3H5ALEkK4Wiot5fK2M',
  port: 5432,
});

app.get("/", (req,res) => {
  res.json({name:"shital", gender:"male"})
})

app.post('/submit-form', (req, res) => {
  const { name, gender, email, phone, from_date, to_date } = req.body;
  res.send({name,gender, phone ,email, from_date, to_date})
  

  const text = 'INSERT INTO public."Form_Responses" ("Name", "Gender", "Email_id", "phone_no", "From_Date", "To_Date") VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
  const  values = [name, gender, email, parseInt(phone), from_date, to_date]


  pool.query(text, values)
  .then(res => {
    console.log(res.rows[0]);
    pool.end();
  })
  .catch(err => {
    console.error(err);
    pool.end();
  });


});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

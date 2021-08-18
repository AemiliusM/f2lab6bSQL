const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/powers', async(req, res) => {
  try {
    const data = await client.query(`SELECT powers.id, 
    names.name AS power_name,
    powers.description,
   powers.realistic, 
   powers.type 
    
   FROM powers INNER JOIN names 
   ON powers.name_id = names.id;
   `);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/names', async(req, res) => {
  try {
    const data = await client.query('SELECT * FROM names');
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/powers/:id', async(req, res) => {
  const id = req.params.id;
  try {
    const data = await client.query(`SELECT powers.id, 
    powers.name_id, 
    powers.description,
    powers.realistic, 
    powers.type, 
    names.name AS power_name 
    FROM powers INNER JOIN names 
    ON powers.name_id = names.id WHERE powers.id = $1;`, [id]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.post('/powers', async(req, res) =>{
  try{
    const data = await client.query(`
    INSERT INTO powers(
      name_id,
      description,
      realistic,
      type
    ) VALUES ($1, $2, $3, $4)
    RETURNING *;`, [
      req.body.name_id,
      req.body.description,
      req.body.realistic,
      req.body.type
    ]);
    res.json(data.rows[0]);
  }catch(e){
    res.status(500).json({ error: e.message });
  }
}); 

app.post('/names', async(req, res) =>{
  try{
    const data = await client.query(`
    INSERT INTO names(
      name
    ) VALUES ($1)
    RETURNING *;`, [
      req.body.name,
    ]);
    res.json(data.rows[0]);
  }catch(e){
    res.status(500).json({ error: e.message });
  }
}); 

app.put('/powers/:id', async(req, res) => {
  try {
    const data = await client.query(`
    UPDATE powers
    SET
    name_id=$2,
    description=$3,
    realistic=$4,
    type=$5
    WHERE id =$1
    RETURNING *;
    `, [
      req.params.id,
      req.body.name_id,
      req.body.description,
      req.body.realistic,
      req.body.type
    ]);
    res.json(data.rows[0]);
  }catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;

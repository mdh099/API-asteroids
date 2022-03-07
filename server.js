const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded());

const PORT = process.env.PORT || 5000; 
app.set('port', (process.env.PORT || 5000));

const path = require('path');  


 
app.use(cors());
app.use(bodyParser.json());


//const MongoClient = require('mongodb').MongoClient;
//const url = 'mongodb+srv://jm:cop4331@cluster0.k1bed.mongodb.net/COP4331?retryWrites=true&w=majority';
require('dotenv').config();
const url = process.env.MONGODB_URI;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);
client.connect();

app.post('/api/addcard', async (req, res, next) =>
{
  // incoming: userId, color
  // outgoing: error
  const { userId, card } = req.body;
  const newCard = {Card:card,UserId:userId};
  var error = '';
  try
  {
    const db = client.db();
    const result = db.collection('Cards').insertOne(newCard);
  }
  catch(e)
  {
    error = e.toString();
  }
  var ret = { error: error };
  res.status(200).json(ret);
});

app.post('/api/login', async (req, res, next) => 
{
  // incoming: login, password
  // outgoing: id, firstName, lastName, error
 var error = '';
  const { login, password } = req.body;
  const db = client.db();
  const results = await db.collection('Users').find({Login:login,Password:password}).toArray();
  var id = -1;
  var fn = '';
  var ln = '';
  if( results.length > 0 )
  {
    id = results[0].UserId;
    fn = results[0].FirstName;
    ln = results[0].LastName;
  }
  var ret = { id:id, firstName:fn, lastName:ln, error:''};
  res.status(200).json(ret);
});

app.post('/api/searchcards', async (req, res, next) => 
{
  // incoming: userId, search
  // outgoing: results[], error
  var error = '';
  const { userId, search } = req.body;
  var _search = search.trim();
  
  const db = client.db();
  const results = await db.collection('Cards').find({"Card":{$regex:_search+'.*', $options:'r'}}).toArray();
  
  if (process.env.NODE_ENV === 'production') 
    {
      // Set static folder
      app.use(express.static('frontend/build'));
      app.get('*', (req, res) => 
         {
            res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
          });
    }

  var _ret = [];
  for( var i=0; i<results.length; i++ )
  {
    _ret.push( results[i].Card );
  }
  
  var ret = {results:_ret, error:error};
  res.status(200).json(ret);
});

app.use((req, res, next) => 
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});
//app.listen(5000); // start Node + Express server on port 5000

app.listen(PORT, () => 
{
  console.log('Server listening on port ' + PORT);
});
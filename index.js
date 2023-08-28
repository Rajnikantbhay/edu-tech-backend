const express = require('express');
const app = express();
const port = 5000;
const connectToDb = require('./database/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
connectToDb()

app.use(express.json()); 
app.use(cookieParser());
const corsOptions = {
    credentials: true ,
    origin: "*"// This is important to allow cookies to be sent
};

app.use(cors(corsOptions));

app.get('/', (req,res) => {
    res.send('server is connected')
})

app.use(require('./Router/videoData'))
app.use(require('./Router/Signup'))
app.use(require('./Router/Login'))

app.listen(port, () => console.log('connected'))

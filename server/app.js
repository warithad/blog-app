const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const dotenv = require('dotenv')
dotenv.config();
const mongoose = require('mongoose')

const app = express();

const MONGODB = process.env.MONGODB_URI;

main().catch(err => console.log(err));
async function main(){
    await mongoose.connect(MONGODB)
}

app.use(cors)
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())


app.use((req, res, next) =>{
    res.status(404);
    throw new Error('Not Found');
})

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`App listening on PORT: ${PORT}`));

module.exports = app;
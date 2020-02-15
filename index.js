const config = require('config');
const express = require('express');

require('./db/mongoose');
const error = require('./middleware/error');
const userRouter = require('./routes/users');
const itemRouter = require('./routes/items');

const app = express();
const port = process.env.PORT || 3002;

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

app.use(express.json());
app.use('/users', userRouter);
app.use('/items', itemRouter);
app.use(error);


app.listen(port, () => console.log(`Listening on port ${port}`));


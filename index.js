const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const expressip = require('express-ip');

const app = express();

app.use(express.json());
app.use(expressip().getIpInfoMiddleware);

app.post('/add', async (req,res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send({user})
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }    
})

app.post('/login', async (req,res) => {
    try {
        const ipInfo = req.ipInfo
        const user = await User.findByCredentials(
            req.body.username, 
            req.body.password, 
            ipInfo.country
        )
        res.send({user})
    } catch (e) {
        res.status(400).send(e.message)
    }
})

app.listen(3000, () => {
    console.log('Server is up on port 3000');
})
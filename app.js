const express = require('express');
const path = require('path');
const app = express();



app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname) + '/public/log_in.html');
})

app.listen(3000, () => {
    console.log('Running');
})
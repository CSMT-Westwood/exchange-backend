const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send("Hello, world!")
})



// listening on port 3000
app.listen(3000);

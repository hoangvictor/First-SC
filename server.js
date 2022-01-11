var express = require('express');
var app = express();

app.use(express.static(__dirname));

// app.listen(process.env.PORT || 3000);
port = 3000
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

const express = require('express');
const mongoose = require('mongoose')

const app = express();
const PORT = 3000;


const url = "mongodb+srv://pravinkumara67:Pravin%40123@cluster0.p0ljh.mongodb.net/SA";

mongoose.connect(url)
.then(()=>{
    console.log('connected successfully')
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
})
.catch((err)=>{
    console.log('ERROR in CONNECTION')
})


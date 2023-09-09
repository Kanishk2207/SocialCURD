const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const helmet = require("helmet")
const morgan = require("morgan")
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")


dotenv.config()
const app = express()

//MONGODB CONNECTION
{
    //connecting to mongoDB cluster this way because callbacks are banned in mongoose
    mongoose.connect(process.env.MONGO_URL)

    // get mongoose to use default promise library
    mongoose.Promise = global.Promise

    //get default connection
    const db = mongoose.connection

    //connection events
    db.on("connected", () => {
        console.log('cluster is connected')
    })

    db.on("error", (err) => {
        console.log('error' + err)
    })
}




//middleware
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))


app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)






app.listen(8800, () => {
    console.log("this is backend")
})

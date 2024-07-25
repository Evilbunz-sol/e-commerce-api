require("dotenv").config()
require("express-async-errors") 

// express
const express = require("express")
const app = express()

// packages
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload")

const rateLimiter = require("express-rate-limit")
const helmet = require("helmet")
const xss = require("xss-clean")
const cors = require("cors")
const mongoSanitize = require("express-mongo-sanitize")

// DB
const connectDB = require("./db/connect")

// Routes
const authRouter = require("./routes/authRoutes")
const userRouter = require ("./routes/userRoutes")
const productRouter = require("./routes/productRoutes")
const reviewRouter = require("./routes/reviewRoutes")
const orderRoutes = require("./routes/orderRoutes")

// Error Handler
const notFoundMiddleware = require("./middleware/not-found")
const errorHandlerMiddleware = require("./middleware/error-handler")

// Routes
app.set("trust proxy", 1)
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60
}))

app.use(helmet())
app.use(cors())
app.use(xss())
app.use(mongoSanitize())


app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

app.use(express.static("./public"))
app.use(fileUpload())

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/products", productRouter)
app.use("/api/v1/reviews", reviewRouter)
app.use("/api/v1/orders", orderRoutes)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

// Connect To Local & DB
const port = process.env.PORT || 3000
const start = async (req, res) => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log("server is litening on port 3000")
        })
    } catch (error) {
        console.log(error)
    }
}

start()

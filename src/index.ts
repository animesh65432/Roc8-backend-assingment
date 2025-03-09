import Config from "./config"
import express from "express"
import { Github } from "./router"

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use("/github", Github)

app.listen(Config.PORT, () => {
    console.log(`Server start at ${Config.PORT}`)
})
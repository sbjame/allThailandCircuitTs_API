import app from "./app";
import config from "./config/config";
import { connectMongoDB } from "./config/mongodb";

connectMongoDB();

app.listen(config.port, () => {
    console.log(`Server running at http://localhost:${config.port}`)
})
import dotenv from "dotenv";
dotenv.config();
import express from "express"
import routes from "./routes/routes"
import cors from "cors"

const app = express();
const PORT = process.env.PORT || 8000;

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";
// Allow only your frontend
app.use(cors({
    origin: allowedOrigin,
    credentials: true, // If you're using cookies or auth headers
}));

app.use(express.json());

app.use("/api", routes)

app.listen(PORT, () => {
    console.log("Server running on port 8000");
});

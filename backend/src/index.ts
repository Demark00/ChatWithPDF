import express from "express"
import routes from "./routes/routes"
import cors from "cors"

const app = express();

// Allow only your frontend
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true, // If you're using cookies or auth headers
}));

app.use(express.json());

app.use("/api", routes)

app.listen(8000, () => {
    console.log("Server running on port 8000");
});

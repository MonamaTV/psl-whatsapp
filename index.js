import express from "express";
import plsRoutes from "./app/routes/pslRoutes.js";
import { config } from "dotenv";

config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/psl", plsRoutes);

app.listen(3000, () => {
  console.log("The server is running on PORT:3000");
});

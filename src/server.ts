import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 10000);

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("CALAGH-2 server is running");
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "CALAGH-2",
    message: "Server is healthy"
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

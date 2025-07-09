// server/app.ts
import express from "express";
import generateZkProofRoute  from "./routes/generateZkProof";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/proof", generateZkProofRoute);


app.listen(5000, () => console.log("🟢 Backend running on port 5000"));

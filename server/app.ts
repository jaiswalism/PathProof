// server/app.ts
import express from "express";
import generateZkProofRoute  from "./routes/generateZkProof";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/proof", generateZkProofRoute);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🟢 Backend running on port ${PORT}`));

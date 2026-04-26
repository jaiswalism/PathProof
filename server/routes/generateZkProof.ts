// /server/routes/generateZkProof.ts
import express from "express";
import path from "path";
import fs from "fs";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("📥 Received zkPoL request:", req.body);
    const { lat, lng, timestamp, deviceId } = req.body;

    const basePath = path.resolve(process.cwd(), "server/zkpol");
    const inputPath = path.join(basePath, "input.json");
    const proofPath = path.join(basePath, "proof.json");
    const publicPath = path.join(basePath, "public.json");

    const input = { lat, lng, timestamp, deviceId };
    fs.writeFileSync(inputPath, JSON.stringify(input, null, 2));

    // ✅ Run CLI first
    console.log("Before Run Command")
    await Promise.race([
      runCommand("node", ["generate-proof.cjs"], basePath),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("⏳ CLI timed out")), 15000)
      ),
    ]);
    console.log("After Run Command")

    // ✅ Now read fresh output
    
    const proof = JSON.parse(fs.readFileSync(proofPath, "utf8"));
    const publicSignals = JSON.parse(fs.readFileSync(publicPath, "utf8"));

    if (!Array.isArray(publicSignals) || publicSignals.some((x) => typeof x === "undefined")) {
      throw new Error("Invalid publicSignals format");
    }

    const sanitizedProof = JSON.parse(JSON.stringify(proof));
    const sanitizedSignals = publicSignals.map((x) => x.toString());

    console.log("🧾 Sending response to client...");
    res.status(200).json({
      proof: sanitizedProof,
      publicSignals: sanitizedSignals,
    });
    console.log("✅ Response sent.");
  } catch (err) {
    console.error("❌ Error in zkProof route:", err);
    res.status(500).json({ error: "Failed to generate proof" });
  }
});

import { execFileSync } from "child_process";

function runCommand(cmd: string, args: string[], cwd: string): Promise<void> {
  try {
    execFileSync(cmd, args, {
      cwd,
      stdio: "inherit", // show CLI output live
      shell: true,
    });
    return Promise.resolve();
  } catch (err: any) {
    console.error("❌ execFileSync error:", err.message || err);
    return Promise.reject(err);
  }
}



export default router;

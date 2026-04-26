import type { VercelRequest, VercelResponse } from "@vercel/node";
import path from "path";
import * as snarkjs from "snarkjs";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("📥 Received zkPoL request:", req.body);
    const { lat, lng, timestamp, deviceId } = req.body;

    const basePath = path.resolve(process.cwd(), "server/zkpol");
    const wasmPath = path.join(basePath, "build/zkpol_js/zkpol.wasm");
    const zkeyPath = path.join(basePath, "zkpol_final.zkey");

    const input = { lat, lng, timestamp, deviceId };

    console.log("⚙️ Generating proof in memory...");
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      input,
      wasmPath,
      zkeyPath
    );

    if (
      !Array.isArray(publicSignals) ||
      publicSignals.some((x) => typeof x === "undefined")
    ) {
      throw new Error("Invalid publicSignals format");
    }

    const sanitizedProof = JSON.parse(JSON.stringify(proof));
    const sanitizedSignals = publicSignals.map((x) => x.toString());

    console.log("✅ Proof generated, sending response...");
    return res.status(200).json({
      proof: sanitizedProof,
      publicSignals: sanitizedSignals,
    });
  } catch (err) {
    console.error("❌ Error in zkProof serverless function:", err);
    return res.status(500).json({ error: "Failed to generate proof" });
  }
}

const snarkjs = require("snarkjs");
const fs = require("fs");
const path = require("path");
const wcBuilder = require("./zkpol_js/witness_calculator.js");

const wasmPath = path.resolve("zkpol_js/zkpol.wasm");
const zkeyPath = path.resolve("zkpol_final.zkey");
const inputPath = path.resolve("input.json");
const witnessPath = path.resolve("witness.wtns");
const proofPath = path.resolve("proof.json");
const publicPath = path.resolve("public.json");

async function generate() {
  try {
    console.log("🔍 Loading input...");
    const input = JSON.parse(fs.readFileSync(inputPath, "utf8"));

    console.log("🧠 Loading wasm...");
    const wasmBuffer = fs.readFileSync(wasmPath);
    const wc = await wcBuilder(wasmBuffer);

    console.log("⚙️ Generating witness...");
    const buff = await wc.calculateWTNSBin(input, 0);
    fs.writeFileSync(witnessPath, buff);

    console.log("🔐 Generating proof...");
    const { proof, publicSignals } = await snarkjs.groth16.prove(zkeyPath, witnessPath);

    fs.writeFileSync(proofPath, JSON.stringify(proof, null, 2));
    fs.writeFileSync(publicPath, JSON.stringify(publicSignals, null, 2));

    console.log("\n✅ Proof generated successfully!");
    console.log("📤 Public signal (poseidon hash):", publicSignals[0]);
    
    // ✅ Force exit after successful completion
    process.exit(0);
    
  } catch (err) {
    console.error("❌ Error generating proof:", err);
    // ✅ Exit with error code on failure
    process.exit(1);
  }
}

// ✅ Handle unhandled rejections and exceptions
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled promise rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught exception:', err);
  process.exit(1);
});

generate();
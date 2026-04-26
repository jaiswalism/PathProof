import * as snarkjs from "snarkjs";
import path from "path";

async function test() {
  const wasmPath = path.resolve("server/zkpol/build/zkpol_js/zkpol.wasm");
  const zkeyPath = path.resolve("server/zkpol/zkpol_final.zkey");
  
  const input = {
    lat: 12816778,
    lng: 80040691,
    timestamp: 1777227685,
    deviceId: 111
  };
  
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(input, wasmPath, zkeyPath);
  console.log("Proof generated:", publicSignals[0]);
}

test().catch(console.error);

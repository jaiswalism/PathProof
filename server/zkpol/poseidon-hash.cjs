/*
 *  Helper function to test zkpol.circom
 */

const circomlib = require("circomlibjs");
const { poseidon } = circomlib;
const { buildPoseidon } = circomlib;

async function main() {
  const F = (await buildPoseidon()).F;

  const lat = 28613900;
  const lng = 77209000;
  const timestamp = 1720425600;
  const deviceId = 123456;

  const hash = (await buildPoseidon())([lat, lng, timestamp, deviceId]);
  const hashValue = F.toString(hash);

  console.log("✅ Poseidon hash:", hashValue);
}

main();

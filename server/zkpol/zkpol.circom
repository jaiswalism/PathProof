pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/poseidon.circom";

template ZKPoL() {
    signal input lat;
    signal input lng;
    signal input timestamp;
    signal input deviceId;
    signal output poseidonHash;

    component hasher = Poseidon(4);
    hasher.inputs[0] <== lat;
    hasher.inputs[1] <== lng;
    hasher.inputs[2] <== timestamp;
    hasher.inputs[3] <== deviceId;

    poseidonHash <== hasher.out;
}

component main = ZKPoL();

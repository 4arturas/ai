function bpn_CreateTrainData() {
    var trainInp = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
        [0, 0, 0]
    ];
    var trainOut = [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1]
    ];
    return [trainInp, trainOut];
}

function bpn_Create(bpnUnits) {
    var bpn = new Array(bpnUnits.length);
    for (var layer = 0; layer < bpn.length; layer++) {
        bpn[layer] = new Array(bpnUnits[layer] + 1);
        for (var u = 0; u < bpn[layer].length; u++) {
            bpn[layer][u] = { y: u, x: layer, val: 0.0, err: 0.0 };
        }
        bpn[layer][0].val = 1.0;
    }
    for (layer = 0; layer < bpn.length - 1; layer++) {
        var lowerLayer = bpn[layer];
        var upperLayer = bpn[layer + 1];
        for (u = 0; u < upperLayer.length; u++) {
            var upperNode = upperLayer[u];
            upperNode.weight = new Array(lowerLayer.length);
            for (var l = 0; l < lowerLayer.length; l++) {
                upperNode.weight[l] = rnd_Real(-0.5, +0.5);
            }
        }
    }
    return bpn;
}

function bpn_Propagate(bpn, input) {
    for (var i = 1; i < bpn[0].length; i++) {
        bpn[0][i].val = input[i - 1];
    }
    for (var layer = 0; layer < bpn.length - 1; layer++) {
        var upperLayer = bpn[layer + 1];
        var lowerLayer = bpn[layer];
        for (var u = 1; u < upperLayer.length; u++) {
            var upperNode = upperLayer[u];
            var Sum = 0.0;
            for (var l = 0; l < lowerLayer.length; l++) {
                var lowerNode = lowerLayer[l];
                Sum += upperNode.weight[l] * lowerNode.val;
            }
            upperNode.val = 1.0 / (1.0 + Math.exp(-Sum));
        }
    }
}

function bpn_ComputOutputError(bpn, Target) {
    var outputLayer = bpn[bpn.length - 1];
    var netError = 0.0;
    for (var u = 1; u < outputLayer.length; u++) {
        var node = outputLayer[u];
        var Out = node.val;
        var Err = Target[u - 1] - Out;
        node.err = Err * Out * (1.0 - Out);
        netError += 0.5 * (Err * Err);
    }
    return netError / (outputLayer.length - 1);
}

function bpn_Backpropagate(bpn) {
    for (var layer = bpn.length - 1; layer > 1; layer--) {
        var upperLayer = bpn[layer];
        var lowerLayer = bpn[layer - 1];
        for (var l = 1; l < lowerLayer.length; l++) {
            var lowerNode = lowerLayer[l];
            var Err = 0.0;
            var Out = lowerNode.val;
            for (var u = 1; u < upperLayer.length; u++) {
                var upperNode = upperLayer[u];
                Err += upperNode.weight[l] * upperNode.err;
            }
            lowerNode.err = Err * Out * (1.0 - Out);
        }
    }
}

function bpn_AdjustWeights(bpn, learningRate) {
    for (var layer = 0; layer < bpn.length - 1; layer++) {
        var upperLayer = bpn[layer + 1];
        var lowerLayer = bpn[layer];
        for (var u = 1; u < upperLayer.length; u++) {
            var upperNode = upperLayer[u];
            var Err = upperNode.err;
            for (var l = 0; l < lowerLayer.length; l++) {
                var lowerNode = lowerLayer[l];
                var Out = lowerNode.val;
                upperNode.weight[l] += learningRate * Err * Out;
            }
        }
    }
}

function bpn_Train(bpn, trainData, epochs, learningRate) {
    var trainInp = trainData[0];
    var trainOut = trainData[1];
    for (var epoch = 0; epoch < epochs; epoch++) {
        var totalError = 0.0;
        for (var i = 0; i < trainInp.length; i++) {
            bpn_Propagate(bpn, trainInp[i]);
            totalError += bpn_ComputOutputError(bpn, trainOut[i]);
            bpn_Backpropagate(bpn);
            bpn_AdjustWeights(bpn, learningRate);
        }
    }
}
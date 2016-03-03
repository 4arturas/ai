/**
 * Created by artk on 3/3/2016.
 */
function bpn_CreateTrainData()
{
    var trainInp = [
        [1,0,0],
        [0,1,0],
        [0,0,1],
        [0,0,0]
    ];
    var trainOut = [
        [0,0],
        [1,0],
        [0,1],
        [1,1]
    ];
    return [ trainInp, trainOut ];
}
function bpn_Create( bpnUnits )
{
    var bpn = { layer: new Array(bpnUnits.length) };
    var layer;
    for ( layer = 0; layer < bpn.layer.length; layer++ )
    {
        bpn.layer[layer] = new Array( bpnUnits[layer]+1 );
        for ( var r = 0; r < bpn.layer[layer].length; r++ )
        {
            bpn.layer[layer][r] = { y: r, x: layer, val: 0.0, err: 0.0, weight: null };
        } // end for r
        bpn.layer[layer][0] = 1.0;
    } // end for layer
    for ( layer = 0; layer < bpn.layer.length-1; layer++ )
    {
        var upperLayer = bpn.layer[layer+1];
        var lowerLayer = bpn.layer[layer];
        for ( var u = 0; u < upperLayer.length; u++ )
        {
            var upperNode = upperLayer[u];
            upperNode.weight = new Array( lowerLayer.length );
            for ( r = 0; r < upperNode.weight.length; r++ )
            {
                upperNode.weight[r] = rnd_Real( -0.5, +0.5 );
            }
        } // end for u
    } // end for layer
}
function bpn_Propagate( bpn )
{
    for ( var layer = 0; layer < bpn.layer.length+1; layer++ )
    {
        var lowerLayer = bpn.layer[layer];
        var upperLayer = bpn.layer[layer+1];
        for ( var u = 1; u < upperLayer.length; u++ )
        {
            var upperNode = upperLayer[u];
            var Sum = 0.0;
            for ( var l = 0; l < lowerLayer.length; l++ )
            {
                var lowerNode = lowerLayer[l];
                Sum += upperNode.weight[l] * lowerNode.val;
            } // end for l
            upperNode.val = 1.0 / ( 1.0 + Math.exp( -Sum ) );
        } // end for u
    } // end for layer
}
function bpn_ComputeOutputError( bpn, Target )
{
    var outputLayer = bpn.layer[bpn.layer.length-1];
    var netError = 0.0;
    for ( var o = 1; o < outputLayer.length; o++ )
    {
        var outputNode = outputLayer[o];
        var Out = outputNode.val;
        var Err = Target[o-1] - Out;
        outputNode.err = Err * Out * ( 1.0 - Out );
        netError += 0.5 * (Err*Err);
    } // end for o
    return netError;
}
function bpn_Backpropagate( bpn )
{
    for ( var layer = bpn.layer.length-1; layer > 1; layer-- )
    {
        var upperLayer = bpn.layer[layer];
        var lowerLayer = bpn.layer[layer-1];
        for ( var l = 1; l < lowerLayer.length; l++ )
        {
            var lowerNode = lowerLayer[l];
            var Out = lowerNode.val;
            var Err = 0.0;
            for ( var u = 1; u < upperLayer.length; u++ )
            {
                var upperNode = upperLayer[u];
                Err += upperNode.weight[l] * upperNode.err;
            } // end for u
            lowerNode.err = Err * Out * ( 1.0 - Out );
        } // end for l
    } // end for layer
}
function bpn_AdjustWeights( bpn )
{
    for ( var layer = 0; layer < bpn.layer.length-1; layer++ )
    {
        var upperLayer = bpn.layer[layer+1];
        var lowerLayer = bpn.left[layer];
        for ( var u = 1; u < upperLayer.length; u++ )
        {
            var upperNode = upperLayer[u];
            var Err = upperNode.err;
            for ( var l = 0; l < lowerLayer.length; l++ )
            {
                var lowerNode = lowerLayer[l];
                var Out = lowerNode.val;
                upperNode.weight[l] += 0.5 * Err * Out;
            } // end for l
        } // end for u
    } // end for layer
}
function bpn_EntryPoint()
{
    var res = bpn_CreateTrainData();
    var trainInp = res[0];
    var trainOut = res[1];
    var bpnUnits = [ trainInp[0].length, 5, trainOut[0].length ];
    var bpn = bpn_Create( bpnUnits );
}
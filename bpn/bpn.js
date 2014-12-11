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
function bpn_Substr( v )
{
    if ( v == null )
        return '&nbsp;';
    return (''+v).substr(0,6);
}
function bpn_Create( bpnUnits )
{
    var layer, r;
    var node;
    var bpn = {
        nextTime: 0,
        layer: new Array( bpnUnits.length )
    };
    for ( layer = 0; layer < bpn.layer.length; layer++ )
    {
        bpn.layer[layer] = new Array( bpnUnits[layer]+1 );
        for ( r = 0; r < bpn.layer[layer].length; r++ )
        {
            var fnVisualise = function ()
            {
                var s = 'val: ' + bpn_Substr(this.val);
                s += '<br><span style="color:red; border-bottom: 1px solid black;">err: ' + bpn_Substr(this.err) + '</span>';
                if ( this.weight != null )
                    for ( var w = 0; w < this.weight.length; w++ )
                    {
                        s += '<br>' + bpn_Substr(this.weight[w]);
                    } // end for w
                document.getElementById(this.y+'_'+this.x).innerHTML = s;
            };
            node = { y: r, x: layer, val:0, err:0, weight:null, fnVisualise: fnVisualise };
            bpn.layer[layer][r] = node;
        } // end for r
        bpn.layer[layer][0].val = 1.0;
    } // end for layer

    for ( layer = 0; layer < bpn.layer.length-1; layer++ )
    {
        var lower = bpn.layer[layer];
        var upper = bpn.layer[layer+1];

        for ( var u = 0; u < upper.length; u++ )
        {
            upper[u].weight = new Array( lower.length );

            for ( r = 0; r < upper[u].weight.length; r++ )
            {
                //console.log( upper );
                upper[u].weight[r] = _rnd_Real( -0.5, +0.5 );
            } // end for r
        } // end for u
    }
    return bpn;
}
function bpn_CreateTable( bpn )
{
    var bpnTable = document.getElementById('bpnTable');
    var layer, row;
    var maxRows = -Infinity;
    var node;
    var tr, td;
    for ( layer = 0; layer < bpn.layer.length; layer++ )
    {
        maxRows = _max( maxRows, bpn.layer[layer].length );
    } // end for layer

    for ( row = 0; row < maxRows; row++ )
    {
        tr = document.createElement('tr');
        bpnTable.appendChild( tr );
        for ( layer = 0; layer < bpn.layer.length; layer++ )
        {
            td = document.createElement('td');
            tr.appendChild( td );
            td.setAttribute('id',row+'_'+layer);
            td.innerHTML = '&nbsp;';
        } // end for layer;
    } // end for row
}
function bpn_Visualise( bpn )
{
    var layer, row;
    var node;
    for ( layer = 0; layer < bpn.layer.length; layer++ )
    {
        for ( row = 0; row < bpn.layer[layer].length; row++ )
        {
            node = bpn.layer[layer][row];
            node.fnVisualise();
        } // end for row
    } // end for layer
}
function bpn_SetInput( bpn, Inp )
{
    var r;
    var node;
    for ( r = 1; r < bpn.layer[0].length; r++ )
    {
        node = bpn.layer[0][r];
        node.val = Inp[r-1];
        node.fnVisualise();
    } // end for r
}
function bpn_Propagate( bpn )
{
    var layer;
    var lower, upper;
    var upperNode, lowerNode;
    var u, l;
    var Sum = 0.0;
    for ( layer = 0; layer < bpn.layer.length-1; layer++ )
    {
        lower = bpn.layer[layer];
        upper = bpn.layer[layer+1];
        for ( u = 1; u < upper.length; u++ )
        {
            upperNode = upper[u];
            Sum = 0.0;
            for ( l = 0; l < lower.length; l++ )
            {
                lowerNode = lower[l];
                Sum += upperNode.weight[l] * lowerNode.val;
            } // end for l
            upperNode.val = 1.0 / ( 1.0 + Math.exp( -Sum ) );
            upperNode.fnVisualise();
        } // end for u
    } // end for layer
}
function bpn_ComputeOutputError( bpn, Target )
{
    var r;
    var Out, Err;
    var netError = 0.0;
    var output = bpn.layer[bpn.layer.length-1];
    var outNode;
    for ( r = 1; r < output.length; r++ )
    {
        outNode = output[r];
        Out = outNode.val;
        Err = Target[r-1] - Out;
        outNode.err = Err * Out * ( 1.0 - Out );
        outNode.fnVisualise();
        netError += 0.5 * (Err*Err);
    } // end for r
    return netError;
}
function bpn_Backpropagate( bpn )
{
    var layer, u, l;
    var upperLayer, lowerLayer;
    var upperNode, lowerNode;
    var Out, Err;
    for ( layer = bpn.layer.length-1; layer > 1; layer-- )
    {
        upperLayer = bpn.layer[layer];
        lowerLayer = bpn.layer[layer-1];
        for ( l = 1; l < lowerLayer.length; l++ )
        {
            lowerNode = lowerLayer[l];
            Out = lowerNode.val;
            Err = 0.0;
            for ( u = 1; u < upperLayer.length; u++ )
            {
                upperNode = upperLayer[u];
                Err += upperNode.weight[l] * upperNode.err;
            } // end for u
            lowerNode.err = Err * Out * ( 1.0 - Out );
            lowerNode.fnVisualise();
        } // end for l
    }
}
function bpn_AdjustWeights( bpn )
{
    var layer, u, l;
    var upperLayer, lowerLayer;
    var upperNode, lowerNode;
    var Out, Err;
    for ( layer = 0; layer < bpn.layer.length-1; layer++ )
    {
        upperLayer = bpn.layer[layer+1];
        lowerLayer = bpn.layer[layer];
        for ( u = 1; u < upperLayer.length; u++ )
        {
            upperNode = upperLayer[u];
            Err = upperNode.err;
            for ( l = 0; l < lowerLayer.length; l++ )
            {
                lowerNode = lowerLayer[l];
                Out = lowerNode.val;
                upperNode.weight[l] += 0.5 * Err * Out;
            } // end for l
            upperNode.fnVisualise();
        } // end for u
    } // end for layer
}
function bpn_Msg( msg )
{
    document.getElementById('bpnMsg').innerHTML = msg;
}
function bpn_OnComplete( bpn, trainInp, trainOut )
{
    var div = document.createElement('div');
    var i, n;

    for ( n = 0; n < trainInp.length; n++ )
    {
        var inArrTxt = '';
        for (i = 0; i < trainInp[n].length - 1; i++) {
            inArrTxt += trainInp[n][i] + ',';
        }
        inArrTxt += trainInp[n][i];

        var outArrTxt = '';
        for (i = 0; i < trainOut[n].length-1; i++) {
            outArrTxt += trainOut[n][i] + ',';
        }
        outArrTxt += trainOut[n][i];

        div.appendChild( document.createElement('br') );
        var inp = document.createElement('input');
        inp.setAttribute('name','radioNN');
        inp.setAttribute('type','radio');
        inp.setAttribute('value',inArrTxt);
        inp.onclick = function()
        {
            var arr = eval( '['+this.getAttribute('value')+']' );
            bpn_SetInput( bpn, arr );
            bpn_Propagate( bpn );
        };
        div.appendChild( inp );
        div.appendChild( document.createTextNode('['+inArrTxt+'] = ['+outArrTxt+']') );
    } // end for n

    document.body.appendChild( div );
}
function bpn_Epoch( bpn, trainInp, trainOut, epoch )
{
    var n;
    var msg;
    var netError;
    for ( n = 0; n < trainInp.length; n++ )
    {
        bpn_SetInput( bpn, trainInp[n] );
        bpn_Propagate( bpn );
        netError = bpn_ComputeOutputError( bpn, trainOut[n] );
        bpn_Backpropagate( bpn );
        bpn_AdjustWeights( bpn );
    } // end for n

    msg = 'Epoch: ' + epoch;
    msg += '<br>NetError: ' + netError;
    bpn_Msg( msg );

    if ( epoch == 500 )
    {
        bpn_OnComplete( bpn, trainInp, trainOut );
        return;
    }


    setTimeout( function() {
        bpn_Epoch( bpn, trainInp, trainOut, epoch+1 );
    }, 0 );
}
function bpn_EntryPoint()
{
    var trainData = bpn_CreateTrainData();
    var trainInp = trainData[0];
    var trainOut = trainData[1];
    _assert( trainInp.length == trainOut.length, 'train data length' );
    var bpnUnits = [ trainInp[0].length, 5, trainOut[0].length ];
    var bpn = bpn_Create( bpnUnits );
    bpn_CreateTable( bpn );
    bpn_Visualise( bpn );
    bpn_Epoch( bpn, trainInp, trainOut, 0 );
}
bpn_EntryPoint();
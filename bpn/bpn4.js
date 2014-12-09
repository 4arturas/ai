function bpn_CreateTrainData()
{
    var trainInp = [
        [1,0],
        [0,1]
    ];
    var trainOut = [
        [1],
        [0]
    ];
    return [ trainInp, trainOut ];
}
function bpn_Create( bpnNodes )
{
    var y;
    var l, r, w;
    var node;

    var bpn = { layer: new Array(bpnNodes.length) };
    for ( l = 0; l < bpnNodes.length; l++ )
    {
        bpn.layer[l] = new Array( bpnNodes[l]+1 );
        for ( r = 0; r < bpn.layer[l].length; r++ )
        {
            bpn.layer[l][r] = {
                val: 0.0, err: 0.0, weight: null
            };
        } // end for n
        bpn.layer[l][0].val = 1.0;
    } // end for l

    for ( l = 1; l < bpn.layer.length; l++ )
    {
        for ( r = 0; r < bpn.layer[l].length; r++ )
        {
            node = bpn.layer[l][r];
            node.weight = new Array(bpn.layer[l-1].length );
            for ( w = 0; w < node.weight.length; w++ )
                node.weight[w] = _rnd_Real( -1, +1 );
        } // end for r
    } // end for l
    return bpn;
}
function bpn_EmitNode( r, l, msg )
{
    document.getElementById(r+'_'+l).innerHTML = msg;
}
function bpn_CreateTable( bpn )
{
    var l, n, r;
    var tr, td;
    var bpnTable = document.getElementById('bpnTable');
    var maxRows = -Infinity;
    for ( l = 0; l < bpn.layer.length; l++ )
        maxRows = _max( maxRows, bpn.layer[l].length );

    for ( r = 0; r < maxRows; r++ )
    {
        tr = document.createElement('tr');
        bpnTable.appendChild( tr );
        for ( l = 0; l < bpn.layer.length; l++ )
        {
            td = document.createElement('td');
            tr.appendChild( td );
            td.setAttribute('id', r+'_'+l);
            bpn_EmitNode( r, l, '&nbsp;' );
        } // end for l
    } // end for r
}
function bpn_Substr( s )
{
    if ( s == null )
        return '&nbsp;';

    return (''+s).substr(0,6);
}
function bpn_EmitTable( bpn )
{
    var l, r, w;
    var m;
    var node;
    for ( l = 0; l < bpn.layer.length; l++ )
    {
        for ( r = 0; r < bpn.layer[l].length; r++ )
        {
            node = bpn.layer[l][r];
            m = 'val: ' + bpn_Substr( node.val );
            m += '<br><span style="color:red; border-bottom: 1px solid black; ">err: ' + bpn_Substr( node.err ) + '</span>';

            if ( l != 0 )
            for ( w = 0; w < node.weight.length; w++ )
                m += '<br>' + bpn_Substr( node.weight[w] );

            bpn_EmitNode( r, l, m );
        } // end for r
    } // end for l
}
function bpn_SetInput( bpn, Inp )
{
    var r;
    for ( r = 1; r < bpn.layer[0].length; r++ )
        bpn.layer[0][r].val = Inp[r-1];
}
function bpn_Propagate( bpn )
{
    var layer;
    var u, l;
    var Sum;
    var upper, lower;
    for ( layer = 0; layer < bpn.layer.length-1; layer++ )
    {
        upper = layer+1;
        lower = layer;
        for ( u = 1; u < bpn.layer[upper].length; u++ )
        {
            Sum = 0.0;
            for ( l = 0; l < bpn.layer[lower].length; l++ )
            {
                Sum += bpn.layer[lower][l].val * bpn.layer[upper][u].weight[l];
            }
            bpn.layer[upper][u].val = 1.0 / ( 1.0 + Math.exp( -Sum ) );
        } // end for i
    }
}
function bpn_ComputeOutputEror( bpn, Target )
{
    var r;
    var Out, Err;
    var netError = 0.0;
    var lastColumn = bpn.layer.length-1;
    for ( r = 1; r < bpn.layer[lastColumn].length; r++ )
    {
        Out = bpn.layer[lastColumn][r].val;
        Err = Target[r-1] - Out;
        bpn.layer[lastColumn][r].err = Err * Out * ( 1.0 - Out );
        netError += 0.5 * (Err*Err);
    } // end for r
    return netError;
}
function bpn_Backpropagate( bpn )
{
    var layer;
    var upper, lower;
    var u, l;
    var Out, Err;
    for ( layer = bpn.layer.length-1; layer > 1; layer-- )
    {
        upper = layer;
        lower = layer-1;
        for ( l = 1; l < bpn.layer[lower].length; l++ )
        {
            Out = bpn.layer[lower][l].val;
            Err = 0.0;
            for ( u = 1; u < bpn.layer[upper].length; u++ )
                Err += bpn.layer[upper][u].weight[l] * bpn.layer[upper][u].err;
            bpn.layer[lower][l].err = Err * Out * ( 1.0 - Out );
        } // end for l
    }
}
function bpn_AdjustWeights( bpn )
{
    var layer, upper, lower, u, l;
    var Out, Err;
    for ( layer = 1; layer < bpn.layer.length; layer++ )
    {
        lower = layer-1;
        upper = layer;
        for ( u = 1; u < bpn.layer[upper].length; u++ )
        {
            Err = bpn.layer[upper][u].err;
            for ( l = 0; l < bpn.layer[lower].length; l++ )
            {
                Out = bpn.layer[lower][l].val;
                bpn.layer[upper][u].weight[l] += 0.5 * Err * Out;
            }
        } // end for u
    } // end for layer
}
function bpn_Message( msg )
{
    document.getElementById('bpnMsg').innerHTML = msg;
}
function bpn_CreatePanel( bpn, trainInp, trainOut )
{
    var y, x;
    var div = document.createElement('form');
    var txt;
    var aTxt;
    for ( y = 0; y < trainInp.length; y++ )
    {
        var inp = document.createElement('input');
        inp.setAttribute('type', 'radio');
        inp.setAttribute('name', 'radioNN');

        var o = {
            arr: new Array( trainInp[y].length )
        };
        txt = '[ ';
        aTxt = '';
        for ( x = 0; x < trainInp[y].length-1; x++ )
        {
            aTxt += trainInp[y][x] + ', ';
        }
        aTxt += trainInp[y][x];

        txt += aTxt + ' ] = [ ';
        for ( x = 0; x < trainOut[y].length; x++ )
            txt += trainOut[y][x] + ' ';
        txt += ' ]';

//alert( eval('['+aTxt+']' ) );
        inp.setAttribute('value',aTxt);

        inp.onclick = function()
        {
            var arr = eval( '[' + this.getAttribute('value') + ']' );
            bpn_SetInput( bpn, arr );
            bpn_Propagate( bpn );
            bpn_EmitTable( bpn );
        };

        div.appendChild(document.createElement('br'));
        div.appendChild(inp);
        div.appendChild( document.createTextNode( txt ) );
    }

    document.body.appendChild( div );
}
function bpn_Epoch( bpn, trainInp, trainOut, epoch )
{
    var n;
    var netError;
    var msg;
    for ( n = 0; n < trainInp.length; n++ )
    {
        bpn_SetInput( bpn, trainInp[n] );
        bpn_Propagate( bpn );
        netError = bpn_ComputeOutputEror( bpn, trainOut );
        bpn_Backpropagate( bpn, trainOut );
        bpn_AdjustWeights( bpn );
    } // end for n

    bpn_EmitTable( bpn );

    msg = 'Epoch: ' + epoch;
    msg += '<br>NetError: ' + netError;
    bpn_Message( msg );

    if ( epoch == 1000 )
    {
        bpn_CreatePanel( bpn, trainInp, trainOut );
        return;
    }

    setTimeout( function() {
        bpn_Epoch( bpn, trainInp, trainOut, epoch+1 );
    }, 10 );
}
function bpn_EntryPoint()
{
    var trainData = bpn_CreateTrainData();
    var trainInp = trainData[0];
    var trainOut = trainData[1];
    _assert( trainInp.length==trainOut.length, 'trainInp.length!=trainOut.length' );
    var hiddenLayer = [trainInp[0].length, 3, trainOut[0].length ];
    var bpn = bpn_Create( hiddenLayer );
    bpn_CreateTable( bpn );
    bpn_EmitTable( bpn );

    bpn_Epoch( bpn, trainInp, trainOut, 0 );

}
bpn_EntryPoint();
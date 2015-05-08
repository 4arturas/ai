var EMPTY = 0;
var PROGRAM = -1;
var HUMAN = +1;
function ttt_EmitBoard( board )
{
    var y, x;
    var table = document.createElement('table');
    table.cellSpacing = '0';
    table.cellPadding = '0';
    for ( y = 0; y < 3; y++ )
    {
        var tr = document.createElement('tr');
        table.appendChild( tr );
        for ( x = 0; x < 3; x++ )
        {
            var td = document.createElement('td');
            tr.appendChild( td );
            var p = board[x+y*3];
            var s = '';
            if ( p == EMPTY )
                s = '&nbsp;';
            else if ( p == HUMAN )
                s = '<span style="color:green;">X</span>';
            else if ( p == PROGRAM )
                s = '<span style="color:red;">O</span>';
            td.innerHTML = s;
        } // end for x
    } // end for y
    document.body.appendChild( table );
}
function ttt_WonGame( board, player )
{
    var w = [
        0,1,2,
        3,4,5,
        6,7,8,

        0,3,6,
        1,4,7,
        2,5,8,

        0,4,8,
        2,4,6
    ];
    var i;
    for ( i = 0; i < w.length; i += 3 )
    {
        var x = w[i+0];
        var y = w[i+1];
        var z = w[i+2];
        if ( w[x] == player && w[y] == player && w[z] == player )
            return true;
    } // end for i
    return false;
}
function ttt_DrawnGame( board )
{
    var y;
    for ( y = 0; y < board.length; y++ )
        if ( board[y] == EMPTY )
            return false;
    return true;
}
function ttt_ReachedMaxDepth( board )
{
    return ttt_WonGame( board, HUMAN ) || ttt_WonGame( board, PROGRAM ) || ttt_DrawnGame( board );
}
function ttt_PossibleMoves( board, player )
{
    var i, j;
    var move = [];
    for ( i = 0; i < board.length; i++ )
    {
        if ( board[i] != EMPTY )
            continue;
        var b = new Array( board.length );
        for ( j = 0; j < board.length; j++ )
            b[j] = board[j];
        b[i] = player;
        move.push( b );
    } // end for i
    return move;
}
function ttt_EvaluatePosition( board, player )
{
    var i, count = 0.0;
    for ( i = 0; i < board.length; i++ )
        if ( board[i] == EMPTY )
            count += 1.0;
    count = 10.0 - count;

    var blank = 1.0;
    if ( board[4] == HUMAN && player == HUMAN )
        blank += 0.4;
    if ( board[4] == PROGRAM && player == PROGRAM )
        blank -= 0.4;

    if ( ttt_WonGame( board, HUMAN ) )
        return blank + ( 1.0 / count );
    if ( ttt_WonGame( board, PROGRAM ) )
        return -(blank + ( 1.0 / count ) );

    return blank - 1.0;
}
function ttt_AlphaBeta( board, player, depth, alpha, beta )
{
    var v, value;
    if ( ttt_ReachedMaxDepth( board ) )
    {
        value = ttt_EvaluatePosition( board, player );
        return [ value, null ];
    }

    var best = [];
    var move = ttt_PossibleMoves( board, player );
    for ( var i = 0; i < move.length; i++ )
    {
        v = ttt_AlphaBeta( move[i], player==HUMAN?PROGRAM:HUMAN, depth+1, -beta, -alpha );
        if ( player == HUMAN )
            value = v[0];
        else
            value = -v[0];
        if ( value > beta )
        {
            beta = value;
            best = [];
            best.push( move[i] );
            for ( var j = 1; j < v.length; j++ )
            {
                var o = v[j];
                if ( o == null )
                    continue;
                best.push( o );
            }
        }
        if ( beta >= alpha )
            break;
    } // end for i
    v = [];
    v.push( beta );
    for ( i = 0; i < best.length; i++ )
        v.push( best[i] );
    return v;
}
function ttt_PlayGame( board, player )
{
    ttt_EmitBoard( board );

    if ( ttt_WonGame( board, player ) )
    {
        console.log( (player==HUMAN?'Human won':'Program won') );
        return;
    }
    if ( ttt_DrawnGame( board ) )
    {
        console.log( 'Drawn game' );
        return;
    }


    setTimeout( function() {
        var p = player==HUMAN?PROGRAM:HUMAN;
        var alpha, beta;
        var v = 1000000;
        if ( p == HUMAN )
        {
            alpha = v;
            beta = -v;
        }
        else
        {
            alpha = v;
            beta = -v;
        }
        var vv = ttt_AlphaBeta( board, p, 0, alpha, beta );
        v = vv[0];
        console.log( v );
        ttt_PlayGame( vv[1], p );
    }, 500 );
}
function ttt_CreateEmptyBoard()
{
    var b = [];
    var y;
    for ( y = 0; y < 9; y++ )
        b.push( EMPTY );
    return b;
}
ttt_PlayGame( ttt_CreateEmptyBoard(), PROGRAM );
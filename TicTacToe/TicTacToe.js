var BLANK = '&nbsp;';
var HUMAN = 'X';
var PROGRAM = 'O';

var ticTacToeTable;
var board;
function ttt_CreateEmptyTable()
{
    var table = document.createElement('table');
    var y, x;
    var tr, td;
    var c = 0;
    for ( y = 0; y < 3; y++ )
    {
        tr = document.createElement('tr');
        table.appendChild(tr);
        for ( x = 0; x < 3; x++ )
        {
            td = document.createElement('td');
            td.id = '' + (c++);
            tr.appendChild( td );
            td.innerHTML = '&nbsp;';
        } // end for x
    } // end for y
    return table;
}
function ttt_Init()
{

    ticTacToeTable = ttt_CreateEmptyTable();

    var st = document.createElement('style');
    st.innerHTML = '#ticTacToeTable { border: 1px solid black; } #ticTacToeTable td { border: 1px solid black; padding: 5px; width:15px; height: 15px; }';
    document.body.appendChild( st );
    ticTacToeTable.id = 'ticTacToeTable';
    ticTacToeTable.cellSpacing = '0';
    ticTacToeTable.cellPadding = '0';
    document.body.appendChild( ticTacToeTable );
    document.body.style.padding = '40px';

    board = ttt_CreateEmptyBoard();
    ttt_EmitBoard( board );
}
function ttt_EmitBoard( board )
{
    var i;
    for ( i = 0; i < board.length; i++ )
    {
        document.getElementById(i + '').innerHTML = board[i];
    }
}
function ttt_CreateEmptyBoard()
{
    var b = new Array( 9 );
    var i;
    for ( i = 0; i < b.length; i++)
        b[i] = BLANK;
    return b;
}

function ttt_winCheck( board, player, x, y, z )
{
    return board[x] == player && board[y] == player && board[z] == player;
}

function ttt_wonCheck( board, player )
{
    var b = [
        0,1,2,
        3,4,5,
        6,7,8,

        0,3,6,
        1,4,7,
        2,5,8,

        0,4,8,
        2,4,6
    ];
    for ( var i = 0; i < b.length; i += 3 )
    {
        if ( ttt_winCheck( board, player, b[i], b[i+1], b[i+2] ) )
            return true;
    }
    return false;
}
function ttt_drawn_Game( board )
{
    for ( var i = 0; i < board.length; i++ )
        if ( board[i] == BLANK )
            return false;
    return true;
}
function ttt_reachedMaxDepth( board, player )
{
    return ttt_wonCheck( board, HUMAN ) ||  ttt_wonCheck( board, PROGRAM ) || ttt_drawn_Game( board );
}
function ttt_evaluatePosition( board, player )
{
    var i, count = 0;
    for ( i = 0; i < board.length; i++ )
        if ( board[i] == BLANK )
            count++;

    count = 10 - count;
    var blank = 1.0;
    if ( board[4] == HUMAN && player == HUMAN )
        blank += 0.4;
    if ( board[4] == PROGRAM && player == PROGRAM )
        blank -= 0.4;

    if ( ttt_wonCheck( board, HUMAN ) )
        return blank + ( 1.0 / count );
    if ( ttt_wonCheck( board, PROGRAM ) )
        return -( blank + ( 1.0 / count ) );
    return blank - 1.0;
}
function ttt_possibleBoards( board, player )
{
    var count = 0, i;
    for ( i = 0; i < board.length; i++ )
        if ( board[i] == BLANK )
            count++;

    if ( count == 0 )
        return null;

    var boards = new Array( count );
    count = 0;
    for ( i = 0; i < board.length; i++ )
    {
        if ( board[i] != BLANK )
            continue;

        var b = new Array( board.length );
        for ( var j = 0; j < board.length; j++ )
            b[j] = board[j];
        b[i] = player;
        boards[count++] = b;
    } // end for i
    return boards;
}
function ttt_alphaBetaPrunning( depth, board, player, alpha, beta )
{
    var v;
    if ( ttt_reachedMaxDepth( board, player ) )
    {
        v = new Array(2);
        v[0] = ttt_evaluatePosition( board, player );
        v[1] = null;
        return v;
    }

    var i;
    var best = new Array();
    var boards = ttt_possibleBoards( board, player );
    for ( i = 0; i < boards.length; i++ )
    {
        v = ttt_alphaBetaPrunning( depth+1, boards[i], (player==HUMAN)?PROGRAM:HUMAN, -alpha, -beta );
        var value = v[0];
        if ( value > beta )
        {
            beta = value;
            best = new Array();
            best.push( boards[i] );
            for ( var j = 1; j < v.length; j++ )
                best.push( v[j] );
        } // end if
        if ( beta >= alpha )
            break;
    } // end for i

    v = new Array();
    v.push( beta );
    for ( i = 0; i < best.length; i++ )
        v.push( best[i] );
    return v;
}
function ttt_alphaBeta( depth, player, board )
{
    return ttt_alphaBetaPrunning( depth, board, player, 1000000, -1000000 );
}
function ttt_playGame()
{
    var player = HUMAN;
    while ( 1 == 1 )
    {
        if ( ttt_wonCheck( board, HUMAN ) )
        {
            alert( 'Human won' );
            break;
        }
        if ( ttt_wonCheck( board, PROGRAM ) )
        {
            alert( 'Program won' );
            break;
        }
        if ( ttt_drawn_Game( board ) )
        {
            alert( 'Drawn game' );
            break;
        }
        board = ttt_alphaBeta( 0, player, board );
        ttt_EmitBoard( board );
        player = (player==HUMAN) ? PROGRAM : HUMAN;
    } // end while
}

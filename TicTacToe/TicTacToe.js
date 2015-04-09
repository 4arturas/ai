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

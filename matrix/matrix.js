function matrix_Assert( t, msg )
{
    if ( !t ) alert( msg );
}
function matrix_Size( m )
{
    if ( matrix_IsSquared( m ) ) return matrix_Rows( m );
    return -1;
}
function matrix_Rows( m )
{
    return m.length;
}
function matrix_Cols( m )
{
    return m[0].length;
}
function matrix_Print( s )
{
    console.log( s );
}
function matrix_Emit( m )
{
    var rows = matrix_Rows( m );
    var cols = matrix_Cols( m );
    var s = '';
    for ( var r = 0; r < rows; r++ )
    {
        for ( var c = 0; c < cols; c++ )
        {
            s += m[r][c] + ' ';
        } // end for c
        s += '\n';
    } // end for r
    matrix_Print( s );
}
function matrix_Create( rows, cols )
{
    var m = new Array(rows);
    for ( var r = 0; r < rows; r++ )
        m[r] = new Array( cols );
    return m;
}

function matrix_Identity( rows, cols )
{
    var m = matrix_Create( rows, cols );
    for ( var r = 0; r < rows; r++ )
        for ( var c = 0; c < cols; c++ )
            m[r][c] = 0.0;
    for ( r = 0; r < rows; r++ )
        m[r][r] = 1.0;
    return m;
}

function matrix_ChangeSign( i )
{
    if ( i % 2 == 0 ) return 1;
    return -1;
}

function matrix_SubMatrix( m, exRow, exCol )
{
    var rows = matrix_Rows( m );
    var cols = matrix_Cols( m );
    var s = matrix_Create( rows-1, cols-1 );
    var rr = -1;
    for ( var r = 0; r < rows; r++ )
    {
        if ( r == exRow ) continue;
        rr++;
        var cc = -1;
        for ( var c = 0; c < cols; c++ )
        {
            if ( c == exCol ) continue;
            cc++;
            s[rr][cc] = m[r][c];
        } // end for c
    } // end for r
    return s;
}
function matrix_IsSquared( m )
{
    return matrix_Rows( m ) == matrix_Cols( m );
}
function matrix_Determinant( m )
{
    matrix_Assert( !matrix_IsSquared( m ), 'matrix must be squared' );
    var size = matrix_Size( m );
    if ( size == 1 )
        return m[0][0];
    if ( size == 2 )
        return m[0][0] * m[1][1] - m[0][1] * m[1][0];
    var s = 0.0;
    for ( var c = 0; c < matrix_Cols( m ); c++ )
    {
        s += matrix_ChangeSign( c ) * m[0][c] * matrix_Determinant( matrix_SubMatrix( m, 0, c ) );
    }
    return s;
}

function matrix_Test()
{

    var ident = matrix_Identity( 3, 3 );
    var sub = matrix_SubMatrix( ident, 0, 0 );
    // matrix_Emit( sub );

    var khan= [
    [-1,-2,2],
    [2,1,1],
    [3,4,5]
    ];

    alert( matrix_Cols(khan) );
    // var det = matrix_Determinant( khan );
    // matrix_Print( det );
}
matrix_Test();

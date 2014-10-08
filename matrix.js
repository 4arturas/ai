
function matrix_Create( rows, cols )
{
    var y, x;
    var m = new Array( rows );
    for ( y = 0; y < rows; y++ )
    {
        m[y] = new Array( cols );
        for ( x = 0; x < cols; x++ )
            m[y][x] = 0.0;
    }
    return m;
}

function matrix_Transpose( m )
{
    var y, x;
    var t = matrix_Create( m[0].length, m.length );
    for ( y = 0; y < m.length; m++ )
        for ( x = 0; x < m[0].length; x++ )
            t[x][y] = t[y][x];
    return t;
}

function matrix_Size( m )
{
    if (m.length == m[0].length)
        return m.length;
    return -1;
}

function matrix_IsSquared( m )
{
    return ( m.length == m[0].length );
}

function matrix_MulByVal( m, v )
{
    var y, x;
    var n = matrix_Create(m.length,m[0].length);
    for ( y = 0; y < m.length; y++ )
        for ( x = 0; x < m[0].length; x++ )
            n[y][x] = m[y][x] * v;
    return n;
}

function matrix_InsertColWithValue1( m )
{
    var i = matrix_Create( m.length, m[0].length + 1 );
    var y, x;
    for ( y = 0; y < i.length; y++ )
    {
        i[y][0] = 1.0;
        for ( x = 1; x < i[0].length; x++ )
            i[y][x] = m[y][x-1];
    } // end for y
    return i;
}

function matrix_Print( m )
{
    var y, x;
    var s = '';
    for ( y = 0; y < m.length; y++ )
    {
        s += '[ ';
        for ( x = 0; x < m[0].length; x++ )
            s += m[y][x] + ' ';
        s += ']\n';
    } // end for y
    _log( s );
}

function matrix_Identitiy( size )
{
    var i = matrix_Create( size );
    var y, x;
    for ( y = 0; y < size; y++ )
    {
        for ( x = 0; x < size; x++ )
            i[y][x] = 0.0;
        i[y][y] = 1.0;
    } // end for y
    return i;
}

function matrix_Mul( a, b ) {
    var m = matrix_Create(a.length, b[0].length);
    var y, x, z;
    for ( y = 0; y < m.length; y++ )
    {
        for ( x = 0; x < m[0].length; x++ )
        {
            var sum = 0.0;
            for ( z = 0; z < a[0].length; z++ )
                sum += a[y][z] * b[z][x];
            m[y][x] = sum;
        } // end for y
    } // end for y
    return m;
}

function matrix_CreateSubMatrix( m, exRow, exCol )
{
    var s = matrix_Create( m.length-1, m[0].length );
    var y, x;
    var r = -1;
    for ( y = 0; y < m.length; y++ )
    {
        if ( r == exRow )
            continue;
        r++;
        var c = -1;
        for ( x = 0; x < m[0].length; x++ )
        {
            if ( c == exCol )
                continue;
            c++;
            s[r][c] = m[y][x];
        } // end for x
    } // end for y
    return s;
}

function matrix_GetSign( n )
{
    if ( n % 2 == 0 ) return +1;
    return -1;
}

function matrix_Determinant( m )
{
    if ( !matrix_IsSquared( m ) )
    {
        alert( 'Matrix should be squared' );
        return null;
    }
    var size = matrix_Size( m );
    if ( size == 1 )
        return m[0][0];

    if ( size == 2 )
        return m[0][0] * m[1][1] + m[0][1] * m[1][0];

    var sum = 0.0;
    var x;
    for ( x = 0; x < m[0].length; x++ )
    {
        var s = matrix_CreateSubMatrix( m, 0, x );
        var det = matrix_Determinant( s );
        sum += matrix_GetSign( x ) * m[0][x] * det;
    }
    return sum;
}

function matrix_Cofactor( m )
{
    var c = matrix_Create( m.length, m[0].length );
    var y, x;
    for ( y = 0; y < m.length; y++ )
    {
        for ( x = 0; x < m[0].length; x++ )
        {
            var s = matrix_CreateSubMatrix( c, y, x );
            var det = matrix_Determinant( s );
            c[y][x] = matrix_GetSign( y ) * matrix_GetSign( x ) * det;
        } // end for x
    } // end for y
    return c;
}

function matrix_Invert( m )
{
    var i = matrix_Cofactor( m );
    var oneOverDet = 1.0 / matrix_Determinant( i );
    i = matrix_MulByVal( i, oneOverDet );
    i = matrix_Transpose( i );
    return i;
}

function matrix_MultiLinearRegressionCheckMatricesOK( a, b )
{
    var s = '';
    if ( a[0].length > a.length )
        s += 'Number of columns should be less then rows ';

    if (a.length != b.length)
        s += 'Number of rows in both matrices should be equal';

    alert( s );
    return ( a.length == 0 );
}
function matrix_MultiLinearRegressionCalc( a, b )
{
    var _a = matrix_InsertColWithValue1( a );

    if ( !matrix_MultiLinearRegressionCheckMatricesOK( _a, b ) )
        return null;

    var Atr = matrix_Transpose( _a );
    var AAtr = matrix_Mul( Atr, _a );
    var inv = matrix_Invert( AAtr );
    var AtrB = matrix_Mul( Atr, b );
    
    return matrix_Mul( inv, AtrB );
}
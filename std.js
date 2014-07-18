function std( numbers )
{
    var y;
    var m = numbers.length;
    var tmp;
    var deviations = new Array( m );
    var squares = new Array( m );

    var mean = 0.0;

    for ( y = 0; y < m; y++ )
        mean += numbers[y];
    mean /= m;

    for ( y = 0; y < m; y++ )
        deviations[y] = numbers[y] - mean;

    for ( y = 0; y < m; y++ )
        squares[y] = deviations[y] * deviations[y];

    tmp = 0.0;
    for ( y = 0; y < m; y++ )
        tmp += squares[y];


    tmp = tmp / ( m - 1 );
    tmp = Math.sqrt( tmp );
    return tmp;
}

function std_Test()
{
    var numbers = [23.0, 92.0, 46.0, 55.0, 63.0, 94.0, 77.0, 38.0, 84.0, 26.0];
    var _std = std( numbers );
//    26.423053907105018
    alert( _std );
}
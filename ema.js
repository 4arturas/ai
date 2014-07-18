function ema( numbers, N )
{
    var m = numbers.length;
    var w = 2.0 / ( N - 1 );
    var e = new Array( m );
    var y;
    e[0] = numbers[0];
    for ( y = 1; y < m; y++ )
        e[y] = w * ( numbers[y] - e[y-1] ) + e[y-1];
    return e;
}

function ema_Test()
{
    var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var e = ema( numbers, 10 );
    var s = '';
    var y;
    for ( y = 0; y < numbers.length; y++ )
        s += e[y] + ', ';
    console.log( s );
}
function forward_MultiplyGate( x, y )
{
    return x * y;
}

function article1()
{
    var x = -2, y = 3;
    var bestOut = -Infinity;
    var bestX = x;
    var bestY = y;
    var tweekAmount = 0.01;
    var i;

    for ( i = 0; i < 100; i++ )
    {
        var xTry = x + tweekAmount * ( Math.random() * 2 - 1 );
        var yTry = y + tweekAmount * ( Math.random() * 2 - 1 );
        var out = forward_MultiplyGate( xTry, yTry );
        if ( out > bestOut )
        {
            bestOut = out;
            bestX = xTry;
            bestY = yTry;
        }
    } // end for i
    console.log( 'article1: bestOut=' + bestOut + ' bestX=' + bestX + ' bestY=' + bestY );
}
article1();



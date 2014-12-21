function forward_MultiplyGate( x, y )
{
    return x * y;
}

function article1()
{
    var x = -2, y = 3;
    var tweakAmount = 0.01;
    var bestOut = -Infinity;
    var xBest = x, yBest = y;
    var out;
    var i;
    for ( i = 0; i < 100; i++ )
    {
        var xTry = x + tweakAmount * ( Math.random() * 2 - 1 );
        var yTry = y + tweakAmount * ( Math.random() * 2 - 1 );
        out = forward_MultiplyGate( xTry, yTry );
        if ( out > bestOut )
        {
            bestOut = out;
            xBest = xTry;
            yBest = yTry;
        }
    } // end for i
    console.log( bestOut + ' ' + xBest + ' ' + yBest );
}
article1();

function article2()
{
    var x = -2, y = 3;
    var h = 0.0001;
    var out = forward_MultiplyGate( x, y );

    var out1 = forward_MultiplyGate( x + h, y );
    var xDerivative = ( out1 - out ) / h;

    var out2 = forward_MultiplyGate( x, y + h );
    var yDerivative = ( out2 - out ) / h;

    var stepSize = 0.01;
    x = x + stepSize * xDerivative;
    y = y + stepSize * yDerivative;
    var outNew = forward_MultiplyGate( x, y );
}
article2();

function article3()
{
    var x = -2, y = 3;
    var out = forward_MultiplyGate( x, y );
    var xGradient = y;
    var yGradient = x;

    var stepSize = 0.01;
    x = x + stepSize * xGradient;
    y = y + stepSize * yGradient;
    var outNew = forward_MultiplyGate( x, y );
}
article3();



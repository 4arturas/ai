function forward_MultiplyGate( x, y )
{
    return x * y;
}

//////////////////////////////////////////////
/// Стратегия №1: Произвольный локальный поиск
/// http://habrahabr.ru/company/paysto/blog/244723/
//////////////////////////////////////////////
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

function article1a()
{
    var x = -2, y = 3;
    var tweakAmount = 0.01;
    var out;
    var outBest = -Infinity;
    var xBest = x, yBest = y;
    var i;
    var xTry, yTry;
    for ( i = 0; i < 100; i++ )
    {
        xTry = x + tweakAmount * ( Math.random() * 2 - 1 );
        yTry = y + tweakAmount * ( Math.random() * 2 - 1 );
        out = forward_MultiplyGate( xTry, yTry );
        if ( out > outBest )
        {
            outBest = out;
            xBest = xTry;
            yBest = yTry;
        }
    } // end for i
    console.log( outBest + ' ' + xBest + ' ' + yBest );
}
article1a();

//////////////////////////////////////////////
/// Стратегия №2: Числовой градиент
/// http://habrahabr.ru/company/paysto/blog/244935/
//////////////////////////////////////////////
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

function article2a()
{

}

//////////////////////////////////////////////
/// Стратегия №3: Аналитический градиент
/// http://habrahabr.ru/company/paysto/blog/245051/
//////////////////////////////////////////////
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

//////////////////////////////////////////////
/// Схемы с несколькими логическими элементами
/// Обратное распространение ошибки
/// http://habrahabr.ru/company/paysto/blog/245403/
//////////////////////////////////////////////


//////////////////////////////////////////////
/// Шаблоны в «обратном» потоке
/// Пример "Один нейрон"
/// http://habrahabr.ru/company/paysto/blog/246093/
//////////////////////////////////////////////

//////////////////////////////////////////////
/// Становимся мастером обратного распространения ошибки
/// http://habrahabr.ru/company/paysto/blog/246397/
//////////////////////////////////////////////



function _log( l )
{
    console.log( l );
}
function _randomReal( x, y )
{
    return Math.random() * ( y - x ) + x
}
function _randomInt( x, y )
{
    return Math.floor(
            Math.random() * ( y - x + 1 ) + x
    );
}
function _clone_JSon( o )
{
    return JSON.parse(JSON.stringify(o));
}
function _min( x, y )
{
    return x < y ? x : y;
}
function _max( x, y )
{
    return x > y ? x : y;
}

function _assert( a, msg )
{
    if ( !a )
    {
        alert( '!Assert: ' + msg );
//        console.log(msg);
    }
}

function _swap( x, y )
{
    var tmp = x;
    x = y;
    y = tmp;
    return [ x, y ];
}

function _abs( v )
{
    return Math.abs( v );
}


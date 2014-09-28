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
function _cloneJSon( o )
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
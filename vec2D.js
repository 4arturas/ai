function vec2D_Create( x, y )
{
    return { x: x, y: y };
//        return { x: Math.floor(x), y: Math.floor(y) };
}
function vec2D_Equal( a, b )
{
    return ( a.x == b.x && a.y == b.y );
}
function vec2D_Log( v )
{
    _log( 'v.x='+ v.x + ' v.y='+ v.y);
}
function vec2D_LogTxt( txt, v )
{
    _log( txt + ' v.x='+ v.x + ' v.y='+ v.y);
}
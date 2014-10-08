function vec2D_Create( x, y )
{
    return { x: x, y: y };
//        return { x: Math.floor(x), y: Math.floor(y) };
}
function vec2D_Equal( a, b )
{
    return ( a.x == b.x && a.y == b.y );
}

function vec2D_Dot( a, b )
{
    return (a.x * b.x) + (a.y * b.y);
}

function vec2D_Length( v )
{
    return Math.sqrt( vec2D_Dot( v, v ) );
}

function vec2D_Normalize( v )
{
    var oneOverLength = 1.0 / vec2D_Length( v );
    return vec2D_Create( (v.x*oneOverLength), (v.y*oneOverLength) );
}
function vec2D_Add( a, b )
{
    return vec3D_Create(
            a.x+b.x, a.y+b.y
    );
}
function vec2D_DivScalar( a, s )
{
    return vec2D_Create(
            a.x/s, a.y/s
    );
}

function vec2D_Truncate( v, maxVal )
{
    var l = vec2D_Length( v );
    if ( l > maxVal )
        return vec2D_Normalize( v );
    return v;
}

function vec2D_Log( v )
{
    _log( 'v.x='+ v.x + ' v.y='+ v.y);
}
function vec2D_LogTxt( txt, v )
{
    _log( txt + ' v.x='+ v.x + ' v.y='+ v.y);
}


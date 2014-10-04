function line_BreshamAssertInts( n )
{
    var reminder = n - Math.floor( n );
    _assert( ( reminder == 0 ), 'line_BreshamSimple: only integers allowed reminder = ' + reminder );
}

function line_Bresham( vb, x0, y0, x1, y1, color )
{
    var dx, dy;
    var dx2, dy2;
    var err;
    var xinc, yinc;
    var i;
    var ptr;

    line_BreshamAssertInts( x0 );
    line_BreshamAssertInts( x1 );
    line_BreshamAssertInts( y0 );
    line_BreshamAssertInts( y1 );

    ptr = x0 + y0 * vb.width;

    dx = x1 - x0;
    dy = y1 - y0;

    if ( dx >= 0 )
        xinc = 1;
    else
    {
        xinc = -1;
        dx = -dx;
    }

    if ( dy >= 0 )
        yinc = vb.width;
    else
    {
        yinc = -vb.width;
        dy = -dy;
    }

    dx2 = dx << 1;
    dy2 = dy << 1;

    if ( dx > dy )
    {
        err = dy2 - dx;
        for ( i = 0; i < dx; i++ )
        {
            videobuff_SetPixel( vb, ptr, color );
            if ( err > 0 )
            {
                err -= dx2;
                ptr += yinc;
            }
            err += dy2;
            ptr += xinc;
        } // end for i
    }
    else
    {
        err = dx2 - dy;
        for ( i = 0; i < dy; i++ )
        {
            videobuff_SetPixel( vb, ptr, color );
            if ( err > 0 )
            {
                err -= dy2;
                ptr += xinc;
            }
            err += dx2;
            ptr += yinc;
        } // end for i
    }
}

function line_BreshamSimple( videobuff, x0, y0, x1, y1, color/*pixel*/ )
{
    var dx, dy;
    var dx2, dy2;
    var err;
    var xinc, yinc;
    var ptr;
    var i;

    line_BreshamAssertInts( x0 );
    line_BreshamAssertInts( x1 );
    line_BreshamAssertInts( y0 );
    line_BreshamAssertInts( y1 );

    if ( x0 > x1 )
    {
        x0 ^= x1;
        x1 ^= x0;
        x0 ^= x1;
    }
    if ( y0 > y1 )
    {
        y0 ^= y1;
        y1 ^= y0;
        y0 ^= y1;
    }

    ptr = x0 + y0 * videobuff.width;

    xinc = 1;
    yinc = videobuff.width;

    dx = x1 - x0;
    dy = y1 - y0;
    dx2 = dx << 1;
    dy2 = dy << 1;

    err = dy2 - dx;
    for ( i = 0; i < dx; i++ )
    {
        videobuff_SetPixel( videobuff, ptr, color );
        if ( err > 0 )
        {
            err -= dx2;
            ptr += yinc;
        }
        err += dy2;
        ptr += xinc;
    } // end for i
}

var CC_NORTH = 0x08;
var CC_SOUTH = 0x04;
var CC_EAST = 0x02;
var CC_WEST = 0x01;
var CC_NORTH_EAST = (CC_NORTH|CC_EAST);
var CC_NORTH_WEST = (CC_NORTH|CC_WEST);
var CC_SOUTH_EAST = (CC_SOUTH|CC_EAST);
var CC_SOUTH_WEST = (CC_SOUTH|CC_WEST);
function line_GetClipCode( vb, x, y )
{
    var cc = 0;
    if ( x < vb.minx )
        cc |= CC_EAST;
    else if ( x > vb.maxx )
        cc |= CC_WEST;

    if ( y < vb.miny )
        cc |= CC_NORTH;
    else if ( y > vb.maxy )
        cc |= CC_SOUTH;
    return cc;
}

function line_Trim( vb, x, y, xOverY, yOverX, clipCode )
{
    var xc, yc;
    switch ( clipCode )
    {
        case CC_NORTH:
            yc = vb.miny;
            xc = x + ( yc - y ) * xOverY;
            break;
        case CC_SOUTH:
            yc = vb.maxy;
            xc = x + ( yc - y ) * xOverY;
            break;
        case CC_EAST:
            xc = vb.minx;
            yc = y + ( xc - x ) * yOverX;
            break;
        case CC_WEST:
            xc = vb.maxx;
            yc = y + ( xc - x ) * yOverX;
            break;
        default:
//            _assert( (1==0), 'line_Trim: Not defined clip code' );
            return [ x, y ];
    }
    var a = (xc >= vb.minx && vb.maxx > xc) && (yc >= vb.miny && vb.maxy > yc);
    _assert( a, 'line_Trim: point is not inside a videobuff' );
    return [ xc, yc ];
}

function line_Draw( vb, x0, y0, x1, y1, color/*pixel*/ )
{
    var clipCode0, clipCode1;
    var xy0, xy1;

    clipCode0 = line_GetClipCode( vb, x0, y0 );
    clipCode1 = line_GetClipCode( vb, x1, y1 );

    console.log( clipCode0 );
    console.log( clipCode1 );

    if ( clipCode0 == 0 && clipCode1 == 0 )
    {
        line_BreshamSimple( vb, x0, y0, x1, y1, color );
        return;
    }

    var xOverY = (x1-x0)/(y1-y0);
    var yOverX = (y1-y0)/(x1-x0);

    xy0 = line_Trim( vb, x0, y0, xOverY, yOverX, clipCode0 );
    xy1 = line_Trim( vb, x1, y1, xOverY, yOverX, clipCode1 );

    x0 = Math.floor( xy0[0] );
    y0 = Math.floor( xy0[1] );
    x1 = Math.floor( xy1[0] );
    y1 = Math.floor( xy1[1] );

    line_Bresham( vb, x0, y0, x1, y1, color );
}
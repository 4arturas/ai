function line_BreshamAssertInts( n )
{
    var reminder = n - Math.floor( n );
    _assert( ( reminder == 0 ), 'line_Bresham: only integers allowed reminder = ' + reminder );
}

function line_Log( x0, y0, x1, y1 )
{
    var strFn = 'line_Draw(vb, '+x0+', '+y0+', '+x1+', '+y1+', p);';
    console.log( strFn );
}

function line_Bresham( vb, x0, y0, x1, y1, color )
{
    var dx, dy;
    var dx2, dy2;
    var err;
    var xinc, yinc;
    var i;
    var ptr;

//    line_Log( x0, y0, x1, y1 );

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
//            console.log( 'N' );
            break;
        case CC_SOUTH:
            yc = vb.maxy;
            xc = x + ( yc - y ) * xOverY;
//            console.log( 'S' );
            break;
        case CC_EAST:
            xc = vb.minx;
            yc = y + ( xc - x ) * yOverX;
//            console.log( 'E' );
            break;
        case CC_WEST:
            xc = vb.maxx;
            yc = y + ( xc - x ) * yOverX;

//            console.log( 'W' );
            break;

        case CC_NORTH_EAST:
            yc = vb.miny;
            xc = x * ( yc - y ) * xOverY;
            if ( vb.minx > xc || xc >= vb.maxx )
            {
                xc = vb.minx;
                yc = y + ( xc - x ) * yOverX;
            }
//            console.log( 'NE' );
            break;

        case CC_NORTH_WEST:
            yc = vb.miny;
            xc = x + ( yc - y ) * xOverY;
            if ( vb.minx > xc || xc >= vb.maxx )
            {
                xc = vb.maxx;
                yc = y + ( xc - x ) * xOverY;
            }
//            console.log( 'NW' );
            break;

        case CC_SOUTH_EAST:
            yc = vb.maxy;
            xc = x + ( yc - y ) * xOverY;
            if ( vb.minx > xc || xc >= vb.maxx )
            {
                xc = vb.minx;
                yc = y + ( xc - x ) * yOverX;
            }
//            console.log( 'SE' );
            break;

        case CC_SOUTH_WEST:
            yc = vb.maxy;
            xc = x + ( yc - y ) * xOverY;
            if ( vb.minx > xc || xc >= vb.maxx )
            {
                xc = vb.maxx;
                yc = y + ( xc - x ) * xOverY;
            }
//            console.log( 'SW' );
            break;

        default:
//            _assert( (1==0), 'line_Trim: Not defined clip code' );
            return [ x, y ];
    }
//    console.log( xc );
//    console.log( yc );
    return [ xc, yc ];
}

function line_Draw( vb, x0, y0, x1, y1, color/*pixel*/ )
{
    var clipCode0, clipCode1;
    var xy0, xy1;

    clipCode0 = line_GetClipCode( vb, x0, y0 );
    clipCode1 = line_GetClipCode( vb, x1, y1 );

//    if ( clipCode0 & clipCode1 ) return;

    if ( clipCode0 == 0 && clipCode1 == 0 )
    {
        x0 = Math.floor( x0 );
        y0 = Math.floor( y0 );
        x1 = Math.floor( x1 );
        y1 = Math.floor( y1 );
        line_Bresham( vb, x0, y0, x1, y1, color );
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

    var a0 = (x0 >= vb.minx && vb.maxx >= x0) && (y0 >= vb.miny && vb.maxy >= y0);
    var a1 = (x1 >= vb.minx && vb.maxx >= x1) && (y1 >= vb.miny && vb.maxy >= y1);
//    _assert( a0, 'line_Trim: point is not inside a videobuff' );
//    _assert( a1, 'line_Trim: point is not inside a videobuff' );

    if ( !a0 || !a1 ) return;

    line_Bresham( vb, x0, y0, x1, y1, color );
}


function line_Test( vb )
{
    var s = 50;
    var p;
    var x0;
    var y0;
    var x1;
    var y1;
    var i;

    for ( i = 0; i < 300; i++ )
    {
        p = pixel_Create(_rnd_Int(0, 255), _rnd_Int(0, 255), _rnd_Int(0, 255));
        x0 = _rnd_Int(-s, s);
        y0 = _rnd_Int(-s, s);
        x1 = _rnd_Int(-s, s);
        y1 = _rnd_Int(-s, s);
        line_Log( x0, y0, x1, y1 );
        line_Draw(vb, x0, y0, x1, y1, p);
    } // end for i
}
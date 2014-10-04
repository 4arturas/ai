function videobuff_Create( width, height, bgColor )
{
    var i;
    var size = height*width;
    var buff = new Array( size );
    var zbuff = new Array( size );
    for ( i = 0; i < size; i++ )
    {
        buff[i] = bgColor;
    } // end for y

    var videobuff = {
        size: (height*width),
        width: width, height: height,
        minx: 0, maxx: (width-1), miny: 0, maxy: (height-1),
        bgColor: bgColor,
        buff: buff, zbuff: zbuff
    };
    _assert( (videobuff.size==size), 'videobuff_Create' );
    return videobuff;
}

function videobuff_Clear( videobuff )
{
    var i;
    for ( i = 0; i < videobuff.size; i++ )
    {
        videobuff.buff[i] = videobuff.bgColor;
    } // end for y
}

function videobuff_SetPixel( videobuff, ptr, pixel )
{
    _assert( (ptr >= 0 && videobuff.size > ptr), 'videobuff_SetPixel: wrong ptr = ' + ptr );
    videobuff.buff[ptr] = pixel;
}

function videobuff_SetYXPixel( videobuff, y, x, pixel )
{
    var ptr = y *videobuff.width + x;
    videobuff_SetPixel( videobuff, ptr, pixel );
}



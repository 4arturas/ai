function videobuff_Create( width, height, bgColor )
{
    var y, x;
    var buff = new Array( height );
    var zbuff = new Array( height );
    for ( y = 0; y < height; y++ )
    {
        buff[y] = new Array(width);
        zbuff[y] = new Array(width);
        for ( x = 0; x < width; x++ )
        {
            buff[y][x] = bgColor;
        } // end for x
    } // end for y

    var videobuff = {
        width: width, height: height,
        minx: 0, maxx: width-1, miny: 0, miny: height-1,
        bgColor: bgColor,
        buff: buff, zbuff: zbuff
    };
    return videobuff;
}

function videobuff_Clear( videobuff )
{
    var y, x;
    for ( y = 0; y < videobuff.height; y++ )
    {
        for ( x = 0; x < videobuff.width; x++ )
        {
            videobuff.buff[y][x] = videobuff.bgColor;
        } // end for x
    } // end for y
}

function videobuff_SetPixel( videobuff, y, x, pixel )
{
    videobuff.buff[y][x] = pixel;
}



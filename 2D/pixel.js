function pixel_Create( r, g, b )
{
    var pixel = {
        r: r, g: g, b: b, a: 255
    };
    return pixel;
}

var gPixelRed = pixel_Create( 255, 0, 0 );
var gPixelGreen = pixel_Create( 0, 255, 0 );
var gPixelBlue = pixel_Create( 0, 0, 255 );

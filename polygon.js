function polygon_CreateRandom( tops )
{
    var x, y;
    var i;
    var v0, v1;
    var _y = 0;
    var polygon = [];

    x = 0;
    polygon.push( vec2D_Create( x, _y ) );
    for ( i = 0; i < tops; i++ )
    {
        y = _y - _rnd_Real( 20, 100 );

        // vertical
        v0 = vec2D_Create( x, y );
        // horizontal
        x += _rnd_Real( 20, 30 );
        v1 = vec2D_Create( x, y );
        polygon.push( v0 );
        polygon.push( v1 );
    } // end for i
    polygon.push( vec2D_Create( x, _y ) );

    return polygon;
}

function polygon_Center( polygon )
{
    var v0;
    var i;
    var center = vec2D_Create( 0, 0 );
    for ( i = 0; i < polygon.length; i++ )
    {
        v0 = polygon[i];
        center.x += v0.x;
        center.y += v0.y;

    } // end for i
    center.x /= polygon.length;
    center.y /= polygon.length;
    return center;
}

function polygon_Shift( polygon, shiftX, shiftY )
{
    var i;
    for ( i = 0; i < polygon.length; i++ )
    {
        polygon[i].x += shiftX;
        polygon[i].y += shiftY;
    } // end for i
}

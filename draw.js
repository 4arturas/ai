function draw_Line( ctx, x0, y0, x1, y1 )
{
    ctx.moveTo(x0,y0);
    ctx.lineTo(x1,y1);
    ctx.stroke();
}
function draw_Point( ctx, p, size )
{
    ctx.beginPath();
    ctx.arc(p.x, p.y,size,0,2*Math.PI);
    ctx.stroke();
//    ellipse(p.x, p.y, size, size );
}
function draw_Points( p, size )
{
    var i;
    for ( i = 0; i < p.length; i++ )
        ellipse(p[i].x, p[i].y, size, size );
}
//function draw_Line( p0, p1 )
//{
//    line( p0.x, p0.y, p1.x, p1.y );
//}
function draw_Poly( ctx, poly )
{
    var i;
    var p0, p1;
    for ( i = 0; i < poly.length-1; i++ )
    {
        p0 = poly[i];
        p1 = poly[i+1];
        draw_Line( ctx, p0.x, p0.y, p1.x, p1.y );
    }
    p0 = poly[i];
    p1 = poly[0];
    draw_Line( ctx, p0.x, p0.y, p1.x, p1.y );
}

function draw_Polygon( polygon )
{
    var i;
    var v0, v1;
    textSize( 20 );
    for ( i = 0; i < polygon.length-1; i++ )
    {

        v0 = polygon[i];
//            text('' + i, v0.x, v0.y );
        v1 = polygon[i+1];
//            text('' + (i+1), v1.x, v1.y );
        if ( v0.x == v1.x )
//                stroke( 255, 0, 0 );
            stroke( 220, 220, 220 );
        else
//                stroke( 0, 0, 255 );
            stroke( 220, 220, 220 );
        line( v0.x, v0.y, v1.x, v1.y );
    } // end for i

    v0 = polygon[i];
//            text('' + i, v0.x, v0.y );
    v1 = polygon[0];
    if ( v0.x == v1.x )
//            stroke( 255, 0, 0 );
        stroke( 220, 220, 220 );
    else
//            stroke( 0, 0, 255 );
        stroke( 220, 220, 220 );
    line( v0.x, v0.y, v1.x, v1.y );
}
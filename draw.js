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
}

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
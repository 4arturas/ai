function poly_Create()
{
    return {
        attr: 0,
        state: 0,
        color: null,
        normal: null,
        vidx: [null,null,null],
        tidx: [null,null,null]
    };
}

function polyr_Create()
{
    var i;
    var vertxList = new Array( 3 );
    for ( i = 0; i < 3; i++ )
        vertxList[i] = vertex_Create();
    return {
        attr: 0,
        state: 0,
        color: null,
        vertex: vertxList
    };
}

function polyr_Draw( vb, poly )
{
    var vv0, vv1, vv2;
    var v0, v1, v2;

    var x0, y0, z0;
    var x1, y1, z1;
    var x2, y2, z2;

    var xl, xr, zl, zr;

    var dxdyl, dxdyr;
    var dzdyl, dzdyr;
    var dxdy, dzdy;

    var dx, dy, dz;
    var xi, yi, zi;
    var ystart, yend, xstart, xend;

    var swap;

    var buffStartPtr;

    var x, y, z;

    vv0 = 0; vv1 = 1; vv2 = 2;

    if ( poly.vertex[vv1].v.y < poly.vertex[vv0].v.y )
    {
        swap = _swap(vv0, vv1);
        vv0 = swap[0];
        vv1 = swap[1];
    }
    if ( poly.vertex[vv2].v.y < poly.vertex[vv0].v.y )
    {
        swap = _swap(vv0, vv2);
        vv0 = swap[0];
        vv2 = swap[1];
    }
    if ( poly.vertex[vv2].v.y < poly.vertex[vv1].v.y )
    {
        swap = _swap(vv1, vv2);
        vv1 = swap[0];
        vv2 = swap[1];
    }

    v0 = poly.vertex[vv0].v;
    v1 = poly.vertex[vv1].v;
    v2 = poly.vertex[vv2].v;

    x0 = v0.x;
    x1 = v1.x;
    x2 = v2.x;

    y0 = v0.y;
    y1 = v1.y;
    y2 = v2.y;

    z0 = v0.z;
    z1 = v1.z;
    z2 = v2.z;

    // LHS
    dxdyl = x1 - x0;
    if ( y1 != y0 )
    {
        dy = y1 - y0;
        dxdyl /= dy;
    }
    // RHS
    dxdyr = x2 - x0;
    if ( y2 != y0 )
    {
        dy = y2 - y0;
        dxdyr /= dy;
    }

    if ( vb.miny > y0 )
    {
        dy = vb.miny - y0;
        xl = dxdyl * dy + x0;
        xr = dxdyr * dy + x0;
        ystart = vb.miny;
    }
    else
    {
        xl = x0;
        xr = x0;
        ystart = y0;
    }

    buffStartPtr = Math.floor(ystart * vb.width);

    if ( y1 > vb.maxy )
        yend = vb.maxy;
    else
        yend = y1;

    if ( dxdyl > dxdyr ) // RHS
    {
        swap = _swap( dxdyl, dxdyr );
        dxdyl = swap[0];
        dxdyr = swap[1];

        swap = _swap( xl, xr );
        xl = swap[0];
        xr = swap[1];

        dxdy = dxdyr;
        dzdy = dzdyr;
        x = xr;
        z = zr;
    }
    else // LHS
    {
        dxdy = dxdyl;
        dzdy = dzdyl;
    }

    for ( yi = ystart; yi < yend; yi++ )
    {
        xstart = Math.floor(xl);
        xend = Math.floor(xr);

        for ( xi = xstart; xi < xend; xi++ )
        {
            videobuff_SetPixel( vb, (buffStartPtr+xi), poly.color );
            console.log( Math.floor(xi) );
        } // end for xi
        xl += dxdyl;
        xr += dxdyr;
        buffStartPtr += vb.width;
    } // end for yi
}

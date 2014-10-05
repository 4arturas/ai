
function object_Create( numVerts, numPolys )
{
    var i;
    var vertexList = new Array( numVerts );
    var polyList = new Array( numPolys );

    for ( i = 0; i < numVerts; i++ )
        vertexList[i] = vertex_Create();

    for ( i = 0; i < numPolys; i++ )
        polyList[i] = poly_Create();

    return {
        attr: null,
        state: null,
        color: null,

        maxRadius: null,
        avgRadius: null,

        matrix: null,

        numVerts: numVerts,
        vertexList: vertexList,

        numPolys: numPolys,
        polyList: polyList
    };
}

function object_Radius( obj )
{
    var vert;
    var l;
    obj.avgRadius = 0.0;
    obj.maxRadius = Number.MIN_VALUE;
    for ( vert = 0; vert < obj.numVerts; vert++ )
    {
        l = vec3D_Length( obj.vertexList[vert].v );
        if ( l > obj.maxRadius )
            obj.maxRadius = l;
        obj.avgRadius += l;
    } // end for vert
    obj.avgRadius /= obj.numVerts;
//    _log( 'avgRadius=' + obj.avgRadius );
//    _log( 'maxRadius=' + obj.maxRadius );
}

function object_CreateQuad( height, width, rows, cols )
{
    var r, c, i, poly;
    var vcol, vrow;

    var v0, v1, v2;

    var numVerts = rows*cols;
    var numPolys = (rows-1)*(cols-1)*2;

    var obj = object_Create( numVerts, numPolys );

    vrow = (height)/(rows-1);
    vcol = (width)/(cols-1);

    i = 0;
    for ( r = 0; r < rows; r++ )
    {
        for ( c = 0; c < cols; c++ )
        {
            i = r * rows + c;
            obj.vertexList[i].v.x = c * vcol - ( width*0.5 );
            obj.vertexList[i].v.y = r * vrow - ( height*0.5 );
            obj.vertexList[i].v.z = 0.0;
        } // end for c
    } // end for r

    for ( poly = 0; poly < (obj.numPolys/2); poly++ )
    {
        i = (poly % (cols-1) ) + cols * ( poly / (cols-1) );

        v0 = i;
        v1 = i + cols;
        v2 = i + cols + 1;
        obj.polyList[i*2].vidx[0] = v0;
        obj.polyList[i*2].vidx[1] = v1;
        obj.polyList[i*2].vidx[2] = v2;
//        obj.polyList[i*2].tidx[0] = v0;
//        obj.polyList[i*2].tidx[1] = v1;
//        obj.polyList[i*2].tidx[2] = v2;


        v0 = i;
        v1 = i + cols + 1;
        v2 = i + 1;
        obj.polyList[i*2+1].vidx[0] = v0;
        obj.polyList[i*2+1].vidx[1] = v1;
        obj.polyList[i*2+1].vidx[2] = v2;
//        obj.polyList[i*2+1].tidx[0] = v0;
//        obj.polyList[i*2+1].tidx[1] = v1;
//        obj.polyList[i*2+1].tidx[2] = v2;

        var vidx0 = obj.polyList[i*2];
        var vidx1 = obj.polyList[i*2+1];
        vidx0 = vidx0;
        vidx1 = vidx1;
    } // end for poly

    object_Radius( obj );
    obj.matrix = mat4x3_CreateIdentity();

    return obj;
}

function renderer_Create( polygonListSize )
{
    var i;
    var plist = new Array( polygonListSize );
    for ( i = 0; i < polygonListSize; i++ )
        plist[i] = polyr_Create();

    return {
        numPolys: 0,
        polygonListSize: polygonListSize,
        plist: plist
    };
}

function renderer_Reset( rl )
{
    rl.numPolys = 0;
}

function renderer_CameraCull( rl, obj, cam )
{
    var zTest;
    var t = vec3D_Create( obj.matrix.tx, obj.matrix.ty, obj.matrix.tz );
    var pos = mat4x3_MulVec( cam.matrix, t );

    vec3D_Log( pos );
//    _log( obj.maxRadius );

    _log( cam.nearClipZ );
    _log( pos.z+obj.maxRadius );
    _log( '*****' );

    _log( cam.farClipZ );
    _log( pos.z-obj.maxRadius );
    _log( '*****' );

    _log( obj.maxRadius );

    _log ( cam.nearClipZ > (pos.z+obj.maxRadius) || (pos.z-obj.maxRadius) > cam.farClipZ );

    if ( cam.nearClipZ > (pos.z+obj.maxRadius) || (pos.z-obj.maxRadius) > cam.farClipZ )
        return 0;

    console.log( 22222 );
    zTest = pos.x * cam.zFzctorX;
    if ( -zTest > (pos.x+obj.maxRadius) || (pos.x-obj.maxRadius) > zTest )
        return 0;

    zTest = pos.y * cam.zFactorY;
    if ( -zTest > (pos.y+obj.maxRadius) || (pos.y-obj.maxRadius) > zTest )
        return 0;

    return 1;
} // renderer_CameraCull

var CC_G = 0x01;
var CC_L = 0x02;
var CC_I = 0x04;
function renderer_AddObject( rl, obj, cam )
{
    var pidx;

    var polyr_Ptr, polyr2Ptr;

    var polyPtr;

    var v0, v1, v2;
    var vert0, vert1, vert2;

    _assert( (rl.polygonListSize > rl.numPolys), 'renderer_AddObject: (rl.polygonListSize > rl.numPolys)');

    for ( pidx = 0; pidx < obj.numPolys; pidx++ )
    {
        polyr_Ptr = rl.plist[pidx];
        polyr_Ptr.color = obj.color;

        // transform to world
        {
            polyPtr = obj.polyList[pidx];
            v0 = mat4x3_MulVec( obj.matrix, obj.vertexList[polyPtr.vidx[0]].v );
            v1 = mat4x3_MulVec( obj.matrix, obj.vertexList[polyPtr.vidx[1]].v );
            v2 = mat4x3_MulVec( obj.matrix, obj.vertexList[polyPtr.vidx[2]].v );

        } // end transform to world

        // transform to camera
        {
            rl.plist[pidx].vertex[0].v  = mat4x3_MulVec( cam.matrix, v0 );
            rl.plist[pidx].vertex[1].v  = mat4x3_MulVec( cam.matrix, v1 );
            rl.plist[pidx].vertex[2].v  = mat4x3_MulVec( cam.matrix, v2 );

//            vec3D_Log( v0 );
//            vec3D_Log( v1 );
//            vec3D_Log( v2 );
        } // end transform to camera

//        vec3D_Log(rl.plist[pidx].vertex[0].v );
//        vec3D_Log(rl.plist[pidx].vertex[1].v );
//        vec3D_Log(rl.plist[pidx].vertex[2].v );


        rl.numPolys++;
    } // end for pidx
} // renderer_AddObject

function renderer_Render( rl, videobuff, cam )
{
    var i, j;
    var polyrPtr;
    var v0, v1, v2;

    _log( rl.numPolys );
    for ( i = 0; i < rl.numPolys; i++ )
    {
        polyrPtr = rl.plist[i];
//        _log( polyrPtr.vertex[0].v );
//        return;
        // transform to viewer
        {
            for ( j = 0; j < 3; j++ )
            {
                v0 = polyrPtr.vertex[j].v;
                vec3D_Log( v0 );
                v0.x = cam.viewDist * v0.x / v0.z;
                v0.y = cam.viewDist * v0.y * ( cam.aspectRatio / v0.z );

                v0.x = cam.alpha + cam.alpha * v0.x;
                v0.y = cam.beta - cam.beta * v0.y;

                vec3D_Log( v0 );
            } // end for j
        } // end transform to viewer
        v0 = polyrPtr.vertex[0].v;
        v1 = polyrPtr.vertex[1].v;
        v2 = polyrPtr.vertex[2].v;

        vec3D_Log( v0 );
        vec3D_Log( v1 );
        vec3D_Log( v2 );

//        line_Draw( videobuff, v0.x, v0.y, v1.x, v1.y, polyrPtr.color );
//        line_Draw( videobuff, v1.x, v1.y, v2.x, v2.y, polyrPtr.color );
//        line_Draw( videobuff, v2.x, v2.y, v1.x, v1.y, polyrPtr.color );
    } // end for i
}

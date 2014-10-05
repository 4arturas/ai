function renderer_Create( polygonListSize )
{
    return {
        numPolys: 0,
        polygonListSize: polygonListSize,
        plist: new Array( polygonListSize )
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
}

function renderer_AddObject( rl, obj, cam )
{
    var pidx;

    for ( pidx = 0; pidx < obj.numPolys; pidx++ )
    {

    } // end for pidx
}

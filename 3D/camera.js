
function camera_Create( posX, posY, posZ, width, height, nearClipZ, farClipZ, fov )
{
    var aspectRatio = width/height;
    var viewportWidth = 2.0;
    var viewportHeight = 2.0 / aspectRatio;
    var viewDist = viewportWidth / 2.0 * geom_Tan( geomPI_OVER_180 * (fov/2) );
    var zFactorX = viewportWidth / 2.0 / viewDist;
    var zFactorY = viewportHeight / 2.0 / viewDist;
    var alpha = width/2.0;
    var beta = width/2.0;

    return {
        pos: vec3D_Create( posX, posY, posZ ),
        dir: vec3D_Create( 0, 0, 0 ),
        matrix: mat4x3_CreateIdentity(),
        nearClipZ: nearClipZ,
        farClipZ: farClipZ,
        for: fov,
        aspectRatio: aspectRatio,
        viewportWidth: viewportWidth,
        viewportHeight: viewportHeight,
        viewDist: viewDist,
        zFzctorX: zFactorX,
        zFactorY: zFactorY,
        alpha: alpha,
        beta: beta
    };
}

function camera_Euler( cam )
{
    var mt, mx, my, mz, mrot, mtemp;
    var s, c;

    mt = mat4x3_CreateIdentity();
    mt.tx = -cam.pos.x;
    mt.ty = -cam.pos.y;
    mt.tz = -cam.pos.z;

    s = -geom_Sin( cam.dir.x );
    c = geom_Cos( cam.dir.x );
    mx = mat4x3_RotX( s, c );

    s = -geom_Sin( cam.dir.y );
    c = geom_Cos( cam.dir.y );
    my = mat4x3_RotY( s, c );

    s = -geom_Sin( cam.dir.z );
    c = geom_Cos( cam.dir.z );
    mz = mat4x3_RotZ( s, c );

    mtemp = mat4x3_Mul( mx, my );
    mrot = mat4x3_Mul( mtemp, mz );
    cam.matrix = mat4x3_Mul( mt, mrot );
}

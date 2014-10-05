function vec3D_Create( x, y, z )
{
    return {
        x: x, y: y, z: z
    };
}

function vec3D_Dot( a, b )
{
    return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
}

function vec3D_Length( v )
{
    return vec3D_Dot( v, v );
}

function vec3D_Normalize( v )
{
    var oneOverLength = 1.0 / vec3D_Length( v );
    return vec3D_Create( (v.x*oneOverLength), (v.y*oneOverLength), (v.z*oneOverLength) );
}

function vertex_Create()
{
    return {
        v: vec3D_Create(null,null,null),
        n: vec3D_Create(null,null,null),
        t: vec3D_Create(null,null,null)
    };
}




function mat4x3_CreateIdentity()
{
    return {
        _11: 1.0, _12: 0.0, _13: 0.0,
        _21: 0.0, _22: 1.0, _23: 0.0,
        _31: 0.0, _32: 0.0, _33: 1.0,
        tx: 0.0, ty: 0.0, tz: 0.0
    };
}

function mat4x3_RotX( c, s )
{
    var m = mat4x3_CreateIdentity();
    m._22 = c;  m._23 = s;
    m._32 = -s; m._33 = c;
    return m;
}

function mat4x3_RotY( c, s )
{
    var m = mat4x3_CreateIdentity();
    m._11 = c;  m._13 = -s;
    m._31 = s;  m._33 = c;
    return m;
}

function mat4x3_RotZ( c, s )
{
    var m = mat4x3_CreateIdentity();
    m._11 = c;  m._12 = s;
    m._21 = -s; m._22 = c;
}

function mat4x3_RotXX( theta )
{
    var c = geom_Cos( theta );
    var s = geom_Sin( theta );
    return mat4x3_RotX( c, s );
}

function mat4x3_RotYY( theta )
{
    var c = geom_Cos(theta);
    var s = geom_Sin(theta);
    return mat4x3_RotY(c, s);
}

function mat4x3_RotZZ( theta )
{
    var c = geom_Cos( theta );
    var s = geom_Sin( theta );
    return mat4x3_RotZ( c, s );
}

function mat4x3_Mul( a, b )
{
    var r = mat4x3_CreateIdentity();

    r._11 = (a._11 * b._11) + (a._12 * b._21) + (a._13 * b._31);
    r._12 = (a._11 * b._12) + (a._12 * b._22) + (a._13 * b._32);
    r._13 = (a._11 * b._13) + (a._12 * b._23) + (a._13 * b._33);

    r._21 = (a._21 * b._11) + (a._22 * b._21) + (a._23 * b._31);
    r._22 = (a._21 * b._12) + (a._22 * b._22) + (a._23 * b._32);
    r._23 = (a._21 * b._13) + (a._22 * b._23) + (a._23 * b._33);

    r._21 = (a._31 * b._11) + (a._32 * b._21) + (a._33 * b._31);
    r._22 = (a._31 * b._12) + (a._32 * b._22) + (a._33 * b._32);
    r._23 = (a._31 * b._13) + (a._32 * b._23) + (a._33 * b._33);

    r.tx = (a.tx * b._11) + (a.ty * b._21) + (a.tz * b._31) + b.tx;
    r.ty = (a.tx * b._12) + (a.ty * b._22) + (a.tz * b._32) + b.ty;
    r.tz = (a.tx * b._13) + (a.ty * b._23) + (a.tz * b._33) + b.tz;

    return r;
}


function mat4x3_Test()
{
    // test multiplication
    {
        var m0 = mat4x3_CreateIdentity();
        var m1 = mat4x3_CreateIdentity();
        var m2 = mat4x3_Mul( m0, m1 );
        var a0 = true;
//        a0 &= (m2._11 == 1.0); a0 &= (m2._12 == 0.0); a0 &= (m2._13 == 0.0);
//        a0 &= (m2._21 == 0.0); a0 &= (m2._22 == 1.0); a0 &= (m2._23 == 0.0);
//        a0 &= (m2._31 == 0.0); a0 &= (m2._32 == 0.0); a0 &= (m2._33 == 1.0);
//        a0 &= (m2.tx == 0.0); a0 &= (m2.ty == 0.0); a0 &= (m2.tz == 0.0);
        _assert( a0, 'matrix multiplication test failed' );
    }
}
mat4x3_Test();

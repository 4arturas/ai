function vec3D_Create( x, y, z )
{
    return {
        x: x, y: y, z: z
    };
}

function vec3D_Equal( a, b )
{
    return a.x == b.x && a.y == b.y && a.z == b.z;
}

function vec3D_Dot( a, b )
{
    return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
}

function vec3D_Length( v )
{
    return Math.sqrt( vec3D_Dot( v, v ) );
}

function vec3D_Dist( a, b )
{
    var r = vec3D_Sub( a, b );
    return vec3D_Length( r );
}

function vec3D_Normalize( v )
{
    var oneOverLength = 1.0 / vec3D_Length( v );
    return vec3D_Create( (v.x*oneOverLength), (v.y*oneOverLength), (v.z*oneOverLength) );
}

function vec3D_Add( a, b )
{
    return vec3D_Create(
        a.x+b.x, a.y+b.y, a.z+b.z
    );
}

function vec3D_Sub( a, b )
{
    return vec3D_Create(
        a.x-b.x, a.y-b.y, a.z-b.z
    );
}

function vec3D_MulScalar( a, s )
{
    return vec3D_Create(
        a.x*s, a.y*s, a.z*s
    );
}
function vec3D_DivScalar( a, s )
{
    return vec3D_Create(
        a.x/s, a.y/s, a.z/s
    );
}

function vec3D_Truncate( a, maxVal )
{
    var l = vec3D_Length( a );
    var i = maxVal / l;
    if ( i > 1.0 )
        return vec3D_DivScalar( a, i );
    return a;
}

function vec3D_Build( a, b )
{
    return vec3D_Sub( b, a );
}

function vec3D_Cross( a, b )
{
    return vec3D_Create(
        (a.y*b.z)-(a.z*b.y),
        (a.x*b.z)-(a.z*b.x),
        (a.x*b.y)-(a.y*b.x)
    );
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

function mat4x3_RotX( s, c )
{
    var m = mat4x3_CreateIdentity();
    m._22 = c;  m._23 = s;
    m._32 = -s; m._33 = c;
    return m;
}

function mat4x3_RotY( s, c )
{
    var m = mat4x3_CreateIdentity();
    m._11 = c;  m._13 = -s;
    m._31 = s;  m._33 = c;
    return m;
}

function mat4x3_RotZ( s, c )
{
    var m = mat4x3_CreateIdentity();
    m._11 = c;  m._12 = s;
    m._21 = -s; m._22 = c;
    return m;
}

function mat4x3_RotXX( theta )
{
    var s = geom_Sin( theta );
    var c = geom_Cos( theta );
    return mat4x3_RotX( s, c );
}

function mat4x3_RotYY( theta )
{
    var s = geom_Sin(theta);
    var c = geom_Cos(theta);
    return mat4x3_RotY(s, c);
}

function mat4x3_RotZZ( theta )
{
    var s = geom_Sin( theta );
    var c = geom_Cos( theta );
    return mat4x3_RotZ( s, c );
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

    r._31 = (a._31 * b._11) + (a._32 * b._21) + (a._33 * b._31);
    r._32 = (a._31 * b._12) + (a._32 * b._22) + (a._33 * b._32);
    r._33 = (a._31 * b._13) + (a._32 * b._23) + (a._33 * b._33);

    r.tx = (a.tx * b._11) + (a.ty * b._21) + (a.tz * b._31) + b.tx;
    r.ty = (a.tx * b._12) + (a.ty * b._22) + (a.tz * b._32) + b.ty;
    r.tz = (a.tx * b._13) + (a.ty * b._23) + (a.tz * b._33) + b.tz;

    return r;
}

function mat4x3_MulVec( m, v )
{
    return vec3D_Create(
        v.x * m._11 + v.y * m._21 + v.z * m._31 + m.tx,
        v.x * m._12 + v.y * m._22 + v.z * m._32 + m.ty,
        v.x * m._13 + v.y * m._23 + v.z * m._33 + m.tz
    );
}

function mat4x3_Log( m )
{
    var s = '';
    s += m._11 + ' ' + m._12 + ' ' + m._13 + '\n';
    s += m._21 + ' ' + m._22 + ' ' + m._23 + '\n';
    s += m._31 + ' ' + m._32 + ' ' + m._33 + '\n';
    s += m.tx + ' ' + m.ty + ' ' + m.tz;
    console.log( s );
}

function vec3D_Log( v )
{
    console.log( v.x + ' ' + v.y + ' ' + v.z );
}

function vector_Test()
{
    // vector length test
    {
        console.log( 'vector length test' );
        var v0 = vec3D_Create( 1.0, 0.0, 0.0 );
        var l0 = vec3D_Length( v0 );
        console.log( l0 );
        _assert( (l0==1.0), 'vector length test failed' );
        var v1 = vec3D_Create( 0.0, 2.0, 0.0 );
        var l1 = vec3D_Length( v1 );
        console.log( l1 );
        _assert( (l1==2.0), 'vector length test failed' );
    }

    // vector cross product test
    {
        console.log( 'vector cross product test' );
        var _v2 = vec3D_Create( 1,0,0 );
        var _v3 = vec3D_Create( 0,1,0 );
        var _v4 = vec3D_Cross( _v2, _v3 );
        vec3D_Log( _v4 );
        _assert( (_v4.x==0.0 && _v4.y==0.0 && _v4.z==1.0 ), 'vector cross product test failed' );
    }

    // test matrix multiplication
    {
        console.log( 'test matrix multiplication' );
        var m0 = mat4x3_CreateIdentity();
        var m1 = mat4x3_CreateIdentity();
        var m2 = mat4x3_Mul( m0, m1 );
        var a0 = true;
        a0 &= (m2._11 == 1.0); a0 &= (m2._12 == 0.0); a0 &= (m2._13 == 0.0);
        a0 &= (m2._21 == 0.0); a0 &= (m2._22 == 1.0); a0 &= (m2._23 == 0.0);
        a0 &= (m2._31 == 0.0); a0 &= (m2._32 == 0.0); a0 &= (m2._33 == 1.0);
        a0 &= (m2.tx == 0.0); a0 &= (m2.ty == 0.0); a0 &= (m2.tz == 0.0);
        mat4x3_Log( m2 );
        _assert( a0, 'matrix multiplication test failed' );
    }

    // test matrix by vector multiplication
    {
        console.log( 'test matrix by vector multiplication' );
        var v2 = vec3D_Create( 1.0, 0.0, 1.0 );
        var m3 = mat4x3_CreateIdentity();
        var v3 = mat4x3_MulVec( m3, v2 );
        var a1 = v2.x == 1.0 && v2.y == 0.0 && v2.z == 1.0;
        vec3D_Log( v3 );
        _assert( a0, 'matrix multiplication by vector test failed' );
    }
}

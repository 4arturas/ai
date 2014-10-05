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
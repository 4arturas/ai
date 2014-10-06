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

function poly_Create( attr, state, color, normal )
{
    return {
        attr: attr,
        state: state,
        color: color,
        normal: normal,
        vidx: new Array( 3 ),
        tidx: new Array( 3 )
    };
}

var geomPI = 3.14159265359;
var geomPI2 = geomPI*2.0;
var geomPI_OVER_180 = (geomPI/180.0);
var geom180_OVER_PI = (180.0/geomPI);

function geom_Cos( theta )
{
    return Math.cos( theta );
}
function geom_Sin( theta )
{
    return Math.sin( theta );
}
function geom_Tan( theta )
{
    return Math.tan( theta );
}

function geom_DegToRad( d )
{
    return d * geomPI_OVER_180;
}
function geom_RadToDeg( r )
{
    return r * geom180_OVER_PI;
}

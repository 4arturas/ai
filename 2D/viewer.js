function viewer_GetTDID( y, x )
{
    return y+'_'+x;
}
function viewer_Create( width, height, pixelSize )
{
    var y, x;
    var table, tr, td;
    var tdArr;
    table = document.createElement('table');
    tdArr = new Array( height );
    for ( y = 0; y < height; y++ )
    {
        tdArr[y] = new Array( width );
        tr = document.createElement('tr');
        table.appendChild( tr );
        for ( x = 0; x < width; x++ )
        {
            td = document.createElement('td');
            tr.appendChild( td );
            td.setAttribute('id', viewer_GetTDID( y, x ) );
            td.style.height = pixelSize+'px';
            td.style.width = pixelSize+'px';
            td.style.fontSize = '1px';
//            td.style.backgroundColor = 'green';
//            td.innerHTML = 'x';
            tdArr[y][x] = td;
        } // end for x
    } // end for y
    return {
        table: table,
        tdArr: tdArr
    };
}

function viewer_Clear( viewer, videobuff )
{
    var y, x;
    var td;
    for ( y = 0; y < videobuff.height; y++ )
    {
        for ( x = 0; x < videobuff.width; x++ )
        {
            td = document.getElementById(y+'_'+x);
            td.style.backgroundColor = 'rgb('+videobuff.bgColor.r+','+videobuff.bgColor.g+','+videobuff.bgColor.b+')';
        } // end for x
    } // end for y
}

function viewer_Draw( viewer, videobuff )
{
    var y, x;
    var ptr;
    var pixel;
    var td;
    for ( y = 0; y < videobuff.height; y++ )
    {
        ptr = y * videobuff.width;
        for ( x = 0; x < videobuff.width; x++ )
        {
            pixel = videobuff.buff[ptr+x];
//            td = document.getElementById(y+'_'+x);
            td = viewer.tdArr[y][x];
            td.style.backgroundColor = 'rgb('+pixel.r+','+pixel.g+','+pixel.b+')';
        } // end for x
    } // end for y
}
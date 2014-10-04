function viewer_GetTDID( y, x )
{
    return y+'_'+x;
}
function viewer_Create( width, height )
{
    var y, x;
    var table, tr, td;
    table = document.createElement('table');
    for ( y = 0; y < height; y++ )
    {
        tr = document.createElement('tr');
        table.appendChild( tr );
        for ( x = 0; x < width; x++ )
        {
            td = document.createElement('td');
            tr.appendChild( td );
            td.setAttribute('id', viewer_GetTDID( y, x ) );
//            td.style.backgroundColor = 'green';
//            td.innerHTML = 'x';
        } // end for x
    } // end for y
    return table;
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
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
        } // end for x
    } // end for y
}
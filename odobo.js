function odobo_PointsToCell( points )
{
    var cell = new Array( 4 );
    var v0;
    var i;
    var minX = 10000000, maxX = -minX;
    var minY = 10000000, maxY = -minY;
    if ( points.length > 4 ) _log( 'error: array size != 4');
    for ( i = 0; i < 4; i++ )
    {
        v0 = points[i];
        minX = _min( minX, v0.x );
        maxX = _max( maxX, v0.x );
        minY = _min( minY, v0.y );
        maxY = _max( maxY, v0.y );
    } // end for i
    for ( i = 0; i < 4; i++ )
    {
        v0 = points[i];
        if ( v0.x == minX && v0.y == minY )
            cell[0] = v0;
        else if ( v0.x == minX && v0.y == maxY )
            cell[1] = v0;

        else if ( v0.x == maxX && v0.y == maxY )
            cell[2] = v0;
        else if ( v0.x == maxX && v0.y == minY )
            cell[3] = v0;
    } // end for i
    return cell;
}

function odobo_CellToJSON( cell )
{
    var i;
    var v0;
    var minX = 10000000, maxX = -minX;
    var minY = 10000000, maxY = -minY;
    if ( cell.length > 4 ) _log( 'error: array size != 4');
    for ( i = 0; i < 4; i++ )
    {
        v0 = cell[i];
        minX = _min( minX, v0.x );
        maxX = _max( maxX, v0.x );
        minY = _min( minY, v0.y );
        maxY = _max( maxY, v0.y );
    } // end for i
    var _jSon =
    {
        x: minX,
        y: maxY,
        width: Math.abs(maxX-minX),
        height: Math.abs(maxY-minY)
    };
    return _jSon;
}

function odobo_DomBox()
{
    var box = document.createElement('div');
    box.style.position = 'absolute';
    box.style.padding = '0';
    box.style.margin = '0';
    box.style.backgroundColor = 'lightblue';
    box.style.border = '1px solid black';
    return box;
}

function odobo_SpanFromJSonVertical( _jSon )
{
    var box = odobo_DomBox();

    box.style.left = Math.floor(_jSon.x) + 'px';
    //    div.style.left = Math.floor((_jSon.x+Math.abs(_jSon.width-_jSon.x))) + 'px';

//    div.style.top = Math.floor(_jSon.y) + 'px';
    box.style.top = Math.floor((_jSon.y+Math.abs(_jSon.height-_jSon.y))) + 'px';
    box.style.width = Math.floor(_jSon.width) + 'px';
    box.style.height = Math.floor(_jSon.height) + 'px';
    return box;
}

function odobo_SpanFromJSonHorizontal( _jSon )
{
    var box = odobo_DomBox();

    box.style.left = Math.floor(_jSon.x) + 'px';
    //    box.style.left = Math.floor((_jSon.x+Math.abs(_jSon.width-_jSon.x))) + 'px';

//    box.style.top = Math.floor(_jSon.y) + 'px';
    box.style.top = Math.floor((Math.abs(_jSon.height-_jSon.y))) + 'px';
    box.style.width = Math.floor(_jSon.width) + 'px';
    box.style.height = Math.floor(_jSon.height) + 'px';
    return box;
}

var SLICE_VERTICALLY = 1;
var SLICE_HORIZONTALLY = 2;
function odobo_Slice( polygon, sliceType )
{
    var i, j, k;
    var v0, v1, v2, v3;
    var vLeft, vRight;

    var arrTmp;
    var cellArray = [];
    var cell;

    var pqMain, pqTmp;
    var fnHeur, fnEqualVerticalOrHorizontal, fnClockwise, fnCreateV3;
    if ( sliceType == SLICE_HORIZONTALLY )
    {
        fnHeur = function( n0, n1 )
        {
            return n0.y > n1.y;
        };
        fnEqualVerticalOrHorizontal = function( n0, n1 )
        {
            return n0.x == n1.x;
        };
        fnClockwise = function( n0, n1 )
        {
            return n1.x > n0.x
        };
        fnCreateV3 = function( n0, n1 )
        {
            return vec2D_Create( n1.x, n0.y );
        };
    }
    else if ( sliceType == SLICE_VERTICALLY )
    {
        fnHeur = function( n0, n1 )
        {
            return n0.x > n1.x;
        };
        fnEqualVerticalOrHorizontal = function( n0, n1 )
        {
            return n0.y == n1.y;
        };
        fnClockwise = function( n0, n1 )
        {
            return n0.y > n1.y
        };
        fnCreateV3 = function( n0, n1 )
        {
            return vec2D_Create( n0.x, n1.y );
        };
    }
    // init
    {
        pqMain = pq_Create( polygon.length );
        pqMain.fnHeur = fnHeur;
        for ( i = 0; i < polygon.length; i++ )
            pq_Enqueue( pqMain, polygon[i] );
    } // end init

    while ( pqMain.count > 2 )
    {
        // 1. We are looking for two highest points
        {
            v0 = pqMain.arr[1];
            pq_Dequeue(pqMain, 1);
            v1 = pqMain.arr[1];
            pq_Dequeue(pqMain, 1);

            // clockwise
            if ( fnClockwise( v1, v0 ) )
            {
                vLeft = v0;
                vRight = v1;
            }
            else
            {
                vLeft = v1;
                vRight = v0;
            }
        } // 1.

        // 2. Searching for a third point where v2.x == v0.x || v1.x
        {
            // Make a copy of pq
            {
                pqTmp = pq_Create(pqMain.count);
                pqTmp.count = pqMain.count;
                pqTmp.fnHeur = fnHeur;
                for (i = 1; i <= pqMain.count; i++)
                    pqTmp.arr[i] = pqMain.arr[i];
            }  // end

            while ( pqTmp.count != 0 )
            {
                v2 = pqTmp.arr[1];
                pq_Dequeue( pqTmp, 1 );
                if ( fnEqualVerticalOrHorizontal( v2, vLeft ) )
                {
                    v3 = fnCreateV3( v2, vRight );
                    break;
                }
                else if ( fnEqualVerticalOrHorizontal( v2, vRight ) )
                {
                    v3 = fnCreateV3( v2, vLeft );
                    break;
                }
            } // end while
        } // 2.

        // 3. Remove v2 and insert v3
        {
            pqMain.fnCmpTwoElementsAreEqual = function( n0, n1 )
            {
                return vec2D_Equal( n0, n1, pqMain );
            };
            j = pq_GetIdx( pqMain, v2 );
            pq_Dequeue( pqMain, j );
            pq_Enqueue( pqMain, v3 );
        } // 3.

        arrTmp = [];
        arrTmp.push( v0 );
        arrTmp.push( v1 );
        arrTmp.push( v2 );
        arrTmp.push( v3 );
        cell = odobo_PointsToCell( arrTmp );
        cellArray.push( cell );

//        return;
    } // end while pqMain.count > 0
    return cellArray;
}


function odobo_CreateRandomPolygon()
{
    var num = 10;
    var radius;
    var i, j, k;
    var x, y, z;

    var center = vec2D_Create( 300, 300 );
    var v0, v1, v2, v3, vNext;
    var min, max;
    var angle = 0;
    var step = 2*geomPI/num;
    // Create points
    var points = new Array( num );
    {
        for ( i = 0; i < num; i++ )
        {
            radius = _rnd_Int( 100, 150 );
            x = Math.sin( angle ) * radius + center.x;
            y = Math.cos( angle ) * radius + center.y;
            v0 = vec2D_Create( x, y );
            angle += step;
            points[i] = v0;
        } // end for i
    } // end Create points

    var points2 = [];
    {
        for ( i = 0; i < points.length-1; i++ )
        {
            v0 = points[i];
            vNext = points[i+1];
            v1 = vec2D_Create( v0.x, vNext.y );
            points2.push( v0 );
            points2.push( v1 );
        } // end for i
        v0 = points[i];
        vNext = points[0];
        v1 = vec2D_Create( v0.x, vNext.y );
        points2.push( v0 );
        points2.push( v1 );
    } //

    return points2;
}
function pq_Create( size )
{
    return {
        count: 0,
        arr: new Array( size+1 ),
        fnHeuristics: function( n0, n1 ) { console.log('Not implemented fnHeuristics'); },
        fnEquals: function( n0, n1 ) { console.log('Not implemented fnEquals'); }
    };
}
function pq_Enqueue( pq, n )
{
    var parent, child;
    pq.count++;
    parent = Math.floor( pq.count/2 );
    child = pq.count;
    while ( parent > 0 )
    {
        if ( pq.fnHeuristics( pq.arr[parent], n ) )
        {
            pq.arr[child] = pq.arr[parent];
            child = parent;
            parent = Math.floor( parent/2 );
        }
        else
            break;
    } // end while
    pq.arr[child] = n;
}
function pq_Dequeue( pq, idx )
{
    var parent, child;
    pq.arr[idx] = pq.arr[pq.count];
    var n = pq.arr[idx];
    parent = idx;
    child = idx*2;
    while ( pq.count > child )
    {
        if ( pq.count-1 > child )
            if ( pq.fnHeuristics( pq.arr[child], pq.arr[child+1] ) )
                child++;

        if ( pq.fnHeuristics( n, pq.arr[child] ) )
        {
            pq.arr[parent] = pq.arr[child];
            parent = child;
            child = child*2;
        }
        else
            break;
    } // end while
    pq.arr[parent] = n;
    pq.count--;
}
function pq_GetIdx( pq, n )
{
    var i;
    for ( i = 1; i <= pq.count; i++ )
        if ( pq.fnEquals( pq.arr[i], n ) )
            return i;
    return -1;
}
function pq_Test()
{
    var i;
    var n;
    var size = 10;
    var pq = pq_Create( size );
    pq.fnHeuristics = function( n0, n1 )
    {
        return n0.f > n1.f;
    };
    pq.fnEquals = function( n0, n1 )
    {
        return n0.f == n1.f;
    };
    for ( i = 0; i < size; i++ )
    {
        n = { f: i };
        pq_Enqueue( pq, n );
    }

    n = { f: 1 };
    i = pq_GetIdx( pq, n );
    pq_Dequeue( pq, i );
    while ( pq.count > 0 )
    {
        n = pq.arr[1];
        console.log(n.f);
        pq_Dequeue( pq, 1 );
    } // end while
}
pq_Test();

function rnd_Int( x, y )
{
    return Math.floor(
        Math.random() * ( y - x + 1 ) + x
    );
}
function _log( l )
{
    console.log( l );
}

var AS_HEIGHT = 20;
var AS_WIDTH = 20;

function as_CreateTable()
{
    var y, x;
    var tr, td;
    var asTable = document.getElementById('asTable');
    for ( y = 0; y < AS_HEIGHT; y++ )
    {
        tr = document.createElement('tr');
        asTable.appendChild(tr);
        for ( x = 0; x < AS_WIDTH; x++ )
        {
            td = document.createElement('td');
            tr.appendChild(td);
            td.setAttribute('id', y + '_' + x);
        } // end for x
    } // end for y
}
as_CreateTable();

function as_NodesEqual( n0, n1 )
{
    return n0.x == n1.x && n0.y == n1.y;
}
function as_CreateNode( y, x )
{
    return {
        y: y, x: x,
        h: 0, g: 0, f: 0,
        passable: 1, closed: 0, visited: 0, cost: 0
    };
}
function as_GetNodeTD( y, x )
{
    return document.getElementById( y + "_" + x );
}
function as_Create()
{
    var y, x;
    var n;
    var start = as_CreateNode( 0, 0 );
    var goal = as_CreateNode( AS_HEIGHT-1, AS_WIDTH-1 );
    var asMap = {
        start: start,
        goal: goal,
        map: null
    };
    asMap.map = new Array( AS_HEIGHT );
    for ( y = 0; y < asMap.map.length; y++ )
    {
        asMap.map[y] = new Array( AS_WIDTH );
        for ( x = 0; x < asMap.map[y].length; x++ )
        {
            n = as_CreateNode( y, x );
            n.passable = rnd_Int( 0, 5 ) == 5 ? 0 : 1;
            asMap.map[y][x] = n;
        } // end for x
    } // end for y
    asMap.start.passable = 1;
    asMap.goal.passable = 1;

    return asMap;
}
function as_EmitTable( asMap )
{
    var y, x;
    var n;
    var td;
    for ( y = 0; y < asMap.map.length; y++ )
    {
        for ( x = 0; x < asMap.map[y].length; x++ )
        {
            td = as_GetNodeTD( y, x );
            n = asMap.map[y][x];

            if (n.passable==1)
                td.style.backgroundColor = 'white';
            else
                td.style.backgroundColor = 'black';

            if ( n.visited == 1)
            {
                console.log( n.visited );
                td.style.backgroundColor = 'lightblue';
            }

        } // end for x
    } // end for y
    td = as_GetNodeTD( 0, 0 );
    td.style.backgroundColor = 'yellow';
    td = as_GetNodeTD( AS_HEIGHT-1, AS_WIDTH-1 );
    td.style.backgroundColor = 'red';
}
function as_Manhattan( n0, n1 )
{
    var y = Math.abs( n0.y - n1.y );
    var x = Math.abs( n0.x - n1.x );
    return y*y+x*x;
}
function as_Main()
{
    var dirY = [-1,+1,-0,+0];
    var dirX = [-0,+0,-1,+1];
    var asMap = as_Create();
    as_EmitTable( asMap );

    var pq = pq_Create( AS_HEIGHT*AS_WIDTH );
    pq.fnHeuristics = function( n0, n1 )
    {
        return n0.f > n1.f;
    };
    pq.fnEquals = function( n0, n1 )
    {
        return as_NodesEqual( n0, n1 );
    };
    pq_Enqueue( pq, asMap.start );
    while ( pq.count > 0 )
    {
        var currNode = pq.arr[1];
        pq_Dequeue( pq, 1 );
        if ( as_NodesEqual( currNode, asMap.goal ) )
        {
            as_EmitTable( asMap );
            _log( 'found' );
            return;
        }
        currNode.closed = 1;
        for ( var i = 0; i < dirY.length; i++ )
        {
            var y = currNode.y + dirY[i];
            var x = currNode.x + dirX[i];
            if ( 0 > y || y >= AS_HEIGHT ) continue;
            if ( 0 > x || x >= AS_WIDTH ) continue;

            var n = asMap.map[y][x];
            if ( n.closed == 1 ) continue;
            if ( n.passable == 0 ) continue;

            var g = n.cost + currNode.g;
            if (n.visited == 0 || n.g > g )
            {
                n.g = g;
                n.h = as_Manhattan( n, asMap.goal );
                n.f = n.g + n.h;
                if ( n.visited == 1 )
                {
                    var idx = pq_GetIdx( pq, n );
                    pq_Dequeue( pq, idx );
                }
                pq_Enqueue( pq, n );
                n.visited = 1;
            } // end if
        } // end for i
    } // end while
    as_EmitTable( asMap );
}
as_Main();

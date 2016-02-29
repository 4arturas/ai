function pq_Create( size )
{
    return {
        count: 0,
        arr: new Array(size+1),
        fnHeur: function(n0,n1) { console.log('Not implemented fnHeur'); },
        fnEquals: function( n0, n1 ) { console.log('Not implemented fnEquals') }
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
        if ( pq.fnHeur( pq.arr[parent], n ) )
        {
            pq.arr[child] = pq.arr[parent];
            child = parent;
            parent = Math.floor( parent/2 );
        } // end if
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
            if ( pq.fnHeur( pq.arr[child], pq.arr[child+1] ) )
                child++;
        if ( pq.fnHeur( n, pq.arr[child] ) )
        {
            pq.arr[parent] = pq.arr[child];
            parent = child;
            child *= 2;
        }
        else
            break;
    } // end while
    pq.arr[parent] = n;
    pq.count--;
}
function pq_GetIdx( pq, n )
{
    for ( var i = 1; i <= pq.count; i++ )
        if ( pq.fnEquals(pq.arr[i], n ) )
            return i;
    return -1;
}
function pq_Test()
{
    var i;
    var size = 10;
    var n;
    var pq = pq_Create( size );
    pq.fnHeur = function( n0, n1 )
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
    } // end for n

    n = {f:0};
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

var AS_HEIGHT = 20;
var AS_WIDTH = 20;

function as_CreateTable()
{
    var asTable = document.getElementById('asTable');
    var y, x;
    var tr, td;
    for ( y = 0; y < AS_HEIGHT; y++ )
    {
        tr = document.createElement('tr');
        asTable.appendChild( tr );
        for ( x = 0; x < AS_WIDTH; x++ )
        {
            td = document.createElement('td');
            tr.appendChild( td );
            td.setAttribute('id', y+'_'+x);
        } // end for x
    } // end for y
}
as_CreateTable();

function as_CreateNode( y, x )
{
    return {
        y: y, x: x,
        g: 0, h:0, f: 0,
        closed: 0, visited: 0, passable: 1, cost: 0,
        parrent: null
    };
}
function as_CreateMap()
{
    var asMap = {
        start: null,
        goal: null,
        map: null
    };
    asMap.map = new Array( AS_HEIGHT );
    var y, x;
    for ( y = 0; y < AS_HEIGHT; y++ )
    {
        asMap.map[y] = new Array( AS_WIDTH );
        for ( x = 0; x < AS_WIDTH; x++ )
        {
            var n = as_CreateNode( y, x );
            n.passable = rnd_Int( 0, 4 ) == 0 ? 0 : 1;
            asMap.map[y][x] = n;
        } // end for x
    } // end for y
    asMap.start = asMap.map[0][0];
    asMap.goal = asMap.map[AS_HEIGHT-1][AS_WIDTH-1];

    asMap.map[0][0].passable = 1;
    asMap.map[AS_HEIGHT-1][AS_WIDTH-1].passable = 1;

    return asMap;
}
function as_GetTD( y, x )
{
    return document.getElementById(y+'_'+x);
}
function as_MapEmit( asMap )
{
    var td;
    var y, x;
    for ( y = 0; y < asMap.map.length; y++ )
    {
        for ( x = 0; x < asMap.map[y].length; x++ )
        {
            var n = asMap.map[y][x];

            td = as_GetTD( y, x );
            if (n.passable==0)
                td.style.backgroundColor = 'black';
            else
                td.style.backgroundColor = 'white';
            if (n.visited == 1)
                td.style.backgroundColor = 'gray';

            //n.cost = rnd_Int( 0, AS_WIDTH+AS_HEIGHT );
        } // end for x
    } // end for y
    td = as_GetTD( asMap.goal.y, asMap.goal.x );
    td.style.backgroundColor = 'red';

    td = as_GetTD( asMap.start.y, asMap.start.x );
    td.style.backgroundColor = 'yellow';
}
function as_Manhattan( n0, n1 )
{
    var y = Math.abs( n0.y - n1.y );
    var x = Math.abs( n0.x - n1.x );
    return (y*y)+(x*x);
}
function as_NodesEqual( n0, n1 )
{
    return n0.y == n1.y && n0.x == n1.x;
}
function as_Main()
{
    var dirY = [ -1, +1, -0, +0 ];
    var dirX = [ -0, +0, -1, +1 ];
    var asMap = as_CreateMap();
    as_MapEmit( asMap );
    var pq = pq_Create( AS_HEIGHT*AS_WIDTH );
    pq.fnHeur = function( n0, n1 )
    {
        return n0.f > n1.f ;
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
            as_MapEmit( asMap );
            console.log('found');
            var nn = currNode;
            while ( nn != null )
            {
                var td = as_GetTD( nn.y, nn.x );
                td.style.backgroundColor = 'lightblue';
                nn = nn.parrent;
            }

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
            if (n.closed == 1) continue;
            if (n.passable == 0 ) continue;
            var g = n.cost + currNode.g;
            if (n.visited==0 || n.g > g )
            {
                n.g = g;
                n.h = as_Manhattan( n, asMap.goal );
                n.f = n.g + n.h;
                n.parrent = currNode;
                if (n.visited == 1 )
                {
                    var idx = pq_GetIdx( pq, n );
                    pq_Dequeue( pq, idx );
                }
                pq_Enqueue( pq, n );
                n.visited = 1;
            } // end if
        } // end for i
    } // end while
    as_MapEmit( asMap );
    console.log('not found');
}
as_Main();
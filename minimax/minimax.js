function pq_Create( size )
{
    return {
        count: 0,
        arr: new Array( size+1 ),
        fn_Heur: function( n0, n1 ) { alert('not implemented fn_Heur'); },
        fn_Cmp: function( n0, n1 ) { alert('not implemented fn_Cmp'); }
    };
}
function pq_Enqueue( pq, n )
{
    var parent, child;
    pq.count++;
    parent = _floor( pq.count/2 );
    child = pq.count;
    while ( parent > 0 )
    {
        if ( pq.fn_Heur( pq.arr[parent], n ) )
        {
            pq.arr[child] = pq.arr[parent];
            child = parent;
            parent = _floor( parent/2 );
        }
        else
            break;
    } // end while
    pq.arr[child] = n;
}
function pq_Dequeue( pq, idx )
{
    var parent, child;
    var n;
    pq.arr[idx] = pq.arr[pq.count];
    n = pq.arr[idx];
    parent = idx;
    child = idx*2;
    while ( pq.count > child )
    {
        if ( pq.count-1 > child )
            if ( pq.fn_Heur( pq.arr[child], pq.arr[child+1] ) )
                child++;

        if ( pq.fn_Heur( n, pq.arr[child] ) )
        {
            pq.arr[parent] = pq.arr[child];
            parent = child;
            child *= 2;
        }
        else
            break;
    } // end while
    pq.count--;
    pq.arr[parent] = n;
}
function pq_GetIdx( pq, n )
{
    var i;
    for ( i = 1; i <= pq.count; i++ )
        if ( pq.fn_Cmp( pq.arr[i], n ) )
        return i;
    return -1;
}
function pq_Test()
{
    var i;
    var n;
    var number = 10;
    var pq = pq_Create( number );
    pq.fn_Heur = function( n0, n1 )
    {
        return n0.f > n1.f;
    };
    pq.fn_Cmp = function( n0, n1 )
    {
        return n0.f == n1.f;
    };
    for ( i = 0; i < number; i++ )
    {
        n = { f: i };
        pq_Enqueue( pq, n );
    } // end for i

    n = { f: 8 };
    i = pq_GetIdx( pq, n );
    pq_Dequeue( pq, i );


    while ( pq.count > 0 )
    {
        n = pq.arr[1];
        console.log(n.f);
        pq_Dequeue( pq, 1 );
    }
}
//pq_Test();
/////////////////////////////////////////////////////////////
var MM_HEIGHT = 3;
var MM_WIDTH = 3;
var MM_O = 0;
var MM_X = 1;
function nn_CreateTable()
{
    var y, x;
    var tr, td;
    var table = document.getElementById('nnTable');
    for ( y = 0; y < MM_HEIGHT; y++ )
    {
        tr = document.createElement('tr');
        table.appendChild( tr );
        for ( x = 0; x < MM_WIDTH; x++ )
        {
            td = document.createElement('td');
            tr.appendChild(td);
            td.setAttribute('id',y+'_'+x);
            td.innerHTML = y;
        } // end for x
    } // end for y
}
function nn_Create()
{
    var y, x;
    var node;
    var nn = {
        pq: pq_Create( MM_HEIGHT*MM_WIDTH ),
        map: new Array( MM_HEIGHT )
    };
    for ( y = 0; y < nn.map.length; y++ )
    {
        nn.map[y] = new Array( MM_WIDTH );
        for ( x = 0; x < nn.map[y].length; x++ )
        {
            node = {
                y: y, x: x,
                depth: null,
                o_x: null
            };
            nn.map[y][x] = node;
        } // end for x
    } // end for y
}
function minimax( mm )
{
    var node;
    var y, x;
    var ctx = 0;
    for ( y = 0; y < mm.map.length; y++ )
    for ( x = 0; x < mm.map[y].length; x++ )
        if ( mm.map[y][x].o_x == null )
            ctx++;

    if ( ctx == 0 ) // game over
        return;

    for ( y = 0; y < mm.map.length; y++ )
    {
        for (x = 0; x < mm.map[y].length; x++)
        {
            node = mm.map[y][x];
        } // end for x
    }


}
function nn_EntryPoint()
{
    var nn = nn_Create();
    nn_CreateTable();
}
nn_EntryPoint();
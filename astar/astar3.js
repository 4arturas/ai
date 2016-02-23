function pq_Create( size )
{
    return {
        count: 0,
        arr: new Array( size+1 ),
        fnHeuristics: function( n0, n1 ) { alert('Not implemented fnHeuristics'); },
        fnEquals: function( n0, n1 ) { alert('Not implemented fnEquals'); }
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
        if ( pq.fnHeurirstics( pq.arr[parent], n ) )
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
            if ( pq.fnHeurirstics( pq.arr[child], pq.arr[child+1] ) )
                child++;

        if ( pq.fnHeurirstics( n, pq.arr[child] ) )
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
    pq.fnHeurirstics = function( n0, n1 )
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
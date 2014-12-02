function pq_Create( size )
{
    return {
        count: 0,
        arr: new Array(size+1),
        fnHeur: null,
        fnCmpTwoElementsAreEqual: null,
        ext1: null, ext2: null
    };
}

function pq_Enqueue( pq, e )
{
    var parent, child;
    pq.count++;
    parent = Math.floor( pq.count/2 );
    child = pq.count;
    while ( parent > 0 )
    {
        if ( pq.fnHeur( pq.arr[parent], e, pq ) )
        {
            pq.arr[child] = pq.arr[parent];
            child = parent;
            parent = Math.floor( parent/2 );
        }
        else
            break;
    } // end while
    pq.arr[child] = e;
}

function pq_Dequeue( pq, idx )
{
    var parent, child;
    var e;
    pq.arr[idx] = pq.arr[pq.count];
    e = pq.arr[idx];
    child = idx*2;
    parent = idx;
    while ( pq.count > child )
    {
        if ( pq.count-1 > child )
            if ( pq.fnHeur( pq.arr[child] , pq.arr[child+1], pq ) )
                child++;

        if ( pq.fnHeur( e, pq.arr[child], pq ) )
        {
            pq.arr[parent] = pq.arr[child];
            parent = child;
            child *= 2;
        }
        else
            break;
    } // end while
    pq.arr[parent] = e;
    pq.count--;
}

function pq_GetIdx( pq, e )
{
    var i;
    for ( i = 1; i <= pq.count; i++ )
    {
        if (pq.fnCmpTwoElementsAreEqual( e, pq.arr[i] ) )
            return i;
    } // end for i
    return -1;
}

function pq_CmpTwoElementsAreEqual( e0, e1 )
{
    return e0.f == e1.f;
}
function pq_CmpTest( e0, e1, pq )
{
    return e0.f > e1.f;
}

function pq_Test()
{
    var i;
    var e;
    var n = 10;
    var pq = pq_Create(n);
    pq.fnHeur = pq_CmpTest;
    for ( i = 0; i < n; i++ )
    {
        e = { f: i };
        pq_Enqueue( pq, e );
    }

    pq.fnCmpTwoElementsAreEqual = function( e0, e1, pq )
    {
        return e0.f == e1.f;
    };

//        e = { f: 2 };
//        i = pq_GetIdx( pq, e );
//        pq_Dequeue( pq, i );

    e = pq.arr[1];
    console.log(e.f);
    e = pq.arr[2];
    console.log(e.f);

    while ( pq.count != 0 )
    {
        e = pq.arr[1];
        console.log(e.f);
        pq_Dequeue( pq, 1 );
    }
}
//pq_Test();
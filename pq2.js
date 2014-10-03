function pq_Create( size )
{
    return {
        count: 0, arr: new Array(size+1),
        fnHeur: null,
        fnNodesEqual: null,
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
        if ( pq.fnHeur( pq.arr[parent], e ) )
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
    parent = idx;
    child = idx*2;
    while ( pq.count > child )
    {
        if ( pq.count-1 > child )
            if ( pq.fnHeur( pq.arr[child], pq.arr[child+1] ) )
                child++;

        if ( pq.fnHeur( e, pq.arr[child] ) )
        {
            pq.arr[parent] = pq.arr[child];
            parent = child;
            child *= 2;
        }
        else
            break;
    } // end while
    pq.count--;
    pq.arr[parent] = e;
}

function pq_GetIdx( pq, n )
{
    var i;
    for ( i = 1; i <= pq.count; i++ )
        if ( pq.fnNodesEqual( pq.arr[i], n ) )
            return i;
    return -1;
}

function pq_HeurTest( n0, n1 )
{
    return n0.f < n1.f;
}

function pq_LChild( idx )
{
    return 2 * idx + 1;
}
function pq_RChild( idx )
{
    return 2 * idx + 2;
}
function pq_Parent( idx )
{
    return Math.floor( idx/2 );
}

function pq_InorderTraversal( pq, parent )
{


    var leftOrRight = parent;

//    console.log( pq.arr[leftOrRight].f );

    leftOrRight = parent * 2 + 1;
    if ( pq.count >= leftOrRight)
        pq_InorderTraversal( pq, leftOrRight );

    console.log( leftOrRight );
    console.log( pq.arr[leftOrRight].f );

    leftOrRight = parent * 2 + 2;
    if ( pq.count >= leftOrRight )
        pq_InorderTraversal( pq, leftOrRight );

//    console.log( pq.arr[leftOrRight].f );
}

function pq_Test()
{
    var e;
    var num = 10;
    var i;
    var pq = pq_Create( num );
    pq.fnHeur = pq_HeurTest;
    for ( i = 0; i < num; i++ )
    {
        e = { f: i };
        pq_Enqueue( pq, e );
    } // end for i


//    pq_InorderTraversal( pq, 1 );
//    return;

    e = { f: 7 };
    pq.fnNodesEqual = function( n0, n1 )
    {
        return n0.f == n1.f;
    };
    i = pq_GetIdx( pq, e );
    pq_Dequeue( pq, i );

    while ( pq.count > 0 )
    {
        e = pq.arr[1];
        pq_Dequeue( pq, 1 );
        console.log(e.f);
    } // end while
}

//pq_Test();
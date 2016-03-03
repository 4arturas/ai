function rnd_Real(x,y)
{
    return Math.random() * ( y - x ) + x;
}
function rnd_Int(x,y)
{
    return Math.floor(
        Math.random() * ( y - x + 1 ) + x
    );
}
function log( l )
{
    console.log( l );
}
function assert(a, msg)
{
    if ( !a )
        log( 'Assertion failed: ' + msg );
        //alert( 'Assertion failed: ' + msg );
}

//////////////////////////////////////////////////////////////////////
function pq_Create( size )
{
    return {
        count: 0,
        arr: new Array(size+1),
        fnHeur: function( n0, n1 ) { alert('Not implemented fnHeur'); },
        fnEquals: function( n0, n1 ) { alert('Not implemented fnEquals'); }
    };
}
function pq_Enqueue( pq, n )
{
    var parent, child;
    pq.count++;
    parent = Math.floor(pq.count/2);
    child = pq.count;
    while ( parent > 0 )
    {
        if ( pq.fnHeur( pq.arr[parent], n ) )
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
    var y;
    for ( y = 1; y <= pq.count; y++ )
    {
        if ( pq.fnEquals(pq.arr[y], n ) )
            return y;
    } // end for y
    return -1;
}
function pq_Test()
{
    var y;
    var n;
    var size = 10;
    var pq = pq_Create( size );
    pq.fnHeur = function( n0, n1 )
    {
        return n0.f > n1.f;
    };
    pq.fnEquals = function( n0, n1 )
    {
        return n0.f == n1.f;
    };
    for ( y = 0; y < size; y++ )
    {
        var num = rnd_Int(0,10);
        //log( num );
        n = { f: num };
        pq_Enqueue( pq, n );
    } // end for y
    n = {f:8};
    y = pq_GetIdx( pq, n );
    //pq_Dequeue( pq, y );
    while ( pq.count > 0 )
    {
        n = pq.arr[1];
        console.log(n.f);
        pq_Dequeue( pq, 1 );
    } // end while
}
//pq_Test();

var ENC_GENE = [
    '0000', // 0
    '0001', // 1
    '0010', // 2
    '0011', // 3
    '0100', // 4
    '0101', // 5
    '0110', // 6
    '0111', // 7
    '1000', // 8
    '1001', // 9
    '1010', // 10 +
    '1100', // 11 -
    '1101', // 12 *
    '1110'  // 13 /
];

var GA_GENE_LENGTH = 4;
var GA_CHROMO_LENGTH = GA_GENE_LENGTH*100;
function ga_CreateChromo()
{
    var c = { fitness: 0, chromo: '', str: '', sum: 0 };
    var y;
    for ( y = 0; y < GA_CHROMO_LENGTH; y++ )
        c.chromo += rnd_Int( 0,1 );
    return c;
}
function ga_DecodeGene( gene )
{
    var y;
    for ( y = 0; y < ENC_GENE.length; y++ )
        if ( ENC_GENE[y] == gene )
            return y;
    return -1;
}
var GA_STATE_DIGIT = 0;
var GA_STATE_OPERATION = 1;
function ga_DecodeChromo( chromo )
{
    var y;
    var gene, g;
    var buff = new Array();
    var state = GA_STATE_OPERATION;
    for ( y = 0; y < GA_CHROMO_LENGTH; y += GA_GENE_LENGTH )
    {
        g = chromo.substr( y, GA_GENE_LENGTH );
        gene = ga_DecodeGene( g );
        if ( gene == -1 )
            continue;
        switch ( state )
        {
            case GA_STATE_OPERATION:
                if ( 10 > gene || gene > 13 )
                    continue;
                state = GA_STATE_DIGIT;
                break;
            case GA_STATE_DIGIT:
                if ( 0 > gene || gene > 9 )
                    continue;
                state = GA_STATE_OPERATION;
                break;
            default:
                assert( false, 'ga_DecodeChromo' );
        } // end switch

        buff.push( gene );

        if ( buff.length == 10 )
            break;
    } // end for y

    for ( y = 0; y < buff.length; y += 2 )
    {
        if ( buff[y] == 13 && buff[y+1] == 0 )
            buff[y] = 10;
    } // end for y

    return buff;
}
function ga_CalculateFitness( chromo, targetValue )
{
    var sum = 0;
    var buff = ga_DecodeChromo( chromo.chromo );
    chromo.sum = 0;
    for ( var y = 0; y < buff.length; y += 2 )
    {
        var valOperation = buff[y];
        var valDigit = buff[y+1];
        switch ( valOperation )
        {
            case 10:
                sum += valDigit;
                chromo.str += '+'+valDigit;
                break;
            case 11:
                sum -= valDigit;
                chromo.str += '-'+valDigit;
                break;
            case 12:
                sum *= valDigit;
                chromo.str += '*'+valDigit;
                break;
            case 13:
                sum /= valDigit;
                chromo.str += '/'+valDigit;
                break;
            default:
                assert( false, 'ga_CalculateFitness' );
        } // end switch
    } // end for y
    //log( 'sum:' + sum + ' = ' + chromo.str );
    chromo.fitness = 1.0 / ( targetValue - sum );
    chromo.sum = sum;
    return chromo;
}
function ga_Mutate( chromo )
{
    var c0 = '';
    var y;
    for ( y = 0; y < GA_CHROMO_LENGTH; y++ )
    {
        if ( rnd_Real(0,1) > 0.07 )
            c0 += chromo.charAt(y) == '1' ? '0' : '1';
        else
            c0 += chromo.charAt(y);
    } // end for y
    return c0;
}
function ga_CrossoverAndMutate( mum, dad )
{
    var y, crossover;
    var baby0 = ga_CreateChromo();
    var baby1 = ga_CreateChromo();
    if ( rnd_Real(0,1) > 0.5 )
    {
        baby0.chromo = mum.chromo;
        baby1.chromo = dad.chromo;
        return [baby0,baby1];
    }

    crossover = rnd_Int( 0, GA_CHROMO_LENGTH-1 );

    baby0.chromo = '';
    baby1.chromo = '';
    for ( y = 0; y < crossover; y++ )
    {
        baby0.chromo += mum.chromo.charAt(y);
        baby1.chromo += dad.chromo.charAt(y);
    }
    for ( ; y < GA_CHROMO_LENGTH; y++ )
    {
        baby0.chromo += dad.chromo.charAt(y);
        baby1.chromo += mum.chromo.charAt(y);
    } // end for y

    return [baby0,baby1];
}
var GA_POP_SIZE = 100;
function ga_RouletteWheel( POP, totalFitness )
{
    var y;
    var fitnessScale = rnd_Real(0,totalFitness);
    var fitnessSoFar = 0.0;
    for ( y = 0; y < GA_POP_SIZE; y++ )
    {
        fitnessSoFar += POP[y].fitness;
        if ( fitnessSoFar >= fitnessScale )
            return POP[y];
    } // end for y
    assert( false, 'ga_RouletteWheel' );
}
function ga_Main()
{
    var targetValue = 25;
    var totalFitness;
    var solutionFound = 0;
    var y, e;
    var POP = new Array(GA_POP_SIZE);
    var pq = pq_Create( GA_POP_SIZE );
    pq.fnHeur = function( n0, n1 )
    {
        return n1.fitness > n0.fitness;
    };
    for ( y = 0; y < GA_POP_SIZE; y++ )
    {
        POP[y] = ga_CreateChromo();
    } // end for y
    for ( e = 0; e < 1000; e++ )
    {
        totalFitness = 0;
        pq.count = 0;
        for ( y = 0; y < GA_POP_SIZE; y++ )
        {
            var agent = ga_CalculateFitness( POP[y], targetValue );
            if ( Math.floor(agent.sum) == targetValue )
            {
                log( 'epoch=' + e + ' targetValue='+targetValue+' result='+agent.sum );
                return;
            }
            totalFitness += agent.fitness;
            pq_Enqueue( pq, agent );
        } // end for y

        POP = new Array();
        log('////////////////////');
        while ( pq.count > 0 )
        {
            log(pq.arr[1].fitness);
            POP.push( pq.arr[1] );
            pq_Dequeue( pq, 1 )
        } // end while

        var POPT = new Array();
        for ( y = 0; y < GA_POP_SIZE/2; y++ )
        {
            var mum = ga_RouletteWheel( POP, totalFitness );
            var dad = ga_RouletteWheel( POP, totalFitness );
            var res = ga_CrossoverAndMutate( mum, dad );
            var baby0 = res[0];
            var baby1 = res[1];
            POPT.push( baby0 );
            POPT.push( baby1 );
        } // end for y

        POP = POPT;

        //log( e );
    } // end for y



}
ga_Main();


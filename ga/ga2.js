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
function assert(a, msg)
{
    if ( !a )
        alert( 'Assertion failed: ' + msg );
}
function log( l )
{
    console.log( l );
}
//////////////////////////////////////////////////////////////////////
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
var GA_CHROMO_LENGTH = 100*GA_GENE_LENGTH;

function ga_CreateChromo()
{
    var y;
    var g = { fitness: 0, chromo: '', str: '' };
    for ( y = 0; y < GA_CHROMO_LENGTH; y++ )
    {
        g.chromo += rnd_Int( 0, 1 );
    }
    return g;
}
function ga_GeneDecode( gene )
{
    var y;
    for ( y = 0; y < ENC_GENE.length; y++ )
    {
        if ( ENC_GENE[y] == gene )
            return y;
    }
    return -1;
}
var GA_GENE_DIGIT = 0;
var GA_GENE_OPERATION = 1;
function ga_ChromoDecode( chromo )
{
    var buff = new Array();
    var y, x = 0;
    var gene, g;
    var op = GA_GENE_OPERATION;
    for ( y = 0; y < GA_CHROMO_LENGTH; y += GA_GENE_LENGTH )
    {
        g = chromo.substr( y, GA_GENE_LENGTH );
        gene = ga_GeneDecode( g );
        if ( gene == -1 )
            continue;

        if ( op == GA_GENE_OPERATION )
        {
            if ( 10 > gene || gene > 13 )
                continue;
            op = GA_GENE_DIGIT;
        }
        else if ( op == GA_GENE_DIGIT )
        {
            if ( gene > 9 || 0 > gene )
                continue;
            op = GA_GENE_OPERATION;
        }
        else
            assert( false, 'ga_ChromoDecode' );

        buff.push( gene );
    } // end for y

    for ( y = 0; y < buff.length; y += 2 )
    {
        var vOperation = buff[y];
        var vDigit = buff[y+1];
        if ( vOperation == 13 && vDigit == 0 )
            buff[y] = 10; // +
    }

    return buff;
}
function ga_CalcFitness( chromo, targetValue )
{

}
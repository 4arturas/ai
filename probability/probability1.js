function perm( nAttempts )
{
    var res = nAttempts;
    for ( var n = nAttempts-1; n >= 2; n-- )
    {
        res *= n;
    }
    if ( res == 0 ) res = 1; // Jeigu rezultatas = 0 reiskia 1
    return res;
}
function N_choose_K( nAttempts, kScores ) // k scores in n attempts
{
    var i;
    var nomitator = perm( nAttempts );
    var denominator = perm( kScores * (nAttempts-kScores));
    return nomitator/denominator;

}
var r = N_choose_K( 5, 2 );
console.log( r );
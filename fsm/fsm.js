var states = { initial: 0, state_1: 1, state_final: 2 };
var signals = { sign0: 0, sign1: 1, sign2: 2 };

var tableFSM = new Array();

function fsm_Init()
{
    var y, x;
    tableFSM = [

    ];

}
function fsm_Do()
{
    _log( tableFSM[0][0] );
}
fsm_Init();
fsm_Do();

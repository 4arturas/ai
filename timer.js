function timer_Create( fps )
{
    var timer =  {
        currentTime: null,
        lastTime: null,
        nextTime: null,
        frameTime: null,
        timeElapsed: null,
        timeScale: null
    };

    var counterFreq = 1.0;
    timer.timeScale = 1.0 / counterFreq;
    timer.frameTime = counterFreq / fps;

    timer.timeElapsed = 0.0;
    timer.lastTime = new Date().getTime();
    timer.nextTime = timer.lastTime + timer.frameTime;
    _log ( timer.frameTime );
}

function timer_ReadyForNextFrame( tm )
{
    tm.currentTime = new Date().getTime();
    if ( tm.currentTime > tm.nextTime )
    {
        tm.timeElapsed = ( tm.currentTime - tm.lastTime ) * tm.timeScale;
        tm.lastTime = tm.currentTime;
        tm.nextTime = tm.currentTime + tm.frameTime;
        return 1;
    }
    return 0;
}

function timer_Test()
{
    var t = timer_Create( 45.0 );
    timer_ReadyForNextFrame( t );
}
timer_Test();
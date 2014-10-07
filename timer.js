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


/*
    var counterFreq = 200.0;
    timer.timeScale = 1.0 / counterFreq;
    timer.frameTime = counterFreq / fps;

    timer.timeElapsed = 0.0;
*/

    timer.lastTime = new Date().getTime();
    timer.frameTime = fps;
    timer.nextTime = timer.lastTime + timer.frameTime;
    return timer;
}

function timer_NextFrame( timer )
{
    timer.currentTime = new Date().getTime();
    if ( timer.currentTime > timer.nextTime )
    {
//        timer.timeElapsed = ( timer.currentTime - timer.lastTime ) * timer.timeScale;
        timer.lastTime = timer.currentTime;
        timer.nextTime = timer.currentTime + timer.frameTime;
        return 1;
    }
    return 0;
}

function timer_Test()
{
    var t = timer_Create( 45.0 );
    timer_ReadyForNextFrame( t );
}
//timer_Test();
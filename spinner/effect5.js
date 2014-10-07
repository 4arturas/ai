function spinner_Effect_5()
{
    var i;
    var obj;
    switch ( gSpinner.state )
    {
        case SPINNER_STATE_INIT:

            gSpinner.state = SPINNER_STATE_WORKING;
            gSpinner.angleStep = 0.5;
            gSpinner.sequanceArr = new Array(gSpinner.objectsArr.length);
            gSpinner.effectTypeArr = new Array(gSpinner.objectsArr.length);
            for ( i = 0; i < gSpinner.objectsArr.length; i++ )
            {
                gSpinner.effectTypeArr[i] = -1;
                gSpinner.sequanceArr[i] = i;
            }
            gSpinner.effectTypeArr[0] = SPINNER_EFFECT_1;

            break;

        case SPINNER_STATE_WORKING:

            for ( i = 0; i < gSpinner.objectsArr.length; i++ )
            {
                obj = gSpinner.objectsArr[i];

                if ( gSpinner.effectTypeArr[i] == SPINNER_EFFECT_1 )
                {
                    obj.matrix = mat4x3_RotYY( gSpinner.angle );
                    gSpinner.angle += gSpinner.angleStep;
                    if ( _abs( gSpinner.angle ) > geomPI )
                    {
                        obj.matrix = mat4x3_CreateIdentity();
                        gSpinner.angle = 0;
                        gSpinner.effectTypeArr[i] = -1;
                        var nextIdx = i+1;
                        if ( nextIdx == gSpinner.objectsArr.length )
                            nextIdx = 0;
                        _log( nextIdx );
                        gSpinner.effectTypeArr[nextIdx] = SPINNER_EFFECT_1;
                    } // end if
                } // end if
            } // end for i

            break;
    } // end switch

    odobo_SpinnerSetXYZ( gSpinner.objectsArr );
    return 1;
}


function spinner_Effect_3_SetStep()
{
    var r = _randomInt( 0, 1 );
    if ( r == 0 )
        return gSpinner.angleStep;
    return -gSpinner.angleStep;
}
function spinner_Effect_3()
{
    var i;
    var obj;

    switch ( gSpinner.state )
    {
        case SPINNER_STATE_INIT:

            gSpinner.state = SPINNER_STATE_WORKING;
            gSpinner.angleStep = 0.2;
            gSpinner.effectTypeArr = new Array( gSpinner.objectsArr.length );
            gSpinner.angle = new Array( gSpinner.objectsArr.length );
            gSpinner.angleStepArr = new Array( gSpinner.objectsArr.length );
            for ( i = 0; i < gSpinner.effectTypeArr.length; i++ )
            {
                gSpinner.effectTypeArr[i] = -1;
                gSpinner.angle[i] = 0.0;
                gSpinner.angleStepArr[i] = gSpinner.angleStep;
//                gSpinner.effectTypeArr[i] = _randomInt(0, 2);
            }
            break;

        case SPINNER_STATE_WORKING:
            for ( i = 0; i < gSpinner.objectsArr.length; i++ )
            {
                obj = gSpinner.objectsArr[i];

                if ( gSpinner.effectTypeArr[i] == -1 ) // 1. if effect is not set
                {
                    var r = _randomInt( 0, 50 );
                    if ( r == 1 )
                    {
                        gSpinner.effectTypeArr[i] = SPINNER_EFFECT_1;
                        gSpinner.angleStepArr[i] = spinner_Effect_3_SetStep();
                    }
                    else if ( r == 2 )
                    {
                        gSpinner.effectTypeArr[i] = SPINNER_EFFECT_2;
                        gSpinner.angleStepArr[i] = spinner_Effect_3_SetStep();
                    }
                    else if ( r == 3 )
                    {
                        gSpinner.effectTypeArr[i] = SPINNER_EFFECT_3;
                        gSpinner.angleStepArr[i] = spinner_Effect_3_SetStep();
                    }
                } // end if 1.

                else // if effect is set
                {
                    var angle = gSpinner.angle[i];
                    if (gSpinner.effectTypeArr[i] == SPINNER_EFFECT_1)
                        obj.matrix = mat4x3_RotXX( angle );
                    else if (gSpinner.effectTypeArr[i] == SPINNER_EFFECT_2)
                        obj.matrix = mat4x3_RotYY( angle );
                    else if (gSpinner.effectTypeArr[i] == SPINNER_EFFECT_3)
                        obj.matrix = mat4x3_RotZZ( angle );
                } /// end else

                gSpinner.angle[i] += gSpinner.angleStepArr[i];
                if ( _abs( gSpinner.angle[i] )  > geomPI )
                {
                    gSpinner.angle[i] = 0;
                    gSpinner.effectTypeArr[i] = -1;
                    obj.matrix = mat4x3_CreateIdentity();
                }

            } // end for i

            break;
    } // end switch

    odobo_SpinnerSetXYZ( gSpinner.objectsArr );
    return 1;
}
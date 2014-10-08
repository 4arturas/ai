var spinnerEffect4_Vehicle;
var spinnerEffect4_Home;
var spinnerEffect4_Target;
function spinner_Effect_4_CreateTargets()
{
    var i, j, k, r;
    for ( i = 0; i < spinnerEffect4_Home.length; i++ )
    {
        spinnerEffect4_Target[i] = -1;
        while (spinnerEffect4_Target[i] == -1)
        {
            r = _randomInt(0, spinnerEffect4_Home.length - 1);
            var exists = false;
            for ( j = 0; j < spinnerEffect4_Home.length; j++ )
            {
                if ( i == j ) // myself
                    continue;
                if ( spinnerEffect4_Target[j] == -1 )
                    continue;

                if ( spinnerEffect4_Target[j] == r )
                {
                    exists = true;
                    break;
                }
            } // end for j
            if ( exists == false )
                spinnerEffect4_Target[i] = r;
        } // end while
    } // end for i
}
function spinner_Effect_4()
{
    var i, j, k, r;
    var obj;
    var vehicle;
    switch ( gSpinner.state )
    {
        case SPINNER_STATE_INIT:
            gSpinner.state = SPINNER_STATE_WORKING;
            spinnerEffect4_Home = odobo_SpinnerCreateHome( gSpinner.objectsArr.length, gSpinner.z );

            spinnerEffect4_Vehicle = new Array( spinnerEffect4_Home.length );

            // create teargets
            spinnerEffect4_Target = new Array( spinnerEffect4_Home.length );
            spinner_Effect_4_CreateTargets();

            for ( i = 0; i < gSpinner.objectsArr.length; i++ )
            {
                {
                    vehicle = vehicle_Create();
                    vehicle.position = spinnerEffect4_Home[i];
                    vehicle.velocity = vec3D_Create( 0.0, 0.0, 0.0 );

                    vehicle.max_force = 1;
                    vehicle.mass = 1;
                    vehicle.max_speed = 5;

                    k = spinnerEffect4_Target[i];
                    vehicle.target = spinnerEffect4_Home[k];
                }


                spinnerEffect4_Vehicle[i] = vehicle;

                obj = gSpinner.objectsArr[i];
                obj.matrix = mat4x3_CreateIdentity();
                obj.matrix.tx = vehicle.position.x;
                obj.matrix.ty = vehicle.position.y;
                obj.matrix.tz = gSpinner.z;
            } // end for i
            break;

        case SPINNER_STATE_WORKING:

            for ( i = 0; i < gSpinner.objectsArr.length; i++ )
            {
                vehicle = spinnerEffect4_Vehicle[i];
                if ( !vec3D_Equal( vehicle.position, vehicle.target ))
                    steering_Update( vehicle );

                obj = gSpinner.objectsArr[i];
                obj.matrix = mat4x3_CreateIdentity();
                obj.matrix.tx = vehicle.position.x;
                obj.matrix.ty = vehicle.position.y;
                obj.matrix.tz = gSpinner.z;
            } // end for i

            break;
    } // end switch

//    odobo_SpinnerSetXYZ( gSpinner.objectsArr );
    return 1;
}
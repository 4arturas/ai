function spinner_Effect_5_CreateTargets()
{
    var i, j, k, r;
    for ( i = 0; i < gSpinner.homeArr.length; i++ )
    {
        gSpinner.targetArr[i] = -1;
        while (gSpinner.targetArr[i] == -1)
        {
            r = _randomInt(0, gSpinner.homeArr.length - 1);
            var exists = false;
            for ( j = 0; j < gSpinner.homeArr.length; j++ )
            {
                if ( i == j ) // myself
                    continue;
                if ( gSpinner.targetArr[j] == -1 )
                    continue;

                if ( gSpinner.targetArr[j] == r )
                {
                    exists = true;
                    break;
                }
            } // end for j
            if ( exists == false )
                gSpinner.targetArr[i] = r;
        } // end while
    } // end for i
}
function spinner_Effect_5()
{
    var i, j, k, r;
    var obj;
    var vehicle;
    var pos;
    switch ( gSpinner.state )
    {
        case SPINNER_STATE_INIT:
            gSpinner.state = SPINNER_STATE_WORKING;
            gSpinner.homeArr = odobo_SpinnerCreateHome( gSpinner.objectsArr.length, gSpinner.z );

            gSpinner.vehicleArr = new Array( gSpinner.homeArr.length );

            // create teargets
            gSpinner.targetArr = new Array( gSpinner.homeArr.length );
            spinner_Effect_5_CreateTargets();

            for ( i = 0; i < gSpinner.objectsArr.length; i++ )
            {
                {
                    vehicle = vehicle_Create();
                    pos = gSpinner.homeArr[i];
                    vehicle.position = vec3D_Create( pos.x, pos.y, pos.z );
                    vehicle.velocity = vec3D_Create( 0.0, 0.0, 0.0 );

                    vehicle.max_force = 1;
                    vehicle.mass = 1;
                    vehicle.max_speed = 10;

                    k = gSpinner.targetArr[i];
                    pos = gSpinner.homeArr[k];
                    vehicle.target = vec3D_Create( pos.x, pos.y, pos.z );
                }


                gSpinner.vehicleArr[i] = vehicle;

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
                vehicle = gSpinner.vehicleArr[i];
                var dist = vec3D_Dist( vehicle.position, vehicle.target );
                _log( dist );
                if ( dist > 200 )
                {
//                    gSpinner.state = SPINNER_STATE_INIT;
//                    break;
                }
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
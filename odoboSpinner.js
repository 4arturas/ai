

var seekVehicle;
function odobo_Seek()
{
//    http://gamedevelopment.tutsplus.com/series/understanding-steering-behaviors--gamedev-12732
    var obj;
    odobo_ResetObjects();
    obj = gSpinner.objectsArr[0];
    obj.state = STATE_ON;
    obj.attr = ATTR_2SIDE | ATTR_WIRED;
    switch ( gSpinner.state )
    {

        case SPINNER_STATE_INIT:
            gSpinner.state = SPINNER_STATE_WORKING;

            seekVehicle = vehicle_Create();
            seekVehicle.position = vec3D_Create( 0, 0, 0 );
            seekVehicle.velocity = vec3D_Create( 10.0, 10.0, 10.0 );
            seekVehicle.maxSpeed = 100.0;
            seekVehicle.mass = 1.0;
            seekVehicle.target = vec3D_Create( 300, 200, 500 );

            break;

        case SPINNER_STATE_WORKING:

            steering_Update( seekVehicle );
            obj.matrix = mat4x3_CreateIdentity();
            obj.matrix.tx = seekVehicle.position.x;
            obj.matrix.ty = seekVehicle.position.y;
            obj.matrix.tz = seekVehicle.position.z;


            var length = vec3D_Dist( seekVehicle.position, seekVehicle.target );
            if ( 12 > length )
                gSpinner.state = SPINNER_STATE_STOPPED;
            return 1;

        case SPINNER_STATE_STOPPED:
            _log( 'Arrived' );
            return 0;
    }
    return 1;
}


function odobo_Flee()
{
    return 0;
}
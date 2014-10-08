var gTestVehicle;
var steeringTestType = 0;
function steeringTest_Seek()
{
//    http://gamedevelopment.tutsplus.com/series/understanding-steering-behaviors--gamedev-12732
    var obj;
    odobo_ResetObjects();
    obj = gSpinner.objectsArr[0];
    obj.state = STATE_ON;
    obj.attr = ATTR_2SIDE | ATTR_WIRED;

    switch ( steeringTestType )
    {

        case 0:
            steeringTestType = 1;

            gTestVehicle = vehicle_Create();
            gTestVehicle.position = vec3D_Create( 0, 0, 0 );
            gTestVehicle.velocity = vec3D_Create( 10.0, 10.0, 10.0 );

            gTestVehicle.max_force = 100;
            gTestVehicle.mass = 6;
            gTestVehicle.max_speed = 10;

            gTestVehicle.target = vec3D_Create( 300, 200, 500 );
//            gTestVehicle.target = vec3D_Create( 50, 0, 0 );

            break;

        case 1:

            steering_Update( gTestVehicle );
            obj.matrix = mat4x3_CreateIdentity();
            obj.matrix.tx = gTestVehicle.position.x;
            obj.matrix.ty = gTestVehicle.position.y;
            obj.matrix.tz = gTestVehicle.position.z;


            var length = vec3D_Dist( gTestVehicle.position, gTestVehicle.target );
            _log( length );
            if ( 2 > length )
            {
                _log( length );
                steeringTestType = 2;
            }
            return 1;

        case 2:
            _log( 'Arrived' );
            return 0;
    }
    return 1;
}


function steeringTest_Flee()
{
    return 0;
}
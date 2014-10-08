var STEERING_SEEK = 1;
var STEERING_FLEE = 2;
var STEERING_ARRIVAL = 3;
//http://www.red3d.com/cwr/steer/gdc99/
/*
Simple Vehicle Model:
    mass          scalar
position      vector
velocity      vector
max_force     scalar
max_speed     scalar
orientation   N basis vectors
*/
function vehicle_Create()
{
    return {
        steeringType: 0,
        position: vec3D_Create(0,0,0),
        rotation: 0.0,
        velocity: vec3D_Create(0,0,0),
        mass: 0.0,
        max_force: 0.0,
        max_speed: 0.0,

        target: vec3D_Create(0,0,0)
    };
}

function steering_Seek( vehicle )
{
//    desired_velocity = normalize (position - target) * max_speed
    var desired_velocity = vec3D_Sub( vehicle.position, vehicle.target );
    desired_velocity = vec3D_MulScalar( desired_velocity, vehicle.max_speed );
//    steering = desired_velocity - velocity
    var steering = vec3D_Sub( desired_velocity, vehicle.velocity );
    return steering;
}

function steering_Arrival( vehicle )
{
//    target_offset = target - position
    var target_offset = vec3D_Sub( vehicle.target, vehicle.position );
//    distance = length (target_offset)
    var distance = vec3D_Length( target_offset );
    if ( distance == 0 )
    {
        distance = distance;
    }
//    ramped_speed = max_speed * (distance / slowing_distance)
    var slowing_distance = 5.0;
    var ramped_speed = vehicle.max_speed * ( distance / slowing_distance );
//    clipped_speed = minimum (ramped_speed, max_speed)
    var clipped_speed = _min( ramped_speed, vehicle.max_speed );
//    desired_velocity = (clipped_speed / distance) * target_offset
    var desired_velocity = vec3D_MulScalar( target_offset, clipped_speed/distance );
//    steering = desired_velocity - velocity
    var steering = vec3D_Sub( desired_velocity, vehicle.velocity );
    return steering;

}

function steering_Calculate( vehicle )
{
    switch ( vehicle.steeringType )
    {
        case STEERING_SEEK:
            return steering_Seek( vehicle );
        case STEERING_ARRIVAL:
            return steering_Arrival( vehicle );
        default:
            _assert( false, 'steering_Calculate: not known vehicle.steeringType' );
    } // end switch
}

function steering_Update( vehicle )
{
    var steering_direction = steering_Calculate( vehicle );

//    steering_force = truncate (steering_direction, max_force)
    var steering_force = vec3D_Truncate( steering_direction, vehicle.max_force );
//    acceleration = steering_force / mass
    var acceleration = vec3D_DivScalar( steering_force, vehicle.mass );
//    velocity = truncate (velocity + acceleration, max_speed)
    var velocity = vec3D_Add( vehicle.velocity, acceleration );
    vehicle.velocity = vec3D_Truncate( velocity, vehicle.max_speed );
//    position = position + velocity
    vehicle.position = vec3D_Add( vehicle.position, vehicle.velocity );
}
function steering_Update_( vehicle )
{
//    _assert( vec3D_Equal( vehicle.position, vehicle.target), 'steering_Update position == target' );
    //update the time elapsed
    var timeElapsed = 0.5;

    //keep a record of its old position so we can update its cell later
    //in this method
    var oldPos = vehicle.position;

    var steeringForce;

    //calculate the combined force from each steering behavior in the
    //vehicle's list
    steeringForce = steering_Calculate( vehicle );

    //Acceleration = Force/Mass
    var acceleration = vec3D_DivScalar( steeringForce, vehicle.mass );

    //update velocity
    vehicle.velocity = vec3D_MulScalar( acceleration, timeElapsed );

    //make sure vehicle does not exceed maximum velocity
//    m_vVelocity.Truncate(m_dMaxSpeed);

    //update the position
//    m_vPos += m_vVelocity * time_elapsed;
    var tmp = vec3D_MulScalar( vehicle.velocity, timeElapsed );

    vehicle.position = vec3D_Add( vehicle.position, tmp );

}


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
//    steering_force = truncate (steering_direction, max_force)
    var steering_force = vec3D_Truncate( vehicle.target, vehicle.max_force );
//    acceleration = steering_force / mass
    var acceleration = vec3D_DivScalar( steering_force, vehicle.mass );
//    velocity = truncate (velocity + acceleration, max_speed)
    var velocity = vec3D_Add( vehicle.velocity, acceleration );
    vehicle.velocity = vec3D_Truncate( velocity, vehicle.max_speed );
//    position = position + velocity
    vehicle.position = vec3D_Add( vehicle.position, vehicle.velocity );
}

function steering_Update( vehicle )
{
    steering_Seek( vehicle );
}

function steering_Seek_( vehicle )
{
    var t = 0;
    var direction = vec3D_Sub( vehicle.target, vehicle.position );
    if ( vec3D_IsNaN( direction ) )
    {
        t = t;
    }
    var normalizecDirection = vec3D_Normalize( direction );
    if ( vec3D_IsNaN( normalizecDirection ) )
    {
        t = t;
    }
    var velocity = vec3D_MulScalar( normalizecDirection, vehicle.max_speed );
    if ( vec3D_IsNaN( velocity ) )
    {
        t = t;
    }
    var desiredVelocity = vec3D_Sub( velocity, vehicle.velocity );
    if ( vec3D_IsNaN( desiredVelocity ) )
    {
        t = t;
    }
    return desiredVelocity;
}

function steering_Calculate( vehicle )
{
    return steering_Seek( vehicle );
}

function steering_Update_( vehicle )
{
    _assert( vec3D_Equal( vehicle.position, vehicle.target), 'steering_Update position == target' );
    //update the time elapsed
    var timeElapsed = 0.5;

    //keep a record of its old position so we can update its cell later
    //in this method
    var oldPos = vehicle.position;
    if ( vec3D_IsNaN( oldPos ) )
    {
        oldPos = oldPos;
    }


    var steeringForce;

    //calculate the combined force from each steering behavior in the
    //vehicle's list
    steeringForce = steering_Calculate( vehicle );
    if ( vec3D_IsNaN( steeringForce ) )
    {
        oldPos = oldPos;
    }

    //Acceleration = Force/Mass
    var acceleration = vec3D_DivScalar( steeringForce, vehicle.mass );
    if ( vec3D_IsNaN( acceleration ) )
    {
        oldPos = oldPos;
    }

    //update velocity
    vehicle.velocity = vec3D_MulScalar( acceleration, timeElapsed );
    if ( vec3D_IsNaN( vehicle.velocity ) )
    {
        oldPos = oldPos;
    }

    //make sure vehicle does not exceed maximum velocity
//    m_vVelocity.Truncate(m_dMaxSpeed);
    vehicle.velocity = vec3D_Truncate( vehicle.velocity, vehicle.max_speed );
    if ( vec3D_IsNaN( vehicle.velocity ) )
    {
        oldPos = oldPos;
    }

    //update the position
//    m_vPos += m_vVelocity * time_elapsed;
    var tmp = vec3D_MulScalar( vehicle.velocity, timeElapsed );
    if ( vec3D_IsNaN( tmp ) )
    {
        oldPos = oldPos;
    }
    vehicle.position = vec3D_Add( vehicle.position, tmp );
    if ( vec3D_IsNaN( vehicle.position ) )
    {
        oldPos = oldPos;
    }



}


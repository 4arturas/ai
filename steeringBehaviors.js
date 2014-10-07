var STEERING_SEEK = 0x01;

function vehicle_Create()
{
    return {
        steeringType: 0,
        position: vec3D_Create(0,0,0),
        rotation: 0.0,
        velocity: vec3D_Create(0,0,0),
        mass: 0.0,
        maxForce: 0.0,
        maxSpeed: 0.0,
        maxTurnRate: 0.0,
        scale: 0.0,

        heading: vec3D_Create(0,0,0),
        side: vec3D_Create(0,0,0),
        target: vec3D_Create(0,0,0)
    };
}

function steering_Seek( vehicle )
{
    var desiredVelocity = vec3D_Sub( vehicle.target, vehicle.position );
    desiredVelocity = vec3D_Normalize( desiredVelocity );
    desiredVelocity = vec3D_MulScalar( desiredVelocity, vehicle.maxSpeed );
    desiredVelocity = vec3D_Sub( desiredVelocity, vehicle.velocity );
    return desiredVelocity;
}

function steering_Calculate( vehicle )
{
    return steering_Seek( vehicle );
}

function steering_Update( vehicle )
{
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
//    Vector2D acceleration = SteeringForce / m_dMass;
    var acceleration = vec3D_DivScalar( steeringForce, vehicle.mass );

    //update velocity
//    m_vVelocity += acceleration * time_elapsed;
    vehicle.velocity = vec3D_MulScalar( acceleration, timeElapsed );

    //make sure vehicle does not exceed maximum velocity
//    m_vVelocity.Truncate(m_dMaxSpeed);
    vehicle.velocity = vec3D_Truncate( vehicle.velocity, vehicle.maxSpeed );

    //update the position
//    m_vPos += m_vVelocity * time_elapsed;
    var tmp = vec3D_MulScalar( vehicle.velocity, timeElapsed );
    vehicle.position = vec3D_Add( vehicle.position, tmp );

    //update the heading if the vehicle has a non zero velocity
//    if (m_vVelocity.LengthSq() > 0.00000001)
    if ( vec3D_Length( vehicle.velocity ) > 0.00000001 )
    {
//        m_vHeading = Vec2DNormalize(m_vVelocity);
        vehicle.heading = vec3D_Normalize( vehicle.velocity );
//        m_vSide = m_vHeading.Perp();
        vehicle.side = vec3D_Cross( vehicle.heading, vehicle.velocity );
    }

    /*
    //EnforceNonPenetrationConstraint(this, World()->Agents());

    //treat the screen as a toroid
    WrapAround(m_vPos, m_pWorld->cxClient(), m_pWorld->cyClient());

    //update the vehicle's current cell if space partitioning is turned on
    if (Steering()->isSpacePartitioningOn())
    {
        World()->CellSpace()->UpdateEntity(this, OldPos);
    }

    if (isSmoothingOn())
    {
        m_vSmoothedHeading = m_pHeadingSmoother->Update(Heading());
    }
    */

}


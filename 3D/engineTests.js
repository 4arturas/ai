
var testQuadsCounter = 0;
var testQuadsAngle0 = 0;
var testQuadsAngle1 = 0;
function engineTest_Quads1()
{
    var angle = 0.1;
    if ( testQuadsCounter++ == 10000 ) return 0;

    //odobo_ResetObjects();

    gEngine.objectsArr[gEngine.OBJ_QUAD_0].matrix = mat4x3_RotXX( testQuadsAngle0 );
    gEngine.objectsArr[gEngine.OBJ_QUAD_1].matrix = mat4x3_RotYY( testQuadsAngle0 );
    gEngine.objectsArr[gEngine.OBJ_QUAD_2].matrix = mat4x3_RotZZ( testQuadsAngle0 );

    gEngine.objectsArr[gEngine.OBJ_QUAD_0].color = gPixelRed;
    gEngine.objectsArr[gEngine.OBJ_QUAD_1].color = gPixelGreen;
    gEngine.objectsArr[gEngine.OBJ_QUAD_2].color = gPixelBlue;

    gEngine.objectsArr[gEngine.OBJ_QUAD_0].state |= STATE_ON;
    gEngine.objectsArr[gEngine.OBJ_QUAD_1].state |= STATE_ON;
//            gEngine.objectsArr[gEngine.OBJ_QUAD_2].state |= STATE_ON;

    gEngine.objectsArr[gEngine.OBJ_QUAD_0].attr |= ATTR_2SIDE;
    gEngine.objectsArr[gEngine.OBJ_QUAD_1].attr |= ATTR_2SIDE;
    gEngine.objectsArr[gEngine.OBJ_QUAD_2].attr |= ATTR_2SIDE;

    gEngine.objectsArr[gEngine.OBJ_QUAD_0].attr |= ATTR_WIRED;
    gEngine.objectsArr[gEngine.OBJ_QUAD_1].attr |= ATTR_WIRED;
    gEngine.objectsArr[gEngine.OBJ_QUAD_2].attr |= ATTR_WIRED;

    testQuadsAngle0 += angle;

    return 1;
}

function engineTest_QuadsBackFaceCulling()
{
    var res = engineTest_Quads1();
    gEngine.objectsArr[gEngine.OBJ_QUAD_0].attr &= ~ATTR_2SIDE;
    gEngine.objectsArr[gEngine.OBJ_QUAD_1].attr &= ~ATTR_2SIDE;
    gEngine.objectsArr[gEngine.OBJ_QUAD_2].attr &= ~ATTR_2SIDE;
    return res;
}

function engineTest_QuadsSolid()
{
    //odobo_ResetObjects();

    gEngine.objectsArr[gEngine.OBJ_QUAD_0].matrix = mat4x3_RotXX( 0 );
    gEngine.objectsArr[gEngine.OBJ_QUAD_0].state |= STATE_ON;
    gEngine.objectsArr[gEngine.OBJ_QUAD_0].attr |= ATTR_2SIDE;
    gEngine.objectsArr[gEngine.OBJ_QUAD_0].attr |= ATTR_WIRED;
    gEngine.objectsArr[gEngine.OBJ_QUAD_0].attr |= ATTR_SOLID;

    return 1;
}
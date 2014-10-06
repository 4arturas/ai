function engine_Create( width, height )
{
    var gEngine = {
        viewerHTML5: null,
        videobuff: null,
        camera: null,
        rlist: null,

        numObjects: null,
        OBJ_QUAD_0: 0,
        OBJ_QUAD_1: 1,
        OBJ_QUAD_2: 2,
        objectsArr: null
    };

    var bgColor;

    bgColor = pixel_Create( 200, 200, 200 );
    gEngine.videobuff = videobuff_Create( width, height, bgColor );

    gEngine.camera = camera_Create( 0, 0, -300, width, height, 10, 1000, 120 );

    gEngine.rlist = renderer_Create( 100 );

    gEngine.viewerHTML5 = viewerHTML5_Create( width, height );

    return gEngine;
}

function engine_InitObjects( engine )
{
    engine.numObjects = 3;
    engine.objectsArr = new Array( this.numObjects );

    engine.objectsArr[gEngine.OBJ_QUAD_0] = object_CreateQuad( 100, 100, 2, 2 );
    engine.objectsArr[gEngine.OBJ_QUAD_1] = object_CreateQuad( 100, 100, 2, 2 );
    engine.objectsArr[gEngine.OBJ_QUAD_2] = object_CreateQuad( 100, 100, 2, 2 );

    engine.objectsArr[gEngine.OBJ_QUAD_0].color = gPixelRed;
    engine.objectsArr[gEngine.OBJ_QUAD_1].color = gPixelGreen;
    engine.objectsArr[gEngine.OBJ_QUAD_2].color = gPixelBlue;
}


function engine_Create( viewerType, width, height )
{
    var gEngine = {
        viewer: null,
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

    if ( viewerType == VIEWER_TYPE_HTML5 )
        gEngine.viewer = viewerHTML5_Create( viewerType, width, height );
    else if ( viewerType == VIEWER_TYPE_HTML4 )
        gEngine.viewer = viewerHTML4_Create( viewerType, width, height, 1 );
    else
        _assert( false, 'engine_Create: undefined engine type');

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

function engine_Draw( viewer, videobuff )
{
    if ( viewer.viewerType == VIEWER_TYPE_HTML4 )
    {
        viewerHTML4_Draw(viewer, videobuff);
    }
    else if ( viewer.viewerType == VIEWER_TYPE_HTML5 )
    {
        viewerHTML5_Draw(viewer, videobuff);
    }
    else
        _assert( false, 'viewer_Draw: not known engine type' )

}

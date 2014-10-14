function _log( l )
{
    console.log( l );
}
function _floor( v )
{
    return Math.floor( v );
}
function _assert( a, msg )
{
    if ( !a )
        alert( '!Assertion failed: ' + msg );
}
function _clone( obj )
{
    return JSON.parse(JSON.stringify( obj ));
}
function _max( a, b )
{
    return a > b ? a : b;
}
function _min( a, b )
{
    return a < b ? a : b;
}
function _abs( v )
{
    return Math.abs( v );
}
function _change_Sign( v )
{
    return ( v + ( 2 * (-1*v) ) );
}
function _rand_Int( x, y )
{
    return Math.floor(
            Math.random() * ( y - x + 1 ) + x
    );
}

var gSpinner = {
    top: null,
    left: null,
    width: null,
    height: null,
    size: null,
    rows: null,
    cols: null,
    trow: null,
    tcol: null,
    parentBody: null,
    leftPadding: 1,

    create: function( parentBody, width, height, rows, cols )
    {
        var i;
        var boxDOM;
        this.size = rows*cols;
        this.top = 0;
        this.left = 0;
        this.width = width;
        this.height = height;
        this.rows = rows;
        this.cols = cols;

        this.trow = ( this.height/this.rows );
        this.tcol = ( this.width/this.cols );

        this.parentBody = parentBody;
    },


    create_BoxDOM: function( top, left, width, height, txt, color )
    {
        var domE;
        domE = document.createElement('div');
        domE.style.position = 'absolute';
        domE.style.textAlign = 'center';
        domE.style.verticalAlign = 'middle';
        domE.style.visibility = '';
        domE.style.top = (top)+'px';
        domE.style.left = (left)+'px';
        domE.style.width = (width)+'px';
        domE.style.height = (height)+'px';
        domE.style.backgroundColor = color;
        domE.style.fontSize = '10px';
        domE.innerHTML = txt;
        return domE;
    },

    create_Box: function( top, left, width, height, txt, color )
    {
        var dom0 = this.create_BoxDOM( top, left, width, height, txt, color );
        var dom1 = this.create_BoxDOM( top, left, width, height, txt, color );
        dom0.style.zIndex = '2';
        dom1.style.zIndex = '1';
        var box = {
            top: top,
            topTail: top+this.height,
            left: left,
            width: width,
            height: height,
            txt: txt,
            color: color,
            dom0: dom0,
            dom1: dom1
        };
        this.parentBody.appendChild( dom0 );
        this.parentBody.appendChild( dom1 );
        return box;
    },

    reset_Tracks: function( trackType )
    {
        var sign;
        var c, r;
        var track;
        for ( c = 0; c < this.cols; c++ )
        {
            track = this.trackArr[c];
            track.type = trackType;
            track.stopped = 0;
            if ( track.type == this.TRACK_TYPE_SPIN_BOTH_DIRECTIONS )
                sign = (c % 2) ? -1 : +1;
            else if ( track.type == this.TRACK_TYPE_SPIN_DOWN )
                sign = +1;
            else if ( track.type == this.TRACK_TYPE_SPIN_UP )
                sign = -1;
            track.velocity_Create( sign );
        } // end for c
    },

    create_Tracks: function( trackType )
    {
        var c;
        var width = (this.width/this.cols);
        var height = (this.height/this.rows);
        var colors = [ 'palevioletred', 'palegreen', 'paleturquoise', 'papayawhip', 'palegoldenrod', 'bisque', 'red', 'blue', 'green' ];
        var track;
        this.trackArr = new Array( this.cols );
        var left = this.left;
        var sign;
        for ( c = 0; c < this.cols; c++ )
        {
            track = this.create_Track( trackType, this.top, left, width, height, this.rows, c, colors );
            this.trackArr[c] = track;
            left += this.tcol+this.leftPadding;
        } // end for c
        this.reset_Tracks( trackType );
    },

    TRACK_TYPE_SPIN_UP: 0,
    TRACK_TYPE_SPIN_DOWN: 1,
    TRACK_TYPE_SPIN_BOTH_DIRECTIONS: 2,
    create_Track: function( trackType, top, left, width, height, rows, column, colors ) {
        var r;
        var color;
        var box;
        var trackArr = new Array( rows );
        for ( r = 0; r < this.rows; r++ )
        {
            color = colors[r];
            var _top = top;
//            if ( r == 0) _top = _top -2;
            box = this.create_Box( _top, left, width, height, ('trackID:' + column + '<br>row:' + r), color );
            trackArr[r] = box;

            top += height;
        } // end for r


        var track = {
            type: trackType,
            trackColumnID: column,
            boxArr: trackArr,
            stopped: 0,
            sign: null,
            force: null,
            maxForce: null,
            maxSpeed: null,
            mass: null,
            velocity: null,
            iteration: null,
            slowDownBias: null,
            directionWasChanged: null,
            velocity_Create: function( sign )
            {
                this.sign = sign;
                this.force = 5;
                this.maxSpeed = _rand_Int(10, 90);
                this.maxForce = 100/this.maxSpeed;
                this.mass = 1;
                this.velocity = 0.001;
                this.iteration = 0;
                this.slowDownBias = _rand_Int( 30, 50 );
                this.directionWasChanged = 0;
            },

            velocity_Calculate: function()
            {
                var acceleration = (this.force / this.mass);
                this.velocity = this.velocity + (acceleration);

                this.velocity = _min( this.maxSpeed, this.velocity );
            }
        };
        return track;
    },



    track_Spin: function( track ) {
        var r;
        var box;
        var smallestDistToTheTop = this.height + this.height;

        box = track.boxArr[0];
        for ( r = 0; r < this.rows; r++ )
        {
            box = track.boxArr[r];

            if ( track.sign > 0 )
            {
                box.top += track.velocity;
                box.topTail = box.top - this.height;
                if (box.top > this.height)
                {
                    box.top = box.topTail;
                }
                if ( this.top > box.top )
                {
                    box.topTail = box.top + this.height;
                }
            } // DOWN
            else
            {
                box.top -= track.velocity;
                box.topTail = box.top + this.height;
                if ( this.top > box.top+box.height )
                {
                    box.top = box.topTail;
                }
                if ( box.top+box.height > this.height )
                {
                    box.topTail = this.top - (this.height - box.top);
                }

            } // UP


            box.dom1.style.top = _floor(box.topTail) + 'px';
            box.dom0.style.top = _floor(box.top) + 'px';


            if ( track.iteration > track.slowDownBias )
            {
                smallestDistToTheTop = _min( smallestDistToTheTop, _abs(box.top));
            } // end if

        } // end for r

        // Slow down
        if ( track.iteration > track.slowDownBias )
        {

            var stopVal = 4.0;
            if ( stopVal > track.maxSpeed )
            {
                if ( track.directionWasChanged == 0 && box.height*0.7 > smallestDistToTheTop)
                {
                    track.directionWasChanged = 1;
                    track.sign = _change_Sign( track.sign ); // change direction
                    track.maxSpeed--;
                }
                else if ( track.directionWasChanged == 1 )
                {
                    track.maxSpeed *= 0.99;
                    if ( 0 == _floor(smallestDistToTheTop) )
                    {
                        track.stopped = 1;
                        return 0;
                    }
                } // end else if
            }
            else
                track.maxSpeed--;
        }
        else
            track.iteration++;

        track.velocity_Calculate();


        return 1;
    },

    spin: function()
    {
        var c;
        var active = 0;
        var track;
        for ( c = 0; c < this.cols; c++ )
        {
            track = this.trackArr[c];
            if ( track.stopped == 1 )
                continue;
            active += this.track_Spin( track );

        } // end for c
        return active;
    }
};
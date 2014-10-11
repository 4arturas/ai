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
    boxArr: null,
    boxDOMArr: null,
    leftPadding: 3,


    create_BoxDOM: function( top, left, width, height, txt, color )
    {
        var domE;
        domE = document.createElement('div');
        domE.style.position = 'absolute';
//        domE.style.border = '1px solid black';
        domE.style.textAlign = 'center';
        domE.style.verticalAlign = 'middle';
        domE.style.visibility = '';
        domE.style.top = top+'px';
        domE.style.left = left+'px';
        domE.style.width = width+'px';
        domE.style.height = height+'px';
        domE.style.backgroundColor = color;
        domE.innerHTML = txt;
        return domE;
    },

    create_Box: function( top, left, width, height, txt, color )
    {
        var dom0 = this.create_BoxDOM( top, left, width, height, txt, color );
        var dom1 = this.create_BoxDOM( top, left, width, height, txt, color );
        var box = {
            top: top,
            topTail: top,
            left: left,
            width: width,
            height: height,
            txt: txt,
            color: color,
            dom0: dom0,
            dom1: dom1
        };
        return box;
    },





    remove_Children: function( el )
    {
        while ( el.firstChild )
            el.removeChild( el.firstChild );
    },

    set_BoxDOM: function( domE, box )
    {
//            this.remove_Children( domE );
        // todo

//        domE.style.visibility = '';
        domE.style.position = 'absolute';
        domE.style.top = box.top+'px';
        domE.style.left = box.left+'px';
        domE.style.width = box.width+'px';
        domE.style.height = box.height+'px';
        domE.style.border = '1px solid black';
//        domE.style.backgroundColor = box.color;
        domE.innerHTML = box.txt;
    },

    reset: function( trackType )
    {
        var c;
        var width = _floor(this.width/this.cols);
        var height = _floor(this.height/this.rows);
        var colors = [ 'paleturquoise', 'papayawhip', 'palegreen', 'palegoldenrod', 'palevioletred', 'bisque' ];
        var track;
        this.trackArr = new Array( this.cols );
        var left = this.left;
        var sign;
        for ( c = 0; c < this.cols; c++ )
        {
            track = this.track_Create( trackType, this.top, left, width, height, this.rows, c, colors );
            this.trackArr[c] = track;
            left += this.tcol+this.leftPadding;

            // velocity set
            {
                track.type = trackType;
                if ( track.type == this.TRACK_TYPE_SPIN_BOTH_DIRECTIONS )
                    sign = (c % 2) ? -1 : +1;
                else if ( track.type == this.TRACK_TYPE_SPIN_DOWN )
                    sign = +1;
                else if ( track.type == this.TRACK_TYPE_SPIN_UP )
                    sign = -1;
                track.velocity_CreateStruct( sign );
            } // end velicity set
        } // end for c
    },

    trackArr: null,
    TRACK_TYPE_SPIN_UP: 0,
    TRACK_TYPE_SPIN_DOWN: 1,
    TRACK_TYPE_SPIN_BOTH_DIRECTIONS: 2,
    track_Create: function( trackType, top, left, width, height, rows, column, colors ) {
        var r;
        var color;
        var box;
        var i = column*this.cols;
        for ( r = 0; r < this.rows; r++ )
        {
            color = colors[r];
            box = this.boxArr[i++];
            box.top = top;
            box.left = left;
            box.width = width;
            box.height = height;

            box.txt = 'trackID:' + column + '<br>row:' + r+'';
            box.color = color;
            this.set_BoxDOM( box.dom0, box );
            this.set_BoxDOM( box.dom1, box );
            box.dom0.style.zIndex = '2';
            box.dom1.style.zIndex = '1';
            box.dom0.style.fontSize = '10px';
            box.dom1.style.fontSize = box.dom0.style.fontSize;

            box.dom0.style.backgroundColor = color;
            box.dom1.style.backgroundColor = color;
            top += height;
        } // end for r
        var track = {
            type: trackType,
            trackColumnID: column,
            stopped: 0,
            sign: null,
            force: null,
            maxForce: null,
            maxSpeed: null,
            mass: null,
            velocity: null,
            iteration: null,
            slowDownBias: null,
            velocity_CreateStruct: function( sign )
            {
                this.sign = sign;
                this.force = 1*this.sign;
                this.maxForce = 10*this.sign;
                this.maxSpeed = 5*this.sign;
                this.mass = 1*this.sign;
                this.velocity = 0.001*this.sign;
                this.iteration = 0;
                this.slowDownBias = 10;
            },

            velocity_Calculate: function()
            {
                var acceleration = (this.force / this.mass) * this.sign;
                this.velocity = this.velocity + (acceleration);

                if (this.sign == -1 ) // UP
                    this.velocity = _max( this.maxSpeed, this.velocity );
                else // DOWN
                    this.velocity = _min( this.maxSpeed, this.velocity );
            }
        };
        return track;
    },

    create: function( parent, width, height, rows, cols )
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

        this.trow = _floor( this.height/this.rows );
        this.tcol = _floor( this.width/this.cols );

        this.boxArr = new Array( this.size );

        var doc = parent.contentDocument || parent.contentWindow.document;

        var div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.top = '0px';
        div.style.left = '0px';
        div.style.width = (this.width+this.cols*this.leftPadding-7)+'px';
        div.style.height = (this.height-2)+'px';
//        div.style.backgroundColor = 'red';
        div.style.border = '1px solid black';
        div.style.zIndex = '3';

        for ( i = 0; i < this.size; i++ )
        {
            var box = this.create_Box( 0, 0, 0, 0, ''+i, '' );
            this.boxArr[i] = box;
            doc.body.appendChild( box.dom0 );
            doc.body.appendChild( box.dom1 );
        } // end for i
        doc.body.appendChild( div );
    },

    track_Spin: function( track )
    {
        var r;
        var box;
        var smallestDistToTheTop = this.height+this.height;
        var i = track.trackColumnID * this.cols;

        for ( r = 0; r < this.rows; r++ )
        {
            box = this.boxArr[i++];
            box.top += track.velocity;
            if ( track.velocity > 0 ) // DOWN
            {
                box.topTail = box.top - this.height;
                box.dom1.style.top = _floor(box.topTail) + 'px';
                if ( box.top > this.height )
                {
                    box.top = box.topTail+1;
                }
            }
            else  // UP
            {
                box.topTail = this.height + box.top;
                box.dom1.style.top = _floor(box.topTail) + 'px';
                if ( this.top > box.top+box.height )
                {
                    box.top = box.topTail-1;
                }
            }
            box.dom0.style.top = _floor(box.top) + 'px';

            // To stop the spinner we have to find the box which is closest to the top
            {
                smallestDistToTheTop = _min( smallestDistToTheTop, _abs(this.top-box.top) );
            }
        } // end for r

        if ( 0 > track.slowDownBias && 2 > smallestDistToTheTop )
        {
            track.stopped = 1;
            return 0;
        }
        else if ( track.iteration > track.slowDownBias )
        {
            track.sign *= -1;
            track.force *= track.force;
            track.maxForce *= track.sign;
            track.maxSpeed *= track.sign;
            track.mass = (track.mass+smallestDistToTheTop)*track.sign;
            track.velocity = smallestDistToTheTop*track.sign;
//            track.iteration = 0;
            track.slowDownBias /= 2;
        }

        track.iteration++;

        return 1;
    },


    spin: function( step )
    {
        var c;
        var steps = new Array( this.cols );
        var position;
        var active = 0;
        var track;
        for ( c = 0; c < this.cols; c++ )
        {
            track = this.trackArr[c];
            if ( track.stopped == 1 ) continue;
            track.velocity_Calculate();
            active += this.track_Spin( track );

        } // end for c
        return active;
    }
};
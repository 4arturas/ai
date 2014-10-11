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
    _iframe: null,
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
        var i, r, c;
        var width = _floor(this.width/this.cols);
        var height = _floor(this.height/this.rows);
        var top = this.top;
        var left;
        var colors = [ 'paleturquoise', 'papayawhip', 'palegreen', 'palegoldenrod', 'palevioletred', 'bisque' ];
        var track;
        this.trackArr = new Array( this.cols );
        left = this.left;
        var sign;
        for ( c = 0; c < this.cols; c++ )
        {
            track = this.track_Create( trackType, this.top, left, width, height, this.rows, c, colors );
            this.trackArr[c] = track;
            left += this.tcol+this.leftPadding;

            // velocity set
            {
                if ( track.type == this.TRACK_TYPE_SPIN_BOTH_DIRECTIONS )
                    sign = (c % 2) ? -1 : +1;
                else if ( track.type == this.TRACK_TYPE_SPIN_DOWN )
                    sign = +1;
                else if ( track.type == this.TRACK_TYPE_SPIN_UP )
                    sign = -1;
                track.velocityStruct = this.velocity_CreateStruct( sign );
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
            velocityStruct: null
        };
        return track;
    },

    create: function( _ifr, top, left, width, height, rows, cols )
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
        this._iframe = document.createElement('iframe');
        this._iframe.style.border = '1px solid black';

        var doc = _ifr.contentDocument || _ifr._iframe.contentWindow.document;

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
        this.reset();
        doc.body.appendChild( div );
    },

    track_Spin: function( track, c, v )
    {
        var i = 0;
        var r;
        var box;
        var smallestDistToTheTop = this.height+this.height;
        for ( r = 0; r < this.rows; r++ )
        {
            i = r * this.cols + c;
            box = this.boxArr[i];
            box.top += track.velocityStruct.velocity;
            var boxHelper = box.top;
            if ( track.velocityStruct.velocity > 0 ) // DOWN
            {
                box.dom1.style.top = _floor(box.top - this.height) + 'px';
                if ( box.top > this.height )
                {
                    box.top = box.dom1.style.top.replace('px','')*1+1; // TODO: Not good for production
                }
            }
            else  // UP
            {
                box.dom1.style.top = _floor(this.height + box.top) + 'px';
                if ( this.top > box.top+box.height )
                {
                    box.top = box.dom1.style.top.replace('px','')*1-1; // TODO: Not good for production
                }
            }
            box.dom0.style.top = _floor(box.top) + 'px';

            // To stop the spinner we have to find the box which is closest to the top
            {
                smallestDistToTheTop = _min( smallestDistToTheTop, _abs(this.top-box.top) );
            }
        } // end for r
        return 1;
    },

    velocity_CreateStruct: function( sign )
    {
        var force = 1*sign;
        var maxForce = 10*sign;
        var maxSpeed = 4*sign;
        var mass = 1*sign;
        var velocity = 0.001*sign;
        var slowDownBias = 10;
        var v = {
            sign: sign,
            force: force,
            maxForce: maxForce,
            maxSpeed: maxSpeed,
            mass: mass,
            velocity: velocity,
            iteration: 0,
            slowDownBias: slowDownBias
        };
        return v;
    },

    velocity_Calculate: function( v )
    {

        if (v.iteration > v.slowDownBias )
        {
            v.iteration = 0;
            v.sign *= -1;

            v.force *= v.sign;
            v.maxForce *= v.sign;
            v.maxSpeed *= v.sign;
            v.mass *= v.sign;
        }

        v.iteration++;

        var acceleration = (v.force / v.mass) * v.sign;
        v.velocity = v.velocity + (acceleration);

        if (v.sign == -1 ) // UP
            v.velocity = _max( v.maxSpeed, v.velocity );
        else // DOWN
            v.velocity = _min( v.maxSpeed, v.velocity );

    },


    spin: function( step )
    {
        var c;
        var steps = new Array( this.cols );
        var position;
        var velocityStruct;
        var active = 0;
        var track;
        for ( c = 0; c < this.cols; c++ )
        {
            track = this.trackArr[c];
            this.velocity_Calculate( track.velocityStruct );
            active += this.track_Spin( track, c, track.velocityStruct );

        } // end for c
        return active;
    }
};
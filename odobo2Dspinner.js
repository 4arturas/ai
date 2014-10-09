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

    create_Box: function( top, left, width, height, txt, color )
    {
        var box = {
            top: top,
            left: left,
            width: width,
            height: height,
            txt: txt,
            color: color
        };
        return box;
    },



    create_BoxDOM: function()
    {
        var domE;
        domE = document.createElement('div');
        domE.style.position = 'absolute';
        domE.style.border = '1px solid black';
        domE.style.textAlign = 'center';
        domE.style.verticalAlign = 'middle';
//        domE.style.visibility = 'hidden';
        return domE;
    },

    remove_Children: function( el )
    {
        while ( el.firstChild )
            el.removeChild( el.firstChild );
    },
    set_BoxDOM: function( idx, box )
    {
        _assert( idx < this.boxDOMArr.length, 'index array of bound exception' );
        var domE = this.boxDOMArr[idx];

            this.remove_Children( domE );


        domE.style.visibility = '';
        domE.style.top = box.top+'px';
        domE.style.left = box.left+'px';
        domE.style.width = box.width+'px';
        domE.style.height = box.height+'px';
        domE.style.backgroundColor = box.color;
        domE.innerHTML = box.txt;
    },

    reset: function()
    {
        var i, r, c;
        var box;
        i = 0;
        var width = _floor(this.width/this.cols);
        var height = _floor(this.height/this.rows);
        var top = this.top;
        var left;
        for ( r = 0; r < this.rows; r++ )
        {
            left = this.left;
            for ( c = 0; c < this.cols; c++ )
            {
                box = this.create_Box( top, left, width, height, i, 'lightblue' );
                this.boxArr[i] = box;
                this.set_BoxDOM( i, box );
                left += this.tcol;
                i++;
            } // end for c
            top += height;
        } // end for r

        // invisible boxes
        {
            var boxInvisible;
            left = this.left;
            for ( c = 0; c < this.cols; c++ )
            {
                boxInvisible = this.create_Box( top, left, width, height, 'invisible '+c, 'whitesmoke' );
                this.set_BoxDOM( i, boxInvisible );
                left += this.tcol;
                i++;
            }
        } // end invisible boxes

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
        this.boxDOMArr = new Array( this.size );

        this._iframe = document.createElement('iframe');
        this._iframe.style.border = '1px solid black';
//        this._iframe.style.width = this.width + 'px';
//        this._iframe.style.height = this.height + 'px';
//        document.body.appendChild( this._iframe );
        var doc = _ifr.contentDocument || _ifr._iframe.contentWindow.document;
        for ( i = 0; i < this.size+(cols); i++ )
        {
            boxDOM = this.create_BoxDOM();
            this.boxDOMArr[i] = boxDOM;
            doc.body.appendChild( boxDOM );
        } // end for i
    },

    spin_Column: function( c, step )
    {

    },

    up: function( step )
    {
        var i, boxDomIdx;
        var r, c;
        var invisibleIdx;
        var box;
        var boxTmp;
        step = -1;

        boxDomIdx = 0;
        var idx = 0;
        r = 0;
        for (i = 0; i < this.size; i++)
        {
            box = this.boxArr[i];
            box.top += step;
            // UP
            if ( this.top > box.top+box.height )
            {
                box.top =_floor( box.height * (this.rows) );
            } // end if


//            boxDomIdx++;
//            boxDomIdx %= this.boxDOMArr.length;
        } // end for i
        for ( c = 0; c < this.cols; c++ )
        {
            box = this.boxArr[c];
            boxTmp = _clone( box );
            boxTmp.color = 'green';
            boxTmp.top = box.top + _floor(this.rows*box.height);
            this.set_BoxDOM(boxDomIdx++, boxTmp );
        } // end for i



//        for ( ;boxDomIdx < this.boxDOMArr.length; boxDomIdx++ )
//            this.boxDOMArr[boxDomIdx].visibility = 'hidden';
    }
};
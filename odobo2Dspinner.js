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


    create_BoxDOM: function( top, left, width, height, txt, color )
    {
        var domE;
        domE = document.createElement('div');
        domE.style.position = 'absolute';
        domE.style.border = '1px solid black';
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

    create_Box: function( top, left, width, height, txt, color, IamInRowNr )
    {
        var dom0 = this.create_BoxDOM( top, left, width, height, txt, color );
        var dom1 = this.create_BoxDOM( top*this.rows*height, left, width, height, txt, 'green' );
        var box = {
            top: top,
            left: left,
            width: width,
            height: height,
            txt: txt,
            color: color,
            IamInRowNr: IamInRowNr,
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
    set_BoxDOM: function( domE, top, left, width, height, color, txt )
    {
//            this.remove_Children( domE );
        // todo

//        domE.style.visibility = '';
        domE.style.position = 'absolute';
        domE.style.top = top+'px';
        domE.style.left = left+'px';
        domE.style.width = width+'px';
        domE.style.height = height+'px';
        domE.style.backgroundColor = color;
        domE.innerHTML = txt;
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
                box = this.boxArr[i];
                box.top = top;
                box.left = left;
                box.width = width;
                box.height = height;
                box.txt = i+'';

                this.set_BoxDOM( box.dom0, top, left, width, height, box.color, box.txt );
                this.set_BoxDOM( box.dom1, (top+(this.rows*height)), left, width, height, box.color, box.txt );

                left += this.tcol;
                i++;
            } // end for c
            top += height;
        } // end for r

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
//        this._iframe.style.width = this.width + 'px';
//        this._iframe.style.height = this.height + 'px';
//        document.body.appendChild( this._iframe );
        var doc = _ifr.contentDocument || _ifr._iframe.contentWindow.document;
//        doc.style.overflowX = 'hidden';
//        doc.style.overflowY = 'hidden';
        var div = document.createElement('div');
//        div.appendChild( document.createTextNode('text') );
        div.style.position = 'absolute';
        div.style.top = '0px';
        div.style.left = '0px';
        div.style.width = (this.width-4)+'px';
        div.style.height = (this.height-2)+'px';
//        div.style.backgroundColor = 'red';
        div.style.border = '1px solid black';

        for ( i = 0; i < this.size; i++ )
        {
            var box = this.create_Box( 0, 0, 0, 0, ''+i, '#E5FDFF', 0 );
            this.boxArr[i] = box;
            doc.body.appendChild( box.dom0 );
            doc.body.appendChild( box.dom1 );
        } // end for i
        this.reset();
        doc.body.appendChild( div );
    },

    spin_Column: function( c, step )
    {
        var i;
        var r;
        var box;
        i = 0;
        for ( r = 0; r < this.rows; r++ )
        {
            i = r * this.cols + c;
            box = this.boxArr[i];
            box.top += step;
            // UP
            if ( /*0 > step &&*/ this.top > box.top )
            {
                if ( this.top > (box.top+box.height) )
                {
                    box.top =_floor( box.height * (this.rows-1) );
                    box.dom1.style.visibility = 'hidden';
                } // end if
                else
                {
                    box.dom1.style.top = _floor(box.top + this.height) + 'px';
                    box.dom1.style.visibility = '';
                }
            } // end if UP
            // DOWN
            else if ( box.top > (this.height-box.height) )
            {
                box.dom1.style.top = _floor(this.top-(this.height-box.top)) + 'px';
                box.dom1.style.visibility = '';
                if   ( box.top > this.height )
                    box.top = this.top;
            } // end els if DOWN
            else
            {
                box.dom1.style.visibility = 'hidden';
            }
            box.dom0.style.top = _floor(box.top) + 'px';
//            box.dom0.innerHTML = box.txt + ' ' + box.top;
        } // end for i
    },

    spin: function( step )
    {
        var c;
        var steps = new Array( this.cols );
        for ( c = 0; c < this.cols; c++ )
        {

            steps[c] = ( c % 2 ) == 0 ? step : -step;
//            steps[c] = step;
        }

        for ( c = 0; c < this.cols; c++ )
            this.spin_Column( c, steps[c] );
    }
};
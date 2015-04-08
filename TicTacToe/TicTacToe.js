function TicTacToePosition()
{
    this.BLANK = 0;
    this.HUMAN = 1;
    this.PROGRAM = 2;

    this.border = new Array(6);
    for ( var i = 0; i < 6; i++ )
        this.border[i] = this.BLANK;

}

var TicTacToe = {

};

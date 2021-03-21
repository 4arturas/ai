const unsigned int WIDTH = 600;
const unsigned int HEIGHT = 400;
unsigned int BUFFER[HEIGHT*WIDTH];

// clang --target=wasm32 --no-standard-libraries -Wl,--export-all -Wl,--no-entry -o graphics.wasm graphics.c

int add( int x, int y )
{
    return x + y;
}

void go()
{
    int y, x;
    for ( y = 0; y < HEIGHT; y++ )
    {
        for ( x = 0; x < WIDTH; x++ )
        {
            unsigned int color = 0xffff0000; // RGBA little endian
//            BUFFER[y * WIDTH + x] = color;
            BUFFER[y * WIDTH + x] = ( x ^ y ) | 0xffff0000;
        }
    }
}
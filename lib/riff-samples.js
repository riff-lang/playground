// Sample Riff programs
var riffSamples = {

// Hello, World!
'hello':
`// Classic "Hello, World!" program
"Hello, World!"`,

'strings':
`// String literals are denoted by matching enclosing double
// quotation marks
"Hello, World!"

// Strings spanning multiple lines will have their newlines preserved
"This string
will span
multiple lines"

// You can also ignore newlines in multi-line strings with backslashes
"This string \\
will span \\
a single line"

// Unicode literals are also supported
"\\u3c0 = 3.14159..."
"When I program in Riff \\U1f3b8, it's just \\U1f90c perfection"

// The prefix \`#\` operator will return the length of a string
print #"My string"

// Concatenate strings with the infix \`#\` operator
"peanut butter" # "jelly"

// Substrings can be extracted with subscripting and ranges
ABCs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

ABCs[0]     // Get a single character
ABCs[..4]   // Get the first 5 characters
ABCs[23..]  // Get the substring from character 23 to the end
ABCs[..:2]  // Get every other character
ABCs[25..0] // Reverse the string!

// byte() will return the integer value of a single byte from a string
byte("hello",0) // 104
byte("hello",2) // 108

// Strings can be composed using their integer values with char()
char(104, 101, 108, 108, 111)   // "hello"

// fmt() serves as Riff's printf()/sprintf() function
fmt("%x", 123)      // Prints to the screen
s = fmt("%x", 123)  // Stores the formatted string in variable \`s\`

// num() can interpret numeric values from strings
num("54", 16)       // 84 (base-16)
num("0110", 2)      // 6 (base-2)
num("abcxyz", 36)   // 623741435 (base-36)

// If no base is provided, num() uses the same lexical conventions as
// Riff
num("76")           // 76
num("0x54")         // 84
num("0b0110")       // 6

// Use split() to split a sentence into a table of words
sentence = split("A quick brown fox")

for word in sentence {
    word
}

// Use the "" delimiter to split a string into a table of
// single-character strings
chars = split("Thiswillbesplitintochars","");
#chars          // 24
chars[0]        // "T"
chars[23]       // "s"`,

// Recursive factorial
'factorial':
`// Recursive factorial function
fn fact(n) {
    return n <= 1 ? 1 : n * fact(n-1)
}

for i in 12
    fmt("factorial(%d) = %d", i, fact(i))`,

// Recursive Fibonacci
'fibonacci':
`// Recursive Fibonacci function
fn fib(n) {
    return n < 2 ? n : fib(n-1) + fib(n-2)
}

for i in 1..20
    fmt("fibonacci(%d) = %d", i, fib(i))`,

// Bit manipulation
'bitwise':
`// Population count
// Count the number of bits set in an integer
fn popcount(x) {
    local m1 = 0x5555_5555_5555_5555
    local m2 = 0x3333_3333_3333_3333
    local m3 = 0x0F0F_0F0F_0F0F_0F0F

    x = (x & m1) + ((x >> 1) & m1)
    x = (x & m2) + ((x >> 2) & m2)
    x = (x & m3) + ((x >> 4) & m3)

    x += x >> 8
    x += x >> 16
    x += x >> 32

    return x & 0x7f
}

for i in { 0, 1, 0xFF }
    fmt("Number of bits set in %d: %d", i, popcount(i))

// Count the number of trailing zero bits in an integer
fn tzcount(x) {
return 0x3F + (!x)
       - (((x & -x) & 0x0000_0000_FFFF_FFFF) ? 32 : 0)
       - (((x & -x) & 0x0000_FFFF_0000_FFFF) ? 16 : 0)
       - (((x & -x) & 0x00FF_00FF_00FF_00FF) ?  8 : 0)
       - (((x & -x) & 0x0F0F_0F0F_0F0F_0F0F) ?  4 : 0)
       - (((x & -x) & 0x3333_3333_3333_3333) ?  2 : 0)
       - (((x & -x) & 0x5555_5555_5555_5555) ?  1 : 0)
}

for i in { 1, 2, 32 }
    fmt("Number of trailing zero bits in %d: %d", i, tzcount(i))

// Swap bytes n and m in integer x
fn byteswap(x, n, m) {
    n <<= 3
    m <<= 3

    local maskn = 0xFF << n
    local maskm = 0xFF << m

    local nth_byte = ((x & maskn) >> n) & 0xFF
    local mth_byte = ((x & maskm) >> m) & 0xFF

    nth_byte <<= m
    mth_byte <<= n

    return x ^ (x & (maskn ^ maskm)) ^ nth_byte ^ mth_byte
}

"Swap bytes 1 and 3 in 0x12345678:", hex(byteswap(0x12345678, 1, 3))
"Swap bytes 0 and 2 in 0xdeadbeef:", hex(byteswap(0xdeadbeef, 0, 2))`

};

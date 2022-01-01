// Sample Riff programs
var riffSamples = {

// Hello, World!
'hello':
`// Edit this code directly or select a sample!
// Classic "Hello, World!" program in Riff
print("Hello, World!")`,

// Recursive factorial
'factorial':
`// Recursive factorial function
fn fact(n) {
  return n <= 1 ? 1 : n * fact(n-1)
}

for i in 12
  printf("factorial(%d) = %d\\n", i, fact(i))`,

// Recursive Fibonacci
'fibonacci':
`// Recursive Fibonacci function
fn fib(n) {
  return n < 2 ? n : fib(n-1) + fib(n-2)
}

for i in 0..19
  printf("fibonacci(%d) = %d\\n", i, fib(i))`,

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
  printf("popcount(%d) = %d\\n", i, popcount(i))

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
  printf("tzcount(%d) = %d\\n", i, tzcount(i))

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
"Swap bytes 0 and 2 in 0xdeadbeef:", hex(byteswap(0xdeadbeef, 0, 2))`,

// MD5
'md5':
`// Per-round shift amounts
s = {
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
  5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20,
  4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
  6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
}

// Precomputed constants table
K = {
  0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
  0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
  0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
  0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
  0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
  0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
  0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
  0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
  0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
  0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
  0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
  0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
  0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
  0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
  0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
  0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
}

// Rotate left
fn rol(x,c) {
  return (x << c) | (x >> (32-c))
}

// Return a 32-bit little endian chunk from the byte array
fn get_int(b, n) {
  return (b[n+3] << 24) | (b[n+2] << 16) | (b[n+1] <<  8) | b[n]
}

// Return a hex string of an integer as little-endian
fn le(n) {
  local s
  for i in 0..3 {
    s #= fmt("%02x", (n >> (i*8)) & 0xff)
  }
  return s
}

fn md5(msg) {
  // Initialize variables
  local a0 = 0x67452301,
        b0 = 0xefcdab89,
        c0 = 0x98badcfe,
        d0 = 0x10325476

  local bytes
  for i,c in msg {
    bytes[i] = byte(c)
  }

  // Append the "1" bit
  bytes[#msg] = 0x80

  // Pad the message with zeros
  while #bytes & 63 != 56 {
    bytes[#bytes] = 0
  }

  // Append the message's original length to the array of bytes
  local len = #msg << 3
  for i in 0..7 {
    bytes[#bytes] = (len >> (i*8)) & 0xff
  }

  // For each 512-bit chunk of the padded message
  for i in 0..#bytes/64-1 {

    // Initialize variables for this chunk
    local a = a0,
          b = b0,
          c = c0,
          d = d0

    // Main loop
    for j in 0..63 {
      local f, g
      if j <= 15 {
        f = (b & c) | (~b & d)
        g = j
      } elif j <= 31 {
        f = (d & b) | (~d & c)
        g = (5*j + 1) & 0xf
      } elif j <= 47 {
        f = b ^ c ^ d
        g = (3*j + 5) & 0xf
      } else {
        f = c ^ (b | ~d)
        g = (7*j) & 0xf
      }

      f = (f + a + K[j] + get_int(bytes, i*64+g*4)) & 0xffff_ffff

      a = d
      d = c
      c = b
      b = (b + rol(f, s[j])) & 0xffff_ffff
    }

    a0 = (a0 + a) & 0xffff_ffff
    b0 = (b0 + b) & 0xffff_ffff
    c0 = (c0 + c) & 0xffff_ffff
    d0 = (d0 + d) & 0xffff_ffff
  }

  return fmt("%s%s%s%s", le(a0), le(b0), le(c0), le(d0))
}

// Test strings
// You can double check the correctness on your machine with the command:
// $ echo -n <string> | md5
test_strings = {
  "",
  "a",
  "abc",
  "message digest",
  "abcdefghijklmnopqrstuvwxyz",
  "The quick brown fox jumps over the lazy dog",
  "The quick brown fox jumps over the lazy dog.",
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  "12345678901234567890123456789012345678901234567890123456789012345678901234567890"
}

for s in test_strings {
  printf("Message: %s\\nMD5:     %s\\n", s, md5(s))
}`

};

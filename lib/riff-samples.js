// Sample Riff programs
var riffSamples = {

// Hello, World!
'hello':
`// Classic "Hello, World!" program
"Hello, World!"`,

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

for i in 20
    fmt("fibonacci(%d) = %d", i, fib(i))`,

};

# Riff Studio

[Riff Studio](https://play.riff.cx) is an online "playground" for
[Riff](https://riff.cx), allowing you to write and execute Riff programs directly in the
browser. Riff Studio is 100% client-side, using a special Riff
interpreter compiled to WebAssembly to execute Riff programs.

## Usage

To run Riff Studio locally, you'll need to to spin up a local web
server to serve `index.html`. Otherwise, the Riff interpreter
(WebAssembly module) cannot be invoked via the `file://` protocol.

### Example

Start a local server on port 8000 using Python:

```bash
$ python3 -m http.server 8000
```

You can then open `localhost:8000` in a new browser tab/window.

## How it Works

[Emscripten](https://emscripten.org) is used to compile the [Riff
interpreter](https://github.com/riff-lang/riff) to WebAssembly.
Emscripten is used since it takes care of linking any required
headers/libraries to the WASM module.

The following command is used to compile the C source code:

```bash
$ emcc -O3 *.c -s EXPORTED_FUNCTIONS='["_wasm_main"]' -s EXPORTED_RUNTIME_METHODS='["ccall"]' -o riff.js
```

Emscripten outputs a JavaScript file along with the WASM module, which
is used to drive the WASM module.

`wasm_main()` is a [special entry
point](https://github.com/riff-lang/riff/blob/1924e45cb9de4a34edcd844b2caa543ad4b35f4d/src/riff.c#L21)
which simply skips any command-line argument parsing. Note that this
was done to simplify invocation from JavaScript and isn't really
necessary.

The Riff interpreter is invoked via JavaScript via Emscripten's
provided `Module` interface:

```javascript
// Grab the input program from the CodeMirror "input" area
var inputProgram = cmInput.getValue();

// Invoke Riff with the input program
// 0 = Disassemble
// 1 = Execute
Module.ccall('wasm_main', 'number', ['number', 'string'], [1, inputProgram]);
```

Printing to `stdout` and `stderr` is defined through Emscripten's
`Module` object. In this example, both `stdout` and `stderr` are
appended to an HTML `<textarea>` with the ID `#output`:

```javascript
var Module = {
    // stdout
    print: function(text) {
        console.log(text);
        document.getElementById('output').value += text + "\n";
    },

    // stderr
    printErr: function(text) {
        console.error(text);
        document.getElementById('output').value += text + "\n";
    },
};
```

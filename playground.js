// Initialize the CodeMirror input textarea
var cmInput =
CodeMirror.fromTextArea(document.getElementById('input'), {
    lineNumbers:    true,
    spellcheck:     false,
    autocorrect:    false,
    autocapitalize: false,
    autofocus:      true,
    matchBrackets:  true,
    theme:          'riff',     // style.sass
    mode:           'riff',     // lib/riff.js:
                                //   CodeMirror.defineSimpleMode()
});

// Output textarea (readonly)
var cmOutput =
CodeMirror.fromTextArea(document.getElementById('output'), {
    lineNumbers:    false,
    lineWrapping:   false,
    spellcheck:     false,
    autocorrect:    false,
    autocapitalize: false,
    autofocus:      false,
    mode:           'null',
    theme:          'riff',
    readOnly:       'nocursor',
});

// Emscripten Module object
var Module = {
    preRun: [],
    postRun: [],
    noInitialRun: true,
    noExitRuntime: true,
    print: function(text) {
        console.log(text);
        document.getElementById('output').value += text + "\n";
    },
    printErr: function(text) {
        console.error(text);
        document.getElementById('output').value += text + "\n";
    },
    totalDependencies: 0,
    monitorRunDependencies: function(left) {
        this.totalDependencies = Math.max(this.totalDependencies, left);
    }
};

init();

cmInput.on('change', function() {
    document.getElementById('share-button').style.display = 'block';
    document.getElementById('link-group').style.display = 'none';
});

// Riff code execution
function riffExec(exec) {

    // Clear output
    document.getElementById('output').value = '';
    cmOutput.setValue('');

    // Grab the program from the CodeMirror editor
    var inputProgram = cmInput.getValue();

    // Print the input program to the console
    console.log(inputProgram);

    var start = Date.now();

    // Invoke the Riff interpreter with the input program
    // This calls a special wasm() function in riff.c
    try {
        Module.ccall('wasm_main', 'number', ['number', 'string'],
            [exec, inputProgram]);
        if (exec == 0)
            document.getElementById('output-title').innerHTML =
                'Disassembly';
        else
            document.getElementById('output-title').innerHTML =
                'Output';
    }

    // This allows Riff programs to `exit` without Emscripten
    // treating it as an error
    catch (e) {
        if (e.status != 0)
            document.getElementById('output-title').innerHTML =
                '<span style="color:#ac4142";>Error</span>';
        else
            document.getElementById('output-title').innerHTML =
                'Output';
    }

    // Set the output
    // NOTE: This performs significantly better by setting the output
    // the "vanilla" way during Module.print() and calling setValue() on
    // the CodeMirror object once Module.ccall() returns.
    cmOutput.setValue(document.getElementById('output').value);
    var execTime = Date.now() - start;
    console.log('Runtime: ' + (execTime / 1000));
    document.getElementById('metrics').innerHTML =
        'riff 0.2 / ' + (execTime / 1000) + 's';
}

function revealDropdown(d) {
    document.getElementById(d).classList.toggle('open');
}

function loadSample(sample) {

    // Clear the output textarea
    cmOutput.setValue('');

    var s = riffSamples[sample];
    if (s != null)
        cmInput.setValue(s);
}

function inflate(byteString) {
    return byteArrayToByteString(pako.inflateRaw(byteString, { 'level': 9 }));
}

function deflate(byteString) {
    return pako.deflateRaw(byteStringToByteArray(byteString), { 'level': 9 });
}

function base64ToByteString(base64String) {
    return atob(unescape(base64String).replace(/@|-/g, "+").replace(/_/g, "/"));
}

function byteStringToByteArray(byteString) {
    var byteArray = new Uint8Array(byteString.length);
    for (var index = 0; index < byteString.length; index++)
        byteArray[index] = byteString.charCodeAt(index);
    byteArray.head = 0;
    return byteArray;
}

function byteStringToBase64(byteString) {
    return btoa(byteString).replace(/\+/g, "@").replace(/=+/, "");
}

function iterate(iterable, monad) {
    if (!iterable) return;
    for (var i = 0; i < iterable.length; i++)
        monad(iterable[i]);
}

function byteArrayToByteString(byteArray) {
    var retval = '';
    iterate(byteArray, function(byte) { retval += String.fromCharCode(byte); });
    return retval
}

function createShareLink() {
    document.getElementById('share-button').style.display = 'none';
    document.getElementById('link-group').style.display = 'flex';

    var src = cmInput.getValue();
    var cmp = byteStringToBase64(byteArrayToByteString(deflate(src)));
    document.getElementById('share-url').value =
        location.protocol + '//' + location.host + location.pathname + '#' + cmp;
}

function copyToClipboard() {
    document.querySelector('#share-url').select();
    document.execCommand('copy');
}

function init() {
    if (location.hash === '') {
        loadSample('hello');
    } else {
        var hash = unescape(location.hash.substr(1));
        try {
            var src = inflate(base64ToByteString(hash));
            // console.log(src);
            cmInput.setValue(src);
        } catch (e) {
        }
    }
}

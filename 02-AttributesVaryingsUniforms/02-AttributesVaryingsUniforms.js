var glslSources = {
    colorize: {
        vertex: [
            'attribute vec2 aPosition;',
            'attribute vec4 aColor;',
            '',
            'uniform float uTime;',
            '',
            'varying vec4 vColor;',
            '',
            'void main() {',
            '    mat2 rotationMatrix = mat2(',
            '        cos(uTime), -sin(uTime),',
            '        sin(uTime),  cos(uTime));',
            '    gl_Position = vec4(rotationMatrix * aPosition, 0.0, 1.0);',
            '    vColor = aColor;',
            '}'
        ].join('\n'),
        fragment: [
            'precision mediump float;',
            '',
            'varying vec4 vColor;',
            '',
            'void main() {',
            '    gl_FragColor = vColor;',
            '}'
        ].join('\n')
    }
};

function load() {
    var canvas = document.querySelector('canvas');
    var gl = WebGLUtils.getContext(canvas, ['webgl', 'experimental-webgl']);

    var programs = WebGLUtils.compileShaders(gl, glslSources);
    var program = programs.colorize;

    var positions = new Float32Array([
        0.0, -0.9,
        -0.8, 0.5,
        0.8, 0.5
    ]);

    var colors = new Float32Array([
        1.0, 0.5, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 1.0, 1.0
    ]);

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(program.attributes.aPosition);
    gl.vertexAttribPointer(program.attributes.aPosition, 2, gl.FLOAT, false, 0, 0);

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(program.attributes.aColor);
    gl.vertexAttribPointer(program.attributes.aColor, 4, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.useProgram(program.program);

    var t0 = Date.now();
    function render() {
        gl.uniform1f(program.uniforms.uTime, (Date.now() - t0) / 1000);

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

window.addEventListener('load', load);

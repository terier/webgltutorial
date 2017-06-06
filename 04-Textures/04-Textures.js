var glslSources = {
    colorize: {
        vertex: [
            'attribute vec2 aPosition;',
            'attribute vec2 aTexCoord;',
            '',
            'uniform float uTime;',
            '',
            'varying vec2 vTexCoord;',
            '',
            'void main() {',
            '    mat2 rotationMatrix = mat2(',
            '        cos(uTime), -sin(uTime),',
            '        sin(uTime),  cos(uTime));',
            '    gl_Position = vec4(rotationMatrix * aPosition, 0.0, 1.0);',
            '    vTexCoord = aTexCoord;',
            '}'
        ].join('\n'),
        fragment: [
            'precision mediump float;',
            '',
            'uniform sampler2D uTexture;',
            '',
            'varying vec2 vTexCoord;',
            '',
            'void main() {',
            '    gl_FragColor = texture2D(uTexture, vTexCoord);',
            '}'
        ].join('\n')
    }
};

function load() {
    var canvas = document.querySelector('canvas');
    var gl = WebGLUtils.getContext(canvas, ['webgl', 'experimental-webgl']);

    var programs = WebGLUtils.compileShaders(gl, glslSources);
    var program = programs.colorize;

    var vertices = new Float32Array([
        -0.5, -0.5,   0.0, 0.0,
         0.5, -0.5,   0.0, 1.0,
         0.5,  0.5,   1.0, 1.0,
        -0.5,  0.5,   1.0, 0.0
    ]);

    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(program.attributes.aPosition);
    gl.enableVertexAttribArray(program.attributes.aTexCoord);
    gl.vertexAttribPointer(program.attributes.aPosition, 2, gl.FLOAT, false, 16, 0);
    gl.vertexAttribPointer(program.attributes.aTexCoord, 2, gl.FLOAT, false, 16, 8);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    var image = document.getElementById('cat');
    texture = WebGLUtils.createTexture(gl, {
        image: image
    });
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.useProgram(program.program);

    var t0 = Date.now();
    function render() {
        gl.uniform1f(program.uniforms.uTime, (Date.now() - t0) / 1000);
        gl.uniform1i(program.uniforms.uTexture, 0);

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

window.addEventListener('load', load);

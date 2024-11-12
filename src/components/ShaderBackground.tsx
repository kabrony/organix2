import { useRef, useEffect } from 'react';

interface ShaderBackgroundProps {
  brightness: number;
  mousePos: { x: number; y: number };
}

const vertexShaderSource = `#version 300 es
in vec4 aPosition;
void main() {
    gl_Position = aPosition*2.-1.;
}`;

const fragmentShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_brightness;

#define FC gl_FragCoord.xy
#define R u_resolution
#define T u_time
#define S smoothstep
#define PI 3.14159265359

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = sin(i.x + i.y * 19.19);
    float b = sin(i.x + 1.0 + i.y * 19.19);
    float c = sin(i.x + (i.y + 1.0) * 19.19);
    float d = sin(i.x + 1.0 + (i.y + 1.0) * 19.19);
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    float f = 1.0;
    for(int i = 0; i < 6; i++) {
        v += a * noise(p * f);
        f *= 2.0;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 uv = (FC - 0.5 * R) / min(R.x, R.y);
    vec2 mouse = (u_mouse + 1.0) * 0.5;
    
    float t = T * 0.2;
    vec2 p = uv + vec2(sin(t), cos(t)) * 0.1;
    
    float pattern1 = fbm(p * 3.0 + t);
    float pattern2 = fbm(p * 5.0 - t);
    
    vec3 col1 = mix(
        vec3(0.1, 0.05, 0.2),
        vec3(0.3, 0.2, 0.5),
        pattern1
    );
    
    vec3 col2 = mix(
        vec3(0.2, 0.4, 0.6),
        vec3(0.1, 0.3, 0.4),
        pattern2
    );
    
    vec3 finalColor = mix(col1, col2, 0.5 + 0.5 * sin(T * 0.1));
    
    float mouseDist = length(uv - (mouse - 0.5) * 2.0);
    float mouseGlow = exp(-mouseDist * 4.0);
    
    finalColor += vec3(0.3, 0.4, 0.5) * mouseGlow;
    
    float vignette = 1.0 - length(uv) * 0.5;
    finalColor *= vignette;
    
    finalColor = pow(finalColor, vec3(0.8));
    finalColor *= u_brightness;
    
    O = vec4(finalColor, 1.0);
}`;

const ShaderBackground: React.FC<ShaderBackgroundProps> = ({ brightness, mousePos }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const startTimeRef = useRef(Date.now());
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    contextRef.current = gl;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    
    if (!vertexShader || !fragmentShader) return;

    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error('Vertex shader compile error:', gl.getShaderInfoLog(vertexShader));
      return;
    }
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error('Fragment shader compile error:', gl.getShaderInfoLog(fragmentShader));
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    programRef.current = program;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const handleResize = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * pixelRatio;
      canvas.height = canvas.clientHeight * pixelRatio;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const animate = () => {
      const gl = contextRef.current;
      const program = programRef.current;
      if (!gl || !program) return;

      gl.useProgram(program);

      const timeLocation = gl.getUniformLocation(program, 'u_time');
      const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
      const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
      const brightnessLocation = gl.getUniformLocation(program, 'u_brightness');

      gl.uniform1f(timeLocation, (Date.now() - startTimeRef.current) / 1000);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(mouseLocation, mousePos.x, mousePos.y);
      gl.uniform1f(brightnessLocation, brightness);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      gl.deleteProgram(program);
    };
  }, [brightness, mousePos]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full transition-opacity duration-300"
      style={{ zIndex: 0 }}
    />
  );
};

export default ShaderBackground;
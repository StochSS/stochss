#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;
varying vec3 vPos0;
varying vec3 vPos1;
varying vec3 vPos1n;
varying mat4 vObjMatInv;
varying vec4 vColor;

uniform float Nx;
uniform float Ny;
uniform float Nz;

uniform float xval;
uniform float yval;
uniform float zval;

uniform float xflag;
uniform float yflag;
uniform float zflag;

uniform float xflip;
uniform float yflip;
uniform float zflip;

void main()
{
  vUv = uv;
  
  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(position,1.0);


  float maxDim = max(Nx, max(Ny, Nz));
  vec3 shiftCornerToZero = vec3(Nx / (maxDim * 2.0), Ny / (maxDim * 2.0), Nz / (maxDim * 2.0));
  vPos1 = position;
  vec3 tmp = position + shiftCornerToZero;
  vPos1n = tmp;

}

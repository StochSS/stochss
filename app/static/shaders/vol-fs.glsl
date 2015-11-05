#ifdef GL_ES
precision highp float;
#endif

//---------------------------------------------------------
// MACROS
//---------------------------------------------------------

#define EPS       0.0001
#define PI        3.14159265
#define HALFPI    1.57079633
#define ROOTTHREE 1.73205081

#define EQUALS(A,B) ( abs((A)-(B)) < EPS )
#define EQUALSZERO(A) ( ((A)<EPS) && ((A)>-EPS) )


//---------------------------------------------------------
// CONSTANTS
//---------------------------------------------------------

// 32 48 64 96 128
#define MAX_STEPS 100
//#define uTMK 20.0
#define TM_MIN 0.05


//---------------------------------------------------------
// SHADER VARS
//---------------------------------------------------------

varying vec3 vPos0; // position in world coords
varying vec3 vPos1; // position in object coords
varying vec2 vUv;
varying vec3 vPos1n; // normalized 0 to 1, for texture lookup

uniform vec3 uOffset; // TESTDEBUG

uniform vec3 uCamPos;

uniform vec3 uColor;      // color of volume
uniform sampler2D uTex;   // 3D(2D) volume texture
uniform vec3 uTexDim;     // dimensions of texture

uniform float uTMK;
uniform float Nx;
uniform float Ny;
uniform float Nz;
uniform float width;
uniform float height;


float gStepSize;
float gStepFactor;


//---------------------------------------------------------
// PROGRAM
//---------------------------------------------------------

// TODO: convert world to local volume space
vec3 toLocal(vec3 p) {
  return p + vec3(0.5);
}


float sampleVolTex(vec3 pos, sampler2D uTex) {
  float maxDim = max(Nx, max(Ny, Nz));

  pos.x = pos.x / (Nx / maxDim);
  pos.y = pos.y / (Ny / maxDim);
  pos.z = pos.z / (Nz / maxDim);

  float tilesX = floor(width / Nx);
  float tilesY = floor(width / Ny);

  float tmp = pos.z * Nz; // This is the tile number we care about

  float tileNumber = floor(tmp);

  float x1 = Nx * ( pos.x + mod(tileNumber , tilesX)) ;// this is the X coordinate of the tile in the texture
  float y1 = Ny * ( pos.y + floor(tileNumber / tilesX)) ;// this is the Y coordinate of the tile in the texture

  tileNumber = tileNumber + 1.0;

  float x2 = Nx * (pos.x + mod(tileNumber,tilesX ) );// this is the X coordinate of the tile in the texture
  float y2 = Ny * (pos.y + floor(tileNumber/tilesX) );// this is the Y coordinate of the tile in the texture
  float offsetX =(width-tilesX*Nx); 
  float offsetY =(height-tilesY*Ny); 

  x1 = (x1) / width;
  y1 = (height - y1) / height;
  x2 = (x2) / width;
  y2 = (height - y2) / height;  


  float z0 = texture2D(uTex, vec2(x1, y1)).r;
  float z1 = texture2D(uTex, vec2(x2, y2)).r;
  return mix(z0, z1, fract(tmp));
}

vec4 raymarchLight(vec3 ro, vec3 rd) {
  float maxDim = max(Nx, max(Ny, Nz));

  vec3 step = rd * gStepSize;
  vec3 pos = ro;
  
  vec3 Argb = vec3(0.0);   // accumulated color
  float Aa = 0.0;         // accumulated alpha
  
  float Of = 0.05;
  float Lf = 100.0;


  for (int i=0; i<MAX_STEPS; ++i) {
    float Va = sampleVolTex(pos, uTex);

    float Sa = Va * Of ;

    float Vr = Va;

    float Srgb = Vr * Sa;

    Argb = Argb + (1.0 - Aa -0.05) * vec3(Srgb, 0.0, 0.0);
    Aa += Sa;
    pos += step;

   //if (pos.x < 0.0 )
    //Aa = 1.0;
 
    if ((pos.x / (Nx / maxDim)) >= 1.0 ||
       (pos.x / (Nx / maxDim)) < 0.0 ||
       (pos.y / (Ny / maxDim)) >= 1.0 ||
       (pos.y / (Ny / maxDim)) < 0.0 ||
       (pos.z / (Nz / maxDim)) >= 1.0 ||
       (pos.z / (Nz / maxDim)) < 0.0 )
      break;
  }
  return vec4((Argb) * Lf, Aa); //
}

void main() {
  float maxDim = max(Nx, max(Ny, Nz));
  vec3 shiftCornerToZero = vec3(Nx / (maxDim * 2.0), Ny / (maxDim * 2.0), Nz / (maxDim * 2.0));

  vec3 ro = vPos1n;
  vec3 rd = normalize( ro - (uCamPos + shiftCornerToZero) );
  gStepSize = ROOTTHREE / float(MAX_STEPS);
  gl_FragColor = raymarchLight(ro, rd);
}

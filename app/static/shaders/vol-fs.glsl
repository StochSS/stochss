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
uniform sampler2D uTex2;   // 3D(2D) volume texture
uniform sampler2D depthTex;   // 3D(2D) volume texture
uniform vec3 uTexDim;     // dimensions of texture
uniform sampler2D colorTex;

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
  y1 = (y1) / height;
  x2 = (x2) / width;
  y2 = (y2) / height;  


  float z0 = texture2D(uTex, vec2(x1, y1)).r;
  float z1 = texture2D(uTex, vec2(x2, y2)).r;
  return mix(z0, z1, fract(tmp));
}

vec4 raymarchLight(vec3 ro, vec3 rd) {
  vec3 step = rd * gStepSize;
  vec3 pos = ro;
  
  vec3 Argb = vec3(0.0);   // accumulated color
  float Aa = 0.0;         // accumulated alpha
  
  float Of = 0.02;
  float Lf = 10.0;


  for (int i=0; i<MAX_STEPS; ++i) {

    float Va = sampleVolTex(pos, uTex);
    float Vb = sampleVolTex(pos, uTex2);

    float Sa = Va * Of ;
    float Sb = Vb * Of ;

    vec3 Vr = vec3 (Va, 0, 0);
    vec3 Vblue = vec3 (0, 0, 0);

    vec3 Srgb = Vr * Sa;
    Srgb += Vblue * Sb;

    Argb = Argb + (1.0 - Aa -0.05) * Srgb;
    Aa += (Sa);
    Aa += Sb;
    pos += step;

   //if (pos.x < 0.0 )
    //Aa = 1.0;
 
    if (pos.x >= 1.0 || pos.x < 0.0 || pos.y >= 1.0 || pos.y < 0.0 )
      break;
  }
  return vec4((Argb) * Lf, Aa);//ro, 1.0
}

void main() {
  vec3 ro = vPos1n;
  vec3 rd = normalize( ro - toLocal(uCamPos) );
  gStepSize = ROOTTHREE / float(MAX_STEPS);
  gl_FragColor = raymarchLight(ro, rd);
}

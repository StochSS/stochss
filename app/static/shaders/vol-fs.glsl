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
#define MAX_STEPS 128


//---------------------------------------------------------
// SHADER VARS
//---------------------------------------------------------

varying vec3 vPos1; // normalized 0 to 1, for texture lookup

uniform vec3 uOffset; // TESTDEBUG

uniform vec3 uCamPos;

uniform vec3 uColor;      // color of volume
uniform sampler2D uTex;   // 3D(2D) volume texture
uniform vec3 uTexDim;     // dimensions of texture

uniform float Nx;
uniform float Ny;
uniform float Nz;
uniform float width;
uniform float height;
uniform float luminosity;
uniform float opacity;

uniform float minx;
uniform float miny;
uniform float minz;

uniform float maxx;
uniform float maxy;
uniform float maxz;

float gStepSize;
float gStepFactor;


//---------------------------------------------------------
// PROGRAM
//---------------------------------------------------------

float sampleVolTex(vec3 pos, sampler2D uTex) {
  pos.x = pos.x;
  pos.y = pos.y;
  pos.z = pos.z;

  float tilesX = floor(width / Nx);

  float tmp = pos.z * Nz; // This is the tile number we care about

  float tileNumber = floor(tmp);

  float x1 = Nx * ( pos.x + mod(tileNumber, tilesX)) ;// this is the X coordinate of the tile in the texture
  float y1 = Ny * ( pos.y + floor(tileNumber / tilesX)) ;// this is the Y coordinate of the tile in the texture

  tileNumber = tileNumber + 1.0;

  float x2 = Nx * (pos.x + mod(tileNumber, tilesX));// this is the X coordinate of the tile in the texture
  float y2 = Ny * (pos.y + floor(tileNumber / tilesX));// this is the Y coordinate of the tile in the texture

  x1 = (x1) / width;
  y1 = (height - y1) / height;
  x2 = (x2) / width;
  y2 = (height - y2) / height;  


  float z0 = texture2D(uTex, vec2(x1, y1)).r;
  float z1 = texture2D(uTex, vec2(x2, y2)).r;
  return mix(z0, z1, fract(tmp));
}

vec4 raymarchLight(vec3 ro, vec3 rd) {
  vec3 step = rd * gStepSize;
  vec3 pos = ro;

  float eps = 0.001;
  
  vec3 Argb = vec3(0.0);   // accumulated color
  float Aa = 0.0;         // accumulated alpha
  
  float Of = opacity;
  float Lf = luminosity;

  bool inside = false;

  for (int i=0; i<MAX_STEPS; ++i) {
    bool outside = pos.x > 1.0 ||
       pos.x < 0.0 ||
       pos.y > 1.0 ||
       pos.y < 0.0 ||
       pos.z > 1.0 ||
       pos.z < 0.0;

    if(outside && i >= 1)
    {
         break;
    }

    float Va = sampleVolTex(pos, uTex);

    float Sa = Va * Of;

    float Vr = Va;

    float Srgb = Vr * Sa;

    //Argb = Argb + (1.0 - Aa) * vec3(Srgb, 0.0, 0.0);
    Aa += Sa;
    pos += step;
  }

  return vec4(1.0, 0.0, 0.0, Aa); //(Argb) * Lf
}

void main() {
    vec3 ro = vPos1;

    vec3 rd = normalize(ro - uCamPos);

    ro.x = (ro.x - minx) / (maxx - minx);
    ro.y = (ro.y - miny) / (maxy - miny);
    ro.z = (ro.z - minz) / (maxz - minz);

    rd.x = rd.x / (maxx - minx);
    rd.y = rd.y / (maxy - miny);
    rd.z = rd.z / (maxz - minz);

    gStepSize = 2.0 * ROOTTHREE / float(MAX_STEPS);
    //if(ro.x < 0.0)
    //    gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
    //else
    //        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    gl_FragColor = raymarchLight(ro, rd);
}

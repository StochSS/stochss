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
uniform sampler2D depthTex;   // 3D(2D) volume texture
uniform sampler2D uTex2;   // 3D(2D) volume texture
uniform vec3 uTexDim;     // dimensions of texture
uniform sampler2D colorTex;

uniform float uTMK;

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
  float tmp = pos.y * 100.0;

  //floor(tmp)

  float offsetX = mod(floor(tmp), 10.0) * 100.0;
  float offsetY = (floor(floor(tmp) / 10.0)) * 100.0;

  float y = offsetY;
  float x = offsetX;

  float y2 = y;
  float x2 = x + 100.0;

   if( x2 >= 1000.0)
  {
  x2 -= 1000.0;
  y2 += 100.0;
  }


  float fy= y / 1000.0 + pos.z / 10.0;
  float fx = x / 1000.0 + pos.x / 10.0;

  float fy2= y2 / 1000.0 + pos.z / 10.0;
  float fx2 = x2 / 1000.0 + pos.x / 10.0;
  
    
  // get (bi)linear interped texture reads at two slices
  float z0 = texture2D(uTex, vec2(fx, fy)).r;
  float z1 = texture2D(uTex, vec2(fx2, fy2)).r;

  return mix(z0, z1, fract(tmp));
}


vec4 raymarchLight1(vec3 ro, vec3 rd) {
  vec3 step = rd*gStepSize;
  vec3 pos = ro;
  
  vec3 Argb = vec3(0.0);   // accumulated color
  float Aa = 0.0;         // accumulated alpha
  
  float Of = 0.02;
  float Lf = 1.8;
  float count = 1.0;

  vec3 coords = texture2D(depthTex, vec2(gl_FragCoord.x / 1024.0, gl_FragCoord.y / 768.0)).xyz;//

  float distance = length(coords - ro);

  for (int i=0; i<MAX_STEPS; ++i) {

    float Va = sampleVolTex(pos, uTex);

    if(Va > 0.001) {
      count += 1.0;
    }


    float Sa = (1.0 - exp(-10.0 * Va)) * Of ;

    vec3 Vr = vec3 (texture2D(colorTex, vec2(Va, 0.5)).r, 0 , 0);

    vec3 Srgb = Vr * Sa;

    Argb = Argb + (1.0 - Aa -0.05) * Srgb;
    Aa += (Sa);
    pos += step;

    if (pos.x > 1.0 || pos.x < 0.0 ||
      pos.y > 1.0 || pos.y < 0.0 ||
      pos.z > 1.0 || pos.z < 0.0)
      break;
  }

  float res = Aa;
  
  return vec4(Argb * Lf, res);
}


vec4 raymarchLight(vec3 ro, vec3 rd) {
  vec3 step = rd*gStepSize;
  vec3 pos = ro;
  
  vec3 Argb = vec3(0.0);   // accumulated color
  float Aa = 0.0;         // accumulated alpha
  
  float Of = 0.02;
  float Lf = 1.8;
  float count = 1.0;

  vec3 coords = texture2D(depthTex, vec2(gl_FragCoord.x / 1024.0, gl_FragCoord.y / 768.0)).xyz;//

  float distance = length(coords - ro);

  for (int i=0; i<MAX_STEPS; ++i) {
  
    if(distance < (float(i) * gStepSize) && i > 0)
      return vec4(1.0, 0.0, 0.0, 1.0);
  
    float Va = sampleVolTex(pos, uTex);
    float Vb = sampleVolTex(pos, uTex2);

    if(Va > 0.001) {
      count += 1.0;
    }

    if(Vb > 0.001) {
      count += 1.0;
    }

    float Sa = (1.0 - exp(-10.0 * Va)) * Of ;
    float Sb = (1.0 - exp(-10.0 * Vb)) * Of ;

    vec3 Vr = vec3(Va, 0.0, 0.0);//vec3 (texture2D(colorTex, vec2(Va, 0.5)).r, 0 , 0);
    vec3 Vblue = vec3(0.0, 0.0, Vb);//vec3 (0, 0,texture2D(colorTex, vec2(Vb, 0.5)).b);

    vec3 Srgb = Vr * Sa;
    Srgb += Vblue * Sb;

    Argb = Argb + (1.0 - Aa -0.05) * Srgb;
    Aa += (Sa);
    Aa += Sb;
    pos += step;

    if (pos.x >= 1.0 || pos.x < 0.0 ||
      pos.y >= 1.0 || pos.y < 0.0 ||
      pos.z >= 1.0 || pos.z < 0.0)
      break;
  }

  float res = Aa * float(MAX_STEPS + 1) / count;
  
  return vec4(Argb * Lf, res);
}

void main() {
  // in world coords, just for now
  vec3 ro = vPos1n;
  vec3 rd = normalize( ro - toLocal(uCamPos) );
  
  // step_size = root_three / max_steps ; to get through diagonal  
  gStepSize = ROOTTHREE / float(MAX_STEPS);
  gStepFactor = 32.0 * gStepSize;
  
  gl_FragColor = raymarchLight1(ro, rd);
    //gl_FragColor.a = 1.0;
}

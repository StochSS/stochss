varying vec3 vPos1n; // normalized 0 to 1, for texture lookup


void main() {
  // in world coords, just for now
  vec3 ro = vPos1n;
  
  gl_FragColor.rgb = vPos1n;
  gl_FragColor.a = 1.0;
}


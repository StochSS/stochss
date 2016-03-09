#ifdef GL_ES
precision highp float;
#endif

varying vec3 vPos1;

void main()
{
  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(position, 1.0);

  vPos1 = position;
}

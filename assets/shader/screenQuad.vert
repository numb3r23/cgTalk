precision highp float;

attribute vec3 position;

varying vec2 v_Tex;

void main()
{
  v_Tex = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position, 1.0);
}

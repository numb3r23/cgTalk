#extension GL_OES_standard_derivatives : enable

precision highp float;

varying vec2 v_Tex;       //texture coordinate

uniform float u_Time;

const float speed = 1.0;

const vec3 colBack = vec3(0.1);

const float pacRadius = 0.8;
const float pacEye = 0.12;
const vec2 pacEyePos = vec2(0.3);
const float pacMouth = 30.0;
const vec3 colPac = vec3(1.0, 0.8, 0.0);

const float dotSize = 0.4;
const vec3 colDot = vec3(1.0);
const vec3 colTrack = vec3(0.2);
const vec3 colTrackB = vec3(0.0, 0.0, 0.8);

float aaStep(float edge, float dist, float aaf)
{
  return smoothstep(edge - aaf, edge, dist);
}

vec4 drawPac(vec2 pos, float tictoc)
{
  float radius = length(pos);
  float aaf = fwidth(radius);
  float mask = 1.0 - aaStep(pacRadius, radius, aaf);
  float yAbs = abs(pos.y);

  float angleDeg = degrees(atan(yAbs / pos.x));
  float targetAngle = pacMouth * (sin(tictoc * 12.0) * 0.5 + 0.5);
  mask *= aaStep(targetAngle, angleDeg, fwidth(angleDeg)) + float(pos.x < 0.0);

  vec3 col = mix(colBack, colPac, aaStep(pacEye, distance(pos, pacEyePos),aaf));
  return vec4(col, clamp(mask, 0.0, 1.0));
}

vec4 drawDot(vec2 pos, float sizeMod)
{
  float dst = length(pos);
  float mask = 1.0 - aaStep(dotSize + sizeMod, dst, fwidth(dst));
  return vec4(colDot, mask);
}

void main() 
{ 
  vec3 color = colTrack;

  vec2 tc = v_Tex * 2.0 - 1.0;

  float tictoc = mod(u_Time * 0.3 * speed, 16.0);

  vec2 pos = vec2(v_Tex.x, tc.y) * vec2(16.0, 16.0);

  float aafTrack = fwidth(pos.y);
  float maskTrack = 1.0 - step(1.0, abs(pos.y));
  float maskTrackB = 1.0 - aaStep(1.0 + 2.0 * aafTrack, abs(pos.y), aafTrack);

  color = mix(colBack, colTrackB, maskTrackB);
  color = mix(color, colTrack, maskTrack);

  vec2 cellPosDot = vec2(fract(pos.x) * 2.0 - 1.0, pos.y);
  vec2 cellPosPac = vec2(fract(pos.x - fract(tictoc)) * 2.0 - 1.0, pos.y);


  float dotSizeMod = sin(v_Tex.x * 4.0 + u_Time * 0.3) * 0.1;
  float relPosX = pos.x - tictoc;
  vec4 colDot = drawDot(cellPosDot, dotSizeMod);

  color.rgb = mix(color.rgb, colDot.rgb, colDot.a * float(relPosX >= 0.5));

  vec4 colPac = drawPac(cellPosPac, tictoc);
  float cell = floor(pos.x - tictoc);
  color.rgb = mix(color.rgb, colPac.rgb, colPac.a * float(int(cell) == 0));
  
  gl_FragColor = vec4(color, 1.0);
}

#extension GL_OES_standard_derivatives : enable

precision highp float;

varying vec2 v_Tex;       //texture coordinate

uniform float u_Time;

const float speed = 3.3;

const float radius = 2.7;
const float thresholdFactor = 0.008;
const int ballCount = 23;

const vec3 backgroundColor = vec3(0.0);
const vec3 metaballColor = vec3(1.0, 0.5, 0.0);

const float zoomFactor = 2.35;
const float orbitRadius = 0.3;

float dstMetaball(vec2 pos, vec2 center, float radius)
{
  vec2 diff = pos - center;
  return radius / dot(diff, diff);
}

vec3 colorByDistance(float dst, float falloff, vec3 color, vec3 oldColor)
{
  return mix(color, oldColor, smoothstep(0.0, falloff, dst));
}

// see: www.iquilezles.org/www/articles/palettes/palettes.htm
vec3 colorIQ(float i)
{
  vec3 a = vec3(0.5);
  vec3 b = vec3(0.5);
  vec3 c = vec3(1.0);
  vec3 d = vec3(0.0, 0.1, 0.2);
  return (a + b * cos(((c * i + d) * 6.2831852)));
}

void main()
{
  // create centered local positions
  vec2 pos = (v_Tex  * 2.0 - 1.0) / zoomFactor;
  
  float time = u_Time * 0.1;
  vec3 color = backgroundColor;
    
  float dst = dstMetaball(pos, vec2(0.0), radius);
  color += colorIQ(time * speed * 0.01) * dst * thresholdFactor * (sin(radians(time * (speed + 5.3))) * 0.5 + 0.5) * 30.0;

  // init the vars for the other balls
  vec2 ballPos = vec2(orbitRadius, 0.0);
  float angle = radians(time * speed);
  mat2 matRotate = mat2(cos(angle), -sin(angle),
                        sin(angle),  cos(angle));

  // iterate over the balls, sum up the distance, rotate the ball position
  for (int i=0; i < ballCount; ++i)
  {
    ballPos = matRotate * ballPos;
    dst = dstMetaball(pos, ballPos, radius);
    color += colorIQ(((float(i) + 1.0) / float(ballCount)) + time * speed * 0.01) * dst * thresholdFactor;
    //color += getColor(tex.x) * dst * thresholdFactor;
  }
  color /= float(ballCount) + 1.0;

  gl_FragColor = vec4(pow(color, vec3(0.5)) - 0.5, 1.0);
}
#extension GL_OES_standard_derivatives : enable

precision highp float;

varying vec2 v_Tex;       //v_Texture coordinate

uniform float u_Time;

float dstCircle(vec2 pos, vec2 center, float radius)
{
    return (length(pos - center) - radius) / radius;
}

float dstDiamond(vec2 pos, vec2 center, float radius)
{
    return (dot(abs(pos - center), vec2(1.0)) - radius) / radius;
}

// from https://github.com/stackgl/glsl-ruler/blob/master/color.glsl
vec3 showDistanceField(float t) {
  float t1 = pow(fract(t), 5.0);
  float t2 = pow(fract(t * 10.0), 2.0);
  float t3 = clamp(t1 * 0.25 + t2 * 0.15, 0.0, 1.0);
  vec3 c = mix(mix(vec3(0.1,0.2,1.0), vec3(1.0,0.2,0.1), t*0.5), vec3(1.0), smoothstep(0.2,0.5,t*0.12));
  return vec3(c) - vec3(t3);
}

// inside: white, ouside: black;
vec3 showShape(float t)
{
    float smStep = smoothstep(1.0 - fwidth(t), 1.0, t);
    return vec3(1.0 - smStep);
}

void main()
{
    vec3 color = vec3(0.0);

    int cell = int(dot(floor(v_Tex * 2.0), vec2(2.0, 1.0)));

    vec2 pos = fract(v_Tex * 2.0);

    vec2 center = vec2(0.5);
    float radius = 0.1 + 0.05 * sin(u_Time * 0.05);
    float distCircle = dstCircle(pos, center, radius);
    float distDiamond = dstDiamond(pos, center, radius);

    if (cell == 0)
    {
        color = showDistanceField(distCircle);
    }
    if (cell == 1)
    {
        color = showDistanceField(distDiamond);
    }
    if (cell == 2)
    {
        color = showShape(distCircle);
    }
    if (cell == 3)
    {
        color = showShape(distDiamond);
    }

    gl_FragColor = vec4(color, 1.0);
}
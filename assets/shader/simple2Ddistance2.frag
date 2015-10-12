#extension GL_OES_standard_derivatives : enable

precision highp float;

varying vec2 v_Tex;       //v_Texture coordinate

uniform float u_Time;

float dstDash(vec2 pos, vec2 center, vec2 dash)
{
    vec2 coord = abs(pos - center) / dash;
    return max(coord.x, coord.y);
}

float dstCircle(vec2 pos, vec2 center, float radius)
{
    return length(pos - center) - radius;
}

float dstPlus(vec2 pos, vec2 center, float radius)
{
    vec2 dash = vec2(0.7, 0.15) * radius;
    
    float dstX = dstDash(pos, center, dash);
    float dstY = dstDash(pos, center, dash.yx);

    return min(dstY, dstX);
}

float dstTwoDots(vec2 pos, vec2 center, float radius)
{
    vec2 dash = vec2(0.7, 0.2);
    vec2 circOffset = vec2(0.5, 0.0);
    
    float dstX = dstDash(pos, center, dash);
    float dstY1 = dstCircle(pos, center - circOffset, radius - 1.0);
    float dstY2 = dstCircle(pos, center + circOffset, radius - 1.0);

    return min(max(dstY1, dstX), max(dstY2, dstX));
}

float dstOneWay(vec2 pos, vec2 center, float radius)
{
    vec2 dash = vec2(0.5, 0.15);
    
    float dstX = dstCircle(pos, center, radius - 1.0);
    float dstY = dstDash(pos, center, dash);

    return max(dstX, -dstY + 2.0);
}

float dstCircOutline(vec2 pos, vec2 center, float radius, float width)
{
    float dst = dstCircle(pos, center, -0.3);
    return abs(dst - 1.0) + 1.0 - width;
}

vec2 rotatePos(vec2 pos, float angle)
{
    float s = sin(angle);
    float c = cos(angle);

    return mat2(c, -s, s, c) * pos;
    //return pos;
}

vec2 distort(vec2 pos, float time)
{
    vec2 dTime = time + pos * 7.1;
    vec2 dsrt = vec2(sin(dTime.x), cos(dTime.y)) * 0.1;

    dTime *= 0.5;
    dsrt += vec2(sin(dTime.x), cos(dTime.y)) * 0.1;

    dTime *= 0.5;
    dsrt += vec2(sin(dTime.x), cos(dTime.y)) * 0.1;

    pos = pos + dot(dsrt, vec2(1.0));
    return pos;
}

// from https://github.com/stackgl/glsl-ruler/blob/master/color.glsl
vec3 showDistanceField(float t) {
  float t1 = pow(fract(t), 5.0);
  float t2 = pow(fract(t * 10.0), 2.0);
  float t3 = clamp(t1 * 0.25 + t2 * 0.15, 0.0, 1.0);
  vec3 c = mix(mix(vec3(0.1,0.2,1.0), vec3(1.0,0.2,0.1), t*0.5), vec3(1.0), smoothstep(0.2,0.5,t*0.12));
  return vec3(c) - vec3(t3);
  //return vec3(t);
}

// inside: white, ouside: black;
vec3 showShape(float t)
{
    float smStep = smoothstep(1.0 - fwidth(t), 1.0, t);
    return vec3(1.0 - smStep);
}

vec3 doLeftRightMix(vec2 gridPos, float dist)
{
    return mix(showDistanceField(dist), showShape(dist), step(0.5, fract(gridPos.x)));
}

void main()
{
    vec3 color = vec3(0.0);

    ivec2 grid = ivec2(2, 4);
    vec2 gridPos = v_Tex * vec2(grid);
    ivec2 iGridPos = ivec2(floor(gridPos));
    int cell = iGridPos.y + iGridPos.x * grid.y;

    vec2 pos = fract(gridPos * vec2(2.0, 1.0));
    pos = (pos - 0.5) * 2.0;

    vec2 center = vec2(0.0);
    float radius = 1.0 + 0.1 * sin(u_Time * 0.02);

    float dist = 10.0;

    if (cell == 0)
    {
       dist = dstDash(pos, center, vec2(0.7, 0.15));
    }
    if (cell == 1)
    {
       dist = dstPlus(pos, center, 1.0);
    }
    if (cell == 2)
    {
        dist = dstTwoDots(pos, center, 0.3);
    }
    if (cell == 3)
    {
        dist = dstOneWay(pos, center, 0.7);
    }
    if (cell == 4)
    {
        dist = dstCircOutline(pos, center, -0.3, 0.1);
    }
    if (cell == 5)
    {
       dist = dstPlus(rotatePos(pos, u_Time * 0.01), center, 1.0);
    }
    if (cell == 6)
    {
        float distA = dstPlus(rotatePos(pos, u_Time * 0.01), center, 1.0);
        float distB = dstCircle(abs(pos), abs(rotatePos(vec2(0.5, 0.5), u_Time * 0.01)), -0.8);
        dist = min(distA, distB);
    }
    if (cell == 7)
    {
        vec2 newPos = distort(pos, u_Time * 0.1);
        float distA = dstPlus(newPos, center, 1.0);
        dist = distA;
    }

    color = doLeftRightMix(gridPos, dist);

    gl_FragColor = vec4(color, 1.0);
}
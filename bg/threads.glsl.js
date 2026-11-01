const e=`
float th_h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec3 threads(vec2 uv, vec2 res, float t, float band, float amp, float gain) {
  vec3 c = vec3(0.);
  float x = uv.x * (res.x / res.y);
  float spread = .085 + .06 * sin(x * 1.3 + t * .21);                        // the band gathers and opens: a twist
  for (int i = 0; i < 30; i++) {
    float f = float(i) / 29., k = f - .5;
    float y = band + k * spread * (1.2 + .8 * sin(x * 2.1 - t * .17 + f * 2.))
            + amp * sin(x * 1.05 + t * .16 + f * .9) + amp * .35 * sin(x * 2.7 - t * .23 + f * 4.1);
    float d = abs(uv.y - y) * res.y;                                           // distance in pixels: lines stay hair-thin at any size
    float core = 1.1 / (d + 1.1);
    float soft = exp(-d / 14.) * .09;                                               // each thread glows a little around itself
    float pulse = .25 + .75 * pow(.5 + .5 * sin(x * 3.2 - t * .9 + f * 11.), 4.);   // light running along each thread
    vec3 col = mix(vec3(.62, .16, .04), vec3(.98, .5, .16), smoothstep(.0, .7, pulse));
    col = mix(col, vec3(1., .86, .66), smoothstep(.75, 1., pulse) * (1. - abs(k) * 1.6));
    c += col * (core * core * .7 + soft) * pulse;
  }
  float halo = exp(-pow((uv.y - band - amp * sin(x * 1.05 + t * .16 + .45)) * 5.5, 2.));   // the soft light the band throws
  c += vec3(.6, .19, .05) * halo * .34;
  // a few sparks drifting along the band
  vec2 g = vec2(x * 40., uv.y * 40. / 1.), id = floor(g); float s = th_h(id);
  if (s > .985) { vec2 q = fract(g) - .5; c += vec3(1., .75, .45) * exp(-dot(q, q) * 60.) * .6 * (.5 + .5 * sin(t * 2. + s * 40.)) * halo * 3.; }
  return c * gain;
}`,o=`
float th_h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec3 threads(vec2 uv, vec2 res, float t, float band, float amp, float gain) {
  vec3 c = vec3(0.); float x = uv.x * (res.x / res.y);
  for (int j = 0; j < 3; j++) {
    float fj = float(j);
    float y = band + amp * 1.2 * sin(x * .85 + t * .11 + fj * 2.1) + .05 * sin(x * 2.1 - t * .17 + fj * 1.3) + (fj - 1.) * .05;
    float w = .085 + .035 * sin(x * 1.6 + t * .23 + fj * 2.7);
    float d = (uv.y - y) / w;
    float a = exp(-d * d * 1.3);
    float fold = pow(.5 + .5 * sin(x * 5.5 + t * .45 + fj * 3. + d * 1.7), 2.);        // satin folds catching the light
    float edge = exp(-pow(abs(d) - .85, 2.) * 14.) * .5;                                 // brighter rims, like silk edges
    vec3 col = mix(vec3(.5, .12, .03), vec3(.98, .48, .15), fold);
    col = mix(col, vec3(1., .85, .64), pow(fold, 4.) * .7);
    c += col * (a * (.25 + .75 * fold) + edge * fold) * (.55 - fj * .1);
  }
  return c * gain * .9;
}`,a=`
float th_h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec3 threads(vec2 uv, vec2 res, float t, float band, float amp, float gain) {
  vec3 c = vec3(0.); float x = uv.x * (res.x / res.y);
  for (int k = 0; k < 26; k++) {
    float fk = float(k) / 25.;                                   // 0 = far row, 1 = near row
    float persp = .35 + fk * 1.1;
    float rowY = band + (fk - .5) * .2 + amp * sin(x * 1.4 / persp + t * .35 + fk * 5.) * persp + .025 * sin(x * 4. - t * .6 + fk * 9.) * persp;
    float sp = .018 / persp + .006;                             // dot spacing shrinks toward the horizon
    float gx = (x + t * .02 * persp) / sp, cell = floor(gx + .5), dx = (gx - cell) * sp;
    float dy = uv.y - rowY;
    float d = length(vec2(dx, dy)) * res.y;
    float r = 1.1 + persp * 1.3;
    float lit = .35 + .65 * pow(.5 + .5 * sin(x * 2.2 - t * .7 + fk * 7.), 3.);       // light rolling over the swell
    float dot_ = exp(-d * d / (r * r)) * lit * (.25 + .75 * fk) * exp(-pow((uv.y - band) / .13, 2.));   // the field stays in its band, never under the words
    vec3 col = mix(vec3(.75, .24, .06), vec3(1., .78, .52), lit * fk);
    c += col * dot_;
  }
  c += vec3(.5, .15, .04) * exp(-pow((uv.y - band) * 4.5, 2.)) * .16;
  return c * gain * 1.1;
}`,t=typeof location<"u"&&new URLSearchParams(location.search).get("bg")||"threads";export const BG_STYLE=t,THREADS=t==="silk"?o:t==="dots"?a:e;

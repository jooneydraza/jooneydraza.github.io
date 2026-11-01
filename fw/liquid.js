var P=Object.defineProperty;var o=(r,f)=>P(r,"name",{value:f,configurable:!0});const s=matchMedia("(prefers-reduced-motion: reduce)").matches,q=`precision mediump float;
uniform vec2 R, M; uniform float T, B, G, S; uniform vec3 C0, C1, C2;
float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h(i), h(i + vec2(1., 0.)), f.x), mix(h(i + vec2(0., 1.)), h(i + 1.), f.x), f.y); }
float fbm(vec2 p) { float v = 0., a = .5; for (int i = 0; i < 2; i++) { v += a * n(p); p *= 1.9; a *= .45; } return v; }
void main() {
  vec2 uv = gl_FragCoord.xy / R, p = uv * vec2(R.x / R.y, 1.) * S; float t = T * .05;
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 2.2 * q + vec2(1.7, 9.2) + t * .8), fbm(p + 2.2 * q + vec2(8.3, 2.8) - t * .6));
  float f = fbm(p + 2.6 * r + (M - .5) * .35);
  float side = mix(1., smoothstep(-.1, .9, uv.x), B);              // B = how much the light keeps away from the text side
  float v = clamp(smoothstep(.2, .6, f) * (.42 + .9 * side), 0., 1.);
  
  vec3 c = mix(C0, C1, .3 + .7 * smoothstep(.05, .5, v)); c = mix(c, C2, smoothstep(.55, .98, v) * G * G); c = mix(c, vec3(1., .97, .9), smoothstep(.93, 1., v) * .12);
  c += (h(gl_FragCoord.xy + fract(T * 7.)) - .5) * .045;             // film grain
  gl_FragColor = vec4(mix(C0, c, G), 1.);
}`,L=o(r=>[1,3,5].map(f=>parseInt(r.slice(f,f+2),16)/255),"hex");export function liquid(r,f,h={}){const e=r.getContext("webgl",{antialias:!1,alpha:!1,powerPreference:"low-power"});if(!e)return{set(){},start(){},stop(){}};const v=o((t,i)=>{const u=e.createShader(t);return e.shaderSource(u,i),e.compileShader(u),u},"sh"),a=e.createProgram();e.attachShader(a,v(e.VERTEX_SHADER,"attribute vec2 a; void main() { gl_Position = vec4(a, 0., 1.); }")),e.attachShader(a,v(e.FRAGMENT_SHADER,q)),e.linkProgram(a),e.useProgram(a),e.bindBuffer(e.ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);const g=e.getAttribLocation(a,"a");e.enableVertexAttribArray(g),e.vertexAttribPointer(g,2,e.FLOAT,!1,0,0);const n=o(t=>e.getUniformLocation(a,t),"U"),S=n("R"),B=n("M"),E=n("T"),T=n("B"),x=n("G"),y=n("S"),_=[n("C0"),n("C1"),n("C2")];let c=!1,m=0,R=0,p=.5,d=.5,A=.5,C=.5,G=performance.now()-Math.random()*4e4;const b=o(t=>{t.forEach((i,u)=>e.uniform3fv(_[u],L(i)))},"setPal");b(f),e.uniform1f(T,h.bias??1),e.uniform1f(x,h.gain??1),e.uniform1f(y,h.scale??.62);const w=o(()=>{const t=r.getBoundingClientRect(),i=Math.min(devicePixelRatio,2)*.5;r.width=Math.max(2,Math.round(t.width*i)),r.height=Math.max(2,Math.round(t.height*i)),e.viewport(0,0,r.width,r.height)},"size"),l=o(t=>{m=0,c&&((t-R>32||s)&&(R=t,p+=(A-p)*.06,d+=(C-d)*.06,e.uniform2f(S,r.width,r.height),e.uniform2f(B,p,d),e.uniform1f(E,s?30:(t-G)/1e3),e.drawArrays(e.TRIANGLES,0,3)),s||(m=requestAnimationFrame(l)))},"frame"),F=o(()=>{c||(c=!0,w(),m=requestAnimationFrame(l))},"start"),M=o(()=>{c=!1,m&&cancelAnimationFrame(m),m=0},"stop");return h.manual||new IntersectionObserver(t=>t[0].isIntersecting?F():M(),{rootMargin:"10% 0px"}).observe(r),addEventListener("resize",()=>{c&&(w(),s&&l(performance.now()))}),s||(h.pointer||r).addEventListener("pointermove",t=>{const i=r.getBoundingClientRect();A=(t.clientX-i.left)/i.width,C=1-(t.clientY-i.top)/i.height}),{set(t,i){b(t),i!=null&&e.uniform1f(x,i),s&&c&&l(performance.now())},start:F,stop:M}}o(liquid,"liquid");

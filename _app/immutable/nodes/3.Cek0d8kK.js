import"../chunks/DsnmJJEf.js";import{o as ft}from"../chunks/_imy_nln.js";import{m as mt,u as dt,aj as Mt,E as wt,aT as At,aU as Rt,aV as Ft,aW as pt,aX as Ut,q as kt,n as Fe,aY as St,aZ as Lt,a_ as Pt,ae as It,z as Bt,p as ht,f as ie,j as Be,i as p,b as j,c as ut,ax as Dt,a$ as Ge,Y as Ct,h as Nt,aO as zt,a as Ve,s as C,d as M,t as ee,W as Xt,aR as Je,g as Qe,r as T,k as et,aq as tt,b0 as Ne,e as ve}from"../chunks/DfDJ51Uc.js";import{i as qe}from"../chunks/CJhgAoV8.js";import{G as Ot,H as at,S as $t,e as Me,I as Gt,s as $,j as Vt}from"../chunks/CfZUa0gz.js";import{s as rt}from"../chunks/BW8QIiUY.js";import{s as Ye}from"../chunks/B9l1nZSD.js";import{b as De}from"../chunks/C0IiT9Zb.js";import{i as Yt}from"../chunks/D3PU3tjC.js";import{t as ae,i as Ue}from"../chunks/pnwv6ceE.js";function jt(a,r,s){mt(()=>{var c=dt(()=>r(a,s?.())||{});if(c?.destroy)return()=>c.destroy()})}const Ht=()=>performance.now(),de={tick:a=>requestAnimationFrame(a),now:()=>Ht(),tasks:new Set};function xt(){const a=de.now();de.tasks.forEach(r=>{r.c(a)||(de.tasks.delete(r),r.f())}),de.tasks.size!==0&&de.tick(xt)}function Kt(a){let r;return de.tasks.size===0&&de.tick(xt),{promise:new Promise(s=>{de.tasks.add(r={c:a,f:s})}),abort(){de.tasks.delete(r)}}}function Ie(a,r){pt(()=>{a.dispatchEvent(new CustomEvent(r))})}function Wt(a){if(a==="float")return"cssFloat";if(a==="offset")return"cssOffset";if(a.startsWith("--"))return a;const r=a.split("-");return r.length===1?r[0]:r[0]+r.slice(1).map(s=>s[0].toUpperCase()+s.slice(1)).join("")}function st(a){const r={},s=a.split(";");for(const c of s){const[l,v]=c.split(":");if(!l||v===void 0)break;const t=Wt(l.trim());r[t]=v.trim()}return r}const Zt=a=>a;function Jt(a,r,s){var c=Ot,l,v,t,i=null;c.a??={element:a,measure(){l=this.element.getBoundingClientRect()},apply(){if(t?.abort(),v=this.element.getBoundingClientRect(),l.left!==v.left||l.right!==v.right||l.top!==v.top||l.bottom!==v.bottom){const m=r()(this.element,{from:l,to:v},s?.());t=Ce(this.element,m,void 0,1,()=>{t?.abort(),t=void 0})}},fix(){if(!a.getAnimations().length){var{position:m,width:x,height:h}=getComputedStyle(a);if(m!=="absolute"&&m!=="fixed"){var g=a.style;i={position:g.position,width:g.width,height:g.height,transform:g.transform},g.position="absolute",g.width=x,g.height=h;var y=a.getBoundingClientRect();if(l.left!==y.left||l.top!==y.top){var L=`translate(${l.left-y.left}px, ${l.top-y.top}px)`;g.transform=g.transform?`${g.transform} ${L}`:L}}}},unfix(){if(i){var m=a.style;m.position=i.position,m.width=i.width,m.height=i.height,m.transform=i.transform}}},c.a.element=a}function je(a,r,s,c){var l=(a&Lt)!==0,v=(a&Pt)!==0,t=l&&v,i=(a&Ft)!==0,m=t?"both":l?"in":"out",x,h=r.inert,g=r.style.overflow,y,L;function G(){return pt(()=>x??=s()(r,c?.()??{},{direction:m}))}var q={is_global:i,in(){if(r.inert=h,!l){L?.abort(),L?.reset?.();return}v||y?.abort(),Ie(r,"introstart"),y=Ce(r,G(),L,1,()=>{Ie(r,"introend"),y?.abort(),y=x=void 0,r.style.overflow=g})},out(P){if(!v){P?.(),x=void 0;return}r.inert=!0,Ie(r,"outrostart"),L=Ce(r,G(),y,0,()=>{Ie(r,"outroend"),P?.()})},stop:()=>{y?.abort(),L?.abort()}},F=Mt;if((F.transitions??=[]).push(q),l&&St){var w=i;if(!w){for(var e=F.parent;e&&(e.f&wt)!==0;)for(;(e=e.parent)&&(e.f&At)===0;);w=!e||(e.f&Rt)!==0}w&&mt(()=>{dt(()=>q.in())})}}function Ce(a,r,s,c,l){var v=c===1;if(Ut(r)){var t,i=!1;return kt(()=>{if(!i){var F=r({direction:v?"in":"out"});t=Ce(a,F,s,c,l)}}),{abort:()=>{i=!0,t?.abort()},deactivate:()=>t.deactivate(),reset:()=>t.reset(),t:()=>t.t()}}if(s?.deactivate(),!r?.duration)return l(),{abort:Fe,deactivate:Fe,reset:Fe,t:()=>c};const{delay:m=0,css:x,tick:h,easing:g=Zt}=r;var y=[];if(v&&s===void 0&&(h&&h(0,1),x)){var L=st(x(0,1));y.push(L,L)}var G=()=>1-c,q=a.animate(y,{duration:m,fill:"forwards"});return q.onfinish=()=>{q.cancel();var F=s?.t()??1-c;s?.abort();var w=c-F,e=r.duration*Math.abs(w),P=[];if(e>0){var V=!1;if(x)for(var X=Math.ceil(e/16.666666666666668),N=0;N<=X;N+=1){var J=F+w*g(N/X),z=st(x(J,1-J));P.push(z),V||=z.overflow==="hidden"}V&&(a.style.overflow="hidden"),G=()=>{var H=q.currentTime;return F+w*g(H/e)},h&&Kt(()=>{if(q.playState!=="running")return!1;var H=G();return h(H,1-H),!0})}q=a.animate(P,{duration:e,fill:"forwards"}),q.onfinish=()=>{G=()=>c,h?.(c,1-c),l()}},{abort:()=>{q&&(q.cancel(),q.effect=null,q.onfinish=Fe)},deactivate:()=>{l=Fe},reset:()=>{c===0&&h?.(1,0)},t:()=>G()}}function He(a,r,s){var c=It(a,r);c&&c.set&&(a[r]=s,Bt(()=>{a[r]=null}))}function Qt(a){const r=a-1;return r*r*r+1}function ea(a,{from:r,to:s},c={}){var{delay:l=0,duration:v=N=>Math.sqrt(N)*120,easing:t=Qt}=c,i=getComputedStyle(a),m=i.transform==="none"?"":i.transform,[x,h]=i.transformOrigin.split(" ").map(parseFloat);x/=a.clientWidth,h/=a.clientHeight;var g=ta(a),y=a.clientWidth/s.width/g,L=a.clientHeight/s.height/g,G=r.left+r.width*x,q=r.top+r.height*h,F=s.left+s.width*x,w=s.top+s.height*h,e=(G-F)*y,P=(q-w)*L,V=r.width/s.width,X=r.height/s.height;return{delay:l,duration:typeof v=="function"?v(Math.sqrt(e*e+P*P)):v,easing:t,css:(N,J)=>{var z=J*e,H=J*P,ne=N+J*V,fe=N+J*X;return`transform: ${m} translate(${z}px, ${H}px) scale(${ne}, ${fe});`}}}function ta(a){if("currentCSSZoom"in a)return a.currentCSSZoom;for(var r=a,s=1;r!==null;)s*=+getComputedStyle(r).zoom,r=r.parentElement;return s}function gt(a){const r=a-1;return r*r*r+1}function nt(a){const r=typeof a=="string"&&a.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);return r?[parseFloat(r[1]),r[2]||"px"]:[a,"px"]}function aa(a,{delay:r=0,duration:s=400,easing:c=gt,x:l=0,y:v=0,opacity:t=0}={}){const i=getComputedStyle(a),m=+i.opacity,x=i.transform==="none"?"":i.transform,h=m*(1-t),[g,y]=nt(l),[L,G]=nt(v);return{delay:r,duration:s,easing:c,css:(q,F)=>`
			transform: ${x} translate(${(1-q)*g}${y}, ${(1-q)*L}${G});
			opacity: ${m-h*F}`}}function ot(a,{delay:r=0,duration:s=400,easing:c=gt,start:l=0,opacity:v=0}={}){const t=getComputedStyle(a),i=+t.opacity,m=t.transform==="none"?"":t.transform,x=1-l,h=i*(1-v);return{delay:r,duration:s,easing:c,css:(g,y)=>`
			transform: ${m} scale(${1-x*y});
			opacity: ${i-h*y}
		`}}const it=[[[.718,.181,.6,.79],[.718,.774,.6,.79]],[[.747,.135,.62,.81],[.835,.726,.73,.89]]],Z=28,Le=Math.PI*2,We=.2/.3,Ke=a=>Math.atan2(Math.sin(a),Math.cos(a)),ke=(a,r,s)=>Math.max(r,Math.min(s,a)),Se=(a,r)=>1-Math.exp(-a/r);function ct(a,r,s,c,l){const v={x:a,y:r,angle:s,turn:0,speed:0,length:Math.max(240,Math.min(l*.3,480)),variety:c,phase:Math.random()*Le,freq:.8,amp:.1,freqTo:.8,ampTo:.1,mode:"coast",modeUntil:.3+Math.random(),social:!1,socialUntil:4+Math.random()*6,goal:{x:a,y:r},goalUntil:0,bend:new Array(Z+2).fill(0),travelled:0,cbend:0,cSign:1,cUntil:0,fin:Math.random()*Le,fins:[0,0],depth:.5,seed:Math.random()*100,spine:Array.from({length:Z},()=>({x:a,y:r}))};return v.speed=.3*v.length,v}function ra(a,r){return[ct(a*.3,r*.65,-.3,0,a),ct(a*.72,r*.3,2.6,1,a)]}function sa(a,r,s){for(let c=0;c<Z*.75;c++){const l=a.spine[c];if(Math.hypot(l.x-r,l.y-s)<a.length*.11)return!0}return!1}function we(a,r,s){if(a.mode=r,r==="swim"){const c=.28+Math.random()*.3;a.ampTo=.5+Math.random()*.15,a.freqTo=c/(We*a.ampTo);const l=Math.random()<.25?10+Math.random()*8:2+Math.random()*6;a.modeUntil=s+l/a.freqTo}else r==="coast"?(a.ampTo=.06,a.freqTo=.7,a.modeUntil=s+.8+Math.random()*2.2):r==="hover"?(a.ampTo=.03,a.freqTo=.5,a.modeUntil=s+1.5+Math.random()*3):(a.ampTo=1,a.freqTo=3.2,a.modeUntil=s+.7)}function na(a,r){const s=Math.random();a.mode==="flee"?we(a,"coast",r):a.mode==="swim"?we(a,s<.8?"coast":"swim",r):a.mode==="coast"?we(a,s<.25&&a.speed<.15*a.length?"hover":"swim",r):we(a,"swim",r),a.mode==="coast"&&a.modeUntil-r<1.5&&Math.random()<.3&&(a.modeUntil+=1.5)}function oa(a,r,s){const c=a.length/(Z-1),l=(r-a.travelled)/c;if(l<0)return s;const v=Math.min(Math.floor(l),Z);return a.bend[v]+(a.bend[v+1]-a.bend[v])*(l-v)}function lt(a,r,s,c,l,v){for(const t of a){const i=t.length,m=i/(Z-1),x=a.find(o=>o!==t);if(r>t.socialUntil&&(t.social=Math.random()<.45,t.socialUntil=r+8+Math.random()*12),t.mode!=="flee"&&c.pspeed>.5&&sa(t,c.px,c.py)){const o=Math.atan2(t.y-c.py,t.x-c.px)+(Math.random()-.5)*.8;t.cSign=Math.sign(Ke(o-t.angle))||1,t.cUntil=r+.14,t.goal={x:t.x+Math.cos(o)*i*3,y:t.y+Math.sin(o)*i*3},t.goalUntil=r+2.5,we(t,"flee",r)}r>t.modeUntil&&na(t,r);let h=t.goal;if(t.social&&x&&t.mode!=="flee"){const o=t.variety===0?1:-1,d=Math.cos(x.angle),b=Math.sin(x.angle);if(h={x:x.x-d*i*.55-b*i*.4*o,y:x.y-b*i*.55+d*i*.4*o},t.mode==="swim"){const A=Math.hypot(h.x-t.x,h.y-t.y)/i,B=ke(x.speed/i+(A-.3)*.35,.2,.95);t.freqTo=B/(We*t.ampTo)}}else(r>t.goalUntil||Math.hypot(t.goal.x-t.x,t.goal.y-t.y)<i*.6)&&(t.goal={x:l*(.15+Math.random()*.7),y:v*(.2+Math.random()*.6)},t.goalUntil=r+10+Math.random()*10,h=t.goal);let g=Math.atan2(h.y-t.y,h.x-t.x);if(g+=Math.sin(r*.37+t.seed)*.25+Math.sin(r*.13+t.seed*2)*.35,x){const o=x.spine[Z>>2].x,d=x.spine[Z>>2].y,b=Math.hypot(o-t.x,d-t.y);if(b<i*.8){const A=Math.atan2(t.y-d,t.x-o);g=t.angle+Ke(A-t.angle)*(1-b/(i*.8))*1.4}}const y=i*.5+t.speed*1.2,L=t.x+Math.cos(t.angle)*y,G=t.y+Math.sin(t.angle)*y,q=Math.min(l,v)*.06;(L<q||L>l-q||G<q||G>v-q)&&(g=Math.atan2(v/2-t.y,l/2-t.x),t.mode==="hover"&&we(t,"swim",r));const F=t.mode==="flee",w=t.speed/i,e=F&&r<t.cUntil+.1?9:.3+1.6*w,P=ke(Ke(g-t.angle)*(F?6:1.4),-e,e);t.turn+=(P-t.turn)*Se(s,F?.04:.35);const V=t.turn*s,X=1-Math.min(1,w/.35),N=.3*i*X,J=t.x-Math.cos(t.angle)*N,z=t.y-Math.sin(t.angle)*N;t.angle+=V,t.x=J+Math.cos(t.angle)*N,t.y=z+Math.sin(t.angle)*N,t.amp+=(t.ampTo-t.amp)*Se(s,F?.06:.3),t.freq+=(t.freqTo-t.freq)*Se(s,F?.06:.4),t.phase+=Le*t.freq*s;const H=We*t.amp*t.freq*i;t.speed+=(H-t.speed)*Se(s,H>t.speed?F?.2:.45:1.6);const ne=t.speed*s;t.x+=Math.cos(t.angle)*ne,t.y+=Math.sin(t.angle)*ne;const fe=ke(t.turn*(1-X)/Math.max(t.speed,1),-1.6/i,1.6/i);for(t.travelled+=ne;t.travelled>=m;)t.bend.pop(),t.bend.unshift(fe),t.travelled-=m;const be=Math.exp(-s*.5);for(let o=0;o<t.bend.length;o++)t.bend[o]*=be;t.cbend+=((r<t.cUntil?t.cSign:0)-t.cbend)*Se(s,.07);const I=1-ke((w-.35)/.55,0,1);t.fin+=s*Le*1.2*I;const k=ke(t.turn*.35,-.35,.35)*I;t.fins[0]=.75+(.12+.26*Math.sin(t.fin)-.75)*I-k,t.fins[1]=.75+(.12+.26*Math.sin(t.fin+2.2)-.75)*I+k,t.depth=.5+.5*Math.sin(r*.13+t.seed*3);let K=t.angle+Math.PI,oe=t.x,n=t.y;for(let o=0;o<Z;o++){const d=o/(Z-1),b=.2-.8*d+1.6*d*d,A=1.2*Math.max(0,(d-.78)/.22)**2,B=.1*i*t.amp*b*Math.sin(Le*d/.95-t.phase-A),U=t.spine[o];U.x=oe-Math.sin(K)*B,U.y=n+Math.cos(K)*B;const E=oa(t,(o+.5)*m,fe)+t.cbend*3.2/i*Math.sin(Math.PI*d);K-=E*m*.5,oe+=Math.cos(K)*m,n+=Math.sin(K)*m,K-=E*m*.5}}}const vt=(()=>{const a=[];for(let r=0;r<Z-1;r++){const s=r*2;a.push(s,s+1,s+2,s+1,s+3,s+2)}return new Uint16Array(a)})(),ia=Z*8;function ca(a,r,s){const c=a.spine,l=a.length*r/2;for(let v=0;v<Z;v++){const t=c[Math.max(0,v-1)],i=c[Math.min(Z-1,v+1)],m=Math.hypot(t.x-i.x,t.y-i.y)||1,x=-(t.y-i.y)/m,h=(t.x-i.x)/m,g=1-v/(Z-1),y=v*8;s[y]=c[v].x+x*l,s[y+1]=c[v].y+h*l,s[y+2]=g,s[y+3]=0,s[y+4]=c[v].x-x*l,s[y+5]=c[v].y-h*l,s[y+6]=g,s[y+7]=1}return s}var la=ie('<canvas class="pointer-events-none fixed inset-0 z-0 h-full w-full" aria-hidden="true"></canvas>');function va(a,r){ht(r,!1);const s=1100;let c=Dt(),l=[],v=0,t=0,i={x:0,y:0,start:-1e9};function m(w,e,P=20,V=.3){l.length<16&&l.push([w,e,P,V])}function x(w,e=!1,P=0,V=0){v=e?w?1:0:t,t=w?1:0,i={x:P,y:V,start:e?-1e9:performance.now()}}const h=`#version 300 es
layout(location = 0) in vec2 p;
out vec2 uv;
void main() { uv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`,g=`#version 300 es
precision highp float;
in vec2 uv;
out vec4 o;
uniform sampler2D state;
uniform vec4 drops[16];
uniform int count;
uniform vec2 size;
void main() {
	vec4 s = texture(state, uv);
	for (int k = 0; k < 16; k++) {
		if (k >= count) break;
		float d = max(0.0, 1.0 - length((uv - drops[k].xy) * size) / drops[k].z);
		s.r += (0.5 - cos(d * 3.14159) * 0.5) * drops[k].w;
	}
	o = s;
}`,y=`#version 300 es
precision highp float;
in vec2 uv;
out vec4 o;
uniform sampler2D state;
uniform vec2 texel;
void main() {
	vec4 s = texture(state, uv);
	float avg = (
		texture(state, uv - vec2(texel.x, 0.0)).r + texture(state, uv + vec2(texel.x, 0.0)).r +
		texture(state, uv - vec2(0.0, texel.y)).r + texture(state, uv + vec2(0.0, texel.y)).r
	) * 0.25;
	s.g += (avg - s.r) * 2.0;
	s.g *= 0.993;
	s.r += s.g;
	s.r += (avg - s.r) * 0.08;
	s.r *= 0.998;
	o = s;
}`,L=`#version 300 es
layout(location = 0) in vec2 pos;
layout(location = 1) in vec2 tex;
uniform vec2 res;
out vec2 vUv;
void main() {
	vUv = tex;
	gl_Position = vec4(pos.x / res.x * 2.0 - 1.0, 1.0 - pos.y / res.y * 2.0, 0.0, 1.0);
}`,G=`#version 300 es
precision highp float;
in vec2 vUv;
out vec4 o;
uniform sampler2D photo;
uniform float fade;
uniform float aspect;
uniform vec2 fins;
uniform vec4 finR;
uniform vec4 finL;
vec2 rot(vec2 d, float a) { float c = cos(a); float s = sin(a); return vec2(d.x * c - d.y * s, d.x * s + d.y * c); }
// A pectoral fin swings around its pivot: the pixel is read from where the fin was in the photo,
// and only fin pixels (outside the body edge) are moved.
// Gradients come from the unwarped uv, or the jump at the fin edge picks a tiny mip and draws a seam.
vec4 fin(vec2 uv, vec4 f, float angle, float side, vec2 gx, vec2 gy) {
	vec2 piv = vec2(f.x, f.y * aspect);
	vec2 s = piv + rot(vec2(uv.x, uv.y * aspect) - piv, angle * side);
	s.y /= aspect;
	bool inside = side * (f.y - s.y) > 0.0 && s.x > f.z && s.x < f.w;
	vec4 moved = inside ? textureGrad(photo, s, gx, gy) : vec4(0.0);
	moved *= smoothstep(0.35, 0.7, moved.a) * smoothstep(f.z, f.z + 0.03, s.x) * smoothstep(f.w, f.w - 0.03, s.x);
	float edge = smoothstep(0.03, 0.0, side * (f.y - uv.y));
	return mix(moved, textureGrad(photo, uv, gx, gy), edge);
}
void main() {
	vec2 gx = dFdx(vUv);
	vec2 gy = dFdy(vUv);
	vec4 c;
	if (vUv.x > finR.z && vUv.x < finR.w + 0.06 && vUv.y < finR.y) c = fin(vUv, finR, fins.x, 1.0, gx, gy);
	else if (vUv.x > finL.z && vUv.x < finL.w + 0.06 && vUv.y > finL.y) c = fin(vUv, finL, fins.y, -1.0, gx, gy);
	else c = textureGrad(photo, vUv, gx, gy);
	o = vec4(c.rgb * c.a, c.a) * fade;
}`,q=`#version 300 es
precision highp float;
in vec2 uv;
out vec4 o;
uniform sampler2D sim;
uniform sampler2D fish;
uniform vec2 res;
uniform vec2 simTexel;
uniform vec2 mouse;
uniform float time;
uniform vec2 themes;
uniform vec3 reveal;
uniform float scroll;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
	vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
	float v = 0.0; float a = 0.5;
	for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; }
	return v;
}
float waves(vec2 p) {
	return fbm(p * 0.0045 + vec2(time * 0.025, time * 0.017)) * 0.6 + fbm(p * 0.011 - vec2(time * 0.04, -time * 0.03)) * 0.4;
}
float causticLayer(vec2 p, float t) {
	vec2 q = mod(p * 6.2831, 6.2831) - 250.0;
	vec2 i = q;
	float c = 1.0;
	for (int n = 0; n < 5; n++) {
		float tt = t * (1.0 - 3.5 / float(n + 1));
		i = q + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
		c += 1.0 / length(vec2(q.x / (sin(i.x + tt) / 0.005), q.y / (cos(i.y + tt) / 0.005)));
	}
	c /= 5.0;
	c = 1.17 - pow(c, 1.4);
	return pow(abs(c), 8.0);
}
float caustics(vec2 p) {
	float t = time * 0.4 + 23.0;
	mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
	return causticLayer(p / 420.0, t) * 0.6 + causticLayer(r * p / 290.0, t * 1.13) * 0.5;
}

void main() {
	vec2 px = uv * res;
	float rd = length(px - reveal.xy) - reveal.z;
	float theme = mix(themes.x, themes.y, smoothstep(60.0, -60.0, rd));

	float h = texture(sim, uv).r;
	float hl = texture(sim, uv - vec2(simTexel.x * 1.5, 0.0)).r;
	float hr = texture(sim, uv + vec2(simTexel.x * 1.5, 0.0)).r;
	float hd = texture(sim, uv - vec2(0.0, simTexel.y * 1.5)).r;
	float hu = texture(sim, uv + vec2(0.0, simTexel.y * 1.5)).r;
	float vel = texture(sim, uv).g;
	float lap = hl + hr + hd + hu - 4.0 * h;

	float w0 = waves(px);
	vec2 wg = vec2(waves(px + vec2(2.0, 0.0)) - w0, waves(px + vec2(0.0, 2.0)) - w0);
	vec2 grad = vec2(hr - hl, hu - hd) * 2.2 + wg * 9.0;
	vec3 n = normalize(vec3(-grad, 1.0));

	vec2 bedP = px - vec2(0.0, scroll * 0.35) + n.xy * 46.0;
	float big = fbm(bedP * 0.0021);
	float dunes = sin(dot(bedP, vec2(0.055, 0.022)) + fbm(bedP * 0.008) * 7.0) * 0.5 + 0.5;
	float grain = noise(bedP * 0.9) * 0.6 + noise(bedP * 0.23) * 0.4;
	vec3 sand = vec3(0.93, 0.84, 0.66) * (0.8 + 0.12 * dunes + 0.08 * grain);
	float rock = smoothstep(0.6, 0.78, fbm(bedP * 0.006 + 3.0));
	sand = mix(sand, vec3(0.42, 0.44, 0.38) * (0.8 + grain * 0.3), rock * 0.75);
	float weed = smoothstep(0.62, 0.8, big) * (0.6 + 0.4 * noise(bedP * 0.05 + time * 0.2));
	sand = mix(sand, vec3(0.25, 0.42, 0.28), weed * 0.6);
	float depth = mix(0.45, 1.5, big);

	float c = caustics(bedP + n.xy * 30.0) + max(0.0, -lap) * 60.0;

	vec2 fp = px + n.xy * 22.0;
	vec4 fc = texture(fish, fp / res);
	vec2 sp = fp + vec2(-26.0, 34.0);
	float sh = (
		texture(fish, sp / res).a +
		texture(fish, (sp + vec2(11.0, 7.0)) / res).a + texture(fish, (sp + vec2(-7.0, 11.0)) / res).a +
		texture(fish, (sp + vec2(-11.0, -7.0)) / res).a + texture(fish, (sp + vec2(7.0, -11.0)) / res).a
	) * 0.2;

	vec3 sun = vec3(1.0, 0.97, 0.9);
	vec3 moon = vec3(0.3, 0.4, 0.62) * 0.7;
	float torch = exp(-dot(px - mouse, px - mouse) / 52000.0);
	vec3 light = mix(moon + vec3(1.0, 0.92, 0.75) * torch * 1.6, sun, theme);
	float causticGain = mix(0.25 + torch * 1.2, 1.25, theme);

	vec3 bed = sand * light * (0.7 + c * causticGain) * (1.0 - sh * 0.5);
	vec3 koiLight = mix(vec3(0.66, 0.74, 0.9) + vec3(1.0, 0.92, 0.75) * torch * 0.8, sun, theme);
	vec3 koi = fc.rgb * koiLight * (0.9 + c * causticGain * 0.35);

	vec3 absorb = mix(vec3(0.7, 0.32, 0.2), vec3(0.55, 0.14, 0.09), theme);
	vec3 water = mix(vec3(0.01, 0.05, 0.1), vec3(0.04, 0.42, 0.52), theme);
	vec3 tb = exp(-absorb * depth * 2.0);
	vec3 tf = exp(-absorb * depth * mix(0.25, 0.6, theme));
	vec3 col = (bed * tb + water * (1.0 - tb)) * (1.0 - fc.a) + koi * tf + water * (1.0 - tf) * fc.a;

	vec3 sky = mix(vec3(0.02, 0.05, 0.12), vec3(0.75, 0.9, 1.0), theme);
	col = mix(col, sky, clamp(0.04 + (1.0 - n.z) * 6.0, 0.0, 0.35));

	vec3 ld = normalize(mix(vec3(0.3, 0.45, 0.85), vec3(-0.35, 0.5, 0.8), theme));
	vec3 hv = normalize(ld + vec3(0.0, 0.0, 1.0));
	float spec = pow(max(dot(n, hv), 0.0), mix(700.0, 500.0, theme));
	col += spec * mix(vec3(0.6, 0.75, 1.0) * 0.8, vec3(1.0, 0.98, 0.9) * 2.2, theme);

	float glow = smoothstep(0.003, 0.03, abs(vel)) * step(0.55, noise(px * 0.35 + time * 3.0));
	col += vec3(0.15, 0.85, 1.0) * glow * (1.0 - theme) * 0.9;

	vec2 vq = uv - 0.5;
	col *= 1.0 - dot(vq, vq) * mix(0.9, 0.35, theme);

	float front = exp(-rd * rd / 900.0) * abs(themes.y - themes.x);
	col += vec3(0.75, 0.95, 1.0) * front * 0.35 * (0.6 + 0.4 * noise(px * 0.08 + time));
	o = vec4(col, 1.0);
}`;ft(()=>{const w=matchMedia("(prefers-reduced-motion: reduce)").matches,e=p(c).getContext("webgl2",{antialias:!1,alpha:!1});if(!e){Ge(c,p(c).style.background="linear-gradient(#0b4f6c, #04121e)");return}const P=!!e.getExtension("EXT_color_buffer_float");function V(f,u){const S=e.createProgram();for(const[re,ze]of[[e.VERTEX_SHADER,f],[e.FRAGMENT_SHADER,u]]){const _e=e.createShader(re);e.shaderSource(_e,ze),e.compileShader(_e),e.getShaderParameter(_e,e.COMPILE_STATUS)||console.error(e.getShaderInfoLog(_e)),e.attachShader(S,_e)}e.linkProgram(S),e.getProgramParameter(S,e.LINK_STATUS)||console.error(e.getProgramInfoLog(S));const me={};return{p:S,u:re=>(re in me||(me[re]=e.getUniformLocation(S,re)),me[re])}}const X=V(h,g),N=V(h,y),J=V(h,q),z=V(L,G),H=e.createVertexArray();e.bindVertexArray(H),e.bindBuffer(e.ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0);const ne=e.createVertexArray();e.bindVertexArray(ne);const fe=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,fe),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,16,0),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,2,e.FLOAT,!1,16,8),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ELEMENT_ARRAY_BUFFER,vt,e.STATIC_DRAW),e.bindVertexArray(null);const be=["/koi/kohaku.png","/koi/ogon.png"].map(f=>{const u={tex:e.createTexture(),aspect:0},S=new Image;return S.onload=()=>{b(u.tex,!0),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,S),e.generateMipmap(e.TEXTURE_2D),u.aspect=S.height/S.width,w&&_(4e3)},S.src=f,u});let I=0,k=0,K=1,oe=1,n=[];const o=e.createTexture(),d=e.createFramebuffer();function b(f,u){e.bindTexture(e.TEXTURE_2D,f),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,u?e.LINEAR_MIPMAP_LINEAR:e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}function A(){const f=e.createTexture();b(f,!1),e.texImage2D(e.TEXTURE_2D,0,e.RGBA16F,K,oe,0,e.RGBA,e.HALF_FLOAT,null);const u=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,u),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,f,0),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),{tex:f,fb:u}}function B(){I=innerWidth,k=innerHeight,Ge(c,p(c).width=I),Ge(c,p(c).height=k),K=Math.ceil(I/4),oe=Math.ceil(k/4);for(const f of n)e.deleteTexture(f.tex),e.deleteFramebuffer(f.fb);n=P?[A(),A()]:[],b(o,!1),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,I,k,0,e.RGBA,e.UNSIGNED_BYTE,null),e.bindFramebuffer(e.FRAMEBUFFER,d),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,o,0)}B();const U=ra(I,k),E={px:-1e4,py:-1e4,pspeed:0},ce=new Float32Array(ia);function le(f){e.bindFramebuffer(e.FRAMEBUFFER,n[1].fb),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,n[0].tex),e.uniform1i(f.u("state"),0),e.drawArrays(e.TRIANGLES,0,3),n.reverse()}function ye(){if(P){if(e.bindVertexArray(H),e.viewport(0,0,K,oe),l.length){e.useProgram(X.p);const f=new Float32Array(64);l.forEach(([u,S,me,Te],re)=>f.set([u/I,1-S/k,me/4,Te],re*4)),e.uniform4fv(X.u("drops"),f),e.uniform1i(X.u("count"),l.length),e.uniform2f(X.u("size"),K,oe),le(X),l=[]}e.useProgram(N.p),e.uniform2f(N.u("texel"),1/K,1/oe),le(N)}}function Y(){e.bindFramebuffer(e.FRAMEBUFFER,d),e.viewport(0,0,I,k),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA),e.useProgram(z.p),e.uniform2f(z.u("res"),I,k),e.uniform1i(z.u("photo"),0),e.activeTexture(e.TEXTURE0),e.bindVertexArray(ne),e.bindBuffer(e.ARRAY_BUFFER,fe);for(const f of U){const u=be[f.variety];u.aspect&&(e.bindTexture(e.TEXTURE_2D,u.tex),e.uniform1f(z.u("fade"),1-f.depth*.2),e.uniform1f(z.u("aspect"),u.aspect),e.uniform2f(z.u("fins"),f.fins[0],f.fins[1]),e.uniform4fv(z.u("finR"),it[f.variety][0]),e.uniform4fv(z.u("finL"),it[f.variety][1]),e.bufferData(e.ARRAY_BUFFER,ca(f,u.aspect,ce),e.DYNAMIC_DRAW),e.drawElements(e.TRIANGLES,vt.length,e.UNSIGNED_SHORT,0))}e.disable(e.BLEND),e.bindVertexArray(null)}function _(f){Y(),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,I,k),e.bindVertexArray(H),e.useProgram(J.p);const u=J.u;e.activeTexture(e.TEXTURE0),P&&e.bindTexture(e.TEXTURE_2D,n[0].tex),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,o),e.uniform1i(u("sim"),0),e.uniform1i(u("fish"),1),e.uniform2f(u("res"),I,k),e.uniform2f(u("simTexel"),1/K,1/oe),e.uniform2f(u("mouse"),E.px,k-E.py),e.uniform1f(u("time"),f/1e3);const S=Math.min(1,(performance.now()-i.start)/s);S>=1&&(v=t);const me=1-Math.pow(1-S,3),Te=Math.hypot(Math.max(i.x,I-i.x),Math.max(i.y,k-i.y));e.uniform2f(u("themes"),v,t),e.uniform3f(u("reveal"),i.x,k-i.y,me*(Te+120)),e.uniform1f(u("scroll"),scrollY),e.drawArrays(e.TRIANGLES,0,3)}function W(){B(),w&&_(4e3)}if(addEventListener("resize",W,{passive:!0}),w){for(let S=0;S<30;S++)lt(U,S/10,.1,E,I,k);_(4e3);let f=t;const u=setInterval(()=>{f!==t&&(f=v=t,_(4e3))},100);return()=>{clearInterval(u),removeEventListener("resize",W)}}function R(f){const u=Math.hypot(f.clientX-E.px,f.clientY-E.py);u<500&&(E.pspeed=Math.max(E.pspeed,u)),E.px=f.clientX,E.py=f.clientY}function Q(f){E.px=f.clientX,E.py=f.clientY,E.pspeed=Math.max(E.pspeed,1),m(f.clientX,f.clientY,22,.6)}addEventListener("pointermove",R,{passive:!0}),addEventListener("pointerdown",Q,{passive:!0});let te=0,pe=performance.now(),he=0;function Ee(f){const u=Math.min(.05,(f-pe)/1e3);for(pe=f,E.pspeed*=Math.exp(-u*10),lt(U,f/1e3,u,E,I,k),he=Math.min(he+u*120,4);he>=1;)ye(),he--;_(f),te=requestAnimationFrame(Ee)}return te=requestAnimationFrame(Ee),()=>{cancelAnimationFrame(te),removeEventListener("resize",W),removeEventListener("pointermove",R),removeEventListener("pointerdown",Q)}}),Yt();var F=la();return De(F,w=>Be(c,w),()=>p(c)),j(a,F),He(r,"REVEAL_MS",s),He(r,"splash",m),He(r,"setTheme",x),ut({REVEAL_MS:s,splash:m,setTheme:x})}var fa=Ne('<line x1="12" y1="2.5" x2="12" y2="5" class="svelte-p7sqqf"></line>'),ma=(a,r,s)=>r(s,a),da=ie('<button class="floater absolute top-0 left-0 svelte-p7sqqf"><svg class="h-6 w-6 svelte-p7sqqf" viewBox="0 0 24 24" aria-hidden="true"><path class="svelte-p7sqqf"></path></svg></button>'),pa=()=>document.getElementById("list")?.scrollIntoView({behavior:"smooth"}),ha=(a,r)=>r(null,a),ua=(a,r,s)=>r(s,a),xa=Ne('<svg class="h-3.5 w-3.5 svelte-p7sqqf" viewBox="0 0 24 24" aria-hidden="true"><path class="svelte-p7sqqf"></path></svg>'),ga=ie("<button><!> </button>"),ya=ie('<img alt="" class="h-7 w-7 object-contain svelte-p7sqqf" loading="lazy"/>'),_a=Ne('<svg class="h-6 w-6 svelte-p7sqqf" viewBox="0 0 24 24" aria-hidden="true"><path class="svelte-p7sqqf"></path></svg>'),ba=ie('<span class="text-sm font-bold text-white svelte-p7sqqf"> </span>'),Ea=ie('<span class="muted text-xs svelte-p7sqqf"> </span>'),Ta=(a,r,s)=>r(s,a),qa=Ne('<svg class="h-3 w-3 svelte-p7sqqf" viewBox="0 0 24 24" aria-hidden="true"><path class="svelte-p7sqqf"></path></svg>'),Ma=ie('<button class="pill svelte-p7sqqf"><!> </button>'),wa=ie('<a target="_blank" rel="noopener noreferrer" data-umami-event="project-source" class="link-secondary svelte-p7sqqf">Source ↗</a>'),Aa=ie('<div class="svelte-p7sqqf"><div class="bob h-full svelte-p7sqqf"><article class="card group h-full svelte-p7sqqf"><div class="card-glow svelte-p7sqqf" aria-hidden="true"></div> <div class="relative flex items-center gap-3 svelte-p7sqqf"><div class="logo svelte-p7sqqf"><!></div> <h3 class="heading flex-1 font-semibold svelte-p7sqqf"> </h3> <!></div> <p class="body relative mt-3 text-sm leading-relaxed svelte-p7sqqf"> </p> <div class="relative mt-4 flex flex-wrap gap-1.5 svelte-p7sqqf"></div> <div class="relative mt-auto flex gap-3 pt-5 text-sm svelte-p7sqqf"><a target="_blank" rel="noopener noreferrer" data-umami-event="project" class="link-primary svelte-p7sqqf"> </a> <!></div></article></div></div>'),Ra=ie('<section class="mt-16 svelte-p7sqqf"><div class="flex items-baseline gap-4 svelte-p7sqqf"><span class="number svelte-p7sqqf"> </span> <div class="svelte-p7sqqf"><h2 class="heading text-2xl font-bold svelte-p7sqqf"> </h2> <p class="muted mt-0.5 text-sm svelte-p7sqqf"> </p></div></div> <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 svelte-p7sqqf"></div></section>'),Fa=ie('<!> <!> <button class="glass toggle fixed top-6 right-6 z-40 grid h-11 w-11 place-items-center rounded-full svelte-p7sqqf"><svg class="icon sun svelte-p7sqqf" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5" class="svelte-p7sqqf"></circle><!></svg> <svg class="icon moon svelte-p7sqqf" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" class="svelte-p7sqqf"></path></svg></button> <section class="relative z-20 h-[100svh] min-h-[560px] overflow-hidden svelte-p7sqqf"><a href="https://ferjani.dev" class="glass absolute top-6 left-6 rounded-full px-4 py-2 text-sm svelte-p7sqqf" data-umami-event="projects-back">← ferjani.dev</a> <!> <div class="pointer-events-none absolute inset-x-0 top-[40svh] -translate-y-1/2 px-6 text-center svelte-p7sqqf"><h1 class="title svelte-p7sqqf">Projects</h1> <p class="tagline mt-4 text-base md:text-lg svelte-p7sqqf">Side projects, libraries and experiments by Khaled Ferjani.</p></div> <button class="dive muted absolute bottom-8 left-1/2 -translate-x-1/2 text-xl svelte-p7sqqf" aria-label="Scroll to projects">↓</button></section> <main id="list" class="relative z-20 mx-auto max-w-6xl scroll-mt-4 px-6 pb-24 md:px-10 svelte-p7sqqf"><nav class="glass sticky top-4 z-30 flex flex-wrap gap-1.5 rounded-2xl p-2 svelte-p7sqqf" aria-label="Filter by technology"><button>All</button> <!></nav> <!> <p class="mt-24 text-center text-sm svelte-p7sqqf"><a href="https://ferjani.dev" class="muted hover-strong svelte-p7sqqf">Back to ferjani.dev</a></p> <p class="muted mt-6 text-center text-xs svelte-p7sqqf">Koi photos by <a class="hover-strong underline svelte-p7sqqf" href="https://commons.wikimedia.org/wiki/File:Kohaku_nishikigoi_Konishi_Koi_Farm_Martin_Kammerer_ID7185-.jpg">Martin Kammerer</a> (<a class="hover-strong underline svelte-p7sqqf" href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>) and <a class="hover-strong underline svelte-p7sqqf" href="https://commons.wikimedia.org/wiki/File:Yamabuki_Ogon.JPG">Fehlwort</a> (<a class="hover-strong underline svelte-p7sqqf" href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a>), background removed.</p></main>',1);function za(a,r){ht(r,!0);const s={Dojo:"/logos/dojo.svg","Claude Agents Indicator":"/logos/claude-agents-indicator.svg",tuxmedic:Vt,Vetixa:"/logos/vetixa.svg","Eat Explained":"/logos/eat-explained.png"},c=at.flatMap(n=>n.items),l=[...new Set(c.flatMap(n=>n.tech))].sort((n,o)=>+(o in ae)-+(n in ae)||n.localeCompare(o)),v=l.filter(n=>n in ae&&n!=="Svelte 5"&&n!=="Svelte"),t="<script>try{var t=localStorage.getItem('projects-theme')||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.dataset.theme=t}catch(e){}<\/script>";let i,m,x=Nt([]),h=Qe(null),g=Qe("dark");const y=tt(()=>at.map(n=>({...n,items:p(h)?n.items.filter(o=>o.tech.includes(p(h))):n.items})).filter(n=>n.items.length));function L(n){return s[n.name]??ae[n.tech[0]]??""}function G(n){let o=0;for(const d of n)o=(o*31+d.charCodeAt(0))%360;return o}async function q(n,o){Be(h,p(h)===n?null:n,!0),o&&i?.splash(o.clientX,o.clientY,30,.7),n&&window.umami?.track("projects-filter",{tech:n}),await Xt(),document.getElementById("list")?.scrollIntoView({behavior:"smooth",block:"start"})}function F(n){const o=p(g)==="dark"?"light":"dark",d=matchMedia("(prefers-reduced-motion: reduce)").matches;Be(g,o,!0),document.documentElement.dataset.theme=o,localStorage.setItem("projects-theme",o),i?.setTheme(o==="light",d,n.clientX,n.clientY),i?.splash(n.clientX,n.clientY,70,1.4),window.umami?.track("projects-theme",{theme:o})}function w(n){function o(b){const A=n.getBoundingClientRect(),B=(b.clientX-A.left)/A.width,U=(b.clientY-A.top)/A.height;n.style.setProperty("--mx",`${B*100}%`),n.style.setProperty("--my",`${U*100}%`),n.style.setProperty("--rx",`${(.5-U)*10}deg`),n.style.setProperty("--ry",`${(B-.5)*12}deg`)}function d(){n.style.setProperty("--rx","0deg"),n.style.setProperty("--ry","0deg")}return n.addEventListener("pointermove",o),n.addEventListener("pointerleave",d),{destroy(){n.removeEventListener("pointermove",o),n.removeEventListener("pointerleave",d)}}}ft(()=>{Be(g,document.documentElement.dataset.theme==="light"?"light":"dark",!0),i?.setTheme(p(g)==="light",!0),requestAnimationFrame(()=>document.documentElement.classList.add("theme-ready"));const n=matchMedia("(prefers-reduced-motion: reduce)").matches;let o=m.clientWidth,d=m.clientHeight,b=-9999,A=-9999;const B=v.map((Y,_)=>{const W=_/v.length*Math.PI*2+Math.random()*.3,R=.38+Math.random()*.08,Q=.32+Math.random()*.1;return{hx:.5+Math.cos(W)*R,hy:.42+Math.sin(W)*Q,x:o/2,y:d*.42,vx:(Math.random()-.5)*30,vy:(Math.random()-.5)*30,phase:Math.random()*Math.PI*2}});function U(Y){B.forEach((_,W)=>{const R=x[W];if(!R)return;const Q=Math.sin(Y/900+_.phase)*5;R.style.transform=`translate(${_.x-22}px, ${_.y-22+Q}px) rotate(${_.vx*3+Math.sin(Y/1300+_.phase)*6}deg)`})}if(n){for(const Y of B)Y.x=Y.hx*o,Y.y=Y.hy*d;U(0);return}function E(Y){const _=m.getBoundingClientRect();b=Y.clientX-_.left,A=Y.clientY-_.top}function ce(){o=m.clientWidth,d=m.clientHeight}addEventListener("pointermove",E,{passive:!0}),addEventListener("resize",ce,{passive:!0});let le=0;function ye(Y){for(const _ of B){_.vx+=(_.hx*o-_.x)*.012,_.vy+=(_.hy*d-_.y)*.012;const W=_.x-b,R=_.y-A,Q=Math.hypot(W,R)||1;if(Q<150){const te=(150-Q)/150*2.2;_.vx+=W/Q*te,_.vy+=R/Q*te}_.vx*=.9,_.vy*=.9,_.x+=_.vx,_.y+=_.vy}U(Y),le=requestAnimationFrame(ye)}return le=requestAnimationFrame(ye),()=>{cancelAnimationFrame(le),removeEventListener("pointermove",E),removeEventListener("resize",ce)}});var e=Fa();zt(n=>{var o=Je(),d=Ve(o);Gt(d,()=>t),j(n,o)});var P=Ve(e);$t(P,{title:"Khaled Ferjani · Projects",description:"Side projects by Khaled Ferjani: Dojo, Claude Agents Indicator, tuxmedic, Vetixa and more, plus libraries and framework experiments.",path:"/",origin:"https://projects.ferjani.dev"});var V=C(P,2);De(va(V,{}),n=>i=n,()=>i);var X=C(V,2);X.__click=F;var N=M(X),J=C(M(N));Me(J,16,()=>Array.from({length:8},(n,o)=>o*45),n=>n,(n,o)=>{var d=fa();ee(()=>$(d,"transform",`rotate(${o??""} 12 12)`)),j(n,d)}),T(N),et(2),T(X);var z=C(X,2),H=C(M(z),2);Me(H,18,()=>v,n=>n,(n,o,d)=>{var b=da();b.__click=[ma,q,o];var A=M(b),B=M(A);T(A),T(b),De(b,(U,E)=>x[E]=U,U=>x?.[U],()=>[p(d)]),ee((U,E)=>{$(b,"title",o),$(b,"aria-label",`Show ${o??""} projects`),Ye(b,`--c: ${U??""}`),$(A,"fill",E),$(B,"d",ae[o].path)},[()=>Ue(ae[o].hex),()=>Ue(ae[o].hex)]),j(n,b)});var ne=C(H,2),fe=C(ne,2);fe.__click=[pa],T(z),De(z,n=>m=n,()=>m);var be=C(z,2),I=M(be),k=M(I);k.__click=[ha,q];var K=C(k,2);Me(K,16,()=>l,n=>n,(n,o)=>{var d=ga();d.__click=[ua,q,o];var b=M(d);{var A=U=>{var E=xa(),ce=M(E);T(E),ee(le=>{$(E,"fill",le),$(ce,"d",ae[o].path)},[()=>Ue(ae[o].hex)]),j(U,E)};qe(b,U=>{ae[o]&&U(A)})}var B=C(b);T(d),ee(()=>{rt(d,1,`chip ${p(h)===o?"chip-on":""}`,"svelte-p7sqqf"),$(d,"aria-pressed",p(h)===o),ve(B,` ${o??""}`)}),j(n,d)}),T(I);var oe=C(I,2);Me(oe,19,()=>p(y),n=>n.title,(n,o,d)=>{var b=Ra(),A=M(b),B=M(A),U=M(B);T(B);var E=C(B,2),ce=M(E),le=M(ce,!0);T(ce);var ye=C(ce,2),Y=M(ye,!0);T(ye),T(E),T(A);var _=C(A,2);Me(_,31,()=>p(o).items,W=>W.name,(W,R,Q)=>{const te=tt(()=>L(p(R)));var pe=Aa(),he=M(pe),Ee=M(he),f=C(M(Ee),2),u=M(f),S=M(u);{var me=D=>{var O=ya();ee(()=>$(O,"src",p(te))),j(D,O)},Te=D=>{var O=Je(),ue=Ve(O);{var Pe=xe=>{var se=_a(),ge=M(se);T(se),ee(Re=>{$(se,"fill",Re),$(ge,"d",p(te).path)},[()=>Ue(p(te).hex)]),j(xe,se)},$e=xe=>{var se=ba(),ge=M(se,!0);T(se),ee(Re=>ve(ge,Re),[()=>p(R).name.slice(0,2)]),j(xe,se)};qe(ue,xe=>{typeof p(te)=="object"?xe(Pe):xe($e,!1)},!0)}j(D,O)};qe(S,D=>{typeof p(te)=="string"&&p(te)?D(me):D(Te,!1)})}T(u);var re=C(u,2),ze=M(re,!0);T(re);var _e=C(re,2);{var yt=D=>{var O=Ea(),ue=M(O,!0);T(O),ee(()=>ve(ue,p(R).year)),j(D,O)};qe(_e,D=>{p(R).year&&D(yt)})}T(f);var Xe=C(f,2),_t=M(Xe,!0);T(Xe);var Oe=C(Xe,2);Me(Oe,20,()=>p(R).tech,D=>D,(D,O)=>{var ue=Ma();ue.__click=[Ta,q,O];var Pe=M(ue);{var $e=se=>{var ge=qa(),Re=M(ge);T(ge),ee(qt=>{$(ge,"fill",qt),$(Re,"d",ae[O].path)},[()=>Ue(ae[O].hex)]),j(se,ge)};qe(Pe,se=>{ae[O]&&se($e)})}var xe=C(Pe);T(ue),ee(()=>ve(xe,` ${O??""}`)),j(D,ue)}),T(Oe);var Ze=C(Oe,2),Ae=M(Ze),bt=M(Ae);T(Ae);var Et=C(Ae,2);{var Tt=D=>{var O=wa();ee(()=>{$(O,"href",p(R).repo),$(O,"data-umami-event-name",p(R).name)}),j(D,O)};qe(Et,D=>{p(R).repo&&D(Tt)})}T(Ze),T(Ee),jt(Ee,D=>w?.(D)),T(he),T(pe),ee(D=>{Ye(he,`animation-delay: ${-p(Q)*1.3}s`),Ye(u,`--h: ${D??""}`),ve(ze,p(R).name),ve(_t,p(R).description),$(Ae,"href",p(R).url),$(Ae,"data-umami-event-name",p(R).name),ve(bt,`${p(R).repo?"Visit":"GitHub"} ↗`)},[()=>G(p(R).name)]),Jt(pe,()=>ea,()=>({duration:450})),je(1,pe,()=>ot,()=>({start:.85,duration:450,delay:p(Q)*70})),j(W,pe)}),T(_),T(b),ee(()=>{ve(U,`0${p(d)+1}`),ve(le,p(o).title),ve(Y,p(o).intro)}),je(3,b,()=>ot,()=>({start:.98,duration:250})),j(n,b)}),et(4),T(be),ee(()=>{$(X,"aria-label",`Switch to ${p(g)==="dark"?"light":"dark"} theme`),rt(k,1,`chip ${p(h)===null?"chip-on":""}`,"svelte-p7sqqf"),$(k,"aria-pressed",p(h)===null)}),je(1,ne,()=>aa,()=>({y:24,duration:1e3,delay:200})),j(a,e),ut()}Ct(["click"]);export{za as component};

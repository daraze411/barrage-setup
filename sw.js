const CACHE="barrage-setup-v20261106-4";
const ASSETS=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("barrage-setup-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET")return;
  if(r.mode==="navigate"){e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put("./index.html",c));return res}).catch(()=>caches.match("./index.html")));return}
  const u=new URL(r.url);
  if(u.origin===location.origin||u.hostname.endsWith("fonts.googleapis.com")||u.hostname.endsWith("fonts.gstatic.com")){
    e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok||res.type==="opaque"){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c))}return res})));
  }
});

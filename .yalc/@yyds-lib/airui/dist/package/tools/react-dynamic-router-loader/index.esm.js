const e=require("path"),t=require("fs"),n=require("crypto"),{getOptions:r}=require("loader-utils");let s=[];function i(e,t){return`${e}_${n.createHash("md5").update(t).digest("hex")}`}function o(...t){let n="";for(const r of[...new Set(t)].flat())n=e.resolve(n,r);return n.replace(/\\/g,"\\\\")}function c(e){return e.slice(e.lastIndexOf("/")+1)}function l(e){let n=e.slice(0,e.lastIndexOf("/"));return t.existsSync(o([...n,"index.(j|t)sx"]))?`parent: '${o([...n,"index.(j|t)sx"])}', \n`:t.existsSync(o([...n,"layout.(j|t)sx"]))?`parent: '${o([...n,"layout.(j|t)sx"])}', \n`:""}function p(e,t){return`component: () => import(/* webpackPrefetch: true, webpackChunkName: '${t}-index' */ "${e}"), \n`}function a(e){return`config: typeof ${e} === 'function' ? ${e}() : ${e}, \n`}function u(e){return`context: ${e}, \n`}function f(e,t){return`layout: () => import(/* webpackPrefetch: true, webpackChunkName: '${t}-layout' */ "${e}"), \n`}function $(e,t,n){let r=e.split("/").slice(-t);r.pop();return`path: '${n("/"+r.join("/"))}', \n`}function x({isIgnore:n,replace:r},g,h=1){let y=`{level: ${h}, \n`,d="";if(t.statSync(g).isDirectory()){let j=t.readdirSync(g),m=JSON.parse(JSON.stringify(j)),S=!1,O=!1;for(;j.length;){let m=j.shift(),k=o(t.realpathSync(g),m),w=`${t.realpathSync(g)}/${m}`,N=c(g);if("/"!==e.sep&&(w=w.replace(/\\/g,"/").slice(2)),!n(k))if(t.statSync(k).isDirectory()&&!/components$/.test(m))d+=x({isIgnore:n,replace:r},k,h+1)+", \n";else if(/index\.(j|t)sx$/.test(m))!O&&(y+=`name: '${N}', \n`),!S&&(y+=$(w,h,r)),y+=l(g),y+=p(k,N),O=!0,S=!0;else if(/_config\.(js|ts|(j|t)sx)$/.test(m)){let e=i("config",k);s.push(`import ${e} from '${k}'`),y+=a(e)}else if(/layout\.(j|t)sx$/.test(m))!O&&(y+=`name: '${N}', \n`),!S&&(y+=$(w,h,r)),y+=f(k,N),O=!0,S=!0;else if(/_context\.(j|t)sx$/.test(m)){let e=i("context",k);s.push(`import ${e} from '${k}'`),y+=u(e)}}y+=`children: [${d}], \n`,y+=`id: '${i("",g)}',}`,m.some((e=>/\.(j|t)sx$/g.test(e)))||(y=d.replace(/level: (\d)/g,(function(e,t){return"level: "+(t-1)})).replace(/^\[/,(function(){return""})).replace(/\]$/,(function(){return""})))}return y}module.exports=function(t){const n=this?.getOptions()||r(this)||{};s=[];let i=t;try{i=JSON.parse(i),i.replace=Object.keys(i.replace).reduce(((t,n)=>(t[n.split("/").join(e.sep)]=i.replace[n].split("/").join(e.sep),t)),{}),i.ignore=i.ignore.map((t=>t.split("/").join(e.sep)))}catch(e){console.log(e)}const o=n.pagesPath||e.resolve(this.context,"..","pages");let c=x(function(e){return{isIgnore:t=>!!e.ignore.some((e=>new RegExp(e).test(t))),replace:t=>e.replace[t]||t}}(i),o).slice(0,-1)+"\n}";c=`export const pageRouter = ${c}\nexport const pageConfig = ${JSON.stringify(i)}`;let l=s.join?s.join(";"):"";this.addContextDependency(this.context),this.addDependency(this.context);const p=this.async();(async()=>{p(null,`${l};\n${c}`)})()};

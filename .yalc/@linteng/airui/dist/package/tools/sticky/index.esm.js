var e=function(e,t={}){const{offsetTop:o,style:s={}}=t,c=Object.keys(s).reduce(((e,t)=>(e[t]="",e)),{});window.addEventListener("scroll",(()=>{(document.body.scrollTop||document.documentElement.scrollTop)>=o?Object.assign(e.style,s):Object.assign(e.style,c)}))};export{e as default};

"use strict";import"../icon-wc/index.js";import router from"../../tools/router/index.esm.js";const skins={1:"air-green",2:"air-blue",3:"air-pine",4:"air-darkGreen",5:"air-yellow",6:"air-purple"},routeMode={hash:"hash",browser:"pathname"};function setClass(t,r,e){findEl(t,r,function(e){-1<e.className.indexOf("tree-li-childs")&&("child"===t?(e.className="tree-li tree-li-childs tree-li-hide",findEl("parent",r,function(e){e.className})):"parent"===t&&(e.className="tree-li tree-li-childs tree-li-show"))})}function findEl(e,t,r){for(;"parent"===e&&t.parentElement;)r&&r(t),t=t.parentElement;for(;"child"===e&&t.lastElementChild;)r&&r(t),t=t.lastElementChild}function tagReg(e){return["div","a","p","span","section","Link"].includes(e)}function setParentClass(e){if(console.log({target:e}),e.parentElement){const t=e.parentElement.className;/tree-li-hide/.test(t)&&(e.parentElement.className=t.replace(/tree-li-hide/,"tree-li-show"),console.log({className:e.parentElement.className})),"air-ui-tree-container"!==t&&setParentClass(e.parentElement)}}function pickMenuItem(e,t,r){var i,a=[...new Set(e.__DOM__.querySelectorAll(".tree-childs-btn"))],e=[...new Set(e.__DOM__.querySelectorAll(".tree-btn"))];for(i of[...a,...e])t===i[routeMode[r]]?(i.style.background="#D34017",i.style.color="#fff",setParentClass(i)):(i.style.background="",i.style.color="")}function createHref(e,t){return"javascript:;"!==e&&"hash"===t?"#"+e:e}function createATag(t,r,i){return e=>`<${t} class="tree-btn tree-childs-btn ${e}" href="${r}">${i}</${t}>`}export default class Tree extends HTMLElement{static get observedAttributes(){return["data","color","freestyle"]}constructor(e){super(e),Object.defineProperty(this,"root",{value:this.attachShadow({mode:"open"}),writable:!0,enumerable:!1,configurable:!0}),Object.defineProperty(this,"props",{value:{data:[],color:"#b7b7b7",freestyle:{}},writable:!0,enumerable:!1,configurable:!0}),this.root.innerHTML='<style>* { margin: 0; padding: 0; box-sizing: border-box; } a { text-decoration: none; } a:focus { outline: none; } .air-ui-tree-container { height: 100%; width: inherit; min-width: 220px; max-width: 300px; padding: 10px; background: #1B1521; color: #fff; } .air-ui-tree-container .air-ui-tree { height: 100%; } .air-ui-tree-container .air-ui-tree ol, .air-ui-tree-container .air-ui-tree ul { list-style: none; } .air-ui-tree-container .air-ui-tree .tree-ul .tree-li { overflow: hidden; transition: 0.4s; cursor: pointer; } .air-ui-tree-container .air-ui-tree .tree-ul .tree-li .tree-btn { display: block; height: 30px; line-height: 30px; transition: 0.4s; padding: 0 5px; color: inherit; text-overflow: ellipsis; overflow: hidden; } .air-ui-tree-container .air-ui-tree .tree-ul .tree-li .tree-btn:hover { padding-left: 10px; background: #D34017; color: #fff; } .air-ui-tree-container .air-ui-tree .tree-ul .tree-li .tree-childs-btn { margin: 5px 0; } .air-ui-tree-container .air-ui-tree .tree-ul .tree-li-childs { padding-left: 10px; } .air-ui-tree-container .air-ui-tree .tree-ul .tree-li-show { margin-top: 5px; } .air-ui-tree-container .air-ui-tree .tree-ul .tree-li-hide { height: 0; } </style> <div class="air-ui-tree-container"> <div class="air-ui-tree"></div>  </div> ',this.__ELM__=Array.from(this.root.children),this.__DOM__=this.__ELM__[1],this?.__REGIESTRYCONFIG__();var t={};try{for(var r of Object.keys(t))this[r]=t[r]}catch(e){}}async connectedCallback(){let s=this,{__WCCONFIG__:o={},__BASECONFIG__:c={}}=(console.log(s,786686),this);const{mode:h="browser"}=o;setTimeout(()=>{pickMenuItem(s,location[routeMode[h]],h)},0),void 0!==window.history&&router.on("*",e=>{pickMenuItem(s,e.target.location[routeMode[h]],h)}),this.__DOM__.setAttribute("style",`color: ${this.props.color};`),this.__DOM__.addEventListener("click",function(r){var e=r.target;let{nodeName:t,className:i,parentElement:a,pathname:n}=e;var l=a.nextElementSibling;if("LI"===t&&"tree-li-head"===i||a&&-1<a.className.indexOf("tree-li-head")){if(l){s.dispatchEvent(new CustomEvent("tree_wc_select",{detail:r}));let{className:e,childElementCount:t}=l;-1<e.indexOf("tree-li-show")?setClass("child",l,30*t+15):setClass("parent",l,30*t+15)}}else-1<i.indexOf("tree-childs-btn")&&pickMenuItem(s,n,h);"A"===t&&"react"===c?.framework&&"browser"===o?.mode&&(r.preventDefault(),"javascript:;"!==e.href&&e.pathname&&o?.history?.push(e.pathname))},!1),this.__DOM__.children[0].innerHTML=this._render(this.props.data)}disconnectedCallback(){console.log("unmount")}attributeChangedCallback(e,t,r){switch(e){case"skin":this.__DOM__.setAttribute("class","air-ui-tree "+(skins[r]||skins[1]));break;case"data":this.props.data=JSON.parse(r),this.__DOM__.children[0].innerHTML=this._render(this.props.data);break;case"color":this.props.color=r;break;case"freestyle":this.props.freestyle=r}}adoptedCallback(){console.log("adopted")}_render(e,t=[],r=""){let i=1;var a,n,{__WCCONFIG__:l={}}=this;for([a,n]of e.entries()){var s=tagReg(n.tag)?n.tag:"a",o=n.path?`${"javascript:;"===r?"":r}/`+n.path:"javascript:;";const c=createATag(s,createHref(o,l?.mode),n.title);n.childs&&n.childs.length?(t.push(`<ul class="tree-ul"> <li class="tree-li tree-li-head"> ${c()} </li><li class="tree-li tree-li-childs tree-li-hide">`),this._render(n.childs,t,o),i++):a===e.length-1?(t.push(c("tree-childs-btn")+"</li></ul>".repeat(i)),i=1):t.push(c("tree-childs-btn"))}return 1===e.length&&(t.unshift('<ul class="tree-ul"> <li class="tree-li tree-li-head">'),t.push("</li></ul>")),t.join("")}_calculate(e,t){}}
"use strict";import"../icon-wc/index.js";const skins={1:"pages-green",2:"pages-blue",3:"pages-pine",4:"pages-darkGreen",5:"pages-yellow",6:"pages-purple"};class Page extends HTMLElement{static get observedAttributes(){return["max","total","skin","showJumpBtn","curr"]}constructor(e){super(e),Object.defineProperty(this,"root",{value:this.attachShadow({mode:"open"}),writable:!0,enumerable:!1,configurable:!0}),Object.defineProperty(this,"props",{value:{max:6,total:100,skin:1,showJumpBtn:!1,curr:1},writable:!0,enumerable:!1,configurable:!0}),this.root.innerHTML='<style>* { margin: 0; padding: 0; box-sizing: border-box; } a { text-decoration: none; } a:focus { outline: none; } </style> <div class="do-ui-table"> <ul class="do-fn-cl table-thead"> <li class="table-tr"> </li> </ul> <ul class="do-fn-cl table-tbody"> <li class="table-tr"> <section> <span class="do-fn-ell"> </span> </section> </li> </ul> <ul class="do-fn-cl table-tbody" style="text-align:center;"> <li class="table-tr table-no-data">暂无列表数据</li> </ul> </div> ',this.__ELM__=Array.from(this.root.children),this.__DOM__=this.__ELM__[1],this?.__REGIESTRYCONFIG__();var t={__PAGE__:this.__DOM__.children[1]};try{for(var s of Object.keys(t))this[s]=t[s]}catch(e){}}async connectedCallback(){let r=this;this.__DOM__.addEventListener("click",function(e){let t=r.props.curr;var{nodeName:e,type:s,innerHTML:a,className:l}=e=e.target;if("ICON-WC"===e){switch(s){case"left":t--;break;case"right":t++}r._jump(t)}else"SPAN"===e&&"..."!==a&&(0<parseInt(a)&&(t=parseInt(a)),"ui-page-prev"===l&&t--,"ui-page-next"===l&&t++,r._jump(t));r.dispatchEvent(new CustomEvent("select",{detail:t}))}),this._render(1)}disconnectedCallback(){console.log("unmount")}attributeChangedCallback(e,t,s){switch(e){case"curr":this._render(s);break;case"total":this._render(1);break;case"skin":this.__DOM__.setAttribute("class","wc-ui-pages "+(skins[s]||skins[1]))}}adoptedCallback(){console.log("adopted")}_render(s){let e=this._calculate(s);var{total:t,max:a}=this.props;let l=e.map((e,t)=>`<span class="ui-page ${s===e?"pages-active":""}">
          ${e}
        </span>`);var r='<span class="ui-page ui-page-more">...</span>';a<t&&(2!==e[1]&&l.splice(1,0,r),e[a-2]!==t-1&&l.splice(l.length-1,0,r)),this.__PAGE__.innerHTML=l.join("")}_calculate(a){var{max:l,total:e}=this.props,r=Math.floor(l/2);a=(r=e-a<r&&l<=e?e-(l-1):0<a-r&&l<=e?a-r:1)+(l-1)<e?l-1+r:e;let i=[];for(let e=0,t=r,s=a;e<l;e++,t++)t<=s&&(i[e]=t);return i[l-1]!==e&&(i[l-1]=e),1!==i[0]&&(i[0]=1),i}_jump(e){if(e<=0||e>this.props.total)return console.log("超过跳转范围");this.props.curr=e,this._render(e)}}
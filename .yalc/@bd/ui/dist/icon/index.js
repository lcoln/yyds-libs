import { css, svg, html, Component } from "@bd/core";
import SVG_DICT from "./svg.js";
let dict = SVG_DICT;
if (window.EXT_SVG_DICT) {
  Object.assign(dict, EXT_SVG_DICT);
}
class Icon extends Component {
  static props = {
    name: {
      type: String,
      default: null,
      observer(val) {
        if (val === "") {
          this.name = null;
        }
      }
    }
  };
  static styles = css`:host{display:inline-flex;width:var(--size, 32px);height:var(--size, 32px)}:host(:not([name])){display:none}.icon{display:block;width:100%;height:100%;color:inherit;fill:currentColor}.icon.loading{animation:load 1.5s linear infinite}.icon circle{stroke:currentColor;animation:circle 1.5s ease-in-out infinite}:host([size=s]){width:20px;height:20px}:host([size=m]){width:24px;height:24px}:host([size=l]){width:32px;height:32px}:host([size=xl]){width:36px;height:36px}:host([size=xxl]){width:44px;height:44px}:host([size=xxxl]){width:52px;height:52px}@keyframes circle{0%{stroke-dasharray:0,3812px;stroke-dashoffset:0}50%{stroke-dasharray:1906px,3812px;stroke-dashoffset:-287px}100%{stroke-dasharray:1906px,3812px;stroke-dashoffset:-2393px}}@keyframes load{to{transform:rotate(360deg)}}`;
  render() {
    return html`
      <svg
        class="icon ${this.name === "loading" ? "loading" : ""}"
        viewBox="0 0 1024 1024"
      >
        ${this.name === "loading" ? svg`<circle class="circle" cx="512" cy="512" r="384" fill="none" stroke-width="80" />` : svg`<path d="${dict[this.name]}" />`}
      </svg>
    `;
  }
}
Icon.reg("icon");

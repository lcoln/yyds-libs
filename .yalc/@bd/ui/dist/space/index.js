import { css, html, Component } from "@bd/core";
class Space extends Component {
  static styles = css`:host{display:block}.container{display:flex;flex-wrap:wrap;align-items:center;width:100%;gap:12px}:host([vertical]) .container{flex-direction:column}:host([justify]) .container{justify-content:space-between}:host([gap=s]) .container{gap:4px}:host([gap=m]) .container{gap:8px}:host([gap=l]) .container{gap:12px}:host([gap=xl]) .container{gap:16px}:host([gap=xxl]) .container{gap:20px}:host([gap=xxxl]) .container{gap:24px}:host([gap=xxxxl]) .container{gap:28px}`;
  render() {
    return html`<div class="container"><slot /></div>`;
  }
}
Space.reg("space");

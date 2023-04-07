import { css, html, Component } from "@bd/core";
class Badge extends Component {
  static props = {
    value: "",
    type: "info",
    max: {
      type: Number,
      default: null
    },
    hidden: false,
    "is-dot": false
  };
  static styles = [
    css`:host{position:relative;display:inline-block}.num{z-index:1;position:absolute;display:inline-flex;justify-content:center;align-items:center;left:calc(100% - 9px);top:-10px;height:18px;padding:0 6px;border-radius:10px;font-size:12px;white-space:nowrap;color:#fff;background:var(--color-blue-3)}:host([is-dot])::after{z-index:1;position:absolute;height:8px;width:8px;top:-4px;left:calc(100% - 4px);background:var(--color-blue-3);border-radius:50%;content:""}:host([hidden])::after{display:none;content:""}`,
    //配色
    css`:host([type=primary]) .num{background-color:var(--color-teal-3)}:host([type=primary])::after{background-color:var(--color-teal-3)}:host([type=info]) .num{background-color:var(--color-blue-3)}:host([type=info])::after{background-color:var(--color-blue-3)}:host([type=success]) .num{background-color:var(--color-green-3)}:host([type=success])::after{background-color:var(--color-green-3)}:host([type=warning]) .num{background-color:var(--color-orange-3)}:host([type=warning])::after{background-color:var(--color-orange-3)}:host([type=danger]) .num{background-color:var(--color-red-3)}:host([type=danger])::after{background-color:var(--color-red-3)}:host([type=secondary]) .num{background-color:var(--color-dark-3)}:host([type=secondary])::after{background-color:var(--color-dark-3)}:host([type=help]) .num{background-color:var(--color-grey-3)}:host([type=help])::after{background-color:var(--color-grey-3)}`
  ];
  render() {
    return html`
      <div class="badge" ref="bad">
        <slot></slot>
        ${!this["is-dot"] && !this.hidden ? html`<div class="num">
              ${this.max && this.value >= this.max ? this.max + "+" : this.value}
            </div>` : ""}
      </div>
    `;
  }
}
Badge.reg("badge");

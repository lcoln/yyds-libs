import { nextTick, css, html, Component, classMap } from "@bd/core";
class Switch extends Component {
  static props = {
    size: "l",
    value: {
      type: Boolean,
      default: false,
      attribute: false
    },
    "inactive-text": "",
    "active-text": "",
    "inline-text": false,
    disabled: false,
    readonly: false
  };
  static styles = [
    css`:host{display:inline-flex;align-items:center;font-size:14px;cursor:pointer}:host label{display:flex;justify-content:center;align-items:center;min-width:32px;padding-right:16px;line-height:1;-moz-user-select:none;user-select:none;white-space:nowrap;cursor:inherit;outline:none;color:var(--color-dark-1)}:host .dot{display:flex;align-items:center;justify-content:space-between;min-width:36px;height:18px;padding:0 4px;margin-right:5px;line-height:14px;border-radius:16px;background:var(--color-plain-3);transition:box-shadow .2s ease,background .2s ease}:host .dot::before{display:block;width:14px;height:14px;border-radius:50%;background:#fff;content:""}:host .dot::after{display:flex;padding:0 2px;font-size:12px;content:attr(st);color:#fff}:host .dot.open{flex-direction:row-reverse;background:var(--color-teal-1)}`,
    css`:host(:focus-within) .dot{box-shadow:0 0 0 2px var(--color-plain-a)}`,
    // 尺寸
    css`:host([size=m]){height:24px;font-size:12px}:host([size=m]) .dot{min-width:30px;height:16px;line-height:12px}:host([size=m]) .dot::before{width:12px;height:12px}:host([size=l]){height:32px;font-size:14px}:host([size=l]) .dot{min-width:35px;height:18px;line-height:14px}:host([size=l]) .dot::before{width:14px;height:14px}:host([size=xl]){height:36px;font-size:14px}:host([size=xl]) .dot{min-width:35px;height:18px;line-height:14px}:host([size=xl]) .dot::before{width:14px;height:14px}:host([size=xxl]){height:44px;font-size:14px}:host([size=xxl]) .dot{min-width:35px;height:18px;line-height:14px}:host([size=xxl]) .dot::before{width:14px;height:14px}:host([size=xxxl]){height:52px;font-size:16px}:host([size=xxxl]) .dot{min-width:40px;height:20px;line-height:16px}:host([size=xxxl]) .dot::before{width:16px;height:16px}`,
    // 配色
    css`:host([type=primary]) .dot.open{background:var(--color-teal-1)}:host([type=primary]):host(:focus-within) .dot{box-shadow:0 0 0 2px var(--color-teal-a)}:host([type=info]) .dot.open{background:var(--color-blue-1)}:host([type=info]):host(:focus-within) .dot{box-shadow:0 0 0 2px var(--color-blue-a)}:host([type=success]) .dot.open{background:var(--color-green-1)}:host([type=success]):host(:focus-within) .dot{box-shadow:0 0 0 2px var(--color-green-a)}:host([type=warning]) .dot.open{background:var(--color-orange-1)}:host([type=warning]):host(:focus-within) .dot{box-shadow:0 0 0 2px var(--color-orange-a)}:host([type=danger]) .dot.open{background:var(--color-red-1)}:host([type=danger]):host(:focus-within) .dot{box-shadow:0 0 0 2px var(--color-red-a)}:host([type=secondary]) .dot.open{background:var(--color-dark-1)}:host([type=secondary]):host(:focus-within) .dot{box-shadow:0 0 0 2px var(--color-dark-a)}:host([type=help]) .dot.open{background:var(--color-grey-1)}:host([type=help]):host(:focus-within) .dot{box-shadow:0 0 0 2px var(--color-grey-a)}`,
    // 状态
    css`:host([readonly]),:host([disabled]){cursor:not-allowed;opacity:.6}:host([readonly]){cursor:default}`
  ];
  toggleCheck(ev) {
    if (this.disabled || this.readOnly) {
      return;
    }
    ev.stopPropagation();
    this.value = !this.value;
    let data = {
      value: this.value
    };
    this.$emit("change", data);
  }
  handleClick(ev) {
    if (ev.type === "click" || ev.keyCode === 32) {
      this.toggleCheck(ev);
    }
  }
  mounted() {
  }
  render() {
    let classes = classMap({ dot: true, open: this.value });
    return html` <label
      tabindex=${this.disabled ? "none" : 0}
      @click=${this.handleClick}
      @keydown=${this.handleClick}
    >
      <span
        class=${classes}
        st=${this["inline-text"] ? this.value ? this["active-text"] : this["inactive-text"] : ""}
      ></span>
      <slot
        >${!this["inline-text"] ? this.value ? this["active-text"] : this["inactive-text"] : ""}</slot
      >
    </label>`;
  }
}
Switch.reg("switch");

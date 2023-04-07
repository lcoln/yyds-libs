import { nextTick, css, html, Component } from "@bd/core";
import "../icon/index.js";
class Checkbox extends Component {
  static props = {
    value: {
      type: Array,
      default: [],
      attribute: false,
      observer() {
        this.#updateChildrenStat();
      }
    },
    disabled: false,
    readonly: false
  };
  static styles = css`:host{display:inline-flex;flex-wrap:wrap;align-items:center}`;
  mounted() {
    this.$on("child-change", (ev) => {
      ev.stopPropagation();
      let idx = this.value.indexOf(ev.value);
      if (idx > -1) {
        this.value.splice(idx, 1);
      } else {
        this.value.push(ev.value);
      }
      this.$emit("change", { data: this.value });
    });
    this.#updateChildrenStat(true);
  }
  #updateChildrenStat(checkAll) {
    Array.from(this.children).forEach((it) => {
      if (it.tagName === "WC-CHECKBOX") {
        if (it.root) {
          if (checkAll) {
            it.disabled = this.disabled;
            it.readOnly = this.readOnly;
          }
          it.checked = this.value.includes(it.value);
        }
      } else {
        it.remove();
      }
    });
  }
}
class CheckboxItem extends Component {
  static props = {
    value: {
      type: String,
      default: "",
      attribute: false
    },
    checked: false,
    disabled: false,
    readonly: false
  };
  static styles = [
    css`:host{display:inline-flex;align-items:center;font-size:14px;cursor:pointer}:host label{display:flex;justify-content:center;align-items:center;min-width:32px;padding-right:16px;line-height:1;-moz-user-select:none;user-select:none;white-space:nowrap;cursor:inherit;outline:none;color:var(--color-dark-1)}:host .dot{display:flex;justify-content:center;align-items:center;width:14px;height:14px;margin-right:4px;border:1px solid var(--color-dark-1);border-radius:4px;background:#fff;transition:box-shadow .15s linear}:host .dot wc-icon{display:block;visibility:hidden;width:10px;height:10px;transform:scale(0);transition:transform .15s linear}:host:host([checked]) .dot wc-icon{visibility:visible;transform:scale(1)}`,
    css`:host(:focus-within) .dot{box-shadow:0 0 0 2px var(--color-plain-a)}`,
    // 尺寸
    css`:host([size=m]){height:24px;font-size:12px}:host([size=m]) .dot{width:12px;height:12px}:host([size=l]){height:32px;font-size:14px}:host([size=l]) .dot{width:14px;height:14px}:host([size=xl]){height:36px;font-size:14px}:host([size=xl]) .dot{width:14px;height:14px}:host([size=xxl]){height:44px;font-size:14px}:host([size=xxl]) .dot{width:14px;height:14px}:host([size=xxxl]){height:52px;font-size:16px}:host([size=xxxl]) .dot{width:16px;height:16px}`,
    // 配色
    css`:host([type=primary]) label{color:var(--color-teal-2)}:host([type=primary]) .dot{border-color:var(--color-teal-2)}:host([type=primary]) .dot::after{background:var(--color-teal-2)}:host([type=primary]):host(:focus-within) .dot{box-shadow:0 0 0 2px var(--color-teal-a)}:host([type=info]) label{color:var(--color-blue-2)}:host([type=info]) .dot{border-color:var(--color-blue-2)}:host([type=info]) .dot::after{background:var(--color-blue-2)}:host([type=info]):host(:focus-within) .dot{box-shadow:0 0 0 2px var(--color-blue-a)}:host([type=success]) label{color:var(--color-green-2)}:host([type=success]) .dot{border-color:var(--color-green-2)}:host([type=success]) .dot::after{background:var(--color-green-2)}:host([type=success]):host(:focus-within) .dot{box-shadow:0 0 0 2px var(--color-green-a)}:host([type=warning]) label{color:var(--color-orange-2)}:host([type=warning]) .dot{border-color:var(--color-orange-2)}:host([type=warning]) .dot::after{background:var(--color-orange-2)}:host([type=warning]):host(:focus-within) .dot{box-shadow:0 0 0 2px var(--color-orange-a)}:host([type=danger]) label{color:var(--color-red-2)}:host([type=danger]) .dot{border-color:var(--color-red-2)}:host([type=danger]) .dot::after{background:var(--color-red-2)}:host([type=danger]):host(:focus-within) .dot{box-shadow:0 0 0 2px var(--color-red-a)}:host([type=secondary]) label{color:var(--color-dark-2)}:host([type=secondary]) .dot{border-color:var(--color-dark-2)}:host([type=secondary]) .dot::after{background:var(--color-dark-2)}:host([type=secondary]):host(:focus-within) .dot{box-shadow:0 0 0 2px var(--color-dark-a)}:host([type=help]) label{color:var(--color-grey-2)}:host([type=help]) .dot{border-color:var(--color-grey-2)}:host([type=help]) .dot::after{background:var(--color-grey-2)}:host([type=help]):host(:focus-within) .dot{box-shadow:0 0 0 2px var(--color-grey-a)}`,
    // 状态
    css`:host([readonly]),:host([disabled]){cursor:not-allowed;opacity:.6}:host([readonly]){cursor:default}`
  ];
  toggleCheck(ev) {
    if (this.disabled || this.readOnly) {
      return;
    }
    ev.stopPropagation();
    this.checked = !this.checked;
    let data = {
      value: this.value,
      checked: this.checked
    };
    if (this.inGroup) {
      this.parentNode.$emit("child-change", data);
    } else {
      this.$emit("change", data);
    }
  }
  handleClick(ev) {
    if (ev.type === "click" || ev.keyCode === 32) {
      this.toggleCheck(ev);
    }
  }
  mounted() {
    if (this.parentNode?.tagName === "WC-CHECKBOX-GROUP") {
      this.inGroup = true;
    }
  }
  render() {
    return html` <label
      tabindex=${this.disabled ? "none" : 0}
      @click=${this.handleClick}
      @keydown=${this.handleClick}
    >
      <span class="dot"><wc-icon name="get"></wc-icon></span>
      <slot></slot>
    </label>`;
  }
}
Checkbox.reg("checkbox-group");
CheckboxItem.reg("checkbox");

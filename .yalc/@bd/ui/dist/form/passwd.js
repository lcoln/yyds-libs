import { css, html, Component, bind, unbind, nextTick } from "@bd/core";
import "../icon/index.js";
class Passwd extends Component {
  static props = {
    type: "primary",
    icon: "",
    size: "l",
    value: {
      type: String,
      default: "",
      attribute: false
    },
    _type: {
      type: String,
      default: "password",
      attribute: false
    },
    autofocus: false,
    readonly: false,
    disabled: false,
    lazy: 0
    // 并发拦截时间, 单位毫秒
  };
  static styles = [
    css`:host{overflow:hidden;display:inline-flex;min-width:108px;user-select:none;-moz-user-select:none;color:var(--color-dark-1);border-radius:3px;cursor:text;transition:box-shadow .15s linear}.label{flex:1;display:flex;justify-content:center;align-items:center;height:32px;font-size:14px;border:1px solid var(--color-grey-2);border-radius:inherit;background:var(--input-bg-color, #fff);color:inherit;cursor:inherit}.label input{flex:1;min-width:36px;width:0;height:100%;padding:0 4px 0 8px;border:0;border-radius:inherit;color:inherit;font:inherit;background:none;outline:none;box-shadow:none;cursor:inherit}.label input::placeholder{color:var(--color-grey-1)}`,
    css`.label .icon{--size: 16px;margin:0 8px 0 4px;color:var(--color-grey-2);cursor:pointer}`,
    // 尺寸
    css`:host([size=m]){min-width:72px}:host([size=m]) .label{height:24px}:host([round][size=m]) .label input{padding:0 6px 0 20px}:host([size=l]){min-width:108px}:host([size=l]) .label{height:32px}:host([round][size=l]) .label input{padding:0 6px 0 20px}:host([size=xl]){min-width:132px}:host([size=xl]) .label{height:36px}:host([round][size=xl]) .label input{padding:0 6px 0 20px}:host([size=xxl]){min-width:160px}:host([size=xxl]) .label{height:44px}:host([size=xxl]) .icon{--size: 18px}:host([round][size=xxl]) .label input{padding:0 6px 0 20px}:host([size=xxxl]){min-width:192px}:host([size=xxxl]) .label{height:52px}:host([size=xxxl]) .label input{padding:0 6px 0 10px}:host([size=xxxl]) .icon{--size: 22px;margin:0 12px 0 4px}:host([round][size=xxxl]) .label input{padding:0 6px 0 20px}`,
    // 配色
    css`:host([type=primary]:focus-within){box-shadow:0 0 0 2px var(--color-teal-a)}:host([type=primary]) .label{border-color:var(--color-teal-2)}:host([type=info]:focus-within){box-shadow:0 0 0 2px var(--color-blue-a)}:host([type=info]) .label{border-color:var(--color-blue-2)}:host([type=success]:focus-within){box-shadow:0 0 0 2px var(--color-green-a)}:host([type=success]) .label{border-color:var(--color-green-2)}:host([type=warning]:focus-within){box-shadow:0 0 0 2px var(--color-orange-a)}:host([type=warning]) .label{border-color:var(--color-orange-2)}:host([type=danger]:focus-within){box-shadow:0 0 0 2px var(--color-red-a)}:host([type=danger]) .label{border-color:var(--color-red-2)}:host([type=secondary]:focus-within){box-shadow:0 0 0 2px var(--color-dark-a)}:host([type=secondary]) .label{border-color:var(--color-dark-2)}:host([type=help]:focus-within){box-shadow:0 0 0 2px var(--color-grey-a)}:host([type=help]) .label{border-color:var(--color-grey-2)}`,
    css`:host([disabled]),:host([readonly]){cursor:default}:host([disabled]) .icon,:host([readonly]) .icon{cursor:default}:host([disabled]){cursor:not-allowed}:host([disabled]) .label{border-color:var(--color-grey-1);background:var(--color-plain-1);opacity:.6}:host([no-border]) .label,:host(:focus-within[no-border]) .label{border:0}`
  ];
  mounted() {
    if (this.autofocus) {
      nextTick((_) => this.$refs.input.focus());
    }
  }
  iconClick(ev) {
    if (this.readOnly || this.disabled) {
      return;
    }
    this._type = this._type === "password" ? "" : "password";
  }
  handleInput(ev) {
    this.value = ev.target.value;
  }
  handleChange() {
    this.$emit("change");
  }
  render() {
    return html`
      <div class="label">
        <slot class="prepend" name="prepend"></slot>
        <input
          spellcheck="false"
          ref="input"
          @input=${this.handleInput}
          @change=${this.handleChange}
          :readOnly=${this.readOnly}
          :disabled=${this.disabled}
          :type=${this._type}
          :value=${this.value}
        />
        <wc-icon
          class="icon"
          @click=${this.iconClick}
          :name=${this._type === "password" ? "eye" : "eye-off"}
        ></wc-icon>
      </div>
    `;
  }
}
Passwd.reg("passwd");

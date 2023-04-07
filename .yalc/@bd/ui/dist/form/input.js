import { nextTick, css, html, Component } from "@bd/core";
import "../icon/index.js";
class Input extends Component {
  static props = {
    readOnly: false,
    autofocus: false,
    disabled: false,
    closeable: false,
    icon: "",
    size: "l",
    placeholder: "",
    maxlength: null,
    minlength: null,
    value: {
      type: String,
      default: "",
      attribute: false
    },
    lazy: 0
    // 并发拦截时间, 单位毫秒
  };
  static styles = [
    css`:host{overflow:hidden;display:inline-flex;min-width:228px;height:36px;user-select:none;-moz-user-select:none;color:var(--color-dark-1);border-radius:3px;cursor:text;transition:box-shadow .15s linear}.label{flex:1;display:flex;justify-content:center;align-items:center;height:100%;font-size:14px;border:1px solid var(--color-grey-2);border-radius:inherit;background:var(--bg-color, #fff);color:inherit;cursor:inherit}.label input{flex:1;min-width:36px;width:0;height:100%;padding:0 8px;border:0;border-radius:inherit;font:inherit;color:inherit;background:none;outline:none;box-shadow:none;cursor:inherit}.label input::placeholder{color:var(--color-grey-1)}.label .prepend,.label .append{display:flex;justify-content:center;align-items:center;width:auto;white-space:nowrap}.label[prepend] .prepend,.label[append] .append{display:flex}.label[prepend] input,.label[append] input{min-width:64px}.label .close{--size: 18px;margin:0 8px 0 4px;padding:4px;border-radius:50%;color:var(--color-grey-2);cursor:pointer;transition:background .15s linear}.label .close:hover{background:var(--color-plain-1)}.suggestion{overflow:hidden;display:none;position:fixed;z-index:10240;left:0;top:0;width:200px;height:auto;max-height:200px;min-height:46px;padding:4px 0;border-radius:4px;background:var(--color-plain-1);box-shadow:0 2px 5px rgba(0,0,0,.15)}.suggestion .list{width:100%}.suggestion.show{display:flex}.suggestion li{overflow:hidden;width:100%;height:30px;line-height:30px;padding:0 8px;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.suggestion li:hover,.suggestion li[focus]{background:var(--color-plain-2)}:host([round]){border-radius:26px}:host([round]) .label input{padding:0 10px}:host([round]) .label[prepend] input,:host([round]) .label[append] input{padding:0 5px}:host([size=large]){min-width:234px}:host([size=large]) .label{height:52px;font-size:18px}:host([size=large]) .label input{padding:0 16px}:host([size=large]) .prepend,:host([size=large]) .append{height:48px;padding:0 16px}:host([size=large]) .icon{--size: 24px;margin:0 20px 0 4px}:host([size=medium]){min-width:160px}:host([size=medium]) .label{height:44px}:host([size=medium]) .label input{padding:0 10px}:host([size=medium]) .prepend,:host([size=medium]) .append{height:40px}:host([size=small]){min-width:96px}:host([size=small]) .label{height:32px}:host([size=small]) .label input{padding:0 6px}:host([size=small]) .prepend,:host([size=small]) .append{height:28px}:host([size=mini]){min-width:72px}:host([size=mini]) .label{height:26px;font-size:12px}:host([size=mini]) .icon{--size: 14px}:host([size=mini]) .prepend,:host([size=mini]) .append{height:22px}:host(:focus-within){box-shadow:0 0 0 2px var(--color-plain-a)}:host([disabled]){pointer-events:none;cursor:not-allowed}:host([disabled]) .label{border-color:var(--color-grey-1);background:var(--color-plain-1);opacity:.6}:host([readonly]){cursor:default}:host([no-border]) .label,:host(:focus-within[no-border]) .label{border:0}:host([no-border]) .label[prepend] input,:host(:focus-within[no-border]) .label[prepend] input{padding-left:2px}:host([no-border]) .label[append] input,:host(:focus-within[no-border]) .label[append] input{padding-right:2px}:host([no-border]) .prepend,:host([no-border]) .append,:host(:focus-within[no-border]) .prepend,:host(:focus-within[no-border]) .append{border:0}`,
    //尺寸
    css`:host([size=m]){min-width:82px;height:24px;font-size:12px}:host([size=m]) .label{height:24px;font-size:12px}:host([size=m]) .icon{--size: 12px}:host([size=m][circle]){width:24px;height:24px}:host([size=l]){min-width:108px;height:32px;font-size:14px}:host([size=l]) .label{height:32px;font-size:14px}:host([size=l]) .icon{--size: 14px}:host([size=l][circle]){width:32px;height:32px}:host([size=xl]){min-width:132px;height:36px;font-size:14px}:host([size=xl]) .label{height:36px;font-size:14px}:host([size=xl]) .icon{--size: 14px}:host([size=xl][circle]){width:36px;height:36px}:host([size=xxl]){min-width:160px;height:44px;font-size:14px}:host([size=xxl]) .label{height:44px;font-size:14px}:host([size=xxl]) .icon{--size: 14px}:host([size=xxl][circle]){width:44px;height:44px}:host([size=xxxl]){min-width:192px;height:52px;font-size:16px}:host([size=xxxl]) .label{height:52px;font-size:16px}:host([size=xxxl]) .icon{--size: 16px}:host([size=xxxl][circle]){width:52px;height:52px}`,
    /* ----- 类型(颜色) ----- */
    css`:host([type=primary]:focus-within){box-shadow:0 0 0 2px var(--color-teal-a)}:host([type=primary]) .label{border-color:var(--color-teal-2)}:host([type=primary]) .label .prepend,:host([type=primary]) .label .append{border-color:var(--color-teal-a)}:host([type=info]:focus-within){box-shadow:0 0 0 2px var(--color-blue-a)}:host([type=info]) .label{border-color:var(--color-blue-2)}:host([type=info]) .label .prepend,:host([type=info]) .label .append{border-color:var(--color-blue-a)}:host([type=success]:focus-within){box-shadow:0 0 0 2px var(--color-green-a)}:host([type=success]) .label{border-color:var(--color-green-2)}:host([type=success]) .label .prepend,:host([type=success]) .label .append{border-color:var(--color-green-a)}:host([type=warning]:focus-within){box-shadow:0 0 0 2px var(--color-orange-a)}:host([type=warning]) .label{border-color:var(--color-orange-2)}:host([type=warning]) .label .prepend,:host([type=warning]) .label .append{border-color:var(--color-orange-a)}:host([type=danger]:focus-within){box-shadow:0 0 0 2px var(--color-red-a)}:host([type=danger]) .label{border-color:var(--color-red-2)}:host([type=danger]) .label .prepend,:host([type=danger]) .label .append{border-color:var(--color-red-a)}:host([type=secondary]:focus-within){box-shadow:0 0 0 2px var(--color-dark-a)}:host([type=secondary]) .label{border-color:var(--color-dark-2)}:host([type=secondary]) .label .prepend,:host([type=secondary]) .label .append{border-color:var(--color-dark-a)}:host([type=help]:focus-within){box-shadow:0 0 0 2px var(--color-grey-a)}:host([type=help]) .label{border-color:var(--color-grey-2)}:host([type=help]) .label .prepend,:host([type=help]) .label .append{border-color:var(--color-grey-a)}`
  ];
  renderClose() {
    return html`<wc-icon
      class="close"
      name="close"
      @click=${this.onClickClose}
    />`;
  }
  render() {
    return html`
      <div class="label">
        <slot class="prepend" name="prepend"></slot>
        <input
          ref="input"
          @input=${this.onInput}
          @change=${this.onChange}
          @keydown=${this.onKeyDown}
          placeholder=${this.placeholder}
          maxlength=${this.maxlength}
          minlength=${this.minlength}
          disabled=${this.disabled}
          readonly=${this.readOnly}
          autofocus=${this.autofocus}
          :value=${this.value}
        />
        ${this.closeable && this.value ? this.renderClose() : ""}
        ${this.icon ? html`<wc-icon class="icon" name=${this.icon} />` : html`<slot class="append" name="append" />`}
      </div>
    `;
  }
  onInput(e) {
    this.value = e.currentTarget.value;
  }
  onClickClose() {
    this.$refs.input.value = "";
    this.value = "";
  }
  onChange() {
    this.$emit("change");
  }
  onKeyDown(e) {
    if (e.keyCode === 13) {
      this.$emit("submit");
    }
  }
  mounted() {
    if (this.autofocus) {
      nextTick((_) => this.$refs.input.focus());
    }
  }
}
Input.reg("input");

import { css, html, Component, nextTick } from "@bd/core";
class TextArea extends Component {
  static props = {
    value: {
      type: String,
      default: "",
      attributes: false
    },
    type: "",
    autofocus: false,
    readOnly: false,
    disabled: false,
    maxlength: null,
    minlength: null,
    "show-limit": false,
    lazy: 0
    // 并发拦截时间, 单位毫秒
  };
  static styles = [
    // 基础样式
    css`:host{display:flex;width:100%;height:80px;user-select:none;-moz-user-select:none;color:var(--color-dark-1);border-radius:3px;cursor:text;transition:box-shadow .15s linear}.label{position:relative;width:100%;height:100%;font-size:14px;border:1px solid var(--color-grey-2);border-radius:inherit;background:var(--bg-color, #fff);color:inherit;cursor:inherit}.label textarea{flex:1;min-width:36px;width:100%;height:100%;padding:5px 8px;border:0;border-radius:inherit;color:inherit;font:inherit;background:none;outline:none;box-shadow:none;cursor:inherit;resize:none}.label textarea::placeholder{color:var(--color-grey-1)}.label .input-stat{display:none;position:absolute;right:4px;bottom:2px;line-height:1;font-size:12px;color:var(--color-grey-2)}:host([show-limit]) .label{padding-bottom:14px}:host([show-limit]) .label .input-stat{display:block}:host([disabled]){cursor:not-allowed}:host([disabled]) .label{background:var(--color-plain-1);opacity:.6}:host([readonly]){cursor:default}:host(:focus-within){box-shadow:0 0 0 2px var(--color-plain-a)}:host([type=primary]:focus-within){box-shadow:0 0 0 2px var(--color-teal-a)}:host([type=info]:focus-within){box-shadow:0 0 0 2px var(--color-blue-a)}:host([type=success]:focus-within){box-shadow:0 0 0 2px var(--color-green-a)}:host([type=danger]:focus-within){box-shadow:0 0 0 2px var(--color-red-a)}:host([type=warning]:focus-within){box-shadow:0 0 0 2px var(--color-orange-a)}:host([type=primary]) .label{border-color:var(--color-teal-2)}:host([type=info]) .label{border-color:var(--color-blue-2)}:host([type=success]) .label{border-color:var(--color-green-2)}:host([type=danger]) .label{border-color:var(--color-red-2)}:host([type=warning]) .label{border-color:var(--color-orange-2)}:host([no-border]),:host(:focus-within[no-border]){box-shadow:none}:host([no-border]) .label,:host(:focus-within[no-border]) .label{border:0}`
  ];
  onInput(e) {
    this.value = e.target.value;
  }
  onKeydown(ev) {
    let { minlength, lazy } = this;
    let val = this.value;
    let now = Date.now();
    if (ev.keyCode === 13 && (ev.ctrlKey || ev.metaKey)) {
      if (this.disabled || this.readOnly) {
        return;
      }
      if (lazy && now - this.stamp < lazy) {
        return;
      }
      if (minlength && minlength > 0) {
        if (val.length < minlength) {
          return;
        }
      }
      this.stamp = now;
      this.$emit("submit", { value: this.value });
    }
  }
  onChange(e) {
    this.$emit(e.type);
  }
  render() {
    return html`
      <div class="label">
        <textarea
          ref="textarea"
          spellcheck="false"
          readonly=${this.readOnly}
          disabled=${this.disabled}
          maxlength=${this.maxlength}
          minlength=${this.minlength}
          autofocus=${this.autofocus}
          @input=${this.onInput}
          @keydown=${this.onKeydown}
          @change=${this.onChange}
        ></textarea>
        ${this["show-limit"] ? html`<div class="input-stat">
              ${this.value.length}/${this.maxlength || "\u221E"}
            </div>` : ""}
      </div>
    `;
  }
  mounted() {
    if (this.autofocus) {
      nextTick((_) => this.$refs.textarea.focus());
    }
  }
}
TextArea.reg("textarea");

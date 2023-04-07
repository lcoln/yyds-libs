import { css, html, Component, bind, unbind, nextTick } from "@bd/core";
class Link extends Component {
  static props = {
    type: "primary",
    to: "",
    autofocus: false,
    disabled: false,
    lazy: 0
    // 并发拦截时间, 单位毫秒
  };
  static styles = [
    // 基础样式
    css`:host{position:relative;display:inline-flex;border-radius:2px;user-select:none;-moz-user-select:none;font-size:inherit;cursor:pointer;transition:box-shadow .15s linear}:host .link{display:flex;justify-content:center;align-items:center;width:100%;padding:var(--padding, 0 2px);line-height:1;font-size:inherit;font-family:inherit;outline:none;color:inherit;cursor:inherit;text-decoration:none;transition:color .15s linear}:host .link::-moz-focus-inner{border:none}:host::after{position:absolute;bottom:-2px;left:0;width:100%;height:1px;border-bottom:1px dashed rgba(0,0,0,0);content:"";opacity:0;transition:opacity .15s linear}`,
    // 配色
    css`:host([type=primary]){color:var(--color-teal-2)}:host([type=primary])::after{border-color:var(--color-teal-1)}:host([type=primary]:not([disabled]):hover){color:var(--color-teal-1)}:host([type=primary]:not([disabled]):active){color:var(--color-teal-3)}:host([type=primary]:not([disabled]):focus-within){box-shadow:0 0 0 2px var(--color-teal-a)}:host([type=info]){color:var(--color-blue-2)}:host([type=info])::after{border-color:var(--color-blue-1)}:host([type=info]:not([disabled]):hover){color:var(--color-blue-1)}:host([type=info]:not([disabled]):active){color:var(--color-blue-3)}:host([type=info]:not([disabled]):focus-within){box-shadow:0 0 0 2px var(--color-blue-a)}:host([type=success]){color:var(--color-green-2)}:host([type=success])::after{border-color:var(--color-green-1)}:host([type=success]:not([disabled]):hover){color:var(--color-green-1)}:host([type=success]:not([disabled]):active){color:var(--color-green-3)}:host([type=success]:not([disabled]):focus-within){box-shadow:0 0 0 2px var(--color-green-a)}:host([type=warning]){color:var(--color-orange-2)}:host([type=warning])::after{border-color:var(--color-orange-1)}:host([type=warning]:not([disabled]):hover){color:var(--color-orange-1)}:host([type=warning]:not([disabled]):active){color:var(--color-orange-3)}:host([type=warning]:not([disabled]):focus-within){box-shadow:0 0 0 2px var(--color-orange-a)}:host([type=danger]){color:var(--color-red-2)}:host([type=danger])::after{border-color:var(--color-red-1)}:host([type=danger]:not([disabled]):hover){color:var(--color-red-1)}:host([type=danger]:not([disabled]):active){color:var(--color-red-3)}:host([type=danger]:not([disabled]):focus-within){box-shadow:0 0 0 2px var(--color-red-a)}:host([type=secondary]){color:var(--color-dark-2)}:host([type=secondary])::after{border-color:var(--color-dark-1)}:host([type=secondary]:not([disabled]):hover){color:var(--color-dark-1)}:host([type=secondary]:not([disabled]):active){color:var(--color-dark-3)}:host([type=secondary]:not([disabled]):focus-within){box-shadow:0 0 0 2px var(--color-dark-a)}:host([type=help]){color:var(--color-grey-2)}:host([type=help])::after{border-color:var(--color-grey-1)}:host([type=help]:not([disabled]):hover){color:var(--color-grey-1)}:host([type=help]:not([disabled]):active){color:var(--color-grey-3)}:host([type=help]:not([disabled]):focus-within){box-shadow:0 0 0 2px var(--color-grey-a)}`,
    // 状态
    css`:host(:not([disabled]):hover)::after,:host([underline])::after{opacity:1}:host([disabled]){cursor:not-allowed;opacity:.6}`
  ];
  mounted() {
    this.stamp = 0;
    if (this.autofocus) {
      nextTick((_) => this.$refs.a.focus());
    }
    this._clickFn = bind(
      this.$refs.a,
      "click",
      (ev) => {
        let { disabled, lazy } = this;
        let now = Date.now();
        if (disabled) {
          ev.preventDefault();
          ev.stopPropagation();
          return;
        }
        if (lazy > 0 && now - this.stamp < lazy) {
          ev.preventDefault();
          ev.stopPropagation();
          return;
        }
        this.stamp = now;
      },
      true
    );
  }
  render() {
    return html`
      <a tabindex="0" ref="a" class="link" href=${this.to || "javascript:;"}>
        <slot />
      </a>
    `;
  }
}
Link.reg("link");

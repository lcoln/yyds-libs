import { css, html, Component, nextTick } from "@bd/core";
import "../icon/index.js";
class Button extends Component {
  static props = {
    type: "primary",
    icon: "",
    size: "l",
    autofocus: false,
    loading: {
      type: Boolean,
      default: false,
      observer(val) {
        if (val) {
          this.cacheIcon = this.icon;
          this.icon = "loading";
        } else {
          this.icon = this.cacheIcon === void 0 ? this.icon : this.cacheIcon;
        }
      }
    },
    disabled: false,
    lazy: 0
    // 并发拦截时间, 单位毫秒
  };
  static styles = [
    // 基础样式
    css`:host{overflow:hidden;display:inline-flex;border:0;border-radius:3px;user-select:none;-moz-user-select:none;color:var(--color-dark-1);font-size:14px;cursor:pointer;transition:box-shadow .15s linear}:host button{display:flex;justify-content:center;align-items:center;width:100%;min-width:1px;height:inherit;padding:var(--button-padding, 0 4px);line-height:1;border:1px solid rgba(0,0,0,0);border-radius:inherit;white-space:nowrap;background:#fff;font-size:inherit;font-family:inherit;outline:none;color:inherit;cursor:inherit;transition:background .15s linear}:host button::-moz-focus-inner{border:none}:host .icon{--size: var(--icon-size, 18px);margin-right:4px}:host(:focus-within){box-shadow:0 0 0 2px var(--color-plain-a)}`,
    // 尺寸
    css`:host([size=s]){min-width:52px;height:20px;font-size:12px}:host([size=s]) .icon{--size: 12px}:host([size=s][circle]){width:20px;height:20px}:host([size=m]){min-width:72px;height:24px;font-size:12px}:host([size=m]) .icon{--size: 12px}:host([size=m][circle]){width:24px;height:24px}:host([size=l]){min-width:108px;height:32px;font-size:14px}:host([size=l]) .icon{--size: 14px}:host([size=l][circle]){width:32px;height:32px}:host([size=xl]){min-width:132px;height:36px;font-size:14px}:host([size=xl]) .icon{--size: 14px}:host([size=xl][circle]){width:36px;height:36px}:host([size=xxl]){min-width:160px;height:44px;font-size:14px}:host([size=xxl]) .icon{--size: 14px}:host([size=xxl][circle]){width:44px;height:44px}:host([size=xxxl]){min-width:192px;height:52px;font-size:16px}:host([size=xxxl]) .icon{--size: 16px}:host([size=xxxl][circle]){width:52px;height:52px}:host([dashed]) button{border-style:dashed}:host([round]){border-radius:32px}:host([circle]){min-width:0;border-radius:50%}:host([circle]) button{padding:0}:host([circle]) .icon{margin-right:0}:host([circle]) slot{display:none}`,
    // 配色
    css`:host([type=primary]) button{color:var(--color-teal-2);border-color:var(--color-teal-2)}:host([type=primary]) button:hover{color:var(--color-teal-1);border-color:var(--color-teal-1)}:host([type=primary]) button:active{color:var(--color-teal-3)}:host([type=primary]) button:disabled{color:var(--color-teal-2)}:host([type=primary]):host([solid]) button{border:0;color:#fff;background:var(--color-teal-2)}:host([type=primary]):host([solid]) button:hover{background:var(--color-teal-1)}:host([type=primary]):host([solid]) button:active{background:var(--color-teal-3)}:host([type=primary]):host([solid]) button:disabled{background:var(--color-teal-2)}:host([type=primary]):host(:focus-within){box-shadow:0 0 0 2px var(--color-teal-a)}:host([type=info]) button{color:var(--color-blue-2);border-color:var(--color-blue-2)}:host([type=info]) button:hover{color:var(--color-blue-1);border-color:var(--color-blue-1)}:host([type=info]) button:active{color:var(--color-blue-3)}:host([type=info]) button:disabled{color:var(--color-blue-2)}:host([type=info]):host([solid]) button{border:0;color:#fff;background:var(--color-blue-2)}:host([type=info]):host([solid]) button:hover{background:var(--color-blue-1)}:host([type=info]):host([solid]) button:active{background:var(--color-blue-3)}:host([type=info]):host([solid]) button:disabled{background:var(--color-blue-2)}:host([type=info]):host(:focus-within){box-shadow:0 0 0 2px var(--color-blue-a)}:host([type=success]) button{color:var(--color-green-2);border-color:var(--color-green-2)}:host([type=success]) button:hover{color:var(--color-green-1);border-color:var(--color-green-1)}:host([type=success]) button:active{color:var(--color-green-3)}:host([type=success]) button:disabled{color:var(--color-green-2)}:host([type=success]):host([solid]) button{border:0;color:#fff;background:var(--color-green-2)}:host([type=success]):host([solid]) button:hover{background:var(--color-green-1)}:host([type=success]):host([solid]) button:active{background:var(--color-green-3)}:host([type=success]):host([solid]) button:disabled{background:var(--color-green-2)}:host([type=success]):host(:focus-within){box-shadow:0 0 0 2px var(--color-green-a)}:host([type=warning]) button{color:var(--color-orange-2);border-color:var(--color-orange-2)}:host([type=warning]) button:hover{color:var(--color-orange-1);border-color:var(--color-orange-1)}:host([type=warning]) button:active{color:var(--color-orange-3)}:host([type=warning]) button:disabled{color:var(--color-orange-2)}:host([type=warning]):host([solid]) button{border:0;color:#fff;background:var(--color-orange-2)}:host([type=warning]):host([solid]) button:hover{background:var(--color-orange-1)}:host([type=warning]):host([solid]) button:active{background:var(--color-orange-3)}:host([type=warning]):host([solid]) button:disabled{background:var(--color-orange-2)}:host([type=warning]):host(:focus-within){box-shadow:0 0 0 2px var(--color-orange-a)}:host([type=danger]) button{color:var(--color-red-2);border-color:var(--color-red-2)}:host([type=danger]) button:hover{color:var(--color-red-1);border-color:var(--color-red-1)}:host([type=danger]) button:active{color:var(--color-red-3)}:host([type=danger]) button:disabled{color:var(--color-red-2)}:host([type=danger]):host([solid]) button{border:0;color:#fff;background:var(--color-red-2)}:host([type=danger]):host([solid]) button:hover{background:var(--color-red-1)}:host([type=danger]):host([solid]) button:active{background:var(--color-red-3)}:host([type=danger]):host([solid]) button:disabled{background:var(--color-red-2)}:host([type=danger]):host(:focus-within){box-shadow:0 0 0 2px var(--color-red-a)}:host([type=secondary]) button{color:var(--color-dark-2);border-color:var(--color-dark-2)}:host([type=secondary]) button:hover{color:var(--color-dark-1);border-color:var(--color-dark-1)}:host([type=secondary]) button:active{color:var(--color-dark-3)}:host([type=secondary]) button:disabled{color:var(--color-dark-2)}:host([type=secondary]):host([solid]) button{border:0;color:#fff;background:var(--color-dark-2)}:host([type=secondary]):host([solid]) button:hover{background:var(--color-dark-1)}:host([type=secondary]):host([solid]) button:active{background:var(--color-dark-3)}:host([type=secondary]):host([solid]) button:disabled{background:var(--color-dark-2)}:host([type=secondary]):host(:focus-within){box-shadow:0 0 0 2px var(--color-dark-a)}:host([type=help]) button{color:var(--color-grey-2);border-color:var(--color-grey-2)}:host([type=help]) button:hover{color:var(--color-grey-1);border-color:var(--color-grey-1)}:host([type=help]) button:active{color:var(--color-grey-3)}:host([type=help]) button:disabled{color:var(--color-grey-2)}:host([type=help]):host([solid]) button{border:0;color:#fff;background:var(--color-grey-2)}:host([type=help]):host([solid]) button:hover{background:var(--color-grey-1)}:host([type=help]):host([solid]) button:active{background:var(--color-grey-3)}:host([type=help]):host([solid]) button:disabled{background:var(--color-grey-2)}:host([type=help]):host(:focus-within){box-shadow:0 0 0 2px var(--color-grey-a)}`,
    // 状态
    css`:host([loading]),:host([disabled]){cursor:not-allowed;opacity:.6}`
  ];
  created() {
    this.stamp = 0;
    this._clickFn = this.$on(
      "click",
      (ev) => {
        let { loading, disabled, lazy } = this;
        let now = Date.now();
        if (loading || disabled) {
          return ev.stopPropagation();
        }
        if (lazy > 0 && now - this.stamp < lazy) {
          return ev.stopPropagation();
        }
        this.stamp = now;
      },
      true
    );
  }
  mounted() {
    if (this.autofocus) {
      nextTick((_) => this.$refs.btn.focus());
    }
  }
  render() {
    return html`
      <button ref="btn" disabled=${this.disabled}>
        <wc-icon class="icon" name=${this.icon}></wc-icon>
        <slot></slot>
      </button>
    `;
  }
}
Button.reg("button");

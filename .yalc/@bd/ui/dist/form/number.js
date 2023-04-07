import { css, html, Component, nextTick } from "@bd/core";
class WcNumber extends Component {
  static props = {
    type: "primary",
    size: "l",
    max: null,
    min: null,
    step: 1,
    value: {
      type: Number,
      default: 0,
      attribute: false
    },
    readonly: false,
    autofocus: false,
    disabled: false,
    lazy: 1e3
    // 并发拦截时间, 单位毫秒
  };
  static styles = [
    // 基础样式
    css`:host{overflow:hidden;display:inline-flex;min-width:128px;height:36px;user-select:none;-moz-user-select:none;color:var(--color-dark-1);border-radius:3px;cursor:text;transition:box-shadow .15s linear}:host(:focus-within){box-shadow:0 0 0 2px var(--color-plain-a)}.label{display:flex;width:100%;height:100%;margin:0 auto;line-height:1;font-size:14px;border:1px solid var(--color-grey-2);border-radius:inherit;background:var(--bg-color, #fff);color:inherit;cursor:text}.label span{display:flex;justify-content:center;align-items:center;width:34px;height:100%;font-size:18px;cursor:pointer}.label span:first-child{border-radius:3px 0 0 3px;border-right:1px solid var(--color-grey-a)}.label span:last-child{border-radius:0 3px 3px 0;border-left:1px solid var(--color-grey-a)}.label span.disabled{cursor:not-allowed;opacity:.6}.label input{flex:1;min-width:32px;width:0;height:100%;padding:0 6px;border:0;border-radius:inherit;color:inherit;font:inherit;text-align:center;background:none;outline:none;box-shadow:none;cursor:inherit}.label input::placeholder{color:var(--color-grey-1)}`,
    // 尺寸
    css`:host([size=s]){min-width:52px;height:20px;font-size:12px}:host([size=s]) .icon{--size: 12px}:host([size=s][circle]){width:20px;height:20px}:host([size=m]){min-width:72px;height:24px;font-size:12px}:host([size=m]) .icon{--size: 12px}:host([size=m][circle]){width:24px;height:24px}:host([size=l]){min-width:108px;height:32px;font-size:14px}:host([size=l]) .icon{--size: 14px}:host([size=l][circle]){width:32px;height:32px}:host([size=xl]){min-width:132px;height:36px;font-size:14px}:host([size=xl]) .icon{--size: 14px}:host([size=xl][circle]){width:36px;height:36px}:host([size=xxl]){min-width:160px;height:44px;font-size:14px}:host([size=xxl]) .icon{--size: 14px}:host([size=xxl][circle]){width:44px;height:44px}:host([size=xxxl]){min-width:192px;height:52px;font-size:16px}:host([size=xxxl]) .icon{--size: 16px}:host([size=xxxl][circle]){width:52px;height:52px}:host([size=xxxxl]){min-width:212px;height:64px;font-size:18px}:host([size=xxxxl]) .icon{--size: 18px}:host([size=xxxxl][circle]){width:64px;height:64px}:host([round]){border-radius:99rem}`,
    // 配色
    css`:host([type=primary]:focus-within){box-shadow:0 0 0 2px var(--color-teal-a)}:host([type=primary]) span{border-color:var(--color-teal-a)}:host([type=primary]) .label{border-color:var(--color-teal-2)}:host([type=info]:focus-within){box-shadow:0 0 0 2px var(--color-blue-a)}:host([type=info]) span{border-color:var(--color-blue-a)}:host([type=info]) .label{border-color:var(--color-blue-2)}:host([type=success]:focus-within){box-shadow:0 0 0 2px var(--color-green-a)}:host([type=success]) span{border-color:var(--color-green-a)}:host([type=success]) .label{border-color:var(--color-green-2)}:host([type=warning]:focus-within){box-shadow:0 0 0 2px var(--color-orange-a)}:host([type=warning]) span{border-color:var(--color-orange-a)}:host([type=warning]) .label{border-color:var(--color-orange-2)}:host([type=danger]:focus-within){box-shadow:0 0 0 2px var(--color-red-a)}:host([type=danger]) span{border-color:var(--color-red-a)}:host([type=danger]) .label{border-color:var(--color-red-2)}:host([type=secondary]:focus-within){box-shadow:0 0 0 2px var(--color-dark-a)}:host([type=secondary]) span{border-color:var(--color-dark-a)}:host([type=secondary]) .label{border-color:var(--color-dark-2)}:host([type=help]:focus-within){box-shadow:0 0 0 2px var(--color-grey-a)}:host([type=help]) span{border-color:var(--color-grey-a)}:host([type=help]) .label{border-color:var(--color-grey-2)}`,
    // 状态
    css`:host([disabled]){cursor:not-allowed;opacity:.6}:host([readonly]) .label{cursor:default;opacity:.8}:host([readonly]) .label span{cursor:inherit}:host([disabled]) .label{background:var(--color-plain-1);cursor:not-allowed;opacity:.6}:host([disabled]) .label span{cursor:inherit}`
  ];
  created() {
    this.stamp = 0;
  }
  mounted() {
    if (this.autofocus) {
      nextTick((_) => this.$refs.input.focus());
    }
    this.value = this.clapm(this.value);
    this.$refs.input.value = this.value;
  }
  onClick(e) {
    if (e.target.classList.contains("disabled")) {
      return;
    }
    const { disabled, readOnly } = this;
    if (disabled || readOnly) {
      return;
    }
    const { act } = e.target.dataset;
    this.updateValue(act);
  }
  updateValue(act) {
    const { max, min, step, value } = this;
    if (act === "+") {
      if (max === null || value + step <= max) {
        this.value += step;
      } else {
        this.value = max;
      }
    } else {
      if (min === null || value - step >= min) {
        this.value -= step;
      } else {
        this.value = min;
      }
    }
    this.$emit("input");
  }
  onChange(e) {
    this.value = this.clapm(e.target.value);
    this.$refs.input.value = this.value;
  }
  onKeydown(ev) {
    const now = Date.now();
    const { lazy, disabled, readOnly } = this;
    if (disabled || readOnly) {
      return;
    }
    if (ev.keyCode === 38 || ev.keyCode === 40) {
      ev.preventDefault();
      return this.updateValue(ev.keyCode === 38 ? "+" : "-");
    }
    if (ev.keyCode === 13) {
      ev.preventDefault();
      if (lazy && now - this.stamp < lazy) {
        return;
      }
      this.stamp = now;
      this.value = this.clapm(ev.target.value);
      this.$refs.input.value = this.value;
      this.$emit("submit", { value: this.value });
    }
  }
  clapm(val) {
    const max = this.max ?? Number.MAX_SAFE_INTEGER;
    const min = this.min ?? Number.MIN_SAFE_INTEGER;
    return Math.min(max, Math.max(+val, min));
  }
  render() {
    return html`
      <div class="label">
        <span
          data-act="-"
          class=${this.min && this.value - this.step < this.min ? "disabled" : ""}
          @click=${this.onClick}
          >-</span
        >
        <input
          ref="input"
          value="0"
          maxlength="9"
          disabled=${this.disabled}
          readonly=${this.readOnly}
          autofocus=${this.autofocus}
          :value=${this.value}
          @change=${this.onChange}
          @keydown=${this.onKeydown}
        />
        <span
          data-act="+"
          class=${this.max && this.value + this.step > this.max ? "disabled" : ""}
          @click=${this.onClick}
          >+</span
        >
      </div>
    `;
  }
}
WcNumber.reg("number");

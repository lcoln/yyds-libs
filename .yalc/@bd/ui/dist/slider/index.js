import { css, bind, unbind, html, Component } from "@bd/core";
class Slider extends Component {
  static props = {
    value: {
      type: Number,
      default: 0,
      observer(val) {
        this.$bar && this.initValue(val);
      }
    },
    type: "info",
    max: 100,
    min: 0,
    step: 1,
    disabled: false,
    readonly: false,
    vertical: false
  };
  static styles = [
    css`:host{display:block;width:100%;height:38px}.slider{position:relative;display:flex;align-items:center;height:100%}.runway{flex:1;position:relative;height:6px;background:#e4e7ed;border-radius:99rem;cursor:pointer}.runway .bar{flex:1;pointer-events:none;position:absolute;height:100%;width:0%;border-radius:99rem;background:var(--color-blue-2, #409eff)}.dot-wrapper{position:absolute;display:flex;justify-content:center;align-items:center;height:36px;width:36px;top:50%;left:0%;cursor:grab;transform:translate(-50%, -50%)}.dot-wrapper .dot{height:20px;width:20px;border-radius:50%;border:2px solid var(--color-blue-2, #409eff);background:#fff;transition:transform .2s ease-in-out}.dot-wrapper .dot:hover{transform:scale(1.2)}.tips{opacity:0;pointer-events:none;user-select:none;position:absolute;top:-100%;border-radius:4px;padding:10px;z-index:2000;font-size:12px;line-height:1.2;min-width:10px;word-wrap:break-word;color:#fff;background:#303133;transform:translateX(-50%);transition:opacity .2s ease-in-out}.tips.show{opacity:1}.tips:after{position:absolute;border:6px solid rgba(0,0,0,0);bottom:-12px;left:50%;transform:translateX(-50%);content:"";border-top-color:#303133}`,
    //状态
    css`:host([vertical]){display:inline-block;width:38px;height:250px}:host([vertical]) .slider{justify-content:center}:host([vertical]) .slider .runway{flex:0 0 auto;display:flex;flex-direction:column-reverse;width:6px;height:100%;cursor:pointer}:host([vertical]) .slider .runway .bar{height:0%;width:100%}:host([vertical]) .slider .runway .dot-wrapper{left:50%;top:100%;transform:translate(-50%, -50%)}:host([vertical]) .tips{top:100%;left:50%;transform:translate(-50%, -180%)}:host([loading]),:host([disabled]){pointer-events:none;cursor:not-allowed;opacity:.6}`,
    //配色
    css`:host([type=primary]) .bar{background-color:var(--color-teal-2)}:host([type=primary]) .dot{border-color:var(--color-teal-2)}:host([type=info]) .bar{background-color:var(--color-blue-2)}:host([type=info]) .dot{border-color:var(--color-blue-2)}:host([type=success]) .bar{background-color:var(--color-green-2)}:host([type=success]) .dot{border-color:var(--color-green-2)}:host([type=warning]) .bar{background-color:var(--color-orange-2)}:host([type=warning]) .dot{border-color:var(--color-orange-2)}:host([type=danger]) .bar{background-color:var(--color-red-2)}:host([type=danger]) .dot{border-color:var(--color-red-2)}:host([type=secondary]) .bar{background-color:var(--color-dark-2)}:host([type=secondary]) .dot{border-color:var(--color-dark-2)}:host([type=help]) .bar{background-color:var(--color-grey-2)}:host([type=help]) .dot{border-color:var(--color-grey-2)}`
  ];
  progress = 0;
  mounted() {
    this.$bar = this.$refs.bar;
    this.$dotWrap = this.$refs.dotWrap;
    this.$runway = this.$refs.runway;
    this.$tips = this.$refs.tips;
    this.initValue(this.value);
  }
  onMousedown(e) {
    let {
      value: preValue,
      step,
      max,
      min,
      progress,
      vertical,
      disabled,
      readOnly
    } = this;
    if (disabled || readOnly) {
      return;
    }
    this.$tips.classList.toggle("show");
    preValue = preValue || min;
    const start = vertical ? e.clientY : e.clientX;
    const onMousemove = bind(document, "mousemove", (e2) => {
      e2.preventDefault();
      const distance = (vertical ? e2.clientY : e2.clientX) - start;
      const scale = distance / (vertical ? this.$runway.clientHeight : this.$runway.clientWidth) * (vertical ? -1 : 1);
      const diff = Math.round(scale * (max - min));
      let newProgress = progress + Math.floor(scale * 100);
      let newValue = Math.floor(preValue + diff);
      newValue = Math.max(newValue, min);
      newValue = Math.min(newValue, max);
      if (newValue % step) {
        return;
      }
      this.value = newValue;
      requestAnimationFrame(() => {
        this.setProgress(vertical ? 100 - newProgress : newProgress);
      });
      this.$emit("input");
    });
    const onMouseup = bind(document, "mouseup", () => {
      unbind(document, "mousemove", onMousemove);
      unbind(document, "mouseup", onMouseup);
      this.$tips.classList.toggle("show");
      this.$emit("change");
    });
  }
  onClick(e) {
    if (e.target !== this.$refs.runway) {
      return;
    }
    const { max, min, step, vertical, disabled, readOnly } = this;
    if (disabled || readOnly) {
      return;
    }
    const { clientWidth, clientHeight } = e.target;
    const { offsetX, offsetY } = e;
    const range = max - min;
    const scale = (vertical ? offsetY : offsetX) / (vertical ? clientHeight : clientWidth);
    let newValue = Math.floor(scale * range + min);
    const mod = newValue % step;
    if (mod) {
      const half = step / 2;
      if (mod > half) {
        newValue += step - mod;
      } else {
        newValue -= mod;
      }
    }
    this.value = vertical ? range - newValue : newValue;
    const progress = Math.floor((newValue - min) / range * 100);
    this.setProgress(progress);
    this.$emit("change");
    if (!this.timeout) {
      this.$tips.classList.toggle("show");
    } else {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.timeout = setTimeout(() => {
      this.$tips.classList.toggle("show");
      this.timeout = null;
    }, 1e3);
  }
  initValue(val) {
    const { max, min, vertical, disabled, readOnly } = this;
    if (disabled || readOnly) {
      return;
    }
    const range = max - min;
    val = Math.max(val, min);
    val = Math.min(val, max);
    this.value = val;
    let progress = Math.floor((val - min) / range * 100);
    progress = vertical ? 100 - progress : progress;
    this.setProgress(progress);
  }
  setProgress(val) {
    const { vertical } = this;
    val = Math.floor(val);
    val = Math.min(val, 100);
    val = Math.max(val, 0);
    if (vertical) {
      this.$bar.style.height = `${100 - val}%`;
      this.$dotWrap.style.top = `${val}%`;
      this.$tips.style.top = `${val}%`;
      this.progress = 100 - val;
    } else {
      this.$bar.style.width = `${val}%`;
      this.$dotWrap.style.left = `${val}%`;
      this.$tips.style.left = `${val}%`;
      this.progress = val;
    }
  }
  render() {
    return html`<div class="slider" ref="slider">
      <div ref="runway" class="runway" @click=${this.onClick}>
        <div class="bar" ref="bar"></div>
        <div class="dot-wrapper" ref="dotWrap" @mousedown=${this.onMousedown}>
          <div class="dot"></div>
        </div>
      </div>
      <div class="tips" ref="tips">${this.value}</div>
    </div>`;
  }
}
Slider.reg("slider");

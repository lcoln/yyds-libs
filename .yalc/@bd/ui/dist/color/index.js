import {
  css,
  html,
  bind,
  unbind,
  Component,
  outsideClick,
  clearOutsideClick,
  nextTick,
  offset
} from "@bd/core";
function hsb2rgb(hsb) {
  var h = hsb.h;
  var s = Math.round(hsb.s * 255 / 100);
  var v = Math.round(hsb.b * 255 / 100);
  var r = 0;
  var g = 0;
  var b = 0;
  if (s === 0) {
    r = g = b = v;
  } else {
    var t1 = v;
    var t2 = (255 - s) * v / 255;
    var t3 = (t1 - t2) * (h % 60) / 60;
    if (h === 360) {
      h = 0;
    }
    if (h < 60) {
      r = t1;
      g = t2 + t3;
      b = t2;
    } else if (h < 120) {
      r = t1 - t3;
      g = t1;
      b = t2;
    } else if (h < 180) {
      r = t2;
      g = t1;
      b = t2 + t3;
    } else if (h < 240) {
      r = t2;
      g = t1 - t3;
      b = t1;
    } else if (h < 300) {
      r = t2 + t3;
      g = t2;
      b = t1;
    } else if (h < 360) {
      r = t1;
      g = t2;
      b = t1 - t3;
    }
  }
  r = Math.round(r);
  g = Math.round(g);
  b = Math.round(b);
  return { r, g, b };
}
function rgb2hex({ r, g, b }) {
  return [r, g, b].map((it) => it.toString(16).padStart(2, "0")).join("");
}
function hex2rgb(hex) {
  var r, g, b;
  hex = hex.replace(/^#/, "").split("");
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else {
    r = parseInt(hex[0] + hex[1], 16);
    g = parseInt(hex[2] + hex[3], 16);
    b = parseInt(hex[4] + hex[5], 16);
  }
  return { r, g, b };
}
function rgb2hsb({ r, g, b }) {
  var hsb = { h: 0, s: 0, b: 0 };
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var delta = max - min;
  hsb.b = max;
  hsb.s = max === 0 ? 0 : delta * 255 / max;
  if (hsb.s === 0) {
    hsb.h = -1;
  } else {
    if (r === max) {
      hsb.h = (g - b) / delta;
    } else if (g === max) {
      hsb.h = 2 + (b - r) / delta;
    } else {
      hsb.h = 4 + (r - g) / delta;
    }
  }
  hsb.h *= 60;
  if (hsb.h < 0) {
    hsb.h += 360;
  }
  hsb.s *= 100 / 255;
  hsb.b *= 100 / 255;
  return hsb;
}
function hex2hsb(hex) {
  return rgb2hsb(hex2rgb(hex));
}
class Color extends Component {
  static props = {
    value: {
      type: String,
      default: "",
      attribute: false,
      observer(val) {
        if (!this.panelShow) {
          this.#calc(val);
        }
      }
    },
    disabled: false,
    readonly: false
  };
  // 临时的value, 组件内的操作, 修改的是这个值, 避免直接修改value触发太多的计算
  #value = "";
  #x = 0;
  // 场景触点的X坐标
  #y = 0;
  // 场景触点的Y坐标
  #ht = 0;
  // 颜色池的触点坐标
  #at = 100;
  // 透明度条的触点坐标
  #sceneBg = "#ff0000";
  #alphaBg = "#ff0000";
  cache = {
    hsb: { h: 0, s: 100, b: 100 },
    rgba: { r: 255, g: 0, b: 0, a: 100 }
  };
  static styles = [
    css`:host{display:inline-flex}.color-picker{position:relative;width:36px;height:36px}.alpha-bg{background:linear-gradient(45deg, var(--color-grey-1) 25%, transparent 25%, transparent 75%, var(--color-grey-1) 75%, var(--color-grey-1)),linear-gradient(45deg, var(--color-grey-1) 25%, transparent 25%, transparent 75%, var(--color-grey-1) 75%, var(--color-grey-1));background-size:12px 12px;background-position:0 0,6px 6px}`,
    // 预览
    css`.preview{display:flex;width:100%;height:100%;border:2px solid var(--color-plain-2);border-radius:6px;cursor:pointer;transition:box-shadow .15s linear}.preview span{width:100%;height:100%;border:3px solid #fff;border-radius:6px;outline:none}.preview:focus-within{box-shadow:0 0 0 2px var(--color-plain-a)}`,
    // .color-panel
    css`.color-panel{display:none;position:absolute;left:0;top:38px;width:310px;padding:5px;background:#fff;box-shadow:0 0 20px rgba(0,0,0,.15)}.dashboard{display:flex;justify-content:space-between}.dashboard .scene{overflow:hidden;position:relative;width:280px;height:180px;background:red}.dashboard .scene::before,.dashboard .scene::after{position:absolute;left:0;top:0;width:100%;height:100%;content:""}.dashboard .scene::before{background:linear-gradient(to right, #fff, transparent)}.dashboard .scene::after{background:linear-gradient(to bottom, transparent, #000)}.dashboard .scene .thumb{position:absolute;width:0;height:0}.dashboard .scene .thumb::after{display:block;width:10px;height:10px;border-radius:50%;background:rgba(32,32,32,.3);box-shadow:0 0 0 1px #fff;transform:translate(-5px, -5px);content:""}.dashboard .pool{overflow:hidden;position:relative;width:12px;height:180px;background:linear-gradient(to bottom, #f00 0, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00)}.dashboard .pool .thumb{position:absolute;left:0;top:0;width:12px;height:0}.dashboard .pool .thumb::after{display:block;width:12px;height:12px;border-radius:50%;background:#fff;box-shadow:0 0 3px rgba(0,0,0,.5);transform:translateY(-6px);content:""}.dashboard .pool .hue{position:relative;display:block;width:12px;height:180px;appearance:slider-vertical;opacity:0}.alpha-box{overflow:hidden;position:relative;width:100%;height:12px;margin:12px 0}.alpha-box .bar{position:absolute;left:0;top:0;width:100%;height:12px;background:linear-gradient(to right, transparent, #f00)}.alpha-box .thumb{position:absolute;left:100%;top:0;width:0;height:12px}.alpha-box .thumb::after{display:block;width:12px;height:12px;border-radius:50%;background:#fff;box-shadow:0 0 3px rgba(0,0,0,.5);transform:translateX(-6px);content:""}.alpha-box .alpha{position:relative;display:block;width:100%;height:12px;opacity:0}`,
    css`.input-box{display:flex;justify-content:space-between;align-items:center;padding:6px 0}.input-box .input{width:200px;height:24px;padding:0 6px;line-height:22px;font:inherit;font-size:12px;border:2px solid var(--color-plain-2);border-radius:4px;outline:none;color:var(--color-dark-1);transition:box-shadow .15s linear}.input-box .input::placeholder{color:var(--color-grey-1)}.input-box .input:focus{box-shadow:0 0 0 2px var(--color-plain-a)}.input-box .clear,.input-box .submit{font-size:12px;cursor:pointer;user-select:none}.input-box .clear{color:var(--color-grey-3)}.input-box .submit{padding:2px 6px;border-radius:2px;color:var(--color-plain-1);background:var(--color-teal-2);outline:none;transition:box-shadow .15s linear,background .15s linear}.input-box .submit:hover{background:var(--color-teal-1)}.input-box .submit:focus{box-shadow:0 0 0 2px var(--color-teal-a)}`
  ];
  #calc(val) {
    var isHex;
    var rgb;
    val = val.toLowerCase();
    if (!val) {
      return;
    }
    isHex = /^#[0-9a-f]{3,6}$/.test(val);
    if (isHex) {
      Object.assign(this.cache.rgba, hex2rgb(val), { a: 100 });
    } else {
      var res = val.match(/rgba?\((\d+),\s*?(\d+),\s*?(\d+)[,\s]*?([\d\.]+)?\)/);
      if (res) {
        this.cache.rgba = { r: +res[1], g: +res[2], b: +res[3], a: 100 };
        if (res[4] !== void 0) {
          this.cache.rgba.a = ~~(res[4] * 100);
        }
      } else {
        return;
      }
    }
    this.cache.hsb = rgb2hsb(this.cache.rgba);
  }
  toggleColorPanel() {
    this.$refs.panel.style.display = "block";
    this.panelShow = true;
    this.#updateView();
  }
  // 透明度变化
  alphaChange(ev) {
    var a = ev.target.value;
    var { r, g, b } = this.cache.rgba;
    this.cache.rgba.a = a;
    this.#updateView();
  }
  // 色彩池变化
  hueChange(ev) {
    var h = 360 - ev.target.value;
    var { s, b } = this.cache.hsb;
    var rgba = this.cache.rgba;
    var hsb = { h, s, b };
    Object.assign(rgba, hsb2rgb(hsb));
    this.cache.hsb = hsb;
    this.cache.rgba = rgba;
    this.#updateView();
  }
  #updateView() {
    var { hsb, rgba } = this.cache;
    var sceneBg, color, alphaBg;
    var x, y;
    x = Math.ceil(hsb.s * 280 / 100);
    y = 180 - Math.ceil(hsb.b * 180 / 100);
    sceneBg = "#" + rgb2hex(hsb2rgb({ h: hsb.h, s: 100, b: 100 }));
    alphaBg = "#" + rgb2hex(rgba);
    if (rgba.a < 100) {
      color = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a / 100})`;
    } else {
      color = alphaBg;
    }
    this.#sceneBg = sceneBg;
    this.#alphaBg = alphaBg;
    this.#value = color;
    this.#x = x;
    this.#y = y;
    this.#ht = hsb.h / 2;
    this.#at = rgba.a;
    this.$requestUpdate();
  }
  #changeColor(x, y) {
    let { hsb, rgba } = this.cache;
    hsb.s = ~~(100 * x / 280);
    hsb.b = ~~(100 * (180 - y) / 180);
    Object.assign(rgba, hsb2rgb(hsb));
    this.cache.hsb = hsb;
    this.cache.rgba = rgba;
    this.#updateView();
  }
  closePanel() {
    if (this.hasOwnProperty("panelShow")) {
      this.$refs.panel.style.display = "";
      this.#calc(this.value);
      this.#updateView();
      delete this.panelShow;
    }
  }
  submit() {
    this.$refs.panel.style.display = "";
    this.value = this.#value;
    this.$emit("change", { data: this.#value });
    delete this.panelShow;
  }
  mounted() {
    var handleMove;
    nextTick((_) => this.#updateView());
    bind(this.$refs.scene, "mousedown", (ev) => {
      ev.preventDefault();
      var { pageX, pageY } = ev;
      var { left, top } = offset(this.$refs.scene);
      var x = pageX - left;
      var y = pageY - top;
      this.#changeColor(x, y);
      handleMove = bind(document, "mousemove", (ev2) => {
        ev2.preventDefault();
        var { pageX: pageX2, pageY: pageY2 } = ev2;
        var x2 = pageX2 - left;
        var y2 = pageY2 - top;
        var rgb;
        x2 = x2 < 0 ? 0 : x2 > 280 ? 280 : x2;
        y2 = y2 < 0 ? 0 : y2 > 180 ? 180 : y2;
        this.#changeColor(x2, y2);
      });
    });
    this.handleUp = bind(document, "mouseup", (ev) => {
      ev.preventDefault();
      unbind(document, "mousemove", handleMove);
    });
    this._outsideFn = outsideClick(this.$refs.panel, (ev) => {
      this.closePanel();
    });
  }
  unmounted() {
    clearOutsideClick(this._outsideFn);
    unbind(document, "mouseup", this.handleUp);
  }
  render() {
    return html`
      <div class="color-picker">
        <section class="preview alpha-bg" @click=${this.toggleColorPanel}>
          <span style="background-color:${this.#value}" tabindex="0"></span>
        </section>
        <div class="color-panel" ref="panel">
          <section class="dashboard">
            <div
              class="scene"
              style="background-color:${this.#sceneBg}"
              ref="scene"
            >
              <span
                class="thumb"
                style="left: ${this.#x}px; top:${this.#y}px"
              ></span>
            </div>
            <div class="pool">
              <span class="thumb hue-thumb" style="top:${this.#ht}px"></span>
              <input
                class="hue"
                max="360"
                min="0"
                step="1"
                type="range"
                @input=${this.hueChange}
              />
            </div>
          </section>
          <section class="alpha-box alpha-bg">
            <div
              class="bar"
              style="background:linear-gradient(to right, transparent, ${this.#alphaBg})"
            ></div>
            <span class="thumb alpha-thumb" style="left:${this.#at}%"></span>
            <input
              class="alpha"
              max="100"
              min="0"
              step="1"
              type="range"
              @input=${this.alphaChange}
            />
          </section>
          <section class="input-box">
            <input class="input" :value=${this.#value} maxlength="28" />
            <a class="clear" @click=${this.closePanel}>清除</a>
            <a tabindex="0" class="submit" @click=${this.submit}>确定</a>
          </section>
        </div>
      </div>
    `;
  }
}
Color.reg("color");
export {
  hex2hsb,
  hex2rgb,
  hsb2rgb,
  rgb2hex,
  rgb2hsb
};

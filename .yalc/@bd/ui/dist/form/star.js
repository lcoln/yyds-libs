import { nextTick, css, html, Component, classMap } from "@bd/core";
import "../icon/index.js";
class Star extends Component {
  static props = {
    value: 0,
    text: [],
    "allow-half": false,
    "show-value": false,
    disabled: false,
    clearable: false
  };
  static styles = [
    css`:host{display:flex;font-size:14px;--size: 32px;cursor:pointer;user-select:none}label{display:flex;align-items:center;line-height:1;cursor:inherit}label wc-icon{margin:0 3px;transition:transform .15s linear,color .15s linear}label wc-icon[name=star]{color:var(--color-plain-3)}label wc-icon:nth-child(1)[name=star-full],label wc-icon:nth-child(1)[name=star-half]{color:var(--star-active-1, var(--color-teal-1))}label wc-icon:nth-child(2)[name=star-full],label wc-icon:nth-child(2)[name=star-half]{color:var(--star-active-2, var(--color-teal-1))}label wc-icon:nth-child(3)[name=star-full],label wc-icon:nth-child(3)[name=star-half]{color:var(--star-active-3, var(--color-teal-1))}label wc-icon:nth-child(4)[name=star-full],label wc-icon:nth-child(4)[name=star-half]{color:var(--star-active-4, var(--color-teal-1))}label wc-icon:nth-child(5)[name=star-full],label wc-icon:nth-child(5)[name=star-half]{color:var(--star-active-5, var(--color-teal-1))}label wc-icon:hover{transform:scale(1.05)}label span{padding:2px 8px 0;margin:0 6px;color:var(--color-dark-1)}`,
    // 尺寸
    css`:host([size=s]){--size: 20px;font-size:12px}:host([size=m]){--size: 24px;font-size:12px}:host([size=l]){--size: 32px;font-size:14px}`
  ];
  #width = 32;
  #value = { i: 0, f: 0 };
  #stars = [];
  /**
   * 更新图标渲染
   * i: int
   * f: float
   */
  #updateDraw(i, f = 0) {
    let lastOne = "star-half";
    let value = this.value;
    let tmp = this.#value;
    if (i === -1) {
      i = Math.floor(value);
      f = +(value % 1).toFixed(1);
      if (i > 0 && i === value) {
        i--;
        f = 1;
      }
    } else {
      f = f < 0.5 ? 0.5 : 1;
    }
    if (!this["allow-half"]) {
      f = f > 0 ? 1 : 0;
    }
    if (i === tmp.i && f === tmp.f) {
      return;
    }
    if (f > 0.5) {
      lastOne = "star-full";
    }
    this.#stars.forEach((it, k) => {
      it.name = k < i ? "star-full" : "star";
    });
    if (f > 0) {
      this.#stars[i].name = lastOne;
    }
    this.#value = { i, f };
  }
  handleMove(ev) {
    if (this.disabled) {
      return;
    }
    if (ev.target.tagName === "WC-ICON") {
      let idx = +ev.target.dataset.idx;
      this.#updateDraw(idx, +(ev.offsetX / this.#width).toFixed(1));
    }
  }
  handleLeave() {
    if (this.disabled) {
      return;
    }
    this.#updateDraw(-1);
  }
  handleClick(ev) {
    let tmp = this.#value;
    if (this.disabled) {
      return;
    }
    if (ev.target.tagName === "WC-ICON") {
      if (this.clearable && this.value === tmp.i + tmp.f) {
        tmp.i = 0;
        tmp.f = 0;
        this.value = 0;
        this.#stars.forEach((it) => (it.name = "star", it.style.color = ""));
      } else {
        this.value = tmp.i + tmp.f;
      }
      this.$emit("change", { value: this.value });
    }
  }
  mounted() {
    this.#stars = [...this.$refs.box.children];
    this.#width = this.#stars[0].clientWidth;
  }
  render() {
    let val = this.value;
    if (this.text.length === 5) {
      val = this.text[Math.ceil(val) - 1];
    } else {
      val = val || "";
    }
    return html`
      <label
        ref="box"
        @mousemove=${this.handleMove}
        @mouseleave=${this.handleLeave}
        @click=${this.handleClick}
      >
        <wc-icon data-idx="0" name="star"></wc-icon>
        <wc-icon data-idx="1" name="star"></wc-icon>
        <wc-icon data-idx="2" name="star"></wc-icon>
        <wc-icon data-idx="3" name="star"></wc-icon>
        <wc-icon data-idx="4" name="star"></wc-icon>
        <span class="text">${this["show-value"] ? val : ""}</span>
      </label>
    `;
  }
}
Star.reg("star");

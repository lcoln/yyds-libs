import { css, html, Component, styleMap, bind, unbind } from "@bd/core";
import "../icon/index.js";
class ImagePreview extends Component {
  static props = {
    list: {
      type: Array,
      default: [],
      attribute: false
    },
    visible: false,
    "max-zoom": 3,
    "min-zoom": 1 / 3
  };
  active = 0;
  static styles = css`:host{z-index:1;position:fixed;display:none;width:100%;height:100%;top:0;left:0;background:rgba(0,0,0,.5)}:host([visible]){display:block}.wrapper{display:flex;justify-content:center;align-items:center;width:100%;height:100%}img{user-select:none;max-height:100%;max-width:100%}img.show{display:block}img.hide{display:none}.toggle-btn{user-select:none;cursor:pointer;position:absolute;display:flex;align-items:center;justify-content:center;opacity:.8;width:44px;height:44px;font-size:24px;color:#fff;background-color:#606266;border-color:#fff;border-radius:50%;--size: 22px}.left,.right{top:50%;transform:translateY(-50%)}.left{left:5%}.right{right:5%}.close{top:5%;right:5%}.tools-bar{display:flex;align-items:center;justify-content:space-around;position:absolute;bottom:30px;left:50%;width:282px;height:44px;padding:0 23px;background-color:#606266;border-color:#fff;color:#e5e5e5;border-radius:22px;transform:translateX(-50%);--size: 22px}.tools-bar wc-icon{cursor:pointer}`;
  pre() {
    this.toggleImage(this.active - 1);
  }
  next() {
    this.toggleImage(this.active + 1);
  }
  toggleImage(index) {
    this.active = index;
    if (this.active < 0) {
      this.active = this.list.length - 1;
    }
    if (this.active > this.list.length - 1) {
      this.active = 0;
    }
    this.resetState();
  }
  zoomIn() {
    this.#state.duration = 0.2;
    this.setZoom(this.#state.scale * 1.2);
  }
  zoomOut() {
    this.#state.duration = 0.2;
    this.setZoom(this.#state.scale / 1.2);
  }
  setZoom(val) {
    const maxZoom = this["max-zoom"];
    const minZoom = this["min-zoom"];
    val = Math.max(val, minZoom);
    val = Math.min(val, maxZoom);
    val = val.toFixed(2);
    this.#state.scale = val;
    this.$requestUpdate();
  }
  resetState() {
    this.#setState({
      scale: 1,
      rotate: 0,
      duration: 0,
      x: 0,
      y: 0
    });
    this.$refs.resetBtn.name = this.$refs.resetBtn.name === "fullScreen" ? "scaleToOriginal" : "fullScreen";
    this.$requestUpdate();
  }
  rotateLeft() {
    this.setRotate(this.#state.rotate - 90);
  }
  rotateRight() {
    this.setRotate(this.#state.rotate + 90);
  }
  setRotate(val) {
    this.#setState({
      duration: 0.2,
      rotate: val
    });
  }
  close() {
    this.visible = false;
  }
  #state = {
    scale: 1,
    rotate: 0,
    duration: 0.2,
    x: 0,
    y: 0
  };
  #setState(data) {
    Object.assign(this.#state, data);
    this.$requestUpdate();
  }
  mounted() {
    this.$on("wheel", (e) => {
      e.preventDefault();
      let { scale } = this.#state;
      this.#setState({
        duration: 0
      });
      scale = e.wheelDelta > 0 ? +scale + 0.08 : scale - 0.08;
      this.setZoom(scale);
    });
    bind(this.$refs.images, "mousedown", (e) => {
      let { clientX: startX, clientY: startY } = e;
      let { x, y } = this.#state;
      const onmousemove = bind(document, "mousemove", (e2) => {
        e2.preventDefault();
        let { clientX, clientY } = e2;
        let deltaX = clientX - startX;
        let deltaY = clientY - startY;
        this.#setState({
          x: deltaX + x,
          y: deltaY + y
        });
      });
      const onmouseup = bind(document, "mouseup", (_) => {
        unbind(document, "mousemove", onmousemove);
        unbind(document, "mouseup", onmouseup);
      });
    });
  }
  render() {
    let { scale, rotate, duration, x, y } = this.#state;
    let styles = styleMap({
      transform: `scale(${scale}) rotate(${rotate}deg) `,
      transition: `transform ${duration}s ease-in-out`
    });
    let translate = styleMap({
      transform: `translate(${x}px, ${y}px)`
    });
    return html`
      <div class="wrapper">
        <div class="images" ref="images" style=${translate}>
          ${this.list.map(
      (url, index) => html`<img
                class="img"
                loading="auto"
                style=${index === this.active ? styles : ""}
                class=${index === this.active ? "show" : "hide"}
                src=${url}
              />`
    )}
        </div>
        <div class="left toggle-btn" @click=${this.pre}>
          <wc-icon name="left"></wc-icon>
        </div>
        <div class="right toggle-btn" @click=${this.next}>
          <wc-icon name="right"></wc-icon>
        </div>
        <div class="close toggle-btn" @click=${this.close}>
          <wc-icon name="close"></wc-icon>
        </div>
        <div class="tools-bar">
          <wc-icon name="zoomIn" @click=${this.zoomIn}></wc-icon>
          <wc-icon name="zoomOut" @click=${this.zoomOut}></wc-icon>
          <wc-icon
            name="fullScreen"
            ref="resetBtn"
            @click=${this.resetState}
          ></wc-icon>
          <wc-icon name="refreshLeft" @click=${this.rotateLeft}></wc-icon>
          <wc-icon name="refreshRight" @click=${this.rotateRight}></wc-icon>
        </div>
      </div>
    `;
  }
}
ImagePreview.reg("image-preview");
const instance = new ImagePreview();
document.body.appendChild(instance);
window.imagePreview = function(options) {
  if (Array.isArray(options)) {
    instance.list = options;
  } else {
    Object.assign(instance, options);
  }
  instance.visible = true;
  return instance;
};

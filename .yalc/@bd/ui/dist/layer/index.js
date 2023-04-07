import {
  css,
  html,
  Component,
  bind,
  unbind,
  nextTick,
  styleMap
} from "@bd/core";
import "../form/input.js";
import Drag from "../drag/core.js";
let uniqueInstance = null;
let toastInstance = null;
const LANG_TITLE = "\u63D0\u793A";
const LANG_BTNS = ["\u53D6\u6D88", "\u786E\u5B9A"];
const UNIQUE_TYPES = ["alert", "confirm", "prompt"];
const BUILDIN_TYPES = UNIQUE_TYPES.concat(["notify", "toast"]);
class Layer extends Component {
  static props = {
    type: {
      type: String,
      default: null,
      observer(v) {
        this.#wrapped = !BUILDIN_TYPES.includes(v);
      }
    },
    fixed: false,
    mask: false,
    "mask-close": false,
    title: { type: String, default: "", attribute: false },
    content: { type: String, default: "", attribute: false },
    btns: []
  };
  static styles = [
    css`:host{display:none;justify-content:center;align-items:center;position:fixed;z-index:65534;left:0;top:0;width:100%;height:0}:host([type]){display:flex}.noselect{-webkit-touch-callout:none;user-select:none}.noselect img,.noselect a{-webkit-user-drag:none}`,
    css`.layer{overflow:hidden;flex:0 auto;position:relative;z-index:65535;border-radius:3px;color:#666;font-size:14px;background:rgba(255,255,255,.8);box-shadow:0 5px 20px rgba(0,0,0,.3);transition:opacity .2s ease-in-out,left .2s ease-in-out,right .2s ease-in-out,top .2s ease-in-out,bottom .2s ease-in-out}.layer.scale{transform:scale(1.01);transition:transform .1s linear}.layer:active{z-index:65536}`,
    /* 弹层样式 */
    css`.layer__title{display:flex;justify-content:space-between;align-items:center;width:100%;height:60px;padding:15px;font-size:16px;color:var(--color-dark-2)}.layer__title wc-icon{--size: 14px}.layer__title wc-icon:hover{color:var(--color-red-1)}.layer__content{display:flex;position:relative;width:100%;height:auto;min-height:50px;word-break:break-all;word-wrap:break-word}::slotted(.layer__content__input){flex:1}::slotted(.layer__content__toast){display:flex;align-items:center;width:300px;padding:0 10px !important;border-radius:3px;font-weight:normal;text-indent:8px;--size: 16px;color:var(--color-dark-1)}::slotted(.layer__content__toast.style-info){border:1px solid #ebeef5;background:#edf2fc;color:var(--color-grey-3)}::slotted(.layer__content__toast.style-success){border:1px solid #e1f3d8;background:#f0f9eb;color:var(--color-green-3)}::slotted(.layer__content__toast.style-warning){border:1px solid #faebb4;background:#faecd8;color:var(--color-red-1)}::slotted(.layer__content__toast.style-error){border:1px solid #f5c4c4;background:#fde2e2;color:var(--color-red-1)}.layer__ctrl{display:flex;justify-content:flex-end;width:100%;height:60px;padding:15px;line-height:30px;font-size:14px;color:#454545;text-align:right}.layer__ctrl button{min-width:64px;height:30px;padding:0 10px;margin:0 5px;border:1px solid var(--color-plain-3);border-radius:3px;white-space:nowrap;background:#fff;font-size:inherit;font-family:inherit;outline:none;color:inherit}.layer__ctrl button:hover{background:var(--color-plain-1)}.layer__ctrl button:active{border-color:var(--color-grey-1)}.layer__ctrl button:focus{box-shadow:0 0 0 2px var(--color-plain-a)}.layer__ctrl button:last-child{color:#fff;background:var(--color-teal-2);border-color:rgba(0,0,0,0)}.layer__ctrl button:last-child:hover{background:var(--color-teal-1)}.layer__ctrl button:last-child:active{background:var(--color-teal-3)}.layer__ctrl button:last-child:focus{box-shadow:0 0 0 2px var(--color-teal-a)}.layer__ctrl button::-moz-focus-inner{border:none}`,
    css`:host([mask]){height:100%;background:rgba(255,255,255,.15);backdrop-filter:blur(5px)}:host([type=alert]) .layer,:host([type=confirm]) .layer,:host([type=prompt]) .layer{max-width:600px;min-width:300px;background:#fff}:host([type=alert]) .layer__content,:host([type=confirm]) .layer__content,:host([type=prompt]) .layer__content{padding:0 15px}:host([type=notify]) .layer{width:300px;height:120px}:host([type=notify]) .layer__content{padding:0 15px}:host([type=toast]) .layer{box-shadow:none}:host([type=toast]) .layer__content{min-height:40px}:host([blurry]) .layer{backdrop-filter:blur(5px)}`
  ];
  #wrapped = false;
  #dragIns = null;
  #resolve = null;
  #reject = null;
  constructor() {
    super();
    this.promise = new Promise((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
    });
    this.promise.host = this;
  }
  #toggleDrag() {
    if (UNIQUE_TYPES.includes(this.type)) {
      return;
    }
    if (this.fixed) {
      if (this.#dragIns) {
        this.#dragIns.destroy();
        this.#dragIns = null;
      }
      return;
    }
    let $title = this.$refs.box.firstElementChild;
    this.#dragIns = new Drag(this.$refs.box).by($title, {
      overflow: !!this.overflow
    });
  }
  #intercept(value) {
    if (this.intercept) {
      this.intercept(value, (_) => {
        delete this.intercept;
        this.#resolve(value);
        this.$refs.box.$animate(true).then((_2) => this.close());
      });
    } else {
      this.#resolve(value);
      this.$refs.box.$animate(true).then((_) => this.close());
    }
  }
  mounted() {
    if (this.type === "prompt") {
      this.$refs.input = this.firstElementChild;
      bind(this.$refs.input, "submit", (ev) => {
        this.#intercept(ev.target.value);
      });
    }
    if (this.mask) {
      this.$on("click", (ev) => {
        let path = ev.composedPath();
        if (path[0] === ev.currentTarget) {
          if (UNIQUE_TYPES.includes(this.type)) {
            this.$refs.box.classList.toggle("scale", true);
            setTimeout((_) => {
              this.$refs.box.classList.remove("scale");
            }, 100);
          } else if (this["mask-close"]) {
            if (this.#wrapped === false) {
              this.#reject();
            }
            this.close();
          }
        }
      });
      if (this["mask-color"]) {
        this.style.backgroundColor = this["mask-color"];
      }
    }
    this.#toggleDrag();
    this.$refs.box.$animate();
  }
  updated() {
    this.$refs.box.$animate();
  }
  show() {
    if (this.#wrapped) {
      this.type = "common";
    }
  }
  /**
   * 关闭实例
   * @param force {Boolean} 是否强制关闭
   */
  close(force) {
    if (this.#wrapped) {
      this.type = null;
      this.$emit("close");
    } else {
      if (this.#dragIns) {
        this.#dragIns.destroy();
      }
      if (UNIQUE_TYPES.includes(this.type)) {
        uniqueInstance = null;
      }
      if (this.from && !force) {
        let _style = "opacity:0;";
        for (let k in this.from) {
          _style += `${k}:${this.from[k]};`;
        }
        this.$refs.box.style.cssText += _style;
        this.timer = setTimeout(() => {
          this.$emit("close");
          this.remove();
        }, 200);
      } else {
        clearTimeout(this.timer);
        this.$emit("close");
        this.remove();
      }
    }
  }
  // 按钮的点击事件
  handleBtnClick(ev) {
    if (ev.target.tagName === "BUTTON" || ev.target.className === "notify-button") {
      let idx = +ev.target.dataset.idx || 0;
      switch (this.type) {
        case "alert":
          this.#intercept(null);
          break;
        case "confirm":
        case "prompt":
          if (idx === 0) {
            this.#reject();
            this.$refs.box.$animate(true).then((_) => this.close());
          } else {
            let value = this.type === "prompt" ? this.$refs.input.value : null;
            this.#intercept(value);
          }
          break;
        default:
          this.#intercept(idx);
          break;
      }
    }
  }
  render() {
    return html`
      <div ref="box" #animation=${{ type: "micro-bounce" }} class="layer">
        <div
          class="layer__title noselect"
          style=${styleMap({ display: !!this.title ? "" : "none" })}
        >
          ${this.title}
          ${this.type === "notify" ? html`<wc-icon
                name="close"
                class="notify-button"
                @click=${this.handleBtnClick}
              ></wc-icon>` : ""}
        </div>
        <div class="layer__content">
          <slot></slot>
        </div>
        <div
          class="layer__ctrl noselect"
          style=${styleMap({ display: this.btns.length ? "" : "none" })}
          @click=${this.handleBtnClick}
        >
          ${this.btns.map((s, i) => html`<button data-idx=${i}>${s}</button>`)}
        </div>
      </div>
    `;
  }
}
function layer(opt = {}) {
  let layDom = document.createElement("wc-layer");
  let { type = "common", content = "" } = opt;
  if (type === "toast") {
    opt = {
      type,
      content,
      from: { top: 0 },
      to: { top: "30px" }
    };
    if (toastInstance) {
      toastInstance.close(true);
    }
    toastInstance = layDom;
  } else {
    layDom.mask = opt.mask;
    if (opt.btns === false) {
      layDom.btns = [];
    } else if (opt.btns && opt.btns.length) {
      layDom.btns = opt.btns;
    } else {
      layDom.btns = LANG_BTNS.concat();
    }
    if (opt.intercept && typeof opt.intercept === "function") {
      layDom.intercept = opt.intercept;
    }
    layDom.mask = opt.mask;
    layDom["mask-close"] = opt["mask-close"];
    if (opt.hasOwnProperty("overflow")) {
      layDom.overflow = opt.overflow;
    }
    layDom["mask-color"] = opt["mask-color"];
    layDom.blur = opt.blur;
    layDom.radius = opt.radius;
    layDom.background = opt.background;
    if (opt.size && typeof opt.size === "object") {
      layDom.size = opt.size;
    }
    if (UNIQUE_TYPES.includes(opt.type)) {
      if (uniqueInstance) {
        uniqueInstance.close(true);
      }
      uniqueInstance = layDom;
    }
  }
  if (opt.to && typeof opt.to === "object") {
    layDom.to = opt.to;
    if (opt.from && typeof opt.from === "object") {
      layDom.from = opt.from;
    } else {
      layDom.from = opt.to;
    }
  }
  layDom.type = opt.type;
  layDom.title = opt.title;
  layDom.fixed = !!opt.fixed;
  layDom.innerHTML = content;
  document.body.appendChild(layDom);
  return layDom.promise;
}
layer.alert = function(content, title = LANG_TITLE, btns = LANG_BTNS.slice(1)) {
  if (typeof title === "object") {
    btns = title;
    title = LANG_TITLE;
  }
  return this({
    type: "alert",
    title,
    content,
    mask: true,
    btns
  });
};
layer.confirm = function(content, title = LANG_TITLE, btns = LANG_BTNS.concat()) {
  if (typeof title === "object") {
    btns = title;
    title = LANG_TITLE;
  }
  return this({
    type: "confirm",
    title,
    content,
    mask: true,
    btns
  });
};
layer.prompt = function(title = LANG_TITLE, defaultValue = "", intercept) {
  if (typeof defaultValue === "function") {
    intercept = defaultValue;
    defaultValue = "";
  }
  if (!intercept) {
    intercept = function(val, done) {
      if (val) {
        done();
      }
    };
  }
  return this({
    type: "prompt",
    title,
    content: `<wc-input autofocus class="layer__content__input" value="${defaultValue}"></wc-input>`,
    mask: true,
    intercept,
    btns: LANG_BTNS.concat()
  });
};
layer.notify = function(content) {
  return this({
    type: "notify",
    title: "\u901A\u77E5",
    content,
    blur: true,
    from: { right: "-300px", top: 0 },
    to: { right: 0 }
  });
};
layer.toast = function(txt, type = "info") {
  var ico = type;
  switch (type) {
    case "info":
    case "warning":
      break;
    case "error":
      ico = "deny";
      break;
    case "success":
      ico = "get";
      break;
    default:
      ico = "info";
  }
  return this({
    content: `
      <div class="layer__content__toast style-${type}">
        <wc-icon is="${ico}"></wc-icon>
        <span class="toast-txt">${txt}</span>
      </div>`,
    type: "toast"
  });
};
Layer.reg("layer");
window.layer = layer;

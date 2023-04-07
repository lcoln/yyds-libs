import { $, bind, unbind, fire } from "@bd/core";
const DEF_OPT = {
  axis: "",
  // x | y | xy 拖拽方向
  limit: false,
  // false | window | parent 拖拽范围
  overflow: true
  // 是否可拖拽出可视区外
};
class Drag {
  constructor(elem) {
    this.$elem = elem;
    this.#init();
  }
  #init() {
    this.$elem.style.transform = "";
    var { x, y } = this.$elem.getBoundingClientRect();
    this.pos = { x, y, _x: 0, _y: 0 };
  }
  // drag by
  by(node, opt = {}) {
    this.$drag = node;
    this.opt = Object.assign(/* @__PURE__ */ Object.create(null), DEF_OPT, opt);
    if (this.opt.limit !== false) {
      this.opt.overflow = false;
    }
    node.style.cursor = "move";
    this._handleResize = bind(window, "resize", this.#init.bind(this));
    this._handleMousedown = bind(node, "mousedown", (ev) => {
      if (this.disabled) {
        return;
      }
      var bcr = this.$elem.getBoundingClientRect();
      if (bcr.x - this.pos._x !== this.pos.x) {
        this.pos.x = bcr.x - this.pos._x;
      }
      if (bcr.y - this.pos._y !== this.pos.y) {
        this.pos.y = bcr.y - this.pos._y;
      }
      let mx = ev.pageX;
      let my = ev.pageY;
      let ww = document.documentElement.clientWidth;
      let wh = document.documentElement.clientHeight;
      let tw = bcr.width;
      let th = bcr.height;
      let limit = [0, ww - tw, wh - th, 0];
      if (this.opt.limit === "parent") {
        let pbcr = this.$elem.parentNode.getBoundingClientRect();
        limit = [pbcr.top, pbcr.right - tw, pbcr.bottom - th, pbcr.left];
      }
      let handleMove = bind(document, "mousemove", (ev2) => {
        ev2.preventDefault();
        let _x = ev2.pageX - mx + (bcr.x - this.pos.x);
        let _y = ev2.pageY - my + (bcr.y - this.pos.y);
        if (this.opt.axis === "x") {
          _y = 0;
        }
        if (this.opt.axis === "y") {
          _x = 0;
        }
        if (this.opt.overflow === false) {
          if (_x < limit[3] - this.pos.x) {
            _x = limit[3] - this.pos.x;
          } else if (_x > limit[1] - this.pos.x) {
            _x = limit[1] - this.pos.x;
          }
          if (_y < limit[0] - this.pos.y) {
            _y = limit[0] - this.pos.y;
          } else if (_y > limit[2] - this.pos.y) {
            _y = limit[2] - this.pos.y;
          }
        }
        this.pos._x = _x;
        this.pos._y = _y;
        fire(this.$elem, "dragging", {
          offset: {
            x: this.pos.x + _x,
            y: this.pos.y + _y
          },
          moved: { x: _x, y: _y }
        });
        this.$elem.style.transform = `translate(${_x}px, ${_y}px)`;
      });
      let handleUp = bind(document, "mouseup", (ev2) => {
        fire(this.$elem, "dragged", {
          offset: {
            x: this.pos.x + this.pos._x,
            y: this.pos.y + this.pos._y
          },
          moved: { x: this.pos._x, y: this.pos._y }
        });
        unbind(document, "mousemove", handleMove);
        unbind(document, "mouseup", handleUp);
      });
    });
    return this;
  }
  destroy() {
    unbind(window, "resize", this._handleResize);
    unbind(this.$drag, "mousedown", this._handleMousedown);
  }
}
export {
  Drag as default
};

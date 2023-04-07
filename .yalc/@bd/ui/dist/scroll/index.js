import { css, html, bind, unbind, Component } from "@bd/core";
class Scroll extends Component {
  static props = {
    axis: "xy",
    // 滚动方向, 默认x轴和y轴都可以滚动
    delay: 1e3,
    // 节流防抖延迟
    distance: 1
    // 触发距离阀值, 单位像素
  };
  static styles = [
    css`:host{position:relative;display:block;width:100%;height:100%}:host .container{overflow:hidden;position:relative;width:100%;height:100%;max-height:inherit}:host .wrapper{overflow:auto;scrollbar-width:none;width:100%;height:100%;max-height:inherit;scrollbar-width:0}:host .wrapper::-webkit-scrollbar{display:none}:host .content{min-width:100%;width:fit-content;height:fit-content}`,
    css`.is-horizontal,.is-vertical{visibility:hidden;position:absolute;display:flex;justify-content:flex-end;opacity:0;user-select:none;transition:opacity .3s linear,visibility .3s linear}.is-horizontal .thumb,.is-vertical .thumb{display:block;border-radius:5px;background:rgba(44,47,53,.25);cursor:default;transition:width .1s linear,height .1s linear}.is-horizontal .thumb:hover,.is-vertical .thumb:hover{background:rgba(44,47,53,.5)}.is-horizontal{flex-direction:column;left:0;bottom:0;width:100%;height:10px}.is-horizontal .thumb{width:0;height:6px}.is-horizontal .thumb:hover{height:10px}.is-vertical{top:0;right:0;width:10px;height:100%}.is-vertical .thumb{width:6px;height:0}.is-vertical .thumb:hover{width:10px}`,
    css`:host(:hover) .is-horizontal,:host(:hover) .is-vertical{visibility:visible;opacity:1}:host([axis=x]) .wrapper{overflow-y:hidden}:host([axis=x]) .is-vertical{display:none}:host([axis=y]) .wrapper{overflow-x:hidden}:host([axis=y]) .is-horizontal{display:none}:host([disabled]) .wrapper{overflow:hidden}:host([disabled]) .is-vertical,:host([disabled]) .is-horizontal{display:none}`
  ];
  stamp = 0;
  cache = {
    xBar: 0,
    // 横轴长度
    yBar: 0,
    // 纵轴长度
    thumbX: 0,
    //横向条滚动距离
    thumbY: 0
    // 纵向条滚动距离
  };
  get scrollTop() {
    return this.$refs.box?.scrollTop || 0;
  }
  set scrollTop(n) {
    n = +n;
    if (n === n) {
      this.$refs.box.scrollTop = n;
    }
  }
  get scrollLeft() {
    return this.$refs.box?.scrollLeft || 0;
  }
  set scrollLeft(n) {
    n = +n;
    if (n === n) {
      this.$refs.box.scrollLeft = n;
    }
  }
  get scrollHeight() {
    return this.$refs.box?.scrollHeight;
  }
  get scrollWidth() {
    return this.$refs.box?.scrollWidth;
  }
  __init__(ev) {
    let width = this.offsetWidth;
    let height = this.offsetHeight;
    let scrollWidth = this.scrollWidth;
    let scrollHeight = this.scrollHeight;
    let yBar = 50;
    let xBar = 50;
    this.scrollLeft = 0;
    this.scrollTop = 0;
    yBar = height * (height / scrollHeight) >> 0;
    xBar = width * (width / scrollWidth) >> 0;
    if (yBar < 50) {
      yBar = 50;
    }
    if (xBar < 50) {
      xBar = 50;
    }
    if (xBar >= width) {
      xBar = 0;
    }
    if (yBar >= height) {
      yBar = 0;
    }
    this.cache.yBar = yBar;
    this.cache.xBar = xBar;
    if (xBar > 0) {
      this.$refs.x.parentNode.style.display = "flex";
      this.$refs.x.style.width = xBar + "px";
    } else {
      this.$refs.x.parentNode.style.display = "none";
    }
    if (yBar > 0) {
      this.$refs.y.parentNode.style.display = "flex";
      this.$refs.y.style.height = yBar + "px";
    } else {
      this.$refs.y.parentNode.style.display = "none";
    }
  }
  _fetchScrollX(moveX) {
    let { xBar } = this.cache;
    let { scrollWidth, offsetWidth: width } = this;
    if (moveX < 0) {
      moveX = 0;
    } else if (moveX > width - xBar) {
      moveX = width - xBar;
    }
    this.scrollLeft = (scrollWidth - width) * (moveX / (width - xBar));
    this.$refs.x.style.transform = `translateX(${moveX}px)`;
    return moveX;
  }
  _fetchScrollY(moveY) {
    let { yBar } = this.cache;
    let { scrollHeight, offsetHeight: height } = this;
    if (moveY < 0) {
      moveY = 0;
    } else if (moveY > height - yBar) {
      moveY = height - yBar;
    }
    this.scrollTop = (scrollHeight - height) * (moveY / (height - yBar));
    this.$refs.y.style.transform = `translateY(${moveY}px)`;
    return moveY;
  }
  _fireReachEnd(action = "reach-bottom") {
    let delay = this.delay;
    let { scrollHeight, offsetHeight: height } = this;
    let top = this.scrollTop;
    let now = Date.now();
    if (now - this.stamp > delay) {
      if (action === "reach-bottom") {
        if (height + top < scrollHeight) {
          return;
        }
      } else {
        if (top > 0) {
          return;
        }
      }
      this.stamp = now;
      this.$emit(action);
    }
  }
  mounted() {
    let startX, startY, moveX, moveY, mousemoveFn = (ev) => {
      let { thumbY, thumbX } = this.cache;
      if (startX !== void 0) {
        moveX = this._fetchScrollX(thumbX + ev.pageX - startX);
      }
      if (startY !== void 0) {
        moveY = this._fetchScrollY(thumbY + ev.pageY - startY);
      }
    }, mouseupFn = (ev) => {
      if (Math.abs(ev.pageY - startY) > this.distance) {
        this._fireReachEnd(ev.pageY > startY ? "reach-bottom" : "reach-top");
      }
      startX = void 0;
      startY = void 0;
      this.cache.thumbX = moveX || 0;
      this.cache.thumbY = moveY || 0;
      delete this._active;
      unbind(document, "mousemove", mousemoveFn);
      unbind(document, "mouseup", mouseupFn);
    };
    bind(this.$refs.box, "scroll", (ev) => {
      ev.stopPropagation();
      if (this._active) {
        return;
      }
      let { xBar, yBar, thumbX, thumbY } = this.cache;
      let {
        axis,
        scrollHeight,
        scrollWidth,
        offsetHeight: height,
        offsetWidth: width,
        scrollTop,
        scrollLeft
      } = this;
      if (xBar === 0 && yBar === 0) {
        return;
      }
      if (axis === "y" || axis === "xy") {
        if (yBar) {
          let fixedY = ~~(scrollTop / (scrollHeight - height) * (height - yBar));
          if (fixedY !== thumbY) {
            this.cache.thumbY = fixedY;
            this.$refs.y.style.transform = `translateY(${fixedY}px)`;
            if (Math.abs(fixedY - thumbY) > this.distance) {
              this._fireReachEnd(fixedY > thumbY ? "reach-bottom" : "reach-top");
            }
          }
        }
      }
      if (axis === "x" || axis === "xy") {
        if (xBar) {
          let fixedX = ~~(scrollLeft / (scrollWidth - width) * (width - xBar));
          if (fixedX !== thumbX) {
            this.cache.thumbX = fixedX;
            this.$refs.x.style.transform = `translateX(${fixedX}px)`;
          }
        }
      }
      this.$emit("scroll");
    });
    bind(this.$refs.y, "mousedown", (ev) => {
      startY = ev.pageY;
      this._active = true;
      bind(document, "mousemove", mousemoveFn);
      bind(document, "mouseup", mouseupFn);
    });
    bind(this.$refs.x, "mousedown", (ev) => {
      startX = ev.pageX;
      this._active = true;
      bind(document, "mousemove", mousemoveFn);
      bind(document, "mouseup", mouseupFn);
    });
    this.__observer = new ResizeObserver(this.__init__.bind(this));
    this.__observer.observe(this.$refs.cont);
  }
  unmounted() {
    this.__observer.disconnect();
  }
  render() {
    return html`
      <div class="container">
        <div class="wrapper" ref="box">
          <div class="content" ref="cont"><slot></slot></div>
        </div>
      </div>
      <div class="is-horizontal">
        <span ref="x" class="thumb"></span>
      </div>
      <div class="is-vertical">
        <span ref="y" class="thumb"></span>
      </div>
    `;
  }
}
Scroll.reg("scroll");

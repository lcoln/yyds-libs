import { css, html, Component, nextTick, styleMap } from "@bd/core";
const ANIMATION = {
  left: {
    custom: [
      { transform: " translateX(-100%)" },
      { transform: " translateX(0)" }
    ]
  },
  right: {
    custom: [
      { transform: " translateX(100%)" },
      { transform: " translateX(0)" }
    ]
  },
  top: {
    custom: [
      { transform: " translateY(-100%)" },
      { transform: " translateY(0)" }
    ]
  },
  bottom: {
    custom: [
      { transform: " translateY(100%)" },
      { transform: " translateY(0)" }
    ]
  }
};
class Drawer extends Component {
  static animation = {};
  static props = {
    title: "",
    from: "right",
    visible: {
      type: Boolean,
      default: false,
      observer(v) {
        this.$animate(!v);
        this.$refs.drawer.$animate(!v);
      }
    },
    width: "",
    height: "",
    "mask-close": false
  };
  static styles = [
    css`:host{position:fixed;left:0;top:0;z-index:9;width:100%;height:100%;background:rgba(0,0,0,.3)}.drawer{display:flex;flex-direction:column;position:absolute;width:50%;height:100%;font-size:14px;background:#fff;box-shadow:0 0 24px rgba(0,0,0,.2)}.header{display:flex;align-items:center;justify-content:space-between;padding:16px;font-size:16px;color:var(--color-dark-2);user-select:none}.header wc-icon{--size: 16px;margin-right:8px;color:var(--color-grey-3);cursor:pointer}.wrapper{flex:1;padding:16px}`,
    css`:host([from=left]) .drawer,:host([from=right]) .drawer{top:0;width:50%;height:100%}:host([from=top]) .drawer,:host([from=bottom]) .drawer{left:0;width:100%;height:50%}:host([from=left]) .drawer{left:0}:host([from=right]) .drawer{right:0}:host([from=top]) .drawer{top:0}:host([from=bottom]) .drawer{bottom:0}`
  ];
  closeDrawer() {
    this.$emit("close");
  }
  mounted() {
    this.$on("click", (ev) => {
      let path = ev.composedPath();
      if (path[0] === ev.currentTarget && this["mask-close"]) {
        this.closeDrawer();
      }
    });
  }
  render() {
    let style = {};
    if ((this.from === "left" || this.from === "right") && this.width) {
      style = { width: this.width };
    } else if ((this.from === "top" || this.from === "bottom") && this.height) {
      style = { height: this.height };
    }
    return html`
      <div
        class="drawer"
        style=${styleMap(style)}
        ref="drawer"
        #animation=${ANIMATION[this.from]}
      >
        <header class="header">
          <span class="title"><slot name="title">${this.title}</slot></span>
          <wc-icon name="close" @click=${this.closeDrawer}></wc-icon>
        </header>
        <main class="wrapper"><slot></slot></main>
      </div>
    `;
  }
}
Drawer.reg("drawer");

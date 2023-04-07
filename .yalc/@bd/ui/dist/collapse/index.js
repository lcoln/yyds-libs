import { css, html, Component } from "@bd/core";
import "../icon/index.js";
class Collapse extends Component {
  static props = {
    value: {
      type: String,
      default: "",
      attribute: false,
      observer(newVal, oldVal) {
        if (newVal !== oldVal && this.$children) {
          this.updateView();
        }
      }
    },
    accordion: false
  };
  static styles = [
    css`:host{display:block;border-top:1px solid #ebeef5}`
  ];
  updateView() {
    const { accordion, value } = this;
    if (accordion) {
      this.$children.forEach((item) => {
        item.show = item.name === value;
      });
    } else {
      this.$children.forEach((item) => {
        item.show = value.includes(item.name);
      });
    }
  }
  updateValue(name) {
    let { accordion, value } = this;
    if (accordion) {
      this.value = value === name ? "" : name;
    } else {
      value = value.split(",");
      !value[0] && value.shift();
      if (value.includes(name)) {
        value = value.filter((item) => item !== name);
      } else {
        value.push(name);
      }
      this.value = value;
    }
    this.$emit("change");
  }
  mounted() {
    this.$children = Array.from(this.children);
    this.updateView();
  }
}
class CollapseItem extends Component {
  static props = {
    name: "",
    title: "",
    disabled: false
  };
  _show = false;
  static styles = [
    css`:host{display:block;border-bottom:1px solid #ebeef5}.disabled{cursor:not-allowed;opacity:.6}.title{display:flex;height:48px;align-items:center;justify-content:space-between;background-color:#fff;color:#303133;cursor:pointer;font-size:13px;font-weight:500}.title wc-icon{margin:0 8px;--size: 12px;color:#636465;transform:rotate(0);transition:transform .2s ease-in-out}.wrapper{overflow:hidden;height:0;transition:height .2s linear}.wrapper .content{padding-bottom:20px;font-size:13px;color:#303133;line-height:1.5}`
  ];
  onClick() {
    if (this.disabled) {
      return;
    }
    this.parentNode.updateValue(this.name);
  }
  get show() {
    return this._show;
  }
  set show(val) {
    const { content, wrapper, icon } = this.$refs;
    if (!wrapper) {
      this.onMounted = () => this.show = val;
      return;
    }
    if (val) {
      wrapper.style.height = content.offsetHeight + "px";
      icon.style.transform = "rotate(90deg)";
    } else {
      wrapper.style.height = 0;
      icon.style.transform = "rotate(0deg)";
    }
    this._show = val;
  }
  mounted() {
    this.onMounted && this.onMounted();
  }
  render() {
    return html`
      <div class=${this.disabled ? "disabled" : ""}>
        <div class="title" @click=${this.onClick}>
          ${this.title ? this.title : html`<slot name="title"></slot>`}
          <wc-icon name="right" ref="icon"></wc-icon>
        </div>
        <div class="wrapper" ref="wrapper">
          <div class="content" ref="content">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}
Collapse.reg("collapse");
CollapseItem.reg("collapse-item");

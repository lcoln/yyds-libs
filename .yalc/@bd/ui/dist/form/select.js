import { nextTick, css, html, Component } from "@bd/core";
import "../icon/index.js";
import "../form/input.js";
import "../scroll/index.js";
class Select extends Component {
  static props = {
    value: {
      type: Array,
      default: [],
      attribute: false,
      observer() {
      }
    },
    disabled: false,
    readonly: false
  };
  static styles = css`.icon{margin-right:10px;--size: 14px;line-height:100%;transform:rotate(90deg);transition:transform .2s ease-in-out}.input{width:200px}.select{display:inline-block;position:relative}.select:focus-within .icon{transform:rotate(-90deg)}.select:focus-within .option-list{height:150px;border:1px solid #e4e7ed}.option-list{position:absolute;margin:5px 0;top:110%;height:150px;width:100%;z-index:1001;border-radius:4px;background-color:#fff;box-shadow:0 2px 12px 0 rgba(0,0,0,.1);transition:height .2s ease-in-out}`;
  mounted() {
    console.log("select mounted");
  }
  render() {
    return html`
      <div class="select">
        <wc-input readonly class="input">
          <wc-icon slot="append" class="icon" name="right" / >
        </wc-input>
        <wc-scroll class="option-list">
          <slot />
        </wc-scroll>
      </div>
    `;
  }
}
class Option extends Component {
  static props = {
    value: "2"
  };
  static styles = [css``];
  mounted() {
    console.log("option mounted");
  }
  onclick() {
    console.log(11);
  }
  render() {
    return html` <div ref="li">${this.value}</div> `;
  }
}
Select.reg("select");
Option.reg("option");

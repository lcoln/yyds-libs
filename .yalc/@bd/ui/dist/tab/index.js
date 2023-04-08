import { css, html, Component, nextTick } from "@bd/core";
import "../space/index.js";
class Tab extends Component {
  static props = {
    data: [],
    color: ""
  };
  #label = null;
  #content = "";
  #updateStyle(idx) {
    this.#label.forEach((it, k) => {
      it.style.color = k === idx ? this.color : "";
      it.style.borderBottom = k === idx ? `1px solid ${this.color}` : "";
    });
    this.#content = this.data[idx].children;
  }
  handleClick(ev) {
    if (ev.type === "click") {
      this.#updateStyle(ev.target.dataset.idx - 0);
    }
    console.log(3333);
    this.$emit("change", {
      idx: ev.target.dataset.idx
    });
  }
  mounted() {
    this.#label = [...this.$refs.label.children];
    nextTick(() => this.#updateStyle(0));
  }
  static styles = css`:host{display:flex}.tab-box{width:100%}.tab-box .label{margin-bottom:20px}.tab-box .label .item-group{display:flex}.tab-box .label .item-group .item{padding:5px 10px;font-weight:400;cursor:pointer}.tab-box .divider{height:1px;margin-top:-1px;background:#a9a9a9}`;
  render() {
    return html`
      <div class="tab-box">
        <div class="label">
          <wc-space>
            <div class="item-group" ref="label">
              ${this.data.map(
      (s, i) => {
        return html`<div 
                      class="item" 
                      @click=${this.handleClick} 
                      data-idx=${i}
                    >
                      ${s.label}
                    </div>`;
      }
    )}
            </div>
          </wc-space>
          <div class="divider"></div>
        </div>
        <div class="content">
          ${html`${this.#content}`}
        </div>
      </div>
    `;
  }
}
Tab.reg("tab");

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
  static styles = css`:host{display:flex}.tab-box .label{display:flex}.tab-box .label .item{padding:5px 10px;cursor:pointer}.tab-box .content{margin-top:-1px;border-top:1px solid #ccc}`;
  render() {
    return html`
      <div class="tab-box" id="aaaaa">
        <wc-space>
          <div class="label" ref="label">
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
        <div class="content">
          ${html`${this.#content}`}
        </div>
      </div>
    `;
  }
}
Tab.reg("tab");

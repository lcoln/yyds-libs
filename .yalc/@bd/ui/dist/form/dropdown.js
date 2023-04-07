import { nextTick, css, html, Component, bind } from "@bd/core";
class Dropdown extends Component {
  bar = "balbal";
  mounted() {
    console.log("Dropdown: ", this.$refs);
    bind(this.$refs.balbal, "mousedown", (ev) => {
      console.log("aa : mousedown");
    });
  }
  foo() {
    console.log("foo: click");
  }
  render() {
    return html`
      <div class="aa" ref=${this.bar} @click=${this.foo}>
        <div class="bb" ref="bb">
          <slot ref="dd"></slot>
        </div>
        <foo>dsdsd</foo>
      </div>
      <div class="cc" ref="cc">${this.bar}</div>
    `;
  }
}
Dropdown.reg("dropdown");

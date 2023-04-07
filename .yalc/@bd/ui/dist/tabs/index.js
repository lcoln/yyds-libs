import { css, html, Component } from "@bd/core";
class Tab extends Component {
  static props = {
    header: ""
  };
  static styles = css`:host{display:flex;border-radius:3px}`;
  render() {
    return html`
      <div class="tab-box">
        tab
      </div>
    `;
  }
}
Tab.reg("tab");

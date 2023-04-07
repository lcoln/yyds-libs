import { css, html, Component, styleMap } from "@bd/core";
import "../icon/index.js";
import "./preview.js";
class Image extends Component {
  static props = {
    src: "",
    fit: "fill",
    lazy: false,
    "referrer-policy": null,
    alt: {
      type: String,
      default: null
    },
    previewSrcList: {
      type: Array,
      default: [],
      attribute: false
    }
  };
  status = "loading";
  static styles = css`:host{position:relative;display:inline-block}.wc-image{width:100%;height:100%}img{position:absolute;width:100%;height:100%}.error{display:flex;width:100%;height:100%;color:#666;justify-content:center;align-items:center}`;
  onError() {
    this.status = "error";
    this.$refs.wrapper.removeChild(this.$refs.img);
    this.$requestUpdate();
  }
  onload() {
    this.status = "loaded";
    this.$requestUpdate();
  }
  onClick() {
    if (this.previewSrcList.length) {
      window.imagePreview(this.previewSrcList);
    }
  }
  render() {
    let {
      lazy,
      src,
      status,
      fit,
      alt,
      previewSrcList,
      "referrer-policy": referrerPolicy
    } = this;
    let styles = styleMap({
      "object-fit": fit,
      cursor: previewSrcList.length ? "pointer" : "default"
    });
    let $slot = "";
    if (status === "loading") {
      $slot = html`<slot name="placeholder"></slot>`;
    } else if (status === "error") {
      $slot = html`<slot name="error">
        <div class="error">FAILED</div>
      </slot>`;
    }
    return html`
      <div class="wc-image" ref="wrapper" @click=${this.onClick}>
        <img
          style=${styles}
          src=${src}
          alt=${alt}
          referrer-policy=${referrerPolicy}
          :loading=${lazy ? "lazy" : "auto"}
          @load=${this.onload}
          @error=${this.onError}
          ref="img"
        />
        ${$slot}
      </div>
    `;
  }
}
Image.reg("image");

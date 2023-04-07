const HR_LIST = ["=", "-", "_", "*"];
const LIST_RE = /^(([\+\-\*])|(\d+\.))\s/;
const TODO_RE = /^[\+\-\*]\s\[(x|\s)\]\s/;
const ESCAPE_RE = /\\([-+*_`\]\[\(\)])/g;
const QLINK_RE = /^\[(\d+)\]: ([\S]+)\s*?((['"])[\s\S]*?\4)?\s*?$/;
const TAG_RE = /<([\w\-]+)([\w\W]*?)>/g;
const ATTR_RE = /\s*?on[a-zA-Z]+="[^"]*?"\s*?/g;
const CODEBLOCK_RE = /```(.*?)([\w\W]*?)```/g;
const BLOCK_RE = /<([\w\-]+)([^>]*?)>([\w\W]*?)<\/\1>/g;
const IS_DOM_RE = /^<([\w\-]+)[^>]*?>.*?<\/\1>$/;
const STYLE_RE = /<style[^>]*?>([\w\W]*?)<\/style>/g;
const INLINE = {
  code: /`([^`]*?[^`\\\s])`/g,
  strong: [/__([\s\S]*?[^\s\\])__(?!_)/g, /\*\*([\s\S]*?[^\s\\])\*\*(?!\*)/g],
  em: [/_([\s\S]*?[^\s\\])_(?!_)/g, /\*([\s\S]*?[^\s\\*])\*(?!\*)/g],
  del: /~~([\s\S]*?[^\s\\~])~~/g,
  qlink: /\[([^\]]*?)\]\[(\d*?)\]/g,
  // 引用链接
  img: /\!\[([^\]]*?)\]\(([^)]*?)\)/g,
  a: /\[([^\]]*?)\]\(([^)]*?)(\s+"([\s\S]*?)")*?\)/g,
  qlist: /((<blockquote class="md\-quote">)*?)([\+\-\*]|\d+\.) (.*)/
  // 引用中的列表
};
const ATTR_BR_SYMBOL = "\u2A28\u2607";
const NODE_BR_SYMBOL = "\u2A28\u2936";
const ATTR_BR_EXP = new RegExp(ATTR_BR_SYMBOL, "g");
const NODE_BR_EXP = new RegExp(NODE_BR_SYMBOL, "g");
const Helper = {
  // 是否分割线
  isHr(str) {
    var s = str[0];
    if (HR_LIST.includes(s)) {
      return str.slice(0, 3) === s.repeat(3) ? str.slice(3) : false;
    }
    return false;
  },
  // 是否列表, -1不是, 1为有序列表, 0为无序列表
  isList(str) {
    var v = str.trim();
    if (LIST_RE.test(v)) {
      var n = +v[0];
      if (n === n) {
        return 1;
      } else {
        return 0;
      }
    }
    return -1;
  },
  // 是否任务列表
  isTodo(str) {
    var v = str.trim();
    if (TODO_RE.test(v)) {
      return v[3] === "x" ? 1 : 0;
    }
    return -1;
  },
  ltrim(str) {
    if (str.trimStart) {
      return str.trimStart();
    }
    return str.replace(/^\s+/, "");
  },
  isQLink(str) {
    if (QLINK_RE.test(str)) {
      return { [RegExp.$1]: { l: RegExp.$2, t: RegExp.$3 } };
    }
    return false;
  },
  isTable(str) {
    return /^\|.+?\|$/.test(str);
  },
  // 是否原生dom节点
  isNativeDom(str) {
    return IS_DOM_RE.test(str);
  }
};
const Decoder = {
  // 内联样式
  inline(str) {
    return str.replace(INLINE.code, (m, str2) => {
      str2 = str2.replace(/([_*~])/g, "\\$1");
      return `<code class="inline">${str2}</code>`;
    }).replace(INLINE.strong[0], "<strong>$1</strong>").replace(INLINE.strong[1], "<strong>$1</strong>").replace(INLINE.em[0], "<em>$1</em>").replace(INLINE.em[1], "<em>$1</em>").replace(INLINE.del, "<del>$1</del>").replace(INLINE.img, '<img src="$2" alt="$1">').replace(INLINE.a, (m1, txt, link, m2, attr = "") => {
      var tmp = attr.split(";").filter((_) => _).map((_) => {
        var a = _.split("=");
        if (a.length > 1) {
          return `${a[0]}="${a[1]}"`;
        } else {
          return `title="${_}"`;
        }
      }).join(" ");
      return `<a href="${link.trim()}" ${tmp}>${txt}</a>`;
    }).replace(INLINE.qlink, (m, txt, n) => {
      var _ = this.__LINKS__[n];
      if (_) {
        var a = _.t ? `title=${_.t}` : "";
        return `<a href="${_.l}" ${a}>${txt}</a>`;
      } else {
        return m;
      }
    }).replace(ESCAPE_RE, "$1");
  },
  // 分割线
  hr(name = "") {
    return `<fieldset class="md-hr"><legend name="${name}"></legend></fieldset>`;
  },
  // 标题
  head(str) {
    if (str.startsWith("#")) {
      return str.replace(/^(#{1,6}) (.*)/, (p, m1, m2) => {
        m2 = m2.trim();
        let level = m1.trim().length;
        let hash = m2.replace(/\s/g, "").replace(/<\/?[^>]*?>/g, "");
        if (level === 1) {
          return `<h1>${m2}</h1>`;
        } else {
          return `<h${level}><a href="#${hash}" id="${hash}" class="md-head-link">${m2}</a></h${level}>`;
        }
      });
    }
    return false;
  },
  // 引用模块
  blockquote(str) {
  },
  // 任务
  task(str) {
    var todoChecked = Helper.isTodo(str);
    if (~todoChecked) {
      var word = str.replace(TODO_RE, "").trim();
      var stat = todoChecked === 1 ? "checked" : "";
      var txt = todoChecked === 1 ? `<del>${word}</del>` : word;
      return `<section><wc-checkbox readonly ${stat}>${txt}</wc-checkbox></section>`;
    }
    return false;
  }
};
function fixed(str) {
  return str.replace(/\r\n|\r/g, "\n").replace(/\t/g, "  ").replace(/\u00a0/g, " ").replace(/\u2424/g, "\n").replace(TAG_RE, (m, name, attr) => {
    return `<${name + attr.replace(/\n/g, ATTR_BR_SYMBOL)}>`;
  }).replace(BLOCK_RE, (m, tag, attr, txt) => {
    return `<${tag + attr}>${txt.replace(/\n/g, NODE_BR_SYMBOL)}</${tag}>`;
  }).replace(CODEBLOCK_RE, (m, lang, txt) => {
    let rollback = txt.replace(NODE_BR_EXP, "\n").replace(ATTR_BR_EXP, "\n");
    return "```" + lang + rollback + "```";
  }).replace(BLOCK_RE, (m, tag, attr, txt) => {
    return `<${tag + attr.replace(ATTR_BR_EXP, " ")}>${txt.replace(NODE_BR_EXP, "\n").replace(ATTR_BR_EXP, " ")}</${tag}>`;
  });
}
class Tool {
  constructor(list, links) {
    this.list = list;
    this.__LINKS__ = links;
  }
  // 初始化字符串, 处理多余换行等
  static init(str = "") {
    var links = {};
    var list = [];
    var lines = fixed(str).split("\n");
    var isCodeBlock = false;
    var isTable = false;
    var emptyLineLength = 0;
    for (let it of lines) {
      let tmp = it.trim();
      if (tmp) {
        emptyLineLength = 0;
        if (tmp.startsWith("```")) {
          if (isCodeBlock) {
            list.push("</xmp></wc-code>");
          } else {
            list.push(
              tmp.replace(/^```([\w\#\-]*?)$/, `<wc-code lang="$1"><xmp>`)
            );
          }
          isCodeBlock = !isCodeBlock;
        } else {
          var qlink;
          if (isCodeBlock) {
            it = it.replace(/<(\/?)([a-z][a-z\d\-]*?)([^>]*?)>/g, "&lt;$1$2$3&gt;").replace("\\`\\`\\`", "```");
          } else {
            if (Helper.isTable(tmp) && !isTable) {
              var thead = tmp.split("|");
              thead.shift();
              thead.pop();
              list.push(
                `<table><thead><tr>${thead.map((_) => `<th>${_}</th>`).join("")}</tr></thead><tbody>`
              );
              isTable = true;
              continue;
            } else {
              it = it.replace(INLINE.code, (m, txt) => {
                return `\`${txt.replace(/</g, "&lt;").replace(/>/g, "&gt;")}\``;
              }).replace(/<(\/?)script[^>]*?>/g, "&lt;$1script&gt;").replace(TAG_RE, (m, name, attr = "") => {
                attr = attr.replace(ATTR_RE, " ").trim();
                if (attr) {
                  attr = " " + attr;
                }
                return `<${name}${attr}>`;
              });
              qlink = Helper.isQLink(it);
            }
          }
          if (qlink) {
            Object.assign(links, qlink);
          } else {
            list.push(it);
          }
        }
      } else {
        if (isTable) {
          isTable = false;
          list.push("</tbody></table>");
          continue;
        }
        if (list.length === 0 || !isCodeBlock && emptyLineLength > 0) {
          continue;
        }
        emptyLineLength++;
        list.push(tmp);
      }
    }
    return new this(list, links);
  }
  parse() {
    var html = "";
    var isCodeBlock = false;
    var emptyLineLength = 0;
    var isBlockquote = false;
    var isTable = false;
    var tableAlign = null;
    var blockquoteLevel = 0;
    var isParagraph = false;
    var isList = false;
    var orderListLevel = -1;
    var unorderListLevel = -1;
    var isQuoteList = false;
    var quoteListStyle = 0;
    for (let it of this.list) {
      if (it) {
        emptyLineLength = 0;
        if (~it.indexOf("<table>") || ~it.indexOf("</table>")) {
          html += it;
          isTable = !isTable;
          tableAlign = true;
          continue;
        }
        if (isTable) {
          let tmp = it.split("|").map((_) => _.trim());
          tmp.shift();
          tmp.pop();
          if (tableAlign === true) {
            tableAlign = tmp.map((a) => {
              a = a.split(/\-+/);
              if (a[0] === ":" && a[1] === ":") {
                return 'align="center"';
              }
              if (a[1] === ":") {
                return 'align="right"';
              }
              return "";
            });
            continue;
          }
          html += `<tr>${tmp.map(
            (_, i) => `<td ${tableAlign[i]}>${Decoder.inline.call(this, _)}</td>`
          ).join("")}</tr>`;
          continue;
        }
        if (~it.indexOf("<wc-code") || ~it.indexOf("wc-code>")) {
          if (isParagraph) {
            isParagraph = false;
            html += "</p>";
          }
          html += it;
          isCodeBlock = !isCodeBlock;
          continue;
        }
        if (isCodeBlock) {
          html += "\n" + it;
          continue;
        }
        let hrName = Helper.isHr(it);
        if (typeof hrName === "string") {
          html += Decoder.hr(hrName);
          continue;
        }
        it = Decoder.inline.call(this, it);
        let head = Decoder.head(it);
        if (head) {
          isParagraph = false;
          html += head;
          continue;
        }
        if (it.startsWith(">")) {
          let innerQuote;
          it = it.replace(/^(>+) /, (p, m) => {
            let len = m.length;
            let tmp = "";
            let loop = len;
            if (isBlockquote) {
              loop = len - blockquoteLevel;
            } else {
            }
            while (loop > 0) {
              loop--;
              tmp += '<blockquote class="md-quote">';
            }
            blockquoteLevel = len;
            innerQuote = !!tmp;
            return tmp;
          });
          if (isBlockquote) {
            if (innerQuote) {
              if (isQuoteList) {
                html += `</${quoteListStyle === 1 ? "ul" : "ul"}>`;
                isQuoteList = false;
              }
            }
          }
          let qListChecked = it.match(INLINE.qlist);
          if (qListChecked) {
            let tmp1 = qListChecked[1];
            let tmp2 = +qListChecked[3];
            let tmp3 = qListChecked.pop();
            let currListStyle = tmp2 === tmp2 ? 1 : 2;
            var qlist = "";
            if (isQuoteList) {
            } else {
              isQuoteList = true;
              if (currListStyle === 1) {
                qlist += "<ol>";
              } else {
                qlist += "<ul>";
              }
            }
            quoteListStyle = currListStyle;
            qlist += `<li>${tmp3}</li>`;
            html += tmp1 + qlist;
          } else {
            if (innerQuote === false) {
              html += "<br>";
            }
            html += it;
          }
          isParagraph = false;
          isBlockquote = true;
          continue;
        }
        let task = Decoder.task(it);
        if (task) {
          html += task;
          continue;
        }
        let listChecked = Helper.isList(it);
        if (~listChecked) {
          let tmp = Helper.ltrim(it);
          let ltrim = it.length - tmp.length;
          let word = tmp.replace(LIST_RE, "").trim();
          let level = Math.floor(ltrim / 2);
          let tag = listChecked > 0 ? "ol" : "ul";
          if (isList) {
            if (listChecked === 1) {
              if (level > orderListLevel) {
                html = html.replace(/<\/li>$/, "");
                html += `<${tag}><li>${word}</li>`;
              } else if (level === orderListLevel) {
                html += `<li>${word}</li>`;
              } else {
                html += `</${tag}></li><li>${word}</li>`;
              }
              orderListLevel = level;
            } else {
              if (level > unorderListLevel) {
                html = html.replace(/<\/li>$/, "");
                html += `<${tag}><li>${word}</li>`;
              } else if (level === unorderListLevel) {
                html += `<li>${word}</li>`;
              } else {
                html += `</${tag}></li><li>${word}</li>`;
              }
              unorderListLevel = level;
            }
          } else {
            html += `<${tag}>`;
            if (listChecked === 1) {
              orderListLevel = level;
            } else {
              unorderListLevel = level;
            }
            html += `<li>${word}</li>`;
          }
          isList = true;
          continue;
        }
        if (isBlockquote) {
          html += it;
          continue;
        }
        if (Helper.isNativeDom(it)) {
          html += it;
          continue;
        }
        if (isParagraph) {
          html += `${it}<br>`;
        } else {
          html += `<p>${it}<br>`;
        }
        isParagraph = true;
      } else {
        if (isCodeBlock) {
          html += it + "\n";
        } else {
          emptyLineLength++;
          if (isBlockquote) {
            isBlockquote = false;
            if (emptyLineLength > 1) {
              emptyLineLength = 0;
              while (blockquoteLevel > 0) {
                blockquoteLevel--;
                html += "</blockquote>";
              }
            }
            continue;
          }
          if (isList) {
            if (emptyLineLength > 1) {
              while (orderListLevel > -1 || unorderListLevel > -1) {
                if (orderListLevel > unorderListLevel) {
                  html += "</ol>";
                  orderListLevel--;
                } else {
                  html += "</ul>";
                  unorderListLevel--;
                }
              }
              isList = false;
              emptyLineLength = 0;
            }
            continue;
          }
          if (isParagraph) {
            if (emptyLineLength > 1) {
              isParagraph = false;
              html += "</p>";
            }
          }
        }
      }
    }
    html = html.replace(STYLE_RE, (m, code) => {
      return `<style>${code.replace(/<br>/g, "").replace(/<p>/g, "").replace(/<\/p>/g, "")}</style>`;
    });
    delete this.list;
    delete this.__LINKS__;
    return html;
  }
}
function stdin_default(str) {
  return Tool.init(str).parse();
}
export {
  stdin_default as default
};

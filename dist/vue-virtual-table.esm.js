import { ResizeObserver } from "vue-resize";
import { ObserveVisibility } from "vue-observe-visibility";
import _defineProperty from "babel-runtime/helpers/defineProperty";
import _regeneratorRuntime from "babel-runtime/regenerator";
import _asyncToGenerator from "babel-runtime/helpers/asyncToGenerator";
import _toConsumableArray from "babel-runtime/helpers/toConsumableArray";
import _slicedToArray from "babel-runtime/helpers/slicedToArray";
import _typeof from "babel-runtime/helpers/typeof";
import "vue-resize/dist/vue-resize.css";

(function() {
  if (typeof document !== "undefined") {
    var head = document.head || document.getElementsByTagName("head")[0],
      style = document.createElement("style"),
      css =
        " .virtual-scroller[data-v-5947aacc]:not(.page-mode) { overflow-y: scroll; } .item-container[data-v-5947aacc] { box-sizing: border-box; width: 100%; overflow: hidden; } .items[data-v-5947aacc] { width: 100%; } table[data-v-5947aacc] { border-collapse: collapse; table-layout: fixed; } td[data-v-5947aacc] { /*overflow: scroll;*/ } ";
    style.type = "text/css";
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  }
})();

var VirtualScroller = {
  render: function render() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      _vm.mainTag,
      {
        directives: [
          {
            name: "observe-visibility",
            rawName: "v-observe-visibility",
            value: _vm.handleVisibilityChange,
            expression: "handleVisibilityChange"
          }
        ],
        tag: "component",
        staticClass: "virtual-scroller",
        class: _vm.cssClass,
        on: { scroll: _vm.handleScroll }
      },
      [
        _vm._t("before-container"),
        _vm._v(" "),
        _c(
          _vm.containerTag,
          {
            ref: "itemContainer",
            tag: "component",
            staticClass: "item-container",
            class: _vm.containerClass,
            style: _vm.itemContainerStyle
          },
          [
            _vm._t("before-content"),
            _vm._v(" "),
            _c(
              _vm.contentTag,
              {
                ref: "items",
                tag: "component",
                staticClass: "items",
                class: _vm.contentClass,
                style: _vm.itemsStyle
              },
              [
                _vm._t("before-item"),
                _vm._v(" "),
                _vm.renderers
                  ? _vm._l(_vm.visibleItems, function(item, index) {
                      return _c(_vm.renderers[item[_vm.typeField]], {
                        key: (_vm.keysEnabled && item[_vm.keyField]) || "",
                        tag: "component",
                        staticClass: "item",
                        attrs: {
                          item: item,
                          "item-index": _vm.$_startIndex + index
                        }
                      });
                    })
                  : [
                      _vm._l(_vm.visibleItems, function(item, index) {
                        return _vm._t("default", null, {
                          item: item,
                          itemIndex: _vm.$_startIndex + index,
                          itemKey: (_vm.keysEnabled && item[_vm.keyField]) || ""
                        });
                      })
                    ]
              ],
              2
            ),
            _vm._v(" "),
            _vm._t("after-content")
          ],
          2
        ),
        _vm._v(" "),
        _vm._t("after-container"),
        _vm._v(" "),
        _c("resize-observer", { on: { notify: _vm.handleResize } })
      ],
      2
    );
  },
  staticRenderFns: [],
  _scopeId: "data-v-5947aacc",
  name: "virtual-scroller",

  components: {
    ResizeObserver: ResizeObserver
  },

  directives: {
    ObserveVisibility: ObserveVisibility
  },

  props: {
    items: {
      type: Array,
      required: true
    },
    renderers: {
      default: null
    },
    itemHeight: {
      type: [Number, String],
      default: null
    },
    typeField: {
      type: String,
      default: "type"
    },
    keyField: {
      type: String,
      default: "id"
    },
    heightField: {
      type: String,
      default: "height"
    },
    mainTag: {
      type: String,
      default: "div"
    },
    containerTag: {
      type: String,
      default: "div"
    },
    containerClass: {
      default: null
    },
    contentTag: {
      type: String,
      default: "div"
    },
    contentClass: {
      default: null
    },
    pageMode: {
      type: Boolean,
      default: false
    },
    buffer: {
      type: [Number, String],
      default: 200
    },
    poolSize: {
      type: [Number, String],
      default: 2000
    },
    prerender: {
      type: [Number, String],
      default: 0
    },
    emitUpdate: {
      type: Boolean,
      default: false
    },
    delayPreviousItems: {
      type: Boolean,
      default: false
    }
  },

  data: function data() {
    return {
      visibleItems: [],
      itemContainerStyle: null,
      itemsStyle: null,
      keysEnabled: true
    };
  },

  computed: {
    cssClass: function cssClass() {
      return {
        "page-mode": this.pageMode
      };
    },
    heights: function heights() {
      if (this.itemHeight === null) {
        var heights = {};
        var items = this.items;
        var field = this.heightField;
        var accumulator = 0;
        for (var i = 0; i < items.length; i++) {
          accumulator += items[i][field];
          heights[i] = accumulator;
        }
        return heights;
      }
    }
  },

  watch: {
    items: {
      handler: function handler() {
        this.updateVisibleItems(true);
      },

      deep: true
    },
    pageMode: function pageMode() {
      this.applyPageMode();
      this.updateVisibleItems(true);
    },

    itemHeight: "setDirty"
  },

  created: function created() {
    this.$_ready = false;
    this.$_startIndex = 0;
    this.$_oldScrollTop = null;
    this.$_oldScrollBottom = null;
    this.$_offsetTop = 0;
    this.$_height = 0;
    this.$_scrollDirty = false;
    this.$_updateDirty = false;

    var prerender = parseInt(this.prerender);
    if (prerender > 0) {
      this.visibleItems = this.items.slice(0, prerender);
      this.$_length = this.visibleItems.length;
      this.$_endIndex = this.$_length - 1;
      this.$_skip = true;
    } else {
      this.$_endIndex = 0;
      this.$_length = 0;
      this.$_skip = false;
    }
  },
  mounted: function mounted() {
    var _this = this;

    this.applyPageMode();
    this.$nextTick(function() {
      _this.updateVisibleItems(true);
      _this.$_ready = true;
    });
  },
  beforeDestroy: function beforeDestroy() {
    this.removeWindowScroll();
  },

  methods: {
    getScroll: function getScroll() {
      var el = this.$el;
      var scroll = void 0;

      if (this.pageMode) {
        var rect = el.getBoundingClientRect();
        var top = -rect.top;
        var height = window.innerHeight;
        if (top < 0) {
          height += top;
          top = 0;
        }
        if (top + height > rect.height) {
          height = rect.height - top;
        }
        scroll = {
          top: top,
          bottom: top + height
        };
      } else {
        scroll = {
          top: el.scrollTop,
          bottom: el.scrollTop + el.clientHeight
        };
      }

      if (scroll.bottom >= 0 && scroll.top <= scroll.bottom) {
        return scroll;
      } else {
        return null;
      }
    },
    updateVisibleItems: function updateVisibleItems() {
      var _this2 = this;

      var force =
        arguments.length > 0 && arguments[0] !== undefined
          ? arguments[0]
          : false;

      if (!this.$_updateDirty) {
        this.$_updateDirty = true;
        this.$nextTick(function() {
          _this2.$_updateDirty = false;

          var l = _this2.items.length;
          var scroll = _this2.getScroll();
          var items = _this2.items;
          var itemHeight = _this2.itemHeight;
          var containerHeight = void 0,
            offsetTop = void 0;
          if (scroll) {
            var startIndex = -1;
            var endIndex = -1;

            var buffer = parseInt(_this2.buffer);
            var poolSize = parseInt(_this2.poolSize);
            var scrollTop = ~~(scroll.top / poolSize) * poolSize - buffer;
            var scrollBottom =
              Math.ceil(scroll.bottom / poolSize) * poolSize + buffer;

            if (
              !force &&
              ((scrollTop === _this2.$_oldScrollTop &&
                scrollBottom === _this2.$_oldScrollBottom) ||
                _this2.$_skip)
            ) {
              _this2.$_skip = false;
              return;
            } else {
              _this2.$_oldScrollTop = scrollTop;
              _this2.$_oldScrollBottom = scrollBottom;
            }

            // Variable height mode
            if (itemHeight === null) {
              var heights = _this2.heights;
              var h = void 0;
              var a = 0;
              var b = l - 1;
              var i = ~~(l / 2);
              var oldI = void 0;

              // Searching for startIndex
              do {
                oldI = i;
                h = heights[i];
                if (h < scrollTop) {
                  a = i;
                } else if (i < l && heights[i + 1] > scrollTop) {
                  b = i;
                }
                i = ~~((a + b) / 2);
              } while (i !== oldI);
              i < 0 && (i = 0);
              startIndex = i;

              // For containers style
              offsetTop = i > 0 ? heights[i - 1] : 0;
              containerHeight = heights[l - 1];

              // Searching for endIndex
              for (
                endIndex = i;
                endIndex < l && heights[endIndex] < scrollBottom;
                endIndex++
              ) {}
              if (endIndex === -1) {
                endIndex = items.length - 1;
              } else {
                endIndex++;
                // Bounds
                endIndex > l && (endIndex = l);
              }
            } else {
              // Fixed height mode
              startIndex = ~~(scrollTop / itemHeight);
              endIndex = Math.ceil(scrollBottom / itemHeight);

              // Bounds
              startIndex < 0 && (startIndex = 0);
              endIndex > l && (endIndex = l);

              offsetTop = startIndex * itemHeight;
              containerHeight = l * itemHeight;
            }

            if (
              force ||
              _this2.$_startIndex !== startIndex ||
              _this2.$_endIndex !== endIndex ||
              _this2.$_offsetTop !== offsetTop ||
              _this2.$_height !== containerHeight ||
              _this2.$_length !== l
            ) {
              _this2.keysEnabled = !(
                startIndex > _this2.$_endIndex || endIndex < _this2.$_startIndex
              );

              _this2.itemContainerStyle = {
                height: containerHeight + "px"
              };
              _this2.itemsStyle = {
                marginTop: offsetTop + "px"
              };

              if (_this2.delayPreviousItems) {
                // Add next items
                _this2.visibleItems = items.slice(
                  _this2.$_startIndex,
                  endIndex
                );
                // Remove previous items
                _this2.$nextTick(function() {
                  _this2.visibleItems = items.slice(startIndex, endIndex);
                });
              } else {
                _this2.visibleItems = items.slice(startIndex, endIndex);
              }

              _this2.emitUpdate && _this2.$emit("update", startIndex, endIndex);

              _this2.$_startIndex = startIndex;
              _this2.$_endIndex = endIndex;
              _this2.$_length = l;
              _this2.$_offsetTop = offsetTop;
              _this2.$_height = containerHeight;
            }
          }
        });
      }
    },
    scrollToItem: function scrollToItem(index) {
      var scrollTop = void 0;
      if (this.itemHeight === null) {
        scrollTop = index > 0 ? this.heights[index - 1] : 0;
      } else {
        scrollTop = index * this.itemHeight;
      }
      this.$el.scrollTop = scrollTop;
    },
    setDirty: function setDirty() {
      this.$_oldScrollTop = null;
      this.$_oldScrollBottom = null;
    },
    applyPageMode: function applyPageMode() {
      if (this.pageMode) {
        this.addWindowScroll();
      } else {
        this.removeWindowScroll();
      }
    },
    addWindowScroll: function addWindowScroll() {
      window.addEventListener("scroll", this.handleScroll, true);
      window.addEventListener("resize", this.handleResize);
    },
    removeWindowScroll: function removeWindowScroll() {
      window.removeEventListener("scroll", this.handleScroll, true);
      window.removeEventListener("resize", this.handleResize);
    },
    handleScroll: function handleScroll() {
      var _this3 = this;

      if (!this.$_scrollDirty) {
        this.$_scrollDirty = true;
        requestAnimationFrame(function() {
          _this3.$_scrollDirty = false;
          _this3.updateVisibleItems();
        });
      }
    },
    handleResize: function handleResize() {
      this.$emit("resize");
      this.$_ready && this.updateVisibleItems();
    },
    handleVisibilityChange: function handleVisibilityChange(isVisible, entry) {
      var _this4 = this;

      if (
        this.$_ready &&
        (isVisible ||
          entry.boundingClientRect.width !== 0 ||
          entry.boundingClientRect.height !== 0)
      ) {
        this.$emit("visible");
        this.$nextTick(function() {
          _this4.updateVisibleItems();
        });
      }
    }
  }
};

(function() {
  if (typeof document !== "undefined") {
    var head = document.head || document.getElementsByTagName("head")[0],
      style = document.createElement("style"),
      css =
        ' .pop-handler[data-v-3059898e] { display: inline-block; } .pop-card[data-v-3059898e] { /*width: 150px;*/ min-width: 10px; min-height: 10px; border: 1px solid #ebeef5; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); position: absolute; top: 60px; z-index: 2001; background-color: #fff; border-radius: 5px; box-sizing: border-box; transform-origin: 0 0; } .pop-arrow[data-v-3059898e], .pop-arrow[data-v-3059898e]::after { top: -6px; position: absolute; display: block; width: 0; height: 0; border-color: transparent; border-style: solid; border-width: 6px; filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03)); margin-right: 3px; border-top-width: 0; border-bottom-color: #ebeef5; } .pop-arrow[data-v-3059898e] { left: 50px; } .pop-arrow[data-v-3059898e]::after { content: " "; margin-left: -6px; top: 1px; /*margin-left: -6px;*/ /*border-top-width: 0;*/ border-bottom-color: #fff; } .fade-enter-active[data-v-3059898e], .fade-leave-active[data-v-3059898e], .slidedown-enter-active[data-v-3059898e], .slidedown-leave-active[data-v-3059898e] { transition: all ease 0.2s; } .fade-enter[data-v-3059898e], .fade-leave-to[data-v-3059898e] { opacity: 0; } .slidedown-enter[data-v-3059898e], .slidedown-leave-to[data-v-3059898e] { transform: scaleY(0); } ';
    style.type = "text/css";
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  }
})();

var BasePopover = {
  render: function render() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticStyle: { display: "inline-block", "vertical-align": "top" } },
      [
        _c("transition", { attrs: { name: _vm.animationMode } }, [
          _vm.isShow
            ? _c(
                "div",
                {
                  directives: [
                    {
                      name: "click-out-side",
                      rawName: "v-click-out-side",
                      value: _vm.closeCard,
                      expression: "closeCard"
                    }
                  ],
                  ref: "popCard",
                  staticClass: "pop-card",
                  style: {
                    left: _vm.offset.left + "px",
                    top: _vm.offset.top + "px",
                    width: _vm.width + "px"
                  }
                },
                [
                  _vm._t("default"),
                  _vm._v(" "),
                  _c("div", {
                    staticClass: "pop-arrow",
                    style: { left: _vm.offset.arrowLeft + "px" }
                  })
                ],
                2
              )
            : _vm._e()
        ]),
        _vm._v(" "),
        _c(
          "div",
          {
            directives: [
              {
                name: "observe-visibility",
                rawName: "v-observe-visibility",
                value: _vm.setSize,
                expression: "setSize"
              }
            ],
            ref: "popHandler",
            staticClass: "pop-handler",
            on: { click: _vm.togglePop }
          },
          [_vm._t("reference")],
          2
        )
      ],
      1
    );
  },
  staticRenderFns: [],
  _scopeId: "data-v-3059898e",
  directives: {
    ObserveVisibility: ObserveVisibility,
    "click-out-side": {
      bind: function bind(el, binding, vnode) {
        el.clickOutsideEvent = function(event) {
          if (
            !(el == event.target || el.contains(event.target)) ||
            vnode.context.clickToClose
          ) {
            vnode.context[binding.expression](event);
          }
        };
        document.body.addEventListener("click", el.clickOutsideEvent);
      },
      unbind: function unbind(el) {
        document.body.removeEventListener("click", el.clickOutsideEvent);
      }
    }
  },
  props: {
    width: {
      type: Number,
      default: function _default() {
        return 120;
      }
    },
    clickToClose: {
      type: Boolean,
      default: function _default() {
        return false;
      }
    },
    animationMode: {
      type: String,
      default: function _default() {
        return "fade";
      }
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  data: function data() {
    return {
      isShow: false,
      offset: {
        left: 0,
        top: 0,
        arrowLeft: 0
      }
    };
  },

  methods: {
    togglePop: function togglePop(e) {
      if (!this.visible) {
        return;
      }
      if (this.isShow) {
        e.stopPropagation();
      }
      this.isShow = !this.isShow;
      this.$emit("showChange", this.isShow);
    },
    closeCard: function closeCard() {
      if (!this.visible) {
        return;
      }
      this.isShow = false;
      this.$emit("showChange", this.isShow);
    },
    setSize: function setSize() {
      if (!this.$refs.popHandler) {
        return;
      }
      var _$refs$popHandler = this.$refs.popHandler,
        offsetLeft = _$refs$popHandler.offsetLeft,
        offsetTop = _$refs$popHandler.offsetTop,
        offsetHeight = _$refs$popHandler.offsetHeight,
        offsetWidth = _$refs$popHandler.offsetWidth;

      var moveLeft = 0;
      if (offsetLeft + this.width > window.innerWidth) {
        moveLeft = offsetLeft + this.width - window.innerWidth;
      }
      this.offset.left = offsetLeft - moveLeft;

      this.offset.top = offsetTop + offsetHeight + 10;
      this.offset.arrowLeft = offsetWidth / 2 - 6 + moveLeft;
    }
  },
  mounted: function mounted() {
    var _this = this;

    if (!this.visible) {
      return;
    }
    this.setSize();
    window.addEventListener("resize", function(_) {
      _this.setSize();
    });
  }
};

(function() {
  if (typeof document !== "undefined") {
    var head = document.head || document.getElementsByTagName("head")[0],
      style = document.createElement("style"),
      css =
        ".base-button[data-v-cf8d2664] { font-size: 13px; display: inline-block; vertical-align: top; min-width: 55px; min-height: 28px; border-radius: 2px; outline: none; focus-outline: none; } .base-button[data-v-cf8d2664]:active { border-style: solid; } .base-button[data-v-cf8d2664]:hover { cursor: pointer; } .base-button.disabled[data-v-cf8d2664] { opacity: 0.5; cursor: not-allowed; } .plain-btn[data-v-cf8d2664] { color: #606266; background: #fff; border-color: #dcdfe6; } .plain-btn[data-v-cf8d2664]:hover { color: #3caed2; background-color: rgba(60, 174, 210, 0.1); border-color: rgba(60, 174, 210, 0.2); } .plain-btn.disabled[data-v-cf8d2664]:hover { color: #606266; background: #fff; border-color: #dcdfe6; } .primary-btn[data-v-cf8d2664] { color: #3caed2; background-color: rgba(60, 174, 210, 0.1); border-color: rgba(60, 174, 210, 0.2); } .primary-btn[data-v-cf8d2664]:hover { color: #fff; background-color: #3caed2; border-color: #3caed2; } .primary-btn.disabled[data-v-cf8d2664]:hover { color: #3caed2; background-color: rgba(60, 174, 210, 0.1); border-color: rgba(60, 174, 210, 0.2); } .danger-btn[data-v-cf8d2664] { color: #f56c6c; background-color: rgba(245, 108, 108, 0.1); border-color: rgba(245, 108, 108, 0.2); } .danger-btn[data-v-cf8d2664]:hover { color: #fff; background-color: #f56c6c; border-color: #f56c6c; } .danger-btn.disabled[data-v-cf8d2664]:hover { color: #f56c6c; background-color: rgba(245, 108, 108, 0.1); border-color: rgba(245, 108, 108, 0.2); } ";
    style.type = "text/css";
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  }
})();

var BaseButton = {
  render: function render() {
    var _class;

    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "button",
      {
        staticClass: "base-button",
        class: ((_class = {}),
        _defineProperty(_class, _vm.type + "-btn", true),
        _defineProperty(_class, "disabled", _vm.disabled),
        _class)
      },
      [_vm._t("default")],
      2
    );
  },
  staticRenderFns: [],
  _scopeId: "data-v-cf8d2664",
  props: {
    type: {
      type: String,
      default: "plain"
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
};

(function() {
  if (typeof document !== "undefined") {
    var head = document.head || document.getElementsByTagName("head")[0],
      style = document.createElement("style"),
      css = "";
    style.type = "text/css";
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  }
})();

var arrowCarrotDown = {
  render: function render() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("path", {
      attrs: {
        d:
          "M 22.782,13.8L 17,19.582L 11.218,13.8c-0.39-0.39-1.024-0.39-1.414,0c-0.39,0.39-0.39,1.024,0,1.414 l 6.486,6.486c 0.196,0.196, 0.454,0.294, 0.71,0.292c 0.258,0, 0.514-0.096, 0.71-0.292l 6.486-6.486c 0.39-0.39, 0.39-1.024,0-1.414 C 23.806,13.41, 23.172,13.41, 22.782,13.8z"
      }
    });
  },
  staticRenderFns: []
};

(function() {
  if (typeof document !== "undefined") {
    var head = document.head || document.getElementsByTagName("head")[0],
      style = document.createElement("style"),
      css = "";
    style.type = "text/css";
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  }
})();

var arrowCarrotRight = {
  render: function render() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("path", {
      attrs: {
        d:
          "M 13.8,24.196c 0.39,0.39, 1.024,0.39, 1.414,0l 6.486-6.486c 0.196-0.196, 0.294-0.454, 0.292-0.71 c0-0.258-0.096-0.514-0.292-0.71L 15.214,9.804c-0.39-0.39-1.024-0.39-1.414,0c-0.39,0.39-0.39,1.024,0,1.414L 19.582,17 L 13.8,22.782C 13.41,23.172, 13.41,23.806, 13.8,24.196z"
      }
    });
  },
  staticRenderFns: []
};

(function() {
  if (typeof document !== "undefined") {
    var head = document.head || document.getElementsByTagName("head")[0],
      style = document.createElement("style"),
      css = "";
    style.type = "text/css";
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  }
})();

var boxChecked = {
  render: function render() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("path", {
      attrs: {
        d:
          "M 26,26L 6,26 L 6,6 l 14.752,0 L 22,4L 6,4 C 4.896,4, 4,4.896, 4,6l0,20 c0,1.104, 0.896,2, 2,2l 20,0 c 1.104,0, 2-0.896, 2-2L 28,12.794 L 26,16L 26,26 zM 29.366,2.228C 29.13,2.074, 28.864,2, 28.602,2c-0.456,0-0.904,0.224-1.172,0.634L 16.558,18.318l-4.206-4.8 C 11.782,12.992, 10.898,13.026, 10.372,13.594S 9.882,15.048, 10.45,15.572l 5.056,5.77c 0.032,0.052, 0.082,0.092, 0.122,0.14l 0.128,0.146 c 0.016,0.014, 0.036,0.018, 0.052,0.032c 0.040,0.032, 0.064,0.076, 0.106,0.106c 0.086,0.056, 0.18,0.092, 0.274,0.126 c 0.022,0.008, 0.040,0.022, 0.062,0.028c 0.14,0.046, 0.286,0.074, 0.43,0.074c 0.006,0, 0.012-0.004, 0.018-0.004 c 0.38,0.002, 0.758-0.138, 1.036-0.438c 0.052-0.056, 0.072-0.124, 0.114-0.186c 0.002-0.002, 0.004-0.004, 0.006-0.006l 11.918-17.194 C 30.194,3.52, 30.014,2.652, 29.366,2.228z"
      }
    });
  },
  staticRenderFns: []
};

(function() {
  if (typeof document !== "undefined") {
    var head = document.head || document.getElementsByTagName("head")[0],
      style = document.createElement("style"),
      css = "";
    style.type = "text/css";
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  }
})();

var boxEmpty = {
  render: function render() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("path", {
      attrs: {
        d:
          "M 26,4L 6,4 C 4.896,4, 4,4.896, 4,6l0,20 c0,1.104, 0.896,2, 2,2l 20,0 c 1.104,0, 2-0.896, 2-2L 28,6 C 28,4.896, 27.104,4, 26,4z M 26,26L 6,26 L 6,6 l 20,0 L 26,26 z"
      }
    });
  },
  staticRenderFns: []
};

(function() {
  if (typeof document !== "undefined") {
    var head = document.head || document.getElementsByTagName("head")[0],
      style = document.createElement("style"),
      css = "";
    style.type = "text/css";
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  }
})();

var closeAlt2 = {
  render: function render() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("path", {
      attrs: {
        d:
          "M 17,2C 8.716,2, 2,8.716, 2,17S 8.716,32, 17,32S 32,25.284, 32,17S 25.284,2, 17,2z M 17,30 C 9.832,30, 4,24.168, 4,17S 9.832,4, 17,4S 30,9.832, 30,17S 24.168,30, 17,30zM 22.536,10.050L 17.038,15.548L 12.108,10.050c-0.39-0.39-1.024-0.39-1.414,0c-0.39,0.39-0.39,1.024,0,1.414 l 4.932,5.498l-5.574,5.574c-0.39,0.39-0.39,1.024,0,1.414c 0.39,0.39, 1.024,0.39, 1.414,0l 5.498-5.498l 4.932,5.498 c 0.39,0.39, 1.024,0.39, 1.414,0s 0.39-1.024,0-1.414L 18.376,17.038l 5.574-5.574c 0.39-0.39, 0.39-1.024,0-1.414 C 23.56,9.66, 22.926,9.66, 22.536,10.050z"
      }
    });
  },
  staticRenderFns: []
};

(function() {
  if (typeof document !== "undefined") {
    var head = document.head || document.getElementsByTagName("head")[0],
      style = document.createElement("style"),
      css = "";
    style.type = "text/css";
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  }
})();

var cloudDownloadAlt = {
  render: function render() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("path", {
      attrs: {
        d:
          "M 26.166,16c 1.868-4.29, 0.716-7.018-0.222-8.332c-1.424-1.994-4.018-3.088-6.296-2.65 C 15.688,5.774, 14,8.458, 14,14l0,4.628 L 11.684,16.312c-0.39-0.39-1.024-0.39-1.414,0s-0.39,1.024,0,1.414l 4.024,4.022 c 0.202,0.202, 0.468,0.294, 0.732,0.288c 0.264,0.006, 0.53-0.086, 0.732-0.288l 4.044-4.042c 0.39-0.39, 0.39-1.024,0-1.414 s-1.024-0.39-1.414,0L 16,18.678L 16,14 c0-5.768, 1.986-6.628, 4.020-7.018c 1.306-0.24, 3.196,0.308, 4.294,1.848 c 1.344,1.878, 1.086,4.664-0.726,7.84c-0.192,0.338-0.172,0.756, 0.052,1.072s 0.618,0.476, 0.992,0.408 c 0.242-0.042, 0.964-0.152, 1.42-0.152C 28.23,17.998, 30,19.792, 30,22c0,2.206-1.794,4-4,4l-19.854,0.012C 3.822,25.668, 2,23.466, 2,21 c0-2.456, 1.844-4.57, 4.292-4.92l 0.86-0.124c 0.492-0.070, 0.858-0.492, 0.858-0.99L 7.994,13.902C 8,10.32, 10.208,7.376, 13.25,6.902 C 13.794,6.816, 14.168,6.306, 14.084,5.76C 13.998,5.214, 13.5,4.844, 12.94,4.926C 8.92,5.552, 6,9.326, 5.994,13.898 c0,0.002, 0.016,0.202, 0.016,0.202l0,0 C 2.584,14.59,0,17.556,0,21c0,3.492, 2.516,6.496, 6,7l 20,0 c 3.308,0, 6-2.692, 6-6 C 32,18.728, 29.392,16.060, 26.166,16z"
      }
    });
  },
  staticRenderFns: []
};

(function() {
  if (typeof document !== "undefined") {
    var head = document.head || document.getElementsByTagName("head")[0],
      style = document.createElement("style"),
      css = "";
    style.type = "text/css";
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  }
})();

var documentsAlt = {
  render: function render() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("path", {
      attrs: {
        d:
          "M 4,28l 2,0 l0,2 c0,1.104, 0.896,2, 2,2l 20,0 c 1.104,0, 2-0.896, 2-2L 30,6 c0-1.104-0.896-2-2-2l-2,0 L 26,2 c0-1.104-0.896-2-2-2L 4,0 C 2.896,0, 2,0.896, 2,2l0,24 C 2,27.104, 2.896,28, 4,28z M 24,26L 4,26 L 4,2 l 20,0 L 24,26 z M 28,6l0,24 L 8,30 l0-2 l 16,0 c 1.104,0, 2-0.896, 2-2L 26,6 L 28,6 zM 10,7C 10,7.552, 10.448,8, 11,8l 10,0 C 21.552,8, 22,7.552, 22,7C 22,6.448, 21.552,6, 21,6l-10,0 C 10.448,6, 10,6.448, 10,7zM 7,14l 14,0 C 21.552,14, 22,13.552, 22,13C 22,12.448, 21.552,12, 21,12l-14,0 C 6.448,12, 6,12.448, 6,13 C 6,13.552, 6.448,14, 7,14zM 7,18l 14,0 C 21.552,18, 22,17.552, 22,17C 22,16.448, 21.552,16, 21,16l-14,0 C 6.448,16, 6,16.448, 6,17 C 6,17.552, 6.448,18, 7,18zM 7,22l 14,0 c 0.552,0, 1-0.448, 1-1c0-0.552-0.448-1-1-1l-14,0 C 6.448,20, 6,20.448, 6,21 C 6,21.552, 6.448,22, 7,22z"
      }
    });
  },
  staticRenderFns: []
};

(function() {
  if (typeof document !== "undefined") {
    var head = document.head || document.getElementsByTagName("head")[0],
      style = document.createElement("style"),
      css =
        " svg[data-v-04d5b795] { display: inline-block; vertical-align: baseline; margin-bottom: -2px; /* yes, I'm that particular about formatting */ } ";
    style.type = "text/css";
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  }
})();

var BaseIcon = {
  render: function render() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "svg",
      {
        attrs: {
          xmlns: "http://www.w3.org/2000/svg",
          width: _vm.width,
          height: _vm.height,
          viewBox: "0 0 32 32",
          "aria-labelledby": _vm.iconName,
          role: "presentation"
        }
      },
      [
        _c("title", { attrs: { id: _vm.iconName, lang: "en" } }, [
          _vm._v(_vm._s(_vm.iconName) + " icon")
        ]),
        _vm._v(" "),
        _c(
          "g",
          { attrs: { fill: _vm.iconColor } },
          [_c(_vm.iconName, { tag: "component" })],
          1
        )
      ]
    );
  },
  staticRenderFns: [],
  _scopeId: "data-v-04d5b795",
  components: {
    arrowCarrotDown: arrowCarrotDown,
    arrowCarrotRight: arrowCarrotRight,
    boxChecked: boxChecked,
    boxEmpty: boxEmpty,
    closeAlt2: closeAlt2,
    cloudDownloadAlt: cloudDownloadAlt,
    documentsAlt: documentsAlt
  },
  props: {
    iconName: {
      type: String,
      default: "box"
    },
    width: {
      type: [Number, String],
      default: 18
    },
    height: {
      type: [Number, String],
      default: 18
    },
    iconColor: {
      type: String,
      default: "currentColor"
    }
  }
};

(function() {
  if (typeof document !== "undefined") {
    var head = document.head || document.getElementsByTagName("head")[0],
      style = document.createElement("style"),
      css =
        ".select-box[data-v-20268598] { font-size: 13px; height: 32px; line-height: 32px; border-radius: 4px; outline: none; background-color: #f5f7fa; color: #909399; position: relative; border: 1px solid #dcdfe6; white-space: nowrap; padding-left: 5px; padding-right: 20px; box-sizing: border-box; text-align: center; } .select-box[data-v-20268598]:hover { cursor: pointer; } .option-list[data-v-20268598] { font-size: 13px; text-align: center; padding: 5px 0; } .option-list .option-item[data-v-20268598] { padding: 5px; } .option-list .option-item[data-v-20268598]:hover { cursor: pointer; background-color: #f5f7fa; } .option-list .option-item.selected[data-v-20268598] { color: #3caed2; } .arrow-side[data-v-20268598] { position: absolute; right: 0; top: 0; width: 20px; height: 100%; display: flex; justify-content: center; align-items: center; } .arrow-side .select-arrow[data-v-20268598] { color: #909399; font-size: 16px; transition: all ease 0.2s; } ";
    style.type = "text/css";
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  }
})();
var BaseSelect = {
  render: function render() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "BasePopover",
      {
        attrs: {
          clickToClose: true,
          width: _vm.width,
          "animation-mode": "slidedown"
        },
        on: { showChange: _vm.handlePopoverChange }
      },
      [
        _c(
          "div",
          { staticClass: "option-list" },
          _vm._l(_vm.choiceList, function(option) {
            return _c(
              "div",
              {
                staticClass: "option-item",
                class: { selected: option.value == _vm.selected.value },
                on: {
                  click: function click($event) {
                    _vm.updateChoice(option);
                  }
                }
              },
              [_vm._v(_vm._s(option.label))]
            );
          })
        ),
        _vm._v(" "),
        _c(
          "div",
          {
            staticClass: "select-box",
            style: { width: _vm.width + "px" },
            attrs: { slot: "reference" },
            slot: "reference"
          },
          [
            _vm._v(" " + _vm._s(_vm.selected.label) + " "),
            _c(
              "div",
              { staticClass: "arrow-side" },
              [
                _c("base-icon", {
                  staticClass: "select-arrow",
                  style: { transform: "rotate(" + _vm.arrowRotate + "deg)" },
                  attrs: {
                    "icon-name": "arrowCarrotDown",
                    "icon-color": "#909399",
                    width: "16",
                    height: "16"
                  }
                })
              ],
              1
            )
          ]
        )
      ]
    );
  },
  staticRenderFns: [],
  _scopeId: "data-v-20268598",
  components: {
    BasePopover: BasePopover,
    BaseIcon: BaseIcon
  },
  model: {
    prop: "selectedValue",
    event: "change"
  },
  props: {
    choiceList: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    selectedValue: [String, Number],
    width: {
      type: Number,
      default: 80
    }
  },
  data: function data() {
    return {
      selected: {},
      arrowRotate: 0
    };
  },
  mounted: function mounted() {
    this.updateSelected(this.selectedValue);
  },

  methods: {
    updateSelected: function updateSelected(val) {
      this.selected = this.choiceList.find(function(v) {
        return v.value == val;
      }) || {
        value: val,
        label: val
      };
    },
    handlePopoverChange: function handlePopoverChange(isShow) {
      if (isShow) {
        this.arrowRotate = -180;
      } else {
        this.arrowRotate = 0;
      }
    },
    updateChoice: function updateChoice(option) {
      this.$emit("change", option.value);
      this.updateSelected(option.value);
      // this.selected
      // this.value = option.value
      // this.selected = Object.assign({}, option)
    }
  }
};

(function() {
  if (typeof document !== "undefined") {
    var head = document.head || document.getElementsByTagName("head")[0],
      style = document.createElement("style"),
      css =
        ".input-box[data-v-512008de] { display: inline-block; box-sizing: border-box; height: 32px; border: 1px solid #d3d4d6; border-radius: 4px; padding: 0 5px; outline: none; font-size: 12px; vertical-align: top; } .input-box[data-v-512008de]:focus { border-color: #3caed2; outline: none; } ";
    style.type = "text/css";
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  }
})();

var BaseInput = {
  render: function render() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("input", {
      directives: [
        {
          name: "observe-visibility",
          rawName: "v-observe-visibility",
          value: _vm.handleVisible,
          expression: "handleVisible"
        }
      ],
      ref: "input",
      staticClass: "input-box",
      attrs: { type: _vm.type, name: "", placeholder: _vm.placeholder },
      domProps: { value: _vm.inputValue },
      on: {
        change: function change($event) {
          _vm.$emit("change", $event.target.value);
        }
      }
    });
  },
  staticRenderFns: [],
  _scopeId: "data-v-512008de",
  directives: {
    ObserveVisibility: ObserveVisibility
  },
  model: {
    prop: "inputValue",
    event: "change"
  },
  props: {
    inputValue: [String, Number],
    type: {
      type: String,
      default: "text"
    },
    placeholder: {
      type: String,
      default: ""
    },
    autoFocus: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {};
  },

  methods: {
    handleVisible: function handleVisible(visible) {
      if (visible && this.autoFocus) {
        this.$refs.input.focus();
      }
    }
  }
};

(function() {
  if (typeof document !== "undefined") {
    var head = document.head || document.getElementsByTagName("head")[0],
      style = document.createElement("style"),
      css =
        ".check-box[data-v-f26d20da]:hover { cursor: pointer; } .check-item[data-v-f26d20da] { position: relative; padding-left: 20px; font-size: 14px; height: 25px; line-height: 25px; } .check-item .icon_box-empty[data-v-f26d20da] { color: #dcdfe6; } .check-item[data-v-f26d20da]:hover { cursor: pointer; } .check-item:hover .icon_box-empty[data-v-f26d20da] { color: #3caed2; } .check-item.checked[data-v-f26d20da] { color: #3caed2; } .check-item .check-icon[data-v-f26d20da] { position: absolute; left: 0; top: 0; width: 20px; height: 100%; display: flex; justify-content: center; align-items: center; } .check-item .check-label[data-v-f26d20da] { text-align: left; } ";
    style.type = "text/css";
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  }
})();

var BaseCheckgroup = {
  render: function render() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "check-box" },
      _vm._l(_vm.choiceList, function(checkItem) {
        return _c(
          "div",
          {
            staticClass: "check-item",
            class: { checked: _vm.checkedGroup.includes(checkItem) },
            on: {
              click: function click($event) {
                _vm.clickItem(checkItem);
              }
            }
          },
          [
            _c(
              "div",
              { staticClass: "check-icon" },
              [
                _vm.checkedGroup.includes(checkItem)
                  ? _c("base-icon", {
                      attrs: {
                        "icon-name": "boxChecked",
                        "icon-color": "#3caed2",
                        width: "14",
                        height: "14"
                      }
                    })
                  : _c("base-icon", {
                      attrs: {
                        "icon-name": "boxEmpty",
                        "icon-color": "#dcdfe6",
                        width: "14",
                        height: "14"
                      }
                    })
              ],
              1
            ),
            _vm._v(" "),
            _c("div", { staticClass: "check-label" }, [
              _vm._v(_vm._s(checkItem))
            ])
          ]
        );
      })
    );
  },
  staticRenderFns: [],
  _scopeId: "data-v-f26d20da",
  components: {
    BaseIcon: BaseIcon
  },
  model: {
    prop: "checkedValue",
    event: "change"
  },
  props: {
    checkedValue: Array,
    choiceList: {
      type: Array,
      default: function _default() {
        return [];
      }
    }
  },
  watch: {
    checkedValue: function checkedValue() {
      this.init();
    }
  },
  data: function data() {
    return {
      checkedGroup: []
    };
  },
  mounted: function mounted() {
    this.init();
  },

  methods: {
    init: function init() {
      this.checkedGroup = this.checkedValue.slice();
    },
    clickItem: function clickItem(checkItem) {
      var index = this.checkedGroup.indexOf(checkItem);
      if (index > -1) {
        this.checkedGroup.splice(index, 1);
      } else {
        this.checkedGroup.push(checkItem);
      }
      this.$emit("change", this.checkedGroup);
    }
  }
};

(function() {
  if (typeof document !== "undefined") {
    var head = document.head || document.getElementsByTagName("head")[0],
      style = document.createElement("style"),
      css =
        ' .mainCard:hover .pop-card[data-v-0c68cd97] { display: block; } .pop-handler[data-v-0c68cd97] { display: inline-block; } .pop-card[data-v-0c68cd97] { /*width: 150px;*/ min-width: 10px; min-height: 10px; border: 1px solid #ebeef5; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); position: absolute; top: 60px; z-index: 2001; background-color: #fff; border-radius: 5px; box-sizing: border-box; transform-origin: 0 0; padding: 5px; display: none; font-size: 13px; } .pop-card[data-v-0c68cd97]:hover { display: block; } .pop-arrow[data-v-0c68cd97], .pop-arrow[data-v-0c68cd97]::after { top: -6px; position: absolute; display: block; width: 0; height: 0; border-color: transparent; border-style: solid; border-width: 6px; filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03)); margin-right: 3px; border-top-width: 0; border-bottom-color: #ebeef5; } .pop-arrow[data-v-0c68cd97] { left: 50px; } .pop-arrow[data-v-0c68cd97]::after { content: " "; margin-left: -6px; top: 1px; /*margin-left: -6px;*/ /*border-top-width: 0;*/ border-bottom-color: #fff; } .fade-enter-active[data-v-0c68cd97], .fade-leave-active[data-v-0c68cd97], .slidedown-enter-active[data-v-0c68cd97], .slidedown-leave-active[data-v-0c68cd97] { transition: all ease 0.2s; } .fade-enter[data-v-0c68cd97], .fade-leave-to[data-v-0c68cd97] { opacity: 0; } .slidedown-enter[data-v-0c68cd97], .slidedown-leave-to[data-v-0c68cd97] { transform: scaleY(0); } ';
    style.type = "text/css";
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  }
})();

var BaseTooltip = {
  render: function render() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      {
        staticClass: "mainCard",
        staticStyle: { display: "inline-block", "vertical-align": "top" }
      },
      [
        _c("transition", { attrs: { name: _vm.animationMode } }, [
          _c(
            "div",
            {
              ref: "popCard",
              staticClass: "pop-card",
              style: {
                left: _vm.offset.left + "px",
                top: _vm.offset.top + "px",
                width: _vm.width + "px"
              },
              on: { click: _vm.handleClick }
            },
            [
              _vm._t("default"),
              _vm._v(" "),
              _c("div", {
                staticClass: "pop-arrow",
                style: { left: _vm.offset.arrowLeft + "px" }
              })
            ],
            2
          )
        ]),
        _vm._v(" "),
        _c(
          "div",
          {
            directives: [
              {
                name: "observe-visibility",
                rawName: "v-observe-visibility",
                value: _vm.setSize,
                expression: "setSize"
              }
            ],
            ref: "popHandler",
            staticClass: "pop-handler"
          },
          [_vm._t("reference")],
          2
        )
      ],
      1
    );
  },
  staticRenderFns: [],
  _scopeId: "data-v-0c68cd97",
  directives: {
    ObserveVisibility: ObserveVisibility
  },
  props: {
    width: {
      type: [Number, String],
      default: function _default() {
        return "auto";
      }
    },
    animationMode: {
      type: String,
      default: function _default() {
        return "fade";
      }
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  data: function data() {
    return {
      isShow: false,
      offset: {
        left: 0,
        top: 0,
        arrowLeft: 0
      }
    };
  },

  methods: {
    handleClick: function handleClick(e) {
      e.stopPropagation();
    },
    togglePop: function togglePop(e) {
      if (!this.visible) {
        return;
      }
      if (this.isShow) {
        e.stopPropagation();
      }
      this.isShow = !this.isShow;
      this.$emit("showChange", this.isShow);
    },
    closeCard: function closeCard() {
      if (!this.visible) {
        return;
      }
      this.isShow = false;
      this.$emit("showChange", this.isShow);
    },
    setSize: function setSize() {
      if (!this.$refs.popHandler) {
        return;
      }
      var _$refs$popHandler = this.$refs.popHandler,
        offsetLeft = _$refs$popHandler.offsetLeft,
        offsetTop = _$refs$popHandler.offsetTop,
        offsetHeight = _$refs$popHandler.offsetHeight,
        offsetWidth = _$refs$popHandler.offsetWidth;

      var moveLeft = 0;
      if (offsetLeft + this.width > window.innerWidth) {
        moveLeft = offsetLeft + this.width - window.innerWidth;
      }
      this.offset.left = offsetLeft - moveLeft;

      this.offset.top = offsetTop + offsetHeight;
      this.offset.arrowLeft = offsetWidth / 2 - 6 + moveLeft;
    }
  },
  mounted: function mounted() {
    var _this = this;

    if (!this.visible) {
      return;
    }
    this.setSize();
    window.addEventListener("resize", function(_) {
      _this.setSize();
    });
  }
};

var _render$staticRenderF;

(function() {
  if (typeof document !== "undefined") {
    var head = document.head || document.getElementsByTagName("head")[0],
      style = document.createElement("style"),
      css =
        '.main-scroll[data-v-a6686fb6] { width: 100%; overflow-y: hidden; border: 1px solid #ebeef5; font-size: 13px; box-sizing: border-box; position: relative; } .item-line[data-v-a6686fb6], .header-line[data-v-a6686fb6], .bottom-line[data-v-a6686fb6] { width: 100%; display: flex; flex-direction: row; } .item-cell[data-v-a6686fb6], .header-cell[data-v-a6686fb6], .bottom-cell[data-v-a6686fb6] { display: flex; padding: 5px; box-sizing: border-box; border-bottom: 1px solid #ebeef5; justify-content: center; align-items: center; } .header-cell[data-v-a6686fb6], .bottom-cell[data-v-a6686fb6] { border-bottom-width: 0; } .item-cell-inner[data-v-a6686fb6] { display: flex; width: 100%; height: 100%; word-break: break-all; text-align: center; overflow: hidden; text-overflow: ellipsis; justify-content: center; align-items: center; flex-wrap: wrap; } .header-cell-inner[data-v-a6686fb6] { display: inline-block; position: relative; } .header-cell-inner.caret-wrapper[data-v-a6686fb6] { width: 10px; height: 22px; cursor: pointer; } i.sort-ascending[data-v-a6686fb6] { width: 0; height: 0; border: 5px solid transparent; border-bottom-color: #c0c4cc; position: absolute; top: 0px; left: 4px; } i.sort-descending[data-v-a6686fb6] { width: 0; height: 0; border: 5px solid transparent; border-top-color: #c0c4cc; position: absolute; top: 12px; left: 4px; } i.sort-ascending.selected[data-v-a6686fb6] { border-bottom-color: #3caed2; } i.sort-descending.selected[data-v-a6686fb6] { border-top-color: #3caed2; } .header-line[data-v-a6686fb6] { color: #606266; height: 50px; } .bottom-line[data-v-a6686fb6] { height: 50px; } .bordered .item-cell[data-v-a6686fb6], .bordered .header-cell[data-v-a6686fb6], .bordered .bottom-cell[data-v-a6686fb6] { border-left: 1px solid #ebeef5; } .bordered .item-cell[data-v-a6686fb6]:nth-child(1), .bordered .header-cell[data-v-a6686fb6]:nth-child(1), .bordered .bottom-cell[data-v-a6686fb6]:nth-child(1) { border-left-width: 0; } .t-header[data-v-a6686fb6] { border-bottom: 1px solid #ebeef5; } .t-bottom[data-v-a6686fb6] { height: 50px; border-top: 1px solid #ebeef5; background-color: #f5f7fa; } .t-container[data-v-a6686fb6] { /*height: 800px;*/ box-sizing: border-box; overflow: auto; overflow-x: hidden; } .scroller[data-v-a6686fb6] { height: 100%; } .search-wrapper[data-v-a6686fb6] { cursor: pointer; } .filter-wrapper[data-v-a6686fb6] { cursor: pointer; } .numFiltered-wrapper[data-v-a6686fb6] { cursor: pointer; } div.item-line.item-line-allow-hightlight[data-v-a6686fb6]:hover { background-color: #eee; } div.item-line.selected[data-v-a6686fb6] { background-color: #ddd; } div.item-line.unselectable[data-v-a6686fb6] { background-color: #fff; } .download-icon[data-v-a6686fb6] { color: #bbb; font-size: 20px; } .download-icon[data-v-a6686fb6]:hover { color: #3caed2; cursor: pointer; } /*----------------*/ .tag[data-v-a6686fb6] { padding: 0 10px; height: 34px; line-height: 32px; /*font-size: 16px;*/ border-radius: 4px; box-sizing: border-box; color: #3caed2; background-color: rgba(60, 174, 210, 0.1); border: 1px solid rgba(60, 174, 210, 0.2); white-space: nowrap; } .filter-list[data-v-a6686fb6] { width: 100%; max-height: 300px; overflow-y: scroll; } .filter-list[data-v-a6686fb6]:hover { cursor: pointer; } .filter-item[data-v-a6686fb6] { width: 100%; margin: 5px auto; margin-left: 0px !important; } .filter-btn[data-v-a6686fb6] { overflow: hidden; border-top: 1px solid #ebeef5; padding: 6px; margin-top: 6px; text-align: left; padding: 10px 5px 5px 5px; font-size: 0; } .filtered[data-v-a6686fb6], .searched[data-v-a6686fb6], .numFiltered[data-v-a6686fb6] { color: #3caed2; } .warningColor[data-v-a6686fb6] { color: red; } .greenColor[data-v-a6686fb6] { color: #84c32e; } .all-select[data-v-a6686fb6] { cursor: pointer; } .threeLines[data-v-a6686fb6] { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; word-break: break-all; white-space: normal; } .alignLeft[data-v-a6686fb6] { text-align: left; } .tips[data-v-a6686fb6] { font-size: 14px; } .defaultTag[data-v-a6686fb6] { color: #3caed2; background-color: rgba(60, 174, 210, 0.1); border-color: rgba(60, 174, 210, 0.2); } .warningTag[data-v-a6686fb6] { color: #e6a23c; background: #fdf6ec; border-color: #f5dab1; } .successTag[data-v-a6686fb6] { color: #67c23a; background: #f0f9eb; border-color: #c2e7b0; } .dangerTag[data-v-a6686fb6] { color: #f56c6c; background: #fef0f0; border-color: #fbc4c4; } .infoTag[data-v-a6686fb6] { color: #909399; background: #f4f4f5; border-color: #d3d4d6; } .numberMax[data-v-a6686fb6] { margin-left: 15px; } .numberMax[data-v-a6686fb6]:before { content: "~"; position: absolute; left: -11px; top: 10px; } .filterBtnEmpty[data-v-a6686fb6] { margin-top: 10px; float: right; } .popperCard[data-v-a6686fb6] { box-sizing: border-box; } .clipboard[data-v-a6686fb6] { position: absolute; width: 0; height: 0; z-index: -99; opacity: 0; } .clipboard input[data-v-a6686fb6] { display: block; width: 1px; height: 1px; padding: 0; margin: -1px; border: 0; } ';
    style.type = "text/css";
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  }
})();

var Component = ((_render$staticRenderF = {
  render: function render() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { ref: "mainScroll", staticClass: "main-scroll" },
      [
        _c(
          "div",
          {
            ref: "mainTable",
            class: { bordered: _vm.bordered },
            style: {
              "min-width": _vm.minWidthTemp + "px",
              position: "relative"
            }
          },
          [
            _vm.enableExport
              ? _c(
                  "div",
                  {
                    staticStyle: {
                      "text-align": "right",
                      position: "absolute",
                      right: "5px",
                      top: "5px"
                    }
                  },
                  [
                    _c("base-icon", {
                      staticClass: "download-icon",
                      attrs: {
                        "icon-name": "cloudDownloadAlt",
                        "icon-color": "#bbbbbb",
                        width: "20",
                        height: "20"
                      },
                      nativeOn: {
                        click: function click($event) {
                          return _vm.handleExportTable($event);
                        }
                      }
                    })
                  ],
                  1
                )
              : _vm._e(),
            _vm._v(" "),
            _c("div", { staticClass: "t-header" }, [
              _c(
                "div",
                { ref: "tHeaderTable" },
                [
                  !_vm.enableMultiHeader
                    ? [
                        _c(
                          "div",
                          { staticClass: "header-line" },
                          _vm._l(
                            _vm.configTemp.filter(function(v) {
                              return !v.isHidden;
                            }),
                            function(item, configIndex) {
                              return _c(
                                "div",
                                {
                                  key: configIndex,
                                  staticClass: "header-cell",
                                  style: { flex: _vm.colWidth[configIndex] }
                                },
                                [
                                  item.searchable
                                    ? _c(
                                        "div",
                                        {
                                          staticClass:
                                            "header-cell-inner search-wrapper"
                                        },
                                        [
                                          _c(
                                            "base-popover",
                                            { attrs: { width: 340 } },
                                            [
                                              _c(
                                                "div",
                                                {
                                                  staticStyle: {
                                                    padding: "10px",
                                                    "text-align": "left",
                                                    "font-size": "0"
                                                  }
                                                },
                                                [
                                                  _vm._l(
                                                    item.searchPhrase,
                                                    function(phrase, ph_index) {
                                                      return [
                                                        _c("base-select", {
                                                          attrs: {
                                                            "choice-list": _vm.allPhraseOperator.map(
                                                              function(v) {
                                                                return {
                                                                  value:
                                                                    v.value,
                                                                  label:
                                                                    _vm
                                                                      .languageOptions[
                                                                      _vm
                                                                        .language
                                                                    ]
                                                                      .phraseFilter[
                                                                      v.value
                                                                    ]
                                                                };
                                                              }
                                                            )
                                                          },
                                                          on: {
                                                            change: function change(
                                                              $event
                                                            ) {
                                                              _vm.handleClickConfirmFilter(
                                                                configIndex
                                                              );
                                                            }
                                                          },
                                                          model: {
                                                            value:
                                                              phrase.operator,
                                                            callback: function callback(
                                                              $$v
                                                            ) {
                                                              _vm.$set(
                                                                phrase,
                                                                "operator",
                                                                $$v
                                                              );
                                                            },
                                                            expression:
                                                              "phrase.operator"
                                                          }
                                                        }),
                                                        _vm._v(" "),
                                                        _c("base-input", {
                                                          staticStyle: {
                                                            margin:
                                                              "0 5px 6px 5px",
                                                            width: "210px"
                                                          },
                                                          attrs: {
                                                            placeholder:
                                                              _vm
                                                                .languageOptions[
                                                                _vm.language
                                                              ].phraseFilter[
                                                                "ph"
                                                              ],
                                                            "auto-focus": ""
                                                          },
                                                          on: {
                                                            change: function change(
                                                              $event
                                                            ) {
                                                              _vm.handleClickConfirmFilter(
                                                                configIndex
                                                              );
                                                            }
                                                          },
                                                          model: {
                                                            value: phrase.value,
                                                            callback: function callback(
                                                              $$v
                                                            ) {
                                                              _vm.$set(
                                                                phrase,
                                                                "value",
                                                                $$v
                                                              );
                                                            },
                                                            expression:
                                                              "phrase.value"
                                                          }
                                                        }),
                                                        _vm._v(" "),
                                                        _c("base-icon", {
                                                          directives: [
                                                            {
                                                              name: "show",
                                                              rawName: "v-show",
                                                              value:
                                                                ph_index > 0,
                                                              expression:
                                                                "ph_index > 0"
                                                            }
                                                          ],
                                                          staticStyle: {
                                                            "margin-top": "9px"
                                                          },
                                                          attrs: {
                                                            "icon-name":
                                                              "closeAlt2",
                                                            "icon-color":
                                                              "#c0c4cc",
                                                            width: "13",
                                                            height: "13"
                                                          },
                                                          nativeOn: {
                                                            click: function click(
                                                              $event
                                                            ) {
                                                              _vm.removePhraseFilter(
                                                                configIndex,
                                                                ph_index
                                                              );
                                                            }
                                                          }
                                                        })
                                                      ];
                                                    }
                                                  ),
                                                  _vm._v(" "),
                                                  _c(
                                                    "div",
                                                    {
                                                      staticStyle: {
                                                        display: "flex"
                                                      }
                                                    },
                                                    [
                                                      _c(
                                                        "base-button",
                                                        {
                                                          staticClass:
                                                            "btn filterBtnEmpty",
                                                          attrs: {
                                                            type: "primary",
                                                            disabled:
                                                              item.searchPhrase
                                                                .length >=
                                                              _vm.phraseLimit
                                                          },
                                                          nativeOn: {
                                                            click: function click(
                                                              $event
                                                            ) {
                                                              _vm.addFilterPhrase(
                                                                configIndex
                                                              );
                                                            }
                                                          }
                                                        },
                                                        [
                                                          _vm._v(
                                                            _vm._s(
                                                              _vm
                                                                .languageOptions[
                                                                _vm.language
                                                              ].phraseFilter[
                                                                "and_btn"
                                                              ]
                                                            )
                                                          )
                                                        ]
                                                      ),
                                                      _vm._v(" "),
                                                      _c(
                                                        "base-button",
                                                        {
                                                          staticClass:
                                                            "btn filterBtnEmpty",
                                                          staticStyle: {
                                                            "margin-left": "5px"
                                                          },
                                                          attrs: {
                                                            type: "danger"
                                                          },
                                                          nativeOn: {
                                                            click: function click(
                                                              $event
                                                            ) {
                                                              _vm.handleClickEmptyPhraseFilter(
                                                                configIndex
                                                              );
                                                            }
                                                          }
                                                        },
                                                        [
                                                          _vm._v(
                                                            _vm._s(
                                                              _vm
                                                                .languageOptions[
                                                                _vm.language
                                                              ].phraseFilter[
                                                                "clear_btn"
                                                              ]
                                                            )
                                                          )
                                                        ]
                                                      )
                                                    ],
                                                    1
                                                  )
                                                ],
                                                2
                                              ),
                                              _vm._v(" "),
                                              _c(
                                                "span",
                                                {
                                                  attrs: { slot: "reference" },
                                                  slot: "reference"
                                                },
                                                [
                                                  item.name
                                                    ? _c(
                                                        "span",
                                                        {
                                                          class: {
                                                            searched:
                                                              item.searchPhrase.findIndex(
                                                                function(v) {
                                                                  return (
                                                                    v.value !=
                                                                    ""
                                                                  );
                                                                }
                                                              ) > -1
                                                          }
                                                        },
                                                        [
                                                          _vm._v(
                                                            _vm._s(item.name)
                                                          )
                                                        ]
                                                      )
                                                    : _c(
                                                        "span",
                                                        {
                                                          class: {
                                                            searched:
                                                              item.searchPhrase.findIndex(
                                                                function(v) {
                                                                  return (
                                                                    v.value !=
                                                                    ""
                                                                  );
                                                                }
                                                              ) > -1
                                                          }
                                                        },
                                                        [
                                                          _vm._v(
                                                            _vm._s(item.prop)
                                                          )
                                                        ]
                                                      )
                                                ]
                                              )
                                            ]
                                          )
                                        ],
                                        1
                                      )
                                    : item.filterable
                                      ? _c(
                                          "div",
                                          {
                                            staticClass:
                                              "header-cell-inner filter-wrapper"
                                          },
                                          [
                                            _c(
                                              "base-popover",
                                              { attrs: { width: 240 } },
                                              [
                                                _c(
                                                  "div",
                                                  {
                                                    staticStyle: {
                                                      padding: "5px"
                                                    }
                                                  },
                                                  [
                                                    _c("base-checkgroup", {
                                                      staticClass:
                                                        "filter-list",
                                                      attrs: {
                                                        "choice-list":
                                                          item.filterOptions
                                                      },
                                                      on: {
                                                        change:
                                                          _vm.handleChangeFilter
                                                      },
                                                      model: {
                                                        value:
                                                          item.filterSelectedOptions,
                                                        callback: function callback(
                                                          $$v
                                                        ) {
                                                          _vm.$set(
                                                            item,
                                                            "filterSelectedOptions",
                                                            $$v
                                                          );
                                                        },
                                                        expression:
                                                          "item.filterSelectedOptions"
                                                      }
                                                    }),
                                                    _vm._v(" "),
                                                    _c(
                                                      "div",
                                                      {
                                                        staticClass:
                                                          "filter-btn"
                                                      },
                                                      [
                                                        _c(
                                                          "base-button",
                                                          {
                                                            attrs: {
                                                              type: "primary"
                                                            },
                                                            nativeOn: {
                                                              click: function click(
                                                                $event
                                                              ) {
                                                                _vm.handleClickConfirmFilter(
                                                                  configIndex
                                                                );
                                                              }
                                                            }
                                                          },
                                                          [
                                                            _vm._v(
                                                              _vm._s(
                                                                _vm
                                                                  .languageOptions[
                                                                  _vm.language
                                                                ].selectFilter[
                                                                  "confirm_btn"
                                                                ]
                                                              )
                                                            )
                                                          ]
                                                        ),
                                                        _vm._v(" "),
                                                        _c(
                                                          "base-button",
                                                          {
                                                            staticStyle: {
                                                              "margin-left":
                                                                "5px"
                                                            },
                                                            attrs: {
                                                              type: "primary"
                                                            },
                                                            nativeOn: {
                                                              click: function click(
                                                                $event
                                                              ) {
                                                                _vm.handleClickReverseFilter(
                                                                  configIndex
                                                                );
                                                              }
                                                            }
                                                          },
                                                          [
                                                            _vm._v(
                                                              _vm._s(
                                                                _vm
                                                                  .languageOptions[
                                                                  _vm.language
                                                                ].selectFilter[
                                                                  "reverse_btn"
                                                                ]
                                                              )
                                                            )
                                                          ]
                                                        ),
                                                        _vm._v(" "),
                                                        _c(
                                                          "base-button",
                                                          {
                                                            staticStyle: {
                                                              "margin-left":
                                                                "5px"
                                                            },
                                                            attrs: {
                                                              type: "danger"
                                                            },
                                                            nativeOn: {
                                                              click: function click(
                                                                $event
                                                              ) {
                                                                _vm.handleClickClearFilter(
                                                                  configIndex
                                                                );
                                                              }
                                                            }
                                                          },
                                                          [
                                                            _vm._v(
                                                              _vm._s(
                                                                _vm
                                                                  .languageOptions[
                                                                  _vm.language
                                                                ].selectFilter[
                                                                  "clear_btn"
                                                                ]
                                                              )
                                                            )
                                                          ]
                                                        )
                                                      ],
                                                      1
                                                    )
                                                  ],
                                                  1
                                                ),
                                                _vm._v(" "),
                                                _c(
                                                  "span",
                                                  {
                                                    attrs: {
                                                      slot: "reference"
                                                    },
                                                    slot: "reference"
                                                  },
                                                  [
                                                    item.name
                                                      ? _c(
                                                          "span",
                                                          {
                                                            class: {
                                                              filtered:
                                                                item.filterSelectedOptions &&
                                                                item
                                                                  .filterSelectedOptions
                                                                  .length
                                                            }
                                                          },
                                                          [
                                                            _vm._v(
                                                              _vm._s(item.name)
                                                            )
                                                          ]
                                                        )
                                                      : _c(
                                                          "span",
                                                          {
                                                            class: {
                                                              filtered:
                                                                item.filterSelectedOptions &&
                                                                item
                                                                  .filterSelectedOptions
                                                                  .length
                                                            }
                                                          },
                                                          [
                                                            _vm._v(
                                                              _vm._s(item.prop)
                                                            )
                                                          ]
                                                        ),
                                                    _vm._v(" "),
                                                    _c("base-icon", {
                                                      attrs: {
                                                        "icon-name":
                                                          "arrowCarrotDown",
                                                        "icon-color": "#c0c4cc",
                                                        width: "16",
                                                        height: "16"
                                                      }
                                                    })
                                                  ],
                                                  1
                                                )
                                              ]
                                            )
                                          ],
                                          1
                                        )
                                      : item.numberFilter
                                        ? _c(
                                            "div",
                                            {
                                              staticClass:
                                                "header-cell-inner numFiltered-wrapper"
                                            },
                                            [
                                              _c(
                                                "base-popover",
                                                {
                                                  attrs: {
                                                    width:
                                                      item.numberFilterPhrase
                                                        .operator === "bt"
                                                        ? 298
                                                        : 198
                                                  }
                                                },
                                                [
                                                  _c(
                                                    "div",
                                                    {
                                                      staticStyle: {
                                                        padding: "10px",
                                                        "text-align": "left",
                                                        "font-size": "0"
                                                      }
                                                    },
                                                    [
                                                      _c("base-select", {
                                                        attrs: {
                                                          "choice-list": _vm.allOperatorType.map(
                                                            function(v) {
                                                              return {
                                                                value: v.value,
                                                                label:
                                                                  _vm
                                                                    .languageOptions[
                                                                    _vm.language
                                                                  ]
                                                                    .numberFilter[
                                                                    v.value
                                                                  ]
                                                              };
                                                            }
                                                          ),
                                                          placeholder: ""
                                                        },
                                                        on: {
                                                          change: function change(
                                                            $event
                                                          ) {
                                                            _vm.handleClickConfirmFilter(
                                                              configIndex
                                                            );
                                                          }
                                                        },
                                                        model: {
                                                          value:
                                                            item
                                                              .numberFilterPhrase
                                                              .operator,
                                                          callback: function callback(
                                                            $$v
                                                          ) {
                                                            _vm.$set(
                                                              item.numberFilterPhrase,
                                                              "operator",
                                                              $$v
                                                            );
                                                          },
                                                          expression:
                                                            "item.numberFilterPhrase.operator"
                                                        }
                                                      }),
                                                      _vm._v(" "),
                                                      _c("base-input", {
                                                        staticStyle: {
                                                          width: "90px",
                                                          "margin-left": "5px"
                                                        },
                                                        attrs: {
                                                          type: "number",
                                                          "auto-focus": ""
                                                        },
                                                        on: {
                                                          change: function change(
                                                            $event
                                                          ) {
                                                            _vm.handleClickConfirmFilter(
                                                              configIndex
                                                            );
                                                          }
                                                        },
                                                        model: {
                                                          value:
                                                            item
                                                              .numberFilterPhrase
                                                              .value[0],
                                                          callback: function callback(
                                                            $$v
                                                          ) {
                                                            _vm.$set(
                                                              item
                                                                .numberFilterPhrase
                                                                .value,
                                                              0,
                                                              $$v
                                                            );
                                                          },
                                                          expression:
                                                            "item.numberFilterPhrase.value[0]"
                                                        }
                                                      }),
                                                      _vm._v(" "),
                                                      _c(
                                                        "div",
                                                        {
                                                          directives: [
                                                            {
                                                              name: "show",
                                                              rawName: "v-show",
                                                              value:
                                                                item
                                                                  .numberFilterPhrase
                                                                  .operator ===
                                                                "bt",
                                                              expression:
                                                                "item.numberFilterPhrase.operator === 'bt'"
                                                            }
                                                          ],
                                                          staticStyle: {
                                                            display:
                                                              "inline-block",
                                                            "font-size": "13px"
                                                          }
                                                        },
                                                        [_vm._v("~")]
                                                      ),
                                                      _vm._v(" "),
                                                      _c("base-input", {
                                                        directives: [
                                                          {
                                                            name: "show",
                                                            rawName: "v-show",
                                                            value:
                                                              item
                                                                .numberFilterPhrase
                                                                .operator ===
                                                              "bt",
                                                            expression:
                                                              "item.numberFilterPhrase.operator === 'bt'"
                                                          }
                                                        ],
                                                        staticStyle: {
                                                          width: "90px",
                                                          "margin-left": "1px"
                                                        },
                                                        attrs: {
                                                          type: "number"
                                                        },
                                                        on: {
                                                          change: function change(
                                                            $event
                                                          ) {
                                                            _vm.handleClickConfirmFilter(
                                                              configIndex
                                                            );
                                                          }
                                                        },
                                                        model: {
                                                          value:
                                                            item
                                                              .numberFilterPhrase
                                                              .value[1],
                                                          callback: function callback(
                                                            $$v
                                                          ) {
                                                            _vm.$set(
                                                              item
                                                                .numberFilterPhrase
                                                                .value,
                                                              1,
                                                              $$v
                                                            );
                                                          },
                                                          expression:
                                                            "item.numberFilterPhrase.value[1]"
                                                        }
                                                      }),
                                                      _vm._v(" "),
                                                      _c(
                                                        "div",
                                                        {
                                                          staticStyle: {
                                                            "text-align":
                                                              "right"
                                                          }
                                                        },
                                                        [
                                                          _c(
                                                            "base-button",
                                                            {
                                                              staticStyle: {
                                                                "margin-top":
                                                                  "10px"
                                                              },
                                                              attrs: {
                                                                type: "danger"
                                                              },
                                                              nativeOn: {
                                                                click: function click(
                                                                  $event
                                                                ) {
                                                                  _vm.handleClickEmptyNumberFilter(
                                                                    configIndex
                                                                  );
                                                                }
                                                              }
                                                            },
                                                            [
                                                              _vm._v(
                                                                _vm._s(
                                                                  _vm
                                                                    .languageOptions[
                                                                    _vm.language
                                                                  ]
                                                                    .numberFilter[
                                                                    "clear_btn"
                                                                  ]
                                                                )
                                                              )
                                                            ]
                                                          )
                                                        ],
                                                        1
                                                      )
                                                    ],
                                                    1
                                                  ),
                                                  _vm._v(" "),
                                                  _c(
                                                    "span",
                                                    {
                                                      attrs: {
                                                        slot: "reference"
                                                      },
                                                      slot: "reference"
                                                    },
                                                    [
                                                      item.name
                                                        ? _c(
                                                            "span",
                                                            {
                                                              class: {
                                                                numFiltered:
                                                                  item
                                                                    .numberFilterPhrase
                                                                    .value[0] !==
                                                                  ""
                                                              }
                                                            },
                                                            [
                                                              _vm._v(
                                                                _vm._s(
                                                                  item.name
                                                                )
                                                              )
                                                            ]
                                                          )
                                                        : _c(
                                                            "span",
                                                            {
                                                              class: {
                                                                numFiltered:
                                                                  item
                                                                    .numberFilterPhrase
                                                                    .value[0] !==
                                                                  ""
                                                              }
                                                            },
                                                            [
                                                              _vm._v(
                                                                _vm._s(
                                                                  item.prop
                                                                )
                                                              )
                                                            ]
                                                          )
                                                    ]
                                                  )
                                                ]
                                              )
                                            ],
                                            1
                                          )
                                        : _c(
                                            "div",
                                            {
                                              staticClass: "header-cell-inner"
                                            },
                                            [
                                              item.name
                                                ? _c(
                                                    "span",
                                                    {
                                                      class: {
                                                        filtered:
                                                          item.filterSelectedOptions &&
                                                          item
                                                            .filterSelectedOptions
                                                            .length
                                                      }
                                                    },
                                                    [_vm._v(_vm._s(item.name))]
                                                  )
                                                : _c(
                                                    "span",
                                                    {
                                                      class: {
                                                        filtered:
                                                          item.filterSelectedOptions &&
                                                          item
                                                            .filterSelectedOptions
                                                            .length
                                                      }
                                                    },
                                                    [_vm._v(_vm._s(item.prop))]
                                                  )
                                            ]
                                          ),
                                  _vm._v(" "),
                                  _vm.selectable && item.prop === "_index"
                                    ? _c(
                                        "div",
                                        {
                                          staticClass:
                                            "header-cell-inner all-select",
                                          on: {
                                            click: function click($event) {
                                              _vm.selectAll();
                                            }
                                          }
                                        },
                                        [
                                          _vm._v(
                                            _vm._s(
                                              _vm.languageOptions[_vm.language]
                                                .selectAll
                                            )
                                          )
                                        ]
                                      )
                                    : _vm._e(),
                                  _vm._v(" "),
                                  item.sortable
                                    ? _c(
                                        "div",
                                        {
                                          staticClass:
                                            "header-cell-inner caret-wrapper"
                                        },
                                        [
                                          _c("i", {
                                            staticClass: "sort-ascending",
                                            class: {
                                              selected:
                                                _vm.sortParam.col ===
                                                  item.prop &&
                                                _vm.sortParam.direction ===
                                                  "asc"
                                            },
                                            on: {
                                              click: function click($event) {
                                                _vm.handleClickSort(
                                                  item.prop,
                                                  "asc"
                                                );
                                              }
                                            }
                                          }),
                                          _vm._v(" "),
                                          _c("i", {
                                            staticClass: "sort-descending",
                                            class: {
                                              selected:
                                                _vm.sortParam.col ===
                                                  item.prop &&
                                                _vm.sortParam.direction ===
                                                  "desc"
                                            },
                                            on: {
                                              click: function click($event) {
                                                _vm.handleClickSort(
                                                  item.prop,
                                                  "desc"
                                                );
                                              }
                                            }
                                          })
                                        ]
                                      )
                                    : _vm._e()
                                ]
                              );
                            }
                          )
                        )
                      ]
                    : _vm._e(),
                  _vm._v(" "),
                  _vm.enableMultiHeader
                    ? _vm._l(_vm.multiConfigTemp, function(hItem, hIndex) {
                        return _c(
                          "div",
                          { key: hIndex, staticClass: "header-line" },
                          _vm._l(hItem, function(hdSet, hdName, hdIndex) {
                            return _c(
                              "div",
                              {
                                key: hdName,
                                staticClass: "header-cell",
                                attrs: {
                                  colspan: hdSet.colspan,
                                  rowspan: hdSet.rowspan
                                }
                              },
                              [_vm._v(_vm._s(hdSet.name))]
                            );
                          })
                        );
                      })
                    : _vm._e()
                ],
                2
              )
            ]),
            _vm._v(" "),
            _c(
              "div",
              { ref: "tContainer", staticClass: "t-container" },
              [
                _c("virtual-scroller", {
                  ref: "scroller",
                  staticClass: "scroller",
                  attrs: {
                    items: _vm.dataTemp,
                    "item-height": _vm.itemHeight,
                    "content-tag": "div",
                    "pool-size": "500"
                  },
                  scopedSlots: _vm._u([
                    {
                      key: "default",
                      fn: function fn(props) {
                        return [
                          _c(
                            "div",
                            {
                              staticClass: "item-line",
                              class: {
                                selected: props.item._eSelected,
                                unselectable: !_vm.selectable,
                                "item-line-allow-hightlight": _vm.hoverHighlight
                              },
                              style: { height: _vm.itemHeight + "px" },
                              on: {
                                click: function click($event) {
                                  _vm.handleClickItem(props.item);
                                }
                              }
                            },
                            _vm._l(
                              _vm.configTemp.filter(function(v) {
                                return !v.isHidden;
                              }),
                              function(item, configIndex) {
                                return _c(
                                  "div",
                                  {
                                    key: configIndex,
                                    staticClass: "item-cell",
                                    class: props.item._eClass[item.prop] || "",
                                    style: { flex: _vm.colWidth[configIndex] }
                                  },
                                  [
                                    item.prop === "_action"
                                      ? [
                                          _c(
                                            "div",
                                            {
                                              staticClass:
                                                "item-cell-inner rowSlot",
                                              style: {
                                                height:
                                                  _vm.itemHeight - 12 + "px",
                                                "align-items":
                                                  item.alignItems || "center"
                                              },
                                              on: {
                                                click: _vm.handleClickAction
                                              }
                                            },
                                            [
                                              _vm._t(
                                                item.actionName || "action",
                                                null,
                                                {
                                                  index: props.itemIndex,
                                                  row: _vm.clearObj(props.item)
                                                }
                                              )
                                            ],
                                            2
                                          )
                                        ]
                                      : [
                                          item.prop === "_expand"
                                            ? _c(
                                                "div",
                                                {
                                                  staticClass: "item-cell-inner"
                                                },
                                                [
                                                  _c(
                                                    "base-popover",
                                                    {
                                                      attrs: {
                                                        width:
                                                          _vm.mainWidth - 54
                                                      }
                                                    },
                                                    [
                                                      _c(
                                                        "div",
                                                        [
                                                          _vm._t(
                                                            "expand",
                                                            null,
                                                            {
                                                              index:
                                                                props.itemIndex,
                                                              row: _vm.clearObj(
                                                                props.item
                                                              )
                                                            }
                                                          )
                                                        ],
                                                        2
                                                      ),
                                                      _vm._v(" "),
                                                      _c("base-icon", {
                                                        staticStyle: {
                                                          cursor: "pointer"
                                                        },
                                                        attrs: {
                                                          slot: "reference",
                                                          "icon-name":
                                                            "arrowCarrotRight",
                                                          "icon-color":
                                                            "#c0c4cc",
                                                          width: "16",
                                                          height: "16"
                                                        },
                                                        nativeOn: {
                                                          click: function click(
                                                            $event
                                                          ) {
                                                            return _vm.handleClickExpand(
                                                              $event
                                                            );
                                                          }
                                                        },
                                                        slot: "reference"
                                                      })
                                                    ],
                                                    1
                                                  )
                                                ],
                                                1
                                              )
                                            : item.eTip
                                              ? _c(
                                                  "div",
                                                  {
                                                    staticClass:
                                                      "item-cell-inner",
                                                    style: {
                                                      "align-items":
                                                        item.alignItems ||
                                                        "center"
                                                    }
                                                  },
                                                  [
                                                    _c("base-tooltip", [
                                                      _c(
                                                        "div",
                                                        {
                                                          staticStyle: {
                                                            "text-align":
                                                              "left",
                                                            "font-size": "13px"
                                                          }
                                                        },
                                                        [
                                                          _vm._l(
                                                            item.eTip,
                                                            function(tipProp) {
                                                              return _c(
                                                                "span",
                                                                {
                                                                  key: tipProp
                                                                },
                                                                [
                                                                  item.eTipWithProp
                                                                    ? _c(
                                                                        "span",
                                                                        [
                                                                          _vm._v(
                                                                            _vm._s(
                                                                              _vm.configTemp.filter(
                                                                                function(
                                                                                  v
                                                                                ) {
                                                                                  return (
                                                                                    v.prop ===
                                                                                    tipProp
                                                                                  );
                                                                                }
                                                                              )[0]
                                                                                .name
                                                                            ) +
                                                                              ": "
                                                                          )
                                                                        ]
                                                                      )
                                                                    : _vm._e(),
                                                                  _vm._v(" "),
                                                                  _c("span", [
                                                                    _vm.configTemp.filter(
                                                                      function(
                                                                        v
                                                                      ) {
                                                                        return (
                                                                          v.prop ===
                                                                          tipProp
                                                                        );
                                                                      }
                                                                    )[0]
                                                                      .prefix &&
                                                                    props.item[
                                                                      tipProp
                                                                    ]
                                                                      ? _c(
                                                                          "span",
                                                                          {
                                                                            staticClass:
                                                                              "prefix"
                                                                          },
                                                                          [
                                                                            _vm._v(
                                                                              _vm._s(
                                                                                _vm.configTemp.filter(
                                                                                  function(
                                                                                    v
                                                                                  ) {
                                                                                    return (
                                                                                      v.prop ===
                                                                                      tipProp
                                                                                    );
                                                                                  }
                                                                                )[0]
                                                                                  .prefix
                                                                              )
                                                                            )
                                                                          ]
                                                                        )
                                                                      : _vm._e(),
                                                                    _vm._v(" "),
                                                                    _c("span", [
                                                                      _vm._v(
                                                                        _vm._s(
                                                                          props
                                                                            .item[
                                                                            tipProp
                                                                          ]
                                                                        )
                                                                      )
                                                                    ]),
                                                                    _vm._v(" "),
                                                                    _vm.configTemp.filter(
                                                                      function(
                                                                        v
                                                                      ) {
                                                                        return (
                                                                          v.prop ===
                                                                          tipProp
                                                                        );
                                                                      }
                                                                    )[0]
                                                                      .suffix &&
                                                                    props.item[
                                                                      tipProp
                                                                    ]
                                                                      ? _c(
                                                                          "span",
                                                                          {
                                                                            staticClass:
                                                                              "suffix"
                                                                          },
                                                                          [
                                                                            _vm._v(
                                                                              _vm._s(
                                                                                _vm.configTemp.filter(
                                                                                  function(
                                                                                    v
                                                                                  ) {
                                                                                    return (
                                                                                      v.prop ===
                                                                                      tipProp
                                                                                    );
                                                                                  }
                                                                                )[0]
                                                                                  .suffix
                                                                              )
                                                                            )
                                                                          ]
                                                                        )
                                                                      : _vm._e(),
                                                                    _vm._v(" "),
                                                                    _c("br")
                                                                  ])
                                                                ]
                                                              );
                                                            }
                                                          ),
                                                          _vm._v(" "),
                                                          _c("base-icon", {
                                                            staticStyle: {
                                                              cursor: "pointer"
                                                            },
                                                            attrs: {
                                                              "icon-name":
                                                                "documentsAlt",
                                                              "icon-color":
                                                                "#c0c4cc",
                                                              width: "13",
                                                              height: "13"
                                                            },
                                                            nativeOn: {
                                                              click: function click(
                                                                $event
                                                              ) {
                                                                _vm.handleClickCopy(
                                                                  props.item,
                                                                  item.eTip
                                                                );
                                                              }
                                                            }
                                                          })
                                                        ],
                                                        2
                                                      ),
                                                      _vm._v(" "),
                                                      _c(
                                                        "span",
                                                        {
                                                          attrs: {
                                                            slot: "reference"
                                                          },
                                                          slot: "reference"
                                                        },
                                                        [
                                                          item.prefix &&
                                                          props.item[item.prop]
                                                            ? _c(
                                                                "span",
                                                                {
                                                                  staticClass:
                                                                    "prefix",
                                                                  class:
                                                                    props.item
                                                                      ._eClass[
                                                                      item.prop
                                                                    ] || ""
                                                                },
                                                                [
                                                                  _vm._v(
                                                                    _vm._s(
                                                                      item.prefix
                                                                    )
                                                                  )
                                                                ]
                                                              )
                                                            : _vm._e(),
                                                          _vm._v(" "),
                                                          item.prop === "_index"
                                                            ? _c("span", [
                                                                _vm._v(
                                                                  _vm._s(
                                                                    props.itemIndex +
                                                                      1
                                                                  )
                                                                )
                                                              ])
                                                            : item.filterable
                                                              ? _c(
                                                                  "span",
                                                                  {
                                                                    staticClass:
                                                                      "tag",
                                                                    class:
                                                                      item
                                                                        .filterTag[
                                                                        props
                                                                          .item[
                                                                          item
                                                                            .prop
                                                                        ]
                                                                      ] ||
                                                                      "defaultTag"
                                                                  },
                                                                  [
                                                                    _vm._v(
                                                                      _vm._s(
                                                                        props
                                                                          .item[
                                                                          item
                                                                            .prop
                                                                        ]
                                                                      )
                                                                    )
                                                                  ]
                                                                )
                                                              : item.eClass
                                                                ? _c(
                                                                    "span",
                                                                    {
                                                                      class:
                                                                        props
                                                                          .item
                                                                          ._eClass[
                                                                          item
                                                                            .prop
                                                                        ]
                                                                    },
                                                                    [
                                                                      _vm._v(
                                                                        _vm._s(
                                                                          props
                                                                            .item[
                                                                            item
                                                                              .prop
                                                                          ]
                                                                        )
                                                                      )
                                                                    ]
                                                                  )
                                                                : _c("span", [
                                                                    _vm._v(
                                                                      _vm._s(
                                                                        props
                                                                          .item[
                                                                          item
                                                                            .prop
                                                                        ]
                                                                      )
                                                                    )
                                                                  ]),
                                                          _vm._v(" "),
                                                          item.suffix &&
                                                          props.item[item.prop]
                                                            ? _c(
                                                                "span",
                                                                {
                                                                  staticClass:
                                                                    "suffix",
                                                                  class:
                                                                    props.item
                                                                      ._eClass[
                                                                      item.prop
                                                                    ] || ""
                                                                },
                                                                [
                                                                  _vm._v(
                                                                    _vm._s(
                                                                      item.suffix
                                                                    )
                                                                  )
                                                                ]
                                                              )
                                                            : _vm._e()
                                                        ]
                                                      )
                                                    ])
                                                  ],
                                                  1
                                                )
                                              : _c(
                                                  "div",
                                                  {
                                                    staticClass:
                                                      "item-cell-inner",
                                                    style: {
                                                      "align-items":
                                                        item.alignItems ||
                                                        "center"
                                                    }
                                                  },
                                                  [
                                                    item.prefix &&
                                                    props.item[item.prop]
                                                      ? _c(
                                                          "span",
                                                          {
                                                            staticClass:
                                                              "prefix",
                                                            class:
                                                              props.item
                                                                ._eClass[
                                                                item.prop
                                                              ] || ""
                                                          },
                                                          [
                                                            _vm._v(
                                                              _vm._s(
                                                                item.prefix
                                                              )
                                                            )
                                                          ]
                                                        )
                                                      : _vm._e(),
                                                    _vm._v(" "),
                                                    item.prop === "_index"
                                                      ? _c("span", [
                                                          _vm._v(
                                                            _vm._s(
                                                              props.itemIndex +
                                                                1
                                                            )
                                                          )
                                                        ])
                                                      : item.filterable
                                                        ? _c(
                                                            "span",
                                                            {
                                                              staticClass:
                                                                "tag",
                                                              class:
                                                                item.filterTag[
                                                                  props.item[
                                                                    item.prop
                                                                  ]
                                                                ] ||
                                                                "defaultTag"
                                                            },
                                                            [
                                                              _vm._v(
                                                                _vm._s(
                                                                  props.item[
                                                                    item.prop
                                                                  ]
                                                                )
                                                              )
                                                            ]
                                                          )
                                                        : item.eClass
                                                          ? _c(
                                                              "span",
                                                              {
                                                                class:
                                                                  props.item
                                                                    ._eClass[
                                                                    item.prop
                                                                  ]
                                                              },
                                                              [
                                                                _vm._v(
                                                                  _vm._s(
                                                                    props.item[
                                                                      item.prop
                                                                    ]
                                                                  )
                                                                )
                                                              ]
                                                            )
                                                          : _c("span", [
                                                              _vm._v(
                                                                _vm._s(
                                                                  props.item[
                                                                    item.prop
                                                                  ]
                                                                )
                                                              )
                                                            ]),
                                                    _vm._v(" "),
                                                    item.suffix &&
                                                    props.item[item.prop]
                                                      ? _c(
                                                          "span",
                                                          {
                                                            staticClass:
                                                              "suffix",
                                                            class:
                                                              props.item
                                                                ._eClass[
                                                                item.prop
                                                              ] || ""
                                                          },
                                                          [
                                                            _vm._v(
                                                              _vm._s(
                                                                item.suffix
                                                              )
                                                            )
                                                          ]
                                                        )
                                                      : _vm._e()
                                                  ]
                                                )
                                        ]
                                  ],
                                  2
                                );
                              }
                            )
                          )
                        ];
                      }
                    }
                  ])
                })
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "div",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: _vm.showSummary,
                    expression: "showSummary"
                  }
                ],
                ref: "tBottom",
                staticClass: "t-bottom"
              },
              [
                _c("div", { ref: "tBottomTable" }, [
                  _c(
                    "div",
                    { staticClass: "bottom-line" },
                    _vm._l(
                      _vm.configTemp.filter(function(v) {
                        return !v.isHidden;
                      }),
                      function(item, configIndex) {
                        return _c(
                          "div",
                          {
                            key: configIndex,
                            staticClass: "bottom-cell",
                            style: { flex: _vm.colWidth[configIndex] }
                          },
                          [
                            item.prop === "_expand" && item.expandSummary
                              ? _c(
                                  "span",
                                  [
                                    _c(
                                      "base-popover",
                                      { attrs: { width: _vm.mainWidth - 54 } },
                                      [
                                        _vm._t("summary", null, {
                                          data: _vm.dataTemp
                                        }),
                                        _vm._v(" "),
                                        _c("base-icon", {
                                          staticStyle: { cursor: "pointer" },
                                          attrs: {
                                            slot: "reference",
                                            "icon-name": "arrowCarrotRight",
                                            "icon-color": "#c0c4cc",
                                            width: "16",
                                            height: "16"
                                          },
                                          nativeOn: {
                                            click: function click($event) {
                                              return _vm.handleClickExpand(
                                                $event
                                              );
                                            }
                                          },
                                          slot: "reference"
                                        })
                                      ],
                                      2
                                    )
                                  ],
                                  1
                                )
                              : _vm._e(),
                            _vm._v(" "),
                            item.prefix
                              ? _c("span", [_vm._v(_vm._s(item.prefix))])
                              : _vm._e(),
                            _vm._v(" "),
                            item.summary
                              ? _c("span", [
                                  _vm._v(
                                    _vm._s(
                                      _vm.summaryData.filter(function(v) {
                                        return v.prop === item.prop;
                                      })[0].value
                                    )
                                  )
                                ])
                              : _vm._e(),
                            _vm._v(" "),
                            item.suffix
                              ? _c("span", [_vm._v(_vm._s(item.suffix))])
                              : _vm._e()
                          ]
                        );
                      }
                    )
                  )
                ])
              ]
            )
          ]
        ),
        _vm._v(" "),
        _c("div", { staticClass: "clipboard" }, [
          _c("input", { ref: "clipboardInput", attrs: { type: "text" } })
        ]),
        _vm._v(" "),
        _c("resize-observer", { on: { notify: _vm.setSize } })
      ],
      1
    );
  },
  staticRenderFns: [],
  _scopeId: "data-v-a6686fb6",
  name: "VueVirtualTable",
  components: {
    VirtualScroller: VirtualScroller,
    ResizeObserver: ResizeObserver,
    BasePopover: BasePopover,
    BaseButton: BaseButton,
    BaseSelect: BaseSelect,
    BaseInput: BaseInput,
    BaseCheckgroup: BaseCheckgroup,
    BaseTooltip: BaseTooltip,
    BaseIcon: BaseIcon
  },
  props: {
    config: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    data: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    height: {
      type: Number,
      default: function _default() {
        return 300;
      }
    },
    selectable: {
      type: Boolean,
      default: function _default() {
        return false;
      }
    },
    defaultSelect: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    itemHeight: {
      type: Number,
      default: function _default() {
        return 42;
      }
    },
    refreshConfig: {
      type: Boolean,
      default: function _default() {
        return false;
      }
    },
    minWidth: {
      type: Number,
      default: function _default() {
        return 1200;
      }
    },
    bordered: {
      type: Boolean,
      default: function _default() {
        return false;
      }
    },
    enableExport: {
      type: Boolean,
      default: function _default() {
        return false;
      }
    },
    enableMultiHeader: {
      type: Boolean,
      default: function _default() {
        return false;
      }
    },
    multiHeader: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    hoverHighlight: {
      type: Boolean,
      default: function _default() {
        return true;
      }
    },
    language: {
      type: String,
      default: function _default() {
        return "cn";
      }
    }
  },
  computed: {},
  data: function data() {
    return {
      mainWidth: 600,
      colWidth: [],
      sortParam: { col: "", direction: "asc" },
      dataInitTemp: [],
      dataTemp: [],
      configTemp: [],
      summaryData: [],
      showSummary: false,
      lastConfigTemp: [],
      allOperatorType: [
        {
          value: "eq",
          label: "＝"
        },
        {
          value: "neq",
          label: "≠"
        },
        {
          value: "lt",
          label: "＜"
        },
        {
          value: "le",
          label: "≤"
        },
        {
          value: "gt",
          label: "＞"
        },
        {
          value: "ge",
          label: "≥"
        },
        {
          value: "bt",
          label: "between"
        }
      ],
      allPhraseOperator: [
        {
          value: "in",
          label: "Include"
        },
        {
          value: "out",
          label: "Exclude"
        }
      ],
      multiConfigTemp: [],
      minWidthTemp: 0,
      phraseLimit: 6,
      languageOptions: {
        en: {
          selectAll: "All",
          phraseFilter: {
            in: "Include",
            out: "Exclude",
            ph: 'Press "Enter" to Confirm',
            and_btn: "And",
            clear_btn: "Clear"
          },
          selectFilter: {
            confirm_btn: "Confirm",
            reverse_btn: "Reverse",
            clear_btn: "Clear"
          },
          numberFilter: {
            eq: "=",
            neq: "≠",
            lt: "＜",
            le: "≤",
            gt: "＞",
            ge: "≥",
            bt: "between",
            clear_btn: "Clear"
          }
        },
        cn: {
          selectAll: "全选",
          phraseFilter: {
            in: "包含",
            out: "不包含",
            ph: "按“回车”确定",
            and_btn: "并且",
            clear_btn: "清除"
          },
          selectFilter: {
            confirm_btn: "确定",
            reverse_btn: "反转",
            clear_btn: "清除"
          },
          numberFilter: {
            eq: "=",
            neq: "≠",
            lt: "＜",
            le: "≤",
            gt: "＞",
            ge: "≥",
            bt: "之间",
            clear_btn: "清除"
          }
        }
      }
    };
  },
  mounted: function mounted() {
    this.updateBase();
    this.refreshSummary();
    this.setSize();
  },

  watch: {
    data: function data() {
      this.update();
    },
    config: function config() {
      this.update();
    },
    multiHeader: function multiHeader() {
      this.update();
    },
    defaultSelect: function defaultSelect() {
      this.update();
    },
    height: function height() {
      this.setSize();
    }
  }
}),
_defineProperty(_render$staticRenderF, "computed", {}),
_defineProperty(_render$staticRenderF, "methods", {
  updateBase: function updateBase() {
    var self = this;
    self.configTemp = self.deepCopy(self.config);
    self.dataInitTemp = self.deepCopy(self.data);
    this.minWidthTemp = this.minWidth;
    if (this.enableMultiHeader) {
      var _countLevel = this.countLevel(this.multiHeader),
        config = _countLevel.config,
        width = _countLevel.width,
        multiConfig = _countLevel.multiConfig;

      this.configTemp = self.deepCopy(config);
      this.minWidthTemp = width;
      this.multiConfigTemp = self.deepCopy(multiConfig);
    }
    self.parseConfig();
    self.updateInitData();
    self.dataTemp = self.deepCopy(self.dataInitTemp);
  },
  update: function update() {
    var self = this;
    self.lastConfigTemp = self.deepCopy(self.configTemp);
    self.updateBase();
    self.handleClickConfirmFilter();
    self.refreshSummary();
    self.setSize();
    self.$emit(
      "changeSelection",
      self.dataInitTemp.filter(function(v) {
        return v._eSelected === true;
      })
    );
  },
  countLevel: function countLevel(originConfig) {
    var separate_code = ".";
    var flattenObject = function flattenObject(obj) {
      var prefix =
        arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      var depth =
        arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;

      depth--;
      return Object.keys(obj).reduce(function(acc, k) {
        var pre = prefix.length ? prefix + separate_code : "";
        if (
          _typeof(obj[k]) === "object" &&
          !Array.isArray(obj[k]) &&
          depth >= 1
        )
          Object.assign(acc, flattenObject(obj[k], pre + k, depth));
        else acc[pre + k] = obj[k];
        return acc;
      }, {});
    };
    var handleConfigData = function handleConfigData(config) {
      var index =
        arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var depth = arguments[2];

      var rtn_data = [];

      var _loop = function _loop(name, data) {
        var item = {};
        if (
          (typeof data === "undefined" ? "undefined" : _typeof(data)) ==
            "object" &&
          Object.keys(data).length
        ) {
          var l = 0;
          var temp = handleConfigData(data, index + 1, depth - 1);
          temp = temp.map(function(v) {
            v.path = name + "." + v.path;
            if (v.level == index + 2) {
              l += v.colspan;
            }
            return v;
          });
          rtn_data = rtn_data.concat(temp);
          item.rowspan = 1;
          item.colspan = l;
        } else {
          item.rowspan = depth;
          item.colspan = 1;
        }
        item.path = name;
        item.name = name;
        item.level = index + 1;
        rtn_data.push(item);
      };

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (
          var _iterator = Object.entries(config)[Symbol.iterator](), _step;
          !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
          _iteratorNormalCompletion = true
        ) {
          var _ref = _step.value;

          var _ref2 = _slicedToArray(_ref, 2);

          var name = _ref2[0];
          var data = _ref2[1];

          _loop(name, data);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return rtn_data;
    };
    var config_pain = flattenObject(originConfig, "");
    var width = 0;
    var config = Object.keys(config_pain).map(function(v) {
      width += 100;
      return { prop: v, name: v };
    });
    var allLevels = Object.keys(config_pain).map(function(v) {
      return v.split(separate_code).length;
    });
    var maxLevel = Math.max.apply(Math, _toConsumableArray(allLevels));
    var rtn_data = handleConfigData(originConfig, 0, maxLevel);
    // rtn_data = groupby(rtn_data, ['level'])
    var multiConfig = Object.values(rtn_data);
    return { config: config, width: width, multiConfig: multiConfig };
  },
  clipboardCP: (function() {
    var _ref3 = _asyncToGenerator(
      /*#__PURE__*/ _regeneratorRuntime.mark(function _callee(text) {
        var input, result;
        return _regeneratorRuntime.wrap(
          function _callee$(_context) {
            while (1) {
              switch ((_context.prev = _context.next)) {
                case 0:
                  if (!navigator.clipboard) {
                    _context.next = 4;
                    break;
                  }

                  return _context.abrupt(
                    "return",
                    navigator.clipboard.writeText(text)
                  );

                case 4:
                  input = this.$refs.clipboardInput;

                  input.value = text;
                  input.focus();
                  input.select();
                  result = document.execCommand("copy");

                  if (!(result === "unsuccessful")) {
                    _context.next = 11;
                    break;
                  }

                  return _context.abrupt("return", false);

                case 11:
                  return _context.abrupt("return", true);

                case 12:
                case "end":
                  return _context.stop();
              }
            }
          },
          _callee,
          this
        );
      })
    );

    function clipboardCP(_x4) {
      return _ref3.apply(this, arguments);
    }

    return clipboardCP;
  })(),
  handleClickCopy: function handleClickCopy(props, tips) {
    var text = "";
    for (var i = 0; i < tips.length; i++) {
      text += props[tips[i]];
      if (i < tips.length - 1) {
        text += "\n";
      }
    }
    this.clipboardCP(text)
      .then(function(result) {})
      .catch(function(err) {
        console.log(err);
      });
  },
  handleExportTable: function handleExportTable() {
    var header = {};
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (
        var _iterator2 = this.configTemp[Symbol.iterator](), _step2;
        !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done);
        _iteratorNormalCompletion2 = true
      ) {
        var v = _step2.value;

        if (!["_index", "_action", "_expand"].includes(v.prop)) {
          header[v.prop] = v.name || v.prop;
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    var data = this.deepCopy(this.dataTemp);
    data = data.map(function(v) {
      var item = {};
      for (var prop in header) {
        item[prop] = v[prop];
      }
      return item;
    });
    data.unshift(header);
    var columns = Object.keys(header);
    var title = new Date().toLocaleDateString() + ".csv";
    this.exportCsv(data, columns, title);
  },
  parseConfig: function parseConfig() {
    var self = this;
    self.configTemp.forEach(function(v, i) {
      var last_item =
        self.lastConfigTemp.filter(function(item) {
          return item.prop === v.prop;
        })[0] || {};
      if (self.refreshConfig) {
        last_item = {};
      }
      if (!v.width) {
        self.$set(v, "width", "auto");
      }
      if (!v.filterTag) {
        self.$set(v, "filterTag", {});
      }
      if (v.filterable) {
        var options = self.dataInitTemp.reduce(function(prev, curr) {
          if (curr) {
            prev.push(curr[v.prop]);
          }
          return prev;
        }, []);
        var filterOptions = []
          .concat(_toConsumableArray(new Set(options)))
          .sort(function(a, b) {
            return a.localeCompare(b);
          });
        self.$set(v, "filterOptions", filterOptions);
        var selecetedOptions = last_item["filterSelectedOptions"] || [];
        var l = selecetedOptions.length;
        for (var index = l - 1; index >= 0; index--) {
          if (filterOptions.indexOf(selecetedOptions[index]) === -1) {
            selecetedOptions.splice(index, 1);
          }
        }
        self.$set(v, "filterSelectedOptions", selecetedOptions);
        self.$set(v, "filterVisible", false);
      }
      if (v.searchable) {
        var searchPhrase = last_item["searchPhrase"] || [
          { operator: "in", value: "" }
        ];
        self.$set(v, "searchPhrase", searchPhrase);
        self.$set(v, "searchVisible", false);
      }
      if (v.numberFilter) {
        var filterPhrase = last_item["numberFilterPhrase"] || {
          operator: "le",
          value: ["", ""]
        };
        self.$set(v, "numberFilterPhrase", filterPhrase);
        self.$set(v, "numberFilterVisible", false);
      }
    });
  },
  updateInitData: function updateInitData() {
    var _this = this;

    var self = this;
    self.dataInitTemp.forEach(function(v, i) {
      v._eId = self._uuid();
      v._eSelected = false;
      if (_this.defaultSelect && _this.defaultSelect.indexOf(i) > -1) {
        v._eSelected = true;
      }
      v._eClass = {};
      self.configTemp.forEach(function(v1, i1) {
        if (v1.eClass) {
          v._eClass[v1.prop] = self.parseClass(v1.eClass, v);
        }
      });
    });
  },
  parseClass: function parseClass(eClass, item) {
    var _this2 = this;

    var result = {};

    var _loop2 = function _loop2(cl) {
      var text = eClass[cl];
      var props = text.match(/\${[\w-_]+}/g);
      props = props || [];
      props.forEach(function(v, i) {
        var this_prop = v.replace(/\${([\w-_]+)}/, "$1");
        text = text.replace(v, item[this_prop] || 0);
      });
      result[cl] = _this2.evalFunc(text);
    };

    for (var cl in eClass) {
      _loop2(cl);
    }
    return result;
  },
  evalFunc: function evalFunc(phrase) {
    var fun = new Function("return " + phrase);
    return fun();
  },
  refreshSummary: function refreshSummary() {
    var _this3 = this;

    var self = this;
    var l = self.dataTemp.length;
    var summary = [];
    self.showSummary = false;
    self.configTemp.forEach(function(v, i) {
      var prop = v.prop;
      if (!v.summary) {
        return;
      }
      self.showSummary = true;
      var summary_item = {};
      summary_item.prop = prop;
      switch (v.summary) {
        case "COUNT":
          summary_item.value = l;
          summary.push(summary_item);
          break;
        case "SUM":
          summary_item.value = self.dataTemp.reduce(function(prev, curr) {
            if (!isNaN(curr[prop])) {
              var this_num = Number(curr[prop]);
              prev += this_num;
            }
            return prev;
          }, 0);
          summary_item.value = Number(summary_item.value.toFixed(2));
          summary.push(summary_item);
          break;
      }
    });
    self.configTemp.forEach(function(v, i) {
      var prop = v.prop;
      if (!v.summary) {
        return;
      }
      var summary_item = {};
      summary_item.prop = prop;
      if (/\${[\w-_]+}/.test(v.summary)) {
        var _text = v.summary;
        var props = _text.match(/\${[\w-_]+}/g);
        props.forEach(function(v1, i1) {
          var this_prop = v1.replace(/\${([\w-_]+)}/, "$1");
          _text = _text.replace(
            v1,
            summary.filter(function(val) {
              return val.prop === this_prop;
            })[0].value || 0
          );
        });
        summary_item.value = _this3.evalFunc(_text);
        summary_item.value = Number(summary_item.value.toFixed(2));
        summary.push(summary_item);
      }
    });
    self.summaryData = summary.slice();
    self.summaryData.splice(0, 0);
  },
  selectAll: function selectAll() {
    var r = true;
    if (
      this.dataTemp.length ===
      this.dataTemp.filter(function(item) {
        return item._eSelected === true;
      }).length
    ) {
      r = false;
    }
    var eIds = [];
    this.dataTemp.forEach(function(item) {
      item._eSelected = r;
      var eId = item._eId;
      eIds.push(eId);
    });
    this.dataInitTemp
      .filter(function(v) {
        return eIds.includes(v._eId);
      })
      .map(function(item) {
        item._eSelected = r;
      });
    this.dataTemp.splice(0, 0);
    this.dataInitTemp.splice(0, 0);
    this.$emit(
      "changeSelection",
      this.dataInitTemp.filter(function(v) {
        return v._eSelected === true;
      })
    );
  },
  handleClickItem: function handleClickItem(item) {
    var self = this;
    item._eSelected = !item._eSelected && this.selectable;
    self.dataInitTemp.filter(function(v, i) {
      return v._eId === item._eId;
    })[0]._eSelected =
      item._eSelected;
    self.dataTemp.filter(function(v, i) {
      return v._eId === item._eId;
    })[0]._eSelected =
      item._eSelected;
    self.dataTemp.splice(0, 0);
    self.dataInitTemp.splice(0, 0);
    self.$emit(
      "changeSelection",
      self.dataInitTemp.filter(function(v) {
        return v._eSelected === true;
      })
    );
  },
  handleClickConfirmFilter: function handleClickConfirmFilter(index) {
    var self = this;
    var temp = self.deepCopy(self.dataInitTemp);
    self.configTemp.forEach(function(v, i) {
      var prop = v.prop;
      if (v.filterSelectedOptions && v.filterSelectedOptions.length) {
        temp = temp.filter(function(item) {
          return v.filterSelectedOptions.indexOf(item[prop]) > -1;
        });
      }
      if (
        v.searchPhrase &&
        v.searchPhrase.findIndex(function(v) {
          return v.value != "";
        }) > -1
      ) {
        v.searchPhrase
          .filter(function(v) {
            return v.value != "";
          })
          .forEach(function(fp) {
            if (fp.operator == "out") {
              temp = temp.filter(function(item) {
                return (
                  (item[prop] || "")
                    .toLowerCase()
                    .indexOf(fp.value.toLowerCase()) === -1
                );
              });
            } else {
              temp = temp.filter(function(item) {
                return (
                  (item[prop] || "")
                    .toLowerCase()
                    .indexOf(fp.value.toLowerCase()) > -1
                );
              });
            }
          });
      }
      if (
        v.numberFilterPhrase &&
        v.numberFilterPhrase.value[0] !== "" &&
        (v.numberFilterPhrase.operator !== "bt" ||
          (v.numberFilterPhrase.value[1] !== "" &&
            v.numberFilterPhrase.operator === "bt"))
      ) {
        switch (v.numberFilterPhrase.operator) {
          case "eq":
            temp = temp.filter(function(item) {
              return (
                Number(item[prop]) == Number(v.numberFilterPhrase.value[0])
              );
            });
            break;
          case "neq":
            temp = temp.filter(function(item) {
              return (
                Number(item[prop]) != Number(v.numberFilterPhrase.value[0])
              );
            });
            break;
          case "lt":
            temp = temp.filter(function(item) {
              return Number(item[prop]) < Number(v.numberFilterPhrase.value[0]);
            });
            break;
          case "le":
            temp = temp.filter(function(item) {
              return (
                Number(item[prop]) <= Number(v.numberFilterPhrase.value[0])
              );
            });
            break;
          case "gt":
            temp = temp.filter(function(item) {
              return Number(item[prop]) > Number(v.numberFilterPhrase.value[0]);
            });
            break;
          case "ge":
            temp = temp.filter(function(item) {
              return (
                Number(item[prop]) >= Number(v.numberFilterPhrase.value[0])
              );
            });
            break;
          case "bt":
            temp = temp.filter(function(item) {
              return (
                Number(item[prop]) > Number(v.numberFilterPhrase.value[0]) &&
                Number(item[prop]) <= Number(v.numberFilterPhrase.value[1])
              );
            });
            break;
        }
      }
    });
    self.dataTemp = temp;
    if (index != undefined && self.configTemp[index]) {
      self.$set(self.configTemp[index], "filterVisible", false);
    }
    self.handleClickSort(self.sortParam.col, self.sortParam.direction, true);
    self.refreshSummary();
  },
  handleClickReverseFilter: function handleClickReverseFilter(index) {
    var options = this.configTemp[index].filterOptions.slice();
    var selecetedOptions = this.configTemp[index].filterSelectedOptions.slice();
    this.configTemp[index].filterSelectedOptions = options.reduce(function(
      prev,
      curr
    ) {
      if (selecetedOptions.indexOf(curr) === -1) {
        prev.push(curr);
      }
      return prev;
    },
    []);
    this.handleClickConfirmFilter(index);
  },
  handleClickClearFilter: function handleClickClearFilter(index) {
    this.configTemp[index].filterSelectedOptions = [];
    this.handleClickConfirmFilter(index);
  },
  handleClickEmptyNumberFilter: function handleClickEmptyNumberFilter(index) {
    this.configTemp[index].numberFilterPhrase.value = ["", ""];
    this.handleClickConfirmFilter(index);
    this.$set(this.configTemp[index], "numberFilterVisible", false);
  },
  addFilterPhrase: function addFilterPhrase(index) {
    if (this.configTemp[index].searchPhrase.length >= this.phraseLimit) {
      return;
    }
    this.configTemp[index].searchPhrase.push({ operator: "in", value: "" });
  },
  removePhraseFilter: function removePhraseFilter(index, ph_index) {
    this.configTemp[index].searchPhrase.splice(ph_index, 1);
    this.handleClickConfirmFilter(index);
    // let sp_temp = this.configTemp[index].searchPhrase.slice()
    // sp_temp.splice(ph_index, 1)
    // this.configTemp
  },
  handleClickEmptyPhraseFilter: function handleClickEmptyPhraseFilter(index) {
    this.configTemp[index].searchPhrase = [{ operator: "in", value: "" }];
    this.handleClickConfirmFilter(index);
  },
  handleChangeFilter: function handleChangeFilter(val) {},
  handleClickSort: function handleClickSort(val, direction, forse) {
    var self = this;
    if (
      self.sortParam.col === val &&
      self.sortParam.direction === direction &&
      !forse
    ) {
      return;
    }
    if (!self.dataTemp[0] || !val) {
      return;
    }
    self.sortParam.col = val;
    self.sortParam.direction = direction;
    var isNumber = false;
    self.dataTemp.some(function(v, i) {
      if (!v[val] && v[val] != 0) {
        return false;
      }
      if (isNaN(v[val]) && v[val] != "NaN") {
        isNumber = false;
        return true;
      } else {
        isNumber = true;
        return true;
      }
    });
    if (direction === "asc") {
      if (!isNumber) {
        // let a_cp = a[val]||'', b_cp = b[val]||''
        self.dataTemp.sort(function(a, b) {
          return (a[val] || "").localeCompare(b[val] || "");
        });
      } else {
        self.dataTemp.sort(function(a, b) {
          if (isNaN(a[val])) {
            return -b[val] < 0 ? -1 : 1;
          }
          if (isNaN(b[val])) {
            return a[val] < 0 ? -1 : 1;
          }
          return a[val] - b[val] < 0 ? -1 : 1;
        });
      }
    } else {
      if (!isNumber) {
        // let a_cp = a[val]||'', b_cp = b[val]||''
        self.dataTemp.sort(function(a, b) {
          return -(a[val] || "").localeCompare(b[val] || "");
        });
      } else {
        self.dataTemp.sort(function(a, b) {
          if (isNaN(a[val])) {
            return -b[val] > 0 ? -1 : 1;
          }
          if (isNaN(b[val])) {
            return a[val] > 0 ? -1 : 1;
          }
          return a[val] - b[val] > 0 ? -1 : 1;
        });
      }
    }
  },
  handleClickAction: function handleClickAction(eve) {
    eve.stopPropagation();
  },
  handleClickExpand: function handleClickExpand(eve) {
    eve.stopPropagation();
  },
  setSize: function setSize() {
    if (!this.$refs || !this.$refs.tContainer) {
      return;
    }
    var scrollBarWidth =
      this.$refs.scroller.$el.offsetWidth - this.$refs.scroller.$el.clientWidth;
    var mainWidth = Number(
      this.$refs.mainTable.getBoundingClientRect().width.toFixed(1)
    );
    mainWidth = Math.max(mainWidth, this.minWidth);
    this.mainWidth = this.$refs.mainScroll.getBoundingClientRect().width;
    this.$refs.tContainer.setAttribute(
      "style",
      "width:" +
        mainWidth +
        "px;height:" +
        (this.height - 50 - 50 * (this.showSummary ? 1 : 0)) +
        "px"
    );
    this.$refs.tHeaderTable.setAttribute(
      "style",
      "width:" + (mainWidth - scrollBarWidth) + "px"
    );
    if (this.$refs.tBottom) {
      this.$refs.tBottomTable.setAttribute(
        "style",
        "width:" + (mainWidth - scrollBarWidth) + "px"
      );
    }
    var colNumber = this.configTemp.filter(function(v) {
      return !v.isHidden;
    }).length;
    var usedWidth = 0,
      averageColNum = 0;
    this.configTemp
      .filter(function(v) {
        return !v.isHidden;
      })
      .forEach(function(v, i) {
        if (v.width === "auto") {
          averageColNum += 1;
        } else {
          usedWidth += Number(v.width);
        }
      });
    var averageWidth = Number(
      ((mainWidth - usedWidth) / averageColNum).toFixed(1)
    );
    for (var i = 0; i < colNumber; i++) {
      if (
        isNaN(
          this.configTemp.filter(function(v) {
            return !v.isHidden;
          })[i].width
        )
      ) {
        this.colWidth[i] = (averageWidth * 100 / mainWidth).toFixed(1);
      } else {
        this.colWidth[i] = (
          this.configTemp.filter(function(v) {
            return !v.isHidden;
          })[i].width *
          100 /
          mainWidth
        ).toFixed(1);
      }
    }
    this.colWidth.splice(0, 0);
    if (
      this.$refs.mainScroll.getBoundingClientRect().width < this.minWidthTemp
    ) {
      this.$refs.mainScroll.setAttribute("style", "overflow-x: scroll;");
    } else {
      this.$refs.mainScroll.setAttribute("style", "overflow-x: hidden;");
    }
  },
  _uuid: function _uuid() {
    var d = Date.now();
    if (
      typeof performance !== "undefined" &&
      typeof performance.now === "function"
    ) {
      d += performance.now(); //use high-precision timer if available
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = ((d + Math.random() * 16) % 16) | 0;
      d = Math.floor(d / 16);
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  },
  deepCopy: function deepCopy(obj) {
    var obj_cp = JSON.parse(JSON.stringify(obj));
    return obj_cp;
  },
  clearObj: function clearObj(obj) {
    var obj_cp = JSON.parse(JSON.stringify(obj));
    delete obj_cp._eClass;
    delete obj_cp._eId;
    delete obj_cp._eSelected;
    return obj_cp;
  },
  json2csv: function json2csv(array) {
    var str = "";
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (
        var _iterator3 = array[Symbol.iterator](), _step3;
        !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done);
        _iteratorNormalCompletion3 = true
      ) {
        var _item = _step3.value;

        var line = "";
        for (var index in _item) {
          if (line != "") line += ",";
          line += _item[index];
        }
        str += line + "\r\n";
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    return str;
  },
  JSONtoCSV: function JSONtoCSV(arr, columns) {
    var delimiter =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ",";

    return []
      .concat(
        _toConsumableArray(
          arr.map(function(obj) {
            return columns.reduce(function(acc, key) {
              return (
                "" +
                acc +
                (!acc.length ? "" : delimiter) +
                '"' +
                (!obj[key] ? "" : obj[key]) +
                '"'
              );
            }, "");
          })
        )
      )
      .join("\n");
  },
  exportCsv: function exportCsv(data, columns, title) {
    var csv = this.JSONtoCSV(data, columns);

    var createAndDownloadFile = function createAndDownloadFile(
      fileName,
      content
    ) {
      var aTag = document.createElement("a");
      var blob = new Blob(["\uFEFF", content]);
      aTag.download = fileName;
      aTag.href = URL.createObjectURL(blob);
      aTag.click();
      URL.revokeObjectURL(blob);
    };
    createAndDownloadFile(title, csv);
  }
}),
_render$staticRenderF);

// Import vue component
// install function executed by Vue.use()
function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component("VueVirtualTable", Component);
}

// Create module definition for Vue.use()
var plugin = {
  install: install
};

// To auto-install when vue is found
var GlobalVue = null;
if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

// It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;

export default Component;
export { install };

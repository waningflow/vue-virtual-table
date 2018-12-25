<template>
  <div class="main-scroll" ref="mainScroll">
    <div ref="mainTable" :style="{'min-width': minWidthTemp+'px','position': 'relative'}" :class="{'bordered': bordered}">
      <div style="text-align: right; position: absolute;right: 5px;top: 5px;" v-if="enableExport" >
        <base-icon icon-name="cloudDownloadAlt" icon-color="#bbbbbb" width="20" height="20" @click.native="handleExportTable" class="download-icon"></base-icon>
      </div>
      <div class="t-header">
        <div ref="tHeaderTable">
          <template v-if="!enableMultiHeader">
            <div class="header-line">
              <div class="header-cell" v-for="(item, configIndex) in configTemp.filter(v=>!v.isHidden)" :key="configIndex" :style="{flex: colWidth[configIndex]}">
                <div class="header-cell-inner search-wrapper" v-if="item.searchable">
                  <base-popover :width="340">
                    <div style="padding: 10px;text-align: left;font-size: 0">
                      <template v-for="(phrase, ph_index) in item.searchPhrase">
                        <base-select v-model="phrase.operator" @change="handleClickConfirmFilter(configIndex)" :choice-list="allPhraseOperator.map(v=>({value: v.value, label: languageOptions[language].phraseFilter[v.value]}))"></base-select>
                        <base-input v-model="phrase.value" @change="handleClickConfirmFilter(configIndex)" style="margin:0 5px 6px 5px;width: 210px" :placeholder="languageOptions[language].phraseFilter['ph']" auto-focus></base-input>
                        <base-icon icon-name="closeAlt2" icon-color="#c0c4cc" style="margin-top: 9px" width="13" height="13" v-show="ph_index > 0" @click.native="removePhraseFilter(configIndex, ph_index)"></base-icon>
                      </template>
                      <div style="display: flex">
                        <base-button class="btn filterBtnEmpty" type="primary" @click.native="addFilterPhrase(configIndex)" :disabled="item.searchPhrase.length >= phraseLimit">{{languageOptions[language].phraseFilter['and_btn']}}</base-button>
                        <base-button class="btn filterBtnEmpty" style="margin-left: 5px" type="danger" @click.native="handleClickEmptyPhraseFilter(configIndex)">{{languageOptions[language].phraseFilter['clear_btn']}}</base-button>
                      </div>
                    </div>

                    <span slot="reference">
                      <span v-if="item.name" :class="{searched: item.searchPhrase.findIndex(v => v.value != '') > -1}">{{item.name}}</span>
                      <span v-else :class="{searched: item.searchPhrase.findIndex(v => v.value != '') > -1}">{{item.prop}}</span>
                    </span>
                </base-popover>
                </div>
                <div class="header-cell-inner filter-wrapper" v-else-if="item.filterable">
                  <base-popover :width="240">
                    <div style="padding: 5px;">
                      <base-checkgroup v-model="item.filterSelectedOptions" @change="handleChangeFilter" :choice-list="item.filterOptions" class="filter-list"></base-checkgroup>
                      <div class="filter-btn">
                        <base-button type="primary" @click.native="handleClickConfirmFilter(configIndex)">{{languageOptions[language].selectFilter['confirm_btn']}}</base-button>
                        <base-button type="primary" style="margin-left: 5px;" @click.native="handleClickReverseFilter(configIndex)">{{languageOptions[language].selectFilter['reverse_btn']}}</base-button>
                        <base-button type="danger" style="margin-left: 5px;" @click.native="handleClickClearFilter(configIndex)">{{languageOptions[language].selectFilter['clear_btn']}}</base-button>
                      </div>
                    </div>
                    <span slot="reference">
                      <span v-if="item.name" :class="{filtered: item.filterSelectedOptions && item.filterSelectedOptions.length}">{{item.name}}</span>
                      <span v-else :class="{filtered: item.filterSelectedOptions && item.filterSelectedOptions.length}">{{item.prop}}</span>
                      <base-icon icon-name="arrowCarrotDown" icon-color="#c0c4cc" width="16" height="16"></base-icon>
                    </span>
                  </base-popover>
                </div>
                <div class="header-cell-inner numFiltered-wrapper" v-else-if="item.numberFilter">
                  <base-popover :width="item.numberFilterPhrase.operator==='bt'?298:198">
                    <div style="padding: 10px;text-align: left;font-size: 0">
                      <base-select v-model="item.numberFilterPhrase.operator" :choice-list="allOperatorType.map(v=>({value: v.value, label: languageOptions[language].numberFilter[v.value]}))" placeholder="" @change="handleClickConfirmFilter(configIndex)"></base-select>
                      <base-input style="width: 90px;margin-left: 5px" type="number" v-model="item.numberFilterPhrase.value[0]" @change="handleClickConfirmFilter(configIndex)" auto-focus> </base-input>
                        <div style="display: inline-block;font-size: 13px" v-show="item.numberFilterPhrase.operator === 'bt'">~</div>
                        <base-input style="width: 90px;margin-left: 1px;" type="number" v-model="item.numberFilterPhrase.value[1]" v-show="item.numberFilterPhrase.operator === 'bt'" @change="handleClickConfirmFilter(configIndex)"></base-input>
                       <div style="text-align: right;">
                        <base-button style="margin-top: 10px" type="danger" @click.native="handleClickEmptyNumberFilter(configIndex)">{{languageOptions[language].numberFilter['clear_btn']}}</base-button>
                        </div>
                    </div>
                    <span slot="reference">
                      <span v-if="item.name" :class="{numFiltered: item.numberFilterPhrase.value[0] !== ''}">{{item.name}}</span>
                      <span v-else :class="{numFiltered: item.numberFilterPhrase.value[0] !== ''}">{{item.prop}}</span>
                    </span>
                  </base-popover>
                </div>
                <div class="header-cell-inner" v-else>
                  <span v-if="item.name" :class="{filtered: item.filterSelectedOptions && item.filterSelectedOptions.length}">{{item.name}}</span>
                  <span v-else :class="{filtered: item.filterSelectedOptions && item.filterSelectedOptions.length}">{{item.prop}}</span>
                </div>
                <div class="header-cell-inner all-select" v-if="selectable && item.prop==='_index'" @click="selectAll()">{{languageOptions[language].selectAll}}</div>
                <div class="header-cell-inner caret-wrapper" v-if="item.sortable">
                  <i class="sort-ascending" @click="handleClickSort(item.prop, 'asc')" :class="{selected: sortParam.col === item.prop&&sortParam.direction === 'asc'}"></i>
                  <i class="sort-descending" @click="handleClickSort(item.prop, 'desc')" :class="{selected: sortParam.col === item.prop&&sortParam.direction === 'desc'}"></i>
                </div>
              </div>
            </div>
          </template>
          <template v-if="enableMultiHeader" class="multi-header-contain">
            <div class="header-line" v-for="(hItem, hIndex) in multiConfigTemp" :key="hIndex">
              <div class="header-cell" v-for="(hdSet, hdName, hdIndex) in hItem" :colspan="hdSet.colspan" :rowspan="hdSet.rowspan" :key="hdName">{{hdSet.name}}</div>
            </div>
          </template>
        </div>
      </div>
      <div class="t-container" ref="tContainer">
        <virtual-scroller class="scroller" :items="dataTemp" :item-height="itemHeight" content-tag="div" pool-size="500" ref="scroller">
          <template slot-scope="props">
            <div class="item-line" @click="handleClickItem(props.item)" :class="{selected: props.item._eSelected, unselectable: !selectable, 'item-line-allow-hightlight': hoverHighlight}" :style="{height: itemHeight+'px'}">
              <div class="item-cell" v-for="(item, configIndex) in configTemp.filter(v=>!v.isHidden)" :style="{flex: colWidth[configIndex]}" :class="props.item._eClass[item.prop]||''" :key="configIndex">
                <template v-if="item.prop === '_action'">
                  <div class="item-cell-inner rowSlot" :style="{height: (itemHeight-12)+'px', 'align-items': item.alignItems||'center'}" @click="handleClickAction">
                    <slot :index="props.itemIndex" :row="clearObj(props.item)" :name="item.actionName||'action'" />
                  </div>
                </template>
                <template v-else>
                  <div class="item-cell-inner" v-if="item.prop === '_expand'">
                    <base-popover :width="mainWidth-54">
                      <div >
                        <slot :index="props.itemIndex" :row="clearObj(props.item)" name="expand" />
                      </div>
                      <base-icon icon-name="arrowCarrotRight" icon-color="#c0c4cc" width="16" height="16" slot="reference" style="cursor:pointer" @click.native="handleClickExpand"></base-icon>
                    </base-popover>
                  </div>
                  <div class="item-cell-inner" v-else-if="item.eTip" :style="{'align-items': item.alignItems||'center'}">
                    <base-tooltip >
                      <div style="text-align: left;font-size: 13px">
                        <span v-for="tipProp in item.eTip" :key="tipProp">
                          <span v-if="item.eTipWithProp">{{configTemp.filter(v=>v.prop===tipProp)[0].name}}: </span>
                          <span>
                            <span v-if="configTemp.filter(v=>v.prop===tipProp)[0].prefix && props.item[tipProp]" class="prefix">{{configTemp.filter(v=>v.prop===tipProp)[0].prefix}}</span>
                            <span>{{props.item[tipProp]}}</span>
                            <span v-if="configTemp.filter(v=>v.prop===tipProp)[0].suffix && props.item[tipProp]" class="suffix">{{configTemp.filter(v=>v.prop===tipProp)[0].suffix}}</span>
                            <br>
                          </span>
                        </span>
                        <base-icon icon-name="documentsAlt" icon-color="#c0c4cc" width="13" height="13" style="cursor:pointer" @click.native="handleClickCopy(props.item, item.eTip)"></base-icon>
                      </div>
                      <span slot="reference">
                        <span v-if="item.prefix && props.item[item.prop]" :class="props.item._eClass[item.prop]||''" class="prefix">{{item.prefix}}</span>
                        <span v-if="item.prop === '_index'">{{props.itemIndex + 1}}</span>
                        <span v-else-if="item.filterable" class="tag" :class="item.filterTag[props.item[item.prop]]||'defaultTag'">{{props.item[item.prop]}}</span>
                        <span v-else-if="item.eClass" :class="props.item._eClass[item.prop]">{{props.item[item.prop]}}</span>
                        <span v-else>{{props.item[item.prop]}}</span>
                        <span v-if="item.suffix && props.item[item.prop]" :class="props.item._eClass[item.prop]||''" class="suffix">{{item.suffix}}</span>
                      </span>
                    </base-tooltip>
                  </div>
                  <div class="item-cell-inner" v-else :style="{'align-items': item.alignItems||'center'}">
                    <span v-if="item.prefix && props.item[item.prop]" :class="props.item._eClass[item.prop]||''" class="prefix">{{item.prefix}}</span>
                    <span v-if="item.prop === '_index'">{{props.itemIndex + 1}}</span>
                    <span v-else-if="item.filterable" class="tag" :class="item.filterTag[props.item[item.prop]]||'defaultTag'">{{props.item[item.prop]}}</span>
                    <span v-else-if="item.eClass" :class="props.item._eClass[item.prop]">{{props.item[item.prop]}}</span>
                    <span v-else>{{props.item[item.prop]}}</span>
                    <span v-if="item.suffix &&  props.item[item.prop]" :class="props.item._eClass[item.prop]||''" class="suffix">{{item.suffix}}</span>
                  </div>
                </template>

              </div>
            </div>
          </template>
        </virtual-scroller>
      </div>
      <div class="t-bottom" ref="tBottom" v-show="showSummary">
        <div ref="tBottomTable">
          <div class="bottom-line">
            <div class="bottom-cell" v-for="(item, configIndex) in configTemp.filter(v=>!v.isHidden)" :key="configIndex" :style="{flex: colWidth[configIndex]}">
              <span v-if="item.prop === '_expand' && item.expandSummary">
                <base-popover :width="mainWidth-54">
                  <slot :data="dataTemp" name="summary" />
                  <base-icon icon-name="arrowCarrotRight" icon-color="#c0c4cc" width="16" height="16" slot="reference" style="cursor:pointer" @click.native="handleClickExpand"></base-icon>
                </base-popover>
              </span>
              <span v-if="item.prefix">{{item.prefix}}</span>
              <span v-if="item.summary">{{summaryData.filter(v => v.prop === item.prop)[0].value}}</span>
              <span v-if="item.suffix">{{item.suffix}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="clipboard">
      <input type="text" ref="clipboardInput">
    </div>
    <resize-observer @notify="setSize" />
  </div>

</template>
<script>
import VirtualScroller from "./virtual-scroller.vue";
import { ResizeObserver } from "vue-resize";
import BasePopover from "./base-popover.vue";
import BaseButton from "./base-button.vue";
import BaseSelect from "./base-select.vue";
import BaseInput from "./base-input.vue";
import BaseCheckgroup from "./base-checkgroup.vue";
import BaseTooltip from "./base-tooltip.vue";
import BaseIcon from "./base-icon.vue";
import "vue-resize/dist/vue-resize.css";

export default {
  name: "VueVirtualTable",
  components: {
    VirtualScroller,
    ResizeObserver,
    BasePopover,
    BaseButton,
    BaseSelect,
    BaseInput,
    BaseCheckgroup,
    BaseTooltip,
    BaseIcon
  },
  props: {
    config: {
      type: Array,
      default: function() {
        return [];
      }
    },
    data: {
      type: Array,
      default: function() {
        return [];
      }
    },
    height: {
      type: Number,
      default: function() {
        return 300;
      }
    },
    selectable: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    defaultSelect: {
      type: Array,
      default: function() {
        return [];
      }
    },
    itemHeight: {
      type: Number,
      default: function() {
        return 42;
      }
    },
    refreshConfig: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    minWidth: {
      type: Number,
      default: function() {
        return 1200;
      }
    },
    bordered: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    enableExport: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    enableMultiHeader: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    multiHeader: {
      type: Object,
      default: function() {
        return {};
      }
    },
    hoverHighlight: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    language: {
      type: String,
      default: function() {
        return "cn";
      }
    }
  },
  computed: {},
  data() {
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
  mounted() {
    this.updateBase();
    this.refreshSummary();
    this.setSize();
  },
  watch: {
    data() {
      this.update();
    },
    config() {
      this.update();
    },
    multiHeader() {
      this.update();
    },
    defaultSelect() {
      this.update();
    },
    height() {
      this.setSize();
    }
  },
  computed: {},
  methods: {
    updateBase() {
      let self = this;
      self.configTemp = self.deepCopy(self.config);
      self.dataInitTemp = self.deepCopy(self.data);
      this.minWidthTemp = this.minWidth;
      if (this.enableMultiHeader) {
        let { config, width, multiConfig } = this.countLevel(this.multiHeader);
        this.configTemp = self.deepCopy(config);
        this.minWidthTemp = width;
        this.multiConfigTemp = self.deepCopy(multiConfig);
      }
      self.parseConfig();
      self.updateInitData();
      self.dataTemp = self.deepCopy(self.dataInitTemp);
    },
    update() {
      let self = this;
      self.lastConfigTemp = self.deepCopy(self.configTemp);
      self.updateBase();
      self.handleClickConfirmFilter();
      self.refreshSummary();
      self.setSize();
      self.$emit(
        "changeSelection",
        self.dataInitTemp.filter(v => v._eSelected === true)
      );
    },
    countLevel(originConfig) {
      const separate_code = ".";
      const flattenObject = (obj, prefix = "", depth = 10) => {
        depth--;
        return Object.keys(obj).reduce((acc, k) => {
          const pre = prefix.length ? prefix + separate_code : "";
          if (
            typeof obj[k] === "object" &&
            !Array.isArray(obj[k]) &&
            depth >= 1
          )
            Object.assign(acc, flattenObject(obj[k], pre + k, depth));
          else acc[pre + k] = obj[k];
          return acc;
        }, {});
      };
      const handleConfigData = (config, index = 0, depth) => {
        let rtn_data = [];
        for (let [name, data] of Object.entries(config)) {
          let item = {};
          if (typeof data == "object" && Object.keys(data).length) {
            let l = 0;
            let temp = handleConfigData(data, index + 1, depth - 1);
            temp = temp.map(v => {
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
        }
        return rtn_data;
      };
      let config_pain = flattenObject(originConfig, "");
      let width = 0;
      let config = Object.keys(config_pain).map(v => {
        width += 100;
        return { prop: v, name: v };
      });
      let allLevels = Object.keys(config_pain).map(
        v => v.split(separate_code).length
      );
      let maxLevel = Math.max(...allLevels);
      let rtn_data = handleConfigData(originConfig, 0, maxLevel);
      // rtn_data = groupby(rtn_data, ['level'])
      let multiConfig = Object.values(rtn_data);
      return { config, width, multiConfig };
    },
    async clipboardCP(text) {
      if (navigator.clipboard) {
        return navigator.clipboard.writeText(text);
      } else {
        let input = this.$refs.clipboardInput;
        input.value = text;
        input.focus();
        input.select();
        const result = document.execCommand("copy");

        if (result === "unsuccessful") {
          return false;
        }
        return true;
      }
    },
    handleClickCopy(props, tips) {
      let text = "";
      for (let i = 0; i < tips.length; i++) {
        text += props[tips[i]];
        if (i < tips.length - 1) {
          text += "\n";
        }
      }
      this.clipboardCP(text)
        .then(result => {})
        .catch(err => {
          console.log(err);
        });
    },
    handleExportTable() {
      let header = {};
      for (let v of this.configTemp) {
        if (!["_index", "_action", "_expand"].includes(v.prop)) {
          header[v.prop] = v.name || v.prop;
        }
      }
      let data = this.deepCopy(this.dataTemp);
      data = data.map(v => {
        let item = {};
        for (let prop in header) {
          item[prop] = v[prop];
        }
        return item;
      });
      data.unshift(header);
      let columns = Object.keys(header);
      let title = new Date().toLocaleDateString() + ".csv";
      this.exportCsv(data, columns, title);
    },
    parseConfig() {
      let self = this;
      self.configTemp.forEach((v, i) => {
        let last_item =
          self.lastConfigTemp.filter(item => item.prop === v.prop)[0] || {};
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
          let options = self.dataInitTemp.reduce((prev, curr) => {
            if (curr) {
              prev.push(curr[v.prop]);
            }
            return prev;
          }, []);
          let filterOptions = [...new Set(options)].sort((a, b) =>
            a.localeCompare(b)
          );
          self.$set(v, "filterOptions", filterOptions);
          let selecetedOptions = last_item["filterSelectedOptions"] || [];
          let l = selecetedOptions.length;
          for (let index = l - 1; index >= 0; index--) {
            if (filterOptions.indexOf(selecetedOptions[index]) === -1) {
              selecetedOptions.splice(index, 1);
            }
          }
          self.$set(v, "filterSelectedOptions", selecetedOptions);
          self.$set(v, "filterVisible", false);
        }
        if (v.searchable) {
          let searchPhrase = last_item["searchPhrase"] || [
            { operator: "in", value: "" }
          ];
          self.$set(v, "searchPhrase", searchPhrase);
          self.$set(v, "searchVisible", false);
        }
        if (v.numberFilter) {
          let filterPhrase = last_item["numberFilterPhrase"] || {
            operator: "le",
            value: ["", ""]
          };
          self.$set(v, "numberFilterPhrase", filterPhrase);
          self.$set(v, "numberFilterVisible", false);
        }
      });
    },
    updateInitData() {
      let self = this;
      self.dataInitTemp.forEach((v, i) => {
        v._eId = self._uuid();
        v._eSelected = false;
        if (this.defaultSelect && this.defaultSelect.indexOf(i) > -1) {
          v._eSelected = true;
        }
        v._eClass = {};
        self.configTemp.forEach((v1, i1) => {
          if (v1.eClass) {
            v._eClass[v1.prop] = self.parseClass(v1.eClass, v);
          }
        });
      });
    },
    parseClass(eClass, item) {
      let result = {};
      for (let cl in eClass) {
        let text = eClass[cl];
        let props = text.match(/\${[\w-_]+}/g);
        props = props || [];
        props.forEach((v, i) => {
          let this_prop = v.replace(/\${([\w-_]+)}/, "$1");
          text = text.replace(v, item[this_prop] || 0);
        });
        result[cl] = this.evalFunc(text);
      }
      return result;
    },
    evalFunc(phrase) {
      let fun = new Function("return " + phrase);
      return fun();
    },
    refreshSummary() {
      let self = this;
      let l = self.dataTemp.length;
      let summary = [];
      self.showSummary = false;
      self.configTemp.forEach((v, i) => {
        let prop = v.prop;
        if (!v.summary) {
          return;
        }
        self.showSummary = true;
        let summary_item = {};
        summary_item.prop = prop;
        switch (v.summary) {
          case "COUNT":
            summary_item.value = l;
            summary.push(summary_item);
            break;
          case "SUM":
            summary_item.value = self.dataTemp.reduce((prev, curr) => {
              if (!isNaN(curr[prop])) {
                let this_num = Number(curr[prop]);
                prev += this_num;
              }
              return prev;
            }, 0);
            summary_item.value = Number(summary_item.value.toFixed(2));
            summary.push(summary_item);
            break;
        }
      });
      self.configTemp.forEach((v, i) => {
        let prop = v.prop;
        if (!v.summary) {
          return;
        }
        let summary_item = {};
        summary_item.prop = prop;
        if (/\${[\w-_]+}/.test(v.summary)) {
          let text = v.summary;
          let props = text.match(/\${[\w-_]+}/g);
          props.forEach((v1, i1) => {
            let this_prop = v1.replace(/\${([\w-_]+)}/, "$1");
            text = text.replace(
              v1,
              summary.filter(val => val.prop === this_prop)[0].value || 0
            );
          });
          summary_item.value = this.evalFunc(text);
          summary_item.value = Number(summary_item.value.toFixed(2));
          summary.push(summary_item);
        }
      });
      self.summaryData = summary.slice();
      self.summaryData.splice(0, 0);
    },
    selectAll() {
      let r = true;
      if (
        this.dataTemp.length ===
        this.dataTemp.filter(item => item._eSelected === true).length
      ) {
        r = false;
      }
      let eIds = [];
      this.dataTemp.forEach(item => {
        item._eSelected = r;
        let eId = item._eId;
        eIds.push(eId);
      });
      this.dataInitTemp.filter(v => eIds.includes(v._eId)).map(item => {
        item._eSelected = r;
      });
      this.dataTemp.splice(0, 0);
      this.dataInitTemp.splice(0, 0);
      this.$emit(
        "changeSelection",
        this.dataInitTemp.filter(v => v._eSelected === true)
      );
    },
    handleClickItem(item) {
      let self = this;
      item._eSelected = !item._eSelected && this.selectable;
      self.dataInitTemp.filter((v, i) => v._eId === item._eId)[0]._eSelected =
        item._eSelected;
      self.dataTemp.filter((v, i) => v._eId === item._eId)[0]._eSelected =
        item._eSelected;
      self.dataTemp.splice(0, 0);
      self.dataInitTemp.splice(0, 0);
      self.$emit(
        "changeSelection",
        self.dataInitTemp.filter(v => v._eSelected === true)
      );
    },
    handleClickConfirmFilter(index) {
      let self = this;
      let temp = self.deepCopy(self.dataInitTemp);
      self.configTemp.forEach((v, i) => {
        let prop = v.prop;
        if (v.filterSelectedOptions && v.filterSelectedOptions.length) {
          temp = temp.filter(
            item => v.filterSelectedOptions.indexOf(item[prop]) > -1
          );
        }
        if (
          v.searchPhrase &&
          v.searchPhrase.findIndex(v => v.value != "") > -1
        ) {
          v.searchPhrase.filter(v => v.value != "").forEach(fp => {
            if (fp.operator == "out") {
              temp = temp.filter(
                item =>
                  (item[prop] || "")
                    .toLowerCase()
                    .indexOf(fp.value.toLowerCase()) === -1
              );
            } else {
              temp = temp.filter(
                item =>
                  (item[prop] || "")
                    .toLowerCase()
                    .indexOf(fp.value.toLowerCase()) > -1
              );
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
              temp = temp.filter(
                item =>
                  Number(item[prop]) == Number(v.numberFilterPhrase.value[0])
              );
              break;
            case "neq":
              temp = temp.filter(
                item =>
                  Number(item[prop]) != Number(v.numberFilterPhrase.value[0])
              );
              break;
            case "lt":
              temp = temp.filter(
                item =>
                  Number(item[prop]) < Number(v.numberFilterPhrase.value[0])
              );
              break;
            case "le":
              temp = temp.filter(
                item =>
                  Number(item[prop]) <= Number(v.numberFilterPhrase.value[0])
              );
              break;
            case "gt":
              temp = temp.filter(
                item =>
                  Number(item[prop]) > Number(v.numberFilterPhrase.value[0])
              );
              break;
            case "ge":
              temp = temp.filter(
                item =>
                  Number(item[prop]) >= Number(v.numberFilterPhrase.value[0])
              );
              break;
            case "bt":
              temp = temp.filter(
                item =>
                  Number(item[prop]) > Number(v.numberFilterPhrase.value[0]) &&
                  Number(item[prop]) <= Number(v.numberFilterPhrase.value[1])
              );
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
    handleClickReverseFilter(index) {
      let options = this.configTemp[index].filterOptions.slice();
      let selecetedOptions = this.configTemp[
        index
      ].filterSelectedOptions.slice();
      this.configTemp[index].filterSelectedOptions = options.reduce(
        (prev, curr) => {
          if (selecetedOptions.indexOf(curr) === -1) {
            prev.push(curr);
          }
          return prev;
        },
        []
      );
      this.handleClickConfirmFilter(index);
    },
    handleClickClearFilter(index) {
      this.configTemp[index].filterSelectedOptions = [];
      this.handleClickConfirmFilter(index);
    },
    handleClickEmptyNumberFilter(index) {
      this.configTemp[index].numberFilterPhrase.value = ["", ""];
      this.handleClickConfirmFilter(index);
      this.$set(this.configTemp[index], "numberFilterVisible", false);
    },
    addFilterPhrase(index) {
      if (this.configTemp[index].searchPhrase.length >= this.phraseLimit) {
        return;
      }
      this.configTemp[index].searchPhrase.push({ operator: "in", value: "" });
    },
    removePhraseFilter(index, ph_index) {
      this.configTemp[index].searchPhrase.splice(ph_index, 1);
      this.handleClickConfirmFilter(index);
      // let sp_temp = this.configTemp[index].searchPhrase.slice()
      // sp_temp.splice(ph_index, 1)
      // this.configTemp
    },
    handleClickEmptyPhraseFilter(index) {
      this.configTemp[index].searchPhrase = [{ operator: "in", value: "" }];
      this.handleClickConfirmFilter(index);
    },
    handleChangeFilter(val) {},
    handleClickSort(val, direction, forse) {
      let self = this;
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
      let isNumber = false;
      self.dataTemp.some((v, i) => {
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
          self.dataTemp.sort((a, b) =>
            (a[val] || "").localeCompare(b[val] || "")
          );
        } else {
          self.dataTemp.sort((a, b) => {
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
          self.dataTemp.sort(
            (a, b) => -(a[val] || "").localeCompare(b[val] || "")
          );
        } else {
          self.dataTemp.sort((a, b) => {
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
    handleClickAction(eve) {
      eve.stopPropagation();
    },
    handleClickExpand(eve) {
      eve.stopPropagation();
    },
    setSize() {
      let self = this;
      if (!this.$refs || !this.$refs.tContainer) {
        return;
      }
      let scrollBarWidth =
        this.$refs.scroller.$el.offsetWidth -
        this.$refs.scroller.$el.clientWidth;
      let mainWidth = Number(
        this.$refs.mainTable.getBoundingClientRect().width.toFixed(1)
      );
      mainWidth = Math.max(mainWidth, this.minWidth);
      this.mainWidth = this.$refs.mainScroll.getBoundingClientRect().width;
      this.$refs.tContainer.setAttribute(
        "style",
        "width:" +
          mainWidth +
          "px;height:" +
          (this.height -
            50 -
            35 * Number(this.enableExport) -
            50 * (this.showSummary ? 1 : 0)) +
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
      let colNumber = this.configTemp.filter(v => !v.isHidden).length;
      let usedWidth = 0,
        averageColNum = 0;
      this.configTemp.filter(v => !v.isHidden).forEach((v, i) => {
        if (v.width === "auto") {
          averageColNum += 1;
        } else {
          usedWidth += Number(v.width);
        }
      });
      let averageWidth = Number(
        ((mainWidth - usedWidth) / averageColNum).toFixed(1)
      );
      for (let i = 0; i < colNumber; i++) {
        if (isNaN(this.configTemp.filter(v => !v.isHidden)[i].width)) {
          this.colWidth[i] = (averageWidth * 100 / mainWidth).toFixed(1);
        } else {
          this.colWidth[i] = (
            this.configTemp.filter(v => !v.isHidden)[i].width *
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
    _uuid() {
      var d = Date.now();
      if (
        typeof performance !== "undefined" &&
        typeof performance.now === "function"
      ) {
        d += performance.now(); //use high-precision timer if available
      }
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
        c
      ) {
        var r = ((d + Math.random() * 16) % 16) | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      });
    },
    deepCopy(obj) {
      let obj_cp = JSON.parse(JSON.stringify(obj));
      return obj_cp;
    },
    clearObj(obj) {
      let obj_cp = JSON.parse(JSON.stringify(obj));
      delete obj_cp._eClass;
      delete obj_cp._eId;
      delete obj_cp._eSelected;
      return obj_cp;
    },
    json2csv(array) {
      let str = "";
      for (let item of array) {
        let line = "";
        for (let index in item) {
          if (line != "") line += ",";
          line += item[index];
        }
        str += line + "\r\n";
      }
      return str;
    },
    JSONtoCSV(arr, columns, delimiter = ",") {
      return [
        ...arr.map(obj =>
          columns.reduce(
            (acc, key) =>
              `${acc}${!acc.length ? "" : delimiter}"${
                !obj[key] ? "" : obj[key]
              }"`,
            ""
          )
        )
      ].join("\n");
    },
    exportCsv(data, columns, title) {
      let csv = this.JSONtoCSV(data, columns);

      let createAndDownloadFile = (fileName, content) => {
        let aTag = document.createElement("a");
        let blob = new Blob(["\uFEFF", content]);
        aTag.download = fileName;
        aTag.href = URL.createObjectURL(blob);
        aTag.click();
        URL.revokeObjectURL(blob);
      };
      createAndDownloadFile(title, csv);
    }
  }
};
</script>
<style scoped lang="scss">
$default-color: #3caed2;

.main-scroll {
  width: 100%;
  overflow-y: hidden;
  border: 1px solid #ebeef5;
  font-size: 13px;
  box-sizing: border-box;
  position: relative;
}

.item-line,
.header-line,
.bottom-line {
  width: 100%;
  display: flex;
  flex-direction: row;
}

.item-cell,
.header-cell,
.bottom-cell {
  display: flex;
  padding: 5px;
  box-sizing: border-box;
  border-bottom: 1px solid #ebeef5;

  justify-content: center;
  align-items: center;
}
.header-cell,
.bottom-cell {
  border-bottom-width: 0;
}

.item-cell-inner {
  display: flex;
  width: 100%;
  height: 100%;
  word-break: break-all;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.header-cell-inner {
  display: inline-block;
  position: relative;
}

.header-cell-inner.caret-wrapper {
  width: 10px;
  height: 22px;
  cursor: pointer;
}

i.sort-ascending {
  width: 0;
  height: 0;
  border: 5px solid transparent;
  border-bottom-color: #c0c4cc;
  position: absolute;
  top: 0px;
  left: 4px;
}
i.sort-descending {
  width: 0;
  height: 0;
  border: 5px solid transparent;
  border-top-color: #c0c4cc;
  position: absolute;
  top: 12px;
  left: 4px;
}

i.sort-ascending.selected {
  border-bottom-color: $default-color;
}
i.sort-descending.selected {
  border-top-color: $default-color;
}

.header-line {
  color: #606266;
  height: 50px;
}
.bottom-line {
  height: 50px;
}

.bordered .item-cell,
.bordered .header-cell,
.bordered .bottom-cell {
  border-left: 1px solid #ebeef5;
}

.bordered .item-cell:nth-child(1),
.bordered .header-cell:nth-child(1),
.bordered .bottom-cell:nth-child(1) {
  border-left-width: 0;
}

.t-header {
  border-bottom: 1px solid #ebeef5;
}

.t-bottom {
  height: 50px;
  border-top: 1px solid #ebeef5;
  background-color: #f5f7fa;
}

.t-container {
  /*height: 800px;*/
  box-sizing: border-box;
  overflow: auto;
  overflow-x: hidden;
}

.scroller {
  height: 100%;
}

.search-wrapper {
  cursor: pointer;
}
.filter-wrapper {
  cursor: pointer;
}
.numFiltered-wrapper {
  cursor: pointer;
}

div.item-line.item-line-allow-hightlight:hover {
  background-color: #eee;
}

div.item-line.selected {
  background-color: #ddd;
}

div.item-line.unselectable {
  background-color: #fff;
}

.download-icon {
  color: #bbb;
  font-size: 20px;
  &:hover {
    color: $default-color;
    cursor: pointer;
  }
}

/*----------------*/

.tag {
  padding: 0 10px;
  height: 34px;
  line-height: 32px;
  /*font-size: 16px;*/
  border-radius: 4px;
  box-sizing: border-box;
  color: $default-color;
  background-color: rgba(60, 174, 210, 0.1);
  border: 1px solid rgba(60, 174, 210, 0.2);
  white-space: nowrap;
}
.filter-list {
  width: 100%;
  max-height: 300px;
  overflow-y: scroll;
}
.filter-list:hover {
  cursor: pointer;
}
.filter-item {
  width: 100%;
  margin: 5px auto;
  margin-left: 0px !important;
}
.filter-btn {
  overflow: hidden;
  border-top: 1px solid #ebeef5;
  padding: 6px;
  margin-top: 6px;
  text-align: left;
  padding: 10px 5px 5px 5px;
  font-size: 0;
}

.filtered,
.searched,
.numFiltered {
  color: $default-color;
}

.warningColor {
  color: red;
}
.greenColor {
  color: #84c32e;
}

.all-select {
  cursor: pointer;
}
.threeLines {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  word-break: break-all;
  white-space: normal;
}
.alignLeft {
  text-align: left;
}
.tips {
  font-size: 14px;
}
.defaultTag {
  color: $default-color;
  background-color: rgba(60, 174, 210, 0.1);
  border-color: rgba(60, 174, 210, 0.2);
}
.warningTag {
  color: #e6a23c;
  background: #fdf6ec;
  border-color: #f5dab1;
}
.successTag {
  color: #67c23a;
  background: #f0f9eb;
  border-color: #c2e7b0;
}
.dangerTag {
  color: #f56c6c;
  background: #fef0f0;
  border-color: #fbc4c4;
}
.infoTag {
  color: #909399;
  background: #f4f4f5;
  border-color: #d3d4d6;
}
.numberMax {
  margin-left: 15px;
}
.numberMax:before {
  content: "~";
  position: absolute;
  left: -11px;
  top: 10px;
}
.filterBtnEmpty {
  margin-top: 10px;
  float: right;
}
.popperCard {
  box-sizing: border-box;
}
.clipboard {
  position: absolute;
  width: 0;
  height: 0;
  z-index: -99;
  opacity: 0;
}
.clipboard input {
  display: block;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  border: 0;
}
</style>

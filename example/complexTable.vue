<template>
  <div id="app">
    <div style="width: 1000px;margin: auto;">
      <vue-virtual-table
        :config="tableConfig"
        :data="tableData"
        :height="tableAttribute.height"
        :itemHeight="tableAttribute.itemHeight"
        :minWidth="tableAttribute.minWidth"
        :selectable="tableAttribute.selectable"
        :enableExport="tableAttribute.enableExport"
        :bordered="tableAttribute.bordered"
        :hoverHighlight="tableAttribute.hoverHighlight"
        :language="tableAttribute.language"
        v-on:changeSelection="handleSelectionChange"
      >
      </vue-virtual-table>
    </div>
  </div>
</template>

<script>
import VueVirtualTable from "../src/vue-virtual-table";
import { _uuid } from "../src/utils/index.js";
import mockData from "./mockData.js";

export default {
  name: "app",
  data() {
    return {
      tableConfig: [
        {
          prop: "_index",
          name: "#",
          width: 80
        },
        {
          prop: "name",
          name: "Name",
          width: 400,
          sortable: true,
          searchable: true,
          summary: "COUNT",
          eClass: { twoLines: "true" },
          eTip: ["name"],
          eTipWithProp: false
        },
        {
          prop: "status",
          name: "Status",
          filterable: true,
          filterTag: {
            ACTIVE: "successTag",
            PAUSED: "warningTag",
            DELETED: "dangerTag"
          }
        },
        {
          prop: "mobile_app_install",
          name: "Result",
          sortable: true,
          summary: "SUM",
          numberFilter: true
        },
        {
          prop: "reach",
          name: "Reach",
          sortable: true,
          summary: "SUM",
          numberFilter: true
        },
        {
          prop: "cpr",
          name: "CPR",
          sortable: true,
          summary: "${spend}/${mobile_app_install}",
          prefix: "$",
          numberFilter: true
        },
        {
          prop: "spend",
          name: "Spend",
          sortable: true,
          summary: "SUM",
          prefix: "$",
          numberFilter: true
        },
        {
          prop: "budget",
          name: "Budget",
          sortable: true,
          summary: "SUM",
          prefix: "$",
          eClass: { warningColor: "${daily_budget}<${spend}" },
          numberFilter: true
        },
        {
          prop: "clicks",
          name: "Clicks",
          sortable: true,
          summary: "SUM",
          numberFilter: true
        },
        {
          prop: "ctr",
          name: "CTR",
          sortable: true,
          summary: "${clicks}*100/${reach}",
          suffix: "%",
          numberFilter: true
        },
        {
          prop: "cpc",
          name: "CPC",
          sortable: true,
          summary: "${spend}/${clicks}",
          prefix: "$",
          numberFilter: true
        },
        {
          prop: "impressions",
          name: "Imp",
          sortable: true,
          summary: "SUM",
          numberFilter: true
        },
        {
          prop: "cpm",
          name: "CPM",
          sortable: true,
          summary: "${spend}*1000/${impressions}",
          prefix: "$",
          numberFilter: true
        },
        {
          prop: "cr",
          name: "CR",
          sortable: true,
          summary: "${mobile_app_install}/${clicks}",
          numberFilter: true
        },
        {
          prop: "country",
          name: "Country",
          filterable: true
        }
      ],
      tableData: mockData,
      tableAttribute: {
        height: 650,
        itemHeight: 45,
        minWidth: 1800,
        selectable: true,
        enableExport: true,
        bordered: false,
        hoverHighlight: true,
        language: "en"
      }
    };
  },
  components: {
    VueVirtualTable
  },
  mounted() {},
  methods: {
    handleSelectionChange(rows) {
      console.log(rows);
    },
    edit(index, row) {
      console.log(index);
    },
    del(index, row) {
      console.log(index);
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  margin: auto;
}
</style>

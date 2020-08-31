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
        v-on:click="handleClickRow"
        v-on:contextmenu="handleContextmenu"
      >
        <template slot-scope="scope" slot="actionCommon">
          <button size="mini" @click="edit(scope.index, scope.row)">
            Edit
          </button>
          <button size="mini" @click="del(scope.index, scope.row)">
            Delete
          </button>
        </template>
      </vue-virtual-table>
    </div>
  </div>
</template>

<script>
import VueVirtualTable from "../src/vue-virtual-table";
import { _uuid } from "../src/utils/index.js";

export default {
  name: "app",
  data: () => ({
    tableConfig: [
      { prop: "_index", name: "#", width: 80 },
      {
        prop: "user",
        name: "User",
        searchable: true,
        sortable: true,
        summary: "COUNT"
      },
      { prop: "age", name: "Age", numberFilter: true },
      { prop: "city", name: "City", filterable: true },
      { prop: "_action", name: "Action", actionName: "actionCommon" },
      { prop: "city", name: "City", filterable: true }
    ],
    tableData: [
      { user: "a1", age: 20, city: "a" },
      { user: "a2", age: 21, city: "b" },
      { user: "a3", age: 23, city: "a" }
    ],
    tableAttribute: {
      height: 650,
      itemHeight: 42,
      minWidth: 1000,
      selectable: true,
      enableExport: true,
      bordered: false,
      hoverHighlight: true,
      language: "en"
    },
    lineNum: 1000,
    userConfig: {
      prop: "user",
      name: "User",
      searchable: true,
      sortable: true,
      summary: "COUNT",
      alignItems: "center",
      isHidden: false
    },
    ageConfig: {
      prop: "age",
      name: "Age",
      numberFilter: true,
      sortable: false,
      summary: "",
      alignItems: "center",
      isHidden: false
    },
    cityConfig: {
      prop: "city",
      name: "City",
      filterable: true,
      summary: "",
      alignItems: "center",
      isHidden: false
    }
  }),
  components: {
    VueVirtualTable
  },
  mounted() {
    this.genData();
  },
  methods: {
    updateTableConfig(prop, conf) {
      let propIndex = this.tableConfig.findIndex(v => v.prop == prop);
      this.tableConfig.splice(propIndex, 1, conf);
    },
    handleSelectionChange(rows) {
      console.log(rows);
    },
    handleClickRow(row, e) {
      console.log(row, e);
    },
    handleContextmenu(row, e) {
      console.log(row, e);
    },
    edit(index, row) {
      console.log(index);
    },
    del(index, row) {
      console.log(index);
    },
    genData() {
      this.randomData(this.lineNum);
    },
    randomData(len) {
      let cts = [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n"
      ];
      let all_data = [];
      for (let i = 0; i < len; i++) {
        let user = "u" + _uuid(6, 10),
          age = Math.floor((34 - 16) * Math.random()) + 16;
        let cityIndex = Math.floor(cts.length * Math.random());
        let city = cts[cityIndex];
        all_data.push({ user, age, city });
      }
      this.tableData = all_data;
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

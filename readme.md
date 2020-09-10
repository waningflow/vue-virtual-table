# vue-virtual-table

[![npm version](https://badge.fury.io/js/vue-virtual-table.svg)](https://badge.fury.io/js/vue-virtual-table)
[![downloads](https://img.shields.io/npm/dm/vue-virtual-table.svg)](https://www.npmjs.com/package/vue-virtual-table)

Vue table component with virtual dom and easy api.

- Keep smooth when the data reachs thousands of rows or even more.
- Easy to use with a simple config.

[live demo](https://waningflow.com/vue-virtual-table/)

# Installation

```
yarn add vue-virtual-table
```

or

```
npm install --save vue-virtual-table
```

# Usage

A simplest example:

```html
<template>
  <vue-virtual-table :config="tableConfig" :data="tableData"> </vue-virtual-table>
</template>

<script>
  import VueVirtualTable from 'vue-virtual-table'
  export default {
    components: {
      VueVirtualTable
    },
    data: () => ({
      tableConfig: [{ prop: 'user' }, { prop: 'age' }],
      tableData: [{ user: 'a1', age: 20 }, { user: 'a2', age: 21 }, { user: 'a3', age: 23 }]
    })
  }
</script>
```

Every item of the config refers to a column. When you don't set sepcific 'name' of the table column header, it will uses the 'prop' value as default. Or you can set the tableConfig like:

```js
tableConfig: [{ prop: 'user', name: 'User Name' }, { prop: 'age', name: 'Age' }]
```

And if you want to search in the 'user' column, set the tableConfig like:

```js
tableConfig: [{ prop: 'user', name: 'User Name', searchable: true }, { prop: 'age', name: 'Age' }]
```

For the 'age' column which is a set of number, you'd better use 'numberFilter' to filter numbers with "<", ">", "between" etc.

```js
tableConfig: [{ prop: 'user', name: 'User Name', searchable: true }, { prop: 'age', name: 'Age', numberFilter: true }]
```

There are many convenient features hard to explain one by one.
Here is a complex example and you can get more info in the tables below the example:

```html
<template>
  <vue-virtual-table
    :config="tableConfig"
    :data="tableData"
    :height="800"
    :itemHeight="55"
    :minWidth="1000"
    :selectable="true"
    :enableExport="true"
    v-on:changeSelection="handleSelectionChange"
  >
    <template slot-scope="scope" slot="actionCommon">
      <button @click="edit(scope.index, scope.row)">Edit</button>
      <button @click="del(scope.index, scope.row)">Delete</button>
    </template>
  </vue-virtual-table>
</template>

<script>
  import VueVirtualTable from 'vue-virtual-table'
  export default {
    components: {
      VueVirtualTable
    },
    data: () => ({
      tableConfig: [
        { prop: '_index', name: '#', width: 80 },
        {
          prop: 'user',
          name: 'User',
          searchable: true,
          sortable: true,
          summary: 'COUNT'
        },
        { prop: 'age', name: 'Age', numberFilter: true },
        { prop: 'city', name: 'City', filterable: true },
        { prop: '_action', name: 'Action', actionName: 'actionCommon' }
      ],
      tableData: [
        { user: 'a1', age: 20, city: 'aaaa' },
        { user: 'a2', age: 21, city: 'bbbb' },
        { user: 'a3', age: 23, city: 'aaaa' }
      ]
    }),
    methods: {
      handleSelectionChange(rows) {
        console.log(rows)
      },
      edit(index, row) {
        console.log(index)
      },
      del(index, row) {
        console.log(index)
      }
    }
  }
</script>
```

### Examples

[Click here](https://github.com/waningflow/vue-virtual-table/blob/master/example/simpleTable.vue) to see the examples. You can clone this repo and use `vue serve example/xxx.vue` to preview.

### Table Attributes

| name           | type    | description                             | required | default |
| -------------- | ------- | --------------------------------------- | -------- | ------- |
| data           | Array   | The array of data. Every item is a row. | Yes      |         |
| config         | Array   | The config of table.                    | Yes      |         |
| minWidth       | Number  | Set the minimum width of table.         | No       | 1200px  |
| height         | Number  | Set the height of table.                | No       | 300px   |
| itemHeight     | Number  | Set the height of row.                  | No       | 42px    |
| bordered       | Boolean | Whether table has vertical border.      | No       | false   |
| hoverHighlight | Boolean | Whether to hightlight current row.      | No       | true    |
| selectable     | Boolean | Whether row is selectable.              | No       | false   |
| enableExport   | Boolean | Whether to show export-to-table button  | No       | false   |
| language       | String  | Language from ['en', 'cn']              | No       | 'cn'    |

### Table Events

| name            | parameters | description                   |
| --------------- | ---------- | ----------------------------- |
| changeSelection | rows       | When the selected rows change |
| click           | row, $event| When row is clicked           |
| contextmenu     | row, $event| When row is right-clicked     |

### Table Config

| param        | type    | description                                                                                                                             | required | default                   |
| ------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------- |
| prop         | String  | Property name                                                                                                                           | Yes      |                           |
| name         | String  | Display name                                                                                                                            | No       | same to the property name |
| width        | Number  | Column width                                                                                                                            | No       | auto                      |
| sortable     | Boolean | Whether this column is sortable                                                                                                         | No       | false                     |
| searchable   | Boolean | Whether this column is searchable                                                                                                       | No       | false                     |
| filterable   | Boolean | Whether this column is filterable                                                                                                       | No       | false                     |
| numberFilter | Boolean | If it's a column of number. You can use this.                                                                                           | No       | false                     |
| summary      | String  | summary type from ['COUNT', 'SUM'] or customize(eg. `${clicks}*100/${reach}` is calculated with the summary of other two columns).      | No       |                           |
| prefix       | String  | Display before the value                                                                                                                | No       |                           |
| suffix       | String  | Display after the value                                                                                                                 | No       |                           |
| alignItems   | String  | Same with flex. Control the content of a cell                                                                                           | No       | center                    |
| isHidden     | Boolean | Whether this column is hidden                                                                                                           | No       | false                     |
| eTip         | Array   | Tool tip of a cell to display certain props (eg. `['name']` will display the value of 'name' prop in the tool tip )                     | No       |                           |
| eTipWithProp | Boolean | Whether to show the prop name in the tool tip                                                                                           | No       |                           |
| eClass       | Object  | Attach class to the cell (eg. `{redColor: '${spend}>100'}` add the 'redColor' class to the cell whose 'spend' prop is greater than 100) | No       | No                        |

### Special Props

| name     | description                          |
| -------- | ------------------------------------ |
| \_index  | Show the index of row                |
| \_action | A slot to customize the content      |
| \_expand | A slot to customize a popover window |

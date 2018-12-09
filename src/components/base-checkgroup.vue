<template>
	<div class="check-box">
		<div class="check-item" v-for="checkItem in choiceList" @click="clickItem(checkItem)" :class="{'checked': checkedGroup.includes(checkItem)}">
			<div class="check-icon">
				<i class="icon_box-checked" v-if="checkedGroup.includes(checkItem)"></i>
				<i class="icon_box-empty" v-else></i>
			</div>
			<div class="check-label">{{checkItem}}</div>
		</div>
	</div>
</template>
<script>
import "../assets/base.css";

export default {
  model: {
    prop: "checkedValue",
    event: "change"
  },
  props: {
    checkedValue: Array,
    choiceList: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  watch: {
    checkedValue() {
      this.init();
    }
  },
  data() {
    return {
      checkedGroup: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.checkedGroup = this.checkedValue.slice();
    },
    clickItem(checkItem) {
      let index = this.checkedGroup.indexOf(checkItem);
      if (index > -1) {
        this.checkedGroup.splice(index, 1);
      } else {
        this.checkedGroup.push(checkItem);
      }
      this.$emit("change", this.checkedGroup);
    }
  }
};
</script>
<style scoped lang="scss">
$default-color: #3caed2;
$icon-width: 20px;
$line-height: 25px;

.check-box {
  &:hover {
    cursor: pointer;
  }
}
.check-item {
  position: relative;
  padding-left: $icon-width;
  font-size: 14px;
  height: $line-height;
  line-height: $line-height;

  .icon_box-empty {
    color: #dcdfe6;
  }
  &:hover {
    cursor: pointer;
    .icon_box-empty {
      color: $default-color;
    }
  }

  &.checked {
    color: $default-color;
  }

  .check-icon {
    position: absolute;
    left: 0;
    top: 0;
    width: $icon-width;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .check-label {
    text-align: left;
  }
}
</style>

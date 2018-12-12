<template>
		<input :type="type" name="" :value="inputValue" @change="$emit('change', $event.target.value)" class="input-box" :placeholder="placeholder" ref="input" v-observe-visibility="handleVisible">
</template>
<script>
import { ObserveVisibility } from "vue-observe-visibility";

export default {
  directives: {
    ObserveVisibility
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
  data() {
    return {};
  },
  methods: {
    handleVisible(visible) {
      if (visible && this.autoFocus) {
        this.$refs.input.focus();
      }
    }
  }
};
</script>
<style scoped lang="scss">
$default-color: #3caed2;

.input-box {
  display: inline-block;
  box-sizing: border-box;
  height: 32px;
  border: 1px solid #d3d4d6;
  border-radius: 4px;
  padding: 0 5px;
  outline: none;
  font-size: 12px;
  vertical-align: top;

  &:focus {
    border-color: $default-color;
    outline: none;
  }
}
</style>

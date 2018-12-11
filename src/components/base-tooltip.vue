<template>
	<div style="display: inline-block;vertical-align: top;" class="mainCard">
		<transition :name="animationMode">
			<div class="pop-card" :style="{'left': offset.left +'px', 'top': offset.top+'px','width': width+'px'}" ref="popCard" @click="handleClick">
				<slot></slot>
				<div class="pop-arrow" :style="{'left': offset.arrowLeft+'px'}"></div>
			</div>
		</transition>
		<div class="pop-handler" ref="popHandler" v-observe-visibility="setSize">
			<slot name="reference"></slot>
		</div>
	</div>
</template>
<script>
import { ObserveVisibility } from "vue-observe-visibility";

export default {
  directives: {
    ObserveVisibility
  },
  props: {
    width: {
      type: [Number, String],
      default: function() {
        return "auto";
      }
    },
    animationMode: {
      type: String,
      default: function() {
        return "fade";
      }
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
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
    handleClick(e) {
      e.stopPropagation();
    },
    togglePop(e) {
      if (!this.visible) {
        return;
      }
      if (this.isShow) {
        e.stopPropagation();
      }
      this.isShow = !this.isShow;
      this.$emit("showChange", this.isShow);
    },
    closeCard() {
      if (!this.visible) {
        return;
      }
      this.isShow = false;
      this.$emit("showChange", this.isShow);
    },
    setSize() {
      if (!this.$refs.popHandler) {
        return;
      }
      let {
        offsetLeft,
        offsetTop,
        offsetHeight,
        offsetWidth
      } = this.$refs.popHandler;
      let moveLeft = 0;
      if (offsetLeft + this.width > window.innerWidth) {
        moveLeft = offsetLeft + this.width - window.innerWidth;
      }
      this.offset.left = offsetLeft - moveLeft;

      this.offset.top = offsetTop + offsetHeight;
      this.offset.arrowLeft = offsetWidth / 2 - 6 + moveLeft;
    }
  },
  mounted() {
    if (!this.visible) {
      return;
    }
    this.setSize();
    window.addEventListener("resize", _ => {
      this.setSize();
    });
  }
};
</script>
<style scoped>
.mainCard:hover .pop-card {
  display: block;
}
.pop-handler {
  display: inline-block;
}
.pop-card {
  /*width: 150px;*/
  min-width: 10px;
  min-height: 10px;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 60px;
  z-index: 2001;
  background-color: #fff;
  border-radius: 5px;
  box-sizing: border-box;
  transform-origin: 0 0;
  padding: 5px;
  display: none;
  font-size: 13px;
}
.pop-card:hover {
  display: block;
}
.pop-arrow,
.pop-arrow::after {
  top: -6px;
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  border-width: 6px;
  filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
  margin-right: 3px;
  border-top-width: 0;
  border-bottom-color: #ebeef5;
}
.pop-arrow {
  left: 50px;
}
.pop-arrow::after {
  content: " ";
  margin-left: -6px;
  top: 1px;
  /*margin-left: -6px;*/
  /*border-top-width: 0;*/
  border-bottom-color: #fff;
}
.fade-enter-active,
.fade-leave-active,
.slidedown-enter-active,
.slidedown-leave-active {
  transition: all ease 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.slidedown-enter,
.slidedown-leave-to {
  transform: scaleY(0);
}
</style>

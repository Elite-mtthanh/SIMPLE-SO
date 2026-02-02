<template>
  <PopupCommon @close="onClose">
    <div class="menu-detail-mask">
      <div class="menu-detail-card">
        <div class="menu-detail-header">
          <div class="menu-detail-header-image">
            <ImageView :src="logic.menu.imagePath || ''" fit="cover" />
          </div>

          <div class="menu-detail-info">
            <div class="menu-detail-info-name">
              {{ logic.menu.name }}
            </div>

            <div class="menu-detail-info-desc">
              {{ logic.menu.description }}
            </div>

            <div class="menu-detail-info-bottom">
              <MenuSizeSelector
                :sizes="logic.sizes"
                :selectedSize="logic.selectedSize"
                @on-select="onSelectSize"
              />

              <div class="menu-detail-price">
                <span>{{ formatPrice(logic.menu.price) }}￥</span>
              </div>
            </div>
          </div>
        </div>

        <div class="menu-detail-label" v-if="logic.toppings.length">
          <DictText keyName="HAS_TOPPING_LABEL" />
        </div>
        <div class="menu-detail-label" v-else>
          <DictText keyName="SINGLE_MENU_LABEL" />
        </div>

        <div class="menu-detail-toppings">
          <MenuToppingList
            :toppings="logic.toppings"
            :selectedToppings="logic.selectedToppings"
            @on-toggle="onToggleTopping"
            v-if="logic.toppings.length"
          />
        </div>

        <MenuDetailFooter
          :quantity="logic.quantity"
          :maxQuantity="logic.getMaxQuantity(cartIndex)"
          :totalPrice="logic.getTotalPrice()"
          :editMode="editMode"
          @on-cancel="onClose"
          @on-confirm="onConfirm"
          @on-increase="onIncreaseQuantity"
          @on-decrease="onDecreaseQuantity"
          @on-delete="onDelete"
        />
      </div>
    </div>
  </PopupCommon>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { MenuDetailLogic } from '@/logic/page/MenuDetailLogic';
import ImageView from '@/component/common/ImageView.vue';
import DictText from '@/component/common/DictText.vue';
import PopupCommon from '@/component/common/PopupCommon.vue';
import MenuSizeSelector from '@/component/MenuSizeSelector.vue';
import MenuToppingList from '@/component/MenuToppingList.vue';
import MenuDetailFooter from '@/component/MenuDetailFooter.vue';
import { formatPrice } from '@/util/FormatPrice';
import { PropType } from 'vue';
import { CartItem } from '@/model/Menu';

export default defineComponent({
  name: 'MenuDetailDialog',
  components: {
    ImageView,
    DictText,
    PopupCommon,
    MenuSizeSelector,
    MenuToppingList,
    MenuDetailFooter,
  },
  props: {
    menuCd: {
      type: String,
      required: true,
    },
    editMode: {
      type: Boolean,
      default: false,
    },
    cartItem: {
      type: Object as PropType<CartItem>,
      default: null,
    },
    cartIndex: {
      type: Number,
      default: -1,
    },
  },
  emits: ['on-close', 'on-confirm'],
  setup(props, { emit }) {
    const logic = reactive(new MenuDetailLogic());
    logic.getMenuDetail(props.menuCd);

    if (props.editMode && props.cartItem) {
      logic.loadFromCartItem(props.cartItem);
    }

    const onConfirm = () => {
      const item = logic.confirm(props.editMode, props.cartIndex);
      emit('on-confirm', item);
      emit('on-close');
    };

    const onDelete = () => {
      logic.delete(props.cartIndex);
      emit('on-close');
    };

    const onIncreaseQuantity = () => {
      const index = props.editMode ? props.cartIndex : -1;
      logic.increaseQuantity(index);
    };

    const onDecreaseQuantity = async () => {
      const result = await logic.decreaseQuantity(
        props.editMode,
        props.cartIndex
      );

      if (result === 'deleted') {
        emit('on-close');
      }
    };

    return {
      logic,
      formatPrice,
      onConfirm,
      onDelete,
      onIncreaseQuantity,
      onDecreaseQuantity,
      onClose: () => emit('on-close'),
      onSelectSize: logic.setSelectedSize.bind(logic),
      onToggleTopping: logic.toggleTopping.bind(logic),
    };
  },
});
</script>

<style scoped>
.menu-detail-card {
  width: 1500px;
  height: 965px;
  background: var(--text-inverse);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
}

.menu-detail-header {
  height: 358px;
  width: 1460px;
  display: flex;
  background: var(--background-items);
  border-radius: 12px;
  margin: 17px 20px 0 20px;
}

.menu-detail-header-image {
  flex-shrink: 0;
  margin: 29px 0 29px 27px;
}

.menu-detail-header-image img {
  width: 312px;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
}

.menu-detail-info {
  margin-left: 20px;
  display: flex;
  flex-direction: column;
}

.menu-detail-info-name {
  width: 1101px;
  height: 110px;
  font-size: 40px;
  font-weight: 600;
  line-height: 64px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.menu-detail-info-desc {
  width: 1101px;
  height: 89px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-weight: 400;
  font-size: 25px;
  line-height: 30px;
}

.menu-detail-info-bottom {
  display: flex;
  justify-content: space-between;
}

.menu-detail-info-bottom-size {
  margin-top: 44px;
  display: flex;
  align-items: center;
}

.menu-detail-price {
  height: 58px;
  width: 319px;
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 700;
  background: var(--text-accent);
  padding: 10px 36px;
  border-radius: 50px;
  white-space: nowrap;
  margin-top: 66px;
  margin-right: 24px;
  color: var(--text-inverse);
}

.menu-detail-label {
  width: 471;
  height: 63;
  font-weight: 700;
  font-style: Bold;
  font-size: 50px;
  line-height: 64px;

  vertical-align: middle;
  margin-top: 15px;
  margin-left: 20px;
}

.menu-detail-toppings {
  height: 315px;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 78px;
}
</style>

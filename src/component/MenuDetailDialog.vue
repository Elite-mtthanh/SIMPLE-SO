<template>
  <PopupCommon @close="onClose">
    <div class="menu-detail-mask">
      <div class="menu-detail-card">
        <div class="menu-detail-header">
          <div class="menu-detail-image">
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
          :maxQuantity="logic.getMaxQuantity()"
          :totalPrice="logic.getTotalPrice()"
          :editMode="editMode"
          @on-cancel="onClose"
          @on-confirm="onConfirm"
          @on-increase="logic.increase()"
          @on-decrease="logic.decrease()"
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
import { MenuSelect, CartItem } from '@/model/Menu';
import { CartStorage } from '@/storage/CartStorage';
import { PropType } from 'vue';

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
    const logicInstance = new MenuDetailLogic();
    logicInstance.getMenuDetail(props.menuCd);
    
    // If in edit mode, load the cart item data
    if (props.editMode && props.cartItem) {
      logicInstance.loadFromCartItem(props.cartItem);
    }
    
    const logic = reactive(logicInstance);

    const onClose = () => {
      emit('on-close');
    };

    const onConfirm = () => {
      const item = logic.getConfirmData();

      if (props.editMode && props.cartIndex >= 0) {
        // Edit mode: update existing item
        CartStorage.updateItem(props.cartIndex, {
          ...item,
          imagePath: item.imagePath || '',
        });
      } else {
        // Add mode: add new item
        CartStorage.addItem({
          ...item,
          imagePath: item.imagePath || '',
        });
      }

      emit('on-confirm', item);
      emit('on-close');
    };

    const onDelete = () => {
      if (props.editMode && props.cartIndex >= 0) {
        CartStorage.removeItem(props.cartIndex);
      }
      emit('on-close');
    };

    return {
      logic,
      onClose,
      onConfirm,
      onDelete,
      formatPrice,
      onSelectSize: (size: MenuSelect) => logic.setSelectedSize(size),
      onToggleTopping: (topping: MenuSelect) => logic.toggleTopping(topping),
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

.menu-detail-image {
  flex-shrink: 0;
  margin: 29px 0 29px 27px;
}

.menu-detail-image img {
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
  letter-spacing: 0%;
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
  letter-spacing: 0%;
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

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

        <div class="menu-detail-footer">
          <ButtonCommon
            class="menu-detail-btn-cancel"
            @touchend="onClose"
            text-color="inverse"
            type="neutral"
          >
            <DictText keyName="CANCEL_BUTTON" />
          </ButtonCommon>

          <div class="menu-detail-footer-price">
            <div class="menu-detail-quantity">
              <PressLayer
                class="menu-detail-quantity-btn"
                @touchend="logic.quantity > 1 && logic.decrease()"
                :class="{ disabled: logic.quantity <= 1 }"
              >
                <ImageView src="/Image/menu/minus.png" />
              </PressLayer>

              <span>{{ logic.quantity }}</span>

              <PressLayer
                class="menu-detail-quantity-btn"
                @touchend="logic.quantity < 10 && logic.increase()"
                :class="{ disabled: logic.quantity >= 10 }"
              >
                <ImageView src="/Image/menu/plus.png" />
              </PressLayer>
            </div>

            <div class="menu-detail-total">
              {{ formatPrice(logic.getTotalPrice()) }}￥
            </div>
          </div>

          <ButtonCommon
            class="menu-detail-btn-confirm"
            @touchend="onConfirm"
            text-color="inverse"
            type="accent"
          >
            <DictText keyName="CONFIRM_BUTTON" />
          </ButtonCommon>
        </div>
      </div>
    </div>
  </PopupCommon>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { MenuDetailLogic } from '@/logic/page/MenuDetailLogic';
import ImageView from '@/component/common/ImageView.vue';
import DictText from '@/component/common/DictText.vue';
import ButtonCommon from '@/component/common/ButtonCommon.vue';
import PopupCommon from '@/component/common/PopupCommon.vue';
import MenuSizeSelector from '@/component/MenuSizeSelector.vue';
import MenuToppingList from '@/component/MenuToppingList.vue';
import { formatPrice } from '@/util/FormatPrice';
import { MenuSelect } from '@/model/Menu';
import { CartStorage } from '@/storage/CartStorage';
import PressLayer from './common/PressLayer.vue';

export default defineComponent({
  name: 'MenuDetailDialog',
  components: {
    ImageView,
    DictText,
    ButtonCommon,
    PopupCommon,
    MenuSizeSelector,
    MenuToppingList,
    PressLayer,
  },
  props: {
    menuCd: {
      type: String,
      required: true,
    },
  },
  emits: ['on-close', 'on-confirm'],
  setup(props, { emit }) {
    const logicInstance = new MenuDetailLogic();
    logicInstance.getMenuDetail(props.menuCd);
    const logic = reactive(logicInstance);

    const onClose = () => {
      emit('on-close');
    };

    const onConfirm = () => {
      emit('on-confirm', logic.getConfirmData());
      const item = logic.getConfirmData();

      CartStorage.addItem({
        ...item,
        imagePath: item.imagePath || '',
      });

      emit('on-confirm', item);
      emit('on-close');
    };

    return {
      logic,
      onClose,
      onConfirm,
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

.menu-detail-footer {
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  align-items: center;
  padding: 0 32px 28px;
}

.menu-detail-footer-price {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 36px;
}

.menu-detail-quantity {
  display: flex;
  align-items: center;
  gap: 17px;
}

.menu-detail-quantity-btn {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: var(--btn-link);
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-detail-quantity-btn.disabled {
  opacity: 0.35;
  pointer-events: none;
}

.menu-detail-quantity span {
  min-width: 146px;
  height: 100px;
  border: 1px solid #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 80px;
  line-height: 64px;
  color: var(--text-link);
}

.menu-detail-total {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 388px;
  height: 100px;
  font-weight: 600;
  font-size: 80px;
  line-height: 64px;
  letter-spacing: 0%;
  vertical-align: middle;
  color: var(--text-price);
}

.menu-detail-btn-cancel,
.menu-detail-btn-confirm {
  font-weight: 600;
  font-size: 45px;
  leading-trim: NONE;
  line-height: 64px;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
  border-radius: 6px;
  margin-right: 52px;
}
</style>

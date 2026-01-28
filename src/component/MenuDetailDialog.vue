<template>
  <PopupCommon @close="onClose">
    <PressLayer @touchend="onClose">
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
                  {{ formatPrice(logic.menu.price) }}￥
                </div>
              </div>
            </div>
          </div>

          <div class="menu-detail-label">
            <DictText
              :keyName="
                logic.toppings.length
                  ? 'HAS_TOPPING_LABEL'
                  : 'SINGLE_MENU_LABEL'
              "
            />
          </div>

          <div class="menu-detail-toppings">
            <MenuToppingList
              :toppings="logic.toppings"
              :selectedToppings="logic.selectedToppings"
              @on-toggle="onToggleTopping"
            />
          </div>

          <div class="menu-detail-footer">
            <ButtonCommon class="menu-detail-btn-cancel" @touchend="onClose">
              <DictText keyName="CANCEL_BUTTON" />
            </ButtonCommon>

            <div class="menu-detail-quantity">
              <ButtonCommon
                @touchend.prevent="logic.decrease()"
                :disabled="logic.quantity <= 1"
              >
                −
              </ButtonCommon>
              <span>{{ logic.quantity }}</span>
              <ButtonCommon
                @touchend.prevent="logic.increase()"
                :disabled="logic.quantity >= 10"
              >
                +
              </ButtonCommon>
            </div>

            <div class="menu-detail-total">
              {{ formatPrice(logic.getTotalPrice()) }}￥
            </div>
          </div>

          <ButtonCommon
            class="menu-detail-btn-confirm"
            @touchend.prevent="onConfirm"
          >
            <DictText keyName="CONFIRM_BUTTON" />
          </ButtonCommon>
        </div>
      </div>
    </PressLayer>
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
import PressLayer from '@/component/common/PressLayer.vue';
import { CartStorage } from '@/storage/CartStorage';

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
  display: flex;
  background: var(--background-items);
  border-radius: 12px;
}

.menu-detail-image {
  flex-shrink: 0;
  margin: 27px 0 29px 29px;
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
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.menu-detail-info-desc {
  width: 1101px;
  height: 89px;
  font-size: 20px;
  line-height: 1.5;
  margin-top: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.menu-detail-info-bottom {
  margin-top: 44px;
  margin-right: 23px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-detail-price {
  font-size: 40px;
  font-weight: 700;
  background: var(--text-accent);
  color: #fff;
  padding: 8px 32px;
  border-radius: 50px;
}

.menu-detail-label {
  font-weight: 700;
  font-style: Bold;
  font-size: 50px;
  leading-trim: NONE;
  line-height: 64px;
  letter-spacing: 0%;
  vertical-align: middle;
  width: 471px;
  height: 63px;
}

.menu-detail-toppings {
  display: flex;
  justify-content: flex-end;
}

.menu-detail-footer {
  display: flex;
  align-items: center;
  gap: 24px;
  justify-content: space-between;
  margin: 78px 26px 19px 14px;
}

.menu-detail-footer-price {
  display: flex;
  align-items: center;
  gap: 36px;
}

.menu-detail-btn-cancel,
.menu-detail-btn-confirm {
  width: 300px;
  height: 100px;
  font-size: 30px;
  font-weight: 800;
  border-radius: 6px;
  font-family: Inter;
  font-weight: 600;
  font-style: Semi Bold;
  font-size: 45px;
  leading-trim: NONE;
  line-height: 64px;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
}

.menu-detail-btn-cancel {
  background: #757575;
  color: #fff;
}

.menu-detail-btn-confirm {
  background: #dc2c2c;
  color: #fff;
}

.menu-detail-quantity-plus {
  width: 100px;
  height: 100px;
  font-size: 48px;
}

.menu-detail-quantity {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-detail-quantity ButtonCommon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  font-size: 34px;
  font-weight: 700;
}

.menu-detail-quantity ButtonCommon:disabled {
  background: #bdbdbd;
}

.menu-detail-quantity span {
  width: 90px;
  height: 64px;
  border: 2px solid #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: 700;
}

.menu-detail-total {
  font-size: 36px;
  font-weight: 800;
  color: red;
}
</style>

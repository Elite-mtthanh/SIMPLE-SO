<template>
  <div class="menu-detail-mask" @click.self="onClose">
    <div class="menu-detail-card">
      <div class="menu-detail-header">
        <ImageView :src="menu.imagePath || ''" />
        <div class="menu-detail-info">
          <div class="menu-detail-info-title">{{ menu.name }}</div>
          <div class="menu-detail-info-desc">{{ menu.description }}</div>
          <div class="menu-detail-info-size-price">
            <div class="size-group" v-if="sizes.length">
              <button
                v-for="size in sizes"
                :key="size.select_cd"
                :class="{ active: selectedSize?.select_cd === size.select_cd }"
                @click="selectedSize = size"
              >
                {{ size.select_name1 }}
              </button>
            </div>
            <div class="menu-detail-info-price">
              <div class="menu-detail-info-price-detail">
                {{ formatPrice(menu.price) }}￥
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="menu-detail-card-label" v-if="!toppings.length">
        <DictText keyName="SINGLE_MENU_LABEL" />
      </div>
      <div class="menu-detail-card-label" v-else>
        <DictText keyName="HAS_TOPPING_LABEL" />
      </div>

      <div class="menu-detail-topping" v-if="toppings.length">
        <div
          v-for="topping in toppings"
          :key="topping.select_cd"
          class="topping-row"
          @click="toggleTopping(topping)"
        >
          <ImageView :src="topping.image_path || ''" alt="" />
          <span>{{ topping.select_name1 }}</span>
          <span class="price">{{ topping.price }} ¥</span>
          <input type="checkbox" :checked="isChecked(topping)" />
        </div>
      </div>

      <div class="menu-detail-footer">
        <BaseButton class="btn-cancel" @click="onClose"
          ><DictText keyName="CANCEL_BUTTON"
        /></BaseButton>

        <div class="quantity">
          <button @click="quantity--" :disabled="quantity <= 1">
            <ImageView src="/Image/menu/minus.png" />
          </button>
          <span>{{ quantity }}</span>
          <button @click="quantity++">
            <ImageView src="/Image/menu/plus.png" />
          </button>
        </div>

        <div class="total">{{ totalPrice }} ¥</div>

        <BaseButton class="btn-confirm" @click="onConfirm"
          ><DictText keyName="CONFIRM_BUTTON"
        /></BaseButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { MenuSelect } from '@/model/Menu';
import ImageView from '../common/ImageView.vue';
import { MenuDetailLogic } from '@/logic/page/MenuDetailLogic';
import DictText from '../common/DictText.vue';
import BaseButton from '../common/BaseButton.vue';
import { formatPrice } from '@/util/FormatPrice';

export default defineComponent({
  name: 'MenuDetailOverlay',
  components: { ImageView, DictText, BaseButton },
  props: {
    menuCd: {
      type: String,
      required: true,
    },
  },
  emits: ['close', 'confirm'],
  setup(props, { emit }) {
    console.log('MenuDetailOverlay setup with menuCd:', props.menuCd);
    const logic = new MenuDetailLogic();
    logic.load(props.menuCd);

    const quantity = ref(1);
    const selectedSize = ref<MenuSelect | null>(logic.sizes[0] ?? null);
    const selectedToppings = ref<MenuSelect[]>([]);

    const toggleTopping = (topping: MenuSelect) => {
      const idx = selectedToppings.value.findIndex(
        (x) => x.select_cd === topping.select_cd
      );
      idx >= 0
        ? selectedToppings.value.splice(idx, 1)
        : selectedToppings.value.push(topping);
    };

    const isChecked = (topping: MenuSelect) =>
      selectedToppings.value.some((x) => x.select_cd === topping.select_cd);

    const totalPrice = computed(() => {
      const sizePrice = selectedSize.value?.price ?? 0;
      const toppingPrice = selectedToppings.value.reduce(
        (s, topping) => s + topping.price,
        0
      );
      return (logic.menu.price + sizePrice + toppingPrice) * quantity.value;
    });

    return {
      menu: logic.menu,
      sizes: logic.sizes,
      toppings: logic.toppings,
      quantity,
      selectedSize,
      selectedToppings,
      totalPrice,
      toggleTopping,
      isChecked,
      onClose: () => emit('close'),
      onConfirm: () =>
        emit('confirm', {
          menu: logic.menu,
          quantity: quantity.value,
          size: selectedSize.value,
          toppings: selectedToppings.value,
          total: totalPrice.value,
        }),
      formatPrice,
    };
  },
});
</script>

<style scoped>
.menu-detail-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: var(--z-dialog);
}

.menu-detail-card {
  width: 1500px;
  height: 965px;
  background: #fbf7ef;
  border-radius: 16px;
  padding: 17px 20px;
  display: flex;
  flex-direction: column;
}

.menu-detail-header {
  display: flex;
  background: var(--background-items);
  border-radius: 12px;
  position: relative;
}

.menu-detail-header img {
  width: 312px;
  height: 300px;
  margin: auto;
  object-fit: none;
  border-radius: 10px;
  margin: 29px 0 29px 27px;
}

.menu-detail-info {
  margin-left: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.menu-detail-info-title {
  height: 111px;
  width: 1101px;
  font-weight: 600;
  font-size: 40px;
  line-height: 64px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 5px;
}

.menu-detail-info-desc {
  height: 89px;
  width: 1101px;
  font-size: 20px;
  line-height: 30px;
  color: var(--text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.size-group {
  display: flex;
  gap: 24px;
}

.size-group button {
  width: 80px;
  height: 80px;
  font-size: 45px;
  font-weight: 600;
  border-radius: 6px;
  border: 1px solid var(--text-primary);
  background: var(--btn-gray);
  cursor: pointer;
  line-height: 64px;
  text-align: center;
  vertical-align: middle;
}

.size-group button.active {
  background: var(--btn-link);
  color: #fff;
  border-color: var(--btn-link);
}

.menu-detail-info-price {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
}

.menu-detail-info-price-detail {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 319px;
  height: 58px;
  background: var(--text-accent);
  color: var(--text-inverse);
  border-radius: 50px;
  font-weight: 700;
  font-size: 50px;
  line-height: 30px;
}

.menu-detail-info-size-price {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  margin-right: 27px;
  margin-top: 44px;
}

.menu-detail-card > div:not(.menu-detail-header):not(.menu-detail-footer) {
  margin-top: 18px;
  font-size: 26px;
  font-weight: 700;
}

.menu-detail-card-label {
  font-weight: 700;
  font-style: Bold;
  font-size: 50px;
  line-height: 64px;
  letter-spacing: 0%;
  vertical-align: middle;
  margin-top: 15px;
}

.menu-detail-topping {
  align-self: end;
  margin-top: 8px;
  border: 2px solid #aaa;
  background: #fff;
  height: 315px;
  width: 1346px;
  overflow-y: auto;
  gap: 10px;
}

.topping-row {
  display: grid;
  grid-template-columns: 80px 1fr 120px 60px;
  align-items: center;
  margin-top: 19px;
  margin: 0 16px;
  font-size: 22px;
  cursor: pointer;
  width: 1262px;
  height: 100px;
}

.topping-row:nth-child(even) {
  background: #fff4e6;
}

.topping-row img {
  width: 48px;
  height: 48px;
  object-fit: cover;
}

.topping-row .price {
  color: red;
  font-weight: 700;
  text-align: right;
}

.topping-row input[type='checkbox'] {
  width: 32px;
  height: 32px;
  accent-color: #e53935;
}

.menu-detail-footer {
  margin-top: 82px;
  display: grid;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.btn-cancel {
  height: 70px;
  background: #9e9e9e;
  color: #fff;
  font-size: 26px;
  font-weight: 700;
  border-radius: 6px;
}

.quantity {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

.quantity button {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #4b57a3;
  color: #fff;
  font-size: 34px;
  font-weight: 700;
}

.quantity span {
  width: 90px;
  height: 64px;
  border: 2px solid #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: 700;
  background: #fff;
}

/* ===== TOTAL + CONFIRM ===== */
.menu-detail-footer .total {
  font-size: 36px;
  font-weight: 800;
  color: red;
  text-align: right;
}

.btn-confirm {
  height: 70px;
  background: #e53935;
  color: #fff;
  font-size: 30px;
  font-weight: 800;
  border-radius: 6px;
}
</style>

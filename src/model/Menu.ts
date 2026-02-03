import { MenuType } from "./Enums";

/**
 * menu interface
 */
export interface Menu {
  id: number;
  menu_cd: string;
  parent_menu_cd: string | null;
  menu_type: MenuType;
  select_size: string;
  price: number;
  image_path: string | null;

  menu_name1: string;
  menu_name2: string;
  menu_name3: string;
  menu_name4?: string;
  menu_name5?: string;

  menu_desc1?: string;
  menu_desc2?: string;
  menu_desc3?: string;
  menu_desc4?: string;
  menu_desc5?: string;
}

/**
 * menu select interface
 */
export interface MenuSelect {
  id: number;
  menu_cd: string;
  select_cd: string;
  image_path: string | null;
  price: number;
  select_type: 'size' | 'topping';
  name: string;

  select_name1: string;
  select_name2: string;
  select_name3: string;
  select_name4?: string;
  select_name5?: string;
}

/**
 * category interface
 */
export interface Category {
  id: number;
  name: string;
  image_path: string | null;
  menu_cd: string;
}

/**
 * menu item for display
 */
export interface MenuItem {
  id: number;
  menu_cd: string;
  name: string;
  description: string;
  price: number;
  imagePath: string | null;
  hasSelectSize: string;
  soldOut?: boolean;
  select_size?: string;
}

/**
 * stockout menu interface
 */
export interface StockoutMenu {
  menu_cd: string;
}

/**
 * cart item interface
 */
export interface CartItem {
  menuCd: string;
  name: string;
  imagePath: string;
  basePrice: number;

  quantity: number;

  size?: {
    selectCd: string;
    name: string;
    price: number;
  } | null;

  toppings: {
    selectCd: string;
    name: string;
    price: number;
  }[];

  total: number;
}


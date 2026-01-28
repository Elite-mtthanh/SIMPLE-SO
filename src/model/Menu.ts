import { MenuType } from "./Enums";

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

export interface Category {
  id: number;
  name: string;
  image_path: string | null;
  menu_cd: string;
}

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

export interface StockoutMenu {
  menu_cd: string;
}



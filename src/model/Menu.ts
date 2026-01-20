export interface Menu {
  id: number;
  menu_cd: string;
  parent_menu_cd: string | null;
  menu_type: 'category' | 'menu';
  select_size: number;
  is_sold_out: number;
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

  select_name1: string;
  select_name2: string;
  select_name3: string;
  select_name4?: string;
  select_name5?: string;
}

export interface Category {
  id: string;
  name: string;
  image_path: string | null;
}

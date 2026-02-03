- lấy dữ liệu bảng dict
sqlite3 db/app.db ".mode json" ".once src/dummy-data/Dict.json" "SELECT key_name, desc1 AS ja, desc2 AS zh, desc3 AS en FROM dict;"

- menus
sqlite3 db/app.db ".mode json" ".once src/dummy-data/Menus.json" "SELECT * FROM menus;"

- menus_selects
sqlite3 db/app.db ".mode json" ".once src/dummy-data/Menu_selects.json" "SELECT * FROM menu_selects;"

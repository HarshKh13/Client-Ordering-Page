@builtin "string.ne"
@builtin "whitespace.ne"

main -> query {% d => d[0] %}
query -> skuQuery {% d => d[0] %} | titleQuery {% d => d[0] %} | itemQuery {% d => d[0] %} | priceQuery {% d => d[0] %}
skuQuery -> "find" _ "sku" _ string {% d => ({type: "sku", value: d[4]}) %}
titleQuery -> string {% d => ({type: "title", value: d[0]}) %}
itemQuery -> "show" _ string _ string _ string {% d => ({type: "itemPrice", margin: d[4], value: {"item": d[2], "price": d[6]}}) %}
priceQuery -> string _ string {% d => ({type: "price", margin: d[0], value: d[2]}) %}
string -> [a-zA-Z0-9\-$]:+ {% d => d.flat().join("") %}
export default {
  
  "VERSION": "1.0.1",
  
  // The actor class type is the type of actor that will be used for the default item pile actor that is created on first item drop.
  "ACTOR_CLASS_TYPE": "character",
  
  // The item quantity attribute is the path to the attribute on items that denote how many of that item that exists
  "ITEM_QUANTITY_ATTRIBUTE": "system.quantity",
  
  // The item price attribute is the path to the attribute on each item that determine how much it costs
  "ITEM_PRICE_ATTRIBUTE": "system.price",
  
  // Item filters actively remove items from the item pile inventory UI that users cannot loot, such as spells, feats, and classes
  "ITEM_FILTERS": [
    {
      "path": "type",
      "filters": "spell,feat,class"
    },
    {
      "path": "system.weaponType",
      "filters": "natural"
    }
  ],
  
  "ITEM_TRANSFORMER": async (itemData) => {
    ["equipped", "proficient", "prepared"].forEach(key => delete itemData.system[key]);
    itemData.system.attunement = Math.min(CONFIG.DND5E.attunementTypes.REQUIRED, itemData.system.attunement);
    if (itemData.type === "spell") {
      const scroll = await Item.implementation.createScrollFromSpell(itemData);
      itemData = scroll.toObject();
    }
    return itemData;
  },
  
  // Item similarities determines how item piles detect similarities and differences in the system
  "ITEM_SIMILARITIES": ["name", "type"],
  
  // Currencies in item piles is a versatile system that can accept actor attributes (a number field on the actor's sheet) or items (actual items in their inventory)
  // In the case of attributes, the path is relative to the "actor.system"
  // In the case of items, it is recommended you export the item with `.toObject()` and strip out any module data
  "CURRENCIES": [
    {
      type: "attribute",
      name: "DND5E.CurrencyPP",
      img: "icons/commodities/currency/coin-inset-snail-silver.webp",
      abbreviation: "{#}PP",
      data: {
        path: "system.currency.pp"
      },
      primary: false,
      exchangeRate: 10
    },
    {
      type: "attribute",
      name: "DND5E.CurrencyGP",
      img: "icons/commodities/currency/coin-embossed-crown-gold.webp",
      abbreviation: "{#}GP",
      data: {
        path: "system.currency.gp",
      },
      primary: true,
      exchangeRate: 1
    },
    {
      type: "attribute",
      name: "DND5E.CurrencyEP",
      img: "icons/commodities/currency/coin-inset-copper-axe.webp",
      abbreviation: "{#}EP",
      data: {
        path: "system.currency.ep",
      },
      primary: false,
      exchangeRate: 0.5
    },
    {
      type: "attribute",
      name: "DND5E.CurrencySP",
      img: "icons/commodities/currency/coin-engraved-moon-silver.webp",
      abbreviation: "{#}SP",
      data: {
        path: "system.currency.sp",
      },
      primary: false,
      exchangeRate: 0.1
    },
    {
      type: "attribute",
      name: "DND5E.CurrencyCP",
      img: "icons/commodities/currency/coin-engraved-waves-copper.webp",
      abbreviation: "{#}CP",
      data: {
        path: "system.currency.cp",
      },
      primary: false,
      exchangeRate: 0.01
    }
  ]
}
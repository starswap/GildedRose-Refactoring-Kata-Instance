import { strict as assert } from 'node:assert';

export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;

    // Check Preconditions
    for (const item of items) {
      assert(item.quality >= 0);
      assert(item.quality <= 50);
    }
  }

  updateQuality() {
    for (const item of this.items) {
      if (item.name != 'Sulfuras, Hand of Ragnaros') { // This item is unchanged
        item.sellIn--;
        switch (item.name) {
          case ('Aged Brie'):
            item.quality += (item.sellIn >= 0) ? 1 : 2;
            break;

          case ('Backstage passes to a TAFKAL80ETC concert'):
            if (item.sellIn >= 10) {
              item.quality += 1;
            } else if (item.sellIn >= 5) {
              item.quality += 2
            } else if (item.sellIn >= 0) { // 5 days or less before the concert
              item.quality += 3
            } else {
              item.quality = 0
            }
            break;

          case ('Conjured Mana Cake'):
            item.quality -= (item.sellIn >= 0) ? 2 : 4;
            break;

          default:
            item.quality -= (item.sellIn >= 0) ? 1 : 2;
        }

        item.quality = Math.min(50, Math.max(0, item.quality)); // BOUND
      }
    }
    return this.items;
  }

}

import { Item, GildedRose } from '@/gilded-rose';
import { AssertionError } from 'node:assert';

describe('Gilded Rose General', () => {
  it('should decrease the quality by 1 for a general item', () => {
    const gildedRose = new GildedRose([new Item('foo', 20, 10)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(9);
  });

  it('should decrease the sellIn by 1 for all types of item except Sulfuras', () => {
    // this conjured item does not work properly yet
    const gildedRose = new GildedRose([new Item('foo', 20, 10),
                                       new Item("+5 Dexterity Vest", 20, 10),
                                       new Item("Aged Brie", 20, 10),
                                       new Item("Elixir of the Mongoose", 20, 10),
                                       new Item("Backstage passes to a TAFKAL80ETC concert", 20, 10)
                                      ]);
    const items = gildedRose.updateQuality();

    for (const item of items) {
      expect(item.sellIn).toBe(19);
    }
  });
});

describe('Past Sell By Date', () => {
  it('should decrease quality twice as fast for items that are past their sell by date', () => {
    const gildedRose = new GildedRose([new Item('foo', -1, 10)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(8);
  });
  
  it('should treat a passed-in zero as passed the sell by date', () => {
    const gildedRose = new GildedRose([new Item('foo', 0, 50)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(48);
  });
});

describe('Backstage Passes', () => {
  it('should increase the quality of backstage passes by 1 if far from the concert', () => {
    const gildedRose = new GildedRose([new Item("Backstage passes to a TAFKAL80ETC concert", 50, 10)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(11);
  });
  
  it('should increase the quality of backstage passes by 2 if 10 days from the concert', () => {
    const gildedRose = new GildedRose([new Item("Backstage passes to a TAFKAL80ETC concert", 10, 10)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(12);
  });  
  
  it('should increase the quality of backstage passes by 2 if less than 10 days from the concert', () => {
    const gildedRose = new GildedRose([new Item("Backstage passes to a TAFKAL80ETC concert", 9, 10)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(12);
  });
  
  it('should increase the quality of backstage passes by 3 if 5 days from the concert', () => {
    const gildedRose = new GildedRose([new Item("Backstage passes to a TAFKAL80ETC concert", 5, 10)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(13);
  });  
  
  it('should increase the quality of backstage passes by 3 if fewer than 5 days from the concert', () => {
    const gildedRose = new GildedRose([new Item("Backstage passes to a TAFKAL80ETC concert", 4, 10)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(13);
  });
  
  it('should increase the quality of backstage passes by 3 if fewer than 5 days from the concert', () => {
    const gildedRose = new GildedRose([new Item("Backstage passes to a TAFKAL80ETC concert", 4, 10)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(13);
  });
  
  it('should assign a quality of 0 to expired backstage passes', () => {
    const gildedRose = new GildedRose([new Item("Backstage passes to a TAFKAL80ETC concert", 0, 10)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(0);
  });
});

describe('Quality Bounds', () => {
  it('should never allow the quality to go below 0', () => {
    const gildedRose = new GildedRose([new Item('foo', 5, 0)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(0);
  });
  
  it('should never allow the quality to go above 50', () => {
    const gildedRose = new GildedRose([new Item('Aged Brie', 10, 50)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(50);
  });  

  it('should not allow an item to be added with a quality which is above 50', () => {
    expect( () => {new GildedRose([new Item("Conjured Mana Cake", 10, 51)])}).toThrow(AssertionError);
  });

  it('should not allow an item to be added with a quality which less than 0', () => {
    expect( () => {new GildedRose([new Item("Conjured Mana Cake", 10, -1)])}).toThrow(AssertionError);
  });
});

describe('Sulfuras', () => {
  it('should not alter the sellin value for Sulfuras', () => {
    const gildedRose = new GildedRose([new Item('Sulfuras, Hand of Ragnaros', 10, 30)]);
    const items = gildedRose.updateQuality();
    expect(items[0].sellIn).toBe(10);
  });
  
  it('should not alter the quality value for Sulfuras', () => {
    const gildedRose = new GildedRose([new Item('Sulfuras, Hand of Ragnaros', 10, 30)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(30);
  });
});

describe('Aged Brie', () => {
  it('should increase the quality of aged brie over time', () => {
    const gildedRose = new GildedRose([new Item('Aged Brie', 2, 10)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(11);
  });
  
  it('should increase the quality of brie by 2 after the sell by date', () => {
    const gildedRose = new GildedRose([new Item('Aged Brie', -1, 30)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(32);
  });
  
});

describe('Conjured Items', () => {
  it('should make conjured items degrade by 2 when not past the sell by date', () => {
    const gildedRose = new GildedRose([new Item("Conjured Mana Cake", 10, 10)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(8);
  });

  it('should make conjured items degrade by 4 when past the sell by date', () => {
    const gildedRose = new GildedRose([new Item("Conjured Mana Cake", -1, 10)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(6);
  });
});

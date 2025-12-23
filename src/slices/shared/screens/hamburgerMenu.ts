export class HamburgerMenu {
    constructor(
      private readonly proxy: {
        burgerMenuButton: { click(): Promise<void> };
        menuItemList: {
          length(): Promise<number>;
          get(i: number): Promise<{ getText(): Promise<string>; click(): Promise<void> }>;
        };
      }
    ) {}
  
    async clickItemByText(textToMatch: string): Promise<void> {
      await this.proxy.burgerMenuButton.click();
  
      const list = this.proxy.menuItemList;
      const count = await list.length();
  
      for (let i = 0; i < count; i++) {
        const item = await list.get(i);
        const text = (await item.getText()).trim();
        if (text.toLowerCase() === textToMatch.toLowerCase()) {
          await item.click();
          return;
        }
      }
  
      throw new Error(`Hamburger menu item not found: "${textToMatch}"`);
    }
  }
  
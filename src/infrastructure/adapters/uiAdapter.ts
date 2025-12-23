export interface UIElement {
    click(): Promise<void>;
    type(text: string): Promise<void>;
    getText(): Promise<string>;
    isVisible(): Promise<boolean>;
  }
  
  export interface UIElementList {
    get(index: number): Promise<UIElement>;
    length(): Promise<number>;
    forEach(
      fn: (el: UIElement, index: number) => Promise<void> | void
    ): Promise<void>;
  }
  
  export interface UIAdapter {
    findElement(locator: string): Promise<UIElement>;
    findElements(locator: string): Promise<UIElementList>;
  }
  
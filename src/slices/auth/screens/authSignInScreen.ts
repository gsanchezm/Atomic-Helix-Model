export class AuthSignInScreen {
  constructor(
    private readonly proxy: {
      userNameInput: { type(v: string): Promise<void>; isVisible(): Promise<boolean> };
      passwordInput: { type(v: string): Promise<void> };
      loginButton: { click(): Promise<void> };
      errorLabel: { isVisible(): Promise<boolean>; getText(): Promise<string> };
    }
  ) {}

  async login(username: string, password: string): Promise<void> {
    await this.proxy.userNameInput.type(username);
    await this.proxy.passwordInput.type(password);
    await this.proxy.loginButton.click();
  }

  async submitEmpty(): Promise<void> {
    await this.proxy.loginButton.click();
  }

  async isLoginVisible(): Promise<boolean> {
    return this.proxy.userNameInput.isVisible();
  }

  async isErrorVisible(): Promise<boolean> {
    return this.proxy.errorLabel.isVisible();
  }

  async errorText(): Promise<string> {
    return this.proxy.errorLabel.getText();
  }
}

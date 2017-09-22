import { AngularChatPage } from './app.po';

describe('angular-chat App', () => {
  let page: AngularChatPage;

  beforeEach(() => {
    page = new AngularChatPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});

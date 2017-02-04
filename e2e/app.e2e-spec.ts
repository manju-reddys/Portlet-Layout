import { PortletsPage } from './app.po';

describe('portlets App', function() {
  let page: PortletsPage;

  beforeEach(() => {
    page = new PortletsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

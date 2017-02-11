import { MeanHeroPage } from './app.po';

describe('mean-hero App', function() {
  let page: MeanHeroPage;

  beforeEach(() => {
    page = new MeanHeroPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('hero works!');
  });
});

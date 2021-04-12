import { generateAPIService } from '../src';

describe('generateAPIService', () => {
  it('normal', async () => {
    const tsContent = await generateAPIService({
      input: { type: 'local', filename: `${__dirname}/api.json` },
      banner: '//banner',
    });
    expect(tsContent).toMatchSnapshot();
  });
});

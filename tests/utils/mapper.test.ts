import { toPath, toTitle } from '../../src/utils/mapper';

describe('Mapper', () => {
  it('should map to path', () => {
    const directory = '_posts';
    const createTime = '2023-12-23T00:00:00.000Z';
    const title = 'Hello World';

    const path = toPath(directory, createTime, title);

    expect(path).toBe('_posts/2023-12-23-Hello-World.md');
  });

  it('should does not trim title', () => {
    const directory = '_posts';
    const createTime = '2023-12-23T00:00:00.000Z';
    const title = ' Hello World ';

    const path = toPath(directory, createTime, title);

    expect(path).toBe('_posts/2023-12-23--Hello-World-.md');
  });

  it('should map to title', () => {
    const path = '_posts/2023-12-23-Hello-World.md';

    const title = toTitle(path);

    expect(title).toBe('Hello World');
  });

  it('should map to title with spaces', () => {
    const path = '_posts/2023-12-23--Hello-World-.md';

    const title = toTitle(path);

    expect(title).toBe(' Hello World ');
  });
});

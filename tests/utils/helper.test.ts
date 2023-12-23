import { validateProperty } from '../../src/utils/helper';

describe('Helper', () => {
  it('should validate properties', () => {
    const target = {
      checkbox: { type: 'checkbox' },
      title: { type: 'title' },
      tags: { type: 'multi_select' },
      categories: { type: 'multi_select' },
      sync_time: { type: 'date' },
      post_path: { type: 'rich_text' }
    };
    const correct = {
      checkbox: { name: 'checkbox', type: 'checkbox' },
      title: { name: 'title', type: 'title' },
      tags: { name: 'tags', type: 'multi_select' },
      categories: { name: 'categories', type: 'multi_select' },
      sync_time: { name: 'sync_time', type: 'date' },
      post_path: { name: 'post_path', type: 'rich_text' }
    };
    const wrong = {
      checkbox: { name: 'aaa', type: 'aaa' },
      title: { name: 'bbb', type: 'bbb' },
      tags: { name: 'ccc', type: 'ccc' },
      categories: { name: 'ddd', type: 'ddd' },
      sync_time: { name: 'eee', type: 'eee' },
      post_path: { name: 'fff', type: 'fff' }
    };

    expect(() => validateProperty(target, correct)).not.toThrow();
    expect(() => validateProperty(target, wrong)).toThrow();
  });
});

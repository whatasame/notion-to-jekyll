export type Pages = {
  contents: Page[];
  has_more: boolean;
  next_cursor: string | null;
};

export type Page = {
  id: string;
  checkbox: boolean;
  title: string;
  categories: string[];
  tags: string[];
  created_time: string;
  last_edited_time: string;
  synchronized_time: string | null;
  post_path: string | null;
};

interface DatabaseProperty {
  name: string;
  type: string;
}

export interface DatabaseProperties {
  [key: string]: DatabaseProperty;
}

export const PROPERTIES: DatabaseProperties = {
  CHECKBOX: {
    name: '[notion-to-jekyll] ready',
    type: 'checkbox'
  },
  TITLE: {
    name: '[notion-to-jekyll] title',
    type: 'title'
  },
  CATEGORIES: {
    name: '[notion-to-jekyll] categories',
    type: 'multi_select'
  },
  TAGS: {
    name: '[notion-to-jekyll] tags',
    type: 'multi_select'
  },
  SYNC_TIME: {
    name: '[notion-to-jekyll] sync time',
    type: 'date'
  },
  POST_PATH: {
    name: '[notion-to-jekyll] post path',
    type: 'rich_text'
  }
};

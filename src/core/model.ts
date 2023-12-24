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
    name: 'Ready',
    type: 'checkbox'
  },
  TITLE: {
    name: 'Title',
    type: 'title'
  },
  CATEGORIES: {
    name: 'Categories',
    type: 'multi_select'
  },
  TAGS: {
    name: 'Tags',
    type: 'multi_select'
  },
  SYNC_TIME: {
    name: 'Sync time',
    type: 'date'
  },
  POST_PATH: {
    name: 'Post path',
    type: 'rich_text'
  }
};

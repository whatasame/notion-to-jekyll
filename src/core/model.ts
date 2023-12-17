export type Pages = {
  contents: Array<Page>;
  has_more: boolean;
  next_cursor: string | null;
};

export type Page = {
  id: string;
  last_edited_time: string;
  synchronized_time: string | null;
};

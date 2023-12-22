# Notion to Jekyll

No more exporting and uploading your Notion posts to your Jekyll blog! Automate it with Notion to Jekyll.

Notion to Jekyll is a GitHub action that automatically synchronizes posts written in Notion with Jekyll blogs.

> [!CAUTION]
>
> Notion to Jekyll **deletes all posts** that do not exist in Notion. If you want to keep your existing posts, you need
> to move them to Notion.

See other languages documentation here

* [🇰🇷 한국어](./docs/ko/README.md)

## Getting started

In order to use Notion to Jekyll, you need to prepare three things. If you are not ready, please refer to the link for
each item.

1. [Create Notion to Jekyll database template](docs/en/notion-to-jekyll-template.md)
2. [Issue Notion API key and create integration](docs/en/notion-api-key-integration.md)
3. [Set up GitHub repository](docs/en/github-setting.md)

If you are ready, please proceed to the next step and set up GitHub action.

### GitHub action setting

Create a `.github/workflows/notion-to-jekyll.yml` file in your Jekyll blog repository and write the following.

```yaml
name: Notion to Jekyll

on:
  schedule:
    - cron: '0 0 * * *' # Run every midnight
  workflow_dispatch:

jobs:
  notion-to-jekyll:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Notion to Jekyll synchronization
        uses: whatasame/notion-to-jekyll@v0 # latest version
        with:
          notion_api_key: ${{ secrets.NOTION_API_KEY }}
          notion_database_id: ${{ secrets.NOTION_DATABASE_ID }}
```

Now, the posts you write in Notion will be automatically synchronized with your Jekyll blog every midnight. Or you can
run GitHub action manually.

## GitHub action options

Notion to Jekyll provides the following options.

| Option name          | Required | Default value                        | Description                |
|----------------------|----------|--------------------------------------|----------------------------|
| `notion_api_key`     | Required | -                                    | Notion API key             |
| `notion_database_id` | Required | -                                    | Notion database ID         |
| `post_dir`           | Optional | `_posts`                             | Jekyll blog post directory |
| `commit_user_name`   | Optional | `{username}`                         | Git user name              |
| `commit_email`       | Optional | `{username@users.noreply.github.com` | Git user email             |
| `commit_author`      | Optional | `{username}`                         | Commit author              |
| `commit_message`     | Optional | `Synchronized by Notion to Jekyll`   | Commit message             |

For example, if you want to change the `post_dir` option, you can write as follows.

```yaml
- name: Notion to Jekyll synchronization
  uses: whatasame/notion-to-jekyll@v0
  with:
    notion_api_key: ${{ secrets.NOTION_API_KEY }}
    notion_database_id: ${{ secrets.NOTION_DATABASE_ID }}
    post_dir: _my_posts_dir
```

## FAQ

### Permission to repository denied to github-actions[bot]

You may get the following error during the synchronization process.

```
Permission to {username}/{repository} denied to github-actions[bot]
```

This problem occurs because GitHub action does not have write permission to the repository. To solve this problem,
please refer to [GitHub repository setting](./github-setting) for GitHub workflow permission setting.

## Contributing

Notion to Jekyll is waiting for your contribution. If you have any problems or improvements while using it, please feel
free to leave an issue.

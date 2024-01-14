# Notion to Jekyll

![logo](https://github.com/whatasame/notion-to-jekyll/assets/97666463/0d42ebeb-fba8-4f6b-a2d1-4b330106157a)

Notion에 작성한 글을 Markdown으로 내보내고 업로드하는 귀찮은 과정은 이제 그만! Notion to Jekyll로 자동화하세요.

Notion to Jekyll은 Notion에 작성한 글을 자동으로 Jekyll 블로그와 동기화해주는 GitHub action입니다.

> [!CAUTION]
>
> Notion to Jekyll은 Notion에 존재하지 않는 글은 **모두 삭제**합니다. 기존의 글을 유지하고 싶다면 Notion에 글을 옮겨야합니다.

## 시작하기

Notion to Jekyll을 사용하기 위해선 3가지 준비가 필요합니다. 만약 준비가 되어있지 않다면 각 항목의 링크를 참고해주세요.

1. [Notion to Jekyll 데이터베이스 템플릿 생성](./notion-to-jekyll-template.md)
2. [Notion API 키 발급 및 연결 생성](./notion-api-key-integration.md)
3. [GitHub 레포지토리 설정](./github-setting.md)

모든 준비가 끝났다면 다음으로 넘어가서 GitHub action을 설정해주세요.

### GitHub action 설정

Jekyll 블로그 레포지토리에 `.github/workflows/notion-to-jekyll.yml` 파일을 생성하고 다음과 같이 작성해주세요.

```yaml
name: Notion to Jekyll

on:
  schedule:
    - cron: '0 0 * * *' # 매일 자정마다 실행
  workflow_dispatch:

permissions:
  contents: write # GitHub action이 파일을 저장하기 위해 필요

jobs:
  notion-to-jekyll:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Notion to Jekyll synchronization
        uses: whatasame/notion-to-jekyll@v0 # 최신 버전
        with:
          notion_api_key: ${{ secrets.NOTION_API_KEY }}
          notion_database_id: ${{ secrets.NOTION_DATABASE_ID }}
```

이제 매일 자정마다 Notion에 작성한 글이 자동으로 Jekyll 블로그에 동기화됩니다. 혹은 수동으로 GitHub action을 실행시킬 수도 있습니다.

## GitHub action 옵션

Notion to Jekyll은 다음과 같은 옵션을 제공합니다.

| 옵션 이름                | 필수 여부 | 기본값                                   | 설명                   |
|----------------------|-------|---------------------------------------|----------------------|
| `notion_api_key`     | 필수    | -                                     | Notion API 키         |
| `notion_database_id` | 필수    | -                                     | Notion 데이터베이스 ID     |
| `post_dir`           | 선택    | `_posts`                              | Jekyll 블로그의 포스트 디렉토리 |
| `commit_user_name`   | 선택    | `{username}`                          | Git 사용자 이름           |
| `commit_email`       | 선택    | `{username}@users.noreply.github.com` | Git 사용자 이메일          |
| `commit_author`      | 선택    | `{username}`                          | 커밋 작성자               |
| `commit_message`     | 선택    | `Synchronized by Notion to Jekyll`    | 커밋 메시지               |

예를 들어, `post_dir` 옵션을 변경하고 싶다면 다음과 같이 작성하면 됩니다.

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

동기화 과정에서 다음과 같은 에러가 발생할 수 있습니다.

```
Permission to {username}/{repository} denied to github-actions[bot]
```

이는 GitHub action이 레포지토리에 쓰기 권한이 없어서 발생하는 문제입니다. 이를 해결하기 위해서는 `notion-to-jekyll.yml` 파일에 GitHub workflow 권한이 설정되어있는지
확인해주세요.

```yaml
permissions:
  contents: write
```

## 기여

Notion to Jekyll은 여러분의 기여를 기다리고 있습니다. 사용 중 문제가 발생하거나 개선점이 있다면 언제든 이슈를 남겨주세요.



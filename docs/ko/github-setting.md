# GitHub 설정

이 문서에서는 Notion to Jekyll을 사용하기 위한 GitHub 설정 방법을 설명합니다.

## GitHub secrets 설정

Notion to Jekyll을 사용하기 위해선 Notion API 키와 Notion 데이터베이스 ID가 필요합니다. 이를 위해 GitHub secrets를 설정합니다.

### GitHub secrets 접속

Jekyll 레포지토리에서 `Settings` > `Secrets and variables` > `Actions`로 이동합니다.

![github-secrets](https://github.com/whatasame/notion-to-jekyll/assets/97666463/4be3964d-fb65-4808-b4cd-0e4937dc9e62)

### Notion API 키 설정

위 사진에서 `New repository secret` 버튼을 클릭합니다.

![github-secrets-api-key](https://github.com/whatasame/notion-to-jekyll/assets/97666463/4d1d5510-604b-4cde-9d25-bf19c3198cbb)

생성한 Notion API 키를 `Name`에 `NOTION_API_KEY`를 입력하고 `Secret`에 Notion API 키를 입력합니다.

### Notion 데이터베이스 ID 설정

한 번 더 `New repository secret` 버튼을 클릭합니다.

> 데이터베이스 ID는 Notion 데이터베이스의 URL에서 확인할 수 있습니다.
>
> ![url-database-id](https://github.com/whatasame/notion-to-jekyll/assets/97666463/f1f1229b-5caa-487a-b1ab-7a99a2059ee5)


![github-secrets-database-id](https://github.com/whatasame/notion-to-jekyll/assets/97666463/f8890c34-dfaf-45ad-8c6c-8a0c92c91b64)

Notion 데이터베이스 ID를 `Name`에 `NOTION_DATABASE_ID`를 입력하고 `Secret`에 Notion 데이터베이스 ID를 입력합니다.

## 다음으로

모든 준비가 끝났다면 [다음](./README.md#github-action-설정)으로 넘어가서 GitHub actions 설정을 마무리해주세요.

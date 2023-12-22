# GitHub 설정

이 문서에서는 Notion to Jekyll을 사용하기 위한 GitHub 설정 방법을 설명합니다.

## GitHub secrets 설정

Notion to Jekyll을 사용하기 위해선 Notion API 키와 Notion 데이터베이스 ID가 필요합니다. 이를 위해 GitHub secrets를 설정합니다.

### GitHub secrets 접속

Jekyll 레포지토리에서 `Settings` > `Secrets and variables` > `Actions`로 이동합니다.

![img.png](images/github-secrets.png)

### Notion API 키 설정

위 사진에서 `New repository secret` 버튼을 클릭합니다.

![img_1.png](images/github-secrets-api-key.png)
생성한 Notion API 키를 `Name`에 `NOTION_API_KEY`를 입력하고 `Secret`에 Notion API 키를 입력합니다.

### Notion 데이터베이스 ID 설정

한 번 더 `New repository secret` 버튼을 클릭합니다.

> 데이터베이스 ID는 Notion 데이터베이스의 URL에서 확인할 수 있습니다.
> ![img_3.png](images/url-database-id.png)

![img_2.png](images/github-secrets-database-id.png)

Notion 데이터베이스 ID를 `Name`에 `NOTION_DATABASE_ID`를 입력하고 `Secret`에 Notion 데이터베이스 ID를 입력합니다.

## GitHub action 권한 설정

Notion의 글을 레포지토리에 동기화하기 위해선 GitHub actions의 쓰기 권한이 필요합니다.

![img_4.png](images/github-actions.png)

Jekyll 레포지토리에서 `Settings` > `Actions` > `General`로 이동합니다.

![img_5.png](images/github-actions-permission.png)

`Read and write permissions`를 선택하고 `Save`를 눌러 저장합니다.

## 다음으로

모든 준비가 끝났다면 [다음](./README.md#github-action-설정)으로 넘어가서 GitHub actions 설정을 마무리해주세요.

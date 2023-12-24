# Notion to Jekyll 데이터베이스 템플릿 생성

이 문서에서는 Notion to Jekyll을 사용하기 위한 데이터베이스 템플릿 생성을 설명합니다.

## 템플릿 가져오기

다음 과정을 통해 데이터베이스 템플릿을 Notion 워크스페이스로 가져올 수 있습니다.

### Notion to Jekyll 템플릿 복제

[Notion to Jekyll 템플릿](https://dorian-nasturtium-042.notion.site/79f7226185a74e49a974c475f47fae97?v=de1dc4c1af8e4200918889b7e2d98ad5)
에 접속합니다.

![create-database](https://github.com/whatasame/notion-to-jekyll/assets/97666463/cc31135d-6950-4b5f-a900-8702c068089e)

우측 상단의 `복제` 버튼을 눌러 Notion 워크스페이스로 템플릿을 가져옵니다.

## 데이터베이스 속성

Notion to Jekyll 템플릿은 다음과 같은 속성을 가지고 있습니다.

| 속성 이름                           | 속성 타입 | 설명        |
|---------------------------------|-------|-----------|
| `Ready`      | 체크박스  | 동기화 여부    |
| `Title`      | 제목    | 글의 제목     |
| `Tags`       | 다중 선택 | 글의 태그     |
| `Categories` | 다중 선택 | 글의 카테고리   |
| `Sync time`  | 날짜    | 글의 동기화 시간 |
| `Post path`  | 텍스트   | 글의 경로     |

> [!CAUTION]
>
> 위 속성들은 모두 필수 값이며 수정 혹은 삭제시 정상적으로 동작하지 않습니다.

## 다음으로

모든 준비가 끝났다면 [다음](./notion-api-key-integration.md)으로 넘어가서 Notion API 키와 통합을 생성해주세요.


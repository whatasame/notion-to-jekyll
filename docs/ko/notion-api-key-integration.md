# Notion API 키 발급 및 연결 생성

이 문서에서는 Notion to Jekyll을 사용하기 위한 Notion API 키 발급과 연결 생성을 설명합니다.

## Notion API 키 발급

Notion to Jekyll은 Notion API를 사용하여 Notion에 작성한 글을 Jekyll 블로그에 동기화합니다. Notion API 키를 발급받는 방법은
다음과 같습니다.

### 새 API 통합 만들기

[Notion developer integration](https://www.notion.so/my-integrations)에 접속합니다.

![integration-page](https://github.com/whatasame/notion-to-jekyll/assets/97666463/265049e8-935b-4a58-bae8-2f49b33a868b)

`새 API 통합 만들기` 버튼을 클릭합니다.

![create-integration](https://github.com/whatasame/notion-to-jekyll/assets/97666463/8ae30da2-859c-4909-9ce0-286669385ba3)

Notion to Jekyll 데이터베이스가 존재하는 워크스페이스를 선택하고 통합 이름을 설정 후 제출하여 통합을 생성합니다.

![api-key](https://github.com/whatasame/notion-to-jekyll/assets/97666463/0e716f12-1c0a-40f0-8bf7-a305c19eab65)

Notion API 키를 확인하고 어딘가 메모해둡니다.

## 데이터베이스 연결

Notion to Jekyll 데이터베이스로 이동합니다.
> 템플릿 데이터베이스를 생성하지 않았다면 [Notion to Jekyll 데이터베이스 템플릿 생성](./notion-to-jekyll-template.md)을 참고하세요.

![connection](https://github.com/whatasame/notion-to-jekyll/assets/97666463/af2d4346-5275-416d-8901-309fdd18277d)

우측 상단의 `...` > `연결 추가` > `연결 검색`에 통합 이름 입력 > 통합 클릭의 순서로 데이터베이스에 통합을 연결합니다.

## 다음으로

모든 준비가 끝났다면 [다음](./github-setting.md)으로 넘어가서 GitHub 설정을 마무리해주세요.



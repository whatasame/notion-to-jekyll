# Set up GitHub repository

This document describes how to set up GitHub for Notion to Jekyll.

## Set up GitHub secrets

In order to use Notion to Jekyll, you need to prepare Notion API key and Notion database ID. To do this, set up GitHub
secrets.

### Enter GitHub secrets

Go to `Settings` > `Secrets and variables` > `Actions` in your Jekyll repository.

![github-secrets](https://github.com/whatasame/notion-to-jekyll/assets/97666463/4be3964d-fb65-4808-b4cd-0e4937dc9e62)

### Set up Notion API key

Click the `New repository secret` button in the picture above.

![github-secrets-api-key](https://github.com/whatasame/notion-to-jekyll/assets/97666463/4d1d5510-604b-4cde-9d25-bf19c3198cbb)

Enter the created Notion API key in `Name` and enter the Notion API key in `Secret`.

### Set up Notion database ID

Click the `New repository secret` button again.

> You can check the database ID in the URL of the Notion database.
> ![url-database-id](https://github.com/whatasame/notion-to-jekyll/assets/97666463/f1f1229b-5caa-487a-b1ab-7a99a2059ee5)

![github-secrets-database-id](https://github.com/whatasame/notion-to-jekyll/assets/97666463/f8890c34-dfaf-45ad-8c6c-8a0c92c91b64)

Enter the Notion database ID in `Name` and enter the Notion database ID in `Secret`.

## Set up GitHub action permission

In order to synchronize Notion posts to the repository, GitHub actions write permission is required.

![github-actions](https://github.com/whatasame/notion-to-jekyll/assets/97666463/ff15916b-1acb-4e3b-b1e8-4939431b4514)

Go to `Settings` > `Actions` > `General` in your Jekyll repository.

![github-actions-permission](https://github.com/whatasame/notion-to-jekyll/assets/97666463/17922eef-06ff-42aa-9207-856967a7c1d5)

Select `Read and write permissions` and press `Save` to save.

## Next

If you are ready, go to [next](../../README.md#github-action-setting) to finish GitHub setting.

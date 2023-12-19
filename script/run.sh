_main(){
  _add_posts
  _commit
  _push
}

_add_posts(){
  git add "$INPUT_POST_DIR"

  echo "Added posts"
}

_commit(){
  git -c user.name="$INPUT_COMMIT_USERNAME" -c user.email="$INPUT_COMMIT_EMAIL" \
    commit -m "$INPUT_COMMIT_MESSAGE" \
    --author="$INPUT_COMMIT_AUTHOR" \

  echo "Committed changes"
}

_push(){
  git push https://"$INPUT_COMMIT_USERNAME":"$INPUT_GITHUB_TOKEN"@github.com/"$INPUT_REPOSITORY".git

  echo "Pushed to remote"
}

_main

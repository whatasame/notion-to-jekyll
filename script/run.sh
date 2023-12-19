_main(){
  _add_posts || { echo "Failed to add posts"; exit 1; }
  _commit || { echo "Failed to commit changes"; exit 1; }
  _push || { echo "Failed to push changes"; exit 1; }
}

_add_posts(){
  git add "$INPUT_POST_DIR" || return 1

  echo "📮 Added posts"
}

_commit(){
  git -c user.name="$INPUT_COMMIT_USERNAME" -c user.email="$INPUT_COMMIT_EMAIL" \
    commit -m "$INPUT_COMMIT_MESSAGE" \
    --author="$INPUT_COMMIT_AUTHOR" || return 1

  echo "💾 Committed changes"
}

_push(){
  git push https://"$INPUT_COMMIT_USERNAME":"$INPUT_GITHUB_TOKEN"@github.com/"$INPUT_REPOSITORY".git || return 1

  echo "🚀 Pushed to remote"
}

_main

_main(){
  _add || { echo "Failed to add posts"; exit 3; }
  _commit || { echo "Failed to commit changes"; exit 4; }
  _push || { echo "Failed to push changes"; exit 5; }
}

_add(){
  echo "📝 Adding posts..."
  if git status | grep -q "nothing to commit"; then
      echo "No changes detected. Exiting..."
      exit 0
  fi

  git add "$INPUT_POST_DIR" || return 1
}

_commit(){
  echo "📦 Committing changes..."

  git -c user.name="$INPUT_COMMIT_USERNAME" -c user.email="$INPUT_COMMIT_EMAIL" \
    commit -m "$INPUT_COMMIT_MESSAGE" \
    --author="$INPUT_COMMIT_AUTHOR" || return 1
}

_push(){
  echo "🚀 Pushing to remote..."
  git push -q https://"$INPUT_COMMIT_USERNAME":"$INPUT_GITHUB_TOKEN"@github.com/"$INPUT_REPOSITORY".git || return 1
}

_main

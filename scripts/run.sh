_main(){
  _parse || { echo "Failed to parse input"; exit 1; }
  _remove || { echo "Failed to remove posts"; exit 1; }
  _add || { echo "Failed to add posts"; exit 1; }
  _commit || { echo "Failed to commit changes"; exit 1; }
  _push || { echo "Failed to push changes"; exit 1; }
}

_parse() {
  paths=$(cat)

  mapfile -t removePaths < <(echo "$paths" | jq -r '.removePaths[]')
}

_remove(){
  for path in "${removePaths[@]}"; do
    if [ -f "$path" ]; then
      rm "$path" || return 1
    fi
  done
}

_add(){
  git add "$INPUT_POST_DIR" || return 1
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

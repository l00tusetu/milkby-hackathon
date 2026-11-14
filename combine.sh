#!/usr/bin/env bash

OUTPUT_FILE="output.txt"

# Check if at least one file or directory was provided
if [ "$#" -eq 0 ]; then
    echo "Usage: $0 <file_or_dir1> [file_or_dir2 ...]"
    exit 1
fi

TEMP_FILE=$(mktemp)
trap 'rm -f "$TEMP_FILE"' EXIT

append_file() {
    local file="$1"

    # Skip the output file itself if encountered during directory traversal
    if [ "${file#./}" = "$OUTPUT_FILE" ] || [ "$file" = "$OUTPUT_FILE" ]; then
        return
    fi

    # Write the filename header and opening fence
    printf '`%s`:\n```\n' "$file" >> "$TEMP_FILE"

    # Append file contents
    cat "$file" >> "$TEMP_FILE"

    # Ensure a newline before the closing fence if the file didn't end with one
    if [ -n "$(tail -c 1 "$file" 2>/dev/null)" ]; then
        echo "" >> "$TEMP_FILE"
    fi

    # Write closing fence and a blank separator line
    printf '```\n\n' >> "$TEMP_FILE"
}

# Iterate over each argument
for target in "$@"; do
    if [ -f "$target" ]; then
        append_file "$target"
    elif [ -d "$target" ]; then
        while IFS= read -r -d '' file; do
            append_file "$file"
        done < <(find "$target" -type f -print0 | sort -z)
    else
        echo "Warning: '$target' does not exist or is not a regular file/directory. Skipping." >&2
    fi
done

mv "$TEMP_FILE" "$OUTPUT_FILE"
echo "Done! Combined contents saved to '$OUTPUT_FILE'."

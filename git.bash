#!/bin/bash

# Get the list of untracked files
untracked_files=$(git ls-files --others --exclude-standard)

# Initialize a counter
count=0

# Iterate through each untracked file
for file in $untracked_files; do
    # Check if the count has reached 30
    if [ $count -ge 30 ]; then
        break
    fi

    # Add the file to the staging area
    git add "$file"

    # Commit the file with a message
    git commit -m "Update: $file"

    # Increment the counter
    ((count++))
done

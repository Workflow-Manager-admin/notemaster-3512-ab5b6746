#!/bin/bash
cd /home/kavia/workspace/code-generation/notemaster-3512-ab5b6746/notes_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi


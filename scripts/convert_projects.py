#!/usr/bin/env python3
"""
Quick script to convert /images/project_sites/ paths in ProjectsContent.tsx
to use buildGeneralImageUrl function calls.
"""

import re

def convert_project_paths():
    file_path = r"c:\Users\Tanzim Bin Zahir\nextrend_site\src\app\projects\ProjectsContent.tsx"
    
    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern to match: '/images/project_sites/filename.ext'
    pattern = r"'/images/project_sites/([^']+)'"
    
    # Replace with: buildGeneralImageUrl('project_sites/filename.ext')
    def replacement(match):
        filename = match.group(1)
        return f"buildGeneralImageUrl('project_sites/{filename}')"
    
    new_content = re.sub(pattern, replacement, content)
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("✓ Converted all /images/project_sites/ paths to buildGeneralImageUrl() calls")

if __name__ == "__main__":
    convert_project_paths()
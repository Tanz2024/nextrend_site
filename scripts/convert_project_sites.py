#!/usr/bin/env python3
"""
Script to convert buildGeneralImageUrl('project_sites/...') calls to buildProjectSiteUrl('...') 
in ProjectsContent.tsx file.
"""

import re

def convert_project_site_calls():
    file_path = r"c:\Users\Tanzim Bin Zahir\nextrend_site\src\app\projects\ProjectsContent.tsx"
    
    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern to match: buildGeneralImageUrl('project_sites/filename')
    pattern = r"buildGeneralImageUrl\('project_sites/([^']+)'\)"
    
    # Replace with: buildProjectSiteUrl('filename')
    def replacement(match):
        filename = match.group(1)
        return f"buildProjectSiteUrl('{filename}')"
    
    new_content = re.sub(pattern, replacement, content)
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("✓ Converted all buildGeneralImageUrl('project_sites/...') calls to buildProjectSiteUrl('...')")

if __name__ == "__main__":
    convert_project_site_calls()
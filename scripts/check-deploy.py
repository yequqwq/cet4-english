#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GitHub Pages 部署脚本 - 改完代码后运行此脚本即可更新网站
使用方式（在项目根目录运行）：
  ="你的token"; python scripts/deploy-github.py
"""
import os, sys, base64
import requests

# TOKEN = os.environ.get('GITHUB_TOKEN')
if not TOKEN:
    print('请设置环境变量 GITHUB_TOKEN')
    print('  ="你的token"')
    sys.exit(1)

HEADERS = {'Authorization': 'Bearer ' + TOKEN, 'Accept': 'application/vnd.github.v3+json'}
API = 'https://api.github.com'
OWNER = 'yequqwq'
REPO = 'cet4-english'

print('>>> 正在构建项目...')
if os.system('npm run build') != 0:
    print('构建失败！')
    sys.exit(1)

dist_dir = 'dist'
files = []
for root, dirs, filenames in os.walk(dist_dir):
    for f in filenames:
        full = os.path.join(root, f)
        rel = os.path.relpath(full, dist_dir).replace('\\', '/')
        with open(full, 'rb') as fh:
            content = fh.read()
        files.append({'path': rel, 'content': content})

print('>>> 推送', len(files), '个文件到 GitHub...')

blobs = []
for f in files:
    b64 = base64.b64encode(f['content']).decode()
    url = API + '/repos/' + OWNER + '/' + REPO + '/git/blobs'
    r = requests.post(url, headers=HEADERS, json={'content': b64, 'encoding': 'base64'})
    if r.status_code != 201:
        print('错误: 上传', f['path'], '失败:', r.status_code)
        sys.exit(1)
    blobs.append({'path': f['path'], 'sha': r.json()['sha'], 'mode': '100644', 'type': 'blob'})

url = API + '/repos/' + OWNER + '/' + REPO + '/git/trees'
r = requests.post(url, headers=HEADERS, json={'tree': blobs})
tree_sha = r.json()['sha']

url = API + '/repos/' + OWNER + '/' + REPO + '/git/commits'
r = requests.post(url, headers=HEADERS, json={'message': 'Deploy CET-4 English App', 'tree': tree_sha})
commit_sha = r.json()['sha']

url = API + '/repos/' + OWNER + '/' + REPO + '/git/refs/heads/gh-pages'
r = requests.patch(url, headers=HEADERS, json={'sha': commit_sha, 'force': True})

print('>>> 部署成功！')
print('>>> 等待 1-2 分钟后访问：https://' + OWNER + '.github.io/' + REPO + '/')

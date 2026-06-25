import requests, base64, re, os
TOKEN = 'YOUR_TOKEN_HERE'
headers = {'Authorization': 'Bearer ' + TOKEN}
API = 'https://api.github.com'
r = requests.get(API + '/repos/yequqwq/cet4-english/contents/index.html?ref=gh-pages', headers=headers)
c = base64.b64decode(r.json()['content']).decode('utf-8')
js = re.findall(r"src=\"(\./assets/[^\"]+\.js)\"", c)
css = re.findall(r"href=\"(\./assets/[^\"]+\.css)\"", c)
print('远程 JS:', js)
print('远程 CSS:', css)

local_js = sorted(['./assets/' + f for f in os.listdir('dist/assets') if f.endswith('.js') and 'sw' not in f.lower() and 'workbox' not in f.lower()])
local_css = sorted(['./assets/' + f for f in os.listdir('dist/assets') if f.endswith('.css')])
print('本地 JS:', local_js)
print('本地 CSS:', local_css)

r2 = requests.get('https://yequqwq.github.io/cet4-english/', timeout=10)
ajs = re.findall(r"src=\"(\./assets/[^\"]+\.js)\"", r2.text)
acss = re.findall(r"href=\"(\./assets/[^\"]+\.css)\"", r2.text)
print('网站 JS:', ajs)
print('网站 CSS:', acss)

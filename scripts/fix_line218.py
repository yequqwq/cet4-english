import os
os.chdir(r'D:\cxdownload\English')
with open('src/pages/Home.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()
lines[217] = "                <ArrowRight className={`w-5 h-5 ${task.completed ? 'text-white/30' : 'text-white/50'}`} />\n"
with open('src/pages/Home.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('Fixed line 218')

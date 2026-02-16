---
title: Git aliases
date: 2025-12-31
categories: [Git]
tags: [Mechanism]
author: "ljf12825"
type: blog
summary: usage of git aliases machanism
---

Git Aliases允许为常用的（尤其是冗长或复杂的）Git命令创建简短的别名
- 核心目的：节省时间，减少打字错误，让命令行工作流更流畅
- 简单例子：不必每次都输入`git checkout`，可以创建一个别名`git co`
- 复杂例子：可以将一个复杂的、带有一堆选项的命令序列别名成一个简单的命令，如`git prettylog`

## 设置Aliases
### 方法一：使用`git config`命令
- 设置当前仓库的别名（仅在此项目中有效）
```bash
git config alias.co 'checkout'
```
这会将悲鸣写入当前项目下的`.git/config`文件
- 设置全局别名（在所有项目中有效）
```bash
git config --global alias.co 'checkout'
```
这会将别名写入用户主目录下的全局Git配置文件（`~/.gitconfig`或`~/.config/git/config`）

### 方法二：直接编辑配置文件
1. 打开全局配置文件
```bash
code ~/.gitconfig
```
2. 在文件中找到`[alias]`部分，如果没有就手动添加
```ini
[user]
    name = Your Name
    email = your.email@example.com
[alias]
    co = checkout
    cm = commit -m
    br = branch
```
3. 保存文件

别名不止限于Git子命令，还可以执行外部shell命令。这时需要在命令前加`!`
```bash
# 清除所有已合并的分支
git config --global alias.br-clean "!git branch --merged | grep -v '\\*' | xargs -n l git branch -d"
```

### 多命令
#### 使用`;`（顺序执行）
Git会按顺序依次执行它们，无论前一个命令是否成功
```bash
git config --global alias.<别名> '!命令1; 命令2; 命令3' # 这不是单个Git子命令，是一系列Shell命令，所以必须在最前面加上`!`
```

#### 使用`&&`（条件执行）
使用`&&`也可以连接命令。与`;`不同的是，`&&`是短路操作：只有前一个命令成功执行（返回退出码0），后一个命令才会运行
```bash
git config --global alias.<别名> '!命令1 && 命令2 && 命令3'
```

#### 使用函数（用于复杂逻辑）
对于非常复杂的多步骤操作，可以直接在别名中定义一个Shell函数
```bash
git config --global alias.<别名> '!f() { 命令1; 命令2; ...}: f'
```

#### 注意事项
1. 引号的使用：如果命令中包含空格或特殊字符，确保使用单引号`'`包裹整个命令字符串
2. 转义字符：在有些Shell（如Zsh）中，可能需要转义特殊符号，例如`\!`或`grep -v "\*"`
3. 可读性：对于非常长的别名，像上面的函数示例一样，使用`\`反斜杠进行换行，可以提高可读性和可维护性
4. 测试：加入配置前先测试命令组合
5. 位置参数：可以在函数中使用`$1`,`$2`等来接收参数
```bash
git config --global alias.cm '!f() { git commit -m "$1"; }; f'
```
然后就可以使用`git cm "My message"`


## 列出、修改和删除别名
- 列出所有已设置的别名
```bash
git config --get-regexp alias # 列出所有别名及其对应命令
```

- 查看某个别名的具体命令
```bash
git config alias.lg
```

- 修改别名：和设置时一样，重新运行`git config --global alias.xxx 'new command'`即可覆盖
- 删除别名
```bash
git config --global --unset alias.xxx
```
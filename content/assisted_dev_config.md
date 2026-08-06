---
title: Assisted Development Configuration
author: ljf12825
date: 2026-07-20
tags: [CheckList]
summary: This article is mainly about the configuration of assisted development which include lsp, encoding, indentation and format.
---

# 编码格式

# 换行与缩进

# LSP

## compile_commands.json

## bear

---

## 处理在不同项目中的不同编码格式

在Neovim/Vim中，处理不同项目不同编码和缩进有三种方式

### 方案1：使用`.editorconfig`规范

这是目前整个软件工程界最通用的标准。只需要在项目根目录下放一个`.editorconfig`文件，无论用Neovim, VSCode还是CLios，它都会自动按项目覆盖配置

#### 1. 开启Neovim原生支持

- Neovim 0.9+已经内置支持`.editorconfig`,不需要安装任何插件，开箱即用
- Vim可以装一个`editorconfig/editorconfig-vim`插件

#### 2. 在项目根目录放`.editorconfig`

```ini
# 表示这是顶级配置文件
root = true

[*]
charset = utf-8 # 文件编码：UTF-8
end_of_line = lf # 换行符：LF
```

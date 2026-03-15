---
title: commit
date: 2025-12-31
categories: [Git]
tags: [Command, Porcelain]
author: "ljf12825"
type: log
summary: git commit
---

很多版本管理系统存储的是文件版本之间的差异。而Git存储的是快照\
在Git里，每次commit会生成一个对象\
commit = 一次不可变的快照(snapshot) + 元数据 + 父节点指针

```text
commit
├── tree   (当前目录结构的快照)
├── parent (上一个 commit)
├── author / committer
├── message
```

这就形成了一条有向无环图(DAG)

```text
A --- B --- C --- D
```

保存整个项目状态（通过tree + blob 哈希复用实现高效存储）\
每一次Commit,Git都会保存当前所有被追踪文件的完整状态（实际上使用指针指向现有的文件对象，未修改的文件不会重复存储，只是链接到之前的相同文件）\
一旦创建，Commit的Hash值（如`a1b2c3d`）就确定了。任何内容的改动（哪怕是一个空格）都会生成一个全新的Hash值


## 基础用法

```bash
git status
git add file.cpp
git commit -m "Add basic renderer init"
```

| 区域 | 说明 |
| - | - |
| 工作区 | 正在编辑的文件 |
| 暂存区(index) | `git add`后 |
| 仓库(HEAD) | `git commit`后 |

只能commit暂存区里的内容

## commit message 规范

良好的提交信息格式能够帮助团队成员快速理解代码变更内容，方便代码审查和版本管理

### 典型的commit message格式

一个完整的commit message通常包含三部分：

```cpp
<type>[optional scope]: <subject>

[optional body]

[optional footer]
```

- type：提交类型，说明改动性质（必填）
- scope：影响范围，标明改动影响的模块或文件（可选）
- subject：简洁描述改动内容，第一行不超过50个字符，且不以句号结尾（必填）
- body：详细说明改动原因、具体内容（可选，换行写）
- footer：备注信息，比如关联的issue，破坏性变更说明（可选）

### 常见的type类型

| 类型       | 说明                     |
| -------- | ---------------------- |
| feat     | 新功能（feature）           |
| fix      | 修复 bug                 |
| docs     | 文档（documentation）      |
| style    | 代码格式（不影响代码逻辑，比如空格、分号等） |
| refactor | 重构（既不是新增功能，也不是修复 bug）  |
| perf     | 性能优化                   |
| test     | 添加测试                   |
| build    | 构建过程或辅助工具变动            |
| ci       | 持续集成配置相关变动             |
| chore    | 其他杂项，比如构建流程、依赖管理更新     |
| revert   | 回滚某个提交                 |

### 常见footer类型

#### 关联Issue/PR

最常见的用法是说明当前提交解决了哪个问题或者与那个Issue/PR有关

```nginx
Closes #123
Fixes #456
Refs #789
```
- `Closes #123`：表示这个提交会关闭Issue#123
- `Fixed #456`：功能上修复了该Issue
- `Refs #789`：仅作为引用，提交为未解决该Issue

这些关键词会被GitHub/GitLab自动识别，合并PR时自动关闭对应issue

#### BREAKING CHANGE

如果该提交包含破坏性更改（如修改了函数签名、接口参数等），需要在footer明确说明，方便版本发布工具识别并升级主版本号

```yaml
BREAKING CHANGE:登录接口参数从 username 改为 userName，客户端必须同步更改
```

这通常配合语义化版本发布工具使用

#### 其他元信息

有时也可以在footer写一些团队内部约定的信息

### 示例

```scss
feat(login)：添加了用户登录功能

实现用户名密码登录校验，并添加对应的错误提示。
登录成功后跳转至首页。

BREAKING CHANGE：登录接口参数发生变更，客户端需更新
```

### 建议

- 第一行是简短标题，长度最好不要超过50个字符
- 第二行空白，分隔标题和正文
- 正文详细说明改动的原因、解决的问题、实现方案等
- 使用祈使语气（Add,Fix,Change），而不是过去式（Added,Fixed）
- 如果修复了某个issue，可以在footer中注明，例如`Closes #123`
- 避免无意义的提交信息，如“修改”、“更新”

### 其他

- 有些团队会要求在scope中写明模块名，如`feat(UI)`，帮助区改改动范围
- 破坏性变更（BREAKING CHANGE）需要明确写出来
- Git工具`git commit`支持钩子（commit hooks），可以配合工具（如commitlint）自动校验提交格式

## OPTIONS

- `-m "msg"` 直接写提交信息
- `-a` 跳过add，自动暂存已跟踪文件
- `--amend` 修改上一次提交
- `--no-edit` amend时保留原message
- `--dry-run` 预览将提交什么
- `-v` 显示diff到编辑器
- `-p` 交互式选择hunk
- `--reuse-message=<hash>` `-C <hash>` 复用某次commit的message
- `-c <hash>` 复用但可编辑
- `--reset-author` 重置作者时间
- `--fixup <hash>` 标记为修复某提交
- `--squash <hash>` 合并到某提交
- `--no-verify` 跳过hook
- `--allow-empty` 允许空提交
- `--author="A <a@b.com>"` 改作者
- `--date="2023-01-01"` 改时间
- `--reset-author` 用当前用户
- `--no-gpg-sign` 跳过签名
- `--no-verify` 跳过pre-commit
- `--quiet` 安静输出
- `--short` 简短

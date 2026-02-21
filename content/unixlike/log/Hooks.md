---
title: Hooks
date: 2025-12-31
categories: [Git]
tags: [Mechanism]
author: "ljf12825"
type: log
summary: usage of git hooks
---

Git Hooks是Git在特定重要动作（如提交、推送、接收等）发生时自动运行的脚本。它们是一种内置的功能，允许自定义和自动化Git的工作流程\
可以把Git Hooks想象成事件监听器。当Git执行到某个关键节点时（比如`pre-commit`，`post-merge`），它会检查对应的钩子脚本是否存在。如果存在并且有执行权限，Git就会运行这个脚本
- 如果脚本成功退出（返回0），Git就继续执行后续操作
- 如果脚本非正常退出（返回非0），Git就会中止当前的操作。这正是钩子用来强制执行策略的强大之处

每个Git仓库都有一个内置的钩子目录：`.git/hooks/`。在这个目录下，会看到许多示例脚本（以`.sample`结尾），它们展示了各种钩子的用法\
不能直接创建任意名称的全新钩子（比如`pre-deploy`）。Git的钩子系统是固定事件的，它只会在预定义的特定生命周期节点去查找对应的脚本文件\
但可以利用现有钩子来模拟或触发自定义事件，实现“自定义时间”执行操作的效果。这是非常常见的做法\
重要提示：`.git/`目录本身不被版本控制。因此`.git/hooks/`下的脚本也无法通过Git共享给项目组的其他成员。这是一个本地化的设置。如果需要团队共享钩子，需要额外的步骤

### 常用Hooks类型
钩子主要分为两大类：客户端钩子（在你的电脑上运行）和服务端钩子（在Git服务器上运行，如GitLab，Gitea，GHE）

#### 客户端钩子（最常见）
1. `pre-commit`
  - 时机：在键入提交信息之前运行
  - 用途：检查代码快照（即将提交的内容）。通常用于运行代码风格检查（如ESLint，Black）、测试或检查是否有调试语句（如`console.log`）
  - 中止：如果该脚本退出非零，则中止提交。可以用`git commit --no-verify`绕过
2. `prepare-commit-msg`
  - 时机：在默认提交信息准备好之后，编辑器启动之前
  - 用途：允许动态地修改自动生成的提交信息模板（例如，合并或压缩提交时的默认信息）
3. `commit-msg`
  - 时机：在用户输入提交信息之后运行
  - 用途：检查提交信息是否符合规范（例如，必须符合Conventional Commits规范，必须有任务号等）
  - 中止：如果信息不符合规范，可以拒绝提交
4. `post-commit`
  - 时机：在整个提交过程完成之后进行
  - 用途：主要用于通知，例如发送邮件或触发一个CI构建（但现在更推荐在服务端做）
5. `pre-push`
  - 时机：在`git push`运行之后，任何东西被推送到远程之前
  - 用途：在推送代码前运行更耗时的完整测试套件或检查，确保推送到远程的代码是高质量的

#### 服务端钩子
1. `pre-receive`
  - 时机：在服务器处理来自客户端的推送操作时，最先运行的钩子
  - 用途：检查所有推送的提交。可用于实施强制性的公司策略，例如“所有提交信息必须有关联的任务号”，“禁止向主分支推送”等
2. `update`
  - 类似于`pre-receive`，但会为每一个要更新的分支各运行一次
3. `post-receive`
  - 时机：在整个推送过程完结之后运行
  - 用途：用于通知他人、触发部署、或者更新问题追踪系统。这是自动部署最常用的钩子

### 使用Hooks
创建一个钩子：
- 进入项目的`.git/hooks/`目录
- 创建一个文件，文件名必须是钩子的名称（如`pre-commit`，`commit-msg`），不能有扩展名
- 在文件的开头写入sheban（指定脚本解释器），例如`#!/bin/sh`用于Shell脚本，或`#!/usr/bin/env node`用于Node.js脚本
- 编写脚本逻辑
- 确保该文件是可执行的（`chmod +x .git/hooks/pre-commit`）

### 如何团队共享Git Hooks
如前所述，`.git/hooks`不纳入版本控制。要让团队所有成员使用相同的钩子，有几种常见方法：
1. 手动复制：最原始的方法，但非常容易出错且难以维护
2. 符号链接：将`.git/hooks`目录链接到项目中的一个受版本控制的目录
3. 使用第三方工具（推荐）
这些工具可以帮助管理钩子，并确保它们被安装到每个团队成员的本地仓库中
  - Husky（最流行）：现代前端项目的首选。它让配置Git Hooks变得非常简单，只需在`package.json`中配置即可
```json
// package.json
{
    "husky": {
        "hooks": {
            "pre-commit": "lint-staged", // 在提交前运行 lint-staged
            "commit-msg": "commitlint -E HUSKY_GIT_PARAMS" // 检查提交信息
        }
    }
}
```
安装Husky后，它会自动将其脚本安装到你的`.git/hooks`目录中

#### Husky运行原理
Husky采用了一种非常巧妙的安装和代理机制。它主要做了两件事
1. 在`.git/hooks`中安装代理脚本
2. 在项目根目录存储真实的配置

##### 第一步：安装-`husky install`
当运行`npx husky install`或通过`npm prepare`脚本自动安装时，Husky会执行以下操作
1. 在`.git/hooks`中创建文件：Husky会为每一个它支持的Git钩子（如`pre-commit`，`commit-msg`,`pre-push`等）在`.git/hooks/`目录下创建一个同名的文件
2. 这些文件时代理脚本：这些文件不是真正的钩子逻辑，而是Husky的统一入口脚本。所有这些都是完全相同的脚本，内容大致如下
```bash
#!/bin/sh
# 这是一个Husky创建的代理钩子文件

# 它主要做一件事：去调用Husky的核心程序，并告诉它现在触发的是哪个钩子
husky() {
    # 设置环境变量，告诉husky是哪个钩子被触发了
    export HUSKY_GIT_PARAMS="$*"

    # 运行Husky的核心命令
    npx --no-install husky run "$(besename "$0")"
}

# 运行上面定义的函数
husky "$@"
```
这个代理脚本的作用是：无论哪个Git钩子被触发，都会把执行权交给`husky run`命令

##### 第二步：存储配置-在版本控制中
真实的钩子配置并不在`.git/hooks`里，而是在项目根目录下
1. Husky的配置目录：Husky默认会在项目根目录创建一个`.husky/`目录
2. 存储真实的钩子：在`.husky/`目录下，可以看到实际执行的脚本文件
```text
your-project/
├── .husky/
│   ├── pre-commit    <-- 真正的pre-commit钩子
│   ├── commit-msg    <-- 真正的commit-msg钩子
│   └── _/           <-- Husky的内部辅助文件
├── .git/
│   └── hooks/
│       ├── pre-commit -> ../../.husky/pre-commit 代理脚本
│       └── ...
├── package.json
└── ...
```
3. `.husky/pre-commit`文件里的内容可能是
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm test # 运行测试
npx lint-staged # 运行lint-staged
```

##### 第三步：执行流程-钩子被触发时
当在项目中执行`git commit`时
1. Git发现要执行提交操作，于是查找`.git/hooks/pre-commit`文件
2. 找到的时Husky安装的代理脚本，并执行它
3. 代理脚本运行`npx husky run pre-commit`命令
4. `husky run`命令开始工作
  - 它读取项目根目录下`.husky/`文件夹
  - 查找对应的`pre-commit`文件
  - 执行该文件中的命令（如`npm test`, `npx lint-staged`）
5. 如果这些命令全部成功（退出码为0），提交继续；如果有任何一个失败，提交中止

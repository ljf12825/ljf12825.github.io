---
title: merge
date: 2025-12-31
categories: [Git]
tags: [Command, Porcelain]
author: "ljf12825"
type: log
summary: git merge
---

`git merge`将两个或多个开发历史合并在一起

## 描述

将指定提交中的更改（自它们与当前分支历史发生分叉的时间点起）合并到当前分支中

该命令被`git pull`用于将来自另一个仓库的更改合并进来，也可以手动使用，用于将一个分支的更改合并到另一个分支中

假设存在如下历史，并且当前分支是`master`

```css
      A---B---C topic
     /
D---E---F---G master
```

那么执行

```bash
git merge topic 
```

会把`topic`分支自从它与`master`分叉点（即E）以来知道其当前提交（C）的所有更改，重放到`master`分支上，并将结果记录为一个新的提交。该提交包含两个父提交的名称，以及一条由用户提供、用于描述这些更改的日志信息

在操作开始之前，`ORIG_HEAD`会被设置为当前分支的指向位置（G）

```css
      A---B---C topic
     /         \
D---E---F---G---H master
```

如果发生无法自动解决的冲突，或者在启动合并时提供了`--no-commit`，合并过程会停止\
此时可以运行`git merge --abort`或`git merge --continue`

`git merge --abort`会中止合并过程，并尝试重建合并之前的状态。然而，如果在合并开始时存在未提交的更改（尤其是在合并开始之后这些更改又被进一步修改过），`git merge --abort`在某些情况下将无法重建原始（合并前）的更改。因此不建议在存在非平凡的未提交更改时运行`git merge`：虽然这是可能的，但在发生冲突时，可能会使你处于难以退回的状态

## 选项

`--commit`\
`--no-commit`\
执行合并并提交结果。该选项可用于覆盖`--no-commit`

使用`--no-commit`时，执行合并并在创建合并提交之前停止，以便用户有机会在提交之前检查并进一步调整合并结果

注意，快进更新不会创建合并提交，因此无法使用`--no-commit`来阻止这些合并。因此，如果你希望确保你的分支不会因merge命令而被更改或更新，结合使用`--no-ff`和`--no-commit`

`--edit`\
`-e`\
`--no-edit`\
在成功完成机械合并后，在提交之前调用编辑器，以便进一步编辑自动生成的合并提交信息，从而让用户解释和说明此次合并\
可以使用`--no-edit`来直接接受自动生成的信息（通常不推荐）

如果通过命令行使用`-m`选项提供了一条草稿信息，并且仍希望在编辑器中进行修改，`--edit`（或`-e`）仍然是有用的

旧脚本可能依赖于历史行为，即不允许用户编辑合并日志信息。这类脚本在运行`git merge`时会看到编辑器被打开。为了便于这类脚本适配新的行为，可以在脚本开头将环境变量`GIT_MERGE_AUTOEDIT`设为`no`

`--cleanup=<mode>`\
该选项决定在提交之前如何清理合并提交信息

`--ff`\
`--no-ff`\
`--ff-only`\
指定在被合并的历史已经是当前历史的后代时，如何处理合并

除非正在合并一个未存放在其自然位置（`refs/tags/`层级）中的已注解（可能已签名）标签，否则默认使用`--ff`，在该特殊情况下默认假定`--no--ff`

- 使用`--ff`：当可能时，将合并解析为快进（仅更新分支指针以匹配被合并提交，不创建合并提交）。当不可能时（即被合并历史不是当前历史的后代），创建一个合并提交
- 使用`--no-ff`：在所有情况下都创建合并提交，即使该合并可以通过快进完成
- 使用`--ff-only`：在可能时解析为快进。当不可能时，拒绝合并并以非零状态退出

`-S[<key-id>]`\
`--gpg-sign[=<key-id>]`\
`--no-gpg-sign`\
对生成的合并提交进行GPG签名\
`<key-id>`参数是可选的，默认使用提交者身份；如果指定，必须紧贴选项且不带空格\
`--no-gpg-sign`用于抵消`commit.gpgSign`配置变量以及之前给出的`--gpg-sign`

`--log[=<n>]`\
`--no-log`\
除了分支名称之外，在提交信息中加入最多`<n>`条正在合并的实际提交的一行描述\
使用`--no-log`时，不列出正在合并的实际提交的一行描述

`--signoff`\
`--no-signoff`\
在提交日志信息末尾添加一条由提交者署名的`Signed-off-by`尾注

签名的含义取决于所提交的项目。例如，它可能表示提交者有权在项目许可证下提交该工作，或者同意某种贡献声明（如开发者贡献证书，Developer Certificate Of Origin）\
`--no-signoff`可用于抵消之前在命令行中给出的`--signoff`

`--stat`\
`-n`\
`--no-stat`\
在合并结束时显示diffstat\
diffstat同样受配置项`merge.stat`控制\
使用`-n`或`--no-stat`时，不显示diffstat

`--compact-summary`\
在合并结束时显示紧凑摘要(compact-summary)

`--squash`\
`--no-squash`\
生成工作区和索引的状态，就好像进行了真正的合并一样（但不包含合并信息），但不会实际创建提交、移动HEAD，也不会记录`$GIT_DIR/MERGE_HEAD`（以放置下一次`git commit`创建合并提交）\
这允许在当前分支之上创建一个单独的提交，其效果等同于合并另一个分支（或在八爪合并情况下合并多个分支）\
使用`--no-squash`时，执行合并并提交结果。该选项可用于覆盖`--squash`\
使用`--squash`时，不允许使用`--commit`，否则会失败

`--verify`\
`--no-verify`\
默认情况下，会运行pre-merge和commit-msg钩子\
当给出`--no-verify`时，这些钩子会被绕过

`-s <strategy>`\
`--strategy=<strategy>`\
使用指定的合并策略；可以多次提供，以指定尝试这些策略的顺序\
如果没有提供`-s`选项，则使用内建的策略列表（在合并单个头时为`ort`，否则为`octopus`）

`-X <options>`\
`--strategy-option=<option>`\
将特定于合并策略的选项传递给合并策略

`--verify-signatures`\
`--no-verify-signatures`\
验证被合并的侧分支的尖端提交是否由一个有效的密钥签名，即该密钥具有有效的uid：在默认信任模型中，这意味着该签名密钥已被受信任的密钥签署\
如果侧副分支的尖端提交没有使用有效密钥签名，则合并会被中止

`-q`\
`--quite`\
安静模式运行。隐含`--no-progress`

`-v`\
`--verbose`\
输出详细信息

`--progress`\
`--no-progress`\
显式开启或关闭进度显示\
如果未指定，且标准错误连接到终端，则显示进度\
但并非所有合并策略都支持进度显示

`--autostash`\
`--no-autostash`\
在操作开始前自动创建一个临时stash项，将其记录在`MERGE_AUTOSTASH`引用中，并在操作结束后应用它\
这意味着可以在工作区不干净的情况下进行该操作，但stash pop可能产生非平凡冲突

`--allow-unrelated-histories`\
默认情况下，`git merge` 命令会拒绝合并不共享共同祖先的历史

该选项可用于在合并两个最初独立开始的项目历史时覆盖这一安全限制
由于这种情况极为罕见，因此不存在也不会添加用于默认启用此行为的配置变量

`-m <msg>`\
设置用于合并提交的提交信息（如果创建了合并提交）\
如果指定了 `--log`，则会将正在合并的提交的简短日志追加到指定的信息中

`--into-name <branch>`\
准备默认的合并提交信息，就好像是合并到 `<branch>` 分支，而不是实际进行合并的分支名称

`-F <file>`\
`--file=<file>`\
从文件中读取用于合并提交的提交信息（如果创建了合并提交）\
如果指定了 `--log`，则会将正在合并的提交的简短日志追加到指定的信息中

`--rerere-autoupdate`\
`--no-rerere-autoupdate`\
在 rerere 机制复用已记录的冲突解决方案并更新工作区文件后，允许其同时使用解决结果更新索引\
`--no-rerere-autoupdate` 是在提交结果到索引之前，用于双重检查 rerere 所做工作的一个好方法

`--overwrite-ignore`\
`--no-overwrite-ignore`\
静默覆盖合并结果中的被忽略文件。这是默认行为\
使用 `--no-overwrite-ignore` 时会中止合并\

`--abort`\
中止当前的冲突解决过程，并尝试恢复合并前的状态\
如果存在 autostash 条目，则会将其应用到工作区\
如果在合并开始时存在未提交的工作区更改，在某些情况下 `git merge --abort` 将无法重建这些更改。因此建议在运行 `git merge` 之前始终提交或 stash 更改\
当 `MERGE_HEAD` 存在且 `MERGE_AUTOSTASH` 不存在时，`git merge --abort` 等价于 `git reset --merge`；如果 `MERGE_AUTOSTASH` 存在，则 `git merge --abort` 会将 stash 条目应用到工作区，而 `git reset --merge` 会将 stash 保存到 stash 列表中

`--quit`\
忘记当前正在进行的合并。保持索引和工作区不变\
如果存在 `MERGE_AUTOSTASH`，stash 条目将被保存到 stash 列表中\

`--continue`\
在由于冲突而停止合并之后，你可以通过运行 `git merge --continue` 来完成合并

`<commit>...`
要合并到当前分支的提交，通常是其他分支的头\
指定多个提交将创建一个拥有多个父提交的合并（被亲切地称为“八爪合并”）\
如果命令行中未给出任何提交，则会合并当前分支配置为其上游的远程跟踪分支\
当指定 `FETCH_HEAD`（且未指定其他提交）时，将会把前一次 `git fetch` 调用记录在 `.git/FETCH_HEAD` 文件中的分支合并到当前分支

## PRE-MERGE CHECKS（合并前检查）
在应用外部更改之前，应该确保自己的工作处于良好状态并已在本地提交，以便在发生冲突时不会被破坏

当本地存在未提交的更改，且这些更改与`git pull`/`git merge`需要更新的文件发生重叠时，这两个命令都会停止且不做任何操作

为了避免在合并提交中记录无关的更改，如果索引中存在相对于HEAD提交的更改，`git pull`和`git merge`也会中止。（根据所使用的合并策略，可能存在一些狭窄的例外情况，但通常索引必须与HEAD匹配）

如果所有指定的提交已经是HEAD的祖先，`git merge`会提前退出并显示信息："Already up to date"

## FAST-FORWARD MERGE（快进合并）
当前分支的头经常是指定提交的祖先。这是最常见的情况，尤其是在通过`git pull`调用时：你正在跟踪一个上游仓库，你没有提交任何本地更改，现在你希望更新到梗新的上游修改

在这种情况下，不需要新的提交来存储合并后的历史；相反，HEAD（以及索引）会被更新为指向指定提交，而不会创建额外的合并提交

可以使用`--no-ff`选项抑制这种行为

## TRUE MERGE（真正的合并）
除了快进合并之外，被合并的分支必须通过一个合并提交绑定在一起，该提交以这些分支作为其父提交

合并后的版本会被提交，HEAD、索引和工作区会被更新为该结果

## MERGING TAG（合并标签）

当合并一个已注释（并且可能已签名）的标签时，即使可以进行快进合并，Git也总是会创建一个合并提交，并且提交信息模板会使用该标签的信息。此外，如果该标签已签名，签名检查结果会作为注释报告在提交信息模板中

当你只是想集成通向该被标记提交的工作时（例如，与某个上有发布点同步），你可能并不希望创建一个不必要的合并提交；在这种情况下，可以在将其交给`git merge`之前自行“解包”该标签，或者在你自己没有任何工作的情况下使用`--ff-only`

```bash
git fetch origin
git merge v1.2.3^0
git merge --ff-only v1.2.3
```

## 冲突

在合并过程中，工作区文件会被更新以反映合并结果。在对共同祖先版本所做的更改中，不重叠的更改，会被逐字地合并到最终结果中\
然而，当双方都对同一块区域进行了更改时，Git无法随意选择其中一方，而是要求你通过保留双方在该区域中所做的更改来解决冲突\
默认情况下，Git使用与RCS套件中的`merge`程序相同的样式来呈现冲突块

```text
Here are lines that are either unchanged from the common
ancestor, or cleanly resolved because only one side changed,
or cleanly resolved because both sides changed the same way.
<<<<<<< yours:sample.txt
Conflict resolution is hard;
let's go shopping.
=======
Git makes conflict resolution easy.
>>>>>>> theirs:sample.txt
And here is another line that is cleanly resolved or unmodified.
```

发生冲突的更改区域会被标记为`<<<<<<<`, `=======`, `>>>>>>>`\
`=======`之前的部分通常是你这一侧的更改，之后的部分通常是对方的更改

可以通过将`merge.conflictStyle`配置变量设置为`diff3`或`zdiff3`来使用另一种样式，上述冲突可能如下所示

```text
Here are lines that are either unchanged from the common
ancestor, or cleanly resolved because only one side changed,
<<<<<<< yours:sample.txt
or cleanly resolved because both sides changed the same way.
Conflict resolution is hard;
let's go shopping.
||||||| base:sample.txt
or cleanly resolved because both sides changed identically.
Conflict resolution is hard.
=======
or cleanly resolved because both sides changed the same way.
Git makes conflict resolution easy.
>>>>>>> theirs:sample.txt
And here is another line that is cleanly resolved or unmodified.
```

在`zdiff3`样式中，显示方式可能如下

```text
Here are lines that are either unchanged from the common
ancestor, or cleanly resolved because only one side changed,
or cleanly resolved because both sides changed the same way.
<<<<<<< yours:sample.txt
Conflict resolution is hard;
let's go shopping.
||||||| base:sample.txt
or cleanly resolved because both sides changed identically.
Conflict resolution is hard.
=======
Git makes conflict resolution easy.
>>>>>>> theirs:sample.txt
And here is another line that is cleanly resolved or unmodified.
```

除了`<<<<<<<`, `=======`和`>>>>>>>` 标记外，还使用了一个`|||||||`标记，其后跟随原始文本。原始内容只是陈述来一个事实，而你这一侧只是接受来这个陈述并放弃了，而另一侧则试图采取一种更积极的态度。通过查看原始内容，有时可以想出一个更好的解决方案

### 冲突的解决

看到冲突之后，可以做两件事

1. 决定不进行合并
将索引重置到HEAD, 并清理对工作区的更改，可以使用`git merge --abort`

2. 解决冲突

Git会在工作区中标记冲突。将文件编辑到正确状态并使用`git add`将其加入索引。使用`git commit`或`git merge --continue`完成合并，`continue`会在调用`git commit`之前检查是否存在一个（被中断的）合并过程

可以使用多种工具来处理冲突

- 使用合并工具
使用`git mergetool`启动一个图形化合并工具，它会引导你完成合并

- 查看差异
`git diff`会显示一个三方差异，突出显示HEAD和MERGE_HEAD两侧的更改\
`git diff AUTO_MERGE`会显示你目前为解决文本冲突所做的更改

- 查看各分支的差异
`git log --merge -p <path>`会显示HEAD版本的差异，然后显示MERGE_HEAD版本的差异

- 查看原始版本
`git show :1:filename`显示共同祖先版本\
`git show :2:filename`显示HEAD版本\
`git show :3:filename`显示MERGE_HEAD

## MERGE STRATEGIES（合并策略）

合并策略是Git用什么算法/规则来把多个分支的改动揉成一个结果\
默认情况下
- 两个分支 -> `ort`
- 多个分支（八爪）-> `octopus`

### `ort`（默认，推荐）

Ostensibly Recursive's Twin，Git 2.34+的默认策略（取代`recursive`）

特点

- 更快
- 更聪明的冲突检测
- 更少“莫名其妙”的冲突
- 支持大多数`-X`选项

使用场景

- 99%日常开发
- feature -> develop
- develop -> master/main

```bash
git merge topic
# 等价于
git merge -s ort topic
```

### `octopus`（八爪合并）

一次合并多个分支

```bash
git merge topic1 topic2 topic3
```

特点
- 非常快
- 不允许复杂冲突
- 只适合“彼此几乎不冲突”的分支

使用场景

- 多个独立feature同时合入
- 自动化脚本/CI批量合并

一旦有冲突，会直接失败

### `resolve`（老策略，基本不用）

- 只能合并两个分支
- 冲突处理能力弱

### `ours`

直接忽略对方分支的内容，但保留“合并历史”

```bash
git merge -s ours other-branch
```

历史上看起来合并了，但实际代码完全以当前分支为准\
常用于标记某个分支已被“逻辑淘汰”，停止某条失败的实验分支继续干扰

### `subtree`（子树合并）

用于八另一个仓库的内容合进某个子目录

```bash
git merge -s subtree other-repo
```

### 策略选项（`-X`的常见选项）

这些是给`ort`, `recursive`用的偏好规则

#### `-X ours/theirs`

冲突时偏向哪一边

```bash
git merge -X ours topic
git merge -X theirs topic
```

只在冲突块生效，不是整个文件替换

### `-X ignore-space-change`, `-X ignore-all-space`

忽略空白差异引发的冲突

### `-X patience`

使用 patience diff 算法\
对大文件，对重构过的代码更友好
---
title: clean
date: 2025-12-31
categories: [Git]
tags: [Command, Porcelain]
author: "ljf12825"
type: log
summary: git gitclean
---

`git clean`用来清理工作区中未被追踪的文件和目录\
它会删除那些不在Git索引里、也不在`.gitignore`里、且未被Git管理的文件\
这些文件通常是：
- 编译生成的临时文件（如`.o`,`.class`,`.pyc`）
- 构建产物（如`bin/`, `dist/`, `node_modules/`（如果没有将它们添加到`.gitignore`））
- 编辑器创建的备份文件或交换文件

这是一个危险命令，被它删除的文件通常无法恢复，它不涉及Git的历史记录，直接删文件

## 基本用法
- `git clean`：Git会拒绝执行，并显示帮助信息

- `git clean -n`
dry-run，列出会被删除的文件，但不执行

- `git clean -f`
强制删除未追踪文件，只有强制执行才会执行删除

- `git clean -d`
删除未追踪的目录，需要配合`-f`写为`git -fd`

- `git clean -x`
删除所有未追踪文件，包括`.gitignore`忽略的

- `git clean -X`
删除只在`.gitignore`中忽略的文件，保留普通未追踪文件

## 常见组合
- 列出将删除的文件（删除之前先dry-run一遍）
```bash
git clean -nd
```

- 删除未追踪的文件和目录
```bash
git clean -fd
```

- 清理所有（包括.gitignore忽略的）
```bash
git clean -fdx
```

- 只清理.gitignore的产物
```bash
git clean -fdX
```

## 原理
`git clean`的逻辑类似于集合差集计算
1. 收集Git已知的文件集合
  - 从`.git/index`读取所有被追踪的文件
  - 从HEAD commit读取快照

2. 扫描工作目录
  - 遍历当前文件系统目录树

3. 差集运算
  - 如果判断文件是否是未追踪状态

4. 过滤规则
  - 根据参数过滤
  - 根据`.gitignore`、`.git/info/exclude`、`core.excludesfile`规则过滤

5. 调用系统API删除

## 注意事项
1. 不可逆操作
2. 不会影响已追踪文件、暂存区和commit中的东西
3. 用`.gitignore`或`.git/info/exclude`标记不想被误删的文件



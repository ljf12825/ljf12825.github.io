---
title: Preprocess & Macro
date: 2026-04-16
author: ljf12825
type: file
summary: C macro and preprocess
---

预处理是C编译流程的第一个阶段，它在真正的编译开始之前对源代码进行文本处理

## 预处理，预处理器，执行时机

C 代码从源文件到可执行文件经过四个步骤

```
源代码(.c)
   v
预处理（Preprocessing）
   v
编译（Compile）
   v
汇编（Assemble）
   v
链接（Link）
```

预处理器(Preprocessor)是编译前的“文本处理器”，它不理解语法，不理解类型，不执行代码，只做文本替换 + 条件裁剪

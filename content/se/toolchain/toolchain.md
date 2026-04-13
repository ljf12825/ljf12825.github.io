---
title: Toolchain
type: file
author: ljf12825
date: 2026-04-13
summary: overview of toolchain
---

工具链，是由多个独立工具组成的、按固定顺序协作的软件开发流水线，负责把人类可读的源代码一步步转化到及其可执行的形态

工具链的界限是模糊的，在很多系统/底层语境里toolchain约等于compiler toolchain，即`compiler`, `assembler`, `linker`；这些是工具链里的核心子集：编译工具链

但实践工程中不这么切，在真实开发中，工具链通常指：让开发流程跑起来的一整套工具体系

广义的工具链范畴非常庞大

- 编译工具链
  - C/C++编译器(frontend + backend)
  - IR
  - optimization passes
  - ld
- Build System
  - Make
  - CMake
  - Ninja
- 包管理/依赖管理
  - vcpkg
  - Conan
  - npm/cargo/pip
- 调试&分析工具
  - gdb, lldb
  - profiler(perf, flamegraph)
  - sanitizer(ASan, UBSan)
- 开发辅助工具
  - 静态分析(clang-tidy)
  - 格式化(clang-format)
  - LSP
  - CI//CD
  - 代码生成工具
  - asset pipeline
- 运行时/环境（部分）
  - 标准库(libc/libstdc++)
  - runtime（比如C++ ABI, GC, JIT runtime）


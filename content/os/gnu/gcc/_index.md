---
title: GCC
type: file
---

# GCC

<!--more-->

## Preface

GCC(GNU Compiler Collection) is one of the most prestigious projects under the Free Software Foundation. Since its inception in 1987, it has grown from a single compiler supporting only the C language into a compiler infrastructure supporting dozens of languages and platforms. As the core of the GNU toolchain and the cornerstone of the Linux ecosystem, virtually all system software and user programs on Linux distributions are compiled by GCC.

## Chapter1: History and Current Status

### 1.1 Origins and Early Development

In 1987, Richard Stallman Launched the GNU C Compiler project to provide a core compilation tool for building the GNU operating system. Initially supporting only the C language, the compiler quickly became one of the most important compilers in the Unix world due to its excellent performance and open, free nature

### 1.2 The EGCS Fork and Transformation

In 1997, due to the overly closed official GCC development process and slow code merging, a group of developers initiated the EGCS(Experimental/Enhanced GNU Compier System) fork.EGCS adopted a more open development model, actively accepting various language front ends and optimization improvements. Thisfork profoundly changed GCC's destiny——in 1999, EGCS was officially adopted as the official version, and the project was simultaneously renamed the GNU Compiler Collection, marking its transformation from a single-language compiler to a multi-language compiler collection. Since then, GCC's development model has remained open to this day, which has directly shaped its modular and extensible architectural design.

### 1.3 Key Version Milestones

| Version | Year | Milestone |
| - | - | - |
| GCC 1.0 | 1987 | First public release |
| GCC 2.0 | 1992 | Added C++ support |
| GCC 3.0 | 2001 | Unified architecture, integrating all language front ends |
| GCC 4.0 | 2005 | Introduced SSA(Static Single Assignment) optimization framework |
| GCC 5.0 | 2015 | Default C++ ABI switched to C++11 standard |
| GCC 10.0 | 2020 | Full C++20 support |
| GCC 15.0 | 2025 | C++23 feature evolution |

### 1.4 Version Release Strategy

GCC adopts an annual major version release strategy, typically releasing a new major version number(e.g., GCC 13, GCC 14) in the first half of each year. Each major version enters a maintenance period after release, continuously receiving bug fixes and backports. The versioning scheme is `major.minor.patch`, where a major version change signifies the addition of new language standard support, significant optimization improvements, or architecture adaptations. Developers can use `gcc -v` to view the currently used GCC version and its compilation configuration details






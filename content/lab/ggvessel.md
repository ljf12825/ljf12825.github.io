---
title: ggvessel
date: 2026-02-27
author: ljf12825
tags: [GG, Lib]
summary: Attempting to implement a super-container
---

<https://github.com/GrainGen/ggvess>

- `ggvessel::hash`：
  - 定位：面向工程容器的高吞吐、低延迟非加密哈希算法
  - 特性：利用位混合(Bit Mixing)与指令流水线(Pipeline)优化，具备高散列度与极佳的雪崩效应
- `ggvessel::unordered_map`：
  - 定位：基于`ggvessel::hash`底层算法的高性能Key-Value哈希映射容器
  - 冲突方案：采用开放寻址法(Open Addressing) / SwissTable 扁平数组设计，大幅提升CPU L1/L2 缓存命中率(Cache Locality)，并通过SIMD指令实现并行探测
- `ggvessel::unordered_set`：
  - 定位：基于`ggvessel::hash`底层算法的高性能无序集合容器
  - 特性：与`ggvessel::unordered_map`共享高效的底层数组存储内核，机制压榨内存对齐与Cache Line 利用率

## Benchmark

1. `ggvessel::hash` 与标准Hash函数对比
    - 测试`ggvessel::hash`在处理8-byte整数、短字符串、长文本时的GB/s吞吐量，和现有的哈希函数如`std::hash`, `MurmurHash3`, `xxHash`对比
2. `ggvessel::unordered_map` 与 `std::unordered_map`对比
    - 在不同数据规模（如100k到10000k数据）下的插入/查找/删除延迟(Latency) 和 Cache Miss 概率

---
title: Data Structure
date: 2025-12-31
author: ljf12825
summary: overview of data structure
type: file
---

# Data Structure

本质：内存布局 + 访问路径 + 修改成本

## 因果

现实世界中不存在一种完美的通用的数据结构能在任意约束条件下保持性能最优\
所有的数据结构都是在约束条件下，为达到某种性能目标而所做的选择和取舍

- 约束条件
  - 数据规模
  - 数据是否动态
  - 内存与硬件约束
  - 线程与并发
  - 实现与维护成本
  - 内存局部性
  - 写放大/读放大

- 性能目标
  - 查找/访问
  - 插入/删除
  - 内存/空间
  - 有序性

所有数据结构，本质都在解决三种关系

- 顺序关系（Sequence）：前后顺序
- 层级关系（Hierarchy）：隶属
- 关联关系（Relation）：相关性

三种关系在不同的约束条件下，形成了多种版本

X 性能 + Y 约束 -> 正确的数据结构

## 基础数据结构

为了便于总结，按照数据的排列方式对数据结构进行分类，仅作为分类方式

### 线性数据结构

1. Array
    - Fixed Array
    - Variable Array

2. Linked List
    - Single Linked List
    - Double Linked List
    - Circular Linked List

3. Stack

4. Queue
    - Deque
    - Priority Queue
    - Circular Queue

### 树形数据结构

1. Binary Tree
    - BST
    - AVL
    - RBT
    - Heap

2. M-ary Tree
    - B-Tree
    - B+Tree
    - Trie
    - Segment Tree
    - Fenwick Tree(BIT)

### 图状数据结构

1. 图的表示方式
    - 邻接矩阵
    - 邻接表
    - 边列表

2. 特殊图
    - 有向图/无向图
    - 加权图/无权图
    - 有环图/无环图

### 哈希结构

1. Hash Table

2. Bloom Filter

### 特殊数据结构

这些不是通用结构，而是极端场景最优

1. Disjoint Set

2. Skip List

3. Bitmap

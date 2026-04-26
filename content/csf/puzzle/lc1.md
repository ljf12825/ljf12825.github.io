---
title: LC1.E.TwoNumsSum
type: file
author: ljf12825
date: 2026-04-26
summary: ...
---

> 问题

```txt
两数之和
给定整数数组nums和目标值target
返回和为target的两个整数在nums中的下标
两个整数不能是nums中的同一个元素
```

> 题解

```cpp
#include <iostream>
#include <vector>
#include <unordered_map>

//1.暴力求解
//O(n^2)
class Solution_1
{
public:
	std::vector<int> twoSum(std::vector<int>& nums, int target)
	{
		for (int i = 0; i < nums.size(); ++i)
		{
			for (int j = 0; j < nums.size(); ++i)
				if (nums[i] + nums[j] == target) return { i, j };
		}
		return {};
	}
};

//2.哈希表
//O(n)
class Solution
{
public:
	std::vector<int> twoSum(std::vector<int>& nums, int target)
	{
		std::unordered_map<int, int> hashtable;
		for (int i = 0; i < nums.size(); ++i)
		{
			auto it = hashtable.find(target - nums[i]);
			if (it != hashtable.end()) return { it->second, i };
			hashtable[nums[i]] = i;
		}
		return {};
	}
};
```

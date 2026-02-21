---
title: Number System
date: 2025-12-31
author: ljf12825
summary: number and number system
type: file
---

## 进位计数制
### Binary
- 只有两种数字：0和1
- 计算机内部的数据表示基本都是二进制，因为计算机的基本开关只有两种状态：开（1）和关（0）

### Octal
- 包含数字0到7，一共有8种数字
- 主要在某些旧的计算机系统中使用

### Decimal
- 最常用的进制系统，包含数字0到9，一共10种数字
- 日常生活中使用

### Hexadecimal
- 包含数字0到9，以及字母A到F，共16个数字
- 十六进制在计算机中用于表示较长的二进制数，因为它更简洁，且每个十六进制位可以直接对应四个二进制位

## 进制的转换
![进制转换](/images/content/baseconversion.drawio.svg)

- Binary -> Decimal

方法1：
```cpp
int BinarytoDecimal(const std::string& binary)
{

	int sum = 0;
	int position = binary.length() - 1;

	for (auto it : binary)
	{
		if (it == '0') {}
		else if (it == '1') sum += std::pow(2, position);
		else abort();
		--position;
	}
	
	return sum;
}
```

方法2：使用`std::stoi`(或`std::stoll`)
`std::stoi`是C++11引入的标准库函数，可以将字符串转换为整数，支持不同的进制
```cpp
std::stoi(binary, nullptr, 2); // 2 表示二进制
```

方法3：手动优化位运算
```cpp
int BinarytoDecimal(const std::string& binary)
{
    int sum = 0;
    for (char c : binary) sum = (sum << 1) | (c - '0'); // 将sum左移，并加上当前二进制位，c - '0'是ASCII码相减
}
```

方法4：使用`std::bitset`
`std::bitset`是C++标准库中的一个模板类，可以很方便地处理二进制数据。如果二进制字符串长度较小，或者只需要处理固定长度的二进制数，`bitset`是很好的选择
```cpp
# include <bitset>
std::bitset<32> bits(binary); // 假设二进制字符串长度不超过32位
static_cast<int>(bits.to_ulong()); // 先转ulong，再转int
```

- Decimal -> Binary

方法1：除2取余
```cpp
std::string DecimaltoBinary(int decimal)
{
	if (decimal == 0) return "0";

	std::string binary;

	while (decimal > 0)
	{
		if (decimal % 2 == 1) binary.push_back('1');
		else binary.push_back('0');
        // 可优化为
        // binary.push_back((decimal % 2) + '0'); // int->char

		decimal /= 2;
	}
	std::reverse(binary.begin(), binary.end());
	return binary;
}
```

方法2：使用`std::bitset`
```cpp
#include <bitset>
std::bitset<32> bits(decimal);
bits.to_string();
```

方法3：位运算
```cpp
std::string DecimaltoBinary(int decimal)
{
    if (decimal == 0) return "0";

    std::string binary;
    while (decimal > 0)
    {
        binary.push_back((decimal & 1) + '0'); // 提取最低位
        decimal >>= 1; // 右移一位，相当于除以2
    }

    std::reverse(binary.begin(), binary.end()); 
    return binary;
}
```

方法4：递归
```cpp
std::string DecimaltoBinary(int decimal)
{
    if (decimal == 0) return ""; // 递归基：当数字为0时返回空字符串

    return DecimaltoBinary(decimal / 2) + std::to_string(decimal % 2);
}

int main()
{
    int decimal = 13;
    std::string binary = DecimaltoBinary(decimal);
    if (binary.empty()) binary = "0"; // 处理0
    return 0;
}
```

- Hexadecimal -> Binary

方法1：按位映射

方法2：Hexadecimal -> Decimal -> Binary
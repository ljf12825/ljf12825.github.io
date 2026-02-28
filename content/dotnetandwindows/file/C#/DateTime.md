---
title: C# Date Time System
date: 2025-06-01
author: "ljf12825"
type: file
summary: C# date time
---

## C# 时间系统

### 基础时间类型概览
C#中处理时间的核心结构体包括：

| 类型名              | 定义于      | 功能简介                                        |
| ---------------- | -------- | ------------------------------------------- |
| `DateTime`       | `System` | 最常用的时间表示类型，包含日期、时间、精度到 100ns。               |
| `TimeSpan`       | `System` | 表示两个 `DateTime` 之间的差值，或一个持续时间。              |
| `DateTimeKind`   | `System` | 枚举类型，用于标识 `DateTime` 是 `Local`、`Utc` 还是未指定。 |
| `DateTimeOffset` | `System` | 带时区偏移的时间，精确跨时区时间管理。                         |

#### `DateTime`：标准时间表示
**特性**\
- 精度：100纳秒（Ticks）
- 范围：0001/1/1到9999/12/31
- 内部存储：以64位整数表示ticks（从公元0001-01-01起的刻度数）

```cs
DateTime now = DateTime.Now; // 本地时间
DateTime utc = DateTime.UtcNow; // UTC时间
DateTime specific = new DateTime(2025, 8, 1, 14, 30, 0); // 自定义时间
```
常用属性
```cs
now.Year;         // 年
now.Month;        // 月
now.Day;          // 日
now.Hour;         // 小时
now.Minute;       // 分钟
now.Second;       // 秒
now.Millisecond;  // 毫秒
now.DayOfWeek;    // 星期几
now.DayOfYear;    // 一年中的第几天
```

#### `TimeSpan`：时间间隔
**特性**\
- 表示时间间隔而非具体时间点
- 支持负值
- 精度：100纳秒

```cs
TimeSpan span = new TimeSpan(2, 30, 0); // 2h 30min
DateTime t1 = DateTime.Now;
DateTime t2 = t1.Add(span); // 加时间间隔
TimeSpan delta = t2 - t1; // 时间差计算
```
常用属性
```cs
span.TotalHours; // 2.5
span.Minutes; // 30
span.TotalMilliseconds;
```

#### `DateTimeKind`：时间语义标识
枚举值
```cs
public enum DateTimeKind
{
    Unspecified, // 未指定，默认构造是这个
    Utc, // UTC时间
    Local // 本地时间
}
```
用法示例
```cs
DateTime dt = new DateTime(2025, 8, 1, 12, 0, 0, DateTimeKind.Utc);
DateTimeKind kind = dt.Kind; // Utc
```
> 注意：`DateTime.Now.Kind == Local`, `DateTime.UtcNow.Kind = Utc`

#### `DateTimeOffset`：带时区偏移的时间表示
**特性**\
- 表示一个“绝对”时间点（时间 + 偏移量）
- 精确管理跨时区的场景（如数据库、国际化系统）
- 能避免`DateTime`的时区歧义问题

```cs
DateTimeOffset dto = DateTimeOffset.Now; // 当前本地时间，time + offset (H:mm:ss + 00:00)
DateTimeOffset utcDto = DateTimeOffset.UtcNow; // UTC时间，格式同上
DateTimeOffset custom = new DateTimeOffset(2025, 8, 1, 12, 0, 0, TimeSpan.FromHours(8)); // 手动设置当前时间和offset

DateTime utc = dto.UtcDateTime; // 转utc，DateTime类型
DateTime local = dto.LoaclDateTime; // 转本地
```

### 时间的创建与格式化

#### 创建DateTime的方式
构造函数
```cs
DateTime dt = new DateTime(2025, 8, 1); // 2025-08-01 00:00:00
DateTime full = new DateTime(2025, 8, 1, 14, 30. 0); // 带时间
DateTime withKind = new DateTime(2025, 8, 1, 14, 30, 0, DateTimeKind.Utc); // 指定时区语义
```

静态属性
```cs
DateTime now = DateTime.Now;         // 当前本地时间
DateTime utcNow = DateTime.UtcNow;   // 当前UTC时间
DateTime today = DateTime.Today;     // 今天的00:00:00
```

特殊用途
```cs
DateTime min = DateTime.MinValue; // 0001-01-01
DateTime max = DateTime.MaxValue; // 9999-12-31
```

#### 格式化输出ToString
使用`ToString()`输出时间字符串，支持多种格式

标准格式字符串（大小写敏感）

| 格式  | 示例                                  | 含义                   |
| --- | ----------------------------------- | -------------------- |
| `d` | `8/1/2025`                          | 短日期                  |
| `D` | `Friday, August 1, 2025`            | 长日期                  |
| `t` | `14:30`                             | 短时间                  |
| `T` | `14:30:00`                          | 长时间                  |
| `f` | `Friday, August 1, 2025 14:30`      | 长日期+短时间              |
| `F` | `Friday, August 1, 2025 14:30:00`   | 长日期+长时间              |
| `o` | `2025-08-01T14:30:00.0000000+08:00` | ISO 8601（Round-trip） |

```cs
string s1 = DateTime.Now.ToString("F");
```

自定义字符串格式

| 字符     | 含义     | 示例     |
| ------ | ------ | ------ |
| `yyyy` | 年      | `2025` |
| `MM`   | 月（两位）  | `08`   |
| `dd`   | 日      | `01`   |
| `HH`   | 时（24制） | `14`   |
| `mm`   | 分      | `30`   |
| `ss`   | 秒      | `05`   |
| `fff`  | 毫秒     | `123`  |

```cs
string str = now.ToString("yyyy-MM-dd HH:mm:ss.fff");
// 输出示例：2025-08-01 14:30:00.123
```

#### 字符串解析 Parse/TryParse/ParseExact
Parse（可能抛异常）
```cs
DateTime dt = DateTime.Parse("2025-08-01 14:30");
```

TryParse（推荐）
```cs
bool success = DateTime.TryParse("2025-08-01", out DateTime dt);
if (success) {
    // 成功解析
}
```

ParseExact（精确控制格式）
```cs
string input = "2025/08/01 14:30";
DateTime dt = DateTime.ParseExact(input, "yyyy/MM/dd HH:mm", CultureInfo.InvariantCulture);
```

`Parse`和`ParseExact`默认使用当前系统区域设置（文化信息）

#### 常见问题

| 问题             | 原因与解决方案                                  |
| -------------- | ---------------------------------------- |
| 输入字符串格式不对      | 使用 `TryParse` 或 `ParseExact` 防止异常        |
| `Parse` 出现时区歧义 | 使用 `DateTimeOffset.Parse` 更安全            |
| 毫秒信息丢失或不一致     | 明确格式字符串 `fff`，注意数据源精度                    |
| 文化差异导致解析失败     | 使用 `CultureInfo.InvariantCulture` 明确文化设置 |

### 时间计算与比较

#### `Add`方法
`Add`系列方法允许对`DateTime`添加不同类型的时间单位

| 方法                        | 参数类型     | 说明              |
| ------------------------- | -------- | --------------- |
| `AddDays(double)`         | `double` | 添加天数，支持负数       |
| `AddHours(double)`        | `double` | 添加小时，支持负数       |
| `AddMinutes(double)`      | `double` | 添加分钟，支持负数       |
| `AddSeconds(double)`      | `double` | 添加秒，支持负数        |
| `AddMilliseconds(double)` | `double` | 添加毫秒，支持负数       |
| `AddTicks(long)`          | `long`   | 添加刻度数（100纳秒为单位） |

```cs
DateTime now = DateTime.Now;
DateTime tomorrow = now.AddDays(1);   // 明天同一时刻
DateTime nextHour = now.AddHours(1);  // 一小时后
DateTime lastMinute = now.AddMinutes(-1); // 一分钟前
```

#### 时间差计算
通过`-`运算符或`Subtract`方法来计算两个`DateTime`之间的差值，返回的是`TimeSpan`类型
```cs
DateTime t1 = new DateTime(2025, 8, 1, 14, 30, 0);
DateTime t2 = DateTime.Now;
TimeSpan difference = t2- t1; // t2和t1之间的差值
```
`TimeSpan`常用属性
- `TotalDays`：总天数
- `TotalHours`：总小时数
- `Days`：整数天数
- `Hours`：小时数
- `Minutes`：分钟数
- `Seconds`：秒数

#### 比较`DateTime`对象
可以使用 `CompareTo` 或 `>`、`<`、`==` 运算符来比较两个 `DateTime` 对象的大小

```cs
DateTime dt1 = DateTime.Now;
DateTime dt2 = DateTime.UtcNow;

int comparison = dt1.CompareTo(dt2);
if (comparison < 0)
    Console.WriteLine("dt1 是早于 dt2 的时间");
else if (comparison > 0)
    Console.WriteLine("dt1 是晚于 dt2 的时间");
else
    Console.WriteLine("dt1 与 dt2 相等");
```
```cs
if (dt1 > dt2)
    Console.WriteLine("dt1 晚于 dt2");
```

#### 判断时间是否在某个区间内
使用`DateTime.Compare`或`>=`,`<=`
```cs
DateTime start = new DateTime(2025, 8, 1, 0, 0, 0);
DateTime end = new DateTime(2025, 8, 1, 23, 59, 59);
DateTime target = DateTime.Now;

if (target >= start && target <= end)
    Console.WriteLine("目标时间在区间内");
else
    Console.WriteLine("目标时间不在区间内");
```

判断某个`DateTime`是否为今天，可以仅比较年、月、日部分，忽略具体时间
```cs
bool isToday = taget.Date == DateTime.Now.Date;
```
`target.Date`会把时间部分归零，方便直接与今天进行比较

#### 判断时间是否在一小时内
```cs
bool inWithinLastHour(DateTime target) => target >= DateTime.Now.AddHours(-1) && target <= DateTime.Now;
```

#### `DateTime`对象的不可变性
`DateTime`是不可变类型，所有`Add`操作都会返回一个新的`DateTime`对象，而不会修改源对象
```cs
DateTime original = DateTime.Now;
DateTime added = original.AddDays(1); // new DateTime对象
Console.WriteLine(original);  // 还是原始时间
Console.WriteLine(added);     // 添加后的新时间
```
如果需要多次修改时间，建议使用`DateTimeOffset`或者`TimeSpan`来进行中间计算，避免不必要的重复创建

### 时间戳的处理与转换
在很多应用场景中，需要将时间转换为时间戳（Unix时间戳），或者将时间戳转换为`DateTime`对象

#### Unix时间戳
Unix 时间戳 是从 1970年1月1日 00:00:00 UTC 起经过的秒数（不计闰秒）。通常用于跨平台系统中，尤其是网络通信、数据库存储等。

- Unix 时间戳 采用 秒级精度，因此是一个 32位 或 64位 整数（根据平台的不同）
- 如果需要更高的精度（如毫秒或微秒），可以使用 `DateTimeOffset` 或 `Stopwatch` 来实现

#### 获取当前Unix时间戳
1. Unix时间戳（秒）
可以通过 `DateTimeOffset` 的 `ToUnixTimeSeconds()` 方法获取当前时间的 Unix 时间戳（秒）
```cs
DateTimeOffset now = DateTimeOffset.Now;
long unixTimestampSeconds = now.ToUnixTimeSeconds();
```

2. Unix时间戳（毫秒）
如果需要毫秒级精度，可以使用`ToUnixTimeMilliseconds()`方法
```cs
long unixTimestampMilliseconds = nnow.ToUnixTimeMilliseconds();
```
返回毫秒

#### 时间戳转`DateTime`
1. Unix（秒）转`DateTime`
```cs
long unixTimestamp = 1659388800; // 示例时间戳（2022-08-01 00：00：00 UTC）
DateTimeOffset dateTimeOffset = DateTimeOffset.FromUnixTimeSeconds(unixTimestamp);
DateTime dateTime = dateTimeOffset.DateTime;
```

2. Unix（毫秒）转`DateTime`
```cs
long unixTimestampMs = 1659388800000; // 毫秒级时间戳
DateTimeOffset dateTimeOffsetMs = DateTimeOffset.FromUnixTimeMilliseconds(unixTimestampMs);
DateTime dateTimeMs = dateTimeOffsetMs.DateTime;
Console.WriteLine(dateTimeMs);  // 输出：2022-08-01 00:00:00
```

#### `DateTimeOffset`与时间戳的结合
`DateTimeOffset`表示一个时间点，并带有时区偏移，适合跨时区和国际化应用

使用`DateTimeOffset`来转换时间戳时，会比直接使用`DateTime`更为安全和方便

```cs
DateTimeOffset nowOffset = DateTimeOffset.Now;
long unixTimestamp = nowOffset.ToUnixTimeSeconds();
```

### 定时与定时工具

### 时区管理
时区问题是跨平台开发中常见的挑战之一，C#提供了`TimeZoneInfo`类来帮助管理和转换时区信息

#### `TimeZoneInfo`类概述
`TimeZoneInfo`类提供了时区相关的功能，允许查询、转换和处理不同的时区信息

`TimeZoneInfo`的基本操作
- 获取本地时区：`TimeZoneInfo.Local`
- 获取UTC时区：`TimeZoneInfo.Utc`
- 获取所有时区信息：`TimeZoneInfo.GetSystemTimeZones()`

```cs
// 获取所有系统时区
foreach (var timeZone in TimeZoneInfo.GetSystemTimeZones())
{
    Console.WriteLine(timeZone.Id);  // 打印时区ID
}
```

#### `TimeZoneInfo`转换时间
通过`TimeZoneInfo`，可以将一个时间从一个时区转换到另一个时区，常见的转换方法包括
- 将本地时间转换为UTC时间
- 将UTC时间转换为本地时间
- 不同时区之间的相互转换

```cs
// 本地转UTC
DateTime localTime = DateTime.Now;
DateTime utcTime = TimeZoneInfo.ConvertTimeToUtc(localTime);
```
```cs
// UtC转本地
DateTime utcTime = DateTime.UtcNow;
DateTime localTime = TimeZoneInfo.ConvertTimeFromUtc(utcTime, TimeZoneInfo.Local);
```
```cs
// 不同时区转换
DateTime utcTime = DateTime.UtcNow;
TimeZoneInfo timeZoneNewYourk = TImeZoneInfo.FindSystemTimeZondById("Eastern Standard Time"); // 获取纽约时区
DateTime newYorkTime = TImeZoneInfo.ConvertTimeFromUtc(utcTime, timeZoneNewYork);
```

#### 使用`TimeZoneInfo`获取时区的详细信息
`TimeZoneInfo`提供了一些方法，可以获取时区的详细信息，例如：标准时间偏移、夏令时的开始和结束时间等

```cs
// 获取时区的偏移量
TimeZoneInfo tzInfo = TimeZoneInfo.FindSystemTimeZoneById("Pacific Standard Time");
TimeSpan offset = tzInfo.GetUtcOffset(DateTime.Now); // 获取当前时区的偏移量
```

```cs
// 获取时区的夏令时信息
TimeZoneInfo tzInfo = TimeZoneInfo.FindSystemTimeZoneById("Pacific Standard Time");
if (tzInfo.SupportsDaylightSavingTime)
{
    Console.WriteLine($"夏令时开始：{tzInfo.GetAdjustmentRules()[0].DateStart}");
    Console.WriteLine($"夏令时结束： {tzInfo.GetAdjustmentRules()[0].DateEnd}");
}
```

#### 使用`DateTimeOffset`管理时区
`DateTimeOffset`是一个结合了时间和时区偏移的类型，特别适合在国际化系统中使用，能明确表示时间的“绝对值”
```cs
// 获取`DateTimeOffset和时区信息
DateTimeOffset dto = DateTimeOffset.Now;
```

```cs
// 使用DateTimeOffset在不同时间区之间转换
DateTimeOffset dtUtc = DateTimeOffset.UtcNow; // 当前UTC时间
DateTimeOffset dtLoacl = dtUtcToOffset(TimeZoneInfo.Local.GetUtcOffset(DateTime.UtcNow)); // 转为本地时间
```

#### 时间与夏令时（DST）处理
夏令时（DST）是某些时区的特殊情况，在夏令时期间，时间会比标准时间提前一个小时
```cs
// 判断句某个日期是否在夏令时内
TimeZoneInfo tzInfo = TimeZoneInfo.FindSystemTimeZoneById("Pacific Standard Time");
DateTime testDate = new DateTime(2025, 7, 1); // 夏季
bool isDST = tzInfo.IsDaylightSavingTime(testDate);
```

```cs
// 获取夏令时调整规则
TimeZoneInfo tzInfo = TimeZoneInfo.FindSystemTimeZoneById("Pacific Standard Time");
foreach (var rule in tzInfo.GetAdjustmentRules())
{
    Console.WriteLine($"{rule.DateStart}, {rule.DateEnd}");
}
```

### 定时与计时工具

#### 使用`System.Timers.Timer`定时器
`System.Timers.Timer`是C#中用于定时任务执行的类，它可以在指定的时间间隔后执行某个事件或回调函数，适用于需要定期触发任务的场景

创建并使用`System.Timers.Timer`
```cs
using System;
using System.Timers;

class Program
{
    static void Main()
    {
        Timer timer = new Timer(1000); // 设置间隔为1s
        timer.Elapsed += OnTimedEvent; // 事件触发时调用
        timer.AutoReset = true; // 是否重复触发
        timer.Enable = true; // 启动定时器

        Console.WriteLine("Press Enter to exit...");
        Console.ReadLine(); // 保持程序运行    
    }
    private static void OnTimedEvent(Object source, ElapsedEventArgs e)
    {
        Console.WriteLine($"The event was triggered at {e.SignalTime}");
    }
}
```
关键属性和方法
- Interval：设置事件间隔
- Elapsed：事件，定时器到达指定和时间时触发
- AudoReset：是否在每个间隔后重新启动定时器
- Enabled：启用或禁用定时器

#### 使用`System.Threading.Timer`
`System.Threading.Timer`也是一个定时器，但它运行在线程池线程上，适合在多线程环境下使用

它的使用方式略有不同，适用于短期内要触发一次或周期性任务的场景

创建并使用`System.Threading.Timer`
```cs
using System;
using System.Threading;

class Program
{
    staitc void Main()
    {
        TimerCallback callback = new TimerCallback(OnTimedEvent);
        Timer timer = new Timer(callback, null, 0, 1000); // 初始延迟为0ms，每1秒触发一次

        Console.WriteLine("Press Enter to exit...");
        Console.ReadLine();
    }

    private static void OnTimedEvent(Object state)
    {
        Console.WriteLine($"The event was triggered at {DateTime.Now}");
    }
}
```
- callback：回调方法，在定时器触发时执行
- dueTime：首次触发的延迟事件
- period：定时器触发的间隔时间，可以设置为`Timeout.Infinite`使其只触发一次

#### `Stopwatch`性能计时
`Stopwatch`是C#提供的高精度计时工具，通常用于测量代码块的执行时间

它不受系统时钟的影响，并且提供微秒级的精度

它比`DateTime`更精确，并且可以支持微秒级别的计时

```cs
Stopwatch stopwatch = new Stopwatch();
stopwatch.Start();
// do something
stopwatch.Stop();
Console.WriteLine(stopwatch.ElapsedMilliseconds); // 以毫秒为单位的高精度时间戳
Console.WriteLine(stopwatch.Elapsed); // 输出更详细的时间间隔
```

#### 使用`System.Threading.Thread.Sleep`延时
`Thread.Sleep`方法可以让当前线程暂停一段时间，适合实现延时操作
```cs
using System;
using System.Threading;

class Program
{
    static void Main()
    {
        for (int i = 0 i < 5; ++i)
        {
            Console.WriteLine($"Iteration {i + 1}");
            Thread.Sleep(1000);
        }
    }
}
```
`Thread.Sleep`会阻塞当前线程，因此它不适合在需要高并发的场景中使用，对于更复杂的异步操作，可以使用`async`和`await`

---
title: "Data Driven Design"
layout: single
date: 2025-06-01
categories: [笔记]
tags: [Unity, Architecture]
author: "ljf12825"
permalink: /posts/2025-07-15-Data-Driven-Design/
---
Data-Driven Design（数据驱动设计）在Unity和游戏开发中是一种将逻辑与数据分离的编程范式，它强调用数据来控制行为和流程，而不是把所有逻辑写死在代码中

尤其在Unity这样一个组件化的引擎中，数据驱动设计可以提高灵活性、可扩展性、可复用性、可配置性，广泛用于角色配置、关卡编辑、AI行为、技能系统、特效系统、任务系统等

## 核心思想
传统方式
```cs
void Attack()
{
    if (type == "Fire") DoFireAttack();
    else if (type == "Ice") DoIceAttack();
}
```
上面是硬编码方式，未来加新类型必须改代码

数据驱动方式
```json
{
    "attackType": "Fire",
    "damage": 10,
    "cooldown": 2.5
}
```
在代码中只需要
```cs
AttackConfig config = LoadAttackConfig("Fire");
Execute(config);
```

## 在Unity中的实践方式

| 层级       | 方法                                          | 描述                |
| -------- | ------------------------------------------- | ----------------- |
| 数据定义  | ScriptableObject / JSON / XML / Excel / CSV | 描述数据结构和配置项        |
| 数据驱动器 | MonoBehaviour / System / Manager            | 根据配置文件动态生成游戏逻辑或行为 |
| 运行时绑定 | Addressable / Resources.Load / AssetBundle  | 运行时加载配置和资源        |
| 编辑器扩展 | CustomEditor / ScriptedImporter             | 使数据更好地可视化配置       |

## 实例
1. ScriptableObject驱动角色技能系统
```cs
[CreateAssetMenu(fileName = "SkillData", menuName = "GameData/Skill")]
public class SkillData : ScriptableObject
{
    public string skillName;
    public float damage;
    public float cooldonw;
    public GameObject effectPrefab;
}
```
技能执行器
```cs
public class SkillExecutor : MonoBehaviour
{
    public SkillData skill;

    void Cast()
    {
        Debug.Log($"Casting {skill.skillName}")
        Instantiate(skill.effectPrefab, transform.position, Quaternion.identity);
    }
}
```

2. JSON配置敌人AI行为
```json
{
    "enemyType": "Goblin",
    "health": 100,
    "aggressive": 3,
    "attackRange": 3,
    "patrolPath": ["(0,0)", "(5,0)", "(5, 5)"]
}
```
通过反序列化加载为结构体
```cs
public class EnemyData
{
    public string enemyType;
    public int health;
    public bool aggressive;
    public float attackRange;
    public Vector3[] patrolPath;
}
```
运行时构建敌人
```cs
public class EnemySpawner : MonoBehaviour
{
    void Spawn(string jsonPath)
    {
        string json = File.ReadAllText(jsonPath);
        EnemyData data = JsonUtility.FromJson<EnemyData>(json);
        GameObject enemy = Instantiate(enemyPrefab);
        enemy.GetComponent<EnemyController>().Init(data);
    }
}
```

## 与Addressable / AssetBundle搭配
如果使用Addressable / AssetBundle管理资源，可以通过配置文件映射资源路径，使得整个资源系统也数据驱动
```json
{
    "prefabName": "EnemyGoblin",
    "addressableKey": "Enemies/Goblin"
}
```
运行时动态加载
```cs
Addressables.LoadAssetAsync<GameObject>(config.addressableKey);
```

## Unity中数据驱动设计的典型应用场景
- 角色属性（等级、血量、攻击力）
- 物品数据（ID、名称、描述、稀有度、价格）
- 技能表（技能ID、冷却时间、动画、特效）
- 任务配置（触发条件、奖励内容）
- UI配置（按钮样式、位置、颜色）
- 场景数据（NPC分布、出生点等）

优势
- 高度灵活：不改代码即可更改游戏行为
- 可复用性高：一套逻辑可用多个配置
- 解耦：数据和逻辑分离，程序和非程序互不干扰
- 支持热更：JSON + Addressable更方便做热更系统
- 便于测试和迭代：只调数据，不改逻辑

注意
- 性能开销：数据结构过多需管理内存，加载及时性要考虑
- 数据管理混乱：强化编辑器支持，规范命名、文件结构
- 可测试性下降：建议加断言、数据验证工具
- 可读性问题：配置文件冗长时需工具辅助查看

### 常见的配置表格式

| 格式                   | 优点            | 缺点                 |
| -------------------- | ------------- | ------------------ |
| **CSV**              | 简单、轻量、跨平台     | 不支持嵌套结构，数据易出错      |
| **Excel (XLS/XLSX)** | 支持复杂结构，便于策划编辑 | Unity运行时读取需处理依赖或转换 |
| **JSON**             | 可嵌套、结构清晰，跨语言  | 文件体积相对大，读取开销稍大     |
| **XML**              | 结构化强，支持嵌套     | 比JSON繁琐，不够灵活       |
| **ScriptableObject** | Unity原生支持，性能高 | 策划不易编辑，编辑器依赖强      |
| **二进制（自定义格式）**       | 高效、节省空间       | 可读性差，调试困难          |

#### CSV(Comma-Separated Values)
CSV是一种纯文本格式，用逗号`,`分隔数据，用于表示表格结构的数据
- 每一行是一条记录（record）
- 每一列是一个字段（field）
例如，一个简单的角色配置CSV文件：
```csv
id,name,hp,attack,defense
1001,Warrior,500,70,30
1002,Archer,300,100,10
```

**规则**
```csv
列1,列2,列3
值1,值2,值3
值4,值5,值6
```

**要素组成**

| 元素      | 说明                                      |
| ------- | --------------------------------------- |
| **分隔符** | 一般是英文逗号 `,`，也可以是 `;`、`\t`（Tab）等，称为“分隔符” |
| **换行符** | 每一行代表一条记录，通常使用 `\n` 或 `\r\n` 结尾         |
| **字段**  | 一行中的每个值称为字段，可以是数字、文本等                   |
| **表头**  | 第一行通常是字段名（列名）                           |
| **引号**  | 如果字段中包含逗号、引号或换行，应使用双引号 `"` 包住           |
| **转义符** | 字段中出现 `"`，需要写成 `""`（两个双引号表示一个双引号）       |

- 常见扩展名是`.csv`
- 实质是UTF-8编码或ANSI编码的纯文本文件

**建议**
- 编码：推荐使用UTF-8无BOM编码，支持中文
- 分隔符：使用英文逗号`,`，如果含中文逗号会出错
- 字段值：建议全字段加`"`引号，避免格式问题
- 表头：必须有，且列名不能重复
- 空行：自动跳过或处理，否则程序容易报错
- 换行：字段中如有换行，一定要用`"`包裹


**CSV的特点**

| 优点       | 说明                            |
| -------- | ----------------------------- |
| 简单直观   | 可以用 Excel、Google Sheets 打开、编辑 |
| 小文件    | 比 JSON、XML 体积更小，加载快           |
| 易于版本控制 | 文本文件可直接使用 Git 管理              |
| 策划友好   | 策划可以直接编辑，不依赖 Unity 编辑器        |

| 缺点        | 说明                           |
| --------- | ---------------------------- |
| 不支持嵌套结构 | 不能直接表示数组、对象等复杂结构             |
| 容易出错    | 格式不规范容易出错（多写一个逗号、漏引号）        |
| 类型信息丢失  | 所有字段都是字符串，需自行转换成 int、float 等 |
| 转义麻烦    | 逗号、换行、双引号等内容要转义              |

##### Unity中如何读取CSV
示例CSV文件（Resource/Configs/Character.csv）
```csv
id,name,hp,attack,defense
1001,Warrior,500,70,30
1002,Archer,300,100,10
```
对应的C#类
```cs
public class ChaaracterConfig
{
    public int id;
    public string name;
    public int hp;
    public int attack;
    public int defense;
}
```
CSV读取工具（简化版）
```cs
using System.Collections.Generic;
using UnityEngine;

public class CSVReader
{
    public static List<CharacterConfig> ReadCharacterConfigs(stirng path)
    {
        List<CharacterConfig> configs = new List<CharacterConfig>();
        TextAsset data = Resources.Load<TextAsset>(path);
        string[] lines = data.text.Split('\n');

        for (int i = 1; i < lines.Length; i++)
        {
            if (string.IsNullOrWhiteSpace(lines[i])) continue;
            string[] values = lines[i].Trim().Split(',');
            CharacterConfig config = new CharacterConfig
            {
                id = int.Parse(value[0]),
                name = values[1];
                hp = int.Parse(values[2]),
                attack = int.Parse(values[3]),
                defense = int.Parse(values[4])
            };
            configs.Add(config);
        }
        return configs;
    }
}
```
使用方式
```cs
List<CharacterConfig> characters = CSVReader.ReadCharacterConfigs("Configs/Character");
```

##### 建议
- 类型转换：自定义一个字段解析函数，更加健壮
- 编码问题：保存为UTF-8防止中文乱码
- 换行和引号：注意转义规则，推荐用`\`包裹字段
- 大量CSV：用工具自动生成C#类和解析器（提高效率，减少错误）

#### Excel(XLS/XLSX)
`.xls` 全称Excel Binary File Format，Excel 97-2003的旧格式，基于二进制，不支持新特性
`.xlsx` 全称Excel Open XML Format，Excel 2007之后的默认格式，基于XML，体积更小，支持更多功能

推荐使用`.xlsx`因为：
- 支持更大的数据表（行数超过65536）
- 更快、更稳定
- 更易解析（可通过第三方库读取）

##### Excel格式的特点（用于配置表）

| 优点                                            | 描述                  |
| --------------------------------------------- | ------------------- |
|  **结构清晰**                                    | 表格直观，易于管理字段         |
|  **可读性好**                                    | 策划可以直接编辑，无需代码知识     |
|  **支持复杂数据结构**                                | 多 sheet、合并单元格、数据校验等 |
|  **富格式信息**                                   | 可做备注、着色、隐藏行列，提升协作效率 |
|  **可通过工具自动导出 CSV / JSON / ScriptableObject** |                     |

| 缺点                                                | 描述                            |
| ------------------------------------------------- | ----------------------------- |
| Unity 运行时**无法直接读取** `.xls` 或 `.xlsx`，需要依赖插件或转格式 |                               |
| 相对复杂                                            | 文件体积比 CSV/JSON 大，处理也更复杂       |
| 跨平台读取麻烦                                         | Mono/IL2CPP 不原生支持解析 Office 格式 |

##### Unity中使用Excel的常见方式
推荐方式：Excel -> JSON/CSV -> Unity\
1. 策划编辑`.xlsx`
2. 程序通过工具自动导出为`.json`或`.csv`
3. Unity运行时解析`.json`或`.csv` -> 转为C#对象

##### 配套工具
1. NPOI
  - 支持在Unity中直接读取`.xls`，`.xlsx`
  - 跨平台、免费、开源

2. ExcelDataReader
  - 专注于制度Excel文件，轻量级
  - 推荐用于工具链而非运行时

3. 自研导出工具链（Editor脚本）
  - Unity编辑器下使用Excel插件读取数据
  - 自动生成JSON + C#类结构
  - 可一键批量导入全部表格

##### 弱类型
在用Excel配置表做游戏开发时，每一列的“数据类型”并不是自动明确的，因为Excel本质是弱类型的（所有单元格默认都是文本或数字），不像编程语言中那样有严格的类型系统\
那Unity如何判断配置表中的每一列的类型是什么呢\
**常见方式**
1. 程序根据第一行或第二行手动指定类型

示例Excel表

| name   | hp  | isBoss | tags       |
| ------ | --- | ------ | ---------- |
| string | int | bool   | string[]  |
| Goblin | 200 | false  | weak|fast |

第一行为字段名，第二行为字段类型，第三行开始才是数据

2. 程序根据字段的值自动推断类型
缺点：不可靠
  - 无法判断精度（int和float容易搞混）
  - 值都是字符串时不饿能推断
  - 解析错误不易发现

3. 通过外部配置文件指定类型
可以使用一个`.json`或`.xml`文件作为类型描述文件
```json
{
    "MonsterConfig":
    {
        "id": "int",
        "name": "string",
        "hp": "int",
        "isBoss": "bool",
        "tags": "string[]"
    }
}
```

**常见字段类型说明**

| 类型        | Excel中的写法            | Unity对应类型      |
| --------- | -------------------- | -------------- |
| int       | 100                  | `int`          |
| float     | 12.5                 | `float`        |
| bool      | true / false / 1 / 0 | `bool`         |
| string    | hello                | `string`       |
| int[]    | 1|2|3              | `List<int>`    |
| string[] | fire|ice            | `List<string>` |
| enum      | Warrior              | 自定义 `enum`     |
| object    | {"x":1,"y":2}        | 需要自定义解析        |

#### JSON(JavaScript Object Notation)
在Unity游戏开发中，JSON是非常常见的配置表格式，用于轻量级的数据交换和加载配置数据

JSON是一种结构化的数据格式，它使用键值对（K-V）和数组(Array)来表示数据，语法简洁，易于阅读\
示例：
```json
{
    "id": 101,
    "name": "Goblin",
    "hp": 100,
    "skills": ["slash", "bite"],
    "isBoss": false
}
```

##### JSON数据类型

| 类型   | 示例                        |
| ---- | ------------------------- |
| 数字   | `123`, `-5`, `3.14`       |
| 字符串  | `"hello"`, `"Goblin"`     |
| 布尔值  | `true`, `false`           |
| 数组   | `[1, 2, 3]`, `["a", "b"]` |
| 对象   | `{ "x": 1, "y": 2 }`      |
| null | `null`                    |

##### Unity中如何使用JSON
Unity中通过`JsonUtility`或`Newtonsoft.Json`来处理JSON

1. `JsonUtility`（Unity自带，性能好，功能简单）
定义类
```cs
[System.Serializable]
public class Monster
{
    public int id;
    public string name;
    public int hp;
    public string[] skills;
}
```
解析JSON->对象
```cs
string json = {\"id\":101,\"name\":\"Goblin\",\"hp\":100,\"skills\":[\"slash\",\"bite\"]}";
Monster monster = JsonUtility.FromJson<Monster>(json);
Debug.Log(monster.name); // Goblin
```
对象->JSON
```cs
string newJson = JsonUtility.ToJson(monster, true); // true表示格式化输出
```

2. `Newtonsoft.Json`（功能强大，支持Dictionary、List、动态字段等）
需要安装Json.NET for Unity

```cs
using Newtonsoft.Json;
```
解析JSON->对象
```cs
Monster monster = JsonConvert.DeserializeObject<Monster>(json);
```
对象->JSON
```cs
string json = JsonConvert.SerializeObject(monster, Formatting.Indented);
```

#### XML
在Unity游戏开发中，XML也可以作为配置表格式，虽然现在主流是使用JSON或ScriptableObject，但XML仍然常用于：
- 早期项目的兼容配置
- 与第三方系统（如服务器、编辑器）互通
- 高度结构化的数据需求场景

| 优点                         | 缺点        |
| -------------------------- | --------- |
| 可读性强、结构清晰                  | 文件体积较大    |
| 支持复杂嵌套                     | 解析性能差     |
| C# 自带完整支持（`XmlSerializer`） | 写法冗长，维护麻烦 |
| 与很多旧系统兼容                   | 不适合热更数据场景 |


##### 示例
假设一个怪物配置文件`monsters.xml`，内容如下
```xml
<Monsters>
 <Monster>
  <ID>101</ID>
  <Name>Goblin</Name>
  <HP>100</HP>
  <Attack>30</Attack>
 </Monster>
 <Monster>
  <ID>102</ID>
  <Name>Orc</Name>
  <HP>200</HP>
  <Attack>50</Attack>
 </Monster>
</Monsters>
```

创建C#数据类并添加`[XmlElement]`标签
```cs
using System;
using System.Xml.Serialization;
using System.Collections.Generic;

[Serializable]
public class Monster
{
    public int ID;
    public string Name;
    public int HP;
    public int Attack;
}

[XmlRoot("Monsters)]
public class MonsterList
{
    [XmlElement("Monster")]
    public List<Monster> Monsters;
}
```

Unity中读取XML文件
1. 将`monster.xml`放到`Assets/Resources/Data.monsters.xml`
2. 使用`TextAsset`加载，再用`XmlSerializer`解析
```cs
using UnityEngine;
using System.Xml.Serialization;
using System.IO;

public class MonsterXmlLoader : MonoBehaviour
{
    void Start()
    {
        // 1. 读取 XML 文件
        TextAsset xmlText = Resources.Load<TextAsset>("Data/monsters");

        // 2. XML 序列化器
        XmlSerializer serializer = new XmlSerializer(typeof(MonsterList));

        // 3. 反序列化为 C# 对象
        using (StringReader reader = new StringReader(xmlText.text))
        {
            MonsterList monsterList = serializer.Deserialize(reader) as MonsterList;

            // 4. 使用数据
            foreach (var m in monsterList.Monsters)
            {
                Debug.Log($"ID: {m.ID}, Name: {m.Name}, HP: {m.HP}, ATK: {m.Attack}");
            }
        }
    }
}
```

#### ScriptableObject
[ScriptableObject]({{site.baseurl}}/posts/2025-07-11-ScriptableObject/)

#### 二进制
在Unity游戏开发中，二进制格式配置表是一种高效的配置数据存储加载方式，常用于：
- 发布版本中（加密、防反编译、防篡改）
- 替代文本格式（JSON/XML/CSV）以提升性能和安全性
- 客户端资源本地缓存或热更方案中

##### 二进制配置
将原本的结构化数据（如JSON/XML/CSV）序列化为字节流（`byte[]`），再通过代码反序列化回来

##### 常用二进制序列化方法

| 技术                  | 说明              | 特点             |
| ------------------- | --------------- | -------------- |
| **BinaryFormatter** | Unity 自带（不推荐使用） | 不安全，已过时        |
| **ProtoBuf**        | Google 提出的高效协议  | 快速、跨平台，适合大型项目  |
| **MessagePack**     | 新一代高性能格式        | 小巧、快、Unity 支持好 |
| **自定义格式**           | 自己写 byte[] 结构  | 极致优化，维护成本高     |

##### Unity中简单的二进制序列化方法（BinaryFormatter示例）
> 虽然`BinaryFormatter`被标记为不安全，但对于离线开发或工具链仍可使用

1. 定义数据类并标记`[Serializable]`
```cs
[System.Serializable]
public class Monster
{
    public int ID;
    public string Name;
    public int HP;
}
```

2. 将数据写入二进制文件（在编辑器工具中使用）
```cs
using System.IO;
using System.Runtime.Serialization.Formatter.Binary;
using UnityEngine;

public class SaveToBinary
{
    public static void Save(Monster data, string path)
    {
        BinaryFormatter formatter = new BinaryFormatter();
        FileStream stream = new FileStream(path, FileMode.Create);
        formatter.Serialize(stream, data);
        stream.close();
    }
}
```

3. 在Unity中加载`.byte`文件
将二进制文件保存为`Assets/Resources/Data/monster.bytes`
```cs
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;
using UnityEngine;

public class LoadBinary : MonoBehaviour
{
    void Start()
    {
        TextAsset binaryFile = Resources.Load<TextAsset>("Data/monster");
        MemoryStream stream = new MemroyStream(binaryFile.bytes);

        BinaryFormatter formatter = new BinaryFormatter();
        Monster m = (Monster)formatter.Deserialize(stream);

        Debug.Log($"{m.ID} - {m.Name} - {m.HP}");
    }
}
```

##### 二进制格式 vs 文本格式

| 对比项      | 文本（CSV/JSON/XML） | 二进制（.bytes） |
| -------- | ---------------- | ----------- |
| **可读性**  | 人类可读           | 不可读       |
| **加载速度** | 慢              | 快         |
| **体积大小** | 较大             | 小（压缩）     |
| **安全性**  | 易被篡改           | 可加密、难修改   |
| **调试方便** | 可直接打开          | 不可直接看内容   |
| **跨平台**  | 通用标准格式         | 需统一解码方案  |

**使用二进制的场景**\
- 发布版本的配置数据（防篡改）
- 加载速度要求高的场景（如移动端）
- 热更框架集成的格式就是二进制（如Addressables + bytes）



### 配置表的加载方式
1. 编辑器预处理加载
  - 将Excel/CSV转为Unity支持的ScriptableObject或JSON
  - 构建时打包到`Resources`/`StreamingAssets`/`Addressables`

2. 运行时加载
  - 从`StreamingAssets`或远程服务器读取JSON/二进制
  - 支持热更新和多平台兼容

3. 资源管理系统配合适用
  - 如Unity的`Addressable`、`Resources.Load()`、自定义的资源加载框架等

### 数据结构与访问
**示例**\
角色属性配置
```json
[
    {
        "id": 1001,
        "name": "Warrior",
        "hp": 500,
        "attack": 70,
        "defense": 30
    },

    {
        "id": 1002,
        "name": "Archer",
        "hp": 300,
        "attack": 100,
        "defense": 10
    }
]
```
对应的C#结构体
```cs
[System.Serializable]
public class CharacterConfig
{
    public int id;
    public string name;
    public int hp;
    public int attack;
    public int defense;
}
```
加载方式
```cs
CharacterConfig[] configs = JsonUtility.FromJson<Wrapper<CharacterConfig>>(jsonText).list;
```
辅助封装类
```cs
[System.Serializable]
public class Wrapper<T>
{
    public T[] list;
}
```

## 进阶做法
1. 配置表导入工具链（Excel转JSON/ScriptableObject）
2. 自动生成C#结构体和索引器
3. 内存优化（如按需加载、只保留当前关卡配置）
4. 热更系统集成（版本控制 + CRC校验）
5. 编辑器工具扩展（策划可视化编辑器）


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

| 应用模块   | 数据驱动方式                                 |
| ------ | -------------------------------------- |
| UI系统 | JSON + UI模板动态构建                        |
| 技能系统 | ScriptableObject 配技能参数                 |
| 特效系统 | 配置触发条件、位置、持续时间等                        |
| AI行为 | 使用行为树 / 状态机 + 配置文件                     |
| 任务系统 | 用表格配置任务目标、奖励、触发条件                      |
| 配置表  | Excel + 导出工具生成 ScriptableObject 或 JSON |
| 游戏关卡 | Tilemap + 配置文件生成关卡结构                   |

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

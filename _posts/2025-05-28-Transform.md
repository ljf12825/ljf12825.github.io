---
title: "Transform"
layout: single
date: 2025-05-28
categories: [�ʼ�]
tags: [Unity]
author: "ljf12825"
---
Transform��Unity�п�������λ�á���ת�����ź͸��Ӳ㼶��ϵ�ĺ������

## һ��ʲô��Transform
`Transfrom`��ÿ��`GameObject`���Դ��ĺ����������Ҫ����  
- λ�ã�Position��
- ��ת��Rotation��
- ���ţ�Scale��
- ���ӹ�ϵ��Hierarchy��

�������Ϊÿ����������ά�����еġ�������;ֲ��ռ���Ϣ����

## ����Transform����Ҫ���Ժ�����
**1.`position`��`localPosition`
| ������ | ���� | ʾ����; |
|-|-|-|
| `position` | �������꣨����λ�ã� | ���������������е�λ�� |
| `localPosition` | �������꣨����ڸ������λ�ã� | ����������ڸ������ƫ�� |

**2.`rotation`��`localRotation`
| ������             | ����       | ����         |
| --------------- | -------- | ---------- |
| `rotation`      | ������ת     | Quaternion |
| `localRotation` | ��Ը��������ת | Quaternion |


```csharp
transform.rotation = Quaternion.Euler(0, 90, 0); //������ת
transform.localRotation = Quaternion.idetity; //������ת����
```

**3.localScale**
- ��ʾ�������������
- ע�⣺���Ų����Զ����ݵ�`position`������Ӱ����Ⱦ�ߴ����ײ��

```csharp
transform.localScale = new Vector3(2, 2, 2); //�Ŵ�����
```

## �������Ӳ㼶�ṹ*

**���ø�����**
```csharp
child.transform.parent = parent.transform;
//��
child.transform.SetParent(parent.transform);
```

**��������**
```csharp
Transform parent = transform.parent; //��ȡ������
Transform child = transform.GetChild(0); //��ȡ��һ���Ӷ���
int childCount = transform.childCount; //��ȡ�Ӷ�������
```
**ʹ�ñ��������ԭ��**
�������Ϊ�Ӷ���ʱ��ʹ��`localPosition`�����׿���������ڸ������ƫ�ƣ������ɫͷ���������ҵ��

**Ϊʲô`Transform`���Ծ������ӽṹ��**
1.Unity�и��ӽṹ�ı���
��Unity�У�һ��GameObject�ܳ�Ϊ��һ��GameObject���Ӷ��󣬱�������ͨ��Transform�����Ƕ�׽ṹ��ʵ�ֵ�
2.Ϊʲô`Transform`�������ӹ�ϵ
��ΪGameObject��λ�á���ת�����š��㼶��ϵ������`Transform`���Ƶģ���Unity��������Hierarchy��ʵ���Ͼ���һ��`Transform`��

**�ٸ�����**
```csharp
GameObject parent = new GameObject("Parent");
GameObject child = new GameObject("Child");

child.transform.parent = parent.transform;
```
��δ��벻���޸ĸ�GameObject�ı��壬��ֻ�ǰ�`Child`��`Transform`�ҵ���`Parent`��`Transform`��
- GameObject�����洢�㼶�ṹ����ֻ��һ������
- Transform����ڲ��У�
  - `parent`������Transform
  - `childCount`���Ӽ�����
  - `.GetChild(i)`����ȡ��i����Transform
- �������κβ㼶�ṹ����ʵ���Ƕ��Transform����������õĽ��

## �ġ�Transform����Ҫ����
**�ƶ�������������ϵͳ��**
```csharp
transform.Translate(Vector3.forward * Time.deltaTIme);
```
**��ת**
```csharp
tansform.Rotate(Vector3.up, 45);
```
**����**
```csharp
Transform arm = transform.Find("Body/LeftArm");
```
**��ĳ��ת��LookAt��**
```csharp
transform.LookAt(target.transform);
```

## �塢ʹ�ü�����ע������
**����ת��**
- ��������ת��������
```csharp
Vector3 local = transform.InverseTransformPoint(worldPos);
```
- ��������ת��������
```csharp
Vector3 world = transform.TransformPoint(localPos);
```

**Transform��Property**
| ����                 | ����           | ˵��                                        |
| ------------------ | ------------ | ----------------------------------------- |
| `position`         | `Vector3`    | ��Ϸ����������ռ��е�λ��                             |
| `localPosition`    | `Vector3`    | ����ڸ�����ı���λ��                               |
| `rotation`         | `Quaternion` | ����ռ����ת����Ԫ����                              |
| `localRotation`    | `Quaternion` | ����ڸ��������ת                                 |
| `eulerAngles`      | `Vector3`    | ����ռ��ŷ���ǣ��Ƕ��ƣ�                             |
| `localEulerAngles` | `Vector3`    | ���ؿռ��ŷ����                                  |
| `right`            | `Vector3`    | ������ҷ��򣨱��� X �ᣩ                            |
| `up`               | `Vector3`    | ������Ϸ��򣨱��� Y �ᣩ                            |
| `forward`          | `Vector3`    | �����ǰ���򣨱��� Z �ᣩ                            |
| `localScale`       | `Vector3`    | ���ؿռ�����ű���                                 |
| `parent`           | `Transform`  | ������� Transform                            |
| `childCount`       | `int`        | �Ӷ�������                                     |
| `lossyScale`       | `Vector3`    | ����ռ��е�ʵ�����ţ�����������Ӱ�죩                       |
| `hasChanged`       | `bool`       | ��ʾ Transform �Ƿ����ϴμ������˱仯�������ֶ�����Ϊ false�� |
| `root`             | `Transform`  | ��ǰ Transform �㼶�е����ϲ�ԣ�����                 |

**Transform��Methods
| ����                                                           | ˵��                |
| ------------------------------------------------------------ | ----------------- |
| `Translate(Vector3 translation, Space space = Space.Self)`   | �ظ��������ƶ�����Ĭ�ϱ������꣩ |
| `Rotate(Vector3 eulerAngles, Space space = Space.Self)`      | �ظ���������ת����         |
| `LookAt(Transform target)` �� `LookAt(Vector3 worldPosition)` | ʹ��������Ŀ��           |
| `RotateAround(Vector3 point, Vector3 axis, float angle)`     | ��ĳ���������ת          |
| `TransformDirection(Vector3 localDirection)`                 | �����ط���ת��Ϊ���緽��      |
| `InverseTransformDirection(Vector3 worldDirection)`          | �����緽��ת��Ϊ���ط���      |
| `TransformPoint(Vector3 localPosition)`                      | ��������ת��������         |
| `InverseTransformPoint(Vector3 worldPosition)`               | ��������ת��������         |
| `DetachChildren()`                                           | ��������Ӷ���ĸ��ӹ�ϵ      |

**�㼶������ṹ**
| ����                                                     | ˵��                                 |
| ------------------------------------------------------ | ---------------------------------- |
| `SetParent(Transform parent)`                          | ���ø�����                              |
| `SetParent(Transform parent, bool worldPositionStays)` | ���ø�����ͬʱ�����Ƿ񱣳��������겻��               |
| `GetChild(int index)`                                  | ��ȡָ���������� Transform                 |
| `Find(string name)`                                    | ��������Ϊ name �������壨�ݹ飩                |
| `IsChildOf(Transform parent)`                          | �жϵ�ǰ Transform �Ƿ���ĳ�� Transform ���Ӽ� |
| `SetAsFirstSibling()`                                  | ����ǰ��������Ϊ������ĵ�һ���Ӷ���                 |
| `SetAsLastSibling()`                                   | ����Ϊ���һ���Ӷ���                         |
| `SetSiblingIndex(int index)`                           | �����ڸ� Transform �µ��Ӷ�������             |
| `GetSiblingIndex()`                                    | ��ȡ�ڸ� Transform �µ�����λ��              |

**���[Unity�ٷ��ĵ�(Transform)](https://docs.unity3d.com/ScriptReference/Transform.html)**

## ��������÷�ʾ��
**1.�ƶ���������������**
```csharp
child.SetParent(parent, false);
```
**2.����ĳһ��**
```csharp
transform.LookAt(new Vector3(0, 0, 0));
```
**3.��ת�빫ת**
```csharp
//��ת
transform.RotateAround(center.position, Vector3.up, 20 * Time.deltaTIme);
//��ת
transform.Rotate(Vector3.up * 45 * Time.deltaTime);
```
**4.����ָ�������岢��������**
```csharp
Transform gun = transform.Find("Body/Hand/Gun");
gun.localScale = Vector3.one * 2f;
```

## ���׻����ļ�������˵��
| ����/����                        | ע���                                         |
| ---------------------------- | ------------------------------------------- |
| `rotation.eulerAngles = ...` | ʵ����Ч��Ӧ���� `rotation = Quaternion.Euler(...)` |
| `position += ...`            | �����������þ�������λ��                                |
| `Translate(...)`             | Ĭ�����������������ϵ�ƶ�                               |
| `LookAt()`                   | ���޸� rotation����ת Z ��������ָ��Ŀ��                  |
| `TransformDirection()`       | �Ƿ���ת��������λ��ת�������緽������ `(0, 0, 1)` ��ʾǰ��        |


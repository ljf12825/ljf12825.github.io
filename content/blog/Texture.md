---
title: "Texture"
date: 2025-06-01
categories: [笔记]
tags: [Unity, Unity Component, Render, Graphics]
author: "ljf12825"
summary: Texture and Texture in Unity
---
`Texture`是图形学开发中的一个核心概念，用于在3D模型、UI、地形等物体表面显示图像或图案  
它不仅包含颜色信息，还可能包含法线、位移、金属度、粗糙度等各种数据，用于实现丰富的视觉效果

## 基本概念
- Texture本质上是一张图片，用于“贴”在模型表面，使其看起来更真实
- 在GPU层面，是一个二维数组，存储颜色或其他类型的数据

## Texture类型

| 类型                    | 描述          | 常见用途                |
| --------------------- | ----------- | ------------------- |
| **Texture2D**         | 最常见的二维纹理    | UI、模型贴图、Sprite      |
| **Texture3D**         | 三维纹理        | 体积渲染、噪声函数           |
| **Texture2DArray**    | 一组相同大小的2D纹理 | 批量渲染、材质变体           |
| **Cubemap**           | 六面贴图的立方体    | 天空盒、反射              |
| **RenderTexture**     | 可以被摄像机写入的纹理 | 后处理、实时渲染结果          |
| **MovieTexture**（已废弃） | 视频纹理        | 使用 `VideoPlayer` 替代 |

## 导入
在Unity中，图片导入后会成为Texture，可以通过Inspector查看其属性

![TextureInspector](/assets/images/TextureInspector.jpg)

1.Texture Type（纹理类型）
- `Default`：普通模型贴图
- `Normal Map`：法线贴图，用于模拟表面细节
- `Sprite（2D and UI）`：用于2D项目和UI
- `Cursor`：用于鼠标指针
- `Lightmap`：烘焙光照图
- `Single Channel`：单通道纹理，如Mask

2.Alpha Source
- 从图片的Alpha通道提取透明度信息

3.Wrap Mode（包裹模式）
- Repeat：超出部分重复
- Clamp：超出部分拉伸边缘
- Mirror：镜像重复

4.Filter Mode（滤波模式）
- Point（无滤波）：像素风格，清晰、锯齿明显
- Bilinear：线性插值，柔和
- Trilinear：加上Mipmap，适用于远处材质

5.Aniso Level（各向异性过滤）
- 提高斜视角下的清晰度（对地板类纹理有用）

6.Max Size & Compression
- 控制纹理的最大尺寸和压缩格式，影响内存和质量

## 使用
### 脚本加载Texture
```cs
public Texture2D tex;

void Start()
{
    Renderer renderer = GetComponent<Renderer>();
    renderer.material.mainTexture = tex;
}
```
或者动态加载
```cs
Texture2D tex = Resources.Load<Texture2D>("Textures/MyTexture");
```

### 从文件读取图片为Texture
```cs
byte[] bytes = File.ReadAllBytes("path/to/image.png");
Texture2D tex = new Texture2D(2, 2);
tex.LoadImage(bytes);
```

## RenderTexture与动态渲染
`RenderTexture`是可以被摄像机实时写入的纹理，用于：
- 后处理特效（Post Processing）
- 小地图
- 反射镜面
- 安全摄像头

示例
```cs
RenderTexture rt = new RenderTexture(256, 256, 16);
Camera.main.targetTexture = rt;
```

## Texture in Graphics
### Shader中采样Texture
```hlsl
sampler2D _MainTex;
float frag(v2f i) : SV_Target
{
    float4 color = tex2D(_MainTex, i.uv);
    return color;
}
```

### 多通道用途
- RGBA四个通道可以分别存储不同的数据
  - R:高度
  - G:金属度
  - B:粗糙度
  - A:遮罩

这样节省资源，减少Texture数量

## Texture的内存占用
计算方式（未压缩）：  
宽度 * 高度 * 通道数 * 每通道字节数

压缩后依赖于压缩格式，比如：
- DXT1：适合无透明度贴图（约1/8压缩）
- DXT5：支持透明度（约1/4）
- ASTC、ETC2：移动端更合适

## 建议
- 合理压缩纹理，避免内存爆炸
- 同一材质尽量使用Texture Atlas（图集）
- UI尽量使用`Sprite Atlas`
- 使用Mipmap减少远距离采样时的闪烁
- 不要在频繁更新的场景中使用`Texture2D.SetPixel`，效率低下

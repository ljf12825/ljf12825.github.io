---
title: "Skybox"
date: 2025-06-01
categories: [Note]
tags: [Unity, Component, Light, Rendering, Graphics]
author: "ljf12825"
type: blog
summary: Introduction, example and usage of Skybox in Unity
image: "/images/Blog/Skybox.jpg"
---
Skybox是一种渲染技术，用于在3D场景中创建远景背景，例如天空、宇宙、城市天际线等  
它本质上是一种把纹理图贴在一个立方体（或球体）内侧的技巧，玩家看不到边界，只能看到包裹在四周的“天空”

关键特性：
- 无限远：无论玩家如何移动，天空和总是保持固定的距离，永远不会被靠近（天空盒会跟随相机移动）从而创造出“无限远”的错觉
- 环境光源：天空盒不仅是视觉背景，其颜色和亮度还会为场景中的物体提供环境光（Ambient Light）和反射光（Reflection），这是实现场景光照统一和真实感的关键

## 创建Skybox
### 1. 使用现成材质
菜单栏 -> Window -> Rendering -> Lighting\
![SkyboxMaterial](/images/Blog/SkyboxMaterial.jpg)

### 2. 使用6张图片自定义创建立方体天空盒
1. 准备图片：需要6张正方形图片，分别对应立方体的六个面（`+X, -X, +Y, -Y, +Z, -Z`）。通常命名为`right`, `left`, `top`, `bottom`, `front`, `back`或`px`, `nx`, `py`, `ny`, `pz`, `nz`
  - 确保图片的Wrap Mode设置为Clamp，防止边缘接缝处出现拉伸
2. 创建材质
  - 在Project视图中右键->Create->Material
  - 将新建的材质命名为`MySkybox`
  - 在材质的Inspector面板中，点击Shader下拉菜单，选择Skybox -> Cubemap
3. 配置Cubemap
  - 创建Cubemap资源：Project下右键 -> Create -> Rendering -> LegacyCubemap，将六张图拖入Cubemap资源，然后将这个Cubemap资源拖到天空材质球的`Cubemap`槽位
4. 应用材质球：同`1. 使用现成材质`

### 3. 使用ProceduralSkybox
#### 创建Shader文件
1. Project右键 -> Create -> Shader -> Unlit Shader
2. 将其命名为`ProceduralSkybox`
3. 删除所有代码，替换为
```glsl
Shader "Skybox/Procedural Skybox"
{
    Properties
    {
        // 顶部颜色（天顶）
        _SkyColor ("Sky Color", Color) = (0.37, 0.52, 0.73, 1)
        // 地平线颜色
        _HorizonColor ("Horizon Color", Color) = (0.89, 0.89, 0.89, 1)
        // 地面颜色（地平线以下）
        _GroundColor ("Ground Color", Color) = (0.33, 0.27, 0.21, 1)
        
        // 太阳颜色
        _SunColor ("Sun Color", Color) = (1, 0.8, 0.6, 1)
        // 太阳大小（半径）
        _SunSize ("Sun Size", Range(0, 1)) = 0.04
        // 太阳晕影大小（光晕扩散）
        _SunGlow ("Sun Glow", Range(0, 10)) = 2.5
        
        // 太阳在天空中的方向（通常由脚本绑定方向光的方向来控制）
        _SunDirection ("Sun Direction", Vector) = (0.3, 0.8, 0.5, 0)
        
        // 天空颜色的幂次，控制颜色过渡的陡峭程度
        _SkyExponent ("Sky Exponent", Range(0, 10)) = 1.5
        // 地平线的大气厚度效果
        _AtmosphereThickness ("Atmosphere Thickness", Range(0, 10)) = 1.0
    }
    SubShader
    {
        Tags
        {
            "Queue"="Background"
            "RenderType"="Background"
            "PreviewType"="Skybox"
        }
        Cull Off // 关闭剔除，因为要从内部渲染
        ZWrite Off // 关闭深度写入，天空盒永远在最远处

        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "UnityCG.cginc"

            struct appdata
            {
                float4 vertex : POSITION;
                float3 uv : TEXCOORD0; // 使用三维UV来采样天空球
            };

            struct v2f
            {
                float4 vertex : SV_POSITION;
                float3 viewDir : TEXCOORD0; // 将视图方向传递给片元着色器
            };

            // 将属性变量连接到CG代码
            fixed4 _SkyColor;
            fixed4 _HorizonColor;
            fixed4 _GroundColor;
            fixed4 _SunColor;
            half _SunSize;
            half _SunGlow;
            half4 _SunDirection;
            half _SkyExponent;
            half _AtmosphereThickness;

            v2f vert (appdata v)
            {
                v2f o;
                o.vertex = UnityObjectToClipPos(v.vertex);
                
                // 获取世界空间下的视图方向（顶点位置）
                // 对于天空盒，顶点位置就是视图方向
                o.viewDir = mul((float3x3)unity_ObjectToWorld, v.vertex.xyz);
                
                return o;
            }

            fixed4 frag (v2f i) : SV_Target
            {
                // 标准化视图方向
                float3 viewDir = normalize(i.viewDir);
                // 标准化太阳方向（确保是单位向量）
                float3 sunDir = normalize(_SunDirection.xyz);
                
                // 1. 计算基础天空颜色（基于视角的垂直分量y）
                float horizon = dot(viewDir, float3(0, 1, 0)); // 计算与垂直方向的点积
                // 将horizon从[-1, 1] 映射到 [0, 1] 并应用幂次控制过渡
                float skyGradient = saturate(horizon * 0.5 + 0.5);
                // 应用指数控制过渡的平滑度
                skyGradient = pow(skyGradient, _SkyExponent);
                
                // 混合天空和地平线颜色
                fixed4 skyFinal = lerp(_HorizonColor, _SkyColor, skyGradient);
                // 混合地平线和地面颜色（对于地平线以下的部分）
                skyFinal = lerp(_GroundColor, skyFinal, saturate(horizon * _AtmosphereThickness));
                
                // 2. 计算太阳
                // 计算视线方向与太阳方向的夹角
                float sunDot = dot(viewDir, sunDir);
                // 平滑步进函数，在sunDot接近1（即视角指向太阳中心）时产生一个圆盘
                float sunDisk = smoothstep(1.0 - _SunSize, 1.0, sunDot);
                // 计算太阳光晕，一个更宽更柔和的过渡
                float sunGlow = pow(saturate(sunDot), _SunGlow);
                
                // 结合太阳圆盘和光晕
                fixed4 sunFinal = (_SunColor * (sunDisk + sunGlow));
                
                // 3. 将太阳效果叠加到天空背景上（使用加法混合，因为光是叠加的）
                fixed4 col = skyFinal + sunFinal;
                
                return col;
            }
            ENDCG
        }
    }
    // 防止回退到其他Shader
    Fallback Off
}
```

#### 创建并使用材质
创建一个材质名为`Mat_ProceduralSky`，在材质Inspector窗口中点击Shader下拉菜单，选择Skybox -/> ProceduralSkybox（Shader第一行创建）；调整材质属性，使用该材质作为天空盒材质

#### 与场景光联动
为了让太阳的位置与场景中的主方向光（模拟太阳）同步，需要创建一个简单的脚本
`SyncSunDirection.cs`
```cs
using UnityEngine;

[ExecuteAlways] // execute always include editor mode
public class SyncSunDirection : MonoBehaviour
{
    [SerializeField] private Light _sunLight; // directional light
    [SerializeField] private Material _skyboxMaterial; // proceduralskybox

    // 在材质中定义的_SunDirection属性的标识符
    private static readonly int SunDirectionID = Shader.PropertyToID("_SunDirection");

    void Update()
    {
        if (_sunLight != null && _skyboxMaterial != null)
        {
            // 将光源的forward方向（光照方向的反方向）传递给材质
            // 因为光源.transform.forward指向光照照射的方向（太阳到物体）
            // 而天空盒需要的是太阳在天空中的位置方向（物体到太阳），所以取反
            Vector3 sunDirectionInSky = -_sunLight.transform.forward;

            // 设置材质的向量属性
            _skyboxMaterial.SetVector(SunDirectionID, new Vector4(
                sunDirectionInSky.x,
                sunDirectionInSky.y,
                sunDirectionInSky.z,
                0f // 第四个分量通常不用
            ));
        }
    }
}
```
将该脚本挂在场景中任何物体上，拖入字段\
在编辑器中旋转directional light，天空盒中的太阳位置也会实时更新

![SunDirection1](/images/Blog/Sundirection1.jpg)
![SunDirection2](/images/Blog/Sundirection2.jpg)

## Skybox的类型与属性

Unity提供了几种不同类型的天空盒Shader，适用于不同的需求和资源类型
1. 6Sided(Cubemap)
使用6张独立的纹理。最经典和兼容新最好的方式
  - Tint Color：对每个面的纹理进行颜色染色
  - Exposure：调整天空盒的整体亮度。这个值会直接影响环境光的强度
  - Rotation：围绕Y轴旋转整个天空盒，可以调整太阳/云层的位置

2. Cubemap
使用一个单独的Cubemap资源（`.cubemap`文件），而不是六张分散的图片。Cube资源可以被引擎优化，性能通常稍好
  - 可以从六张图片生成Cubemap资源，见上所述

3. Panoramic(LatLong/360°)
使用一张等距柱状投影(Equirectangular)的360°全景图（2:1宽高比）。这是360°相机拍摄的图片格式
  - 优点：只需处理一张纹理，非常方便
  - Mapping：选择投影方式:`6 Frames Layout(类正方体)`和`Latitude Longitude Layout（类地球）`，`Automatic`通常即可正确识别

4. Procedural（程序化）
通过Shader算法实时生成天空，无需任何纹理
  - Sun：需要指定一个Directional Light作为太阳。天空盒会根据这个光的方向是是改变天空的颜色、太阳大小、晕影等
  - 控制参数丰富
    - `Atmosphere Thickness`：大气厚度，影响天空的蓝色程度
    - `Ground Color`：地平线处的颜色
    - `Sun Size` / `Sun Size Convergence`：控制太阳的大小和模糊程度
  - 优点：动态，可以随着游戏时间变化（通过代码控制Directional Light的旋转）
  - 缺点：风格化较强，不如基于图像的天空盒真实

## 深入原理与高级应用
### 1. 天空盒、环境光与光照烘焙（GI）
这是天空盒最核心的高级功能之一
- 环境光（Ambient Light）：在Lighting窗口的Environment标签中，`Source`如果设置为`Skybox`，那么场景的环境颜色和强度将完全由当前设置的天空盒决定。Unity会通过对天空盒进行采样来计算出平均的环境光颜色。调整`Intensity Multiplier`可以控制环境光强度
- 光照烘焙（Baked GI）
  - 当使用Baked Global Illumination时，天空盒是作为一个重要的环境光源被烘焙到光照贴图（Lightmaps）中的
  - 它的颜色和强度会直接影响场景中间接光照的结果
  - 在Lighting窗口中，可以设置Environment Lighting的相关参数，如`Intensity`和`Ambient Occlusion`，来控制天空盒在烘焙时的影响

### 2. 反射探针（Reflection Probes）
天空盒的另一个核心作用是提供默认的反射源
- 场景中具有光滑材质的物体（如金属、水面），其反射内容如果没有配置局部Reflection Probes，物体默认使用天空盒作为其反射源
- 可以创建Refelction Probes，并将其`Source`设置为`Skybox`，这样它就会捕获当前场景的天空盒（或自定义的天空盒）生成一个立方体贴图，供周围的物体使用。这对于让动态物体也能融入环境光至关重要

### 3. 动态切换天空盒
```cs
using UnityEngine;

public class SkyboxChanger : MonoBehaviour
{
    public Material[] skyboxMaterials;
    public ReflectionProbe reflectionProbe; // 可选，如果需要更新反射探针

    public void ChangeSkybox(int index)
    {
        if (index < 0 || index >= skyboxMatterials.Length)
        {
            Debug.LogError("Index out of range!");
            return;
        }

        // 设置渲染设置中的天空盒
        RenderSettings.skybox = syboxMaterials[index];

        // 立即强制过呢更新环境光照和反射
        DynamicGI.UpdateEnvironment();

        // 重置反射探针
        if (refflectionProbe != null) reflectionProbe.RenderProbe();
    }
}
```

### 4. 性能优化与最佳实践
- 纹理压缩：天空盒纹理通常很大，需要使用合适的压缩格式
  - PC/主机平台：通常使用`BCn/HDR`压缩（如RGB Crunched DXT5）
  - Android：通常使用`ETC2`（支持Alpha）或`ASTC`（更优的压缩比和质量）
  - iOS：通常使用`PVRTC`或`ASTC`
  - HDR：如果天空盒是高动态范围的（非常亮，如太阳），确保导入设置中勾选`Generate Mip Maps`并设置合适的压缩格式（如BC6H用于HDR Cubemap）

- Mip Map：通常建议开启，尤其是在有雾效或需要景深效果的场景中，可以改善远处的外观和性能。但对于永远在“无限远”处的天空盒，有时关闭它节省内存也是可行的，但需要测试
- 分辨率：不要使用过高的分辨率。2048x2048或1024x1024每面对于大多数项目来说已经足够。过高的分辨率会显著增加内存占用和加载时间
- HDR vs LDR：使用HDR（高动态范围）天空盒可以带来更真实的光照效果，尤其是在配置Post-Processing Stack后处理堆栈中的Tonemapping是，效果惊人。但需要确保项目设置中Color Space为Linear

### 5. 常见问题排查
- 接缝（Seams）：确保6张图片的Wrap Mode设置为Clamp，而不是Repeat
- 天空盒不显式/变紫：检查材质Shader是否正确，纹理是否丢失
- 光照不正确：更改天空盒后，如果使用了烘焙光照，必须重新烘焙才能更新光照贴图。动态GI则需要调用
- 移动端性能差：检查纹理压缩格式和分辨率。Panoramic天空盒在部分低端移动设备上可能比6 Sided的更耗性能，因为需要实时进行坐标转换

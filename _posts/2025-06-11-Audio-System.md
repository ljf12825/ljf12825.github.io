---
title: "Audio System"
layout: single
date: 2025-06-01
categories: [笔记]
tags: [Unity, Unity System]
author: "ljf12825"
permalink: /posts/2025-06-11-Audio-System/
---
Audio System 是 Unity中处理游戏所有声音播放、管理和混音的核心模块

## Audio Clip
在Unity中，`AudioClip`是表示音频资源的核心类，用于播放、管理和处理音频数据（如音乐、音效、语音等）

```cs
public class AudioCilp : Object
```
- 它存储音频数据，可以被`AudioSource`组件播放
- 通常通过将音频文件（如`.wav`、`.mp3`、`.ogg`）导入到Unity项目中生成AudioClip
- 可用来播放背景音乐（BGM）、音效（SFX）、语音（VO）等

![AudioClipExample](/assets/images/AudioClipExample.jpg)

### AudioClip的常见使用方式
1.在Inspector中拖入音频文件
- 拖一个音频文件到`Assets`文件夹
- Unity自动将其导入为`AudioClip`
- 拖到`AudioSource.clip`上即可播放

2.通过代码播放AudioClip
```cs
public AudioSource audioSource;
public AudioClip clip;

void Start()
{
    autioSource.clip = clip;
    audioSource.Play();
}
```

### AudioClip的导入设置

| 属性                     | 说明                                     |
| ---------------------- | -------------------------------------- |
| **Force To Mono**      | 强制单声道                              |
| **Normalize**          | 自动将音频的音量标准化到一个统一的最大音量水平，避免音量过低或过高|
| **Ambisonic**          | 沉浸式3D空间音频，启用后Unity会使用Ambisonic解码器处理音频方向，需安装第三方插件使用 |
| **Load Type**          | Streaming（长音频），Decompress on Load（短音效） |
| **Compression Format** | 压缩格式 PCM（无压缩） / Vorbis（有损压缩，开源格式，推荐） / MP3（有损压缩，商业格式） |
| **Sample Rate**        | 音质与性能平衡 Preserve Sample Rate（保留原始采样率）, Optimize Sample Rate（优化采样率）, Override Sample Rate（强制指定采样） |
| **Preload Audio Data** | 是否在启动时加载到内存                            |
| **Load in Background** | 是否异步加载                                 |

### 创建自定义AudioClip
可以在运行时动态生成AudioClip，例如用于程序化音效或语言合成
```cs
AudioClip myClip = AudioClip.Create("MySine", sampleLength, 1, sampleRate, false);
myClip.SetData(floatArray, 0);
```

### 注意事项
- AudioClip是资源，不等于播放器，需要`AudioSource`来播放
- 不要在频繁播放音效时反复创建AudioClip实例，应使用对象池或缓存机制
- `.m4a`等不推荐格式导入可能生成不了可用的`AudioClip`



## 主要组件

| Category            | Component Name                         |
|---------------------|----------------------------------------|
| **Audio**           | Chorus Filter                          |
|                     | Distortion Filter                      |
|                     | Echo Filter                            |
|                     | High Pass Filter                       |
|                     | Listener                               |
|                     | Low Pass Filter                        |
|                     | Reverv Filter                          |
|                     | Reverv Zone                            |
|                     | Source                                 |

## 组件
### Audio Source
`AudioSource`是Unity中用于播放声音的核心组件，负责控制音频的播放、暂停、停止、3D效果、音量等

![AudioSourcePanel](/assets/images/AudioSourcePanel.jpg)





## 结合

## 脚本

## 性能
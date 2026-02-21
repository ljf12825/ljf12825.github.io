---
title: "Audio System"
date: 2025-06-01
categories: [Engine]
tags: [Unity, Unity System]
author: "ljf12825"
type: log
summary: The usage, document and principle of Audio System. Include every Audio components and params in Unity.
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

![AudioClipExample](/images/log/AudioClipExample.jpg)

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

![AudioSourcePanel](/images/log/AudioSourcePanel.jpg)

#### 面板字段

| **属性**                      | **描述**                                                      | **使用场景**                                                |
| --------------------------- | ----------------------------------------------------------- | ------------------------------------------------------- |
| **Audio Clip**              | 音频片段的引用，指定播放的声音文件。                                          | 通过此属性指定要播放的音频文件。                                        |
| **Output**                  | 默认情况下，音频直接输出到场景中的 `AudioListener`，也可以输出到 `AudioMixer` 进行处理。 | 如果需要使用 `AudioMixer` 对音频进行处理，设置此属性。                      |
| **Mute**                    | 启用时，声音播放但被静音。                                               | 用于临时静音音频，但不停止播放。                                        |
| **Bypass Effects**          | 启用时，跳过应用于 `AudioSource` 的所有音效。                              | 用于快速禁用所有音频效果，音频将以原始状态播放。                                |
| **Bypass Listener Effects** | 启用时，跳过 `AudioListener` 上的所有音效。                              | 用于快速禁用所有监听器效果，影响的是音频在场景中的接收。                            |
| **Bypass Reverb Zones**     | 启用时，跳过场景中的所有混响区域。                                           | 如果场景中有多个混响区域，使用此属性来禁用它们对音频的影响。                          |
| **Play On Awake**           | 启用时，场景启动时会自动播放音频。                                           | 背景音乐等需要在场景启动时自动播放的音频可以启用此属性。                            |
| **Loop**                    | 启用时，音频在播放完毕后会自动循环播放。                                        | 用于循环播放音效或背景音乐。                                          |
| **Priority**                | 音频源的优先级。值越低，音频优先级越高。0 表示最重要，256 表示最不重要。                     | 在多个音频源同时播放时，优先级较低的音频可能会被系统暂停或降低音量。音乐通常设置为 0，确保它不会被临时停掉。 |
| **Volume**                  | 音量控制，表示距离 `AudioListener` 一米时的音量大小。                         | 控制音效的音量大小，通常在 0 到 1 之间调节。                               |
| **Pitch**                   | 控制音频的音高和播放速度，1 为正常速度，大于 1 提高音高，低于 1 降低音高。                   | 用于调节音效的音调或播放速度。                                         |
| **Stereo Pan**              | 控制音频在立体声中的位置，-1 为左声道，1 为右声道，0 为中央。                          | 适用于 2D 音频，调整音效在左右声道中的位置。                                |
| **Spatial Blend**           | 控制音频的 3D 空间效果，0 为纯 2D 音频，1 为纯 3D 音频。                        | 用于控制音频是否为 3D 音效，3D 音效会受到音源和监听器位置的影响。                    |
| **Reverb Zone Mix**         | 控制音频信号与混响区域的混合比例，范围为 0 到 1，1 到 1.1 范围内允许 10 dB 的放大效果。       | 用于将音频信号与场景中的混响效果混合，模拟不同的环境音效。                           |
| **3D Sound Settings**       | 3D 音效设置，具体依赖于 `Spatial Blend`。                              | 用于调整 3D 音效的各种参数，比如声音的衰减、距离等。                            |
| **Doppler Level**           | 控制 Doppler 效应的强度，设置为 0 时不会有 Doppler 效果。                     | 模拟运动物体产生的音高变化效应，常用于车辆、飞行物等的音效。                          |
| **Spread**                  | 设置 3D 音效的扩散角度，适用于立体声或多声道音频。                                 | 用于调整声音的扩散角度，尤其是 3D 音频和多声道音频的效果。                         |
| **Min Distance**            | 当监听器与音源的距离小于此值时，音频会保持最大音量，超出该距离后开始衰减。                       | 控制音效在 3D 空间中的音量范围。                                      |
| **Max Distance**            | 控制音频停止衰减的最大距离，超过此距离时音量保持恒定。                                 | 设置音效衰减的最大距离。超出此距离后音效音量不再变化。                             |
| **Rolloff Mode**            | 控制音效衰减的方式。                                                  | 根据需要选择不同的衰减模式：                                          |
| - **Logarithmic Rolloff**   | 音效在接近时非常响亮，但随着距离增加衰减得很快。                                    | 用于模拟自然的音量衰减。                                            |
| - **Linear Rolloff**        | 音效随着距离增加而逐渐变小，衰减线性。                                         | 用于模拟更平滑的音量衰减。                                           |
| - **Custom Rolloff**        | 根据自定义图表设置音效衰减。                                              | 用于实现自定义的衰减曲线，适应特殊的音效需求。                                 |


### Audio Listener
行为类似耳机类设备，接收场景内AudioSource的输入，通过计算机扬声器输出，通常挂载主摄像机上  
如果音源是3D的，监听器将模拟声音在3D世界中的位置、速度和方向  
每个场景中只能有一个Audio Listener

### Audio Mixer
`Audio Mixer`是Unity中用于处理和控制游戏音频的强大工具，它允许你对音频信号进行多轨编辑、实时混音、效果处理和音量控制

#### 功能和用法

1.音频轨道管理（Channels）  
在 Audio Mixer 中，你可以将多个音频源（如背景音乐、环境音效、UI 音效等）分配到不同的轨道上进行独立控制。每个轨道都可以有自己的音量、效果和其他处理器。

2.实时音效处理  
Audio Mixer 提供了多种内置的音效处理器（如 Reverb、Echo、Low-pass filter、Distortion 等），你可以实时调整这些效果来改变音频的听感。例如，你可以模拟一个声音在大房间中的回响，或者调整音频的高频和低频响应。

3.音量控制和动态调整  
你可以通过 Audio Mixer 中的 Volume Faders 来控制每个音频轨道的音量，并且支持实时调节。比如，你可以设定背景音乐的音量在游戏的某些场景中变化，或者根据游戏的状态（如玩家的行动、战斗、对话等）来调节音量。

4.Duck/Sidechain Compression  
Duck 是 Audio Mixer 中常用的动态处理功能，通常用于背景音乐和环境音效，避免这些音效与重要声音（如角色对话或枪声）发生冲突。你可以通过设置侧链压缩（sidechain compression）来实现这种效果。例如，当敌人发出声音时，背景音乐的音量会自动降低。

5.Snapshot 和过渡效果（Transitions）  
Snapshot 是一种音频状态，允许你在不同的游戏场景或条件下迅速切换音频的设置。例如，切换到战斗场景时，你可以通过切换到战斗音效的 Snapshot，来提升战斗音乐的音量并加入额外的音效处理。

6.控制游戏中的音频混合器  
你可以通过代码动态控制音频混合器的参数（例如音量、效果和 Snapshot）：
```cs
using UnityEngine;
using UnityEngine.Audio;

public class AudioManager : MonoBehaviour
{
    public AudioMixer audioMixer;

    // 设置音量
    public void SetVolume(float volume) => audioMixer.SetFloat("MasterVolume", volume);

    // 切换到一个音频快照
    public void SwitchToSnapshot(AudioMixerSnapshot snapshot) => snapshot.TransitionTo(1.0f);
}
```

7.Audio Mixer 和 Audio Sources 的结合  
Audio Mixer 还与 AudioSource 结合使用，通过将多个 AudioSource 连接到同一个 Audio Mixer，你可以统一管理所有音频的效果。例如，背景音乐、UI 音效和环境音效都可以通过一个混音器进行调整。具体操作可以在 Audio Source 的 Output 属性中设置。

#### 使用方法
1.创建一个 Audio Mixer
- 在 Project 窗口中，右击并选择 Create -> Audio Mixer，然后给它命名。
- 双击创建的 Audio Mixer 以打开音频混音器窗口。

2.添加音频轨道
- 在 Audio Mixer 窗口中，点击右上角的 + 按钮，选择 Create Group，然后为该轨道命名。每个音频源将连接到这个轨道。
- 你可以为每个轨道添加 效果（比如 Reverb 或 Echo）和 音量控制（通过 Fader）。

3.连接 Audio Source 到 Audio Mixer
- 选择你想要控制的 AudioSource，然后在 Inspector 面板中的 Output 部分，选择你刚刚创建的 Audio Mixer 的轨道。
4.设置 Snapshot 和过渡效果
- 在 Audio Mixer 中，点击 Snapshots 标签页，创建新的 Snapshot，设置需要的音量和效果。
- 你可以使用代码或事件系统来切换快照。例如，战斗开始时，可以切换到一个包含增强音效和音乐的 Snapshot。

5.调整实时音效
- 在音频轨道上添加效果，调整参数并实时监听效果的变化。比如你可以使用 Low-Pass Filter 来调整环境音效，使其在不同的环境下具有不同的氛围。


## 结合

## API
### Audio Source
#### Properties

| **属性**                       | **说明**                                                          |
| ---------------------------- | --------------------------------------------------------------- |
| **bypassEffects**            | 跳过音频源的效果处理（如滤波器组件或全局监听器滤波器）。                                    |
| **bypassListenerEffects**    | 设置为 `true` 时，音频源的音频信号不会应用全局监听器效果。                               |
| **bypassReverbZones**        | 设置为 `true` 时，音频源不会路由到全局混响区域。                                    |
| **clip**                     | 默认播放的 `AudioClip`。                                              |
| **dopplerLevel**             | 设置音频源的多普勒效应比例。                                                  |
| **gamepadSpeakerOutputType** | 获取或设置音频源的游戏手柄音频输出类型。                                            |
| **ignoreListenerPause**      | 允许音频源在 `AudioListener.pause` 为 `true` 时继续播放（用于菜单音效或暂停菜单中的背景音乐）。 |
| **ignoreListenerVolume**     | 使音频源忽略 `AudioListener` 的音量设置。                                   |
| **isPlaying**                | 返回音频源是否正在播放音频资源（只读）。                                            |
| **isVirtual**                | 如果所有由该音频源播放的声音都被音频系统剔除，则为 `true`。                               |
| **loop**                     | 检查音频剪辑是否循环播放。                                                   |
| **maxDistance**              | 设置声音不再变得更轻或停止衰减的距离，取决于衰减模式。                                     |
| **minDistance**              | 在该距离内，音频源的音量将不再增大。                                              |
| **mute**                     | 静音或取消静音音频源。                                                     |
| **outputAudioMixerGroup**    | 设置音频源的音频信号路由到的目标混音器组。                                           |
| **panStereo**                | 对播放声音进行立体声平移（左或右）。仅适用于单声道或立体声的声音。                               |
| **pitch**                    | 设置音频源的音高。                                                       |
| **playOnAwake**              | 启用该属性可以使音频源在组件或游戏对象激活时自动播放音频源。                                  |
| **priority**                 | 设置音频源的优先级。                                                      |
| **resource**                 | 默认播放的音频资源。                                                      |
| **reverbZoneMix**            | 设置音频源信号混合到与混响区域相关的全局混响效果的程度。                                    |
| **rolloffMode**              | 设置或获取音频源如何根据距离进行衰减。                                             |
| **spatialBlend**             | 设置音频源受 3D 空间化计算（如衰减、多普勒效应等）的影响程度。0.0 为完全 2D，1.0 为完全 3D。         |
| **spatialize**               | 启用或禁用空间化处理。                                                     |
| **spatializePostEffects**    | 设置空间化效果是在效果过滤器之前还是之后插入的。                                        |
| **spread**                   | 设置 3D 立体或多声道声音的扩展角度（单位：度）。                                      |
| **time**                     | 音频源播放位置（单位：秒）。                                                  |
| **timeSamples**              | 音频源的当前播放位置（单位：PCM 样本）。                                          |
| **velocityUpdateMode**       | 设置音频源是否应在固定更新或动态更新时更新。                                          |
| **volume**                   | 设置音频源的音量（范围：0.0 到 1.0）。                                         |

#### Public Methods

| **方法/属性**                    | **说明**                                                  |
| ---------------------------- | ------------------------------------------------------- |
| **DisableGamepadOutput**     | 禁用此音频源的游戏手柄音频输出。                                        |
| **GetAmbisonicDecoderFloat** | 读取附加在 `AudioSource` 上的自定义 Ambisonic 解码器效果的用户定义参数。       |
| **GetCustomCurve**           | 获取指定 `AudioSourceCurveType` 的当前自定义曲线。                   |
| **GetOutputData**            | 提供当前播放的音频源的输出数据块。                                       |
| **GetSpatializerFloat**      | 读取附加在 `AudioSource` 上的自定义空间化效果的用户定义参数。                  |
| **GetSpectrumData**          | 提供当前播放的音频源的音频频率数据块（频谱数据）。                               |
| **Pause**                    | 暂停当前播放的音频剪辑。                                            |
| **Play**                     | 播放音频剪辑。                                                 |
| **PlayDelayed**              | 延迟指定秒数后播放音频剪辑。建议使用此函数替代旧的 `Play(delay)` 函数，后者接受样本数作为参数。 |
| **PlayOneShot**              | 播放一个 `AudioClip`，并根据 `volumeScale` 调整音频源的音量。            |
| **PlayOnGamepad**            | 启用音频源通过指定的游戏手柄播放。                                       |
| **PlayScheduled**            | 在绝对时间线上（由 `AudioSettings.dspTime` 提供）指定的时间播放音频剪辑。       |
| **SetAmbisonicDecoderFloat** | 设置附加在 `AudioSource` 上的自定义 Ambisonic 解码器效果的用户定义参数。       |
| **SetCustomCurve**           | 设置指定 `AudioSourceCurveType` 的自定义曲线。                     |
| **SetScheduledEndTime**      | 更改已调度播放的声音的结束时间。注意，由于时序的原因，某些重新调度的请求可能无法完成。             |
| **SetScheduledStartTime**    | 更改已调度播放的声音的开始时间。                                        |
| **SetSpatializerFloat**      | 设置附加在 `AudioSource` 上的自定义空间化效果的用户定义参数。                  |
| **Stop**                     | 停止播放音频剪辑。                                               |
| **UnPause**                  | 取消暂停，恢复播放此音频源。                                          |

#### Static Methods

| **方法/属性**                            | **说明**                                                        |
| ------------------------------------ | ------------------------------------------------------------- |
| **GamepadSpeakerSupportsOutputType** | 检查平台是否支持在游戏手柄上输出音频的特定类型。                                      |
| **PlayClipAtPoint**                  | 在世界空间中的指定位置播放一个 `AudioClip`。这个方法会自动为音频源创建一个临时的 `AudioSource`。 |

### Audio Listener
#### Static Properties

| **属性**     | **说明**                                  |
| ---------- | --------------------------------------- |
| **pause**  | 获取或设置音频系统的暂停状态。若为 `true`，音频将暂停播放。       |
| **volume** | 控制游戏音量的全局设置（范围从 0.0 到 1.0），用于调节整个游戏的音量。 |

#### Properties

| **属性**                 | **说明**                                                                       |
| ---------------------- | ---------------------------------------------------------------------------- |
| **velocityUpdateMode** | 设置 `AudioListener` 是否应在固定更新或动态更新时进行更新。`FixedUpdate` 或 `Update` 中更新监听器的位置和速度。 |

#### Static Methods

| **方法**              | **说明**                                              |
| ------------------- | --------------------------------------------------- |
| **GetOutputData**   | 提供音频监听器（主监听器）输出数据的一个数据块。通常用于实时分析音频输出的信号。            |
| **GetSpectrumData** | 提供音频监听器（主监听器）的频谱数据的一个数据块，用于音频的频率分析，常用于音频可视化和动态效果处理。 |

### Audio Mixer
#### Properties

| **属性**                    | **说明**                                                                                                          |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **outputAudioMixerGroup** | **路由目标**：设置音频源的音频信号应该输出到哪个音频混音器组。每个音频源可以选择一个目标音频混音器组，这决定了音频信号的路由路径，常用于将不同类型的音频信号（如背景音乐、效果音、语音等）分配到不同的处理组中。      |
| **updateMode**            | **音频混音器时间更新模式**：设置 `AudioMixer` 的时间如何进展，尤其在 **Snapshot** 过渡期间。可以控制在时间过渡（如混音器快照转换）过程中，混音器的行为。常用于调整音频的渐变、平滑过渡等效果。 |

#### Public Methods

| **方法/属性**                 | **说明**                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| **ClearFloat**            | 重置一个暴露的参数到其初始值。通常用于清除在混音器中对某个暴露参数的修改。                                                                  |
| **FindMatchingGroups**    | 在混音器中查找与指定路径匹配的组。该路径形式为 "Master Group/Child Group/Grandchild Group"，例如，`Master/WATER/DROPS` 返回组 DROPS。 |
| **FindSnapshot**          | 根据指定的名称查找并返回匹配的快照（名称必须完全匹配）。                                                                           |
| **GetFloat**              | 返回指定暴露参数的值。如果该参数不存在，函数将返回 `false`。在调用 `SetFloat` 或 `ClearFloat` 后，返回的值将是当前快照或快照过渡期间的值。                 |
| **SetFloat**              | 设置指定暴露参数的值。一旦调用该方法，混音器快照将不再控制此暴露参数，并且只能通过 `AudioMixer.SetFloat` 方法修改该参数。                               |
| **TransitionToSnapshots** | 转换到指定快照的加权混合。可用于游戏中根据状态的不同在不同的音频快照之间过渡，或通过三角插值来实现快照之间的平滑过渡。                                            |


## 性能

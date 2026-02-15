---
title: linux gui stack
date: 2026-01-14
draft: false
summary: DM, WM, DE, GTK, Qt, Electron
---

# Linux GUI

```
硬件
  v
内核（DRM / KMS / evdev / udev）
  v
显卡驱动（Mesa / NVIDIA）
  v
显示管理器（DM）
   |— GDM, SDDM, LightDM, Lym nodm
   |_ 图形界面的登录程序
  v
显示协议
   ├─ X11 (Xorg)
   └─ Wayland
  v
显示服务器 / 合成器
   ├─ Xorg
   └─ Wayland Compositor（sway / kwin / mutter）
  v
窗口管理器（WM）
   ├─ i3 / openbox / awesome
   └─ 内嵌在 Wayland compositor 中
  v
桌面环境（DE）
   ├─ GNOME / KDE / XFCE
   └─ = WM + 面板 + 文件管理 + 设置
  v
工具与协议
   ├─ 输入法（fcitx / ibus）
   ├─ 剪贴板（xclip / wl-clipboard）
   ├─ 托盘（systray）
   ├─ 壁纸、通知、锁屏
应用程序
   |— GTK应用
   |— Qt应用
   |_ Electron应用
```



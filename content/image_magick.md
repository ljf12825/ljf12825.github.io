---
title: Usage of ImageMagick
author: ljf12825
date: 2026-08-12
tags: [GP, Tool]
summary: Usage of ImageMagick
---

ImageMagick是一个开源的、跨平台的命令行图像处理套件

与Photoshop等带有GUI的软件不同，ImageMagick主要通过命令行或各种编程语言的API进行操作

## 核心功能与特性

1. 格式转换(Convert)：支持超过200种图像格式的读写（包括PNG, JPEG, GIF, WebP, TIFF, SVG, PDF, HEIC等）
2. 尺寸与裁剪：快速调整分辨率、按比例缩放、裁剪区域或添加留白
3. 特效与过滤：支持模糊、锐化、旋转、反转、调整色彩空间(RGB/CMYK/HSV)、降噪等
4. 文字与水印：在图片上绘制文本、矢量图形、加盖透明水印
5. 图像合成(Composite)：将多张图片进行叠加、拼接或融合
6. GIF动画制作：从多帧图像创建或修改GIF动画，并支持帧优化

## 使用场景

1. 自动化工作流与脚本：利用Shell, Python等脚本批量处理海量图片（例如网站图片预处理、微缩图生成）
2. 后端服务器集成：作为网站或App服务端的底层图像处理引擎，处理用户上传的头像、商品图、生成缩略图等
3. 开发库支持：通过`MagickCore`或`MagickWand`C/C++ API直接链接到自研程序中

# Reference

## C++
[ISO/IEC 14882:xxxx](https://www.iso.org/) : The official C++ standard document, serving as a legal and technical specification rather than a learning guide. Developed by the International Standardization Organization (ISO). It strictly defines C++ syntax, semantics, standard library behavior, and the principles that all implementations (compilers) must adhere to. These standards documents are paid for and must be purchased from ISO or a national standards organization. `xxxx` means publish year.

[cppreference](https://cppreference.com/) : The preferred reference site for all C++ developers, recognized as the most accurate and comprehensive online resource. The content is extremely detailed, including detailed descriptions of all language features, standard library header files, functions, classes, and algorithms. The format is standardized, and each page includes syntax, parameters, return values, exceptions, complexity, sample code, related links, etc. The standard version is marked, clearly indicating which C++ standard the feature was Introductiond in. Most sample code can be edited and run on the page

[GCC(GNU Compiler Collection)](https://gcc.gnu.org/onlinedocs/) and [Clang](https://clang.llvm.org/docs/) : They are not part of the C++ language itself, but the documentation of mainstream compilers is an important reference for implementation details. They include compiler options, language extensions, ABI details, library implementation documentation, static analyzers, and documentation for some tools. You can consult them when you need to query the details of a certain compilation option or the specific platform or architecture features supported by the compiler.

[C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines) : This project, maintained by Bjarne Stroustrup, the father of C++, and numerous experts, aims to guide developers in using modern C++ correctly, efficiently, and safely. It's not a syntax reference, but rather a collection of best practices. It includes hundreds of rules, each with rationale and examples.

[WG21 Papers](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/) : If you want to understand the future direction of the language and the latest discussions, you can follow the work of the standards committee, which stores technical documents (called Papers) that propose and design new features.

[Boost Library Docs](https://www.boost.org/libraries/) : It is a very important and high quality C++ third libraries collection. Known as the quasi-standard library of C++, many of its components later entered the standard library of new versions of C++ and later. But it is very large, and some of the features it implements are obscure and difficult to understand. Don't delve into them, if it's not necessary.

## C#
[Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/csharp/) : This is Microsoft's unified official documentation platform, replacing the legacy MSDN documentation. It's the preferred and definitive reference for all .NET and C# developers. It includes documentation for the .NET platform, the C# language, all Base Class Libraries (BCLs), ASP.NET Core, EF Core, and more. You can easily switch between documentation for different .NET versions (such as .NET 8, .NET 6, and the .NET Framework) to avoid issues caused by API differences. It includes "concept" articles (tutorials and guides), automatically generated API references, code samples, and quickstarts. Many pages have built-in "Run" buttons, allowing you to edit and run code samples directly in your browser (based on .NET Jupyter Notebooks).

## Lua

[Lua5.4 Reference Manual](https://www.lua.org/manual/5.4/) : This is the definitive, core Lua reference document, written and maintained by the Lua team (PUC-Rio). All other reference resources build on it. It fully defines the syntax, semantics, standard library, and C API of the Lua language (currently the latest version is 5.4). The document style is highly technical, with no redundant explanations and straightforward to the point. Sections provide detailed coverage of basic concepts, the language, the standard library (`strings`, `tables`, `io`, `operating systems`, `math`, `debugging`, etc.), and how to embed and extend Lua. For all Lua developers.

## Game Engine
[UnityManual](https://docs.unity3d.com/Manual/index.html) and [UnityScripting API](https://docs.unity3d.com/ScriptReference/index.html) : Unity's documentation system is very complete. The Unity Manual is an introduction to concepts and workflows, suitable for systematic learning and understanding of concepts. The Unity Scripting API is used to query code, including detailed descriptions of each class, method, property, function, parameters, return values, and code examples.

[UnRealEngine Docs]( https://docs.unrealengine.com/) : A huge system that integrates manuals, API references, blueprint references, and tutorials.

## Linux
[Linux Kernel Docs](https://docs.kernel.org/) : The official Linux kernel documentation is the core and most official Linux documentation, primarily for developers, driver writers, and system-level researchers. This is the official webpage version of the documentation in the kernel source tree (located in the `/Documentation` directory). It includes the following: Development Guide, which explains how to compile the kernel and submit patches; Driver documentation, which explains how to write and configure various hardware drivers; Subsystem documentation, which explains detailed descriptions of file systems, networking, memory management, etc.; API documentation, which explains the interfaces provided by the kernel to modules.

[GNU](https://www.gnu.org/) : This is the center of GNU documentation. It mainly contains three aspects. The first is the official manual, which is the most important part. GNU has written detailed tutorials and reference manuals for almost all the software it develops and maintains. The second is philosophy and papers. The GNU project is not just software, but also a free software movement. It contains a large number of articles written by Richard Stallman and others on the philosophy, copyright, ethics and social significance of free software. Finally, there is the FAQ, which contains common questions about the GNU project, the Free Software Foundation (FSF) and various licenses (such as GPL).

[ArchLinux](https://archlinux.org/) : This is ArchLinux Home page. You can select the wiki page on its navigation. ArchLinux Wiki is recognized as one of the best and the most comprehensive wiki. Regardless of the distribution you use, it is highly recommended to check the Arch Wiki if you encounter any problems. It is very detailed, updated, and explained thoroughly, full of best practices and troubleshooting solutions.

[Ubuntu Doc](https://help.ubuntu.com/) and [Ubuntu Server Guide](https://ubuntu.com/server/docs) : Face to Desktop and Server User. The latter is a server management guide.

## Graphic
### API Docs
[Vulkan](https://www.vulkan.org/) include [Vulkan API Documentation](docs.vulkan.org)

[OpenGL](https://www.opengl.org/) include [OpenGL API Documentation](https://registry.khronos.org/OpenGL) and [OpenGL Wiki](https://www.khronos.org/opengl/wiki/)

[DirectX](https://learn.microsoft.com/en-us/windows/win32/directx) : Included in Microsoft Learn

### Textbook
[Real-Time Rendering](https://www.realtimerendering.com/) : This isn't just the book; the website itself is a treasure trove of resources. It offers chapter notes, links to numerous online articles, code resources, and an incredibly comprehensive list of graphics resources. It's the "Bible" reference for graphics.

[Physically Based Rendering: From Theory To Implementation](https://www.pbr-book.org/) : The definitive book on offline rendering and ray tracing. Free, online, and with full source code.

[Scratchapixel](https://www.scratchapixel.com/) A high-quality, free online graphics tutorial website. From basic mathematics (linear algebra, calculus) to advanced ray tracing and shading techniques, there are very intuitive and detailed explanations, accompanied by beautiful diagrams and code.

### Tutorial
[LearnOpenGL](https://learnopengl.com/) : Recognized as the best OpenGL introductory to advanced tutorial.

[Ray Tracing in One Weekend Series](https://raytracing.github.io/) : A series of short books by Peter Shirley and others that teach you step-by-step how to implement a simple ray tracer.

[Shadertoy](https://www.shadertoy.com/) : A community website for writing and sharing fragment shaders online.

### Academic
[arXiv.org](https://arxiv.org/list/cs.GR/recent) : Where researchers around the world publish their latest preprints. For cutting-edge rendering, simulation, geometry processing, and more, search here.

[SIGGRAPH](https://www.siggraph.org/) and [SIGGRAPH DIGITAL LIBRARY](https://dl.acm.org/conference/siggraph) : SIGGRAPH is the premier conference in computer graphics. Its digital library contains nearly every seminal paper from decades past. Slides and videos from many conference talks and courses are also made publicly available after the conference, providing valuable learning resources.

## Miscellaneous
[Mermaid](https://mermaid.js.org/) : A very popular JavaScript-based chart drawing tool that allows you to generate various charts using plain text, which is then converted into graphics by the rendering engine.

[Git](https://git-scm.com/) include [Git About](https://git-scm.com/about/branching-and-merging), [Git Documentation](https://git-scm.com/doc), [Git Community](https://git-scm.com/community) and DownLoad.




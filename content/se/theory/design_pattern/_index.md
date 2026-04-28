---
title: Design Pattern
type: file
---

# Design Pattern

<!--more-->

Design Patterns are reusable solution templates summarized for common design problems in software engineering. Essentially, they are experience-based code structure guidelines, not specific code implementations.

## Problems Solved by Design Patterns

Design patterns primarily solve three types of software design problems

1. Code Coupling
    - For example:
      - Excessive dependencies between modules
      - Modifying one part causes multiple crashes
    - Solution
      - Interface abstraction
      - Dependency Inversion
2. Scalability
    - For example:
      - Avoiding modifying old code when adding new features
    - Solution
      - Composition over inheritance
      - Strategic behavior
3. Code Reuse and Structural Standardization
    - For example:
      - How to organize the object lifecycle
      - How to unify object creation

## The Essential Ideas of Design Patterns

Design patterns can be understood as three layers

| Layer | Content |
| - | - |
| Philosophical Layer | Interface-oriented programming, low coupling, high cohesion |
| Structural Layer | Object relationship organization |
| Implementation Layer | Specific code template |

Core principles typically revolve around:

- Open/Closed Principle(OCP): Open for extension, closed for modification
- Single Responsibility Principle(SRP)
- Dependency Inversion Principle(DIP)

These are fundamental theories of object-oriented design

## Negative

Design patterns are not always necessary, this easily leads to:

- Over-engineering
- Design patterns for the sake of design patterns

Truly mature engineering practice is: choosing the appropriate pattern when a problem arises, rather than designing patterns in advance.


> Design patterns are abstract engineering patterns for common problems in software engineering, not code rules.

### Additional

Many low-level/high-performance codes weaken traditional object-oriented patterns. In contrast, it's more important to understand:

- Component-based architecture
- Data-Oriented Design
- Interface isolation and dependency management
- Lifecycle Control

This isn't about opposing design patterns, but rather opposing "pattern-centric" thinking.

Core reason: Perfromance and complexity tanke higher priority.

Traditional design patterns often implicitly assume serveral things:

- Runtime abstraction
- Object polymorphic scheduling
- Indirection layer encapsulation

However, in high-performance systems, these can be burdens.

### Virtual function calls can become performance bottlenecks

For example: a large number of objects using virtual tables, CPU pipeline prediction failures, and decreased cache locality. These costs are very real in game engines and graphics computing.

Therefore, many engines prefer:

- Template static polymorphism
- Compile-time binding
- Data-driven structures

rather than overly object-oriented inheritance hierarchies.

### Excessive abstraction increases cognitive cost

Design patterns essentially trade abstraction for extensibility, but the problem is: the more layers of abstraction, the harder the system is to maintain. This is especially true for small to medium-sized systems where team members have varying skill levels. High-level engineering practices prioritize: direct, transparent, and reasonable code paths.

## The Correct Design Approach

- Determine the data structure first
    - Think first:
      - Where is the data located?
      - How to store it contiguously?
      - How to manage its lifecycle?
    - Instead of thinking about class structure first
- Then consider the computation path
    - Consider:
      - Can batch processing be performed?
      - Can it be SIMD-based? 
      - Can branch prediction failures be avoided?
- Only consider abstract interfaces last

Instead of writing a bunch of interfaces and patterns first



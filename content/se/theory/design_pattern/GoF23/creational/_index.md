---
title: Creational Patterns
type: file
---

# Creational Patterns

<!--more-->

Creational Patterns is the first major category of GoF design patterns, with a core focus on the mechanism of object creation. Its goal is to separate object creation from its use, making the system more in line with the principle of "programming to interfaces"

## The core problem to be sovled

Creating objects directly using `new`(which in C++ allocates memory on the stack or heap) introduces two problems:

- Compile-time binding to the concrete class: `new ClassA()` hardcodes the implementation, violating the "OSP" when flexibility is needed(e.g., dynamically switching databases based on configuration).
- Complex and fragmented creation process: If an object requires complex initialization steps, or multiple components need to create objects in a consistent manner, manual `new` operations lead to code duplication and are prone to errors.

The core idea of creational patterns is to encapsulate, delegate, or manage the `new` operation(or the instantiation of a concrete class).

## Five Creational Patterns

The GoF defined 5 creational patterns, which can be divided into two categories based on their encapsulation and management granularity:

### 1. Encapsulating concrete classes and controlling how objects are created

- Factory Method Pattern
  - The parent class defines the interface for creating objects; the subcalss decides which concrete class to instantiate.
  - Defer `new` to the subclass. You are calling a method that returns an abstract object, regardless of its concrete implementation.
- Abstract Factory Pattern
  - Provides an interface for creating families of related or dependent objects without specifying concrete classes.
  - Allow the creation of a group of related objects, ensuring the maintain a consistent style.
- Prototype Pattern
  - "Clones" new objects from a configured template, especially useful when initialization costs far outweigh copying

### 2. Ensuring Object Uniqueness or Creation Steps

- Singleton Pattern
  - Ensures that a class has only one instance and provides a single global access point.
  - Only one copy exists globally, and it manages itself. However, note that in your critical notes, it's often seen as a sugarcoating of "global varibales," easily introducing implicit coupling, and requires great caution in modern practice.
- Builder Pattern
  - Separates the construction of a complex object from its representation. allowing the same construction process to create different representations.
  - Breaks down the complex `new` and initialization steps into a series of assembly steps, ultimately generating the object all at once.

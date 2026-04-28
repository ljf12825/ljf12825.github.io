---
title: Behavioral Patterns
type: file
---

# Behavioral Patterns

<!--more-->

This patterns focus on how objects communicate and how to handle interactions between them.

The GoF categorizes 11 patterns into behavioral patterns, which can be broadly divided into two categories:

## Processing Patterns(Focusing on Algorithm Flow)

- Template Method Pattern: Defines the skeleton of an algorithm, deferring certain steps to subclasses.
- Strategy Pattern: Defines a family of algorithms that are interchangeable.
- Command Pattern: Encapsulates requests as objects, facilitating parameterization and queuing.
- Interpreter Pattern: Given a language, define its grammar and interpreter.
- Chain of Responsibility Pattern: Allows multiple objects to handle requests, forming a chain.
- State Pattern: Allows objects to change their behavior when their internal state changes.

## Communication Patterns(Focusing on Object Relationships)

- Observer Pattern: Defines a one-to-many dependency, allowing multiple observers to automatically listen to a single topic.
- Interator Pattern: Sequentially accesses aggregate objects without exposing their internal representation.
- Mediator Pattern: Encapsulates the interactions of a group of objects using a mediator object, avoiding mesh communication.
- Memento Pattern: Captures the internal state of an object for later recovery.
- Vistor Pattern: Define new operations that can be performed on elements without changing their classes.
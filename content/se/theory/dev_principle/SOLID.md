---
title: SOLID
date: 2026-04-28
author: "ljf12825"
summary: SOLID overview
type: file
---

`SOLID`是面向对象五条设计原则的缩写，这些原则有助于构建可维护、可扩展、可读性强且健壮的代码

| 原则 | 名称 | 核心思想 |
| :- | - | - |
| `S`单一职责原则 | Single Responsibility Principle(SRP) | 一个类只负责一件事 |
| `O`开闭原则 | Open/Closed Principle(OCP) | 对扩展开放，对修改关闭 |
| `L`里氏替换原则 | Liskov Substitution Principle(LSP) | 子类可替换父类 |
| `I`接口隔离原则 | Interface Segregation Principle(ISP) | 接口要小、单一职责 |
| `D`依赖反转原则 | Dependency Inversion Principle(DIP) | 面向接口而非实现 |

## Single Responsibility Principle（SRP）

一个类应该只有一个引起它变化的原因，即一个类只负责一项职责（功能）\
好处：更易维护、调试，降低类之间的耦合度

### 不好的设计

`User`中既包含数据又包含打印逻辑

```cpp
class User {
public:
    std::string name;

    void PrintUser() {
        std::cout<< name << std::endl;
    }
};
```

### 好的设计

分离数据和逻辑

```cpp
class User {
public:
    std::string name;
};

class UserPrinter
{
public:
    void Print(User user) {
        std::cout << user.name << std::endl;
    }
};
```

## Opne/Closed Principle(OCP)

软件实体（类、模块、函数等）应该对扩展开放，对修改关闭，即：不修改已有代码的情况下添加新功能\
通常通过抽象和继承来实现

### 使用多态代替if-else

```cpp
class Shape {
public:
    virtual double Area() = 0;
};

class Circule : Shape {
public:
    double Radius;
    double Area() override { 3.14 * Radius * Radius; }
};

class Square : Shape {
public:
    double Side;
    double Area() override { Side * Side; }
};
```

## Liskov Substitution Principle(LSP)

子类对象必须能够替换其弗雷对象，并且行为仍然正确\
保证继承的正确性\
子类不应违背父类的预期行为

```cpp
class Bird {
public:
    virtual void Fly() { std::cout << "Flying" << std::endl; }
};

class Sparrow : Bird {}; // 行为正确

class Ostrich : Bird { // 行为错误
public:
    void Fly() override {
        throw std::logic_error("Function not implemented");
    }
}；
```

## Interface Segregation Principle(ISP)

不应该强迫客户端依赖他们不使用的接口\
接口应当小而专一，而不是臃肿庞大

### 不好的接口

```cpp
class IMultiFunctionDevice {
public:
	virtual void Print() = 0;
	virtual void Scan() = 0;
	virtual void Fax() = 0;
};
```

### 好的接口

```cpp
class IPrinter {
public:
	virtual void Print() = 0;
};

class IScanner {
public:
	virtual void Scan() = 0;
};

class SimplePrinter : IPrinter {
public:
	void Print() override { std::cout << "Printing" << std::endl; }
};
```

## Dependency Inversion Principle(DIP)

高层模块不应该依赖底层模块，二者都应该依赖抽象\
抽象不应该依赖细节，细节应该依赖抽象\
反转了高层对底层的直接依赖；让依赖由“高层->低层”变为“共同->抽象”；也让控制权从高层new，转移到外部注入

### 传统依赖（正向），不利于扩展和测试

```cpp
class MySQLDatabase {
public:
    void Connect() { std::cout << "Connect to MySQL" << std::endl; }
};

class UserRespository {
private:
    MySQLDatabase db; // 高层依赖了具体细节

public:
    void GetUser() {
        db.Connect();
        std::cout << "Getting user" << std::endl;
    }
};
```

### 依赖抽象

```cpp
class IDatabase {
public:
    virtual void Connect() = 0;
    virtual ~IDatabase() = default;
};

class MySQLDatabase : public IDatabase {
public:
    void Connect() override { std::cout << "Connect to MySQL" << std::endl; }
};

class UserRepository {
private:
    IDatabase* db; // 依赖于抽象

public:
    UserRepository(IDatabase* injectedDB) : db(injectedDB) {}

    void GetUser() {
        db->Connect();
        std::cout << "Getting user" << std::endl;
    }
};

// another example
class IMessageSender {
public:
    virtual void Send(const std::string& message) = 0;
    virtual ~IMessageSender() = default;
};

class EmailSender : public IMesageSender {
public:
    void Send(const std::string& message) override { std::cout << "Sending email" << message << std::endl; }
};

class NotificationService {
private:
    std::unique_ptr<IMessageSender> sender; // 实现依赖注入，不依赖具体细节

public:
    NotificationService(std::unique_ptr<IMessageSender> senderImpl) : sender(std::move(senderImpl)) {}

    void Notify(const std::string& message) { sender->Send(message); }
};
```

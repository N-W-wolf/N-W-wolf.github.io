---
title: Python/C++ 概念
description: 了解 Python 与 C++ 的面向对象结构、编译与解释执行方式，以及 CMake 与 import 等核心运行概念。
sidebar:
  order: 4
---

本节在前面说明：具有 C 语言基础的同学，可以自行使用 AI 通过问答形式，花费数个小时即可了解 C++ 语法。不过在那之前，重要的是掌握类 / 对象这一类概念，以及对 CMake 建立认识，这样才能建立起 C++ 的认识框架。在通过 AI 学习从 C 过渡到 C++ 之前，不妨先弄清楚下面正文介绍的概念，以便先建立整体认识。建议有 C 语言基础的同学先学习清楚 C++ 的面向对象的各种概念，随后再学习 Python；对于有 C 语言基础的同学来说，这两步不会很难。

## 一. 两种语言在机器人开发中的角色

| 语言 | 特点 | 常见用途 |
| --- | --- | --- |
| C++ | 编译后直接运行，性能高、贴近底层 | 运动控制、电机通信、实时性要求高的模块 |
| Python | 不需要单独编译，修改后立刻运行，开发效率高 | 训练脚本、数据整理、测试工具、ROS 2 节点与 launch 文件 |

机器人项目中两种语言经常同时出现：C++ 负责对实时性要求高的部分，Python 负责快速实现和调试工具，二者通过接口或通信互相配合。新成员不必纠结“只学哪一门”，更重要的是理解它们各自的结构和运行方式。

## 二. 面向对象

### 2.1 为什么需要面向对象

在程序规模较小时，把所有变量和函数放在一起也能工作。但机器人项目的代码会快速增长：电机控制、里程计、导航、传感器各自都有大量数据和函数。如果变量都散落在全局，程序里就会出现“谁都能改、改了不知道影响谁”的问题。

C 语言中，把“为同一个任务服务的变量和函数”组织在一起，主要靠文件划分和命名约定，例如把电机相关代码放在 `motor.c` 里，用 `motor_speed` 这样的名称避免冲突。但约定只对遵守它的人有效，语言本身并不阻止其他代码绕过约定直接操作变量。

C++ 提出了**类（class）**：它把为同一任务服务的变量和函数捆绑成一个整体，并把“哪些能改、哪些不能改”写进语言规则。这样，组织方式不再只靠自觉，而是由编译器保证。

类与对象的关系可以概括为下图：

![类与对象关系示意图](../assets/oop-objects-and-classes.svg '类与对象的关系：类是模板，对象是类的具体实例')

### 2.2 面向对象的四个核心概念

面向对象有四个核心概念：

- **封装（encapsulation）**：把数据和操作这些数据的方法放在一起，并通过访问控制隐藏内部细节，外部只能通过公开接口使用。
- **继承（inheritance）**：从已有类派生出新类，复用已有属性和方法，并在其上扩展或改写。
- **多态（polymorphism）**：同一套调用接口，不同类型的对象可以有不同的实现。
- **抽象（abstraction）**：提炼出一类事物共有的接口，忽略与使用无关的细节；使用方只需要知道“能做什么”，不需要知道“怎么做”。

### 2.3 实际场景：小车电机控制中的封装

以小车电机速度控制为例。C 风格的常见写法是定义一个全局变量，并约定只通过某个函数修改它：

```c
double motor_speed = 0.0;              // 全局变量
void set_motor_speed_g(double s) {
    motor_speed = s;
}
```

这个约定确实能工作，但它只是**人为约定**：如果某个地方直接写 `motor_speed = 999.0;`，编译器不会报错，程序依然合法。项目越大、全局变量越错综复杂，这种“绕过约定”的风险就越难控制。

C++ 的做法是把变量放进类里，并用访问控制保护：

```cpp
class MotorController {
private:
    double motor_speed;                // 外部不能直接访问

public:
    double getSpeed() const { return motor_speed; }
    void setSpeed(double s) { motor_speed = s; }
};
```

此时程序的其他位置只能这样读写：

```cpp
motor_controller.getSpeed();
motor_controller.setSpeed(0.5);
```

直接写 `motor_controller.motor_speed = 0.5;` 会被编译器拒绝，因为 `motor_speed` 是 `private`。更重要的是，`setSpeed()` 内部还可以加入限幅、更新状态、记录日志等逻辑，让每次修改都经过同一个入口。

封装的结构可以表示为下图：

![封装示意图](../assets/oop-encapsulation-interfaces.svg '封装示意：外部只能通过公开接口访问，私有数据与方法被隐藏')

在只有一个变量的例子里，封装的优势还不明显；当程序里有几十个模块、几百个变量互相牵扯时，把“同一任务的变量和函数”收进类里，并由语言强制访问规则，意义就非常大了。

这样的设计源于一个观察：程序中往往有一组函数和变量是为了同一个任务服务的。C 语言把这种关系交给文件划分和人为约定，C++ 则用 `class` 把它变成语言本身的结构。

### 2.4 实际场景：不同电机类型中的继承

小车上通常不只有一种电机：直流电机、舵机等控制方式不同，但它们都有共同点——保存目标速度或位置，并提供读写接口。C 语言中，常见做法是每种电机各写一套结构体和函数，速度变量和读写逻辑重复出现；或者用一个公共结构体加 `type` 字段，在使用处用 `switch` 判断类型，分支散落在代码各处。

C++ 的继承把“公共部分”放进基类，把“不同部分”放进派生类：

```cpp
class MotorController {
private:
    double motor_speed = 0.0;

public:
    double getSpeed() const { return motor_speed; }
    void setSpeed(double s) { motor_speed = s; }
};

class DCMotorController : public MotorController {
public:
    void applyPwm(double duty) { /* 直流电机特有：设置 PWM */ }
};

class ServoController : public MotorController {
public:
    void setAngle(double angle) { /* 舵机特有：设置角度 */ }
};
```

- `DCMotorController : public MotorController` 表示“直流电机控制器继承自电机控制器”。
- 派生类自动拥有 `motor_speed`、`getSpeed()`、`setSpeed()`，不需要重新写一遍。
- 派生类只需要补充自己特有的成员，例如 `applyPwm()`、`setAngle()`。

继承关系用下图表示更直观：

![继承示意图](../assets/oop-inheritance.svg '继承示意：Vehicle 是基类，Car、Truck 等派生类复用并扩展')

这样公共逻辑只维护一份，新增电机类型时只需要继承 `MotorController` 并写差异部分。继承的核心是“是一种（is-a）”关系：`DCMotorController` 是一种 `MotorController`。

### 2.5 实际场景：统一接口下的多态

继承解决了公共代码复用，但小车控制程序往往不希望关心“具体是哪一种电机”：上层只想对每台电机说“把速度设为 0.5”，由电机自己决定怎么执行。多态解决的就是这个问题：同一套调用接口，不同对象执行不同的实现。

C 语言要模拟这个效果，通常需要在结构体里放函数指针，或者在使用处写 `switch (type)` 判断电机类型；每新增一种电机，所有判断点都可能要改。C++ 用 `virtual` 把“调用哪个实现”交给语言在运行时决定：

```cpp
class MotorController {
public:
    virtual void setSpeed(double s) {
        // 默认实现
    }
};

class DCMotorController : public MotorController {
public:
    void setSpeed(double s) override {
        // 直流电机实现：换算成 PWM 占空比
    }
};

class ServoController : public MotorController {
public:
    void setSpeed(double s) override {
        // 舵机实现：换算成目标角度
    }
};
```

换成宠物例子看多态会更直观：`Pet` 定义统一的 `Speak()` 接口，`Cat` 和 `Dog` 各自实现，调用同一个 `Speak()` 会得到不同的行为。

![多态示意图](../assets/oop-polymorphism-pet.svg '多态示意：Cat 与 Dog 继承 Pet，同一个 Speak() 各自实现')

上层代码只需要持有 `MotorController` 的指针或引用：

```cpp
DCMotorController dc_motor;
ServoController servo_motor;

MotorController* motor = &dc_motor;
motor->setSpeed(0.5);    // 实际执行 DCMotorController 的实现

motor = &servo_motor;
motor->setSpeed(0.5);    // 实际执行 ServoController 的实现
```

对上层来说调用方式完全一样，实际执行的实现却不同。新增一种电机时，只需要写出自己的 `setSpeed()`，上层代码不需要改动。这正是多态：同一接口，多种实现。

### 2.6 实际场景：面向接口的抽象

多态让不同实现可以“接进来”，但如果没有规则约束，派生类可能忘记实现 `setSpeed()`，或者接口名称不一致。抽象把“必须提供什么接口”写进语言规则。

把基类中的接口声明为**纯虚函数**：

```cpp
class MotorController {
public:
    virtual void setSpeed(double s) = 0;    // 纯虚函数：只声明接口
    virtual double getSpeed() const = 0;
};
```

- `= 0` 表示这个函数没有通用实现，派生类必须自己实现。
- 这种类称为抽象类，不能直接创建对象，只能被继承。
- 派生类如果没有实现全部纯虚函数，也不能创建对象，编译器会报错。

抽象类的结构可以表示为下图：

![抽象类示意图](../assets/oop-abstract-methods.svg '抽象类示意：Shape 声明抽象方法 Area，Rectangle 必须实现')

C 语言中“必须提供某组函数”同样只能靠注释和约定；C++ 把这条规则变成编译期强制：漏实现就无法通过编译。上层代码只依赖 `MotorController` 这个抽象接口，就能统一操作任意一种电机，不需要知道具体类型。这就是“面向抽象（面向接口）编程”：只暴露“能做什么”，隐藏“怎么做”。

封装、继承、多态、抽象并不是四个孤立的技巧，而是一条连贯的思路：封装让数据有统一入口，继承让公共代码可以复用，多态让不同实现接入同一接口，抽象让上层只依赖接口本身。机器人项目中的控制器、传感器和通信模块都大量使用这套结构。

## 三. C++：编译与运行结构

### 3.1 编译的几种方式

C++ 本身只是语言，编译需要调用编译器（例如 GCC 的 `g++`）。工程上组织编译过程有几种常见方式：

| 方式 | 适合场景 | 说明 |
| --- | --- | --- |
| 直接调用编译器 | 一个或几个源文件 | `g++ main.cpp -o main`，手动写命令 |
| Makefile | 中小项目 | 用 `make` 按规则增量编译，比手动命令方便 |
| CMake | 大中型项目、跨平台 | 通过 `CMakeLists.txt` 描述构建规则，是目前最常见的组织方式 |

三种方式的本质都是调用编译器，区别只在于“谁来组织、怎么组织”编译过程。机器人项目中的 C++ 工程（尤其是 ROS 2 功能包）绝大多数使用 CMake。

无论用哪种方式，最终都遵循同一条编译流程：

![C++ 编译流程示意图](../assets/compiled-code-flow-diagram.svg 'C++ 编译流程：源代码经过编译器成为目标代码，再由执行器运行并产生输出')

### 3.2 CMake 是什么

CMake 是一个跨平台的**构建系统生成器**：它不直接编译，而是先读取项目根目录的 `CMakeLists.txt`，根据其中的规则生成构建配置（例如 Makefile 或 Ninja），再调用编译器完成编译。

![CMake 徽标](../assets/cmake-logo.svg 'CMake 徽标（来源：Wikimedia Commons，CC BY 2.0）'){width=25%}

使用 CMake 通常分两步：

1. **配置**：读取 `CMakeLists.txt`，生成构建目录。
2. **编译**：使用生成的构建配置编译出可执行文件。

### 3.3 最小示例：用 CMake 编译一个 C++ 程序

项目结构：

```text
hello_cmake/
├── CMakeLists.txt
└── src/
    └── main.cpp
```

`CMakeLists.txt`：

```cmake
cmake_minimum_required(VERSION 3.16)
project(hello_cmake LANGUAGES CXX)

add_executable(hello src/main.cpp)
```

- `cmake_minimum_required`：声明需要的最低 CMake 版本。
- `project(hello_cmake LANGUAGES CXX)`：声明项目名称和使用的语言（C++）。
- `add_executable(hello src/main.cpp)`：把 `src/main.cpp` 编译成一个名为 `hello` 的可执行文件。

`src/main.cpp` 先写一个最简单的程序：

```cpp
#include <iostream>

int main() {
    std::cout << "Hello from C++" << std::endl;
    return 0;
}
```

在项目根目录执行：

```bash
cmake -S . -B build     # 配置：读取 CMakeLists.txt，生成 build/ 下的构建配置
cmake --build build     # 编译：生成可执行文件
./build/hello           # 运行
```

`-S .` 表示源代码目录是当前目录，`-B build` 表示把构建产物放在 `build/` 目录，避免污染源代码目录。看到项目里的 `build/` 目录时，可以理解为“这是 CMake 生成的中间产物”。

## 四. Python：解释执行与模块结构

### 4.1 Python 如何运行

Python 不需要像 C++ 那样提前编译。运行时由 **Python 解释器**读取源代码并执行；为了效率，解释器会先把源代码翻译成中间字节码，再逐条执行（`__pycache__` 目录里的 `.pyc` 文件就是字节码缓存）。

运行结构：

```text
源代码（.py）
        ↓ Python 解释器读取
字节码
        ↓ 逐条执行
程序运行结果
```

好处是修改后可以直接重新运行，适合快速试验；代价是运行速度比编译后的 C++ 慢，且很多错误要等到运行时才暴露。

### 4.2 import：模块、包与类库

Python 程序通常由多个文件组成，通过 `import` 把其他文件的代码拿进来使用。相关概念：

| 概念 | 是什么 | 例子 |
| --- | --- | --- |
| 模块（module） | 一个 `.py` 文件 | `math.py` 提供数学函数 |
| 包（package） | 包含多个模块的目录，通常带 `__init__.py` | 一个存放多个模块的文件夹 |
| 类库 / 库（library） | 一组模块或包的集合，提供完整功能 | 标准库、`numpy`、`matplotlib` |
| import | 导入并使用模块中的代码 | `import numpy as np` |

常见写法：

```python
import math                  # 导入标准库模块
import numpy as np           # 导入第三方库并起别名
from my_robot import Robot   # 从自己的模块中导入类
```

- `import math` 之后，可以用 `math.sqrt(4)` 调用其中的函数。
- `import numpy as np` 是机器人、深度学习项目中非常常见的写法，`as` 只是给模块起一个短别名。
- `from my_robot import Robot` 表示“从 `my_robot.py` 这个模块中导入 `Robot` 类”，适合导入自己项目中写的代码。

Python 的包和库是“文件组织方式”的概念：目录里放模块就形成包，包和模块集合起来形成库。机器人项目中常遇到的 `rclpy` 就是 ROS 2 的 Python 客户端库，`import rclpy` 之后就可以在 Python 里创建 ROS 2 节点。

### 4.3 一个小例子：模块与对象

`my_robot.py` 定义类，`main.py` 导入并创建对象：

```python
# my_robot.py
class Robot:
    def __init__(self, name):
        self.name = name
        self.battery = 100

    def walk(self):
        print(f"{self.name} 正在行走")
```

```python
# main.py
from my_robot import Robot

robot = Robot("nwwolf")   # 根据类创建对象
robot.walk()              # 调用对象的方法
```

```bash
python3 main.py
```

这个例子同时体现了本节两个核心结构：`class Robot` 是类，`robot` 是按类创建的对象；`from my_robot import Robot` 是 Python 模块之间的组织方式。语法细节现在不必完全掌握，重点是理解“类 → 对象 → 通过对象调用行为”和“文件 → 模块 → import”这两条结构。

## 五. 两种语言运行结构对比

| 对比项 | C++ | Python |
| --- | --- | --- |
| 运行方式 | 先编译成可执行文件，再直接运行 | 解释器读取源码并执行 |
| 修改后 | 需要重新编译 | 直接重新运行 |
| 运行速度 | 快 | 相对慢 |
| 错误发现时机 | 编译期能发现部分类型错误 | 多数错误在运行时才暴露 |
| 典型用途 | 实时控制、底层模块 | 脚本、工具、训练与数据处理 |

## 六. 本节验证

学完本节后，你应该能：

1. 用自己的话解释类与对象的区别，并举一个机器人相关的例子。
2. 说出 C++ 为什么需要编译，以及直接编译器命令、Makefile、CMake 分别适合什么场景。
3. 照着示例用 `cmake -S . -B build` 和 `cmake --build build` 编译一个简单 C++ 程序。
4. 说出模块、包、类库和 `import` 之间的关系，并能读懂 `import numpy as np`。
5. 说明在机器人项目中，C++ 和 Python 通常分别承担什么角色。

## 参考资料

- [CMake 官方文档](https://cmake.org/documentation/)
- [Python 官方文档：模块](https://docs.python.org/zh-cn/3/tutorial/modules.html)
- [Python 官方文档：类](https://docs.python.org/zh-cn/3/tutorial/classes.html)
- 本页配图来自 [Wikimedia Commons](https://commons.wikimedia.org/)：除 CMake 徽标为 CC BY 2.0（作者：CMake 团队）外，其余均为公有领域或 CC0 协议。

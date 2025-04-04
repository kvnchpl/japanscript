
# JAPANSCRIPT Japanese-Inspired Programming Language Specification

This specification defines a Japanese-inspired programming language designed to emphasize Japanese syntactic structures (subject-object-verb), avoid loanwords, and use Sino-Japanese vocabulary for clarity and cultural alignment. The language favors terse single-kanji or two-kanji keywords for efficiency while maintaining a poetic, readable form.

---

## Table of Contents
- [Overview](#overview)
- [Design Principles](#design-principles)
- [Language Modes](#language-modes)
- [Particle Usage](#particle-usage)
- [Core Syntax](#core-syntax)
- [Keyword Glossary](#keyword-glossary)
- [Function Definitions](#function-definitions)
- [Control Flow](#control-flow)
- [Loops](#loops)
- [Error Handling](#error-handling)
- [Modules and Imports](#modules-and-imports)
- [Types and Literals](#types-and-literals)
- [Classes and Objects](#classes-and-objects)

---

## Overview

- This language is largely based on Javascript.
- Block-based with curly braces (`{ }`), semicolon-less, SOV structured.

---

## Design Principles

- **Type Handling**: Dynamic types following conventions from JavaScript
- **Scoping**: Lexical/block scoping
- **SOV Structure**: Subject–Object–Verb enforced for all statements.
- **Keyword Minimalism**: 1–2 kanji/kana keywords.
- **Variable Declaration**: `宣言` (block-scoped) and `定義` (function-scoped).
- **No Katakana**: Modern loanwords avoided.
- **Particle-Driven Syntax**: Syntax defined through `を`, `に`, `は`, and `なら`.
- **Readable Long Forms**: All keywords use long form only (e.g., `返却`, not `返`).

---

## Language Modes

| Feature        | JS-style                      |
|----------------|-------------------------------|
| Block syntax   | Curly braces `{ }`            |
| Line endings   | Line break (`\n`)             |
| Comment syntax | `//` or `注:`                  |
| Parsing style  | JavaScript-like               |

---

## Particle Usage

- Particles define relationships and allow flexible ordering:

| Particle | Role                | Example                         |
|----------|---------------------|----------------------------------|
| `を`     | Direct object marker | `"文字列" を 表示`              |
| `に`     | Indirect object      | `x に 3 を 代入`                |
| `は`     | Conditional subject  | `x は 1 なら ...`              |
| `なら`   | Conditional marker   | `他 なら ...`                   |

- Ordering can be flexible: `3 を x に 代入` = `x に 3 を 代入`.

---

## Core Syntax

```javascript
「こんにちは世界」 を 表示
x に 3 を 代入
x は 5 なら {
  「五です」 を 表示
}
x を 返却
```

---

## Keyword Glossary

| Keyword | Meaning   | Notes                                         |
|---------|-----------|-----------------------------------------------|
| `宣言`  | let       | Block-scoped variable declaration             |
| `定義`  | var       | Function-scoped (hoisted) declaration         |
| `構造`  | class     | Class/structure definition                    |
| `生成`  | new       | Instantiate a new object                      |
| `自身`  | this      | Refers to the current instance                |
| `継承`  | extends   | Class inheritance                             |
| `親`    | super     | Call parent class methods from subclass       |
| `列挙`  | enum      | Declare an enumerated type                 |
| `抽象`  | abstract  | Defines abstract classes or methods           |
| `静的`  | static    | Defines a static method                       |
| `継続`  | continue  | Skip to the next iteration in a loop          |
| `停止`  | break     | Exit the loop immediately                     |
| `代入`  | assign    | Assign value to variable                      |
| `返却`  | return    | Return a value from a function                |
| `表示`  | print     | Output to console                             |
| `繰返`  | repeat    | Loop construct                                |
| `関数`  | function  | Function declaration                          |
| `試み`  | try       | Try block                                     |
| `捕捉`  | catch     | Catch block                                   |
| `取込`  | import    | Module import                                 |
| `結合`  | export    | Module export                                 |
| `他`    | else      | Alternate conditional branch                  |

---

## Function Definitions

```javascript
関数 add(a, b) {
  a + b を 返却
}
```

---

## Control Flow

- `他` is used for `else`, and `他 ... なら` is used for `else if`.

```javascript
x は 1 なら {
  「一です」 を 表示
} 他 x は 2 なら {
  「二です」 を 表示
} 他 {
  「一でも二でもありません」 を 表示
}
```



### Pattern Matching

Japanscript supports expressive pattern matching using the `判別` and `場合` keywords, with optional guards using `なら`.

```javascript
value を 判別 {
  1 場合: 「一です」 を 表示
  x 場合 x > 5 なら: 「5より大きい」 を 表示
  他: 「その他の値」 を 表示
```

### Destructuring in Pattern Matching

Japanscript allows pattern matching on object and array structures directly within `場合`.

#### Object Destructuring

```javascript
person を 判別 {
  { name: n, age: 20 } 場合: n + 「は20歳です」 を 表示
  他: 「情報不足」 を 表示
}
```

- Binds `n` to person.name
- Matches only if `person.age === 20`

#### Array Destructuring

```javascript
[1, 2] を 判別 {
  [a, b] 場合: a + b を 表示
  他: 「配列形式でない」 を 表示
}
```

- Binds `a = 1`, `b = 2`
- Matches if the array length and structure align


- Each `場合` clause is matched in order.
- Guards can be added after a pattern using `条件 なら`.
- `他` acts as the default fallback case.
- Values in `場合` may bind to a variable for use in the guard or block.

## Loops

```javascript
0 を i に 代入

i < 10 なら {
  i は 3 なら {
    継続
  }

  i は 7 なら {
    停止
  }

  i を 表示
  i + 1 を i に 代入
} を 繰返
```

---

## Error Handling

```javascript
試み {
  dangerousFunction();
} 捕捉 (過誤) {
  「過誤が発生しました: 」 + 過誤 を 表示
}
```

---

## Modules and Imports

```javascript
mathutils から addition を add として 取込
add(10, 20) を 表示
```

---

## Types and Literals

- `真`, `偽`, `無` for true, false, null.
- Strings: `「」` preferred, `" "` optional.
- Numbers follow JS rules.
- String concatenation behaves like in JavaScript using `+`. E.g. `「a」 + 「b」` → `「ab」`
- Objects can also be defined as literals using `{}` with `key: value` pairs. Nested objects are supported.
- Both dot notation (`obj.prop`) and bracket notation (`obj["prop"]`) are allowed for property access.

---

## Type System

Japanscript supports an optional type system for both static clarity and runtime validation.

### Type Annotations

You can annotate function parameters and return types using `:`.

```javascript
関数 add(a: 数, b: 数): 数 {
  a + b を 返却
}
```

- Type annotations are optional and ignored at runtime unless explicitly checked.

### Built-in Types

| Japanscript | Meaning      |
|-------------|--------------|
| `数`        | Number       |
| `文`        | String       |
| `真偽`      | Boolean      |
| `配`        | Array        |
| `物`        | Object       |
| `無`        | Null         |

---

### Custom Type Definitions

Define your own types using `型`:

```javascript
型 Person {
  name: 文,
  age: 数
}
```

You can use these types in annotations or pattern matching.

---

### Runtime Type Guards

Use `は 型 なら` for checking types inline:

```javascript
x は 数 なら: 「これは数です」 を 表示
x は 文 なら: 「これは文字列です」 を 表示
```

This works within any conditional expression and pattern matching guard.

## Classes and Objects

- Japanscript supports class-like structures using the `構造` keyword. Object instances are created using `生成`, and instance methods can refer to the current object using `自身`.

```javascript
構造 Person {
  関数 初期(name, age) {
    name を 自身.name に 代入
    age を 自身.age に 代入
  }

  関数 introduce() {
    「私は」 + 自身.name + 「、」 + 自身.age + 「歳です」 を 表示
  }
}

生成(Person, "花子", 20) を Hanako に 代入
Hanako.introduce()
```

```javascript
person を {
  name: 「花子」,
  age: 20,
  introduce: 関数() {
    「私は」 + 自身.name + 「、」 + 自身.age + 「歳です」 を 表示
  }
} に 宣言
```

- Properties are dynamically added to `自身`, just like in JavaScript.
- An alternative instantiation form `var を Class に 生成(...)` is idiomatic to Japanscript and reads as: “create an instance of Class with args, assign it to var.”

---

## Inheritance and Static Methods

Japanscript supports classical inheritance and static methods.

### Inheritance

Use `継承` to inherit one class from another using the pattern:

```javascript
構造 ChildClass は ParentClass を 継承 {
  関数 ...() {
    ...
  }
}
```

Example:
```javascript
構造 Animal {
  関数 初期(name) {
    name を 自身.name に 代入
  }

  関数 鳴く() {
    「...」 を 表示
  }
}

構造 Dog は Animal を 継承 {
  関数 鳴く() {
    「ワン！」 を 表示
  }
}
```

## Superclass Method Access

Japanscript allows a subclass to invoke methods from its parent class using the `親` keyword.

Example:
```javascript
構造 Animal {
  関数 鳴く() {
    「動物の鳴き声」 を 表示
  }
}

構造 Dog は Animal を 継承 {
  関数 鳴く() {
    親.鳴く()
    「ワン！」 を 表示
  }
}
```

## Abstract Classes and Methods

Japanscript allows you to define abstract classes and methods using the `抽象` keyword.

### Abstract Class

```javascript
抽象 構造 Shape {
  抽象 関数 area() {
    「未実装です」 を 表示
  }
}
```

### Concrete Implementation

```javascript
構造 Circle は Shape を 継承 {
  関数 area() {
    3.14 * 自身.radius * 自身.radius を 返却
  }
}
```

### Rules

- Classes defined with `抽象 構造` cannot be instantiated.
- Methods defined with `抽象 関数` should be overridden by a subclass.
- Calling an abstract method without implementation raises a runtime error.

### Static Methods

Static methods use the `静的` keyword and are called on the class itself.

```javascript
構造 Math {
  静的 関数 add(a, b) {
    a + b を 返却
  }
}

Math.add(3, 4) を 表示
```

---

## Enums

Japanscript supports enumeration types using the `列挙` keyword.

### Basic Enum

```javascript
列挙 Color {
  RED,
  BLUE,
  GREEN
}

Color.RED を 宣言
```

### Enum with Values

```javascript
列挙 Status {
  OPEN: 1,
  CLOSED: 0
}

Status.CLOSED を 宣言
```

### Conditionals with Enums

```javascript
door.Status は Status.CLOSED なら {
  「ドアは閉じています」 を 表示
}
```

### Pattern Matching with Enums

```javascript
Status を 判別 {
  Status.OPEN 場合: 「開いています」 を 表示
  Status.CLOSED 場合: 「閉じています」 を 表示
  他: 「未知の状態」 を 表示
}
```

- Enum values are namespaced under the enum identifier (e.g., `Status.CLOSED`)
- Optional value assignments are supported
- Enums integrate with conditionals and pattern matching
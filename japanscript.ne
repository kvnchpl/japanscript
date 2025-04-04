Program -> _ StatementList _

StatementList -> Statement
               | StatementList _ Statement

Statement -> FunctionDeclaration
           | VariableDeclaration
           | ReturnStatement
           | FunctionCall
           | IfStatement
           | LoopStatement
           | TryCatchStatement
           | ClassDeclaration
           | EnumDeclaration
           | PatternMatching

// Function Declaration
FunctionDeclaration -> "関数" _ Identifier _ "(" _ ParameterList _ ")" _ Block

ParameterList -> Identifier
               | ParameterList _ "," _ Identifier

// Variable Declaration
VariableDeclaration -> ("宣言" | "定義") _ Identifier _ "に" _ Expression

// Return Statement
ReturnStatement -> Expression _ "を" _ "返却"

// Function Call
FunctionCall -> Expression _ "を" _ Identifier

// If Statement
IfStatement -> Expression _ "なら" _ Block
             | Expression _ "なら" _ Block _ "他" _ Block

// Loop Statement
LoopStatement -> Expression _ "を" _ "繰返"

// Try-Catch Statement
TryCatchStatement -> "試み" _ Block _ "捕捉" _ "(" _ Identifier _ ")" _ Block

// Class Declaration
ClassDeclaration -> "構造" _ Identifier _ Block
                  | "構造" _ Identifier _ "は" _ Identifier _ "を" _ "継承" _ Block

// Enum Declaration
EnumDeclaration -> "列挙" _ Identifier _ "{" _ EnumList _ "}"

EnumList -> Identifier
          | EnumList _ "," _ Identifier

// Pattern Matching
PatternMatching -> Expression _ "を" _ "判別" _ "{" _ PatternList _ "}"

PatternList -> Pattern
             | PatternList _ Pattern

Pattern -> Expression _ "場合" _ ":" _ Block
         | Expression _ "場合" _ Expression _ "なら" _ ":" _ Block
         | "他" _ ":" _ Block

// Block
Block -> "{" _ StatementList _ "}"

// Expressions
Expression -> Identifier
            | Literal
            | Expression _ Operator _ Expression
            | "(" _ Expression _ ")"

// Literals
Literal -> Number
         | String
         | "真" | "偽" | "無"

// Operators
Operator -> "+" | "-" | "*" | "/" | "==" | "!=" | "<" | ">" | "<=" | ">="

// Identifiers
Identifier -> [a-zA-Z_][a-zA-Z0-9_]*

// Whitespace
_ -> " " | "\n"
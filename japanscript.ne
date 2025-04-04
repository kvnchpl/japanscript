
Program -> _ StatementList _

StatementList -> Statement
               | StatementList _ Statement

Statement -> FunctionDeclaration
           | ReturnStatement
           | FunctionCall

FunctionDeclaration -> "関数" _ "挨拶" _ "(" _ "名前" _ ")" _ Block

FunctionCall -> "名前" _ "を" _ "表示"

ReturnStatement -> "名前" _ "を" _ "返却"

Block -> "{" _ StatementList _ "}"

_ -> " " | "\n"


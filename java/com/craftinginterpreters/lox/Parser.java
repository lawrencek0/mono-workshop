package com.craftinginterpreters.lox;

import java.util.ArrayList;
import java.util.List;

import static com.craftinginterpreters.lox.TokenType.*;

class Parser {
  private static class ParseError extends RuntimeException {}
  private final List<Token> tokens;
  private int current;
  
  Parser(List<Token> tokens) {
    this.tokens = tokens;
  }
  
  private ParseError error(Token token, String message) {
    Lox.error(token, message);
    return new ParseError();
  }
  
  private void synchronize() {
    advance();
    
    while (!isAtEnd()) {
      if (previous().type == SEMICOLON) return;
      
      switch (peek().type) {
        case FOR:
        case WHILE:
        case CLASS:
        case RETURN:
        case VAR:
        case IF:
        case PRINT:
        case FUN:
          return;
      }
      
      advance();
    }
  }
  
  public List<Stmt> parse() {
    List<Stmt> statements = new ArrayList<>();
    
    while (!isAtEnd()) {
       statements.add(declaration());
    }
    
    return statements;
  }
  
  private Stmt declaration() {
    try {
      if (match(VAR)) {
        return varDeclaration();
      }
      return statement();
    } catch (ParseError error) {
      synchronize();
      return null;
    }
  }
  
  private Stmt varDeclaration() {
    Token name = consume(IDENTIFIER, "Expect variable name.");
    
    Expr initializer = null;
    
    if (match(EQUAL)) {
      initializer = expression();
    }
    
    consume(SEMICOLON, "Expect ';' after variable declaration.");
    
    return new Stmt.Var(name, initializer);
  }
  
  private Stmt statement() {
    if (match(PRINT)) {
      return printStatement();
    }
    
    if (match(LEFT_BRACE)) {
      return new Stmt.Block(block());
    }
    
    return expressionStatement();
  }
  
  private Stmt printStatement() {
    Expr expr = expression();
    consume(SEMICOLON, "Expect ';' after value.");
    return new Stmt.Print(expr);
  }
  
  private Stmt expressionStatement() {
    Expr expr = expression();
    consume(SEMICOLON, "Expect ';' after value.");
    return new Stmt.Expression(expr);
  }
  
  private List<Stmt> block() {
    List<Stmt> statements = new ArrayList<>();
    
    while(!check(RIGHT_BRACE) && !isAtEnd()) {
    	statements.add(declaration());
    }
    
    consume(RIGHT_BRACE, "Expect '}' after block.");
    
    return statements;
  }
  
  private Token peek() {
    return tokens.get(current);
  }
  
  private Token previous() {
    return tokens.get(current - 1);
  }
  
  private boolean isAtEnd() {
    return peek().type == EOF;
  }
  
  private Token advance() {
    if (!isAtEnd()) {
      current++;
    }
    
    return previous();
  }
  
  private Token consume(TokenType type, String message) {
    if (check(type)) {
      return advance();
    }
    
    throw error(peek(), message);
  }
    
  
  private boolean check(TokenType type) {
    if (isAtEnd()) {
      return false;
    }
    return peek().type == type;
  }
  
  private boolean match(TokenType... types) {
    for (TokenType type: types) {
      if (check(type)) {
        advance();
        return true;
      }
    }
    
    return false;
  }
  
  private Expr expression() {
    return assignment();
  }
  
  private Expr assignment() {
    Expr expr = equality();
    
    if (match(EQUAL)) {
      Token equals = previous();
      Expr value = assignment();
      
      if (expr instanceof Expr.Var) {
        Token name = ((Expr.Var)expr).name;
        return new Expr.Assign(name, value);
      }
      
      error(equals, "Invalid assignment target.");
    }
    
    return expr;
  }
  
  private Expr comma() {
    Expr expr = equality();
    
    while(match(COMMA)) {
      Token operator = previous();
      Expr right = equality();
      expr = new Expr.Binary(expr, operator, right);
    }
    
    return expr;
  }
  
  /* private Expr ternary() {
    Expr expr = equality();
    
    if (match(QUESTION)) {
      Token operator = previous();
      Expr trueCase = expression();
      consume(COLON, "Expect ':' between the cases of ternary operation.");
      Expr falseCase = equality();
      expr = new Expr.Binary(expr, trueCase, falseCase);
    }
    
    return expr;
  } */
    
  
  private Expr equality() {
    Expr expr = comparision();
    
    while(match(BANG_EQUAL, EQUAL_EQUAL)) {
      Token operator = previous();
      Expr right = comparision();
      expr = new Expr.Binary(expr, operator, right);
    }
    
    return expr;
  }
  
  private Expr comparision() {
    Expr expr = addition();
    
    while (match(GREATER, GREATER_EQUAL, LESS, LESS_EQUAL)) {
      Token operator = previous();
      Expr right = addition();
      expr = new Expr.Binary(expr, operator, right);
    }
    
    return expr;
  }
  
  private Expr addition() {
    Expr expr = multiplication();
    
    while (match(PLUS, MINUS)) {
      Token operator = previous();
      Expr right = multiplication();
      expr = new Expr.Binary(expr, operator, right);
    }
    
    return expr;
  }
  
  private Expr multiplication() {
    Expr expr = unary();
    
    while (match(STAR, SLASH)) {
      Token operator = previous();
      Expr right = unary();
      expr = new Expr.Binary(expr, operator, right);
    }
    
    return expr;
  }
  
  private Expr unary() {
    if (match(MINUS, BANG)) {
      Token operator = previous();
      Expr expr = unary();
      expr = new Expr.Unary(operator, expr);
    }
    
    return primary();
  }
  
  private Expr primary() {
    if (match(FALSE)) return new Expr.Literal(false);
    if (match(TRUE)) return new Expr.Literal(true);
    if (match(NIL)) return new Expr.Literal(null);
    
    if (match(NUMBER, STRING)) return new Expr.Literal(previous().literal);
    
    if (match(IDENTIFIER)) return new Expr.Var(previous());
    
    if (match(LEFT_PAREN)) {
      Expr expr = expression();
      consume(RIGHT_PAREN, "Expect ')' after expression.");
      return new Expr.Grouping(expr);
    }
    
    if (match(COMMA)) {
      error(previous(), "Missing left-hand operand.");
      comma();
      return null;
    }
    
    if (match(EQUAL_EQUAL, BANG_EQUAL)) {
      error(previous(), "Missing left-hand operand.");
      equality();
      return null;
    }
    
    if (match(GREATER, GREATER_EQUAL, LESS, LESS_EQUAL)) {
      error(previous(), "MIssing left-hand operand.");
      comparision();
      return null;
    }
    
    if (match(PLUS, MINUS)) {
      error(previous(), "Missing left-hand operand.");
      addition();
      return null;
    }
    
    if (match(STAR, SLASH)) {
      error(previous(), "Missing left-hand operand.");
      multiplication();
      return null;
    }
    
    throw error(peek(), "Expect expression");
  }
}

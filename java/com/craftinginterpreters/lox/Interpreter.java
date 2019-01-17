package com.craftinginterpreters.lox;

import static com.craftinginterpreters.lox.TokenType.*;

class Interpreter implements Expr.Visitor<Object> {
  void interpret(Expr expr) {
    try {
      Object value = evaluate(expr);
      System.out.println(stringify(value));
    } catch (RuntimeError error) {
      Lox.runtimeError(error);
    }
  }
  
  private String stringify(Object object) {
    if (object == null) { return "nill"; }
    
    if (object instanceof Double) {
      String text = object.toString();
      if (text.endsWith(".0")) {
        text = text.substring(0, text.length() - 2);
      }
      return text;
    }
    
    return object.toString();
  }
  
  private Object evaluate(Expr expr) {
    return expr.accept(this);
  }
  
  private boolean isEqual(Object a, Object b) {
    if (a == null && b == null) {
      return true;
    }
    
    if (a == null) {
      return true;
    }
    
    return a.equals(b);
  }
  
  private boolean isTruthy(Object object) {
    if (object == null) return false;
    if (object instanceof Boolean) return (boolean)object;
    
    return true;
  }
  
  private void checkNumberOperand(Token operator, Object operand) {
    if (operand instanceof Double) return;
    throw new RuntimeError(operator, "Operand must be a number.");
  }
  
  private void checkNumberOperands(Token operator, Object left, Object right) {
    if (left instanceof Double && right instanceof Double) return;
    throw new RuntimeError(operator, "Operands must be numbers.");
  }
  
  @Override
  public Object visitLiteralExpr(Expr.Literal expr) {
    return expr.value;
  }
  
  @Override
  public Object visitGroupingExpr(Expr.Grouping expr) {
    return evaluate(expr.expression);
  }
  
  @Override
  public Object visitUnaryExpr(Expr.Unary expr) {
    Object right = evaluate(expr.right);
    
    switch (expr.operator.type) {
      case MINUS:
        checkNumberOperand(expr.operator, right);
        return -(double)right;
      case BANG:
        return !isTruthy(right);
    }
    
    return null;
  }
  
  @Override
  public Object visitBinaryExpr(Expr.Binary expr) {
    Object left = evaluate(expr.left);
    Object right = evaluate(expr.right);
    
    switch (expr.operator.type) {
      case MINUS:
        checkNumberOperands(expr.operator, left, right);
        return (double)left - (double)right;
      case PLUS:
        if (left instanceof Double && right instanceof Double) {
          return (double)left + (double)right;
        }
        
        if (left instanceof String && right instanceof String) {
          return (String)left + (String)right;
        }
        throw new RuntimeError(expr.operator, "Operands must be strings.");
      case SLASH:
        checkNumberOperands(expr.operator, left, right);
        return (double)left / (double)right;
      case STAR:
        checkNumberOperands(expr.operator, left, right);
        return (double)left * (double)right;
      case GREATER:
        checkNumberOperands(expr.operator, left, right);
        return (double)left > (double)right;
      case GREATER_EQUAL:
        checkNumberOperands(expr.operator, left, right);
        return (double)left >= (double)right;
      case LESS:
        checkNumberOperands(expr.operator, left, right);
        return (double)left < (double)right;
      case LESS_EQUAL:
        checkNumberOperands(expr.operator, left, right);
        return (double)left <= (double)right;
      case EQUAL_EQUAL:
        checkNumberOperands(expr.operator, left, right);
        return isEqual(left, right);
      case BANG_EQUAL:
        checkNumberOperands(expr.operator, left, right);
        return !isEqual(left, right);
    }
    
    return null;
  }   
}

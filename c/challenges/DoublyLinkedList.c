#include <stdlib.h>
#include <string.h>
#include <stdio.h>

typedef struct Node {
  char* data;
  struct Node* prev;
  struct Node* next;
} Node;

typedef struct DoublyLinkedList {
  int size;
  Node* head;
  Node* tail;
} DoublyLinkedList;

Node* newNode(char* str) {
  Node* node = malloc(sizeof(Node));
  node->data = malloc(strlen(str) + 1);
  strcpy(node->data, str);
  node->prev = NULL;
  node->next = NULL;
  return node;
}

void deleteNode(Node *node) {
  free(node->data);
  node->prev = NULL;
  node->next = NULL;
  free(node);
}

DoublyLinkedList* newList(void) {
  DoublyLinkedList* list = malloc(sizeof(DoublyLinkedList));
  list->size = 0;
  list->head = NULL;
  list->tail = NULL;
  return list;
}

void printList(DoublyLinkedList* list) {
  Node* node = list->head;
  
  while (node != NULL) {
    printf("%s ", node->data);
    node = node->next;
  }
  
  putchar('\n');
}

void deleteList(DoublyLinkedList* list) {
  Node *node;
  
  while ((node = list->head) != NULL) {
    list->head = list->head->next;
    deleteNode(node);
  }
  
  free(list);
}

void insertAfter(DoublyLinkedList* list, Node* node, Node* newNode) {
  newNode->prev = node;
  if (node->next != NULL) {
    newNode->next = node->next;
    node->next->prev = newNode;
  } else {
    list->tail = newNode;
  }
  node->next = newNode;
  list->size++;
}

void insertBefore(DoublyLinkedList* list, Node* node, Node* newNode) {
  newNode->next = node;
  if (node->prev != NULL) {
    newNode->prev = node->prev;
    node->prev->next = newNode;
  } else {
    list->head = newNode;
  }
  node->prev = newNode;
  list->size++;
}

void insertBeginning(DoublyLinkedList* list, Node* newNode) {
  if (list->head != NULL) {
    insertBefore(list, list->head, newNode);
  } else {
    list->tail = newNode;
    list->size++;
  }
  list->head = newNode;
}

void insertEnd(DoublyLinkedList* list, Node* newNode) {
  if (list->tail != NULL) {
    insertAfter(list, list->tail, newNode);
  } else {
    list->head = newNode;
    list->size++;
  }
  list->tail = newNode;
}

void removeNode(DoublyLinkedList* list, Node* node) {
  if (node->prev == NULL) {
    list->head = node->next;
  } else {
    node->prev->next = node->next;
  }
  
  if (node->next == NULL) {
    list->tail = node->prev;
  } else {
    node->next->prev = node->prev;
  }
  list->size--;
  deleteNode(node);
}
  
int main(void) {
  DoublyLinkedList* list = newList();
  
  insertBeginning(list, newNode("hello"));
  insertAfter(list, list->head, newNode("world"));
  printList(list);
  printf("Size: %d\n", list->size);
  putchar('\n');
  
  removeNode(list, list->head);
  insertBefore(list, list->tail, newNode("Hello"));
  insertAfter(list, list->head, newNode(","));
  removeNode(list, list->tail);
  insertEnd(list, newNode("World"));
  insertAfter(list, list->tail, newNode("!"));
  printList(list);
  printf("Size: %d\n", list->size);
  
  deleteList(list);
  
  return 0;
}
   

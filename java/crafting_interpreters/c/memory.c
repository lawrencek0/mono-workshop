#include <stdlib.h>

#include "common.h"
#include "memory.h"
#include "vm.h"

void* reallocate(void* previous, size_t oldsize, size_t newsize) {
  if (newsize == 0) {
    free(previous);
    return NULL;
  }
  
  return realloc(previous, newsize);
}

static void freeObject(Obj* object) {
  switch (object->type) {
    case OBJ_STRING: {
      ObjString* string = (ObjString*)object;
      FREE_ARRAY(char, string->chars, string->length + 1);
      FREE(ObjString, string);
      break;
    }
  }
}
      

void freeObjects() {
  Obj* object = vm.objects;
  while (object != NULL) {
    Obj* next = object->next;
    freeObject(object);
    object = next;
  }
}

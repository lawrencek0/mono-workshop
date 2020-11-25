import java.util.Iterator;
import java.util.NoSuchElementException;

public class Deque<Item> implements Iterable<Item> {
    private Node head;
    private Node tail;
    private int size;

    private class Node {
        private Item item;
        private Node prev;
        private Node next;

        private Node(Item i) {
            this.item = i;
        }
    }

    private class ListIterator implements Iterator<Item> {
        private Node current = head == null ? tail : head;

        @Override
        public boolean hasNext() {
            return current != null;
        }

        @Override
        public Item next() {
            if (!hasNext()) {
                throw new NoSuchElementException();
            }
            Item i = current.item;
            current = current.next;
            return i;
        }

        @Override
        public void remove() {
            throw new UnsupportedOperationException();
        }
    }

    // construct an empty deque
    public Deque() {
        this.size = 0;
    }

    // is the deque empty?
    public boolean isEmpty() {
        return this.size == 0;
    }

    // return the number of items on the deque
    public int size() {
        return this.size;
    }

    // add the item to the front
    public void addFirst(Item item) {
        if (item == null) {
            throw new IllegalArgumentException();
        }

        Node newHead = new Node(item);

        if (head != null) {
            newHead.next = head;
            head.prev = newHead;

            if (head.next == null && tail == null) {
                tail = head;
            }
        }

        head = newHead;
        size++;
    }

    // add the item to the back
    public void addLast(Item item) {
        if (item == null) {
            throw new IllegalArgumentException();
        }

        Node newTail = new Node(item);

        if (tail != null) {
            tail.next = newTail;
            newTail.prev = tail;

            if (tail.prev == null && head == null) {
                head = tail;
            }
        }

        tail = newTail;
        size++;
    }

    // remove and return the item from the front
    public Item removeFirst() {
        if (isEmpty()) {
            throw new NoSuchElementException();
        }

        Node n;

        if (head == null) {
            n = tail;
            tail = null;
        } else {
            n = head;
            head = head.next;
            if (head != null) {
                head.prev = null;
            }
        }

        size--;

        if (isEmpty()) {
            head = null;
            tail = null;
        }

        return n.item;
    }

    // remove and return the item from the back
    public Item removeLast() {
        if (isEmpty()) {
            throw new NoSuchElementException();
        }

        Node n;

        if (tail == null) {
            n = head;
            head = null;
        } else {
            n = tail;
            tail = tail.prev;
            if (tail != null) {
                tail.next = null;
            }
        }

        size--;

        if (isEmpty()) {
            head = null;
            tail = null;
        }

        return n.item;
    }

    // return an iterator over items in order from front to back
    public Iterator<Item> iterator() {
        return new ListIterator();
    }

    // unit testing (required)
    public static void main(String[] args) {
        Deque<Integer> deque = new Deque<>();
        System.out.printf("It should be empty: %s with size: %d\n", deque.isEmpty(), deque.size());
        for (Integer i : deque) {
            System.out.println(i);
        }

        deque.addFirst(-2);
        System.out.println("After adding -2 to the start: ");
        for (Integer i : deque) {
            System.out.println(i);
        }

        deque.addFirst(-1);
        System.out.println("After adding -1 to the start: ");
        for (Integer i : deque) {
            System.out.println(i);
        }

        deque.addLast(-3);
        System.out.println("After adding -3 to the end: ");
        for (Integer i : deque) {
            System.out.println(i);
        }

        Integer integer = deque.removeLast();
        System.out.printf("After removing %d from the end\n", integer);
        for (Integer i : deque) {
            System.out.println(i);
        }

        integer = deque.removeFirst();
        System.out.printf("After removing %d from the start\n", integer);
        for (Integer i : deque) {
            System.out.println(i);
        }

        integer = deque.removeLast();
        System.out.printf("It should be empty after removing %d: %s\n", integer, deque.isEmpty());
        for (Integer i : deque) {
            System.out.println(i);
        }

        deque.addLast(2);
        System.out.println("After adding 2 to end: ");
        for (Integer i : deque) {
            System.out.println(i);
        }

        deque.addLast(3);
        System.out.println("After adding 3 to end: ");
        for (Integer i : deque) {
            System.out.println(i);
        }

        deque.addFirst(1);
        System.out.println("After adding 1 to start: ");
        for (Integer i : deque) {
            System.out.println(i);
        }

        integer = deque.removeFirst();
        System.out.printf("After removing %d from the start\n", integer);
        for (Integer i : deque) {
            System.out.println(i);
        }

        integer = deque.removeLast();
        System.out.printf("After removing %d from the end\n", integer);
        for (Integer i : deque) {
            System.out.println(i);
        }

        integer = deque.removeFirst();
        System.out.printf("It should be empty after removing %d: %s\n", integer, deque.isEmpty());
        for (Integer i : deque) {
            System.out.println(i);
        }

        System.out.println("After adding 0 to 3 to first:");
        for (int i = 3; i >= 0; i--) {
            deque.addFirst(i);
        }
        for (Integer i : deque) {
            System.out.println(i);
        }

        System.out.println("After adding 4 to 7 to end:");
        for (int i = 4; i < 8; i++) {
            deque.addLast(i);
        }
        for (Integer i : deque) {
            System.out.println(i);
        }

        while (!deque.isEmpty()) {
            if (deque.size() % 2 == 0) {
                deque.removeLast();
            } else {
                deque.removeFirst();
            }
        }
        System.out.printf("It should be empty after removing all elements: %s\n", deque.isEmpty());

        try {
            deque.removeFirst();
        } catch (NoSuchElementException e) {
            System.out.println("It should catch the NoSuchElementException exception on removeFirst");
        }

        try {
            deque.removeLast();
        } catch (NoSuchElementException e) {
            System.out.println("It should catch the NoSuchElementException exception on removeLast");
        }

        try {
            deque.addFirst(null);
        } catch (IllegalArgumentException e) {
            System.out.println("It should catch the IllegalArgumentException exception on addFirst");
        }

        try {
            deque.addLast(null);
        } catch (IllegalArgumentException e) {
            System.out.println("It should catch the IllegalArgumentException exception on addLast");
        }

        try {
            Iterator<Integer> iterator = deque.iterator();
            iterator.remove();
        } catch (UnsupportedOperationException e) {
            System.out.println(
                    "It should catch the UnsupportedOperationException exception on remove operation on iterator");
        }

        System.out.println("Tests Passed :)");
    }

}
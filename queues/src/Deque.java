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

        @Override
        public boolean hasNext() {
            // TODO Auto-generated method stub
            return false;
        }

        @Override
        public Item next() {
            // TODO Auto-generated method stub
            return null;
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
        }

        size--;

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
        }

        size--;

        return n.item;
    }

    // return an iterator over items in order from front to back
    public Iterator<Item> iterator() {
        return new ListIterator();
    }

    // unit testing (required)
    public static void main(String[] args) {
        System.out.println("it compiles!");
    }

}
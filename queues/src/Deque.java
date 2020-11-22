import java.util.Iterator;

public class Deque<Item> implements Iterable<Item> {
    private Node<Item> head;
    private Node<Item> tail;
    private int size;

    private class Node<Item> {
        private Item item;
        private Node<Item> next;

        private Node(Item i) {
            this.item = i;
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
    }

    // add the item to the back
    public void addLast(Item item) {
    }

    // remove and return the item from the front
    public Item removeFirst() {
    }

    // remove and return the item from the back
    public Item removeLast() {
    }

    // return an iterator over items in order from front to back
    public Iterator<Item> iterator() {
    }

    // unit testing (required)
    public static void main(String[] args) {
    }

}
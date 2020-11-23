import java.util.Iterator;

import edu.princeton.cs.algs4.StdRandom;

public class RandomizedQueue<Item> implements Iterable<Item> {
    private Item[] q;
    private int size;
    private int head;
    private int tail;

    private class ListIterator implements Iterator<Item> {
        private int i = head;
        private int count = 0;

        @Override
        public boolean hasNext() {
            return count < size;
        }

        @Override
        public Item next() {
            Item item = q[i];
            i = (i + 1) % q.length;
            count++;
            return item;
        }
    }

    // construct an empty randomized queue
    public RandomizedQueue() {
        q = (Item[]) new Object[1];
        size = 0;
        head = 0;
        tail = 0;
    }

    private void resize(int capacity) {
        Item[] copy = (Item[]) new Object[capacity];

        int i = 0;
        while (head != tail) {
            copy[i++] = q[head];
            head = (head + 1) % q.length;
        }
        q = copy;
    }

    // is the randomized queue empty?
    public boolean isEmpty() {
        return size == 0;
    }

    // return the number of items on the randomized queue
    public int size() {
        return size;
    }

    // add the item
    public void enqueue(Item item) {
        if (size() == q.length)
            resize(2 * q.length);
        q[tail] = item;
        tail = (tail + 1) % q.length;
        size++;
    }

    // remove and return a random item
    public Item dequeue() {
        Item i = q[head];
        q[head] = null;
        head = (head + 1) % q.length;
        size--;
        if (size() > 0 && size() == q.length / 4)
            resize(q.length / 2);
        return i;
    }

    // return a random item (but do not remove it) {}
    public Item sample() {
        while (true) {
            int i = StdRandom.uniform(head, tail > head ? tail : tail + q.length + 1) % q.length;
            if (q[i] != null) {
                return q[i];
            }
        }
    }

    // return an independent iterator over items in random order
    public Iterator<Item> iterator() {
        return new ListIterator();
    }

    // unit testing (required) {}
    public static void main(String[] args) {
    }

}

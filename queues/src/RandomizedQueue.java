import java.util.Iterator;

import edu.princeton.cs.algs4.StdDraw;
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
        tail = -1;
    }

    private void resize(int capacity) {
        Item[] copy = (Item[]) new Object[capacity];

        int i = 0;
        int j = head;
        int count = 0;
        while (count < size()) {
            copy[i++] = q[j];
            j = (j + 1) % q.length;
            count++;
        }

        head = 0;
        tail = i - 1;
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
        tail = (tail + 1) % q.length;
        q[tail] = item;
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
            int i = StdRandom.uniform(head, (tail > head ? tail : tail + q.length) + 1) % q.length;
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
        RandomizedQueue<Character> q = new RandomizedQueue<>();
        Iterator<Character> iterator = q.iterator();
        int size = q.size();

        System.out.printf("Should be empty: %s (hasNext: %s)\n", q.isEmpty(), iterator.hasNext());

        q.enqueue('a');
        iterator = q.iterator();
        System.out.printf("Should have only 'a': %s (hasNext: %s)\n", iterator.next(), iterator.hasNext());

        q.enqueue('b');
        iterator = q.iterator();
        System.out.printf("Should have only 'a' & 'b': %s (hasNext: %s) %s (hasNext: %s)\n", iterator.next(),
                iterator.hasNext(), iterator.next(), iterator.hasNext());

        Character c = q.dequeue();
        iterator = q.iterator();
        System.out.printf("Should have removed 'a': %s (hasNext: %s)\n", c, iterator.hasNext());
        System.out.printf("Should have only 'b': %s (hasNext: %s)\n", iterator.next(), iterator.hasNext());

        c = q.dequeue();
        iterator = q.iterator();
        System.out.println("Should have removed 'b': " + c);
        System.out.printf("Should be empty: %s (hasNext: %s)\n", q.isEmpty(), iterator.hasNext());

        q.enqueue('a');
        q.enqueue('b');
        q.enqueue('c');
        System.out.println("Should have 'a', 'b', 'c':");
        for (Character character : q) {
            System.out.println(character);
        }

        size = q.size();
        System.out.println("Should randomly take a sample:");
        for (int i = 0; i < size * 2; i++) {
            System.out.println(q.sample());
        }

        System.out.println("Should still have 'a', 'b', 'c':");
        for (Character character : q) {
            System.out.println(character);
        }

        size = q.size();
        System.out.println("Should remove 'a', 'b', 'c':");
        for (int i = 0; i < size; i++) {
            System.out.println(q.dequeue());
        }
        iterator = q.iterator();
        System.out.printf("Should be empty: %s (hasNext: %s)\n", q.isEmpty(), iterator.hasNext());

        for (int i = 0; i < 100; i++) {
            if (!q.isEmpty()) {
                if (q.sample() == null) {
                    throw new Error();
                }
                if (StdRandom.bernoulli()) {
                    Character character = q.dequeue();
                    q.enqueue(character);
                }
            }
            q.enqueue(Character.toChars(i + 'a')[0]);
        }
        System.out.println("Should have size 100 after random enqueue/dequeue: " + q.size());
    }

}

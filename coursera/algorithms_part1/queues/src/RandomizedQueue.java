import java.util.Iterator;
import java.util.NoSuchElementException;

import edu.princeton.cs.algs4.StdRandom;

public class RandomizedQueue<Item> implements Iterable<Item> {
    private Item[] q;
    private int size;
    private int head;
    private int tail;

    private class ListIterator implements Iterator<Item> {
        private final Item[] list;
        private int index = 0;

        public ListIterator() {
            list = (Item[]) new Object[size];
            for (int i = 0, j = 0; i < q.length; i++) {
                if (q[i] != null) {
                    list[j++] = q[i];
                }
            }
            StdRandom.shuffle(list);
        }

        @Override
        public boolean hasNext() {
            return index < list.length;
        }

        @Override
        public Item next() {
            if (!hasNext()) {
                throw new NoSuchElementException();
            }
            return list[index++];
        }

        @Override
        public void remove() {
            throw new UnsupportedOperationException();
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
        int j = head;
        int count = 0;
        while (count < size) {
            if (q[j] != null) {
                copy[i++] = q[j];
                count++;
            }
            j = (j + 1) % q.length;
        }

        head = 0;
        tail = i;
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
        if (item == null) {
            throw new IllegalArgumentException();
        }
        if (size == q.length)
            resize(2 * q.length);
        q[tail] = item;
        size++;
        int count = 0;
        do {
            count++;
            tail = (tail + 1) % q.length;
        } while (q[tail] != null && count < q.length);
        if (count >= q.length) {
            tail = count;
        }
    }

    // remove and return a random item
    public Item dequeue() {
        Item item = null;

        if (size == 0) {
            throw new NoSuchElementException();
        } else if (size == 1) {
            item = q[head];
            q[head] = null;
            head = 0;
            tail = 0;
        } else {
            int i = -1;
            while (item == null) {
                i = StdRandom.uniform(head, (tail > head ? tail : (tail + q.length))) % q.length;
                item = q[i];
            }
            q[i] = null;
            if (i == head) {
                do {
                    i = (i + 1) % q.length;
                } while (q[i] == null);
                head = i;
            }
        }

        size--;

        if (size > 0 && size == q.length / 4)
            resize(q.length / 2);

        if (tail == q.length && size < q.length) {
            tail = 0;
            while (q[tail] != null) {
                tail = (tail + 1) % q.length;
            }
        }

        return item;
    }

    // return a random item (but do not remove it) {}
    public Item sample() {
        if (size == 0) {
            throw new NoSuchElementException();
        }
        while (true) {
            int i = StdRandom.uniform(head, (tail > head ? tail : tail + q.length)) % q.length;
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
        System.out.printf("Should have removed 'a' or 'b': %s (hasNext: %s)\n", c, iterator.hasNext());
        System.out.printf("Should have either 'a' or 'b': %s (hasNext: %s)\n", iterator.next(), iterator.hasNext());

        c = q.dequeue();
        iterator = q.iterator();
        System.out.println("Should have removed 'a' or 'b': " + c);
        System.out.printf("Should be empty: %s (hasNext: %s)\n", q.isEmpty(), iterator.hasNext());

        for (int i = 0; i < 5; i++) {
            q.enqueue(Character.toChars(i + 'a')[0]);
        }
        System.out.println("Should have 'a', 'b', 'c', 'd', 'e':");
        for (Character character : q) {
            System.out.println(character);
        }

        size = q.size();
        System.out.println("Should randomly take a sample:");
        for (int i = 0; i < size * 2; i++) {
            System.out.println(q.sample());
        }

        System.out.println("Should still have 'a', 'b', 'c', 'd', 'e':");
        for (Character character : q) {
            System.out.println(character);
        }

        size = q.size();
        System.out.println("Should randomly remove 'a', 'b', 'c', 'd', 'e':");
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

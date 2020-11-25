import edu.princeton.cs.algs4.StdIn;

public class Permutation {
    public static void main(String[] args) {
        int k = Integer.parseInt(args[0]);
        RandomizedQueue<String> q = new RandomizedQueue<>();
        while (k > 0) {
            String s = StdIn.readString();
            q.enqueue(s);
            k--;
        }

        while (!q.isEmpty()) {
            System.out.println(q.dequeue());
        }
    }
}
import edu.princeton.cs.algs4.WeightedQuickUnionUF;

public class Percolation {
    private static final byte FILLED_BOTTOM = 1; // 001
    private static final byte OPEN = 1 << 1; // 010
    private static final byte FILLED = 1 << 2; // 100
    private static final byte CONNECTED = FILLED_BOTTOM | OPEN | FILLED; // 111

    private final WeightedQuickUnionUF uf;
    private final byte[] grid;
    private final int n;
    private int numberOfOpenSites;
    private boolean percolates = false;

    public Percolation(int n) {
        if (n <= 0) {
            throw new IllegalArgumentException();
        }

        this.uf = new WeightedQuickUnionUF(n * n);
        this.grid = new byte[n * n];
        this.n = n;
    }

    private void checkBounds(int row, int col) {
        if ((row < 1 || row > n) || (col < 1 || col > n)) {
            throw new IllegalArgumentException();
        }
    }

    private byte getRootFlag(int pos) {
        int root = this.uf.find(pos);

        return this.grid[root];
    }

    private int mapCoords(int row, int col) {
        return (row - 1) * n + (col - 1);
    }

    public void open(int row, int col) {
        this.checkBounds(row, col);

        if (!isOpen(row, col)) {
            byte flag = OPEN;
            int pos = mapCoords(row, col);
            this.numberOfOpenSites++;

            // handle invisible top and bottom root element
            if (row == 1) {
                flag |= FILLED;
            }
            if (row == n) {
                flag |= FILLED_BOTTOM;
            }

            // connect to left
            if (col > 1 && isOpen(row, col - 1)) {
                flag |= this.getRootFlag(pos - 1);
                this.uf.union(pos, pos - 1);
            }
            // connect to right
            if (col < n && isOpen(row, col + 1)) {
                flag |= this.getRootFlag(pos + 1);
                this.uf.union(pos, pos + 1);
            }
            // connect to above
            if (row > 1 && isOpen(row - 1, col)) {
                flag |= this.getRootFlag(pos - n);
                this.uf.union(pos, pos - n);
            }
            // connect to below
            if (row < n && isOpen(row + 1, col)) {
                flag |= this.getRootFlag(pos + n);
                this.uf.union(pos, pos + n);
            }

            int root = this.uf.find(pos);
            flag |= this.getRootFlag(root);
            this.grid[pos] = flag;
            if (root < this.grid.length) {
                this.grid[root] = flag;
            }

            if ((flag & CONNECTED) == CONNECTED) {
                this.percolates = true;
            }
        }
    }

    public boolean isOpen(int row, int col) {
        this.checkBounds(row, col);

        int pos = mapCoords(row, col);

        return this.grid[pos] > 0;
    }

    public boolean isFull(int row, int col) {
        this.checkBounds(row, col);

        int pos = mapCoords(row, col);

        return (this.grid[pos] & FILLED) == FILLED || (this.getRootFlag(pos) & FILLED) == FILLED;
    }

    public int numberOfOpenSites() {
        return numberOfOpenSites;
    }

    public boolean percolates() {
        return this.percolates;
    }

    public static void main(String[] args) {
        Percolation p = new Percolation(3);
        p.open(3, 3);
        p.open(1, 3);
        p.open(1, 2);
        p.open(2, 2);
        p.open(2, 3);
        p.open(3, 1);
        p.open(1, 1);
        System.out.println(p.percolates());
        System.out.println(p.isFull(1, 1));
    }
}

import java.util.Comparator;

import edu.princeton.cs.algs4.StdDraw;

public class Point {
    private final int x;
    private final int y;

    public Point(int x, int y) // constructs the point (x, y)
    {
        this.x = x;
        this.y = y;
    }

    public void draw() // draws this point
    {
        StdDraw.setPenRadius(0.05);
        StdDraw.setPenColor(StdDraw.MAGENTA);
        StdDraw.point(x, y);
    }

    public void drawTo(Point that) // draws the line segment from this point to that point
    {
        StdDraw.setPenRadius(0.02);
        StdDraw.setPenColor(StdDraw.BOOK_BLUE);
        StdDraw.line(x, y, that.x, that.y);
    }

    public String toString() // string representation
    {
        return "(" + x + "," + y + ")";
    }

    public int compareTo(Point that) // compare two points by y-coordinates, breaking ties by x-coordinates
    {
        if (y < that.y) {
            return -1;
        }
        if (y > that.y) {
            return 1;
        }
        if (x < that.x) {
            return -1;
        }
        if (x > that.x) {
            return 1;
        }
        return 0;
    }

    public double slopeTo(Point that) // the slope between this point and that point
    {
        double rise = that.y - y;
        double run = that.x - x;

        if (rise == 0 && run == 0) {
            return Double.NEGATIVE_INFINITY;
        }
        if (run == 0) {
            return Double.POSITIVE_INFINITY;
        }
        if (rise == 0) {
            return 0;
        }
        return rise / run;
    }

    public Comparator<Point> slopeOrder() // compare two points by slopes they make with this point
    {
        return new PointOrder();
    }

    private class PointOrder implements Comparator<Point> {
        public int compare(Point p1, Point p2) {
            double slope1 = slopeTo(p1);
            double slope2 = slopeTo(p2);

            if (slope1 < slope2)
                return -1;
            else if (slope1 > slope2)
                return 1;
            else
                return 0;
        }
    }

}

public class LineSegment {
    private Point start;
    private Point end;

    public LineSegment(Point p, Point q) // constructs the line segment between points p and q
    {
        start = p;
        end = q;
    }

    public void draw() // draws this line segment
    {
        start.drawTo(end);
    }

    public String toString() // string representation
    {
        return "[" + start.toString() + "," + end.toString() + "]";
    }

}

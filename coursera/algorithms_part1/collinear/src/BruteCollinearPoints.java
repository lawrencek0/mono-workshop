import java.util.Comparator;

public class BruteCollinearPoints {
    private final LineSegment[] segments;

    private static Point getSmallest(Point[] points) {
        Point smallestPoint = points[0];

        for (Point point : points) {
            if (point.compareTo(smallestPoint) < 0) {
                smallestPoint = point;
            }
        }

        return smallestPoint;
    }

    private static Point getlargest(Point[] points) {
        Point largestPoint = points[0];

        for (Point point : points) {
            if (point.compareTo(largestPoint) > 0) {
                largestPoint = point;
            }
        }

        return largestPoint;
    }

    public BruteCollinearPoints(Point[] points) // finds all line segments containing 4 points
    {
        if (points == null) {
            throw new IllegalArgumentException();
        }

        for (int i = 0; i < points.length; i++) {
            if (points[i] == null) {
                throw new IllegalArgumentException();
            }
        }

        int numberOfSegments = 0;
        LineSegment[] temp = new LineSegment[points.length];

        for (int i = 0; i < points.length; i++) {
            Point p1 = points[i];
            Comparator<Point> order = p1.slopeOrder();

            for (int j = i + 1; j < points.length; j++) {
                Point p2 = points[j];
                for (int k = j + 1; k < points.length; k++) {
                    Point p3 = points[k];
                    if (order.compare(p2, p3) == 0) {
                        for (int l = k + 1; l < points.length; l++) {
                            Point p4 = points[l];
                            if (order.compare(p3, p4) == 0) {
                                Point[] arr = { p1, p2, p3, p4 };
                                Point start = getSmallest(arr);
                                Point end = getlargest(arr);
                                temp[numberOfSegments++] = new LineSegment(start, end);
                            }
                        }
                    }
                }
            }
        }

        this.segments = new LineSegment[numberOfSegments];
        for (int i = 0; i < numberOfSegments; i++) {
            segments[i] = temp[i];
        }
    }

    public int numberOfSegments() // the number of line segments
    {
        return this.segments.length;
    }

    public LineSegment[] segments() // the line segments
    {
        return this.segments;
    }
}

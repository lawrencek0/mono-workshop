import java.util.Arrays;
import java.util.Comparator;

public class FastCollinearPoints {
    private final LineSegment[] segments;

    private static boolean fuzzyEquals(double d1, double d2) {
        double epsilon = Math.pow(10, -12);
        return Math.abs(d1 - d2) < epsilon;
    }

    private static Point getSmallest(Point[] points, int count) {
        Point smallestPoint = points[0];

        for (int i = 1; i < count; i++) {
            Point point = points[i];
            if (point.compareTo(smallestPoint) < 0) {
                smallestPoint = point;
            }
        }

        return smallestPoint;
    }

    private static Point getlargest(Point[] points, int count) {
        Point largestPoint = points[0];

        for (int i = 1; i < count; i++) {
            Point point = points[i];
            if (point.compareTo(largestPoint) > 0) {
                largestPoint = point;
            }
        }

        return largestPoint;
    }

    public FastCollinearPoints(Point[] points) // finds all line segments containing 4 or more points
    {
        if (points == null) {
            throw new IllegalArgumentException();
        }

        Point[] aux = new Point[points.length];

        for (int i = 0; i < points.length; i++) {
            if (points[i] == null) {
                throw new IllegalArgumentException();
            }
            aux[i] = points[i];
        }

        LineSegment[] segments = new LineSegment[points.length];
        int numOfSegments = 0;
        for (int i = 0; i < points.length; i++) {
            Point point = points[i];
            Comparator<Point> comp = point.slopeOrder();
            Arrays.sort(aux, comp);
            double slope = point.compareTo(point);
            Point[] segment = new Point[points.length];
            segment[0] = point;
            int segmentCount = 1;
            for (int j = 1; j < aux.length; j++) {
                double newSlope = point.slopeTo(aux[j]);
                if (!fuzzyEquals(slope, newSlope)) {
                    if (segmentCount >= 4) {
                        Point start = getSmallest(segment, segmentCount);
                        Point end = getlargest(segment, segmentCount);
                        segments[numOfSegments++] = new LineSegment(start, end);
                    }
                    slope = newSlope;
                    segmentCount = 1;
                }
                segment[segmentCount++] = aux[j];

            }
            if (segmentCount >= 4) {
                Point start = getSmallest(segment, segmentCount);
                Point end = getlargest(segment, segmentCount);
                segments[numOfSegments++] = new LineSegment(start, end);
            }
        }

        if (numOfSegments == 0) {
            this.segments = new LineSegment[0];
        } else {

            int uniqueSegments = 1;
            System.out.println(numOfSegments);
            if (numOfSegments > 1) {
                int i = 1;
                while (i < numOfSegments) {
                    LineSegment prev = segments[i - 1];
                    LineSegment curr = segments[i];
                    if (prev.start.compareTo(curr.start) != 0 || prev.end.compareTo(curr.end) != 0) {
                        segments[uniqueSegments++] = curr;
                    }
                    i++;
                }
            }
            this.segments = new LineSegment[uniqueSegments];
            for (int k = 0; k < uniqueSegments; k++) {
                this.segments[k] = segments[k];
            }
        }

    }

    public int numberOfSegments() // the number of line segments
    {
        return segments.length;
    }

    public LineSegment[] segments() // the line segments
    {
        return segments;
    }
}

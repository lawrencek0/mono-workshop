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
                        Arrays.sort(segment, 0, segmentCount);
                        Point start = segment[0];
                        if (start == point) {
                            Point end = segment[segmentCount - 1];
                            segments[numOfSegments++] = new LineSegment(start, end);
                        }
                    }
                    slope = newSlope;
                    segmentCount = 1;
                }
                segment[segmentCount++] = aux[j];

            }
            if (segmentCount >= 4) {
                Point start = getSmallest(segment, segmentCount);
                if (start == point) {
                    Point end = getlargest(segment, segmentCount);
                    segments[numOfSegments++] = new LineSegment(start, end);
                }
            }
        }

        this.segments = new LineSegment[numOfSegments];
        for (int i = 0; i < numOfSegments; i++) {
            this.segments[i] = segments[i];
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

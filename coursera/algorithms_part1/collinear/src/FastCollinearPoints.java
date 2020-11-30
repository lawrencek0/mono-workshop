import java.util.Arrays;
import java.util.LinkedList;

public class FastCollinearPoints {
    private final LineSegment[] segments;

    public FastCollinearPoints(Point[] points) // finds all line segments containing 4 or more points
    {
        checkNulls(points);

        Point[] aux = points.clone();
        Arrays.sort(aux);

        checkDuplicates(aux);

        LinkedList<LineSegment> segments = new LinkedList<>();

        for (int i = 0; i < aux.length; i++) {
            Point point = aux[i];
            Point[] bySlope = aux.clone();
            // sort points relative to point
            Arrays.sort(bySlope, point.slopeOrder());

            int k = 1;
            while (k < aux.length) {
                LinkedList<Point> segment = new LinkedList<>();

                double slope = point.slopeTo(bySlope[k]);
                do {
                    segment.add(bySlope[k++]);
                } while (k < bySlope.length && point.slopeTo(bySlope[k]) == slope);

                // only draw if the given point is the start of the line segment
                if (segment.size() >= 3 && point.compareTo(segment.peek()) < 0) {
                    Point start = point;
                    Point end = segment.removeLast();

                    // add the line segment with the start and end points
                    segments.add(new LineSegment(start, end));
                }
            }
        }

        this.segments = segments.toArray(new LineSegment[0]);
    }

    public int numberOfSegments() // the number of line segments
    {
        return segments.length;
    }

    public LineSegment[] segments() // the line segments
    {
        LineSegment[] copy = new LineSegment[segments.length];

        for (int i = 0; i < segments.length; i++) {
            copy[i] = segments[i];
        }
        return copy;
    }

    private static void checkNulls(Point[] points) {
        if (points == null) {
            throw new IllegalArgumentException();
        }

        for (int i = 0; i < points.length; i++) {
            if (points[i] == null) {
                throw new IllegalArgumentException();
            }
        }
    }

    private static void checkDuplicates(Point[] points) {
        for (int i = 1; i < points.length; i++) {
            if (points[i].compareTo(points[i - 1]) == 0) {
                throw new IllegalArgumentException();
            }
        }
    }
}

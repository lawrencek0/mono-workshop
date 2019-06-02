package com.lawrencek0.lsclone;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Uses the args passed in to generate directory contents
 */
public class Run {
    /**
     * Gets all the entries in the given path
     *
     * @param path The path to get the entries from
     * @return The list of all entries in the given path
     * @throws IOException
     */
    public static List<String> executeArgs(Path path) throws IOException {
        try (Stream<Path> paths = Files.list(path)) {
            return paths.map(p -> p.getFileName().toString()).collect(Collectors.toList());
        }
    }
}

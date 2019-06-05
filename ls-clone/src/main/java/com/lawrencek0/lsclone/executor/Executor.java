package com.lawrencek0.lsclone.executor;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.AbstractMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Uses the args passed in to generate directory contents
 */
public class Executor {
    private boolean all;
    private boolean almostAll;

    private Executor(ExecutorBuilder builder) {
        this.all = builder.all;
        this.almostAll = builder.almostAll;
    }

    /**
     * Executes the passed in arguments
     *
     * @return The list of all entries in the given paths
     */
    public Map<String, Set<String>> executeArgs(List<Path> paths) {
        return paths.stream().map(p -> new AbstractMap.SimpleEntry<>(p.toString(), fetchEntries(p)))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    /**
     * Gets all the entries in the given path
     *
     * @param path The paths to get the entries from
     * @return The list of all entries in the given paths
     */
    private Set<String> fetchEntries(Path path) {
        try (Stream<Path> paths = Files.list(path)) {
            return paths.map(p -> p.getFileName().toString()).collect(Collectors.toSet());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return Set.of(path.toString());
    }

    public static class ExecutorBuilder {
        private boolean all;
        private boolean almostAll;

        public ExecutorBuilder setAll(boolean all) {
            this.all = all;
            return this;
        }

        public ExecutorBuilder setAlmostAll(boolean almostAll) {
            this.almostAll = almostAll;
            return this;
        }

        public Executor build() {
            return new Executor(this);
        }
    }
}

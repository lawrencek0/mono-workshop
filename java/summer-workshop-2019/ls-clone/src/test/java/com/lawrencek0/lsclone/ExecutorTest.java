package com.lawrencek0.lsclone;

import com.lawrencek0.lsclone.executor.Executor;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ExecutorTest {

    /**
     * Creates a hidden file only in *nix systems
     *
     * @param dir the Temporary directory to store the hidden file
     * @throws IOException
     */
    private void createHiddenFile(Path dir) throws IOException {
        Path file = dir.resolve(".hidden");
        Files.write(file, "Hidden".getBytes());
        assertTrue(Files.isHidden(file));
    }

    @Test
    @DisplayName("Single Path with defaults")
    void testSinglePath(@TempDir Path tempDir) throws IOException {
        Path file = tempDir.resolve("test.txt");
        Files.write(file, "Test".getBytes());
        createHiddenFile(tempDir);
        Executor executor = new Executor.ExecutorBuilder().build();
        Map<String, Set<String>> entries = executor.executeArgs(List.of(tempDir));
        assertTrue(entries.containsKey(tempDir.toString()) && entries.containsValue(Set.of("test.txt")));
    }

    @Test
    @DisplayName("Multiple Paths with defaults")
    void testMultiplePaths(@TempDir Path tempDir) throws IOException {
        assertTrue(Files.isDirectory(tempDir));
        Path childTempDir = Files.createTempDirectory(tempDir, null);
        assertTrue(Files.isDirectory(childTempDir));
        Path file1 = tempDir.resolve("test1.txt");
        Path file2 = childTempDir.resolve("test2.txt");
        Files.write(file1, "Test".getBytes());
        Files.write(file2, "Test".getBytes());
        createHiddenFile(tempDir);
        Executor executor = new Executor.ExecutorBuilder().build();
        Map<String, Set<String>> entries = executor.executeArgs(List.of(tempDir, childTempDir));
        assertAll(() -> {
            assertTrue(Set.of(tempDir.toString(), childTempDir.toString()).stream().allMatch(entries::containsKey));
            assertTrue(Set.of(Set.of("test1.txt", childTempDir.getFileName().toString()),
                    Set.of("test2.txt")).stream().allMatch(entries::containsValue));
        });
    }
}
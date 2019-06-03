package com.lawrencek0.lsclone;

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

class RunTest {
    @Test
    @DisplayName("Test with single Path")
    void testSinglePath(@TempDir Path tempDir) throws IOException {
        Path file = tempDir.resolve("test.txt");
        Files.write(file, "Test".getBytes());
        Map<String, Set<String>> entries = Run.executeArgs(List.of(tempDir));
        assertTrue(entries.containsKey(tempDir.toString()) && entries.containsValue(Set.of("test.txt")));
    }

    @Test
    @DisplayName("Test with multiple Paths")
    void testMultiplePaths(@TempDir Path tempDir) throws IOException {
        assertTrue(Files.isDirectory(tempDir));
        Path childTempDir = Files.createTempDirectory(tempDir, null);
        assertTrue(Files.isDirectory(childTempDir));
        Path file1 = tempDir.resolve("test1.txt");
        Path file2 = childTempDir.resolve("test2.txt");
        Files.write(file1, "Test".getBytes());
        Files.write(file2, "Test".getBytes());
        Map<String, Set<String>> entries = Run.executeArgs(List.of(tempDir, childTempDir));
        assertAll(() -> {
            assertTrue(Set.of(tempDir.toString(), childTempDir.toString()).stream().allMatch(entries::containsKey));
            assertTrue(Set.of(Set.of("test1.txt", childTempDir.getFileName().toString()),
                    Set.of("test2.txt")).stream().allMatch(entries::containsValue));
        });
    }
}
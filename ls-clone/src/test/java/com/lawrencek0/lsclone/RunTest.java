package com.lawrencek0.lsclone;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertTrue;

class RunTest {
    @Test
    @DisplayName("Test with single Path")
    void testSinglePath(@TempDir Path tempDir) throws IOException {
        Path file = tempDir.resolve("test.txt");
        Files.write(file, "Test".getBytes());
        assertTrue(Run.executeArgs(tempDir).contains("test.txt"));
    }
}
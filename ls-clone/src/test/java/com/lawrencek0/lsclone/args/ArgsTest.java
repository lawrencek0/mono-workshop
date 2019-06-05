package com.lawrencek0.lsclone.args;

import com.beust.jcommander.JCommander;
import com.beust.jcommander.ParameterException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ArgsTest {
    @Test
    void testDefaultParameters() {
        Args args = new Args();
        JCommander.newBuilder().addObject(args).build().parse();
        assertEquals(args.paths, List.of(Paths.get(".").toAbsolutePath()));
    }

    @Test
    @DisplayName("Tests when single Path is passed in")
    void testSinglePaths(@TempDir Path tempDir) {
        assertTrue(Files.isDirectory(tempDir));
        Args args = new Args();
        JCommander.newBuilder().addObject(args).build().parse(tempDir.toString());
        assertEquals(args.paths, List.of(tempDir));
    }

    @Test
    @DisplayName("Tests when multiple Paths are passed in")
    void testMultiplePaths(@TempDir Path tempDir) throws IOException {
        assertTrue(Files.isDirectory(tempDir));
        Path childTempDir = Files.createTempDirectory(tempDir, null);
        assertTrue(Files.isDirectory(childTempDir));
        Args args = new Args();
        JCommander.newBuilder().addObject(args).build().parse(tempDir.toString(), childTempDir.toString());
        assertTrue(args.paths.stream().allMatch(p -> p.equals(tempDir) || p.equals(childTempDir)));
    }

    @Test
    void testDirectoryValidation() {
        Args args = new Args();
        ParameterException exception = Assertions.assertThrows(ParameterException.class, () ->
                JCommander.newBuilder().addObject(args).build().parse("/tmp/___args_test___")
        );

        assertTrue(exception.getMessage().contains("No such file or path"));
    }

}
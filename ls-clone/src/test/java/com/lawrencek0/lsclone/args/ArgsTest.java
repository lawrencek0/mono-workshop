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

class ArgsTest {
    @Test
    void testDefaultParameters() {
        Args args = new Args();
        JCommander.newBuilder().addObject(args).build().parse();
        Assertions.assertEquals(List.of(Paths.get(".")), args.paths);
    }

    @Test
    @DisplayName("Tests when single Path is passed in")
    void testSinglePaths(@TempDir Path tempDir) {
        Assertions.assertTrue(Files.isDirectory(tempDir));
        Args args = new Args();
        JCommander.newBuilder().addObject(args).build().parse(tempDir.toString());
        Assertions.assertTrue(args.paths.contains(tempDir));
    }

    @Test
    @DisplayName("Tests when multiple Paths are passed in")
    void testMultiplePaths(@TempDir Path tempDir) throws IOException {
        Assertions.assertTrue(Files.isDirectory(tempDir));
        Path childTempDir = Files.createTempDirectory(tempDir, null);
        Assertions.assertTrue(Files.isDirectory(childTempDir));
        Args args = new Args();
        JCommander.newBuilder().addObject(args).build().parse(tempDir.toString(), childTempDir.toString());
        Assertions.assertTrue(args.paths.stream().allMatch(p -> p.equals(tempDir) || p.equals(childTempDir)));
    }

    @Test
    void testDirectoryValidation() {
        Args args = new Args();
        ParameterException exception = Assertions.assertThrows(ParameterException.class, () ->
                JCommander.newBuilder().addObject(args).build().parse("/tmp/___args_test___")
        );

        Assertions.assertTrue(exception.getMessage().contains("No such file or paths"));
    }

}
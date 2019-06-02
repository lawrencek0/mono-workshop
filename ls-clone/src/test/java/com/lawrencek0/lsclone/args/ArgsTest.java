package com.lawrencek0.lsclone.args;

import com.beust.jcommander.JCommander;
import com.beust.jcommander.ParameterException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

class ArgsTest {
    @TempDir
    Path tempDir;

    @Test
    void testDefaultParameters() {
        Args args = new Args();
        JCommander.newBuilder().addObject(args).build().parse();
        Assertions.assertEquals(Paths.get("."), args.directory);
    }

    @Test
    void testParameters() {
        Assertions.assertTrue(Files.isDirectory(tempDir));
        Args args = new Args();
        JCommander.newBuilder().addObject(args).build().parse(tempDir.toString());
        Assertions.assertEquals(tempDir, args.directory);
    }

    @Test
    void testDirectoryValidation() {
        Args args = new Args();
        Assertions.assertThrows(ParameterException.class, () -> {
            String[] argv = {"/tmp/___args_test___"};
            JCommander.newBuilder().addObject(args).build().parse(argv);
        });
    }

}
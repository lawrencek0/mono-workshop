package com.lawrencek0.lsclone.args;

import com.beust.jcommander.JCommander;
import com.beust.jcommander.ParameterException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class ArgsTest {
    @Test
    void testParameters() {
        Args args = new Args();
        JCommander.newBuilder().addObject(args).build().parse();
        Assertions.assertEquals(".", args.directory);
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
package com.lawrencek0.lsclone.args;

import com.beust.jcommander.IParameterValidator;
import com.beust.jcommander.ParameterException;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class ValidPath implements IParameterValidator {
    @Override
    public void validate(String name, String value) throws ParameterException {
        Path file = Paths.get(value);
        if (!(Files.isDirectory(file) || Files.isRegularFile(file))) {
            throw new ParameterException("cannot access '" + value + "': No such file or path");
        }
    }
}

package com.lawrencek0.lsclone.args;

import com.beust.jcommander.Parameter;

import java.nio.file.Path;
import java.nio.file.Paths;

class Args {
    @Parameter(description = "Directory", validateWith = ValidPath.class, converter = PathConverter.class)
    Path path = Paths.get(".");
}

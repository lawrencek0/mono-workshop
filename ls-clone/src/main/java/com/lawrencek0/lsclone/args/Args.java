package com.lawrencek0.lsclone.args;

import com.beust.jcommander.Parameter;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Args {
    @Parameter(description = "Directory", validateWith = ValidPath.class, converter = PathConverter.class)
    public List<Path> paths = new ArrayList<>(Collections.singletonList(Paths.get(".")));
}

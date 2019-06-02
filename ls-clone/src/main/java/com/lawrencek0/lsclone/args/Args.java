package com.lawrencek0.lsclone.args;

import com.beust.jcommander.Parameter;

class Args {
    @Parameter(description = "Directory", validateWith = ValidDirectory.class)
    String directory = ".";
}

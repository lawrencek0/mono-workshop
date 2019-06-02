import com.beust.jcommander.JCommander;
import com.beust.jcommander.ParameterException;
import com.lawrencek0.lsclone.Run;
import com.lawrencek0.lsclone.args.Args;

import java.io.IOException;

public class Main {
    public static void main(String... argv) throws IOException {
        Args args = new Args();
        try {
            JCommander.newBuilder().addObject(args).build().parse(argv);
            Run.executeArgs(args.path).forEach(entry -> System.out.print(entry + "  "));
        } catch (ParameterException e) {
            System.out.println(e.getMessage());
        }
    }
}

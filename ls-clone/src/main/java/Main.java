import com.beust.jcommander.JCommander;
import com.beust.jcommander.ParameterException;
import com.lawrencek0.lsclone.args.Args;
import com.lawrencek0.lsclone.executor.Executor;

public class Main {
    public static void main(String... argv) {
        Args args = new Args();
        try {
            JCommander.newBuilder().addObject(args).build().parse(argv);
            Executor.executeArgs(args.paths).forEach((key, value) -> {
                System.out.println(key + ":");
                value.forEach(e -> System.out.print(e + "  "));
                System.out.println();
            });
        } catch (ParameterException e) {
            System.out.println(e.getMessage());
        }
    }
}

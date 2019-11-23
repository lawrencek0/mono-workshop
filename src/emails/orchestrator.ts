import { Service, Inject } from 'typedi';
import { AppointmentEmail } from './appointments';
import { GroupEmail } from './groups';
import { AppointmentControler } from '../api/appointments/controller';
import { GroupController } from '../api/groups/controller';
@Service()
export class EmailOrchestrator {
    @Inject() private readonly appointmentEmailService: AppointmentEmail;
    @Inject() private appointment: AppointmentControler;
    @Inject() private readonly groupEmailService: GroupEmail;
    @Inject() private group: GroupController;
    public registerEvents() {
        this.appointment.onCreate.subscribe((_, args) => this.appointmentEmailService.onCreate(args));
        this.appointment.onDelete.subscribe((_, args) => this.appointmentEmailService.onDelete(args));
        this.group.onCreate.subscribe((_, args) => this.groupEmailService.onCreate(args));
        this.group.onDelete.subscribe((_, args) => this.groupEmailService.onDelete(args));
    }
}

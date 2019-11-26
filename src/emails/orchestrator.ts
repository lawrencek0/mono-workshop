import { Service, Inject } from 'typedi';
import { AppointmentEmail } from './appointments';
import { GroupEmail } from './groups';
import { AppointmentControler } from '../api/appointments/controller';
import { GroupController } from '../api/groups/controller';
import { EventEmail } from './events';
import { EventController } from '../api/events/controller';
@Service()
export class EmailOrchestrator {
    @Inject() private readonly appointmentEmailService: AppointmentEmail;
    @Inject() private appointment: AppointmentControler;
    @Inject() private readonly groupEmailService: GroupEmail;
    @Inject() private group: GroupController;
    @Inject() private readonly eventEmailService: EventEmail;
    @Inject() private event: EventController;
    public registerEvents() {
        this.appointment.onCreate.subscribe((_, args) => this.appointmentEmailService.onCreate(args));
        this.appointment.onDelete.subscribe((_, args) => this.appointmentEmailService.onDelete(args));
        this.group.onCreate.subscribe((_, args) => this.groupEmailService.onCreate(args));
        this.group.onDelete.subscribe((_, args) => this.groupEmailService.onDelete(args));
        this.event.onCreate.subscribe((_, args) => this.eventEmailService.onCreate(args));
        this.event.onDelete.subscribe((_, args) => this.eventEmailService.onDelete(args));
    }
}

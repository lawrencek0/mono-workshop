import { Service, Inject } from 'typedi';
import { AppointmentEmail } from './appointments';
import { AppointmentControler } from '../api/appointments/controller';
@Service()
export class EmailOrchestrator {
    @Inject()
    private readonly appointmentEmailService: AppointmentEmail;
    @Inject()
    private appointment: AppointmentControler;
    public registerEvents() {
        this.appointment.onCreate.subscribe((_, args) => this.appointmentEmailService.onCreate(args));
    }
}

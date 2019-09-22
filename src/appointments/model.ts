class Appointment {
    constructor(public appointId: number, public name: string, public startDateTime: Date, public endDateTime: Date) {}
}

export { Appointment as appointmentModel };

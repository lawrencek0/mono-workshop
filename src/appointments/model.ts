class Appointment {
    constructor(
        public appointId: number,
        public studentId: number,
        public name: string,
        public startDateTime: number,
        public facultyId: number,
        public endDateTime: number,
    ) {}
}

export { Appointment as appointmentModel };

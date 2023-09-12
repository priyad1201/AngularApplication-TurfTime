import { NgxLoggerLevel } from "ngx-logger";

export const environment = {
  production: false,
  logging: {
    level: NgxLoggerLevel.DEBUG,
    serverLogLevel: NgxLoggerLevel.ERROR,
    serverLoggingUrl: 'https://localhost:7092/api/logs'
  },
  apiBaseUrl : 'https://localhost:7092/api/'
}
export const timeSlots = [
  { startTime: '6:00 AM', endTime: '7:00 AM', selected: false, available: true },
  { startTime: '7:00 AM', endTime: '8:00 AM', selected: false, available: true },
  { startTime: '9:00 AM', endTime: '10:00 AM', selected: false, available: true },
  { startTime: '10:00 AM', endTime: '12.00 AM', selected: false, available: true },
  { startTime: '11:00 AM', endTime: '12.00 PM', selected: false, available: true },
  { startTime: '12:00 PM', endTime: '1:00 PM', selected: false, available: true },
  { startTime: '1:00 PM', endTime: '2:00 PM', selected: false, available: true },
  { startTime: '2:00 PM', endTime: '3:00 PM', selected: false, available: true },
  { startTime: '3:00 PM', endTime: '4:00 PM', selected: false, available: true },
  { startTime: '5:00 PM', endTime: '6:00 PM', selected: false, available: true },
  { startTime: '6:00 PM', endTime: '7:00 PM', selected: false, available: true },
  { startTime: '7:00 PM', endTime: '8:00 PM', selected: false, available: true },
  { startTime: '8:00 PM', endTime: '9:00 PM', selected: false, available: true },
  { startTime: '9:00 PM', endTime: '10:00 PM', selected: false, available: true },
  { startTime: '10:00 PM', endTime: '11:00 PM', selected: false, available: true }
];
export const advanceAmount = 300;



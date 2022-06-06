const Check = require("../models/Check");
const Report = require("../models/Report");
const User = require("../models/User");
const cron = require("node-cron");
const axios = require("axios");
const axiosRetry = require("axios-retry");
const { sendOutageMail } = require("./outageMailer");

class CronService {
  static tasks = {};

  async monitoringCheckProcess(check) {
    const client = axios.create({
      baseURL: check.url,
      timeout: check.timeout * 1000,
    });

    axiosRetry(client, { retries: check.threshold });

    const startTime = Date.now();

    client
      .get(check.path)
      .then((res) => {
        let endTime = Date.now();
        let responseTime = (endTime - startTime) / 1000;

        Report.findOne({ checkId: check._id })
          .then((report) => {
            let log = `Timestamp : ${Date(
              Date.now()
            ).toString()} , Success: GET ${res.status} ${responseTime}sec`;

            let uptime = report.uptime + check.interval;

            let historyLog = report.history;

            if (historyLog == null) {
              historyLog = [];
            } else {
              historyLog.push(log);
            }

            Report.findByIdAndUpdate(report._id, {
              status: res.status,
              availability: (uptime / (uptime + report.downtime)) * 100,
              uptime: uptime,
              responseTime: responseTime,
              history: historyLog,
            })
              .then((newReport) => {
                console.log(
                  `Check ID: ${newReport.checkId}, ` +
                    newReport.history[newReport.history.length - 1]
                );
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log("Check Not found");
          });
      })
      .catch(async (error) => {
        let endTime = Date.now();
        let responseTime = (endTime - startTime) / 1000;

        Report.findOne({ checkId: check._id })
          .then((report) => {
            let downtime = report.downtime + check.interval;
            let outages = report.outages + 1;
            let status = 400;

            let log = `Timestamp : ${Date(
              Date.now()
            ).toString()} , Fail: GET ${status} ${responseTime}sec`;

            let historyLog = report.history;
            if (historyLog == null) historyLog = [];
            historyLog.push(log);

            Report.findByIdAndUpdate(report._id, {
              status: status,
              availability: (report.uptime / (report.uptime + downtime)) * 100,
              downtime: downtime,
              outages: outages,
              responseTime: responseTime,
              history: historyLog,
            })
              .then((newReport) => {
                console.log(
                  `Check ID: ${newReport.checkId}, ` +
                    newReport.history[newReport.history.length - 1]
                );

                // Sending Outage Mail
                sendOutageMail(check);
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      });
  }

  async startMonitoringProcess() {
    const checks = await Check.find();

    checks.forEach((check) => {
      CronService.tasks[check._id] = cron.schedule(
        `*/${check.interval} * * * *`,
        () => {
          if (check) this.monitoringCheckProcess(check);
        }
      );
    });
  }

  async addTask(check, ownerEmail) {
    CronService.tasks[check._id] = cron.schedule(
      `*/${check.interval} * * * *`,
      () => {
        if (check) this.monitoringCheckProcess(check);
      }
    );
  }

  async removeTask(checkId) {
    CronService.tasks[checkId].stop();
  }
}

module.exports = new CronService();

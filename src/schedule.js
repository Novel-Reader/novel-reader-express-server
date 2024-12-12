const schedule = require('node-schedule');
const DBHelper = require("./utils/db-helper");
const logger = require("./utils/logger.js");
const { getTags } = require("./utils/get-tags.js");

function startSchedule() {
  // eslint-disable-next-line no-new
  const updateTagsJob = schedule.scheduleJob('0 * * * * *', () => {
    const sql = `SELECT id, name, detail FROM book WHERE tag = '' OR tag IS NULL`;
    DBHelper(sql, (err, results) => {
      if (err) {
        logger.error(err);
        res.status(400).send({ error_massage: err });
        return;
      }
      if (results.length > 0) {
        for (let i = 0; i < results.length; i++) {
          const { id, name, detail } = results[i];
          const tags = getTags(detail);
          logger.info('Update tags for book ' + name + ' to ' + tags);
          const sql = `UPDATE book SET tag = ? WHERE id = ?`;
          DBHelper(sql, (err, results) => {
            if (err) {
              logger.error(err);
              res.status(400).send({ error_massage: err });
              return;
            }
          }, [tags, id]);
        }
      }
    });
  });
  logger.info('Schedule job started');
}

module.exports = startSchedule;
